import  { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

// Swiper core and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from 'swiper';
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Search from './Search';
import ListingItem from '../components/ListingItem';
export default function Home() {
  // SwiperCore.use(Navigation)
  const [offerListings, setOfferlisting] = useState([]);
  const [rentListings, setrentlisting] = useState([]);
  const [saleListings, setsalelisting] = useState([]);

  console.log("offerListings = ",offerListings);
  console.log("rentListings = ",rentListings);
  console.log("saleListings = ",saleListings);

useEffect(()=>{

  const getOfferlisting = async ()=>{

    try {
        const res = await fetch("/api/listing/get?offer=true&limit=4&order=desc");
        const data = await res.json();
        setOfferlisting(data);
        getRentListing();
    } catch (error) {
        console.log(error);
    }

      
  }

  const getRentListing = async ()=>{
      try {
           const res = await fetch("/api/listing/get?type=rent&limit=4");
          const data = await res.json();
          setrentlisting(data);
          getSaleListing();
      } catch (error) {
          console.log(error)
      }
     
  }
  const getSaleListing = async ()=>{
    try {
      const res = await fetch("/api/listing/get?type=sale&limit=4");
      const data = await res.json();
      setsalelisting(data);
    } catch (error) {
        console.log(error);
    }

      
  }


  getOfferlisting();

},[]);

  return (
    <div>
      {/**Top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find you next <span className='text-slate-500'>perfect</span><br /> place with ease</h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
            Reactive Estate is the best place to find you next perfect place to live <br />
            We have a wide range of properties you to choose from.
        </div>
        <Link to="/search" className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started...
        </Link>
      </div>

      {/**middle */}
      
      <Swiper navigation>
              {
                  offerListings && offerListings.length > 0 && offerListings.map((listing)=>{
                      return <SwiperSlide key={listing._id}>
                          <div className="h-[550px]" style={{background:`url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize:'cover'}}>

                          </div>
                      </SwiperSlide>
                  })
              }
      </Swiper>
      {/**Bottom */}
        <div className='max-w-6xl mx-auto p-3 flex-col gap-8 flex my-10'>
            {
            offerListings && offerListings.length > 0 && (
              <div>
                  <div className='my-3'>
                      <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
                      <Link to={`/Search?offer=true`} className='text-blue-800 text-sm hover:underline'>
                        Show more offers
                      </Link>
                  </div>
                  <div className='flex flex-wrap gap-5'>
                      {
                          offerListings.map((listing)=>{
                            return <ListingItem key={listing._id} listing={listing}/>
                          })
                      }
                  </div>
              </div>
            )
          }
        </div>

        <div className='max-w-6xl mx-auto p-3 flex-col gap-8 flex my-10'>
            {
            rentListings && rentListings.length > 0 && (
              <div>
                  <div className='my-3'>
                      <h2 className='text-2xl font-semibold text-slate-600'>Recent Place for Rent</h2>
                      <Link to={`/Search?type=rent`} className='text-blue-800 text-sm hover:underline'>
                        Show more palces for rent
                      </Link>
                  </div>
                  <div className='flex flex-wrap gap-5'>
                      {
                          rentListings.map((listing)=>{
                            return <ListingItem key={listing._id} listing={listing}/>
                          })
                      }
                  </div>
              </div>
            )
          }
        </div>

        <div className='max-w-6xl mx-auto p-3 flex-col gap-8 flex my-10'>
            {
            saleListings && saleListings.length > 0 && (
              <div>
                  <div className='my-3'>
                      <h2 className='text-2xl font-semibold text-slate-600'>Recent places for Sale</h2>
                      <Link to={`/Search?type=sale`} className='text-blue-800 text-sm hover:underline'>
                        Show more palces for sale
                      </Link>
                  </div>
                  <div className='flex flex-wrap gap-5'>
                      {
                          saleListings.map((listing)=>{
                            return <ListingItem key={listing._id} listing={listing}/>
                          })
                      }
                  </div>
              </div>
            )
          }
        </div>
      
    </div>
  )
}
