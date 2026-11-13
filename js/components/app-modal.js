Vue.component('app-modal', {
  template: '#tpl-modal',
  data() { return { show: false, title: '', message: '', okText: 'Ya', resolver: null }; },
  methods: {
    confirm({ title = 'Konfirmasi', message = '', okText = 'Ya' }) {
      Object.assign(this, { title, message, okText, show: true });
      return new Promise(r => { this.resolver = r; });
    },
    close(v) { this.show = false; if (this.resolver) this.resolver(v); }
  }
});