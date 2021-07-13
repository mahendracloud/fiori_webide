sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
], function (BaseController, JSONModel, formatter, History, ValueHelpRequest) {
	"use strict";

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.TLSrvPckgeDetail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("tlSrvPckge").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			var oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			// var serviceUrl = oComponent.getModel().sServiceUrl;
			// var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(oModel);

			// var vhServiceUrl = oComponent.getModel("NewModel").sServiceUrl;
			// var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(vhModel, "valueHelp");

			// var vhServiceUrl = oComponent.getModel("NewModel2").sServiceUrl;
			// var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	loadMetadataAsync: true,
			// 	refreshAfterChange: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(oModel);
			// this.getView().setModel(vhModel, "valueHelp2");

			var oModel = oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(oModel);

			var vhModel = oComponent.getModel("NewModel");
			this.getView().setModel(vhModel, "valueHelp");

			var vhModel2 = oComponent.getModel("NewModel2");
			this.getView().setModel(vhModel2, "valueHelp2");
		},

		typeCheck: function (v) {
			if (v) {
				var temp = "";
				if (typeof v === "boolean") {
					return v;
				} else if (typeof v === "string") {

					if (v.indexOf("false") > -1) {
						temp = false;
					} else if (v.indexOf("true") > -1) {
						temp = true;
					} else if (v.indexOf("X") > -1) {
						temp = true;
					} else {
						temp = false;
					}

					return temp;
				}
			} else {
				return false;
			}
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function () {
			this.updateWorkforOperation();
			// window.history.go(-1);
		},

		parseQualification: function (d) {
			if (d === "S" || d === "C" || d === "QP") {
				return true;
			} else {
				return false;
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {

			var tlSrvPckge = new sap.ui.model.json.JSONModel();
			var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel");
			tlSrvPckge.setData(tlDetailModel.getProperty(decodeURIComponent(oEvent.getParameter("arguments").itemPath)));
			this.setModel(tlSrvPckge, "tlSrvPckge");

			var lOperation = tlDetailModel.getData().lOperation;
			var sCounter = this.getModel("tlSrvPckge").getData().Plnal;
			var sOp = this.getModel("tlSrvPckge").getData().Vornr;

			for (var i = 0; i < lOperation.length; i++) {
				if (lOperation[i].Plnal === sCounter && lOperation[i].Vornr === sOp) {
					this.Plant = lOperation[i].Werks;
					this.slopIdc = i;
					break;
				}
			}

			this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
				model: "tlSrvPckge"
			});
		},

		onLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		onActNumVH: function (oEvent) {
			ValueHelpRequest.ActNumVH(oEvent, this);
		},
		onActNumChange: function (oEvent) {
			ValueHelpRequest._ActNumchange(oEvent, this);
		},

		onBUomSPVH: function (oEvent) {
			ValueHelpRequest.UOMVH(oEvent, this);
		},
		onBUomSPChange: function (oEvent) {
			ValueHelpRequest._UOMchange(oEvent, this);
		},

		onQtySPOchange: function (oEvent) {
			ValueHelpRequest.Qtychange(oEvent, this);
		},

		onShrtTxtchange: function (oEvent) {
			ValueHelpRequest.ShrtTxtchange(oEvent, this);
		},

		onCurKeyVH: function (oEvent) {
			var aFilter = [new sap.ui.model.Filter("Werks", "EQ", this.Plant)];
			ValueHelpRequest.CurKeyVH(oEvent, this, aFilter);
		},
		onCurKeyChange: function (oEvent) {
			var aFilter = [new sap.ui.model.Filter("Werks", "EQ", this.Plant)];
			ValueHelpRequest._CurKeychange(oEvent, this, aFilter);
		},

		onUnitOfWorkVH: function (oEvent) {
			ValueHelpRequest.UnitOfWorkVH(oEvent, this);
		},
		onUnitOfWorkChange: function (oEvent) {
			ValueHelpRequest._UnitOfWorkchange(oEvent, this);
		},

		deriveActQty: function (oSource, Iwein, Meins) {
			// /sap/opu/odata/ugiod01/F4_helps_srv/SpackWrkDrvSet?$filter=Meins eq 'Bqm' and Iwein eq 'D' and Srvpos eq '1000081' and IAmount eq '35'
			var g = this;
			var M = this.getView().getModel("valueHelp2");
			var mCurrData = this.getModel("tlSrvPckge").getData();
			// var tlDetailModel = this.getView().getModel("tlDetailModel");
			// var sBindPath = oSource.getBindingInfo("value").binding.getContext().getPath();
			// var oSrvPcg = tlDetailModel.getProperty(sBindPath);
			// var hdData = tlDetailModel.getData();
			if (Iwein) {
				mCurrData.UnitOfWork = Iwein;
			}
			if (Meins) {
				mCurrData.BUomSP = Meins;
			}

			var q = "/SpackWrkDrvSet";
			var aFilter = [new sap.ui.model.Filter("Meins", "EQ", mCurrData.BUomSP),
				new sap.ui.model.Filter("Iwein", "EQ", mCurrData.UnitOfWork),
				new sap.ui.model.Filter("Srvpos", "EQ", mCurrData.ActNum),
				new sap.ui.model.Filter("IAmount", "EQ", mCurrData.Qty)
			];
			M.read(q, {
				filters: aFilter,
				success: function (h) {
					if (h.results.length > 0) {
						var res = h.results[0];
						mCurrData.BUomSP = res.Meins;
						mCurrData.Work = res.OAmount;
						mCurrData.ActNum = res.Srvpos;
						mCurrData.Qty = res.IAmount;
						mCurrData.UnitOfWork = res.Iwein;
						g.getModel("tlSrvPckge").refresh();
					}
				},
				error: function (err) {
					var error = [];
					if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror
						.errordetails
						.length === 0) {
						error[0] = JSON.parse(err.responseText).error.message.value;
					} else {
						for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
							error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
						}
					}
					var value = error.join("\n");
					sap.m.MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function () {}
					});
				}
			});
		},

		updateWorkforOperation: function () {
			var g = this;
			var alOperation = sap.ui.getCore().getModel("tlDetailModel").getData().lOperation;
			var alSrvPckgOvrw = alOperation[this.slopIdc].SrvPckgOvrw;

			var aSpack = [];
			for (var i = 0; i < alSrvPckgOvrw.length; i++) {
				var oSpack = {
					"Meins": alSrvPckgOvrw[i].BUomSP,
					"Iwein": alSrvPckgOvrw[i].UnitOfWork,
					"Srvpos": alSrvPckgOvrw[i].ActNum,
					"OAmount": "",
					"IAmount": alSrvPckgOvrw[i].Work
				};
				aSpack.push(oSpack);
			}

			var oWorkCal = {
				"Work": "",
				"WorkUnit": "",
				"Anzzl": "",
				"Werks": this.Plant,
				"Duration": "",
				"DurationUnit": "",
				"SpackDetails":aSpack
			};
			
			var sPath = "/TLOprWrkDrvSet";
			var oModel = g.getView().getModel("valueHelp2");
			oModel.create(sPath, oWorkCal, {
				success: function(d){
					alOperation[g.slopIdc].Arbei = d.Work.trim();
					alOperation[g.slopIdc].Arbeh = d.WorkUnit;
					alOperation[g.slopIdc].WorkEnable = false;
					sap.ui.getCore().getModel("tlDetailModel").refresh();
					window.history.go(-1);
				},
				error: function(err){
					window.history.go(-1);
				}
			});
		}

	});

});