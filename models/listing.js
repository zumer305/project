const mongoose= require("mongoose");
const Schema=mongoose.Schema; //VARIABLE ME STORE
const Review=require("./review.js")
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
 image: {
  type: String,
  default:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  set: (v) =>
    v === ""
      ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
      : v,
},
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",

    }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;