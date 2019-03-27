angular.module('SignatoryAddEditController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit'])
.controller("ViewSignatoriesController", ["$scope","$q","$state","toastr","Signatories",'ConfigService','UtilityService', function($scope,$q,$state,toastr,Signatories,ConfigService,UtilityService) {

	$scope.Signatories = Signatories.data
	$scope.Signatories = _.sortBy($scope.Signatories , 'FilterValue');

	$scope.GoToEditSignatory= function(SignatoryID){
		$state.go('SignatoryAddEdit',{ID: SignatoryID},{reload: true});
	}


	$scope.Delete = function(SignatoryID){
		$scope.isDisabled = true
		var retVal = $q.defer()
		var ListName = ConfigService.getLOVListName();
		UtilityService.getRequestDigest().then(function(response){
			UtilityService.deleteItem(SignatoryID, ListName).then(function(responseData) {
				retVal.resolve(responseData)
				toastr.success('Item Deleted', 'Signatory Deleted.');	
				$scope.Signatories = _.reject($scope.Signatories, function(object){ return object.Id == SignatoryID; })	
				$scope.isDisabled = false			
			}, function(err) {
				retVal.reject(err)
				toastr.error('Delete Error', 'Signatory failed to delete: ' + JSON.stringify(err));	
				$scope.isDisabled = false				
			})
		})
	}

	
}])


.controller('SignatoryAddEditController',['$q','$rootScope','$scope','$http','$state','ConfigService','UtilityService','ListOfOptions','toastr','Signatory',function($q,$rootScope,$scope,$http,$state,ConfigService,UtilityService,ListOfOptions,toastr,Signatory) {
	
	$scope.Signatory = {}
	$scope.isDisabled = false;
	if($state.params.ID)
	{
		$scope.Header = "Edit"
		$scope.Signatory = Signatory.data
		
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
			 	var requestBody = {	
			 		ValueOfItem: $scope.Signatory.ValueOfItem,
			 		TypeOfItem: "Signatory" ,
			 		FilterValue: $scope.Signatory.FilterValue,
			 		NotesOnItem: $scope.Signatory.NotesOnItem
				};
																
		        var ListName = ConfigService.getLOVListName();      
				
				var RequestDigest = UtilityService.getRequestDigest();
				var __metaData = UtilityService.getListMetadataType(ListName); 	
				 	 
	 	
			 	$q.all([__metaData,RequestDigest]).then(function(response){
			 		
			 		UtilityService.createItem( requestBody, ListName).then(function(responseData) {				
						toastr.success('Item Saved', 'New Signatory Created.');	
						$state.go('ViewSignatories');							
					}, function(err) {
						$scope.isDisabled = false;
						toastr.error('Save Error', 'Signatory failed to save: ' + JSON.stringify(err));						
					})		 		
			 	})
		 	} 	
		 	
		 	if($scope.Header == "Edit")
		 	{		 		
			        var ListName = ConfigService.getLOVListName(); 				
					var RequestDigest = UtilityService.getRequestDigest();	
				 	var eTag = UtilityService.getItemEtag($state.params.ID , ListName);		
				 	$q.all([eTag,RequestDigest]).then(function(response){
	
					 	var requestBody = {
					 		__metadata: response[0] ,	
					 		Id: $scope.Signatory.ID ,
					 		ValueOfItem: $scope.Signatory.ValueOfItem,
					 		TypeOfItem: "Signatory" ,
					 		FilterValue: $scope.Signatory.FilterValue,
					 		NotesOnItem: $scope.Signatory.NotesOnItem
						};	

	
				 		UtilityService.updateItem(requestBody, ListName).then(function(responseData) {
							toastr.success('Item Updated', 'Signatory Updated.');	
							$state.go('ViewSignatories');										
						}, function(err) {
							$scope.isDisabled = false;
							toastr.error('Save Error', 'Signatory failed to save: ' + JSON.stringify(err));					
						})		 		
				 	})				 	
 
			}	 	
		}
	
					
	}//end of submit

	
		
}])
