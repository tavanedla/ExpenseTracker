(function() {
  
	var app = angular.module('MyApp', ['ionic','Controller','lineGraph','ngRoute']);

	app.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/',{
					templateUrl: 'lib/home.html'
				}).
				when('/alerts/:alertId',{
					templateUrl: 'lib/alertsTemplate.html',
					controller: 'detailsController'
				}).
				otherwise({
					redirectTo: 'lib/home.html'
				});
	}]);

	app.controller('detailsController',function($scope,$routeParams) {
		$scope.alertId = $routeParams.alertId;
		console.log($scope.alertId);
	});

})();
