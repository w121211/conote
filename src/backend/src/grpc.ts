const post = {
  id: 3291,
  title: 'some title',
  content: {
    text: 'might be some comment',
    link: 'http://some.url',
  },
}

export function fakeFetchPage(url: string) {
  return {
    url,
    post: null,
    cluster: {
      id: 12938,
    },
  }
}
