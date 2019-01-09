const { mapState, mapGetters, mapMutations, mapActions } = require('vuex')

module.exports = {
  computed: {
    ...mapState(['counter']),
    ...mapGetters(['getter']),
    ...mapState('module', ['mCounter']),
    ...mapState('module/nested', ['mmCounter']),
    ...mapGetters('module', ['mGetter']),
    ...mapGetters('module/nested', ['mmGetter']),
  },

  methods: {
    ...mapMutations(['mutation']),
    ...mapMutations('module', ['mMutation']),
    ...mapMutations('module/nested', ['mNestedMutation']),
    ...mapActions(['action']),
    ...mapActions('module', ['mAction']),
    ...mapActions('module/nested', ['mNestedAction']),
  },

  render: () => null,
}
