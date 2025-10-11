const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");//import file listing

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//index route
router.get("/",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
   
});
//new route
router.get("/new",async(req,res)=>{
   res.render("listings/new.ejs");

});
//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});

}));
//create route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
// if(!req.body.listing){
//     throw new ExpressError(400,"Send valid data for listing");
// }

    const newListing=new Listing(req.body.listing);
//         if(!newListing.title){
//     throw new ExpressError(400,"Title is missing");
// }
//     if(!newListing.description){
//     throw new ExpressError(400,"Description is missing");
// }
//     if(!newListing.location){
//     throw new ExpressError(400,"Location is missing");
// }
//     if(!newListing.country){
//     throw new ExpressError(400,"Country is missing");
// }
 await newListing.save();
 req.flash("success","New isting created!");
 res.redirect("/listings");

}));
//edit route
router.get("/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));
//update route
router.put("/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
res.redirect("/listings/");

}));


module.exports=router;