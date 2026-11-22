// Discount helpers shared by the Products page (same rules as the Home page deals).
// If the backend sends `discountPercent` it is used; otherwise a demo discount per category.
export const offerByCategory = {
  "Cleaning & Sanitation": 40,
  "Street & Outdoor Lighting": 55,
  "CCTV & Security": 45,
  "Computers & Office Technology": 30,
  "Water Systems": 35,
  Furniture: 50,
  "Playground & Open Gym": 40,
  "Village Infrastructure": 38,
  "Power, Solar & Safety": 42,
};

export function getPricing(product) {
  const price = Number(product.price);
  const has = price > 0;
  const raw = Number(product.discountPercent ?? offerByCategory[product.categoryName ?? product.category] ?? 20);
  const pct = Math.min(60, Math.max(5, raw)); // keep the discount between 5% and 60%
  // original price = price / (1 - discount/100), rounded to the nearest 10 rupees
  const mrp = has ? Math.round(price / (1 - pct / 100) / 10) * 10 : 0;
  return { has, pct, mrp };
}
