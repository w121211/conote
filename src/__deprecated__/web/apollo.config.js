module.exports = {
  client: {
    name: 'Conote [web]',
    service: {
      name: 'Conote [graphql]',
      //   url: process.env.REACT_APP_API_URL,
      url: 'http://localhost:4000/graphql',
    },
    excludes: ['**/node_modules', '**/__tests__/**/*', '**/__deprecated__/**/*'],
  },
}
