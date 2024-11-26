import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'quasar/src/css/index.sass'

import '@/assets/style/main.scss'
import { MotionPlugin } from '@vueuse/motion'

import App from './App.vue'
import router from './router'

import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(plugin, defaultConfig)

app.use(Quasar, {
	plugins: {}, // import Quasar plugins and add here
	config: {
		// brand: {
		// 	primary: '#194a75',
		// },
		notify: {}, // default set of options for Notify Quasar plugin
		loading: {}, // default set of options for Loading Quasar plugin
		loadingBar: {}, // settings for LoadingBar Quasar plugin
	},
})
app.use(MotionPlugin)

app.mount('#app')
