angular.module('ViewAllotmentController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule'])
.controller('ViewAllotmentController',['$q','$rootScope','$scope','$http','$state','toastr','Allotment','SOFTable','Reimbursements','Attachments',function($q,$rootScope,$scope,$http,$state,toastr,Allotment,SOFTable,Reimbursements,Attachments) {
    $scope.Allotment = angular.copy(Allotment);
    $scope.Auth = $scope.Allotment.GetCurrentAuth();
    $scope.SOFTable = SOFTable;
    $scope.Reimbursements = Reimbursements
    $scope.editGeneralInfo = function() {
        $state.go('EditAllotment', { id: $scope.Allotment.Id });
    }
    $scope.editAuths = function() {
        $state.go('EditAuthorizations', { id: $scope.Allotment.Id });
    }
    $scope.editSOFs = function() {
        $state.go('ViewSOFs', { id: $scope.Allotment.Id });
    }
    $scope.editReimbursements = function() {
        $state.go('ViewReimbursements', { id: $scope.Allotment.Id });
    }
    $scope.Attachments = Attachments;
    $scope.Attaching = false;
    $scope.uploadFile = function(){
            $scope.attaching = true;
            var file = $scope.myFile;
            var fileData = $scope.fileData;
            $scope.Allotment.AddAttachment(fileData,file.name).then(function(responseData) {
                $scope.myFile = null;
                $scope.fileData = null;
                $('#inpFile').val('');
                $scope.Allotment.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                $scope.Allotment.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                $scope.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                toastr.success('Upload Succesful.', 'File attached.');
                $scope.attaching = false;
            }, function(error) {
                toastr.error('File upload failed: ' + JSON.stringify(error.data.error.message.value), 'Upload Failed');
                $scope.attaching = false;
            });
        };
    $scope.removeAttachment = function(fileName) {
        $scope.Allotment.RemoveAttachment(fileName).then(function(responseData) {
            angular.forEach($scope.Attachments, function(value, index) {
                if (value.FileName == fileName) {
                    $scope.Attachments.splice(index, 1);
                    $scope.Allotment.Attachments.splice(index, 1);
                }
            });
            toastr.success('Attachment Deleted');
        }, function(error) {
            toastr.error('Attachment Removal Failed');
        })
    }
}])
.controller('EditAllotmentController',['$scope','$state','toastr','LOVs','Allotment',function($scope,$state,toastr,LOVs,Allotment) {
    $scope.AllotmentAuthorities = LOVs.AllotmentAuthorities;
    $scope.Appropriations = LOVs.Appropriations;
    $scope.NYs = LOVs.NewYears;
    $scope.Agencies = LOVs.Agencies;
    $scope.Allotment = angular.copy(Allotment);
    $scope.isDisabled = false;
    $scope.saveAllotment = function() {
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	
	        $scope.Allotment.SaveAllotment().then(function(allotment) {
	            $state.go('ViewAllotment',{ id: allotment.Id });
	            toastr.success("Success","Allotment saved.");
	        }, function(err) {
	        	$scope.isDisabled = false;
	            $state.reload();
	            toastr.error("Error","Error saving allotment.");
	        })
        }
    };
    $scope.cancel = function() {
        if ($state.params.id) {
            $state.go("ViewAllotment", { id: $state.params.id });
        } else {
            $state.go('home');
        }
    }
}])
.controller('AllotmentAuthorizationController',['$q','$rootScope','$scope','$state','toastr','Allotment',function($q,$rootScope,$scope,$state,toastr,Allotment) {
    $scope.viewMode = 'view';
    $scope.Allotment = angular.copy(Allotment);
    $scope.Auths = $scope.Allotment.Auths;
    $scope.Auth = $scope.Allotment.GetCurrentAuth();
    $scope.Change = $scope.Allotment.GetCurrentAuth().Change;
	$scope.isDisabled = false;
	$scope.getAuth = function() {
		$scope.Auth = $scope.Allotment.GetCurrentAuth($scope.Change);
	}

	$scope.addAuth = function() {
		$scope.Auth = $scope.Allotment.NewAuth();
		$scope.viewMode = 'edit';
	}
	$scope.editAuth = function() {
		$scope.viewMode = 'edit';
		$scope.Auth = $scope.Allotment.GetCurrentAuth();
	}
	$scope.saveAuth = function() {
		if($scope.isDisabled == false)
		{
			$scope.isDisabled = true;
	        var ca = $scope.Allotment.GetCurrentAuth();
	        if ((ca) && (ca.Change == $scope.Auth.Change)) {
	            $scope.Allotment.Auths[$scope.Auth.Change - 1] = $scope.Auth;
	        } else {
	            $scope.Allotment.Auths.push($scope.Auth);
	        }
			$scope.Allotment.SaveAllotment().then(function(response) {
				$scope.isDisabled = false;
				toastr.success('','Allotment info saved.');
				$state.reload();			
			}, function(error) {
				$scope.isDisabled = false;
				toastr.error('','Allotment not saved.');
			})
		}
	}
	$scope.editProgram = function(index) {
		$scope.ProgramIndex = index;
		$scope.CurrentProgram = $scope.Auth.Programs[$scope.ProgramIndex];
		$scope.viewMode = "editAuth";
	}
	$scope.addProgram = function() {
		$scope.PreviousPrograms = angular.copy($scope.Auth.Programs)
        $scope.Auth.GetUnusedPrograms($scope.Allotment.Appr).then(function(res) {
            $scope.UnusedPrograms = res;
            $scope.viewMode = "editAuth";
            $scope.Auth.AddProgram(); 
            $scope.ProgramIndex = $scope.Auth.Programs.length - 1;
            $scope.CurrentProgram = $scope.Auth.Programs[$scope.ProgramIndex];
        });
	}
	$scope.saveProgram = function() {
		$scope.Auth.CalculateTotals();
		$scope.viewMode = 'edit';
	}
	$scope.cancelChange = function() {
        $scope.Auth = $scope.Allotment.GetCurrentAuth();
		$scope.viewMode = 'view';
	}
	$scope.cancelProgram = function() {
		$scope.Auth.Programs = $scope.PreviousPrograms 
		$scope.viewMode = 'view';
	}
	$scope.cancel = function() {
		$state.go("ViewAllotment", { id: $scope.Allotment.Id });
	}
}])
.controller('ViewSOFsController', ['$scope','$state','toastr','Allotment','SOFs',function($scope,$state,toastr,Allotment,SOFs) {
    $scope.Allotment = angular.copy(Allotment);
    $scope.SOFs = angular.copy(SOFs);
    $scope.editSOF = function(index) {
        $state.go('EditSOF', { AllotmentId: $scope.Allotment.Id, SOFId: $scope.SOFs.Objects[index].Id });
    }
    $scope.newSOF = function() {
        $state.go('EditSOF', { AllotmentId: $scope.Allotment.Id, SOFId: '' });
    }
    $scope.cancel = function() {
        $state.go('ViewAllotment', { id: $scope.Allotment.Id });
    }
}])
.controller('EditSOFController', ['$scope','$state','toastr','ConfigService','UtilityService','FundingTypes','SOF','Allotment','UnsourcedFunds',function($scope,$state,toastr,ConfigService,UtilityService,FundingTypes,SOF,Allotment,UnsourcedFunds) {
    $scope.UnsourcedFunds = UnsourcedFunds;
    $scope.FundingTypes = FundingTypes;
    $scope.SOF = angular.copy(SOF);
    $scope.isDisabled = false;
    $scope.saveSOF = function() {
		if($scope.isDisabled == false)
		{
			$scope.isDisabled = true;
			$scope.SOF.FiscalYear = Allotment.FiscalYear
		
		    $scope.SOF.SaveSOF().then(function(res) {
		        $state.go('ViewSOFs', { id: $scope.SOF.AllotmentId });
		        toastr.success("Source of Funds entry saved.","Success")
		    }, function(err) {
		    	$scope.isDisabled = false;
		        $state.go('ViewSOFs', { id: $scope.SOF.AllotmentId });
		        toastr.error("Error saving Source of Funds entry.","Error");
		    })
        }
    }
    $scope.cancel = function() {
        $state.go('ViewSOFs', { id: $scope.SOF.AllotmentId });
    }
    $scope.deleteSOF = function() {
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	
	        UtilityService.deleteItem($scope.SOF.Id, ConfigService.getTransactionListName()).then(function(res) {
	            $scope.isDisabled = false;
	            $state.go('ViewSOFs', { id: $scope.SOF.AllotmentId });
	            toastr.success("Source of Funds entry removed.","Success")
	        }, function(err) {
	            $scope.isDisabled = false;
	            $state.go('ViewSOFs', { id: $scope.SOF.AllotmentId });
	            toastr.error("Error removing Source of Funds entry.","Error");
	        })
        }
    }
}])
.controller('ViewReimbursementsController', ['$scope','$state','toastr','Allotment','Reimbursements',function($scope,$state,toastr,Allotment,Reimbursements) {
    $scope.Allotment = angular.copy(Allotment);
    $scope.Reimbursements = angular.copy(Reimbursements);
    $scope.editReimbursement = function(index) {
        $state.go('EditReimbursement', { AllotmentId: $scope.Allotment.Id, ReimbursementId: $scope.Reimbursements[index].Id });
    }
    $scope.newReimbursement = function() {
        $state.go('EditReimbursement', { AllotmentId: $scope.Allotment.Id, ReimbursementId: '' });
    }
    $scope.cancel = function() {
        $state.go('ViewAllotment', { id: $scope.Allotment.Id });
    }
}])
.controller('EditReimbursementController', ['$scope','$state','toastr','ConfigService','UtilityService','Reimbursement','Allotment','LOVs','AvailableFunds',function($scope,$state,toastr,ConfigService,UtilityService,Reimbursement,Allotment,LOVs,AvailableFunds) {
    $scope.Allotment = angular.copy(Allotment);
    $scope.AvailableFunds = AvailableFunds;
    $scope.Reimbursement = angular.copy(Reimbursement);
    $scope.Statuses = LOVs.ReimbursementStatuses;
    $scope.Programs = LOVs.Programs;
    $scope.isDisabled = false;
    $scope.Agencies = LOVs.Agencies.sort();
    $scope.saveReimbursement = function() {
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	        $scope.Reimbursement.SaveReimbursement().then(function(res) {
	            $state.go('ViewReimbursements', { id: $scope.Reimbursement.AllotmentId });
	            toastr.success("Reimbursement entry saved.","Success")
	        }, function(err) {
	        	$scope.isDisabled = false;
	            $state.go('ViewReimbursements', { id: $scope.Reimbursement.AllotmentId });
	            toastr.error("Error saving Reimbursement entry.","Error");
	        })
        }
    }
    $scope.cancel = function() {
        $state.go('ViewReimbursements', { id: $scope.Reimbursement.AllotmentId });
    }
    $scope.deleteReimbursement = function() {
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	        UtilityService.deleteItem($scope.Reimbursement.Id, ConfigService.getTransactionListName()).then(function(res) {
	        	$scope.isDisabled = false;
	            $state.go('ViewReimbursements', { id: $scope.Reimbursement.AllotmentId });
	            toastr.success("Reimbursement entry removed.","Success")
	        }, function(err) {
	        	$scope.isDisabled = false;
	            $state.go('ViewReimbursements', { id: $scope.Reimbursement.AllotmentId });
	            toastr.error("Error removing Reimbursement entry.","Error");
	        })
        }
    }
}])