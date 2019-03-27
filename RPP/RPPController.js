angular.module('RPPController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule'])
.controller('RPPController',['$q','$scope','$state','toastr','BusinessObjectsFactory','RPPs','RewardsPrograms',function($q,$scope,$state,toastr,BusinessObjectsFactory,RPPs,RewardsPrograms) {
	$scope.RewardsPrograms = RewardsPrograms;
	$scope.RPPs = RPPs;
	$scope.isDisabled = false;
	$scope.RPP = new BusinessObjectsFactory.RPP();
	$scope.createRPP = function() {
		if($scope.isDisabled == false)
		{
			$scope.isDisabled = true;
			if ($scope.RPP.RewardsProgram != "" && $scope.RPP.Date) {
				$scope.RPP.GetNextRPP().then(function(res) {
					$scope.RPP.SaveRPP().then(function(resp) {
						$scope.isDisabled = false;
						$state.reload();					
						toastr.success("RPP created.");
					}, function(e) {
						$scope.isDisabled = false;
						toastr.error("Unable to create new RPP.")
					})
				}, function(err) {
					$scope.isDisabled = false;
					toastr.error("Unable to create new RPP.")
				});
			} else {
				$scope.isDisabled = false;
				toastr.error("Select a Rewards Program and Date to create an RPP.")
			}
		}
	}
	$scope.ViewRPP = function(index) {
		$state.go('ViewRPP',{ id: $scope.RPPs[index].Id });
	}
}])
.controller('ViewRPPController', ['$scope','RPP','Payments', function($scope,RPP,Payments) {
	$scope.RPP = RPP;
	$scope.Payments = Payments;
}])