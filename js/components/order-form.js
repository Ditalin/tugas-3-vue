Vue.component('order-form', {
  props: ['paket', 'ekspedisi', 'existing'],
  template: '#tpl-order',
  data() { return { f: this.baru(), errors: [], sukses: '' }; },
  computed: {
    noDO() {
      const y = new Date().getFullYear();
      const seqs = this.existing.filter(d => d.noDO.startsWith('DO' + y + '-')).map(d => parseInt(d.noDO.split('-')[1], 10));
      const next = (seqs.length ? Math.max(...seqs) : 0) + 1;
      return `DO${y}-${String(next).padStart(3, '0')}`;
    },
    paketDipilih() { return this.paket.find(p => p.kode === this.f.paket); },
    total() { return this.paketDipilih ? this.paketDipilih.harga : 0; }
  },
  watch: {
    'f.nim'(v) { if (/\D/.test(v)) this.f.nim = v.replace(/\D/g, ''); },
    'f.paket'() { this.sukses = ''; }
  },
  methods: {
    baru() { return { nim: '', nama: '', ekspedisi: '', paket: '', tanggal: Api.today() }; },
    kirim() {
      const f = this.f, e = [];
      if (!/^\d{9}$/.test(f.nim)) e.push('NIM harus 9 digit angka.');
      if (f.nama.length < 3) e.push('Nama minimal 3 karakter.');
      if (!f.ekspedisi) e.push('Pilih ekspedisi.');
      if (!f.paket) e.push('Pilih paket bahan ajar.');
      if (!f.tanggal) e.push('Tanggal kirim wajib diisi.');
      this.errors = e;
      this.sukses = '';
      if (e.length) return;
      const no = this.noDO;
      this.$emit('created', {
        noDO: no, nim: f.nim, nama: f.nama, status: 'Diproses', ekspedisi: f.ekspedisi,
        tanggalKirim: f.tanggal, paket: f.paket, total: this.total,
        perjalanan: [{ waktu: Api.now(), keterangan: 'DO dibuat' }]
      });
      this.f = this.baru();
      this.$nextTick(() => { this.sukses = `DO ${no} tersimpan. Cek di tab Tracking DO.`; });
    }
  }
});