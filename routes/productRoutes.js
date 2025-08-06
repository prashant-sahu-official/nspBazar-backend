const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const {
  getAllItems,
  createItem,
  getItemById,
  deleteItem,
  getMyItems,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/productController");

router.get("/items", getAllItems);
router.post("/items", upload.single("image"), createItem);
router.get("/items/:id", getItemById);
router.delete("/items", deleteItem);
router.get("/myPosts/:userId", getMyItems);
router.get("/wishlist/:userId", getWishlist);
router.post("/addToWishlist", addToWishlist);
router.delete("/removeFromWishlist", removeFromWishlist);

module.exports = router;
