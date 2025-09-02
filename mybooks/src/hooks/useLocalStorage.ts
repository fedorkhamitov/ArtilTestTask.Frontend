import { useState, useCallback, useEffect } from 'react'

/**
 * Хук для работы с localStorage
 * 
 * Предоставляет удобный интерфейс для сохранения и получения данных
 * из localStorage с автоматической сериализацией/десериализацией JSON.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  
  /**
   * Получаем значение из localStorage или возвращаем initialValue
   */
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Ошибка чтения localStorage для ключа "${key}":`, error)
      return initialValue
    }
  })

  /**
   * Функция для установки значения в localStorage и state
   */
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Позволяем передавать функцию для обновления значения
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      setStoredValue(valueToStore)
      
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Ошибка записи в localStorage для ключа "${key}":`, error)
    }
  }, [key, storedValue])

  /**
   * Функция для удаления значения из localStorage
   */
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Ошибка удаления из localStorage для ключа "${key}":`, error)
    }
  }, [key, initialValue])

  /**
   * Слушаем изменения localStorage от других вкладок
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Ошибка обработки изменения localStorage для ключа "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue, removeValue]
}