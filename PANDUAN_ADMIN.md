# Panduan Admin Website – SynergyDev

Dokumen ini membantu Anda mengelola website secara mandiri setelah proyek selesai.

## 1. Mengganti teks
Buka file `index.html` dengan editor teks (misalnya VS Code), cari teks yang ingin diubah, lalu simpan. Teks harga, nomor WhatsApp, dan email juga ada di bagian ini.

## 2. Mengganti nomor WhatsApp
Cari `6285737681560` pada file `index.html` dan ganti dengan nomor baru dalam format internasional (62 + nomor tanpa 0 di depan). Contoh: 0812-xxxx menjadi 62812xxxx.

## 3. Mengganti gambar
- Simpan gambar baru di folder `assets/`.
- Gunakan format WebP atau JPG, dan usahakan ukuran di bawah 300 KB.
- Ubah nama file pada atribut `src` di `index.html`.

## 4. Menambah atau mengubah portofolio
Salin satu blok `<a class="portfolio-item">` di bagian `#portofolio`, lalu ubah URL dan nama proyek.

## 5. Mengganti domain
Lakukan "cari dan ganti" pada seluruh file untuk teks `https://ganti-domain-anda.com` menjadi domain Anda. File yang terdampak: `index.html`, `robots.txt`, `sitemap.xml`.

## 6. Publikasi ulang (deploy)
- Netlify: seret (drag & drop) seluruh folder ke dashboard Netlify, atau hubungkan repository Git agar otomatis terbit saat ada perubahan.
- Setelah publikasi, cek ulang di https://search.google.com/test/rich-results dan https://pagespeed.web.dev.

## 7. Hal yang sebaiknya tidak diubah
- Blok `<script type="application/ld+json">` kecuali Anda paham struktur data-nya.
- File `_headers` (pengaturan keamanan).

## Bantuan
WhatsApp: +62 857-3768-1560
Email: syinergydev@gmail.com

## 8. Mengelola produk di katalog
Setiap produk adalah satu blok `<article class="product">` di bagian `#produk` pada `index.html`.
- Judul: teks di dalam `<h3>`.
- Harga: ubah dua tempat: `data-price="..."` (angka tanpa titik, contoh 1000000) dan teks `<strong>Rp1.000.000</strong>` (format rupiah dengan titik).
- Deskripsi: paragraf `<p class="product-desc">`.
- Fitur: daftar `<li>` di dalam `<details class="product-detail">`.
- Foto: file di `assets/produk/`, ubah nama file pada `src`.
- Kategori filter: atribut `data-cat` (bisnis, toko, berita, landing, custom, maintenance, layanan).
- Produk berulang (maintenance/perpanjangan): atur `data-recurring="1"`.
- ID unik: atribut `data-id` dan `data-add` harus sama dan tidak boleh dipakai dua kali.

Keranjang disimpan di browser pengunjung, dan tombol "Pesan via WhatsApp" membuka chat berisi daftar pesanan.
