angular.module('GFMSModule',['ngResource','ui.router','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule'])
.controller('ViewGFMSController',['$q','$scope','toastr','GFMS', function($q,$scope,toastr,GFMS) {
    $scope.GFMS = GFMS;
}])
.controller('EditGFMSController', ['$q','$scope','$state','toastr','GFMS','LOVs','BusinessObjectsFactory', function($q,$scope,$state,toastr,GFMS,LOVs,BusinessObjectsFactory) {
    $scope.GFMS = angular.copy(GFMS);
    $scope.isDisabled = false;
    $scope.Appropriations = LOVs.Appropriations;
    $scope.Allotments = LOVs.Allotments;
    $scope.saveGFMS = function() {    
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	        $scope.GFMS.SaveGFMS().then(function(res) {
	        	$scope.isDisabled = false;
	            $state.go('ViewGFMS', { id: $scope.GFMS.Id });
	            toastr.success("GFMS Entry saved.","Success");
	        }, function(err) {
	        	$scope.isDisabled = false;
	            $state.reload();
	            toastr.error("Error saving GFMS Entry.","Error");
	        });
        }
    }
    		
    $scope.cancel = function() {
        if ($state.params.id) {
            $state.go('ViewGFMS', { id: $scope.GFMS.Id });
        } else {
            $state.go('home');
        }
    }
}])