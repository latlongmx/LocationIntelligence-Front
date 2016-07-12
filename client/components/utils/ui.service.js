(function(){
	/*
	* UI Module
	*/
	'use strict';
	
	function uiService($mdDialog){
		
		/* Login */
		this.addLogginIsLoading = function(button, message){
			button.attr("disabled", true);
			button.text(message);
		}
		this.removeLogginIsLoading = function(button, message){
			button.attr("disabled", false);
			button.text(message);
		}
		this.cleanInputs = function(inputs){
			inputs.value = "";
		}

	}
	uiService.$inject = ['$mdDialog'];
	angular.module('ui.service', []).service('uiService', uiService);
})();
