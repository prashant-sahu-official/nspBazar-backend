const Product = require("../models/product");
const User = require("../models/user");
const cloudinary = require("../utils/cloudinary");

async function getAllItems(req, res) {

  console.log("Fetching all items...");
  console.log(process.env.CLOUDINARY_API_KEY);;
  let items = await Product.find().then((products) => {
    return products;
  });
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000));
  res.json({ items });
}

async function getItemById(req, res) {
  const item = await Product.findById(req.params.id);
  res.json({ item });
}

async function deleteItem(req, res) {
  const { itemId, userId, imagePublicId } = req.body;
  console.log("ItemId for deletion:", itemId);
  console.log("UserId for deletion:", userId);
  console.log("Image Public ID for deletion:", imagePublicId);
  try {
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(imagePublicId);
    console.log(
      "Image with public ID:",
      imagePublicId,
      "deleted from Cloudinary"
    );

    //remove item from Product collection
    const deleted = await Product.findByIdAndDelete(itemId);

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Remove item from user's myPosts
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.myPosts = user.myPosts.filter(
      (item) => item.toString() !== itemId.toString()
    );
    await user.save();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
}

async function createItem(req, res) {
  const { title, category, location, price, description, userId } = req.body;

  const imageUrl = req.file?.path; // Cloudinary URL
  const imagePublicId = req.file.filename; // This is the public_id
  if (!imageUrl) {
    return res.status(400).json({ message: "Image upload failed" });
  }
  const newProduct = new Product({
    title,
    category,
    image: imageUrl,
    imagePublicId: imagePublicId, // Store the public_id for future reference
    location,
    price,
    description,
  });
  await newProduct.save().then(() => {
    "Product is added successfully";
  });

  const user = await User.findById(userId);

  await user.myPosts.push(newProduct._id);
  await user.save();
  res.json({
    message: "Product is added successfully",
    item: newProduct,
  });
}

async function getMyItems(req, res) {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).populate("myPosts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ myItems: user.myPosts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function addToWishlist(req, res) {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
}

async function removeFromWishlist(req, res) {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User wishlist before removal:", user.wishlist);
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId.toString()
    );
    await user.save();

    console.log("Updated wishlist:", user.wishlist);
    res
      .status(200)
      .json({
        message: `Product id: ${productId} removed from wishlist`,
        wishlist: user.wishlist,
      });
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
}

async function getWishlist(req, res) {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.populate("wishlist");
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
}

exports.getAllItems = getAllItems;
exports.createItem = createItem;
exports.getItemById = getItemById;
exports.getMyItems = getMyItems;
exports.addToWishlist = addToWishlist;
exports.removeFromWishlist = removeFromWishlist;
exports.getWishlist = getWishlist;
exports.deleteItem = deleteItem;
