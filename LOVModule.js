angular.module('LOVModule', ['LocalStorageModule','UtilityModule','ConfigModule'])
.service('LOVService',['$q','$http','localStorageService','UtilityService','ConfigService',function($q,$http,localStorageService,UtilityService,ConfigService) {
	return {
		getLOVItems: function(type) {
			var ret = $q.defer();
			$http.defaults.headers.common.Accept = "application/json;odata=verbose";
			ret.promise = $http({
				method: 'GET',
				url: ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + ConfigService.getLOVListName() + "')/items?" + ((filter != undefined)?(filter):(''))
			}).then(function(responseData) {
				ret.resolve({ data: responseData.data.d.results });
			}, function(error) {
				ret.reject({ error: error });				
			});
			return ret.promise;
		},
		getAllotmentAuthorities: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'AllotmentAuthority'&$select=ValueOfItem", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getNewYears: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'NY'&$select=ValueOfItem", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
				}, function(error) {
					retVal.reject(error);
			})
			return retVal.promise;
		},
		getAppropriations: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Appropriation'&$select=ValueOfItem", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getBudgetObjectCodes: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'OperatingAllowance'&$select=ValueOfItem,BudgetObjectCOde", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					var obj = { "ValueOfItem": value.ValueOfItem, "BudgetObjectCode": value.BudgetObjectCOde };
					results.push(obj);
				})
				results = _.sortBy(results , 'ValueOfItem');
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getAllotments: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Allotment'&$select=ValueOfItem", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getFunds: function(fundFilter) {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Fund' and FilterValue eq'" + fundFilter + "'&$select=ValueOfItem", ConfigService.getLOVListName()).then(function(responseData) {
				var results = _.sortBy(responseData.data, 'ValueOfItem');
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			});
			return retVal.promise;
		},
		getAllotmentTypes: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'AllotmentType'&$select=ValueOfItem", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getFundingTypes: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'FundingType'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = _.sortBy(responseData.data, 'ValueOfItem');
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getAllotmentAgencies: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'AllotmentAgency'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getAgencies: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Agency'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getOperatingAllowances: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'OperatingAllowance'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getDetailedOperatingAllowances: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'OperatingAllowance'&$select=ValueOfItem,Title,NotesOnItem", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push({ValueOfItem: value.ValueOfItem, NotesOnItem: value.NotesOnItem, Title: value.Title });
				})
				results = _.sortBy(results , 'ValueOfItem');
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		/*getPostCodes: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Post'&$select=ValueOfItem,NotesOnItem,FilterValue&$top=1000", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.NotesOnItem);
				})
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},*/
		getReimbursementStatuses: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'ReimbursementStatus'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getPaymentTypes: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'PaymentType'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getPayees: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Payee'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getAccounts: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Account'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getBureaus: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Bureau'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getAdhocBureaus: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'AdhocBureau'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getAllBureaus: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'AdhocBureau' or TypeOfItem eq 'Bureau'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getRepresentationTypes: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'RepresentationType'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getPaymentReturnTypes: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'PaymentReturnType'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getPaymentReturnReasons: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'PaymentReturnReason'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getRewardsPrograms: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'RewardsProgram'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = [];
				angular.forEach(responseData.data, function(value, index) {
					results.push(value.ValueOfItem);
				})
				results = results.sort()
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getEvacuationTypes: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'EvacuationType'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = _.sortBy(responseData.data, 'ValueOfItem');
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getEvacuees: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Evacuee'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = _.sortBy(responseData.data, 'ValueOfItem');
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getPersonnelTypes: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'PersonnelType'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = _.sortBy(responseData.data, 'ValueOfItem');
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getCountries: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Country'&$select=ValueOfItem,Title,Id,NotesOnItem", ConfigService.getLOVListName()).then(function(responseData) {
				var results = _.sortBy(responseData.data, 'ValueOfItem');
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getPosts: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'Post'&$select=ValueOfItem,NotesOnItem,FilterValue", ConfigService.getLOVListName()).then(function(responseData) {
				var results = _.sortBy(responseData.data, 'ValueOfItem');
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		getEvacuationReasons: function() {
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItems("?$filter=TypeOfItem eq 'EvacuationReason'&$select=ValueOfItem,Title", ConfigService.getLOVListName()).then(function(responseData) {
				var results = _.sortBy(responseData.data, 'ValueOfItem');
				retVal.resolve(results);
			}, function(error) {
				retVal.reject(error);
			})
			return retVal.promise;
		},
		GetLabelObj: function(LovType, AddEdit)
		{
			var LOVObject = {}

			switch (LovType)
			{
				case 'Account':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Account',
			        	ValueOfItemLabel: 'Account Number',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: true,
			        	FilterValueLabel: 'Bureau'
			        }
			        break;
				case 'Agency':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Agency',
			        	ValueOfItemLabel: 'Agency Title',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }
			        break;
				case 'AllotmentAuthority':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Allotment Authority',
			        	ValueOfItemLabel: 'Allotment Authority',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }
			        break;
				case 'AllotmentAgency':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Allotment Agency',
			        	ValueOfItemLabel: 'Allotment Agency',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }
			        break;

				case 'Allotment':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Allotment',
			        	ValueOfItemLabel: 'Allotment Number',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }
			        break;
				case 'AllotmentType':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Allotment',
			        	ValueOfItemLabel: 'Allotment Type',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }
			        break;

				case 'Allotment':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Allotment Number',
			        	ValueOfItemLabel: 'Allotment Number',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'Appropriation':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Appropriation',
			        	ValueOfItemLabel: 'Appropriation Number',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'AdhocBureau':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Adhoc Bureau',
			        	ValueOfItemLabel: 'Bureau',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;

				case 'Bureau':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Bureau',
			        	ValueOfItemLabel: 'Bureau',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'DepositType':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Deposit Type',
			        	ValueOfItemLabel: 'Deposit Type',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'EvacuationReason':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Evacuation Reason',
			        	ValueOfItemLabel: 'Evacuation Reason',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'EvacuationType':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Evacuation Type',
			        	ValueOfItemLabel: 'Evacuation Type',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'Evacuee':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Evacuee',
			        	ValueOfItemLabel: 'Evacuee',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;

				case 'FundingType':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Funding Type',
			        	ValueOfItemLabel: 'Funding Type',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'Fund':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Fund',
			        	ValueOfItemLabel: 'Fund',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: true,
			        	FilterValueLabel: 'Appropriation'
			        }

			        break;

				case 'NY':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'NY',
			        	ValueOfItemLabel: 'NY',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'OperatingAllowance':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Operating Allowance',
			        	ValueOfItemLabel: 'Operating Allowance',
			        	NotesOnItemLabel: 'Purpose',
			        	BudgetObjectCodeLabel: 'Budget Object Code',
			        	FilterNeed: true,
			        	FilterValueLabel: 'Allotment'
			        }

			        break;
				case 'OperatingAllowanceSubCategory':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Operating Allowance Sub-Category',
			        	ValueOfItemLabel: 'Operating Allowance Sub-Category',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: true,
			        	FilterValueLabel: 'Operating Allowance'
			        }

			        break;
				case 'Payee':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Payee',
			        	ValueOfItemLabel: 'Payee Name',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'PaymentReturnReason':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Payment Return Reason',
			        	ValueOfItemLabel: 'Payment Return Reason',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'PaymentReturnType':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Payment Return Type',
			        	ValueOfItemLabel: 'Payment Return Type',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'PersonnelType':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Personnel Type',
			        	ValueOfItemLabel: 'Type',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'PostCode':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Post Code',
			        	ValueOfItemLabel: 'Post Code Number',
			        	NotesOnItemLabel: 'Post Code Location',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }
					break;
				case 'Program':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Program',
			        	ValueOfItemLabel: 'Program',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: true,
			        	FilterValueLabel: 'Appropriation'
			        }

			        break;
				case 'RppCode':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Rewards Program',
			        	ValueOfItemLabel: 'Code',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'RewardsProgram':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Rewards Program',
			        	ValueOfItemLabel: 'Program',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'RepresentationType':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Representation Type',
			        	ValueOfItemLabel: 'Type',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'Status':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Status',
			        	ValueOfItemLabel: 'Status Code',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;
				case 'ReimbursementStatus':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Reimbursement Status',
			        	ValueOfItemLabel: 'Reimbursement Status Code',
			        	NotesOnItemLabel: 'Notes',
			        	FilterNeed: false,
			        	FilterValueLabel: 'Filter'
			        }

			        break;

				case 'Signatory':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Signatory',
			        	ValueOfItemLabel: 'Name',
			        	NotesOnItemLabel: 'Phone',
			        	FilterNeed: true,
			        	FilterValueLabel: 'Bureau'
			        }

			        break;
				case 'Country':
					LOVObject = {
			        	AddEdit: AddEdit,
			        	Header: 'Countries',
			        	ValueOfItemLabel: 'Country',
			        	NotesOnItemLabel: 'Flag URL',
			        	FilterNeed: false,
			        	FilterValueLabel: ''
			        }
					break;
				case 'Post':
			        LOVObject= {
			        	AddEdit: AddEdit,
			        	Header: 'Post',
			        	ValueOfItemLabel: 'Post Name',
			        	NotesOnItemLabel: 'Post Code',
			        	FilterNeed: true,
			        	FilterValueLabel: 'Country'
			        }

			        break;


			}

			return LOVObject;
		}

	}
}])