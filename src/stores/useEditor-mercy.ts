import { defineStore } from 'pinia'

export const useEditor = defineStore({
  id: 'editor',
  state: () => ({
    type: 'Документ',
    typeOptions: ['Документ', 'Задание', 'Группа заданий'],
    vid: { type: 1, label: 'Входящий', value: 'Входящий' },
    vidOptions: [
      [
        { type: 0, label: 'Не указано', value: 'Не указано' },
        { type: 1, label: 'Входящий', value: 'Входящий' },
        { type: 1, label: 'Исходящий', value: 'Исходящий' },
        { type: 0, label: 'Заявка', value: 'Заявка' },
        { type: 0, label: 'Договор', value: 'Договор' },
        { type: 0, label: 'Письмо', value: 'Письмо' },
        { type: 0, label: 'Приказ', value: 'Приказ' },
        { type: 0, label: 'Заявление', value: 'Заявление' },
        { type: 0, label: 'Письмо', value: 'Письмо' },
        { type: 0, label: 'Черновик', value: 'Черновик' },
      ],
      [
        { type: 1, value: 'Не указано', label: 'Не указано' },
        { type: 1, value: 'На исполнение', label: 'На исполнение' },
        { type: 1, value: 'На ознакомление', label: 'На ознакомление' },
        { type: 1, value: 'На согласование', label: 'На согласование' },
      ],
      [{ type: 1, value: 'Не указано', label: 'Не указано' }],
    ],
  }),
  getters: {
    calcVid: (state) => {
      if (state.type == 'Документ') return state.vidOptions[0]
      if (state.type == 'Задание') return state.vidOptions[1]
      if (state.type == 'Группа заданий') return state.vidOptions[2]
    },
    calcFirst: (state) => {
      if (state.vid.label == 'Входящий') {
        return [] // Simplified - would need fields from select store
      }
      if (state.vid.label == 'Исходящий') {
        return [] // Simplified
      }
      if (state.type == 'Задание') {
        return [] // Simplified
      }
      if (state.type == 'Группа заданий') {
        return [] // Simplified
      }
      return []
    },
  },
  actions: {
    resetVid() {
      this.vid = {
        type: 0,
        label: 'Не указано',
        value: 'Не указано',
      }
    },
  },
})