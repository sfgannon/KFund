angular.module('SummaryFinPlanService', ['LocalStorageModule','UtilityModule','BusinessObjectsModule'])
.service('SummaryFinPlanService', ['localStorageService','$window','$q','$http','ConfigService','UtilityService','BusinessObjectsFactory',function(localStorageService,$window,$q,$http,ConfigService,UtilityService,BusinessObjectsFactory) {

/*
Changes to be made to Summary FinPlan
1. Grouping obligations by Purpose is correct

2. Calculating the liquidated balance should be done by finding all payments linked to the obligation
via the "Obligations" column rather than relying on the payments to have the same purpose.

3. Remove Payments and Fund Cites from the 2003 Breakout tab
*/







	return {	
		CalculateSofObjects: function(ArrayOfSOFs,FiscalYear){
			var FinalObject ={}

			var Row = function() {
				var row = {};
				row.Total = 0.00;
				row.Title = "";
				row.Other = 0.00;
				row.UnrestrictedFunds = 0.00;
				row.RestrictedFunds = 0.00;
				row.Evacuations = 0.00;
				return row;
			}

			var testArray = angular.copy(ArrayOfSOFs);
			var allRows = [];
			var carryForward = false;
			var appropriation = false;
			var reimbursement = false;
			testArray = _(testArray).chain().groupBy("SOFType").value();
			_.each(testArray, function(item) {
				var newRow = new Row();
				newRow.Title = item[0].SOFType;
				switch(newRow.Title)
				{
					case "Carryforward":
						carryForward = true;
						break;
					case "Appropriation":
						appropriation = true;
						break;
					case "Reimbursement":
						reimbursement = true;
						break;
					case "Carryover":
						carryForward = true;
						break;
					default:
						break;
				}
				_.each(item, function(i) {
					var sof = new BusinessObjectsFactory.SourceOfFunds();
					sof.ParseResponse(i);
					sof.Programs.forEach(function(p) {
						if (p.Program.toUpperCase().indexOf('UNFORESEEN EMERGENCIES') > -1) {
							if (!IsNullOrUndefined(p.Evacuations)) {
								newRow.Evacuations = newRow.Evacuations + parseFloat(p.Evacuations);
							}
							if (!IsNullOrUndefined(p.Other)) {
								newRow.Other = newRow.Other + parseFloat(p.Other);
							}
							
						} else {
							if (p.Program.toUpperCase().indexOf('REWARDS') > -1) {
								if (!IsNullOrUndefined(p.UnrestrictedFunds)) {
									newRow.UnrestrictedFunds = newRow.UnrestrictedFunds + parseFloat(p.UnrestrictedFunds);
								}
								if (!IsNullOrUndefined(p.RestrictedFunds)) {
									newRow.RestrictedFunds = newRow.RestrictedFunds + parseFloat(p.RestrictedFunds);
								}
							}
						}							
					});
					newRow.Total = newRow.Evacuations + newRow.Other + newRow.UnrestrictedFunds + newRow.RestrictedFunds;
				}, newRow);
				allRows.push(newRow);
			}, allRows)
			if (!carryForward) {
				var cf = new Row();
				cf.Title = "Carryforward";
				allRows.push(cf);
			}
			if (!appropriation) {
				var cf = new Row();
				cf.Title = "Appropriation";
				allRows.push(cf);
			}
			if (!reimbursement) {
				var cf = new Row();
				cf.Title = "Reimbursement";
				allRows.push(cf);
			}
				
			var totalRow = new Row();
			totalRow.Title = "FY 20"+ FiscalYear +" Net Availability";
			totalRow.Total = _(allRows).chain().pluck("Total").reduce(function(item,out) {
				return out += parseFloat(item);
			}).value()
			totalRow.Evacuations = _(allRows).chain().pluck("Evacuations").reduce(function(item,out) {
				return out += parseFloat(item);
			}).value()
			
			totalRow.Other = _(allRows).chain().pluck("Other").reduce(function(item,out) {
				return out += parseFloat(item);
			}).value()
			
			totalRow.RestrictedFunds = _(allRows).chain().pluck("RestrictedFunds").reduce(function(item,out) {
				return out += parseFloat(item);
			}).value()
			
			totalRow.UnrestrictedFunds = _(allRows).chain().pluck("UnrestrictedFunds").reduce(function(item,out) {
				return out += parseFloat(item);
			}).value()

			// KFUN-513 - Back to QA
		     for (var i=0; i < allRows.length; i++) {
		         if (allRows[i].Title === "Appropriation") {
		             var a = allRows.splice(i,1);   // removes the item
		             allRows.unshift(a[0]);         // adds it back to the beginning
		             break;
		         }
		     }
		     for (var i=0; i < allRows.length; i++) {
		         if (allRows[i].Title === "Carryover") {
		             var a = allRows.splice(i,1);   // removes the item
		             allRows.unshift(a[0]);         // adds it back to the beginning
		             break;
		         }
		     }
		     for (var i=0; i < allRows.length; i++) {
		         if (allRows[i].Title === "Carryforward") {
		             var a = allRows.splice(i,1);   // removes the item
		             allRows.unshift(a[0]);         // adds it back to the beginning
		             break;
		         }
		     }
		     

			FinalObject ={ SOFs: allRows, Total: totalRow }	

			return FinalObject 
		},
		CalculateObligationObjects: function(ArrayOfObligations,FiscalYear){
		
			var rows = []
			var EvacRows = []
			
			var EvacuationTotalRow = {}
			EvacuationTotalRow.Title = "Evacuation Total";
			EvacuationTotalRow.Total = 0;
			EvacuationTotalRow.Evacuations = "-";
			EvacuationTotalRow.Other = "-";
			EvacuationTotalRow.RestrictedFunds = "-";
			EvacuationTotalRow.UnrestrictedFunds = "-";

			
			//Rewards Payments Objects
			var payTerrorism = {};
			var payNarcotics = {};
			var payWarCrimes = {};
			var payTNOC = {};
			
			//Rewards Publicty Objects
			var pubTerrorism = {};
			var pubNarcotics = {};
			var pubWarCrimes = {};
			var pubTNOC = {};
			
			//row for other
			otherRow = {}
			
			//Obligation Total row
			totalRow = {}
			
			payTerrorism.Title = "Terrorism";
			payTerrorism.Total = 0;
			payTerrorism.Evacuations = "-";
			payTerrorism.Other = "-";
			payTerrorism.RestrictedFunds = 0;
			payTerrorism.UnrestrictedFunds = 0;

			payNarcotics.Title = "Narcotics";
			payNarcotics.Total = 0;
			payNarcotics.Evacuations = "-";
			payNarcotics.Other = "-";
			payNarcotics.RestrictedFunds = 0;
			payNarcotics.UnrestrictedFunds = 0;
			
			payWarCrimes.Title = "War Crimes";
			payWarCrimes.Total = 0;
			payWarCrimes.Evacuations = "-";
			payWarCrimes.Other = "-";
			payWarCrimes.RestrictedFunds = 0;
			payWarCrimes.UnrestrictedFunds = 0;
			
			payTNOC.Title = "Trans National Organized Crime";
			payTNOC.Total = 0;
			payTNOC.Evacuations = "-";
			payTNOC.Other = "-";
			payTNOC.RestrictedFunds = 0;
			payTNOC.UnrestrictedFunds = 0;

			pubTerrorism.Title = "Terrorism";
			pubTerrorism.Total = 0;
			pubTerrorism.Evacuations = "-";
			pubTerrorism.Other = "-";
			pubTerrorism.RestrictedFunds = 0;
			pubTerrorism.UnrestrictedFunds = 0;

			pubNarcotics.Title = "Narcotics";
			pubNarcotics.Total = 0;
			pubNarcotics.Evacuations = "-";
			pubNarcotics.Other = "-";
			pubNarcotics.RestrictedFunds = 0;
			pubNarcotics.UnrestrictedFunds = 0;
			
			pubWarCrimes.Title = "War Crimes";
			pubWarCrimes.Total = 0;
			pubWarCrimes.Evacuations = "-";
			pubWarCrimes.Other = "-";
			pubWarCrimes.RestrictedFunds = 0;
			pubWarCrimes.UnrestrictedFunds = 0;
			
			pubTNOC.Title = "Trans National Organized Crime"
			pubTNOC.Total = 0;
			pubTNOC.Evacuations = "-";
			pubTNOC.Other = "-";
			pubTNOC.RestrictedFunds = 0;
			pubTNOC.UnrestrictedFunds = 0;			
			
			otherRow.Title = "Other";
			otherRow.Total = 0;
			otherRow.Evacuations = "-";
			otherRow.UnrestrictedFunds = "-";
			otherRow.RestrictedFunds = "-";
			otherRow.Other = "-";


			totalRow.Title = "FY 20"+ FiscalYear +" Obligations to Date";
			totalRow.Total = 0;
			totalRow.Evacuations = 0;
			totalRow.Other = 0;
			totalRow.RestrictedFunds = 0;
			totalRow.UnrestrictedFunds = 0;

			
			
			
			ArrayOfObligations.forEach(function(unparsedObligation,index) {
				var newRow = {};
				var obligation = new BusinessObjectsFactory.Obligation();
				obligation.ParseResponse(unparsedObligation);
				if (IsNullOrUndefined(obligation.Amount)) {
					obligation.Amount = 0;
				}
				if (IsNullOrUndefined(obligation.RestrictedFunds)) {
					obligation.RestrictedFunds = 0;
				}
				if (IsNullOrUndefined(obligation.UnrestrictedFunds)) {
					obligation.UnrestrictedFunds = 0;
				}
				switch(obligation.Allotment) {
					case "2003":
							//this means its an evac
							if (!IsNullOrUndefined(obligation.Purpose)) {
								newRow.Title = obligation.Purpose;
							}
							newRow.Total = "-";
							newRow.Other = "-";
							newRow.RestrictedFunds = "-";
							newRow.UnrestrictedFunds = "-";
							if (!IsNullOrUndefined(obligation.Amount)) {
								newRow.EvacuationAmount = parseFloat(obligation.Amount) * -1;
								totalRow.Total = totalRow.Total + newRow.EvacuationAmount
								totalRow.Evacuations += (parseFloat(obligation.Amount)*-1);
								EvacuationTotalRow.Total = EvacuationTotalRow.Total + newRow.EvacuationAmount
							}
							if (!!newRow.Title && !!newRow.EvacuationAmount) {
								EvacRows.push(newRow)
							}						
						break;
					case "1007":
						//this means its a payment
						switch (obligation.OperatingAllowance) {
							case "100710":
								if (obligation.RewardsPublicity == true) {
									switch (obligation.RewardsProgram) {
										case "Terrorism":
											pubTerrorism.Total += parseFloat(obligation.Amount)*-1;
											pubTerrorism.RestrictedFunds += parseFloat(obligation.RestrictedFunds)*-1;
											pubTerrorism.UnrestrictedFunds += parseFloat(obligation.Amount)*-1 + parseFloat(obligation.RestrictedFunds);
											break;
										case "War Crimes":
											pubWarCrimes.Total += parseFloat(obligation.Amount)*-1;
											pubWarCrimes.RestrictedFunds += parseFloat(obligation.RestrictedFunds)*-1;
											pubWarCrimes.UnrestrictedFunds += parseFloat(obligation.Amount)*-1 + parseFloat(obligation.RestrictedFunds);
											break;
										case "Narcotics":
											pubNarcotics.Total += parseFloat(obligation.Amount)*-1;
											pubNarcotics.RestrictedFunds += parseFloat(obligation.RestrictedFunds)*-1;
											pubNarcotics.UnrestrictedFunds += parseFloat(obligation.Amount)*-1 + parseFloat(obligation.RestrictedFunds);
											break;
										case "Transnational Organized Crime":
											pubTNOC.Total += parseFloat(obligation.Amount)*-1;
											pubTNOC.RestrictedFunds += parseFloat(obligation.RestrictedFunds)*-1;
											pubTNOC.UnrestrictedFunds += parseFloat(obligation.Amount)*-1 + parseFloat(obligation.RestrictedFunds);
											break;
										default:
											break;
									}
								} else {
									switch (obligation.RewardsProgram) {
										case "Terrorism":
											payTerrorism.Total += parseFloat(obligation.Amount)*-1;
											payTerrorism.RestrictedFunds += parseFloat(obligation.RestrictedFunds)*-1;
											payTerrorism.UnrestrictedFunds += parseFloat(obligation.Amount)*-1 + parseFloat(obligation.RestrictedFunds);
											break;
										case "War Crimes":
											payWarCrimes.Total += parseFloat(obligation.Amount)*-1;
											payWarCrimes.RestrictedFunds += parseFloat(obligation.RestrictedFunds)*-1;
											payWarCrimes.UnrestrictedFunds += parseFloat(obligation.Amount)*-1 + parseFloat(obligation.RestrictedFunds);
											break;
										case "Narcotics":
											payNarcotics.Total += parseFloat(obligation.Amount)*-1;
											payNarcotics.RestrictedFunds += parseFloat(obligation.RestrictedFunds)*-1;
											payNarcotics.UnrestrictedFunds += parseFloat(obligation.Amount)*-1 + parseFloat(obligation.RestrictedFunds);
											break;
										case "Transnational Organized Crime":
											payTNOC.Total += parseFloat(obligation.Amount)*-1;
											payTNOC.RestrictedFunds += parseFloat(obligation.RestrictedFunds)*-1;
											payTNOC.UnrestrictedFunds += parseFloat(obligation.Amount)*-1 + parseFloat(obligation.RestrictedFunds);
											break;
										default:
											break;
									}
								}
								totalRow.Total += parseFloat(obligation.Amount)*-1
								totalRow.RestrictedFunds += parseFloat(obligation.RestrictedFunds)*-1;
								totalRow.UnrestrictedFunds += parseFloat(obligation.Amount)*-1 + parseFloat(obligation.RestrictedFunds);
								break;
							default:
								otherRow.Total += parseFloat(obligation.Amount)*-1;
								totalRow.Other += parseFloat(obligation.Amount)*-1;
								totalRow.Total += parseFloat(obligation.Amount)*-1;
								break;
					}
					break;					
				}			
			})
			var group = _.groupBy(EvacRows,function(item) {
				return item.Title;  
			})
			var out = [];
			_.each(group,function(item,index) {
				var newEvac = {};
				newEvac.EvacuationAmount = 0;
				newEvac.Title = item[0].Title;
				for (i=0;i<item.length;i++) {
					if (!isNaN(item[i].EvacuationAmount)){
						newEvac.EvacuationAmount += parseFloat(item[i].EvacuationAmount);
					}
				}
				out.push(newEvac);
			},out);
			
			var RewardPaymentRows = []
			var RewardPublicityRows = []
			
			RewardPaymentRows.push(payTerrorism);
			RewardPaymentRows.push(payNarcotics);
			RewardPaymentRows.push(payWarCrimes);
			RewardPaymentRows.push(payTNOC);
			
			
			RewardPublicityRows.push(pubTerrorism);
			RewardPublicityRows.push(pubNarcotics);
			RewardPublicityRows.push(pubWarCrimes);
			RewardPublicityRows.push(pubTNOC);
	
			
			//FinalObject ={EvacRows: EvacRows, EvacuationTotalRow: EvacuationTotalRow, RewardPaymentRows: RewardPaymentRows, RewardPublicityRows: RewardPublicityRows, OtherRow: otherRow, ObligationTotalRow: totalRow }
			FinalObject ={EvacRows: out, EvacuationTotalRow: EvacuationTotalRow, RewardPaymentRows: RewardPaymentRows, RewardPublicityRows: RewardPublicityRows, OtherRow: otherRow, ObligationTotalRow: totalRow }
			return FinalObject 
		},
		CalculateRecoveries: function(ArrayOfORecoveries,FiscalYear){
			
			var rows = [];
			var totalRow = {};
			totalRow.Total = 0;
			totalRow.Evacuations = 0;
			totalRow.Other = 0;
			totalRow.RestrictedFunds = 0;
			totalRow.UnrestrictedFunds = 0;
			totalRow.Title = "Total Prior Year Recoveries/Transfers";				
				
			var FinalObject ={}
			

			var UERow = {};
			UERow.Total = 0.00;
			UERow.Title = "Evacuations & Other";
			UERow.Other = 0.00;
			UERow.UnrestrictedFunds =0.00;
			UERow.RestrictedFunds = 0.00;
			UERow.Evacuations = 0.00;
			
			var RewardPaymentRow = {};
			RewardPaymentRow.Total = 0.00;
			RewardPaymentRow.Title = "Reward Payment";
			RewardPaymentRow.Other =0.00;
			RewardPaymentRow.UnrestrictedFunds = 0.00;
			RewardPaymentRow.RestrictedFunds = 0.00;
			RewardPaymentRow.Evacuations = 0.00;

			var RewardPublicityRow = {};
			RewardPublicityRow.Total = 0.00;
			RewardPublicityRow.Title = "Reward Publicity";
			RewardPublicityRow.Other = 0.00;
			RewardPublicityRow.UnrestrictedFunds = 0.00;
			RewardPublicityRow.RestrictedFunds = 0.00;
			RewardPublicityRow.Evacuations = 0.00;

			ArrayOfORecoveries.forEach(function(recovery,index) {
				var newRow = {};
				
				switch(recovery.Allotment) {
					case "2003":
							//this means its an evac
							UERow.Evacuations += parseFloat(recovery.Amount)
							UERow.Total += UERow.Evacuations
						break;
					case "1007":
							//this means its a payment
							if(recovery.OperatingAllowance == "100710") {								
								//handle whether publicity or not 
								if (recovery.RewardsPublicity == true) {
									if (!IsNullOrUndefined(recovery.RestrictedFunds)) {
										RewardPublicityRow.RestrictedFunds += parseFloat(recovery.RestrictedFunds)
										RewardPublicityRow.UnrestrictedFunds += parseFloat(recovery.Amount) - parseFloat(recovery.RestrictedFunds);
										RewardPublicityRow.Total += parseFloat(recovery.Amount)
									} else {
										RewardPublicityRow.UnrestrictedFunds += parseFloat(recovery.Amount);
										RewardPublicityRow.Total += parseFloat(recovery.Amount)
									}
								}else{
									if (!IsNullOrUndefined(recovery.RestrictedFunds)) {
										RewardPaymentRow.RestrictedFunds += parseFloat(recovery.RestrictedFunds)
										RewardPaymentRow.UnrestrictedFunds += parseFloat(recovery.Amount) - parseFloat(recovery.RestrictedFunds);
										RewardPaymentRow.Total += parseFloat(recovery.Amount)
									} else {
										RewardPaymentRow.UnrestrictedFunds += parseFloat(recovery.Amount);
										RewardPaymentRow.Total += parseFloat(recovery.Amount)
									}
								}									
							}else{
								//this means its other	
								UERow.Other += parseFloat(recovery.Amount);	
								UERow.Total += parseFloat(recovery.Amount);				
							}						
						break;					
				}				
			})//end of foreach loop
			
			totalRow.Total = parseFloat(UERow.Total) + parseFloat(RewardPublicityRow.Total) + parseFloat(RewardPaymentRow.Total) 						
			totalRow.Evacuations = parseFloat(UERow.Evacuations ) + parseFloat(RewardPublicityRow.Evacuations ) + parseFloat(RewardPaymentRow.Evacuations ) 			
			totalRow.Other = parseFloat(UERow.Other ) + parseFloat(RewardPublicityRow.Other ) + parseFloat(RewardPaymentRow.Other ) 		
			totalRow.RestrictedFunds = parseFloat(UERow.RestrictedFunds ) + parseFloat(RewardPublicityRow.RestrictedFunds ) + parseFloat(RewardPaymentRow.RestrictedFunds ) 		
			totalRow.UnrestrictedFunds = parseFloat(UERow.UnrestrictedFunds ) + parseFloat(RewardPublicityRow.UnrestrictedFunds ) + parseFloat(RewardPaymentRow.UnrestrictedFunds ) 
		
			
			FinalObject ={UERow: UERow, RewardPublicityRow:RewardPublicityRow, RewardPaymentRow:RewardPaymentRow, Total: totalRow}
			
			return FinalObject
		}

	}//end of return
}])
