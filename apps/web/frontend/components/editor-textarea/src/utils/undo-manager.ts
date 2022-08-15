import { BehaviorSubject, debounceTime, skip, tap } from 'rxjs'

/**
 * Simple undo/redo manager for text input
 *
 * TODO:
 * - [] Not sure do observables unsubscribe automatically if the object is disposed?
 *      If they do, no need to unsubscribe manually.
 */
export class UndoManager {
  // Include past, current and future states, use curIdx to identify
  states: string[]

  // Point to the crrent state
  curStateIdx: number

  // Recevier of input value, update when input value changed
  value$: BehaviorSubject<string>

  // state$: Observable<string>

  constructor(initStr = '') {
    this.states = [initStr]
    this.curStateIdx = 0
    this.value$ = new BehaviorSubject<string>(initStr)

    /**
     * Debounced to avoid storing every change on the input
     * If current state has futures, reset redos by removing the futures
     */
    this.value$
      .pipe(
        debounceTime(500),
        skip(1),
        tap(e => {
          if (this.curStateIdx > this.states.length - 1)
            throw new Error('this.curStateIdx > this.states.length - 1')

          if (this.curStateIdx < this.states.length - 1) {
            this.states = this.states.slice(0, this.curStateIdx + 1)
          }
          this.states.push(e)
          this.curStateIdx += 1

          // console.log(this.states)
        }),
      )
      .subscribe()
    // this.state$.subscribe()
  }

  nextValue(str: string) {
    this.value$.next(str)
  }

  undo(): string | null {
    // console.log(this.curStateIdx, this.states)
    if (this.curStateIdx === 0) {
      return null
    }
    if (this.curStateIdx > 0) {
      this.curStateIdx -= 1
      // console.log(this.curStateIdx, this.states, this.states[this.curStateIdx])
      return this.states[this.curStateIdx]
    }

    console.debug(this.curStateIdx)
    throw new Error('Unexpected error')
  }

  redo(): string | null {
    const lastIdx = this.states.length - 1

    if (this.curStateIdx === lastIdx) {
      return null
    }
    if (this.curStateIdx + 1 <= lastIdx) {
      this.curStateIdx += 1
      return this.states[this.curStateIdx]
    }

    console.debug(this.curStateIdx)
    throw new Error('Unexpected error')
  }

  /**
   * Unsubscribe here
   */
  // destroy() {}
}
