import { expect } from 'chai';

import { getCoerced, getCompatible, isCompatible, isSatisfied } from '../../src/index.js';

describe('semver-compat', function() {

  describe('isCompatible', function() {

    it('should return true when all requirements are satisfied', function() {

      // when
      const result = isCompatible(
        { node: '>=18', npm: '>=9' },
        { node: '20', npm: '10' }
      );

      // then
      expect(result).to.be.true;
    });


    it('should return false when any requirement is not satisfied', function() {

      // when
      const result = isCompatible(
        { node: '>=18', npm: '>=9' },
        { node: '20', npm: '8' }
      );

      // then
      expect(result).to.be.false;
    });


    it('should return true when a key is missing from provided', function() {

      // when
      const result = isCompatible({ node: '>=18' }, {});

      // then
      expect(result).to.be.true;
    });


    it('should return true when a version cannot be coerced', function() {

      // when
      const result = isCompatible({ node: '>=18' }, { node: 'not-a-version' });

      // then
      expect(result).to.be.true;
    });


    it('should return true when a range is invalid', function() {

      // when
      const result = isCompatible({ node: 'not-a-range' }, { node: '18' });

      // then
      expect(result).to.be.true;
    });

  });


  describe('getCompatible', function() {

    it('should return entries whose requirements are satisfied', function() {

      // when
      const result = getCompatible(
        { node: '>=18', npm: '>=9' },
        { node: '20', npm: '10' }
      );

      // then
      expect(result).to.eql({ node: '20', npm: '10' });
    });


    it('should return only satisfied entries when some fail', function() {

      // when
      const result = getCompatible(
        { node: '>=18', npm: '>=9' },
        { node: '20', npm: '8' }
      );

      // then
      expect(result).to.have.key('node');
      expect(result).not.to.have.key('npm');
    });


    it('should return empty object when no requirements are satisfied', function() {

      // when
      const result = getCompatible({ node: '>=18' }, { node: '16' });

      // then
      expect(result).to.eql({});
    });


    it('should skip an entry absent from provided', function() {

      // when
      const result = getCompatible({ node: '>=18' }, { npm: '10' });

      // then
      expect(result).to.eql({});
    });


    it('should skip an entry absent from required', function() {

      // when
      const result = getCompatible({}, { node: '20' });

      // then
      expect(result).to.eql({});
    });


    it('should coerce non-standard version strings', function() {

      // when
      const result = getCompatible({ node: '>=18' }, { node: '18.0.0.Final' });

      // then
      expect(result).to.eql({ node: '18.0.0.Final' });
    });


    it('should skip entries with an uncoercible version', function() {

      // when
      const result = getCompatible({ node: '>=18' }, { node: 'not-a-version' });

      // then
      expect(result).to.eql({});
    });


    it('should skip entries with an invalid range', function() {

      // when
      const result = getCompatible({ node: 'not-a-range' }, { node: '18' });

      // then
      expect(result).to.eql({});
    });


    it('should support strict greater-than range', function() {

      // when
      const included = getCompatible({ node: '>18' }, { node: '20' });
      const excluded = getCompatible({ node: '>18' }, { node: '18' });

      // then
      expect(included).to.have.key('node');
      expect(excluded).to.eql({});
    });


    it('should support bounded range', function() {

      // when
      const included = getCompatible({ node: '>=18 <20' }, { node: '19' });
      const excluded = getCompatible({ node: '>=18 <20' }, { node: '20' });

      // then
      expect(included).to.have.key('node');
      expect(excluded).to.eql({});
    });

  });


  describe('isSatisfied', function() {

    it('should return true when version satisfies range', function() {

      // when
      const result = isSatisfied('>=18', '20');

      // then
      expect(result).to.be.true;
    });


    it('should return false when version does not satisfy range', function() {

      // when
      const result = isSatisfied('>=18', '16');

      // then
      expect(result).to.be.false;
    });


    it('should return null for an invalid range', function() {

      // when
      const result = isSatisfied('not-a-range', '18');

      // then
      expect(result).to.be.null;
    });


    it('should return null for an uncoercible version', function() {

      // when
      const result = isSatisfied('>=18', 'not-a-version');

      // then
      expect(result).to.be.null;
    });

  });


  describe('getCoerced', function() {

    it('should return the coerced version string', function() {

      // when
      const result = getCoerced({ node: '18.0.0.Final' });

      // then
      expect(result).to.eql({ node: '18.0.0' });
    });


    it('should omit entries with uncoercible versions', function() {

      // when
      const result = getCoerced({ node: '20', myLib: 'not-a-version' });

      // then
      expect(result).to.eql({ node: '20.0.0' });
    });

  });

});
