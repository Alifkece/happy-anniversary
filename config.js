/* ============================================================
   CONFIG.JS
   ------------------------------------------------------------
   Semua isi & pengaturan website diatur dari file ini.
   Kamu TIDAK PERLU menyentuh index.html, style.css, atau
   script.js untuk mengganti konten. Cukup ubah nilai di bawah.

   Simpan file setelah diubah, lalu refresh browser.
   ============================================================ */

const SITE_CONFIG = {

  /* ----------------------------------------------------------
     1. PASSWORD LOCK SCREEN
     Password bersifat case-sensitive (huruf besar/kecil dibedakan)
  ---------------------------------------------------------- */
  password: "082024",

  /* ----------------------------------------------------------
     2. IDENTITAS UTAMA
  ---------------------------------------------------------- */
  identity: {
    coupleName: "Happy Anniversary Araa",
    eyebrow: "Untuk seseorang yang istimewa",
    heroTitle: "Setiap Detik\nBersamamu",
    heroSubtitle: "adalah kepingan waktu yang ingin selalu kusimpan, dari hari pertama hingga selamanya.",
    heroButtonLabel: "Buka Kisah Kami",
    sinceDate: "14 Februari 2021", // ditampilkan di hero & lock screen
    lockGreeting: "Sebuah persembahan kecil,",
    lockSubGreeting: "khusus untukmu.",
    lockInputPlaceholder: "Masukkan kata kunci"
  },

  /* ----------------------------------------------------------
     3. TEMA / WARNA
     Semua warna bisa diganti dengan kode HEX.
     Website akan otomatis membentuk gradient dari warna ini.
  ---------------------------------------------------------- */
  theme: {
    colorDeep: "#241134",     // ungu tua dominan
    colorPrimary: "#6f4d9c",  // ungu medium
    colorAccent: "#e7a9c4",   // soft pink
    colorSecondary: "#c9b6ff",// lavender
    colorCream: "#f7ecdf",    // cream untuk teks di atas gelap
    colorLight: "#fffaf3",    // putih hangat
    glowOpacity: 0.55
  },

  /* ----------------------------------------------------------
     4. BACKGROUND VIDEO (opsional)
     Aktifkan videoBackground.enabled = true untuk memakai
     video sebagai latar Hero. Simpan file di assets/videos/
  ---------------------------------------------------------- */
  videoBackground: {
    enabled: false,
    file: "assets/videos/background.mp4"
  },

  /* ----------------------------------------------------------
     5. GALLERY - Foto Kenangan
     Simpan file foto ke assets/images/ lalu tulis nama filenya.
  ---------------------------------------------------------- */
  gallery: [
    { file: "assets/images/photo1.jpg", caption: "Awal cerita kita" },
    { file: "assets/images/photo2.jpg", caption: "Senja favorit" },
    { file: "assets/images/photo3.jpg", caption: "Tawa yang tak terlupa" },
    { file: "assets/images/photo4.jpg", caption: "Perjalanan kecil kita" },
    { file: "assets/images/photo5.jpg", caption: "Malam paling hangat" },
    { file: "assets/images/photo6.jpg", caption: "Rumah bernama kamu" }
  ],

  /* ----------------------------------------------------------
     6. LOVE LETTER
     Gunakan \n untuk ganti baris baru dalam surat.
  ---------------------------------------------------------- */
  letter: {
    title: "Sepucuk Surat",
    body: "Kepada kamu, yang selalu punya tempat paling hangat di hatiku,\n\nAda begitu banyak hal yang ingin kukatakan, tapi setiap kali mencoba menuliskannya, semua terasa terlalu kecil untuk menampung rasa ini.\n\nTerima kasih sudah bertahan bersamaku, menemani hari-hari biasa menjadi luar biasa, dan mengubah waktu yang berlalu menjadi kenangan yang ingin selalu kuputar ulang.\n\nSampai kapan pun, aku memilihmu — hari ini, esok, dan di setiap hari sesudahnya.",
    signature: "Selalu milikmu."
  },

  /* ----------------------------------------------------------
     7. TIMELINE - Cerita & Kenangan
  ---------------------------------------------------------- */
  timeline: [
    { date: "Feb 2021", title: "Pertama Bertemu", text: "Pertemuan singkat yang ternyata mengubah segalanya." },
    { date: "Jun 2021", title: "Kencan Pertama", text: "Gugup, canggung, tapi penuh tawa dari awal sampai akhir." },
    { date: "Des 2022", title: "Melewati Badai", text: "Kita belajar bahwa cinta juga tentang bertahan, bukan hanya bahagia." },
    { date: "Feb 2024", title: "Janji Baru", text: "Memilih satu sama lain lagi, dengan cara yang lebih dewasa." },
    { date: "Sekarang", title: "Hari Ini", text: "Masih di sini, masih memilihmu, masih jatuh cinta." }
  ],

  /* ----------------------------------------------------------
     8. QUOTES - Berganti otomatis
  ---------------------------------------------------------- */
  quotes: [
    "Cinta bukan tentang menemukan orang yang sempurna, tapi belajar melihat orang yang tidak sempurna dengan cara yang sempurna.",
    "Bersamamu, waktu terasa lebih lambat dan lebih berarti.",
    "Rumah bukan tempat, rumah adalah kamu.",
    "Setiap kisah punya babnya sendiri, dan kamu adalah bab favoritku.",
    "Aku tidak butuh selamanya, aku hanya butuh kamu, di setiap hari yang ada."
  ],

  /* ----------------------------------------------------------
     9. MUSIC PLAYLIST
     Simpan file MP3 di assets/music/
     cover boleh memakai foto dari assets/images/
  ---------------------------------------------------------- */
  playlist: [
    {
      title: "Track Satu",
      artist: "Artis Favorit",
      src: "assets/music/song1.mp3",
      cover: "assets/images/cover1.jpg"
    },
    {
      title: "Track Dua",
      artist: "Artis Favorit",
      src: "assets/music/song2.mp3",
      cover: "assets/images/cover2.jpg"
    },
    {
      title: "Track Tiga",
      artist: "Artis Favorit",
      src: "assets/music/song3.mp3",
      cover: "assets/images/cover3.jpg"
    }
  ],

  /* ----------------------------------------------------------
     10. ENDING SECTION
  ---------------------------------------------------------- */
  ending: {
    title: "Untuk Selamanya,",
    message: "Terima kasih sudah menjadi alasan senyum paling tulusku. Ini baru permulaan dari banyak bab indah yang akan kita tulis bersama.",
    footerNote: "Dibuat dengan sepenuh hati."
  }
};
