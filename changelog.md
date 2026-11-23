# Changelog

Semua iterasi pengembangan proyek **ShopeeFood Transparent Pricing and Budget Guardrail (TPBG)** dicatat secara kronologis dalam dokumen ini, mulai dari inisialisasi awal, dokumentasi spesifikasi produk (PRD), implementasi prototipe, hingga penyesuaian logika kalkulasi dan antarmuka pengguna (UI).

---

## [Iterasi 1] - Initial Commit
- **Commit:** `36e7d90`
- **Tanggal:** 18 November 2026
- **Deskripsi:** Inisialisasi awal repositori proyek.
- **Rincian Perubahan:**
  - Pembuatan repositori `shopeefood-hidden-costs-prd`.
  - Penambahan berkas dasar `README.md` sebagai deskripsi awal repositori eksperimen Fase 1 (PRD-Only).

---

## [Iterasi 2] - Dokumentasi Proyek & Spesifikasi Fitur Utama
- **Commit:** `6e07647`
- **Tanggal:** 18 November 2026
- **Deskripsi:** Pembaruan `README.md` dengan detail proyek dan fitur.
- **Rincian Perubahan:**
  - Penambahan metadata akademis: Mata kuliah Rekayasa Interaksi, Teknik Informatika, Universitas Muhammadiyah Malang, dan data mahasiswa (Muhammad Arifin - NIM `202310370311054`).
  - Ringkasan latar belakang riset pengguna (*Worksheet 1–8*, Persona Wira) terkait permasalahan *Hidden Costs* dan *Cart Abandonment*.
  - Pendefinisian 5 Kebutuhan Utama (`KU-1` – `KU-5`) / *Functional Requirements* (`FR-01` – `FR-05`):
    - `KU-1` / `FR-01`: *Budget-Aware Discovery* (pengaturan batas anggaran harian, pelacakan sisa anggaran di beranda, filter "Sesuai Budget Saya", urut harga termurah all-in).
    - `KU-2` / `FR-02`: *Upfront Tax & Price Clarity* (label status pajak eksplisit sebelum checkout, catatan rincian harga per porsi).
    - `KU-3` / `FR-03`: *Authoritative Cart Breakdown* (keranjang belanja sebagai titik hitung final dengan rincian biaya lengkap: subtotal, pajak, kemasan, ongkir, layanan, voucher).
    - `KU-4` / `FR-04`: *Zero-Delta Checkout & Guardrail* (konsistensi mutlak kalkulasi harga antara Cart, Checkout, dan Pembayaran dengan Delta = Rp0, disertai dialog guardrail peringatan anggaran).
    - `KU-5` / `FR-05`: *All-Inclusive Card Preview* (estimasi harga total all-in langsung pada kartu restoran di beranda).
  - Penataan struktur dokumen dan acuan kode sumber.

---

## [Iterasi 3] - Publikasi Dokumen Spesifikasi Kebutuhan Produk (PRD v1.0.0)
- **Commit:** `892dbc1`
- **Tanggal:** 18 November 2026
- **Deskripsi:** Unggah dokumen lengkap `PRD.md` (*Product Requirements Document*).
- **Rincian Perubahan:**
  - Penyusunan 9 bagian spesifikasi produk yang komprehensif:
    1. **Document Overview & Metadata Proyek**: Penentuan ruang lingkup Fase 1 PRD-Only.
    2. **Background & Problem Framing**: Analisis akar masalah biaya tak terduga, degradasi transparansi, dan fenomena pengabaian keranjang belanja.
    3. **Target Persona & Context of Use**: Profil Mahasiswa Rantau Hemat (Wira, 21 tahun) beserta skenario belanja.
    4. **Strategic Objectives & Success Metrics**: Target rasio *drop-off* pasca-checkout, konsistensi kalkulasi (Delta = Rp0), dan kepuasan transparansi harga.
    5. **Scope & Feature Set**: Definisi fungsional `FR-01` hingga `FR-05` beserta batasan *out-of-scope*.
    6. **Business Rules & Authoritative Calculation Engine**: Aturan baku formula kalkulasi harga subtotal, pajak, biaya kemasan, ongkos kirim, biaya layanan platform, diskon voucher, dan toleransi pembulatan.
    7. **User Stories & Acceptance Criteria**: Kriteria penerimaan terperinci per fitur fungsional.
    8. **Non-Functional Requirements**: Standar performa responsivitas, aksesibilitas, konsistensi kalkulasi, dan privasi penyimpanan data lokal.
    9. **Implementation Constraints**: Batasan teknis arsitektur client-side tanpa backend dan persistensi local storage.

---

## [Iterasi 4] - Implementasi Prototipe TPBG (React, Vite, Tailwind CSS)
- **Commit:** `dbde0b6`
- **Tanggal:** 18 November 2026
- **Deskripsi:** `feat: implement TPBG prototype (React, Vite, Tailwind) from PRD v1.0.0`
- **Rincian Perubahan:**
  - **Infrastruktur & Build Setup:**
    - Konfigurasi `package.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, dan `tsconfig.json`.
    - Setup dependencies: React 18, React DOM, Lucide React (ikonografi), Tailwind CSS, TypeScript.
  - **Arsitektur State & Navigasi:**
    - Implementasi navigasi SPA berbasis hash (`#search`, `#cart`, `#checkout`, `#menu/:id`, `#receipt`) tanpa dependensi eksternal berat di `src/App.tsx`.
    - Penyimpanan state lokal persistens di `src/lib/store.ts` (`localStorage`) untuk keranjang (`Cart`), pengaturan profil anggaran harian (`Profile`), dan pelacakan pengeluaran hari ini.
  - **Data Tiruan (*Mock Data*):**
    - `src/data/mockData.ts` & `src/data/types.ts`: Definisi 6 mitra restoran di area Malang dengan konfigurasi tarif pajak eksplisit (PB1 10% atau bebas pajak), biaya kemasan per restoran, jarak pengiriman, daftar menu makanan/minuman, serta voucher makanan dan gratis ongkir.
  - **Mesin Perhitungan Transparan (*Authoritative Pricing Engine*):**
    - `src/lib/pricing.ts`: Implementasi fungsi kalkulasi baku `calculate()` yang menghitung subtotal, pajak riil di muka, biaya kemasan restoran, estimasi ongkir berdasar jarak, biaya layanan platform, pemotongan voucher, dan penentuan status budget (`safe`, `warning`, `exceeded`).
  - **Komponen UI Modular:**
    - `src/components/ui.tsx`: Komponen dasar reusable (`Header`, `Badge`, `Button`, `Modal`, `Notice`).
    - `src/components/RestaurantCard.tsx`: Komponen kartu restoran dengan indikator status pajak, preview estimasi all-inclusive harga 1 porsi, dan badge kecocokan budget.
    - `src/components/BudgetModal.tsx`: Modal interaktif untuk mengatur/mengubah target budget harian serta mereset pengeluaran harian.
  - **Halaman Aplikasi (*Screens*):**
    - `src/screens/Home.tsx`: Dasbor utama dengan tracker budget harian (sisa vs terpakai), filter kategori cepat, toggle "Sesuai Budget Saya", dan daftar restoran.
    - `src/screens/Search.tsx`: Pencarian real-time nama makanan dan restoran, filter budget, serta penyortiran harga all-in.
    - `src/screens/Menu.tsx`: Tampilan daftar menu per restoran, banner kejelasan status pajak, stepper kuantitas item, dialog konfirmasi ganti restoran, dan bar ringkasan keranjang melayang.
    - `src/screens/Cart.tsx`: Keranjang belanja terperinci dengan pemecahan komponen biaya secara lengkap (subtotal, pajak, kemasan, ongkir, biaya layanan, voucher) serta peringatan guardrail budget.
    - `src/screens/Checkout.tsx`: Halaman konfirmasi checkout dengan verifikasi mutlak Zero-Delta, pemilihan metode pembayaran, dan dialog peringatan guardrail jika total pesanan melampaui sisa budget.
    - `src/screens/Receipt.tsx`: Struk pembayaran final yang memvalidasi konsistensi Delta Rp0 dan pembaruan sisa anggaran harian.

---

## [Iterasi 5] - Perbaikan Logika Pergantian Restoran, Alamat Pengiriman & Alur Guardrail
- **Commit:** `61abe75`
- **Tanggal:** 19 November 2026
- **Deskripsi:** `fix: resolve restaurant switch cart reset and exceeded budget edit redirect`
- **Rincian Perubahan:**
  - **Simulasi Alamat Pengiriman Dinamis (`ADDRESSES`):**
    - Penambahan 3 pilihan alamat tujuan simulasi di Malang (Kos dekat kampus: delta Rp0, Rumah teman di Lowokwaru: +Rp3.000, Tempat kerja di Klojen: +Rp5.000) pada `src/App.tsx`.
    - Sinkronisasi perubahan ongkos kirim berdasarkan alamat yang dipilih ke mesin kalkulasi (`pricing.ts`), Cart, dan Checkout.
  - **Perbaikan Pergantian Restoran (`Menu.tsx`):**
    - Memperbaiki penanganan reset keranjang saat pengguna berpindah restoran: memastikan seluruh item restoran lama dan indeks alamat tereset dengan benar ke item restoran baru.
  - **Penyempurnaan Alur Modal Guardrail Anggaran (`Checkout.tsx`):**
    - Memperbaiki alur tombol "Edit Pesanan" (mengembalikan pengguna ke layar Cart dengan status yang tersinkronisasi) dan tombol "Tetap Lanjut" (meneruskan riwayat data pengeluaran `spentBefore`, `spentAfter`, `budget`, dan penanda `exceeded` ke struk).
  - **Peningkatan Layar Struk (`Receipt.tsx`):**
    - Penambahan ringkasan komparasi pengeluaran sebelum vs sesudah transaksi serta tampilan nominal kelebihan belanja secara eksplisit jika melebihi budget harian.
    - Penambahan badge konfirmasi keberhasilan: *"Zero-Delta terverifikasi: Total Cart = Total Checkout = Jumlah Pembayaran (Delta Rp0)"*.
  - **Polesan Aksesibilitas & UI Footer:**
    - Penambahan catatan *disclaimer* akademik di bagian footer `App.tsx` (*"Prototype akademik. Tidak berafiliasi dengan Shopee/ShopeeFood. Seluruh data bersifat fiktif"*).
    - Penambahan atribut `role` fleksibel pada komponen `Notice` untuk meningkatkan kepatuhan standar aksesibilitas web.
