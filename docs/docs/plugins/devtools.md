---
sidebar_position: 3
---

# DevTools

Enhance your store's monitoring and debugging capabilities by leveraging the DevTools plugin in signalstory which integrates your store with the [Redux DevTools browser extensions](https://github.com/reduxjs/redux-devtools), enabling you to closely observe and analyze state changes.

This only works with the respective browser extension ([Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd), [Edge](https://microsoftedge.microsoft.com/addons/detail/redux-devtools/nnkgneoiohoecpdiaponcejilbhhikei) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/))

## Enabling DevTools Integration

To activate the DevTools plugin, simply include it in your store's configuration. This automatically connects your store to Redux DevTools, allowing you to access advanced monitoring, time travel and other debugging features.

```typescript
class StoreWithDevTools extends Store<MyState> {
  constructor() {
    super({
      initialState: { ... },
      name: 'My DevTools-Enabled Store',
      plugins: [
        useDevtools()
      ],
    });
  }
}
```
