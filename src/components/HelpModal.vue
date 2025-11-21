<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HealthiconsGuideDogfrom from '@/components/icons/HealthiconsGuideDog.vue'

type HelpTopic = {
	label: string
	url: string
}

const props = defineProps<{
	menuLabel: string
}>()

const emit = defineEmits<{
	ok: [menuLabel: string]
	cancel: [menuLabel: string]
}>()

const