import React from 'react'
import { screen, render } from '@testing-library/react'

test("press 'delete' on empty line followed by line contains inlines", () => {
  const doc = Doc.createDoc({
    symbol: '$AAA',
    card: null,
    fromDocCid: null,
  })
  render(<BulletEditor doc={doc} />)
  expect(doc.getValue()).toEqual({})
  // expect(screen.getByText(testAuthor)).toBeInTheDocument()

  // render(<RateButton target={testTarget} onClick={mockOnClick} />)
  // expect(screen.getByText(testTarget)).toBeInTheDocument()

  // render(<RateButton choice={testChoice} onClick={mockOnClick} />)
  // expect(screen.getByText('看多')).toBeInTheDocument()

  // render(<RateButton onClick={mockOnClick} />)
  // expect(screen.getByText('新增Rate')).toBeInTheDocument()
})

// test('rate button displays choice', () => {
// })
