import { Serializable, exec } from 'child_process'
import { describe, expect, test } from 'vitest'

import { generatePrimes, isPrime } from './index.js'

describe('Main entry', () => {
  describe('isPrime', () => {
    test('returns expected type', () => {
      expect(typeof isPrime(0)).toBe('boolean')
    })

    test('for number 3 should be truthy', () => {
      expect(isPrime(3)).toBe(true)
    })

    test('for number 4 should be false', () => {
      expect(isPrime(4)).toBe(false)
    })
  })

  describe('generatePrimes', () => {
    test('returns expected type', () => {
      expect(Array.isArray(generatePrimes({ start: 2, end: 2 }))).toBe(true)
    })

    test('for range 2-2 should return result with one number equal 2', () => {
      const result = generatePrimes({ start: 2, end: 2 })

      expect(result.length).toBe(1)
      expect(result[0]).toBe(2)
    })

    test('for range 2-5 should return result with three numbers - 2,3,5', () => {
      const result = generatePrimes({ start: 2, end: 5 })

      expect(result.length).toBe(3)
      expect(result[0]).toBe(2)
      expect(result[1]).toBe(3)
      expect(result[2]).toBe(5)
    })

    test('for range 8-10 should return result as empty array', () => {
      const result = generatePrimes({ start: 8, end: 10 })

      expect(result.length).toBe(0)
    })
  })

  describe('running app', () => {
    test('worker_threads are available', async () => {
      const importedModule = import('worker_threads')

      await expect(importedModule).resolves.toBeTruthy()
    })

    test(
      'finishes with result',
      async () => {
        function runProcess() {
          return new Promise((resolve) => {
            const process = exec('npm start')

            let lastMessage: Serializable

            process.stdout!.on('data', (message) => (lastMessage = message))
            process.on('close', () => resolve(lastMessage))
          })
        }

        await expect(runProcess()).resolves.toMatch(/^Prime is : [0-9\s]+/)
      },
      15 * 60 * 1000
    )
  })
})
