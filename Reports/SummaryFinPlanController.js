angular.module("SummaryFinPlanController", ['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule'])
.controller('SummaryFinPlanController',['$q','$state','$scope','GetSOFs','AvailableFiscalYears','UtilityService','ManageSOFs','ManageObligations','TotalSofAndObligation','ManageRecoveries','GrandTotal',function($q,$state,$scope,GetSOFs,AvailableFiscalYears,UtilityService,ManageSOFs,ManageObligations,TotalSofAndObligation,ManageRecoveries,GrandTotal) {

	$scope.SOFs = ManageSOFs
	$scope.Obligations = ManageObligations
	$scope.Total = TotalSofAndObligation
	$scope.Recoveries = ManageRecoveries
	$scope.GrandTotal = GrandTotal
    var t = new Date();
    $scope.DisplayDate = t.toString().substr(0, t.toString().indexOf(":") - 3);

	var forComma = $scope.DisplayDate.length - 5
	$scope.DisplayDate = [$scope.DisplayDate.slice(0, forComma), ",", $scope.DisplayDate.slice(forComma)].join('');
	
	
	$scope.Evacs = []
	angular.forEach($scope.Obligations.Obligations, function(obligaton,index) {
		if(obligaton.Evacs.length>0)
		{
			angular.forEach(obligaton.Evacs, function(Evac,index) {
				$scope.Evacs.push(Evac)
			})
		}
	})	
	
	var unformattedDate = new Date( Date.now());
	$scope.SummaryFinPlan = {}
	$scope.SummaryFinPlan.FiscalYear = UtilityService.getTwoDigitFiscalYear(unformattedDate)
	
	$scope.EdcsAvailabilityDisplayDate = $scope.DisplayDate

	var eachPaymentFY = _.pluck(AvailableFiscalYears.data, "FiscalYear")
	var uniqueFYarray = _.uniq(eachPaymentFY)
	uniqueFYarray = _.reject(uniqueFYarray, function(item){ return item == null });	
	if(!_.contains(uniqueFYarray , $scope.SummaryFinPlan.FiscalYear)){uniqueFYarray.push($scope.SummaryFinPlan.FiscalYear)}	
	$scope.ListOfFiscalYears = uniqueFYarray.sort()
	if($state.params.FiscalYear != null)
	{
		currentFY = UtilityService.getTwoDigitFiscalYear(unformattedDate)
		if($state.params.FiscalYear != currentFY )
		{
			var OctoberOfThatFY = "10/31/20" + $state.params.FiscalYear
			OctoberOfThatFY = new Date(OctoberOfThatFY)
			$scope.EdcsAvailabilityDisplayDate = OctoberOfThatFY.toString().substr(0, t.toString().indexOf(":") - 3);
			
			var forComma = $scope.EdcsAvailabilityDisplayDate.length - 5
			$scope.EdcsAvailabilityDisplayDate = [$scope.EdcsAvailabilityDisplayDate.slice(0, forComma), ",", $scope.EdcsAvailabilityDisplayDate.slice(forComma)].join('');

		}
		
		$scope.SummaryFinPlan.FiscalYear = $state.params.FiscalYear
	}


	$scope.ChangeFiscalYear = function(NewFiscalYear){
		$state.go('SummaryFinPlan',{FiscalYear: NewFiscalYear},{reload: true});
	}


}])