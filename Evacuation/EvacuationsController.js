angular.module('EvacuationsController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','BusinessObjectsModule','ValidationService'])
.controller('ViewEvacuationController',["$scope","$q","$state","toastr","Evacuation","LOVs",'Attachments','ValidationService',function($scope,$q,$state,toastr,Evacuation,LOVs,Attachments,ValidationService) {
    $scope.Evacuation = Evacuation;
    $scope.Bureaus = LOVs.Bureaus;
    $scope.EvacuationTypes = LOVs.EvacuationTypes;
    $scope.Evacuees = LOVs.Evacuees;
    $scope.Posts = LOVs.Posts;
    $scope.Countries = LOVs.Countries;
    $scope.Attachments = Attachments;
    $scope.editGeneralInfo = function() {
        $state.go('EditEvacuation', { id: $scope.Evacuation.Id });
    }
    $scope.editTypes = function() {
        $state.go('EditEvacuationTypes', { id: $scope.Evacuation.Id });
    }
    $scope.EditExtension = function(index) {
        $state.go('EditExtension', { id: $scope.Evacuation.Id, ext: index, end: '' });
    }
	$scope.NewExtension = function() {
		if ($scope.Evacuation.Extensions.length == 6) {
			$state.go('EditExtension', { id: $scope.Evacuation.Id, etx: {}, end: '' });
		}
		$state.go('EditExtension', { id: $scope.Evacuation.Id, etx: {}, end: '' });
	}
	$scope.End = function() {
		$state.go('EditExtension', { id: $scope.Evacuation.Id, etx: {}, end: true });
	}
    $scope.Attaching = false;
    $scope.uploadFile = function(){
            $scope.attaching = true;
            var file = $scope.myFile;
            var fileData = $scope.fileData;
            $scope.Evacuation.AddAttachment(fileData,file.name).then(function(responseData) {
                $scope.myFile = null;
                $scope.fileData = null;
                $('#inpFile').val('');
                $scope.Evacuation.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                $scope.Attachments.push({ FileName: file.name , ServerRelativeUrl: responseData.data.d.ServerRelativeUrl});
                toastr.success('Upload Succesful.', 'File attached.');
                $scope.attaching = false;
            }, function(error) {
                toastr.error('File upload failed: ' + JSON.stringify(error.data.error.message.value), 'Upload Failed');
                $scope.attaching = false;
            });
        };
    $scope.removeAttachment = function(fileName) {
        $scope.Evacuation.RemoveAttachment(fileName).then(function(responseData) {
            angular.forEach($scope.Attachments, function(value, index) {
                if (value.FileName == fileName) {
                    $scope.Attachments.splice(index, 1);
                    $scope.Evacuation.Attachments.splice(index, 1);
                }
            });
            toastr.success('Attachment Deleted');
        }, function(error) {
            toastr.error('Attachment Removal Failed');
        })
    }
}])
.controller('EditEvacuationController',["$scope","$q","$state","toastr","Evacuation","LOVs",'Attachments','ValidationService', function($scope,$q,$state,toastr,Evacuation,LOVs,Attachments,ValidationService) {
    $scope.Evacuation = Evacuation;
    $scope.Bureaus = LOVs.Bureaus;
    $scope.EvacuationTypes = LOVs.EvacuationTypes;
    $scope.Evacuees = LOVs.Evacuees;
    $scope.Posts = LOVs.Posts;
    $scope.Reasons = LOVs.Reasons;
    $scope.Attachments = Attachments;
    $scope.Countries = LOVs.Countries;
    $scope.isDisabled = false;
    $scope.setEndDate = function() {
        $scope.Evacuation.SetEndDate();
    }
    if (!$scope.Evacuation.Id) {
       $scope.Evacuation.Status = "Active"
    }
    $scope.UpdatePosts = function() {
        if ($scope.Evacuation.Countries) {
            $scope.Posts = _.filter(LOVs.Posts, function(p){
                var found = false;
                if (p.FilterValue == $scope.Evacuation.Countries) {
                    return true;
                }            
            })
        }
    }
    $scope.save = function() {	
		if($scope.isDisabled == false)
		{
	    	$scope.isDisabled = true;
			var messages = ValidationService.validateEvacuation($scope.Evacuation);
			if (messages.length == 0) {			
		        $scope.Evacuation.SaveEvacuation().then(function(res) {
		            $state.go('ViewEvacuation', { id: $scope.Evacuation.Id });
		            toastr.success('Evacuation saved.', 'Success');
		        }, function(err) {
		        	$scope.isDisabled = false;
		            toastr.error('Error saving evacuation.','Error');
		        })
		   	}else {
				var out = "";
				angular.forEach(messages, function(value, index) {
					out += '- ' + value + "<br>";
				});
				toastr.error(out, 'Invalid Input', { allowHtml: true });
				$scope.isDisabled = false;
			}
		}
    }
    $scope.cancel = function() {
        if ($scope.Evacuation.Id) {
            $state.go("ViewEvacuation", { id: $scope.Evacuation.Id });
        } else {
            $state.go('home');
        }
    }
}])
.controller('EditExtensionController',['$scope','$state','$stateParams','toastr','Evacuation','LOVs','Extension',function($scope,$state,$stateParams,toastr,Evacuation,LOVs,Extension){
	$scope.Ext = $stateParams.ext;
	$scope.Evacuation = Evacuation;
	$scope.Extension = Extension;
	if ($scope.Extension.ExtensionLabel != 'Ended') {
		$scope.EvacuationTypes = LOVs.EvacuationTypes;
		$scope.PersonnelTypes = LOVs.PersonnelTypes;
	}
	$scope.CableTypes = [$scope.Evacuation.Posts[0], "State", "Everest"];
	$scope.setEndDate = function() {
        $scope.Extension.EndDate =  $scope.Evacuation.GetExtensionEndDate($scope.Extension.StartDate);
    }
    $scope.AttachTypes = ["File","Url"];
	    $scope.uploadActionMemo = function(){
        $scope.attachingMemo = true;
        var file = $scope.memoFile;
        var fileData = $scope.fileData;
        $scope.Evacuation.AddAttachment(fileData,file.name).then(function(responseData) {
            var newMemo = {
                Title: $scope.memoFile.Title,
                Url: responseData.data.d.ServerRelativeUrl,
                FileName: $scope.memoFile.name
            };
            $scope.NewExtension.ActionMemo.push(newMemo);
            $scope.memoFile = null;
            $scope.fileData = null;
            $('#inpActionMemo').val('');
            toastr.success('Upload Succesful.', 'File attached.');
            $scope.attachingMemo = false;
            
        }, function(error) {
            toastr.error('File upload failed: ' + JSON.stringify(error.data.error.message.value), 'Upload Failed');
            $scope.attachingMemo = false;
        });
    };
    $scope.removeMemo = function(fileName) {
        $scope.Evacuation.RemoveAttachment(fileName).then(function(responseData) {
            angular.forEach($scope.Extension.ActionMemo, function(value, index) {
                if (value.FileName == fileName) {
                    $scope.Extension.ActionMemo.splice(index, 1);
                }
            });
            toastr.success('Attachment Deleted');
        }, function(error) {
            toastr.error('Attachment Removal Failed');
        })
    }
    $scope.uploadCable = function(){
    	if($scope.Cable.Attach == 'File')
    	{
	        $scope.attachingCable = true;
	        var file = $scope.cableFile;
	        var fileData = $scope.fileData;
	        $scope.Evacuation.AddAttachment(fileData,file.name).then(function(responseData) {
	            var newCable = {
	                Title: $scope.cableFile.Title,
	                Url: responseData.data.d.ServerRelativeUrl,
	                FileName: $scope.cableFile.name,
	                Type: $scope.Cable.CableType
	            };
	            $scope.Extension.Cables.push(newCable);
	            $scope.cableFile = null;
	            $scope.fileData = null;
	            $('#inpCableFile').val('');
	            toastr.success('Upload Succesful.', 'File attached.');
	            $scope.attachingCable = false;
	            
	    		$scope.Cable.Attach = null
	    		$scope.Cable.CableType = null
	        }, function(error) {
	            toastr.error('File upload failed: ' + JSON.stringify(error.data.error.message.value), 'Upload Failed');
	            $scope.attachingCable = false;
	        });    	
    	}
    	
    	if($scope.Cable.Attach == 'Url')
    	{
    		var url = $scope.cableUrl.Url
    		var verifyHttp = (!IsNullOrUndefined(url) && !!url)?(url.startsWith("http://")):(false);
    		if(!verifyHttp)
    		{
    			$scope.cableUrl.Url = (!IsNullOrUndefined(url) && !!url)?("http://" + $scope.cableUrl.Url):("http://intranet.state.sbu/Pages/Home.aspx");
    		}
			var newCable = {
	            Title: $scope.cableUrl.Title,
	            Url: $scope.cableUrl.Url,
	            FileName: $scope.cableUrl,
	            Type: $scope.Cable.CableType
	        };
			$scope.Extension.Cables.push(newCable);
			$scope.cableUrl.Title = null
			
			$scope.cableUrl.Url = null
	    	$scope.Cable.Attach = null
	    	$scope.Cable.CableType = null
    	}
    };
    $scope.removeCable = function(cable) {
    	
    	var type = typeof cable.FileName
		switch(type ) {
		    case 'string':
		        $scope.Evacuation.RemoveAttachment(cable.FileName).then(function(responseData) {
		            angular.forEach($scope.Extension.Cables, function(value, index) {
		                if (value.FileName == cable.FileName) {
		                    $scope.Extension.Cables.splice(index, 1);
		                }
		            });
		            toastr.success('Attachment Deleted');
		        }, function(error) {
		            toastr.error('Attachment Removal Failed');          
		        })
		        break;
		    case 'object':
		            angular.forEach($scope.Extension.Cables, function(value, index) {
		                if (value.Url == cable.Url) {
		                    $scope.Extension.Cables.splice(index, 1);
		                }
		            });
		        break;
		}
    
    }
    $scope.AddEvacuees = function(){
		if (!!$scope.EvacueeType || $scope.PersonnelType) {
			var Evacuees = {
				Type: $scope.EvacueeType,
				Personnel: $scope.PersonnelType	
			}
			if($scope.PersonnelType == 'Other')
			{
				Evacuees.Personnel = $scope.PersonnelTypeOther
			}    	
			$scope.Extension.Evacuees.push(Evacuees)    	
			$scope.EvacueeType = null
			$scope.PersonnelType = null
			$scope.PersonnelTypeOther = null
		}	
    }
    $scope.removeEvacuee= function(Evacuee){
        angular.forEach($scope.Extension.Evacuees, function(value, index) {
            if (index == Evacuee) {
                $scope.Extension.Evacuees.splice(index, 1);
            }
        });
	}
	$scope.Delete = function() {
		$scope.Evacuation.Extensions.splice($stateParams.ext);
		if ($scope.Evacuation.Extensions.length == 0 || $scope.Evacuation.Extensions[$scope.Evacuation.Extensions.length - 1].ExtensionLabel != 'Ended') {
			$scope.Evacuation.Status = 'Active';
		} else {
			$scope.Evacuation.Status = 'Ended';
		}
		$scope.Evacuation.SaveEvacuation().then(function(res) {
			$state.go('ViewEvacuation', {id: $scope.Evacuation.Id});
			toastr.success('Extension Saved', 'Success');
		}, function(err) {
			$toastr.error('Error saving extension.','Error');
		});
	}
	$scope.SaveEvacuation = function() {
		if ($scope.Extension.ExtensionLabel == 'Ended') {
			$scope.Extension.StartDate = '';
		}
		if (!!$stateParams.ext) {
			$scope.Evacuation.Extensions[$stateParams.ext] = $scope.Extension;
		} else {
			$scope.Evacuation.Extensions.push($scope.Extension);
		}
		if ($scope.Evacuation.Extensions.length == 0 || $scope.Evacuation.Extensions[$scope.Evacuation.Extensions.length - 1].ExtensionLabel != 'Ended') {
			$scope.Evacuation.Status = 'Active';
		} else {
			$scope.Evacuation.Status = 'Ended';
		}
		$scope.Evacuation.SaveEvacuation().then(function(res) {
			$state.go('ViewEvacuation', {id: $scope.Evacuation.Id});
			toastr.success('Extension Saved', 'Success');
		}, function(err) {
			$toastr.error('Error saving extension.','Error');
		});
	}
	$scope.Cancel = function() {
		$state.go('ViewEvacuation', {id: $scope.Evacuation.Id });
	}
}])
.controller('ViewAllEvacuationsController',["$scope","$q","$state","toastr","Evacuations",function($scope,$q,$state,toastr,Evacuations) {
	$scope.Evacuations = Evacuations.slice(0);
	$scope.NumberOfPages = Math.ceil($scope.Evacuations.length/20)//determining the size of te pages with 20 per page
	
	angular.forEach($scope.Evacuations , function(evac, index) {
		evac.Posts = evac.Posts.toString()
	});
	
	$scope.Evacuations = _.sortBy($scope.Evacuations, 'StartDate').reverse() //initially sorting by start date		
	$scope.EvacuationArrays = PageBodyBuilder($scope.Evacuations);
    	
    
	$scope.Evacuations = Evacuations.slice(0); // resetting evacs	

    	
	var temp = []
    for (i = 1; i < $scope.NumberOfPages+1; i++) {
    	var pageObj = {
    		PageNumber: i,
    		Active: null
    	}
    	if(i==1){pageObj.Active = "active"}
		temp.push(pageObj)
    }
    $scope.NumberOfPages = temp    
    
    $scope.ActivePagenumber = 0//initial page number should be the first one(i.e. index 0)     
    
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
    
    
    $scope.tableHeaders = []
    var postHeader = {}
    postHeader.Title = "Post"
    postHeader.ascendingDescending = 0
    $scope.tableHeaders.push(postHeader)
    var countriesHeader = {}
    countriesHeader.Title = "Country"
    countriesHeader.ascendingDescending = 0
    $scope.tableHeaders.push(countriesHeader )
    var SdHeader = {}
    SdHeader.Title = "Start Date"
    SdHeader.ascendingDescending = 1
    $scope.tableHeaders.push(SdHeader)
    var EdHeader = {}
    EdHeader.Title = "End Date"
    EdHeader.ascendingDescending = 0
    $scope.tableHeaders.push(EdHeader)
    
    $scope.sortTable = function(sortType){
    
	    var sortBy = _.findWhere($scope.tableHeaders, {Title: sortType});
    
    
		switch(sortType) {
			case "Post":
			
				switch(sortBy.ascendingDescending ) {
					case 0:
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'StartDate').reverse() 
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'Posts')					
						$scope.EvacuationArrays = PageBodyBuilder($scope.Evacuations);
						
						$scope.tableHeaders = setHeaderToZero($scope.tableHeaders)
						$scope.tableHeaders = setHeaderToOne($scope.tableHeaders,sortType)
						break;
					case 1:
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'StartDate').reverse() 
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'Posts').reverse()					
						$scope.EvacuationArrays = PageBodyBuilder($scope.Evacuations);
						
						$scope.tableHeaders = setHeaderToZero($scope.tableHeaders)
						break;
				}
				
				break;
			case "Country":
					
				switch(sortBy.ascendingDescending ) {
					case 0:
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'StartDate').reverse() 
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'Countries')						
						$scope.EvacuationArrays = PageBodyBuilder($scope.Evacuations);

						$scope.tableHeaders = setHeaderToZero($scope.tableHeaders)
						$scope.tableHeaders = setHeaderToOne($scope.tableHeaders,sortType)
						break;
					case 1:
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'StartDate').reverse() 
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'Countries').reverse()					
						$scope.EvacuationArrays = PageBodyBuilder($scope.Evacuations);

						$scope.tableHeaders = setHeaderToZero($scope.tableHeaders)
						break;
				}		
				break;
			case "Start Date":			
				switch(sortBy.ascendingDescending ) {
					case 0:
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'StartDate').reverse() 				
						$scope.EvacuationArrays = PageBodyBuilder($scope.Evacuations);

						$scope.tableHeaders = setHeaderToZero($scope.tableHeaders)
						$scope.tableHeaders = setHeaderToOne($scope.tableHeaders,sortType)
						break;
					case 1:
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'StartDate') 				
						$scope.EvacuationArrays = PageBodyBuilder($scope.Evacuations);

						$scope.tableHeaders = setHeaderToZero($scope.tableHeaders)
						break;
				}			
				break;
			case "End Date":

				switch(sortBy.ascendingDescending ) {
					case 0:
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'EndDate').reverse() 
						$scope.EvacuationArrays = PageBodyBuilder($scope.Evacuations);

						$scope.tableHeaders = setHeaderToZero($scope.tableHeaders)
						$scope.tableHeaders = setHeaderToOne($scope.tableHeaders,sortType)
						break;
					case 1:
						$scope.Evacuations = _.sortBy($scope.Evacuations, 'EndDate') 
						$scope.EvacuationArrays = PageBodyBuilder($scope.Evacuations);

						$scope.tableHeaders = setHeaderToZero($scope.tableHeaders)
						break;
				}				
				break;
		}
		$scope.Evacuations = Evacuations.slice(0);
    }
    
    
}])


function setHeaderToOne(headers,selectedHeader){
	angular.forEach(headers, function(headerObj, index) {
		if(headerObj.Title == selectedHeader){headerObj.ascendingDescending = 1}
	});
	return headers
}

function setHeaderToZero(headers){
	angular.forEach(headers, function(headerObj, index) {
		headerObj.ascendingDescending = 0
	});
	return headers
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