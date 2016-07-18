(function(){
	/*
	* UI Module
	*/
	'use strict';
	
	function messagesService(){
		
		/* Login */
		this.addMessageLoggin = function(button){
			return "Iniciando...";
		}
		this.removeMessageLoggin = function(button){
			return "Iniciar";
		}
		this.userNotExists = function(button){
			return "Las credenciales son incorrectas";
		}
		this.fieldsRequired = function(){
			return "Los campos son requeridos";
		}
		
		/* Server error */
		this.serverErrorRequest = function(button){
			return "Ha ocurrido un error, intenta nuevamente";
		}

	}
	//messagesService.$inject = ['$q', '$http'];
	angular.module('msg.service', []).service('messagesService', messagesService);
})();
