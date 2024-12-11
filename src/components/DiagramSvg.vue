<script setup lang="ts">
import { useDiagram } from '@/stores/diagram'

const mydiagram = useDiagram()

const select = (n: string) => {
	mydiagram.select(n)
}

const calcClass = (s: string) => {
	if (s == '') return 'event'
	return mydiagram.selection == s ? 'selected' : ''
}
</script>

<template>
	<svg width="754" height="388" viewBox="0 0 754 388" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g id="diagram 1" clip-path="url(#clip0_1_2)">
			<g id="Group">
				<g id="zayv-group">
					<g id="Group_2">
						<path id="Vector" d="M749 5H5V383H749V5Z" fill="white" fill-opacity="0.95" stroke="#22242A"
							stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						<path id="Vector_2" d="M35 5V383" stroke="#22242A" stroke-width="1.5" stroke-linecap="round"
							stroke-linejoin="round" />
						<text id="otpusk" transform="matrix(0 -1 1 0 11.6 251.891)" fill="#22242A" xml:space="preserve"
							style="white-space: pre" font-family="Arial" font-size="12" letter-spacing="0em">
							<tspan x="0" y="11.1602">Заявление на отпуск</tspan>
						</text>
					</g>
				</g>
				<g id="Group_3">
					<g id="role-ruk">
						<g id="Group_4">
							<g id="Group_5">
								<text id="Rukov" transform="translate(49 237)" fill="#22242A" xml:space="preserve"
									style="white-space: pre" font-family="Arial" font-size="12" letter-spacing="0em">
									<tspan x="0" y="11.1602">Руководитель</tspan>
								</text>
							</g>
						</g>
					</g>

					<g id="role-inic">
						<g id="Group_6">
							<g id="Group_7">
								<path id="Vector_3" d="M749 5H35V223H749V5Z" fill="white" fill-opacity="0.25" stroke="#22242A"
									stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
								<text id="Iniciator" transform="translate(49 14)" fill="#22242A" xml:space="preserve"
									style="white-space: pre" font-family="Arial" font-size="12" letter-spacing="0em">
									<tspan x="0" y="11.1602">Инициатор</tspan>
								</text>
							</g>
						</g>
					</g>
					<g id="start">
						<g id="Group_8">
							<g id="Group_9">
								<path id="Vector_4"
									d="M139 131C148.941 131 157 122.941 157 113C157 103.059 148.941 95 139 95C129.059 95 121 103.059 121 113C121 122.941 129.059 131 139 131Z"
									fill="white" fill-opacity="0.95" stroke="#22242A" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round" />
							</g>
						</g>
					</g>
					<g id="createEtap">
						<g id="Group_10">
							<g id="Group_11">
								<path id="Vector_5" class="etap"
									d="M309 73H229C223.477 73 219 77.4772 219 83V143C219 148.523 223.477 153 229 153H309C314.523 153 319 148.523 319 143V83C319 77.4772 314.523 73 309 73Z"
									fill="white" fill-opacity="0.95" stroke="#22242A" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round" />
								<g id="Group_12">
									<text id="Sozdan" fill="#22242A" xml:space="preserve" style="white-space: pre" font-family="Arial"
										font-size="12" letter-spacing="0em">
										<tspan x="241.938" y="108.56">Создание</tspan>
									</text>
									<text id="zayav" fill="#22242A" xml:space="preserve" style="white-space: pre" font-family="Arial"
										font-size="12" letter-spacing="0em">
										<tspan x="239.859" y="122.96">заявления</tspan>
									</text>
								</g>
							</g>
						</g>
					</g>
					<g id="soglEtap">
						<g id="Group_13">
							<g id="Sogl">
								<path id="Vector_6"
									d="M309 263H229C223.477 263 219 267.477 219 273V333C219 338.523 223.477 343 229 343H309C314.523 343 319 338.523 319 333V273C319 267.477 314.523 263 309 263Z"
									fill="white" fill-opacity="0.95" stroke="#22242A" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round" />
								<text id="Sogltext" fill="#22242A" xml:space="preserve" style="white-space: pre" font-family="Arial"
									font-size="12" letter-spacing="0em">
									<tspan x="229.57" y="305.76">
										&#x421;&#x43e;&#x433;&#x43b;&#x430;&#x441;&#x43e;&#x432;&#x430;&#x43d;&#x438;&#x435;</tspan>
								</text>
							</g>
						</g>
					</g>
					<g id="dorabotkaEtap">
						<g id="Group_14">
							<g id="Group_15">
								<path id="Vector_7"
									d="M539 73H459C453.477 73 449 77.4772 449 83V143C449 148.523 453.477 153 459 153H539C544.523 153 549 148.523 549 143V83C549 77.4772 544.523 73 539 73Z"
									fill="white" fill-opacity="0.95" stroke="#22242A" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round" />
								<text id="dorab" fill="#22242A" xml:space="preserve" style="white-space: pre" font-family="Arial"
									font-size="12" letter-spacing="0em">
									<tspan x="469.375" y="115.76">&#x414;&#x43e;&#x440;&#x430;&#x431;&#x43e;&#x442;&#x43a;&#x430;</tspan>
								</text>
							</g>
						</g>
					</g>
					<g id="finishGroup">
						<g id="Group_16">
							<g id="Group_17">
								<path id="Vector_8"
									d="M659 341C668.941 341 677 332.941 677 323C677 313.059 668.941 305 659 305C649.059 305 641 313.059 641 323C641 332.941 649.059 341 659 341Z"
									fill="white" fill-opacity="0.95" stroke="#22242A" stroke-width="4" stroke-linecap="round"
									stroke-linejoin="round" />
							</g>
						</g>
					</g>
					<g id="arrow4">
						<g id="Group_18">
							<g id="Group_19">
								<path id="Vector_9"
									d="M157 112C156.448 112 156 112.448 156 113C156 113.552 156.448 114 157 114V112ZM219 113L209 107.226V118.774L219 113ZM157 114H210V112H157V114Z"
									fill="#22242A" />
							</g>
						</g>
					</g>
					<g id="arrow3">
						<g id="Group_20">
							<g id="Group_21">
								<path id="Vector_10"
									d="M270 153C270 152.448 269.552 152 269 152C268.448 152 268 152.448 268 153H270ZM269 263L274.774 253H263.226L269 263ZM268 153V254H270V153H268Z"
									fill="#22242A" />
							</g>
						</g>
					</g>
					<g id="arrow2">
						<g id="Group_22">
							<g id="Group_23">
								<path id="Vector_11"
									d="M320 285L330 290.773V279.227L320 285ZM384 278L385 277.984L384 278ZM381.5 110.5V109.5C381.235 109.5 380.98 109.605 380.793 109.793C380.605 109.98 380.5 110.235 380.5 110.5H381.5ZM446.5 111.5C447.052 111.5 447.5 111.052 447.5 110.5C447.5 109.948 447.052 109.5 446.5 109.5V111.5ZM329 286H372.5V284H329V286ZM385 277.984C382.5 119.474 382.5 125.989 382.5 110.5H380.5C380.5 126.011 380.5 119.526 383 278.016L385 277.984ZM381.5 111.5L446.5 111.5V109.5L381.5 109.5V111.5ZM372.5 286C374.737 286 376.629 286.001 378.182 285.888C379.724 285.776 381.05 285.547 382.111 285.021C383.226 284.468 383.995 283.613 384.451 282.399C384.888 281.237 385.028 279.774 385 277.984L383 278.016C383.027 279.726 382.882 280.888 382.579 281.695C382.296 282.449 381.871 282.908 381.222 283.229C380.519 283.578 379.512 283.786 378.037 283.893C376.573 283.999 374.763 284 372.5 284V286Z"
									fill="#22242A" />
							</g>
						</g>
					</g>
					<g id="arrow1">
						<g id="Group_24">
							<g id="Group_25">
								<path id="Vector_12"
									d="M319 322C318.448 322 318 322.448 318 323C318 323.552 318.448 324 319 324V322ZM641 323L631 317.226V328.774L641 323ZM319 324H632V322H319V324Z"
									fill="#22242A" />
							</g>
						</g>
					</g>
					<g id="arrow">
						<g id="Group_26">
							<g id="Group_27">
								<path id="Vector_13"
									d="M319 302C318.448 302 318 302.448 318 303C318 303.552 318.448 304 319 304V302ZM499 153L493.227 163H504.773L499 153ZM319 304H494V302H319V304ZM494 304C495.575 304 497.067 303.222 498.145 302.145C499.222 301.067 500 299.575 500 298H498C498 298.925 497.528 299.933 496.73 300.73C495.933 301.528 494.925 302 494 302V304ZM500 298V162H498V298H500Z"
									fill="#22242A" />
							</g>
						</g>
					</g>
				</g>
			</g>
			<g id="Group_28">
				<text id="Nasogl1" fill="#22242A" xml:space="preserve" style="white-space: pre" font-family="Arial"
					font-size="11" letter-spacing="0em">
					<tspan x="175" y="185.213">&#x41d;&#x430;
						&#x441;&#x43e;&#x433;&#x43b;&#x430;&#x441;&#x43e;&#x432;&#x430;&#x43d;&#x438;&#x435;</tspan>
				</text>
			</g>
			<g id="Group_29">
				<text id="Finish" fill="#22242A" xml:space="preserve" style="white-space: pre" font-family="Arial"
					font-size="11" letter-spacing="0em">
					<tspan x="627" y="357.213">&#x417;&#x430;&#x432;&#x435;&#x440;&#x448;&#x435;&#x43d;&#x438;&#x435;</tspan>
				</text>
			</g>
			<g id="Group_30">
				<text id="Sogl_2" fill="#22242A" xml:space="preserve" style="white-space: pre" font-family="Arial"
					font-size="11" letter-spacing="0em">
					<tspan x="447" y="335.213">&#x421;&#x43e;&#x433;&#x43b;&#x430;&#x441;&#x43e;&#x432;&#x430;&#x43d;&#x43e;
					</tspan>
				</text>
			</g>
			<g id="Group_31">
				<text id="Nasolg" fill="#22242A" xml:space="preserve" style="white-space: pre" font-family="Arial"
					font-size="11" letter-spacing="0em">
					<tspan x="333" y="185.213">&#x41d;&#x430;
						&#x441;&#x43e;&#x433;&#x43b;&#x430;&#x441;&#x43e;&#x432;&#x430;&#x43d;&#x438;&#x435;</tspan>
				</text>
			</g>
			<g id="Group_32">
				<text id="Nadorabotky" fill="#22242A" xml:space="preserve" style="white-space: pre" font-family="Arial"
					font-size="11" letter-spacing="0em">
					<tspan x="464" y="265.213">&#x41d;&#x430; &#x434;&#x43e;&#x440;&#x430;&#x431;&#x43e;&#x442;&#x43a;&#x443;
					</tspan>
				</text>
			</g>
		</g>
		<defs>
			<clipPath id="clip0_1_2">
				<rect width="754" height="388" fill="white" />
			</clipPath>
		</defs>
	</svg>
</template>

<style scoped lang="scss">
.etap {
	cursor: pointer;
	background: pink;
}

.selected {
	border: 3px solid $primary;
	background: var(--selection);
}
</style>
