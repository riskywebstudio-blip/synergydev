(function () {
  'use strict';
  var WA = '6285737681560';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  function waUrl(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }
  function openWin(url) { window.open(url, '_blank', 'noopener,noreferrer'); }

  /* ---------- Animasi muncul saat scroll (bertahap) ---------- */
  var rev = document.querySelectorAll('.reveal');
  var groups = new Map();
  rev.forEach(function (el) {
    var p = el.parentElement;
    var i = groups.get(p) || 0;
    el.style.transitionDelay = (Math.min(i, 6) * 90) + 'ms';
    groups.set(p, i + 1);
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rev.forEach(function (el) { io.observe(el); });
  } else {
    rev.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Angka statistik dihitung saat terlihat ---------- */
  function countUp(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (reduce) { el.textContent = end; return; }
    var t0 = null, dur = 1200;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var stats = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var card = e.target;
        countUp(card.querySelector('[data-count]'));
        var bar = card.querySelector('[data-bar]');
        if (bar) bar.style.width = bar.getAttribute('data-bar') + '%';
        sio.unobserve(card);
      });
    }, { threshold: 0.4 });
    stats.forEach(function (el) { sio.observe(el.closest('[data-stat]') || el); });
  }

  /* ---------- Menu mobile & dropdown ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var mobile = document.getElementById('mobile-menu');
  if (menuBtn && mobile) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      menuBtn.setAttribute('aria-label', open ? 'Buka menu' : 'Tutup menu');
      mobile.hidden = open;
    });
  }
  function closeDropdowns() {
    document.querySelectorAll('[data-dd-toggle]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      var m = b.parentElement.querySelector('[data-dd-menu]');
      if (m) m.hidden = true;
    });
  }
  document.querySelectorAll('[data-dd-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') === 'true';
      closeDropdowns();
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        btn.parentElement.querySelector('[data-dd-menu]').hidden = false;
      }
    });
  });
  document.querySelectorAll('[data-mm-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.nextElementSibling.hidden = open;
    });
  });

  /* ---------- Modal (Tanya Kami, Paket, Penawaran, Keranjang) ---------- */
  var openRoot = null, lastFocus = null;
  var MAP = { tanya: 'modal-tanya', paket: 'modal-paket', penawaran: 'modal-penawaran' };

  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    lastFocus = document.activeElement;
    el.hidden = false;
    openRoot = el;
    document.body.style.overflow = 'hidden';
    var f = el.querySelector('input:not([type=hidden]), select, textarea, button:not([data-close]), a[href]');
    if (f) f.focus();
  }
  function closeModal(el) {
    if (!el) return;
    el.hidden = true;
    if (openRoot === el) openRoot = null;
    if (!openRoot) document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.SDModal = { open: openModal, close: closeModal };

  document.addEventListener('click', function (e) {
    var t = e.target;
    closeDropdowns();
    var opener = t.closest && t.closest('[data-open]');
    if (opener) {
      var key = opener.getAttribute('data-open');
      if (MAP[key]) { e.preventDefault(); openModal(MAP[key]); }
      return;
    }
    var closer = t.closest && t.closest('[data-close]');
    if (closer) {
      e.preventDefault();
      closeModal(closer.closest('[data-modal]'));
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openRoot) closeModal(openRoot);
  });

  /* ---------- Chip topik di modal Tanya Kami ---------- */
  var topic = 'Umum';
  document.querySelectorAll('[data-topic]').forEach(function (b) {
    b.addEventListener('click', function () {
      topic = b.getAttribute('data-topic');
      document.querySelectorAll('[data-topic]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });

  /* ---------- Form kirim ke WhatsApp ---------- */
  function layananLabel(select) {
    var o = select && select.options[select.selectedIndex];
    return o ? o.text : '-';
  }
  var fk = document.getElementById('form-kontak');
  if (fk) {
    fk.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!fk.checkValidity()) { fk.reportValidity(); return; }
      var d = new FormData(fk);
      var msg = [
        'Halo SynergyDev, saya ingin konsultasi.', '',
        'Layanan: ' + layananLabel(fk.elements.layanan),
        'Nama: ' + d.get('nama'),
        'Nama usaha: ' + (d.get('usaha') || '-'),
        'WhatsApp: ' + d.get('wa'),
        'Perkiraan anggaran: ' + d.get('anggaran'), '',
        'Pesan: ' + (d.get('pesan') || '-')
      ].join('\n');
      openWin(waUrl(msg));
    });
  }
  var ft = document.getElementById('form-tanya');
  if (ft) {
    ft.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!ft.checkValidity()) { ft.reportValidity(); return; }
      var d = new FormData(ft);
      var msg = [
        'Halo SynergyDev, saya punya pertanyaan.', '',
        'Topik: ' + topic,
        'Layanan: ' + layananLabel(ft.elements.layanan),
        'Nama: ' + d.get('nama'), '',
        'Pertanyaan: ' + d.get('pertanyaan')
      ].join('\n');
      openWin(waUrl(msg));
      ft.reset();
      closeModal(document.getElementById('modal-tanya'));
    });
  }

  /* ---------- Pre-pilih layanan dari parameter ?paket= ---------- */
  var q = new URLSearchParams(window.location.search).get('paket');
  if (q && fk) {
    var sel = fk.elements.layanan;
    if (sel && sel.querySelector('option[value="' + q + '"]')) sel.value = q;
  }

  /* ---------- Quiz pilih paket ---------- */
  var quizEl = document.getElementById('quiz');
  if (quizEl) {
    var QUIZ = [
      { q: 'Apa tujuan utama website Anda?', opts: [['Memperkenalkan usaha dan kontak', 1], ['Menjual produk secara online', 2], ['Menerbitkan berita atau konten rutin', 3]] },
      { q: 'Fitur apa yang Anda butuhkan?', opts: [['Halaman informasi sederhana', 1], ['Katalog, keranjang, dan checkout', 2], ['Sistem khusus dengan banyak modul', 3]] },
      { q: 'Seberapa sering konten akan diperbarui?', opts: [['Jarang, sesekali saja', 1], ['Rutin setiap minggu', 2], ['Setiap hari dengan banyak penulis', 3]] },
      { q: 'Perkiraan anggaran awal Anda?', opts: [['Di bawah Rp750.000', 1], ['Rp750.000 sampai Rp1.500.000', 2], ['Di atas Rp1.500.000', 3]] }
    ];
    var LEVELS = {
      Dasar: { desc: 'Cocok untuk memperkenalkan usaha dengan website yang rapi dan cepat.', items: ['Website Profesional UMKM & Bisnis Lokal', 'Website Company Profile'] },
      Menengah: { desc: 'Cocok untuk bisnis yang ingin menjual online atau butuh fitur lebih lengkap.', items: ['Website Toko Online (E-Commerce)', 'Website Company Custom'] },
      Lanjut: { desc: 'Cocok untuk portal dengan trafik tinggi atau sistem khusus yang bisa berkembang.', items: ['Custom Website Skala Pertumbuhan', 'Portal Berita Premium'] }
    };
    var idx = 0, score = 0;
    function renderQ() {
      var step = QUIZ[idx];
      var html = '<p class="text-sm font-semibold text-brand">Pertanyaan ' + (idx + 1) + ' dari ' + QUIZ.length + '</p>' +
        '<h3 class="mt-1 text-xl font-bold text-navy">' + step.q + '</h3><div class="mt-5 grid gap-3">';
      step.opts.forEach(function (o, i) {
        html += '<button type="button" data-ans="' + o[1] + '" class="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left font-semibold text-navy transition hover:border-brand hover:bg-brand-soft">' + o[0] + '</button>';
      });
      html += '</div>';
      quizEl.innerHTML = html;
    }
    function renderResult() {
      var level = score <= 6 ? 'Dasar' : (score <= 9 ? 'Menengah' : 'Lanjut');
      var L = LEVELS[level];
      var list = L.items.map(function (n) { return '<li>' + n + '</li>'; }).join('');
      quizEl.innerHTML =
        '<p class="text-sm font-semibold text-brand">Hasil quiz Anda</p>' +
        '<h3 class="mt-1 text-2xl font-extrabold text-navy">Level: ' + level + '</h3>' +
        '<p class="mt-2 text-slate-600">' + L.desc + '</p>' +
        '<p class="mt-4 font-semibold text-navy">Rekomendasi paket:</p><ul class="mt-2 list-disc pl-5 text-slate-700">' + list + '</ul>' +
        '<div class="mt-6 flex flex-wrap gap-3">' +
        '<button type="button" id="quiz-wa" class="rounded-full bg-accent px-6 py-3 font-bold text-white hover:bg-accent-dark">Konsultasi Hasil via WhatsApp</button>' +
        '<button type="button" id="quiz-retry" class="rounded-full border border-slate-300 px-6 py-3 font-bold text-navy hover:bg-slate-50">Ulangi Quiz</button></div>';
      document.getElementById('quiz-wa').addEventListener('click', function () {
        openWin(waUrl('Halo SynergyDev, hasil quiz pilih paket saya level ' + level + '. Rekomendasi: ' + L.items.join(', ') + '. Mohon info lebih lanjut.'));
      });
      document.getElementById('quiz-retry').addEventListener('click', function () { idx = 0; score = 0; renderQ(); });
    }
    quizEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ans]');
      if (!b) return;
      score += parseInt(b.getAttribute('data-ans'), 10);
      idx++;
      if (idx < QUIZ.length) renderQ(); else renderResult();
    });
    renderQ();
  }
})();
