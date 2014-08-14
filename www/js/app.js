(function() {
  
	var app = angular.module('MyApp', ['ionic','Controller','lineGraph','ngRoute','Services']);

	app.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/',{
					templateUrl: 'lib/alertsHome.html',
					controller: 'AppController'
				}).
				when('/alerts',{
					templateUrl: 'lib/alertsHome.html',
					controller: 'AppController'
				}).
				when('/expenses',{
					templateUrl: 'lib/expenses.html',
					controller: 'ExpenseController'
				}).
				when('/alerts/:alertId',{
					templateUrl: 'lib/alertsDetail.html',
					controller: 'detailsController'
				}).
				otherwise({
					redirectTo: 'lib/alertsHome.html',
					controller: 'AppController'
				});
	}]);

	app.controller('detailsController',function($scope,$routeParams,alertService) {
		$scope.alertId = $routeParams.alertId;
		$scope.settings = alertService.getSettings();
		$scope.alerts = alertService.getAlerts();
	});

	app.controller('ExpenseController',function($scope,$ionicModal,alertService,StorageFactory) {
		$scope.expenses = StorageFactory.getExpenses();
		$scope.settings = {
			startDate: '0001-01-01',
			endDate: '9999-12-31',
			min: 0,
			max: 10000000,
			categories: ['Food','Fuel','Entertainment'],
			groupyBy: 'None'
		};
		$scope.newSettings = $scope.settings;
		$ionicModal.fromTemplateUrl('lib/expenseSettings.html',function(modal) {
			$scope.settingsModal = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up'
		});

		$scope.showSettings = function() {
			$scope.settingsModal.show();
		};

		$scope.closeSettings = function() {
			$scope.settingsModal.hide();
		};
	});
})();
