<script setup lang="ts">
import { useDiagram } from '@/stores/diagram'

const mydiagram = useDiagram()

const select = (n: string) => {
	console.log(n)
	mydiagram.select(n)
}

const calcClass = (s: string) => {
	return mydiagram.selection == s ? 'selected' : ''
}

const test = (() => {
	console.log(111)
})
</script>

<template>
	<svg width="760" height="378" viewBox="0 0 760 378" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g id="Frame 1">

			<g id="iniFrame" class="etap" @click="select('Инициатор')" :class='calcClass("Инициатор")'>
				<rect id="Rectangle 1" x="37" y="1" width="677" height="205" fill="white" stroke="black" stroke-width="2" />
				<g id="Group 19">
					<g id="Group 18">
						<circle id="Ellipse 10" cx="59" cy="21" r="13" fill="#D9D9D9" />
						<path id="Vector"
							d="M57.2954 20.5185C56.494 20.5185 55.808 20.2168 55.2373 19.6133C54.6666 19.0099 54.3813 18.2844 54.3813 17.437C54.3813 16.5896 54.6666 15.8642 55.2373 15.2607C55.808 14.6573 56.494 14.3556 57.2954 14.3556C58.0967 14.3556 58.7828 14.6573 59.3535 15.2607C59.9241 15.8642 60.2095 16.5896 60.2095 17.437C60.2095 18.2844 59.9241 19.0099 59.3535 19.6133C58.7828 20.2168 58.0967 20.5185 57.2954 20.5185ZM51.4672 26.6815V24.5244C51.4672 24.0879 51.5735 23.6868 51.7863 23.3211C51.999 22.9555 52.2812 22.6761 52.6328 22.483C53.3856 22.0849 54.1506 21.7865 54.9277 21.5878C55.7048 21.389 56.494 21.2894 57.2954 21.2889C58.0967 21.2884 58.886 21.388 59.6631 21.5878C60.4402 21.7876 61.2051 22.086 61.9579 22.483C62.3101 22.6756 62.5925 22.9549 62.8052 23.3211C63.0179 23.6873 63.1241 24.0884 63.1236 24.5244V26.6815H51.4672Z"
							fill="black" />
					</g>
					<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="12"
						letter-spacing="0em">
						<tspan x="80" y="25.1602">Инициатор</tspan>
					</text>
				</g>
			</g>

			<g id="rukFrame" class="etap" @click="select('Руководитель')" :class='calcClass("Руководитель")'>
				<rect id="Rectangle 1_2" x="37" y="206" width="677" height="164" fill="white" stroke="black" stroke-width="2" />
				<g id="Group 19_2">
					<g id="Group 18_2">
						<ellipse id="Ellipse 10_2" cx="57.7507" cy="229" rx="12.2939" ry="13" fill="#D9D9D9" />
						<path id="Vector_2"
							d="M57.2954 228.519C56.494 228.519 55.808 228.217 55.2373 227.613C54.6666 227.01 54.3813 226.284 54.3813 225.437C54.3813 224.59 54.6666 223.864 55.2373 223.261C55.808 222.657 56.494 222.356 57.2954 222.356C58.0967 222.356 58.7828 222.657 59.3535 223.261C59.9241 223.864 60.2095 224.59 60.2095 225.437C60.2095 226.284 59.9241 227.01 59.3535 227.613C58.7828 228.217 58.0967 228.519 57.2954 228.519ZM51.4672 234.681V232.524C51.4672 232.088 51.5735 231.687 51.7863 231.321C51.999 230.955 52.2812 230.676 52.6328 230.483C53.3856 230.085 54.1506 229.787 54.9277 229.588C55.7048 229.389 56.494 229.289 57.2954 229.289C58.0967 229.288 58.886 229.388 59.6631 229.588C60.4402 229.788 61.2051 230.086 61.9579 230.483C62.3101 230.676 62.5925 230.955 62.8052 231.321C63.0179 231.687 63.1241 232.088 63.1236 232.524V234.681H51.4672Z"
							fill="black" />
					</g>
					<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="12"
						letter-spacing="0em">
						<tspan x="78" y="233.16">Руководитель</tspan>
					</text>
				</g>
			</g>

			<path id="Vector 1" d="M612.5 299L602.5 293.226V304.774L612.5 299ZM350.5 300H603.5V298H350.5V300Z" fill="black" />

			<path id="Vector 2"
				d="M519 146L513.227 156H524.774L519 146ZM350 287H511V285H350V287ZM520 278V155H518V278H520ZM511 287C515.971 287 520 282.971 520 278H518C518 281.866 514.866 285 511 285V287Z"
				fill="black" />
			<path id="Vector 3"
				d="M351 269L361 274.774V263.227L351 269ZM458 104H414.242V106H458V104ZM405.242 113V261H407.242V113H405.242ZM398.242 268H360V270H398.242V268ZM405.242 261C405.242 264.866 402.108 268 398.242 268V270C403.212 270 407.242 265.971 407.242 261H405.242ZM414.242 104C409.271 104 405.242 108.029 405.242 113H407.242C407.242 109.134 410.376 106 414.242 106V104Z"
				fill="black" />

			<g id="Group 1" @click="select('Заявление')" :class="calcClass('Заявление')" class='etap'>
				<g id="Rectangle 6">
					<rect id="Rectangle 1_3" x="3" y="1" width="34" height="369" fill="white" stroke="black" stroke-width="2" />
				</g>
				<text transform="translate(13 240) rotate(-90)" fill="black" xml:space="preserve" style="white-space: pre"
					font-family="Arial" font-size="12" letter-spacing="0em">
					<tspan x="0" y="11.1602">Заявление на отпуск</tspan>
				</text>
			</g>

			<circle id="Start" cx="122.5" cy="103.5" r="17.5" fill="white" stroke="black" stroke-width="2" class="etap"
				@click="select('Старт')" :class="calcClass('Старт')" />

			<circle id="Finish" cx="630.5" cy="298.5" r="16.5" fill="white" stroke="black" stroke-width="4" class="etap"
				@click="select('Завершение')" :class="calcClass('Завершение')" />

			<g id="Group 2" class="etap" @click="select('Создание заявления')" :class="calcClass('Создание заявления')">
				<rect id="Rectangle 7" x="247" y="63" width="102" height="82" rx="11" fill="white" stroke="black"
					stroke-width="2" />
				<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="12"
					letter-spacing="0em">
					<tspan x="271.424" y="101.16">Создание</tspan>
					<tspan x="269.344" y="115.16">заявления</tspan>
				</text>
			</g>
			<g id="Group 4" class="etap" @click="select('Согласование')" :class="calcClass('Согласование')">
				<rect id="Rectangle 7_2" x="247" y="247" width="102" height="82" rx="11" fill="white" stroke="black"
					stroke-width="2" />
				<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="12"
					letter-spacing="0em">
					<tspan x="259.049" y="292.16">Согласование</tspan>
				</text>
			</g>

			<g id="Group 3" class="etap" @click="select('Доработка')" :class="calcClass('Доработка')">
				<rect id="Rectangle 7_3" x="458" y="63" width="102" height="82" rx="11" fill="white" stroke="black"
					stroke-width="2" />
				<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="12"
					letter-spacing="0em">
					<tspan x="479.352" y="108.16">Доработка</tspan>
				</text>
			</g>
			<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="12"
				letter-spacing="0em">
				<tspan x="596.072" y="330.16">Завершение</tspan>
			</text>
			<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="12"
				letter-spacing="0em">
				<tspan x="193.469" y="179.16">На согласование</tspan>
			</text>
			<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="12"
				letter-spacing="0em">
				<tspan x="356.469" y="179.16">На согласование</tspan>
			</text>
			<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="12"
				letter-spacing="0em">
				<tspan x="475.043" y="250.16">На доработку</tspan>
			</text>
			<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Arial" font-size="12"
				letter-spacing="0em">
				<tspan x="443.4" y="314.16">Согласовано</tspan>
			</text>
			<path id="Arrow 1" d="M246 104L236 98.2265V109.774L246 104ZM141 105H237V103H141V105Z" fill="black" />
			<path id="Arrow 2" d="M298 246L303.774 236H292.226L298 246ZM297 146V237H299V146H297Z" fill="black" />
		</g>
	</svg>
</template>

<style scoped lang="scss">
.etap {
	cursor: pointer;

	// path {
	// 	fill: pink;
	// }
}

.selected {
	fill: var(--selection);

	rect {
		fill: var(--selection);
	}
}
</style>
