import { fileURLToPath } from 'url'
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'

export type GeneratePrimesArgs = { start: number; end: number }

const MIN = 2
const MAX = 1e7
const MAX_WORKERS_AMOUNT = 10
const CHUNK_SIZE_PER_WORKER = Math.ceil(MAX / MAX_WORKERS_AMOUNT)

function sleep() {
  return new Promise<void>((r) => setTimeout(r, 0))
}

export function isPrime(num: number) {
  for (let j = 2; j <= Math.sqrt(num); j++) {
    if (num % j == 0) {
      return false
    }
  }

  return true
}

export function generatePrimes({ start, end }: GeneratePrimesArgs) {
  const primes: number[] = []

  for (let i = start; i < end + 1; i++) {
    if (isPrime(i)) {
      primes.push(i)
    }
  }

  return primes
}

export async function runMainThread() {
  const primes: number[] = []
  let runningWorkersAmount = 0

  console.time('Processing time')
  for (let start = MIN; start < MAX + 1; start += CHUNK_SIZE_PER_WORKER) {
    while (runningWorkersAmount == MAX_WORKERS_AMOUNT) {
      // Sleeping because of max workers
      await sleep()
    }

    runningWorkersAmount++

    const end = Math.min(start + CHUNK_SIZE_PER_WORKER - 1, MAX)
    const filename = fileURLToPath(import.meta.url)
    const worker = new Worker(filename, {
      workerData: { start, end } as GeneratePrimesArgs,
      execArgv: process.env.VITEST ? ['-r', 'ts-node/register', '--loader', 'ts-node/esm', '--no-warnings'] : undefined,
    })

    worker.on('message', async (chunkOfPrimes: number[]) => {
      primes.push(...chunkOfPrimes)

      runningWorkersAmount--
    })
  }

  while (runningWorkersAmount) {
    // Waiting for end of workers work
    await sleep()
  }

  const message = 'Prime is : ' + primes.join(' ')
  console.log(message)
  console.timeEnd('Processing time')
}

function runWorker() {
  const primes = generatePrimes(workerData as GeneratePrimesArgs)

  parentPort!.postMessage(primes)
}

if (isMainThread) {
  runMainThread()
} else {
  runWorker()
}
