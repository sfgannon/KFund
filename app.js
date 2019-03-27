angular.module('prototype',['ngResource','ui.router','ui.People','LocalStorageModule','ngAnimate','angular-notification-icons','toastr','angular-spinkit','HomeController','ViewObligationController','ViewAllotmentController','ViewPaymentController','ViewPaymentReturnController','ViewDepositController','ConfigModule','UtilityModule','LOVModule','BusinessObjectsModule','ChoseLOVController','AddEditLOVController','ValidationService','AccountManagementController','AccountAddEditController','SignatoryAddEditController','CheckbookController','YearEndReconciliationController','ObligationService','FinPlanModule','RepresentationViewController','DeobligationController','EvacuationsController','ViewAllNotificationsController','RPPController','SummaryFinPlanController','SummaryFinPlanService','NewFinPlanModule','AdjustmentModule','DeleteController','DeleteModule','SearchModule','GFMSModule']).run(['$rootScope','toastr','$state', function($rootScope,toastr,$state) {
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		event.preventDefault();
		if (error.hasOwnProperty('data.error')) {
			toastr.error(JSON.stringify(error.data.error.message.value), 'Error');
		} else {
			toastr.error('An error has occurred.','Error');
		}
		$state.go('home');
		$state.reload();
	});
	$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
		$rootScope.isStateLoading = true;
		$rootScope.homeLink = false;

		switch (toState.name) {
			case 'ViewAllotment':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditAllotment', {id: ''});
				}
				break;
			case 'ViewAccountAdjustment':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditAccountAdjustment', {id: ''});
				}
				break;
			case 'ViewAdjustment':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditAdjustment', {id: ''});
				}
				break;
			case 'EditAuthorizations':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditAllotment', {id: ''});
				}
				break;
			case 'ViewSOFs':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditAllotment', {id: ''});
				}
				break;
			case 'EditSOF':
				if (!toParams.AllotmentId) {
					e.preventDefault();
					$state.go('home');
				}
				break;
			case 'ViewReimbursements':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditAllotment', {id: ''});
				}
				break;
			case 'EditReimbursement':
				if (!toParams.AllotmentId) {
					e.preventDefault();
					$state.go('home');
				}
				break;
			case 'ViewObligation':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditObligation', {id: ''});
				}
				break;
			case 'EditObligationReimbursements':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditObligation', {id: ''});
				}
				break;
			case 'EditObligationPayments':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditObligation', {id: ''});
				}
				break;
			case 'ViewPayment':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditPayment', {id: ''});
				}
				break;
			case 'ViewDeposit':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditDeposit', {id: ''});
				}
				break;
			case 'ViewPaymentReturn':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditPaymentReturn', {id: ''});
				}
				break;
			case 'ManagePaymentReturnSources':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditPaymentReturn', {id: ''});
				}
				break;
			case 'ViewEvacuation':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditEvacuation', {id: ''});
				}
				break;
			case 'EditExtension':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditEvacuation', {id: ''});
				}
				break;
			case 'ViewGFMS':
				if (!toParams.id) {
					e.preventDefault();
					$state.go('EditGFMS', {id: ''});
				}
				break;
			default:
				break;
		}
	});
	$rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
		$rootScope.isStateLoading = false;
		if(toState.name != "home")
		{		
			$rootScope.homeLink = true;
		}
	});

}])
.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider,$compileProvider) {
	$compileProvider.debugInfoEnabled(false);
	localStorageServiceProvider.setPrefix('kfund_proto').setStorageType('sessionStorage');

	$stateProvider.state('root', {
		abstract: true,
		template: '<div ui-view></div>'
	})

    $urlRouterProvider.otherwise('/home');
        
    $stateProvider.state('home', {
    	parent: 'root',
        url: '/home',
        templateUrl: '../SiteAssets/KFundDev/Home/home.html',
        controller: 'HomeController',
        resolve: {
        	Transactions: function($q,ConfigService,UtilityService) { 
        		var filter = "?$filter=ItemType ne 'Alert' and ItemType ne 'RPP' and ItemType ne 'AccountBalance' and ItemType ne 'PriorYearReturn' and ItemType ne 'Evacuation'&$top=100&$orderby=Date desc"; 
        		var ListName = ConfigService.getTransactionListName();    	        
		 		return UtilityService.getItems(filter,ListName); 		
			},
			Alerts: function($q,BusinessObjectsFactory) {
				var alert = new BusinessObjectsFactory.Alert();
				return alert.GetAlerts();
			},
			Evacuations: function(BusinessObjectsFactory,$q) {
				var e = new BusinessObjectsFactory.Evacuation();
				return e.GetEvacuations();
			}
       }//end of resolve    
      

	 })//home state provider

	 $stateProvider.state('Search', {
		 parent: 'root',
		 url: '/Search',
		 templateUrl: '../SiteAssets/KFundDev/Search/Search.html',
		 controller: 'SearchController',
		 resolve: {
			 Appropriations: function(LOVService) {
				 return LOVService.getAppropriations();
			 },
			 Allotments: function(LOVService) {
				 return LOVService.getAllotments();
			 },
			 OperatingAllowances: function(LOVService) {
				 return LOVService.getOperatingAllowances();
			 },
			 FiscalYears: function(UtilityService) {
				 return UtilityService.getFiscalYears(2005);
			 },
			 Bureaus: function(LOVService) {
				 return LOVService.getBureaus();
			 },
			 AdhocBureaus: function(LOVService) {
				 return LOVService.getAdhocBureaus();
			 }
		 }
	 })
	 

	$stateProvider.state('ViewAllNotifications', {
		parent: 'root',
    	url: '/ViewAllNotifications',
     	templateUrl: '../SiteAssets/KFundDev/Notifications/ViewAllNotifications.html',
    	controller: 'ViewAllNotificationsController',
    	resolve: {
			Alerts: function($q,BusinessObjectsFactory) {
				var alert = new BusinessObjectsFactory.Alert();
				return alert.GetAllAlerts();
			}
		}//end of resolve	
    })//end of LOV state provider <-- dafuq?
	//End of NOTIFICATIONS State definition
	//Copy and paste better, Josh. -SG
	 
	$stateProvider.state('LOV', {
		parent: 'root',
    	url: '/LOV',
     	templateUrl: '../SiteAssets/KFundDev/LOVs/ChoseLOV.html',
    	controller: 'ChoseLOVController',
    	resolve: {
        	ListOfOptions: function($q,ConfigService,UtilityService) {
        		var ListName = ConfigService.getLOVListName();
        		var filter = undefined        
		 		return UtilityService.getItems(filter,ListName)	 		
			}
		}//end of resolve	
    })//end of LOV state provider

 
	$stateProvider.state('AddEditLOV', {
		parent: 'root',
    	url: '/AddEditLOV',
      	params: {
            LovObj: null,
            LovType: null,
            AddEdit: null
        },
     	templateUrl: '../SiteAssets/KFundDev/LOVs/AddEditLOV.html',
    	controller: 'AddEditLOVController',
    	resolve: {
			LOVObject: function($stateParams,$q,ConfigService,UtilityService,LOVService){
				if($stateParams.LovObj)
				{	//means this is EDIT					
					var LovObj = $stateParams.LovObj
					var Object = LOVService.GetLabelObj($stateParams.LovType, $stateParams.AddEdit)
					
					Object.ID = LovObj.ID
					Object.Title = LovObj.Title
					Object.ValueOfItem = LovObj.ValueOfItem
					Object.TypeOfItem = LovObj.TypeOfItem 
					Object.NotesOnItem = LovObj.NotesOnItem 
					Object.BudgetObjectCOde = LovObj.BudgetObjectCOde 
					Object.FilterValue= LovObj.FilterValue 	
					
				}
				else
				{	//means this is ADD
					var Object = LOVService.GetLabelObj($stateParams.LovType, $stateParams.AddEdit)
					Object.TypeOfItem = $stateParams.LovType
				}
				
				if(Object.FilterNeed)
				{
					var ListName = ConfigService.getLOVListName();
					
					switch ($stateParams.LovType)
					{
						case 'Account':
							//populate dropdown with bureaus
							var filter = "?$filter=TypeOfItem eq 'Bureau'&$select=ValueOfItem";							
					        break;
						case 'Fund':
							//populate dropdown with bureaus
							var filter = "?$filter=TypeOfItem eq 'Appropriation'&$select=ValueOfItem";							
					        break;
						case 'Signatory':
							//populate dropdown with bureaus
							var filter = "?$filter=TypeOfItem eq 'Bureau'&$select=ValueOfItem";							
					        break;
						case 'OperatingAllowance':
							//populate dropdown with 1007 or 2003
							var filter = "?$filter=TypeOfItem eq 'Allotment'&$select=ValueOfItem";							
					        break;
						case 'OperatingAllowanceSubCategory':
							//populate dropdown with operating allowance numbers
							var filter = "?$filter=TypeOfItem eq 'OperatingAllowance'&$select=ValueOfItem";							
					        break;
						case 'Program':
							//populate dropdown with appropriations							
							var filter = "?$filter=TypeOfItem eq 'Appropriation'&$select=ValueOfItem";							
					        break;
						case 'Post':
							var filter = "?$filter=TypeOfItem eq 'Country'&$select=ValueOfItem";	
							break;
					}
					
					var ListObject = $q.defer();
					ListObject.promise = UtilityService.getItems(filter,ListName).then(function(responseData) {
						ListObject.resolve(Object)
						Object.FilterOptions = _.pluck(responseData.data, 'ValueOfItem');	
						ListObject.resolve(Object)								
					}, function(err) {
						ListObject.reject(err);
					});	
					
					return ListObject.promise; 
				}

				
				
				return Object 
			}	
		}//end of resolve
    })//end of LOV state provider
    
	$stateProvider.state('GenerateRPP', {
		parent: 'root',
    	url: '/RPP',
     	templateUrl: '../SiteAssets/KFundDev/RPP/RPP.html',
    	controller: 'RPPController',
    	resolve: {
        	RewardsPrograms: function($q,LOVService) {
        		return LOVService.getRewardsPrograms(); 		
			},
			RPPs: function($stateParams,$q,BusinessObjectsFactory) {
				var retVal = $q.defer();
				var rpp = new BusinessObjectsFactory.RPP();
				retVal.promise = rpp.GetRPPs();
				return retVal.promise; 
			}
		}//end of resolve	
    })//end of RPP state provider

	$stateProvider.state('ViewRPP', {
		parent: 'root',
		url: '/ViewRPP/:id',
		templateUrl: '../SiteAssets/KFundDev/RPP/ViewRPP.html',
		controller: 'ViewRPPController',
		resolve: {
			RPP: function($q,$stateParams,BusinessObjectsFactory) {
				return new BusinessObjectsFactory.RPP($stateParams.id);
			},
			Payments: function($q,RPP) {
				return RPP.GetPayments()
			}
		}
	})


	$stateProvider.state('AccountManagement', {
		parent: 'root',
    	url: '/AccountManagement',
     	templateUrl: '../SiteAssets/KFundDev/AccountManagement/AccountManagement.html',
    	controller: 'AccountManagementController',
    	resolve: {
        	Accounts: function($q,ConfigService,UtilityService) {
        		var ListName = ConfigService.getLOVListName();;
        		var filter = "?$filter=TypeOfItem eq 'Account'";          
		 		return  UtilityService.getItems(filter, ListName)	 		
			}
		}//end of resolve	
    })//end of LOV state provider
    
	$stateProvider.state('AccountAddEdit', {
		parent: 'root',
    	url: '/AccountAddEdit/:ID',
     	templateUrl: '../SiteAssets/KFundDev/AccountManagement/AccountAddEdit.html',
    	controller: 'AccountAddEditController',
    	resolve: {
        	ListOfOptions: function($q,ConfigService,UtilityService) {
        		var ListName = ConfigService.getLOVListName();
        		var filter = "?$filter=TypeOfItem eq 'Bureau' or TypeOfItem eq 'Signatory' ";          
		 		return UtilityService.getItems(filter, ListName)	 		
			},
			Account: function($stateParams,$q,ConfigService,UtilityService){
				if($stateParams.ID)
				{			
					var ListName = ConfigService.getLOVListName();    
					var filter = "?$select=ID,ValueOfItem,TypeOfItem,NotesOnItem,FilterValue,POC/Title,POC/Id,POC/Name,POC/EMail&$expand=POC/Title,POC/Id,POC/Name,POC/EMail"    
		 			return UtilityService.getItem($stateParams.ID , filter , ListName)							
				}
			}

		}//end of resolve	
    })//end of Account state provider

 	$stateProvider.state('ViewSignatories', {
		parent: 'root',
    	url: '/ViewSignatories',
     	templateUrl: '../SiteAssets/KFundDev/AccountManagement/ViewSignatories.html',
    	controller: 'ViewSignatoriesController',
    	resolve: {
        	Signatories: function($q,ConfigService,UtilityService) {
        		var ListName = ConfigService.getLOVListName();
        		var filter = "?$filter=TypeOfItem eq 'Signatory'";          
		 		return UtilityService.getItems(filter,ListName)	 		
			}
		}//end of resolve	
    })//end of Sigantory state provider


 	$stateProvider.state('SignatoryAddEdit', {
		parent: 'root',
    	url: '/SignatoryAddEdit/:ID',
     	templateUrl: '../SiteAssets/KFundDev/AccountManagement/SignatoryAddEdit.html',
    	controller: 'SignatoryAddEditController',
    	resolve: {
        	ListOfOptions: function($q,ConfigService,UtilityService) {
        		var ListName = ConfigService.getLOVListName();
        		var filter = "?$filter=TypeOfItem eq 'Bureau'";          
		 		return UtilityService.getItems(filter,ListName)	 		
			},
			Signatory: function($q,$state,$stateParams,ConfigService,UtilityService) {
				var ListName = ConfigService.getLOVListName();
				var Signatory = ($stateParams.ID)?( UtilityService.getItem($stateParams.ID , "" , ListName) ):(null);
				return Signatory;
			}
		}//end of resolve	
    })//end of Sigantory state provider

	//New FinPlan
	$stateProvider.state('NewFinPlan', {
		parent: 'root',
		url: '/NewFinPlan/:FiscalYear',
		templateUrl: '../SiteAssets/KFundDev/FinPlan/FinPlan.html',
		controller: 'NewFinPlanController',
		resolve: {
			LOVs: function($q,$stateParams,LOVService) {
				var out = [];
				out.push(LOVService.getAppropriations());
				out.push(LOVService.getAllotments());
				out.push(LOVService.getDetailedOperatingAllowances());
				var retVal = $q.defer();
				retVal.promise = $q.all(out).then(function(res) {
					var LOVs = [];
					LOVs.Appropriations = res[0];
					LOVs.Allotments = res[1];
					LOVs.OperatingAllowances = res[2];
					retVal.resolve(LOVs);
				}, function(err) {
					retVal.reject(err);
				});
				return retVal.promise;
			},
			FiscalYears: function(UtilityService) {
				return UtilityService.getFiscalYears();
			},
			Report: function($stateParams,FinPlanFactory,LOVs,FiscalYears) {
				if (!!$stateParams.FiscalYear) {
					return FinPlanFactory.CreateFinPlan($stateParams.FiscalYear, LOVs.OperatingAllowances, LOVs.Allotments, LOVs.Appropriations);
				} else {
					$stateParams.FiscalYear = FiscalYears[0];
					return FinPlanFactory.CreateFinPlan($stateParams.FiscalYear, LOVs.OperatingAllowances, LOVs.Allotments, LOVs.Appropriations);
				}
			}
		}
	})

	$stateProvider.state('FinPlan', {
		parent: 'root',
    	url: '/FinPlan/:FiscalYear',
    	templateUrl: '../SiteAssets/KFundDev/Reports/FinPlan.html',
    	controller: 'FinPlanController',
    	resolve: {
        	AllTransactions: function($q,$stateParams,ConfigService,UtilityService) { 
   				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)
   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				}
				
	       		var filter = "?$filter=ItemType eq 'Obligation' and FiscalYear eq '" + FiscalYear + "' or ItemType eq 'Payment' and FiscalYear eq '" + FiscalYear + "' or ItemType eq 'PaymentReturn' and FiscalYear eq '" + FiscalYear + "' or ItemType eq 'Deposit' and FiscalYear eq '" + FiscalYear + "' or ItemType eq 'AccountAdjustment' and FiscalYear eq '" + FiscalYear + "' or ItemType eq 'Adjustment' and FiscalYear eq '" + FiscalYear + "' or ItemType eq 'PriorYearReturn' and FiscalYear eq '" + FiscalYear + "'"; 
        		var ListName =  ConfigService.getTransactionListName();    	        
		 		return  UtilityService.getItems(filter, ListName); 			 		
			},
        	ListOfOptions: function($q,ConfigService,UtilityService) {
        		var ListName = ConfigService.getLOVListName();;
        		var filter = "?$filter=TypeOfItem eq 'OperatingAllowance' or TypeOfItem eq 'Appropriation' ";         
		 		return  UtilityService.getItems(filter, ListName)	 		
			 },
			 LiquidatedAmounts: function($q,ObligationService,$stateParams,ConfigService,UtilityService,AllTransactions){
   			 	var newDate = new Date()
   			 	var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)
   				
			 	if($stateParams.FiscalYear != null){
			 		FiscalYear = $stateParams.FiscalYear
			 	}
				var payments = _.filter(AllTransactions.data, function(item) {
					return item.ItemType == 'Payment';
				});
				var obligations = _.filter(AllTransactions.data, function(item) {
					return item.ItemType == 'Obligation';
				});
			 	return ObligationService.QuickGetLiquidatedBalances(FiscalYear,payments, obligations)
			 },
			AvailableFiscalYears: function($q) {
				var promise = $q.defer()
				var years = [];
				var year = new Date().getFullYear();
				var month = new Date().getMonth();
				if (month >= 9) {
					years.push({ FiscalYear: (year + 1).toString().substr(2,2) });
				}
				while (year > 1999) {
					years.push({ FiscalYear: year.toString().substr(2,2) });
					year -= 1;
				}
				years = years.reverse();
				promise.resolve({data: years });
				return promise.promise;
			},
			GFMS: function($stateParams,$q,UtilityService,ConfigService,BusinessObjectsFactory) {
				var query = "";
				if (!IsNullOrUndefined($stateParams.FiscalYear) && $stateParams.FiscalYear != "") {
					query = "?$filter=ItemType eq 'GFMS' and FiscalYear eq " + $stateParams.FiscalYear;
				} else {
					query = "?$filter=ItemType eq 'GFMS'";
				}
				var retVal = $q.defer();
				retVal.promise = UtilityService.getItems(query,ConfigService.getTransactionListName()).then(function(res) {
					retVal.resolve(res.data);
				}, function(e) {
					retVal.reject(e);
				});
				return retVal.promise;
			}
		}//end of resolve		
    })//end of Reports state provider
    
    $stateProvider.state('RepresentationView', {
		parent: 'root',
    	url: '/RepresentationView',
    	params: {
            FiscalYear: null,
        },
    	templateUrl: '../SiteAssets/KFundDev/RepresentationView/RepresentationView.html',
    	controller: 'RepresentationViewController',
    	resolve: {
        	AllPayments: function($q,$stateParams,UtilityService,ConfigService) { 
   				
   				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)
   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				}
   				     	
        		var filter = "?$filter=ItemType eq 'Payment' and FiscalYear eq '" + FiscalYear + "'&$orderBy=Date asc"; 
        		var ListName = ConfigService.getTransactionListName();    	        
		 		return UtilityService.getItems(filter,ListName)	 			 		
			},
			AvailableFiscalYears:function($q,$stateParams,UtilityService,ConfigService) {    				     	
        		var filter = "?$filter=ItemType eq 'Payment' &$select=FiscalYear"; 
        		var ListName = ConfigService.getTransactionListName();    	        
		 		return UtilityService.getItems(filter,ListName)	 			 		
			},
        	RepresentationTypes: function($q,LOVService) {       
		 		return  LOVService.getRepresentationTypes()	 		
			 },
        	Bureaus: function($q,LOVService) {       
		 		return  LOVService.getBureaus()	 		
			 },
        	AdhocBureaus: function($q,LOVService) {       
		 		return  LOVService.getAdhocBureaus()	 		
			 }					 
		}//end of resolve		
    })//end of Reports state provider

	 
	$stateProvider.state('YearEndReconciliation', {
		parent: 'root',
    	url: '/YearEndReconciliation',
    	params: {
            FiscalYear: null,
        },
    	templateUrl: '../SiteAssets/KFundDev/Reports/YearEndReconciliation.html',
    	controller: 'YearEndReconciliationController',
    	resolve: {
        	AllObligations: function($q,$stateParams,ConfigService,UtilityService) { 
        	
   				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)
   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				}         	
        	
        		var filter = "?$filter=ItemType eq 'Obligation' and FiscalYear eq '" + FiscalYear + "'"; 
        		var ListName =  ConfigService.getTransactionListName();    	        
		 		return  UtilityService.getItems(filter, ListName)	 			 		
			},
        	ListOfOptions: function($q,ConfigService,UtilityService) {
        		var ListName = ConfigService.getLOVListName();;
        		var filter = "?$filter=TypeOfItem eq 'OperatingAllowance' or TypeOfItem eq 'Allotment' ";         
		 		return  UtilityService.getItems(filter, ListName)	 		
			},
			LiquidatedAmounts: function($q,$stateParams,ObligationService,ConfigService,UtilityService){
			
   				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)
   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				}				
				return ObligationService.GetLiquidatedBalances(FiscalYear)
			},
			AvailableFiscalYears:function($q,$stateParams,UtilityService,ConfigService) {    				     	
        		var filter = "?$filter=ItemType eq 'Obligation' &$select=FiscalYear"; 
        		var ListName = ConfigService.getTransactionListName();    	        
		 		return UtilityService.getItems(filter,ListName)	 			 		
			}
		}//end of resolve		
    })//end of Reports state provider
	
	$stateProvider.state('SummaryFinPlan', {
		parent: 'root',
		url: '/SummaryFinPlan',
    	params: {
            FiscalYear: null,
        },
		templateUrl: '../SiteAssets/KFundDev/Reports/SummaryFinPlan.html',
		controller: 'SummaryFinPlanController',
		resolve: {
			AvailableFiscalYears:function($q,$stateParams,UtilityService,ConfigService) {    				     	
        		var filter = "?$filter=ItemType eq 'Allotment' or ItemType eq 'Obligation' &$select=FiscalYear"; 
        		var ListName = ConfigService.getTransactionListName();    	        
		 		return UtilityService.getItems(filter,ListName)	 			 		
			},
			GetSOFs: function($q,$stateParams,ConfigService,UtilityService) { 			
				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				}		
				return UtilityService.getItems("?$filter=ItemType eq 'SOF' and FiscalYear eq '" + FiscalYear + "'",ConfigService.getTransactionListName());
			},
			ManageSOFs: function(GetSOFs,SummaryFinPlanService,$stateParams,UtilityService) {
   				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				} 
				return 	SummaryFinPlanService.CalculateSofObjects(GetSOFs.data,FiscalYear)						
			},
			GetObligations: function($q,BusinessObjectsFactory,UtilityService,ConfigService,$stateParams) {
				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				}
				return UtilityService.getItems("?$filter=ItemType eq 'Obligation' and Appropriation eq '0522' and FiscalYear eq '" + FiscalYear + "'",ConfigService.getTransactionListName())
			},
			ManageObligations: function(GetObligations,SummaryFinPlanService,$stateParams,UtilityService) {	
   				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				} 
				return 	SummaryFinPlanService.CalculateObligationObjects(GetObligations.data,FiscalYear)						
			},
			TotalSofAndObligation: function(ManageObligations,ManageSOFs) {
				var GrandTotal = {};
				GrandTotal.Title = "EDCS Availability as of " + new Date().toString();
				GrandTotal.Total = parseFloat(ManageSOFs.Total.Total) + parseFloat(ManageObligations.ObligationTotalRow.Total);
				GrandTotal.Evacuations = parseFloat(ManageSOFs.Total.Evacuations) + parseFloat(ManageObligations.ObligationTotalRow.Evacuations);
				GrandTotal.Other = parseFloat(ManageSOFs.Total.Other) + parseFloat(ManageObligations.ObligationTotalRow.Other);
				GrandTotal.UnrestrictedFunds = parseFloat(ManageSOFs.Total.UnrestrictedFunds) + parseFloat(ManageObligations.ObligationTotalRow.UnrestrictedFunds);
				GrandTotal.RestrictedFunds = parseFloat(ManageSOFs.Total.RestrictedFunds) + parseFloat(ManageObligations.ObligationTotalRow.RestrictedFunds);
				return GrandTotal;
			},
			GetRecoveries: function($stateParams,UtilityService,ConfigService) {	
				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				}
				return UtilityService.getItems("?$filter=ItemType eq 'PriorYearReturn' and FiscalYear eq '" + FiscalYear + "'",ConfigService.getTransactionListName())						
			},
			ManageRecoveries: function(GetRecoveries,SummaryFinPlanService,$stateParams,UtilityService) {	
   				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				} 
				return 	SummaryFinPlanService.CalculateRecoveries(GetRecoveries.data,FiscalYear)						
			},
			GrandTotal: function(ManageRecoveries,TotalSofAndObligation){
				var GrandTotal = {};

				GrandTotal.Total = parseFloat(ManageRecoveries.Total.Total) + parseFloat(TotalSofAndObligation.Total);
				GrandTotal.Evacuations = parseFloat(ManageRecoveries.Total.Evacuations) + parseFloat(TotalSofAndObligation.Evacuations);
				GrandTotal.Other = parseFloat(ManageRecoveries.Total.Other) + parseFloat(TotalSofAndObligation.Other);
				GrandTotal.UnrestrictedFunds = parseFloat(ManageRecoveries.Total.UnrestrictedFunds) + parseFloat(TotalSofAndObligation.UnrestrictedFunds);
				GrandTotal.RestrictedFunds = parseFloat(ManageRecoveries.Total.RestrictedFunds) + parseFloat(TotalSofAndObligation.RestrictedFunds);
				return GrandTotal;
			
			},
			AllTotalsDividedByOneThousand:  function(ManageSOFs,ManageObligations,TotalSofAndObligation,ManageRecoveries,GrandTotal){
				//SOF Section
				ManageSOFs.SOFs.forEach(function(SOF,index) {
					SOF.Evacuations = Math.round(SOF.Evacuations/1000)
					SOF.Other= Math.round(SOF.Other/1000)
					SOF.RestrictedFunds = Math.round(SOF.RestrictedFunds/1000)
					SOF.UnrestrictedFunds= Math.round(SOF.UnrestrictedFunds/1000)
					SOF.Total= Math.round(SOF.Total/1000)
				})
				ManageSOFs.Total.Evacuations = Math.round(ManageSOFs.Total.Evacuations/1000)
				ManageSOFs.Total.Other= Math.round(ManageSOFs.Total.Other/1000)
				ManageSOFs.Total.RestrictedFunds = Math.round(ManageSOFs.Total.RestrictedFunds/1000)
				ManageSOFs.Total.UnrestrictedFunds= Math.round(ManageSOFs.Total.UnrestrictedFunds/1000)
				ManageSOFs.Total.Total= Math.round(ManageSOFs.Total.Total/1000)
			
				
				
				//Obligations
				ManageObligations.EvacRows.forEach(function(Obligation,index) {
					Obligation.EvacuationAmount =  Math.round(Obligation.EvacuationAmount/1000)
				})
				ManageObligations.EvacuationTotalRow.Total =  Math.round(ManageObligations.EvacuationTotalRow.Total/1000)
				
				ManageObligations.ObligationTotalRow.Evacuations =  Math.round(ManageObligations.ObligationTotalRow.Evacuations/1000)
				ManageObligations.ObligationTotalRow.Other=  Math.round(ManageObligations.ObligationTotalRow.Other/1000)
				ManageObligations.ObligationTotalRow.RestrictedFunds =  Math.round(ManageObligations.ObligationTotalRow.RestrictedFunds/1000)
				ManageObligations.ObligationTotalRow.UnrestrictedFunds=  Math.round(ManageObligations.ObligationTotalRow.UnrestrictedFunds/1000)
				ManageObligations.ObligationTotalRow.Total= Math.round(ManageObligations.ObligationTotalRow.Total/1000)
				
				ManageObligations.OtherRow.Total =  Math.round(ManageObligations.OtherRow.Total/1000)
				
				ManageObligations.RewardPaymentRows.forEach(function(Reward,index) {
					Reward.Total= Math.round(Reward.Total/1000)
					Reward.RestrictedFunds = Math.round(Reward.RestrictedFunds/1000)
					Reward.UnrestrictedFunds = Math.round(Reward.UnrestrictedFunds/1000)
				})

				ManageObligations.RewardPublicityRows.forEach(function(Reward,index) {
					Reward.Total= Math.round(Reward.Total/1000)
					Reward.RestrictedFunds = Math.round(Reward.RestrictedFunds/1000)
					Reward.UnrestrictedFunds = Math.round(Reward.UnrestrictedFunds/1000)
				})
				
				
				//total row for obligation and sof
				TotalSofAndObligation.Evacuations = Math.round(TotalSofAndObligation.Evacuations/1000)
				TotalSofAndObligation.Other= Math.round(TotalSofAndObligation.Other/1000)
				TotalSofAndObligation.RestrictedFunds = Math.round(TotalSofAndObligation.RestrictedFunds/1000)
				TotalSofAndObligation.UnrestrictedFunds= Math.round(TotalSofAndObligation.UnrestrictedFunds/1000)
				TotalSofAndObligation.Total= Math.round(TotalSofAndObligation.Total/1000)
				
							
				//Managed Recoveries
				ManageRecoveries.UERow.Total = Math.round(ManageRecoveries.UERow.Total/1000)
				ManageRecoveries.UERow.Evacuations = Math.round(ManageRecoveries.UERow.Evacuations/1000)
				ManageRecoveries.UERow.Other = Math.round(ManageRecoveries.UERow.Other/1000)
				ManageRecoveries.UERow.UnrestrictedFunds = Math.round(ManageRecoveries.UERow.UnrestrictedFunds/1000)
				ManageRecoveries.UERow.RestrictedFunds =Math.round( ManageRecoveries.UERow.RestrictedFunds/1000)

				ManageRecoveries.RewardPaymentRow.Total = Math.round(ManageRecoveries.RewardPaymentRow.Total/1000)
				ManageRecoveries.RewardPaymentRow.Evacuations = Math.round(ManageRecoveries.RewardPaymentRow.Evacuations/1000)
				ManageRecoveries.RewardPaymentRow.Other =Math.round( ManageRecoveries.RewardPaymentRow.Other/1000)
				ManageRecoveries.RewardPaymentRow.UnrestrictedFunds = Math.round(ManageRecoveries.RewardPaymentRow.UnrestrictedFunds/1000)
				ManageRecoveries.RewardPaymentRow.RestrictedFunds = Math.round(ManageRecoveries.RewardPaymentRow.RestrictedFunds/1000)

				ManageRecoveries.RewardPublicityRow.Total = Math.round(ManageRecoveries.RewardPublicityRow.Total/1000)
				ManageRecoveries.RewardPublicityRow.Evacuations = Math.round(ManageRecoveries.RewardPublicityRow.Evacuations/1000)
				ManageRecoveries.RewardPublicityRow.Other = Math.round(ManageRecoveries.RewardPublicityRow.Other/1000)
				ManageRecoveries.RewardPublicityRow.UnrestrictedFunds =Math.round( ManageRecoveries.RewardPublicityRow.UnrestrictedFunds/1000)
				ManageRecoveries.RewardPublicityRow.RestrictedFunds = Math.round(ManageRecoveries.RewardPublicityRow.RestrictedFunds/1000)

				ManageRecoveries.Total.Total = Math.round(ManageRecoveries.Total.Total/1000)
				ManageRecoveries.Total.Evacuations = Math.round(ManageRecoveries.Total.Evacuations/1000)
				ManageRecoveries.Total.Other = Math.round(ManageRecoveries.Total.Other/1000)
				ManageRecoveries.Total.UnrestrictedFunds = Math.round(ManageRecoveries.Total.UnrestrictedFunds/1000)
				ManageRecoveries.Total.RestrictedFunds = Math.round(ManageRecoveries.Total.RestrictedFunds/1000)


				//GrandTotal				
				GrandTotal.Evacuations = Math.round(GrandTotal.Evacuations/1000)
				GrandTotal.Other= Math.round(GrandTotal.Other/1000)
				GrandTotal.RestrictedFunds =Math.round( GrandTotal.RestrictedFunds/1000)
				GrandTotal.UnrestrictedFunds= Math.round(GrandTotal.UnrestrictedFunds/1000)
				GrandTotal.Total= Math.round(GrandTotal.Total/1000)



				FinalObject ={ManageSOFs:ManageSOFs,ManageObligations:ManageObligations,TotalSofAndObligation:TotalSofAndObligation,ManageRecoveries:ManageRecoveries,GrandTotal:GrandTotal}
				
				return FinalObject
			}						
		}
	})


	$stateProvider.state('ViewAllotment', {
		parent: 'root',
		url: '/ViewAllotment/:id',
		templateUrl: "../SiteAssets/KFundDev/Allotment/ViewAllotment.html",
		controller: 'ViewAllotmentController',
		resolve: {
			Allotment: function(BusinessObjectsFactory,$stateParams) {
				var Allotment = ($stateParams.id)?(new BusinessObjectsFactory.Allotment($stateParams.id)):(new BusinessObjectsFactory.Allotment());
				return Allotment;
			},
			SOFTable: function(Allotment) {
				return Allotment.GetSOFTable();
			},
			Reimbursements: function(Allotment) {
				return Allotment.GetReimbursements();
			},
			Attachments: function(Allotment) {
				return Allotment.GetAttachments();
			}
		}
	})

	$stateProvider.state('EditAllotment', {
		parent: 'root',
		url: '/EditAllotment/:id',
		templateUrl: '../SiteAssets/KFundDev/Allotment/EditAllotment.html',
		controller: 'EditAllotmentController',
		resolve: {
			LOVs: function($q,LOVService) {
				var AllotmentAuthorities = LOVService.getAllotmentAuthorities();
				var NewYears = LOVService.getNewYears();
				var Appropriations = LOVService.getAppropriations();
				var Agencies = LOVService.getAllotmentAgencies();
				var retVal = $q.defer();
				retVal.promise = $q.all([AllotmentAuthorities,NewYears,Appropriations,Agencies]).then(function(res) {
					var out = {};
					out.AllotmentAuthorities = res[0];
					out.NewYears = res[1];
					out.Appropriations = res[2];
					out.Agencies = res[3];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(err);
				});
				return retVal.promise;
			},
			Allotment: function($q,BusinessObjectsFactory,$stateParams) {
				var Allotment = ($stateParams.id)?(new BusinessObjectsFactory.Allotment($stateParams.id)):(new BusinessObjectsFactory.Allotment());
				return Allotment;
			}
		}
	})

	$stateProvider.state('EditAuthorizations', {
		parent: 'root',
		url: '/EditAuthorizations/:id',
		templateUrl: '../SiteAssets/KFundDev/Allotment/EditAuthorization.html',
		controller: 'AllotmentAuthorizationController',
		resolve: {
			Allotment: function($q, BusinessObjectsFactory, $stateParams, $state, toastr) {
				var retVal = $q.defer();
				retVal.promise = new BusinessObjectsFactory.Allotment($stateParams.id).then(function(allotment) {
					retVal.resolve(allotment);
				})
				return retVal.promise;
			}
		}
	})

	$stateProvider.state('ViewSOFs', {
		parent: 'root',
		url: '/ViewSOFs/:id',
		templateUrl: '../SiteAssets/KFundDev/Allotment/ViewSOF.html',
		controller: 'ViewSOFsController',
		resolve: {
			Allotment: function($q, BusinessObjectsFactory, $stateParams, $state, toastr) {
				var retVal = $q.defer();
				retVal.promise = new BusinessObjectsFactory.Allotment($stateParams.id).then(function(allotment) {
					retVal.resolve(allotment);
				})
				return retVal.promise;
			},
			SOFs: function($q,$stateParams,UtilityService,ConfigService,Allotment) {
				var retVal = $q.defer();
				retVal.promise = Allotment.GetSOFTable();
				return retVal.promise;
			}
		}
	})

	$stateProvider.state('EditSOF', {
		parent: 'root',
		url: '/EditSOF/:AllotmentId/:SOFId',
		templateUrl: '../SiteAssets/KFundDev/Allotment/EditSOF.html',
		controller: 'EditSOFController',
		resolve: {
			Allotment: function($q,$stateParams,BusinessObjectsFactory) {
				var retVal = $q.defer();
				retVal.promise = new BusinessObjectsFactory.Allotment($stateParams.AllotmentId).then(function(allotment) {
					retVal.resolve(allotment);
				})
				return retVal.promise;
			},
			UnsourcedFunds: function($q,$stateParams,BusinessObjectsFactory,Allotment) {
				var retVal = $q.defer();
				retVal.promise = Allotment.GetUnsourcedFunds();
				return retVal.promise;
			},
			SOF: function($q,$stateParams,BusinessObjectsFactory,Allotment) {
				var SOF = ($stateParams.SOFId)?(new BusinessObjectsFactory.SourceOfFunds($stateParams.SOFId)):(Allotment.NewSOF());
				return SOF;
			},
			FundingTypes: function($q,LOVService) {
				var retVal = $q.defer();
				retVal.promise = LOVService.getFundingTypes();
				return retVal.promise;
			}
		}
	})

	$stateProvider.state('ViewReimbursements', {
		parent: 'root',
		url: '/ViewReimbursements/:id',
		templateUrl: '../SiteAssets/KFundDev/Allotment/ViewReimbursements.html',
		controller: 'ViewReimbursementsController',
		resolve: {
			Allotment: function($q, BusinessObjectsFactory, $stateParams, $state, toastr) {
				var retVal = $q.defer();
				retVal.promise = new BusinessObjectsFactory.Allotment($stateParams.id).then(function(allotment) {
					retVal.resolve(allotment);
				})
				return retVal.promise;
			},
			Reimbursements: function(Allotment) {
				return Allotment.GetReimbursements();
			}
		}
	})

	$stateProvider.state('EditReimbursement', {
		parent: 'root',
		url: '/EditReimbursement/:AllotmentId/:ReimbursementId',
		templateUrl: '../SiteAssets/KFundDev/Allotment/EditReimbursement.html',
		controller: 'EditReimbursementController',
		resolve: {
			Allotment: function($q,$stateParams,BusinessObjectsFactory) {
				var retVal = $q.defer();
				retVal.promise = new BusinessObjectsFactory.Allotment($stateParams.AllotmentId).then(function(allotment) {
					retVal.resolve(allotment);
				})
				return retVal.promise;
			},
			Reimbursement: function($q,$stateParams,BusinessObjectsFactory,Allotment) {
				var Reimbursement = ($stateParams.ReimbursementId)?(new BusinessObjectsFactory.Reimbursement($stateParams.ReimbursementId)):(Allotment.NewReimbursement());
				return Reimbursement;
			},
			AvailableFunds: function($q,Allotment,Reimbursement) {
				var retVal = $q.defer();
				retVal.promise = Allotment.GetReimbursableFunds(Reimbursement.Program);
				return retVal.promise;
			},
			LOVs: function($q,LOVService,Allotment) {
				var Statuses = LOVService.getReimbursementStatuses();
				var Agencies = LOVService.getAgencies();
				var retVal = $q.defer();
				retVal.promise = $q.all([Statuses,Agencies]).then(function(res) {
					var Programs = Allotment.GetAllotmentPrograms();
					var out = {};
					out.Programs = Programs;
					out.Agencies = res[1];
					out.ReimbursementStatuses = res[0];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(err);
				});
				return retVal.promise;				
			}
		}
	})

	$stateProvider.state('ViewObligation', {
		parent: 'root',
		url: '/ViewObligation/:id',
		templateUrl: '../SiteAssets/KFundDev/Obligation/ViewObligation.html',
		controller: 'ViewObligationController',
		resolve: {
			Obligation: function($q,$state,$stateParams,BusinessObjectsFactory) {
				var Obligation = ($stateParams.id)?(new BusinessObjectsFactory.Obligation($stateParams.id)):(new BusinessObjectsFactory.Obligation());
				return Obligation;
			},
			Attachments: function($q,$state,Obligation) {
				return Obligation.GetAttachments();
			},
			Payments: function($q,$state,Obligation) {
				return Obligation.GetPayments();
			},
			Reimbursements: function($q,$state,Obligation) {
				return Obligation.GetReimbursements();
			}
		}
	})

	$stateProvider.state('EditObligation', {
		parent: 'root',
		url: '/EditObligation/:id',
		templateUrl: '../SiteAssets/KFundDev/Obligation/EditObligation.html',
		controller: 'EditObligationController',
		resolve: {
			Obligation: function($q,$state,$stateParams,BusinessObjectsFactory) {
				var Obligation = ($stateParams.id)?(new BusinessObjectsFactory.Obligation($stateParams.id)):(new BusinessObjectsFactory.Obligation());
				return Obligation;
			},
			ObligationNumbers: function($q,$state,$stateParams,BusinessObjectsFactory,UtilityService,ConfigService) {
				var ObligationNumbers = UtilityService.getItems("?$filter=ItemType eq 'Obligation'&$select=ObligationNumber,OperatingAllowance,PostCode,FiscalYear",ConfigService.getTransactionListName())
				return ObligationNumbers;
			},
			RPPs: function($q,$stateParams,UtilityService,BusinessObjectsFactory,Obligation) {
				var retVal = $q.defer();
				var rpp = new BusinessObjectsFactory.RPP;
				retVal.promise = rpp.GetRPPs();
				return retVal.promise;
			},
			LOVs: function($q,$state,LOVService) {
				var promisesArray = [];
				promisesArray.push(LOVService.getAllotments());
				promisesArray.push(LOVService.getOperatingAllowances());
				promisesArray.push(LOVService.getPosts());
				promisesArray.push(LOVService.getAppropriations());
				promisesArray.push(LOVService.getRewardsPrograms());
				promisesArray.push(LOVService.getCountries())
				var retVal = $q.defer();
				retVal.promise = $q.all(promisesArray).then(function(res) {
					var out = {};
					out.Allotments = res[0];
					out.OperatingAllowances = res[1];
					out.PostCodes = res[2];
					out.Appropriations = res[3];
					out.RewardsPrograms = res[4];
					out.Countries = res[5];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(err);					
				})
				return retVal.promise;
			}
		}
	})



	$stateProvider.state('Deobligation', {
		parent: 'root',
    	url: '/Deobligation/:ObligationID',
      	params: {
            LiquidatedAmount: null,
        },
    	templateUrl: '../SiteAssets/KFundDev/Obligation/Deobligation.html',
    	controller: 'DeobligationController',
    	resolve: {
			Obligation: function($stateParams,$q,ConfigService,UtilityService){
        		var ListName =  ConfigService.getTransactionListName(); 
        		var filter = "";        
		 		return  UtilityService.getItem($stateParams.ObligationID, filter , ListName)	 		
			}
		}//end of resolve		
    })//end of create Obligation state provider

	$stateProvider.state('EditObligationReimbursements', {
		parent:'root',
		url: '/ManageReimbursements/:id',
		templateUrl: '../SiteAssets/KFundDev/Obligation/ManageReimbursements.html',
		controller: 'ManageObligationReimbursements',
		resolve: {
			Obligation: function($q,$state,$stateParams,BusinessObjectsFactory) {
				var Obligation = ($stateParams.id)?(new BusinessObjectsFactory.Obligation($stateParams.id)):(new BusinessObjectsFactory.Obligation());
				return Obligation;
			},
			Reimbursements: function($q,$state,Obligation) {
				return Obligation.GetReimbursements();
			}
		}
	})

	$stateProvider.state('EditObligationPayments', {
		parent:'root',
		url: '/ManagePayments/:id',
		templateUrl: '../SiteAssets/KFundDev/Obligation/ManagePayments.html',
		controller: 'ManageObligationPayments',
		resolve: {
			Obligation: function($q,$state,$stateParams,BusinessObjectsFactory) {
				var Obligation = ($stateParams.id)?(new BusinessObjectsFactory.Obligation($stateParams.id)):(new BusinessObjectsFactory.Obligation());
				return Obligation;
			},
			Payments: function($q,$state,Obligation) {
				return Obligation.GetPayments();
			}
		}
	})

	$stateProvider.state('ViewPayment', {
		parent: 'root',
		url: '/ViewPayment/:id',
		templateUrl: '../SiteAssets/KFundDev/Payment/ViewPayment.html',
		controller: 'ViewPaymentController',
		resolve: {
			Payment: function($q,$state,$stateParams,BusinessObjectsFactory) {
				var Payment = ($stateParams.id)?(new BusinessObjectsFactory.Payment($stateParams.id)):(new BusinessObjectsFactory.Payment());
				return Payment;
			},
			RPPs: function($q,Payment,BusinessObjectsFactory) {
				var out = [];
				Payment.RPPs.forEach(function(rpp,index) {
					var r = new BusinessObjectsFactory.RPP();
					out.push(r.GetByRPP(rpp));
				});
				var retVal = $q.defer();
				retVal.promise = $q.all(out).then(function(res) {
					retVal.resolve(res);
				}, function(err) {
					retVal.reject(err);
				});
				return retVal.promise;
			},
			PaymentReturns: function($q,$stateParams,Payment) {
				return Payment.GetReturns();
			},
			Attachments: function($q,$state,Payment) {
				return Payment.GetAttachments();
			},
			Reimbursements: function($q,$state,Payment) {
				return Payment.GetReimbursements();
			},
			Obligations: function($q,$state,Payment) {
				return Payment.GetObligations();
			}
		}
	})

	$stateProvider.state('EditPayment', {
		parent: 'root',
		url: '/EditPayment/:id',
		templateUrl: '../SiteAssets/KFundDev/Payment/EditPayment.html',
		controller: 'EditPaymentController',
		resolve: {
			Payment: function($q,$state,$stateParams,BusinessObjectsFactory) {
				var Payment = ($stateParams.id)?(new BusinessObjectsFactory.Payment($stateParams.id)):(new BusinessObjectsFactory.Payment());
				return Payment;
			},
			RPPs: function($q,$stateParams,UtilityService,BusinessObjectsFactory) {
				var retVal = $q.defer();
				var rpp = new BusinessObjectsFactory.RPP;
				retVal.promise = rpp.GetRPPs();
				return retVal.promise;
			},
			Attachments: function(Payment) {
				return Payment.GetAttachments();
			},
			LOVs: function($q,$state,LOVService) {
				var promisesArray = [];
				promisesArray.push(LOVService.getPayees());
				promisesArray.push(LOVService.getPaymentTypes());
				promisesArray.push(LOVService.getAppropriations());
				promisesArray.push(LOVService.getAllotments());
				promisesArray.push(LOVService.getOperatingAllowances());
				promisesArray.push(LOVService.getAccounts());
				promisesArray.push(LOVService.getBureaus());
				promisesArray.push(LOVService.getAdhocBureaus());
				promisesArray.push(LOVService.getAllotmentTypes());
				promisesArray.push(LOVService.getPosts());
				promisesArray.push(LOVService.getRewardsPrograms());
				promisesArray.push(LOVService.getCountries())
				promisesArray.push(LOVService.getRepresentationTypes())				
				var retVal = $q.defer();
				retVal.promise = $q.all(promisesArray).then(function(res) {
					var out = {};
					out.Payees = res[0];
					out.PaymentTypes = res[1]
					out.Appropriations = res[2];
					out.Allotments = res[3];
					out.OperatingAllowances = res[4];
					out.Accounts = res[5];
					out.Bureaus = res[6];
					out.AdhocBureaus = res[7];
					out.AllotmentTypes = res[8];
					out.PostCodes = res[9];
					out.RewardsPrograms = res[10];
					out.Countries = res[11];
					out.RepresentationTypes = res[12];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(err);
				})
				return retVal.promise;
			}
		}
	})

	$stateProvider.state('GenerateFundCite', {
		parent: 'root',
		url: '/GenerateFundCite',
		templateUrl: '../SiteAssets/KFundDev/Payment/GenerateFundCite.html',
		controller: 'GenerateFundCiteController',
		resolve: {
			LOVs: function($q,$state,LOVService) {
				var promisesArray = [];
				promisesArray.push(LOVService.getAppropriations());
				promisesArray.push(LOVService.getAllotments());
				promisesArray.push(LOVService.getOperatingAllowances());
				promisesArray.push(LOVService.getPosts());
				promisesArray.push(LOVService.getCountries())
				var retVal = $q.defer();
				retVal.promise = $q.all(promisesArray).then(function(res) {
					var out = {};
					out.Appropriations = res[0];
					out.Allotments = res[1];
					out.OperatingAllowances = res[2];
					out.PostCodes = res[3];
					out.Countries = res[4];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(err);
				})
				return retVal.promise;
			},
			ObligationNumbers: function($q,$state,$stateParams,BusinessObjectsFactory,UtilityService,ConfigService) {
				var ObligationNumbers = UtilityService.getItems("?$filter=ItemType eq 'Obligation'&$select=ObligationNumber,OperatingAllowance,PostCode,FiscalYear",ConfigService.getTransactionListName())
				return ObligationNumbers;
			}

		}
	})

	$stateProvider.state('ViewPaymentReturn', {
		parent: 'root',
		url: '/ViewPaymentReturn/:id',
		templateUrl: '../SiteAssets/KFundDev/PaymentReturn/ViewPaymentReturn.html',
		controller: 'ViewPaymentReturnController',
		resolve: {
			PaymentReturn: function($stateParams,$q,BusinessObjectsFactory) {
				var PaymentReturn = ($stateParams.id)?(new BusinessObjectsFactory.PaymentReturn($stateParams.id)):(new BusinessObjectsFactory.PaymentReturn());
				return PaymentReturn;
			},
			PaymentReturnSources: function($q,$stateParams,PaymentReturn) {
				return PaymentReturn.GetPaymentReturnSources();
			},
			Attachments: function($q,$stateParams,PaymentReturn) {
				return PaymentReturn.GetAttachments();
			}
		}
	})

	$stateProvider.state('EditPaymentReturn', {
		parent: 'root',
		url: '/EditPaymentReturn/:id',
		templateUrl: '../SiteAssets/KFundDev/PaymentReturn/EditPaymentReturn.html',
		controller: 'EditPaymentReturnController',
		resolve: {
			PaymentReturn: function($stateParams,$q,BusinessObjectsFactory) {
				var PaymentReturn = ($stateParams.id)?(new BusinessObjectsFactory.PaymentReturn($stateParams.id)):(new BusinessObjectsFactory.PaymentReturn());
				return PaymentReturn;
			},
			LOVs: function($q,$stateParams,LOVService) {
				var promises = [];
				promises.push(LOVService.getPaymentReturnTypes());
				promises.push(LOVService.getPaymentReturnReasons());
				promises.push(LOVService.getAllotments());
				promises.push(LOVService.getAppropriations());
				promises.push(LOVService.getOperatingAllowances());
				promises.push(LOVService.getPosts());
				promises.push(LOVService.getBureaus());
				promises.push(LOVService.getRepresentationTypes())	
				promises.push(LOVService.getAdhocBureaus());
				var retVal = $q.defer();
				retVal.promise = $q.all(promises).then(function(res) {
					var out = {};
					out.PaymentReturnTypes = res[0];
					out.PaymentReturnReasons = res[1];
					out.Allotments = res[2];
					out.Appropriations = res[3];
					out.OperatingAllowances = res[4];
					out.PostCodes = res[5];
					out.Bureaus = res[6];
					out.RepresentationTypes = res[7];
					out.AdhocBureaus = res[8];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(out);
				});
				return retVal.promise;
			}
		}
	})

	$stateProvider.state('ManagePaymentReturnSources', {
		parent: 'root',
		url: '/ManagePaymentReturnSources/:id',
		templateUrl: '../SiteAssets/KFundDev/PaymentReturn/ManagePaymentReturnSources.html',
		controller: 'ManagePaymentReturnSourcesController',
		resolve: {
			PaymentReturn: function($q,$stateParams,BusinessObjectsFactory) {
				var PaymentReturn = ($stateParams.id)?(new BusinessObjectsFactory.PaymentReturn($stateParams.id)):(new BusinessObjectsFactory.PaymentReturn());
				return PaymentReturn;
			},
			PaymentReturnSources: function(PaymentReturn) {
				return PaymentReturn.GetPaymentReturnSources();
			}
		}
	})

	$stateProvider.state('ViewDeposit', {
		parent: 'root',
		url: '/ViewDeposit/:id',
		templateUrl: '../SiteAssets/KFundDev/Deposit/ViewDeposit.html',
		controller: 'ViewDepositController',
		resolve: {
			Deposit: function($q,$stateParams,BusinessObjectsFactory) {
				var Deposit = ($stateParams.id)?(new BusinessObjectsFactory.Deposit($stateParams.id)):(new BusinessObjectsFactory.Deposit());
				return Deposit;
			},
			Attachments: function($q,BusinessObjectsFactory,Deposit) {
				return Deposit.GetAttachments();
			}
		}
	})

	$stateProvider.state('EditDeposit', {
		parent: 'root',
		url: '/EditDeposit/:id',
		templateUrl: '../SiteAssets/KFundDev/Deposit/EditDeposit.html',
		controller: 'EditDepositController',
		resolve: {
			Deposit: function($q,$stateParams,BusinessObjectsFactory) {
				var Deposit = ($stateParams.id)?(new BusinessObjectsFactory.Deposit($stateParams.id)):(new BusinessObjectsFactory.Deposit());
				return Deposit;
			},
			LOVs: function($q,$state,LOVService) {
				var promises = [];
				promises.push(LOVService.getAllotments());
				promises.push(LOVService.getAppropriations());
				promises.push(LOVService.getOperatingAllowances());
				var retVal = $q.defer();
				retVal.promise = $q.all(promises).then(function(res) {
					var out = {};
					out.Allotments = res[0];
					out.Appropriations = res[1];
					out.OperatingAllowances = res[2];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(out);
				});
				return retVal.promise;
			}
		}
	})

	$stateProvider.state('Checkbook', {
		parent: 'root',
    	url: '/Checkbook',
    	params: {
            FiscalYear: null,
        },
    	templateUrl: '../SiteAssets/KFundDev/Checkbook/Checkbook.html',
    	controller: 'CheckbookController',
    	resolve: {
        	AllPayments: function($q,$stateParams,UtilityService,ConfigService) { 
        	

   				var newDate = new Date()
   				var FiscalYear = UtilityService.getTwoDigitFiscalYear(newDate)
   				
				if($stateParams.FiscalYear != null){
					FiscalYear = $stateParams.FiscalYear
				}      	
        	
        		var filter = "?$filter=FiscalYear eq '" + FiscalYear + "' and ItemType eq 'Payment' and PaymentType eq 'Check' or FiscalYear eq '" + FiscalYear + "' and ItemType eq 'Payment' and PaymentType eq 'EFT' or FiscalYear eq '" + FiscalYear + "' and ItemType eq 'PaymentReturn' or FiscalYear eq '" + FiscalYear + "' and ItemType eq 'Deposit'or FiscalYear eq '" + FiscalYear + "' and ItemType eq 'AccountAdjustment'&$orderBy=Date asc";  
        		var ListName = ConfigService.getTransactionListName();   	        
		 		return UtilityService.getItems(filter,ListName)	 			 		
			},
			AvailableFiscalYears:function($q,$stateParams,UtilityService,ConfigService) {    				     	
        		var filter = "?$filter=PaymentType eq 'Check' or PaymentType eq 'EFT' or ItemType eq 'PaymentReturn' or ItemType eq 'Deposit' or ItemType eq 'AccountAdjustment' &$select=FiscalYear"; 
        		var ListName = ConfigService.getTransactionListName();    	        
		 		return UtilityService.getItems(filter,ListName)	 			 		
			}
		}//end of resolve		
    })//end of Reports state provider

	$stateProvider.state('EditGFMS', {
		parent: 'root',
		url: '/EditGFMS/:id',
		templateUrl: '../SiteAssets/KFundDev/GFMS/EditGFMS.html',
		controller: 'EditGFMSController',
		resolve: {
			GFMS: function(BusinessObjectsFactory,$stateParams) {
				var GFMS = ($stateParams.id)?(new BusinessObjectsFactory.GFMS($stateParams.id)):(new BusinessObjectsFactory.GFMS());
				return GFMS;
			},
			LOVs: function(LOVService,$q) {
				var promisesArray = [];
				promisesArray.push(LOVService.getAllotments());
				promisesArray.push(LOVService.getAppropriations());
				var retVal = $q.defer();
				retVal.promise = $q.all(promisesArray).then(function(res) {
					var out = {};
					out.Allotments = res[0];
					out.Appropriations = res[1];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(err);					
				})
				return retVal.promise;
			}
		}
	})

	$stateProvider.state('ViewGFMS', {
		parent: 'root',
		url: '/ViewGFMS/:id',
		templateUrl: '../SiteAssets/KFundDev/GFMS/ViewGFMS.html',
		controller: 'ViewGFMSController',
		resolve: {
			GFMS: function(BusinessObjectsFactory,$stateParams) {
				var GFMS = ($stateParams.id)?(new BusinessObjectsFactory.GFMS($stateParams.id)):(new BusinessObjectsFactory.GFMS());
				return GFMS;
			}
		}
	})

	$stateProvider.state('EditAdjustment', {
		parent: 'root',
		url: '/EditAdjustment/:id',
		templateUrl: '../SiteAssets/KFundDev/Adjustment/EditAdjustment.html',
		controller: 'EditAdjustmentController',
		resolve: {
			Adjustment: function($stateParams,BusinessObjectsFactory) {
				var Adjustment = ($stateParams.id)?(new BusinessObjectsFactory.Adjustment($stateParams.id)):(new BusinessObjectsFactory.Adjustment());
				return Adjustment;
			},
			LOVs: function($q,$state,LOVService) {
				var promisesArray = [];
				promisesArray.push(LOVService.getAllotments());
				promisesArray.push(LOVService.getOperatingAllowances());
				promisesArray.push(LOVService.getAppropriations());
				promisesArray.push(LOVService.getRewardsPrograms());
				var retVal = $q.defer();
				retVal.promise = $q.all(promisesArray).then(function(res) {
					var out = {};
					out.Allotments = res[0];
					out.OperatingAllowances = res[1];
					out.Appropriations = res[2];
					out.RewardsPrograms = res[3];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(err);					
				})
				return retVal.promise;
			}
		}
	})

	$stateProvider.state('ViewAdjustment', {
		parent: 'root',
		url: '/ViewAdjustment/:id',
		templateUrl: '../SiteAssets/KFundDev/Adjustment/ViewAdjustment.html',
		controller: 'ViewAdjustmentController',
		resolve: {
			Adjustment: function($stateParams,BusinessObjectsFactory) {
				var Adjustment = ($stateParams.id)?(new BusinessObjectsFactory.Adjustment($stateParams.id)):(new BusinessObjectsFactory.Adjustment());
				return Adjustment;
			},
			Attachments: function(Adjustment) {
				return Adjustment.GetAttachments();
			}
		}
	})

	$stateProvider.state('ViewAccountAdjustment',{
		parent: 'root',
		url: '/ViewAccountAdjustment/:id',
		templateUrl: '../SiteAssets/KFundDev/Deposit/ViewAccountAdjustment.html',
		controller: 'ViewAccountAdjustmentController',
		resolve: {
			Adjustment: function($stateParams,$q,BusinessObjectsFactory) {
				var Adj = ($stateParams.id)?(new BusinessObjectsFactory.AccountAdjustment($stateParams.id)):(new BusinessObjectsFactory.AccountAdjustment());
				return Adj;
			}
		}
	})

	$stateProvider.state('EditAccountAdjustment',{
		parent: 'root',
		url: '/EditAccountAdjustment/:id',
		templateUrl: '../SiteAssets/KFundDev/Deposit/EditAccountAdjustment.html',
		controller: 'EditAccountAdjustmentController',
		resolve: {
			Adjustment: function($stateParams,$q,BusinessObjectsFactory) {
				var Adj = ($stateParams.id)?(new BusinessObjectsFactory.AccountAdjustment($stateParams.id)):(new BusinessObjectsFactory.AccountAdjustment());
				return Adj;
			},
			OperatingAllowances: function($q,LOVService) {
				var retVal = $q.defer();
				retVal.promise = LOVService.getOperatingAllowances();
				return retVal.promise;
			}
		}
	})

	$stateProvider.state("ViewAllEvacuations", {
		parent: 'root',
		url: '/ViewAllEvacuations',
		templateUrl: '../SiteAssets/KFundDev/Evacuation/ViewAllEvacuations.html',
		controller: 'ViewAllEvacuationsController',
		resolve: {
			Evacuations: function(BusinessObjectsFactory,$q) {
				var e = new BusinessObjectsFactory.Evacuation();
				return e.GetAllEvacuations();
			}	
		}
	})

	$stateProvider.state("ViewEvacuation", {
		parent: 'root',
		url: '/ViewEvacuation/:id',
		templateUrl: '../SiteAssets/KFundDev/Evacuation/ViewEvacuation.html',
		controller: 'ViewEvacuationController',
		resolve: {
			Evacuation: function($q,$stateParams,BusinessObjectsFactory) {
				var Evacuation = ($stateParams.id)?(new BusinessObjectsFactory.Evacuation($stateParams.id)):(new BusinessObjectsFactory.Evacuation());
				return Evacuation;
			},
			Attachments: function($q,$state,Evacuation) {
				return Evacuation.GetAttachments().then(function(res) {
					var cableFileNames = _(Evacuation.Extensions).chain().pluck('Cables').flatten().pluck('Title').unique().filter(function(val) { return !IsNullOrUndefined(val); }).map(function(val) { return (val.indexOf(".") > -1)?(val.substr(0,val.lastIndexOf("."))):(val)}).value();
					var attachments = _(res).chain().map(function(val) {
						val.Name = val.FileName.substr(0,val.FileName.lastIndexOf("."))
						return val;
					}).value();
					return _(attachments).chain().filter(function(val,index,array) {
						return (cableFileNames.indexOf(val.Name) == -1);
					}).value();
				}, function(err) {
					return err;
				});
			},
			LOVs: function($q,$state,LOVService) {
				var promises = [];
				promises.push(LOVService.getBureaus());
				promises.push(LOVService.getEvacuationTypes());
				promises.push(LOVService.getEvacuees());
				promises.push(LOVService.getPosts());
				promises.push(LOVService.getEvacuationReasons());
				var retVal = $q.defer();
				retVal.promise = $q.all(promises).then(function(res) {
					var out = {};
					out.Bureaus = res[0];
					out.EvacuationTypes = res[1];
					out.Evacuees = res[2];
					out.Posts = res[3];
					out.Reasons = res[4];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(err);
				})
				return retVal.promise;
			}
		}
	})

	$stateProvider.state("EditEvacuation", {
		parent: 'root',
		url: '/EditEvacuation/:id',
		templateUrl: '../SiteAssets/KFundDev/Evacuation/EditEvacuation.html',
		controller: 'EditEvacuationController',
		resolve: {
			Evacuation: function($q,$stateParams,BusinessObjectsFactory) {
				var Evacuation = ($stateParams.id)?(new BusinessObjectsFactory.Evacuation($stateParams.id)):(new BusinessObjectsFactory.Evacuation());
				return Evacuation;
			},
			Attachments: function($q,$state,Evacuation) {
				return Evacuation.GetAttachments();
			},
			LOVs: function($q,$state,LOVService) {
				var promises = [];
				promises.push(LOVService.getBureaus());
				promises.push(LOVService.getEvacuationTypes());
				promises.push(LOVService.getEvacuees());
				promises.push(LOVService.getPosts());
				promises.push(LOVService.getEvacuationReasons());
				promises.push(LOVService.getCountries())
				var retVal = $q.defer();
				retVal.promise = $q.all(promises).then(function(res) {
					var out = {};
					out.Bureaus = res[0];
					out.EvacuationTypes = res[1];
					out.Evacuees = res[2];
					out.Posts = res[3];
					out.Reasons = res[4];
					out.Countries = res[5];
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(err);
				})
				return retVal.promise;
			}
		}
	})

	$stateProvider.state("EditExtension",{
		parent: 'root',
		url: '/EditExtension/:id/:ext',
		params: {
			'end': ''
		},
		templateUrl: '../SiteAssets/KFundDev/Evacuation/EditExtension.html',
		controller: 'EditExtensionController',
		resolve: {
			Evacuation: function($q,$stateParams,BusinessObjectsFactory) {
				var Evacuation = ($stateParams.id)?(new BusinessObjectsFactory.Evacuation($stateParams.id)):(new BusinessObjectsFactory.Evacuation());
				return Evacuation;
			},
			Extension: function($stateParams, Evacuation) {
				if (!$stateParams.end) {
					if (!$stateParams.ext) {
						return Evacuation.NewExtension();
					} else {
						var ext = Evacuation.Extensions[$stateParams.ext];
						ext.StartDate = new Date(ext.StartDate);
						ext.EndDate = new Date(ext.EndDate);
						return ext;
					}
				} else {
					return Evacuation.NewExtension(true);
				}
			},
			LOVs: function($q,LOVService) {
				var promises = [];
				promises.push(LOVService.getEvacuationTypes());
				promises.push(LOVService.getEvacuees());
				promises.push(LOVService.getPersonnelTypes());
				var retVal = $q.defer();
				retVal.promise = $q.all(promises).then(function(res) {
					var out = {};
					out.EvacuationTypes = res[0];
					out.Evacuees = res[1];
					out.PersonnelTypes = res[2]
					retVal.resolve(out);
				}, function(err) {
					retVal.reject(err);
				})
				return retVal.promise;
			}
		}
	})
	

 	$stateProvider.state('Delete', {
		parent: 'root',
    	url: '/Delete/:id',
     	templateUrl: '../SiteAssets/KFundDev/Delete/Delete.html',
    	controller: 'DeleteController',
    	resolve: {
    		GetItem: function($stateParams,UtilityService,ConfigService){
         		var ListName = ConfigService.getTransactionListName();    	        
		 		return UtilityService.getItem($stateParams.id,"",ListName);    		
    		},
    		ReferenceItems: function(GetItem,DeleteModule){
    			var item = GetItem.data
    			var referenceItems = []
	    		switch (item.ItemType)
				{
					case 'Obligation':
				        referenceItems = DeleteModule.getObligationReferenceItems(item)
				        break;
					case 'Allotment':
						referenceItems = DeleteModule.getAllotmentReferenceItems(item)
				        break;
					case 'Payment':
						referenceItems = DeleteModule.getPaymentReferenceItems(item)
				        break;
					case 'RPP':
						referenceItems = DeleteModule.getRppReferenceItems(item)
				        break;
				    default:
				    	referenceItems = []
				}
    			return referenceItems
    		},
			IfAllotment: function(BusinessObjectsFactory,GetItem) {
				if(GetItem.data.ItemType == "Allotment")
				{
					var Allotment = new BusinessObjectsFactory.Allotment(GetItem.data.Id);
					return Allotment;
				}else{
					return GetItem
				}    		
    		},   		
			SOFTable: function(GetItem,IfAllotment) {
				if(GetItem.data.ItemType == "Allotment")
				{
					return IfAllotment.GetSOFTable();
				}else{
					return null
				}			
			},
			Reimbursements: function(GetItem,IfAllotment) {
				if(GetItem.data.ItemType == "Allotment")
				{
					return IfAllotment.GetReimbursements();
				}else{
					return null
				}				
			}
		}	
    })//end of delete state provider


})//config
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            var data = $parse(attrs.fileValue);
            var dataSetter = data.assign; 
            
            element.bind('change', function(){
            	if (FileReader && element[0].files) {
            		var fr = new FileReader();
            		fr.onload = function() {
            			var imageData = fr.result;
            			dataSetter(scope, imageData);
            		};
            		//fr.readAsBinaryString(element[0].files[0]);
            		fr.readAsArrayBuffer(element[0].files[0]);
            	}
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
.filter('negativeParenthesis', function() {
    return function(input) {
		if (input) {
			var out = input.replace("$","").replace(/,/g,"");
			if (parseFloat(out) < 0) {
				out = Math.abs(out);
				out = out.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
				out ="$("+ out +")";
				return (out.indexOf(".") > -1)?(out):(out.substring(0,out.length - 1) + ".00)");
			} else {
				return input + "";
			}
		} else {
			return "$0.00";
		}
    }
})
.filter('negativeParenthesisInteger', function() {
    return function(input) {
		if (input) {
			if(Number.isInteger(input))
			{
				if (parseFloat(input) < 0) {
					input = input *-1;
					input = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");					
					input ="("+input.toString()+")";
					return input;
				} else {
					input = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					return input + "";
				}
			}else{
				return "-"
			}
		} else {
			return 0.00;
		}
    }
})


.directive('dynamic', function ($compile) {
	return {
	restrict: 'A',
	replace: true,
	link: function (scope, ele, attrs) {
		scope.$watch(attrs.dynamic, function(html) {
		ele.html(html);
		$compile(ele.contents())(scope);
		});
	}
	};
})
.directive("datepicker", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "mm/dd/yy",
        onSelect: function (dateText) {
          updateModel(dateText);
        }
      };
      elem.datepicker(options);
    }
  }
})
.service('ngInputCurrencyService', ['$locale', function($locale) {
  this.toFloat = function(str) {
    if (angular.isNumber(str))
      return parseFloat(str, 10);

    if (!angular.isString(str))
      throw new TypeError('ngInputCurrencyService.toFloat expects argument to be a String, but was given ' + str);

    str = str
      .replace(new RegExp(this.stringToRegExp($locale.NUMBER_FORMATS.GROUP_SEP), 'g'), '')
      .replace(new RegExp(this.stringToRegExp($locale.NUMBER_FORMATS.CURRENCY_SYM), 'g'), '')
      .replace(new RegExp(this.stringToRegExp($locale.NUMBER_FORMATS.DECIMAL_SEP), 'g'), '.');

    return parseFloat(str, 10);
  };

  this.stringToRegExp = function(str, opt) {
    return str.replace(/\./g,'\\.')
         .replace(/\[/g, '\\[')
         .replace(/\]/g, '\\]')
         .replace(/\,/g, '\\,')
         .replace(/\|/g, '\\|')
         .replace(/\)/g, '\\)')
         .replace(/\(/g, '\\(')
         .replace(/\^/g, '\\^')
         .replace(/\$/g, '\\$')
         .replace(/\_/g, '\\_')
         .replace(/\?/g, '\\?')
         .replace(/\-/g, '\\-');
  };

  this.isValid = function(val) {
    return angular.isNumber(val) && !isNaN(val);
  };

  this.preformatValue = function(val) {
    if (!angular.isString(val))
      return val;

    var groupRegex = new RegExp(this.stringToRegExp($locale.NUMBER_FORMATS.GROUP_SEP), 'g'),
        decimalRegex = new RegExp(this.stringToRegExp($locale.NUMBER_FORMATS.DECIMAL_SEP), 'g');

    var groupMatch = val.match(groupRegex), decimalMatch = val.match(decimalRegex);
    if (groupMatch && groupMatch.length == 1 && (!decimalMatch || decimalMatch.length === 0))
      return val.replace(groupRegex, '.');

    if (decimalMatch && decimalMatch.length == 1 && (!groupMatch || groupMatch.length === 0))
      return val.replace(decimalRegex, '.');

    return val;
  };
}])
.directive('ngInputCurrency', ['$locale','$filter','ngInputCurrencyService','$timeout', function($locale, $filter, util, $timeout) {
  var link = function($scope, $element, $attrs, $ngModel){

    var opts = {
      updateOn: 'blur enter',
      updateOnDefault: false
    };
    if ($ngModel.$options !== null && $ngModel.$options !== undefined)
      opts = $ngModel.$options.createChild(opts);

    $ngModel.$options = opts;

    var filter = $filter('currency');
    $ngModel.$formatters.push(function fromModelToView(value) {
      return filter(value);
    });

    $ngModel.$parsers.push(function(value) {
      value = util.preformatValue(value);

      var currency = util.toFloat(filter(value));
      if (util.isValid(currency)) {
        $ngModel.$setViewValue(filter(currency));
        $ngModel.$render();
        return currency;
      }
    });

    $element.on('blur', function(){
      if ($ngModel.$viewValue === $ngModel.$modelValue)
        $element.val(filter($ngModel.$modelValue));
    });

    $element.on('focus', function(){
      if (util.isValid($ngModel.$modelValue)) {
        $ngModel.$setViewValue($ngModel.$modelValue);
        $ngModel.$render();
      }
    });

    $ngModel.$validators.currency = function(modelValue) {
      return util.isValid(modelValue);
    };

  };
  return {
    'restrict': 'A',
    'require': 'ngModel',
    'link': link
  };
}]);