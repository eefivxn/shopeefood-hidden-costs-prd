import type { MenuItem, Restaurant, Voucher } from "./types";

export const RESTAURANTS: Restaurant[] = [
  {
    id: "R-01",
    name: "Ayam Bakar Pak Dhe",
    category: "Ayam & Bakaran",
    distanceKm: 3.2,
    deliveryFee: 12000,
    serviceFee: 3000,
    packingFeePerItem: 2000,
    taxRatePct: 10,
    image:
      "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "R-02",
    name: "Geprek Bu Rina",
    category: "Ayam Geprek",
    distanceKm: 1.1,
    deliveryFee: 6000,
    serviceFee: 3000,
    packingFeePerItem: 1000,
    taxRatePct: 10,
    image:
      "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "R-03",
    name: "Nasi Goreng Mas Joko",
    category: "Nasi & Mie",
    distanceKm: 0.8,
    deliveryFee: 4000,
    serviceFee: 2000,
    packingFeePerItem: 1000,
    taxRatePct: 10,
    image:
      "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "R-04",
    name: "Bakso Pak Slamet",
    category: "Bakso & Mie",
    distanceKm: 2.0,
    deliveryFee: 8000,
    serviceFee: 3000,
    packingFeePerItem: 1000,
    taxRatePct: 10,
    image:
      "https://images.pexels.com/photos/2664216/pexels-photo-2664216.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "R-05",
    name: "Kopi & Roti Senja",
    category: "Kopi & Roti",
    distanceKm: 4.5,
    deliveryFee: 15000,
    serviceFee: 4000,
    packingFeePerItem: 2000,
    taxRatePct: 10,
    image:
      "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "R-06",
    name: "Sate Ayam Madura",
    category: "Sate",
    distanceKm: 2.6,
    deliveryFee: 9000,
    serviceFee: 3000,
    packingFeePerItem: 1000,
    taxRatePct: 10,
    image:
      "https://images.pexels.com/photos/2317710/pexels-photo-2317710.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export const MENU: MenuItem[] = [
  { id: "M-101", restaurantId: "R-01", name: "Paket Ayam Bakar Promo", desc: "Ayam bakar, nasi, lalapan", listPrice: 30000, discount: 0, taxStatus: "TAXABLE", isSignature: true },
  { id: "M-102", restaurantId: "R-01", name: "Tahu Tempe Bakar", desc: "Tahu & tempe bakar, sambal", listPrice: 10000, discount: 0, taxStatus: "TAXABLE", isSignature: false },
  { id: "M-103", restaurantId: "R-01", name: "Nasi Putih", desc: "Nasi hangat", listPrice: 5000, discount: 0, taxStatus: "TAXABLE", isSignature: false },
  { id: "M-104", restaurantId: "R-01", name: "Es Jeruk", desc: "Jeruk peras, gula", listPrice: 8000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: false },

  { id: "M-201", restaurantId: "R-02", name: "Ayam Geprek Original", desc: "Level 1-10, sambal bawang", listPrice: 17000, discount: 2000, taxStatus: "TAXABLE", isSignature: true },
  { id: "M-202", restaurantId: "R-02", name: "Ayam Geprek Keju", desc: "Topping keju, sambal", listPrice: 22000, discount: 0, taxStatus: "TAXABLE", isSignature: false },
  { id: "M-203", restaurantId: "R-02", name: "Nasi Putih", desc: "Nasi hangat", listPrice: 5000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: false },
  { id: "M-204", restaurantId: "R-02", name: "Es Teh Manis", desc: "Teh melati manis", listPrice: 5000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: false },

  { id: "M-301", restaurantId: "R-03", name: "Nasi Goreng Ayam", desc: "Nasi goreng, ayam, telur", listPrice: 18000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: true },
  { id: "M-302", restaurantId: "R-03", name: "Nasi Goreng Spesial", desc: "Telur, sosis, ati", listPrice: 20000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: false },
  { id: "M-303", restaurantId: "R-03", name: "Mie Goreng Jawa", desc: "Mie, sayar, ayam", listPrice: 17000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: false },
  { id: "M-304", restaurantId: "R-03", name: "Es Teh Tarik", desc: "Susu teh tarik", listPrice: 6000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: false },

  { id: "M-401", restaurantId: "R-04", name: "Bakso Urat", desc: "Bakso urat, kuah kaldu", listPrice: 15000, discount: 0, taxStatus: "TAXABLE", isSignature: true },
  { id: "M-402", restaurantId: "R-04", name: "Bakso Campur Komplit", desc: "Bakso, mie, pangsit", listPrice: 20000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: false },
  { id: "M-403", restaurantId: "R-04", name: "Mie Ayam Bakso", desc: "Mie ayam, bakso", listPrice: 14000, discount: 0, taxStatus: "TAXABLE", isSignature: false },
  { id: "M-404", restaurantId: "R-04", name: "Es Campur", desc: "Buah, cincau, santan", listPrice: 10000, discount: 0, taxStatus: "TAXABLE", isSignature: false },

  { id: "M-501", restaurantId: "R-05", name: "Kopi Susu Gula Aren", desc: "Espresso, susu, gula aren", listPrice: 22000, discount: 3000, taxStatus: "TAXABLE", isSignature: true },
  { id: "M-502", restaurantId: "R-05", name: "Roti Bakar Cokelat Keju", desc: "Roti, cokelat, keju", listPrice: 18000, discount: 0, taxStatus: "TAXABLE", isSignature: false },
  { id: "M-503", restaurantId: "R-05", name: "Paket Sarapan (roti + kopi)", desc: "Roti bakar + kopi", listPrice: 35000, discount: 0, taxStatus: "TAXABLE", isSignature: false },
  { id: "M-504", restaurantId: "R-05", name: "Air Mineral", desc: "600 ml", listPrice: 5000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: false },

  { id: "M-601", restaurantId: "R-06", name: "Sate Ayam (10 tusuk)", desc: "Bumbu kacang, lontong", listPrice: 20000, discount: 0, taxStatus: "TAXABLE", isSignature: true },
  { id: "M-602", restaurantId: "R-06", name: "Sate Kambing (10 tusuk)", desc: "Bumbu kacang, lontong", listPrice: 30000, discount: 0, taxStatus: "TAXABLE", isSignature: false },
  { id: "M-603", restaurantId: "R-06", name: "Lontong", desc: "1 potong", listPrice: 4000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: false },
  { id: "M-604", restaurantId: "R-06", name: "Es Kelapa Muda", desc: "Kelapa utuh", listPrice: 10000, discount: 0, taxStatus: "TAX_INCLUDED", isSignature: false },
];

export const VOUCHERS: Voucher[] = [
  { id: "V-F01", name: "Hemat Makan", type: "FOOD", value: 5000, isPercent: false, maxDiscount: null, minSubtotal: 25000, restaurantId: null },
  { id: "V-F02", name: "Diskon 20% Makan", type: "FOOD", value: 20, isPercent: true, maxDiscount: 8000, minSubtotal: 30000, restaurantId: null },
  { id: "V-F03", name: "Spesial Senja", type: "FOOD", value: 10000, isPercent: false, maxDiscount: null, minSubtotal: 40000, restaurantId: "R-05" },
  { id: "V-D01", name: "Gratis Ongkir", type: "DELIVERY", value: 8000, isPercent: false, maxDiscount: 8000, minSubtotal: 20000, restaurantId: null },
  { id: "V-D02", name: "Potongan Ongkir", type: "DELIVERY", value: 5000, isPercent: false, maxDiscount: 5000, minSubtotal: 15000, restaurantId: null },
];

export const WIRA_DEFAULT = {
  name: "Wira",
  budget: 50000,
  spentToday: 12000,
  address: "Kos dekat kampus, Malang",
};

export const restaurantById = (id: string | null) =>
  RESTAURANTS.find((r) => r.id === id) ?? null;

export const menuById = (id: string) =>
  MENU.find((m) => m.id === id) ?? null;

export const menuForRestaurant = (restaurantId: string) =>
  MENU.filter((m) => m.restaurantId === restaurantId);
