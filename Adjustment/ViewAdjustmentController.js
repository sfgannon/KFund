angular.module('AdjustmentModule', ['ngResource','ui.router','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule'])
.controller('ViewAdjustmentController', ['$q','$scope','toastr','Adjustment','Attachments', function($q,$scope,toastr,Adjustment,Attachments) {
    $scope.Adjustment = Adjustment;
    $scope.Attachments = angular.copy(Attachments);
    $scope.uploadFile = function(){
        $scope.attaching = true;
        var file = $scope.myFile;
        var fileData = $scope.fileData;
        $scope.Adjustment.AddAttachment(fileData,file.name).then(function(responseData) {
            $scope.myFile = null;
            $scope.fileData = null;
            $('#inpFile').val('');
            $scope.Adjustment.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
            $scope.Adjustment.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
            $scope.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
            toastr.success('Upload Succesful.', 'File attached.');
            $scope.attaching = false;
        }, function(error) {
            toastr.error('File upload failed: ' + JSON.stringify(error.data.error.message.value), 'Upload Failed');
            $scope.attaching = false;
        });
    };
    $scope.removeAttachment = function(fileName) {
        $scope.Adjustment.RemoveAttachment(fileName).then(function(responseData) {
            angular.forEach($scope.Attachments, function(value, index) {
                if (value.FileName == fileName) {
                    $scope.Attachments.splice(index, 1);
                    $scope.Adjustment.Attachments.splice(index, 1);
                }
            });
            toastr.success('Attachment Deleted');
        }, function(error) {
            toastr.error('Attachment Removal Failed');
        })
    }
}])
.controller('EditAdjustmentController', ['$q','$scope','$state','toastr','Adjustment','LOVs','BusinessObjectsFactory', function($q,$scope,$state,toastr,Adjustment,LOVs,BusinessObjectsFactory) {
    $scope.Adjustment = angular.copy(Adjustment);
    $scope.isDisabled = false;
    $scope.Appropriations = LOVs.Appropriations;
    $scope.Allotments = LOVs.Allotments;
    $scope.OperatingAllowances = LOVs.OperatingAllowances;
    $scope.RewardsPrograms = LOVs.RewardsPrograms;
    $scope.saveAdjustment = function() {    
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
	        $scope.Adjustment.SaveAdjustment().then(function(res) {
	        	$scope.isDisabled = false;
	            $state.go('ViewAdjustment', { id: $scope.Adjustment.Id });
	            toastr.success("Adjustment saved.","Success");
	        }, function(err) {
	        	$scope.isDisabled = false;
	            $state.reload();
	            toastr.error("Error saving Adjustment.","Error");
	        });
        }
    }
    		
    $scope.cancel = function() {
        if ($state.params.id) {
            $state.go('ViewAdjustment', { id: $scope.Adjustment.Id });
        } else {
            $state.go('home');
        }
    }
}])