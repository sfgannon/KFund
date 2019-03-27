# KFund
This application was written entirely in AngularJS version 1.
The data store was a SharePoint 2013 site collection and all data was stored across several lists.
Interesting features include populating a word document template dynamically via javascript, a library written
to simplify usage of the SharePoint 2013 REST API which required a number of headers and considerations for
different field types.
Business logic is, for the most part, stored in BusinessObjectsModule.js
Each section of the applcation is then broken out into its own folder; and all transactions are reported on via a number
of reports in the Reports directory.
Development of this application was done by myself and Josh Smith. Simranpal Singh assisted with testing and
wrote a number of unit tests using Protractor; unfortunately those are not included in this repository.
