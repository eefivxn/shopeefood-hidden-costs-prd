import { useState } from "react";
import type { Cart, Profile } from "../data/types";
import { RESTAURANTS } from "../data/mockData";
import { RestaurantCard } from "../components/RestaurantCard";
import { Notice } from "../components/ui";
import { useApp } from "../App";

export default function SearchScreen({
  profile,
}: {
  profile: Profile;
  cart: Cart;
}) {
  const { navigate } = useApp();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const results = RESTAURANTS.filter(
    (r) =>
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-extrabold text-gray-900">Cari Restoran</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari restoran atau kategori…"
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
        aria-label="Cari restoran atau kategori"
      />
      {results.length === 0 ? (
        <Notice>Tidak ada restoran yang cocok dengan pencarian kamu.</Notice>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {results.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              profile={profile}
              onOpen={() => navigate({ name: "menu", restaurantId: r.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
