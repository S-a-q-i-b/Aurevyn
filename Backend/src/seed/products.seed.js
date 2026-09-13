const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");

dotenv.config();

const img = (id, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
const product = (data) => ({
  brand: "Aurevyn",
  description:
    data.description ||
    "A refined Aurevyn essential with a modern silhouette, considered detail and everyday versatility.",
  images: [data.image, data.image2].filter(Boolean),
  variants: (data.sizes || []).flatMap((size, index) => [
    {
      sku: `${data.skuPrefix}-${String(index + 1).padStart(2, "0")}`,
      size,
      color: data.colors?.[0] || "Black",
      stock: Math.max(
        2,
        Math.floor((data.stock || 12) / Math.max(data.sizes.length, 1)),
      ),
    },
    ...((data.colors?.length || 0) > 1
      ? [
          {
            sku: `${data.skuPrefix}-${String(index + 1).padStart(2, "0")}-B`,
            size,
            color: data.colors[1],
            stock: Math.max(
              2,
              Math.floor((data.stock || 12) / Math.max(data.sizes.length, 1)),
            ),
          },
        ]
      : []),
  ]),
  tags: [
    data.category?.toLowerCase(),
    data.gender?.toLowerCase(),
    "aurevyn",
  ].filter(Boolean),
  ...data,
});

const products = [
  product({
    skuPrefix: "TEE",
    name: "Essential Oversized Tee",
    category: "T-Shirts",
    gender: "Men",
    price: 2499,
    image: img("photo-1521572163474-6864f9cf17ab"),
    image2: img("photo-1523381294911-8d3cead13475"),
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    badge: "New",
    newArrival: true,
    stock: 20,
    featured: true,
  }),
  product({
    skuPrefix: "LNS",
    name: "Relaxed Linen Shirt",
    category: "Shirts",
    gender: "Men",
    price: 3999,
    image: img("photo-1603252110481-7ba873bf42ab"),
    image2: img("photo-1602810318383-e386cc2a3ccf"),
    sizes: ["M", "L", "XL"],
    colors: ["White", "Beige"],
    badge: "New",
    newArrival: true,
    stock: 20,
  }),
  product({
    skuPrefix: "OVS",
    name: "Signature Overshirt",
    category: "Outerwear",
    gender: "Men",
    price: 5499,
    oldPrice: 6499,
    image: img("photo-1551488831-00ddcb6c6bd3"),
    image2: img("photo-1598808503746-f34c53b9323e"),
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Olive"],
    badge: "Sale",
    stock: 15,
    featured: true,
  }),
  product({
    skuPrefix: "DEN",
    name: "Aurevyn Straight Denim",
    category: "Jeans",
    gender: "Men",
    price: 4999,
    image: img("photo-1542272604-787c3835535d"),
    image2: img("photo-1475178626620-a4d074967452"),
    sizes: ["30", "32", "34", "36"],
    colors: ["Blue", "Black"],
    badge: "New",
    newArrival: true,
    stock: 18,
    bestSeller: true,
  }),
  product({
    skuPrefix: "RIB",
    name: "Minimal Ribbed Top",
    category: "T-Shirts",
    gender: "Women",
    price: 2799,
    image: img("photo-1503342217505-b0a15ec3261c"),
    image2: img("photo-1485968579580-b6d095142e6e"),
    sizes: ["S", "M", "L"],
    colors: ["White", "Cream"],
    badge: "New",
    newArrival: true,
    stock: 20,
  }),
  product({
    skuPrefix: "BLZ",
    name: "Tailored Relaxed Blazer",
    category: "Outerwear",
    gender: "Women",
    price: 6999,
    oldPrice: 7999,
    image: img("photo-1591369822096-ffd140ec948f"),
    image2: img("photo-1515372039744-b8f02a3ae446"),
    sizes: ["S", "M", "L"],
    colors: ["Black", "Brown"],
    badge: "Sale",
    stock: 12,
    featured: true,
  }),
  product({
    skuPrefix: "HOD",
    name: "Everyday Hoodie",
    category: "Hoodies",
    gender: "Unisex",
    price: 4499,
    image: img("photo-1556821840-3a63f95609a7"),
    image2: img("photo-1578681994506-b8f463449011"),
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey"],
    badge: "New",
    newArrival: true,
    stock: 16,
    bestSeller: true,
  }),
  product({
    skuPrefix: "WLD",
    name: "Classic Wide Leg Denim",
    category: "Jeans",
    gender: "Women",
    price: 5199,
    image: img("photo-1495105787522-5334e3ffa0ef"),
    image2: img("photo-1509631179647-0177331693ae"),
    sizes: ["28", "30", "32", "34"],
    colors: ["Blue", "Black"],
    badge: "New",
    newArrival: true,
    stock: 14,
  }),
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    console.log(`${inserted.length} Aurevyn products inserted successfully`);
    await mongoose.disconnect();
  } catch (error) {
    console.error("Product seed error:", error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
})();
