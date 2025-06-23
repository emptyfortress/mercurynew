<script setup lang="ts">
import { useDiagram } from '@/stores/diagram'

const mydiagram = useDiagram()

const select = (n: string) => {
	mydiagram.select(n)
}

const calcClass = (s: string) => {
	return mydiagram.selection == s ? 'selected' : ''
}

const test = () => {
	console.log(111)
}
</script>

<template>
	<svg
		width="726"
		height="214"
		viewBox="0 0 726 214"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g id="Frame 2">
			<g
				id="iniFrame"
				@click="select('Инициатор')"
				class="etap"
			>
				<rect
					id="Rectangle 1"
					x="37"
					y="1"
					width="677"
					height="205"
					fill="white"
					stroke="black"
					stroke-width="2"
					:class="calcClass('Инициатор')"
				/>
				<g id="Group 19">
					<g id="Group 18">
						<circle
							id="Ellipse 10"
							cx="59"
							cy="21"
							r="13"
							fill="#D9D9D9"
						/>
						<path
							id="Vector"
							d="M59.2954 20.5185C58.494 20.5185 57.808 20.2168 57.2373 19.6133C56.6666 19.0099 56.3813 18.2844 56.3813 17.437C56.3813 16.5896 56.6666 15.8642 57.2373 15.2607C57.808 14.6573 58.494 14.3556 59.2954 14.3556C60.0967 14.3556 60.7828 14.6573 61.3535 15.2607C61.9241 15.8642 62.2095 16.5896 62.2095 17.437C62.2095 18.2844 61.9241 19.0099 61.3535 19.6133C60.7828 20.2168 60.0967 20.5185 59.2954 20.5185ZM53.4672 26.6815V24.5244C53.4672 24.0879 53.5735 23.6868 53.7863 23.3211C53.999 22.9555 54.2812 22.6761 54.6328 22.483C55.3856 22.0849 56.1506 21.7866 56.9277 21.5878C57.7048 21.389 58.494 21.2894 59.2954 21.2889C60.0967 21.2884 60.886 21.388 61.6631 21.5878C62.4402 21.7876 63.2051 22.086 63.9579 22.483C64.3101 22.6756 64.5925 22.9549 64.8052 23.3211C65.0179 23.6873 65.1241 24.0884 65.1236 24.5244V26.6815H53.4672Z"
							fill="black"
						/>
					</g>
					<text
						id="iniciator"
						fill="black"
						xml:space="preserve"
						style="white-space: pre"
						font-family="Arial"
						font-size="12"
						letter-spacing="0em"
					>
						<tspan
							x="80"
							y="25.1602"
						>
							Инициатор
						</tspan>
					</text>
				</g>

				<g
					id="Group 2"
					class="etap"
					@click.stop="select('Создание заявления')"
				>
					<rect
						id="task"
						x="247"
						y="62"
						width="102"
						height="82"
						rx="11"
						fill="white"
						stroke="black"
						stroke-width="2"
						:class="calcClass('Создание заявления')"
					/>
					<text
						id="create"
						fill="black"
						xml:space="preserve"
						style="white-space: pre"
						font-family="Arial"
						font-size="12"
						letter-spacing="0em"
					>
						<tspan
							x="271.424"
							y="100.16"
						>
							Создание
						</tspan>
						<tspan
							x="269.344"
							y="114.16"
						>
							заявления
						</tspan>
					</text>
				</g>
				<path
					id="Arrow 1"
					d="M246 103L236 97.2265V108.774L246 103ZM141 103V104H237V103V102H141V103Z"
					fill="black"
				/>
				<circle
					id="Finish"
					cx="634.5"
					cy="101.5"
					r="16.5"
					fill="white"
					stroke="black"
					stroke-width="4"
					class="etap"
					@click.stop="select('Завершение')"
					:class="calcClass('Завершение')"
				/>
				<text
					id="finish"
					fill="black"
					xml:space="preserve"
					style="white-space: pre"
					font-family="Arial"
					font-size="12"
					letter-spacing="0em"
				>
					<tspan
						x="600.072"
						y="133.16"
					>
						Завершение
					</tspan>
				</text>
				<text
					id="start"
					fill="black"
					xml:space="preserve"
					style="white-space: pre"
					font-family="Arial"
					font-size="12"
					letter-spacing="0em"
				>
					<tspan
						x="107.193"
						y="137.16"
					>
						Старт
					</tspan>
				</text>
			</g>
			<g
				id="Group 1"
				@click.stop="select('Заявление')"
				class="etap"
			>
				<g id="Rectangle 6">
					<rect
						id="Rectangle 1_2"
						x="3"
						y="1"
						width="34"
						height="205"
						fill="white"
						stroke="black"
						stroke-width="2"
						:class="calcClass('Заявление')"
					/>
				</g>
				<text
					id="root"
					transform="translate(13 202) rotate(-90)"
					fill="black"
					xml:space="preserve"
					style="white-space: pre"
					font-family="Arial"
					font-size="12"
					letter-spacing="0em"
				>
					<tspan
						x="39.127"
						y="11.1602"
					>
						Заявление на отпуск
					</tspan>
				</text>
			</g>
			<circle
				id="Start"
				cx="122.5"
				cy="103.5"
				r="17.5"
				fill="white"
				stroke="black"
				stroke-width="2"
				@click.stop="select('Старт')"
				:class="calcClass('Старт')"
			/>
		</g>
	</svg>
</template>

<style scoped lang="scss">
.etap {
	cursor: pointer;
}

.selected {
	fill: var(--selection);

	rect {
		fill: var(--selection);
	}
}
</style>
