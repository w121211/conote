import React from 'react'

const MeHeaderItem = ({ className }: { className?: string }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        <span className="material-icons text-red-600">favorite</span>
        <span className="text-sm text-gray-600">我的收藏</span>
      </div>
      <div className={`flex items-center text-gray-400 ${className ? className : ''}`}>
        <span className="material-icons">account_circle</span>
        <span className="material-icons">expand_more</span>
      </div>
    </div>
  )
}

export default MeHeaderItem
