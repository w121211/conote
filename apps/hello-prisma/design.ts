/**
 *
 * case: get my drafts from profile (d)
 * - allDrafts()
 *
 * case: get all notes from homepage (d)
 * - allNotes()
 * - order by descending
 * - latest docs and candidate docs
 *
 * case: get the note by id (via click) (d)
 * - note(id)
 * - order by dsc
 *
 * case: search notes with symbol and note title (d)
 * - search notes in symbol and tile simultaneously
 * - searchNotes(sym?, name?)
 * - order by accuracy
 * - symbol -> searchSymbol
 * - name -> fuzzy search
 *
 * case: search by domain (search or filter) (d)
 * - searchByDomain(domain)
 * - order by descending
 *
 * case: search notes by author (search or filter) (d)
 * - searchByAuthor(authorName)
 * - order by dsc
 * - fuzzy search
 *
 * case: get candidate notes of one user or all candidate notes
 * - profile and for a section of candidate note or search candidate notes on homepage (?)
 * - candidateNotes(id?)
 * - order by dsc
 * - status is 'candidate' by default
 *
 * case: get rejected notes from profile
 * - rejectedNotes(id?)
 * - order by date dsc
 *
 * case: get all docs from note pr records (d)
 * - docs(noteId)
 *
 * case: get all notes from profile (d)
 * - myNotes(): [Doc]!
 * - order by date dsc
 *
 *
 * case: create draft from not-yet-existed-symbol (d)
 * - search for the symbol -> find nothing -> search for the draft -> no draft -> createDraft(sym, userId, domain)
 *
 * case: create draft from the latest doc of branch-sym (d)
 * - search for the draft -> no draft -> createDraft(userId, domain, fromDoc, other meta)
 *
 * case: create draft from a url (d)
 * - search for the symbol(url) -> find nothing -> search for the draft -> no draft -> createDraft(userId, domain, url)
 *                              -> find one -> direct to the note
 *
 * case: create draft from a doc (where previous draft exist) --> must search for a draft before every creating (d)
 * - create draft [[AA]] (#1) ---commit--> create doc [[AA]], draft#1 = {status='committed', docId=create-doc}
 *   -> has draft on [[AA]] ? -> find draft where (userId, status='edit', symbol=AA) -> no
 *   -> create new draft [[AA]] (#2)
 *
 * case: edit draft-with-new-symbol & new commit (not merged yet) (x)
 * - not possible since there is a auto-merge for a newly created note
 *
 * case: edit draft-from-latest-doc & new commit (not merged yet) (d)
 * - click the draft draft(id) -> compare the latest docId with fromDoc -> not consistent, a candidate -> prompt reminder and open the draft
 *
 * case: edit draft-with-new-symbol & symbol just created (new merge) (d)
 * - click the draft draft(id) -> search for existence of the note with this symbol (searchSymbol) -> yes, there's an auto-merged commit
 * -> prompt reminder and open the draft
 *
 * case: edit draft-from-latest-doc & latest-doc changed (new merge) / behind (d)
 * - click the draft draft(id) -> compare the latest docId with fromDoc -> not consistent, a merged -> prompt reminder to merge and open the draft
 *
 * case: edit draft & referenced symbols got name changed
 * - @eg draft content: '.... [[symbo-a]] ...' -> [[symbo-a]] rename to [[symbol-a]]
 * - add a new pair of key and value in the meta
 * - use searchSymbol to find the referenced note
 *
 * case: drop draft (d)
 * - create draft [[AA]] (#1) ---drop--> update draft#1 (status='drop')
 *   -> has draft on [[AA]] ? -> find draft where (userId, status='edit', symbol='AA') -> no
 *   -> create new draft [[AA]] (#2)
 *
 * case: commit draft & parent-doc is not the latest-doc -> resolve conflict
 * - commit -> compare fromDoc with the latest docId Merge(fromDocId?, authorId!) -> fromDocId not match
 * -> prompt merge reminder and back to Draft editing mode mergeDraft(draftId, latestDocId)
 *
 * case: commit draft & auto merge
 * - new symbol, new web-note, same author as parent doc and no other candidate
 * - commit -> Merge(fromDocId?, authorId) -> fromDocId is null -> auto merge and add
 *                                         -> fromDocId is not null and matches the latest accept and no candidate
 *                                                      -> same userId -> auto merge and add it to branch-sym
 *                                                      -> different authorId -> candidate and add it to branch-sym
 *
 * case: commit draft & open a merge request
 * - when there is a conflict of fromDoc
 * - commit -> Merge(fromDocId?, authorId) -> fromDocId is not null and matches and no candidate -> different author
 * -> requestMerge(draftId) -> create a new doc as candidate and add it to branch-sym
 *
 * case: commit draft when other merge-request is existed
 * - commit -> Merge(fromDocId?, authorId) -> fromDocId is not null and matches and other candidate -> requestMerge(draftId)
 *
 * case: merge request accept
 * - verdictMerge(docId): limited time after request or ups over downs -> accept merge
 * - acceptMerge(docId): can be incorporated into verdictMerge -> update docStatus to 'merge'
 *
 * case: merge request decline
 * - verdictMerge(docId): limited time after request or ups over downs -> reject merge
 * - rejectMerge(docId): can be incorporated into verdictMerge -> update docStatus to 'reject'
 *
 * case: update note.meta
 * - modifiable: note title .... (what else??)
 * - updateNoteMeta(meta)
 *
 * case: existing sym in draft
 * - search sym on the fly when typing -> match and add it to sym-dict
 *
 * case: update symbol name if sym is not created
 * - update local draft -> search sym on the fly when typing -> no match -> add to sym-dict
 *                                                           -> match -> add name and link to sym-dict
 * -> parse the draft for symNames and update sym-dict when saving the draft or commiting the draft
 *
 * case: update symbol name if sym is created
 * - through commit
 *
 * case: create discuss when editing draft
 * - same as sym that save discuss to discussDict when typing -> parse the draft for discusses and update discussDict when saving or commit
 *
 * case: connect discusses to branch-sym after merge
 * - parse merged-doc content -> get all discuss ids
 *   -> check if deleted discusses: get all connected discusses of branch-sym & compare is deleted
 *   -> connect/disconnect each discuss with branch-sym
 *
 *
 */

/**
 * Commit flow
 *
 * draft
 * -> create doc & create commit
 * -> auto-merge?
 *   -> yes
 *   -> no -> require
 * -> merged & update doc.status = 'merged' & update branch-sym.latest-doc & (if exist) update branch-sym.meta
 *
 */

/**
 * Update sym.name
 * - update reverse references for all docs reference to this sym, otherwise [[topic]] will fail
 *   - solution 1: save symNameReverseDict {symName: symId} in doc for reverse lookup -> if doc is opened, auto update to the latest sym.name
 *   - solution 2: create a doc-sym table (many-to-many) for reverse updates
 *
 * [[Apple]] --> [[apple (company)]]
 * doc [[Apple (Company)]] -> draft [[apple (company)]]
 *
 *
 */

/**
 * Data structure
 *
 * link
 * - url
 *
 * branch-sym (note)
 * - branch-id
 * - sym-id
 * - note-emojis
 * - discusses
 * - docs
 * - drafts
 *
 * draft or doc-draft (for docs not committed yet)
 * - branch
 * - symId?
 * - symName
 * - meta: doc.meta JSON { containSymNames, duplicates, alias, ..., symDict }
 * - status: 'edit' | 'drop'
 * - creator
 * - from-doc?
 * - discusses?
 *
 * doc
 * - status: commit, merge
 * - creator
 * - from-doc?
 * - branch-sym
 * - commit
 * - domain
 * - meta {  }
 *
 * commit
 * - docs
 * - verdict
 */

/**
 * Get a user's all editing-drafts
 * - Query allEditingDocs(userId) <- drafts where {userId, status='edit'}
 */

/**
 * Open a draft by url
 * - search in self drafts?
 * - query latest-doc
 *   - if not exist -> query link -> if not exist, fetch url & create `link`
 * - draft: { link, from-doc? }
 *
 * First Commit
 * - draft.link -> create `sym` & `branch-sym` -> create `doc` -> create `commit` -> auto-accept
 */

/**
 * Open a draft by [[title]]
 * - query note
 * - symbol in self docs? && self-doc is in editing
 *   - yes, use self-doc
 *   - no, create new doc from note.doc or from blank
 */

/**
 * Edit a darft
 * - save local (in-memory)
 * - save doc on server every n seconds
 */

/**
 * Local draft-store
 * - drafts <- query allDraftsByUser
 *
 * Open by branch-sym
 * - exist in local? <- search draft-store by branch-sym
 * - exist in remote?
 *
 * Commit
 * - commit(drafts)
 * - remote: create doc <- draft
 * - remote: update draft.status to 'committed' with commit-doc-id
 * - remove draft from draft-store
 */

/**
 * Change sym while editing
 * - is branch-sym existed?
 *   -> no   update draft's sym (local & server)
 *   -> yes  store in draft.noteMeta -> (doc merged) update sym.name
 */

/**
 * Update note.meta (branch-sym.meta)
 */

/**
 * Check is from latest doc while editing
 */

/**
 * Save a doc
 * - mutation: updateDoc(doc)
 */

/**
 * Commit draft(s)
 * - validate
 *   - is new branch-sym?
 *     - validate note inputs
 *   - is from the latest-doc? -> no, require to resolve
 * - create branch-sym (optional) -> create doc { status: 'committed' }
 * - meet auto-merge requirements?
 *   - yes -> merge
 */

/**
 * Accept or reject a committed-doc
 * - update doc.status: 'merged', 'closed'
 * - [next] notify user
 */

/**
 * Editing-doc is behind -> require to merge with the latest-doc
 * - get latest-doc
 * - merge <- resolve conflict <- diff between self-doc & latest-doc
 * - change self-doc's from-doc to latest-doc
 */

/**
 * Merge the editing-doc
 *
 *
 */

/**
 * Get docs-committed by user
 * - query committedDocsByUser
 */

/**
 * Get docs-wait-to-merge
 * - query docsWaitToMerge <- docs where {status: 'committed'}, order='latest'
 */

/**
 * Get docs-merged
 * - query docsMerged <- docs where {status: 'merged'}, order='latest'
 */
