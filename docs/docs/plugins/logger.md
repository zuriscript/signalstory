---
sidebar_position: 6
---

# Logger

Use the Logger plugin for the logging of crucial events related to the state management of your store. By enabling the `LoggerPlugin`, you can gain insights into store initialization, command execution, and effect execution.

## Enabling Logging

To activate the logger feature in signalstory, include the plugin using the exposed `useLogger` factory method:

```typescript
class StoreWithLogger extends Store<MyState> {
  constructor() {
    super({
    initialState: { ... },
    name: 'My Store with Logger',
    plugins: [
      useLogger()
    ],
    });
  }
}
```

## Configuration

The `useLogger` function accepts an optional configuration object, allowing you to customize the logger behavior. The available option is:

| Option        | Description                            | Default Value |
| ------------- | -------------------------------------- | ------------- |
| `logFunction` | Log function for commands and effects. | `console.log` |

## Logging Events

Once the logger is enabled, it logs events at different stages of the store lifecycle:

- `init`: Logs store initialization, including the initial state.
- `postprocessCommand`: Logs the execution of commands.
- `preprocessEffect`: Logs the start of effect execution.
- `postprocessEffect`: Logs the completion of effect execution.

Example of logged events:

```
[My Store with Logger->Init] { ...initialState }
[My Store with Logger->Command] CommandName { ...currentState }
[My Store with Logger->Effect STARTED] EffectName { ...currentState }
[My Store with Logger->Effect FINISHED in 342 ms] EffectName { ...currentState }
```

Adjust the log content and format by providing a custom log function.

## Custom Log Function

You can provide a custom log function to `useLogger` for more advanced logging. The log function should have the signature:

```typescript
type Logger = (message?: unknown, ...optionalParams: unknown[]) => void;
```

```typescript
const customLoggerFunction: Logger = (message, ...optionalParams) => {
  // Your custom logging logic here
};

// Use it
useLogger({
  logFunction: customLoggerFunction,
});
```
