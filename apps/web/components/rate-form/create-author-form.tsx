import React, { useEffect, useRef } from 'react'
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useCardLazyQuery, useCreateAuthorMutation } from '../../apollo/query.graphql'
import { AuthorType, AuthorInput, Author } from 'graphql-let/__generated__/__types__'
import Select from 'react-select'
import { customStyle, reactSelectControlStyle } from './create-rate-form'

interface Option {
  value: AuthorType
  label: string
}

interface FormInput extends Omit<AuthorInput, 'type'> {
  type: Option
}
//   // name: string
//   // type: AuthorType
//   // job: string
//   // org: string
// }

const typeOptions = [
  { value: 'PERSON', label: '人' },
  { value: 'ORG', label: '公司機構' },
]

const CreateAuthorForm = ({
  defaultValues,
  onSubmitted,
}: {
  defaultValues: FormInput
  onSubmitted: (authorData: Author) => void
}) => {
  const { register, handleSubmit, control, watch } = useForm<FormInput>({ defaultValues })
  const { fields, append, remove } = useFieldArray({ name: 'sites', control })
  const [createAuthoer] = useCreateAuthorMutation({
    onCompleted(data) {
      if (data.createAuthor) {
        onSubmitted(data.createAuthor)
      }
    },
  })
  const appendRef = useRef<HTMLButtonElement | null>(null)
  const onSubmit = (v: FormInput) => {
    createAuthoer({
      variables: {
        data: {
          name: v.name,
          type: v.type.value,
          sites: v.sites,
          job: v.job,
          org: v.org,
        },
      },
    })
  }

  const watchSites = watch('sites')

  useEffect(() => {
    if (appendRef.current) {
      appendRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [watchSites])

  return (
    <form
      id="create-author-form"
      className="grid auto-rows-min grid-cols-[max-content_auto]  gap-4 w-[40vw] items-center pb-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label className="py-2 text-right text-gray-700 font-normal text-sm">
        <span className="text-red-600">*</span>
        名字
      </label>
      <div className='flex-grow relative before:absolute before:content-["@"] before:left-2 before:top-1/2 before:-translate-y-1/2 before:text-sm'>
        <input
          {...register('name', { required: true })}
          className="input w-full pl-6"
          type="text"
          // placeholder="例如:https://www.youtube.com/xxx..."
        />
      </div>

      <label className="py-2 text-right text-gray-700 font-normal text-sm">
        <span className="text-red-600">*</span>類型
      </label>
      <div className="flex-grow relative">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              options={typeOptions}
              defaultValue={typeOptions[0]}
              isSearchable={false}
              components={{ IndicatorSeparator: null }}
              styles={{ ...customStyle, control: base => ({ ...base, ...reactSelectControlStyle, cursor: 'pointer' }) }}
            />
          )}
        />
        {/* <select
          {...register('type')}
          className="input  h-9 px-1 py-0 "

          // placeholder="例如:https://www.youtube.com/xxx..."
        >
          <option value="PERSON">人</option>
          <option value="ORG">組織機構</option>
        </select> */}
      </div>

      <label className="py-2 text-right text-gray-700 font-normal text-sm">職稱</label>
      <div className="flex-grow relative ">
        <input
          {...register('job')}
          className="input w-full "
          type="text"
          // placeholder="例如:https://www.youtube.com/xxx..."
        />
      </div>

      <label className="py-2 text-right text-gray-700 font-normal text-sm">所屬公司</label>
      <input
        {...register('org')}
        className="input "
        type="text"
        //   placeholder="例如:https://www.youtube.com/xxx..."
      />

      <label className="self-start py-2 text-right text-gray-700 font-normal text-sm">
        <span className="text-red-600">*</span>網站
      </label>
      <div>
        {fields.map((field, i) => {
          return (
            <div key={field.id} className="  col-start-2 flex gap-2 w-full border-b border-gray-200">
              <div className="flex-grow flex flex-col">
                <input
                  {...register(`sites.${i}.name`, { required: true })}
                  className="input "
                  type="text"
                  placeholder="網頁名稱"
                />
                <input
                  {...register(`sites.${i}.url`, { required: true })}
                  className="input"
                  type="text"
                  placeholder="網址"
                />
              </div>
              <button
                type="button"
                className={`${i === 0 ? 'invisible' : 'visible'} text-sm text-red-400 hover:text-red-500 p-0`}
                onClick={() => remove(i)}
              >
                <span className="material-icons">clear</span>
              </button>
            </div>
          )
        })}
        <div className="col-start-2 text-left text-sm text-gray-600">
          <button
            type="button"
            className="hover:bg-gray-200 px-1 mt-2"
            onClick={e => {
              append({ name: '', url: '' })
            }}
            ref={appendRef}
          >
            + 新增網址
          </button>
        </div>
      </div>

      {/* <div className="text-center col-span-full">
          <button className="btn-primary h-10 w-24 mt-4" type="submit">
            新增
          </button>
        </div> */}
    </form>
  )
}

export default CreateAuthorForm
