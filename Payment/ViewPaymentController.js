angular.module("ViewPaymentController", ['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule'])
.controller("ViewPaymentController", ["$scope","$q","$state","toastr","Payment",'PaymentReturns',"Attachments","Obligations","Reimbursements","RPPs", function($scope,$q,$state,toastr,Payment,PaymentReturns,Attachments,Obligations,Reimbursements,RPPs) {
    $scope.Payment = angular.copy(Payment);
    $scope.Attachments = Attachments;
    $scope.Obligations = Obligations;
    $scope.Reimbursements = Reimbursements;
    $scope.PaymentReturns = PaymentReturns;
    $scope.RPPs = RPPs;
    $scope.uploadFile = function(){
        $scope.attaching = true;
        var file = $scope.myFile;
        var fileData = $scope.fileData;
        $scope.Payment.AddAttachment(fileData,file.name).then(function(responseData) {
            $scope.myFile = null;
            $scope.fileData = null;
            $('#inpFile').val('');
            $scope.Payment.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
            $scope.Payment.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
            $scope.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
            toastr.success('Upload Succesful.', 'File attached.');
            $scope.attaching = false;
        }, function(error) {
            toastr.error('File upload failed: ' + JSON.stringify(error.data.error.message.value), 'Upload Failed');
            $scope.attaching = false;
        });
    };
    $scope.removeAttachment = function(fileName) {
        $scope.Payment.RemoveAttachment(fileName).then(function(responseData) {
            angular.forEach($scope.Attachments, function(value, index) {
                if (value.FileName == fileName) {
                    $scope.Attachments.splice(index, 1);
                    $scope.Payment.Attachments.splice(index, 1);
                }
            });
            toastr.success('Attachment Deleted');
        }, function(error) {
            toastr.error('Attachment Removal Failed');
        })
    }
    $scope.manageReimbursements = function() {
        $state.go('EditPaymentReimbursements', { id: $scope.Payment.Id })
    }
}])
.controller("EditPaymentController", ["$scope","$q","$state","toastr","Payment","LOVs","RPPs", function($scope,$q,$state,toastr,Payment,LOVs,RPPs) {
    $scope.PaymentTypes = LOVs.PaymentTypes;
    $scope.Payment = angular.copy(Payment);
    $scope.Appropriations = LOVs.Appropriations;
    $scope.Allotments = LOVs.Allotments;
    $scope.OperatingAllowances = LOVs.OperatingAllowances;
    $scope.AdhocBureaus = LOVs.AdhocBureaus ;
    $scope.RepresentationTypes = LOVs.RepresentationTypes
    $scope.PostCodes = _.sortBy(LOVs.PostCodes, function(object){ return object.ValueOfItem; });
    $scope.Countries = LOVs.Countries;
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
    $scope.Payees = LOVs.Payees;
    $scope.isDisabled = false;
    var listedPayee = false;
    $scope.Payees.forEach(function(p,i) {
        if (p == $scope.Payment.Payee) {
            listedPayee = true;
        };
    })
    if (!listedPayee) {
        $scope.PayeeOther = $scope.Payment.Payee;
        $scope.Payment.Payee = "Other";
    }
    $scope.Bureaus = LOVs.Bureaus;
    $scope.Accounts = LOVs.Accounts;
    $scope.AllotmentTypes = LOVs.AllotmentTypes;
    $scope.RewardsPrograms = LOVs.RewardsPrograms;
    $scope.RPPs = RPPs;
    $scope.FilteredRPPs = [];
    $scope.spsSearchResults = [];
    $scope.fcSearchResults = [];
    $scope.filterRPPs = function() {
        $scope.FilteredRPPs = [];
        $scope.RPPs.forEach(function(rpp,index) {
            if (rpp.RewardsProgram == $scope.Payment.RewardsProgram) {
                $scope.FilteredRPPs.push(rpp);
            }
        })
    }
    $scope.changeProgram = function() {
        $scope.Payment.RPP = '';
    }
    $scope.changeOperatingAllowance = function() {
        if ($scope.Payment.PaymentType == 'Fund Cite' && $scope.Payment.Obligations.length > 0 && !!$scope.Payment.Appropriation) {
            $scope.Payment.GetNextFundCiteNumber();
        }
    }
    $scope.changePaymentType = function() {
        var type = $scope.Payment.PaymentType;
        $scope.Payment = angular.copy(Payment);
        $scope.Payment.PaymentType = type;
    }
    $scope.changeAppropriation = function() {
        if($scope.Payment.Allotment == '2003')
        {
        	$scope.Payment.OperatingAllowance = "2003";
        }else{
        	$scope.Payment.OperatingAllowance = "";
        }          
    }
    $scope.spsFindObligations = function() {
        $scope.Payment.FindObligations($scope.spsSearchText).then(function(res) {
            $scope.spsSearchResults = res;            
            angular.forEach($scope.spsSearchResults , function(searchedItem,index) {            
            	if($scope.Payment.Obligations.length > 0)
            	{
            		angular.forEach($scope.Payment.Obligations , function(linkedItem,index) {            			
            			if(searchedItem.ObligationNumber == linkedItem.ObligationNumber && searchedItem.Id == linkedItem.Id )
            			{
            				$scope.spsSearchResults = _.without($scope.spsSearchResults, searchedItem);
            			}            			
            		})    		
            	}            	
            })      
            if (res.length > 0) {
                toastr.success("Search results updated", "Success");
            } else {
                toastr.error("No results match search criteria.", "No Results");
            }
        }, function(err) {
            toastr.error("Error searching obligations.", "Error");
        });
    }
    $scope.spsLinkObligation = function(index) {
        var out = {
            Id: $scope.spsSearchResults[index].Id,
            ObligationNumber: $scope.spsSearchResults[index].ObligationNumber,
            Purpose: $scope.spsSearchResults[index].Purpose,
            Amount: 0
        };
        $scope.spsSearchResults.splice(index,1);
        $scope.Payment.Obligations.push(out);
    }
    $scope.spsRemoveObligation = function(index) {
        $scope.Payment.RemoveObligation(index);
    }
    $scope.fcFindObligations = function() {
        $scope.Payment.FindObligations($scope.fcSearchText).then(function(res) {
            $scope.fcSearchResults = res;            
            angular.forEach($scope.fcSearchResults, function(searchedItem,index) {            
            	if($scope.Payment.Obligations.length > 0)
            	{
            		angular.forEach($scope.Payment.Obligations , function(linkedItem,index) {            			
            			if(searchedItem.ObligationNumber == linkedItem.ObligationNumber && searchedItem.Id == linkedItem.Id )
            			{
            				$scope.fcSearchResults = _.without($scope.fcSearchResults, searchedItem);
            			}            			
            		})    		
            	}            	
            })           
            if (res.length > 0) {
                toastr.success("Search results updated", "Success");
            } else {
                toastr.error("No results match search criteria.", "No Results");
            }
        }, function(err) {
            toastr.error("Error searching obligations.", "Error");
        });
    }
    $scope.fcLinkObligation = function(index) {
        $scope.Payment.Obligations = [];
        var out = {
            Id: $scope.fcSearchResults[index].Id,
            ObligationNumber: $scope.fcSearchResults[index].ObligationNumber,
            Purpose: $scope.fcSearchResults[index].Purpose,
            Amount: $scope.Payment.Amount
        };
        $scope.Payment.Obligations.push(out);
        if (($scope.Payment.Allotment == '2003' && !!$scope.Payment.Appropriation)||($scope.Payment.Allotment == '1007' && !!$scope.Payment.OperatingAllowance && !!$scope.Payment.Appropriation))
        $scope.Payment.GetNextFundCiteNumber();
    }
    $scope.fcRemoveObligation = function() {
        $scope.Payment.Obligations = [];
    }
    $scope.savePayment = function() {
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	        if ($scope.Payment.Payee == 'Other') {
	            $scope.Payment.Payee = $scope.PayeeOther;
	        }
	        $scope.Payment.SavePayment().then(function(res) {
	        	$scope.isDisabled = false;
	            $state.go('ViewPayment', { id: $scope.Payment.Id });
	            toastr.success("Payment saved.","Success");
	        }, function(err) {
	        	$scope.isDisabled = false;
	            $state.reload();
	            toastr.error("Error saving payment.","Error");
	        });
        }
    }
    $scope.cancel = function() {
        if ($state.params.id) {
            $state.go('ViewPayment', { id: $scope.Payment.Id });
        } else {
            $state.go('home');
        }
    };
    $scope.bureauAllotmentChange = function() {
        if (!$scope.Payment.BureauAllotment) {
            $scope.Payment.Bureau = "";
            $scope.Payment.RepresentationType= "";
        };
    }
    $scope.RepresentationTypeChange = function() {
        if ($scope.Payment.RepresentationType == 'Functions Paid by MEDCS') {
            $scope.Payment.Bureau = "";
        };
    }
    $scope.giftFundsChange = function() {
        if (!$scope.Payment.GiftFundsUsed) {
            $scope.Payment.GiftFundAmount = 0;
        };
    };
}])
.controller('GenerateFundCiteController',['$scope','$q','$state','toastr','BusinessObjectsFactory','LOVs','ObligationNumbers',function($scope,$q,$state,toastr,BusinessObjectsFactory,LOVs,ObligationNumbers) {
    $scope.Appropriations = LOVs.Appropriations;
    $scope.Allotments = LOVs.Allotments;
    $scope.OperatingAllowances = LOVs.OperatingAllowances;
    $scope.PostCodes = _.sortBy(LOVs.PostCodes, function(object){ return object.ValueOfItem; });
    $scope.Countries = LOVs.Countries;
    $scope.FundCite = new BusinessObjectsFactory.Payment();
    $scope.FundCite.PaymentType = 'Fund Cite';
    $scope.Obligation = new BusinessObjectsFactory.Obligation();
    $scope.ObligationNumbers = ObligationNumbers.data
	$scope.isDisabled = false;
    $scope.AllotmentChange = function() {
        $scope.FundCite.OperatingAllowance = $scope.Obligation.OperatingAllowance;
        $scope.FundCite.Appropriation = $scope.Obligation.Appropriation;
        $scope.FundCite.Allotment = $scope.Obligation.Allotment;
        $scope.FundCite.PostCode = $scope.Obligation.PostCode;
        $scope.FundCite.Purpose = $scope.Obligation.Purpose;
        $scope.FundCite.Notes = $scope.Obligation.Description;
        $scope.Obligation.GetNextObligationNumber($scope.ObligationNumbers).then(function(res) {
            if ($scope.Obligation.ObligationNumber != '') {
                if ($scope.FundCite.Allotment != '' && ($scope.FundCite.OperatingAllowance != '' || $scope.FundCite.PostCode != '')) {
                    $scope.FundCite.GetNextFundCiteNumber();
                } else {
                    $scope.FundCite.FundCiteNumber = '';
                }
            } else {
                $scope.FundCite.FundCiteNumber = '';
            }
        });
    }
    $scope.changeOperatingAllowance = function() {
        $scope.FundCite.OperatingAllowance = $scope.Obligation.OperatingAllowance;
        $scope.FundCite.Appropriation = $scope.Obligation.Appropriation;
        $scope.FundCite.Allotment = $scope.Obligation.Allotment;
        $scope.FundCite.PostCode = $scope.Obligation.PostCode;
        $scope.FundCite.Purpose = $scope.Obligation.Purpose;
        $scope.FundCite.Notes = $scope.Obligation.Description;
        $scope.Obligation.GetNextObligationNumber($scope.ObligationNumbers).then(function(res) {
            if ($scope.Obligation.ObligationNumber != '') {
                if ($scope.FundCite.Allotment != '' && ($scope.FundCite.OperatingAllowance != '' || $scope.FundCite.PostCode != '')) {
                    $scope.FundCite.GetNextFundCiteNumber();
                } else {
                    $scope.FundCite.FundCiteNumber = '';
                }
            } else {
                $scope.FundCite.FundCiteNumber = '';
            }
        });
    }
    $scope.changePostCode = function() {
        $scope.FundCite.OperatingAllowance = $scope.Obligation.OperatingAllowance;
        $scope.FundCite.Appropriation = $scope.Obligation.Appropriation;
        $scope.FundCite.Allotment = $scope.Obligation.Allotment;
        $scope.FundCite.PostCode = $scope.Obligation.PostCode;
        $scope.FundCite.Purpose = $scope.Obligation.Purpose;
        $scope.FundCite.Notes = $scope.Obligation.Description;
        $scope.FundCite.Amount = $scope.Obligation.Amount;
        $scope.Obligation.GetNextObligationNumber($scope.ObligationNumbers).then(function(res) {
            if ($scope.Obligation.ObligationNumber != '') {
                if ($scope.FundCite.Allotment != '' && ($scope.FundCite.OperatingAllowance != '' || $scope.FundCite.PostCode != '')) {
                    $scope.FundCite.GetNextFundCiteNumber();
                } else {
                    $scope.FundCite.FundCiteNumber = '';
                }
            } else {
                $scope.FundCite.FundCiteNumber = '';
            }
        });
    }
    $scope.changeObligationNumber = function() {
        $scope.FundCite.GetNextFundCiteNumber()
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
    $scope.Save = function() {
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	        $scope.Obligation.SaveObligation().then(function(res) {
                $scope.FundCite.Obligations.push({ "Id": res.Id, "ObligationNumber": res.ObligationNumber, "Purpose": res.Purpose, "Amount": res.Amount });
                $scope.FundCite.SavePayment().then(function(pmt) {
                    var ObligationAlert = new BusinessObjectsFactory.Alert();
                    ObligationAlert.AlertStatus = "Unread";
                    ObligationAlert.Purpose = "An obligation has been created for: " + res.Purpose;
                    ObligationAlert.Notes = "An obligation has been created for " + res.Purpose + ". Please complete the data entry for this obligation <a id='btnView" + res.Id + "' ng-click='ViewAlert(" + res.Id + ")'>here.</a>";
                    var FundCiteAlert = new BusinessObjectsFactory.Alert();
                    FundCiteAlert.AlertStatus = "Unread";
                    FundCiteAlert.Purpose = "A fund cite has been created for: " + pmt.Purpose;
                    FundCiteAlert.Notes = "A fund cite has been created for " + pmt.Purpose + ". Please complete the data entry for this fund cite <a id='btnView" + pmt.Id + "' ng-click='ViewAlert(" + pmt.Id + ")'>here.</a>";
                    var alertsArray = [];
                    alertsArray.push(ObligationAlert.SaveAlert());
                    alertsArray.push(FundCiteAlert.SaveAlert());
                    var out = $q.defer();
                    out.promise = $q.all(alertsArray).then(function(res) {
                        out.resolve(res);
                        $state.go('home');
                        toastr.success("Fund cite generated.");
                    }, function(err) {
                        $scope.isDisabled = false;
                        out.reject(err);
                    });
                    return out.Promise;
                }, function(e) {
                    $scope.isDisabled = false;
                    return e;
                })
            }, function(e) {
                $scope.isDisabled = false;
                return e;
            });
        }
    };
    $scope.cancel = function() {
        $state.go('home');
    };
}])