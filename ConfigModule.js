angular.module('ConfigModule',['LocalStorageModule'])
.service('ConfigService',['localStorageService','$window',function(localStorageService,$window) {
	return {
		appFileName: function() {
			return 'app.js';
		},
		appLibraryName: function() {
			return 'SitePages';
		},
		appAssetsDirectory: function() {
			return 'SiteAssets/KFundDev';
		},
		getSiteRoot: function() {
			//Return the site root if not already stored in sessionStorage
			if (localStorageService.get('siteRoot')) {
				return localStorageService.get('siteRoot');
			} else {
				var fullUrl = $window.location.href;
				localStorageService.set('siteRoot', fullUrl.substring(0, fullUrl.indexOf(this.appLibraryName())));
				return fullUrl.substring(0, fullUrl.indexOf(this.appLibraryName()));
			}
		},
		getTransactionListName: function() {
			return 'KFundTransactionsDev';
		},
		getLOVListName: function() {
			return 'ListOfValuesDev';
		},
		getMEDCSCheckingAccount: function() {
			return 'MEDCS Checking';
		},
		getEvacuationsTemplate: function() {
			return this.getSiteRoot() + "/" + this.appAssetsDirectory() + "/WordTemplates/template_change.docx";
		}
	}
}])
