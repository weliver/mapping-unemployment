window.mock = function( constr, name ) {
  var keys = [];
  for( var key in constr) {
    keys.push( key );
  }
  return keys.length > 0 ? jasmine.createSpyObj( name || "mock", keys ) : {};
};

//creat spies for methods
var mapTest = mock(d3Map);


(function () {
  'use strict';

  describe('Establish svg and data parameters', function () {
    describe('Data and Key settings', function () {
      it('should set height and width', function () {
      	expect(d3Map['svgWidth']).toEqual(800);

      });
      it('should provide a key containing an array with length', function() {
        expect(d3Map.key.height).toEqual(30);
      });
    });
  });
})();
