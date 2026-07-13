const express = require("express");
const router = express.Router();

const DEMO_PRODUCTS = [
  {
    id: "m_outfit_white_grey",
    name: "White Shirt & Grey Pant Set",
    brand: "VirtualFit AI",
    price: 4500,
    originalPrice: 5500,
    discount: 18,
    rating: 4.7,
    reviewCount: 210,
    gender: "Men",
    category: "Outfit",
    description: "A smart casual set featuring a crisp white shirt and tailored grey pants.",
    image: "/products/m_outfit_white_grey.png",
    hasSizes: true,
    tags: ["Outfit", "Men", "Casual", "Set", "White", "Grey"]
  },
  {
    id: "m_kurta_pista",
    name: "Pista Green Festive Kurta",
    brand: "VirtualFit AI",
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    rating: 4.8,
    reviewCount: 150,
    gender: "Men",
    category: "Kurta",
    description: "Traditional Pista Green festive Kurta with elegant stitching, perfect for occasions.",
    image: "/products/m_kurta_pista.png",
    hasSizes: true,
    tags: ["Kurta", "Men", "Traditional", "Green"]
  },
  {
    id: "m_suit_black2",
    name: "Premium Black Suit",
    brand: "VirtualFit AI",
    price: 18000,
    originalPrice: 22000,
    discount: 18,
    rating: 4.9,
    reviewCount: 300,
    gender: "Men",
    category: "Suit",
    description: "An elegant, perfectly tailored premium black suit for formal events.",
    image: "/products/m_suit_black2.png",
    hasSizes: true,
    tags: ["Suit", "Men", "Formal", "Black", "Premium"]
  },
  {
    id: "w_lehenga_custom2",
    name: "Orange Bridal Lehenga",
    brand: "VirtualFit AI",
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    rating: 4.9,
    reviewCount: 420,
    gender: "Women",
    category: "Lehenga",
    description: "Beautiful designer lehenga perfectly tailored for women.",
    image: "/products/w_lehenga_custom2.png",
    hasSizes: true,
    tags: ["Lehenga", "Women", "Bridal", "Designer"]
  },
  {
    id: "w_lehenga_custom",
    name: "Custom Bridal Lehenga",
    brand: "VirtualFit AI",
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    rating: 4.9,
    reviewCount: 420,
    gender: "Women",
    category: "Lehenga",
    description: "Beautiful designer lehenga perfectly tailored for women.",
    image: "/products/w_lehenga_custom.png",
    hasSizes: true,
    tags: ["Lehenga", "Women", "Bridal", "Designer"]
  },
  {
    id: "w_kurti_red",
    name: "Red Festive Kurti",
    brand: "VirtualFit AI",
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    rating: 4.8,
    reviewCount: 150,
    gender: "Women",
    category: "Kurti",
    description: "Traditional Red festive Kurti with elegant stitching",
    image: "/products/w_kurti_red.png",
    hasSizes: true,
    tags: ["Kurti", "Women", "Traditional", "Red"]
  },
  {
    id: "w_saree_brown",
    name: "Brown Silk Saree",
    brand: "VirtualFit AI",
    price: 21000,
    originalPrice: 25000,
    discount: 16,
    rating: 4.7,
    reviewCount: 280,
    gender: "Women",
    category: "Saree",
    description: "Premium Brown Silk Saree with a classic drape",
    image: "/products/w_saree_brown.png",
    hasSizes: true,
    tags: ["Saree", "Women", "Festive", "Brown"]
  },
  {
    id: "w_saree_teal",
    name: "Teal Color Saree",
    brand: "VirtualFit AI",
    price: 18000,
    originalPrice: 22000,
    discount: 18,
    rating: 4.8,
    reviewCount: 320,
    gender: "Women",
    category: "Saree",
    description: "Beautiful Teal Color Saree with elegant finish",
    image: "/products/w_saree_teal.png",
    hasSizes: true,
    tags: ["Saree", "Women", "Festive", "Teal"]
  },
  {
    id: "w_saree_wine_red",
    name: "Wine Red Saree",
    brand: "Sabyasachi",
    price: 25000,
    originalPrice: 30000,
    discount: 16,
    rating: 4.9,
    reviewCount: 450,
    gender: "Women",
    category: "Saree",
    description: "Elegant Wine Red Saree with intricate details",
    image: "/products/w_saree_wine_red.png",
    hasSizes: true,
    tags: ["Saree", "Women", "Festive", "Red"]
  }
];

router.get("/", (req, res) => {
  res.json({
    success: true,
    count: DEMO_PRODUCTS.length,
    products: DEMO_PRODUCTS,
  });
});

module.exports = router;
