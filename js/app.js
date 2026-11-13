new Vue({
  el: '#app',
  data: {
    tab: 'stok',
    state: { stok: [], tracking: [], paket: [], pengirimanList: [], upbjjList: [], kategoriList: [] },
    loading: true,
    error: ''
  },
  async created() {
    try { this.state = await Api.load(); }
    catch (e) { this.error = e.message + '. Jalankan lewat Live Server, bukan file://.'; }
    finally { this.loading = false; }
  },
  methods: {
    handleNewDO(d) { this.state.tracking.push(d); },
    handleProgress(no, p) { this.state.tracking.find(d => d.noDO === no).perjalanan.push(p); }
  }
});