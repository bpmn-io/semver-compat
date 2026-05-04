const { expect } = require('chai');

const { isCompatible } = require('@bpmn-io/semver-compat');


describe('semver-compat - use from commonjs', function() {

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

  });

});