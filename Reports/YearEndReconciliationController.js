angular.module('YearEndReconciliationController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','UtilityModule'])
.controller('YearEndReconciliationController',['$q','$rootScope','$scope','$http','$state','AllObligations','AvailableFiscalYears','ListOfOptions','LiquidatedAmounts','toastr','UtilityService',function($q,$rootScope,$scope,$http,$state,AllObligations,AvailableFiscalYears,ListOfOptions,LiquidatedAmounts,toastr,UtilityService) {


	$scope.Obligations = AllObligations.data
	
	$scope.LiquidatedAmounts = LiquidatedAmounts
	
	angular.forEach($scope.Obligations , function(item,index) {
		//item.Date = new Date(item.Date).toLocaleDateString()
		
		var dt = new Date(item.Date);
		item.Date = (dt.getMonth() + 1).toString() + "/" + dt.getDate().toString() + "/" + dt.getFullYear().toString();
		item.UnformattedDate = dt

		angular.forEach(LiquidatedAmounts , function(liquidatedItem,index) {
			if(liquidatedItem.ObligationNumber == item.ObligationNumber)
			{
				item.LiquidatedAmount = liquidatedItem.LiquidatedAmount 
				item.UnliquidatedAmount = Number(item.Amount) - Number(item.LiquidatedAmount)
			}		
		})		
		
	})
	$scope.Obligations = _.sortBy($scope.Obligations , function(object){ return object.UnformattedDate; });
	
	
	$scope.ListOfOptions =  _.groupBy(ListOfOptions.data, function(item){
	   return item.TypeOfItem;
	});
	
	$scope.OperatingAllowances =  _.filter(ListOfOptions.data, function(item){ return  item.TypeOfItem == "OperatingAllowance" });
	$scope.OperatingAllowances = _.sortBy($scope.OperatingAllowances, 'ValueOfItem');

	var tempArray = _.pluck(AllObligations.data, 'AllotmentType')
	$scope.AllotmentTypes = _.uniq(tempArray)
	
	var tempArray = _.pluck(AllObligations.data, 'Appropriation')
	$scope.Appropriations = _.uniq(tempArray)
	
	
	$scope.GoToDeobligation = function(ObligationID , LiquidatedAmount){
		$state.go('Deobligation',{ObligationID: ObligationID, LiquidatedAmount: LiquidatedAmount},{reload: true});
	}
	
	
	var unformattedDate = new Date( Date.now());
	$scope.TodaysDate = unformattedDate;
	
	$scope.YearEndReconciliation= {}
	$scope.YearEndReconciliation.FiscalYear = UtilityService.getTwoDigitFiscalYear($scope.TodaysDate)	
	
	var eachPaymentFY = _.pluck(AvailableFiscalYears.data, "FiscalYear")
	var uniqueFYarray = _.uniq(eachPaymentFY)
	uniqueFYarray = _.reject(uniqueFYarray, function(item){ return item == null });
	$scope.ListOfFiscalYears = uniqueFYarray
	$scope.ListOfFiscalYears = _.sortBy($scope.ListOfFiscalYears , function(year){ return Number(year) });

	
	if($state.params.FiscalYear != null)
	{
		$scope.YearEndReconciliation.FiscalYear = $state.params.FiscalYear
	}

	$scope.ChangeFiscalYear = function(NewFiscalYear){
		$state.go('YearEndReconciliation',{FiscalYear: NewFiscalYear},{reload: true});
	}

	
	
}])
