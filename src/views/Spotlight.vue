<script setup>
import MyTour from '@/components/MyTour.vue'
import { StagePlaySpotlight, StagePlayScene, useStagePlay } from 'vue-stage-play'

const { action } = useStagePlay()
</script>

<template lang="pug">
q-page(padding)
	.zg How to place a giraffe into a refrigerator?
	.text-center
		q-btn(unelevated color="primary" label="Старт" @click="action('basic')") 


	.grid
		StagePlaySpotlight
			StagePlayScene(:act-name="'basic'" :scene="1" )
				.text-h6 Step1
				template(#voiceOver="scopedProps")
					MyTour(
						:title="'Step1'"
						:content="'Open the door of the refrigerator.'"
						:has-prev-scene="scopedProps.hasPrevScene"
						:has-next-scene="scopedProps.hasNextScene"
						@prev="scopedProps.prevScene()"
						@next="scopedProps.nextScene()"
						@done="scopedProps.cut()"
					)

			StagePlayScene(:act-name="'basic'" :scene="2" )
				.text-h6 Step2
				template(#voiceOver="scopedProps")
					MyTour(
						:title="'Step2'"
						:content="'Extract the elephant from the refrigerator.'"
						:has-prev-scene="scopedProps.hasPrevScene"
						:has-next-scene="scopedProps.hasNextScene"
						@prev="scopedProps.prevScene()"
						@next="scopedProps.nextScene()"
						@done="scopedProps.cut()"
					)

			StagePlayScene(:act-name="'basic'" :scene="3" )
				.text-h6 Step3
				template(#voiceOver="scopedProps")
					MyTour(
						:title="'Step3'"
						:content="'Place the giraffe inside the refrigerator.'"
						:has-prev-scene="scopedProps.hasPrevScene"
						:has-next-scene="scopedProps.hasNextScene"
						@prev="scopedProps.prevScene()"
						@next="scopedProps.nextScene()"
						@done="scopedProps.cut()"
					)

			StagePlayScene(:act-name="'basic'" :scene="4" )
				.text-h6 Step4
				template(#voiceOver="scopedProps")
					MyTour(
						:title="'Step4'"
						:content="'Close the door of the refrigerator.'"
						:has-prev-scene="scopedProps.hasPrevScene"
						:has-next-scene="scopedProps.hasNextScene"
						@prev="scopedProps.prevScene()"
					@next="scopedProps.nextScene()"
					@done="scopedProps.cut()"
				)

			StagePlayScene(:act-name="'basic'" :scene="5" )
				template(#voiceOver="scopedProps")
					MyTour(
						:title="'Success!'"
						:content="'You place a giraffe into a refrigerator.'"
						:has-prev-scene="scopedProps.hasPrevScene"
						:has-next-scene="scopedProps.hasNextScene"
						@prev="scopedProps.prevScene()"
						@next="scopedProps.nextScene()"
						@done="scopedProps.cut()"
					)

	img(src="@/assets/img/page.svg", alt="" width="100")

</template>

<style lang="scss">
.q-page {
	overflow: hidden;
}

.zg {
	font-size: 1.3rem;
	font-weight: 500;
	text-align: center;
}

.grid {
	max-width: 1200px;
	margin: 1rem auto;
	display: flex;
	flex-direction: column;
	gap: 3rem;
}
</style>
