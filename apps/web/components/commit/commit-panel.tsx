import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  useCreateCommitMutation,
  useMyNoteDraftEntriesQuery,
} from '../../apollo/query.graphql'
import Modal from '../modal/modal'
import DomainSelect from '../domain/domain-select'
import { useRouter } from 'next/router'
import { styleSymbol } from '../ui-component/style-fc/style-symbol'
import Link from 'next/link'
import { getNotePageURL } from '../../shared/note-helpers'
import { editorLeftSidebarRefresh } from '../block-editor/src/events'

type FormValue = {
  // Selected draft ids
  draftIds: string[]
  // checkboxMirror: string[]
}

export const CommitPanel = (): JSX.Element | null => {
  const router = useRouter(),
    qMyDrafts = useMyNoteDraftEntriesQuery(),
    [createCommit, { error }] = useCreateCommitMutation({
      onCompleted: data => {
        router.push(`/commit/${data.createCommit.id}`)
      },
    }),
    [showModal, setShowModal] = useState(false)

  // const { checkedDrafts, checkBoxForm } = reactSelectForm()
  // const [checkedIdx, setCheckedIdx] = useState<boolean[]>(
  //   Array(mockData.length).fill(false),
  // )

  const methods = useForm<FormValue>(),
    {
      register,
      handleSubmit,
      formState: { isSubmitting, isSubmitSuccessful },
    } = methods

  async function onSubmit(value: FormValue) {
    // console.log('checkbox', value.draftIds)
    await createCommit({ variables: { noteDraftIds: value.draftIds } })
    await editorLeftSidebarRefresh('network-only')
    setShowModal(false)
  }

  if (error) throw error
  if (qMyDrafts.loading) return null
  if (qMyDrafts.data === undefined)
    throw new Error('qMyDrafts.data === undefined')

  return (
    <div>
      <button className="btn-primary text-sm" onClick={e => setShowModal(true)}>
        Commit
      </button>

      <Modal
        sectionClassName=""
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        {qMyDrafts.data.myNoteDraftEntries.length === 0 ? (
          <div>No drafts</div>
        ) : (
          <FormProvider {...methods}>
            <div className="flex flex-col h-full py-6  ">
              <div className="flex items-center mx-10 mb-3">
                <h2 className={`my-0 text-gray-900`}>Commit</h2>
                {/* <h2
                className={`text-3xl text-gray-900 transition-[transform,opacity] delay-150 ${
                  isSubmitSuccessful
                    ? 'translate-x-0 opacity-100 visible '
                    : 'translate-x-10 opacity-0 w-0 h-0 overflow-hidden invisible '
                }`}
              >
                Commit Success! #id
              </h2> */}
                {/* <DomainSelect /> */}
              </div>

              {qMyDrafts.data && (
                <form
                  className="overflow-auto grid text-gray-700"
                  // onSubmit={handleSubmit(onSubmit)}
                >
                  {qMyDrafts.data.myNoteDraftEntries.map(
                    ({ id, symbol, title }) => {
                      return (
                        <label
                          key={id}
                          className={`relative flex items-center px-10 py-2 transition-opacity `}
                        >
                          <input
                            {...register('draftIds')}
                            className="mr-2"
                            type="checkbox"
                            value={id}
                            disabled={isSubmitting || isSubmitSuccessful}
                          />
                          {/* <Link href={getNotePageURL('edit', symbol)}>
                        <a>{styleSymbol(symbol)}</a>
                      </Link> */}
                          {styleSymbol(symbol)}
                        </label>
                      )
                    },
                  )}
                </form>
              )}

              <div className="flex justify-end w-full bottom-0 rounded-b ">
                <button
                  className={`btn-primary w-fit mr-10`}
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(onSubmit)()}
                >
                  Commit
                </button>
              </div>
            </div>
          </FormProvider>
        )}
      </Modal>
    </div>
  )
}
