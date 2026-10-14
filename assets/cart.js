(function () {
  'use strict';
  var WA = '6285737681560';
  var KEY = 'synergydev_cart';
  var catalog = {};
  (window.SD_PRODUCTS || []).forEach(function (p) { catalog[p.id] = p; });
  var cart = {};
  var root = document.getElementById('cart-root');
  var itemsEl = document.getElementById('cart-items');
  var emptyEl = document.getElementById('cart-empty');
  var totalEl = document.getElementById('cart-total');
  var recEl = document.getElementById('cart-recurring');
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function rupiah(n) { return 'Rp' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function load() {
    try { cart = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { cart = {}; }
    Object.keys(cart).forEach(function (k) { if (!catalog[k]) delete cart[k]; });
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function count() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }

  function badges() {
    var c = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (b) {
      b.textContent = c;
      b.hidden = c === 0;
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 1800);
  }

  function render() {
    if (!itemsEl) return;
    var html = '', oneTime = 0, rec = [];
    Object.keys(cart).forEach(function (id) {
      var p = catalog[id], q = cart[id];
      html += '<li class="flex gap-4 border-b border-slate-200 py-4">' +
        '<img src="' + p.img + '" alt="" width="72" height="72" class="h-18 w-18 shrink-0 rounded-xl bg-slate-50 object-contain" style="width:72px;height:72px">' +
        '<div class="min-w-0 flex-1"><p class="font-semibold leading-snug text-navy">' + esc(p.name) + '</p>' +
        '<p class="text-sm text-muted">' + rupiah(p.price) + (p.rec ? ' / siklus' : '') + '</p>' +
        '<div class="mt-2 flex items-center gap-3">' +
        '<button type="button" data-act="dec" data-id="' + id + '" aria-label="Kurangi" class="h-8 w-8 rounded-full border border-slate-300 font-bold text-navy hover:bg-slate-100">−</button>' +
        '<span class="min-w-6 text-center font-bold text-navy">' + q + '</span>' +
        '<button type="button" data-act="inc" data-id="' + id + '" aria-label="Tambah" class="h-8 w-8 rounded-full border border-slate-300 font-bold text-navy hover:bg-slate-100">+</button>' +
        '<button type="button" data-act="del" data-id="' + id + '" class="ml-auto text-sm font-semibold text-red-600 hover:underline">Hapus</button>' +
        '</div></div></li>';
      if (p.rec) rec.push(p.name + ' (' + q + 'x)'); else oneTime += p.price * q;
    });
    itemsEl.innerHTML = html;
    emptyEl.hidden = Object.keys(cart).length > 0;
    totalEl.textContent = rupiah(oneTime);
    recEl.hidden = rec.length === 0;
    recEl.textContent = rec.length ? 'Plus biaya berulang per siklus: ' + rec.join(', ') : '';
    badges();
  }

  function add(id) {
    if (!catalog[id]) return;
    cart[id] = (cart[id] || 0) + 1;
    save(); render();
    document.querySelectorAll('[data-add="' + id + '"]').forEach(function (btn) {
      var old = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', old);
      btn.textContent = 'Ditambahkan ✓';
      setTimeout(function () { btn.textContent = old; }, 1400);
    });
    showToast('Ditambahkan: ' + catalog[id].name);
  }

  function change(id, d) {
    if (!cart[id]) return;
    cart[id] += d;
    if (cart[id] <= 0) delete cart[id];
    save(); render();
  }

  function checkout() {
    var ids = Object.keys(cart);
    if (!ids.length) { showToast('Keranjang masih kosong'); return; }
    var lines = ['Halo SynergyDev, saya ingin memesan:', ''];
    var oneTime = 0, rec = false;
    ids.forEach(function (id, i) {
      var p = catalog[id], q = cart[id];
      lines.push((i + 1) + '. ' + p.name + ' x' + q + ' - ' + rupiah(p.price * q) + (p.rec ? ' / siklus' : ''));
      if (p.rec) rec = true; else oneTime += p.price * q;
    });
    lines.push('', 'Estimasi total sekali bayar: ' + rupiah(oneTime));
    if (rec) lines.push('Plus biaya berulang per siklus.');
    lines.push('', 'Mohon info lanjutan dan jadwal konsultasi. Terima kasih.');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener,noreferrer');
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var addBtn = t.closest && t.closest('[data-add]');
    if (addBtn) { add(addBtn.getAttribute('data-add')); return; }
    var opener = t.closest && t.closest('[data-open="cart"]');
    if (opener) { render(); window.SDModal && window.SDModal.open('cart-root'); return; }
    var act = t.closest && t.closest('[data-act]');
    if (act) {
      var id = act.getAttribute('data-id');
      var a = act.getAttribute('data-act');
      if (a === 'inc') change(id, 1);
      if (a === 'dec') change(id, -1);
      if (a === 'del') { delete cart[id]; save(); render(); }
      return;
    }
    if (t.closest && t.closest('#cart-checkout')) { checkout(); return; }
    if (t.closest && t.closest('#cart-clear')) { cart = {}; save(); render(); showToast('Keranjang dikosongkan'); return; }
    var chip = t.closest && t.closest('[data-filter]');
    if (chip) {
      var cat = chip.getAttribute('data-filter');
      document.querySelectorAll('[data-filter]').forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      document.querySelectorAll('.product').forEach(function (el) {
        el.hidden = !(cat === 'semua' || el.getAttribute('data-cat') === cat);
      });
    }
  });

  load();
  render();
})();
