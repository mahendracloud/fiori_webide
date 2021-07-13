sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";

		// Very simple page-context personalization
		// persistence service, not for productive use!
		var DemoPersoService = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idChangeRequestCol",
						order: 0,
						text: "Change Request",
						visible: true
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idDescriptionCol",
						order: 2,
						text: "Description",
						visible: true
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idStatusCol",
						order: 3,
						text: "Status",
						visible: true
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idChangedOnCol",
						order: 4,
						text: "Changed On",
						visible: true
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idChangedByCol",
						order: 5,
						text: "Changed By",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idDraftCol",
						order: 6,
						text: "Draft",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idPreviousCol",
						order: 7,
						text: "Previous",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idFollowupColl",
						order: 8,
						text: "Follow-Up",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idEditionCol",
						order: 9,
						text: "Edition",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idCreatedAtCol",
						order: 10,
						text: "Created At",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idCreatedOnCol",
						order: 11,
						text: "Created On",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idCreatedByCol",
						order: 12,
						text: "Created By",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idFinalizedAtCol",
						order: 13,
						text: "Finalized At",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idFinalizedOnCol",
						order: 14,
						text: "Finalized On",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idFinalizedByCol",
						order: 15,
						text: "Finalized By",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idDescEditionCol",
						order: 16,
						text: "Description of Edition",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idDueDateCol",
						order: 17,
						text: "Due Date",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idPriorityCol",
						order: 18,
						text: "Priority",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idReasonCol",
						order: 19,
						text: "Reason",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-draftRequests-idRejectReasonCol",
						order: 20,
						text: "Reason for Rejection",
						visible: false
					}

				]
			},

			getPersData: function () {
				var oDeferred = new jQuery.Deferred();
				if (!this._oBundle) {
					this._oBundle = this.oData;
				}
				var oBundle = this._oBundle;
				oDeferred.resolve(oBundle);
				return oDeferred.promise();
			},

			setPersData: function (oBundle) {
				var oDeferred = new jQuery.Deferred();
				this._oBundle = oBundle;
				oDeferred.resolve();
				return oDeferred.promise();
			},

			resetPersData: function () {
				var oDeferred = new jQuery.Deferred();
				var oInitialData = {
					_persoSchemaVersion: "1.0",
					aColumns: [{
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idChangeRequestCol",
							order: 0,
							text: "Change Request",
							visible: true
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idDescriptionCol",
							order: 2,
							text: "Description",
							visible: true
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idStatusCol",
							order: 3,
							text: "Status",
							visible: true
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idChangedOnCol",
							order: 4,
							text: "Changed On",
							visible: true
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idChangedByCol",
							order: 5,
							text: "Changed By",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idDraftCol",
							order: 6,
							text: "Draft",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idPreviousCol",
							order: 7,
							text: "Previous",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idFollowupColl",
							order: 8,
							text: "Follow-Up",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idEditionCol",
							order: 9,
							text: "Edition",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idCreatedAtCol",
							order: 10,
							text: "Created At",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idCreatedOnCol",
							order: 11,
							text: "Created On",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idCreatedByCol",
							order: 12,
							text: "Created By",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idFinalizedAtCol",
							order: 13,
							text: "Finalized At",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idFinalizedOnCol",
							order: 14,
							text: "Finalized On",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idFinalizedByCol",
							order: 15,
							text: "Finalized By",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idDescEditionCol",
							order: 16,
							text: "Description of Edition",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idDueDateCol",
							order: 17,
							text: "Due Date",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idPriorityCol",
							order: 18,
							text: "Priority",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idReasonCol",
							order: 19,
							text: "Reason",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-draftRequests-idRejectReasonCol",
							order: 20,
							text: "Reason for Rejection",
							visible: false
						}

					]
				};

				//set personalization
				this._oBundle = oInitialData;

				//reset personalization, i.e. display table as defined
				//		this._oBundle = null;

				oDeferred.resolve();
				return oDeferred.promise();
			},

			//this caption callback will modify the TablePersoDialog' entry for the 'Weight' column
			//to 'Weight (Important!)', but will leave all other column names as they are.
			getCaption: function (oColumn) {
				if (oColumn.getHeader() && oColumn.getHeader().getText) {
					if (oColumn.getHeader().getText() === "Weight") {
						return "Weight (Important!)";
					}
				}
				return null;
			},

			getGroup: function (oColumn) {
				if (oColumn.getId().indexOf('productCol') != -1 ||
					oColumn.getId().indexOf('supplierCol') != -1) {
					return "Primary Group";
				}
				return "Secondary Group";
			}
		};

		return DemoPersoService;

	}, /* bExport= */ true);