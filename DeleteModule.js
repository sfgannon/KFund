angular.module('DeleteModule', ['LocalStorageModule','UtilityModule','ConfigModule'])
.service('DeleteModule',['$q','$http','localStorageService','UtilityService','ConfigService',function($q,$http,localStorageService,UtilityService,ConfigService) {
	return {
		getAllotmentReferenceItems: function(allotmentObject) {
			//just delete all associated items on delete
			return [];
		},
		getObligationReferenceItems: function(obligationObject) {
			var ObligationNumber = obligationObject.ObligationNumber 
			var camlFilter = "<View><Query><Where><And><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Payment</Value></Eq><Contains><FieldRef Name='Obligations' /><Value Type='Text'>" + ObligationNumber + "</Value></Contains></And></Where></Query></View>";						
	    	var filter = "?$filter=ItemType eq 'Payment' and substringof('"+ ObligationNumber +"' ,Obligations)";
	        	
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItemsCAML(camlFilter,ConfigService.getTransactionListName())
			return retVal.promise;         
		},
		getPaymentReferenceItems: function(paymentObject) {
			var paymentId = paymentObject.Id 
			var camlFilter = "<View><Query><Where><And><Eq><FieldRef Name='ItemType' /><Value Type='Text'>PaymentReturn</Value></Eq><Contains><FieldRef Name='PaymentReturnSources' /><Value Type='Text'>" + paymentId + "</Value></Contains></And></Where></Query></View>";		
	        	
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItemsCAML(camlFilter,ConfigService.getTransactionListName())
			return retVal.promise; 
		},
		getRppReferenceItems: function(rppObject) {
			var RPPNumber = rppObject.RPP 
			var camlFilter = "<View><Query><Where><And><Eq><FieldRef Name='ItemType' /><Value Type='Text'>Payment</Value></Eq><Contains><FieldRef Name='RPPs' /><Value Type='Text'>" + RPPNumber + "</Value></Contains></And></Where></Query></View>";						
	    	var filter = "?$filter=ItemType eq 'Payment' and substringof('"+ RPPNumber +"' ,Obligations)";
	        	
			var retVal = $q.defer();
			retVal.promise = UtilityService.getItemsCAML(camlFilter,ConfigService.getTransactionListName())
			return retVal.promise;  
		},
		RemoveObligationReferences: function(payment, obligationNumber){			
			payment.Obligations = _.reject(payment.Obligations, function(object){ return object.ObligationNumber ==  obligationNumber});
			payment.SavePayment().then(function(res) {
	            console.log("Payment successfully saved")
	        }, function(err) {
	            console.log("payment failed")
	        });
			return null
		},
		RemoveRppReferences: function(payment, RPP){			
			payment.RPPs = _.reject(payment.RPPs, function(paymentRPP){ return paymentRPP ==  RPP});
			payment.SavePayment().then(function(res) {
	            console.log("Payment successfully saved")
	        }, function(err) {
	            console.log("payment failed")
	        });
			return null
		},
		RemovePaymentReturnReferences: function(paymentReturn, PaymentId){			
			paymentReturn.PaymentReturnSources = _.reject(paymentReturn.PaymentReturnSources , function(payID){ return payID ==  PaymentId});
			paymentReturn.SavePaymentReturn().then(function(res) {
	            console.log("Payment successfully saved")
	        }, function(err) {
	            console.log("payment failed")
	        });

			return null
		},
		RemoveAllotmentReferences: function(allotment){
			
			var test = allotment
			
			return null
		}
		
		
	}
}])