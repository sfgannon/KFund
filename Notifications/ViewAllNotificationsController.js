angular.module('ViewAllNotificationsController',['ngResource','ui.router','LocalStorageModule','ngAnimate','angular-notification-icons','toastr','angular-spinkit'])
.controller('ViewAllNotificationsController',['$q','$rootScope','$scope','$http','$state','toastr','Alerts','UtilityService','ConfigService',function($q,$rootScope,$scope,$http,$state,toastr,Alerts,UtilityService,ConfigService) {
			


		$scope.Alerts = Alerts;

		angular.forEach($scope.Alerts , function(item,index) {
			var temp = new Date(item.Date)
			item.Date = temp.toLocaleDateString();
		})
		
		$scope.UnreadAlerts = _.where($scope.Alerts, {AlertStatus: "Unread"})
				
		$scope.Notification ={}
		$scope.Notification.Switch = true

		$scope.dismissAlert = function(index) {
			var alert = $scope.UnreadAlerts[index];
			alert.AlertStatus = "Dismissed";
			alert.SaveAlert().then(function(res) {
				$scope.UnreadAlerts.splice(index,1);
			});			
		}
			
		
		
		
		$scope.ViewAlert = function(Id) {
			var ret = $q.defer();
			ret.promise = UtilityService.getItem(Id,'',ConfigService.getTransactionListName()).then(function(res) {
				switch (res.data.ItemType) {
					case 'Payment':
						$state.go('ViewPayment', { id: Id });
						break;
					case 'Obligation':
						$state.go('ViewObligation', { id: Id });
						break;
					default:
						break;
				}
			})
			return ret.promise;
		}
}])


