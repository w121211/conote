import React from 'react'

const AuthorInfo = () => {
  return (
    <div className="flex flex-col gap-2">
      {[
        { title: '網站', value: 'http://www.youtube.com/xxx...' },
        {
          title: '平台',
          value: 'Youtube',
        },
      ].map(({ title, value }, i) => {
        return (
          <div className="flex text-sm" key={i}>
            <span className="w-16 text-gray-500">{title}</span>
            <span className="text-gray-900">{value}</span>
          </div>
        )
      })}
    </div>
  )
}

export default AuthorInfo
