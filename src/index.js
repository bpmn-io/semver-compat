import { coerce, satisfies, validRange } from 'semver';

/**
 * A map of named semver range requirements.
 *
 * @example { node: '>=18', myLib: '>=2.0' }
 *
 * @typedef { Record<string, string> } Requirements
 */

/**
 * A map of concrete version strings to check against requirements.
 * Versions are coerced to semver, so non-standard formats such as `18.0` or
 * `18.0.0.Final` are accepted.
 *
 * @example { node: '20.0', myLib: '1.5' }
 *
 * @typedef { Record<string, string> } Provided
 */

/**
 * Details about a single version mismatch.
 *
 * @typedef { { required: string, provided: string } } Mismatch
 */

/**
 * Returns the subset of `required` whose range is not satisfied by the
 * corresponding version in `provided`.
 *
 * Rules:
 * - Keys present in `required` but absent from `provided` are skipped.
 * - Entries in `provided` whose value cannot be coerced to semver are skipped.
 * - Entries in `required` with an invalid semver range are skipped.
 *
 * @param { Requirements } required
 * @param { Provided } provided
 * @returns { Record<string, Mismatch> }
 */
export function getIncompatible(required, provided) {

  /** @type { Record<string, Mismatch> } */
  const result = {};

  for (const [ name, range ] of Object.entries(required)) {
    const version = provided[name];

    if (!version) {
      continue;
    }

    if (!validRange(range)) {
      continue;
    }

    const coerced = coerce(version);

    if (!coerced) {
      continue;
    }

    if (!satisfies(coerced, range)) {
      result[name] = { required: range, provided: version };
    }
  }

  return result;
}

/**
 * Returns true if all entries present in both `required` and `provided` are
 * compatible, i.e. `getIncompatible` returns an empty object.
 *
 * @param { Requirements } required
 * @param { Provided } provided
 * @returns {boolean}
 */
export function isCompatible(required, provided) {
  return Object.keys(getIncompatible(required, provided)).length === 0;
}
