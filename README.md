#  ShopeeFood Transparent Pricing & Budget Guardrail (TPBG)

![Phase](https://img.shields.io/badge/Experiment-Phase%201%20(PRD%20Only)-blue)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind%20CSS-ee4d2d)

> **Mata Kuliah:** Rekayasa Interaksi — Teknik Informatika, Universitas Muhammadiyah Malang  
> **Penulis:** Muhammad Arifin (`202310370311054`)

---

##  Ringkasan Proyek
Repositori ini berisi dokumentasi kebutuhan produk (`PRD.md`) dan implementasi prototipe aplikasi web **ShopeeFood Transparent Pricing & Budget Guardrail (TPBG)** yang dibangun menggunakan pendekatan **PRD-Only** (*Fase 1 eksperimen*).

Fitur ini dirancang berdasarkan hasil riset pengguna (*Worksheet 1–8*, Persona **Wira**) untuk mengatasi masalah **Hidden Costs** (ongkos kirim, pajak, biaya kemasan, dan biaya layanan yang baru terlihat saat *checkout*) serta **Cart Abandonment** melalui prinsip transparansi harga di muka dan konsistensi kalkulasi mutlak (**Delta = Rp0**).

---

##  Fitur Utama (`KU-1` – `KU-5`)
* **FR-01 (`KU-1`) Budget-Aware Discovery:** Pengaturan batas anggaran harian, tampilan sisa budget di beranda, serta filter **"Sesuai Budget Saya"** dan urut **"Termurah (all-in)"**.
* **FR-02 (`KU-2`) Upfront Tax & Price Clarity:** Label status pajak eksplisit (*"Belum termasuk pajak"* / *"Sudah termasuk pajak"*), catatan rincian harga di bawah foto menu, serta estimasi harga 1 porsi.
* **FR-03 (`KU-3`) Authoritative Cart Breakdown:** Keranjang belanja sebagai titik hitung final dengan rincian lengkap (subtotal, pajak, kemasan, ongkir, biaya layanan, dan voucher).
* **FR-04 (`KU-4`) Zero-Delta Checkout & Guardrail:** Konsistensi total Cart hingga pembayaran (**Delta = Rp0**) dilengkapi **Budget Tracker** *real-time* dan dialog peringatan jika pesanan melampaui budget harian.
* **FR-05 (`KU-5`) All-Inclusive Card Preview:** Estimasi total harga *all-inclusive* langsung pada kartu restoran di halaman eksplorasi.

---

##  Struktur Dokumen & Kode
* [`PRD.md`](./PRD.md) — *Product Requirements Document* sebagai satu-satunya acuan spesifikasi pada Fase 1.
* `src/` — Kode sumber prototipe aplikasi web responsif (React, Vite, Tailwind CSS).

---
© 2026 Muhammad Arifin — Universitas Muhammadiyah Malang
