angular.module("ViewObligationController", ['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule'])
.controller('ViewObligationController',['$q','$scope','$state','toastr','Obligation','Reimbursements','Payments','Attachments','BusinessObjectsFactory', function($q,$scope,$state,toastr,Obligation,Reimbursements,Payments,Attachments,BusinessObjectsFactory) {
        $scope.Obligation = Obligation;
        $scope.Payments = Payments;
        $scope.Reimbursements = Reimbursements;
        $scope.Attachments = Attachments;
        $scope.Attaching = false;
        $scope.uploadFile = function(){
            $scope.attaching = true;
            var file = $scope.myFile;
            var fileData = $scope.fileData;
            $scope.Obligation.AddAttachment(fileData,file.name).then(function(responseData) {
                $scope.myFile = null;
                $scope.fileData = null;
                $('#inpFile').val('');
                $scope.Obligation.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                $scope.Obligation.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                $scope.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                toastr.success('Upload Succesful.', 'File attached.');
                $scope.attaching = false;
            }, function(error) {
                toastr.error('File upload failed: ' + JSON.stringify(error.data.error.message.value), 'Upload Failed');
                $scope.attaching = false;
            });
        };
        $scope.removeAttachment = function(fileName) {
            $scope.Obligation.RemoveAttachment(fileName).then(function(responseData) {
                angular.forEach($scope.Attachments, function(value, index) {
                    if (value.FileName == fileName) {
                        $scope.Attachments.splice(index, 1);
                        $scope.Obligation.Attachments.splice(index, 1);
                    }
                });
                toastr.success('Attachment Deleted');
            }, function(error) {
                toastr.error('Attachment Removal Failed');
            })
        }
        $scope.manageReimbursements = function() {
            $state.go('EditObligationReimbursements', { id: $scope.Obligation.Id })
        }
        $scope.managePayments = function() {
            $state.go('EditObligationPayments', { id: $scope.Obligation.Id })
        }
}])
.controller('EditObligationController', ['$scope','$state','$q','toastr','Obligation','LOVs','ObligationNumbers', function($scope,$state,$q,toastr,Obligation,LOVs,ObligationNumbers){
	$scope.Obligation = angular.copy(Obligation);
	$scope.isDisabled = false;
	$scope.ExistingObligationNumber = $scope.Obligation.ObligationNumber
	
    $scope.Appropriations = LOVs.Appropriations;
    $scope.Allotments = LOVs.Allotments;
    $scope.OperatingAllowances = LOVs.OperatingAllowances;
    $scope.RewardsPrograms = LOVs.RewardsPrograms;
   	$scope.PostCodes = _.sortBy(LOVs.PostCodes, function(object){ return object.ValueOfItem; });
    $scope.Countries = LOVs.Countries;    
    $scope.ObligationNumbers = ObligationNumbers.data;
    $scope.AllotmentChange = function() {
        $scope.Obligation.GetNextObligationNumber($scope.ObligationNumbers);
    }
    $scope.changeOperatingAllowance = function() {
        $scope.Obligation.GetNextObligationNumber($scope.ObligationNumbers);
    }
    $scope.UpdatePosts = function() {
        if ($scope.Country) {
            $scope.PostCodes = _.filter(LOVs.PostCodes, function(p){
                var found = false;
                if (p.FilterValue == $scope.Country) {
                    return true;
                }            
            })
        }
    }
    $scope.changePostCode = function() {
        $scope.Obligation.GetNextObligationNumber($scope.ObligationNumbers);
    }
    $scope.saveObligation = function() {    
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;	
	    	var preventDuplicateObligationNumbers = _.where($scope.ObligationNumbers, {ObligationNumber: $scope.Obligation.ObligationNumber});
	    	if(preventDuplicateObligationNumbers.length == 0 || $scope.ExistingObligationNumber == $scope.Obligation.ObligationNumber)
	    	{
		        $scope.Obligation.SaveObligation().then(function(allotment) {
		            $state.go('ViewObligation',{ id: allotment.Id });
		            toastr.success("Success","Obligation saved.");
		        }, function(err) {
		        	$scope.isDisabled = false;
		            $state.reload();
		            toastr.error("Error","Error saving obligation.");
		        });
	    	}else{
	    		$scope.isDisabled = false;
	    		toastr.error("This Obligation Number already exist","Error");
	    	}    
    	}    
    }
    $scope.cancel = function() {
        if ($state.params.id) {
            $state.go('ViewObligation', { id: $scope.Obligation.Id });
        } else {
            $state.go('home');
        }
    }  
}])
.controller('ManageObligationReimbursements', ['$scope','$state','$q','toastr','Obligation','Reimbursements', function($scope,$state,$q,toastr,Obligation,Reimbursements){
	$scope.Obligation = angular.copy(Obligation);
    $scope.Reimbursements = Reimbursements;
    $scope.SearchResults = [];
    $scope.SearchText = "";
    $scope.isDisabled = false;
    $scope.cancel = function() {
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	        $scope.Obligation.SaveObligation().then(function(res) {
	            toastr.success("Obligation updated.", "Success");
	            $state.go('ViewObligation', { id: $scope.Obligation.Id });
	        }, function(err) {
	        	$scope.isDisabled = false;
	            toastr.error("Error saving obligation.", "Error");
	            $state.go('ViewObligation', { id: $scope.Obligation.Id });
	        });
        }
    }
    $scope.Search = function() {
        $scope.Obligation.FindReimbursements($scope.SearchText).then(function(res) {
            $scope.SearchResults = res;
            if (res.length > 0) {
                toastr.success("Search results updated.","Success");
            } else {
                toastr.error("No results match search criteria.", "No Results");
            }
        }, function(err) {
            toastr.error("Error searching reimbursements.", "Error");
        });
    };
    $scope.removeReimbursement = function(index) {
        $scope.Obligation.Reimbursements.splice(index,1);
        var removed = $scope.Reimbursements.splice(index,1)[0];
        if ((removed.Purpose && removed.Purpose.indexOf($scope.SearchText) > -1) || (removed.Program && removed.Payee.indexOf($scope.SearchText) > -1) || (removed.Agency && removed.OperatingAllowance.indexOf($scope.SearchText) > -1))
        {
            $scope.SearchResults.push(removed);
        }
    };
    $scope.linkReimbursement = function(index) {
        var reimbursement = $scope.SearchResults[index];
        if ($scope.Obligation.CheckReimbursement(reimbursement)) {
            var result = $scope.SearchResults.splice(index,1);
            $scope.Obligation.Reimbursements.push(result[0].Id);
            $scope.Reimbursements.push(result[0]);
        }
    }
}])
.controller('ManageObligationPayments', ['$scope','$state','$q','toastr','Obligation','Payments','BusinessObjectsFactory', function($scope,$state,$q,toastr,Obligation,Payments,BusinessObjectsFactory){
	$scope.Obligation = angular.copy(Obligation);
    $scope.Payments = Payments;
    $scope.SearchResults = [];
    $scope.SearchText = "";
    $scope.cancel = function() {
        $state.go('ViewObligation', { id: $scope.Obligation.Id });
    }
    $scope.Search = function() {
        $scope.Obligation.FindPayments($scope.SearchText).then(function(res) {
            $scope.SearchResults = res;
            if (res.length > 0) {
                toastr.success("Search results updated.","Success");
            } else {
                toastr.error("No results match search criteria.", "No Results");
            }
        }, function(err) {
            toastr.error("Error searching Payments.", "Error");
        });
    };
}])
.controller('DeobligateController', ['$scope','$q','BusinessObjectsFactory','$state','toastr','Obligations',function($scope,$q,BusinessObjectsFactory,$state,toastr,Obligations) {
    $scope.Obligations = Obligations;
    $scope.save = function(index) {
        var o = $scope.Obligations[index];
        o.SaveObligation().then(function(res) {
            toastr.success("Deobligation successful.");
        });
    };
}])