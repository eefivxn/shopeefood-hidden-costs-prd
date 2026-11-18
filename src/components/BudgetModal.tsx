import { useEffect, useState } from "react";
import type { Profile } from "../data/types";
import { WIRA_DEFAULT } from "../data/mockData";
import { fmtRp } from "../lib/pricing";
import { Button, Modal, Notice } from "./ui";

export function BudgetModal({
  open,
  onClose,
  profile,
  onSave,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  onSave: (budget: number | null) => void;
  onReset: () => void;
}) {
  const [value, setValue] = useState(profile.budget?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValue(profile.budget?.toString() ?? "");
      setError(null);
    }
  }, [open, profile.budget]);

  const save = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Budget tidak boleh kosong. Masukkan angka dalam Rupiah.");
      return;
    }
    if (!/^\d+$/.test(trimmed)) {
      setError("Budget harus berupa bilangan bulat tanpa desimal.");
      return;
    }
    const n = parseInt(trimmed, 10);
    if (n < 10000 || n > 500000) {
      setError("Budget harus di antara Rp10.000 dan Rp500.000.");
      return;
    }
    onSave(n);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Budget Makan Harian"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button className="flex-1" onClick={save}>
            Simpan
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-800">
            Budget harian (Rupiah)
          </span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            placeholder="50000"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            aria-label="Budget harian dalam Rupiah"
          />
        </label>
        <p className="text-xs text-gray-500">
          Minimal Rp10.000, maksimal Rp500.000. Contoh: {fmtRp(50000)}.
        </p>
        {error && (
          <p role="alert" className="text-xs font-semibold text-red-600">
            {error}
          </p>
        )}
        <div className="border-t border-gray-100 pt-3">
          <Notice>
            Pengeluaran hari ini: <strong>{fmtRp(profile.spentToday)}</strong>. Profil
            default Wira: budget {fmtRp(WIRA_DEFAULT.budget)}, pengeluaran{" "}
            {fmtRp(WIRA_DEFAULT.spentToday)}.
          </Notice>
        </div>
        <button
          onClick={() => {
            onReset();
            onClose();
          }}
          className="text-xs font-semibold text-gray-400 underline hover:text-red-600"
        >
          Reset data demo ke profil awal
        </button>
      </div>
    </Modal>
  );
}
