angular.module('CheckbookController',['ngResource','ui.router','LocalStorageModule','ngAnimate','toastr','angular-spinkit','UtilityModule'])
.controller('CheckbookController',['$q','$rootScope','$scope','$http','$state','AllPayments','AvailableFiscalYears','UtilityService','toastr',function($q,$rootScope,$scope,$http,$state,AllPayments,AvailableFiscalYears,UtilityService,toastr) {



	
	$scope.AllPayments = AllPayments.data;
	
	var unformattedDate = new Date( Date.now());
	//$scope.TodaysDate = unformattedDate.toLocaleDateString('en-US');
	$scope.TodaysDate = unformattedDate;
	$scope.TodaysTotal = "0.00";
	$scope.GoToPayment = function(PaymentID){
		$state.go('ViewPayment',{id: PaymentID},{reload: true});
	}
	$scope.GoToPaymentReturn = function(PaymentReturnID){
		$state.go('ViewPaymentReturn',{id: PaymentReturnID},{reload: true});
	}
	$scope.GoToDeposit = function(DepositID){
		$state.go('EditDeposit', {id: DepositID},{reload: true});
	}
	$scope.GoToAccountAdjustment = function(AdjustmentID){
		$state.go('AddAdjustment', {id: AdjustmentID},{reload: true});
	}
	
	$scope.CheckBook = {}
	$scope.CheckBook.FiscalYear = UtilityService.getTwoDigitFiscalYear($scope.TodaysDate)


	var eachPaymentFY = _.pluck(AvailableFiscalYears.data, "FiscalYear")
	var uniqueFYarray = _.uniq(eachPaymentFY)
	uniqueFYarray = _.reject(uniqueFYarray, function(item){ return item == null });
	$scope.ListOfFiscalYears = uniqueFYarray.sort()
	
	if($state.params.FiscalYear != null)
	{
		$scope.CheckBook.FiscalYear = $state.params.FiscalYear
	}

	$scope.ChangeFiscalYear = function(NewFiscalYear){
		$state.go('Checkbook',{FiscalYear: NewFiscalYear},{reload: true});
	}


	var January = {}
	January.Title = "January"
	January.Payment  = []
	January.Total = 0
	January.Date = "01/31/20"+$scope.CheckBook.FiscalYear
	var February = {}
	February.Title = "February"
	February.Payment  = []
	February.Total = 0
	February.Date = "02/28/20"+$scope.CheckBook.FiscalYear
	var isLeapYear = Number($scope.CheckBook.FiscalYear) % 4
	if(isLeapYear == 0)
	{
		February.Date = "02/29/20"+$scope.CheckBook.FiscalYear
	}
	var March = {}
	March.Title = "March"
	March.Payment  = []
	March.Total = 0
	March.Date = "03/31/20"+$scope.CheckBook.FiscalYear
	var April = {}
	April.Title = "April"
	April.Payment  = []
	April.Total = 0
	April.Date = "04/30/20"+$scope.CheckBook.FiscalYear
	var May = {}
	May.Title = "May"
	May.Payment  = []
	May.Total = 0
	May.Date = "05/31/20"+$scope.CheckBook.FiscalYear
	var June = {}
	June.Title = "June"
	June.Payment  = []
	June.Total = 0
	June.Date = "06/30/20"+$scope.CheckBook.FiscalYear
	var July = {}
	July.Title = "July"
	July.Payment  = []
	July.Total = 0
	July.Date = "07/31/20"+$scope.CheckBook.FiscalYear
	var August = {}
	August.Title = "August"
	August.Payment  = []
	August.Total = 0
	August.Date = "08/31/20"+$scope.CheckBook.FiscalYear
	var September = {}
	September.Title = "September"
	September.Payment  = []
	September.Total = 0
	September.Date = "09/30/20"+$scope.CheckBook.FiscalYear
	var October = {}
	October.Title = "October"
	October.Payment  = []
	October.Total = 0
	var temp = Number($scope.CheckBook.FiscalYear)
	temp = temp - 1
	October.Date = "10/31/20" + temp.toString()
	var November = {}
	November.Title = "November"
	November.Payment  = []
	November.Total = 0
	November.Date = "11/30/20"+ temp.toString()
	var December = {}
	December.Title = "December"
	December.Payment  = []
	December.Total = 0
	December.Date = "12/31/20"+ temp.toString()

	var SortOrderAndGroup = function(array, groupBy, sortBy) {
		array = _(array).chain().map(function(item) {
			var da = new Date(item.Date);
			item.Date = da.toLocaleDateString();
			return item;
		}).sortBy(function(item) {
			return Number(item[sortBy]);
		}).sortBy(groupBy).value();
		return array;
	}

	var SortGroup = function(array) {
		array = _(array).chain().map(function(item) {
			var da = new Date(item.Date);
			item.Date = da.toLocaleDateString();
			return item;
		}).groupBy(function(item) {
			return item.Date;
		}).map(function(item) {
			item = _.sortBy(item, function(i){
				if (!isNaN(i.CheckNumber)) {
					var num = new Number(i.CheckNumber);
					i.CheckNumber = num.valueOf();
				}
				return i.CheckNumber;
			});
			return item;
		}).value()
		var out = [];
		array = _(array).each(function(item) {
			_.each(item, function(i) {
				i.CheckNumber = i.CheckNumber.toString();
				out.push(i);
			});
		});
		return out;
	}
	
	//KFund-429 - Checkbook 2017 - March
	var Checks = _($scope.AllPayments).chain().filter(function(item) {
		return item.ItemType == 'Payment' && item.PaymentType == 'Check';
	}).value();
	// Checks = SortOrderAndGroup(Checks,"Date","CheckNumber");
	Checks = SortGroup(Checks);
	var EFTs = _($scope.AllPayments).chain().filter(function(item) {
		return item.ItemType == 'Payment' && item.PaymentType == 'EFT';
	}).value();
	var AccountAdjustments_Credits = _($scope.AllPayments).chain().filter(function(item) {
		return item.ItemType == 'AccountAdjustment' && item.AdjustmentType == 'Credit';
	}).value();
	var AccountAdjustments_Debits = _($scope.AllPayments).chain().filter(function(item) {
		return item.ItemType == 'AccountAdjustment' && item.AdjustmentType == 'Debit';
	}).value();
	var PaymentReturns = _($scope.AllPayments).chain().filter(function(item) {
		return item.ItemType == 'PaymentReturn';
	}).value();
	var Deposits = _($scope.AllPayments).chain().filter(function(item) {
		return item.ItemType == 'Deposit';
	}).value();


	$scope.AllPayments = Checks.concat(EFTs).concat(AccountAdjustments_Debits).concat(PaymentReturns).concat(AccountAdjustments_Credits).concat(Deposits);
	//KFund-429

	angular.forEach($scope.AllPayments, function(item,index) {
		//var temp = new Date(item.Date)
		//item.Date = temp.toLocaleDateString();
		
		var dt = new Date(item.Date);
		item.Date = (dt.getMonth() + 1).toString() + "/" + dt.getDate().toString() + "/" + dt.getFullYear().toString();
		item.UnformattedDate = dt
		
		if(item.Amount == null)
		{
			item.Amount = 0.00
		}
		
		if(item.ItemType == 'AccountAdjustment' && item.AdjustmentType == 'Credit' )
		{
			item.Amount = item.Amount * -1
		}

		if(item.ItemType == 'Deposit' )
		{
			item.Amount = item.Amount * -1
		}

		
		if(item.ItemType == 'PaymentReturn' )
		{
			item.Amount = item.Amount * -1
		}
		
		$scope.TodaysTotal = Number($scope.TodaysTotal) + Number(item.Amount)
		
		switch(dt.getMonth()) {
		    case 0:
		        January.Payment.push(item)
		        January.Total += parseFloat(item.Amount)
		        break;
		    case 1:
		        February.Payment.push(item)
		        February.Total += parseFloat(item.Amount)
		        break;
		    case 2:
		        March.Payment.push(item)
		        March.Total += parseFloat(item.Amount)
		        break;
		    case 3:
		        April.Payment.push(item)
		        April.Total += parseFloat(item.Amount)
		        break;
		    case 4:
		        May.Payment.push(item)
		        May.Total += parseFloat(item.Amount)
		        break;
		    case 5:
		        June.Payment.push(item)
		        June.Total += parseFloat(item.Amount)
		        break;
		    case 6:
		        July.Payment.push(item)
		        July.Total += parseFloat(item.Amount)
		        break;
		    case 7:
		        August.Payment.push(item)
		        August.Total += parseFloat(item.Amount)
		        break;
		    case 8:
		        September.Payment.push(item)
		        September.Total += parseFloat(item.Amount)
		        break;
		    case 9:
		        October.Payment.push(item)
		        October.Total += parseFloat(item.Amount)
		        break;
		    case 10:
		        November.Payment.push(item)
		        November.Total += parseFloat(item.Amount)
		        break;
		    case 11:
		        December.Payment.push(item)
		        December.Total += parseFloat(item.Amount)
		        break;
		}
	})
	
	
	
	
	

	
	$scope.Months = []
	$scope.Months.push(October)	
	$scope.Months.push(November)	
	$scope.Months.push(December)
	$scope.Months.push(January)	
	$scope.Months.push(February)	
	$scope.Months.push(March)	
	$scope.Months.push(April)	
	$scope.Months.push(May)	
	$scope.Months.push(June)	
	$scope.Months.push(July)	
	$scope.Months.push(August)	
	$scope.Months.push(September)
	//OBE'd - KFund-429   
	//angular.forEach($scope.Months, function(month,index) {
	//	month.Payment = _.sortBy(month.Payment, function(object){ return object.UnformattedDate; })
	//})

	
	
	
	
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
