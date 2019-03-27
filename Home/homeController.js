angular.module('HomeController',['ngResource','ui.router','LocalStorageModule','ngAnimate','angular-notification-icons','toastr','angular-spinkit','LOVModule'])
.controller('HomeController',['$q','$rootScope','$scope','$http','$state','Transactions','Evacuations','toastr','Alerts','UtilityService','ConfigService','BusinessObjectsFactory','LOVService',function($q,$rootScope,$scope,$http,$state,Transactions,Evacuations,toastr,Alerts,UtilityService,ConfigService,BusinessObjectsFactory,LOVService) {
			
		$scope.Evacuations = Evacuations;
		$scope.Transactions = Transactions.data;
		
		angular.forEach($scope.Transactions , function(item,index) {
		
			item.SortDate = new Date(item.Created)
			$scope.LegacyDataSortDate =  new Date("08/03/2017")
					
			var temp = new Date(item.Created)
			item.Created = temp.toLocaleDateString();
			temp = new Date(item.Date)
			item.Date = temp.toLocaleDateString();
			
			if(item.ItemType == "SOF")
			{
				var tempObjArray = JSON.parse(item.Programs)
				var total = 0
				angular.forEach(tempObjArray  , function(program,index) {
					total = total + program.Amount
				})
				item.Amount = total
			}

		})
		$scope.Transactions = _.sortBy($scope.Transactions, 'SortDate');
		$scope.Transactions = _.chain($scope.Transactions).reverse().value();
		
		$scope.Alerts = Alerts;
		//$scope.Documents = Documents.data;
		$scope.dismissAlert = function(index) {
			var alert = Alerts[index];
			alert.AlertStatus = "Dismissed";
			alert.SaveAlert().then(function(res) {
				$scope.Alerts.splice(index,1);
				
				$scope.NotificationCount = $scope.Alerts.length
			});			
		}
		$scope.Alerts = _.sortBy($scope.Alerts, function(item){ return new Date (item.Date) });
		$scope.Alerts = _.chain($scope.Alerts).reverse().value()
		
		if($scope.Alerts.length > 10)
		{
			$scope.Alerts = _.first($scope.Alerts, [10]) 
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
		
		$scope.NotificationCount = $scope.Alerts.length
		
		var transactionsArray = Transactions.data;

		$scope.GoToObligation = function(ObligationID){
			$state.go('ViewObligation',{id: ObligationID },{reload: true});
		}
		$scope.GoToDeposit = function(DepositID){
			$state.go('ViewDeposit',{id: DepositID},{reload: true});
		}
		$scope.GoToPayment = function(PaymentID){
			$state.go('ViewPayment',{id: PaymentID},{reload: true});
		}
		$scope.GoToPaymentReturn = function(PaymentReturnID){
			$state.go('ViewPaymentReturn',{id: PaymentReturnID},{reload: true});
		}
		$scope.GoToAllotment = function(AllotmentID){
			$state.go('ViewAllotment',{id: AllotmentID},{reload: true});
		}
		$scope.GoToDeposit = function(DepositID){
			$state.go('EditDeposit', {id: DepositID},{reload: true});
		}
		$scope.GoToEvacuation = function(EvacId){
			$state.go('ViewEvacuation',{id: EvacId},{reload: true});
		}
		$scope.GoToAdjustment = function(id) {
			$state.go('ViewAdjustment',{id: id},{reload: true});
		}
		$scope.GoToPaymentReturn = function(id) {
			$state.go('ViewPaymentReturn',{id: id},{reload: true});
		}
		$scope.GoToGFMS = function(id){
			$state.go('ViewGFMS',{id: id },{reload: true});
		}
		
	    $scope.GenerateDocument = function(){	
			var e = new BusinessObjectsFactory.Evacuation();
			e.GetEvacuationsReport().then(function(Evacuations) {
				var images = [];
				LOVService.getCountries().then(function(countries) {
					var images = []
					var imageCounter = 0;
					var ActiveEvacuations = _.filter(Evacuations, function(item) { return item.Status != 'Ended'});
					var TerminatedEvacuations = _.where(Evacuations, {Status: "Ended"});
					Evacuations = ActiveEvacuations.concat(TerminatedEvacuations);
					for (es=0;es<Evacuations.length;es++) {
						try {
							var e = Evacuations[es];
							var country = e.Countries;
							var url = "";
							var cnt = 0;
							var found = false;
							while (cnt < countries.length && !found) {
								if (countries[cnt].ValueOfItem == country) {
									url = countries[cnt].NotesOnItem;
									found = true;
								}
								cnt++;
							}
							var id = "rId" + (es + 3 + 1).toString();
							var fileName = "";
							images.push({ "country": country, "url": url, "id": id, "fileName": fileName });
						} catch (er) { console.log(er); }
					};
					var ReportObject = {}    	
					
					var Evacs = []
					angular.forEach(ActiveEvacuations , function(Evacuation , index) {
						Evacs.push(Evacuation.GetReportObject(Evacuation))
					})
					var TerminatedEvacs = []  
					angular.forEach(TerminatedEvacuations , function(Evacuation , index) {
						TerminatedEvacs.push(Evacuation.GetReportObject(Evacuation))
					})
				
					ReportObject.Evacs = Evacs
					ReportObject.TerminatedEvacs = TerminatedEvacs 
					if(ReportObject.TerminatedEvacs.length > 0){ReportObject.TerminatedEvacLabel = true}
					
					var ed  = new Date()
					ReportObject.EffectiveDate = ed.toLocaleDateString()
					JSZipUtils.getBinaryContent(ConfigService.getEvacuationsTemplate(), function(err, content) {
						var zip = new JSZip(content);
						var doc=new Docxtemplater().loadZip(zip)
						doc.setData(ReportObject); //set the templateVariables
						doc.render() //apply them
						var output=doc.getZip().generate({type:"blob"}) //Output the document using Data-URI
						JSZip3.loadAsync(output).then(function(zipFile) {
							var getImage = function(url,fileName,zipFile) {
								JSZipUtils.getBinaryContent(url,function(err,data) {
									zipFile.file("word/media/" + fileName,data,{binary:true});
									imageCounter++;
									if (imageCounter == images.length) {
										zipFile.file("word/document.xml").async("binarystring").then(function(xmlString) {
											var xmlDoc = $.parseXML(xmlString);
											//var rels = $(xmlDoc).find("tc:contains('[FLAG]')");
											var rels = $(xmlDoc).find("w\\:tc:contains('[FLAG]')");
											for (r=0;r<rels.length;r++) {
												rels[r].innerHTML = "<w:tcPr><w:tcW w:w=\"1772\" w:type=\"dxa\"/><w:tcBorders><w:top w:val=\"single\" w:sz=\"4\" w:space=\"0\" w:color=\"000000\"/><w:left w:val=\"single\" w:sz=\"4\" w:space=\"0\" w:color=\"000000\"/><w:bottom w:val=\"single\" w:sz=\"4\" w:space=\"0\" w:color=\"000000\"/><w:right w:val=\"single\" w:sz=\"4\" w:space=\"0\" w:color=\"000000\"/></w:tcBorders><w:shd w:val=\"clear\" w:color=\"auto\" w:fill=\"DBE5F1\"/><w:vAlign w:val=\"bottom\"/></w:tcPr><w:p><w:pPr><w:shd w:val=\"clear\" w:color=\"auto\" w:fill=\"auto\"/><w:jc w:val=\"center\"/></w:pPr><w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT=\"0\" distB=\"0\" distL=\"0\" distR=\"0\"><wp:extent cx=\"457143\" cy=\"457143\"/><wp:effectExtent l=\"0\" t=\"0\" r=\"635\" b=\"635\"/><wp:docPr id=\"1\" name=\"Picture 1\"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" noChangeAspect=\"1\"/></wp:cNvGraphicFramePr><a:graphic xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\"><a:graphicData uri=\"http://schemas.openxmlformats.org/drawingml/2006/picture\"><pic:pic xmlns:pic=\"http://schemas.openxmlformats.org/drawingml/2006/picture\"><pic:nvPicPr><pic:cNvPr id=\"1\" name=\"" + images[r].fileName + "\"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed=\"" + images[r].id + "\"><a:extLst><a:ext uri=\"{28A0092B-C50C-407E-A947-70E740481C1C}\"><a14:useLocalDpi xmlns:a14=\"http://schemas.microsoft.com/office/drawing/2010/main\" val=\"0\"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x=\"0\" y=\"0\"/><a:ext cx=\"457143\" cy=\"457143\"/></a:xfrm><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>";
											}
											var str = new XMLSerializer().serializeToString(xmlDoc)
											zipFile.file("word/document.xml", str);
											zipFile.generateAsync({ type: 'blob' }).then(function(data) {
												saveAs(data, "EvacStatusReport.docx"); 
											});
										})
									}
								});
							}
							zipFile.file("word/_rels/document.xml.rels").async("binarystring").then(function(xmlString) {
								var rels = $(xmlString).find("Relationship");
								for (r=0;r<images.length;r++) {
									images[r].id = "rId" + (rels.length + r + 1).toString();
									var fileName = "image" + (5 + r).toString() + ".png";
									images[r].fileName = fileName;
									var url = images[r].url;
									var outElement = "<Relationship Id=\"" + images[r].id + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image\" Target=\"media/" + images[r].fileName + "\"/>";
									xmlString = xmlString.substr(0,xmlString.indexOf("</Relationships>")) + outElement + "</Relationships>";
									getImage(images[r].url,images[r].fileName,zipFile);
								}
								zipFile.file("word/_rels/document.xml.rels", xmlString);
							})
						})
					})
				})
			})
	    }

		/* This function can be used to sync the reference ID's in the OBligations field
		when the data has been migrated from one list to anothjer and the IDs ahve changed.
		Assign SyncIds as the ng-click property of a button on the page to execute it */

		
		$scope.SyncIDs = function() {
			var retVal = $q.defer();
			var promisesArray = [];
			retVal.promise = UtilityService.getItems("?$top=10000",ConfigService.getTransactionListName()).then(function(res) {
				var data = res.data;
				for (i = 0; i < data.length; i++) {
					if (i == 105) {
						console.log("105");
					}
					console.log("Obs: " + data[i].Obligations);
					console.log("Obs: " + JSON.parse(data[i].Obligations));
					if (!data[i].Obligations) {
						//Set to an empty array
						data[i].Obligations = [];
						var item = {};
						item.__metadata = {};
						item.ID = data[i].ID;
						item.Id = data[i].ID;
						item.Obligations = "[]";
						UtilityService.updateItem(item,ConfigService.getTransactionListName()).then(function(res) {
							console.log("ItemID " + item.ID + " updated obligations to empty array.");
						}, function(err) {
							console.log("ItemID " + item.ID + " failed to update obligations to empty array.");
						});
					} else if (JSON.parse(data[i].Obligations).length > 0) {
						//Loop through the obligations, find the ID's and Update the ListItem
						console.log("Fixing ItemID " + data[i].ID + "'s Obligations ID's.");
						var thisItem = data[i];
						var obligations = JSON.parse(thisItem.Obligations);
						var obsPromises = [];
						obsPromises.push(UtilityService.getItem(thisItem.Id,"",ConfigService.getTransactionListName()));
						for (o=0;o<obligations.length;o++) {
							var obligationNumber = obligations[o].ObligationNumber;
							obsPromises.push(UtilityService.getItems("?$filter=ObligationNumber eq '" + obligationNumber + "'", ConfigService.getTransactionListName()));
						}
						$q.all(obsPromises).then(function(res) {
							var initialItem = res[0].data;
							var obligations = JSON.parse(initialItem.Obligations);
							for (r=1;r<res.length;r++) {
								var newID = res[r].data[0].ID;
								var oNumber = res[r].data[0].ObligationNumber;
								for (cnt=0;cnt<obligations.length;cnt++) {
									if (oNumber == obligations[cnt].ObligationNumber) {
										console.log("Updating obligation ID from " + obligations[cnt].ID + " to " + newID + ".");
										obligations[cnt].Id = newID;
									}
								}
							}
							var rBody = {};
							rBody.__metadata = {};
							rBody.ID = initialItem.ID;
							rBody.Id = initialItem.ID;
							rBody.Obligations = JSON.stringify(obligations);
							UtilityService.updateItem(rBody,ConfigService.getTransactionListName());
						})
					}
				}
			}, function(err) {
				console.log("oh bother. an error.")
			})
		}
}])