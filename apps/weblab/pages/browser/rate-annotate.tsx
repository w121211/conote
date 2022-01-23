import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type Annotate = {
  str: string
  tag: string
}

// const MatchRateService = {
//   match(sent: string): void {
//   },
// }

const dictRate = {
  long: ['買進'],
  short: [],
  predict: ['目標價'],
}

const SubjectForm = (): JSX.Element => {
  return (
    <form>
      <select>Type</select>
      <input>Name</input>
      <input>Org</input>
      <input>Job</input>
      <input>Description</input>
    </form>
  )
}

class Annotator {
  sent: string
  annts: Annotate[] = []

  constructor(sent: string) {
    this.sent = sent
  }

  annotate(str: string, tag: string) {
    if (this.sent.indexOf(str) < 0) {
      throw 'str not found in sent'
    }
    this.annts.push({ str, tag })
  }

  toSegments(): (string | Annotate)[] {
    const segs: (string | Annotate)[] = []
    let curSent = this.sent
    let startIndex = 0

    while (true) {
      const sorted = this.annts
        .map((e) => {
          return {
            annt: e,
            index: curSent.indexOf(e.str),
          }
        })
        .filter((e) => e.index >= 0)
        .sort((e) => e.index)
      if (sorted.length === 0) {
        segs.push(curSent)
        break
      }
      const nearest = sorted[0]
      segs.push(curSent.slice(startIndex, nearest.index))
      segs.push(nearest.annt)
      curSent = curSent.slice(startIndex + nearest.index)
    }

    return segs
  }
}

export const Page = (): JSX.Element => {
  const router = useRouter()

  useEffect(() => {
    // const { pathname } = router
    // const { symbol, pop } = router.query

    if (router.isReady) {
      const { text, url } = router.query
    }
  }, [router])

  const sent =
    '週三高盛分析師 Noah Poponak 發布報導，給予買進評級與 11 美元目標價，激勵該股當日上漲 10.5%，遠勝當日大盤。當日 S&P 500 指數上升 0.3%。'
  const annotator = new Annotator(sent)
  const segs = annotator.toSegments()

  return (
    <div>
      {/* <button
        onClick={() => {
          setTag('SUBJ')
        }}
      >
        {tag == 'SUBJ' ? 'SUBJ*' : 'SUBJ'}
      </button>
      <button
        onClick={() => {
          setTag('OBJ')
        }}
      >
        {tag == 'OBJ' ? 'OBJ*' : 'OBJ'}
      </button>
      <button
        onClick={() => {
          setTag('RATE')
        }}
      >
        {tag == 'RATE' ? 'RATE*' : 'RATE'}
      </button> */}
      {/* <SubjectForm /> */}
      <div
        onMouseUp={() => {
          const selected = window.getSelection()
          if (selected) {
            const selectedText = selected.toString()
            console.log(selectedText)
          }
        }}
      >
        <span>Hello </span>
        <span style={{ color: 'red' }}>
          world
          <button>SUBJ</button>
          <button>OBJ</button>
          <button>x</button>
        </span>
        <span> hola</span>
      </div>

      <div>
        Subj: @XXXX<button>X</button> <button>create author form</button>
        <form>name, org, job, description, synonyms</form>
      </div>

      <div>
        Obj: @XXXX<button>X</button> <button>search to add</button>
      </div>

      <div>Rate: radio: long, short, hold</div>
    </div>
  )
}

export default Page
