---
sidebar_position: 8
---

# Undo/Redo

The history tracking feature enables you to capture and manage state changes within your application, offering robust `undo` and `redo` functionalities that span an arbitrary number of stores. By utilizing `transactions`, you can group a series of related actions, ensuring they are treated as a single, atomic unit during undo and redo operations.

Tracking history is exclusively supported for `immutable stores`.

## Usage

`trackHistory` accepts the maximum length of the history as a parameter, along with the stores you intend to track.
By defining the maxLength parameter, you gain control over the history size, effectively managing memory usage. As the limit is reached, older entries are automatically removed. Note that the pruning process occurs asynchronously and employs an efficient implementation, allowing the history size to temporarily exceed the specified maximum length before pruning.

You have to specify all the stores you wish to track during setup. This ensures that only the intended stores are affected by undo and redo operations.

```typescript
import { trackHistory } from 'signalstory';

// Create a tracker for four different stores with a maximum length of 50
const tracker = trackHistory(50, store1, store2, store3, store4);

// Utilize undo and redo methods to navigate through the history of state changes
tracker.undo();
tracker.redo();

// Stop tracking and clean up resources when history is no longer needed
tracker.destroy();
```

### Track in a Component

It's recommended to associate the tracker with a specific (root) feature component to ensure a well-defined start and stop of tracking.
This practice prevents the possibility of unlimited undo actions leading back to an invalid state. Furthermore, the tracker can be destroyed when the associated component is removed, ensuring efficient cleanup.

Consider the following example of integrating the tracker within a component:

```typescript
@Component({
  selector: 'app-root-feature',
  template: `
    <button [disabled]="!tracker.canUndo()" (click)="tracker.undo()">
      Undo
    </button>
    <button [disabled]="!tracker.canRedo()" (click)="tracker.redo()">
      Redo
    </button>
  `,
  styles: [],
})
export class MyFeatureComponent implements OnDestroy {
  public readonly tracker: HistoryTracker;

  constructor(store: BooksStore) {
    this.tracker = trackHistory(100, store);
  }

  ngOnDestroy(): void {
    this.tracker.destroy();
  }
}
```

### Track throughout the Application

For scenarios where you need to track history across a more extended period or throughout different pages, employing a service is a practical approach. Here's how you can use a service for history tracking:

```typescript
@Injectable({
  providedIn: 'root',
})
export class HistoryTrackingService implements OnDestroy {
  public readonly tracker: HistoryTracker;

  constructor(store1: Store1, store2: Store2, store3: Store3) {
    this.tracker = trackHistory(100, store1, store2, store3);
  }

  ngOnDestroy(): void {
    this.tracker.destroy();
  }
}
```

:::caution

While it is totally valid to create multiple trackers throughout the application, it's advisable to ensure that if two trackers are active simultaneously, they should target different stores. This precaution is necessary because undo and redo operations are not synchronized between trackers, which could potentially lead to unexpected behaviors.

:::

## Group actions (Transaction)

You can use the `beginTransaction` and `endTransaction` methods to group related changes into transactions. Optionally, you can pass a tag for improved readability in serialization, as reflected in tools like redux devtools.

```typescript
tracker.beginTransaction('Transaction Label');
store1.set({ value: 42 }, 'ChangeCommand');
store2.set({ value: 23 }, 'AnotherCommand');
tracker.endTransaction();

// Undo both commands on store1 and store2 at once
tracker.undo();

// Redo the whole transaction
tracker.redo();
```

If you undo during a transaction, the transaction is aborted and the states reverted back to the states before the transaction began.

```typescript
store1.set({ value: 10 }, 'Initial');
tracker.beginTransaction('Transaction Label');
store1.set({ value: 20 }, 'ChangeCommand');
store1.set({ value: 30 }, 'ChangeAgain');

// Undoing before ending the transaction
tracker.und();

// The transaction is aborted and discarded from history
// store1 is reverted back to { value: 10 }
```

## Checking Undo and Redo Availability

The `tracker` instance provides two signals, `canUndo` and `canRedo`. You can use these signals to stay actively informed on whether undo or redo actions are possible.

Example usage in a template:

```html
<button [disabled]="!tracker.canUndo()">Undo</button>
<button [disabled]="!tracker.canRedo()">Redo</button>
```

## Accessing State History

```typescript
tracker.getHistory();
```

The `getHistory` method returns an array, where each item represents a specific state change in the history of specified stores.
