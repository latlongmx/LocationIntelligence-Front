(function(){

  'use strict';

	function LocationFactory(_) { //_, chroma, $http
		var factory = {},
    _this = factory;

    factory.fCallback = undefined;

    factory.processCSV = function(fileToRead, callback) {
      this.fCallback = callback;
      var reader = new FileReader();
      // Read file into memory as UTF-8
      reader.readAsText(fileToRead);
      // Handle errors load
      reader.onload = this.loadHandler;
      reader.onerror = this.errorHandler;
    };

    factory.loadHandler = function(event) {
      var csv = event.target.result;
      _this.getColumnsCSV(csv);
    };

    factory.getColumnsCSV = function(csv) {
      var allTextLines = csv.split(/\r\n|\n/);
      var columns = [];
      if(allTextLines.length >0){
        var data = allTextLines[0].split(',');
        for (var j=0; j<data.length; j++) {
            columns.push(data[j]);
        }
      }
      /*for (var i=0; i<allTextLines.length; i++) {
          var data = allTextLines[i].split(';');
              var tarr = [];
              for (var j=0; j<data.length; j++) {
                  tarr.push(data[j]);
              }
              lines.push(tarr);
      }*/
      _this.fCallback(columns);
    };

    factory.errorHandler = function(evt) {
      if(evt.target.error.name == "NotReadableError") {
        console.log("Canno't read file !");
      }
    };

    return factory;
  }

  LocationFactory.$inject = ['_'];
	angular.module('location.factory',[])
		.factory('LocationFactory', LocationFactory);
})();
