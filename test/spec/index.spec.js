import { expect } from 'chai';

import { getIncompatible, isCompatible } from '../../src/index.js';

describe('semver-compat', function() {

  describe('getIncompatible', function() {

    it('returns empty object when all requirements are satisfied', function() {
      const result = getIncompatible(
        { node: '>=18' },
        { node: '20' }
      );

      expect(result).to.eql({});
    });

    it('returns empty object when required key is not in provided', function() {
      const result = getIncompatible(
        { node: '>=18' },
        { npm: '10' }
      );

      expect(result).to.eql({});
    });

    it('returns mismatched entry with required and provided values', function() {
      const result = getIncompatible(
        { node: '>=18' },
        { node: '16' }
      );

      expect(result).to.eql({
        node: { required: '>=18', provided: '16' }
      });
    });

    it('returns multiple mismatched entries', function() {
      const result = getIncompatible(
        { node: '>=18', npm: '>=9' },
        { node: '16', npm: '8' }
      );

      expect(result).to.have.keys('node', 'npm');
    });

    it('returns only the mismatched entry when one of several fails', function() {
      const result = getIncompatible(
        { node: '>=18', npm: '>=9' },
        { node: '16', npm: '10' }
      );

      expect(result).to.have.key('node');
      expect(result).not.to.have.key('npm');
    });

    it('coerces partial version strings', function() {
      const result = getIncompatible(
        { node: '>=18' },
        { node: '18' }
      );

      expect(result).to.eql({});
    });

    it('coerces non-standard version strings', function() {
      const result = getIncompatible(
        { node: '>=18' },
        { node: '18.0.0.Final' }
      );

      expect(result).to.eql({});
    });

    it('skips entries with an uncoercible version', function() {
      const result = getIncompatible(
        { node: '>=18' },
        { node: 'not-a-version' }
      );

      expect(result).to.eql({});
    });

    it('skips entries with an invalid range', function() {
      const result = getIncompatible(
        { node: 'not-a-range' },
        { node: '18' }
      );

      expect(result).to.eql({});
    });

    it('supports strict greater-than range', function() {
      expect(
        getIncompatible({ node: '>18' }, { node: '18' })
      ).to.have.key('node');

      expect(
        getIncompatible({ node: '>18' }, { node: '20' })
      ).to.eql({});
    });

    it('supports bounded range', function() {
      expect(
        getIncompatible({ node: '>=18 <20' }, { node: '19' })
      ).to.eql({});

      expect(
        getIncompatible({ node: '>=18 <20' }, { node: '20' })
      ).to.have.key('node');
    });

  });


  describe('isCompatible', function() {

    it('returns true when all requirements are satisfied', function() {
      expect(isCompatible(
        { node: '>=18' },
        { node: '20' }
      )).to.be.true;
    });

    it('returns false when a requirement is not satisfied', function() {
      expect(isCompatible(
        { node: '>=18' },
        { node: '16' }
      )).to.be.false;
    });

    it('returns true when required key is not in provided', function() {
      expect(isCompatible(
        { node: '>=18' },
        {}
      )).to.be.true;
    });

    it('returns true for an uncoercible version (fail-open)', function() {
      expect(isCompatible(
        { node: '>=18' },
        { node: 'not-a-version' }
      )).to.be.true;
    });

    it('returns true for an invalid range (fail-open)', function() {
      expect(isCompatible(
        { node: 'not-a-range' },
        { node: '18' }
      )).to.be.true;
    });

  });

});
