angular.module('ViewPaymentReturnController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule'])
.controller("ViewPaymentReturnController", ["$q","$state","$scope","toastr","PaymentReturn","PaymentReturnSources","Attachments","BusinessObjectsFactory", function($q,$state,$scope,toastr,PaymentReturn,PaymentReturnSources,Attachments,BusinessObjectsFactory) {
    $scope.PaymentReturn = angular.copy(PaymentReturn);
    $scope.PaymentReturnSources = PaymentReturnSources;
    $scope.EditPaymentReturn = function() {
        $state.go('EditPaymentReturn', { id: $scope.PaymentReturn.Id });
    }
    $scope.managePayments = function() {
        $state.go('ManagePaymentReturnSources', { id: $scope.PaymentReturn.Id });
    }
    $scope.Attachments = Attachments;
    $scope.Attaching = false;
    $scope.uploadFile = function(){
            $scope.attaching = true;
            var file = $scope.myFile;
            var fileData = $scope.fileData;
            $scope.PaymentReturn.AddAttachment(fileData,file.name).then(function(responseData) {
                $scope.myFile = null;
                $scope.fileData = null;
                $('#inpFile').val('');
                $scope.PaymentReturn.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                $scope.PaymentReturn.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                $scope.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                toastr.success('Upload Succesful.', 'File attached.');
                $scope.attaching = false;
            }, function(error) {
                toastr.error('File upload failed: ' + JSON.stringify(error.data.error.message.value), 'Upload Failed');
                $scope.attaching = false;
            });
        };
    $scope.removeAttachment = function(fileName) {
        $scope.PaymentReturn.RemoveAttachment(fileName).then(function(responseData) {
            angular.forEach($scope.Attachments, function(value, index) {
                if (value.FileName == fileName) {
                    $scope.Attachments.splice(index, 1);
                    $scope.PaymentReturn.Attachments.splice(index, 1);
                }
            });
            toastr.success('Attachment Deleted');
        }, function(error) {
            toastr.error('Attachment Removal Failed');
        })
    }
}])
.controller('EditPaymentReturnController',['$scope','$state','toastr','LOVs','PaymentReturn',function($scope,$state,toastr,LOVs,PaymentReturn) {
    $scope.PaymentReturnTypes = LOVs.PaymentReturnTypes;
    $scope.PaymentReturnReasons = LOVs.PaymentReturnReasons;
    $scope.Appropriations = LOVs.Appropriations;
    $scope.Allotments = LOVs.Allotments;
    $scope.OperatingAllowances = LOVs.OperatingAllowances;
    $scope.PostCodes = LOVs.PostCodes;
    $scope.Bureaus = LOVs.Bureaus;
    $scope.AdhocBureaus = LOVs.AdhocBureaus ;
    $scope.RepresentationTypes = LOVs.RepresentationTypes

    $scope.PaymentReturn = angular.copy(PaymentReturn);
    $scope.isDisabled = false;
    $scope.AllotmentChange = function() {
    
    	if($scope.PaymentReturn.Allotment == '2003')
    	{
    		$scope.PaymentReturn.OperatingAllowance = "2003";
    	}else{
    		$scope.PaymentReturn.OperatingAllowance = "";
    	}
    }
    $scope.RepresentationTypeChange = function() {
        if ($scope.PaymentReturn.RepresentationType == 'Functions Paid by MEDCS') {
            $scope.PaymentReturn.Bureau = "";
        };
    }
    $scope.savePaymentReturn = function() {
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	        $scope.PaymentReturn.SavePaymentReturn().then(function(PaymentReturn) {
	        	$scope.isDisabled = false;
	            $state.go('ViewPaymentReturn',{ id: PaymentReturn.Id });
	            toastr.success("Success","Payment return saved.");
	        }, function(err) {
	        	$scope.isDisabled = false;
	            $state.reload();
	            toastr.error("Error","Error saving payment return.");
	        })
        }
    };
    $scope.cancel = function() {
        if ($state.params.id) {
            $state.go("ViewPaymentReturn", { id: $state.params.id });
        } else {
            $state.go('home');
        }
    }
}])
.controller("ManagePaymentReturnSourcesController", ["$scope","$state","toastr","PaymentReturn","PaymentReturnSources", function($scope,$state,toastr,PaymentReturn,PaymentReturnSources) {
    $scope.PaymentReturn = angular.copy(PaymentReturn);
    $scope.PaymentReturnSources = PaymentReturnSources;
    $scope.SearchResults = [];
    $scope.SearchText = "";
    $scope.isDisabled = false;
    $scope.cancel = function() {
		if($scope.isDisabled == false)
		{
		    $scope.isDisabled = true;
	        $scope.PaymentReturn.SavePaymentReturn().then(function(res) {
				$scope.isDisabled = false;
	            toastr.success("Payment return updated.", "Success");
	            $state.go('ViewPaymentReturn', { id: $scope.PaymentReturn.Id });
	        }, function(err) {
	        	$scope.isDisabled = false;
	            toastr.error("Error saving payment return.", "Error");
	            $state.go('ViewPaymentReturn', { id: $scope.PaymentReturn.Id });
	        });
        }
    }
    $scope.Search = function() {
        $scope.PaymentReturn.FindPaymentReturnSources($scope.SearchText).then(function(res) {
            $scope.SearchResults = res;
            if (res.length > 0) {
                toastr.success("Search results updated.","Success");
            } else {
                toastr.error("No results match search criteria.", "No Results");
            }
        }, function(err) {
            toastr.error("Error searching reimbursements.", "Error");
        });
    }
    $scope.LinkPaymentReturnSource = function(index) {
        var payment = $scope.SearchResults[index];
        if ($scope.PaymentReturn.CheckPaymentReturnSource(payment)) {
            var result = $scope.SearchResults.splice(index,1);
            $scope.PaymentReturn.PaymentReturnSources.push(result[0].Id);
            $scope.PaymentReturnSources.push(result[0]);
        }
    }
    $scope.removePaymentReturnSource = function(index) {
        $scope.PaymentReturn.PaymentReturnSources.splice(index,1);
        var removed = $scope.PaymentReturnSources.splice(index,1)[0];
        if ((removed.Purpose && removed.Purpose.indexOf($scope.SearchText) > -1) ||
            (removed.Payee && removed.Payee.indexOf($scope.SearchText) > -1) ||
            (removed.OperatingAllowance && removed.OperatingAllowance.indexOf($scope.SearchText) > -1)) {
            $scope.SearchResults.push(removed);
        }
    };
}])