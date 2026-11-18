import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Cart, Profile } from "../data/types";
import { RESTAURANTS } from "../data/mockData";
import { restaurantAllInEstimate, fmtRp } from "../lib/pricing";
import { useApp } from "../App";
import { RestaurantCard } from "../components/RestaurantCard";
import { Button, Notice } from "../components/ui";
function sortAndFilter(
  profile: Profile,
  query: string,
  budgetOnly: boolean,
  cheapestFirst: boolean
) {
  let list = [...RESTAURANTS];
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }
  if (budgetOnly && profile.budget !== null) {
    list = list.filter((r) => {
      const est = restaurantAllInEstimate(r.id);
      if (est === null) return false;
      const projection = profile.spentToday + est;
      return projection * 100 < profile.budget! * 80 || projection <= profile.budget!;
    });
  }
  if (cheapestFirst) {
    list.sort(
      (a, b) =>
        (restaurantAllInEstimate(a.id) ?? 0) -
        (restaurantAllInEstimate(b.id) ?? 0)
    );
  }
  return list;
}

export default function HomeScreen({
  profile,
  onSetProfile,
  onResetProfile,
}: {
  profile: Profile;
  cart: Cart;
  onSetProfile: React.Dispatch<React.SetStateAction<Profile>>;
  onResetProfile: () => void;
}) {
  const { navigate } = useApp();
  const [budgetOnly, setBudgetOnly] = useState(false);
  const [cheapestFirst, setCheapestFirst] = useState(false);
  const [query, setQuery] = useState("");

  const restaurants = sortAndFilter(profile, query, budgetOnly, cheapestFirst);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
        <h1 className="text-lg font-extrabold text-gray-900">
          Halo, Wira 👋
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Temukan makanan yang cocok dengan budget harianmu. Semua estimasi
          sudah termasuk ongkir, pajak, dan biaya.
        </p>
        {profile.budget === null ? (
          <div className="mt-3">
            <Notice>
              Budget harian belum diatur. Atur budget untuk melihat filter dan
              badge kecocokan budget.
            </Notice>
            <Button className="mt-2" onClick={() => onSetProfile((p) => ({ ...p, budget: 50000 }))}>
              Atur Budget Rp50.000
            </Button>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-700">
              Budget: {fmtRp(profile.budget)}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
              Terpakai hari ini: {fmtRp(profile.spentToday)}
            </span>
            <button
              onClick={onResetProfile}
              className="text-xs font-semibold text-gray-400 underline hover:text-gray-600"
            >
              Reset data demo
            </button>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari restoran atau kategori…"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none sm:w-auto sm:flex-1"
            aria-label="Cari restoran"
          />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50">
            <input
              type="checkbox"
              checked={budgetOnly}
              disabled={profile.budget === null}
              onChange={(e) => setBudgetOnly(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            <SlidersHorizontal size={16} /> Sesuai Budget Saya
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50">
            <input
              type="checkbox"
              checked={cheapestFirst}
              onChange={(e) => setCheapestFirst(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            Termurah (all-in)
          </label>
        </div>

        {restaurants.length === 0 ? (
          <Notice>Tidak ada restoran yang cocok dengan filter kamu.</Notice>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {restaurants.map((r) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                profile={profile}
                onOpen={() => navigate({ name: "menu", restaurantId: r.id })}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
