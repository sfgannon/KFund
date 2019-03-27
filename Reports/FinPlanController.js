angular.module('FinPlanModule',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','UtilityModule'])
.controller('FinPlanController',['$q','$rootScope','$scope','$http','$state','AllTransactions','AvailableFiscalYears','ListOfOptions','GFMS','toastr','LiquidatedAmounts','UtilityService',function($q,$rootScope,$scope,$http,$state,AllTransactions,AvailableFiscalYears,ListOfOptions,GFMS,toastr,LiquidatedAmounts,UtilityService) {

	$scope.GFMS = GFMS;
	$scope.AllTransactions = AllTransactions.data;
	$scope.AllTransactions = _($scope.AllTransactions).chain().filter(function(item) {
		if (item.ItemType == 'Payment') {
			if (item.PaymentType == 'SPS Transfer') {
				if (!IsNullOrUndefined(item.Account) && (item.Account.indexOf('MEDCS') > -1 || item.Account.indexOf('M/EDCS') > -1)) {
					return item
				}
			} else if (item.PaymentType != 'Fund Cite') {
				return item
			}
		} else {
			return item;
		}
	}).value()
	$scope.LiquidatedAmounts = LiquidatedAmounts
	angular.forEach($scope.AllTransactions, function(item,index) {
		//var temp = new Date(item.Date)
		//item.Date = temp.toLocaleDateString();
		var dt = new Date(item.Date);
		item.Date = (dt.getMonth() + 1).toString() + "/" + dt.getDate().toString() + "/" + dt.getFullYear().toString();
		item.UnformattedDate = dt
		
		if(item.ItemType == "Obligation")
		{			
			angular.forEach(LiquidatedAmounts , function(liquidatedItem,index) {
				if(liquidatedItem.ObligationNumber == item.ObligationNumber)
				{
					item.LiquidatedAmount = liquidatedItem.LiquidatedAmount 
					item.UnliquidatedAmount = Number(item.Amount) - Number(item.LiquidatedAmount)
				}		
			})				
		}
		else
		{
			item.LiquidatedAmount = 0;
			item.UnliquidatedAmount = 0;

			if(item.ItemType == "Deposit")
			{
				item.Amount = item.Amount * -1
			}
			if(item.ItemType == "AccountAdjustment" && item.AdjustmentType == "Credit")
			{
				item.Amount = item.Amount * -1
			}					
			if(item.ItemType == "PaymentReturn")
			{
				item.Amount = item.Amount * -1
			}
		}	
		item.Total = item.Amount
	})
	$scope.AllTransactions = _.sortBy($scope.AllTransactions, function(object){ return object.UnformattedDate; });
	

	var unforeseenItems = _($scope.AllTransactions).chain().filter(function(item) {
		return item.OperatingAllowance == '2003' && item.ItemType == 'Obligation';
	}).groupBy('Purpose').value();
	var BreakoutTable = []
	var outItems = [];

	for (u=0;u<Object.keys(unforeseenItems).length;u++) {
		var descriptionObject = {}
		descriptionObject.ItemType = "Description"
		descriptionObject.description = Object.keys(unforeseenItems)[u]
		
		var object = {} 
		object.Description = Object.keys(unforeseenItems)[u]
		object.Transactions = unforeseenItems[Object.keys(unforeseenItems)[u]]
		object.ItemType = "Transactions";
		
		var spaceRow = {};
		spaceRow.ItemType = 'Space';
		spaceRow.Date = '';
		spaceRow.ObligationNumber = '';
		spaceRow.Amount = '';
		spaceRow.LiquidatedAmount = '';
		spaceRow.UnliquidatedAmount = '';
		spaceRow.Total = '';
		spaceRow.OperatingAllowance = '2003';
		spaceRow.Appropriation = '0522';
		spaceRow.PaymentType = 'Space';
	
		var outRow = {};
		outRow.ID = unforeseenItems[Object.keys(unforeseenItems)[u]][0].Id;
		outRow.OperatingAllowance = '2003';
		outRow.Appropriation = '0522';
		outRow.ItemType = "Obligation";
		outRow.Date = unforeseenItems[Object.keys(unforeseenItems)[u]][0].Date;
		outRow.ObligationNumber = unforeseenItems[Object.keys(unforeseenItems)[u]][0].ObligationNumber;
		outRow.Amount = 0;
		outRow.LiquidatedAmount = 0;
		outRow.UnliquidatedAmount = 0;
		outRow.Total = 0;
		outRow.Purpose = unforeseenItems[Object.keys(unforeseenItems)[u]][0].Purpose;
		
		var totalsObject = {}
		totalsObject.ItemType = "Totals"
		totalsObject.CheckAmount = 0
		totalsObject.ObligationAmount = 0
		totalsObject.LiquidatedAmount = 0
		totalsObject.UnliquidatedAmount = 0
		totalsObject.Total = 0
		
		
		for (i=0;i<unforeseenItems[Object.keys(unforeseenItems)[u]].length;i++) {
		
			if(unforeseenItems[Object.keys(unforeseenItems)[u]][i].ItemType == "Obligation")
			{
				totalsObject.ObligationAmount += parseFloat(unforeseenItems[Object.keys(unforeseenItems)[u]][i].Amount)
			}else{
				totalsObject.CheckAmount += parseFloat(unforeseenItems[Object.keys(unforeseenItems)[u]][i].Amount)
			}
		
			totalsObject.LiquidatedAmount += parseFloat(unforeseenItems[Object.keys(unforeseenItems)[u]][i].LiquidatedAmount);
			totalsObject.UnliquidatedAmount += parseFloat(unforeseenItems[Object.keys(unforeseenItems)[u]][i].UnliquidatedAmount);
	
	
			outRow.Amount += parseFloat(unforeseenItems[Object.keys(unforeseenItems)[u]][i].Amount);
			outRow.LiquidatedAmount += parseFloat(unforeseenItems[Object.keys(unforeseenItems)[u]][i].LiquidatedAmount);
			outRow.UnliquidatedAmount += parseFloat(unforeseenItems[Object.keys(unforeseenItems)[u]][i].UnliquidatedAmount);
			outRow.Total += parseFloat(unforeseenItems[Object.keys(unforeseenItems)[u]][i].Total)
		}
		
		BreakoutTable.push(descriptionObject)
		BreakoutTable.push(object);
		BreakoutTable.push(totalsObject);
		BreakoutTable.push(spaceRow);	
		outItems.push(spaceRow);
		outItems.push(outRow);
	}

	//Add Adjustments to Breakout
	var adjustments = _.filter($scope.AllTransactions, function(item) {
		return item.Allotment == '2003' && item.ItemType == 'Adjustment'; 
	});

	//Desc, Transactions, Totals, Space
	var adjustmentsRow = {
		'ItemType': "Description",
		'description': 'Other Credits/Charges'
	};
	var transactionsRow = {
		'ItemType': 'Transactions',
		'Description':'Other Credits/Charges',
		'Transactions': []
	}
	var totalRow = {
			'ItemType': 'Totals',
			'Date': '',
			'ObligationNumber':'',
			'ID': '',
			'ObligationAmount': 0,
			'LiquidatedAmount': 0,
			'UnliquidatedAmount': 0 
		}
	_.each(adjustments, function(item) {
		var row = {
			'ItemType': 'Adjustment',
			'Date': new Date(),
			'ObligationNumber':'',
			'ID': '',
			'Amount': 0,
			'LiquidatedAmount': 0,
			'UnliquidatedAmount': 0 
		}
		row.ObligationNumber = item.Purpose;
		row.Date = item.Date;
		row.ID = item.ID;
		row.Amount = item.Amount;
		row.LiquidatedAmount = item.Amount;
		row.UnliquidatedAmount = 0;
		transactionsRow.Transactions.push(row);
		totalRow.ObligationAmount += parseFloat(item.Amount);
		totalRow.LiquidatedAmount += parseFloat(item.Amount);
	})
	if (transactionsRow.Transactions.length > 0) {
		BreakoutTable.push(adjustmentsRow);
		BreakoutTable.push(transactionsRow);
		BreakoutTable.push(totalRow);
	}
	
	$scope.BreakoutTable = BreakoutTable
	$scope.AllTransactions = _.filter($scope.AllTransactions, function(item) {
		return item.OperatingAllowance != '2003';
	})
	$scope.AllTransactions = $scope.AllTransactions.concat(outItems);
	
 
		
	
	
	
	
	var unformattedDate = new Date( Date.now());

	$scope.FinPlan = {}
	$scope.FinPlan.FiscalYear = UtilityService.getTwoDigitFiscalYear(unformattedDate)


	var eachPaymentFY = _.pluck(AvailableFiscalYears.data, "FiscalYear")
	var uniqueFYarray = _.uniq(eachPaymentFY)
	uniqueFYarray = _.reject(uniqueFYarray, function(item){ return item == null });
	$scope.ListOfFiscalYears = uniqueFYarray.sort()
	
	if($state.params.FiscalYear != null)
	{
		$scope.FinPlan.FiscalYear = $state.params.FiscalYear
	}

	$scope.ChangeFiscalYear = function(NewFiscalYear){
		$state.go('FinPlan',{FiscalYear: NewFiscalYear},{reload: true});
	}

	
	
	
	$scope.GoToAdjustment = function(id) {
		$state.go('ViewAdjustment', {id: id});
	}
	$scope.GoToObligation = function(ObligationID){
		$state.go('ViewObligation',{id: ObligationID },{reload: true});
	}
	$scope.GoToPayment = function(PaymentID){
		$state.go('ViewPayment',{id: PaymentID},{reload: true});

	}
	$scope.GoToPaymentReturn = function(PaymentReturnID){
		$state.go('ViewPaymentReturn',{id: PaymentReturnID},{reload: true});
	}
	$scope.GoToDeposit = function(DepositID){
		$state.go('EditDeposit', {id: DepositID},{reload: true});
	}
	$scope.GoToAccountAdjustment = function(AccountAdjustmentID){
		$state.go('AddAdjustment', {id: AccountAdjustmentID},{reload: true});
	}

           

	$scope.OperatingAllowanceInfo = _.groupBy(AllTransactions.data, function(item){
	   return item.OperatingAllowance;
	});

	$scope.AppropriationInfo = _.groupBy(AllTransactions.data, function(item){
	   return item.Appropriation;
	});	
	
	$scope.ArrayOfTotalsObjects = []
	angular.forEach($scope.OperatingAllowanceInfo , function(array,index) {
		var tempArray = _.pluck(array, 'OperatingAllowance');
		var totalObj = {}
		totalObj.OperatingAllowance = _.first(tempArray)
				
		var CheckAmountTotal = 0.00
		var ObligationAmountTotal = 0.00
		var LiquidatedAmountTotal = 0.00
		var UnliquidatedAmountTotal = 0.00
		var TotalOfTotal = 0.00
		
		var arrayOfItemsMatchingOperatingAllowance = array

		angular.forEach(arrayOfItemsMatchingOperatingAllowance , function(item,index) {

				if(item.Appropriation != '0113')
				{
					if(item.ItemType == 'Obligation')
					{
						ObligationAmountTotal = ObligationAmountTotal + Number(item.Amount)
						LiquidatedAmountTotal = LiquidatedAmountTotal + Number(item.LiquidatedAmount)
						UnliquidatedAmountTotal = UnliquidatedAmountTotal + Number(item.UnliquidatedAmount)
					}else if (item.ItemType == 'Adjustment') {
						ObligationAmountTotal = ObligationAmountTotal + Number(item.Amount)
						LiquidatedAmountTotal = LiquidatedAmountTotal + Number(item.Amount)
					} else {
						if (item.OperatingAllowance != '2003') {
							switch (item.PaymentType) {
								case 'Check':
									CheckAmountTotal += parseFloat(item.Amount);
									break;
								case 'EFT':
									CheckAmountTotal += parseFloat(item.Amount);
									break;
								case 'SPS Transfer':
									if (!IsNullOrUndefined(item.Account) && (item.Account.indexOf('MEDCS') > -1 || item.Account.indexOf('M/EDCS') > -1)) {
										CheckAmountTotal += parseFloat(item.Amount);
									}
									break;
								case 'Fund Cite':
									//Fund Cites should not be included in CheckTotal
									break;
								default:
									break;
							}
						}
						// if(item.OperatingAllowance != '2003' && item.PaymentType != 'Fund Cite')
						// {			
						// 	CheckAmountTotal = CheckAmountTotal + Number(item.Amount)	
						// }
						item.Total = 0.00;
					}
					
					TotalOfTotal = TotalOfTotal + Number(item.Total)
				
				}
				
			
		})
		
		totalObj.CheckAmountTotal = CheckAmountTotal 
		totalObj.ObligationAmountTotal = ObligationAmountTotal 
		totalObj.LiquidatedAmountTotal = LiquidatedAmountTotal 
		totalObj.UnliquidatedAmountTotal = UnliquidatedAmountTotal 
		totalObj.TotalOfTotal = TotalOfTotal 
		$scope.ArrayOfTotalsObjects.push(totalObj)
		
	})
	
	angular.forEach($scope.AppropriationInfo , function(array,index) {
		if(index == "0113")
		{	
			var tempArray = _.pluck(array, 'Appropriation');
			var totalObj = {}
			totalObj.OperatingAllowance = _.first(tempArray)
					
			var CheckAmountTotal = 0.00
			var ObligationAmountTotal = 0.00
			var LiquidatedAmountTotal = 0.00
			var UnliquidatedAmountTotal = 0.00
			var TotalOfTotal = 0.00
			
			var arrayOfItemsMatchingOperatingAllowance = array	
			angular.forEach(arrayOfItemsMatchingOperatingAllowance , function(item,index) {
					if(item.ItemType == 'Obligation')
					{
						ObligationAmountTotal = ObligationAmountTotal + Number(item.Amount)
						LiquidatedAmountTotal = LiquidatedAmountTotal + Number(item.LiquidatedAmount)
						UnliquidatedAmountTotal = UnliquidatedAmountTotal + Number(item.UnliquidatedAmount)
					}else{			
						CheckAmountTotal = CheckAmountTotal + Number(item.Amount)
						item.Total = 0.00
					}
					
					TotalOfTotal = TotalOfTotal + Number(item.Total)
				
			})
			
			totalObj.CheckAmountTotal = CheckAmountTotal 
			totalObj.ObligationAmountTotal = ObligationAmountTotal 
			totalObj.LiquidatedAmountTotal = LiquidatedAmountTotal 
			totalObj.UnliquidatedAmountTotal = UnliquidatedAmountTotal 
			totalObj.TotalOfTotal = TotalOfTotal 
			$scope.ArrayOfTotalsObjects.push(totalObj)
		}
	})	
	
	$scope.TabOptions =  ListOfOptions.data;
	
	$scope.openTab = function (evt, OpAllow) {
	    var i, tabcontent, tablinks;	
	    tabcontent = document.getElementsByClassName("tabcontent");
	    for (i = 0; i < tabcontent.length; i++) {
	        tabcontent[i].style.display = "none";
	    }
	    tablinks = document.getElementsByClassName("tablinks");
	    for (i = 0; i < tablinks.length; i++) {
	        tablinks[i].className = tablinks[i].className.replace(" active", "");
	    }
	    document.getElementById(OpAllow).style.display = "block";
	}
		
		
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
////////////////////////////////////////////////////////////////BELOW IS THE CODE FOR THE TOTALS PAGE//////////////////////////////////////////////////////////////////////////////////////////////		

	var fundingwd1007 = _(GFMS).chain().filter(function(item) {
		if (item.Appropriation == '0522' && item.Allotment == '1007' && item.AdjustmentType == 'Funding w/d for Prior Years') {
			return item;
		}
	}).reduce(function(out,item) {
		return out += parseFloat(item.Amount);
	},0).value();
	var fundingwd2003 = _(GFMS).chain().filter(function(item) {
	if (item.Appropriation == '0522' && item.Allotment == '2003' && item.AdjustmentType == 'Funding w/d for Prior Years') {
		return item;
	}
	}).reduce(function(out,item) {
		return out += parseFloat(item.Amount);
	},0).value();
	var upward1007 = _(GFMS).chain().filter(function(item) {
		if (item.Appropriation == '0522' && item.Allotment == '1007' && item.AdjustmentType == 'Upward Spending Adj-Out') {
			return item;
		}
	}).reduce(function(out,item) {
		return out += parseFloat(item.Amount);
	},0).value();
	var upward2003 = _(GFMS).chain().filter(function(item) {
		if (item.Appropriation == '0522' && item.Allotment == '2003' && item.AdjustmentType == 'Upward Spending Adj-Out') {
			return item;
		}
	}).reduce(function(out,item) {
		return out += parseFloat(item.Amount);
	},0).value();
	var TotalTab = {};
	TotalTab.OperatingAllowanceRows = [];
	TotalTab.ObligationAllotmentRows = [];
	TotalTab.ObligationAllotmentRows.push({
		'Allotment': 'Allot 1007 - Regular',
		'Amount': 0
	});
	TotalTab.ObligationAllotmentRows.push({
		'Allotment': 'Allot 1007 - Funding W/D for Prior Years',
		'Amount': fundingwd1007
	});
	TotalTab.ObligationAllotmentRows.push({
		'Allotment': 'Allot 2003 - Regular',
		'Amount': 0
	});
	TotalTab.ObligationAllotmentRows.push({
		'Allotment': 'Allot 2003 - Funding W/D for Prior Years',
		'Amount': fundingwd2003
	});
	TotalTab.ObligationAllotmentRows.push({
		'Allotment': 'Allot 2003 - Funding W/D for Prior Years (in GFMS)',
		'Amount': 0
	});
	TotalTab.ObligationAllotmentTotal = {
		'Amount': 0,
		'Allotment': 'TOTAL OBLIGATIONS - EDCS'
	};
	TotalTab.AllotmentRows = [];
	TotalTab.AllotmentRows.push({
		'1007': 0,
		'2003': 0,
		'Total': 0,
		'Purpose': 'Regular'
	});
	TotalTab.AllotmentRows.push({
		'1007': fundingwd1007,
		'2003': fundingwd2003,
		'Total': 0,
		'Purpose': 'Funding W/D for Prior Years'
	});
	TotalTab.AllotmentRows.push({
		'1007': upward1007,
		'2003': upward2003,
		'Total': 0,
		'Purpose': 'Upward Spending Adj-Out'
	});
	TotalTab.AllotmentTotalRow = {
		'1007': 0,
		'2003': 0,
		'Total': 0,
		'Purpose': 'Total K Fund (from spreadsheets)'
	};

	var OperatingAllowances = _(ListOfOptions.data).chain().filter(function(item) {
		return item.TypeOfItem == 'OperatingAllowance';
	}).sortBy('ValueOfItem').value();
	_.each(OperatingAllowances, function(item) {
		TotalTab.OperatingAllowanceRows.push({
			'CheckAmounts': 0,
			'Number': item.ValueOfItem,
			'Obligations': 0,
			'Liquidated': 0,
			'Unliquidated': 0,
			'TotalObligations': 0,
			'Purpose': item.NotesOnItem
		});
	});
	TotalTab.OperatingAllowanceTotalsRow = {
		'CheckAmounts': 0,
		'Number': 'TOTAL',
		'Obligations': 0,
		'Liquidated': 0,
		'Unliquidated': 0,
		'TotalObligations': 0,
		'Purpose': ''
	};
	_.each($scope.OperatingAllowanceInfo, function(item) {
		if (!IsNullOrUndefined(item[0].OperatingAllowance)) {
			var OperatingAllowanceRow = _.where(TotalTab.OperatingAllowanceRows, { 'Number': item[0].OperatingAllowance })[0];
			_(item).chain().groupBy("Appropriation").each(function(appropriation) {
				_.each(appropriation,function(transaction) {
					var amt = (!IsNullOrUndefined(transaction.Amount) && !isNaN(transaction.Amount))?(parseFloat(transaction.Amount)):(0);
					switch (transaction.Appropriation) {
						case "0522":
							switch(transaction.Allotment) {
								case '1007':
									switch (transaction.ItemType) {
										case 'Obligation':
											OperatingAllowanceRow.Obligations += amt;
											TotalTab.OperatingAllowanceTotalsRow.Obligations += amt;
											TotalTab.ObligationAllotmentRows[0].Amount += amt;
											TotalTab.OperatingAllowanceTotalsRow.TotalObligations += amt;
											break;
										case 'Payment':
											OperatingAllowanceRow.Liquidated += amt;
											TotalTab.OperatingAllowanceTotalsRow.Liquidated += amt;
											break;
										case 'PaymentReturn':
											OperatingAllowanceRow.CheckAmounts -= amt;
											TotalTab.OperatingAllowanceTotalsRow.CheckAmounts -= amt;
											break;
										case 'Deposit':
											OperatingAllowanceRow.CheckAmounts -= amt;
											TotalTab.OperatingAllowanceTotalsRow.CheckAmounts -= amt;
											break;
										case 'Adjustment':
											//I don't think anything for these?
											break;
										case 'AccountAdjustment':
											//I don't think anything for these?
											break;
										default:
											break;
									}
									break;
								case '2003':
									switch (transaction.ItemType) {
										case 'Obligation':
											OperatingAllowanceRow.Obligations += amt;
											TotalTab.ObligationAllotmentRows[2].Amount += amt;
											break;
										case 'Payment':
											// Do nothing for 2003
											break;
										case 'PaymentReturn':
											// Do nothing for 2003
											break;
										case 'Deposit':
											// Do nothing for 2003
											break;
										case 'Adjustment':
											//I don't think anything for these?
											break;
										case 'AccountAdjustment':
											//I don't think anything for these?
											break;
										default:
											break;
									}
									break;
								default:
									break;
							}
							break;
						case "0113":

							break;
						default:
							break;
					}
				})
			})
		}
	})

	TotalTab.AllotmentRows[0]['1007'] = TotalTab.OperatingAllowanceTotalsRow.TotalObligations;
	TotalTab.AllotmentRows[0]['2003'] = _.where(TotalTab.OperatingAllowanceRows, {Number: '2003'})[0].Obligations;
	TotalTab.AllotmentRows[0].Total = parseFloat(TotalTab.AllotmentRows[0]['1007']) + parseFloat(TotalTab.AllotmentRows[0]['2003']);
	TotalTab.AllotmentTotalRow['1007'] = TotalTab.AllotmentRows[0]['1007'];
	TotalTab.AllotmentTotalRow['2003'] = TotalTab.AllotmentRows[0]['2003'];
	TotalTab.AllotmentTotalRow.Total = TotalTab.AllotmentRows[0].Total;

	$scope.TotalTab = TotalTab;

	$scope.Totals = {}
	$scope.Totals.ArrayOfOperatingAllowanceTotals = []
	var OperatingAllowances = _.where($scope.TabOptions, {TypeOfItem: "OperatingAllowance"});
		
	angular.forEach(OperatingAllowances , function(OperatingAllowance,index) {
		var obj = {}
		
		obj.OperatingAllowance = OperatingAllowance.ValueOfItem
		obj.Purpose = OperatingAllowance.NotesOnItem
		obj.CheckAmount = 0.00
		obj.Obligation = 0.00
		obj.LiquidatedBalance = 0.00
		obj.UnliquidatedBalance = 0.00
		
		angular.forEach($scope.OperatingAllowanceInfo , function(arrayForOA,OA) {
			
			if(obj.OperatingAllowance == OA)
			{
				angular.forEach(arrayForOA , function(item,index) {
					
					switch(item.ItemType)
					{
					    case "Obligation":
						    obj.Obligation = obj.Obligation + Number(item.Amount)
							obj.LiquidatedBalance = obj.LiquidatedBalance + Number(item.LiquidatedAmount)
							obj.UnliquidatedBalance = obj.UnliquidatedBalance + Number(item.UnliquidatedAmount)			
								        
					        break;
					    case "Payment":
							
							obj.CheckAmount = obj.CheckAmount +  Number(item.Amount)							        
					        
					        break;
					    case "PaymentReturn":
							
							obj.CheckAmount = obj.CheckAmount +  Number(item.Amount)							        
					        
					        break;
					    case "Deposit":
							
							obj.CheckAmount = obj.CheckAmount +  Number(item.Amount)							        
					        
					        break;


					    default:
					        							
					}					
				})				
			}
				
		})
		
		$scope.Totals.ArrayOfOperatingAllowanceTotals.push(obj)		
	})
	
	$scope.Totals.CheckAmountsTotal = 0.00
	$scope.Totals.ObligationsTotal = 0.00
	$scope.Totals.LiquidatedBalanceTotal = 0.00
	$scope.Totals.UnliquidatedBalanceTotal = 0.00
	
	angular.forEach($scope.Totals.ArrayOfOperatingAllowanceTotals , function(item,index) {
		$scope.Totals.CheckAmountsTotal = $scope.Totals.CheckAmountsTotal + item.CheckAmount 
		$scope.Totals.ObligationsTotal = $scope.Totals.ObligationsTotal + item.Obligation
		$scope.Totals.LiquidatedBalanceTotal = $scope.Totals.LiquidatedBalanceTotal + item.LiquidatedBalance
		$scope.Totals.UnliquidatedBalanceTotal = $scope.Totals.UnliquidatedBalanceTotal + item.UnliquidatedBalance				
	})
	
		
		
		
		
	
}])




