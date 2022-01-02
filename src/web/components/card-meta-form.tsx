import React from 'react'
import { FormProvider, useFieldArray, useForm, Controller } from 'react-hook-form'
import {
  components,
  ControlProps,
  GroupBase,
  MultiValueGenericProps,
  MultiValueProps,
  OptionProps,
  StylesConfig,
} from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { CardMetaInput } from 'graphql-let/__generated__/__types__'

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
      className={`flex-grow min-w-[300px] min-h-[38px] rounded hover:bg-gray-100 ${
        rest.isFocused ? 'bg-gray-100 ' : ''
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

const changeInputwidth = (name: string) => {
  switch (name) {
    case 'title':
    case 'author':
      return 'w-48'
    case 'url':
      return 'w-96'
    case 'redirects':
      return 'w-64'
  }
}

const toCardMetaInput = (input: FormInputs): CardMetaInput => {
  const { title, author, url, keywords, redirects, duplicates, date, description } = input
  const stringOrUndefined = (str: string) => (str === '' ? undefined : str)
  const stringArrayOrUndefined = (str: string, splitter: string) =>
    str === '' ? undefined : duplicates.split(splitter)
  return {
    author: stringOrUndefined(author),
    date: stringOrUndefined(date),
    description: stringOrUndefined(description),
    duplicates: stringArrayOrUndefined(duplicates, ' '),
    keywords: keywords.map(e => e.value),
    redirects: stringArrayOrUndefined(redirects, ' '),
    title: stringOrUndefined(title),
    url: stringOrUndefined(url),
  }
}

const CardMetaForm = ({
  metaInput,
  onSubmit,
}: {
  metaInput?: CardMetaInput
  onSubmit: (input: CardMetaInput) => void
}): JSX.Element => {
  const methods = useForm<FormInputs>({
    defaultValues: {
      author: metaInput?.author ?? '',
      title: metaInput?.title ?? '',
      url: metaInput?.url ?? '',
      keywords:
        metaInput?.keywords?.map(e => {
          return { label: e, value: e }
        }) ?? [],
      redirects: metaInput?.redirects?.join(' ') ?? '',
      duplicates: metaInput?.duplicates?.join(' ') ?? '',
      description: metaInput?.description ?? '',
      date: metaInput?.date ?? '',
    },
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

  // const [updateCardMeta] = useUpdateCardMetaMutation({
  //   update(cache, { data }) {
  //     const res = cache.readQuery<CardQuery>({ query: CardDocument })
  //     if (data?.updateCardMeta && res?.card?.meta) {
  //       cache.writeQuery({
  //         query: CardDocument,
  //         data: {
  //           ...res.card.meta,
  //           title: data.updateCardMeta.title,
  //           author: data.updateCardMeta.author,
  //           keywords: data.updateCardMeta.keywords,
  //           duplicates: data.updateCardMeta.duplicates,
  //           redirects: data.updateCardMeta.redirects,
  //           url: data.updateCardMeta.url,
  //         },
  //       })
  //     }
  //   },
  //   onCompleted(data) {
  //     // console.log(data.updateCardMeta)
  //     if (data.updateCardMeta) {
  //       const newData = data.updateCardMeta
  //       // setValue('title', newData.title ?? '', { shouldDirty: false })
  //       // setValue('author', newData.author ?? '', { shouldDirty: false })
  //       // setValue('url', newData.url ?? '', { shouldDirty: false })
  //       // setValue('redirects', newData.redirects?.join(' ') ?? '', { shouldDirty: false })
  //       // setValue('keywords', newData.keywords?.join(' ') ?? '', { shouldDirty: false })
  //       // setValue('duplicates', newData.duplicates?.join(' ') ?? '', { shouldDirty: false })
  //       reset(
  //         {
  //           title: newData.title ?? '',
  //           author: newData.author ?? '',
  //           url: newData.url ?? '',
  //           redirects: newData.redirects?.join(' ') ?? '',
  //           keywords:
  //             newData.keywords?.map(e => {
  //               return { label: e, value: e }
  //             }) ?? [],
  //           duplicates: newData.duplicates?.join(' ') ?? '',
  //         },
  //         { keepIsSubmitted: true },
  //       )
  //       onSubmitted(data.updateCardMeta)
  //     }
  //   },
  //   // refetchQueries: [{ query: CardDocument, variables: { symbol } }],
  // })

  // const onSubmit = (d: FormInputs) => {
  //   if (d) {
  //     const keywordArr: string[] = []
  //     if (d.keywords) {
  //       d.keywords.forEach(e => {
  //         keywordArr.push(e.value)
  //       })
  //     }
  //     // updateCardMeta({
  //     //   variables: {
  //     //     cardId,
  //     //     data: {
  //     //       author: d.author,
  //     //       title: d.title,
  //     //       url: d.url,
  //     //       redirects: d.redirects.split(' '),
  //     //       duplicates: d.duplicates.split(' '),
  //     //       keywords: keywordArr,
  //     //     },
  //     //   },
  //     // })
  //   }
  // }

  return (
    <FormProvider {...methods}>
      <div className="w-[90vw] mx-auto sm:w-[50vw]">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(input => {
            onSubmit(toCardMetaInput(input))
          })}
          autoComplete="off"
        >
          {[
            ['title', '標題', ''],
            ['author', '來源作者', '例如:@巴菲特'],
            // ['url', '來源網址', '例如:http://www.youtube.com/xxx...'],
            ['keywords', '關鍵字', ''],
            // ['redirects', '重新導向', '請使用 "空格" 分隔'],
          ].map(([name, title, placeholder], i) => {
            return (
              <label key={name} className="flex items-center">
                <h5 className="flex-shrink-0 w-20 text-gray-700 font-normal">{title}</h5>
                {name === 'keywords' ? (
                  <Controller
                    control={control}
                    name="keywords"
                    render={({ field: { onChange, value, ref } }) => (
                      <CreatableSelect
                        instanceId="1"
                        isMulti
                        styles={{ control: () => ({}) }}
                        value={value}
                        components={customComponents}
                        noOptionsMessage={() => null}
                        placeholder={placeholder}
                        onChange={onChange}
                      />
                    )}
                  />
                ) : (
                  <input
                    {...register(name as keyof FormInputs)}
                    type="text"
                    className={`input flex-grow`}
                    placeholder={placeholder}
                  />
                )}
              </label>
            )
          })}
          <div className="text-center">
            <button
              className="btn-primary h-10 w-24 mt-4"
              type="submit"
              disabled={!isDirty || isSubmitSuccessful || isSubmitted}
            >
              {isSubmitted ? (isDirty ? '送出' : '已送出') : '送出'}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default CardMetaForm
