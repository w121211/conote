import React from 'react'
import { FormProvider, useFieldArray, useForm, Controller } from 'react-hook-form'
import { GroupBase, StylesConfig } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { CardDocument, CardQuery, useUpdateCardMetaMutation } from '../../apollo/query.graphql'

type Option = {
  label: string
  value: string
}

type FormInputs = {
  title: string
  author: string
  url: string
  keywords: { label: string; value: string }[]
  redirects: string
  duplicates: string
  date: string
  description: string
}
const components = {
  DropdownIndicator: null,
  // ClearIndicator: null,
}

const HeaderForm = ({
  initialValue,
  cardId,
  handleSubmitted,
}: {
  initialValue: FormInputs
  cardId: string
  handleSubmitted: (isSubmitted: boolean) => void
}): JSX.Element => {
  const methods = useForm<FormInputs>({
    defaultValues: initialValue,
  })
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { isDirty, isSubmitSuccessful, isSubmitted },
  } = methods

  const [updateCardMeta] = useUpdateCardMetaMutation({
    update(cache, { data }) {
      const res = cache.readQuery<CardQuery>({ query: CardDocument })
      if (data?.updateCardMeta && res?.card?.meta) {
        cache.writeQuery({
          query: CardDocument,
          data: {
            ...res.card.meta,
            title: data.updateCardMeta.title,
            author: data.updateCardMeta.author,
            keywords: data.updateCardMeta.keywords,
            duplicates: data.updateCardMeta.duplicates,
            redirects: data.updateCardMeta.redirects,
            url: data.updateCardMeta.url,
          },
        })
      }
    },
    onCompleted(data) {
      // console.log(data.updateCardMeta)
      if (data.updateCardMeta) {
        const newData = data.updateCardMeta
        // setValue('title', newData.title ?? '', { shouldDirty: false })
        // setValue('author', newData.author ?? '', { shouldDirty: false })
        // setValue('url', newData.url ?? '', { shouldDirty: false })
        // setValue('redirects', newData.redirects?.join(' ') ?? '', { shouldDirty: false })
        // setValue('keywords', newData.keywords?.join(' ') ?? '', { shouldDirty: false })
        // setValue('duplicates', newData.duplicates?.join(' ') ?? '', { shouldDirty: false })
        reset(
          {
            title: newData.title ?? '',
            author: newData.author ?? '',
            url: newData.url ?? '',
            redirects: newData.redirects?.join(' ') ?? '',
            keywords:
              newData.keywords?.map(e => {
                return { label: e, value: e }
              }) ?? [],
            duplicates: newData.duplicates?.join(' ') ?? '',
          },
          { keepIsSubmitted: true },
        )
        handleSubmitted(isSubmitted)
      }
    },
    // refetchQueries: [{ query: CardDocument, variables: { symbol } }],
  })

  const onSubmit = (d: FormInputs) => {
    if (d) {
      const keywordArr: string[] = []
      if (d.keywords) {
        d.keywords.forEach(e => {
          keywordArr.push(e.value)
        })
      }
      updateCardMeta({
        variables: {
          cardId,
          data: {
            author: d.author,
            title: d.title,
            url: d.url,
            redirects: d.redirects.split(' '),
            duplicates: d.duplicates.split(' '),
            keywords: keywordArr,
          },
        },
      })
    }
  }

  const customStyles: StylesConfig<Option, true, GroupBase<Option>> = {
    valueContainer: (provided, state) => ({
      ...provided,
      height: '100%',
      padding: '0',
    }),
    control: (provided, { isFocused }) => ({
      ...provided,
      height: '44px',
      // height: '100%',
      padding: '0 8px',
      border: 'none',
      borderRadius: '6px',
      background: '#f6f7fb',
      ':hover': {
        background: '#eef1fd',
      },
      boxShadow: isFocused ? 'none' : 'none',
    }),
    placeholder: (provided, state) => ({
      ...provided,
      fontSize: '14px',
    }),
    container: (provided: any, state: any) => ({
      ...provided,
      margin: '0.5em 0 1em',
    }),
    input: (provided, state) => ({
      ...provided,
      // height: '100%',
    }),
    multiValue: (provided, state) => ({
      ...provided,
      // height: '100%',
      padding: '0',
      color: '#5c6cda',
      backgroundColor: '#d6daff',
      // mixBlendMode: 'multiply',
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      // height: '100%',
      paddingTop: '0',
      paddingBottom: '0',
      color: '#5c6cda',

      // mixBlendMode: 'multiply',
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      // height: '100%',
      // padding: '0',
      color: '#5c6cda',
      backgroundColor: 'none',
      // mixBlendMode: 'multiply',
      ':hover': {
        color: 'white',

        backgroundColor: '#5c6cda',
      },
    }),
    option: provided => ({
      ...provided,
      height: '30px',
      padding: '0 8px',
    }),
  }

  return (
    <FormProvider {...methods}>
      <div className="w-[90%] my-4 mx-auto sm:w-[50vw]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          // onChange={() => {
          //   setSubmitDisable(false)
          //   setSubmitFinished(false)
          // }}
        >
          <label>
            <h5>標題</h5>
            <input {...register('title')} type="text" placeholder="標題" className="input" />
          </label>
          <label>
            <h5>作者</h5>
            <input {...register('author')} type="text" placeholder="來源作者" className="input" />
          </label>
          <label>
            <h5>網址</h5>
            <input {...register('url')} type="text" placeholder="來源網址" className="input" />
          </label>
          <label>
            <h5>Keywords</h5>
            {/* <input {...register('keywords')} type="text" placeholder="請使用 '空格' 分隔" /> */}
            <Controller
              control={control}
              name="keywords"
              render={({ field: { onChange, value, ref } }) => (
                <CreatableSelect
                  isMulti
                  styles={customStyles}
                  onChange={e => {
                    onChange(e)
                    // console.log(e)
                  }}
                  value={value}
                  components={components}
                  noOptionsMessage={() => null}
                  placeholder="新增keyword"
                />
              )}
            ></Controller>
          </label>
          <label>
            <h5>Redirects</h5>
            <input {...register('redirects')} type="text" placeholder="請使用 '空格' 分隔" className="input" />
          </label>
          <label>
            <h5>Duplicates</h5>
            <input {...register('duplicates')} type="text" placeholder="請使用 '空格' 分隔" className="input" />
          </label>
          <div className="text-center">
            <button className="btn-primary" type="submit" disabled={!isDirty}>
              {isSubmitted ? (isDirty ? '提交' : '已提交') : '提交'}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default HeaderForm
