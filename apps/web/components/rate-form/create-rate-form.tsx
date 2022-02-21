import { useApolloClient } from '@apollo/client'
import { RateChoice } from '@prisma/client'
import { resolve } from 'path/posix'
// import { useRouter } from 'next/router'
import React, { KeyboardEventHandler, useEffect, useState } from 'react'
import {
  Controller,
  FormProvider,
  set,
  useController,
  UseControllerProps,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { components, ControlProps, GroupBase, InputProps, OptionsOrGroups, StylesConfig } from 'react-select'
import AsyncCreatableSelect from 'react-select/async-creatable'
import Creatable from 'react-select/creatable'
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters'
import {
  AuthorDocument,
  AuthorQuery,
  AuthorQueryVariables,
  RateDocument,
  RateFragment,
  RateQuery,
  useAuthorLazyQuery,
  useCardLazyQuery,
  useCardQuery,
  useCreateRateMutation,
  useLinkLazyQuery,
  useMeQuery,
  useSearchAuthorLazyQuery,
  useSearchSymbolLazyQuery,
} from '../../apollo/query.graphql'
import Modal from '../modal/modal'
import CreateAuthorForm from './create-author-form'
import CreateSymbolForm from './create-symbol-form'

interface Option {
  value: string
  label: string
}

export interface FormInput {
  author: Option
  choice: RateChoice
  target: Option
  link?: string
}

export const reactSelectControlStyle = {
  minHeight: '36px',
  border: 'none',
  boxShadow: 'none',
  background: 'transparent',
  ':focus': { background: '#f5f5f5' },
  ':hover': { background: '#f5f5f5' },
  cursor: 'text',
}

export const customStyle: StylesConfig<Option, false, GroupBase<Option>> = {
  container: base => ({ ...base, width: '100%', fontSize: '14px' }),
  control: (base, state) => ({ ...base, ...reactSelectControlStyle }),
  menu: base => ({
    ...base,
    maxHeight: '100px',
    boxShadow: '0 0 0 1px hsl(0deg 0% 0% / 8%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
  }),
  menuList: base => ({ ...base, maxHeight: '100px' }),
  singleValue: base => ({ ...base, fontSize: '14px' }),
  option: base => ({ ...base, paddingTop: '6px', paddingBottom: '6px' }),

  // input: base => ({ ...base, fontSize: '14px' }),
}

const AuthorControl = ({ children, ...props }: ControlProps<Option, false>) => {
  return (
    <components.Control {...props}>
      <span className="pl-2">@</span>
      {children}
    </components.Control>
  )
}

const AsyncAuthorConsumer = ({ name }: { name: string }) => {
  const [searchAuthor, { data, refetch }] = useSearchAuthorLazyQuery()
  const { data: meData } = useMeQuery()

  const defaultOptions = [{ value: meData?.me.id ?? '', label: '我' }]
  const { control, setValue } = useFormContext()
  const [openMenu, setOpenMenu] = useState(false)
  const [options, setOptions] = useState<Option[]>([])
  const [selectValue, setSelectValue] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (data?.searchAuthor) {
      setOptions(defaultOptions.concat(data.searchAuthor.map(({ id, str }) => ({ value: id, label: str }))))
    }
  }, [data])

  const onInputChange = (inputValue: string) => {
    if (inputValue.length > 0) {
      searchAuthor({ variables: { term: inputValue } })
      setOpenMenu(true)
    } else {
      setOpenMenu(false)
    }
  }

  const onShowCreate = (inputValue: string, _: any, options: OptionsOrGroups<Option, GroupBase<Option>>) => {
    if (options.find(e => e.label === inputValue)) {
      return false
    }
    return true
  }

  const handleCreateLabel = (inputValue: string) => {
    if (inputValue.startsWith('@')) {
      return <>新增: {inputValue}</>
    }
    return <>新增: @{inputValue}</>
  }

  const onCreateOption = (inputValue: string) => {
    setSelectValue(inputValue)
    setShowModal(true)
  }

  const onChange = (e: Option | null) => {
    if (e) {
      // queryCard({ variables: { symbol: e?.label } })
      return { value: e.value, label: e?.label }
    }
    return e
  }

  return (
    <>
      {/* <pre>
        input:{onInputChange} select:{selectValue?.label}
      </pre> */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Creatable
            value={field.value}
            onChange={e => field.onChange(onChange(e))}
            onCreateOption={onCreateOption}
            // onKeyDown={onKeyDown}
            // menuIsOpen={true}
            menuIsOpen={openMenu}
            createOptionPosition="first"
            onInputChange={onInputChange}
            isValidNewOption={onShowCreate} //是否顯示 新增
            options={options}
            components={{
              DropdownIndicator: undefined,
              Control: AuthorControl,
            }}
            placeholder=""
            formatCreateLabel={handleCreateLabel}
            styles={{
              ...customStyle,
              valueContainer: base => ({ ...base, paddingLeft: 0 }),
              input: base => ({ ...base, textTransform: 'uppercase' }),
            }}
            ref={null}
          />
        )}
      />
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        buttons={
          <button form="create-author-form" className="btn-primary h-10 w-24 " type="submit">
            提交
          </button>
        }
        mask={false}
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-800">新增作者</h2>
        <CreateAuthorForm
          defaultValues={{ name: selectValue, type: { value: 'PERSON', label: '人' }, sites: [{ name: '', url: '' }] }}
          onCreated={createdData => {
            refetch()
            setValue(name, { value: createdData.id, label: createdData.name })
            setShowModal(false)
          }}
        />
      </Modal>
    </>
  )
}

const TickerControl = ({ children, ...props }: ControlProps<Option, false>) => {
  return (
    <components.Control {...props}>
      <span className="pl-2">$</span>
      {children}
    </components.Control>
  )
}

const TickerInput = ({ children, ...props }: InputProps<Option, false>) => {
  return (
    <components.Input
      {...props}
      inputClassName={`${
        typeof props.value === 'string' && props.value.length > 0 && props.value.startsWith('$')
          ? 'uppercase'
          : 'normal-case'
      }`}
    >
      {children}
    </components.Input>
  )
}

export const AsyncTickerConsumer = ({ name }: { name: string }) => {
  // const client = useApolloClient()
  const { register, control, setValue } = useFormContext()
  // const [onInputChange, setOnInputChange] = useState('')
  const [openMenu, setOpenMenu] = useState(false)
  const [options, setOptions] = useState<Option[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectValue, setSelectValue] = useState('')
  const [searchSymbol, { data }] = useSearchSymbolLazyQuery()
  const [queryCard, { data: cardData }] = useCardLazyQuery()

  useEffect(() => {
    if (data && data.searchSymbol) {
      setOptions(data.searchSymbol.map(({ id, str }) => ({ value: id, label: str })))
    }
  }, [data])
  const onInputChange = (inputValue: string) => {
    //if menu should open
    if (inputValue.length > 0) {
      searchSymbol({ variables: { term: `$${inputValue}` } })
      setOpenMenu(true)
    } else {
      setOpenMenu(false)
    }
    //query symbol
  }
  const onShowCreate = (inputValue: string, _: any, options: OptionsOrGroups<Option, GroupBase<Option>>) => {
    if (
      options.find(e => e.label === `$${inputValue.toUpperCase()}`) ||
      options.find(e => e.label === `[[${inputValue}]]`) ||
      options.find(e => e.label === inputValue.toUpperCase()) ||
      options.find(e => e.label === inputValue)
    ) {
      return false
    }
    return true
  }

  const handleCreateLabel = (inputValue: string) => {
    if (inputValue.startsWith('$')) {
      return <>新增: {inputValue.toUpperCase()}</>
    }
    return <>新增: [[{inputValue}]]</>
  }

  // const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  //   const reg = /[0-9a-zA-Z]+/g
  //   if (!e.key.match(reg)) {
  //     e.preventDefault()
  //     return false
  //   }
  // }

  const onCreateOption = (inputValue: string) => {
    // setValue(name, { value: inputValue.toUpperCase(), label: inputValue.toUpperCase() })
    setSelectValue(inputValue)
    setShowModal(true)
  }

  const onChange = (e: Option | null) => {
    if (e) {
      // queryCard({ variables: { symbol: e?.label } })
      return { value: e.value, label: e?.label.substring(1) }
    }
    return e
  }

  // const onFilterOption = (option: FilterOptionOption<Option>, _: string) => {
  //   const { label, value } = option
  //   if (options.length > 0 && label.startsWith('[[')) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Creatable
            value={field.value}
            onChange={e => field.onChange(onChange(e))}
            onCreateOption={onCreateOption}
            // onKeyDown={onKeyDown}
            // menuIsOpen={true}
            // filterOption={onFilterOption}
            menuIsOpen={openMenu}
            createOptionPosition="first"
            onInputChange={onInputChange}
            isValidNewOption={onShowCreate} //是否顯示 新增
            options={options}
            components={{
              DropdownIndicator: undefined,
              // Control: TickerControl,
              Input: TickerInput,
            }}
            placeholder=""
            formatCreateLabel={handleCreateLabel}
            styles={{
              ...customStyle,
              // valueContainer: base => ({ ...base, paddingLeft: 0 }),
              input: base => ({ ...base, textTransform: 'uppercase' }),
            }}
            ref={null}
          />
        )}
      />
      <Modal visible={showModal} onClose={() => setShowModal(false)}>
        <CreateSymbolForm
          defaultValues={{
            target: selectValue.startsWith('$') ? selectValue.toUpperCase() : selectValue,
            description: '',
          }}
          onSubmitted={(value: Option) => {
            setValue(name, value)
            setShowModal(false)
          }}
        />
      </Modal>
    </>
  )
}

const CreateRateForm = ({
  initialInput,
  onRateCreated,
}: {
  initialInput: FormInput
  onRateCreated: (rate: RateFragment, targetSymbol: string) => void
}): JSX.Element => {
  // const router = useRouter()
  const [showPopup, setShowPopup] = useState(false)
  const [skipCardQuery, setSkipCardQuery] = useState(true)
  const { author, choice, target, link } = initialInput
  // const [targetId, setTargetId] = useState<string | undefined>()
  const client = useApolloClient()
  const methods = useForm<FormInput>({
    defaultValues: { ...initialInput },
  })
  // const { register, handleSubmit, control, watch } = useForm<FormInput>({
  //   defaultValues: { ...initialInput },
  // })

  let linkId: string
  let authorId: string
  let targetId: string
  // const { data: targetCardData } = useCardLazyQuery({
  //   fetchPolicy: 'cache-first',
  //   variables: { symbol: target },
  //   // skip: skipCardQuery,
  // })
  const [queryLink] = useLinkLazyQuery({
    variables: { url: link },
    onCompleted(data) {
      if (data.link) {
        linkId = data.link.id
      }
    },
  })
  const [queryAuthor] = useAuthorLazyQuery({
    onCompleted(data) {
      if (data.author) {
        authorId = data.author.id
      }
    },
  })
  // useEffect(() => {
  //   if (targetCardData?.card) {
  //     setTargetId(targetCardData.card.id)
  //   }
  // }, [targetCardData])

  const watchChoice = methods.watch('choice')
  // const watchAuthor = watch('author')

  const [createRate, { data: rateData }] = useCreateRateMutation({
    update(cache, { data }) {
      const res = cache.readQuery<RateQuery>({
        query: RateDocument,
      })
      if (data?.createRate && res?.rate) {
        cache.writeQuery({
          query: RateDocument,
          data: {
            targetId: data.createRate.symId,
            choice: data.createRate.choice,
            authorId: data.createRate.authorId,
            linkId: data.createRate.linkId,
          },
        })
      }
    },
    onCompleted(data) {
      // console.log(data.createRate, targetCardData)
      // if (data.createRate && targetCardData && targetCardData.card) {
      //   onRateCreated(data.createRate, targetCardData.card.sym.symbol)
      // } else {
      //   throw 'Create shot error'
      // }
    },
  })
  // const filterAuthor = (inputValue: string) => {
  //   return [inputValue]
  // }
  // const promiseOptions = (inputValue: string, callback: (authors: string[]) => void) =>
  //   new Promise(resolve => {
  //     client.query<AuthorQuery, AuthorQueryVariables>({
  //       query: AuthorDocument,
  //       variables: { name: inputValue },
  //     })
  //     resolve(filterAuthor)
  //   })

  const myHandleSubmit = (d: FormInput) => {
    if (d.target) {
      if (d.link !== '') {
        queryLink({ variables: { url: d.link } })
      }

      // console.log(targetId)
      if (targetId) {
        createRate({
          variables: {
            data: {
              targetId: targetId,
              linkId: linkId ?? undefined,
              choice: d.choice,
              authorId: d.author.value,
            },
          },
        })
      }
    }
  }
  return (
    <div className="px-4">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">新增預測</h2>
      <FormProvider {...methods}>
        <form
          className="grid grid-cols-[max-content_auto] items-center gap-4"
          onSubmit={methods.handleSubmit(myHandleSubmit)}
          autoComplete="off"
        >
          <label className="text-right text-sm group items-center relative text-gray-700 font-normal">
            {/* <h5
              className={`absolute top-0 left-2 leading-none font-normal text-gray-700 font-normal
              transition-all transform origin-top-left
                group-focus-within:translate-y-2 group-focus-within:scale-[0.8] group-focus-within:text-blue-600
                ${watchAuthor === '' ? 'translate-y-4 scale-100' : 'translate-y-2 scale-[0.8]'}`}
              className="flex-shrink-0 w-20 text-gray-700 font-normal"
              > */}
            名字
            {/* </h5> */}
          </label>
          <AsyncAuthorConsumer name="author" />
          {/* <input
            {...register('author')}
            className="input flex-grow"
            // className="input inline h-12 pt-6"
            type="text"
          /> */}
          {/* <div className="flex items-center select-none"> */}
          <label className="text-right text-sm text-gray-700 font-normal ">預測</label>
          <div className="flex gap-3">
            {[
              ['LONG', '看多'],
              ['SHORT', '看空'],
              ['HOLD', '觀望'],
            ].map(([value, label]) => {
              return (
                <label
                  key={value}
                  className={`inline-flex items-center gap-2 px-4 py-2 border rounded cursor-pointer tracking-wider transition-all ${
                    watchChoice === value
                      ? 'bg-blue-600 border-transparent '
                      : 'bg-white border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    {...methods.register('choice')}
                    className="absolute opacity-0 cursor-pointer"
                    type="radio"
                    value={value}
                  />
                  <h5 className={`font-normal ${watchChoice === value ? 'text-white' : 'text-gray-900'}`}>{label}</h5>
                </label>
              )
            })}
          </div>
          {/* </div> */}

          <label className="text-right text-sm text-gray-700 font-normal ">標的</label>

          <AsyncTickerConsumer name="target" />
          {/* <input {...register('target')} className="input flex-grow" type="text" placeholder="例如:$GOOG" /> */}

          <label className="text-right text-sm text-gray-700 font-normal ">來源網址</label>
          <input
            {...methods.register('link')}
            className="input flex-grow"
            type="text"
            placeholder="例如:https://www.youtube.com/xxx..."
          />
          <div className="col-span-full text-center">
            <button className="btn-primary h-10 w-24 mt-4" type="submit">
              新增
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
export default CreateRateForm
