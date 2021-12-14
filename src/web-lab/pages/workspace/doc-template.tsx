import { useEffect, useState } from 'react'
import { BehaviorSubject } from 'rxjs'
import { useObservable } from 'rxjs-hooks'

const TEMPLATES = {
  webpage: 'webpage template',
  company: 'company',
  ticker: 'ticker',
}

class DocTemplateService {
  readonly template$ = new BehaviorSubject<string | null>(null)

  // readonly curDoc$ = new BehaviorSubject<{
  //   doc: Doc | null
  //   error?: string
  //   // warn?: 'prev_doc_behind'
  // }>({ doc: null })

  // readonly status$ = new BehaviorSubject<
  //   'starting' | 'loading' | 'saving' | 'pushing' | 'droped' | null
  // >('starting')

  // public readonly savedDocs$: string[] = [] // docs not pushed yet

  open(templateName: keyof typeof TEMPLATES): void {
    this.template$.next(TEMPLATES[templateName])
  }
}

const docTemplateService = new DocTemplateService()

const Page = (): JSX.Element | null => {
  const curDoc = useObservable(() => docTemplateService.template$)

  return (
    <div>
      <button
        onClick={() => {
          docTemplateService.open('company')
        }}
      >
        Template1
      </button>

      <button
        onClick={() => {
          docTemplateService.open('ticker')
        }}
      >
        Template1
      </button>

      <button
        onClick={() => {
          docTemplateService.open('webpage')
        }}
      >
        Template1
      </button>

      <button
        onClick={() => {
          // docTemplateService.toDoc()
        }}
      >
        Confirm
      </button>

      <p>{curDoc}</p>
    </div>
  )
}

export default Page
