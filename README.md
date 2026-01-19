# 🥤 Vending Machine Web App

Aplikasi **Vending Machine berbasis web** yang mensimulasikan mesin penjual otomatis.  
Dibangun menggunakan **React**, **Tailwind CSS**, dan **json-server** sebagai database lokal.

Aplikasi ini memungkinkan pengguna:
- Memasukkan uang dengan nominal tertentu
- Membeli produk jika saldo mencukupi
- Mendapatkan uang kembalian
- Melihat riwayat transaksi  
Serta menyediakan **halaman admin** untuk mengelola produk (CRUD).

---

## ✨ Fitur Utama

### 🧃 Vending Machine
- Menampilkan **5 produk** (makanan/minuman)
- Informasi produk:
  - Gambar
  - Nama
  - Harga
  - Stok
- Simulasi uang masuk:
  - Rp2.000
  - Rp5.000
  - Rp10.000
  - Rp20.000
  - Rp50.000
- Saldo ditampilkan secara real-time
- Tombol cancel

### 🛒 Pembelian Produk
- Validasi:
  - Saldo tidak cukup
  - Stok habis
- Stok otomatis berkurang setelah pembelian
- Menampilkan uang kembalian
- Menyimpan transaksi ke database

### 🧑‍💼 Admin Panel
- Tambah produk
- Ubah produk
- Hapus produk
- Menggunakan popup (modal)

### 📜 History Transaksi
- Menampilkan riwayat pembelian
- Informasi:
  - Nama produk
  - Gambar produk
  - Tanggal transaksi

---

## 🛠️ Teknologi yang Digunakan

- React (Vite)
- Tailwind CSS
- Axios
- json-server
- React Router
- React Toastify
- Day.js

---

## 📦 Penggunaan

### 1. Install dependency
```bash
npm install
```

### 2. Buat file .env

### 3. Jalankan json-server
```bash
npx json-server ./src/db.json
```

### 4. Jalankan aplikasi
```bash
npm run dev
```