import React, { useEffect, useRef, useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import { mockDocs } from '../../frontend/components/editor-textarea/test/__mocks__/mock-doc'
import DocPreview from '../../frontend/components/editor-slate/src/components/doc-preview'
import { docValueRepo } from '../../frontend/components/editor-slate/src/stores/doc-value.repository'
import { blocksToIndenters } from '../../frontend/components/editor-slate/src/indenter/serializers'
import { parseGQLBlocks } from '../../share/utils'

export default {
  title: 'EditorSlate/DocPreview',
  component: DocPreview,
} as ComponentMeta<typeof DocPreview>

export const Base = () => {
  const doc = mockDocs[0],
    { blocks: gqlBlocks } = doc.noteDraftCopy.contentBody,
    { blocks } = parseGQLBlocks(gqlBlocks),
    [rootIndenter, ...bodyIndenters] = blocksToIndenters(blocks)
  // indenters = blocksToIndenters(doc.noteDraftCopy.contentBody.blocks)

  docValueRepo.setDocValue(doc.uid, bodyIndenters)

  return <DocPreview docUid={doc.uid} />
}
