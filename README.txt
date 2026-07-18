====================================================================
  WEBSITE ROMANTIS PERSONAL — PANDUAN PENGGUNAAN
====================================================================

Terima kasih sudah menggunakan project ini. Website ini dibuat
100% dengan HTML, CSS, dan Vanilla JavaScript — tanpa framework,
tanpa CDN, dan bisa berjalan sepenuhnya OFFLINE.

Desain terinspirasi dari nuansa romantis-dreamy-premium, namun
seluruh tampilan, warna, tipografi, dan aset dibuat original.


--------------------------------------------------------------
1. CARA MENJALANKAN WEBSITE
--------------------------------------------------------------

Karena browser modern membatasi akses file lokal (khususnya audio
dan modul JavaScript), disarankan menjalankan lewat local server
sederhana, BUKAN dengan cara double-click index.html langsung.

Pilih salah satu cara berikut:

A) Menggunakan Python (jika sudah terinstal di komputer)
   1. Buka folder project ini lewat Command Prompt / Terminal.
   2. Jalankan perintah:
        python -m http.server 8000
   3. Buka browser, akses:
        http://localhost:8000

B) Menggunakan Extension "Live Server" di VS Code
   1. Buka folder project di VS Code.
   2. Install extension bernama "Live Server".
   3. Klik kanan index.html -> "Open with Live Server".

C) Upload ke hosting statis (Netlify, Vercel, GitHub Pages, dsb.)
   Tinggal upload seluruh isi folder ini apa adanya.

Catatan: jika dibuka langsung dengan cara double-click (file://),
sebagian browser akan memblokir audio/gambar karena kebijakan
keamanan CORS. Jika itu terjadi, gunakan salah satu cara di atas.


--------------------------------------------------------------
2. STRUKTUR FOLDER
--------------------------------------------------------------

index.html        -> struktur halaman (tidak perlu diubah)
style.css         -> semua tampilan visual (tidak perlu diubah)
script.js         -> semua logic interaktif (tidak perlu diubah)
config.js         -> SEMUA KONTEN & PENGATURAN ada di sini
assets/images/    -> tempat menyimpan foto & cover album
assets/music/     -> tempat menyimpan file lagu (.mp3)
assets/videos/    -> tempat menyimpan video background (opsional)
assets/icons/     -> ikon SVG (tidak perlu diubah)
fonts/            -> font lokal (tidak perlu diubah)

PENTING: Untuk mengganti isi website, kamu HANYA perlu membuka
dan mengedit file "config.js" dengan text editor apa saja
(Notepad, VS Code, Sublime Text, dll). Tidak perlu menyentuh
file HTML/CSS/JS lainnya.


--------------------------------------------------------------
3. CARA MENGGANTI FOTO
--------------------------------------------------------------

1. Simpan foto ke folder: assets/images/
   (format .jpg atau .png, disarankan ukuran tidak terlalu besar
    agar website tetap ringan, idealnya di bawah 1MB per foto)

2. Buka config.js, cari bagian:

     gallery: [
       { file: "assets/images/photo1.jpg", caption: "Awal cerita kita" },
       ...
     ]

3. Ganti "photo1.jpg" dengan nama file fotomu, dan ubah teks
   "caption" sesuai keterangan yang kamu inginkan.

4. Kamu bisa menambah atau menghapus baris untuk menambah/
   mengurangi jumlah foto di galeri.


--------------------------------------------------------------
4. CARA MENGGANTI LAGU / PLAYLIST
--------------------------------------------------------------

1. Simpan file lagu (.mp3) ke folder: assets/music/

2. Buka config.js, cari bagian:

     playlist: [
       {
         title: "Track Satu",
         artist: "Artis Favorit",
         src: "assets/music/song1.mp3",
         cover: "assets/images/cover1.jpg"
       },
       ...
     ]

3. Ganti title, artist, src (nama file lagu), dan cover
   (foto sampul album, taruh di assets/images/) sesuai lagu
   milikmu.

4. Tambah/hapus objek di dalam kurung kurawal {} untuk
   menambah atau mengurangi jumlah lagu di playlist.


--------------------------------------------------------------
5. CARA MENGGANTI PASSWORD LOCK SCREEN
--------------------------------------------------------------

Buka config.js, baris paling atas:

     password: "aliftzy",

Ganti teks di dalam tanda kutip dengan password baru yang kamu
inginkan. Password bersifat case-sensitive (huruf besar/kecil
dianggap berbeda).


--------------------------------------------------------------
6. CARA MENGGANTI BACKGROUND / TEMA WARNA
--------------------------------------------------------------

Buka config.js, cari bagian "theme":

     theme: {
       colorDeep: "#241134",
       colorPrimary: "#6f4d9c",
       colorAccent: "#e7a9c4",
       colorSecondary: "#c9b6ff",
       colorCream: "#f7ecdf",
       colorLight: "#fffaf3",
       glowOpacity: 0.55
     }

Ganti kode warna HEX (#xxxxxx) sesuai keinginanmu. Seluruh
aurora background, gradient, glow, dan warna tombol akan
menyesuaikan otomatis mengikuti tema ini.


--------------------------------------------------------------
7. CARA MENGGUNAKAN VIDEO BACKGROUND (opsional)
--------------------------------------------------------------

1. Simpan video (.mp4) ke folder: assets/videos/
2. Buka config.js, cari bagian:

     videoBackground: {
       enabled: false,
       file: "assets/videos/background.mp4"
     }

3. Ubah enabled menjadi true, dan sesuaikan nama file video
   pada bagian "file".


--------------------------------------------------------------
8. CARA MENGGANTI TEKS LAINNYA
     (nama, judul, subtitle, surat, quotes, timeline, ending)
--------------------------------------------------------------

Semua teks tersebut ada di config.js, dengan nama bagian yang
mudah dikenali:

  identity  -> nama pasangan, judul hero, tanggal jadian, dll
  letter    -> isi surat cinta (gunakan \n untuk ganti baris)
  timeline  -> daftar momen/cerita perjalanan kalian
  quotes    -> kalimat singkat yang berganti otomatis
  ending    -> pesan penutup di akhir halaman

Edit teks di dalam tanda kutip " " sesuai keinginanmu, lalu
simpan file dan refresh browser.


--------------------------------------------------------------
9. TIPS
--------------------------------------------------------------

- Selalu simpan file config.js dalam format UTF-8 supaya emoji
  atau karakter khusus tidak rusak (opsional, karena emoji
  memang sengaja tidak dipakai di UI ini).
- Kompres foto & video sebelum dipakai supaya website tetap
  cepat dibuka (disarankan pakai TinyPNG atau HandBrake).
- Jangan mengubah nama variabel di config.js (seperti "gallery",
  "playlist", "theme"), cukup ubah isinya saja.
- Jika salah satu foto/lagu belum ditambahkan, website tetap
  akan berjalan normal tanpa error, item tersebut hanya akan
  disembunyikan otomatis.


--------------------------------------------------------------
Selamat mencoba, semoga hasilnya membuat orang spesial kalian
tersenyum. :)
--------------------------------------------------------------
