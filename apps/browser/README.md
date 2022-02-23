# Development

```sh
# build /conote/src/web to use shared components
cd .../conote/src/web
yarn run buid:types

# start api server
# yarn run dev

# output ./devdist, load this folder from chrome/firefox extension panel 'manually'
cd .../conote/src/browser
yarn run dev
```

# Build & Deploy

```sh
yarn run build

# zip dist folder
zip -r -j dist.zip dist/*
```

# References

https://github.com/sivertschou/snow-extension
https://github.com/aeksco/react-typescript-web-extension-starter
https://github.com/sourcegraph/sourcegraph

https://github.com/mdn/webextensions-examples
https://github.com/GoogleChrome/chrome-extensions-samples

https://github.com/getstation/apollo-link-webextensions-messaging
https://github.com/vuquangit/react-typescript-apollo-client

Annotate:

- https://github.com/apache/incubator-annotator
