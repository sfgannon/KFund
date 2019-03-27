angular.module('AccountManagementController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit'])
.controller('AccountManagementController',['$q','$rootScope','$scope','$http','$state','toastr','Accounts','ConfigService','UtilityService',function($q,$rootScope,$scope,$http,$state,toastr,Accounts,ConfigService,UtilityService) {
	
	$scope.Accounts = Accounts.data
	$scope.Accounts = _.sortBy($scope.Accounts, 'FilterValue');
	$scope.isDisabled = false;
	if($scope.Accounts)
	{
		if($scope.Accounts.length > 0)
		{
			angular.forEach($scope.Accounts , function(account,index) {				
				account.NotesOnItem = JSON.parse(account.NotesOnItem);				
			})
		}
	}

	$scope.GoToEditAccount= function(AccountID){
		$state.go('AccountAddEdit',{ID: AccountID},{reload: true});
	}
	$scope.GoToEditSignatorie= function(SignatorieID){
		$state.go('SignatoryAddEdit',{ID: SignatorieID},{reload: true});
	}

	$scope.Delete = function(AccountID){
		$scope.isDisabled = true
		var retVal = $q.defer()
		var ListName = ConfigService.getLOVListName();
		UtilityService.getRequestDigest().then(function(response){
			UtilityService.deleteItem(AccountID, ListName).then(function(responseData) {
				retVal.resolve(responseData)
				toastr.success('Item Deleted', 'Account Deleted.');	
				$scope.Accounts = _.reject($scope.Accounts, function(object){ return object.Id == AccountID; })	
				$scope.isDisabled = false			
			}, function(err) {
				retVal.reject(err)
				toastr.error('Delete Error', 'Account failed to delete: ' + JSON.stringify(err));	
				$scope.isDisabled = false				
			})
		})
	}

		
}])
