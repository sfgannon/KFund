angular.module('DeobligationController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule'])
.controller('DeobligationController',['$q','$rootScope','$scope','$http','$state','ConfigService','UtilityService','ValidationService','toastr','$filter','Obligation','BusinessObjectsFactory',function($q,$rootScope,$scope,$http,$state,ConfigService,UtilityService,ValidationService,toastr,$filter,Obligation,BusinessObjectsFactory) {
	
	$scope.Obligation = Obligation.data
	$scope.Obligation.Date = new Date($scope.Obligation.Date).toLocaleDateString();
	$scope.isDisabled = false;
	var GlobalObligation = new BusinessObjectsFactory.Obligation();
	GlobalObligation.ParseResponse($scope.Obligation);
	
	$scope.Deobligation = {}
	$scope.Deobligation.RestrictedFunds = 0.00;
	$scope.Deobligation.NewAmount = 0.00;
	
	$scope.LiquidatedAmount = $state.params.LiquidatedAmount
	$scope.Deobligation.LiquidatedAmount = $scope.LiquidatedAmount 
	
	
	$scope.ChangeToCurrencyFormat = function(){
	    
	    var newAmount = Number($scope.Deobligation.NewAmount)
	    var liquidAmount = Number($scope.LiquidatedAmount)
	};
	

	$scope.GoHome = function() {
		$state.go('home');
	}	
	
	
	// Below is horrible code practice, needs to be reritten into the business object module
	
	$scope.Submit = function(){
		if($scope.isDisabled == false)
		{
			$scope.isDisabled = true;
			var messages = ValidationService.validateDeobligation($scope.Deobligation);
			if (messages.length == 0) {
				var newDate = new Date()
				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)			
		
				if($scope.Obligation.FiscalYear != FiscalYear )
				{
					var amount = $scope.Obligation.Amount - $scope.Deobligation.NewAmount			
					var ListName = ConfigService.getTransactionListName(); 
					var requestBody = {
					 	FiscalYear : FiscalYear  ,
				 		ItemType: "PriorYearReturn",
				 		Amount: amount ,
				 		Purpose: "Prior Year Recovery. Obligation " + $scope.Obligation.ObligationNumber,
				 		OperatingAllowance: $scope.Obligation.OperatingAllowance,
				 		Appropriation: $scope.Obligation.Appropriation,
				 		RestrictedFunds: $scope.Deobligation.RestrictedFunds,
				 		Date: newDate,
				 		RewardsPublicity: GlobalObligation.RewardsPublicity,
				 		Allotment: GlobalObligation.Allotment 
					};
					UtilityService.createItem( requestBody, ListName).then(function(responseData) {										
						toastr.success('Item Saved', 'Prior Year Return Saved.');									
					}, function(err) {
						$scope.isDisabled = false;
						toastr.error('Save Error', 'Prior Year Return failed to save: ' + JSON.stringify(err));						
					})				
				}
				
		
		        var ListName = ConfigService.getTransactionListName(); 	
				var RequestDigest = UtilityService.getRequestDigest(); 	
			 	var eTag = UtilityService.getItemEtag($scope.Obligation.ID , ListName);		 			 				 	
			 	
			 	$q.all([eTag,RequestDigest]).then(function(response){	 	
				 	var requestBody = {
					 	__metadata: response[0] ,
					 	Id: $scope.Obligation.ID ,
				 		Amount: $scope.Deobligation.NewAmount,	
					};	 		
			 		UtilityService.updateItem( requestBody, ListName).then(function(responseData) {										
						toastr.success('Item Saved', 'Deobligation Saved.');
						$state.go('YearEndReconciliation');											
					}, function(err) {
						$scope.isDisabled = false;
						toastr.error('Save Error', 'Deobligation failed to save: ' + JSON.stringify(err));						
					})		 		
			 	})
			 }else {
				var out = "";
				angular.forEach(messages, function(value, index) {
					out += '- ' + value + "<br>";
				});
				toastr.error(out, 'Invalid Input', { allowHtml: true });
				$scope.isDisabled = false;
			}//end of else
		}//end of if	 	
	}//end of the submit
	
	
}])



