import React from 'react'
import { setEntities } from '@ngneat/elf-entities'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { blockRepo } from '../../src/stores/block.repository'
import { docRepo } from '../../src/stores/doc.repository'

import {
  findSelectedItems,
  getDescendantsUids,
} from '../../src/handlers/textarea-handlers'
import { mockDocs } from '../__mocks__/mock-doc'

// beforeAll(() => {
//   blockRepo.update([setEntities(mockDocs.blocks)])
//   docRepo.update([setEntities([mockDoc.doc])])
// })

// test('', () => {
//   getDescendantsUids()
// })

// test('findSelectedItems()', () => {
//   render(<DocEl doc={mockDoc.doc} />)

//   // fireEvent.click(screen.getByText('Load Greeting'))
//   // console.log(screen.getByText('About'))
//   // console.log(screen.getAllByText('About'))

//   fireEvent.mouseDown(screen.getByText('About'))

//   // await waitFor(() => screen.getByRole('heading'))

//   // expect(screen.getByRole('heading')).toHaveTextContent('hello there')
//   // expect(screen.getByRole('button')).toBeDisabled()

//   // const tx = document.querySelector()

//   findSelectedItems()
// })
