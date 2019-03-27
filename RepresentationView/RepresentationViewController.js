angular.module('RepresentationViewController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','UtilityModule'])
.controller('RepresentationViewController',['$q','$rootScope','$scope','$http','$state','AllPayments','AvailableFiscalYears','toastr','UtilityService','RepresentationTypes','Bureaus','AdhocBureaus',function($q,$rootScope,$scope,$http,$state,AllPayments,AvailableFiscalYears,toastr,UtilityService,RepresentationTypes,Bureaus,AdhocBureaus) {

	
	$scope.AllPayments = AllPayments.data;
	$scope.RepresentationTypes = RepresentationTypes
	$scope.RepresentationTypes.push("Other")
	$scope.Bureaus = Bureaus
	$scope.AdhocBureaus = AdhocBureaus.sort()
		
	var unformattedDate = new Date( Date.now());
	$scope.TodaysDate = unformattedDate.toLocaleDateString();
	
	$scope.Representation = {}
	$scope.Representation.FiscalYear = UtilityService.getTwoDigitFiscalYear($scope.TodaysDate)
	
	
	
	var eachPaymentFY = _.pluck(AvailableFiscalYears.data, "FiscalYear")
	var uniqueFYarray = _.uniq(eachPaymentFY)
	uniqueFYarray = _.reject(uniqueFYarray, function(item){ return item == null });
	$scope.ListOfFiscalYears = uniqueFYarray
	$scope.ListOfFiscalYears = $scope.ListOfFiscalYears.sort()
	
	if($state.params.FiscalYear != null)
	{
		$scope.Representation.FiscalYear = $state.params.FiscalYear
	}
	
	$scope.ChangeFiscalYear = function(NewFiscalYear){
		$state.go('RepresentationView',{FiscalYear: NewFiscalYear},{reload: true});
	}
	$scope.TableObjects = []
	angular.forEach($scope.RepresentationTypes, function(RepType, repIndex) {
		
		var tableObject = {}
		tableObject.RepresentationType = RepType
		
		var rows = [];
		tableObject.Qtr1Total = 0;
		tableObject.Qtr2Total = 0;
		tableObject.Qtr3Total = 0;
		tableObject.Qtr4Total = 0;
		
		//each table needs a row for all the appropriat bureaus.
		//so regular bureau needs all the normal bureaus and adhoc bureau needs only the adhoc burueas
		tableObject.BureauList = []	
		var payments = []
		switch(RepType) {
			case "Bureau Payment":
				tableObject.BureauList = $scope.Bureaus
				payments = _.where($scope.AllPayments, {RepresentationType: "Bureau Payment"});
				break;
			case "Adhoc Bureau Payment":
				tableObject.BureauList = $scope.AdhocBureaus
				payments = _.where($scope.AllPayments, {RepresentationType: "Adhoc Bureau Payment"});
				break;
			case "Functions Paid by MEDCS":
				payments = _.where($scope.AllPayments, {RepresentationType: "Functions Paid by MEDCS"});
				break;
			default:
				payments = _.where($scope.AllPayments, {BureauAllotment: true});
				payments =  _.reject(payments , function(object){ return object.RepresentationType == "Bureau Payment"; });
				payments =  _.reject(payments , function(object){ return object.RepresentationType == "Adhoc Bureau Payment"; });
				payments =  _.reject(payments , function(object){ return object.RepresentationType == "Functions Paid by MEDCS"; });								

		}		
		//now that wee have the appropriate burueaus and payments plucked we need a row for each bureau
		
		
		//TO DO NEXT: add for each loop on the bureaus and with in the loop create row for each bureaus
		//when making each row loop payments to add to rows. if match add. if not skip
		//when adding add to appropriate qtr total
		
		
		//this will only work for bureau and adhoc bureau
		angular.forEach(tableObject.BureauList, function(bureau, index) {			
			if (bureau != '' && bureau != null && bureau != undefined) {
				var bureauPayments = _.where(payments , {Bureau: bureau})	
				
				
				
				
				var PurposeValues = _(bureauPayments).chain().pluck('AllotmentType').unique().value();			
				for (var i = 0; i < PurposeValues.length; i++) {
				
					var row = {};
					row.Purpose = PurposeValues[i];
					row.Bureau = bureau;
					row.Checks = "";
					row.First = 0;
					row.Second = 0;
					row.Third = 0;
					row.Fourth = 0;
					row.BureauTotal = 0;
		
							
					
					var purposePayments = 	_.where(bureauPayments , {AllotmentType: PurposeValues[i]})	
					angular.forEach(purposePayments , function(pmt, index) {
													
						var PaymentDate = new Date(pmt.Date);
											
						var Qtr = UtilityService.getFiscalQuarter(PaymentDate)
						
						switch(Qtr) {
						    case 1:
								var amount = Number(pmt.Amount);
								row.First += amount;
								tableObject.Qtr1Total = amount + Number(tableObject.Qtr1Total);
								row.BureauTotal += amount
	
						        break;
						    case 2:
								var amount = Number(pmt.Amount);
								row.Second += amount;
								tableObject.Qtr2Total = amount + Number(tableObject.Qtr2Total);
								row.BureauTotal += amount
	
						        break;
						    case 3:
								var amount = Number(pmt.Amount);
								row.Third += amount;
								tableObject.Qtr3Total = amount + Number(tableObject.Qtr3Total);
								row.BureauTotal += amount
	
						        break;
						    case 4:
								var amount = Number(pmt.Amount);
								row.Fourth += amount;
								tableObject.Qtr4Total = amount + Number(tableObject.Qtr4Total);
								row.BureauTotal += amount
	
						        break;
						}					
						
						if (pmt.PaymentType == 'EFT'){pmt.CheckNumber = "EFT " + new Date(pmt.Date).toLocaleDateString(); }
						if (pmt.PaymentType == 'SPS Transfer'){pmt.CheckNumber = "SPS Transfer"; }
						if (row.Checks != "") {
							row.Checks += ", " + pmt.CheckNumber;
						} else { row.Checks = pmt.CheckNumber; }										
						
					})//end of payments loop
					rows.push(row);	
				}//end of the purpose loop				
					
			}//end of if statement			
		})//end of bureaus list loop
		
		
		//need a loop right here to handle the "paid by medcs" and other payments
		if(RepType != "Adhoc Bureau Payment" && RepType != "Bureau Payment")
		{
			tableObject.Qtr1Object = {}
			tableObject.Qtr1Object.Payments = []
			tableObject.Qtr1Object.Total = 0			
			tableObject.Qtr2Object = {}	
			tableObject.Qtr2Object.Payments = []
			tableObject.Qtr2Object.Total = 0
			tableObject.Qtr3Object = {}	
			tableObject.Qtr3Object.Payments = []
			tableObject.Qtr3Object.Total = 0
			tableObject.Qtr4Object = {}		
			tableObject.Qtr4Object.Payments = []
			tableObject.Qtr4Object.Total = 0
					
			angular.forEach(payments , function(pmt, index) {
											
				var PaymentDate = new Date(pmt.Date);	

				pmt.Date = PaymentDate.toLocaleDateString();
				
				var Qtr = UtilityService.getFiscalQuarter(PaymentDate)
				
				if(pmt.PaymentType == "EFT"){pmt.CheckNumber = "EFT"}
				
				switch(Qtr) {
				    case 1:
				    	
						var amount = Number(pmt.Amount);
						tableObject.Qtr1Total = amount + Number(tableObject.Qtr1Total);
						
						tableObject.Qtr1Object.Total = amount + Number(tableObject.Qtr1Object.Total );						
						tableObject.Qtr1Object.Payments.push(pmt)						
				        break;
				    case 2:
						var amount = Number(pmt.Amount);
						tableObject.Qtr2Total = amount + Number(tableObject.Qtr2Total);
						
						tableObject.Qtr2Object.Total = amount + Number(tableObject.Qtr2Object.Total );						
						tableObject.Qtr2Object.Payments.push(pmt)
				        break;
				    case 3:
						var amount = Number(pmt.Amount);
						tableObject.Qtr3Total = amount + Number(tableObject.Qtr3Total);
						
						tableObject.Qtr3Object.Total = amount + Number(tableObject.Qtr3Object.Total );						
						tableObject.Qtr3Object.Payments.push(pmt)
				        break;
				    case 4:
						var amount = Number(pmt.Amount);
						tableObject.Qtr4Total = amount + Number(tableObject.Qtr4Total);
						
						tableObject.Qtr4Object.Total = amount + Number(tableObject.Qtr4Object.Total );						
						tableObject.Qtr4Object.Payments.push(pmt)							
				        break;
				}//end of switch					
			})//end of payments loop				
				
			rows = payments 		
		}		
		
		
		tableObject.FiscalTotal = tableObject.Qtr1Total + tableObject.Qtr2Total + tableObject.Qtr3Total + tableObject.Qtr4Total
		tableObject.rows = rows
		$scope.TableObjects.push(tableObject)
	})//end of the rep type loop
	
	

//there now needs to be a table object for each Representation Type	
/*	var rows = [];
	$scope.Qtr1Total = 0;
	$scope.Qtr2Total = 0;
	$scope.Qtr3Total = 0;
	$scope.Qtr4Total = 0;
	
	var BureausList = _(AllPayments.data).chain().flatten().pluck('Bureau').unique().compact().sortBy(function(val) { return val; }).value();
	
	angular.forEach(BureausList, function(value, index) {
		if (value != '' && value != null && value != undefined) {
			var BureauPayments = _.filter(AllPayments.data, function(val) {
				return val.Bureau == value;
			})

			var PurposeValues = _(BureauPayments).chain().pluck('AllotmentType').unique().value();
			
			for (var i = 0; i < PurposeValues.length; i++) {
				var row = {};
				//if (i == 0) { row.Bureau = value; }
				row.Bureau = value;
				row.Purpose = PurposeValues[i];
				row.Checks = "";
				row.First = 0;
				row.Second = 0;
				row.Third = 0;
				row.Fourth = 0;
				row.BureauTotal = 0;
				
				angular.forEach(_.filter(BureauPayments, function(payment) { return payment.AllotmentType == PurposeValues[i]; }), function(pmt, ind) 				{
					var PaymentDate = new Date(pmt.Date);
					
					var Qtr = UtilityService.getFiscalQuarter(PaymentDate)
					
					switch(Qtr) {
					    case 1:
							var amount = Number(pmt.Amount);
							row.First += amount;
							$scope.Qtr1Total = amount + Number($scope.Qtr1Total);
							row.BureauTotal += amount

					        break;
					    case 2:
							var amount = Number(pmt.Amount);
							row.Second += amount;
							$scope.Qtr2Total = amount + Number($scope.Qtr2Total);
							row.BureauTotal += amount

					        break;
					    case 3:
							var amount = Number(pmt.Amount);
							row.Third += amount;
							$scope.Qtr3Total = amount + Number($scope.Qtr3Total);
							row.BureauTotal += amount

					        break;
					    case 4:
							var amount = Number(pmt.Amount);
							row.Fourth += amount;
							$scope.Qtr4Total = amount + Number($scope.Qtr4Total);
							row.BureauTotal += amount

					        break;
					}					
					
					if (pmt.PaymentType == 'EFT'){pmt.CheckNumber = "EFT " + new Date(pmt.Date).toLocaleDateString(); }
					if (pmt.PaymentType == 'SPS Transfer'){pmt.CheckNumber = "SPS Transfer"; }
					if (row.Checks != "") {
						row.Checks += ", " + pmt.CheckNumber;
					} else { row.Checks = pmt.CheckNumber; }
				})
				
				
				rows.push(row);
			}
			

		}
	})
	
	$scope.FiscalTotal = $scope.Qtr1Total + $scope.Qtr2Total + $scope.Qtr3Total + $scope.Qtr4Total
	
	$scope.rows = rows;*/
	
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

	

		
}])

