(function(){
	/*
	* UI Module
	*/
	'use strict';
	
	function messagesService(){
		
		/* Signup */
		this.addMessageSignup = function(button){
			return "Creando cuenta...";
		}
		this.removeMessageSignup = function(button){
			return "Crear cuenta";
		}
		this.redirectToLogin = function(button){
			return "Redireccionando...";
		}
		/* Login */
		this.addMessageLoggin = function(button){
			return "Iniciando...";
		}
		this.removeMessageLoggin = function(button){
			return "Iniciar";
		}
		this.userExists = function(button){
			return "El usuario o email ya existe";
		}
		this.userNotExists = function(button){
			return "El usuario no existe";
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
	angular.module('walmex').service('messagesService', messagesService);
})();
