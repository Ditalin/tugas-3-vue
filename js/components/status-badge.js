Vue.component('status-badge', {
  props: ['qty', 'safety'],
  template: '#tpl-badge',
  computed: {
    info() {
      if (this.qty === 0) return { cls: 'bad', icon: '⛔', label: 'Kosong' };
      if (this.qty < this.safety) return { cls: 'warn', icon: '⚠️', label: 'Menipis' };
      return { cls: 'ok', icon: '✅', label: 'Aman' };
    }
  }
});