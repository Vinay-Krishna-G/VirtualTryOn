/**
 * data/products.js
 *
 * Why this file exists:
 *   Single source of truth for the product catalog used throughout the app.
 *   Updated with explicit `gender` property (Men / Women) and flat-lay images.
 */

export const products = [
  // ── Women's Garments ──
  {
    id: "red-silk-saree",
    name: "Banarasi Silk Saree",
    brand: "Kanjivaram House",
    category: "Sarees",
    gender: "Women",
    description: "Handwoven Banarasi silk with intricate gold zari motifs. A timeless heirloom piece crafted by master weavers in Varanasi. The rich texture and lustrous sheen make this perfect for weddings and festive occasions.",
    image: "/products/flat_red_saree_1783531864249.png",
    tags: ["Silk", "Festive", "Traditional"],
    price: 2499, originalPrice: 4999, discount: 50,
    rating: 4.8, reviewCount: 1204, tryOnCount: 1842,
    colors: ["Red", "Maroon", "Gold"], sizes: ["Free Size"],
    deliveryDays: 3, inStock: true,
  },
  {
    id: "printed-kurti",
    name: "Floral Block Print Kurti",
    brand: "Jaipur Prints",
    category: "Kurtis",
    gender: "Women",
    description: "Straight-fit kurti in soft Rayon with hand block floral print. Pair with leggings, palazzos, or jeans. Easy to style and care for — machine washable.",
    image: "/products/flat_printed_kurti_1783531872831.png",
    tags: ["Block Print", "Casual", "Daily Wear"],
    price: 649, originalPrice: 999, discount: 35,
    rating: 4.6, reviewCount: 2341, tryOnCount: 1567,
    colors: ["Teal", "Rust", "Indigo"], sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    deliveryDays: 2, inStock: true,
  },
  {
    id: "wedding-lehenga",
    name: "Bridal Lehenga Set",
    brand: "Regal Couture",
    category: "Lehengas",
    gender: "Women",
    description: "Exquisite bridal lehenga in deep maroon velvet with heavy gold zardozi embroidery. Includes matching blouse and dupatta. The flared silhouette creates a stunning royal look.",
    image: "/products/flat_bridal_lehenga_1783531882846.png",
    tags: ["Bridal", "Embroidery", "Premium"],
    price: 12999, originalPrice: 24999, discount: 48,
    rating: 4.9, reviewCount: 421, tryOnCount: 938,
    colors: ["Maroon", "Navy", "Dusty Rose"], sizes: ["XS", "S", "M", "L", "XL"],
    deliveryDays: 5, inStock: true,
  },
  {
    id: "green-saree",
    name: "Kanjivaram Silk Saree (On Model)",
    brand: "Kanjivaram House",
    category: "Sarees",
    gender: "Women",
    description: "Pure Kanjivaram silk from Tamil Nadu with a classic golden temple border. The rich emerald green with intricate pallu detailing makes this a statement piece for weddings. Shown beautifully draped on a model.",
    image: "/products/green-saree.png",
    tags: ["Silk", "Kanjivaram", "Traditional", "Model"],
    price: 8499, originalPrice: 14999, discount: 43,
    rating: 4.9, reviewCount: 318, tryOnCount: 489,
    colors: ["Emerald", "Royal Blue", "Peacock"], sizes: ["Free Size"],
    deliveryDays: 4, inStock: true,
  },
  {
    id: "purple-saree",
    name: "Chiffon Embroidered Saree",
    brand: "Zara by Orient",
    category: "Sarees",
    gender: "Women",
    description: "Lightweight royal purple chiffon saree with silver kasab embroidery on border and pallu. Shown beautifully draped on an Indian model in a straight pose.",
    image: "/products/purple-saree.png",
    tags: ["Party Wear", "Chiffon", "Embroidery", "Model"],
    price: 2799, originalPrice: 4499, discount: 38,
    rating: 4.7, reviewCount: 694, tryOnCount: 843,
    colors: ["Royal Purple", "Midnight Blue", "Wine"], sizes: ["Free Size"],
    deliveryDays: 3, inStock: true,
  },

  // ── Men's Garments ──
  {
    id: "white-shirt",
    name: "Oxford Button-Down Shirt",
    brand: "CleanCut",
    category: "Shirts",
    gender: "Men",
    description: "Classic Oxford weave cotton shirt in crisp white. Slim fit, button-down collar. Perfect for formal meetings, business casual, or smart everyday wear.",
    image: "/products/flat_white_shirt_1783531815019.png",
    tags: ["Formal", "Men's", "Cotton"],
    price: 1299, originalPrice: 1999, discount: 35,
    rating: 4.4, reviewCount: 1089, tryOnCount: 432,
    colors: ["White", "Sky Blue", "Light Grey"], sizes: ["S", "M", "L", "XL", "XXL"],
    deliveryDays: 2, inStock: true,
  },
  {
    id: "black-blazer",
    name: "Slim Fit Formal Blazer",
    brand: "CleanCut",
    category: "Blazers",
    gender: "Men",
    description: "Premium single-breasted slim fit blazer in jet black. Notch lapel, 2-button closure, flap pockets. Pair with trousers for boardroom meetings or dress it down with jeans.",
    image: "/products/flat_black_blazer_1783531824176.png",
    tags: ["Formal", "Men's", "Premium"],
    price: 4999, originalPrice: 8999, discount: 44,
    rating: 4.6, reviewCount: 782, tryOnCount: 1103,
    colors: ["Black", "Charcoal", "Navy"], sizes: ["S", "M", "L", "XL"],
    deliveryDays: 3, inStock: true,
  },
  {
    id: "blue-jeans",
    name: "Classic Blue Denim Jeans",
    brand: "Urban Denim",
    category: "Jeans",
    gender: "Men",
    description: "Straight fit classic blue denim jeans made from durable stretch-cotton blend. Features a 5-pocket design and zip fly.",
    image: "/products/flat_blue_jeans_1783531834525.png",
    tags: ["Casual", "Men's", "Denim"],
    price: 1499, originalPrice: 2299, discount: 35,
    rating: 4.5, reviewCount: 1422, tryOnCount: 890,
    colors: ["Blue", "Light Blue", "Black"], sizes: ["30", "32", "34", "36", "38"],
    deliveryDays: 2, inStock: true,
  },
  {
    id: "olive-tshirt",
    name: "Premium Cotton T-Shirt",
    brand: "Basics",
    category: "T-Shirts",
    gender: "Men",
    description: "Super soft combed cotton t-shirt in olive green. Regular fit with a classic crew neck. Breathable and comfortable for everyday wear.",
    image: "/products/flat_olive_tshirt_1783531844391.png",
    tags: ["Casual", "Men's", "Cotton"],
    price: 599, originalPrice: 999, discount: 40,
    rating: 4.7, reviewCount: 3105, tryOnCount: 2150,
    colors: ["Olive", "Black", "White", "Navy"], sizes: ["S", "M", "L", "XL", "XXL"],
    deliveryDays: 1, inStock: true,
  },
];

/**
 * getCategories
 * Returns unique category names for a specific gender, or all if no gender specified.
 */
export function getCategories(gender = "All") {
  const filteredProducts = gender === "All" 
    ? products 
    : products.filter(p => p.gender === gender);
    
  const unique = [...new Set(filteredProducts.map((p) => p.category))];
  return ["All", ...unique];
}

export function formatPrice(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
