# @bpmn-io/semver-compat

Check whether provided versions satisfy semver requirements.

## Installation

```sh
npm install @bpmn-io/semver-compat
```

## Usage

```js
import { isCompatible } from '@bpmn-io/semver-compat';
```

### `isCompatible(required, provided)`

Returns `true` if every entry in `required` is satisfied by the corresponding version in `provided`.

```js
isCompatible(
  { node: '>=18', npm: '>=9' },  // required
  { node: '16',   npm: '10'  }   // provided
); // → false

isCompatible(
  { node: '>=18', npm: '>=9' },
  { node: '20',   npm: '10'  }
); // → true
```

Returns an empty object `{}` when everything is compatible.

## Parameters

| Parameter  | Type                      | Description                                      |
|------------|---------------------------|--------------------------------------------------|
| `required` | `Record<string, string>`  | Named semver range requirements                  |
| `provided` | `Record<string, string>`  | Named concrete version strings to check against  |

## Behaviour

- Keys present in `required` but absent from `provided` are **skipped** (treated as compatible).
- Version strings are coerced via `semver.coerce`, so non-standard formats like `18` or `18.0.0.Final` are accepted. Versions that cannot be coerced are **skipped**.
- Entries in `required` with an invalid semver range are **skipped**.

Both functions **fail open**: when data is missing or unparseable the entry is considered compatible, so misconfiguration never blocks the user unexpectedly.

## License

MIT
