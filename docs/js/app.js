'use strict';

// For simple control just using global objects as scopes.
var data = {}; // Global data
var sys = {}; // Global system

// Defining the docs app.
var app = angular.module('docs', ['ngResource']);

/**
 * When the app is fully loaded
 */
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#';

	// Booting up the Angular Web App docs to the scope of the entire document
	angular.bootstrap(document, ['docs']);
});

//Setting HTML5 Location Mode
angular.module('docs').config(['$locationProvider',
	function($locationProvider) {
		$locationProvider
			.hashPrefix('!')
			.html5Mode(true);
	}
]);