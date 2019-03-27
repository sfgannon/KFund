angular.module('BusinessObjectsModule', ['UtilityModule','LocalStorageModule','ConfigModule','LOVModule'])
.factory('BusinessObjectsFactory',['ConfigService','UtilityService','LOVService','$q','localStorageService', function(ConfigService,UtilityService,LOVService,$q,localStorageService) {
    var out = {};

    var GFMS = function(id) {
        this.Id;
        this.ItemType = 'GFMS';
        this.Allotment = '';
        this.Appropriation = '';
        this.FiscalYear = '';
        this.Date = new Date();
        this.Amount = 0;
        this.AdjustmentType = '';

        this.GetGFMS = get;
        this.SaveGFMS = save;
        this.BuildRequest = gfmsBuildRequest;
        this.ParseResponse = gfmsParseResponse;
        
        if (id) {
            return this.GetGFMS(id);
        } else {
            return this;
        }
    }

    var Adjustment = function(id) {
        this.Id;
        this.ItemType = 'Adjustment';
        this.Allotment = '';
        this.Appropriation = '';
        this.OperatingAllowance = '';
        this.RewardsProgram = '';
        this.RewardsPublicity = false;
        this.FiscalYear = '';
        this.Date = new Date();
        this.Purpose = '';
        this.Description = '';
        this.Amount = 0;
        this.RestrictedFunds = 0;
        this.Attachments = [];

        this.GetAdjustment = get;
        this.SaveAdjustment = save;
        this.BuildRequest = adjustmentBuildRequest;
        this.ParseResponse = adjustmentParseResponse;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;

        if (id) {
            return this.GetAdjustment(id);
        } else {
            return this;
        }
    }

    var Evacuation = function(id) {
        this.Id;
        this.ItemType = 'Evacuation';
        this.Bureau = '';
        this.Reason = "";
        this.Status = "";
        this.Posts = [];
        this.Countries = "";
        this.EvacuationTypes = [];
        this.StartDate = new Date();
        this.EndDate = new Date();
        this.Cables = [];
        this.Extensions = [];
        this.FiscalYear = "";
        this.Safehaven = "";
        this.OperatingStatus = "";
        this.Attachments = [];
        this.Notes = '';

        this.GetEvacuation = get;
        this.SaveEvacuation = save;
        this.GetEvacuations = evacuationGetEvacuations;
        this.GetAllEvacuations = evacuationGetAllEvacuations;
        this.GetEvacuationsReport = evacuationGetEvacuationsReport;
        this.BuildRequest = evacuationBuildRequest;
        this.ParseResponse = evacuationParseResponse;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;
        this.NewExtension = evacuationNewExtension;
        this.SetEndDate = evacuationSetEndDate;
        this.GetReportObject = evacuationReportObject;
        this.GetExtensionEndDate = extensionSetEndDate;

        if (id) {
            return this.GetEvacuation(id);
        } else {
            return this;
        }
    }

    var Payment = function(id) {
        this.Id;
        this.ItemType = "Payment";
        this.PaymentType = "";
        this.Date = new Date();
        this.Amount = 0;
        this.Payee = "";
        this.Purpose = "";
        this.Notes = "";
        this.CheckNumber = "";
        this.Appropriation = "";
        this.Allotment = "";
        this.OperatingAllowance = "";
        this.BureauAllotment = false;
        this.Bureau = "";
        this.AllotmentType = "";
        this.GiftFundsUsed = false;
        this.GiftFundAmount = 0;
        this.FundCiteNumber = "";
        this.RequestNumber = "";
        this.Account = "";
        this.RewardsProgram = "";
        this.RPPs = [];
        this.Attachments = [];
        this.Reimbursements = [];
        this.Obligations = [];
        this.FiscalYear = ""
        this.RepresentationType = ""

        
        this.GetPayment = get;
        this.SavePayment = save;
        this.BuildRequest = paymentBuildRequest;
        this.ParseResponse = paymentParseResponse;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;
        this.GetObligations = paymentGetObligations;
        this.FindObligations = paymentFindObligations;
        this.AddObligation = paymentAddObligation;
        this.NewObligation = paymentNewObligation;
        this.RemoveObligation = paymentRemoveObligation;
        this.GetNextFundCiteNumber = paymentGetNextFundCiteNumber;
        this.GetReturns = paymentGetReturns;
        this.GetReimbursements = paymentGetReimbursements;
        this.GetNextRPP = paymentGetNextRPP;

        //Constructor
        if (id) {
			return this.GetPayment(id);
		} else {
			return this;
		}
    }

	var Allotment = function(id) {
        //Properties
        this.Id;
        this.Title = "";
        this.Authority = "K000";
        this.Appr = "0522";
        this.NY = "X";
        this.Agency = "19/19";
        this.Auths = [];
        this.SOFs = [];
        this.Notes = "";
        this.Reimbursements = [];
        this.ItemType = "Allotment";
        this.Attachments = [];
        this.FiscalYear = "";

        //Methods
        this.GetAllotment = get;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;
        this.SaveAllotment = save;
        this.BuildRequest = allotmentBuildRequest;
        this.ParseResponse = allotmentParseResponse;
        this.GetCurrentAuth = allotmentGetCurrentAuth;
        this.AddAuth = allotmentAddAuth;
        this.NewAuth = allotmentNewAuth;
        this.GetAllotmentPrograms = allotmentGetAllotmentPrograms;
        this.GetNextChangeNumber = allotmentGetNextChangeNumber;
        this.GetSOFs = allotmentGetSOFs;
        this.GetUnsourcedFunds = allotmentGetUnsourcedFunds;
        this.GetSOFTable = allotmentGetSOFTable;
        this.AddSOF = allotmentAddSOF;
        this.NewSOF = allotmentNewSOF;
        this.GetReimbursements = allotmentGetReimbursements;
        this.GetReimbursableFunds = allotmentGetReimbursableFunds;
        this.NewReimbursement = allotmentNewReimbursement;

        //Constructor
        if (id) {
			return this.GetAllotment(id);
		} else {
			return this;
		}
    }

    var Obligation = function(id) {
        this.Id;
        this.ItemType = "Obligation";
        this.Purpose = "";
        this.Appropriation = "";
        this.Allotment = "";
        this.OperatingAllowance = "";
        this.PostCode = "";
        this.ObligationNumber = "";
        this.Date = new Date();
        this.Amount = 0;
        this.RestrictedFunds = 0;
        this.Description = "";
        this.RewardsProgram = "";
        this.RewardsPublicity = false;
        this.RPPs = [];
        this.Reimbursements = [];
        this.Attachments = [];
        this.FiscalYear = "";
        

        this.BuildRequest = obligationBuildRequest;
        this.ParseResponse = obligationParseResponse;
        this.DeleteObligation = deleteObligation;
        this.GetObligation = get;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;
        this.SaveObligation = save;
        this.GetPayments = obligationGetPayments;
        this.GetNextObligationNumber = obligationGetNextObligationNumber;
        this.CheckReimbursement = obligationCheckReimbursement;
        this.GetReimbursements = obligationGetReimbursements;
        this.FindReimbursements = obligationFindReimbursements;
        this.FindPayments = obligationFindPayments;

        //Constructor
        if (id) {
			return this.GetObligation(id);
		} else {
			return this;
		}
    }

    var PaymentReturn = function(id) {
        this.Id;
        this.PaymentReturnType = "";
        this.Amount = 0;
        this.GiftFundsUsed = false;
        this.GiftFundsAmount = 0;
        this.Date = new Date();
        this.Appropriation = "";
        this.Allotment = "";
        this.OperatingAllowance = "";
        this.Purpose = "";
        this.PostCode = "";
        this.Bureau = "";
        this.FiscalYear = "";
        this.PaymentReturnReason = "";
        this.PaymentReturnSources = [];
        this.Attachments = [];
        this.FiscalYear = ""
        this.RepresentationType = "";

        this.BuildRequest = paymentReturnBuildRequest;
        this.ParseResponse = paymentReturnParseResponse;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;
        this.GetPaymentReturn = get;
        this.SavePaymentReturn = save;
        this.GetPaymentReturnSources = paymentReturnGetPaymentReturnSources;
        this.FindPaymentReturnSources = paymentReturnFindPaymentReturnSources;
        this.CheckPaymentReturnSource = paymentReturnCheckPaymentReturnSource;

        if (id) {
			return this.GetPaymentReturn(id);
		} else {
			return this;
		}
    }

    var Reimbursement = function(id) {
        this.Id;
        this.AllotmentId;
        this.Agreement = "";
        this.Status = "";
        this.Program = "";
        this.Agency = "";
        this.Purpose = "";
        this.Amount = 0;
        this.CollectedAmount = 0;
        this.Date = new Date();
        this.ItemType = "Reimbursement";
        this.Attachments = [];
        this.FiscalYear = ""

        this.GetReimbursement = get;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;
        this.SaveReimbursement = save;
        this.BuildRequest = reimbursementBuildRequest;
        this.ParseResponse = reimbursementParseResponse;

        //Constructor
        if (id) {
			return this.GetReimbursement(id);
		} else {
			return this;
		}
    }

    var SourceOfFunds = function(id) {
        this.Id;
        this.AllotmentId = 0;
        this.Description = "";
        this.SOFType = "";
        this.Programs = [];
        this.ItemType = "SOF";
        this.Attachments = [];
        this.FiscalYear = "";

        this.GetSOF = get;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;
        this.SaveSOF = save;
        this.BuildRequest = sofBuildRequest;
        this.ParseResponse = sofParseResponse;

        //Constructor
        if (id) {
			return this.GetSOF(id);
		} else {
			return this;
		}
    }

    var AccountAdjustment = function(id) {
        this.Id;
        this.Date = new Date();
        this.Amount = 0;
        this.AdjustmentType = "";
        this.Notes = "";
        this.OperatingAllowance = "";
        this.GiftFundsAmount = 0;
        this.GiftFundsUsed = false;
        this.FiscalYear = "";

        this.BuildRequest = accountAdjustmentBuildRequest;
        this.ParseResponse = accountAdjustmentParseResponse;
        this.GetAccountAdjustment = get;
        this.SaveAccountAdjustment = save;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;

        if (id) {
            return this.GetAccountAdjustment(id);
        } else {
            return this;
        }
    }

    var AccountBalance = function(id) {
        this.Id;
        this.Date = new Date();
        this.Amount = 0;
        this.GiftFundsAvailableByOperatingAllowance = [
            { "OperatingAllowance": "100701", "Amount": 0},
            { "OperatingAllowance": "100702", "Amount": 0},
            { "OperatingAllowance": "100703", "Amount": 0},
            { "OperatingAllowance": "100704", "Amount": 0},
            { "OperatingAllowance": "100705", "Amount": 0},
            { "OperatingAllowance": "100706", "Amount": 0},
            { "OperatingAllowance": "100707", "Amount": 0},
            { "OperatingAllowance": "100708", "Amount": 0},
            { "OperatingAllowance": "100709", "Amount": 0},
            { "OperatingAllowance": "100710", "Amount": 0},
            { "OperatingAllowance": "100711", "Amount": 0}
        ];

        this.BuildRequest = accountBalanceBuildRequest;
        this.ParseResponse = accountBalanceParseResponse;
        this.GetAccountBalance = get;
        this.SaveAccountBalance = save;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;
        this.GetCheckingAccountBalance = getCheckingAccountBalance;
        this.GetMostRecentTransactions = getMostRecentTransactions;

        if (id) {
            return this.GetAccountBalance(id);
        } else {
            return this;
        }
    }
    
    var Deposit = function(id) {
        this.Id;
        this.Amount = 0;
        this.CheckNumber = "";
        this.Date = new Date();
        this.Memo = "";
        this.Purpose = "";
        this.Appropriation = "";
        this.Allotment = "";
        this.OperatingAllowance = "";
        this.ClearedStatus = false;
        this.GiftFundsUsed = false;
        this.GiftFundsAmount = 0;
        this.Attachments = [];
		this.FiscalYear = "";

        this.GetDeposit = get;
        this.SaveDeposit = save;
        this.BuildRequest = depositBuildRequest;
        this.ParseResponse = depositParseResponse;
        this.GetAttachments = getAttachments;
        this.AddAttachment = addAttachment;
        this.RemoveAttachment = removeAttachment;


        if (id) {
            return this.GetDeposit(id);
        } else {
            return this;
        }
    }

    var Alert = function(id) {
        this.Id;
        this.AlertStatus = "";
        this.Notes = "";
        this.ItemType = "Alert";
        this.Purpose = "";

        this.GetAlert = get;
        this.SaveAlert = save;
        this.GetAlerts = alertGetAlerts;
        this.GetAllAlerts = alertGetAllAlerts;
        this.BuildRequest = alertBuildRequest;
        this.ParseResponse = alertParseResponse;

        if (id) {
            return this.GetAlert(id);
        } else {
            return this;
        }
    }

    var RPP = function(id) {
        this.Id;
        this.RewardsProgram = "";
        this.RPP = "";
        this.Date = new Date();
        this.FiscalYear = "";

        this.GetRPP = get;
        this.SaveRPP = save;
        this.GetRPPs = rppGetRPPs;
        this.GetNextRPP = paymentGetNextRPP;
        this.GetByRPP = rppGetByRPP;
        this.GetPayments = rppGetPayments;
        this.BuildRequest = rppBuildRequest;
        this.ParseResponse = rppParseResponse;

        if (id) {
            return this.GetRPP(id);
        } else {
            return this;
        }
    }

    var Auth = function() {
        this.Change = 0;
        this.Date = new Date();
        this.Direct = {
            PreviousTotal: 0,
            ModTotal: 0,
            AuthTotal: 0
        };
        this.Reimbursable = {
            PreviousTotal: 0,
            ModTotal: 0,
            AuthTotal: 0
        };
        this.Programs = [];

        this.GetCurrentProgram = allotmentGetCurrentProgram;
        this.GetUnusedPrograms = allotmentGetUnusedPrograms;
        this.AddProgram = allotmentAddProgram;
        this.CalculateTotals = allotmentCalculateTotals;

        return this;
    }

    var Program = function() {
        this.Program = "";
        this.Direct = {
            Previous: 0,
            Mod: 0,
            Auth: 0
        };
        this.Reimbursable = {
            Previous: 0,
            Mod: 0,
            Auth: 0
        }
        return this;
    }
    
    var evacuationReportObject = function(){
    	var evacuation = this
    	
    	var evacObject = {}
    	
    	evacObject.CountryName = evacuation.Posts[0] + ", " + evacuation.Countries
    	
    	evacObject.Reason = evacuation.Reason
    	evacObject.SafeHaven = evacuation.Safehaven
    	
     	var RowsArray = []
    	
    	angular.forEach(evacuation.Extensions, function(extension, index) {
    		
    		var row = {}
			switch(extension.ExtensionLabel) {
			    case "First 30 Days":
			        row.Type = extension.EvacuationType + " (30)"
			        row.order = 1
			        break;			
			    case "First Extension":
			        row.Type = extension.EvacuationType + " (60)"
			        row.order = 2
			        break;
			    case "Second Extension":
			        row.Type = extension.EvacuationType + " (90)"
			        row.order = 3
			        break;
			    case "Third Extension":
			        row.Type = extension.EvacuationType + " (120)"
			        row.order = 4
			        break;
			    case "Fourth Extension":
			        row.Type = extension.EvacuationType + " (150)"
			        row.order = 5
			        break;
			    case "Fifth Extension":
			        row.Type = extension.EvacuationType + " (180)"
			        row.order = 6
			        break;
			    case "Ended":
			        row.Type = "Ended"
			        row.order = 10
			        break;

			}
			
			//row.Evacuees = extension.Evacuees // this is an array
			
			var EvacueesArray = []
			angular.forEach(extension.Evacuees , function(Evacuee , index) {
				
				var object = {}
				
				if(Evacuee.Type){object.EvacueeType = Evacuee.Type + ": "}
				else{object.EvacueeType = ""}
				
				object.Personnel = Evacuee.Personnel
				EvacueesArray.push(object)
			})
			
			row.Evacuees = EvacueesArray  

			
			if(extension.StartDate != null)
			{
				var sd = new Date(extension.StartDate)
				var month = ("0" + (sd.getMonth() + 1)).slice(-2)
				var day = ("0" + sd.getDate()).slice(-2)
				var year = sd.getFullYear()
				
				row.Start_Date = month + "/" + day + "/" + year
			}else{
				row.Start_Date = ""
			}
			
			var ed = new Date(extension.EndDate)
			
			var month = ("0" + (ed.getMonth() + 1)).slice(-2)
			var day = ("0" + ed.getDate()).slice(-2)
			var year = ed.getFullYear()			
			
			row.End_Date = month + "/" + day + "/" + year

    		row.Cables = extension.Cables
    		if(extension.ExtensionLabel != "Ended")
    		{
    			RowsArray.push(row)
    		}    		
    		if(extension.ExtensionLabel == "Ended")
    		{
    			var EndedRowArray = []
    			EndedRowArray.push(row)
    			evacObject.EndRow = EndedRowArray
    			
    			
    			
    			if(evacuation.OperatingStatus != ""&&evacuation.OperatingStatus != null)
    			{
    				evacObject.OperatingStatus = []
    				var Status = {}
    				Status.Status = evacuation.OperatingStatus
	    			evacObject.OperatingStatus.push(Status)
    			}
    		}
    		
    	});
    			
		var sortedArray = _.sortBy(RowsArray, 'order');
		evacObject.Rows = sortedArray.reverse()
		
		
		return evacObject
    }

    var evacuationGetEvacuationsReport = function() {
        var retVal = $q.defer();
        var dt = new Date();
        dt.setDate(dt.getDate() - 90);									//and EndDate ge datetime'" + dt.toISOString() + "' <- this was removed from filter below
        retVal.promise = UtilityService.getItems("?$filter=ItemType eq 'Evacuation' and EndDate ge datetime'" + dt.toISOString() + "' &$orderby=StartDate desc", ConfigService.getTransactionListName()).then(function(res) {
            var out = [];
            res.data.forEach(function(r,index) {
                var ev = new Evacuation();
                ev.ParseResponse(r);
                out.push(ev);
            });
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        })
        return retVal.promise;
    }

    var evacuationGetEvacuations = function() {
        var retVal = $q.defer();
        retVal.promise = UtilityService.getItems("?$filter=ItemType eq 'Evacuation' and Status ne 'Ended'&$orderby=StartDate desc", ConfigService.getTransactionListName()).then(function(res) {
            var out = [];
            res.data.forEach(function(r,index) {
                var ev = new Evacuation();
                ev.ParseResponse(r);
                out.push(ev);
            });
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        })
        return retVal.promise;
    }

    var evacuationGetAllEvacuations = function() {
        var retVal = $q.defer();
        retVal.promise = UtilityService.getItems("?$filter=ItemType eq 'Evacuation'&$orderby=StartDate desc",ConfigService.getTransactionListName()).then(function(res) {
            var out = [];
            res.data.forEach(function(r,index) {
                var ev = new Evacuation();
                ev.ParseResponse(r);
                out.push(ev);
            });
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        })
        return retVal.promise;
    }

    var evacuationNewExtension = function(end) {
        var that = this;
        var ext = {};
        if (!end) {
            switch (that.Extensions.length) {
                case 0:
                    ext.ExtensionLabel = "First 30 Days";
                    var sd = new Date(that.StartDate );
                    var startDate = new Date(sd);
                    var endDate = sd.setDate(sd.getDate() + 29);
                    ext.StartDate = new Date(startDate);
                    ext.EndDate = new Date(endDate);
                    ext.Cables = [];
                    ext.ActionMemo = [];
                    ext.Evacuees = [];
                    break;
                case 1:
                    ext.ExtensionLabel = "First Extension";
                    var sd = new Date(that.Extensions[0].EndDate );
                    var startDate = sd.setDate(sd.getDate() + 1);
                    var endDate = sd.setDate(sd.getDate() + 29);
                    ext.StartDate = new Date(startDate);
                    ext.EndDate = new Date(endDate);
                    ext.Cables = [];
                    ext.ActionMemo = [];
                    ext.Evacuees = [];
                    break;
                case 2:
                    ext.ExtensionLabel = "Second Extension";
                    var sd = new Date(that.Extensions[1].EndDate );
                    var startDate = sd.setDate(sd.getDate() + 1);
                    var endDate = sd.setDate(sd.getDate() + 29);
                    ext.StartDate = new Date(startDate);
                    ext.EndDate = new Date(endDate);
                    ext.Cables = [];
                    ext.ActionMemo = [];
                    ext.Evacuees = [];
                    break;
                case 3:
                    ext.ExtensionLabel = "Third Extension";
                    var sd = new Date(that.Extensions[2].EndDate );
                    var startDate = sd.setDate(sd.getDate() + 1);
                    var endDate = sd.setDate(sd.getDate() + 29);
                    ext.StartDate = new Date(startDate);
                    ext.EndDate = new Date(endDate);
                    ext.Cables = [];
                    ext.ActionMemo = [];
                    ext.Evacuees = [];
                    break;
                case 4:
                    ext.ExtensionLabel = "Fourth Extension";
                    var sd = new Date(that.Extensions[3].EndDate );
                    var startDate = sd.setDate(sd.getDate() + 1);
                    var endDate = sd.setDate(sd.getDate() + 29);
                    ext.StartDate = new Date(startDate);
                    ext.EndDate = new Date(endDate);
                    ext.Cables = [];
                    ext.ActionMemo = [];
                    ext.Evacuees = [];
                    break
                case 5:
                    ext.ExtensionLabel = "Fifth Extension";
                    var sd = new Date(that.Extensions[4].EndDate );
                    var startDate = sd.setDate(sd.getDate() + 1);
                    var endDate = sd.setDate(sd.getDate() + 29);
                    ext.StartDate = new Date(startDate);
                    ext.EndDate = new Date(endDate);
                    ext.Cables = [];
                    ext.ActionMemo = [];
                    ext.Evacuees = [];
                    break
                case 6:
                    ext.ExtensionLabel = "Ended";
                    var sd = new Date(that.Extensions[5].EndDate );
                    var startDate = sd.setDate(sd.getDate());
                    var endDate = sd.setDate(sd.getDate());
                    ext.StartDate = new Date(startDate);
                    ext.EndDate = new Date(endDate);
                    ext.Cables = [];
                    ext.ActionMemo = [];
                    ext.Evacuees = [];
                    break

                default:
                    break
            }
        } else {
            ext.ExtensionLabel = "Ended";
            var sd = new Date(that.Extensions[that.Extensions.length - 1].EndDate );
            var startDate = sd.setDate(sd.getDate());
            var endDate = sd.setDate(sd.getDate());
            ext.StartDate = new Date(startDate);
            ext.EndDate = new Date(endDate);
            ext.Cables = [];
            ext.ActionMemo = [];
            ext.Evacuees = [];
        }
        
        return ext;
    }

    var evacuationSetEndDate = function() {
        var that = this;
        var sd;
        if (that.Extensions.length == 0) {
            sd = new Date(that.StartDate);
            that.EndDate = new Date(sd.setDate(sd.getDate() + 29));
        } else {
            sd = new Date(that.Extensions[that.Extensions.length - 1].StartDate);
            that.EndDate = new Date(sd.StartDate.setDate(sd.setDate(sd.getDate() + 29)));
        }
    }

    var extensionSetEndDate = function(extensionStartDate) {
        var startDate = extensionStartDate;
        var sd;
        sd = new Date(startDate );
        var EndDate = new Date(sd.setDate(sd.getDate() + 29));
        
        return EndDate         
    }
    

    var alertGetAlerts = function() {
        var retVal = $q.defer();
        var alertFilter = "<View><Query><Where><And><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Alert</Value></Eq><Neq><FieldRef Name='AlertStatus' /><Value Type='Text'>Dismissed</Value></Eq></And></Where></Query></View>";
        retVal.promise = UtilityService.getItemsCAML(alertFilter, ConfigService.getTransactionListName()).then(function(res) {
            var out = [];
            res.forEach(function(v,i) {
                var a = new Alert();
                a.ParseResponse(v);
                out.push(a);
            })
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
    }
    
    var alertGetAllAlerts = function() {
    
        var retVal = $q.defer();
        var alertFilter = "<View><Query><Where><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Alert</Value></Eq></Where></Query></View>";
        retVal.promise = UtilityService.getItemsCAML(alertFilter, ConfigService.getTransactionListName()).then(function(res) {
            var out = [];
            res.forEach(function(v,i) {
                var a = new Alert();
                a.ParseResponse(v);
                out.push(a);
            })
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;

    }


    /* Query for Payment Calculation
        <View>
            <Query>
                <Where>
                    <And>
                        <Or>
                            <Eq><FieldRef Name='ItemType' /><Value Type='Text'>Deposit</Value></Eq>
                                <Or>
                                    <Eq><FieldRef Name='ItemType' /><Value Type='Text'>Payment</Value></Eq>
                                    <Or>
                                        <Eq><FieldRef Name='ItemType' /><Value Type='Text'>PaymentReturn</Value></Eq>
                                        <Eq><FieldRef Name='ItemType' /><Value Type='Text'>AccountAdjustment</Value></Eq>
                                    </Or>
                                </Or>
                        </Or>
                            <Eq><FieldRef Name='Created' /><Value Type='DateTime'>" + startDate + "</Value></Eq>
                    </And>
                </Where>
            </Query>
        </View>
    */

    var getCheckingAccountBalance = function() {
        var lastBalance = $q.defer();
        var balanceFilter = "?$top=1&orderby=Created desc&$filter=ItemType eq 'AccountBalance'";
        lastBalance.promise = UtilityService.getItems(balanceFilter, ConfigService.getTransactionListName()).then(function(res) {
            var bal = new AccountBalance();
            bal.ParseResponse(res.data[0]);
            var startDate = new Date(bal.Date);
            var transactionsPromise = $q.defer();
            var transactionFilter = "<View><Query><Where><And><Or><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Deposit</Value></Eq><Or><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Payment</Value></Eq><Or><Eq><FieldRef Name='ItemType' /><Value Type='Text'>PaymentReturn</Value></Eq><Eq><FieldRef Name='ItemType' /><Value Type='Text'>AccountAdjustment</Value></Eq></Or></Or></Or><Geq><FieldRef Name='Created' /><Value Type='DateTime'>" + startDate.toISOString() + "</Value></Geq></And></Where></Query></View>";
            transactionsPromise.promise = UtilityService.getItemsCAML(transactionFilter,ConfigService.getTransactionListName()).then(function(transactions) {
                var checkingAccountBalance = bal.Amount;
                var giftFundsByOperatingAllowance = bal.GiftFundsAvailableByOperatingAllowance;
                transactions.forEach(function(t,index) {
                    //Handle data import inconsistencies
                    if (isNaN(parseFloat(t.GiftFundsAmount))) {
                        t.GiftFundsAmount = 0;
                    }
                    if (isNaN(parseFloat(t.Amount))) {
                        t.Amount = 0;
                    }
                    var found = false;
                    var counter = 0;
                    switch (t.ItemType) {
                        case "Payment":
                            switch (t.PaymentType) {
                                case 'Fund Cite':
                                    //Do nothing, no checking account activity
                                    break;
                                case 'SPS Transfer':
                                    //Only include if destination is a drawdown to the MEDCS Checking Account
                                    if (t.Account == ConfigService.getMEDCSCheckingAccount()) {
                                        checkingAccountBalance = parseFloat(checkingAccountBalance) + parseFloat(t.Amount);
                                    }
                                    if (t.GiftFundsUsed && !IsNullOrUndefined(t.OperatingAllowance)) {
                                        while (!found) {
                                            if (giftFundsByOperatingAllowance[counter].OperatingAllowance == t.OperatingAllowance) {
                                                found = true; 
                                            } else {
                                                counter++;
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    checkingAccountBalance = parseFloat(checkingAccountBalance) - parseFloat(t.Amount);
                                    if (t.GiftFundsUsed && !IsNullOrUndefined(t.OperatingAllowance)) {
                                        while (!found) {
                                            if (giftFundsByOperatingAllowance[counter].OperatingAllowance == t.OperatingAllowance) {
                                                found = true; 
                                            } else {
                                                counter++;
                                            }
                                        }
                                    }
                                    break;
                            }
                            break;
                        case "PaymentReturn":
                            checkingAccountBalance = parseFloat(checkingAccountBalance) + parseFloat(t.Amount);
                            if (t.GiftFundsUsed && !IsNullOrUndefined(t.OperatingAllowance)) {
                                while (!found) {
                                    if (giftFundsByOperatingAllowance[counter].OperatingAllowance == t.OperatingAllowance) {
                                        found = true; 
                                    } else {
                                        counter++;
                                    }
                                }
                            }
                            break;
                        case "Deposit":
                            checkingAccountBalance = parseFloat(checkingAccountBalance) + parseFloat(t.Amount);
                            if (t.GiftFundsUsed && !IsNullOrUndefined(t.OperatingAllowance)) {
                                while (!found) {
                                    if (giftFundsByOperatingAllowance[counter].OperatingAllowance == t.OperatingAllowance) {
                                        found = true; 
                                    } else {
                                        counter++;
                                    }
                                }
                            }
                            break;
                        case "AccountAdjustment":
                            switch (t.AdjustmentType) {
                                case 'Credit':
                                    checkingAccountBalance = parseFloat(checkingAccountBalance) + parseFloat(t.Amount);
                                    if (t.GiftFundsUsed && !IsNullOrUndefined(t.OperatingAllowance)) {
                                        while (!found) {
                                            if (giftFundsByOperatingAllowance[counter].OperatingAllowance == t.OperatingAllowance) {
                                                found = true; 
                                            } else {
                                                counter++;
                                            }
                                        }
                                    }
                                    break;
                                case 'Debit':
                                    checkingAccountBalance = parseFloat(checkingAccountBalance) - parseFloat(t.Amount);
                                    if (t.GiftFundsUsed && !IsNullOrUndefined(t.OperatingAllowance)) {
                                        while (!found) {
                                            if (giftFundsByOperatingAllowance[counter].OperatingAllowance == t.OperatingAllowance) {
                                                found = true; 
                                            } else {
                                                counter++;
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                    giftFundsByOperatingAllowance[counter].Amount = parseFloat(giftFundsByOperatingAllowance[counter].Amount) + parseFloat(t.GiftFundsAmount);
                });
                var ab = new AccountBalance();
                ab.Date = new Date();
                ab.Amount = checkingAccountBalance;
                ab.GiftFundsAvailableByOperatingAllowance = giftFundsByOperatingAllowance;
                // var save = $q.defer();
                // save.promise = ab.SaveAccountBalance().then(function(ab) {
                //     save.resolve(ab);
                // }, function(err) {
                //     save.reject(err);
                // });
                // return save.promise;
                
                transactionsPromise.resolve(ab);
            }, function(err) {
                transactionsPromise.reject(err);
            });
            return transactionsPromise.promise;
        });
        return lastBalance.promise;
    };
    
    var getMostRecentTransactions = function() {
        var transactionsPromise = $q.defer();
        var transactionFilter = "<View><Query><Where><And><Or><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Deposit</Value></Eq><Or><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Payment</Value></Eq><Or><Eq><FieldRef Name='ItemType' /><Value Type='Text'>PaymentReturn</Value></Eq><Eq><FieldRef Name='ItemType' /><Value Type='Text'>AccountAdjustment</Value></Eq></Or></Or></Or><Neq><FieldRef Name='PaymentType' /><Value Type='Text'>Fund Cite</Value></Neq></And></Where><OrderBy><FieldRef Name='Date' Ascending='False' /></OrderBy></Query></View>";
        transactionsPromise.promise = UtilityService.getItemsCAML(transactionFilter,ConfigService.getTransactionListName()).then(function(res) {
            transactionsPromise.resolve(res);
        }, function(err) {
            transactionsPromise.reject(err);
        });
        return transactionsPromise.promise;
    };

    var paymentReturnFindPaymentReturnSources = function(searchText) {
        var that = this;
        var retVal = $q.defer();
        var purposeFilter = "?&$filter=substringof('" + searchText + "',Purpose)";
        var programFilter = "?&$filter=substringof('" + searchText + "',Payee)";
        var agencyFilter = "?&$filter=substringof('" + searchText + "',OperatingAllowance)";
        var purposeGet = UtilityService.getItems(purposeFilter, ConfigService.getTransactionListName());
        var programGet = UtilityService.getItems(programFilter, ConfigService.getTransactionListName());
        var agencyGet = UtilityService.getItems(agencyFilter, ConfigService.getTransactionListName());
        retVal.promise = $q.all([purposeGet, programGet, agencyGet]).then(function(res) {
            var out = [];
            var searchResults = res[0].data.concat(res[1].data)
            searchResults = searchResults.concat(res[2].data);
            searchResults.forEach(function(result,index){
                if (result.ItemType == 'Payment') {
                    if (out.length > 0) {
                        var found = false;
                        var existing = false;
                        out.forEach(function(entry, i) {
                            if (entry.Id == result.Id) {
                                found = true;
                            }
                        });
                        that.PaymentReturnSources.forEach(function(prs,ind) {
                            if (result.Id == prs.Id) {
                                found = true;
                            }
                        });
                        if (!found && !existing) {
                            var newPayment = new Payment();
                            newPayment.ParseResponse(result);
                            out.push(newPayment);
                        };
                    } else {
                        var newPayment = new Payment();
                        newPayment.ParseResponse(result);
                        out.push(newPayment);
                    }
                }
            });
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
    }

    var paymentReturnCheckPaymentReturnSource = function(pmt) {
        var that = this;
        var found = false;
        that.PaymentReturnSources.forEach(function(p,i) {
            if (p == pmt.Id) {
                found = true;
            };
        })
        return !found;
    }

    var paymentReturnGetPaymentReturnSources = function() {
        var retVal = $q.defer();
        var that = this;
        var out = [];
        that.PaymentReturnSources.forEach(function(p,i) {
            var pmt = new Payment(p);
            out.push(pmt);
        });
        retVal.promise = $q.all(out).then(function(res) {
            retVal.resolve(res);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
    }

    var allotmentGetNextChangeNumber = function() {
        var changeNumbers = _(this.Auths).pluck("Change");
        var chg = Math.max.apply(null, changeNumbers);
        return chg + 1;
    }
    var allotmentNewAuth = function() {
        var that = this;
        if (that.Auths.length > 0) {
            var a = new Auth();
            a.Change = this.GetNextChangeNumber();
            a.Date = new Date();
            var lastAuth = this.Auths[this.Auths.length - 1];
            a.Direct.PreviousTotal = lastAuth.Direct.AuthTotal;
            a.Reimbursable.PreviousTotal = lastAuth.Reimbursable.AuthTotal;
            lastAuth.Programs.forEach(function(p) {
                var op = new Program();
                op.Program = p.Program;
                op.Direct.Auth = _(that.Auths).chain().pluck("Programs").flatten().filter(function(val) {
                        return val.Program == p.Program;
                    }).pluck("Direct").pluck("Mod").reduce(function(memo,val) {
                        return parseFloat(memo) + parseFloat(val);
                    },0).value();
                a.Direct.AuthTotal += parseFloat(op.Direct.Auth);
                op.Direct.Previous = p.Direct.Auth;
                op.Reimbursable.Auth = _(that.Auths).chain().pluck("Programs").flatten().filter(function(val) {
                        return val.Program == p.Program;
                    }).pluck("Reimbursable").pluck("Mod").reduce(function(memo,val) {
                        return parseFloat(memo) + parseFloat(val);
                    },0).value();
                a.Reimbursable.AuthTotal += parseFloat(op.Reimbursable.Auth);
                op.Reimbursable.Previous = p.Reimbursable.Auth;
                a.Programs.push(op);
            });
            
            return a;
        } else {
            var a = new Auth();
            a.Change = 1;
            a.Date = new Date();
            a.Direct.PreviousTotal = 0;
            a.Reimbursable.PreviousTotal = 0;
            return a;
        }
    }

	var allotmentAddAuth = function() {
        var that = this;
        if (that.Auths.length > 0) {
            var a = new Auth();
            a.Change = this.GetNextChangeNumber();
            a.Date = new Date();
            var lastAuth = this.Auths[this.Auths.length - 1];
            a.Direct.PreviousTotal = lastAuth.Direct.AuthTotal;
            a.Reimbursable.PreviousTotal = lastAuth.Reimbursable.AuthTotal;
            lastAuth.Programs.forEach(function(p) {
                var op = new Program();
                op.Program = p.Program;
                op.Direct.Previous = p.Direct.Auth;
                op.Reimbursable.Previous = p.Reimbursable.Auth;
                a.Programs.push(op);
            });
            this.Auths.push(a);
        } else {
            var a = new Auth();
            a.Change = 1;
            a.Date = new Date();
            a.Direct.PreviousTotal = 0;
            a.Reimbursable.PreviousTotal = 0;
            this.Auths.push(a);
        }
	}

    var allotmentCalculateTotals = function() {
        var that = this;
        that.Programs.forEach(function(prog,index) {
            prog.Direct.Auth = parseFloat(prog.Direct.Previous) + parseFloat(prog.Direct.Mod);
            prog.Reimbursable.Auth = parseFloat(prog.Reimbursable.Previous) + parseFloat(prog.Reimbursable.Mod);
        });
        that.Direct.PreviousTotal = _(that.Programs).chain().pluck("Direct").reduce(function(memo,num){
            return memo + parseFloat(num.Previous);
        },0).value();
        that.Direct.ModTotal = _(that.Programs).chain().pluck("Direct").reduce(function(memo,num){
            return memo + parseFloat(num.Mod);
        },0).value();
        that.Direct.AuthTotal = _(that.Programs).chain().pluck("Direct").reduce(function(memo,num){
            return memo + parseFloat(num.Auth);
        },0).value();
        that.Reimbursable.PreviousTotal = _(that.Programs).chain().pluck("Reimbursable").reduce(function(memo,num){
            return memo + parseFloat(num.Previous);
        },0).value();
        that.Reimbursable.ModTotal = _(that.Programs).chain().pluck("Reimbursable").reduce(function(memo,num){
            return memo + parseFloat(num.Mod);
        },0).value();
        that.Reimbursable.AuthTotal = _(that.Programs).chain().pluck("Reimbursable").reduce(function(memo,num){
            return memo + parseFloat(num.Auth);
        },0).value();
    }

    var allotmentGetCurrentAuth = function(index) {
        var that = this;
        if (that.Auths.length > 0) {
            if (index) {
                var ret;
                that.Auths.forEach(function(val, ind) {
                    if (val.Change == index) {
                        ret = val;
                    }
                })
                return ret;
            } else {
                var changeNumbers = _(this.Auths).pluck("Change");
                var chg = Math.max.apply(null, changeNumbers);
                var ret;
                this.Auths.forEach(function(val) {
                    if (val.Change == chg) {
                        ret = val;
                    }
                })
                //return ret;
                //Bug fix for GetCurrentAuth - return copy not instance
                return angular.copy(ret);
            }
        } else {
            return new Auth();
        }
    }

    var allotmentAddProgram = function() {
        var p = new Program();
        this.Programs.push(p);
    }

    var allotmentGetCurrentProgram = function(index) {
        if (index) {
            return this.Programs[i];
        } else {
            return new Program();
        }
    }

    var allotmentGetUnusedPrograms = function(appr) {
        var usedPrograms = _(this.Programs).chain().pluck("Program").value();
        var leftOvers = [];
        var retVal = $q.defer();
        retVal.promise = LOVService.getFunds(appr).then(function(res) {
            res.forEach(function(p) {
                var found = false;
                usedPrograms.forEach(function(up) {
                    if (up == p.ValueOfItem) {
                        found = true;
                    }
                })
                if (!found) {
                    leftOvers.push(p);
                }
            })
            retVal.resolve(leftOvers);
        })
        return retVal.promise;
    }

    var allotmentGetAllotmentPrograms = function() {
        var that = this;
        var progs = _(that.Auths).chain().pluck("Programs").flatten().pluck('Program').unique().value();
        return progs;
    }

    var allotmentGetUnsourcedFunds = function() {
        var that = this;
        var auth = that.GetCurrentAuth();
        var Programs = auth.Programs;
        var retVal = $q.defer();
        var UnsourcedFunds = [];
        retVal.promise = that.GetSOFs().then(function(res) {
            Programs.forEach(function(p, index) {
                UnsourcedFunds[index] = {};
                UnsourcedFunds[index].Program = p.Program;
                var SourcedFunds = _(res).chain().flatten().pluck("Programs").flatten().filter(function(val) { return val.Program == p.Program; }).pluck("Amount").reduce(function(memo,val){ return parseFloat(memo) + parseFloat(val); }).value();
                var AuthorizedFunds = parseFloat(p.Direct.Auth) + parseFloat(p.Reimbursable.Auth);
                if (!isNaN(SourcedFunds)) {
                    UnsourcedFunds[index].UnsourcedFunds = parseFloat(AuthorizedFunds) - parseFloat(SourcedFunds);
                } else {
                    UnsourcedFunds[index].UnsourcedFunds = parseFloat(AuthorizedFunds);
                }	
            });
            retVal.resolve(UnsourcedFunds);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
    }

    var allotmentNewSOF = function() {
        var that = this;
        var s = new SourceOfFunds();
        s.AllotmentId = that.Id;
        var AllotmentPrograms = that.GetAllotmentPrograms();
        AllotmentPrograms.forEach(function(program, index) {
            s.Programs.push({ Program: program, Amount: 0, UnrestrictedFunds: 0, RestrictedFunds: 0, Other: 0, Evacuations: 0 });
        });
        return s;
    }

    var allotmentAddSOF = function() {
        var that = this;
        var s = new SourceOfFunds();
        s.AllotmentId = that.Id;
        var AllotmentPrograms = that.GetAllotmentPrograms();
        AllotmentPrograms.forEach(function(program, index) {
            s.Programs.push({ Program: program, Amount: 0, UnrestrictedFunds: 0, RestrictedFunds: 0, Other: 0 });
        });
        that.SOFs.push(s);
    }

    var allotmentGetSOFs = function() {
        var that = this;
        var retVal = $q.defer();
        var out = [];
        if (that.Id) {
            retVal.promise = UtilityService.getItems("?$filter=AllotmentId eq " + that.Id + " and ItemType eq 'SOF'&$select=Id,Desc,AllotmentId,Programs", ConfigService.getTransactionListName()).then(function(res) {
                res.data.forEach(function(val) {
                    var s = new SourceOfFunds();
                    s.ParseResponse(val);
                    out.push(s);
                });
                retVal.resolve(out);
            }, function(err) {
                retVal.reject(err);
            });
        } else {
            retVal.resolve(out);
        }
        return retVal.promise;
    }

    var allotmentGetSOFTable = function() {
        var retVal = $q.defer();
        var that = this;
        var out = {};
        out.Rows = [];
        out.Cols = [];
        out.Objects = [];
        out.TotalRow = [];
        var progs = that.GetAllotmentPrograms();
        out.Cols.push("Description");
        out.Cols = out.Cols.concat(progs);
        out.Cols.push("Total");
        out.TotalRow[0] = {'Type': 'Text', 'Value': 'Total' };
        if (this.Id) {
            retVal.promise = UtilityService.getItems("?$filter=AllotmentId eq " + that.Id + " and ItemType eq 'SOF'&$select=Id,Desc,AllotmentId,Programs", ConfigService.getTransactionListName()).then(function(res) {
                if (res.data.length > 0) {
                    out.Objects = res.data;
                    var rowTotal = 0;
                    angular.forEach(res.data, function(val, index) {
                        var newRow = [];
                        newRow[0] = {'Type': 'Text', 'Value': val.Desc };
                        var p = JSON.parse(val.Programs);
                        for (var i = 1; i < out.Cols.length - 1; i++) {
                            p.forEach(function(singleProgram, indexCounter) {
                                if (singleProgram.Program == out.Cols[i]) {
                                    newRow[i] = { 'Type': 'Currency', 'Value': parseFloat(singleProgram.Amount) };
                                    rowTotal += parseFloat(singleProgram.Amount);
                                }
                            })
                        }
                        newRow[out.Cols.length - 1] = { 'Type': 'Currency', 'Value': rowTotal };
                        rowTotal = 0;
                        out.Rows.push(newRow);
                    });
                }
                for (var i = 1; i < out.Cols.length; i++) {
                    var val = out.Cols[i];
                    var total = _.reduce(out.Rows, function(outVal,row) {
                        if (row[i]) {
                            return outVal + parseFloat(row[i].Value);
                        } else {
                            return outVal;
                        }
                    }, 0);
                    out.TotalRow[i] = { 'Type': 'Currency', 'Value': total };
                }
			

                retVal.resolve(out);
            }, function(err) {
                retVal.reject(err);
            })
        } else {
            for (var i = 1; i < out.Cols.length; i++) {
                var val = out.Cols[i];
                var total = _.reduce(out.Rows, function(outVal,row) {
                    if (row[val]) {
                        return outVal + parseFloat(row[val]);
                    } else {
                        return outVal;
                    }
                    
                }, 0);
                out.TotalRow[i] = total;
            }
            retVal.resolve(out);
        }
        
        return retVal.promise;
    }

    var allotmentNewReimbursement = function() {
        var that = this;
        var r = new Reimbursement();
        r.AllotmentId = that.Id;
        return r;
    }

    var allotmentGetReimbursements = function() {
        var that = this;
        var retVal = $q.defer();
        if (that.Id) {
            retVal.promise = UtilityService.getItems("?$filter=AllotmentId eq " + that.Id + " and ItemType eq 'Reimbursement'&$select=Id,Agreement,AllotmentId,Program,Purpose,Amount,Date", ConfigService.getTransactionListName()).then(function(res) {
                var outReimbursements = [];
                for (var i = 0; i < res.data.length; i++) {
                    var r = new Reimbursement();
                    r.ParseResponse(res.data[i]);
                    outReimbursements.push(r);
                }
                retVal.resolve(outReimbursements);
            }, function(err) {
                retVal.reject(err);
            });
        } else {
            retVal.resolve([]);
        }
        return retVal.promise;
    }

    var allotmentGetReimbursableFunds = function(program) {
        var that = this;
        var out = [];
        that.GetCurrentAuth().Programs.forEach(function(p,index) {
            var prog = {};
            prog.Program = p.Program;
            prog.Amount = p.Reimbursable.Auth;
            out.push(prog);
        });
        var retVal =  $q.defer();
        retVal.promise = that.GetReimbursements().then(function(res) {
            res.forEach(function(r,index) {
                // Start - KFUN-370 - SG
                var index = 0;
                var found = false;
                while(!found) {
                    if (out[index].Program == r.Program) {
                        found = true;
                        out[index].Amount = parseFloat(out[index].Amount) - parseFloat(r.Amount);
                    } 
                    index++;
                }
                // var itemIndex = out.findIndex(function(entry) {
                //     return entry.Program == r.Program;
                // });
                // out[itemIndex].Amount = parseFloat(out[itemIndex].Amount) - parseFloat(r.Amount);
                // End - KFUN-370 - SG
            });
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
    };

    var paymentGetNextRPP = function() {
        var that = this;
        var retVal = $q.defer();
        if (that.RewardsProgram) {
            retVal.promise = UtilityService.getItems("?$filter=ItemType eq 'RPP' and RewardsProgram eq '" + this.RewardsProgram + "'", ConfigService.getTransactionListName()).then(function(res) {
                var out = UtilityService.getTwoDigitFiscalYear(that.Date) + "-";
                if (res.data.length == 0) {
                    switch (that.RewardsProgram) {
                        case "Terrorism":
                            out = out + "01";
                            break;
                        case "Narcotics":
                            out = out + "21";
                            break;
                        case "War Crimes":
                            out = out + "41";
                            break;
                        case "Transnational Organized Crime":
                            out = out + "61";
                            break;
                        default:
                            out += out + "81";
                            break;
                    }
                } else {
                    var RPPs = _(res.data).chain().flatten().pluck("RPP").reduce(function(memo,val) {
                        var memoNum = parseFloat(memo.substring(memo.length - 2, memo.length));
                        var valNum = parseFloat(val.substring(val.length - 2, val.length));
                        if (memoNum > valNum) {
                            if (memoNum.toString().length == 1) {
                                memoNum = "0" + memoNum.toString();
                            }
                            return memoNum.toString();
                        } else {
                            if (valNum.toString().length == 1) {
                                valNum = "0" + valNum.toString();
                            }
                            return valNum.toString();
                        }
                    }).value();
                    var nextNum = Number(RPPs.toString().substring(RPPs.length-2,RPPs.length)) + 1;
                    if (nextNum.toString().length == 1) {
                        nextNum = "0" + nextNum.toString()
                    }
                    out += nextNum.toString();
                }
                that.RPP = out;
            })
            return retVal.promise;
        } else {
            return false;
        }
    }

    var obligationGetNextObligationNumber = function(ExistingObligationNumbers) {
        var that = this;
        var retVal = $q.defer();
        if (that.Allotment == '1007') {
            if (that.Allotment && that.Allotment.length > 0 && that.OperatingAllowance && that.OperatingAllowance.length > 0) {            
              if (ExistingObligationNumbers.length > 0) { 
					var filteredByOpAllowance =_.where(ExistingObligationNumbers, {OperatingAllowance :  that.OperatingAllowance});  
					var FY = UtilityService.getTwoDigitFiscalYear(that.Date)  
                	var filteredByFY = _.where(filteredByOpAllowance , {FiscalYear : FY});

                	if(filteredByFY.length > 0)
                	{                                          
  				    	var retData = _.pluck(filteredByFY, 'ObligationNumber');				    	
				    	var Last3Array = []
				    	angular.forEach(retData , function(value, index) {
                            if (!IsNullOrUndefined(value) && !!value) {
                                Last3Array.push(value.substr(value.length - 3))
                            }
				    	})				    	
				    	var sortList = []
				    	angular.forEach(Last3Array, function(last3Number, index) {
				    		if(!isNaN(last3Number))
				    		{
				    			sortList.push(last3Number)
				    		}
				    	})
                        if (sortList.length == 0) {
                            sortList.push(0);
                        }
				    	sortList.sort()
				    	var NumberToReturn = 0
				    	if(Number(sortList[sortList.length - 1]) < 999)
				    	{
				    		NumberToReturn = Number(sortList[sortList.length - 1]) + 1
				    	}else{
					    	for (i = 0; i < sortList.length; i++) { 
							    var sum = sortList[i] - sortList[i+1]
							    
							    if(sum != -1)
							    {
							    	NumberToReturn = Number(sortList[i]) + 1
							    	break
							    }		    
							}    	
				    	}                             
                        NumberToReturn = NumberToReturn.toString();
   						while (NumberToReturn.length < 3){ NumberToReturn = "0" + NumberToReturn;}  
   						var ObligationNumber = that.Allotment.toString() + UtilityService.getFiscalYear(that.Date).toString() + that.OperatingAllowance.toString().substring(that.OperatingAllowance.toString().length - 2, that.OperatingAllowance.toString().length) + NumberToReturn                                     
                        that.ObligationNumber = ObligationNumber.toString();
                        retVal.resolve(ObligationNumber);
                    }  else {
                        that.ObligationNumber = that.Allotment.toString() + UtilityService.getFiscalYear(that.Date).toString() + that.OperatingAllowance.toString().substring(that.OperatingAllowance.toString().length - 2, that.OperatingAllowance.toString().length) + "001";
                        retVal.resolve(that.ObligationNumber);
                    }                      
                } else {
                    that.ObligationNumber = that.Allotment.toString() + UtilityService.getFiscalYear(that.Date).toString() + that.OperatingAllowance.toString().substring(that.OperatingAllowance.toString().length - 2, that.OperatingAllowance.toString().length) + "001";
                    retVal.resolve(that.ObligationNumber);
                }
            } else {
                that.ObligationNumber = "";
                retVal.resolve("");
            }
        } else {
            if (that.Allotment && that.Allotment.length > 0 && that.PostCode && that.PostCode.length > 0) {
                if (ExistingObligationNumbers.length > 0) {
                	var filteredByPostCode  =_.where(ExistingObligationNumbers, {PostCode :  that.PostCode });   
                	var FY = UtilityService.getTwoDigitFiscalYear(that.Date)  
                	var filteredByFY = _.where(filteredByPostCode , {FiscalYear : FY});
                	                                        
			    		
			    	if(filteredByFY.length > 0)
			    	{	
			    		var retData = _.pluck(filteredByFY , 'ObligationNumber');		    	
				    	var Last3Array = []
				    	angular.forEach(retData , function(value, index) {
				    		Last3Array.push(value.substr(value.length - 3))			    		
				    	})				    	
				    	var sortList = []
				    	angular.forEach(Last3Array, function(last3Number, index) {
				    		if(!isNaN(last3Number))
				    		{
				    			sortList.push(last3Number)
				    		}
				    	})
				    	sortList.sort()
				    	var NumberToReturn = 0
				    	if(Number(sortList[sortList.length - 1]) < 999)
				    	{
				    		NumberToReturn = Number(sortList[sortList.length - 1]) + 1
				    	}else{
					    	for (i = 0; i < sortList.length; i++) { 
							    var sum = sortList[i] - sortList[i+1]
							    
							    if(sum != -1)
							    {
							    	NumberToReturn = Number(sortList[i]) + 1
							    	break
							    }		    
							}    	
				    	}                              
                        NumberToReturn = NumberToReturn.toString();
   						while (NumberToReturn.length < 3){ NumberToReturn = "0" + NumberToReturn;}  
   						var ObligationNumber = that.Allotment.toString() + UtilityService.getFiscalYear(that.Date).toString() + that.PostCode.toString() +  NumberToReturn                                     
                        that.OperatingAllowance = "2003"
                        that.ObligationNumber = ObligationNumber.toString();
                        retVal.resolve(ObligationNumber.toString());
                    }else {
                        that.ObligationNumber = that.Allotment.toString() + UtilityService.getFiscalYear(that.Date).toString() + that.PostCode.toString() + "001";
                        that.OperatingAllowance = "2003"
                        retVal.resolve(that.ObligationNumber);
                    }                       
	             } else {
                    that.ObligationNumber = that.Allotment.toString() + UtilityService.getFiscalYear(that.Date).toString() + that.PostCode.toString() + "001";
                    that.OperatingAllowance = "2003"
                    retVal.resolve(that.ObligationNumber);
                }
            } else {
                that.ObligationNumber = "";
                retVal.resolve("");
            }
        }
        return retVal.promise;
    }

    var obligationGetReimbursements = function() {
        var that = this;
        if (that.Id && that.Id != "") {
            var promisesArray = [];
            that.Reimbursements.forEach(function(r,index) {
                var retVal = $q.defer();
                retVal.promise = new Reimbursement(r);
                promisesArray.push(retVal.promise);
            });
            var retVal = $q.defer();
            retVal.promise = $q.all(promisesArray).then(function(res) {
                retVal.resolve(res);
            }, function(err) {
                retVal.reject(err);
            });
            return retVal.promise;
        } else {
            return [];
        }
    }

    var obligationCheckReimbursement = function(r) {
        var that = this;
        var found = false;
        that.Reimbursements.forEach(function(Reimbursement, index) {
            if (Reimbursement == r.Id) {
                found = true;
            };
        })
        return !found;
    }

    var obligationFindReimbursements = function(searchText) {
        var that = this;
        var retVal = $q.defer();
        var purposeFilter = "?&$filter=substringof('" + searchText + "',Purpose)";
        var programFilter = "?&$filter=substringof('" + searchText + "',Program)";
        var agencyFilter = "?&$filter=substringof('" + searchText + "',Agency)";
        var purposeGet = UtilityService.getItems(purposeFilter, ConfigService.getTransactionListName());
        var programGet = UtilityService.getItems(programFilter, ConfigService.getTransactionListName());
        var agencyGet = UtilityService.getItems(agencyFilter, ConfigService.getTransactionListName());
        retVal.promise = $q.all([purposeGet, programGet, agencyGet]).then(function(res) {
            var out = [];
            var searchResults = res[0].data.concat(res[1].data)
            searchResults = searchResults.concat(res[2].data);
            searchResults.forEach(function(result,index){
                if (result.ItemType == 'Reimbursement') {
                    if (out.length > 0) {
                        var found = false;
                        var existing = false;
                        out.forEach(function(entry, i) {
                            if (entry.Id == result.Id) {
                                found = true;
                            }
                        })
                        that.Reimbursements.forEach(function(entry,i) {
                            if (entry == result.Id) {
                                existing = true;
                            }
                        })
                        if (!found && !existing) {
                            var r = new Reimbursement();
                            r.ParseResponse(result);
                            out.push(r);
                        }
                    } else {
                        var r = new Reimbursement();
                        r.ParseResponse(result);
                        out.push(r);
                    }
                }
            });
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
    }

    var obligationFindPayments = function(searchText) {
        var that = this;
        var retVal = $q.defer();
        var purposeFilter = "?&$filter=substringof('" + searchText + "',Purpose)";
        var programFilter = "?&$filter=substringof('" + searchText + "',Payee)";
        var agencyFilter = "?&$filter=substringof('" + searchText + "',OperatingAllowance)";
        var purposeGet = UtilityService.getItems(purposeFilter, ConfigService.getTransactionListName());
        var programGet = UtilityService.getItems(programFilter, ConfigService.getTransactionListName());
        var agencyGet = UtilityService.getItems(agencyFilter, ConfigService.getTransactionListName());
        retVal.promise = $q.all([purposeGet, programGet, agencyGet]).then(function(res) {
            var out = [];
            var searchResults = res[0].data.concat(res[1].data)
            searchResults = searchResults.concat(res[2].data);
            searchResults.forEach(function(result,index){
                if (result.ItemType == 'Payment') {
                    if (out.length > 0) {
                        var found = false;
                        var existing = false;
                        out.forEach(function(entry, i) {
                            if (entry.Id == result.Id) {
                                found = true;
                            }
                        })
                        if (!found && !existing) {
                            var p = new Payment()
                            p.ParseResponse(result);
                            out.push(p);
                        }
                    } else {
                        var p = new Payment()
                        p.ParseResponse(result);
                        out.push(p);
                    }
                }
            });
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
    }

    var obligationGetPayments = function() {
        var that = this;
        var retVal = $q.defer();
        var ObligationsCAMLFilter = "<View><Query><Where><And><Contains><FieldRef Name='Obligations' /><Value Type='Text'>" + that.Id + "</Value></Contains><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Payment</Value></Eq></And></Where></Query></View>";
        retVal.promise = UtilityService.getItemsCAML(ObligationsCAMLFilter, ConfigService.getTransactionListName()).then(function(res) {
            retVal.resolve(res);
        }, function(err) {
            retVal.reject(err);
        })
        return retVal.promise;
    }

    var paymentAddObligation = function(o) {
        var newObligation = {};
        newObligation.Id = o.Id;
        newObligation.ObligationNumber = o.ObligationNumber;
        newObligation.Purpose = o.Purpose;
        newObligation.Amount = o.Amount;
        this.Obligations.push(o);
    }

    var paymentRemoveObligation = function(index) {
        if (this.Obligations.length > index) {
            this.Obligations.splice(index,1);
        }
    }

    var paymentNewObligation = function() {
        return {
            Id: '',
            ObligationNumber: '',
            Purpose: '',
            Amount: 0
        };
    }
    
    var paymentFindObligations = function(searchText) {
        var that = this;
        var retVal = $q.defer();
        var purposeFilter = "?&$filter=substringof('" + searchText + "',Purpose)";
        var oaFilter = "?&$filter=substringof('" + that.OperatingAllowance + "',OperatingAllowance)";
        var onFilter = "?&$filter=substringof('" + searchText + "',ObligationNumber)";
        var purposeGet = UtilityService.getItems(purposeFilter, ConfigService.getTransactionListName());
        var oaGet = UtilityService.getItems(oaFilter, ConfigService.getTransactionListName());
        var onGet = UtilityService.getItems(onFilter, ConfigService.getTransactionListName());
        retVal.promise = $q.all([purposeGet, oaGet, onGet]).then(function(res) {
            var out = [];
            var searchResults = res[0].data.concat(res[1].data)
            searchResults = searchResults.concat(res[2].data);
            searchResults.forEach(function(result,index){
                if (result.ItemType == 'Obligation') {
                    if (out.length > 0) {
                        var found = false;
                        var existing = false;
                        out.forEach(function(entry, i) {
                            if (entry.Id == result.Id) {
                                found = true;
                            }
                        })
                        that.Obligations.forEach(function(entry,i) {
                            if (entry == result.Id) {
                                existing = true;
                            }
                        })
                        if (!found && !existing) {
                            var o = new Obligation()
                            o.ParseResponse(result);
                            out.push(o);
                        }
                    } else {
                        var o = new Obligation()
                        o.ParseResponse(result);
                        out.push(o);
                    }
                }
            });
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
    }

    var paymentGetObligations = function() {
        var that = this;
        if (that.Id && that.Id != "") {
            var promisesArray = [];
            that.Obligations.forEach(function(o,index) {
                var retVal = $q.defer();
                retVal.promise = new Obligation(o.Id);
                promisesArray.push(retVal.promise);
            });
            var allRet = $q.defer();
            allRet.promise = $q.all(promisesArray).then(function(res) {
                allRet.resolve(res);
            }, function(err) {
                allRet.reject(err);
            });
            return allRet.promise;
        } else {
            return [];
        }
    }

    var paymentGetReimbursements = function() {
        var that = this;
        if (that.Id && that.Id != "") {
            var promisesArray = [];
            that.Reimbursements.forEach(function(r,index) {
                var retVal = $q.defer();
                retVal.promise = new Reimbursement(r);
                promisesArray.push(retVal.promise);
            });
            var retVal = $q.defer();
            retVal.promise = $q.all(promisesArray).then(function(res) {
                retVal.resolve(res);
            }, function(err) {
                retVal.reject(err);
            });
            return retVal.promise;
        } else {
            return [];
        }
    }

    var paymentGetNextFundCiteNumber = function() {
        var that = this;
        var retVal = $q.defer(); 
        retVal.promise = LOVService.getBudgetObjectCodes().then(function(res) {
            var budgetObjectCode = res.find(function(val) { 
                return val.ValueOfItem == that.OperatingAllowance;
            });
            var ObligationNumber = (that.Obligations.length > 0)? (that.Obligations[0].ObligationNumber):("");
            //ObligationNumber = ObligationNumber.substring(ObligationNumber.length - 3, ObligationNumber.length);
            if (that.Allotment == '1007') {
                //var fundCite = "19___X" + that.Appropriation + "0002" + that.Allotment + UtilityService.getFiscalYear(that.Date) + ObligationNumber + budgetObjectCode.BudgetObjectCode;
                var fundCite = "19___X" + that.Appropriation + "0002-" + that.Allotment + "-" + ObligationNumber + "-" + that.OperatingAllowance + "-" + budgetObjectCode.BudgetObjectCode;
                that.FundCiteNumber = fundCite;
                retVal.resolve(fundCite);
            } else {
                //var fundCite = "19___X" + that.Appropriation + "0002" + that.Allotment + UtilityService.getFiscalYear(that.Date) + that.Obligations[0].ObligationNumber;
                var fundCite = "19___X" + that.Appropriation + "0002-" + that.Allotment + "-" + ObligationNumber + "-2152";
                that.FundCiteNumber = fundCite;
                retVal.resolve(fundCite);
            }
        });
        return retVal.promise;
    }

    var paymentGetReturns = function() {
        var that = this;
        var retVal = $q.defer();
        var camlFilter = "<View><Query><Where><And><Eq><FieldRef Name='ItemType' /><Value Type='Text'>PaymentReturn</Value></Eq><Contains><FieldRef Name='PaymentReturnSources' /><Value Type='Text'>" + this.Id + "</Value></Eq></And></Where></Query></View>";
        retVal.promise = UtilityService.getItemsCAML(camlFilter,ConfigService.getTransactionListName()).then(function(res) {
            //Check that the Id matches and is not a substring
            var out = [];
            res.forEach(function(pr,i) {
                JSON.parse(pr.PaymentReturnSources).forEach(function(val){
                    if (val == that.Id) {
                        var paymentReturn = new PaymentReturn;
                        paymentReturn.ParseResponse(pr);
                        out.push(paymentReturn);
                    }
                })
                // var IdFound = false;
                // if (pr.PaymentReturnSources.split(",").findIndex(function(id,idIndex) {
                //     return id == that.Id;
                // }) > -1) {
                //     var paymentReturn = new PaymentReturn();
                //     paymentReturn.ParseResponse(pr);
                //     out.push(paymentReturn);
                // };
            });
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
    }

    var rppGetRPPs = function(fy) {
        var retVal = $q.defer();
        var filter = "";
        if (fy) {
            var fiscalYear = UtilityService.getFiscalYear(fy);
             filter = "?$filter=ItemType eq 'RPP' and FiscalYear eq " + fiscalYear;
        } else {
             filter = "?$filter=ItemType eq 'RPP'";
        }        
        retVal.promise = UtilityService.getItems(filter, ConfigService.getTransactionListName()).then(function(res) {
            var out = [];
            res.data.forEach(function(item,index) {
                var rpp = new RPP();
                rpp.ParseResponse(item);
                out.push(rpp);
            })
            retVal.resolve(out);
        })
        return retVal.promise;
    }

    var rppGetByRPP = function(rpp) {
        var retVal = $q.defer();
        retVal.promise = UtilityService.getItems("?$filter=ItemType eq 'RPP' and RPP eq '" + rpp + "'", ConfigService.getTransactionListName()).then(function(res) {
            if (res.data.length > 0) {
                var rpp = new RPP();
                rpp.ParseResponse(res.data[0]);
                retVal.resolve(rpp);
            } else {
                retVal.resolve("");
            }
        }, function(err) {
            retVal.reject(err);
        })
        return retVal.promise;
    }

    var rppGetPayments = function() {
        var that = this;
        var retVal = $q.defer();
        var camlFilter = "<View><Query><Where><And><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Payment</Value></Eq><Contains><FieldRef Name='RPPs' /><Value Type='Text'>" + this.RPP + "</Value></Eq></And></Where></Query></View>";
        retVal.promise = UtilityService.getItemsCAML(camlFilter, ConfigService.getTransactionListName()).then(function(res) {
            var out = [];
            res.forEach(function(payment,index) {
                var p = new Payment();
                p.ParseResponse(payment);
                out.push(p);
            })
            retVal.resolve(out);
        }, function(err) {
            retVal.reject(err);
        })
        return retVal.promise;
    }

    var evacuationBuildRequest = function() {
        var out = {};
        if (this.Id) {
            out.Id = this.Id;
        }
        out.Status = this.Status;
        out.__metadata = {};
        out.ItemType = "Evacuation";
        out.Reason = this.Reason;
        out.Bureau = this.Bureau;
        out.Posts = JSON.stringify(this.Posts);
        out.Countries = this.Countries;
        out.Notes = this.Notes;
        //out.EvacuationTypes = JSON.stringify(this.EvacuationTypes);
        this.EvacuationTypes = _(this.Extensions).chain().pluck('EvacuationType').uniq().flatten().filter(function(item) { return !IsNullOrUndefined(item); }).value();
        this.EvacuationTypes = (IsNullOrUndefined(this.EvacuationTypes))?([]):(this.EvacuationTypes);
        out.EvacuationTypes = { __metadata: { type: 'Collection(Edm.String)' }, results: this.EvacuationTypes };
        if (this.Extensions.length > 0) {
            var sd = this.Extensions[this.Extensions.length - 1].StartDate;
            if (!IsNullOrUndefined(sd) && !!sd) {
                out.StartDate = new Date(sd).toISOString();
            }
            out.EndDate = new Date(this.Extensions[this.Extensions.length - 1].EndDate).toISOString();
        } else {
            out.StartDate = this.StartDate.toISOString();
            out.EndDate = this.EndDate.toISOString();
        }
        out.Cables = JSON.stringify(this.Cables);
        out.Extensions = JSON.stringify(this.Extensions);
        out.FiscalYear = UtilityService.getTwoDigitFiscalYear(this.StartDate)
        out.Safehaven = this.Safehaven
        out.OperatingStatus = this.OperatingStatus
        return out;
    }

    var evacuationParseResponse = function(res) {
        this.Id = res.Id;
        this.Status = res.Status;
        this.ItemType = 'Evacuation';
        this.Reason = res.Reason;
        this.Bureau = res.Bureau;
        this.Posts = JSON.parse(res.Posts);
        this.Countries = res.Countries;
        //this.EvacuationTypes = JSON.parse(res.EvacuationTypes);
        this.EvacuationTypes = (!!res.EvacuationTypes)?(res.EvacuationTypes.results):([]);
        this.StartDate = new Date(res.StartDate);
        this.EndDate = new Date(res.EndDate);
        this.Cables = JSON.parse(res.Cables);
        this.Extensions = JSON.parse(res.Extensions);
        this.FiscalYear = res.FiscalYear;
        this.Safehaven = res.Safehaven;
        this.OperatingStatus = res.OperatingStatus;
        this.Notes = res.Notes;
    }

    var gfmsBuildRequest = function() {
        var out = {};
        if (this.Id) {
            out.Id = this.Id;
        }
        out.__metadata = {};
        out.ItemType = "GFMS";
        out.Allotment = this.Allotment;
        out.Appropriation = this.Appropriation;
        out.AdjustmentType = this.AdjustmentType;
        out.Date = this.Date.toISOString();
        out.FiscalYear = UtilityService.getTwoDigitFiscalYear(this.Date)
        out.Amount = (!IsNullOrUndefined(this.Amount))?(parseFloat(this.Amount)):(parseFloat(0));

        return out;
    }

    var gfmsParseResponse = function(res) {
        this.Id = res.Id;
        this.ItemType = "GFMS";
        this.Allotment = res.Allotment;
        this.Date = new Date(res.Date);
        this.FiscalYear = res.FiscalYear;
        this.Amount = res.Amount;
        this.AdjustmentType = res.AdjustmentType;
        this.Appropriation = res.Appropriation;
    }

    var alertBuildRequest = function() {
        var out = {};
        if (this.Id) {
            out.Id = this.Id;
        }
        out.__metadata = {};
        out.ItemType = "Alert";
        out.AlertStatus = this.AlertStatus;
        out.Purpose = this.Purpose;
        out.Notes = this.Notes;
        return out;
    }

    var alertParseResponse = function(res) {
        this.Id = res.Id;
        this.ItemType = "Alert";
        this.AlertStatus = res.AlertStatus;
        this.Notes = res.Notes;
        this.Purpose = res.Purpose;
        this.Date = res.Date;
    }

    var rppBuildRequest = function() {
        var out = {};
        if (this.Id) {
            out.Id = this.Id
        }
        out.__metadata = {};
        out.ItemType = "RPP";
        out.Date = this.Date.toISOString();
        out.RewardsProgram = this.RewardsProgram;
        out.RPP = this.RPP;
        out.FiscalYear = UtilityService.getTwoDigitFiscalYear(this.Date)
        return out;
    }

    var rppParseResponse = function(res) {
        this.Id = res.Id;
        this.Date = new Date(res.Date);
        this.ItemType = "RPP";
        this.RewardsProgram = res.RewardsProgram;
        this.RPP = res.RPP;
		this.FiscalYear = res.FiscalYear
    }

    var adjustmentBuildRequest = function() {
        var out = {};
        if (this.Id) {
            out.Id = this.Id;
        }
        out.__metadata = {};
        out.ItemType = "Adjustment";
        out.Date = this.Date.toISOString();
        out.Allotment = this.Allotment;
        out.Appropriation = this.Appropriation;
        out.Purpose = this.Purpose;
        out.Desc = this.Description;
        out.OperatingAllowance = this.OperatingAllowance;
        out.RewardsProgram = this.RewardsProgram;
        out.RewardsPublicity = this.RewardsPublicity;
        out.FiscalYear = UtilityService.getTwoDigitFiscalYear(this.Date);
        out.Amount = (!IsNullOrUndefined(this.Amount))?(parseFloat(this.Amount)):(parseFloat(0));
        out.RestrictedFunds = (!IsNullOrUndefined(this.RestrictedFunds))?(parseFloat(this.RestrictedFunds)):(parseFloat(0));
        return out;
    }

    var adjustmentParseResponse = function(res) {
        this.Id = res.Id;
        this.ItemType = "Adjustment";
        this.Date = new Date(res.Date);
        this.Amount = (!IsNullOrUndefined(res.Amount))?(parseFloat(res.Amount)):(parseFloat(0));
        this.Allotment = (!IsNullOrUndefined(res.Allotment))?(res.Allotment):('');
        this.Appropriation = (!IsNullOrUndefined(res.Appropriation))?(res.Appropriation):('');
        this.OperatingAllowance = (!IsNullOrUndefined(res.OperatingAllowance))?(res.OperatingAllowance):('');
        this.Purpose = (!IsNullOrUndefined(res.Purpose))?(res.Purpose):('');
        this.Description = (!IsNullOrUndefined(res.Desc))?(res.Desc):('');
        this.RewardsProgram = (!IsNullOrUndefined(res.RewardsProgram))?(res.RewardsProgram):('');
        this.RewardsPublicity = res.RewardsPublicity;
        this.FiscalYear = (!IsNullOrUndefined(res.FiscalYear))?(res.FiscalYear):('');
        this.RestrictedFunds = (!IsNullOrUndefined(res.RestrictedFunds))?(parseFloat(res.RestrictedFunds)):(parseFloat(0));
    }

    var accountAdjustmentBuildRequest = function() {
        var out = {};
        if (this.Id) {
            out.Id = this.Id;
        }
        out.__metadata = {};
        out.ItemType = "AccountAdjustment";
        out.Date = this.Date.toISOString();
        out.Amount = parseFloat(this.Amount);
        out.AdjustmentType = this.AdjustmentType;
        out.Notes = this.Notes;
        out.OperatingAllowance = this.OperatingAllowance;
        out.GiftFundsAmount = parseFloat(this.GiftFundsAmount);
        out.GiftFundsUsed = this.GiftFundsUsed;
        out.FiscalYear = UtilityService.getTwoDigitFiscalYear(this.Date)
        return out;
    }

    var accountAdjustmentParseResponse = function(res) {
        this.Id = res.Id;
        this.ItemType = "AccountAdjustment";
        this.Date = new Date(res.Date);
        this.Amount = res.Amount;
        this.AdjustmentType = res.AdjustmentType;
        this.Notes = res.Notes;
        this.OperatingAllowance = res.OperatingAllowance;
        this.GiftFundsAmount = parseFloat(res.GiftFundsAmount);
        this.GiftFundsUsed = res.GiftFundsUsed;
        this.FiscalYear = res.FiscalYear
    }

    var accountBalanceBuildRequest = function() {
        var out = {};
        if (this.Id) {
            out.Id = this.Id;
        }
        out.__metadata = {};
        out.ItemType = "AccountBalance";
        out.Date = this.Date.toISOString();
        out.Amount = parseFloat(this.Amount);
        out.GiftFundsAvailableByOperatingAll = JSON.stringify(this.GiftFundsAvailableByOperatingAllowance);
        return out;
    }

    var accountBalanceParseResponse = function(res) {
        this.Id = res.Id;
        this.ItemType = "AccountBalance";
        this.Date = new Date(res.Date);
        this.Amount = res.Amount;
        this.GiftFundsAvailableByOperatingAllowance = JSON.parse(res.GiftFundsAvailableByOperatingAll);
    }

    var depositBuildRequest = function() {
        var out = {};
        out.__metadata = {};
        out.ItemType = "Deposit";
        if (this.Id) {
            out.Id = this.Id;
        }
        out.Amount = parseFloat(this.Amount);
        out.CheckNumber = this.CheckNumber;
        out.Date = this.Date.toISOString();
        out.Desc = this.Memo;
        out.Purpose = this.Purpose;
        out.Payee = this.Payee;
        out.GiftFundsUsed = this.GiftFundsUsed;
        out.GiftFundsAmount = parseFloat(this.GiftFundsAmount);
        out.OperatingAllowance = this.OperatingAllowance;
        out.Allotment = this.Allotment;
        out.Appropriation = this.Appropriation;
        out.ClearedStatus = this.ClearedStatus;
        out.FiscalYear = UtilityService.getTwoDigitFiscalYear(this.Date)
        return out;
    }

    var depositParseResponse = function(res) {
        this.Id = res.Id;
        this.Amount = parseFloat(res.Amount);
        this.ItemType = "Deposit";
        this.CheckNumber = res.CheckNumber;
        this.Date = new Date(res.Date);
        this.Memo = res.Desc;
        this.Purpose = res.Purpose;
        this.Payee = res.Payee;
        this.GiftFundsUsed = res.GiftFundsUsed;
        this.GiftFundsAmount = parseFloat(res.GiftFundsAmount);
        this.OperatingAllowance = res.OperatingAllowance;
        this.ClearedStatus = res.ClearedStatus;
        this.Appropriation = res.Appropriation;
        this.Allotment = res.Allotment;
        this.FiscalYear = res.FiscalYear
    }

    var paymentReturnBuildRequest = function() {
        var out = {};
        out.__metadata = {};
        if (this.Id) {
            out.Id = this.Id;
        }
        out.Purpose = this.Purpose;
        out.GiftFundsUsed = this.GiftFundsUsed;
        out.GiftFundsAmount = this.GiftFundsAmount;
        out.ItemType = "PaymentReturn";
        out.PaymentReturnType = this.PaymentReturnType;
        out.Amount = this.Amount;
        out.Date = this.Date.toISOString();
        out.Appropriation = this.Appropriation;
        out.Allotment = this.Allotment;
        out.OperatingAllowance = this.OperatingAllowance;
        out.PostCode = this.PostCode;
        out.Bureau = this.Bureau;
        out.PaymentReturnReason = this.PaymentReturnReason;
        out.PaymentReturnSources = JSON.stringify(this.PaymentReturnSources);
        out.FiscalYear = UtilityService.getTwoDigitFiscalYear(this.Date)
        out.RepresentationType = this.RepresentationType;

        return out;
    }

    var paymentReturnParseResponse = function(res) {
        this.Id = res.Id
        this.GiftFundsUsed = res.GiftFundsUsed;
        this.GiftFundsAmount = (isNaN(parseFloat(res.GiftFundsAmount)))?(0):(parseFloat(res.GiftFundsAmount));
        this.ItemType = "PaymentReturn";
        this.Amount = parseFloat(res.Amount);
        this.Date = new Date(res.Date);
        this.Purpose = res.Purpose;
        this.Appropriation = res.Appropriation;
        this.Allotment = res.Allotment;
        this.OperatingAllowance = res.OperatingAllowance;
        this.PostCode = res.PostCode;
        this.Bureau = res.Bureau;
        this.PaymentReturnType = res.PaymentReturnType;
        this.PaymentReturnReason = res.PaymentReturnReason;
        this.PaymentReturnSources = JSON.parse(res.PaymentReturnSources);
        this.FiscalYear = res.FiscalYear
        this.RepresentationType = res.RepresentationType
    }

    var paymentParseResponse = function(res) {
        this.Id = res.Id;
        this.PaymentType = res.PaymentType;
        this.Date = new Date(res.Date);
        this.Amount = parseFloat(res.Amount);
        this.Payee = res.Payee;
        this.Purpose = res.Purpose;
        this.Notes = res.Desc;
        this.CheckNumber = res.CheckNumber;
        this.Appropriation = res.Appropriation;
        this.Allotment = res.Allotment;
        this.OperatingAllowance = res.OperatingAllowance;
        this.BureauAllotment = res.BureauAllotment;
        this.Bureau = res.Bureau;
        this.AllotmentType = res.AllotmentType;
        this.GiftFundsUsed = res.GiftFundsUsed;
        this.GiftFundAmount = res.GiftFundsAmount;
        this.FundCiteNumber = res.FundCiteNumber;
        this.RequestNumber = res.RequestNumber;
        this.Account = res.Account;
        this.RewardsProgram = res.RewardsProgram;
        this.RPPs = JSON.parse(res.RPPs);
        this.Attachments = [];
        this.Reimbursements = (!res.Reimbursements)?([]):(res.Reimbursements.split(","));
        this.Obligations = JSON.parse(res.Obligations);
        this.FiscalYear = res.FiscalYear
        this.RepresentationType = res.RepresentationType
    }

    var paymentBuildRequest = function() {
        var out = {};
        out.__metadata = {};
        if (this.Id) {
            out.Id = this.Id;
        }
        out.ItemType = "Payment";
        out.PaymentType = this.PaymentType;
        out.Date = this.Date.toISOString();
        out.Amount = parseFloat(this.Amount);
        out.Payee = this.Payee;
        out.Purpose = this.Purpose;
        out.Desc = this.Notes;
        out.CheckNumber = this.CheckNumber;
        out.Appropriation = this.Appropriation;
        out.Allotment = this.Allotment;
        out.OperatingAllowance = this.OperatingAllowance;
        out.BureauAllotment = this.BureauAllotment;
        out.Bureau = this.Bureau;
        out.AllotmentType = this.AllotmentType;
        out.GiftFundsUsed = this.GiftFundsUsed;
        out.GiftFundsAmount = this.GiftFundAmount;
        out.FundCiteNumber = this.FundCiteNumber;
        out.RequestNumber = this.RequestNumber;
        out.Account = this.Account;
        out.RewardsProgram = this.RewardsProgram;
        out.RPPs = JSON.stringify(this.RPPs);
        out.Reimbursements = this.Reimbursements.toString();
        out.Obligations = JSON.stringify(this.Obligations);
        out.FiscalYear = UtilityService.getTwoDigitFiscalYear(this.Date)
        out.RepresentationType = this.RepresentationType

        return out;
    }

    var allotmentBuildRequest = function() {
        var out = {};
        if (this.Id) {
            out.Id = this.Id;
        }
        out.__metadata = {};
        out.ItemType = this.ItemType;
        out.AllotmentAuthority = this.Authority;
        out.Appropriation = this.Appr;
        out.NY = this.NY;
        out.Agency = this.Agency;
        out.Notes = this.Notes;
        
        var changeNumbers = _(this.Auths).pluck("Change");
        out.Change = Math.max.apply(null, changeNumbers);
        out.Authorizations = [];
        out.Title = this.Title;
        for (i = 0; i < this.Auths.length; i++) {
            var a = {};
            var auth = this.Auths[i];
            a.Change = auth.Change;
            a.Date = auth.Date.toISOString()
            out.FiscalYear = UtilityService.getTwoDigitFiscalYear(auth.Date)
            a.Programs = [];
            for (ind = 0; ind < auth.Programs.length; ind++) {
                var p = {};
                var prog = auth.Programs[ind];
                p.Program = prog.Program;
                p.Direct = prog.Direct.Mod;
                p.Reimbursable = prog.Reimbursable.Mod;
                a.Programs.push(p)
            }
            out.Authorizations.push(a);
        }
        out.Authorizations = JSON.stringify(out.Authorizations);
        
        return out;
    }

    var allotmentParseResponse = function(res) {
        this.Id = res.Id;
        this.Authority = res.AllotmentAuthority;
        this.Appr = res.Appropriation;
        this.NY = res.NY;
        this.Agency = res.Agency;
        this.Title = res.Title;
        this.Notes = res.Notes;
        this.FiscalYear = res.FiscalYear;
		var that = this;
        var ParsedAuths = that.Auths;
        var Auths = JSON.parse(res.Authorizations);
        for (i = 0; i < Auths.length; i++) {
            var a = Auths[i];       
            var OutAuth = new Auth();
            OutAuth.Change = a.Change;
            OutAuth.Date = new Date(a.Date);
            var Progs = a.Programs;
            var DirectTotal = { PreviousTotal: 0, ModTotal: 0, AuthTotal: 0 };
            var ReimbursableTotal = { PreviousTotal: 0, ModTotal: 0, AuthTotal: 0 };
            for (var index = 0; index < Progs.length; index++) {
                var outProg = new Program();
                outProg.Program = Progs[index].Program;

                //Look for program name in previous auths
                _(ParsedAuths).chain().pluck('Programs').flatten().each(function(program) { 
                if (program.Program == outProg.Program) {
                    outProg.Direct.Previous += parseFloat(program.Direct.Mod);
                    outProg.Reimbursable.Previous += parseFloat(program.Reimbursable.Mod);
                }
                }).value()

                outProg.Direct.Mod = Progs[index].Direct;
                outProg.Direct.Auth = parseFloat(outProg.Direct.Previous) + parseFloat(outProg.Direct.Mod);
                
                DirectTotal.PreviousTotal += parseFloat(outProg.Direct.Previous);
                DirectTotal.ModTotal += parseFloat(outProg.Direct.Mod);
                DirectTotal.AuthTotal += parseFloat(outProg.Direct.Auth);

                outProg.Reimbursable.Mod = Progs[index].Reimbursable;
                outProg.Reimbursable.Auth = parseFloat(outProg.Reimbursable.Previous) + parseFloat(outProg.Reimbursable.Mod);
                
                ReimbursableTotal.PreviousTotal += parseFloat(outProg.Reimbursable.Previous);
                ReimbursableTotal.ModTotal += parseFloat(outProg.Reimbursable.Mod);
                ReimbursableTotal.AuthTotal += parseFloat(outProg.Reimbursable.Auth);
                
                OutAuth.Programs.push(outProg);
            }
            OutAuth.Direct = DirectTotal;
            OutAuth.Reimbursable = ReimbursableTotal;

            this.Auths.push(OutAuth);
        }
        return true;
    }

    var obligationParseResponse = function(res) {
        this.Id = res.Id;
        this.Purpose = res.Purpose;
        this.Appropriation = res.Appropriation;
        this.Allotment = res.Allotment;
        this.OperatingAllowance = res.OperatingAllowance;
        this.PostCode = res.PostCode;
        this.ObligationNumber = res.ObligationNumber;
        this.Date = new Date(res.Date);
        this.Amount = res.Amount;
        this.RestrictedFunds = res.RestrictedFunds;
        this.Description = res.Desc;
        this.RewardsPublicity = res.RewardsPublicity;
        this.RewardsProgram = res.RewardsProgram;
        this.RPPs = (!res.RPPs)?([]):(res.RPPs.split(","));
        this.Reimbursements = (!res.Reimbursements)?([]):(res.Reimbursements.split(","));
        this.FiscalYear = res.FiscalYear
    }
    
    var deleteObligation = function(){
    
    }

    var obligationBuildRequest = function() {
        var out = {};
        out.__metadata = {};
        out.ItemType = this.ItemType;
        if (this.Id) {
            out.Id = this.Id;
        }
        out.Purpose = this.Purpose;
        out.Appropriation = this.Appropriation;
        out.Allotment = this.Allotment;        
        out.OperatingAllowance = this.OperatingAllowance;
        out.PostCode = this.PostCode;
        
        if(this.Allotment == "2003")
        {
        	out.OperatingAllowance = "2003";
        } else {
            out.PostCode = "";
        }
        
        out.ObligationNumber = this.ObligationNumber;
        out.Date = this.Date.toISOString();
        out.Amount = parseFloat(this.Amount);
        out.RestrictedFunds = parseFloat(this.RestrictedFunds);
        out.Desc = this.Description;
        out.RPPs = this.RPPs.toString();
        out.Reimbursements = this.Reimbursements.toString();
        out.RewardsProgram = this.RewardsProgram;
        out.RewardsPublicity = this.RewardsPublicity;
        out.FiscalYear = UtilityService.getTwoDigitFiscalYear(this.Date)

        return out;
    }

    var sofBuildRequest = function() {
        var out = {};
        if (this.Id) {
            out.Id = this.Id;
        }
        out.__metadata = {};
        out.ItemType = this.ItemType;
        out.Desc = this.Description;
        out.Programs = JSON.stringify(this.Programs);
        out.SOFType = this.SOFType;
        out.AllotmentId = this.AllotmentId;
        out.FiscalYear = this.FiscalYear;

        return out;
    }

    var sofParseResponse = function(res) {
        this.Id = res.Id;
        this.AllotmentId = res.AllotmentId;
        this.Description = res.Desc;
        this.SOFType = res.SOFType;
        this.Programs = JSON.parse(res.Programs);
        this.FiscalYear = res.FiscalYear 
    }

    var reimbursementBuildRequest = function() {
        var out = {};
        out.__metadata = {};
        out.ItemType = this.ItemType;
        if (this.Id) {
            out.Id = this.Id;
        }
        out.AllotmentId = this.AllotmentId;
        out.Agreement = this.Agreement;
        out.Status = this.Status;
        out.Program = this.Program;
        out.Agency = this.Agency;
        out.Purpose = this.Purpose;
        out.Amount = this.Amount;
        out.CollectedAmount = this.CollectedAmount;
        out.Date = this.Date.toISOString();
        out.FiscalYear = UtilityService.getTwoDigitFiscalYear(this.Date)
        return out;
    }

    var reimbursementParseResponse = function(res) {
        this.Id = res.Id;
        this.AllotmentId = res.AllotmentId;
        this.Agreement = res.Agreement;
        this.Status = res.Status;
        this.Program = res.Program;
        this.Agency = res.Agency;
        this.Purpose = res.Purpose;
        this.Amount = parseFloat(res.Amount);
        this.CollectedAmount = parseFloat(res.CollectedAmount);
        this.Date = new Date(res.Date);
        this.FiscalYear = res.FiscalYear
    }

    var get = function(id) {
		var that = this;
		var retVal = $q.defer();
		retVal.promise = UtilityService.getItem(id, "", ConfigService.getTransactionListName()).then(function(response) {
			that.ParseResponse(response.data);
			retVal.resolve(that);
		}, function(error) {
			retVal.reject(error);
		})
		return retVal.promise;
	}

	var save = function() {
        var that = this;
		var retVal = $q.defer();
		if (this.Id) {
			//Update existing
			retVal.promise = UtilityService.updateItem(this.BuildRequest(), ConfigService.getTransactionListName()).then(function(response) {
                if (response.d) {
                    that.ParseResponse(response.d);
                    retVal.resolve(that);
                } else {
                    retVal.resolve(that);
                }
			}, function(error) {
				retVal.reject(error);
			})
		} else {
			//Create new
			retVal.promise = UtilityService.createItem(this.BuildRequest(), ConfigService.getTransactionListName()).then(function(response) {
                if (response.d) {
                    that.ParseResponse(response.d);
                    retVal.resolve(that);
                } else {
                    retVal.resolve(that);
                }
			}, function(error) {
				retVal.reject(error);
			})
		}
		return retVal.promise;
	}

    var addAttachment = function(fileData,fileName) {
        var that = this;
        var retVal = $q.defer();
        retVal.promise = UtilityService.addAttachment(fileData,that.Id,fileName,ConfigService.getTransactionListName()).then(function(res) {
            retVal.resolve(res);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
	}

    var removeAttachment = function(fileName) {
        var that = this;
        var retVal = $q.defer()
        retVal.promise = UtilityService.deleteAttachment(that.Id,fileName,ConfigService.getTransactionListName()).then(function(res) {
            retVal.resolve(res);
        }, function(err) {
            retVal.reject(err);
        });
        return retVal.promise;
    }

    var getAttachments = function() {
        var that = this;
        var retVal = $q.defer();
        if (that.Id && that.Id != "") {
            retVal.promise = UtilityService.getAttachments(that.Id,ConfigService.getTransactionListName()).then(function(res) {
                retVal.resolve(res);
            }, function(err) {
                retVal.reject(err);
            })
        } else {
            retVal.resolve([]);
        }
        return retVal.promise;
    }

    out.Adjustment = Adjustment;
    out.RPP = RPP;
    out.Evacuation = Evacuation;
    out.Alert = Alert;
    out.AccountAdjustment = AccountAdjustment;
    out.AccountBalance = AccountBalance;
    out.PaymentReturn = PaymentReturn;
    out.Payment = Payment;
    out.Deposit = Deposit;
    out.Obligation = Obligation;
    out.SourceOfFunds = SourceOfFunds;
    out.Program = Program;
    out.Auth = Auth;
    out.Allotment = Allotment;
    out.Reimbursement = Reimbursement;
    out.GFMS = GFMS;

    return out;
}])