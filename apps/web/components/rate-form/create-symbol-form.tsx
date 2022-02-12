import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useCardLazyQuery } from '../../apollo/query.graphql'
import { AsyncTickerConsumer } from './create-rate-form'

interface Option {
  value: string
  label: string
}

interface FormInput {
  target: string
  description: string
}

const CreateSymbolForm = ({ defaultValues, onSubmitted }: { defaultValues: FormInput; onSubmitted: () => void }) => {
  const { register, handleSubmit } = useForm<FormInput>({ defaultValues })
  const [queryCard, { data }] = useCardLazyQuery()
  const onSubmit = (v: FormInput) => {
    // queryCard({ variables: { symbol: '$' + v.target } })
    onSubmitted()
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">新增標的</h2>
      <form className="flex flex-col gap-4 w-[40vw]" onSubmit={handleSubmit(onSubmit)}>
        <label className="flex-shrink-0 flex items-center">
          <h5 className="w-20 text-gray-700 font-normal ">標的</h5>
          <div className='flex-grow relative before:absolute before:content-["$"] before:left-1 before:top-1/2 before:-translate-y-1/2 before:text-sm'>
            <input
              {...register('target')}
              className="input w-full pl-4 uppercase"
              type="text"
              // placeholder="例如:https://www.youtube.com/xxx..."
            />
          </div>
        </label>
        <label className="flex-shrink-0 flex items-center">
          <h5 className="w-20 text-gray-700 font-normal ">公司全稱</h5>
          <input
            {...register('description')}
            className="input flex-grow"
            type="text"
            //   placeholder="例如:https://www.youtube.com/xxx..."
          />
        </label>
        <div className="text-center">
          <button className="btn-primary h-10 w-24 mt-4" type="submit">
            新增
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateSymbolForm
