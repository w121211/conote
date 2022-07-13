import resolvers from '../../apollo/resolvers'

beforeAll(async () => {
  // Reset database
  //   await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User" CASCADE;`
  //   await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll"  CASCADE;`
  //   await testHelper.createUsers(prisma)
  //   await testHelper.createBranches(prisma)
})

afterAll(async () => {
  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  await prisma.$disconnect()
})

it('noteDocsToMergeByNote', () => {
  resolvers.Query.noteDocsToMergeLatest({}, {}, {}, {})
})
