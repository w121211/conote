if (process.env.APP_BRANCH_NAME === undefined) {
  throw new Error('Not found APP_BRANCH_NAME in env')
}

const BRANCH_NAME = process.env.APP_BRANCH_NAME

export function getBranchName(): string {
  return BRANCH_NAME
}
