<script setup lang="ts">
import { animations, insert } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"

const insertPointClasses = [
	"absolute",
	"bg-blue-500",
	"z-[1000]",
	"rounded-full",
	"duration-[5ms]",
	"before:block",
	'before:content-["Insert"]',
	"before:whitespace-nowrap",
	"before:block",
	"before:bg-blue-500",
	"before:py-1",
	"before:px-2",
	"before:rounded-full",
	"before:text-xs",
	"before:absolute",
	"before:top-1/2",
	"before:left-1/2",
	"before:-translate-y-1/2",
	"before:-translate-x-1/2",
	"before:text-white",
	"before:text-xs",
]

const [parent, tapes] = useDragAndDrop([
	"Depeche Mode",
	"Duran Duran",
	"Pet Shop Boys",
	"Kraftwerk",
	"Tears for Fears",
	"Spandau Ballet",
],
	{
		plugins: [animations(),
			// insert({
			// 	insertPoint: (parent) => {
			// 		const div = document.createElement("div")
			// 		for (const cls of insertPointClasses) div.classList.add(cls)
			// 		return div
			// 	}
			// })
		],
		dragPlaceholderClass: 'custom'
	},
)

</script>

<template lang="pug">
q-page(padding)
	h2 lakjdlk
	.par(ref="parent")
		.chil(v-for=" tape in tapes" :key="tape") {{ tape }}

</template>

<style scoped lang="scss">
.par {
	display: grid;
	grid-template-columns: repeat(3, 150px);
	column-gap: 1rem;
	row-gap: 1rem;
}

.chil {
	height: 100px;
	background: #fff;
	padding: 1rem;
}

.custom {
	background: red;
}
</style>
