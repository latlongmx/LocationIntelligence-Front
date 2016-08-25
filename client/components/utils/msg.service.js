(function(){
	/*
	* UI Module
	*/
	'use strict';
	
	function messagesService(){
		
		/* Login */
		this.addMessageLoggin = function(button){
			return "Iniciando...";
		};

		this.removeMessageLoggin = function(button){
			return "Iniciar";
		};

		this.userNotExists = function(button){
			return "El usuario no existe";
		};

		this.fieldsRequired = function(){
			return "Los campos son requeridos";
		};
		
		/* Server error */
		this.serverErrorRequest = function(button){
			return "Ha ocurrido un error, intenta nuevamente";
		};

	}
	//messagesService.$inject = ['$q', '$http'];
	angular.module('walmex').service('messagesService', messagesService);
})();
