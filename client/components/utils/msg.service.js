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
		this.loginFirstTime = function(){
			return "Primer inicio de sesión automático...";
		}
		this.redirectToMap = function(){
			return "Redirigiendo al mapa...";
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
			return "Usuario o contraseña no válido";
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
