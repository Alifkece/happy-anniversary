/* ============================================================
   SCRIPT.JS
   ------------------------------------------------------------
   Semua logic interaktif website: splash -> lock -> envelope ->
   hero, music player, gallery modal, timeline reveal, quotes,
   dan love-letter typing animation.

   Semua konten diambil dari SITE_CONFIG (config.js).
   Kode ini modular: setiap fitur punya fungsi init sendiri,
   dipanggil dari initApp() di bagian paling bawah file.
   ============================================================ */

(function () {
  "use strict";

  /* ------------------------------------------------------------
     0. STATE GLOBAL
  ------------------------------------------------------------ */
  const state = {
    galleryIndex: 0,
    currentTrack: 0,
    isPlaying: false,
    isRepeat: false,
    isShuffle: false,
    audioCtxUnlocked: false
  };

  /* ------------------------------------------------------------
     1. TERAPKAN TEMA WARNA DARI CONFIG -> CSS VARIABLES
  ------------------------------------------------------------ */
  function applyTheme() {
    const t = SITE_CONFIG.theme || {};
    const root = document.documentElement.style;
    if (t.colorDeep) root.setProperty("--deep", t.colorDeep);
    if (t.colorPrimary) root.setProperty("--primary", t.colorPrimary);
    if (t.colorAccent) root.setProperty("--accent", t.colorAccent);
    if (t.colorSecondary) root.setProperty("--secondary", t.colorSecondary);
    if (t.colorCream) root.setProperty("--cream", t.colorCream);
    if (t.colorLight) root.setProperty("--light", t.colorLight);
    if (typeof t.glowOpacity === "number") root.setProperty("--glow-opacity", t.glowOpacity);
  }

  /* ------------------------------------------------------------
     2. TERAPKAN TEKS / KONTEN DARI CONFIG KE HTML
  ------------------------------------------------------------ */
  function applyContent() {
    const id = SITE_CONFIG.identity || {};

    setText("splashEyebrow", "Sedang menyiapkan sesuatu");
    setText("lockGreeting", id.lockGreeting);
    setText("lockSubGreeting", id.lockSubGreeting);
    setText("lockDate", id.sinceDate ? "Bersama sejak " + id.sinceDate : "");
    setPlaceholder("lockInput", id.lockInputPlaceholder);

    setText("heroEyebrow", id.eyebrow);
    setText("heroTitle", id.heroTitle);
    setText("heroSubtitle", id.heroSubtitle);
    setText("heroButtonLabel", id.heroButtonLabel);

    const letter = SITE_CONFIG.letter || {};
    setText("letterTitle", letter.title);
    setText("letterSignature", letter.signature);

    const ending = SITE_CONFIG.ending || {};
    setText("endingTitle", ending.title);
    setText("endingMessage", ending.message);
    setText("endingFooter", ending.footerNote);

    document.title = (id.coupleName || "Untuk Kamu");

    // Video background opsional
    const vb = SITE_CONFIG.videoBackground || {};
    if (vb.enabled && vb.file) {
      const video = document.getElementById("heroVideo");
      const source = document.createElement("source");
      source.src = vb.file;
      source.type = "video/mp4";
      video.appendChild(source);
      video.classList.remove("hidden");
      video.play().catch(() => {});
    }
  }

  function setText(elId, value) {
    const el = document.getElementById(elId);
    if (el && value !== undefined) el.textContent = value;
  }
  function setPlaceholder(elId, value) {
    const el = document.getElementById(elId);
    if (el && value !== undefined) el.setAttribute("placeholder", value);
  }

  /* ------------------------------------------------------------
     3. AURORA BACKGROUND (canvas) — signature ambient effect
     Beberapa blob radial-gradient lembut yang bergerak perlahan
     mengikuti fungsi sinus, dilapis dengan blur besar oleh CSS.
  ------------------------------------------------------------ */
  function initAurora() {
    const canvas = document.getElementById("auroraCanvas");
    const ctx = canvas.getContext("2d");
    let w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }
    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { color: "111,77,156", rx: 0.35, ry: 0.25, speed: 0.00025, radius: 0.55, phase: 0 },
      { color: "231,169,196", rx: 0.7, ry: 0.65, speed: 0.0002, radius: 0.5, phase: 2 },
      { color: "201,182,255", rx: 0.5, ry: 0.8, speed: 0.00018, radius: 0.45, phase: 4 }
    ];

    let raf;
    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      blobs.forEach((b) => {
        const x = (b.rx + 0.12 * Math.sin(time * b.speed + b.phase)) * w;
        const y = (b.ry + 0.12 * Math.cos(time * b.speed * 1.3 + b.phase)) * h;
        const r = b.radius * Math.min(w, h);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${b.color},0.55)`);
        grad.addColorStop(1, `rgba(${b.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    // Hemat resource kalau tab tidak aktif
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    });
  }

  /* ------------------------------------------------------------
     4. FLOATING PARTICLES (debu cahaya lembut naik ke atas)
  ------------------------------------------------------------ */
  function initParticles() {
    const field = document.getElementById("particleField");
    const count = window.innerWidth < 640 ? 16 : 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = 2 + Math.random() * 4;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
      const duration = 10 + Math.random() * 14;
      p.style.animationDuration = duration + "s";
      p.style.animationDelay = (Math.random() * duration) + "s";
      field.appendChild(p);
    }
  }

  /* ------------------------------------------------------------
     5. SPLASH SCREEN — progress bar simulasi loading
  ------------------------------------------------------------ */
  function runSplash(onDone) {
    const fill = document.getElementById("splashBarFill");
    const percentLabel = document.getElementById("splashPercent");
    let progress = 0;

    const timer = setInterval(() => {
      // Loading terasa natural: cepat di awal, melambat mendekati 100%
      const step = progress < 70 ? Math.random() * 12 + 6 : Math.random() * 4 + 1;
      progress = Math.min(100, progress + step);
      fill.style.width = progress + "%";
      percentLabel.textContent = Math.floor(progress) + "%";

      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(onDone, 420);
      }
    }, 140);
  }

  /* ------------------------------------------------------------
     6. TRANSISI ANTAR LAYER (splash / lock / envelope / main)
  ------------------------------------------------------------ */
  function switchLayer(hideEl, showEl, callback) {
    if (hideEl) {
      hideEl.classList.add("layer-exit");
      setTimeout(() => {
        hideEl.classList.add("hidden");
        hideEl.classList.remove("layer-exit");
      }, 700);
    }
    if (showEl) {
      showEl.classList.remove("hidden");
      // paksa reflow supaya transisi fade-in berjalan
      void showEl.offsetWidth;
    }
    if (callback) setTimeout(callback, hideEl ? 350 : 0);
  }

  /* ------------------------------------------------------------
     7. LOCK SCREEN — validasi password
  ------------------------------------------------------------ */
  function initLockScreen() {
    const form = document.getElementById("lockForm");
    const input = document.getElementById("lockInput");
    const errorMsg = document.getElementById("lockError");
    const lockIcon = document.getElementById("lockIcon");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const correctPassword = (SITE_CONFIG.password || "").toString();
      const entered = input.value;

      if (entered.length > 0 && entered === correctPassword) {
        // Password benar
        errorMsg.classList.remove("is-visible");
        lockIcon.classList.remove("icon-lock");
        lockIcon.classList.add("icon-unlock", "is-unlocked");
        input.blur();

        setTimeout(() => {
          const lockScreen = document.getElementById("lockScreen");
          const envelopeScreen = document.getElementById("envelopeScreen");
          switchLayer(lockScreen, envelopeScreen);
          playEnvelopeSequence();
        }, 500);
      } else {
        // Password salah -> shake + pesan error
        errorMsg.classList.add("is-visible");
        form.classList.remove("is-shaking");
        void form.offsetWidth;
        form.classList.add("is-shaking");
        input.value = "";
        input.focus();
      }
    });
  }

  /* ------------------------------------------------------------
     8. ENVELOPE / GIFT OPENING SEQUENCE (2.5 detik) -> Hero
  ------------------------------------------------------------ */
  function playEnvelopeSequence() {
    setTimeout(() => {
      const envelopeScreen = document.getElementById("envelopeScreen");
      const mainSite = document.getElementById("mainSite");

      envelopeScreen.classList.add("layer-exit");
      setTimeout(() => {
        envelopeScreen.classList.add("hidden");
        mainSite.classList.remove("hidden");
        document.body.style.overflow = "auto";

        // Mulai musik setelah user resmi "masuk"
        startMusicAfterEntry();

        // Tampilkan player & jalankan reveal animasi hero
        document.getElementById("musicPlayer").classList.remove("hidden");
        requestAnimationFrame(() => {
          document.querySelectorAll(".hero-section .reveal").forEach((el) => {
            el.classList.add("is-visible");
          });
        });
      }, 650);
    }, 2600); // durasi animasi gift/envelope opening
  }

  /* ------------------------------------------------------------
     9. RENDER GALLERY dari config + IntersectionObserver reveal
  ------------------------------------------------------------ */
  function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    const photos = SITE_CONFIG.gallery || [];
    grid.innerHTML = "";

    photos.forEach((photo, index) => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.dataset.index = index;

      const img = document.createElement("img");
      img.src = photo.file;
      img.alt = photo.caption || "Foto kenangan";
      img.loading = "lazy";
      img.onerror = function () { this.parentElement.style.display = "none"; };

      const caption = document.createElement("p");
      caption.className = "gallery-caption";
      caption.textContent = photo.caption || "";

      item.appendChild(img);
      item.appendChild(caption);
      item.addEventListener("click", () => openGalleryModal(index));
      grid.appendChild(item);
    });

    observeReveal(grid.querySelectorAll(".gallery-item"));
  }

  /* Gallery Modal dengan navigasi + swipe */
  function initGalleryModal() {
    const modal = document.getElementById("galleryModal");
    const img = document.getElementById("modalImage");
    const caption = document.getElementById("modalCaption");

    document.getElementById("modalClose").addEventListener("click", closeGalleryModal);
    document.getElementById("modalNext").addEventListener("click", () => stepGallery(1));
    document.getElementById("modalPrev").addEventListener("click", () => stepGallery(-1));
    modal.addEventListener("click", (e) => { if (e.target === modal) closeGalleryModal(); });
    document.addEventListener("keydown", (e) => {
      if (modal.classList.contains("hidden")) return;
      if (e.key === "Escape") closeGalleryModal();
      if (e.key === "ArrowRight") stepGallery(1);
      if (e.key === "ArrowLeft") stepGallery(-1);
    });

    // Swipe gesture untuk mobile
    let touchStartX = 0;
    modal.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    modal.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) stepGallery(diff < 0 ? 1 : -1);
    }, { passive: true });
  }

  function openGalleryModal(index) {
    state.galleryIndex = index;
    renderModalImage();
    document.getElementById("galleryModal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
  function closeGalleryModal() {
    document.getElementById("galleryModal").classList.add("hidden");
    document.body.style.overflow = "auto";
  }
  function stepGallery(delta) {
    const photos = SITE_CONFIG.gallery || [];
    state.galleryIndex = (state.galleryIndex + delta + photos.length) % photos.length;
    renderModalImage();
  }
  function renderModalImage() {
    const photos = SITE_CONFIG.gallery || [];
    const photo = photos[state.galleryIndex];
    if (!photo) return;
    const img = document.getElementById("modalImage");
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = photo.file;
      img.alt = photo.caption || "";
      img.style.opacity = 1;
    }, 150);
    document.getElementById("modalCaption").textContent = photo.caption || "";
  }

  /* ------------------------------------------------------------
     10. TIMELINE — render dari config + reveal saat discroll
  ------------------------------------------------------------ */
  function renderTimeline() {
    const track = document.getElementById("timelineTrack");
    const items = SITE_CONFIG.timeline || [];
    track.innerHTML = "";

    items.forEach((entry) => {
      const el = document.createElement("div");
      el.className = "timeline-item";
      el.innerHTML = `
        <p class="timeline-date">${escapeHTML(entry.date || "")}</p>
        <h3 class="timeline-title">${escapeHTML(entry.title || "")}</h3>
        <p class="timeline-text">${escapeHTML(entry.text || "")}</p>
      `;
      track.appendChild(el);
    });

    observeReveal(track.querySelectorAll(".timeline-item"));
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ------------------------------------------------------------
     11. QUOTES — berganti otomatis tiap beberapa detik
  ------------------------------------------------------------ */
  function initQuotes() {
    const quotes = SITE_CONFIG.quotes || [];
    if (!quotes.length) return;
    const el = document.getElementById("quoteText");
    let index = 0;
    el.textContent = quotes[0];

    setInterval(() => {
      el.classList.add("is-changing");
      setTimeout(() => {
        index = (index + 1) % quotes.length;
        el.textContent = quotes[index];
        el.classList.remove("is-changing");
      }, 550);
    }, 5000);
  }

  /* ------------------------------------------------------------
     12. LOVE LETTER — typing animation, mulai saat masuk viewport
  ------------------------------------------------------------ */
  function initLoveLetter() {
    const el = document.getElementById("letterBody");
    const text = (SITE_CONFIG.letter && SITE_CONFIG.letter.body) || "";
    let typed = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !typed) {
          typed = true;
          typeLetter(el, text);
        }
      });
    }, { threshold: 0.4 });

    observer.observe(el);
  }

  function typeLetter(el, text) {
    el.textContent = "";
    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    let i = 0;

    function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i += 2; // beberapa karakter per tick supaya tidak terlalu lambat
        setTimeout(tick, 18);
      } else {
        cursor.remove();
      }
    }
    tick();
  }

  /* ------------------------------------------------------------
     13. SCROLL REVEAL UMUM (IntersectionObserver reusable)
  ------------------------------------------------------------ */
  function observeReveal(elements) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    elements.forEach((el) => observer.observe(el));
  }

  function initScrollReveal() {
    observeReveal(document.querySelectorAll(".reveal"));
  }

  /* ------------------------------------------------------------
     14. FLOATING HEARTS di Ending Section
  ------------------------------------------------------------ */
  function initFloatingHearts() {
    const container = document.getElementById("floatingHearts");
    const ending = document.getElementById("ending");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          spawnHearts(container);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(ending);
  }

  function spawnHearts(container) {
    const count = 14;
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");
      h.className = "floating-heart";
      h.style.left = Math.random() * 100 + "%";
      const duration = 8 + Math.random() * 8;
      h.style.animationDuration = duration + "s";
      h.style.animationDelay = (Math.random() * 6) + "s";
      h.style.width = h.style.height = (10 + Math.random() * 10) + "px";
      container.appendChild(h);
    }
  }

  /* ------------------------------------------------------------
     15. MUSIC PLAYER
     Fitur: play/pause, next/prev, seek, volume, repeat, shuffle,
     crossfade antar lagu, cover berputar saat play, collapse/expand,
     floating & tetap terlihat saat scroll (posisi: fixed di CSS).
  ------------------------------------------------------------ */
  let audioA = new Audio();
  let audioB = new Audio();
  let activeAudio = audioA; // audio yang sedang terdengar
  let inactiveAudio = audioB;

  function initMusicPlayer() {
    const playlist = SITE_CONFIG.playlist || [];
    if (!playlist.length) return;

    renderPlaylist();
    loadTrack(0, { autoplay: false });

    const toggle = document.getElementById("playerToggle");
    const player = document.getElementById("musicPlayer");
    toggle.addEventListener("click", () => {
      player.classList.toggle("is-expanded");
    });
    // klik di luar player -> collapse
    document.addEventListener("click", (e) => {
      if (!player.contains(e.target)) player.classList.remove("is-expanded");
    });

    document.getElementById("btnPlayPause").addEventListener("click", togglePlayPause);
    document.getElementById("btnNext").addEventListener("click", () => changeTrack(1));
    document.getElementById("btnPrev").addEventListener("click", () => changeTrack(-1));
    document.getElementById("btnRepeat").addEventListener("click", toggleRepeat);
    document.getElementById("btnShuffle").addEventListener("click", toggleShuffle);

    const seek = document.getElementById("playerSeek");
    seek.addEventListener("input", () => {
      if (activeAudio.duration) {
        activeAudio.currentTime = (seek.value / 100) * activeAudio.duration;
      }
    });

    const volume = document.getElementById("playerVolume");
    volume.addEventListener("input", () => {
      const v = volume.value / 100;
      activeAudio.volume = v;
      inactiveAudio.volume = 0; // inactive tetap senyap di luar crossfade
      updateVolumeIcon(v);
    });
    activeAudio.volume = volume.value / 100;

    [audioA, audioB].forEach((audio) => {
      audio.addEventListener("timeupdate", () => {
        if (audio !== activeAudio) return;
        updateProgressUI();
      });
      audio.addEventListener("ended", () => {
        if (audio !== activeAudio) return;
        if (state.isRepeat) {
          audio.currentTime = 0;
          audio.play();
        } else {
          changeTrack(1);
        }
      });
      audio.addEventListener("loadedmetadata", () => {
        if (audio === activeAudio) updateProgressUI();
      });
    });
  }

  function renderPlaylist() {
    const list = document.getElementById("playlistList");
    const playlist = SITE_CONFIG.playlist || [];
    list.innerHTML = "";

    playlist.forEach((track, index) => {
      const row = document.createElement("div");
      row.className = "playlist-row";
      row.dataset.index = index;
      row.innerHTML = `
        <span class="playlist-index">${index + 1}</span>
        <img class="playlist-cover" src="${track.cover || ""}" alt="" onerror="this.style.visibility='hidden'">
        <div class="playlist-meta">
          <p class="playlist-title">${escapeHTML(track.title || "Tanpa judul")}</p>
          <p class="playlist-artist">${escapeHTML(track.artist || "")}</p>
        </div>
      `;
      row.addEventListener("click", () => {
        loadTrack(index, { autoplay: true, crossfade: state.isPlaying });
      });
      list.appendChild(row);
    });
    highlightActiveRow();
  }

  function highlightActiveRow() {
    document.querySelectorAll(".playlist-row").forEach((row) => {
      const isActive = Number(row.dataset.index) === state.currentTrack;
      row.classList.toggle("is-active", isActive);
      const indexEl = row.querySelector(".playlist-index");
      if (isActive && state.isPlaying) {
        indexEl.innerHTML = `<span class="eq-bar"></span><span class="eq-bar"></span><span class="eq-bar"></span>`;
      } else {
        indexEl.textContent = Number(row.dataset.index) + 1;
      }
    });
  }

  function loadTrack(index, opts) {
    const playlist = SITE_CONFIG.playlist || [];
    if (!playlist.length) return;
    opts = opts || {};
    state.currentTrack = ((index % playlist.length) + playlist.length) % playlist.length;
    const track = playlist[state.currentTrack];

    document.getElementById("playerSong").textContent = track.title || "Tanpa judul";
    document.getElementById("playerArtist").textContent = track.artist || "";
    setCoverImages(track.cover);

    if (opts.crossfade) {
      crossfadeTo(track.src, opts.autoplay);
    } else {
      activeAudio.src = track.src;
      activeAudio.currentTime = 0;
      if (opts.autoplay) playActive();
      updateProgressUI();
    }
    highlightActiveRow();
  }

  function setCoverImages(src) {
    document.getElementById("playerCoverMini").src = src || "";
    const coverWrap = document.querySelector(".player-cover-wrap");
    const cover = document.getElementById("playerCover");
    coverWrap.classList.add("is-fading");
    setTimeout(() => {
      cover.src = src || "";
      coverWrap.classList.remove("is-fading");
    }, 220);
  }

  /* Crossfade sederhana ~0.6 detik antara dua elemen <audio> */
  function crossfadeTo(src, autoplay) {
    const targetVolume = document.getElementById("playerVolume").value / 100;
    inactiveAudio.src = src;
    inactiveAudio.currentTime = 0;
    inactiveAudio.volume = 0;

    if (autoplay) {
      inactiveAudio.play().catch(() => {});
    }

    const duration = 600;
    const steps = 24;
    let step = 0;
    const fadeTimer = setInterval(() => {
      step++;
      const t = step / steps;
      inactiveAudio.volume = Math.min(targetVolume, targetVolume * t);
      activeAudio.volume = Math.max(0, targetVolume * (1 - t));
      if (step >= steps) {
        clearInterval(fadeTimer);
        activeAudio.pause();
        activeAudio.currentTime = 0;
        // tukar peran active <-> inactive
        const temp = activeAudio;
        activeAudio = inactiveAudio;
        inactiveAudio = temp;
        activeAudio.volume = targetVolume;
        setPlayingState(autoplay);
      }
    }, duration / steps);
  }

  function playActive() {
    activeAudio.play().then(() => {
      setPlayingState(true);
    }).catch(() => {
      // Autoplay diblokir browser -> tunggu interaksi pertama user
      setPlayingState(false);
    });
  }

  function togglePlayPause() {
    if (state.isPlaying) {
      activeAudio.pause();
      setPlayingState(false);
    } else {
      playActive();
    }
  }

  function setPlayingState(isPlaying) {
    state.isPlaying = isPlaying;
    const icon = document.getElementById("iconPlayPause");
    icon.classList.toggle("icon-play", !isPlaying);
    icon.classList.toggle("icon-pause", isPlaying);
    document.getElementById("musicPlayer").classList.toggle("is-playing", isPlaying);
    highlightActiveRow();
  }

  function changeTrack(direction) {
    const playlist = SITE_CONFIG.playlist || [];
    let nextIndex;
    if (state.isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = state.currentTrack + direction;
    }
    loadTrack(nextIndex, { autoplay: true, crossfade: state.isPlaying });
  }

  function toggleRepeat() {
    state.isRepeat = !state.isRepeat;
    document.getElementById("btnRepeat").classList.toggle("is-active", state.isRepeat);
  }
  function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    document.getElementById("btnShuffle").classList.toggle("is-active", state.isShuffle);
  }

  function updateProgressUI() {
    const seek = document.getElementById("playerSeek");
    const current = document.getElementById("playerCurrentTime");
    const duration = document.getElementById("playerDuration");
    const dur = activeAudio.duration || 0;
    const cur = activeAudio.currentTime || 0;
    seek.value = dur ? (cur / dur) * 100 : 0;
    current.textContent = formatTime(cur);
    duration.textContent = formatTime(dur);
  }

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateVolumeIcon(v) {
    const icon = document.getElementById("iconVolume");
    icon.classList.toggle("icon-volume", v > 0);
    icon.classList.toggle("icon-mute", v === 0);
  }

  /* Autoplay musik setelah envelope terbuka; jika diblokir browser,
     mulai memutar setelah interaksi pertama (klik/tap/scroll). */
  function startMusicAfterEntry() {
    playActive();
    if (!state.isPlaying) {
      const resume = () => {
        if (!state.isPlaying) playActive();
        document.removeEventListener("click", resume);
        document.removeEventListener("touchstart", resume);
        document.removeEventListener("scroll", resume);
      };
      document.addEventListener("click", resume, { once: true });
      document.addEventListener("touchstart", resume, { once: true });
      document.addEventListener("scroll", resume, { once: true });
    }
  }

  /* ------------------------------------------------------------
     16. INIT APP — urutan orkestrasi utama
  ------------------------------------------------------------ */
  function initApp() {
    applyTheme();
    applyContent();
    initAurora();
    initParticles();

    renderGallery();
    initGalleryModal();
    renderTimeline();
    initQuotes();
    initLoveLetter();
    initScrollReveal();
    initFloatingHearts();
    initMusicPlayer();
    initLockScreen();

    // Kunci scroll selama splash & lock screen tampil
    document.body.style.overflow = "hidden";

    runSplash(() => {
      const splash = document.getElementById("splashScreen");
      const lock = document.getElementById("lockScreen");
      switchLayer(splash, lock);
      document.getElementById("lockInput").focus({ preventScroll: true });
    });
  }

  // Jalankan setelah DOM siap
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }

})();
