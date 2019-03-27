angular.module('UtilityModule',['LocalStorageModule','ConfigModule'])
.service('UtilityService', ['localStorageService','$q','$window','$http','ConfigService', function(localStorageService,$q,$window,$http,ConfigService) {
	return {
		getFiscalYears: function(start) {
			start = (!IsNullOrUndefined(start) && !!start) ? (start) : (2005);
			var years = [];
			var year = new Date().getFullYear();
			var month = new Date().getMonth();
			if (month >= 9) {
				years.push((year + 1).toString().substr(2,2));
			}
			while (year > start) {
				years.push(year.toString().substr(2,2));
				year -= 1;
			}
			return years;
		},
		getFiscalYear: function(dt) {
			if (typeof dt != Date) {
				dt = new Date(dt);
			}
			var year = dt.getYear().toString().substring(dt.getYear().toString().length - 1,dt.getYear().toString().length);
			if (dt.getMonth() > 8) {
				year = parseFloat(year) + 1;
			}
			return year;
		},
		getTwoDigitFiscalYear: function(dt) {
			if (typeof dt != Date) {
				dt = new Date(dt);
			}
			var year = dt.getYear().toString().substring(dt.getYear().toString().length - 2,dt.getYear().toString().length);
			if (dt.getMonth() > 8) {
				year = (parseFloat(year) + 1).toString();
			}
			return year;
		},
		getFiscalQuarter: function(newDate) {
		
			var Quarter = 0
	
			var FiscalDate = new Date(newDate);
			var month = FiscalDate.getUTCMonth() + 1
			var day = FiscalDate.getUTCDate()
			
			if (month >= 10 && month <= 12) {
				Quarter = 1
			} else if (month >= 1 && month <= 3) {
				Quarter = 2
			} else if (month >= 4 && month <= 6) {
				Quarter = 3
			} else if (month >= 7 && month <= 9) {
				Quarter = 4
			}			
			
			return Quarter;
		},

		getRequestDigest: function() {
			var ret = $q.defer();
			ret.promise = $http({
			url: ConfigService.getSiteRoot() + "/_api/contextinfo", 
			headers: { accept: "application/json;odata=verbose" },
			method: "POST"
			}).then(function(responseData) {
			    var response = responseData.data.d.GetContextWebInformation.FormDigestValue;
				ret.resolve({ data: response });
  			}, function(error) {
  				ret.reject(error);
  			});
			return ret.promise;
		},
		getListMetadataType: function(listName) {
			var ret = $q.defer()
			if (localStorageService.get('metadata_' + listName)) {
				ret.resolve(localStorageService.get('metadata_' + listName));				
			} else {
				ret.promise = $http({
					method: 'GET',
					url: ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')",
					headers: { accept: "application/json;odata=verbose" }
				}).then(function(responseData) {
					localStorageService.set('metadata_' + listName, responseData.data.d.ListItemEntityTypeFullName);
					ret.resolve(responseData.data.d.ListItemEntityTypeFullName);
				}, function(error) {
					ret.reject({ error: error });
				});
			}
			return ret.promise;
		},
		getItemEtag: function(itemId,listName) {
			var retVal = $q.defer();
			retVal.promise = $http({
				method: 'GET',
				url: ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')/items(" + itemId + ")"
			}).then(function(responseData) {
				retVal.resolve(responseData.data.d.__metadata);
			}, function(error) {
				retVal.reject({ message: 'Error finding eTag', error: error });
			})
			return retVal.promise;
		},
		getItems: function(filter,listName) {
			
			if(filter != undefined)
			{
				var verifyTopFilter = filter.includes("$top=")
				if(!verifyTopFilter){filter = filter + "&$top=15000"}
			}
			
			var ret = $q.defer();
			$http.defaults.headers.common.Accept = "application/json;odata=verbose";
			ret.promise = $http({
				method: 'GET',
				url: ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')/items" + ((filter != undefined)?(filter):("?$top=15000"))
			}).then(function(responseData) {
				ret.resolve({ data: responseData.data.d.results });
			}, function(error) {
				ret.reject({ error: error });				
			});
			return ret.promise;
		},
		getItemsStreamed: function(url) {
			var retVal = $q.defer();
			retVal.promise = $http({
				method: 'GET',
				url: url
			}).then(function(res) {
				retVal.resolve({ data: res.data.d.results, __next: res.data.d.__next });
			}, function(err) {
				retVal.reject(err);
			});
			return retVal.promise;
		},
		getItemsCAML: function(filter,listName) {
			return this.getRequestDigest().then(function(responseData) {
				var retVal = $q.defer();
				$http.defaults.headers.post['X-RequestDigest'] = responseData.data;
				$http.defaults.headers.post['X-HTTP-Method'] = "";
			    $http.defaults.headers.post['If-Match'] = "";
				$http.defaults.headers.common.Accept = "application/json;odata=verbose";  
				$http.defaults.headers.post['Content-Type'] = 'application/json;odata=verbose';  
				var requestBody = '{ "query" : {"__metadata": { "type": "SP.CamlQuery" } , "ViewXml": "' + filter + '" } }';
				retVal.promise = $http.post(ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')/GetItems", requestBody).then(function(res) {
					retVal.resolve(res.data.d.results);
				}, function(err) {
					retVal.reject(err);
				})
				return retVal.promise;
			});
		},
		getItemMetadata: function(id,listName) {
			var ret = $q.defer();
			$http.defaults.headers.common.Accept = "application/json;odata=verbose";
			ret.promise = $http({
				method: 'GET',
				url: ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')/items(" + id + ")"
			}).then(function(responseData) {
				ret.resolve(responseData.data.d);
			}, function(error) {
				ret.reject({ error: error });				
			});
			return ret.promise;
		},
		getItem: function(id,query,listName) {
			var ret = $q.defer();
			$http.defaults.headers.common.Accept = "application/json;odata=verbose";
			ret.promise = $http({
				method: 'GET',
				url: ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')/items(" + id + ")" + query
			}).then(function(responseData) {
				ret.resolve({ data: responseData.data.d });
			}, function(error) {
				ret.reject({ error: error });				
			});
			return ret.promise;
		},
		createItem: function(item,listName) {
			var metadata = this.getListMetadataType(listName);
			var requestDigest = this.getRequestDigest();
			return $q.all([metadata, requestDigest]).then(function(arrayOfResponses) {
				var retVal = $q.defer();
				item.__metadata = { 'type': arrayOfResponses[0] };
			    $http.defaults.headers.common.Accept = "application/json;odata=verbose";  
			    $http.defaults.headers.post['Content-Type'] = 'application/json;odata=verbose';  
			    $http.defaults.headers.post['X-RequestDigest'] = arrayOfResponses[1].data;
				$http.defaults.headers.post['X-HTTP-Method'] = "";
			    $http.defaults.headers.post['If-Match'] = "";
				retVal.promise = $http.post(ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')/items", item).then(function(responseData) {
					retVal.resolve(responseData.data);
				}, function (error) {
				    retVal.reject(error);
					console.log(error);
				})
				return retVal.promise;
			});
		},
		updateItem: function(item,listName) {
			var that = this;
			var oldItem = that.getItemMetadata(item.Id,listName);
			var requestDigest = this.getRequestDigest();
			return $q.all([ oldItem, requestDigest ]).then(function(response) {
				var retVal = $q.defer();
				var etag = response[0].__metadata.etag;
				item.__metadata.type = response[0].__metadata.type;
				var requestDigest = response[1].data;
			    $http.defaults.headers.common.Accept = "application/json;odata=verbose";  
			    $http.defaults.headers.post['Content-Type'] = 'application/json;odata=verbose';  
			    $http.defaults.headers.post['X-RequestDigest'] = requestDigest;
			    $http.defaults.headers.post['X-HTTP-Method'] = "MERGE";
			    $http.defaults.headers.post['If-Match'] = etag;
				retVal.promise = $http.post(ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')/items(" + item.Id + ")", item)
					.then(function(responseData) {
						retVal.resolve(responseData.data);
					}, function (error) {
					    retVal.reject(error);
						console.log(error);
					});
				return retVal.promise;
			});
		},	
		deleteItem: function(id,listName) {
			var that = this;
			var oldItem = that.getItemMetadata(id,listName);
			var requestDigest = this.getRequestDigest();
			return $q.all([ oldItem, requestDigest ]).then(function(response) {
				var retVal = $q.defer(); 
				var etag = response[0].__metadata.etag;
			    $http.defaults.headers.post['X-RequestDigest'] = response[1].data;
			    $http.defaults.headers.post['If-Match'] = etag;
			    $http.defaults.headers.post['X-HTTP-Method'] = "DELETE";
				retVal.promise = $http.post(ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')/items(" + id + ")", {}).then(function(responseData) {
					retVal.resolve(responseData.data);
				}, function (error) {
				    retVal.reject(error);
					console.log(error);
				})
				return retVal.promise;
			})
		},
		getAttachments: function(id,listName) {
			var ret = $q.defer();
			$http.defaults.headers.common.Accept = "application/json;odata=verbose";
			ret.promise = $http({
				method: 'GET',
				url: ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')/items(" + id + ")" + "?$select=Attachments,AttachmentFiles,Id&$expand=AttachmentFiles"
			}).then(function(responseData) {
				ret.resolve(responseData.data.d.AttachmentFiles.results);
			}, function(error) {
				ret.reject({ error: error });				
			});
			return ret.promise;
		},
		addAttachment: function(fileData,id,name,listName) {
			return this.getRequestDigest().then(function(responseData) {
				var retVal = $q.defer();
			    $http.defaults.headers.common.Accept = "application/json;odata=verbose";  
			    $http.defaults.headers.post['Content-Type'] = 'application/json;odata=verbose';  
			    $http.defaults.headers.post['X-HTTP-Method'] = "";
				$http.defaults.headers.post['If-Match'] = "";
				$http.defaults.headers.post['X-RequestDigest'] = responseData.data;
				var retVal = $q.defer();
				var uploadUrl = ConfigService.getSiteRoot() + "_api/web/lists/getbytitle('" + listName + "')/items(" + id + ")/AttachmentFiles/ add(FileName='" + name + "')";
			    retVal.promise = $http({
			    	method: 'POST',
			    	url: uploadUrl,
			    	transformRequest: [],
			    	headers: {
			    		'Accept': "application/json;odata=verbose",
			    		'Content-Type': 'undefined',
			    		'X-RequestDigest': responseData.data,
			    		'X-Requested-With': 'XMLHttpRequest'
			    	},
			    	data: new Uint8Array(fileData)
			    })
			    .then(function(responseData) {
			    	retVal.resolve(responseData);
			    }, function(error) {
			    	retVal.reject(error);
			    })
			    return retVal.promise;
	        }, function(error) {
		    	toastr.error('Error','The system failed to execute an operation.');
		    	$state.go('expensecomplete');
	        })
		},
		deleteAttachment: function(itemId,fileName,listName) {
			return this.getRequestDigest().then(function(responseData) {
				var retVal = $q.defer(); 
			    $http.defaults.headers.post['X-RequestDigest'] = responseData.data;
			    $http.defaults.headers.post['IF-MATCH'] = "*";
			    $http.defaults.headers.post['X-HTTP-Method'] = "DELETE";
				retVal.promise = $http.post(ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + listName + "')/items(" + itemId + ")/AttachmentFiles/getbyFileName('" + fileName + "')", {}).then(function(responseData) {
					retVal.resolve(responseData.data);
				}, function (error) {
				    retVal.reject(error);
					console.log(error);
				})
				return retVal.promise;
			})
		}		
	}
}])