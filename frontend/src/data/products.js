/**
 * data/products.js
 *
 * Why this file exists:
 *   Single source of truth for the product catalog used throughout the app.
 *   In Phase 2, this data comes from GET /api/products on the Node backend.
 *   For now we keep it here so the UI is fully self-contained.
 *
 *   Added for e-commerce display:
 *   - price, originalPrice, discount (₹ pricing)
 *   - rating, reviewCount (social proof)
 *   - tryOnCount (fake stat for the demo — shows feature adoption)
 *   - colors (color variant picker)
 *   - description (product detail page)
 *   - deliveryDays (simulated delivery info)
 */

export const products = [
  {
    id: "red-silk-saree",
    name: "Banarasi Silk Saree",
    brand: "Kanjivaram House",
    category: "Sarees",
    description:
      "Handwoven Banarasi silk with intricate gold zari motifs. A timeless heirloom piece crafted by master weavers in Varanasi. The rich texture and lustrous sheen make this perfect for weddings and festive occasions.",
    image: "/products/red-silk-saree.png",
    tags: ["Silk", "Festive", "Traditional"],
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    rating: 4.8,
    reviewCount: 1204,
    tryOnCount: 1842,
    colors: ["Red", "Maroon", "Gold"],
    sizes: ["Free Size"],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: "blue-cotton-saree",
    name: "Cotton Handloom Saree",
    brand: "Khadi Craft",
    category: "Sarees",
    description:
      "Lightweight pure cotton handloom saree with a delicate white embroidered border. Perfect for daily wear, office, or casual occasions. Breathable fabric ideal for warm weather.",
    image: "/products/blue-cotton-saree.png",
    tags: ["Cotton", "Casual", "Lightweight"],
    price: 899,
    originalPrice: 1499,
    discount: 40,
    rating: 4.5,
    reviewCount: 837,
    tryOnCount: 612,
    colors: ["Steel Blue", "Ivory", "Sage"],
    sizes: ["Free Size"],
    deliveryDays: 2,
    inStock: true,
  },
  {
    id: "wedding-lehenga",
    name: "Bridal Lehenga Set",
    brand: "Regal Couture",
    category: "Lehengas",
    description:
      "Exquisite bridal lehenga in deep maroon velvet with heavy gold zardozi embroidery. Includes matching blouse and dupatta. The flared silhouette creates a stunning royal look.",
    image: "/products/wedding-lehenga.png",
    tags: ["Bridal", "Embroidery", "Premium"],
    price: 12999,
    originalPrice: 24999,
    discount: 48,
    rating: 4.9,
    reviewCount: 421,
    tryOnCount: 938,
    colors: ["Maroon", "Navy", "Dusty Rose"],
    sizes: ["XS", "S", "M", "L", "XL"],
    deliveryDays: 5,
    inStock: true,
  },
  {
    id: "printed-kurti",
    name: "Floral Block Print Kurti",
    brand: "Jaipur Prints",
    category: "Kurtis",
    description:
      "Straight-fit kurti in soft Rayon with hand block floral print. Pair with leggings, palazzos, or jeans. Easy to style and care for — machine washable.",
    image: "/products/printed-kurti.png",
    tags: ["Block Print", "Casual", "Daily Wear"],
    price: 649,
    originalPrice: 999,
    discount: 35,
    rating: 4.6,
    reviewCount: 2341,
    tryOnCount: 1567,
    colors: ["Teal", "Rust", "Indigo"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    deliveryDays: 2,
    inStock: true,
  },
  {
    id: "designer-saree",
    name: "Sequin Georgette Saree",
    brand: "Zara by Orient",
    category: "Sarees",
    description:
      "Party-ready peach georgette saree with all-over sequin and resham embroidery. Lightweight fabric drapes beautifully. Comes with a pre-stitched fall for easy wear.",
    image: "/products/designer-saree.png",
    tags: ["Party Wear", "Sequin", "Georgette"],
    price: 3499,
    originalPrice: 5999,
    discount: 42,
    rating: 4.7,
    reviewCount: 563,
    tryOnCount: 721,
    colors: ["Peach", "Champagne", "Rose Gold"],
    sizes: ["Free Size"],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: "green-saree",
    name: "Kanjivaram Silk Saree",
    brand: "Kanjivaram House",
    category: "Sarees",
    description:
      "Pure Kanjivaram silk from Tamil Nadu with a classic golden temple border. The rich emerald green with intricate pallu detailing makes this a statement piece for weddings.",
    image: "/products/green-saree.png",
    tags: ["Silk", "Kanjivaram", "Traditional"],
    price: 8499,
    originalPrice: 14999,
    discount: 43,
    rating: 4.9,
    reviewCount: 318,
    tryOnCount: 489,
    colors: ["Emerald", "Royal Blue", "Peacock"],
    sizes: ["Free Size"],
    deliveryDays: 4,
    inStock: true,
  },
  {
    id: "white-shirt",
    name: "Oxford Button-Down Shirt",
    brand: "CleanCut",
    category: "Men's Wear",
    description:
      "Classic Oxford weave cotton shirt in crisp white. Slim fit, button-down collar. Perfect for formal meetings, business casual, or smart everyday wear.",
    image: "/products/white-shirt.png",
    tags: ["Formal", "Men's", "Cotton"],
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    rating: 4.4,
    reviewCount: 1089,
    tryOnCount: 432,
    colors: ["White", "Sky Blue", "Light Grey"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    deliveryDays: 2,
    inStock: true,
  },
  {
    id: "black-blazer",
    name: "Slim Fit Formal Blazer",
    brand: "CleanCut",
    category: "Men's Wear",
    description:
      "Premium single-breasted slim fit blazer in jet black. Notch lapel, 2-button closure, flap pockets. Pair with trousers for boardroom meetings or dress it down with jeans.",
    image: "/products/black-blazer.png",
    tags: ["Formal", "Men's", "Premium"],
    price: 4999,
    originalPrice: 8999,
    discount: 44,
    rating: 4.6,
    reviewCount: 782,
    tryOnCount: 1103,
    colors: ["Black", "Charcoal", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: "purple-saree",
    name: "Chiffon Embroidered Saree",
    brand: "Zara by Orient",
    category: "Sarees",
    description:
      "Lightweight royal purple chiffon saree with silver kasab embroidery on border and pallu. The semi-sheer fabric and exquisite work make it ideal for festive evenings and receptions.",
    image: "/products/purple-saree.png",
    tags: ["Party Wear", "Chiffon", "Embroidery"],
    price: 2799,
    originalPrice: 4499,
    discount: 38,
    rating: 4.7,
    reviewCount: 694,
    tryOnCount: 843,
    colors: ["Royal Purple", "Midnight Blue", "Wine"],
    sizes: ["Free Size"],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: "anarkali-suit",
    name: "Floor-Length Anarkali Suit",
    brand: "Regal Couture",
    category: "Suits",
    description:
      "Majestic floor-length Anarkali in royal blue georgette with intricate gold embroidery throughout. Includes matching salwar and dupatta. An ensemble fit for festive celebrations.",
    image: "/products/anarkali-suit.png",
    tags: ["Festive", "Embroidery", "Full Length"],
    price: 3999,
    originalPrice: 6999,
    discount: 43,
    rating: 4.8,
    reviewCount: 509,
    tryOnCount: 674,
    colors: ["Royal Blue", "Teal", "Burgundy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    deliveryDays: 4,
    inStock: true,
  },
];

/**
 * getCategories
 *
 * Why it exists:
 *   Reads all products and returns unique category names.
 *   Used by CategoryScroller to render the filter tabs.
 *
 * Input: none
 * Output: string[] — ["All", "Sarees", "Lehengas", ...]
 */
export function getCategories() {
  const unique = [...new Set(products.map((p) => p.category))];
  return ["All", ...unique];
}

/**
 * formatPrice
 *
 * Why it exists:
 *   Formats a number like 2499 into "₹2,499" for display.
 *
 * Input:  amount (number) — e.g. 2499
 * Output: string — e.g. "₹2,499"
 */
export function formatPrice(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
