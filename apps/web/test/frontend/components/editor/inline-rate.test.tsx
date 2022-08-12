import React from 'react'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RateButton from '../rate-button/rate-button'
import InlineRate from '../inline/inline-rate'

const mockOnClick = () => {
  //
}

describe('inline-rate', () => {
  const testAuthor = '@author'
  const testTarget = '$AA'
  const testChoice = '#LONG'

  test('rate button displays content', () => {
    render(<RateButton author={testAuthor} onClick={mockOnClick} />)
    expect(screen.getByText(testAuthor)).toBeInTheDocument()

    render(<RateButton target={testTarget} onClick={mockOnClick} />)
    expect(screen.getByText(testTarget)).toBeInTheDocument()

    render(<RateButton choice={testChoice} onClick={mockOnClick} />)
    expect(screen.getByText('看多')).toBeInTheDocument()

    render(<RateButton onClick={mockOnClick} />)
    expect(screen.getByText('新增Rate')).toBeInTheDocument()
  })

  // test('rate button displays choice', () => {
  // })
})
