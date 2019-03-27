angular.module('ValidationService',['angularMoment'])
.service('ValidationService',function() {
	return {
		validateDate: function(input) {
			switch (input) {
				case '':
					return false;
					break;
				case undefined:
					return false;
					break;
				case null:
					return false;
					break;
				default:
					try {
						var someDate = moment(input, 'YYYY-MM-DD');
						if (someDate.isValid()) {
							return someDate;
						}
					} catch (e) { return false; }
			}
		},
		validateAfterToday: function(input) {
			var today = new Date();
			if (moment(input) > today) {
				return true;
			} else {
				return false;
			}
		},
		validateNumber: function(input) {
			try {
				if (isNaN(input)) {
					return false;
				}if (input == null || input == undefined || !input){
					return false;
				}else {
					return true;
				}
			} catch (e) { return false; }
		},		
		validateExists: function(input) {
			if (input == null || input == undefined || !input) {
				return false;
			} else {
				return true;
			}
		},
		validateAttachedFiles: function(input) {
			try {
				if (typeof input == 'object' && input.length > 0) {
					return true;
				} else {
					return false;
				}
			} catch (e) { return false; }
		},	
		
		validateLOV: function(input, valueLabel, notesLabel)	{
			var messages = [];
			if (!this.validateExists(input.ValueOfItem)) { messages.push(valueLabel +" is a required field."); }			
			//if (!this.validateExists(input.NotesOnItem)) { messages.push(notesLabel+" is a required field."); }						
			return messages;
		},
		
		validateReimbursement: function(input)	{
			var messages = [];
			if (!this.validateExists(input.AgreementNumber)) { messages.push("Agreement Number is a required field to add to table."); }
			if (!this.validateExists(input.Status)) { messages.push("Status is a required field to add to table."); }
			if (!this.validateExists(input.Program)) { messages.push("Program is a required field to add to table."); }
			if (!this.validateExists(input.Agency)) { messages.push("Agency is a required field to add to table."); }
			if (!this.validateExists(input.Purpose1)) { messages.push("Purpose is a required field to add to table."); }
			if (!this.validateExists(input.Amount)) { messages.push("Amount is a required field to add to table."); }
			if (!this.validateExists(input.CollectedAmount)) { messages.push("CollectedAmount is a required field to add to table."); }
			if (!this.validateDate(input.ItemDate)) { messages.push("Date is a required field to add to table."); }			
							
			return messages;
		},
		validateEvacuation: function(input){
			
			var messages = [];
			
			if (!this.validateExists(input.Reason)) { messages.push("Please Select a Evacuation Reason"); }
			if (!this.validateExists(input.Countries)) { messages.push("Please Select a Country."); }
			if (!this.validateExists(input.Posts)) { messages.push("Please Select a Post."); }
			if (!this.validateExists(input.Safehaven)) { messages.push("Please Enter a Official Safehaven."); }
			
			return messages;		
		},
		
		validateExtension: function(input, extensionStatus){
			
			var messages = [];
			if(extensionStatus != "Terminate")
			{
				if (!this.validateExists(input.Evacuees )){ messages.push("Please Add Evacuees."); }
				if (this.validateExists(input.Evacuees )){ 				
					if(input.Evacuees .length == 0){messages.push("Please Add Evacuees."); }
				}	
				if (!this.validateExists(input.EvacuationType)){ messages.push("Please Select Evacuation Type."); }			
			}
			
			//if (!this.validateExists(input.Cables)){ messages.push("Please Add Cables."); }
			// if (this.validateExists(input.Cables)){ 				
			// 	if(input.Cables.length == 0){messages.push("Please Add Cables."); }
			// }
			
			return messages;			
		},

		
		validateObligation: function(input)	{
			var messages = [];
			if (!this.validateExists(input.ObligationNumber)) { messages.push("Obligation Number is a required field."); }
			if(input.OperatingAllowance == "2003")
			{
				if (!this.validateExists(input.PostCode)) { messages.push("Post Code is a required field when 2003 selected."); }
			}
			if (!this.validateExists(input.OperatingAllowance)) { messages.push("Operating Allowance is a required field."); }
			if (!this.validateDate(input.ItemDate)) { messages.push("Date is a required field."); }
			if (!this.validateExists(input.ObligationAmount)) { messages.push("Amount is a required field."); }			
			if (!this.validateExists(input.ObligationDescription)) { messages.push("Description is a required field."); }
			if (!this.validateExists(input.Appropriation)) { messages.push("Appropriation is a required field."); }						
			return messages;
		},
		
		validateDeobligation: function(input)	{
			var messages = [];
			if (input.LiquidatedAmount != 0) {
				if (this.validateExists(input.LiquidatedAmount))
				{
					if ( Number(input.NewAmount) < Number(input.LiquidatedAmount)) { messages.push("New amount must be greater than liquidated amount."); }
				}else{
					messages.push("New amount must be greater than liquidated amount."); 
				}				
			}
				
			return messages;
		},
		
		
		validateAllotment: function(input)	{
			var messages = [];
			if (!this.validateExists(input.AllotmentAuthority)) { messages.push("Obligation Number is a required field."); }
			if (!this.validateExists(input.Appropriation)) { messages.push("Appropriation is a required field."); }		
			if (!this.validateExists(input.NY)) { messages.push("NY is a required field."); }	
			if (!this.validateNumber(input.ChangeNUmber)) { messages.push("Change Number is a required field."); }	
			if (!this.validateDate(input.ItemDate)) { messages.push("Date is a required field."); }		
			if (input.ProgramsSelectedArray.length < 1 ) { messages.push("Program is a required field."); }	
			
			if(this.validateExists(input.AddedTableOfFunds))
			{
				if(input.AddedTableOfFunds.length>=1)
				{
					for (i = 0; i < input.AddedTableOfFunds.length; i++)
					{
						
						if (!this.validateExists(input.AddedTableOfFunds[i].directPrevious)) { messages.push("Direct Previous is a required element for "+ input.AddedTableOfFunds[i].Program +"." ); }
						if (!this.validateExists(input.AddedTableOfFunds[i].directModification)) { messages.push("Direct Modification is a required element for "+ input.AddedTableOfFunds[i].Program +"." ); }
						if (!this.validateExists(input.AddedTableOfFunds[i].directTotal )) { messages.push("Direct Total is a required element for "+ input.AddedTableOfFunds[i].Program +"." ); }
						if (!this.validateExists(input.AddedTableOfFunds[i].reimbursablePrevious )) { messages.push("Reimbursable Previous is a required element for "+ input.AddedTableOfFunds[i].Program +"." ); }
						if (!this.validateExists(input.AddedTableOfFunds[i].reimbursableModification )) { messages.push("Reimbursable Modification is a required element for "+ input.AddedTableOfFunds[i].Program +"." ); }
						if (!this.validateExists(input.AddedTableOfFunds[i].reimbursableTotal )) { messages.push("Reimbursable Total is a required element for "+ input.AddedTableOfFunds[i].Program +"." ); }																					
						
					}
				}
				else
				{
					messages.push("Must Add items to the table");
				}

			}
			else
			{
				messages.push("Must Add items to the table");
			}

			
			
			return messages;
		},
		
		
		validatePayment: function(input){
			var messages = [];
			switch(input.PaymentType)	
			{
				case "Check":
					if (!this.validateExists(input.CheckNumber)) { messages.push("Check Number is a required field."); }
					if (!this.validateDate(input.ItemDate)) { messages.push("Date is a required field."); }
					if (!this.validateExists(input.ItemAmount)) { messages.push("Amount is a required field."); }
					if (!this.validateExists(input.Payee)) 
					{
						messages.push("Payee is a required field."); 
					}
					if (this.validateExists(input.Payee))
					{
						if(input.Payee == "Other")
						{
							if (!this.validateExists(input.PayeeOther)) { messages.push("Must enter other payee when 'Other' is selected"); }
						}
					}
					
					
					if (!this.validateExists(input.Purpose1)) { messages.push("Purpose is a required field."); }
					if (!this.validateExists(input.Appropriation)) { messages.push("Appropriation is a required field."); }
					if (!this.validateExists(input.OperatingAllowance)) { messages.push("Operating Allowance is a required field."); }
					if(input.BureauAllotment)
					{
						if (!this.validateExists(input.BureauSelected)) { messages.push("Bureau is a required field when Bureau Allotment is checked."); }
					}
				break;
				case "EFT":
					if (!this.validateDate(input.ItemDate)) { messages.push("Date is a required field."); }
					if (!this.validateExists(input.ItemAmount)) { messages.push("Amount is a required field."); }
					if (!this.validateExists(input.Payee)) { messages.push("Payee is a required field."); }
					if (!this.validateExists(input.Purpose1)) { messages.push("Purpose is a required field."); }
					if (!this.validateExists(input.Appropriation)) { messages.push("Appropriation is a required field."); }
					if (!this.validateExists(input.OperatingAllowance)) { messages.push("Operating Allowance is a required field."); }
					if(input.BureauAllotment)
					{
						if (!this.validateExists(input.BureauSelected)) { messages.push("Bureau is a required field when Bureau Allotment is checked."); }
					}

				break;
				case "Fund Cite":
					if (!this.validateExists(input.ObligationNumber)) { messages.push("Obligation is a required field."); }
					if (!this.validateExists(input.Purpose1)) { messages.push("Purpose is a required field."); }
					if (!this.validateExists(input.ItemAmount)) { messages.push("Amount is a required field."); }
					if (!this.validateExists(input.Appropriation)) { messages.push("Appropriation is a required field."); }
				break;
				case "SPS Transfer":
					if (!this.validateNumber(input.RequestNumber)) { messages.push("Request Number is a required field."); }
					if (!this.validateExists(input.AccountNumber )) { messages.push("Account Number is a required field."); }
					if (!this.validateDate(input.ItemDate)) { messages.push("Date is a required field."); }
					if (!this.validateExists(input.Appropriation)) { messages.push("Appropriation is a required field."); }
					if (!this.validateExists(input.OperatingAllowance)) { messages.push("Operating Allowance is a required field."); }
					if (!this.validateExists(input.ObligationsSelected)) { messages.push("Must select a obligation"); }
					if (this.validateExists(input.ObligationsSelected))
					{
				    	for(i = 0; i < input.ObligationsSelected.length; i++)
				    	{	    		
			    			
			    			if (!this.validateExists(input.ObligationsSelected[i].Amount)) { messages.push("Amount is a required field for the following Operating Allowance(s):\n" + input.ObligationsSelected[i].ObligationNumber +"."); }   			
				    	}
					}
				break;
			}
			return messages;
		}
				
	}
})