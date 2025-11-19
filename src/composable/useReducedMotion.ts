import { ref, computed, watchEffect } from 'vue'

const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const prefersReduced = ref(mediaQuery.matches)

// Следим за системной настройкой
mediaQuery.addEventListener('change', (e) => {
	prefersReduced.value = e.matches
})

// Пользовательская настройка (localStorage)
const userOverride = ref(localStorage.getItem('reduceMotion') ?? 'auto')

watchEffect(() => {
	localStorage.setItem('reduceMotion', userOverride.value)
})

export function useReducedMotion() {
	const reducedMotion = computed(() => {
		if (userOverride.value === 'auto') return prefersReduced.value
		return userOverride.value === 'true'
	})

	function setReduceMotion(value: 'true' | 'false' | 'auto') {
		userOverride.value = value
	}

	return {
		reducedMotion, // true/false — итоговый флаг
		userOverride,
		setReduceMotion,
	}
}
