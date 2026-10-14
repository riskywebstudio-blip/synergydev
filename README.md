# SynergyDev – Website Multi-Halaman

Website statis untuk jasa pembuatan website SynergyDev. Dibuat dengan HTML, Tailwind CSS (via CDN), dan JavaScript vanilla. Tanpa backend dan tanpa framework.

## Cara deploy

**Netlify (drag & drop):** buka app.netlify.com/drop lalu seret seluruh folder `synergydev-website-v3` ke halaman tersebut. Netlify akan membaca `_headers` dan `netlify.toml` secara otomatis.

**Vercel:** impor folder sebagai proyek statis (Framework Preset: Other). Header keamanan di `_headers` perlu dipindahkan ke `vercel.json` jika ingin tetap diterapkan.

Setelah publikasi, cek hasil di:
- https://search.google.com/test/rich-results
- https://pagespeed.web.dev

## Daftar halaman

| File | Isi |
|---|---|
| `index.html` | Beranda: hero, keunggulan, layanan, statistik, FAQ, form kontak |
| `layanan-bisnis.html` | Website Bisnis & Company Profile |
| `layanan-toko.html` | Website Toko Online & Modul |
| `layanan-berita.html` | Portal Berita Berlisensi & Premium |
| `produk.html` | Katalog 13 produk dengan filter dan keranjang |
| `tentang-kami.html` | Mengapa kami, fitur pro, alur kerja, portofolio |
| `promo.html` | Penawaran dan Quiz Pilih Paket |
| `kebijakan-privasi.html` | Kebijakan privasi |
| `404.html` | Halaman tidak ditemukan |

## Cara mengubah konten

- **Produk dan harga:** semua produk disimpan di `assets/products.js` (dipakai keranjang). Teks kartu dan harga di setiap halaman dibuat dari satu sumber. Setelah mengubah harga, ubah juga teks harganya di halaman terkait.
- **Nomor WhatsApp:** cari `6285737681560` di seluruh file HTML dan ganti dengan nomor baru (format 62 tanpa 0 di depan).
- **Email:** cari `syinergydev@gmail.com`.
- **Domain:** cari `ganti-domain-anda.com` di seluruh file, termasuk `sitemap.xml` dan `robots.txt`.
- **Foto:** simpan gambar baru di `assets/` atau `assets/produk/` dalam format WebP, dan usahakan di bawah 300 KB.

## Hal yang perlu dikonfirmasi pemilik sebelum publikasi

1. **Domain** yang akan dipakai, lalu ganti placeholder `ganti-domain-anda.com`.
2. **Ejaan nama usaha:** logo dan konten memakai "SynergyDev", sedangkan prompt awal menulis "SyinergyDev". Pastikan mana yang benar, termasuk untuk email.
3. **Klaim di banner:** "Domain milik sendiri", "Free hosting", dan "Revisi gratis 2x" diambil dari banner promosi. Pastikan layanan tersebut memang berlaku.
4. **Foto portofolio dan banner:** pastikan Anda berhak menggunakannya di website.
5. **Kebijakan privasi:** teks di `kebijakan-privasi.html` adalah draf umum. Periksa sesuai kondisi usaha Anda.
6. **Jam layanan:** tidak ada jam buka yang dicantumkan. Tambahkan jika ada.

## Catatan teknis

- Tailwind dimuat dari CDN sesuai spesifikasi. Untuk produksi dengan skor performa maksimal, pertimbangkan build Tailwind CLI agar CSS hanya berisi kelas yang dipakai.
- Jika konsol browser menampilkan error Content Security Policy dari Tailwind CDN, tambahkan `'unsafe-eval'` pada `script-src` di `_headers`.
- Keranjang disimpan di localStorage browser pengunjung. Tidak ada pembayaran online; pesanan diselesaikan lewat WhatsApp.
- Form kontak dan quiz tidak mengirim data ke server. Isinya dikirim ke WhatsApp melalui tautan `wa.me`.

## Kontak

WhatsApp: +62 857-3768-1560
Email: syinergydev@gmail.com
