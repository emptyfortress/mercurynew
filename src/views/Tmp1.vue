<script setup lang="ts">
import { animations, insert } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/vue"


const [parent, tapes] = useDragAndDrop([
	{ id: 0, expand: false, label: "Depeche Mode", },
	{ id: 1, expand: false, label: "Duran Duran", },
	{ id: 2, expand: false, label: "Pet Shop Boys", },
	{ id: 3, expand: false, label: "Kraftwerk", },
	{ id: 4, expand: false, label: "Tears for Fears", },
	{ id: 5, expand: false, label: "Spandau Ballet", },
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

const calcClass = ((item: any) => {
	item.expand ? 'active' : ''

})

const expand = ((item: any) => {
	// item.expand = !item.expand
	console.log(item)
})

</script>

<template lang="pug">
q-page(padding)
	.pa(ref="parent")
		.chil(v-for=" (tape, index) in tapes" :key="tape.id"
			)
			.con {{ tape.label }}

</template>

<style scoped lang="scss">
.pa {
	display: grid;
	grid-template-columns: repeat(3, 150px);
	column-gap: 1rem;
	row-gap: 1rem;
	margin: 0 auto;
	width: 470px;
	background: #ccc;
}

.chil {
	height: 100px;
	background: #fff;
	padding: 1rem;

	&.active {
		position: fixed;
		height: 70vh;
		width: 900px;
		margin: 0 auto;
		top: 150px;
		left: 0;
		right: 0;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.2);
	}
}

.custom {
	background: hsl(213 38% 81% / 1);

	.con {
		display: none;
	}

}
</style>
