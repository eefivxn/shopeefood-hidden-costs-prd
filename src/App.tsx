import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Home,
  Search,
  ShoppingCart,
  Calculator,
  Wallet,
  UtensilsCrossed,
} from "lucide-react";
import type { Profile } from "./data/types";
import { emptyCart, useCart, useProfile } from "./lib/store";
import { calculate, budgetStatus, fmtRp } from "./lib/pricing";
import HomeScreen from "./screens/Home";
import SearchScreen from "./screens/Search";
import MenuScreen from "./screens/Menu";
import CartScreen from "./screens/Cart";
import CheckoutScreen from "./screens/Checkout";
import ReceiptScreen from "./screens/Receipt";
import { BudgetModal } from "./components/BudgetModal";

type Screen =
  | { name: "home" }
  | { name: "search" }
  | { name: "menu"; restaurantId: string }
  | { name: "cart" }
  | { name: "checkout" }
  | { name: "receipt"; orderId: string; total: number; breakdownJson: string };

export const ADDRESSES = [
  { label: "Kos dekat kampus, Malang (data fiktif)", feeDelta: 0 },
  { label: "Rumah teman di Lowokwaru, Malang (data fiktif)", feeDelta: 3000 },
  { label: "Tempat kerja paruh waktu di Klojen, Malang (data fiktif)", feeDelta: 5000 },
];

function parseHash(): Screen {
  const h = window.location.hash.replace(/^#\/?/, "");
  if (h.startsWith("menu/")) return { name: "menu", restaurantId: h.slice(5) };
  if (h === "search") return { name: "search" };
  if (h === "cart") return { name: "cart" };
  if (h === "checkout") return { name: "checkout" };
  return { name: "home" };
}

interface AppCtx {
  navigate: (s: Screen) => void;
  openBudget: () => void;
  budgetFilterOn: boolean;
  setBudgetFilterOn: (v: boolean) => void;
  addressIdx: number;
  setAddressIdx: (idx: number) => void;
}
const AppContext = createContext<AppCtx | null>(null);
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("AppContext missing");
  return ctx;
};

interface ReceiptData {
  orderId: string;
  total: number;
  breakdownJson: string;
}

export default function App() {
  const { profile, setProfile, resetProfile } = useProfile();
  const [cart, setCart] = useCart();
  const [screen, setScreen] = useState<Screen>(() => parseHash());
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [budgetFilterOn, setBudgetFilterOn] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<ReceiptData | null>(null);
  const [cartNotice, setCartNotice] = useState<string | null>(null);
  const [addressIdx, setAddressIdx] = useState(0);

  useEffect(() => {
    const onHash = () => {
      const s = parseHash();
      if (s.name === "checkout" && lastReceipt === null && cart.lines.length === 0) return;
      setScreen(s);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [lastReceipt, cart.lines.length]);

  const breakdown = useMemo(
    () => calculate(cart, ADDRESSES[addressIdx].feeDelta),
    [cart, addressIdx]
  );
  const remaining = profile.budget !== null ? profile.budget - profile.spentToday : null;
  const status = budgetStatus(profile.spentToday + breakdown.total, profile.budget);

  const navigate = (s: Screen) => {
    const hash =
      s.name === "menu" ? `#/menu/${s.restaurantId}` : s.name === "home" ? "#/" : `#/${s.name}`;
    if (window.location.hash === hash) {
      setScreen(s);
      window.scrollTo(0, 0);
    } else {
      window.location.hash = hash;
    }
  };

  const ctx = useMemo<AppCtx>(
    () => ({
      navigate,
      openBudget: () => setBudgetModalOpen(true),
      budgetFilterOn,
      setBudgetFilterOn,
      addressIdx,
      setAddressIdx,
    }),
    [budgetFilterOn, addressIdx]
  );

  const handlePaid = (data: ReceiptData, newSpentToday: number) => {
    setLastReceipt(data);
    setProfile((p: Profile) => ({ ...p, spentToday: newSpentToday }));
    setCart(emptyCart);
    setAddressIdx(0);
    navigate({ name: "receipt", orderId: data.orderId, total: data.total, breakdownJson: data.breakdownJson });
    setScreen({ name: "receipt", orderId: data.orderId, total: data.total, breakdownJson: data.breakdownJson });
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
            <button
              onClick={() => navigate({ name: "home" })}
              className="flex items-center gap-2 text-left"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
                <UtensilsCrossed size={18} />
              </span>
              <span className="hidden sm:block">
                <span className="block text-sm font-extrabold leading-tight text-gray-900">
                  ShopeeFood TPBG
                </span>
                <span className="block text-xs text-gray-500">
                  Transparansi Harga & Budget Guardrail
                </span>
              </span>
            </button>
            <button
              onClick={() => setBudgetModalOpen(true)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-gray-100"
              aria-label="Pengaturan budget harian"
            >
              <Wallet size={16} className="text-brand-600" />
              {profile.budget !== null ? (
                <span>
                  Sisa budget:{" "}
                  <span className={remaining !== null && remaining < 0 ? "text-red-600" : "text-green-700"}>
                    {remaining !== null ? fmtRp(remaining) : "-"}
                  </span>
                </span>
              ) : (
                <span className="text-gray-600">Atur budget</span>
              )}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-5 pb-24">
          {screen.name === "home" && (
            <HomeScreen
              profile={profile}
              cart={cart}
              onSetProfile={setProfile}
              onResetProfile={resetProfile}
            />
          )}
          {screen.name === "search" && <SearchScreen profile={profile} cart={cart} />}
          {screen.name === "menu" && (
            <MenuScreen
              restaurantId={screen.restaurantId}
              cart={cart}
              setCart={setCart}
            />
          )}
          {screen.name === "cart" && (
            <CartScreen
              cart={cart}
              setCart={setCart}
              profile={profile}
              breakdown={breakdown}
              cartNotice={cartNotice}
              setCartNotice={setCartNotice}
            />
          )}
          {screen.name === "checkout" && (
            <CheckoutScreen
              cart={cart}
              profile={profile}
              setProfile={setProfile}
              breakdown={breakdown}
              onPaid={handlePaid}
            />
          )}
          {screen.name === "receipt" && lastReceipt && (
            <ReceiptScreen
              data={lastReceipt}
              remaining={remaining}
              profile={profile}
            />
          )}
        </main>

        <footer className="mx-auto w-full max-w-5xl px-4 pb-24 pt-2 text-center sm:pb-6">
          <p className="text-xs text-gray-400">
            Prototype akademik. Tidak berafiliasi dengan Shopee/ShopeeFood. Seluruh data bersifat
            fiktif.
          </p>
        </footer>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-stretch justify-around px-2 py-1.5">
            {(
              [
                { id: "home", label: "Home", icon: Home, screen: { name: "home" } as Screen },
                { id: "search", label: "Cari", icon: Search, screen: { name: "search" } as Screen },
                { id: "cart", label: "Cart", icon: ShoppingCart, screen: { name: "cart" } as Screen },
                { id: "checkout", label: "Checkout", icon: Calculator, screen: { name: "checkout" } as Screen },
              ] as const
            ).map(({ id, label, icon: Icon, screen: target }) => {
              const active =
                screen.name === id ||
                (id === "cart" && screen.name === "checkout") ||
                (id === "checkout" && screen.name === "receipt");
              return (
                <button
                  key={id}
                  onClick={() => navigate(target)}
                  className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "text-brand-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="relative">
                    <Icon size={20} />
                    {id === "cart" && cart.lines.length > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                        {cart.lines.reduce((a, l) => a + l.qty, 0)}
                      </span>
                    )}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        </nav>

        <BudgetModal
          open={budgetModalOpen}
          onClose={() => setBudgetModalOpen(false)}
          profile={profile}
          onSave={(budget: number | null) =>
            setProfile((p: Profile) => ({ ...p, budget }))
          }
          onReset={resetProfile}
        />

        {status === "EXCEEDED" && screen.name !== "receipt" && (
          <div className="pointer-events-none fixed inset-x-0 top-16 z-30 mx-auto w-fit rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
            Budget harian terlampaui — cek Budget Tracker
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}
