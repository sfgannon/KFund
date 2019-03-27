angular.module('ObligationService', ['LocalStorageModule','UtilityModule'])
.service('ObligationService', ['localStorageService','$window','$q','$http','ConfigService','UtilityService',function(localStorageService,$window,$q,$http,ConfigService,UtilityService) {

	return {	
		/*GenerateLiqudatedAmounts: function(){
			var ListName = ConfigService.getTransactionListName();
			var filter = "?$filter=ItemType eq 'Obligation' ";
			ObligationNumbers = [];
			var paymentsArray = [];
			var obligationPromise = $q.defer();
			
			return UtilityService.getItems(filter, ListName).then(function(res) {
				var promisesArray = [];
				res.data.forEach(function(item,index) {
					ObligationNumbers.push(item.ObligationNumber)
					

        			var camlFilter = "<View><Query><Where><And><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Payment</Value></Eq><Contains><FieldRef Name='Obligations' /><Value Type='Text'>" + item.ObligationNumber + "</Value></Eq></And></Where></Query></View>";
        			
					
			    	var filter = "?$filter=ItemType eq 'Payment' and substringof('"+ item.ObligationNumber +"' ,Obligations)";
			        var payments = UtilityService.getItemsCAML(camlFilter,ConfigService.getTransactionListName())
					promisesArray.push(payments);	
					
			
				});
				paymentsArray.push($q.all(promisesArray));
				
				var promise = $q.defer();	
							
				promise.promise = $q.all(paymentsArray).then(function(res) {
					var outTable = [];
					res.forEach(function(arrayOfPaymentArrays,index) {	
					
				
						arrayOfPaymentArrays.forEach(function(paymentsArray,i) {	
							
							var TotalLiquidatedAmountForThisObligationNumber = 0.00
							var ObligationObject = {};
	     			   		ObligationObject.ObligationNumber = ObligationNumbers[i]						
											
							angular.forEach(paymentsArray, function(payment,index) {							
								var ObligationAmounts = JSON.parse(payment.Obligations)
								if(payment.PaymentType != "Fund Cite")
								{
									angular.forEach(ObligationAmounts , function(jsonItem,index) {
										if(jsonItem.ObligationNumber == ObligationObject.ObligationNumber)
										{
											TotalLiquidatedAmountForThisObligationNumber = TotalLiquidatedAmountForThisObligationNumber + Number(jsonItem.Amount)
										}
									})									
								}else{
									TotalLiquidatedAmountForThisObligationNumber = TotalLiquidatedAmountForThisObligationNumber + Number(payment.Amount)
								}
														
							})
							
	 						ObligationObject.LiquidatedAmount = TotalLiquidatedAmountForThisObligationNumber	
							outTable.push(ObligationObject);	
						})		
					})
					
					promise.resolve(outTable);
				})
				
				return promise.promise;
				
			}, function(err) {
				console.log("error" + JSON.stringify(err));			
			});						
		},	*/
		QuickGetLiquidatedBalances: function(FY, allPayments, allObligations) {
			var retVal = $q.defer();
			var that = this;
			var obligationsArray = allObligations;
			var ObligationNumbers = [];
			var outValues = [];
			angular.forEach(obligationsArray, function(ob) {
				outValues.push(that.CalculateLiquidatedBalances(ob.ObligationNumber, _.filter(allPayments, function(item) {
					return _.where(JSON.parse(item.Obligations), {"ObligationNumber": ob.ObligationNumber }).length > 0;
				}, that)));
			})
			retVal.resolve(outValues);
			return retVal.promise;
		},
		
		GetLiquidatedBalances: function(FY){			
			var that = this
			var retVal = $q.defer()			
			retVal.promise = that.GetAllObligation(FY).then(function(obligationsResolve) {
				var obligationsArray = obligationsResolve.data
				var pArray = []
				var ObligationNumbers = [];				
				angular.forEach(obligationsArray , function(obligation,index) {
					pArray.push(that.GetAllPaymentsForObligation(obligation.ObligationNumber))
					ObligationNumbers.push(obligation.ObligationNumber)
				})
				var outValues = []				
				var promise = $q.defer()				
				promise.promise = $q.all(pArray).then(function(paymentsResolve) {
					angular.forEach(paymentsResolve, function(PaymentArray,index) {
						outValues.push( that.CalculateLiquidatedBalances(ObligationNumbers[index] , PaymentArray))
					})					
					promise.resolve(outValues)
				})					
				return promise.promise;		
			})			
			return retVal.promise
		},		
		GetAllObligation: function(FY){
			var ListName = ConfigService.getTransactionListName();
			var filter = "?$filter=ItemType eq 'Obligation'";
			if(FY!=null)
			{
				filter = filter + "and FiscalYear eq '" + FY + "'"
			}
			return UtilityService.getItems(filter, ListName) 		
		},
		GetAllPaymentsForObligation: function(ObligationNumber){
			var camlFilter = "<View><Query><Where><And><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Payment</Value></Eq><Contains><FieldRef Name='Obligations' /><Value Type='Text'>" + ObligationNumber + "</Value></Contains></And></Where></Query></View>";						
	    	var filter = "?$filter=ItemType eq 'Payment' and substringof('"+ ObligationNumber +"' ,Obligations)";
	        return UtilityService.getItemsCAML(camlFilter,ConfigService.getTransactionListName())		
			
		},
		CalculateLiquidatedBalances: function(ObligationNumber, arrayOfPayments){
			var TotalLiquidatedAmountForThisObligationNumber = 0.00
			var ObligationObject = {};
	   		ObligationObject.ObligationNumber = ObligationNumber						
							
			angular.forEach(arrayOfPayments, function(payment,index) {							
				var ObligationAmounts = JSON.parse(payment.Obligations)
				if(payment.PaymentType != "Fund Cite")
				{
					angular.forEach(ObligationAmounts , function(jsonItem,index) {
						if(jsonItem.ObligationNumber == ObligationObject.ObligationNumber)
						{
							TotalLiquidatedAmountForThisObligationNumber = TotalLiquidatedAmountForThisObligationNumber + Number(jsonItem.Amount)
						}
					})									
				}else{
					TotalLiquidatedAmountForThisObligationNumber = TotalLiquidatedAmountForThisObligationNumber + Number(payment.Amount)
				}										
			})
			
			ObligationObject.LiquidatedAmount = TotalLiquidatedAmountForThisObligationNumber
			return ObligationObject
		}

	}//end of return
}])
