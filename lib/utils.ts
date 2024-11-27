// import * as pdfjs from 'pdfjs-dist/webpack.mjs'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const runAsyncFnWithoutBlocking = (
  fn: (...args: unknown[]) => Promise<unknown>
) => {
  void fn()
}

export function createResolvablePromise<T = unknown>(): {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (error: unknown) => void
} {
  let resolve: (value: T) => void = noop
  let reject: (error: unknown) => void = noop

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    promise,
    resolve,
    reject,
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}
