(function(){
	/*
	* UI Module
	*/
	'use strict';
	
	function messagesService(){
		
		/* Signup */

		this.signup_success_message = [
			'<div class="m-login__container-body__success-signup">',
				'<img src="./images/login/signup_success.png" alt="" width="75">',
				'<h2 class="color-gray50 weight300 align-center">Registro exitoso</h2>',
			'</div>',
		].join('');

		this.signup_login_message = [
			'<div class="m-login__container-body__success-signup">',
				'<p>Primer inicio de sesión automático</p>',
				'<div layout="row" layout-sm="column" layout-align="space-around">',
    			'<md-progress-circular md-mode="indeterminate" class="md-primary md-hue-3"></md-progress-circular>',
    		'</div>',
			'</div>'
		].join('');

		this.signup_logged_message = [
			'<div class="m-login__container-body__success-signup">',
				'<p>Inicio de sesión exitoso</p>',
			'</div>'
		].join('');

		this.signup_ftue_message = [
			'<div class="m-login__container-body__success-signup">',
				'<p>Iniciando FTUE</p>',
				'<div layout="row" layout-sm="column" layout-align="space-around">',
    			'<md-progress-circular md-mode="indeterminate" class="md-primary md-hue-3"></md-progress-circular>',
    		'</div>',
			'</div>'
		].join('');

		this.signup_ftue_done_message = [
			'<div class="m-login__container-body__success-signup">',
				'<p>FTUE completado</p>',
				'<button class="pure-button m-signup-login__question" ui-sref="mapa">Ir a mi mapa</button>',
			'</div>'
		].join('');

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
