import store from '@/store'

const { body } = document
const WIDTH = 960
const RATIO = 3

export default {
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  },
  methods: {
    resizeHandler() {
      store.dispatch('app/setDocument', {document_width: document.documentElement.clientWidth, document_height: document.documentElement.clientHeight})
    }
  },
  BODY: body
}
