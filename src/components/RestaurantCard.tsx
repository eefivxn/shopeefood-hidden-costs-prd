import { Clock, MapPin } from "lucide-react";
import type { Profile, Restaurant } from "../data/types";
import {
  budgetStatus,
  fmtRp,
  restaurantAllInEstimate,
} from "../lib/pricing";
import { Badge } from "./ui";

export function RestaurantCard({
  restaurant,
  profile,
  onOpen,
}: {
  restaurant: Restaurant;
  profile: Profile;
  onOpen: () => void;
}) {
  const est = restaurantAllInEstimate(restaurant.id);
  const showBadge = profile.budget !== null && est !== null;
  const status = showBadge ? budgetStatus(profile.spentToday + (est ?? 0), profile.budget) : null;

  return (
    <button
      onClick={onOpen}
      className="group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="relative h-36 w-full overflow-hidden sm:h-44">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow">
          {restaurant.category}
        </span>
        {showBadge && status && (
          <span className="absolute right-3 top-3">
            <Badge status={status} />
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900">{restaurant.name}</h3>
        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {restaurant.distanceKm.toFixed(1).replace(".", ",")} km
          </span>
        </div>
        {est !== null && (
          <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">
            Est. {fmtRp(est)}, sudah termasuk ongkir dan biaya
          </p>
        )}
        <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
          <Clock size={12} /> Estimasi dari menu andalan, 1 porsi
        </p>
      </div>
    </button>
  );
}
