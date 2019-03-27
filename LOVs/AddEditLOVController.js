angular.module('AddEditLOVController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit'])
.controller('AddEditLOVController',['$q','$rootScope','$scope','$http','$state','LOVObject','ConfigService','UtilityService','toastr','ValidationService',function($q,$rootScope,$scope,$http,$state,LOVObject,ConfigService,UtilityService,toastr,ValidationService) {

	$scope.lovObject = LOVObject
	$scope.isDisabled = false;
	
	
	
	$scope.Submit = function(){
		if($scope.isDisabled == false)
		{
			$scope.isDisabled = true;
			var messages = ValidationService.validateLOV($scope.lovObject, $scope.lovObject.ValueOfItemLabel , $scope.lovObject.NotesOnItemLabel);
			if (messages.length == 0)
			{	
				if($scope.lovObject.AddEdit == "Add")		
				{	
				 	var requestBody = {	
				 		ValueOfItem: $scope.lovObject.ValueOfItem,
				 		TypeOfItem: $scope.lovObject.TypeOfItem ,
				 		NotesOnItem: $scope.lovObject.NotesOnItem
					};
					
					if($scope.lovObject.BudgetObjectCOde != null)
					{
						requestBody.BudgetObjectCOde = $scope.lovObject.BudgetObjectCOde
					}
					if($scope.lovObject.FilterNeed)
					{
						requestBody.FilterValue = $scope.lovObject.FilterValue 
					}					
					
			        var ListName = ConfigService.getLOVListName();       
					
					var RequestDigest = UtilityService.getRequestDigest();
					var __metaData = UtilityService.getListMetadataType(ListName); 	
					 	 
		 	
				 	$q.all([__metaData,RequestDigest]).then(function(response){
				 		
				 		UtilityService.createItem( requestBody, ListName).then(function(responseData) {				
							toastr.success('Item Saved', 'New LOV Created.');	
							$state.go('LOV');							
						}, function(err) {
							$scope.isDisabled = false;
							toastr.error('Save Error', 'LOV failed to save: ' + JSON.stringify(err));						
						})		 		
				 	})
			 	}
			 	if($scope.lovObject.AddEdit == "Edit")
			 	{		 		
			        var ListName = ConfigService.getLOVListName();       
					
					var RequestDigest = UtilityService.getRequestDigest();
		
				 	var eTag = UtilityService.getItemEtag($scope.lovObject.ID , ListName);		 		
			 		
			 		
				 	$q.all([eTag,RequestDigest]).then(function(response){
	
					 	var requestBody = {
					 		__metadata: response[0] ,	
					 		Id: $scope.lovObject.ID  ,
					 		ValueOfItem: $scope.lovObject.ValueOfItem,
					 		TypeOfItem: $scope.lovObject.TypeOfItem ,
					 		NotesOnItem: $scope.lovObject.NotesOnItem
						};	
						if($scope.lovObject.BudgetObjectCOde != null)
						{
							requestBody.BudgetObjectCOde = $scope.lovObject.BudgetObjectCOde
						}
						if($scope.lovObject.FilterNeed)
						{
							requestBody.FilterValue = $scope.lovObject.FilterValue 
						}		
				 		UtilityService.updateItem(requestBody, ListName).then(function(responseData) {
							toastr.success('Item Updated', 'LOV Updated.');	
							$state.go('LOV');										
						}, function(err) {
							$scope.isDisabled = false;
							toastr.error('Save Error', 'LOV failed to save: ' + JSON.stringify(err));					
						})		 		
				 	})	 		
				}	 	
			}
			else 
			{
				var out = "";
				angular.forEach(messages, function(value, index) {
					out += '- ' + value + "<br>";
				});
				toastr.error(out, 'Invalid Input', { allowHtml: true });
				$scope.isDisabled = false;
			}	
		}			
	}//end of submit

	
	
	
	
	$scope.GoHome = function() {
		$state.go('home');
	}
	
	
}])
