'use strict';

/* ==========================================================
   Ubah nama di sini kalau perlu.
   Lagu: taruh file bernama song.mp3 di folder yang sama
   dengan index.html.
   ========================================================== */
const CONFIG = {
  nama: 'Tipa',   // yang lagi ulang tahun
  dari: 'Dias'    // yang bikin website ini
};

/* ---------- alat kecil ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const acak = (a, b) => a + Math.random() * (b - a);
const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));
const kurangGerak = matchMedia('(prefers-reduced-motion: reduce)').matches;

function simpan(kunci, nilai) {
  try { localStorage.setItem(kunci, JSON.stringify(nilai)); } catch (e) { /* abaikan */ }
}
function muat(kunci, awal) {
  try {
    const v = localStorage.getItem(kunci);
    return v ? JSON.parse(v) : awal;
  } catch (e) { return awal; }
}

/* isi nama ke seluruh halaman */
$$('[data-nama]').forEach((el) => { el.textContent = CONFIG.nama; });
$$('[data-dari]').forEach((el) => { el.textContent = CONFIG.dari; });
document.title = 'Selamat ulang tahun, ' + CONFIG.nama;

const warnaHati = ['#ff4f81', '#ffb3c8', '#ff86a6', '#ffd27f', '#e2245b'];

function gambarHati(c, x, y, s) {
  c.beginPath();
  c.moveTo(x, y + s * 0.35);
  c.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.35);
  c.bezierCurveTo(x - s * 0.5, y + s * 0.65, x, y + s * 0.8, x, y + s);
  c.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.65, x + s * 0.5, y + s * 0.35);
  c.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.35);
  c.closePath();
  c.fill();
}

/* ==========================================================
   Toast
   ========================================================== */
const Toast = (() => {
  const el = $('#toast');
  let t;
  return {
    tampil(pesan, ms = 3400) {
      el.textContent = pesan;
      el.classList.add('tampil');
      clearTimeout(t);
      t = setTimeout(() => el.classList.remove('tampil'), ms);
    }
  };
})();

/* ==========================================================
   Latar: hati naik, bintang berkedip, kelopak jatuh
   ========================================================== */
const Latar = (() => {
  const kanvas = $('#latar');
  const c = kanvas.getContext('2d');
  let w = 0, h = 0;
  let hati = [], bintang = [], kelopak = [];
  let kelopakAktif = true;
  const kec = kurangGerak ? 0 : 1;

  function ukur() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    kanvas.width = w * dpr;
    kanvas.height = h * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    isiUlang();
  }

  function buatHati(awal) {
    return {
      x: acak(0, w), y: awal ? acak(0, h) : h + 40,
      s: acak(10, 34), v: acak(0.25, 0.75), f: acak(0, 6.28),
      g: acak(8, 24), a: acak(0.07, 0.26), w: pilih(warnaHati)
    };
  }
  function buatKelopak(awal) {
    return {
      x: acak(0, w), y: awal ? acak(-h, 0) : -20,
      s: acak(8, 15), v: acak(0.5, 1.2), f: acak(0, 6.28),
      r: acak(0, 6.28), vr: acak(-0.02, 0.02), a: acak(0.35, 0.7)
    };
  }

  function isiUlang() {
    const banyakHati = w < 600 ? 16 : 30;
    const banyakBintang = w < 600 ? 45 : 90;
    hati = Array.from({ length: banyakHati }, () => buatHati(true));
    bintang = Array.from({ length: banyakBintang }, () => ({
      x: acak(0, w), y: acak(0, h), r: acak(0.5, 1.6), f: acak(0, 6.28), k: acak(0.6, 1.8)
    }));
    kelopak = Array.from({ length: w < 600 ? 10 : 18 }, () => buatKelopak(true));
  }

  function gambar(ts) {
    const t = ts / 1000;
    c.clearRect(0, 0, w, h);

    c.fillStyle = '#fff0ec';
    bintang.forEach((b) => {
      c.globalAlpha = kec ? 0.25 + 0.55 * Math.abs(Math.sin(t * b.k + b.f)) : 0.5;
      c.beginPath();
      c.arc(b.x, b.y, b.r, 0, 6.28);
      c.fill();
    });

    hati.forEach((p) => {
      p.y -= p.v * kec;
      if (p.y < -50) Object.assign(p, buatHati(false));
      const gx = p.x + Math.sin(t * 0.6 + p.f) * p.g;
      c.globalAlpha = p.a;
      c.fillStyle = p.w;
      gambarHati(c, gx, p.y, p.s);
    });

    if (kelopakAktif) {
      kelopak.forEach((p) => {
        p.y += p.v * kec;
        p.r += p.vr * kec;
        if (p.y > h + 30) Object.assign(p, buatKelopak(false));
        const gx = p.x + Math.sin(t * 0.8 + p.f) * 34;
        c.save();
        c.translate(gx, p.y);
        c.rotate(p.r);
        c.globalAlpha = p.a;
        c.fillStyle = '#ff86a6';
        c.beginPath();
        c.ellipse(0, 0, p.s * 0.55, p.s * 0.3, 0, 0, 6.28);
        c.fill();
        c.restore();
      });
    }

    c.globalAlpha = 1;
    requestAnimationFrame(gambar);
  }

  window.addEventListener('resize', ukur);
  ukur();
  requestAnimationFrame(gambar);

  return { aturKelopak(nyala) { kelopakAktif = nyala; } };
})();

/* ==========================================================
   Efek: ledakan hati, konfeti, kilau
   ========================================================== */
const Efek = (() => {
  const kanvas = $('#efek');
  const c = kanvas.getContext('2d');
  let w = 0, h = 0;
  let partikel = [];
  let jalan = false;
  const warnaKonfeti = ['#ff4f81', '#ffb3c8', '#ffd27f', '#fff0ec', '#e2245b', '#ff86a6'];

  function ukur() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    kanvas.width = w * dpr;
    kanvas.height = h * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', ukur);
  ukur();

  function tambah(p) {
    p.umur = 0;
    partikel.push(p);
    if (!jalan) { jalan = true; requestAnimationFrame(loop); }
  }

  function loop() {
    c.clearRect(0, 0, w, h);
    partikel = partikel.filter((p) => p.umur < p.maks && p.y < h + 40);
    partikel.forEach((p) => {
      p.umur++;
      p.vx *= 0.992;
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      const sisa = 1 - Math.pow(p.umur / p.maks, 2);
      c.globalAlpha = Math.max(sisa, 0);
      c.fillStyle = p.w;
      if (p.jenis === 'hati') {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.r);
        gambarHati(c, 0, -p.s / 2, p.s);
        c.restore();
      } else {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.r);
        c.scale(1, Math.sin(p.umur * 0.2 + p.r));
        c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        c.restore();
      }
    });
    c.globalAlpha = 1;
    if (partikel.length) {
      requestAnimationFrame(loop);
    } else {
      jalan = false;
      c.clearRect(0, 0, w, h);
    }
  }

  return {
    ledakHati(x, y, n = 14) {
      if (kurangGerak) n = Math.ceil(n / 3);
      for (let i = 0; i < n; i++) {
        const sudut = acak(0, 6.28);
        const laju = acak(2, 7);
        tambah({
          jenis: 'hati', x, y,
          vx: Math.cos(sudut) * laju, vy: Math.sin(sudut) * laju - 2.5,
          g: 0.14, maks: acak(50, 90), s: acak(10, 22),
          w: pilih(warnaHati), r: acak(-0.5, 0.5), vr: acak(-0.08, 0.08)
        });
      }
    },
    konfeti(n = 120) {
      if (kurangGerak) n = Math.ceil(n / 3);
      for (let i = 0; i < n; i++) {
        tambah({
          jenis: 'kertas', x: acak(0, w), y: acak(-40, -5),
          vx: acak(-2, 2), vy: acak(2, 6), g: 0.05, maks: acak(140, 230),
          s: acak(6, 12), w: pilih(warnaKonfeti), r: acak(0, 6.28), vr: acak(-0.15, 0.15)
        });
      }
    },
    kilau(x, y) {
      tambah({
        jenis: 'hati', x: x + acak(-6, 6), y: y + acak(-6, 6),
        vx: acak(-0.6, 0.6), vy: acak(-1.3, -0.3), g: 0.005, maks: 38,
        s: acak(6, 12), w: pilih(warnaHati), r: acak(-0.4, 0.4), vr: acak(-0.05, 0.05)
      });
    },
    kilauKlik(x, y) {
      const n = kurangGerak ? 2 : 6;
      for (let i = 0; i < n; i++) {
        const sudut = acak(0, 6.28);
        tambah({
          jenis: 'hati', x, y,
          vx: Math.cos(sudut) * acak(1, 3), vy: Math.sin(sudut) * acak(1, 3) - 1,
          g: 0.06, maks: 45, s: acak(6, 12),
          w: pilih(warnaHati), r: acak(-0.4, 0.4), vr: acak(-0.06, 0.06)
        });
      }
    }
  };
})();

/* ==========================================================
   Musik
   ========================================================== */
const Musik = (() => {
  const lagu = $('#lagu');
  const label = $('#labelPutar');
  const volume = $('#volume');
  lagu.volume = 0.65;

  function perbarui() {
    const jalan = !lagu.paused;
    document.body.classList.toggle('musik-jalan', jalan);
    label.textContent = jalan ? 'Jeda lagu' : 'Putar lagu';
  }

  function keluh() {
    Toast.tampil('Lagunya belum ketemu. Taruh file song.mp3 satu folder dengan index.html ya.', 4600);
  }

  function putar() {
    const p = lagu.play();
    if (p && p.catch) p.catch(() => { if (lagu.error) keluh(); });
  }

  function toggle() {
    if (lagu.paused) putar(); else lagu.pause();
  }

  lagu.addEventListener('play', perbarui);
  lagu.addEventListener('pause', perbarui);
  lagu.addEventListener('error', () => {
    // baru dikeluhkan kalau dia benar-benar mencoba memutar
    if (!lagu.paused || document.body.classList.contains('masuk')) keluh();
  });

  $('#btnMusik').addEventListener('click', toggle);
  $('#btnPutar').addEventListener('click', toggle);
  volume.addEventListener('input', () => { lagu.volume = volume.value / 100; });

  return { putar };
})();

/* ==========================================================
   Gerbang: "Kamu masih sayang aku engga?"
   ========================================================== */
(() => {
  const gerbang = $('#gerbang');
  const iya = $('#btnIya');
  const tidak = $('#btnTidak');
  const komentar = $('#komentar');
  let sudahMasuk = false;

  iya.focus({ preventScroll: true });

  // kalau dipilih "Tidak", tombolnya hilang
  tidak.addEventListener('click', () => {
    if (sudahMasuk) return;
    tidak.classList.add('hilang');
    setTimeout(() => tidak.remove(), 560);
    komentar.textContent = 'Loh, tombol tidaknya kabur. Berarti tinggal satu jawaban ya.';
    iya.classList.add('membesar');
  });

  // kalau dipilih "Iya", tombol tidak dibiarkan apa adanya
  iya.addEventListener('click', () => {
    if (sudahMasuk) return;
    sudahMasuk = true;
    const r = iya.getBoundingClientRect();
    Efek.ledakHati(r.left + r.width / 2, r.top + r.height / 2, 30);
    Efek.konfeti(80);
    komentar.textContent = 'Yeay! Aku juga sayang kamu, dari dulu sampai nanti.';
    Musik.putar();

    setTimeout(() => {
      gerbang.classList.add('selesai');
      document.body.classList.remove('terkunci');
      document.body.classList.add('masuk');
      setTimeout(() => gerbang.remove(), 950);
    }, 1700);
  });
})();

/* ==========================================================
   Sidebar
   ========================================================== */
(() => {
  const sidebar = $('#sidebar');
  const tombol = $('#btnMenu');
  sidebar.inert = true;

  function atur(buka) {
    document.body.classList.toggle('menu-buka', buka);
    tombol.setAttribute('aria-expanded', String(buka));
    tombol.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
    sidebar.inert = !buka;
  }

  tombol.addEventListener('click', () => atur(!document.body.classList.contains('menu-buka')));
  $('#tirai').addEventListener('click', () => atur(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') atur(false); });
  /* tiap menu = satu halaman sendiri, bukan scroll */
  const halaman = $$('main .halaman');
  const tautan = $$('.sb-nav a');
  const namaHalaman = halaman.map((hal) => hal.id);

  function tampilkan(id) {
    if (!namaHalaman.includes(id)) id = 'beranda';
    halaman.forEach((hal) => hal.classList.toggle('aktif', hal.id === id));
    tautan.forEach((a) => a.classList.toggle('aktif', a.getAttribute('href') === '#' + id));
    window.scrollTo(0, 0);
  }

  tautan.forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    atur(false);
    if (location.hash !== '#' + id) location.hash = id;
    else tampilkan(id);
  }));
  window.addEventListener('hashchange', () => tampilkan(location.hash.slice(1)));
  tampilkan(location.hash.slice(1));

  // saklar
  let jejak = true;
  $('#saklarKelopak').addEventListener('change', (e) => Latar.aturKelopak(e.target.checked));
  $('#saklarJejak').addEventListener('change', (e) => { jejak = e.target.checked; });

  // efek di kursor dan saat klik
  let terakhir = 0;
  document.addEventListener('pointermove', (e) => {
    if (!jejak || e.pointerType !== 'mouse') return;
    const n = performance.now();
    if (n - terakhir < 45) return;
    terakhir = n;
    Efek.kilau(e.clientX, e.clientY);
  });
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input, textarea')) return;
    Efek.kilauKlik(e.clientX, e.clientY);
  });
})();

/* ==========================================================
   Hati besar di beranda
   ========================================================== */
(() => {
  const hati = $('#hatiBesar');
  const teks = $('#hitunganHati');
  let hitung = 0;
  const kata = {
    1: 'Dag dig dug.',
    5: 'Pelan-pelan, nanti aku meleleh.',
    10: 'Hatinya sudah kamu genggam dari dulu, kok.',
    20: 'Oke, aku menyerah. Isinya semua buat kamu.',
    35: 'Kamu tuh nggak ada capeknya ya nyentuh hatiku.',
    50: 'Kalau kamu masih di sini, berarti kamu memang sesayang itu.'
  };

  hati.addEventListener('click', () => {
    hitung++;
    const r = hati.getBoundingClientRect();
    Efek.ledakHati(r.left + r.width / 2, r.top + r.height / 2, 10);
    if (kata[hitung]) {
      teks.textContent = kata[hitung];
    } else if (hitung % 4 === 0) {
      teks.textContent = 'Hatiku sudah kamu sentuh ' + hitung + ' kali.';
    }
  });
})();

/* ==========================================================
   Kue dan lilin
   ========================================================== */
(() => {
  const lilin = $$('.lilin');
  const pesan = $('#pesanKue');
  let dirayakan = false;

  function titik(l) {
    const r = l.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 3 };
  }

  function perbarui() {
    const padam = lilin.filter((l) => l.classList.contains('padam')).length;
    const sisa = lilin.length - padam;
    if (sisa === lilin.length) {
      pesan.textContent = 'Tiga lilin, tiga harapan. Sentuh apinya.';
      dirayakan = false;
    } else if (sisa > 0) {
      pesan.textContent = padam + ' padam, tinggal ' + sisa + ' lagi.';
      dirayakan = false;
    } else if (!dirayakan) {
      dirayakan = true;
      pesan.textContent = 'Semoga semua yang kamu minta barusan dikabulkan. Aamiin.';
      Efek.konfeti(140);
      const p = titik(lilin[1]);
      Efek.ledakHati(p.x, p.y, 24);
    }
  }

  function balik(l) {
    l.classList.toggle('padam');
    perbarui();
  }

  lilin.forEach((l) => {
    l.addEventListener('click', () => balik(l));
    l.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); balik(l); }
    });
  });

  $('#btnTiup').addEventListener('click', async () => {
    const nyala = lilin.filter((l) => !l.classList.contains('padam'));
    for (const l of nyala) {
      l.classList.add('padam');
      await tunggu(260);
    }
    perbarui();
  });

  $('#btnNyala').addEventListener('click', () => {
    lilin.forEach((l) => l.classList.remove('padam'));
    perbarui();
  });

  /* harapan */
  const form = $('#formHarapan');
  const isi = $('#isiHarapan');
  const daftar = $('#daftarHarapan');
  let harapan = muat('ultah.harapan', []);

  function tambahChip(teks, miring) {
    const s = document.createElement('span');
    s.className = 'chip-harapan';
    s.style.setProperty('--miring', miring + 'deg');
    s.textContent = teks;
    daftar.appendChild(s);
  }
  harapan.forEach((h) => tambahChip(h.teks, h.miring));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const teks = isi.value.trim();
    if (!teks) { Toast.tampil('Tulis dulu harapannya ya.'); return; }

    const r = isi.getBoundingClientRect();
    const bintang = document.createElement('div');
    bintang.className = 'harapan-terbang';
    bintang.textContent = teks;
    document.body.appendChild(bintang);
    const x = r.left + 20;
    const y = r.top;
    const naik = kurangGerak ? 0 : -Math.min(320, y - 60);
    const anim = bintang.animate([
      { transform: 'translate(' + x + 'px,' + y + 'px) scale(1)', opacity: 1 },
      { transform: 'translate(' + (x + 30) + 'px,' + (y + naik) + 'px) scale(.6)', opacity: 0 }
    ], { duration: kurangGerak ? 900 : 2600, easing: 'ease-out' });
    anim.onfinish = () => bintang.remove();
    Efek.ledakHati(r.left + r.width / 2, r.top, 12);

    const miring = +acak(-3, 3).toFixed(1);
    harapan.push({ teks, miring });
    if (harapan.length > 12) harapan.shift();
    simpan('ultah.harapan', harapan);
    daftar.innerHTML = '';
    harapan.forEach((h) => tambahChip(h.teks, h.miring));

    isi.value = '';
    Toast.tampil('Harapanmu sudah aku titipkan ke langit.');
  });
})();

/* ==========================================================
   Alasan aku mencintaimu: kutipan berputar dan terbang
   ========================================================== */
(() => {
  const alasan = [
    'Karena kamu bikin hari yang biasa aja terasa kayak hari libur.',
    'Karena ketawa kamu menular, dan aku nggak mau sembuh.',
    'Karena di dekat kamu, aku boleh jadi diri sendiri.',
    'Karena kamu sabar sama aku yang kadang nyebelin.',
    'Karena kamu ingat hal-hal kecil yang bahkan aku sendiri lupa.',
    'Karena rumah itu bukan tempat, tapi kamu.',
    'Kamu tetap tinggal, bahkan di hari-hari aku susah disayang.',
    'Kamu cantik, tapi bukan itu yang bikin aku jatuh.',
    'Suara kamu bagian favorit dari hari-hariku.',
    'Kamu bikin aku mau jadi lebih baik, tanpa pernah nyuruh.',
    'Tiap lihat kamu makan enak, aku ikut bahagia.',
    'Kamu selalu jadi orang pertama yang mau aku kabari.',
    'Diam bareng kamu pun nggak pernah canggung.',
    'Kamu keras kepala dengan cara yang lucu.',
    'Kamu percaya sama aku bahkan sebelum aku percaya sama diriku sendiri.',
    'Kamu tahu kapan aku butuh dipeluk dan kapan butuh dibiarin dulu.',
    'Nunggu hujan reda pun jadi kenangan kalau sama kamu.',
    'Karena kamu tulus, dan itu langka.',
    'Tiap hari sama kamu, aku jatuh cinta lagi, pelan-pelan.',
    'Kamu alasan aku senyum-senyum sendiri pas lihat layar HP.',
    'Aku nggak bisa bayangin tahun-tahun ke depan tanpa kamu.'
  ];
  const warnaKertas = ['#fff4ee', '#ffd9e3', '#ffe9b8', '#ffc6d6'];

  const tombol = $('#btnAlasan');
  const jumlah = $('#jumlahAlasan');
  let antrean = [];
  let total = 0;

  function ambil() {
    if (!antrean.length) antrean = [...alasan].sort(() => Math.random() - 0.5);
    return antrean.pop();
  }

  tombol.addEventListener('click', () => {
    const r = tombol.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const kartu = document.createElement('div');
    kartu.className = 'alasan-terbang';
    kartu.textContent = ambil();
    kartu.style.background = pilih(warnaKertas);
    document.body.appendChild(kartu);

    const lebar = kartu.offsetWidth;
    const tinggi = kartu.offsetHeight;
    const awalX = cx - lebar / 2;
    const awalY = cy - tinggi / 2;

    // arah: ke atas kalau tombol ada di bawah layar, ke bawah kalau di atas
    const arah = cy > vh * 0.45 ? -1 : 1;
    const jarakY = arah * acak(170, 330);
    let dx = acak(-1, 1) * Math.min(vw * 0.42, 300);
    const batasKiri = 10 - awalX;
    const batasKanan = vw - lebar - 10 - awalX;
    dx = Math.max(batasKiri, Math.min(batasKanan, dx));

    const r0 = acak(-32, 32);
    const r1 = r0 + acak(-38, 38);

    const geser = (px, py, rot, skala) =>
      'translate(' + (awalX + px) + 'px,' + (awalY + py) + 'px) rotate(' + rot + 'deg) scale(' + skala + ')';

    let bingkai;
    if (kurangGerak) {
      bingkai = [
        { transform: geser(0, jarakY * 0.5, r0, 1), opacity: 0 },
        { transform: geser(0, jarakY * 0.5, r0, 1), opacity: 1, offset: 0.2 },
        { transform: geser(0, jarakY * 0.5, r0, 1), opacity: 1, offset: 0.85 },
        { transform: geser(0, jarakY * 0.5, r0, 1), opacity: 0 }
      ];
    } else {
      bingkai = [
        { transform: geser(0, 0, r0, 0.3), opacity: 0 },
        { transform: geser(dx * 0.3, jarakY * 0.35, r0 + (r1 - r0) * 0.3, 1), opacity: 1, offset: 0.16 },
        { transform: geser(dx, jarakY, r1, 1), opacity: 1, offset: 0.8 },
        { transform: geser(dx * 1.12, jarakY * 1.18, r1 + 6, 0.9), opacity: 0 }
      ];
    }

    const anim = kartu.animate(bingkai, {
      duration: kurangGerak ? 3200 : acak(4600, 6200),
      easing: 'cubic-bezier(.25,.6,.35,1)'
    });
    anim.onfinish = () => kartu.remove();

    Efek.ledakHati(cx, cy, 8);

    total++;
    if (total === 1) jumlah.textContent = 'Satu alasan sudah terbang. Masih banyak lagi.';
    else if (total % alasan.length === 0) jumlah.textContent = 'Alasannya masih ada terus, tapi layarnya keburu penuh.';
    else jumlah.textContent = total + ' alasan sudah terbang ke langit.';
  });
})();

/* ==========================================================
   Surat
   ========================================================== */
(() => {
  const wrap = $('#suratWrap');
  const amplop = $('#amplop');
  const isi = $('#isiSurat');
  const ttd = $('#ttdSurat');
  const petunjuk = $('#petunjukSurat');
  const kertas = $('#kertasDalam');

  const paragraf = [
    'Sayang,',
    'Selamat ulang tahun ya. Hari ini kamu nambah umur, dan aku nambah satu alasan lagi buat bersyukur: dari sekian banyak orang, aku dipertemukan sama kamu.',
    'Aku bukan orang yang jago merangkai kata. Makanya aku belajar bikin website ini, malam-malam, sambil senyum-senyum sendiri mikirin kamu bakal bilang apa pas lihat ini.',
    'Aku cuma mau kamu tahu: kamu nggak perlu jadi sempurna buat disayang. Kamu yang lagi capek, kamu yang lagi manja, kamu yang keras kepala, semuanya aku sayang.',
    'Semoga tahun ini kamu dikelilingi hal-hal baik, sehat terus, dan tetap ketawa selebar itu. Kalau ada hari yang berat, ingat ya, aku di sini.',
    'Aku sayang kamu. Hari ini, besok, dan seterusnya.'
  ];

  let sesi = 0;
  let cepat = false;

  async function ketik(nomor) {
    isi.innerHTML = '';
    ttd.textContent = '';
    cepat = kurangGerak;

    for (const teks of paragraf) {
      if (nomor !== sesi) return;
      const p = document.createElement('p');
      isi.appendChild(p);
      const kata = teks.split(' ');
      for (let i = 0; i < kata.length; i++) {
        if (nomor !== sesi) return;
        const s = document.createElement('span');
        s.className = 'kata';
        s.textContent = kata[i] + (i < kata.length - 1 ? ' ' : '');
        p.appendChild(s);
        if (!cepat) await tunggu(70);
      }
      if (!cepat) await tunggu(260);
    }
    if (nomor !== sesi) return;
    ttd.textContent = 'Yang paling sayang kamu, ' + CONFIG.dari;
    petunjuk.textContent = 'Ketuk amplopnya lagi kalau mau menutup.';
    Efek.ledakHati(window.innerWidth / 2, window.innerHeight * 0.6, 16);
  }

  amplop.addEventListener('click', () => {
    const buka = !wrap.classList.contains('terbuka');
    wrap.classList.toggle('terbuka', buka);
    amplop.setAttribute('aria-expanded', String(buka));
    amplop.setAttribute('aria-label', buka ? 'Tutup amplop surat' : 'Buka amplop surat');
    sesi++;
    if (buka) {
      petunjuk.textContent = 'Ketuk kertasnya kalau mau langsung baca semuanya.';
      setTimeout(() => ketik(sesi), 600);
    } else {
      petunjuk.textContent = 'Ketuk amplopnya.';
      setTimeout(() => { isi.innerHTML = ''; ttd.textContent = ''; }, 900);
    }
  });

  // ketuk kertas = tampilkan semuanya sekarang
  kertas.addEventListener('click', () => { cepat = true; });
})();

/* ==========================================================
   Cocokkan hati (memory game)
   ========================================================== */
(() => {
  const papan = $('#papan');
  const status = $('#statusGame');
  const simbol = ['💖', '🎂', '🎁', '🌹', '🧸', '💌', '🍓', '🌙'];
  let terbuka = [];
  let kunci = false;
  let langkah = 0;
  let cocok = 0;
  let terbaik = muat('ultah.terbaik', null);

  function kocok(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function tulis(pesan) {
    if (pesan) { status.textContent = pesan; return; }
    let t = 'Langkah ' + langkah + ', pasangan ' + cocok + ' dari ' + simbol.length;
    if (terbaik) t += ', rekor terbaikmu ' + terbaik + ' langkah';
    status.textContent = t + '.';
  }

  function mulai() {
    terbuka = [];
    kunci = false;
    langkah = 0;
    cocok = 0;
    papan.innerHTML = '';
    kocok([...simbol, ...simbol]).forEach((s) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'kartu';
      b.dataset.s = s;
      b.setAttribute('aria-label', 'Kartu tertutup');
      b.innerHTML = '<span class="kartu-dalam"><span class="muka depan">♥</span><span class="muka belakang">' + s + '</span></span>';
      papan.appendChild(b);
    });
    tulis();
  }

  function menang() {
    if (!terbaik || langkah < terbaik) {
      terbaik = langkah;
      simpan('ultah.terbaik', terbaik);
    }
    tulis('Semua pasangan ketemu dalam ' + langkah + ' langkah. Sama kayak kita, ujung-ujungnya selalu ketemu.');
    const r = papan.getBoundingClientRect();
    Efek.konfeti(130);
    Efek.ledakHati(r.left + r.width / 2, r.top + r.height / 2, 26);
  }

  papan.addEventListener('click', (e) => {
    const k = e.target.closest('.kartu');
    if (!k || kunci || k.classList.contains('buka')) return;

    k.classList.add('buka');
    k.setAttribute('aria-label', 'Kartu ' + k.dataset.s);
    terbuka.push(k);
    if (terbuka.length < 2) return;

    langkah++;
    const [a, b] = terbuka;
    if (a.dataset.s === b.dataset.s) {
      a.classList.add('cocok');
      b.classList.add('cocok');
      cocok++;
      terbuka = [];
      const r = b.getBoundingClientRect();
      Efek.ledakHati(r.left + r.width / 2, r.top + r.height / 2, 8);
      if (cocok === simbol.length) menang(); else tulis();
    } else {
      kunci = true;
      setTimeout(() => {
        [a, b].forEach((x) => {
          x.classList.remove('buka');
          x.setAttribute('aria-label', 'Kartu tertutup');
        });
        terbuka = [];
        kunci = false;
        tulis();
      }, 750);
    }
  });

  $('#btnUlang').addEventListener('click', mulai);
  mulai();
})();

/* ==========================================================
   Kupon
   ========================================================== */
(() => {
  const daftarKupon = [
    { id: 'peluk', judul: 'Pelukan lama', isi: 'Satu pelukan tanpa buru-buru, sampai kamu yang duluan lepas.' },
    { id: 'makan', judul: 'Makan malam pilihanmu', isi: 'Kamu yang tentukan tempatnya, aku yang traktir dan nggak komentar soal porsi.' },
    { id: 'film', judul: 'Nonton versi kamu', isi: 'Genre apa pun. Termasuk yang sudah kamu tonton lima kali.' },
    { id: 'pijat', judul: 'Pijat bahu lima belas menit', isi: 'Lengkap dengan lagu pilihanmu di latar.' },
    { id: 'jajan', judul: 'Jalan sore dan jajan', isi: 'Keliling sebentar, beli apa saja yang kamu lirik.' },
    { id: 'bebas', judul: 'Satu permintaan bebas', isi: 'Yang masuk akal, ya. Yang nggak masuk akal juga boleh dicoba.' }
  ];

  const wadah = $('#daftarKupon');
  let ditukar = muat('ultah.kupon', []);

  function gambar() {
    wadah.innerHTML = '';
    daftarKupon.forEach((k) => {
      const sudah = ditukar.includes(k.id);
      const el = document.createElement('div');
      el.className = 'kupon' + (sudah ? ' ditukar' : '');
      el.dataset.id = k.id;
      el.innerHTML =
        '<h3></h3><p></p>' +
        '<button type="button" class="tombol utama kecil">Tukar</button>' +
        '<span class="cap">Sudah ditukar</span>';
      $('h3', el).textContent = k.judul;
      $('p', el).textContent = k.isi;
      wadah.appendChild(el);
    });
  }

  wadah.addEventListener('click', (e) => {
    const tombol = e.target.closest('button');
    if (!tombol) return;
    const el = tombol.closest('.kupon');
    const id = el.dataset.id;
    if (ditukar.includes(id)) return;
    ditukar.push(id);
    simpan('ultah.kupon', ditukar);
    el.classList.add('ditukar', 'baru');
    const r = el.getBoundingClientRect();
    Efek.ledakHati(r.left + r.width / 2, r.top + r.height / 2, 16);
    Toast.tampil('Kupon "' + $('h3', el).textContent + '" sudah ditukar. Aku catat ya.');
  });

  $('#btnResetKupon').addEventListener('click', () => {
    ditukar = [];
    simpan('ultah.kupon', ditukar);
    gambar();
    Toast.tampil('Semua kupon sudah kembali.');
  });

  gambar();
})();
