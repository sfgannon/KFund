angular.module('AccountAddEditController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','ui.People'])
.controller('AccountAddEditController',['$q','$rootScope','$scope','$http','$state','ConfigService','UtilityService','ListOfOptions','toastr','Account',function($q,$rootScope,$scope,$http,$state,ConfigService,UtilityService,ListOfOptions,toastr,Account) {
	
	$scope.Account = {}
	$scope.isDisabled = false;
	if($state.params.ID)
	{
		$scope.Header = "Edit"
		$scope.Account = Account.data
		$scope.Account.NotesOnItem = JSON.parse($scope.Account.NotesOnItem);
	}else{
		$scope.Header = "Add"
	}

	$scope.ListOfOptions =  _.groupBy(ListOfOptions.data, function(item){
	   return item.TypeOfItem;
	});

	$scope.Submit = function(){
		if($scope.isDisabled == false)
		{
			$scope.isDisabled = true;
			if($scope.Header == "Add")		
			{	
				// var tempArray = []
				// angular.forEach($scope.Account.POC.results , function(result,index) { 
				// 	tempArray.push(result.Id)
				// })
					
				// var POCId = {results: tempArray  }
				
			 	var requestBody = {	
			 		ValueOfItem: $scope.Account.ValueOfItem,
			 		TypeOfItem: "Account" ,
			 		FilterValue: $scope.Account.FilterValue
					//  ,
			 		// POCId: POCId
				};
				var stringifiedArrayOfSignatories = JSON.stringify($scope.Account.NotesOnItem)
				requestBody.NotesOnItem = stringifiedArrayOfSignatories 
				
												
				
		        var ListName = ConfigService.getLOVListName();       
				
				var RequestDigest = UtilityService.getRequestDigest();
				var __metaData = UtilityService.getListMetadataType(ListName); 	
				 	 
	 	
			 	$q.all([__metaData,RequestDigest]).then(function(response){
			 		
			 		UtilityService.createItem(requestBody, ListName).then(function(responseData) {				
						toastr.success('Item Saved', 'New Account Created.');	
						$state.go('AccountManagement');							
					}, function(err) {
						$scope.isDisabled = false;
						toastr.error('Save Error', 'Account failed to save: ' + JSON.stringify(err));						
					})		 		
			 	})
		 	}
		 		 	
		 	if($scope.Header == "Edit")
		 	{			
		        var ListName = ConfigService.getLOVListName();			
				var RequestDigest = UtilityService.getRequestDigest();
			 	var eTag = UtilityService.getItemEtag($scope.Account.ID , ListName);		 		
		 		
		 		
			 	$q.all([eTag,RequestDigest]).then(function(response){
			 	
					var tempArray = []
					angular.forEach($scope.Account.POC.results , function(result,index) { 
						tempArray.push(result.Id)
					})
						
					var POCId = {results: tempArray  }
	
	
				 	var requestBody = {
				 		__metadata: response[0] ,	
				 		Id: $scope.Account.ID  ,
				 		ValueOfItem: $scope.Account.ValueOfItem,
				 		TypeOfItem: "Account" ,
				 		FilterValue: $scope.Account.FilterValue,
				 		POCId: POCId 
					};
					var stringifiedArrayOfSignatories = JSON.stringify($scope.Account.NotesOnItem)
					requestBody.NotesOnItem = stringifiedArrayOfSignatories 
	
	
		
			 		UtilityService.updateItem( requestBody,  ListName).then(function(responseData) {
						toastr.success('Account Updated', 'Account Updated.');	
						$state.go('AccountManagement');										
					}, function(err) {
						$scope.isDisabled = false;
						toastr.error('Save Error', 'Account failed to save: ' + JSON.stringify(err));					
					})		 		
			 	})	 		
			}	 	
		
		}
					
	}//end of submit
	
	$scope.reloadPage = function(){
		//after thinking about it we cannot reload page on change of the POC.
		//to to this we'd need to save the account after every POC change. but what about the other information?
		//what happens if the user has not entered all the field before hand. such as the account # the bureau or signatory
	}
	
	
var divs = document.querySelectorAll("[id]");
for (var i = 0, len = divs.length; i < len; i++) {
    var div = divs[i];
    if (div.id.indexOf("peoplePicker_peoplepickerPOC_TopSpan_i") > -1) {
        console.log(div)
    }
}

		
}])

