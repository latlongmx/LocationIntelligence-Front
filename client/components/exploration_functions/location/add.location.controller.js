(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	var AddLocationController = function($scope, $mdDialog, FileUploader){
		var _this = this;
		
		var uploader = $scope.uploader = new FileUploader({
			url: 'upload.php'
		});
		
		uploader.filters.push({
			name: 'customFilter',
			fn: function(item, options) {
				return this.queue.length <= 1;
			}
		});
		
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };
		_this.hide = function() {
			$mdDialog.hide();
		};

		_this.cancel = function() {
			$mdDialog.cancel();
		};

		_this.answer = function(answer) {
			$mdDialog.hide(answer);
		};

	};

	AddLocationController.$inject = ['$scope', '$mdDialog', 'FileUploader'];

	angular.module('add.location.controller', []).
	controller('AddLocationController', AddLocationController);

})();
