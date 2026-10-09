(function () {
  'use strict';
  var WA = 'https://wa.me/6285737681560?text=';
  var KEY = 'synergydev_cart';
  var cart = {};
  var products = {};
  var drawer = document.getElementById('cart-drawer');
  var overlay = document.getElementById('cart-overlay');
  var itemsEl = document.getElementById('cart-items');
  var emptyEl = document.getElementById('cart-empty');
  var totalEl = document.getElementById('cart-total');
  var recEl = document.getElementById('cart-recurring');
  var toast = document.getElementById('toast');
  var lastFocus = null;

  function rupiah(n) { return 'Rp' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  // Baca data produk dari kartu di halaman
  document.querySelectorAll('.product').forEach(function (el) {
    products[el.dataset.id] = {
      id: el.dataset.id,
      name: el.dataset.name,
      price: parseInt(el.dataset.price, 10),
      recurring: el.dataset.recurring === '1',
      img: el.querySelector('img') ? el.querySelector('img').getAttribute('src') : ''
    };
  });

  function load() {
    try { cart = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { cart = {}; }
    // buang item yang sudah tidak ada
    Object.keys(cart).forEach(function (k) { if (!products[k]) delete cart[k]; });
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }

  function count() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }

  function updateBadges() {
    var c = count();
    document.querySelectorAll('.cart-count').forEach(function (b) {
      b.textContent = c > 0 ? String(c) : '';
      if (c > 0) b.removeAttribute('data-zero'); else b.setAttribute('data-zero', '');
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove('is-show'); }, 1800);
  }

  function render() {
    itemsEl.innerHTML = '';
    var oneTime = 0, rec = [];
    Object.keys(cart).forEach(function (id) {
      var p = products[id], qty = cart[id];
      var li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML =
        '<img src="' + p.img + '" alt="" width="64" height="64">' +
        '<div><div class="cart-item-name"></div>' +
        '<div class="cart-item-price">' + rupiah(p.price) + (p.recurring ? ' / siklus' : '') + '</div>' +
        '<div class="qty"><button type="button" data-act="dec" data-id="' + id + '" aria-label="Kurangi">−</button>' +
        '<span>' + qty + '</span>' +
        '<button type="button" data-act="inc" data-id="' + id + '" aria-label="Tambah">+</button></div></div>' +
        '<div><button class="cart-remove" type="button" data-act="del" data-id="' + id + '">Hapus</button></div>';
      li.querySelector('.cart-item-name').textContent = p.name;
      itemsEl.appendChild(li);
      if (p.recurring) rec.push(p.name + ' (' + qty + 'x)'); else oneTime += p.price * qty;
    });
    emptyEl.hidden = Object.keys(cart).length > 0;
    totalEl.textContent = rupiah(oneTime);
    if (rec.length) { recEl.hidden = false; recEl.textContent = 'Plus biaya berulang per siklus: ' + rec.join(', '); }
    else { recEl.hidden = true; recEl.textContent = ''; }
    updateBadges();
  }

  function add(id) {
    if (!products[id]) return;
    cart[id] = (cart[id] || 0) + 1;
    save(); render();
    var btn = document.querySelector('[data-add="' + id + '"]');
    if (btn) {
      btn.classList.add('is-added');
      btn.textContent = '✓ Ditambahkan';
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.classList.remove('is-added'); btn.textContent = '+ Keranjang'; }, 1400);
    }
    showToast('Ditambahkan: ' + products[id].name);
  }

  function change(id, delta) {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    save(); render();
  }

  function openCart() {
    lastFocus = document.activeElement;
    drawer.hidden = false; overlay.hidden = false;
    document.querySelectorAll('.cart-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    document.body.style.overflow = 'hidden';
    drawer.querySelector('.cart-close').focus();
  }
  function closeCart() {
    drawer.hidden = true; overlay.hidden = true;
    document.querySelectorAll('.cart-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  function checkout() {
    var ids = Object.keys(cart);
    if (!ids.length) { showToast('Keranjang masih kosong'); return; }
    var lines = ['Halo SynergyDev, saya ingin memesan:', ''];
    var oneTime = 0, rec = [];
    ids.forEach(function (id, i) {
      var p = products[id], q = cart[id];
      lines.push((i + 1) + '. ' + p.name + ' x' + q + ' - ' + rupiah(p.price * q) + (p.recurring ? ' / siklus' : ''));
      if (p.recurring) rec.push(p.name); else oneTime += p.price * q;
    });
    lines.push('');
    lines.push('Estimasi total sekali bayar: ' + rupiah(oneTime));
    if (rec.length) lines.push('Plus biaya berulang per siklus untuk layanan maintenance/perpanjangan.');
    lines.push('');
    lines.push('Mohon info lanjutan dan jadwal konsultasi. Terima kasih.');
    window.open(WA + encodeURIComponent(lines.join('\n')), '_blank', 'noopener,noreferrer');
  }

  // Event: tombol tambah produk
  document.addEventListener('click', function (e) {
    var t = e.target;
    var addBtn = t.closest && t.closest('[data-add]');
    if (addBtn) { add(addBtn.dataset.add); return; }
    var cartBtn = t.closest && t.closest('.cart-btn');
    if (cartBtn) { openCart(); return; }
    if (t.closest && t.closest('.cart-close')) { closeCart(); return; }
    if (t === overlay) { closeCart(); return; }
    var act = t.closest && t.closest('[data-act]');
    if (act) {
      var id = act.dataset.id;
      if (act.dataset.act === 'inc') change(id, 1);
      if (act.dataset.act === 'dec') change(id, -1);
      if (act.dataset.act === 'del') { delete cart[id]; save(); render(); }
      return;
    }
    if (t.id === 'cart-checkout') { checkout(); return; }
    if (t.id === 'cart-clear') { cart = {}; save(); render(); showToast('Keranjang dikosongkan'); return; }
    var chip = t.closest && t.closest('[data-filter]');
    if (chip) { filterProducts(chip.dataset.filter, chip); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !drawer.hidden) closeCart();
  });

  // Filter kategori
  function filterProducts(cat, chip) {
    document.querySelectorAll('.chip').forEach(function (c) {
      var on = c === chip;
      c.classList.toggle('is-active', on);
    });
    document.querySelectorAll('.product').forEach(function (el) {
      el.hidden = !(cat === 'semua' || el.dataset.cat === cat);
    });
  }

  load();
  render();
})();
