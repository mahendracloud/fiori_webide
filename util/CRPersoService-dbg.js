sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";

		// Very simple page-context personalization
		// persistence service, not for productive use!
		var DemoPersoService = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
						id: "ugiaiwui-mdg-aiw-request-myCRTab-changeRequestCol",
						order: 0,
						text: "Change Request",
						visible: true
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-statusCol",
						order: 2,
						text: "Status",
						visible: true
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-changedOnCol",
						order: 3,
						text: "Changed On",
						visible: true
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-changedByCol",
						order: 4,
						text: "Changed By",
						visible: true
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-draftCol",
						order: 5,
						text: "Draft",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-editionCol",
						order: 6,
						text: "Edition",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-changedAtCol",
						order: 7,
						text: "Changed At",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-typeCol",
						order: 8,
						text: "Type",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-createdOnCol",
						order: 9,
						text: "Created On",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-createdAtCol",
						order: 10,
						text: "Created At",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-createdByCol",
						order: 11,
						text: "Created By",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-finalizedOnCol",
						order: 12,
						text: "Finalized On",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-finalizedAtCol",
						order: 13,
						text: "Finalized At",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-finalizedByCol",
						order: 14,
						text: "Finalized By",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-descEditionCol",
						order: 15,
						text: "Description of Edition",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-dueDateCol",
						order: 16,
						text: "Due Date",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-priorityCol",
						order: 17,
						text: "Priority",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-reasonCol",
						order: 18,
						text: "Reason",
						visible: false
					}, {
						id: "ugiaiwui-mdg-aiw-request-myCRTab-reasonForRejectionCol",
						order: 19,
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
							id: "ugiaiwui-mdg-aiw-request-myCRTab-changeRequestCol",
							order: 0,
							text: "Change Request",
							visible: true
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-statusCol",
							order: 2,
							text: "Status",
							visible: true
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-changedOnCol",
							order: 3,
							text: "Changed On",
							visible: true
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-changedByCol",
							order: 4,
							text: "Changed By",
							visible: true
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-draftCol",
							order: 5,
							text: "Draft",
							visible: true
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-editionCol",
							order: 6,
							text: "Edition",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-changedAtCol",
							order: 7,
							text: "Changed At",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-typeCol",
							order: 8,
							text: "Type",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-createdOnCol",
							order: 9,
							text: "Created On",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-createdAtCol",
							order: 10,
							text: "Created At",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-createdByCol",
							order: 11,
							text: "Created By",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-finalizedOnCol",
							order: 12,
							text: "Finalized On",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-finalizedAtCol",
							order: 13,
							text: "Finalized At",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-finalizedByCol",
							order: 14,
							text: "Finalized By",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-descEditionCol",
							order: 15,
							text: "Description of Edition",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-dueDateCol",
							order: 16,
							text: "Due Date",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-priorityCol",
							order: 17,
							text: "Priority",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-reasonCol",
							order: 18,
							text: "Reason",
							visible: false
						}, {
							id: "ugiaiwui-mdg-aiw-request-myCRTab-reasonForRejectionCol",
							order: 19,
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