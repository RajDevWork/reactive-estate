import express from "express";
import { createListing,deleteListing,updateListing,getListing,getListings,getHomeRecommendations,getRecommendations } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create",verifyToken,createListing); //only authenticated user can create lists
router.delete("/delete/:id",verifyToken,deleteListing);
router.post("/update/:id",verifyToken,updateListing);
router.get("/get/:id",getListing);
router.get("/get",getListings);

/**
 * AI recommendation routes
 */

router.get("/recommendations",getHomeRecommendations);
router.get("/recommendations/:id",getRecommendations);

export default router;