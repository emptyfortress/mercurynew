import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'quasar/src/css/index.sass'

import '@/assets/style/main.scss'
import { MotionPlugin } from '@vueuse/motion'

import App from './App.vue'
import router from './router'

import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'
// import VueDragSelect from '@coleqiu/vue-drag-select'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(plugin, defaultConfig)

app.use(Quasar, {
	plugins: { Notify }, // import Quasar plugins and add here
	config: {
		notify: {
			position: 'bottom',
			timeout: 3000,
			icon: 'mdi-alert',
			color: 'primary',
			classes: 'notifications',
		}, // default set of options for Notify Quasar plugin
		loading: {}, // default set of options for Loading Quasar plugin
		loadingBar: {}, // settings for LoadingBar Quasar plugin
	},
})
app.use(MotionPlugin)
// app.use(VueDragSelect)

app.mount('#app')
