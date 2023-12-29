---
sidebar_position: 5
---

# Performance Counter

Measure the performance of your commands and effect objects and analyze the result in real time in your `redux devtools`. By enabling the `PerformanceCounterPlugin` you can monitor the bottleneck of your state management solution and optimize at the right place.

## Initialization

To integrate the `PerformanceCounter` into your store, follow these steps:

```typescript
class StoreWithPerformanceCounter extends Store<MyState> {
  constructor() {
    super({
    initialState: { ... },
    name: 'My Store with Performance Counter',
    plugins: [
      usePerformanceCounter()
    ],
  });
  }
}
```

## Get the report

You can use the exposed `getReport` to get the current snapshot of the performance counters.

## Realtime report using redux devtools

If you have enabled [devtools](./devtools.md) for at least one store, you can directly see your performance counters in the state panel under the key: `@signalstory\performance-counter`.

import demo from '/img/docs/plugin_performance_counter_redux.png';

<div style={{maxWidth: 500}}> 
<img src={demo} alt="Peformance counter in redux devtools" style={{maxWidth: 500}}/>
</div>
