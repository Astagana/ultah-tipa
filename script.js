'use strict';
/* ===== Ubah di sini ===== */
const CONFIG = {
  nama: 'Tipa',
  dari: 'Dias',
  wa: '6282253507804',            // 082253507804 dalam format internasional
  pesanWa: 'aku kangen sama kamu'
};
/* Isi halaman Penyesalan. Sesuaikan dengan yang benar-benar terjadi. */
const MAAF = {
  intro: [
    'Aku nulis ini pelan-pelan, tanpa alasan dan tanpa pembelaan.',
    'Baca sampai habis ya. Cuma itu yang aku minta.'
  ],
  butir: [
    ['Aku egois', 'Aku sering mikirin maunya aku dulu. Capekmu kuanggap biasa, ceritamu kupotong, dan pas berantem aku lebih pengin menang daripada pengin kita baik-baik lagi.'],
    ['Aku posting foto bareng cewek lain', 'Kamu lihat itu di depan orang banyak. Aku nggak mikir gimana rasanya jadi kamu pas lihatnya. Itu bukan sekadar foto, itu bikin kamu merasa nggak dihargai.'],
    ['Aku chat cewek lain', 'Bukan soal isi chatnya. Soal aku yang bikin kamu merasa nggak cukup dan nggak dipilih, padahal kamu sudah ada dan sudah setia.'],
    ['Aku bilang kamu lebay', 'Waktu kamu cemburu dan sedih, aku malah mengecilkan perasaanmu. Padahal kamu punya alasan, dan alasan itu aku sendiri yang bikin.'],
    ['Dan semua yang kecil-kecil', 'Telat bales, janji yang lupa, ucapan terima kasih yang jarang. Satu-satu kelihatan sepele, tapi ditumpuk jadi alasan kamu capek sama aku.']
  ],
  penutup: [
    'Aku nggak minta kamu lupa, dan nggak minta kamu langsung percaya.',
    'Aku cuma pengin kamu tahu: ini salahku, bukan salahmu. Dan kamu berhak memilih apa pun setelah ini.'
  ]
};

const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const acak = (a, b) => a + Math.random() * (b - a);
const pilih = (a) => a[Math.floor(Math.random() * a.length)];
const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));
const kurang = matchMedia('(prefers-reduced-motion: reduce)').matches;

$$('[data-nama]').forEach((e) => (e.textContent = CONFIG.nama));
$$('[data-dari]').forEach((e) => (e.textContent = CONFIG.dari));
document.title = 'Untuk ' + CONFIG.nama;
$('#btnWa').href = 'https://wa.me/' + CONFIG.wa + '?text=' + encodeURIComponent(CONFIG.pesanWa);

const Toast = (() => {
  const el = $('#toast'); let t;
  return (m, ms = 3000) => { el.textContent = m; el.classList.add('tampil'); clearTimeout(t); t = setTimeout(() => el.classList.remove('tampil'), ms); };
})();

/* ===== Efek: bara melayang + hati pecah ===== */
const Efek = (() => {
  const k = $('#fx'), c = k.getContext('2d');
  let w, h, bara = [], p = [];
  const warna = ['#d0583f', '#e8b960', '#f4eadc', '#b8472f'];
  function ukur() {
    const d = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight; k.width = w * d; k.height = h * d; c.setTransform(d, 0, 0, d, 0, 0);
    bara = Array.from({ length: w < 600 ? 22 : 40 }, () => ({ x: acak(0, w), y: acak(0, h), r: acak(.8, 2.2), v: acak(.15, .5), f: acak(0, 6.3), a: acak(.15, .5) }));
  }
  function hati(x, y, s) {
    c.beginPath(); c.moveTo(x, y + s * .35);
    c.bezierCurveTo(x, y, x - s * .5, y, x - s * .5, y + s * .35);
    c.bezierCurveTo(x - s * .5, y + s * .65, x, y + s * .8, x, y + s);
    c.bezierCurveTo(x, y + s * .8, x + s * .5, y + s * .65, x + s * .5, y + s * .35);
    c.bezierCurveTo(x + s * .5, y, x, y, x, y + s * .35); c.fill();
  }
  function loop(ts) {
    c.clearRect(0, 0, w, h);
    bara.forEach((b) => {
      if (!kurang) b.y -= b.v; if (b.y < -10) { b.y = h + 10; b.x = acak(0, w); }
      c.globalAlpha = b.a * (.6 + .4 * Math.sin(ts / 900 + b.f)); c.fillStyle = '#e8b960';
      c.beginPath(); c.arc(b.x + Math.sin(ts / 1500 + b.f) * 14, b.y, b.r, 0, 6.3); c.fill();
    });
    p = p.filter((q) => q.u < q.m);
    p.forEach((q) => {
      q.u++; q.vy += .13; q.x += q.vx; q.y += q.vy; q.vx *= .99;
      c.globalAlpha = 1 - (q.u / q.m) ** 2; c.fillStyle = q.w;
      if (q.t) { c.save(); c.translate(q.x, q.y); c.rotate(q.u * .08); c.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); c.restore(); } else hati(q.x, q.y, q.s);
    });
    c.globalAlpha = 1; requestAnimationFrame(loop);
  }
  addEventListener('resize', ukur); ukur(); requestAnimationFrame(loop);
  return {
    ledak(x, y, n = 14, kertas = false) {
      if (kurang) n = Math.ceil(n / 3);
      for (let i = 0; i < n; i++) {
        const a = acak(0, 6.3), l = acak(2, 7);
        p.push({ x, y, vx: Math.cos(a) * l, vy: Math.sin(a) * l - 3, s: acak(9, 20), w: pilih(warna), m: acak(55, 95), u: 0, t: kertas });
      }
    }
  };
})();

/* ===== Musik ===== */
const lagu = $('#lagu'); lagu.volume = .65;
const putarLagu = () => { const r = lagu.play(); if (r && r.catch) r.catch(() => {}); };
const toggleLagu = () => (lagu.paused ? putarLagu() : lagu.pause());
['play', 'pause'].forEach((e) => lagu.addEventListener(e, () => document.body.classList.toggle('musik-jalan', !lagu.paused)));
lagu.addEventListener('error', () => Toast('Lagu belum ada. Taruh song.mp3 satu folder dengan index.html.', 4500));
$('#btnMusik').addEventListener('click', toggleLagu);
$('#volume').addEventListener('input', (e) => (lagu.volume = e.target.value / 100));

/* ===== Gerbang ===== */
(() => {
  const iya = $('#btnIya'), tidak = $('#btnTidak'), kom = $('#komentar'); let masuk = false;
  tidak.addEventListener('click', () => {
    tidak.classList.add('hilang'); setTimeout(() => tidak.remove(), 560);
    kom.textContent = 'Loh, tombol tidaknya kabur. Berarti tinggal satu jawaban.'; iya.classList.add('membesar');
  });
  iya.addEventListener('click', () => {
    if (masuk) return; masuk = true;
    const r = iya.getBoundingClientRect();
    Efek.ledak(r.left + r.width / 2, r.top + r.height / 2, 30); Efek.ledak(innerWidth / 2, 0, 60, true);
    kom.textContent = 'Makasih. Itu yang pengin aku dengar.'; putarLagu();
    setTimeout(() => {
      $('#gerbang').classList.add('selesai'); document.body.classList.remove('terkunci'); document.body.classList.add('masuk');
      setTimeout(() => $('#gerbang').remove(), 950);
    }, 1500);
  });
})();

/* ===== Navigasi, sidebar, dan kunci halaman penyesalan ===== */
const Nav = (() => {
  const body = document.body, sb = $('#sidebar'), tb = $('#btnMenu');
  const vB = $('#vBeranda'), vM = $('#vMaaf');
  let kunci = false, selesai = false;
  sb.inert = true;

  function menu(buka) {
    if (buka && kunci) { Toast('Selesaikan membaca dulu, ya.'); return; }
    body.classList.toggle('menu-buka', buka); sb.inert = !buka;
    tb.setAttribute('aria-expanded', buka); tb.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
  }
  function tampil(v) { vB.classList.toggle('aktif', v === vB); vM.classList.toggle('aktif', v === vM); }
  function setKunci(k) {
    kunci = k; body.classList.toggle('kunci-maaf', k);
    $$('.sb-nav button').forEach((b) => b.setAttribute('aria-disabled', k));
  }
  function ke(nama) {
    if (kunci) { Toast('Baca sampai habis dulu, baru menu terbuka.'); return; }
    menu(false);
    if (nama === 'maaf') { tampil(vM); scrollTo(0, 0); if (!selesai) setKunci(true); return; }
    tampil(vB);
    const t = $('#' + nama); if (t) setTimeout(() => t.scrollIntoView({ behavior: kurang ? 'auto' : 'smooth' }), 30);
  }
  tb.addEventListener('click', () => menu(!body.classList.contains('menu-buka')));
  $('#tirai').addEventListener('click', () => menu(false));
  addEventListener('keydown', (e) => e.key === 'Escape' && menu(false));
  $$('.sb-nav button').forEach((b) => b.addEventListener('click', () => ke(b.dataset.ke)));
  return {
    ke,
    selesaiBaca() { selesai = true; setKunci(false); },
    paksaBeranda() { setKunci(false); tampil(vB); scrollTo(0, 0); }
  };
})();

/* ===== Halaman penyesalan ===== */
(() => {
  const isi = $('#isiMaaf'); let no = 0;
  function tambah(judul, teks, cls) {
    const a = document.createElement('article'); a.className = 'butir ' + (cls || '');
    if (judul) {
      const s = document.createElement('small'); s.textContent = 'ke-' + (++no); a.appendChild(s);
      const h = document.createElement('h3'); h.textContent = judul; a.appendChild(h);
    }
    [].concat(teks).forEach((t) => { const p = document.createElement('p'); p.textContent = t; a.appendChild(p); });
    isi.appendChild(a);
  }
  tambah('', MAAF.intro);
  MAAF.butir.forEach((b) => tambah(b[0], b[1]));
  tambah('', MAAF.penutup, 'penutup');

  const butir = $$('.butir', isi), pilihan = $('#pilihMaaf');
  const io = new IntersectionObserver((d) => d.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('terbaca'); io.unobserve(x.target); } }), { threshold: .35 });
  butir.forEach((b) => io.observe(b));

  let timer;
  new IntersectionObserver((d) => {
    clearTimeout(timer);
    if (!d[0].isIntersecting) return;
    timer = setTimeout(() => {
      if (!butir.every((b) => b.classList.contains('terbaca'))) return;
      pilihan.classList.add('tampil'); Nav.selesaiBaca(); Toast('Menu sudah terbuka lagi.');
    }, 2200);
  }, { threshold: 1 }).observe($('#ujungMaaf'));

  $('#btnTolak').addEventListener('click', async () => {
    const g = $('#gelap'); g.classList.add('nyala'); await tunggu(1500);
    Nav.paksaBeranda(); await tunggu(250); g.classList.remove('nyala');
  });
})();

/* ===== Hati di beranda ===== */
(() => {
  const kata = { 1: 'Dag dig dug.', 5: 'Pelan-pelan, nanti aku meleleh.', 10: 'Dari dulu dia memang punyamu.', 25: 'Kamu nggak capek ya nyentuh dia terus?' };
  let n = 0;
  $('#hati').addEventListener('click', (e) => {
    n++; const r = e.currentTarget.getBoundingClientRect(); Efek.ledak(r.left + r.width / 2, r.top + r.height / 2, 10);
    if (kata[n]) $('#hitung').textContent = kata[n]; else if (n % 5 === 0) $('#hitung').textContent = 'Sudah ' + n + ' kali kamu sentuh.';
  });
})();

/* ===== Lilin ===== */
(() => {
  const lilin = $$('.lilin'), pesan = $('#pesanKue'); let rayakan = false;
  function cek() {
    const mati = lilin.filter((l) => l.classList.contains('padam')).length;
    if (!mati) { pesan.textContent = 'Tiga lilin, tiga harapan.'; rayakan = false; }
    else if (mati < 3) { pesan.textContent = mati + ' padam, tinggal ' + (3 - mati) + '.'; rayakan = false; }
    else if (!rayakan) {
      rayakan = true; pesan.textContent = 'Semoga semua yang kamu minta barusan dikabulkan.';
      const r = $('#kue').getBoundingClientRect(); Efek.ledak(r.left + r.width / 2, r.top + 40, 26); Efek.ledak(innerWidth / 2, 0, 70, true);
    }
  }
  lilin.forEach((l) => {
    l.addEventListener('click', () => { l.classList.toggle('padam'); cek(); });
    l.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); l.click(); } });
  });
  $('#btnTiup').addEventListener('click', async () => { for (const l of lilin) { if (!l.classList.contains('padam')) { l.classList.add('padam'); await tunggu(260); } } cek(); });
  $('#btnNyala').addEventListener('click', () => { lilin.forEach((l) => l.classList.remove('padam')); cek(); });
})();

/* ===== Alasan ===== */
(() => {
  const daftar = [
    'Kamu bikin hari biasa terasa kayak hari libur.', 'Ketawa kamu menular, dan aku nggak mau sembuh.',
    'Di dekat kamu aku boleh jadi diri sendiri.', 'Kamu sabar sama aku yang kadang nyebelin.',
    'Kamu ingat hal kecil yang aku sendiri lupa.', 'Kamu cantik, tapi bukan itu yang bikin aku jatuh.',
    'Kamu percaya sama aku sebelum aku percaya diriku sendiri.', 'Diam bareng kamu nggak pernah canggung.',
    'Kamu keras kepala dengan cara yang lucu.', 'Nunggu hujan reda pun jadi kenangan kalau sama kamu.',
    'Kamu tulus, dan itu langka.', 'Kamu alasan aku senyum-senyum sendiri lihat layar HP.'
  ];
  const warna = ['#f4eadc', '#f2c9b8', '#f0d9a0', '#e9b3a0']; let sisa = [], total = 0;
  const tb = $('#btnAlasan'), jum = $('#jumlah');
  tb.addEventListener('click', () => {
    if (!sisa.length) sisa = [...daftar].sort(() => Math.random() - .5);
    const r = tb.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const k = document.createElement('div'); k.className = 'alasan-terbang'; k.textContent = sisa.pop(); k.style.background = pilih(warna);
    document.body.appendChild(k);
    const lb = k.offsetWidth, tg = k.offsetHeight, arah = cy > innerHeight * .45 ? -1 : 1;
    const x = Math.max(10, Math.min(innerWidth - lb - 10, cx - lb / 2)), dur = acak(4.4, 6) * (kurang ? .6 : 1);
    k.style.setProperty('--x', x + 'px'); k.style.setProperty('--y', (cy - tg / 2) + 'px');
    k.style.setProperty('--dx', acak(-70, 70) + 'px'); k.style.setProperty('--dy', arah * acak(170, 320) + 'px');
    k.style.setProperty('--r', acak(-12, 12) + 'deg'); k.style.setProperty('--dur', dur + 's');
    k.addEventListener('animationend', () => k.remove());
    Efek.ledak(cx, cy, 8); total++;
    jum.textContent = total === 1 ? 'Satu alasan sudah terbang. Masih banyak.' : total + ' alasan sudah terbang.';
  });
})();

/* ===== Surat ===== */
(() => {
  const teks = [
    'Sayang,',
    'Selamat ulang tahun ya. Hari ini kamu nambah umur, dan aku nambah satu alasan buat bersyukur: dari sekian banyak orang, aku dipertemukan sama kamu.',
    'Aku bukan orang yang jago merangkai kata. Makanya aku belajar bikin website ini, malam-malam, sambil mikirin kamu bakal bilang apa pas lihatnya.',
    'Semoga tahun ini kamu dikelilingi hal-hal baik, sehat terus, dan tetap ketawa selebar itu.',
    'Ada satu halaman lagi di menu, namanya Penyesalan. Kalau kamu mau, baca ya.'
  ];
  const tb = $('#amplop'), kertas = $('#kertas'), isi = $('#isiSurat');
  tb.addEventListener('click', () => {
    const buka = kertas.hidden; kertas.hidden = !buka; tb.setAttribute('aria-expanded', buka);
    tb.textContent = buka ? 'Tutup suratnya' : 'Buka suratnya'; kertas.classList.remove('cepat'); isi.innerHTML = '';
    if (!buka) return;
    let i = 0;
    teks.forEach((t) => {
      const p = document.createElement('p');
      t.split(' ').forEach((w) => { const s = document.createElement('span'); s.className = 'kata'; s.style.animationDelay = (kurang ? 0 : i++ * 0.07) + 's'; s.textContent = w + ' '; p.appendChild(s); });
      isi.appendChild(p);
    });
  });
  kertas.addEventListener('click', () => kertas.classList.add('cepat'));
})();
