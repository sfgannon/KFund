angular.module('DeleteController',['ngResource','ui.router','LocalStorageModule','ngAnimate','angular-notification-icons','toastr','angular-spinkit','DeleteModule'])
.controller('DeleteController',['$q','$rootScope','$scope','$http','$state','toastr','UtilityService','ConfigService','BusinessObjectsFactory','GetItem','ReferenceItems','DeleteModule','SOFTable','Reimbursements',function($q,$rootScope,$scope,$http,$state,toastr,UtilityService,ConfigService,BusinessObjectsFactory,GetItem,ReferenceItems,DeleteModule,SOFTable,Reimbursements) {

	$scope.Item = GetItem.data
	$scope.ReferenceItems = ReferenceItems
	
	if($scope.Item.ItemType == "Allotment")
	{
		$scope.SOFTable = SOFTable
		$scope.Reimbursements = Reimbursements
	}
	$scope.DeleteItem = function(id){
	
		switch($scope.Item.ItemType) {
			case "Allotment":
		        //need to delete all child elemnts first
		        var retVal = $q.defer() 
		        	var allotment = BusinessObjectsFactory.Allotment($scope.Item.Id).then(function(responseData) {
						retVal.resolve(responseData);						
						
						angular.forEach(SOFTable.Objects, function(SOF , index) {
							deleteObject(SOF.Id)
						})	
						angular.forEach(Reimbursements, function(Reimbursement , index) {
							deleteObject(Reimbursement.Id)
						})					
					

					}, function (error) {
					    retVal.reject(error);
						console.log(error);
					})	
		        deleteObject(id)
		        break;
		    case "Obligation":
		        //need to remove from payments then delete
		        angular.forEach($scope.ReferenceItems , function(payment , index) {
		        	var retVal = $q.defer() 
		        	var newPayment = BusinessObjectsFactory.Payment(payment.Id).then(function(responseData) {
						retVal.resolve(responseData);						
						DeleteModule.RemoveObligationReferences(responseData , $scope.Item.ObligationNumber )
					}, function (error) {
					    retVal.reject(error);
						console.log(error);
					})		        	
		        })
		        deleteObject(id)
		        break;
			case "Payment":
		        //need to remove from payments returns then delete
		        
		        angular.forEach($scope.ReferenceItems , function(paymentReturn , index) {
		        	var retVal = $q.defer() 
		        	var newPayment = BusinessObjectsFactory.PaymentReturn(paymentReturn.Id).then(function(responseData) {
						retVal.resolve(responseData);						
						DeleteModule.RemovePaymentReturnReferences(responseData , $scope.Item.Id)
					}, function (error) {
					    retVal.reject(error);
						console.log(error);
					})		        	
		        })	        
		        deleteObject(id)
		        break;
			case "RPP":
				//need to remove from payments then delete
		        angular.forEach($scope.ReferenceItems , function(payment , index) {
		        	var retVal = $q.defer() 
		        	var newPayment = BusinessObjectsFactory.Payment(payment.Id).then(function(responseData) {
						retVal.resolve(responseData);						
						DeleteModule.RemoveRppReferences(responseData , $scope.Item.RPP )
					}, function (error) {
					    retVal.reject(error);
						console.log(error);
					})		        	
		        })
		        deleteObject(id)
		        break;

		    default:
				//if no need to remove remove refences just delete
				deleteObject(id)		
		}
				
	}	
	
	function deleteObject(id){
		var ListName = ConfigService.getTransactionListName();
		var deleteObject = $q.defer();		
		deleteObject.promise = UtilityService.deleteItem(id,ListName).then(function(responseData) {
			deleteObject.resolve(Object)
			toastr.success('Item Successfully Deleted', $scope.Item.ItemType + ' Deleted.');
			$state.go('home');										
		}, function(err) {
			deleteObject.reject(err);
		});
		return deleteObject.promise;
	}		

}])