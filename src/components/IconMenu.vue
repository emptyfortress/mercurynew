<script setup lang="ts">
import { ref, markRaw } from 'vue'
import IconAa from '@/components/icons/list/IconAa.vue'
import IconApp from '@/components/icons/list/IconApp.vue'
import IconAttribute from '@/components/icons/list/IconAttribute.vue'
import IconBeach from '@/components/icons/list/IconBeach.vue'
import IconBlock from '@/components/icons/list/IconBlock.vue'
import IconBolt from '@/components/icons/list/IconBolt.vue'
import IconClear from '@/components/icons/list/IconClear.vue'
import IconCommunity from '@/components/icons/list/IconCommunity.vue'
import IconCopy from '@/components/icons/list/IconCopy.vue'
import IconDocumentation from '@/components/icons/list/IconDocumentation.vue'
import IconDragHere from '@/components/icons/list/IconDragHere.vue'
import IconEcosystem from '@/components/icons/list/IconEcosystem.vue'
import IconEntrance from '@/components/icons/list/IconEntrance.vue'
import IconEye from '@/components/icons/list/IconEye.vue'
import IconFaceMask from '@/components/icons/list/IconFaceMask.vue'
import IconField from '@/components/icons/list/IconField.vue'
import IconFlag from '@/components/icons/list/IconFlag.vue'
import IconFolder from '@/components/icons/list/IconFolder.vue'
import IconFolderSearch from '@/components/icons/list/IconFolderSearch.vue'
import IconForm from '@/components/icons/list/IconForm.vue'
import IconGroup from '@/components/icons/list/IconGroup.vue'
import IconHeader from '@/components/icons/list/IconHeader.vue'
import IconHome from '@/components/icons/list/IconHome.vue'
import IconInfo from '@/components/icons/list/IconInfo.vue'
import IconLetter from '@/components/icons/list/IconLetter.vue'
import IconLib from '@/components/icons/list/IconLib.vue'
import IconLogic from '@/components/icons/list/IconLogic.vue'
import IconMicrophone from '@/components/icons/list/IconMicrophone.vue'
import IconOpenAi from '@/components/icons/list/IconOpenAi.vue'
import IconPaint from '@/components/icons/list/IconPaint.vue'
import IconPallete from '@/components/icons/list/IconPallete.vue'
import IconPersonNo from '@/components/icons/list/IconPersonNo.vue'
import IconPic from '@/components/icons/list/IconPic.vue'
import IconPresentation from '@/components/icons/list/IconPresentation.vue'
import IconPrinter from '@/components/icons/list/IconPrinter.vue'
import IconRocket from '@/components/icons/list/IconRocket.vue'
import IconRun from '@/components/icons/list/IconRun.vue'
import IconTravel from '@/components/icons/list/IconTravel.vue'
import IconUpArrowCircle from '@/components/icons/list/IconUpArrowCircle.vue'
import IconUpArrowCircleFill from '@/components/icons/list/IconUpArrowCircleFill.vue'
import IconWizard from '@/components/icons/list/IconWizard.vue'

const IconAa1 = markRaw(IconAa)
const IconApp1 = markRaw(IconApp)
const IconAttribute1 = markRaw(IconAttribute)
const IconBeach1 = markRaw(IconBeach)
const IconBlock1 = markRaw(IconBlock)
const IconBolt1 = markRaw(IconBolt)
const IconClear1 = markRaw(IconClear)
const IconCommunity1 = markRaw(IconCommunity)
const IconCopy1 = markRaw(IconCopy)
const IconDocumentation1 = markRaw(IconDocumentation)
const IconDragHere1 = markRaw(IconDragHere)
const IconEcosystem1 = markRaw(IconEcosystem)
const IconEntrance1 = markRaw(IconEntrance)
const IconEye1 = markRaw(IconEye)
const IconFaceMask1 = markRaw(IconFaceMask)
const IconField1 = markRaw(IconField)
const IconFlag1 = markRaw(IconFlag)
const IconFolder1 = markRaw(IconFolder)
const IconFolderSearch1 = markRaw(IconFolderSearch)
const IconForm1 = markRaw(IconForm)
const IconGroup1 = markRaw(IconGroup)
const IconHeader1 = markRaw(IconHeader)
const IconHome1 = markRaw(IconHome)
const IconInfo1 = markRaw(IconInfo)
const IconLetter1 = markRaw(IconLetter)
const IconLib1 = markRaw(IconLib)
const IconLogic1 = markRaw(IconLogic)
const IconMicrophone1 = markRaw(IconMicrophone)
const IconOpenAi1 = markRaw(IconOpenAi)
const IconPaint1 = markRaw(IconPaint)
const IconPallete1 = markRaw(IconPallete)
const IconPersonNo1 = markRaw(IconPersonNo)
const IconPic1 = markRaw(IconPic)
const IconPresentation1 = markRaw(IconPresentation)
const IconPrinter1 = markRaw(IconPrinter)
const IconRocket1 = markRaw(IconRocket)
const IconRun1 = markRaw(IconRun)
const IconTravel1 = markRaw(IconTravel)
const IconUpArrowCircle1 = markRaw(IconUpArrowCircle)
const IconUpArrowCircleFill1 = markRaw(IconUpArrowCircleFill)
const IconWizard1 = markRaw(IconWizard)

const icons = ref([
	{ id: 0, selected: true, pic: IconApp1 },
	{ id: 1, selected: false, pic: IconTravel1 },
	{ id: 2, selected: false, pic: IconAa1 },
	{ id: 3, selected: false, pic: IconAttribute1 },
	{ id: 4, selected: false, pic: IconBeach1 },
	{ id: 5, selected: false, pic: IconBlock1 },
	{ id: 6, selected: false, pic: IconBolt1 },
	{ id: 7, selected: false, pic: IconClear1 },
	{ id: 8, selected: false, pic: IconCommunity1 },
	{ id: 9, selected: false, pic: IconCopy1 },
	{ id: 10, selected: false, pic: IconDocumentation1 },
	{ id: 11, selected: false, pic: IconDragHere1 },
	{ id: 12, selected: false, pic: IconEcosystem1 },
	{ id: 13, selected: false, pic: IconEntrance1 },
	{ id: 14, selected: false, pic: IconEye1 },
	{ id: 15, selected: false, pic: IconFaceMask1 },
	{ id: 16, selected: false, pic: IconField1 },
	{ id: 17, selected: false, pic: IconFlag1 },
	{ id: 18, selected: false, pic: IconFolder1 },
	{ id: 20, selected: false, pic: IconFolderSearch1 },
	{ id: 21, selected: false, pic: IconForm1 },
	{ id: 22, selected: false, pic: IconGroup1 },
	{ id: 23, selected: false, pic: IconHeader1 },
	{ id: 24, selected: false, pic: IconHome1 },
	{ id: 25, selected: false, pic: IconInfo1 },
	{ id: 26, selected: false, pic: IconLetter1 },
	{ id: 27, selected: false, pic: IconLib1 },
	{ id: 28, selected: false, pic: IconLogic1 },
	{ id: 29, selected: false, pic: IconMicrophone1 },
	{ id: 30, selected: false, pic: IconOpenAi1 },
	{ id: 31, selected: false, pic: IconPaint1 },
	{ id: 32, selected: false, pic: IconPallete1 },
	{ id: 33, selected: false, pic: IconPersonNo1 },
	{ id: 34, selected: false, pic: IconPic1 },
	{ id: 35, selected: false, pic: IconPresentation1 },
	{ id: 36, selected: false, pic: IconPrinter1 },
	{ id: 37, selected: false, pic: IconRocket1 },
	{ id: 38, selected: false, pic: IconRun1 },
	{ id: 39, selected: false, pic: IconUpArrowCircle1 },
	{ id: 40, selected: false, pic: IconUpArrowCircleFill1 },
	{ id: 41, selected: false, pic: IconWizard1 },
])

const emit = defineEmits(['select'])
const select = (icon: any) => {
	icons.value.map((item) => (item.selected = false))
	icon.selected = true
	emit('select', icon.pic)
}
</script>

<template lang="pug">
q-menu
	q-list.ii
		q-item(clickable,
			v-for="icon in icons",
			:key='icon.id',
			@click='select(icon)'
			v-close-popup
			:class='{selected: icon.selected}')
			q-item-section
				component(:is='icon.pic')
</template>

<style scoped lang="scss">
.ii {
	display: grid;
	grid-template-columns: repeat(8, auto);
	font-size: 1.8rem;
	color: var(--icon);
	.selected {
		background: var(--selection);
	}
}
.q-menu {
	z-index: 5;
}
</style>
