angular.module('ChoseLOVController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit'])
.controller('ChoseLOVController',['$q','$rootScope','$scope','$http','$state','ConfigService','UtilityService','toastr','ValidationService','ListOfOptions',function($q,$rootScope,$scope,$http,$state,ConfigService,UtilityService,toastr,ValidationService,ListOfOptions) {

	var tempArray =  _.pluck(ListOfOptions.data, 'TypeOfItem' )
	tempArray = _.uniq(tempArray)
	tempArray = _.without(tempArray, "PaymentType")//removed PaymentType as a possible option
	tempArray = _.without(tempArray, "Signatory")//removed Signatory as a possible option
	tempArray = _.without(tempArray, "Account")//removed Account as a possible option
	$scope.ListOfOptions = tempArray.sort()
	
	$scope.ShowResults=false
	
	$scope.ActivePagenumber = 0//initial page number should be the first one(i.e. index 0)
	$scope.NumberOfPages = 0
	
    $scope.pageChange = function(pageNumber){
	   	for (i = 0; i < $scope.NumberOfPages.length; i++) {
			if($scope.NumberOfPages[i].Active != null){$scope.NumberOfPages[i].Active = null}
	    }
	   	for (i = 0; i < $scope.NumberOfPages.length; i++) {
			if($scope.NumberOfPages[i].PageNumber == pageNumber){
				$scope.NumberOfPages[i].Active = "active"; 
				$scope.ActivePagenumber = $scope.NumberOfPages[i].PageNumber -1;
			}
	    }
    }  

	
	$scope.SearchLOVs = function(TypeOfLOV){	
		var filter = "?$filter=TypeOfItem eq '"+TypeOfLOV+"'";
        var ListName = ConfigService.getLOVListName();
		var results = $q.defer();		
		results.promise = UtilityService.getItems(filter , ListName).then(function(responseData) {
			results.resolve(responseData)
			$scope.ShowResults = true
			$scope.SearchResult = responseData.data
			
			$scope.SearchResult = _.sortBy($scope.SearchResult, 'ValueOfItem');
			$scope.ActivePagenumber = 0
			$scope.NumberOfPages = Math.ceil($scope.SearchResult.length/20)	
			$scope.NumberOfPages = PagesObjectsCreator($scope.NumberOfPages)	
			
			$scope.LovArray = PageBodyBuilder($scope.SearchResult)
			//pass array to page maker
		}, function(err) {
			$scope.NumberOfPages = 0
			results.reject(err);
		});
		
		function PagesObjectsCreator(NumberOfPages){
			var temp = []
		    for (i = 1; i < NumberOfPages+1; i++) {
		    	var pageObj = {
		    		PageNumber: i,
		    		Active: null
		    	}
		    	if(i==1){pageObj.Active = "active"}
				temp.push(pageObj)
		    }
		    return temp
		}
		
		function PageBodyBuilder(evacsArray) {
		
			var arrays = [], size = 20;
			while (evacsArray.length > 0)
			    arrays.push(evacsArray.splice(0, size));
			
			var displayObjectsArray = []
			for (i = 0; i < arrays.length; i++) {
				var object = {}
				object.index = i
				object.array = arrays[i]
				displayObjectsArray.push(object)
		    }
		
			return displayObjectsArray ;
		}

		

		switch (TypeOfLOV)
		{
			case 'Account':
		        $scope.SearchResultsTableHeader = 'Acount Number'
		        break;
			case 'Agency':
				$scope.SearchResultsTableHeader = 'Agency'
		        break;
			case 'AllotmentAuthority':
				$scope.SearchResultsTableHeader = 'Allotment Authority'
		        break;
			case 'AllotmentAgency':
				$scope.SearchResultsTableHeader = 'Allotment Agency'
		        break;
			case 'AllotmentType':
				$scope.SearchResultsTableHeader = 'Type'
		        break;

			case 'Allotment':
				$scope.SearchResultsTableHeader = 'Allotment'
		        break;

			case 'Appropriation':
				$scope.SearchResultsTableHeader = 'Appropriation Number'
		        break;
			case 'AdhocBureau':
				$scope.SearchResultsTableHeader = 'Bureau'
		        break;
			case 'Bureau':
				$scope.SearchResultsTableHeader = 'Bureau'
		        break;
			case 'Country':
				$scope.SearchResultsTableHeader = 'Country'
		        break;
			case 'DepositType':
				$scope.SearchResultsTableHeader = 'Deposit Type'
		        break;
			case 'EvacuationReason':
				$scope.SearchResultsTableHeader = 'Evacuation Reason'
		        break;
			case 'EvacuationType':
				$scope.SearchResultsTableHeader = 'Evacuation Type'
		        break;
			case 'Evacuee':
				$scope.SearchResultsTableHeader = 'Evacuee'
		        break;

			case 'Fund':
				$scope.SearchResultsTableHeader = 'Fund'
		        break;
			case 'FundingType':
				$scope.SearchResultsTableHeader = 'Funding Type'
		        break;
			case 'NY':
				$scope.SearchResultsTableHeader = 'New Year'
		        break;
			case 'OperatingAllowance':
				$scope.SearchResultsTableHeader = 'Operating Allowance Number'
		        break;
			case 'OperatingAllowanceSubCategory':
				$scope.SearchResultsTableHeader = 'Operating Allowance Sub-Category'
		        break;
			case 'Payee':
				$scope.SearchResultsTableHeader = 'Payee Name'
		        break;
			case 'PaymentReturnReason':
				$scope.SearchResultsTableHeader = 'Payment Return Reason'
		        break;
			case 'PaymentReturnType':
				$scope.SearchResultsTableHeader = 'Payment Return Type'
		        break;
			case 'PersonnelType':
				$scope.SearchResultsTableHeader = 'Personnel Type'
		        break;
			case 'Allotment':
				$scope.SearchResultsTableHeader = 'Allotment'
		        break;
			case 'Post':
				$scope.SearchResultsTableHeader = 'Post Location'
		        break;
			case 'PostCode':
				$scope.SearchResultsTableHeader = 'Post Code Number'
		        break;
			case 'Program':
				$scope.SearchResultsTableHeader = 'Program Name'
		        break;
			case 'RppCode':
				$scope.SearchResultsTableHeader = 'Rewards Program'
		        break;
			case 'RewardsProgram':
				$scope.SearchResultsTableHeader = 'Rewards Program'
		        break;
			case 'RepresentationType':
				$scope.SearchResultsTableHeader = 'Representation Type'
		        break;
			case 'Status':
				$scope.SearchResultsTableHeader = 'Status'
		        break;
			case 'ReimbursementStatus':
				$scope.SearchResultsTableHeader = 'Reimbursement Status'
		        break;
			case 'Signatory':
				$scope.SearchResultsTableHeader = 'Signatory Name'
		        break;
		}		
	}
	
	$scope.Add = function(){
		$state.go('AddEditLOV', {LovType: $scope.LOV.Type, AddEdit: 'Add'});
	}
	
	$scope.Edit  = function(LovObj){
		$state.go('AddEditLOV', {LovObj: LovObj , LovType: $scope.LOV.Type, AddEdit: 'Edit'});
	}

	$scope.GoToEditAccount= function(AccountID){
		$state.go('AccountAddEdit',{ID: AccountID},{reload: true});
	}


	$scope.Delete = function(LovObj){
		
		var retVal = $q.defer()
		var ListName = ConfigService.getLOVListName();
		UtilityService.getRequestDigest().then(function(response){
			UtilityService.deleteItem(LovObj.ID , ListName).then(function(responseData) {
				retVal.resolve(responseData)
				toastr.success('Item Deleted', 'LOV Deleted.');
				$scope.SearchLOVs($scope.LOV.Type)						
			}, function(err) {
				retVal.reject(err)
				toastr.error('Delete Error', 'LOV failed to delete: ' + JSON.stringify(err));					
			})
		})	
	
	
	}

	
	$scope.GoHome = function() {
		$state.go('home');
	}
	
	
}])
