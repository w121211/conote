import React from 'react'
import { FormProvider, useFieldArray, useForm, Controller } from 'react-hook-form'
import { components, ControlProps, GroupBase, OptionProps, StylesConfig } from 'react-select'
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

const Control = (props: ControlProps<Option[], true>) => {
  const { children, ...rest } = props
  return (
    <components.Control
      {...rest}
      className={`flex-grow min-w-[300px] min-h-[38px] border rounded outline outline-2 outline-offset-0 ${
        rest.isFocused ? 'outline-blue-800 border-transparent' : 'border-gray-300 outline-transparent'
      }  `}
    >
      {children}
    </components.Control>
  )
}

const customComponents = {
  DropdownIndicator: undefined,
  ClearIndicator: undefined,
  Control,
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
      // height: '100%',
      // padding: '0',
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
      // height: '90%',
    }),
    multiValue: (provided, state) => ({
      ...provided,
      // height: '100%',
      // padding: '0',
      color: '#5c6cda',
      backgroundColor: '#d6daff',
      // mixBlendMode: 'multiply',
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      // height: '100%',
      // paddingTop: '0',
      // paddingBottom: '0',
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
      <div className="w-[90%] mx-auto sm:w-[50vw]">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          // onChange={() => {
          //   setSubmitDisable(false)
          //   setSubmitFinished(false)
          // }}
        >
          {[
            ['title', '標題', ''],
            ['author', '來源作者', '例如:@巴菲特'],
            ['url', '來源網址', '例如:http://www.youtube.com/xxx...'],
            ['keywords', '關鍵字', ''],
            ['redirects', '重新導向', '請使用 "空格" 分隔'],
          ].map(([name, title, placeholder]) => {
            return (
              <label key={name} className="flex items-center">
                <h5 className="flex-shrink-0 w-20 text-gray-700 font-normal">{title}</h5>
                {name === 'keywords' ? (
                  <Controller
                    control={control}
                    name="keywords"
                    render={({ field: { onChange, value, ref } }) => (
                      <CreatableSelect
                        isMulti
                        styles={{ control: () => ({}) }}
                        onChange={e => {
                          onChange(e)
                          // console.log(e)
                        }}
                        value={value}
                        components={customComponents}
                        noOptionsMessage={() => null}
                        placeholder={placeholder}
                      />
                    )}
                  />
                ) : (
                  <input
                    {...register(name as keyof FormInputs)}
                    type="text"
                    className="input border border-gray-300 focus:outline-blue-800"
                    placeholder={placeholder}
                  />
                )}
              </label>
            )
          })}
          <div className="text-center">
            <button className="btn-primary h-10 w-24 mt-4" type="submit" disabled={!isDirty}>
              {isSubmitted ? (isDirty ? '送出' : '已送出') : '送出'}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default HeaderForm
