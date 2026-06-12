import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import {generateRecommendationReason} from '../services/gemini.service.js'

export const createListing = async(req,res,next)=>{

    try {

        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);

    } catch (error) {
        next(error);
    }

}

export const deleteListing = async(req, res, next)=>{

    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,"Listing not found!"));
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'YOu can only delete your own listing.'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("List deleted successfully");
        
    } catch (error) {
        next(error)
    }

}

export const updateListing = async(req,res,next)=>{

    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,"Listing not found!"));
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'YOu can only update your own listing.'));
    }

    try {

        const updatedListing = await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(updatedListing)
        
    } catch (error) {
        next(error)
    }


}
export const getListing = async(req,res,next)=>{

    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404,'List not found!'));
        }
        res.status(200).json(listing);
        
    } catch (error) {
        next(error);
    }

}

export const getListings = async(req,res,next)=>{


    try {

        // const listings = await Listing.find();  // pehle resolve karo
        //     listings.forEach(async (doc) => {
        // const newType = Math.random() > 0.5 ? "rent" : "sale";
        // doc.type = newType;
        // await doc.save();
        // });


        const limit = parseInt(req.query.limit) || 5;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        /**Dono hi case me offer ho yaa naa ho sabhi dikhe */
        if(offer===undefined || offer==='false'){
            offer = {$in: [false,true]}
        }

        let furnished = req.query.furnished
        if(furnished===undefined || furnished==='false'){
            furnished = {$in: [false,true]}
        }

        let parking = req.query.parking
        if(parking===undefined || parking=='false'){
            parking = {$in: [false,true]}
        }

        let type = req.query.type
        if(type===undefined || type==='all'){
            type = {$in: ['sale','rent']}
        }
        const searchterm = req.query.searchterm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';


        const listing = await Listing.find({
            name:{$regex: searchterm, $options:'i'},
            offer,
            furnished,
            parking,
            type,
        }).sort({
            [sort]:order
        }).limit(limit).skip(startIndex);

        return res.status(200).json(listing);

        
    } catch (error) {
        next(error);
    }

}

export const getRecommendations = async (
  req,
  res,
  next
) => {
  try {
    const currentListing = await Listing.findById(
      req.params.id
    );

    const listings = await Listing.find({
      _id: { $ne: currentListing._id },
    });

    const scoredListings = listings
      .map((listing) => {
        let score = 0;

        if (
          currentListing.type === listing.type
        )
          score += 30;

        if (
          currentListing.furnished ===
          listing.furnished
        )
          score += 15;

        if (
          currentListing.parking ===
          listing.parking
        )
          score += 15;

        const bedroomDiff = Math.abs(
          Number(currentListing.bedrooms) -
            Number(listing.bedrooms)
        );

        score += Math.max(
          0,
          20 - bedroomDiff * 5
        );

        const priceDiff = Math.abs(
          currentListing.regularPrice -
            listing.regularPrice
        );

        score += Math.max(
          0,
          20 -
            (priceDiff /
              currentListing.regularPrice) *
              20
        );

        return {
          listing,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    const recommendations = await Promise.all(
      scoredListings.map(async (item) => {
        const aiReason =
          await generateRecommendationReason(
            currentListing,
            item.listing
          );

        return {
          ...item.listing.toObject(),
          recommendationScore: Math.round(
            item.score
          ),
          aiReason,
        };
      })
    );

    res.status(200).json(recommendations);
  } catch (error) {
    next(error);
  }
};


export const getHomeRecommendations = async (
  req,
  res,
  next
) => {
  try {
    const listings = await Listing.find();

    const recommendations = listings
      .map((listing) => {
        let score = 0;

        // Offer bonus
        if (listing.offer) score += 30;

        // Furnished bonus
        if (listing.furnished) score += 20;

        // Parking bonus
        if (listing.parking) score += 15;

        // Sale listings preferred
        if (listing.type === "sale")
          score += 10;

        // Price factor
        if (listing.regularPrice > 500000)
          score += 10;

        // Fresh listings
        const daysOld =
          (Date.now() -
            new Date(
              listing.createdAt
            ).getTime()) /
          (1000 * 60 * 60 * 24);

        score += Math.max(
          0,
          15 - daysOld
        );

        return {
          ...listing.toObject(),
          recommendationScore:
            Math.round(score),
        };
      })
      .sort(
        (a, b) =>
          b.recommendationScore -
          a.recommendationScore
      )
      .slice(0, 4);

    res.status(200).json(
      recommendations
    );
  } catch (error) {
    next(error);
  }
};
