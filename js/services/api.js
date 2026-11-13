const Api = {
  async load() {
    const res = await fetch('data/dataBahanAjar.json');
    if (!res.ok) throw new Error('Gagal memuat data (' + res.status + ')');
    const d = await res.json();
    const seen = {};
    d.tracking = d.tracking.flatMap(o => Object.entries(o))
      .filter(([k]) => !seen[k] && (seen[k] = true))
      .map(([k, v]) => ({ noDO: k, ...v }));
    return d;
  },
  now() {
    const n = new Date(), p = x => String(x).padStart(2, '0');
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())} ${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`;
  },
  today() { return this.now().slice(0, 10); }
};

Vue.filter('rupiah', v => 'Rp ' + Number(v || 0).toLocaleString('id-ID'));
Vue.filter('buah', v => Number(v || 0) + ' buah');
Vue.filter('tanggal', v => v ? new Date(v + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '');