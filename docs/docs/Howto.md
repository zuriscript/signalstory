---
sidebar_position: 11
---

# Howto

## Configure plugins based on environment

To dynamically configure store plugins based on the build environment, you can use Angular environment files. Here's an example:

```typescript
// file: environment.ts
export const environment = {
  isProd: true,
  defaultStorePlugins: () => [],
};

// file: environment.development.ts
export const environment = {
  isProd: false,
  defaultStorePlugins: () => [useDevtools(), useDeepFreeze()],
};

// file: user.store.ts
@Injectable({ providedIn: 'root' })
class UserStore extends ImmutableStore<User[]> {
  constructor() {
    super({
      initialState: [],
      plugins: [...environment.defaultStorePlugins()],
    });
  }
}
```

This allows you to conditionally include or exclude specific store plugins during the build process. Through file replacement during the build process, plugins like `useDeepFreeze` and `useDevtools` can be part of development builds but removed from production bundles, keeping your bundle size in check.

Additionally, you can use this pattern to configure default plugins and default configurations that all stores should use.
