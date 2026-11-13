Vue.component('do-tracking', {
  props: ['data'],
  template: '#tpl-tracking',
  data() { return { keyword: '', applied: '', searched: false, ket: {} }; },
  computed: {
    hasil() {
      const k = this.applied.toLowerCase();
      return this.data.filter(d => d.noDO.toLowerCase() === k || d.nim === this.applied);
    }
  },
  watch: {
    keyword(v) { if (!v) { this.applied = ''; this.searched = false; } }
  },
  methods: {
    cari() { if (!this.keyword) return; this.applied = this.keyword; this.searched = true; },
    reset() { this.keyword = ''; },
    tambah(d) {
      const t = (this.ket[d.noDO] || '').trim();
      if (!t) return;
      this.$emit('progress', d.noDO, { waktu: Api.now(), keterangan: t });
      this.$set(this.ket, d.noDO, '');
    }
  }
});