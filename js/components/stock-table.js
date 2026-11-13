const kosong = () => ({ kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: '' });

Vue.component('ba-stock-table', {
  props: ['items', 'upbjjList', 'kategoriList'],
  template: '#tpl-stock',
  data() {
    return {
      list: [],
      f: { upbjj: '', kategori: '', reorder: false },
      sortKey: '',
      sortAsc: true,
      hover: null,
      form: null,
      editKode: null,
      editUpbjj: null,
      errors: []
    };
  },
  computed: {
    kategoriTersedia() {
      return [...new Set(this.list.filter(i => i.upbjj === this.f.upbjj).map(i => i.kategori))];
    },
    tampil() {
      let r = this.list.filter(i =>
        (!this.f.upbjj || i.upbjj === this.f.upbjj) &&
        (!this.f.kategori || i.kategori === this.f.kategori) &&
        (!this.f.reorder || i.qty < i.safety || i.qty === 0));
      if (this.sortKey) {
        const k = this.sortKey, d = this.sortAsc ? 1 : -1;
        r = [...r].sort((a, b) => (typeof a[k] === 'string' ? a[k].localeCompare(b[k]) : a[k] - b[k]) * d);
      }
      return r;
    }
  },
  watch: {
    items: { immediate: true, handler(v) { this.list = v; } },
    'f.upbjj'() { this.f.kategori = ''; }
  },
  methods: {
    resetFilter() {
      this.f = { upbjj: '', kategori: '', reorder: false };
      this.sortKey = '';
      this.sortAsc = true;
    },
    bukaForm(it) {
      this.errors = [];
      this.editKode = it ? it.kode : null;
      this.editUpbjj = it ? it.upbjj : null;
      this.form = it ? { ...it } : kosong();
    },
    validasi() {
      const f = this.form, e = [];
      if (!f.kode) e.push('Kode wajib diisi.');
      if (!f.judul) e.push('Judul wajib diisi.');
      if (!f.kategori) e.push('Kategori wajib dipilih.');
      if (!f.upbjj) e.push('UT-Daerah wajib dipilih.');
      if (!f.lokasiRak) e.push('Lokasi rak wajib diisi.');
      if (!(f.harga > 0)) e.push('Harga harus lebih dari 0.');
      if (!(f.qty >= 0) || f.qty === '') e.push('Stok tidak boleh negatif.');
      if (!(f.safety >= 0) || f.safety === '') e.push('Stok safety tidak boleh negatif.');
      if (!this.editKode && this.list.some(i => i.kode === f.kode && i.upbjj === f.upbjj)) e.push('Kode sudah ada di UT-Daerah tersebut.');
      return e;
    },
    simpan() {
      this.errors = this.validasi();
      if (this.errors.length) return;
      if (this.editKode) {
        const idx = this.list.findIndex(i => i.kode === this.editKode && i.upbjj === this.editUpbjj);
        this.$set(this.list, idx, { ...this.form });
      } else {
        this.list.push({ ...this.form });
      }
      this.form = null;
    },
    async hapus(it) {
      const ok = await this.$root.$refs.modal.confirm({
        title: 'Hapus bahan ajar?',
        message: `${it.kode} – ${it.judul} (${it.upbjj}) akan dihapus.`,
        okText: 'Hapus'
      });
      if (ok) this.list.splice(this.list.indexOf(it), 1);
    }
  }
});