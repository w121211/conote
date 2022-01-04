# Development

```sh
# Build /conote/src/web to use shared components
cd .../conote/src/web
yarn run buid:types

# Start api server
yarn run dev

# Output ./dist, use it to load from chrome (manually)
cd .../conote/src/browser
yarn run dev
```

# Ref

https://github.com/sivertschou/snow-extension
https://github.com/aeksco/react-typescript-web-extension-starter
https://github.com/sourcegraph/sourcegraph

https://github.com/mdn/webextensions-examples
https://github.com/GoogleChrome/chrome-extensions-samples

https://github.com/getstation/apollo-link-webextensions-messaging
https://github.com/vuquangit/react-typescript-apollo-client

Annotate:

- https://github.com/apache/incubator-annotator

# Todos

- annotate 網頁中的文字
- 自動識別網頁中的 shots
- 將網頁中的一段文字加入 shot
  - 圈選文字
  - 按右鍵開啟選單，加入 shot
  - 開啟 shot form
