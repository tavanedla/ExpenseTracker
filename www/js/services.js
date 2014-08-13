(function(){
	var app = angular.module('Services',['ionic']);

	app.service('alertService',function() {
		var alertsList = [];
		var settings = {};

		var sendAlerts = function(alerts) {
			alertsList = alerts;
		};

		var getAlerts = function() {
			return alertsList;
		};

		var sendSettings = function(obj) {
			settings = obj;
		};

		var getSettings = function() {
			return settings;
		};

		return {
			sendAlerts: sendAlerts,
			getAlerts: getAlerts,
			sendSettings: sendSettings,
			getSettings: getSettings
		};
	});

	app.factory('Storage',function() {
		return {
			getExpenses: function() {
				var expenses = window.localStorage['expenses'];
				if(expenses)
				{
					return angular.fromJson(expenses);
				}
				return [];
			},
			saveExpenses: function(expenses) {
				window.localStorage['expenses'] = angular.toJson(expenses);
			},
			getSettings: function() {
				var settings = window.localStorage['settings'];
				if(settings)
				{
					return angular.fromJson(settings);
				}
				return {};
			},
			saveSettings: function(settings) {
				window.localStorage['settings'] = angular.toJson(settings);
			}
		};
	});
})();