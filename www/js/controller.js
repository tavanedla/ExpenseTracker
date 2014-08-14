(function(){
	var app = angular.module('Controller',['ionic','ngRoute','Services']);

	app.controller('AppController',function($scope,$ionicModal,$routeParams,alertService,StorageFactory) {

		//expenses data. date format: yyyy-mm-dd
		//$scope.data = [
	  	//	{ 'date': '2011-11-11', 'amount': 1000, 'category': 'Fuel', 'description': ''},
	  	//	{ 'date': '2011-12-11', 'amount': 700, 'category': 'Entertainment', 'description': ''},
	  	//	{ 'date': '2011-12-12', 'amount': 400, 'category': 'Fuel', 'description': ''},
	  	//	{ 'date': '2010-11-11', 'amount': 500, 'category': 'Food', 'description': ''},
	  	//	{ 'date': '2010-12-12', 'amount': 600, 'category': 'Food', 'description': ''},
	  	//	{ 'date': '2011-12-12', 'amount': 800, 'category': 'Fuel', 'description': ''},
	  	//];	
	  	
	  	$scope.data = StorageFactory.getExpenses();
	  	//the data that is used in graph and to calculate alerts
	  	$scope.displayData = [];
	  	
	  	//data filtered by date
	  	$scope.filteredData = [];

	  	//variable used to decide when to update graph
 		$scope.updateGraph = 1;

	  	//user settings
	  	$scope.settings = StorageFactory.getSettings();
	  	//$scope.settings = {
	  	//	limitMax: 500,
	  	//	groupBy: 'Do not group',
	  	//	groupBy: 'Daily',
	  	//	points: 5,
	  	//	startDate: '2009-01-01',
	  	//	endDate: '3000-12-31'
	  	//};

	  	//object used in the settings form
	  	$scope.newSettings = {};
	  	
	  	//alerts based on the settings
	  	$scope.alerts = [];

	  	//new value used in add value form
	  	$scope.value = {};

	  	serviceFunction = function()
	  	{
	  		alertService.sendAlerts($scope.alerts);
	  		alertService.sendSettings($scope.settings);
	  	}
	  	//Modal for adding a new expense
	  	$ionicModal.fromTemplateUrl('lib/addValue.html',function(modal) {
	      	$scope.addModal = modal;
	    }, {
	      	scope: $scope,
	      	animation: 'slide-in-up'
	    });
	    
	    $scope.closeAddValue = function() {
	      	$scope.addModal.hide();
	      	$scope.value = {};
	    }
	    
	    $scope.toggleAdd = function() {
	    	$scope.addModal.show();
	    };
	    
	    $scope.addValue = function() {
      		$scope.data.push($scope.value);
      		$scope.data.sort(compare);
      		StorageFactory.saveExpenses($scope.data);
      		filterData();
      		if($scope.settings.groupBy == "Daily") {
    			groupByDate();
    		}
    		else if($scope.settings.groupBy == "Monthly") {
	        	groupByMonth();
	        }
    		else {
    			doNotGroup();	
    		}
    	  	$scope.addModal.hide();
      		$scope.value = {};
      		$scope.updateGraph++;	
      		$scope.produceAlerts();
      		serviceFunction();
	    };

	    //Modal for the settings 
	    $ionicModal.fromTemplateUrl('lib/settings.html',function(modal) {
	      	$scope.settingsModal = modal;
	      	}, {
	    	  scope: $scope
	    });
	    
	  	$scope.closeSettings = function() {
	      	$scope.settingsModal.hide();
	  	}
	  	$scope.toggleSettings = function() {
	  	  	$scope.settingsModal.show();
	  	};

	    $scope.applySettings = function() {
		    $scope.settings = $scope.newSettings;
		    StorageFactory.saveSettings($scope.settings);
		    $scope.settingsModal.hide();
		    filterData();
		    //$scope.displayData = [];
		    if($scope.settings.groupBy == "Daily") {
	        	groupByDate();
	        }
	        else if($scope.settings.groupBy == "Monthly") {
	        	groupByMonth();
	        }
	        else {
	        	doNotGroup();	
	        }
	        $scope.updateGraph++;
	      	$scope.produceAlerts();
	      	serviceFunction();
	    };
	    
	    //function to generate alerts
	    $scope.produceAlerts = function() {
	    	$scope.alerts = [];
	    	if($scope.settings.groupBy == "Do not group") {
		    	for(var i = 0;i < $scope.displayData.length;i++) {
		    		if($scope.displayData[i].amount > $scope.settings.limitMax) {
		    			$scope.alerts.push($scope.displayData[i]);
		    		}
		    	};
	    	}
	    	else
	    	{
	    		for(x in $scope.displayData) {
	    			if($scope.displayData[x].amount > $scope.settings.limitMax) {
	    				$scope.alerts.push($scope.displayData[x]);
	    			}
	    		};
	    	}
	    };

	    //compare function to compare date of expenses
	    var compare = function(a,b) {
	    	if(a.date < b.date) {
	    		return -1;
	    	}
	    	else {
	    		return 1;
	    	}
	    };

	    //var sortByDate = function(data) {};
	    
	    //function to group expenses by date
	    var groupByDate = function() {
	    	$scope.displayData = [];
	    	for(var i=0;i < $scope.filteredData.length;i++){
	    		var tempDate = $scope.filteredData[i].date;
	    		if($scope.displayData[tempDate] == undefined) {
	    			$scope.displayData[tempDate] = {
	    				date: tempDate,
	    				amount: $scope.filteredData[i].amount,
	    				expenses: [$scope.filteredData[i]]
	    			};
	    		}
	    		else {
	    			$scope.displayData[tempDate].amount = $scope.displayData[tempDate].amount + $scope.filteredData[i].amount;
	    			$scope.displayData[tempDate].expenses.push($scope.filteredData[i]);
	    		}
	    	};
	    };

	    var doNotGroup = function() {
	    	for(var i=0;i < $scope.filteredData.length;i++) {
	    		$scope.displayData[i] = {
	    			date: $scope.filteredData[i].date,
	    			amount: $scope.filteredData[i].amount,
	    			expenses: [$scope.filteredData[i]]
	    		}
	    	}
	    };

	    var groupByMonth = function() {
	    	$scope.displayData = [];
	    	for(var i=0;i<$scope.filteredData.length;i++) {
	    		var month = $scope.filteredData[i].date.substr(0,7);
	    		if($scope.displayData[month] == undefined) {
	    			$scope.displayData[month] = {
	    				date: month,
	    				amount: $scope.filteredData[i].amount,
	    				expenses: [$scope.filteredData[i]]
	    			};
	    		}
	    		else {
	    			$scope.displayData[month].amount = $scope.displayData[month].amount + $scope.filteredData[i].amount;
	    			$scope.displayData[month].expenses.push($scope.filteredData[i]);		
	    		}
	    	}
	    };

	    //function to filter data by date
	    var filterData = function() {
	    	$scope.filteredData = [];
	    	for(var i=0;i<$scope.data.length;i++) {
	    		if($scope.data[i].date<=$scope.settings.endDate && $scope.data[i].date>=$scope.settings.startDate)
	    			$scope.filteredData.push($scope.data[i]);
	    	}
	    };

	    //the function that is run when the page is first loaded
        $scope.init = function() {
        	$scope.data.sort(compare);
        	filterData();
        	$scope.newSettings = $scope.settings;
        	//$scope.data.sort(compare);
        	if($scope.settings.groupBy == "Daily") {
        		groupByDate();
        	}
        	else if($scope.settings.groupBy == "Monthly") {
        		groupByMonth();
        	}
        	else {
        		doNotGroup();	
        	}
        	$scope.updateGraph++;
            $scope.produceAlerts();
            serviceFunction();
        };
	});
})();