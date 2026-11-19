import { useState } from "react";
import {
  Minus,
  Plus,
  Info,
  ShoppingCart,
  ChevronLeft,
  BadgePercent,
  Package,
  Bike,
  Receipt,
} from "lucide-react";
import type { Cart, MenuItem } from "../data/types";
import {
  restaurantById,
  menuForRestaurant,
  menuById,
} from "../data/mockData";
import { fmtRp, itemAllInEstimate, netPrice } from "../lib/pricing";
import { Button, Modal, Notice } from "../components/ui";
import { useApp } from "../App";

function PriceNote({ item, est }: { item: MenuItem; est: number | null }) {
  const r = restaurantById(item.restaurantId);
  if (!r || est === null) return null;
  const taxLabel =
    item.taxStatus === "TAXABLE"
      ? `Belum termasuk pajak ${r.taxRatePct}%`
      : "Sudah termasuk pajak";
  const line1 =
    item.taxStatus === "TAXABLE"
      ? `${taxLabel} + kemasan ${fmtRp(r.packingFeePerItem)}.`
      : `${taxLabel}. Kemasan ${fmtRp(r.packingFeePerItem)}.`;
  return (
    <div className="mt-2 text-xs leading-snug text-gray-600">
      <p className="line-clamp-2">{line1}</p>
      <p className="mt-0.5 font-semibold text-brand-700">
        Est. all-in 1 porsi: {fmtRp(est)}
      </p>
    </div>
  );
}

export default function MenuScreen({
  restaurantId,
  cart,
  setCart,
}: {
  restaurantId: string;
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
}) {
  const { navigate, setAddressIdx } = useApp();
  const restaurant = restaurantById(restaurantId);
  const menu = menuForRestaurant(restaurantId);
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmSwitch, setConfirmSwitch] = useState<string | null>(null);
  const [pendingQty, setPendingQty] = useState<{ itemId: string; delta: number } | null>(null);

  if (!restaurant) return <Notice>Restoran tidak ditemukan.</Notice>;

  const cartQtyOf = (menuItemId: string) =>
    cart.restaurantId === restaurantId
      ? cart.lines.find((l) => l.menuItemId === menuItemId)?.qty ?? 0
      : 0;
  const cartCount = cart.lines.reduce((a, l) => a + l.qty, 0);
  const cartFromOther =
    cart.lines.length > 0 && cart.restaurantId !== null && cart.restaurantId !== restaurantId;

  const applyQty = (itemId: string, delta: number) => {
    const item = menuById(itemId);
    if (!item) return;
    if (cartFromOther) {
      setPendingQty({ itemId, delta });
      setConfirmSwitch(restaurantId);
      return;
    }
    setCart((c) => {
      const lines = [...c.lines];
      const idx = lines.findIndex((l) => l.menuItemId === itemId);
      if (idx === -1 && delta > 0) lines.push({ menuItemId: itemId, qty: delta });
      else if (idx !== -1) {
        const newQty = lines[idx].qty + delta;
        if (newQty <= 0) lines.splice(idx, 1);
        else lines[idx] = { ...lines[idx], qty: newQty };
      }
      return {
        ...c,
        restaurantId: lines.length > 0 ? restaurantId : null,
        lines,
        foodVoucherId: lines.length > 0 ? c.foodVoucherId : null,
        deliveryVoucherId: lines.length > 0 ? c.deliveryVoucherId : null,
      };
    });
  };

  const confirmSwitchYes = () => {
    if (pendingQty && pendingQty.delta > 0) {
      setCart({
        restaurantId,
        lines: [{ menuItemId: pendingQty.itemId, qty: pendingQty.delta }],
        foodVoucherId: null,
        deliveryVoucherId: null,
      });
      setAddressIdx(0);
    }
    setPendingQty(null);
    setConfirmSwitch(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate({ name: "home" })}>
          <ChevronLeft size={18} /> Kembali
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <img src={restaurant.image} alt={restaurant.name} className="h-40 w-full object-cover sm:h-52" />
        <div className="p-4">
          <h1 className="text-xl font-extrabold text-gray-900">{restaurant.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {restaurant.category} • {restaurant.distanceKm.toFixed(1).replace(".", ",")} km • Ongkir {fmtRp(restaurant.deliveryFee)} • Layanan {fmtRp(restaurant.serviceFee)}
          </p>
          <button
            onClick={() => setInfoOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
          >
            <Info size={16} /> Lihat rincian biaya & pajak
          </button>
        </div>
      </div>

      {cartFromOther && (
        <Notice tone="warning">
          Cart kamu berisi item dari restoran lain. Menambah item di sini akan mengganti keranjang.
        </Notice>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {menu.map((item) => {
          const est = itemAllInEstimate(item.id);
          const net = netPrice(item.id);
          const hasDiscount = item.discount > 0;
          const qty = cartQtyOf(item.id);
          return (
            <li
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-900">
                    {item.isSignature && "⭐ "}
                    {item.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">{item.desc}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    item.taxStatus === "TAXABLE"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.taxStatus === "TAXABLE" ? "Belum termasuk pajak" : "Sudah termasuk pajak"}
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-base font-extrabold text-gray-900">{fmtRp(net)}</span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">{fmtRp(item.listPrice)}</span>
                )}
              </div>

              <PriceNote item={item} est={est} />

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400">{item.id}</span>
                {qty === 0 ? (
                  <Button onClick={() => applyQty(item.id, 1)} className="!px-3 !py-1.5 text-xs">
                    <Plus size={14} /> Tambah
                  </Button>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-2 py-1">
                    <button onClick={() => applyQty(item.id, -1)} aria-label={`Kurangi ${item.name}`} className="p-1 text-brand-700 hover:text-brand-900">
                      <Minus size={16} />
                    </button>
                    <span className="min-w-6 text-center text-sm font-bold text-brand-800">{qty}</span>
                    <button onClick={() => applyQty(item.id, 1)} aria-label={`Tambah ${item.name}`} className="p-1 text-brand-700 hover:text-brand-900">
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {cartCount > 0 && cart.restaurantId === restaurantId && (
        <div className="sticky bottom-20 z-30 mx-auto w-fit">
          <Button onClick={() => navigate({ name: "cart" })}>
            <ShoppingCart size={16} /> Lihat Cart ({cartCount} item)
          </Button>
        </div>
      )}

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} title="Rincian Biaya & Pajak">
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-3">
            <BadgePercent className="mt-0.5 shrink-0 text-brand-600" size={20} />
            <p><strong>Pajak restoran {restaurant.taxRatePct}%.</strong> Hanya item berlabel "Belum termasuk pajak" yang dikenakan pajak.</p>
          </div>
          <div className="flex gap-3">
            <Package className="mt-0.5 shrink-0 text-brand-600" size={20} />
            <p><strong>Biaya kemasan {fmtRp(restaurant.packingFeePerItem)} per item.</strong> Dihitung dari jumlah item yang kamu pesan.</p>
          </div>
          <div className="flex gap-3">
            <Bike className="mt-0.5 shrink-0 text-brand-600" size={20} />
            <p><strong>Ongkos kirim {fmtRp(restaurant.deliveryFee)}.</strong> Tarif tetap sesuai jarak restoran.</p>
          </div>
          <div className="flex gap-3">
            <Receipt className="mt-0.5 shrink-0 text-brand-600" size={20} />
            <p><strong>Biaya layanan {fmtRp(restaurant.serviceFee)}.</strong> Dikenakan sekali per pesanan.</p>
          </div>
        </div>
      </Modal>

      <Modal
        open={confirmSwitch !== null}
        onClose={() => { setConfirmSwitch(null); setPendingQty(null); }}
        title="Ganti keranjang?"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => { setConfirmSwitch(null); setPendingQty(null); }}>
              Batal
            </Button>
            <Button className="flex-1" onClick={confirmSwitchYes}>
              Ganti Keranjang
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-700">
          Cart kamu berisi item dari restoran lain. Mengganti keranjang akan menghapus item sebelumnya.
        </p>
      </Modal>
    </div>
  );
}
