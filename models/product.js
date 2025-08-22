const { default: mongoose } = require("mongoose") ;
const { image } = require("../utils/cloudinary");


//  this.id = id ;
//       this.image = image ;
//       this.company = company ;
//       this.item_name = item_name ;
//       this.original_price = original_price;
//       this.current_price = current_price ;
//       this.discount_percentage = discount_percentage ;
//       this.return_period = return_period ;
//       this.delivery_date = delivery_date ;
//       this.rating = { stars: rating.stars, count: rating.count }
         
        //   save()
        //   fetchAll()
        //   findById()

const productSchema = mongoose.Schema({
     title : {
        type: String, 
        required: true,
        trim: true
     },
     category: {
        type: String,
        required: true,
        enum: ['book', 'electronics', 'furniture', 'property', 'clothing', 'other'],
        lowercase: true,
     },
     description: {
        type: String,
        required: true,
        maxlength: 1000,
     },
     price: {
        type: Number,
        required: true,
        mini: 0,
     },
     image: {
        type: String,
     },
     imagePublicId: {
        type: String,
     },
     location: {
        type: String,
        required: true
     },
     mobile: {
        type: Number,
        required: true
     },
     postedAt: {
        type: Date,
        default: Date.now,
     },
     views: {
        type: Number,
        default: 0
     }
}) ;

// Post middleware after product is deleted
productSchema.post("findOneAndDelete", async function (deletedProduct) {
   
   // ✅ 1. Remove product from all users' wishlist
   const User = require("./user");
  if (deletedProduct) {
    await User.updateMany(
      { wishlist: deletedProduct._id },
      { $pull: { wishlist: deletedProduct._id } }
    );
  }

});

module.exports = mongoose.model('Product', productSchema) ;

