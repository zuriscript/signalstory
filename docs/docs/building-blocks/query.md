---
sidebar_position: 1
---

# Query

Queries are used to retrieve data from the store. They represent read-only operations that fetch specific information from the state and make it available for consumption in other parts of the application.

Since `signalstory` uses [signals](https://angular.io/guide/signals#computed-signals) as native state implementation, queries based on the `computed` function are both **lazily evaluated and memoized**.

## Store Queries

You can use the `state()` getter to access the entire state of the store. To select a slice or to apply transformations use angular's `computed` function or the `computed` function provided by the store. To define a query, you can create a function within your store that encapsulates the logic for accessing the desired data from the state.

```typescript
import { computed } from '@angular/core';
import { Store } from 'signalstory';

class CounterStore extends Store<number> {
  constructor() {
    super({ initialState: 0 });
  }

  // highlight-start
  // Use getter methods for parameterless queries to simplify call syntax
  public get plus100() {
    return computed(() => this.state() + 100);
  }
  // highlight-end

  // highlight-start
  public plusN(n: number) {
    return computed(() => this.state() + n);
  }
  // highlight-end
}

const counterStore = new CounterStore();

console.log(counterStore.state()); // prints 0
console.log(counterStore.plus100()); // prints 100
console.log(counterStore.plusN(200)()); // prints 300
console.log(counterStore.computed(state => state + 500)); // returns a Signal<number>
console.log(counterStore.computed(state => state + 500)()); // prints 500
```

The created signals `plus100` and `plusN` depend on the state signal and are notified and whenever it changes.

## Queries Targeting Multiple Stores

In some cases, you may need to retrieve or combine data from multiple stores to fulfill a specific requirement. There are multiple ways to approach multi store queries.

### Injecting Other Stores Inside the Store (Discouraged)

One approach is to inject the other stores inside one aggregating store and implement a query that combines the state of of all dependent stores. This approach allows the main store to directly access the state of other stores and derive the required data.

:::caution

This approach is discouraged, as this couples the store to other entities, which makes it harder to test and reason about. Further, it introduces dependecies which have to be managed.

:::

### Writing multi store queries in the Component or Service

We can leave it to the consumer, i.e. a component or a service where the data is required, to target multiple stores explicitly. This approach allows you to retrieve data from multiple stores without modifying the individual stores themselves. Using this approach, you can not share the query with other consumers.

### Using a query object

You can use the provided `createQuery` function to create a query object, which can be passed to any store. A query object consist of an array of stores involved in the query and a function taking those stores as argument. Note, that you may not use the `computed` function in query objects, as this is done for you by the stores implementation.

The benefit of using this approach is, that we now have an independent query which can be declared and exported centrally and be reused anywhere.

```typescript
import { Injectable } from '@angular/core';
import { Store, createQuery } from 'signalstory';

@Injectable({ providedIn: 'root' })
class CounterStore extends Store<number> {
  constructor() {
    super({ initialState: 7 });
  }
}

@Injectable({ providedIn: 'root' })
class WordStore extends Store<string> {
  constructor() {
    super({ initialState: 'Magnificent' });
  }
}

// highlight-start
const counterAndWordQuery = createQuery(
  [CounterStore, WordStore],
  (counter, word) => word.state() + counter.state()
);
// highlight-end

// highlight-start
export const counterAndWordWithParamQuery = createQuery(
  [CounterStore, WordStore],
  (counter, word, suffix: string) => word.state() + counter.state() + suffix
);
// highlight-end

// Any Component or service:

@Component({
  selector: 'app-root',
  template: '',
  styles: [],
})
export class AppComponent {
  constructor(counterStore: CounterStore) {
    // highlight-start
    console.log(counterStore.runQuery(counterAndWordQuery)()); // prints Magnificent7
    console.log(
      counterStore.runQuery(counterAndWordWithParamQuery, '-movie')()
    ); // prints Magnificent7-movie
    // highlight-end
  }
}
```

:::info
Note that creating the query does not directly produce the signal itself but rather serves as a "recipe" for building it. The actual signal is generated once the query object is provided to the `runQuery` function of any store. Hence, to take advantage of memoization, it is advisable to store the resulting signal in a variable and reuse it as much as possible, rather than invoking `runQuery` repeatedly.
:::

:::tip
Read about [computed signals](https://angular.io/guide/signals#computed-signals) in the official docs to unlock the full power of multi store queries. You may even specify to use the state value of a certain store without tracking, hence, a change of that stores value would **not** force the computed query to be reevaluated. [Read more](https://angular.io/guide/signals#reading-without-tracking-dependencies)
:::
