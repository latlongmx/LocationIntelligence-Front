(function(){
	/*
	* UI Module
	*/
	'use strict';
	
	function uiService($mdDialog){
		
		/* Template for Loader progress */
		this.loaderTemplate = [
			'<div class="m-loading">',
				'<div id="floatingCirclesG">',
					'<div class="f_circleG" id="frotateG_01"></div>',
					'<div class="f_circleG" id="frotateG_02"></div>',
					'<div class="f_circleG" id="frotateG_03"></div>',
					'<div class="f_circleG" id="frotateG_04"></div>',
					'<div class="f_circleG" id="frotateG_05"></div>',
					'<div class="f_circleG" id="frotateG_06"></div>',
					'<div class="f_circleG" id="frotateG_07"></div>',
					'<div class="f_circleG" id="frotateG_08"></div>',
				'</div>',
			'</div>',
		].join('');

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

		/* Show Loader while layer is loadding */
		this.isLoaddingLayer = function(inputs){
			return this.loaderTemplate;
		}

	}
	uiService.$inject = ['$mdDialog'];
	angular.module('ui.service', []).service('uiService', uiService);
})();
