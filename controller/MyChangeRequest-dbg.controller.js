sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	// "ugiaiwui/mdg/aiw/request/util/common",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
	// "ugiaiwui/mdg/aiw/request/util/Common",
	"ugiaiwui/mdg/aiw/request/util/CRPersoService",
	"sap/m/TablePersoController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, ValueHelpRequest, CRPersoService, TablePersoController, Filter,
	FilterOperator) { //common, Common
	"use strict";

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.MyChangeRequest", {

		formatter: formatter,

		onInit: function () {
			var id = sap.ushell.Container.getService("UserInfo").getId();
			var fullName = sap.ushell.Container.getService("UserInfo").getUser().getLastName();
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			this._oRouter = this._oComponent.getRouter();

			var mainView = new JSONModel({
				name: id,
				fullName: fullName
			});
			this.getView().setModel(mainView, "mainView");
			this._oTPC = new TablePersoController({
				table: this.getView().byId("myCRTab"),
				//specify the first part of persistence ids e.g. 'ugiaiwui--mdg-aiw-request-myCRTab-dimensionsCol'
				componentName: "ugiaiwui-mdg-aiw-request",
				persoService: CRPersoService
			}).activate();
			// var serviceUrl = this._oComponent.getModel().sServiceUrl;
			// var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// var vhServiceUrl = this._oComponent.getModel("ApprovalModel").sServiceUrl;
			// var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(oModel);
			// this.getView().setModel(vhModel, "approveModel");
			
			var oModel = this._oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(oModel);
			
			var vhModel = this._oComponent.getModel("NewModel");
			this.getView().setModel(vhModel, "valueHelp");
			
			var vhModel2 = this._oComponent.getModel("NewModel2");
			this.getView().setModel(vhModel2, "valueHelp2");
			
			var ApprovalModel = this._oComponent.getModel("ApprovalModel");
			this.getView().setModel(ApprovalModel, "approveModel");
			
			var g = this;
			// this.getView().addEventDelegate({
			// 	onAfterShow: jQuery.proxy(function() {
			// this.getView().byId("myCRTab").setBusy(true);
			// jQuery.sap.delayedCall(35, this, function() {
			// 	g.getView().byId("myCRTab").setBusy(true);
			// 	g.readChangeRequestCollection();
			// });
			// }, this)
			// });

		},

		onAfterRendering: function () {
			var g = this;
			jQuery.sap.delayedCall(5, this, function () {
				g.getView().byId("myCRTab").setBusy(true);
				g.readChangeRequestCollection();
			});
		},

		onExit: function () {

			this._oTPC.destroyPersoService();
			this._oTPC.destroy();
		},

		onRefreshPress: function () {
			this.getView().byId("myCRTab").getBinding("items").refresh();
			this.getView().byId("myCRTab").getModel().refresh();
			jQuery.sap.delayedCall(0, this, function () {
				this.getView().byId("myCRTab").setBusy(true);
				this.readChangeRequestCollection();
			});
		},

		readChangeRequestCollection: function () {
			var oModel = this.getView().getModel("approveModel");
			var url = "/ChangeRequestSet";
			var oTable = this.getView().byId("myCRTab");
			var oFilters = [
				this.getInitialFilter(),
				this.getSearchFilters()
			];
			var fnSuccess = function (r) {
				if (r.results.length > 0) {
					var m = new JSONModel();
					m.setData(r.results);
					oTable.setModel(m);
					oTable.setBusy(false);
					this._oComponent.setModel(m, "crCollection");
				} else {
					oTable.setBusy(false);
				}
			}.bind(this);
			var fnError = function (err) {
				var error = [];
				if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror.errordetails
					.length === 0) {
					error[0] = JSON.parse(err.responseText).error.message.value;
				} else {
					for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
						error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
					}
				}
				var value = error.join("\n");
				sap.m.MessageToast.show(value, {

				});
				oTable.setBusy(false);
			};

			this._readData(url, oModel, fnSuccess, fnError, oFilters, {});
		},

		onSearch: function (oEvent) {
			var v = oEvent.getParameter("query");
			v = v.replace(/^[ ]+|[ ]+$/g, '');
			v = v.toUpperCase();
			var h = this.getView().byId("myCRTab").getItems();
			var count = 0;
			for (var i = 0; i < h.length; i++) {
				if (v.length > 0) {
					var s = h[i].getBindingContext().getProperty("ChangeRequestId");
					var j = h[i].getBindingContext().getProperty("CrDescription");
					var z = h[i].getBindingContext().getProperty("CreatedBy");
					if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1 && z.toUpperCase().indexOf(v) === -1) {
						h[i].setVisible(false);
					} else {
						h[i].setVisible(true);
						count = count + 1;
					}
				} else {
					h[i].setVisible(true);
					count = h.length;
				}
			}
			var sTitle = this.getResourceBundle().getText("changeRequests", [count]);
			this.getView().byId("tableHeader").setText(sTitle);
		},

		// onSearch: function(oEvent) {
		// 	var v = oEvent.getParameter("query");
		// 	v = v.replace(/^[ ]+|[ ]+$/g, '');
		// 	var h = this.getView().byId("myCRTab").getItems();
		// 	for (var i = 0; i < h.length; i++) {
		// 		if (v.length > 0) {
		// 			var s = h[i].getBindingContext().getProperty("ChangeRequestId");
		// 			var j = h[i].getBindingContext().getProperty("CrDescription");
		// 			var z = h[i].getBindingContext().getProperty("CreatedBy");

		// 			if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1 && z.toUpperCase().indexOf(v) === -1) {
		// 				h[i].setVisible(false);
		// 			} else {
		// 				h[i].setVisible(true);
		// 			}
		// 		} else {
		// 			h[i].setVisible(true);
		// 		}
		// 	}
		// },

		getInitialFilter: function () {
			return new Filter("Count", FilterOperator.EQ, "");
		},

		getSearchFilters: function () {
			return new sap.ui.model.Filter({
				filters: [
					new Filter("OTC", FilterOperator.EQ, '183'),
					new Filter("OTC", FilterOperator.EQ, '237'),
					new Filter("OTC", FilterOperator.EQ, '185'),
					new Filter("OTC", FilterOperator.EQ, '1230'),
					new Filter("OTC", FilterOperator.EQ, '1223'),
					new Filter("OTC", FilterOperator.EQ, '493'),
					new Filter("OTC", FilterOperator.EQ, '/UGI/TLFL'),
					new Filter("OTC", FilterOperator.EQ, '/UGI/TLEQ'),
					new Filter("OTC", FilterOperator.EQ, '/UGI/TL'),
					new Filter("OTC", FilterOperator.EQ, 'DRF_0038'),
					new Filter("OTC", FilterOperator.EQ, 'DRF_0039'),
					new Filter("OTC", FilterOperator.EQ, '1345'),
					new Filter("OTC", FilterOperator.EQ, 'DRF_0013'),
					new Filter("OTC", FilterOperator.EQ, '/UGI/WBSBM')
				],
				and: false
			});
		},

		onPersoButtonPressed: function (oEvent) {
			this._oTPC.openDialog();
		},

		onTablePersoRefresh: function () {
			CRPersoService.resetPersData();
			this._oTPC.refresh();
		},

		onCRUpdateFinished: function (oEvent) {

			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("changeRequests", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("changeRequests");
			}
			this.getView().byId("tableHeader").setText(sTitle);

		},

		onItemPress: function (oEvent) {
			this.showRequestDetail(oEvent.getSource());
		},

		showRequestDetail: function (oItem) {
			var sPath = oItem.getBindingContext().sPath;
			var index = parseInt(sPath.substr(1));
			var results = this.getView().byId("myCRTab").getModel().getData();
			var onFirstLoadFlag = true;
			sap.ui.getCore().setModel({
				FirstLoadFlag: onFirstLoadFlag
			}, "onFirstLoadFlag");

			this._oRouter.navTo("mainDetail", {
				cReqNo: results[index].ChangeRequestId,
				itemPath: encodeURIComponent(sPath),
				crType: results[index].ChangeRequestType,
				crDesc: encodeURIComponent(results[index].CrDescription),
				Action: results[index].Action,
				// MainEntity: results[index].MainEntity,
				Model: results[index].Model

			});
		}
	});
});