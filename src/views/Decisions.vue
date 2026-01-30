<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Tree from '@/components/decision/Tree.vue'

const splitterModel = ref(30)

const selected = ref('Food')

const simple = ref([
	{
		label: 'Решения',
		children: [
			{ label: 'Food', icon: 'restaurant_menu' },
			{ label: 'Room service', icon: 'room_service' },
			{ label: 'Room view', icon: 'photo' },
		],
	},
])
</script>

<template lang="pug">
q-page(padding)
	q-splitter(
		v-model="splitterModel"
		style="height: 400px"
	)
		template(v-slot:before)
			div.q-pa-md
				Tree

		template(v-slot:after)
			q-tab-panels(
				v-model="selected"
				animated
				transition-prev="jump-up"
				transition-next="jump-up"
			)
				q-tab-panel(name="Relax Hotel")
					div.text-h4.q-mb-md Welcome
					p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
					p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.

				q-tab-panel(name="Food")
					div.text-h4.q-mb-md Food
					p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
					p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.

				q-tab-panel(name="Room service")
					div.text-h4.q-mb-md Room service
					p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
					p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
					p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.

				q-tab-panel(name="Room view")
					div.text-h4.q-mb-md Room view
					p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
					p Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.

	// q-splitter(
	//	v-model="splitterModel"
	//	style="height: 400px")
	//
	//	template(v-slot:before)
	//		q-tree()
	//	template(v-slot:after) two

</template>

<style scoped lang="scss">
.grid {
}
</style>
