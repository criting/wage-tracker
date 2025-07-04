import { ref, watch } from 'vue'

export function useLocalStorage(key: string, defaultValue: string) {
  const stored = process.client ? localStorage.getItem(key) : null
  const data = ref(stored ?? defaultValue)

  watch(data, (newVal) => {
    if (process.client) {
      localStorage.setItem(key, newVal)
    }
  })

  return data
}