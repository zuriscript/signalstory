# Contributing to Signalstory

🚀 Excited about making signalstory even better? Awesome! Let's dive in and enhance Signalstory together! ✨

## How to contribute

- [Report an issue](https://github.com/zuriscript/signalstory/issues/new): Whether you find a bug in signalstory or have a feature request, raise an issue to let us know. Please submit code examples to reproduce a bug.
- [Raise a pull request](https://github.com/zuriscript/signalstory/pulls): All code changes in Signalstory go through pull requests to `master` and review before merging. Run the test suite locally before submitting to avoid surprises. If possible, add tests for bug fixes or new features, and consider providing documentation in your pull request. For significant changes, discuss with maintainers via an issue beforehand.
- [Improve the documentation](https://zuriscript.github.io/signalstory/docs/prolog): If you spot gaps or have ideas, raise an issue or discuss within existing issues or pull requests. PR's adressing docs are also very welcomed.

All contributions are submitted under the [MIT License](https://github.com/zuriscript/signalstory/blob/master/LICENSE.md).

## Developing

- Run `npm i`
- Run specs: `ng test`
- Run build: `ng build signalstory`
- Run checks: `npm run check`
- Run sample: `ng serve sample --open`

Tree-shakeability is crucial for this library, so ensure to run `npm run check` before submitting a PR. The sample project uses the last created bundle, allowing you to test your changes directly.

## Coding Rules

To maintain code consistency:

- All features or bug fixes **must be tested** by one or more specs (unit-tests).
- All methods **must be documented**.

## Commit Message Convention

Each commit message includes a **header**, a **body** and a **footer**. The header consists of a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Mind following conventions:

- Only the **header** is mandatory
- **Scope** of the header is optional
- Any line has to be shorter than 100 characters
- The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

## PR Title Convention

Please use the same convention for PR titles as for commit messages

```
<type>(<scope>): <subject>
```
