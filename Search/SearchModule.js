angular.module("SearchModule",["ui.router","BusinessObjectsModule","ConfigModule","UtilityModule","LOVModule",'ngAnimate','angular-notification-icons','toastr','angular-spinkit'])
.controller("SearchController",['$scope','$state','$stateParams','$q','UtilityService','ConfigService','Appropriations','Allotments','OperatingAllowances','FiscalYears','Bureaus','AdhocBureaus',function($scope,$state,$stateParams,$q,UtilityService,ConfigService,Appropriations,Allotments,OperatingAllowances,FiscalYears,Bureaus,AdhocBureaus) {
    $scope.Allotments = Allotments;
    $scope.Appropriations = Appropriations;
    $scope.FiscalYears = FiscalYears;
    $scope.Bureaus = Bureaus;
    $scope.AdhocBureaus = AdhocBureaus;
    $scope.OperatingAllowances = OperatingAllowances;
    $scope.Allotment = "";
    $scope.Appropriation = "";
    $scope.FiscalYear = "";
    $scope.OperatingAllowance = "";
    $scope.Bureau = '';
    $scope.AdhocBureau = '';
    $scope.Searching = false;
    $scope.SearchResults = [];
    $scope.ActivePageNumber = 0;
    $scope.NumberOfPages = 0;	
    $scope.LovArray = [];

    $scope.GoToItem = function(id, itemType) {
        switch (itemType) {
            case "Allotment":
                $state.go('ViewAllotment', {id: id });
                break;
            case "Obligation":
                $state.go('ViewObligation', {id: id });
                break;
            case "Payment":
                $state.go('ViewPayment', {id: id });
                break;
            case "Adjustment":
                $state.go('ViewAdjustment', {id: id });
                break;
            case "Deposit":
                $state.go('ViewDeposit', {id: id });
                break;
            case "PaymentReturn":
                $state.go('ViewPaymentReturn', {id: id });
                break;
            case "Evacuation":
                $state.go('ViewEvacuation', {id: id });
                break;
            default:
                break;
        }
    }

    $scope.Search = function() {
        $scope.Searching = true;
        var query = "";
        if (!IsNullOrUndefined($scope.Purpose) && !!$scope.Purpose) {
            query += "?$filter=substringof('" + $scope.Purpose + "',Purpose)";
        }
        if (!IsNullOrUndefined($scope.Appropriation) && !!$scope.Appropriation) {
            if (query.length > 0) { 
                query += " and Appropriation eq '" + $scope.Appropriation + "'";
            } else {
                query = "?$filter=Appropriation eq '" + $scope.Appropriation + "'";
            }
        }
        if (!IsNullOrUndefined($scope.Allotment) && !!$scope.Allotment) {
            if (query.length > 0) { 
                query += " and Allotment eq '" + $scope.Allotment + "'";
            } else {
                query = "?$filter=Allotment eq '" + $scope.Allotment + "'";
            }
        }
        if (!IsNullOrUndefined($scope.OperatingAllowance) && !!$scope.OperatingAllowance) {
            if (query.length > 0) { 
                query += " and OperatingAllowance eq '" + $scope.OperatingAllowance + "'";
            } else {
                query = "?$filter=OperatingAllowance eq '" + $scope.OperatingAllowance + "'";
            }
        }
        if (!IsNullOrUndefined($scope.Bureau) && !!$scope.Bureau) {
            if (query.length > 0) { 
                query += " and Bureau eq '" + $scope.Bureau + "'";
            } else {
                query = "?$filter=Bureau eq '" + $scope.Bureau + "'";
            }
        }
        if (!IsNullOrUndefined($scope.AdhocBureau) && !!$scope.AdhocBureau) {
            if (query.length > 0) { 
                query += " and Bureau eq '" + $scope.AdhocBureau + "'";
            } else {
                query = "?$filter=Bureau eq '" + $scope.AdhocBureau + "'";
            }
        }
        if (!IsNullOrUndefined($scope.FiscalYear) && !!$scope.FiscalYear) {
            if (query.length > 0) { 
                query += " and FiscalYear eq " + $scope.FiscalYear;
            } else {
                query = "?$filter=FiscalYear eq " + $scope.FiscalYear;
            }
        }
        var retVal = $q.defer();
        retVal.promise = UtilityService.getItems(query,ConfigService.getTransactionListName()).then(function(res) {
            var out = [];
            for (i=0,r=res.data.length;i<r;i++) {
                var row = {};
                row.Id = res.data[i].Id;
                var dt = new Date(res.data[i].Date);
                row.Date = (dt.getMonth() + 1).toString() + "/" + dt.getDate().toString() + "/" + dt.getFullYear().toString();
                row.Purpose = res.data[i].Purpose;
                row.Amount = res.data[i].Amount;
                row.ItemType = res.data[i].ItemType;
                out.push(row);
            }
            $scope.SearchResults = out;
            $scope.Searching = false;
			$scope.SearchResults = _.sortBy($scope.SearchResults, 'Date');
			$scope.ActivePageNumber = 0;
			$scope.NumberOfPages = Math.ceil($scope.SearchResults.length/20)	
			$scope.NumberOfPages = PagesObjectsCreator($scope.NumberOfPages)	
			$scope.LovArray = PageBodyBuilder($scope.SearchResults)
        }, function(e) {
            retVal.reject(e);
            $scope.NumberOfPages = 0;
            $scope.Searching = false;
            toastr.error("Error searching","Error");
        })
    }
	$scope.ActivePageNumber = 0//initial page number should be the first one(i.e. index 0)
	$scope.NumberOfPages = 0
	
    $scope.pageChange = function(pageNumber){
	   	for (i = 0; i < $scope.NumberOfPages.length; i++) {
			if($scope.NumberOfPages[i].Active != null){$scope.NumberOfPages[i].Active = null}
	    }
	   	for (i = 0; i < $scope.NumberOfPages.length; i++) {
			if($scope.NumberOfPages[i].PageNumber == pageNumber){
				$scope.NumberOfPages[i].Active = "active"; 
				$scope.ActivePageNumber = $scope.NumberOfPages[i].PageNumber -1;
			}
	    }
    }
		
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
}])
