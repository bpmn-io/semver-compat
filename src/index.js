import { coerce, satisfies, validRange } from 'semver';

/**
 * A record of semver range strings (e.g. `{ node: '>=18', myLib: '^2.0' }`).
 *
 * @typedef { Record<string, string> } SemverRanges
 */

/**
 * A record of concrete version strings (e.g. `{ node: '20.0', myLib: '1.5' }`).
 *
 * @typedef { Record<string, string> } SemverVersions
 */


/**
 * Returns `true` if all entries present in both `required` and `provided` are
 * compatible.
 *
 * Rules:
 * - Only keys present in both `required` and `provided` are checked.
 * - Entries in `provided` whose value cannot be coerced to semver are skipped.
 * - Entries in `required` with an invalid semver range are skipped.
 *
 * @param { SemverRanges } required
 * @param { SemverVersions } provided
 * @returns { boolean }
 */
export function isCompatible(required, provided) {
  for (const [ name, range ] of Object.entries(required)) {
    const version = provided[name];

    if (!version) {
      continue;
    }

    if (isSatisfied(range, version) === false) {
      return false;
    }
  }

  return true;
}

/**
 * Returns the subset of `required` whose range is satisfied by the
 * corresponding version in `provided`.
 *
 * @param { SemverRanges } required
 * @param { SemverVersions } provided
 * @returns { SemverVersions }
 */
export function getCompatible(required, provided) {

  /** @type { SemverVersions } */
  const result = {};

  for (const [ name, range ] of Object.entries(required)) {
    const version = provided[name];

    if (!version) {
      continue;
    }

    if (isSatisfied(range, version) === true) {
      result[name] = version;
    }
  }

  return result;
}

/**
 * Returns the subset of `versions` whose version can be coerced to a valid
 * semver string, with values normalized to standard semver format.
 *
 * @example
 * getCoerced({ node: '20', myLib: '18.0.0.Final', broken: 'not-a-version' })
 * // => { node: '20.0.0', myLib: '18.0.0' }
 *
 * @param { SemverVersions } versions
 * @returns { SemverVersions }
 */
export function getCoerced(versions) {

  /** @type { SemverVersions } */
  const result = {};

  for (const [ name, version ] of Object.entries(versions)) {
    const coerced = coerce(version);

    if (coerced) {
      result[name] = coerced.version;
    }
  }

  return result;
}

/**
 * Returns `true` if the provided version satisfies the required semver range,
 * `false` if it does not, or `null` if the check should be skipped (invalid range
 * or uncoercible version).
 *
 * @param { string } range
 * @param { string } version
 * @returns { boolean | null }
 */
export function isSatisfied(range, version) {
  if (!validRange(range)) {
    return null;
  }

  const coerced = coerce(version);

  if (!coerced) {
    return null;
  }

  return satisfies(coerced, range);
}