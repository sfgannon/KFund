angular.module('NewFinPlanModule', ['ngResource','ui.router','ngAnimate','angular-notification-icons','toastr','angular-spinkit','UtilityModule','LOVModule','BusinessObjectsModule'])
.controller('NewFinPlanController',['$scope','$state','$stateParams','BusinessObjectsFactory','FinPlanFactory','LOVs','FiscalYears','Report', function($scope,$state,$stateParams,BusinessObjectsFactory,FinPlanFactory,LOVs,FiscalYears,Report) {
    $scope.FiscalYears = FiscalYears;
    $scope.Appropriations = LOVs.Appropriations;
    $scope.FiscalYear = (!IsNullOrUndefined($stateParams.FiscalYear) && !!$stateParams.FiscalYear)?($stateParams.FiscalYear):(new Date().getFullYear().toString().substr(2,2));
    $scope.Allotments = LOVs.Allotments;
    $scope.OperatingAllowances = LOVs.OperatingAllowances;
    $scope.Go = function() {
        //$scope.Report = FinPlanFactory.CreateFinPlan($scope.FiscalYear, LOVs.OperatingAllowances, LOVs.Allotments, LOVs.Appropriations);
        $state.go('NewFinPlan',{FiscalYear: $scope.FiscalYear});
    }
    $scope.GoToItem = function(id, itemType) {
        switch (itemType) {
            case "Obligation":
                $state.go('ViewObligation', {id: id });
                break;
            case "Payment":
                $state.go('ViewPayment', {id: id });
                break;
            case "Adjustment":
                $state.go('ViewAdjustment', {id: id });
                break;
            case "Deposit":
                $state.go('ViewDeposit', {id: id });
                break;
            case "PaymentReturn":
                $state.go('ViewPaymentReturn', {id: id });
                break;
            default:
                break;
        }
    }
    $scope.Report = Report;
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
.factory('FinPlanFactory',['$q','$http','BusinessObjectsFactory','ConfigService','UtilityService','LOVService',function($q,$http,BusinessObjectsFactory,ConfigService,UtilityService,LOVService) {
    return {
        CreateFinPlan: function(FiscalYear, OperatingAllowances, Allotments, Appropriations) {
            var report = {};
            report.Tabs = [];
            report.FiscalYear = FiscalYear;
            var TotalsTab = new this.Tab();
            TotalsTab.Title = "Totals";
            TotalsTab.Subtitle = "Fiscal Year Totals";
            report.TotalTab = TotalsTab;
            for (ap=0;ap<Appropriations.length;ap++) {
                if (Appropriations[ap].indexOf('0522') > -1) {
                    for (al=0;al<Allotments.length;al++) {
                        if (Allotments[al] == '1007') {
                            for (oa=0;oa<OperatingAllowances.length;oa++) {
                                if (OperatingAllowances[oa].ValueOfItem != '2003') {
                                    if (OperatingAllowances[oa].ValueOfItem == '100710') {
                                        var t = new this.Tab();
                                        t.Appropriation = Appropriations[ap];
                                        t.Allotment = Allotments[al];
                                        t.OperatingAllowance = OperatingAllowances[oa].ValueOfItem;
                                        t.Title = OperatingAllowances[oa].ValueOfItem + " - Publicity";
                                        t.Subtitle = "Rewards Publicity";
                                        report.Tabs.push(t);
                                        
                                        var s = new this.Tab();
                                        s.Appropriation = Appropriations[ap];
                                        s.Allotment = Allotments[al];
                                        s.OperatingAllowance = OperatingAllowances[oa].ValueOfItem;
                                        s.Title = OperatingAllowances[oa].ValueOfItem + " - Payments";
                                        s.Subtitle = "Rewards Payments";
                                        report.Tabs.push(s);
                                    } else {
                                        var t = new this.Tab();
                                        t.Appropriation = Appropriations[ap];
                                        t.Allotment = Allotments[al];
                                        t.OperatingAllowance = OperatingAllowances[oa].ValueOfItem;
                                        t.Title = OperatingAllowances[oa].ValueOfItem;
                                        t.Subtitle = OperatingAllowances[oa].NotesOnItem;
                                        report.Tabs.push(t);
                                    }
                                }
                            }
                        } else if (Allotments[al] == '2003') {
                            //Add a 2003 Tab and a 2003 Breakout Tab
                            var t = new this.Tab();
                            t.Appropriation = Appropriations[ap];
                            t.Allotment = Allotments[al];
                            t.Title = "2003";
                            t.Subtitle = "Unforeseen Emergencies - Evacuations";
                            report.Tabs.push(t);
                            var s = new this.Tab();
                            s.Appropriation = Appropriations[ap].ValueOfItem;
                            s.Allotment = Allotments[al];
                            s.Title = "2003 Breakout";
                            s.Subtitle = "Unforeseen Emergencies - Evacuations";
                            report.Tabs.push(s);
                        }
                    }
                } else {
                    var t = new this.Tab();
                    t.Appropriation = Appropriations[ap];
                    t.Title = Appropriations[ap];
                    t.Subtitle = Appropriations[ap];
                    report.Tabs.push(t);
                }
            }

            var retVal = $q.defer();
            var promises = [];
            var queries = [];

            queries.push(ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + ConfigService.getTransactionListName() + "')/Items?$filter=FiscalYear eq " + FiscalYear + " and ItemType eq 'Obligation'&$top=750");

            queries.push(ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + ConfigService.getTransactionListName() + "')/Items?$filter=" + 
                "((FiscalYear eq " + FiscalYear + " or FiscalYear eq " + (new Number(FiscalYear) + 1).toString() + ") and ItemType eq 'Payment') or " +
                "((FiscalYear eq " + FiscalYear + " or FiscalYear eq " + (new Number(FiscalYear) + 1).toString() + ") and ItemType eq 'PaymentReturn') or " +
                "((FiscalYear eq " + FiscalYear + " or FiscalYear eq " + (new Number(FiscalYear) + 1).toString() + ") and ItemType eq 'Deposit') or " +
                "((FiscalYear eq " + FiscalYear + " or FiscalYear eq " + (new Number(FiscalYear) + 1).toString() + ") and ItemType eq 'Adjustment')&$top=750");

            if (!IsNullOrUndefined(FiscalYear)) {
                queries.push(ConfigService.getSiteRoot() + "_api/web/lists/GetByTitle('" + ConfigService.getTransactionListName() + "')/Items?$filter=ItemType eq 'GFMS' and FiscalYear eq " + FiscalYear);
            }

            for (q=0;q<queries.length;q++) {
                promises.push(this.GetData(queries[q], report));;
            }

            retVal.promise = $q.all(promises).then(function(res) {
                //Reorganize 2003 tab
                var evacTab = _(report.Tabs).chain().filter(function(item) {
                    if (item.Title == '2003') {
                        return item;
                    }
                }).value();
                var breakoutTab = _(report.Tabs).chain().filter(function(item) {
                    if (item.Title == '2003 Breakout') {
                        return item;
                    }
                }).value();
                if ((!IsNullOrUndefined(evacTab) && evacTab.length > 0) && (!IsNullOrUndefined(breakoutTab) && breakoutTab.length > 0)) {
                    evacTab = evacTab[0];
                    breakoutTab = breakoutTab[0];
                    var evacRows = [];
                    var breakoutRows = [];
                    var currentEvacRows = evacTab.Rows;
                    var groupedRows = _.groupBy(currentEvacRows, 'Description')
                    _.each(groupedRows, function(item) {
                        var out = {};
                        out.Date = item[0].Date;
                        out.ObligationNumber = item[0].ObligationNumber;
                        out.Purpose = item[0].Purpose;
                        out.CheckAmount = _(item).chain().pluck('CheckAmount').reduce(function(memo,i) {
                            return memo = parseFloat(memo) + parseFloat(i);
                        }, 0).value();
                        out.Obligations = _(item).chain().pluck('Obligations').reduce(function(memo,i) {
                            return memo = parseFloat(memo) + parseFloat(i);
                        }, 0).value();
                        out.Liquidated = _(item).chain().pluck('Liquidated').reduce(function(memo,i) {
                            return memo = parseFloat(memo) + parseFloat(i);
                        }, 0).value();
                        out.Unliquidated = _(item).chain().pluck('Unliquidated').reduce(function(memo,i) {
                            return memo = parseFloat(memo) + parseFloat(i);
                        }, 0).value();
                        out.TotalObligations = _(item).chain().pluck('TotalObligations').reduce(function(memo,i) {
                            return memo = parseFloat(memo) + parseFloat(i);
                        }, 0).value();
                        out.Description = item[0].Description;
                        evacRows.push(out);

                        var GroupTotalRow = {
                            Date: '',
                            ObligationNumber: '',
                            CheckAmount: 0,
                            Obligations: 0,
                            Liquidated: 0,
                            Unliquidated: 0,
                            TotalObligations: 0,
                            Description: 'Total'
                        };
                        _.each(item,function(i,index) {
                            if (index > 0) {
                                i.Description = "";
                            }
                            breakoutRows.push(i);
                            GroupTotalRow.CheckAmount += parseFloat(i.CheckAmount);
                            GroupTotalRow.Obligations += parseFloat(i.Obligations);
                            GroupTotalRow.Liquidated += parseFloat(i.Liquidated);
                            GroupTotalRow.Unliquidated += parseFloat(i.Unliquidated);
                            GroupTotalRow.TotalObligations += parseFloat(i.TotalObligations);
                        })
                        breakoutRows.push(GroupTotalRow);

                    })
                    breakoutTab.Rows = breakoutRows;
                    evacTab.Rows = evacRows;
                }

                //Fill out Totals Tab
                var totals = report.TotalTab;
                var GFMS;
                if (!IsNullOrUndefined(report.GFMS)) {
                    GFMS = report.GFMS;
                } else {
                    GFMS = [];
                }                
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
                totals.OperatingAllowances = [];
                totals.ObligationAllotmentRows = [];
                totals.ObligationAllotmentTotal = {};
                totals.AllotmentRows = [];
                totals.AllotmentTotalRow = {};
                totals.TotalRow = {
                    CheckAmountsTotal: 0,
                    ObligationsTotal: 0,
                    LiquidatedBalanceTotal: 0,
                    UnliquidatedBalanceTotal: 0,
                    ObligationsTotal: 0
                };
                for (t=0;t<report.Tabs.length;t++) {
                    if (!IsNullOrUndefined(report.Tabs[t].OperatingAllowance) && report.Tabs[t].OperatingAllowance != '') {
                        if (report.Tabs[t].OperatingAllowance != '100710') {
                            var row = {};
                            row.CheckAmount = report.Tabs[t].TotalRow.CheckAmount;
                            row.OperatingAllowance = report.Tabs[t].OperatingAllowance;
                            row.Obligations = report.Tabs[t].TotalRow.Obligations;
                            row.LiquidatedBalance = report.Tabs[t].TotalRow.Liquidated;
                            row.UnliquidatedBalance = report.Tabs[t].TotalRow.Unliquidated;
                            row.Obligation = report.Tabs[t].TotalRow.TotalObligations;
                            row.Purpose = report.Tabs[t].Subtitle;
                            totals.OperatingAllowances.push(row);
                            totals.TotalRow.CheckAmountsTotal += parseFloat(row.CheckAmount);
                            totals.TotalRow.Obligations += parseFloat(row.Obligations);
                            totals.TotalRow.LiquidatedBalanceTotal += parseFloat(row.LiquidatedBalance);
                            totals.TotalRow.UnliquidatedBalanceTotal += parseFloat(row.UnliquidatedBalance);
                            totals.TotalRow.ObligationsTotal += parseFloat(row.Obligation);
                        } else {
                            var row = {};
                            row.CheckAmount = report.Tabs[t].TotalRow.CheckAmount;
                            row.OperatingAllowance = report.Tabs[t].OperatingAllowance;
                            row.Obligations = report.Tabs[t].TotalRow.Obligations;
                            row.LiquidatedBalance = report.Tabs[t].TotalRow.Liquidated;
                            row.UnliquidatedBalance = report.Tabs[t].TotalRow.Unliquidated;
                            row.Obligation = report.Tabs[t].TotalRow.TotalObligations;
                            row.Purpose = report.Tabs[t].Subtitle;
                            totals.OperatingAllowances.push(row);
                            totals.TotalRow.CheckAmountsTotal += parseFloat(row.CheckAmount);
                            totals.TotalRow.Obligations += parseFloat(row.Obligations);
                            totals.TotalRow.LiquidatedBalanceTotal += parseFloat(row.LiquidatedBalance);
                            totals.TotalRow.UnliquidatedBalanceTotal += parseFloat(row.UnliquidatedBalance);
                            totals.TotalRow.ObligationsTotal += parseFloat(row.Obligation);
                        }
                    }
                }
                var totalsOther = report.TotalTab.TotalRow.ObligationsTotal;
                var totalsUnforeseen = _.where(report.Tabs, {Title: '2003'})[0].TotalRow.Obligations;
                totals.ObligationAllotmentRows.push({
                    'Allotment': 'Allot 1007 - Regular',
                    'Amount': report.TotalTab.TotalRow.ObligationsTotal
                });
                totals.ObligationAllotmentRows.push({
                    'Allotment': 'Allot 1007 - Funding W/D for Prior Years',
                    'Amount': fundingwd1007
                });
                totals.ObligationAllotmentRows.push({
                    'Allotment': 'Allot 2003 - Regular',
                    'Amount': totalsUnforeseen
                });
                totals.ObligationAllotmentRows.push({
                    'Allotment': 'Allot 2003 - Funding W/D for Prior Years',
                    'Amount': fundingwd2003
                });
                totals.ObligationAllotmentRows.push({
                    'Allotment': 'Allot 2003 - Funding W/D for Prior Years (in GFMS)',
                    'Amount': 0
                });
                totals.ObligationAllotmentTotal = {
                    'Amount': report.TotalTab.TotalRow.ObligationsTotal + fundingwd1007 + totalsUnforeseen + fundingwd2003,
                    'Allotment': 'TOTAL OBLIGATIONS - EDCS'
                };
                totals.AllotmentRows.push({
                    '1007': report.TotalTab.TotalRow.ObligationsTotal,
                    '2003': totalsUnforeseen,
                    'Total': parseFloat(report.TotalTab.TotalRow.ObligationsTotal) + parseFloat(totalsUnforeseen),
                    'Purpose': 'Regular'
                });
                totals.AllotmentRows.push({
                    '1007': fundingwd1007,
                    '2003': fundingwd2003,
                    'Total': parseFloat(fundingwd1007) + parseFloat(fundingwd2003),
                    'Purpose': 'Funding W/D for Prior Years'
                });
                totals.AllotmentRows.push({
                    '1007': upward1007,
                    '2003': upward2003,
                    'Total': parseFloat(upward1007) + parseFloat(upward2003),
                    'Purpose': 'Upward Spending Adj-Out'
                });
                totals.AllotmentTotalRow = {
                    '1007': parseFloat(report.TotalTab.TotalRow.ObligationsTotal) + parseFloat(fundingwd1007) + parseFloat(upward1007),
                    '2003': parseFloat(totalsUnforeseen) + parseFloat(fundingwd2003) + parseFloat(upward2003),
                    'Total': parseFloat(report.TotalTab.TotalRow.ObligationsTotal) + parseFloat(fundingwd1007) + parseFloat(upward1007) + parseFloat(totalsUnforeseen) + parseFloat(fundingwd2003) + parseFloat(upward2003),
                    'Purpose': 'Total K Fund (from spreadsheets)'
                };
                retVal.resolve(report);
            }, function(e) {
                retVal.reject(e);
            });

            return retVal.promise;
        },
        ProcessData: function(report, data) {
            if (!IsNullOrUndefined(data) && data.length > 0) {
                if (data[0].ItemType == 'GFMS') {
                    report.GFMS = data;
                } else {
                    for (t=0;t<report.Tabs.length;t++) {
                        if (!!report.Tabs[t].OperatingAllowance && !!report.Tabs[t].Allotment) {
                            //Search by operating allowance and allotment
                            if (report.Tabs[t].OperatingAllowance == "100710") {
                                if (report.Tabs[t].Title.indexOf('Publicity') > -1) {
                                    var rows = _.filter(data, function(item) {
                                        return item.OperatingAllowance == report.Tabs[t].OperatingAllowance && item.Allotment == report.Tabs[t].Allotment && item.RewardsPublicity == true && item.Appropriation == report.Tabs[t].Appropriation;
                                    }, this);
                                    report.Tabs[t].FillTab(rows, this, report.FiscalYear);
                                } else {
                                    var rows = _.filter(data, function(item) {
                                        return item.OperatingAllowance == report.Tabs[t].OperatingAllowance && item.Allotment == report.Tabs[t].Allotment && item.RewardsPublicity == false && item.Appropriation == report.Tabs[t].Appropriation;
                                    }, this);
                                    report.Tabs[t].FillTab(rows, this, report.FiscalYear);
                                }
                            } else {
                                var rows = _.filter(data, function(item) {
                                    return item.OperatingAllowance == report.Tabs[t].OperatingAllowance && item.Allotment == report.Tabs[t].Allotment && item.Appropriation == report.Tabs[t].Appropriation;
                                }, this);
                                report.Tabs[t].FillTab(rows, this, report.FiscalYear);
                            }
                        } else if (!!report.Tabs[t].Allotment) {
                            //search by allotment
                            var rows = _.filter(data, function(item) {
                                return item.Allotment == report.Tabs[t].Allotment;
                            }, this);
                            report.Tabs[t].FillTab(rows, this, report.FiscalYear);
                        } else {
                            //Search by appropriation where other fields are blank
                            var rows = _.filter(data, function(item) {
                                return item.Appropriation == report.Tabs[t].Appropriation;
                            }, this);
                            report.Tabs[t].FillTab(rows, this, report.FiscalYear);
                        }
                    }
                }
            }
        },
        GetData: function(queryString, report) {
            var that = this;
            var retVal = $q.defer()
            var out = [];
            retVal.promise = UtilityService.getItemsStreamed(queryString,ConfigService.getTransactionListName()).then(function(res) {
                if (res.__next) {
                    that.ProcessData(report, res.data);
                    return that.GetData(res.__next, report);
                } else {
                    retVal.resolve(that.ProcessData(report, res.data));
                }
            }, function(err) {
                retVal.reject(err);
            });
            return retVal.promise;
        },
        Tab: function() {
            this.Appropriation = "";
            this.Allotment = "";
            this.OperatingAllowance = "";
            this.Title = "";
            this.Subtitle = "";
            this.Rows = [];
            this.TotalRow = {};
            this.TotalRow.Id;
            this.TotalRow.Date = "";
            this.TotalRow.ObligationNumber = "";
            this.TotalRow.Purpose = "";
            this.TotalRow.CheckAmount = 0;
            this.TotalRow.Obligations = 0;
            this.TotalRow.Liquidated = 0;
            this.TotalRow.Unliquidated = 0;
            this.TotalRow.TotalObligations = 0;
            this.TotalRow.Description = "";

            this.FillTab = function(rows,report,fiscalYear) {
                var that = this;
                for (r=0,i=rows.length;r<i;r++) {
                    var t = new report.Transaction(rows[r], that, fiscalYear);
                    if (t.Include) {
                        that.Rows.push(t);
                    }
                }
                that.Rows = _.sortBy(that.Rows, function(item) {
                    return new Date(item.Date);
                });
            }
        },
        Transaction: function(row,Tab,fiscalYear) {
            this.Id;
            this.Include = true;
            this.ItemType = "";
            this.Date = "";
            this.ObligationNumber = "";
            this.Purpose = "";
            this.CheckAmount = 0;
            this.Obligations = 0;
            this.Liquidated = 0;
            this.Unliquidated = 0;
            this.TotalObligations = 0;
            this.Description = "";
            if (row) {
                this.Id = row.Id;
                this.ItemType = row.ItemType;
                var dt = new Date(row.Date);
		        this.Date = (dt.getMonth() + 1).toString() + "/" + dt.getDate().toString() + "/" + dt.getFullYear().toString();
                row.Amount = (!IsNullOrUndefined(row.Amount) && !!row.Amount)?(parseFloat(row.Amount)):(0.00);
                switch (row.ItemType) {
                    case "Obligation":
                        this.ObligationNumber = row.ObligationNumber;
                        this.Purpose = "--";
                        this.Obligations = parseFloat(row.Amount);
                        this.Unliquidated = parseFloat(row.Amount);
                        Tab.TotalRow.Obligations += parseFloat(row.Amount);
                        Tab.TotalRow.Unliquidated += parseFloat(row.Amount);
                        this.TotalObligations = parseFloat(row.Amount);
                        Tab.TotalRow.TotalObligations += parseFloat(row.Amount);
                        this.Description = row.Purpose;
                        break;
                    case "Deposit":
                        if (row.FiscalYear == fiscalYear) {
                            row.Amount = parseFloat(row.Amount) * -1;
                            this.ObligationNumber = "--";
                            this.Purpose = "Deposit";
                            this.CheckAmount = parseFloat(row.Amount);
                            Tab.TotalRow.CheckAmount += parseFloat(row.Amount);
                            this.Description = row.Purpose; 
             	        } else {
                             this.Include = false;
                         }
                        break;
                    case "PaymentReturn":
                        if (row.FiscalYear == fiscalYear) {
                            row.Amount = parseFloat(row.Amount) * -1;
                            this.ObligationNumber = "--";
                            this.Purpose = "Payment Return: " + row.PaymentReturnType;
                            this.CheckAmount = parseFloat(row.Amount);
                            Tab.TotalRow.CheckAmount += parseFloat(row.Amount);
                            this.Description = row.Purpose; 
             	        } else {
                             this.Include = false;
                         }
                        break;
                    case "Adjustment":
                        if (row.FiscalYear == fiscalYear) {
                            this.ObligationNumber = row.Purpose;
                            this.Purpose = "--";
                            this.Obligations = parseFloat(row.Amount);
                            Tab.TotalRow.Obligations += parseFloat(row.Amount);
                            this.Liquidated = parseFloat(row.Amount);
                            Tab.TotalRow.Liquidated += parseFloat(row.Amount);
                            this.TotalObligations = parseFloat(row.Amount);
                            Tab.TotalRow.TotalObligations += parseFloat(row.Amount);
                            this.Description = row.Desc;
             	        } else {
                             this.Include = false;
                         }
                        break;
                    case "Payment":
                        var obligationFound = false;
                        var obligations = (!IsNullOrUndefined(row.Obligations))?(JSON.parse(row.Obligations)):([]);
                        if (obligations.length > 0) {
                            for (o=0,n=obligations.length;o<n;o++) {
                                var obligationRow = _.where(Tab.Rows, { ObligationNumber: obligations[o].ObligationNumber });
                                if (obligationRow.length > 0) {
                                    obligationFound = true;
                                    obligations[o].Amount = (!IsNullOrUndefined(obligations[o].Amount) && !!obligations[o].Amount)?(parseFloat(obligations[o].Amount)):(0.00);
                                    obligationRow[0].Liquidated += parseFloat(obligations[o].Amount);
                                    obligationRow[0].Unliquidated -= parseFloat(obligations[o].Amount);
                                    Tab.TotalRow.Liquidated += parseFloat(obligations[o].Amount);
                                    Tab.TotalRow.Unliquidated -= parseFloat(obligations[o].Amount);
                                }
                            }
                        }
                        if ((row.FiscalYear == fiscalYear) || (obligationFound)) {
                            this.ObligationNumber = "--";
                            this.Description = row.Purpose;
                            switch (row.PaymentType) {
                                case "Check":
                                    this.Purpose = row.CheckNumber;
                                    this.Include = true;
                                    this.CheckAmount = parseFloat(row.Amount);
                                    Tab.TotalRow.CheckAmount += parseFloat(row.Amount);
                                    break;
                                case "Fund Cite":
                                    this.Purpose = "Fund Cite";
                                    this.Include = false;
                                    break;
                                case "EFT":
                                    this.Purpose = "EFT";
                                    this.Include = true;
                                    this.CheckAmount = parseFloat(row.Amount);
                                    Tab.TotalRow.CheckAmount += parseFloat(row.Amount);
                                    break;
                                case "SPS Transfer":
                                    this.Purpose = "SPS Transfer";   
                                    if (!IsNullOrUndefined(row.Account) && ((row.Account.indexOf('MEDCS') > -1) || (row.Account.indexOf('M/EDCS') > -1))) {
                                        row.Amount = parseFloat(row.Amount) * -1;
                                        this.Include = true;
                                        this.CheckAmount = parseFloat(row.Amount)
                                        Tab.TotalRow.CheckAmount += parseFloat(row.Amount);
                                    } else {
                                        this.Include = false;
                                    }      
                                    break;
                                default:

                                    break;
                            }
                        } else {
                            this.Include = false;
                        }
                    default:
                        break;
                }
            }
            return this;
        }
    }
}])