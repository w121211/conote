import React, { useState } from 'react'
import { CreatePostForm } from './create-post-form'

export const CommentContainer = ({ discussId, isModal }: { discussId: string; isModal?: boolean }) => {
  const [showForm, setShowForm] = useState(true)
  return (
    <div>
      <CreatePostForm discussId={discussId} isModal={isModal} />
    </div>
  )
}
