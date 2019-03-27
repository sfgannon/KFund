angular.module("ViewDepositController", ['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule'])
.controller('ViewDepositController', ['$scope','$state','$q','toastr','Deposit','Attachments',function($scope,$state,$q,toastr,Deposit,Attachments) {
    $scope.Attachments = angular.copy(Attachments);
    $scope.Deposit = angular.copy(Deposit);
    $scope.editDeposit = function() {
        $state.go('EditDeposit', { id: $scope.Deposit.Id });
    }
    $scope.uploadFile = function(){
        $scope.attaching = true;
        var file = $scope.myFile;
        var fileData = $scope.fileData;
        $scope.Deposit.AddAttachment(fileData,file.name).then(function(responseData) {
            $scope.myFile = null;
            $scope.fileData = null;
            $('#inpFile').val('');
            $scope.Deposit.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
            $scope.Deposit.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
            $scope.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
            toastr.success('Upload Succesful.', 'File attached.');
            $scope.attaching = false;
        }, function(error) {
            toastr.error('File upload failed: ' + JSON.stringify(error.data.error.message.value), 'Upload Failed');
            $scope.attaching = false;
        });
    };
    $scope.removeAttachment = function(fileName) {
        $scope.Deposit.RemoveAttachment(fileName).then(function(responseData) {
            angular.forEach($scope.Attachments, function(value, index) {
                if (value.FileName == fileName) {
                    $scope.Attachments.splice(index, 1);
                    $scope.Deposit.Attachments.splice(index, 1);
                }
            });
            toastr.success('Attachment Deleted');
        }, function(error) {
            toastr.error('Attachment Removal Failed');
        })
    }
}])
.controller('EditDepositController', ['$scope','$state','$q','toastr','Deposit','LOVs', function($scope,$state,$q,toastr,Deposit,LOVs) {
    $scope.Deposit = angular.copy(Deposit);
    $scope.Appropriations = LOVs.Appropriations;
    $scope.Allotments = LOVs.Allotments;
    $scope.OperatingAllowances = LOVs.OperatingAllowances;
    $scope.changeAppropriation = function() {
		if($scope.Deposit.Allotment == "2003")
		{
			$scope.Deposit.OperatingAllowance = "2003"
		}else{
			$scope.Deposit.OperatingAllowance = ""
		}
    }
    $scope.isDisabled = false;
    $scope.SaveDeposit = function() {
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	        $scope.Deposit.SaveDeposit().then(function(res) {
	        	$scope.isDisabled = false;
	            $state.go('ViewDeposit', { id: $scope.Deposit.Id });
	            toastr.success("Deposit saved successfully.", "Deposit Saved");
	        }, function(err) {
	        	$scope.isDisabled = false;
	            toastr.error('Error saving deposit.', 'Error');
	        });
        }
    }
    $scope.cancel = function() {
        if ($state.params.id) {
            $state.go('ViewDeposit', { id: $scope.Deposit.Id });
        } else {
            $state.go('home');
        }
    }
}])
.controller('EditAccountAdjustmentController', ['$scope','$state','toastr','Adjustment','OperatingAllowances',function($scope,$state,toastr,Adjustment,OperatingAllowances) {
    $scope.OperatingAllowances = OperatingAllowances;
    $scope.Adjustment = angular.copy(Adjustment);
    $scope.isDisabled = false;
    $scope.SaveAdjustment = function() {
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	        $scope.Adjustment.SaveAccountAdjustment().then(function(res) {
	        	$scope.isDisabled = false;
	            $state.go('CheckBalance');
	            toastr.success('Adjustment saved successfully.','Success');
	        }, function(err) {
	        	$scope.isDisabled = false;
	            toastr.error('Error saving adjustment.','Error');
	        });
        }
    }
    $scope.cancel = function() {
       $state.go('CheckBalance'); 
    }
    $scope.viewBalance = function() {
        $state.go('CheckBalance');
    }
}])
.controller('ViewAccountAdjustmentController', ['$scope','$state','toastr','Adjustment',function($scope,$state,toastr,Adjustment) {
    $scope.Adjustment = angular.copy(Adjustment);
}])