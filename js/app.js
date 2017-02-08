var app = angular.module('logs', ['ngRoute','ngAnimate']);

app.config(['$routeProvider',function($routeprovider){
	$routeprovider
	.when('/',{	
		redirectTo: '/search'
	})
	.when('/search',{
		title: 'Search log',	
		template: '<search-log-box test-function="testFunction(time,logData)"></search-log-box>'
	})
	.when('/post',{	
		title: 'Fuldpost',
		template: '<post-log-box></post-log-box>'
	})
	.when('/test',{	
		title: 'Test',
		template: '<test-box></test-box>'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

app.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

app.service('GetLogData', function ($http, SpinnerService) {
	return {
		getLog: function(logtype, date) {
			if(!date){
				var date = 'day1';
			}
			SpinnerService.startSpinner();
			return $http({
				method: 'GET',
				params: {logtype: logtype, date: date },
				url: 'getlog.php'
			})
		}
	};
});

app.service('GetShortRecord', function ($http, SpinnerService) {
	return {
		getRecord: function(id) {
			SpinnerService.startSpinner();
			return $http({
				method: 'GET',
				params: {id: id},
				url: 'getlog.php'
			})
		}
	};
});

app.service('SortData', function () {
	return {
		getSortParams: function(oldProperty, property, reverse) {
			if(oldProperty === property){
				reverse = !reverse;	
			}else{
				reverse = false;
			}			
		return [{reverse: reverse, sortProperty: property}]
		}
	};
});

app.service('SpinnerService', function ($timeout, $route, $window) {
	return {
		startSpinner: function() {
			angular.element("#spinner, #overlay").show();
			var thisService = this; //setting var because "this" doesn't work inside the timeout function
			spinnerTimer = $timeout(function() {
				if(angular.element("#spinner").is(":visible")){		
					//thisService.stopSpinner();
					angular.element("#spinner").html('An error occurred! <br>Please reload or wait 5 secs for auto reload!');
					angular.element("#spinner").addClass('error');
						$timeout(function() {
							thisService.stopSpinner();
							//$route.reload();
							$window.location.reload();
						},5000);
				}
			},5000);
		},
		stopSpinner: function() {
			$timeout.cancel(spinnerTimer); // Canceling timeout from above function 
			angular.element("#spinner, #overlay").hide();
		}
	};
});

app.directive('wrapperBox',['$animate', function() {
	return {
		restrict: 'E', 	
		scope: {},	
		templateUrl: 'js/wrapperbox.html',
		link: function(scope, element, attrs){
			var activePage = angular.element(location).attr('hash').substring(2);
			if(activePage == ""){
				 activePage = "search";
			}
			angular.element(document).ready(function () {
				$('#menu' + activePage).addClass('active');
            });
		},
		controller: function($scope) {
			$scope.menu = function(page){
				angular.element('#menu li a').removeClass('active');	
				angular.element('#' + page).addClass('active');	
			}

			$scope.testFunction = function(time,logData){
				angular.forEach(logData, function(value,key){
					if(time == value.time){
						console.log('value.myNumber ', value.myNumber + 1);
						console.log('value.time ', value.time);
						console.log('value.search ', value.search);
						console.log('value.advanced ', value.advanced);
					}
					
				})
				//console.log('time', time);
				//console.log("logData ", logData )				
			}
			
		}
	}
}]);


app.directive('searchLogBox', function() {
	return {
		restrict: 'E', 	
		scope: {
			testFunction:'&'
		},	
		templateUrl: 'js/searchlogbox.html',
		controller: function($scope,  $location, $anchorScroll, GetLogData, SortData, SpinnerService) {					
			$scope.callGetLogData = function(date, index){
				if(!index){
					index=0;
				}
				GetLogData.getLog('searchlog', date).then(function(response) {
					$scope.logDataRaw  = response.data;
					$scope.logData = []
					angular.forEach($scope.logDataRaw , function(value, key) {
						tempObj = angular.extend({}, value, {myNumber: key});
						$scope.logData.push(tempObj);
					});
					SpinnerService.stopSpinner();			
				}, function(response) {
					console.log("Error: ", response)
				});
				$scope.selected = index; 	
			}			
			$scope.callGetLogData();
		
			/* Sorting */
			$scope.propertyName = "";
			$scope.reverse = false;
			$scope.callSortBy = function(property){
				$scope.sortData = SortData.getSortParams($scope.propertyName, property, $scope.reverse);
				$scope.propertyName = $scope.sortData[0].sortProperty;
				$scope.reverse = $scope.sortData[0].reverse;
			}

			/* Scrolling with function in directive and $anchorScroll() */
			$scope.scrollToTop = function(scrollId){
				var id = $location.hash();
  				$location.hash(scrollId);
      			$anchorScroll(); 
				$location.hash(id);  				
			} 

			/*$scope.pager = function(date, index){
				GetLogData.getLog('searchlog', date).then(function(response) {
					$scope.logDataRaw  = response.data;
					$scope.logData = []
					angular.forEach($scope.logDataRaw , function(value, key) {
						tempObj = angular.extend({}, value, {myNumber: key});
						$scope.logData.push(tempObj);
					});
					console.log("$scope.logData New", $scope.logData )
					SpinnerService.stopSpinner();			
				}, function(response) {
					console.log("Error: ", response)
				});	
				console.log('pager');
				console.log('$index', index);
				$scope.selected = index; 
			}
			//$scope.pager();*/
			
		}
	}
});
	

app.directive('postLogBox', function() {
	return {
		restrict: 'E', 	
		scope: {},	
		templateUrl: 'js/postlogbox.html',
		controller: function($scope,  $location, $anchorScroll, GetLogData, SortData, GetShortRecord, SpinnerService) {					
			$scope.callGetLogData = function(date){
				GetLogData.getLog('fullpostlog', date).then(function(response) { 
					$scope.logDataRaw  = response.data;
					$scope.logData = []
					angular.forEach($scope.logDataRaw , function(value, key) {
						tempObj = angular.extend({}, value, {myNumber: key});
						$scope.logData.push(tempObj);
					});
					SpinnerService.stopSpinner();					
				}, function(response) {
					console.log("Error: ", response)
				});	
			}			
			$scope.callGetLogData();
			
			/* Sorting */
			$scope.propertyName = "";
			$scope.reverse = false;
			$scope.callSortBy = function(property){
				$scope.sortData = SortData.getSortParams($scope.propertyName, property, $scope.reverse);
				$scope.propertyName = $scope.sortData[0].sortProperty;
				$scope.reverse = $scope.sortData[0].reverse;
			}

			/* Get short record */
			$scope.callGetShortRecord = function(id){
				SpinnerService.stopSpinner(); //Stopping spinner to cancel timeout before starting spinner again.
				GetShortRecord.getRecord(id).then(function(response) { // .then = promise
					$scope.recordData  = response.data;	
					angular.element("#recordModal,#recordModalNoData").hide();
					if(response.data.title){
						angular.element("#recordModal, #overlay").fadeIn(300);
					}else{
						angular.element("#recordModalNoData, #overlay").fadeIn(300);
					}	
					console.log('$scope.recordData', $scope.recordData)				
					angular.element("#spinner").hide();
					angular.element(".dataTable,h1,.pickDate").addClass("blur");
				}, function(response) {
					console.log("Error: ", response);
				});
			}

			/* Close modal */
			$scope.closeModal = function(){
				angular.element('#recordModal, #recordModalNoData, #overlay').fadeOut(100);
				angular.element('.dataTable,h1,.pickDate').removeClass('blur');
			}	
		}
	}
});

app.directive('pickdateBox', function() {
	return {
		restrict: 'E', 	
		scope: {
			callGetLogData: '&'
		},	
		templateUrl: 'js/pickdatebox.html',
		controller: function($scope){}
	}
});

/* Animated scroll directive */
app.directive('scrollTop', function() {
	return {
		restrict: 'A', 	
		scope: {},	
		template: '<div>{{ text }}</div>',
		link:function($scope, element, attrs){
			var target = $(attrs.scrolltarget);
			$scope.text = attrs.scrolltext;
			element.on('click', function() {
				$('html').animate({scrollTop: $(attrs.scrolltarget).offset().top}, 400);
				//$('html').animate({scrollTop: $('#pageBottom').offset().top}, 400);
				console.log('attrs.scrolltarget', attrs.scrolltarget )
			});
		},
		controller: function($scope){}	
	}
});


/* Test service and test directive*/
app.service('TestService', function () {
	return {
		getResult: function () {
			return result;
		},
		setResult: function(value) {
			value = parseInt(value);
			result = (Math.round(Math.random() * 1000 * value) % 1000)/10;
			return result + '%';	
		}
	};
});	

app.directive('testBox', function() {
	return {
		restrict: 'E', 	
		scope: {},	
		template: '<h1>Test</h1><p>Reply from test service: {{ testResult }}</p>',
		controller: function($scope, TestService) {	
			$scope.testResult = TestService.setResult(2);
		}
	}
});