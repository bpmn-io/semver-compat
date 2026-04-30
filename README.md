# @bpmn-io/semver-compat

[![CI](https://github.com/jarekdanielak/semver-compat/actions/workflows/CI.yml/badge.svg)](https://github.com/jarekdanielak/semver-compat/actions/workflows/CI.yml)

Check whether provided semver versions satisfy required ranges.

## Installation

```sh
npm install @bpmn-io/semver-compat
```

## Usage

### `isCompatible(required, provided)`

Returns `true` if every entry in `required` is satisfied by the corresponding version in `provided`.

```js
import { isCompatible } from '@bpmn-io/semver-compat';

isCompatible(
  { node: '>=18', npm: '>=9' },  // required
  { node: '16',   npm: '10'  }   // provided
); // → false

isCompatible(
  { node: '>=18', npm: '>=9' },
  { node: '20',   npm: '10'  }
); // → true
```

### Behavior

The compatibility check **fails open**: when data is missing or unparseable the entry is considered compatible, so misconfiguration never blocks the user unexpectedly.

Only keys present in both `required` and `provided` are checked:

```js
isCompatible(
  { node: '>=18', npm: '>=9' },
  { node: '20' }               // npm not provided
); // → true
```

Entries in `provided` whose value cannot be coerced to semver are skipped (treated as compatible):

```js
isCompatible(
  { node: '>=18' },
  { node: 'not-a-version' }
); // → true
```

Entries in `required` with an invalid semver range are skipped (treated as compatible):

```js
isCompatible(
  { node: 'not-a-range' },
  { node: '20' }
); // → true
```

| Parameter  | Type            | Description                       |
|------------|-----------------|-----------------------------------|
| `required` | `SemverRanges`  | Named semver range requirements   |
| `provided` | `SemverVersions`| Named version strings to check    |

### `getCompatible(required, provided)`

Returns the subset of `provided` whose versions satisfy the corresponding ranges in `required`.

```js
getCompatible(
  { node: '>=18', npm: '>=9' },  // required
  { node: '20',   npm: '8'   }   // provided
); // → { node: '20' }
```

| Parameter  | Type            | Description                       |
|------------|-----------------|-----------------------------------|
| `required` | `SemverRanges`  | Named semver range requirements   |
| `provided` | `SemverVersions`| Named version strings to check    |

### `getCoerced(versions)`

Returns the subset of `versions` whose values can be coerced to valid semver, normalized to standard semver format. Entries with uncoercible values are omitted.

```js
getCoerced(
  { node: '20', myLib: '18.0.0.Final', broken: 'not-a-version' }
); // → { node: '20.0.0', myLib: '18.0.0' }
```

| Parameter  | Type            | Description                       |
|------------|-----------------|-----------------------------------|
| `versions` | `SemverVersions`| Named version strings to coerce   |

### `isSatisfied(range, version)`

Returns `true` if the version satisfies the range, `false` if it does not, or `null` if the check should be skipped — when the range is invalid or the version cannot be coerced to semver.

```js
isSatisfied('>=18', '20');          // → true
isSatisfied('>=18', '16');          // → false
isSatisfied('not-a-range', '20');   // → null
isSatisfied('>=18', 'not-a-version'); // → null
```

| Parameter | Type     | Description              |
|-----------|----------|--------------------------|
| `range`   | `string` | A semver range string    |
| `version` | `string` | A version string to check |

## License

MIT
