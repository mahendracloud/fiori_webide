/*global location history */
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"ugiaiwui/mdg/aiw/library/js/ClassUtils",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"sap/ui/core/message/Message"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, ClassUtils, ValueHelpProvider, Message) {
	"use strict";

	// var oMessageTemplate = new sap.m.MessageItem({
	// 	type: '{type}',
	// 	title: '{title}'
	// });

	// var oMessagePopover = new sap.m.MessagePopover({
	// 	items: {
	// 		path: '/',
	// 		template: oMessageTemplate
	// 	}
	// });

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.DetailObjectLink", {

		formatter: formatter,
		History: History,
		inputId: null,
		_oCatalog: null,
		_oResourceBundle: null,

		oAttach: [],
		oFileUpload: "",
		aSearchResults: undefined,
		aSelectDialog: undefined,
		nSearchResults: undefined,
		nSelectDialog: undefined,
		mSelectDialog: undefined,
		mSearchResults: undefined,
		stSelectDialog: undefined,
		stSearchResults: undefined,
		stWSearchResults: undefined,
		stWSelectDialog: undefined,
		fSelectDialog: undefined,
		eqSelectDialog: undefined,
		fSearchResults: undefined,
		eqSearchResults: undefined,
		isItemPress: "",
		classType: "",
		_class: "",
		defaultCharArr: [],
		charValueArr: [],
		lArray: [],
		singleVal: "",
		charValue: "",
		cPath: "",
		sPath: "",
		resultArr: [],
		system: false,
		charFlag: "",
		codeFlag: "",
		pSelectDialog: undefined,

		uSelectDialog: undefined,
		stdSelectDialog: undefined,
		prSelectDialog: undefined,
		linkCat: "",
		objCat: "",

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ugiaiwui.mdg.aiw.request.view.Detail
		 */
		onInit: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			// var serviceUrl = this._oComponent.getModel().sServiceUrl;
			// var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// var vhServiceUrl = this._oComponent.getModel("NewModel").sServiceUrl;
			// var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(vhModel, "valueHelp");
			// this.getView().setModel(oModel);

			// var apprServiceUrl = this._oComponent.getModel("ApprovalModel").sServiceUrl;
			// var apprModel = new sap.ui.model.odata.v2.ODataModel(apprServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(apprModel, "ApprModel");

			var oModel = this._oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(oModel);

			var vhModel = this._oComponent.getModel("NewModel");
			this.getView().setModel(vhModel, "valueHelp");

			var vhModel2 = this._oComponent.getModel("NewModel2");
			this.getView().setModel(vhModel2, "valueHelp2");

			var ApprovalModel = this._oComponent.getModel("ApprovalModel");
			this.getView().setModel(ApprovalModel, "ApprModel");

			this.reasSystemStatus();

			var curDate = formatter.currentDate();
			this.getView().byId("validFrm").setValue(curDate);
			var curTime = formatter.getCurrentTime();
			this.getView().byId("validFrmTime").setValue(curTime);
			//13/9 - valid to date and time modified.
			var oDatePicker = new sap.m.DatePicker();
			var endDate = oDatePicker._oMaxDate;
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "MM/dd/yyyy"
			});
			var maxDate = oDateFormat.format(endDate);
			this.getView().byId("validTo").setValue(maxDate); // 13/9 - modified.
			var eh = endDate.getHours();
			var em = endDate.getMinutes();
			var es = endDate.getSeconds();
			this.getView().byId("validToTime").setValue(eh + ":" + em + ":" + es); // 13/9 - modified
			//end

			this.getRouter().getRoute("olDetail").attachPatternMatched(this._onRouteMatched, this);

			var aVisModel = new sap.ui.model.json.JSONModel();
			var aVis = {
				visible: false
			};
			aVisModel.setData(aVis);
			this.getView().setModel(aVisModel, "aVisModel");

			var aEnModel = new sap.ui.model.json.JSONModel();
			var aEnbl = {
				enable: false
			};
			aEnModel.setData(aEnbl);
			this.getView().setModel(aEnModel, "aEnModel");

			this.getClassType(this);

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);
		},

		getClassType: function (g) {
			var m = g.getView().getModel("valueHelp");
			var sObtab = g.getObTab();
			var oFilter2 = new sap.ui.model.Filter("Obtab", "EQ", sObtab);
			var q = "/ClassTypeSet";
			m.read(q, {
				filters: [oFilter2],
				success: function (d) {
					if (d.results.length > 0) {
						g.Classtype = d.results[0].Klart;
						g.Classtypedesc = d.results[0].Artxt;
					} else {
						g.Classtype = "";
						g.Classtypedesc = "";
					}
				},
				error: function () {
					g.Classtype = "";
					g.Classtypedesc = "";
				}
			});
		},

		getObTab: function () {
			var oJsonModel = sap.ui.getCore().getModel("EAMCRModel");
			var sObTab = "";

			sObTab = oJsonModel.getProperty("/6").Obtab;

			return sObTab;
		},

		onAfterRendering: function () {
			if (sap.m.ComboBox.prototype.onAfterRendering) {
				$("#" + this.byId("linkCategory").sId + "-inner").prop("readOnly", true);
				$("#" + this.byId("objectCategory").sId + "-inner").prop("readOnly", true);
			}
			this.attachRequest();
		},

		_onRouteMatched: function (oEvent) {
			this.currentObj = undefined;
			var sPath = decodeURIComponent(oEvent.getParameter("arguments").itemPath);
			this.action = oEvent.getParameter("arguments").action;
			this.mode = oEvent.getParameter("arguments").mode;
			var olDetailModel = new sap.ui.model.json.JSONModel();
			var AIWListOLModel = sap.ui.getCore().getModel("AIWListOLModel");
			this.currentObj = AIWListOLModel.getProperty(sPath);
			/*olDetailModel.setData(this.currentObj);
			this.getView().setModel(olDetailModel, "olDetailModel");
			sap.ui.getCore().setModel(olDetailModel, "olDetailModel");*/

			this.sExistFlag = false;

			var objCatModel = new JSONModel([]);
			var linkCatModel = new JSONModel([]);
			linkCatModel = sap.ui.getCore().getModel("linkCatModel");
			this.getView().setModel(linkCatModel, "linkCatModel");
			objCatModel = sap.ui.getCore().getModel("objCatModel");
			this.getView().setModel(objCatModel, "objCatModel");
			// this.getView().byId("OLHeader").setTitle(this.getView().getModel("i18n").getProperty("olheaderTitle"));

			olDetailModel.setData(this.currentObj);
			this.getView().setModel(olDetailModel, "olDetailModel");
			sap.ui.getCore().setModel(olDetailModel, "olDetailModel");

			this.getView().byId("idBtnCheck").setVisible(true);

			/*this.class = this.getView().byId("assignmentTab");
			this.char = this.getView().byId("characteristicsTab"); */

			var classFragmentId = this.getView().createId("clsFrag");
			this.class = sap.ui.core.Fragment.byId(classFragmentId, "assignmentTab");

			var itemFragmentId = this.getView().createId("charFrag");
			this.char = sap.ui.core.Fragment.byId(itemFragmentId, "characteristicsTab");

			if (this.action === "changeOL") {
				this.link = oEvent.getParameter("arguments").link;
				this.status = oEvent.getParameter("arguments").status;
				var l = encodeURIComponent(this.link);
				this.getView().byId("olDetailPage").setTitle(this.getView().getModel("i18n").getProperty("olCheaderTitle"));

				var oMatchItem;
				if (AIWListOLModel.length > 0) {
					for (var i = 0; i < AIWListOLModel.length; i++) {
						if (AIWListOLModel[i].link === this.link) {

							oMatchItem = i;
							this.sExistFlag = true;
							break;
						}
					}
				}
				if (this.sExistFlag) {
					this.currentObj = oMatchItem;
					olDetailModel.setData(this.currentObj);
				} else {
					this.readLinkData(l);
				}
				if (this.status === "true" || this.lockMsg === true) {
					this.disableFields();
				} else {
					this.enableFields();
				}

				if (sap.ui.getCore().getModel("refreshModel") !== undefined) {
					var refreshModel = sap.ui.getCore().getModel("refreshModel");
					refreshModel.setProperty("/refreshSearch", false);
				}
			} else {
				if (this.currentObj.mode === "create") {
					this.getView().byId("olDetailPage").setTitle(this.getView().getModel("i18n").getProperty("olheaderTitle"));
				} else {
					this.getView().byId("olDetailPage").setTitle(this.getView().getModel("i18n").getProperty("olCheaderTitle"));
				}
			}

			if (this.mode === "display") {
				this.getView().byId("idBtnCheck").setVisible(false);
				var vis = this.getView().getModel("aVisModel").getData();
				vis.visible = true;
				this.getView().getModel("aVisModel").setData(vis);

				this.class.setVisible(false);
				this.char.setVisible(false);
				this.currentObj.linkCatEn = false;
				this.currentObj.objCatEn = false;
				this.currentObj.linkFromEQEn = false;
				this.currentObj.linkToEQEn = false;
				this.currentObj.linkObjEqEn = false;
				this.currentObj.linkFrmFlEn = false;
				this.currentObj.linkToFlEn = false;
				this.currentObj.linkObjFlEn = false;

				var AIWAPPROVE = new JSONModel();
				var pApproveData = sap.ui.getCore().getModel("AIWAPPROVE").getProperty("/AIWListOLModel" + sPath);
				AIWAPPROVE.setData(pApproveData);
				this.getView().setModel(AIWAPPROVE, "AIWAPPROVE");
				// if (this.action === "createOL") {
				// 	if (this.currentObj.Class) {
				// 		var cModel = new sap.ui.model.json.JSONModel();
				// 		cModel.setData(this.currentObj.Class);
				// 		this.class.setModel(cModel);
				// 	}
				// 	if (this.currentObj.Char) {
				// 		var _chModel = new sap.ui.model.json.JSONModel();
				// 		_chModel.setData(this.currentObj.Char);
				// 		this.char.setModel(_chModel);
				// 	}
				// }
			} else {
				var vis = this.getView().getModel("aVisModel").getData();
				vis.visible = false;
				this.getView().getModel("aVisModel").setData(vis);

				var enbl = this.getView().getModel("aEnModel").getData();
				enbl.enable = true;
				this.getView().getModel("aEnModel").setData(enbl);
				this.class.setVisible(true);
				this.char.setVisible(true);

				// if (this.action === "createOL") {
				if (this.currentObj.Class) {
					var cModel = new sap.ui.model.json.JSONModel();
					cModel.setData(this.currentObj.Class);
					this.class.setModel(cModel);
				}
				if (this.currentObj.Char) {
					this.chData = this.currentObj.Char;
				}
				var _chModel = new sap.ui.model.json.JSONModel();
				// var charLength = this.currentObj.Char.length;
				var classData = this.class.getModel().getData();
				if (classData.length > 0) {
					// for (var i = 0; i < classData.length; i++) {
					var nChar = [];
					for (var j = 0; j < this.chData.length; j++) {
						if (classData[0].Class === this.chData[j].Class) {
							nChar.push(this.chData[j]);
						}
					}
					// }
					this.currentObj.Char = nChar;
					_chModel.setData(nChar);
					this.char.setModel(_chModel);
				} else {
					this.char.setModel(new JSONModel([]));
					this.currentObj.Char = [];
				}
				// if (this.currentObj.Char) {
				// 	var _chModel = new sap.ui.model.json.JSONModel();
				// 	_chModel.setData(this.currentObj.Char);
				// 	this.char.setModel(_chModel);
				// }
				// }
			}

			olDetailModel.setData(this.currentObj);
			this.getView().setModel(olDetailModel, "olDetailModel");
			sap.ui.getCore().setModel(olDetailModel, "olDetailModel");
			this.oModelUpdateFlag = false;
			this.attachModelEventHandlers(olDetailModel);
		},

		relPossSelect: function (oEvent) {

		},

		relUsedSelect: function (oEvent) {

		},

		readLinkData: function (l) {
			var g = this;
			/*if(this.action === "approveOL") {
				var m = this._oView.getModel("ApprModel");	
				var oFilter = [new sap.ui.model.Filter("ChangeRequestId", "EQ", "18105")];
			} else {*/
			var m = this._oView.getModel();
			var oFilter = [new sap.ui.model.Filter("Objlink", "EQ", l)];
			// }
			var olDetailModel = this.getView().getModel("olDetailModel");
			var oExpand = ["OLClass", "OLVal", "Olink", "OLLAM"];
			m.read("/ChangeRequestSet", {
				filters: oFilter,
				urlParameters: {
					"$expand": oExpand
				},
				success: function (r) {
					if (r.results.length > 0) {
						var message = r.results[0].Message;
						g.lockMsg = "";
						if (message !== "") {
							g.lockMsg = true;
							g.createMessagePopover(message, "Error");
							// sap.m.MessageToast.show(message, {
							// 	duration: 15000,
							// 	animationDuration: 15000
							// });
						}
						var h = r.results[0];
						var d = h.Olink.results[0];
						g.currentObj = d;
						if (d !== null && d !== undefined) {
							g.linkCat = d.Netyp;
							g.objCat = d.Kantyp;
							g.currentObj.mode = "change";
							g.currentObj.link = d.Objlink;
							// Netyp: d.Netyp,
							g.currentObj.linkCat = d.Netyp;
							g.currentObj.linkCatDesc = d.Netyptxt;
							// Kantyp= d.Kantyp;
							g.currentObj.objCat = d.Kantyp;
							g.currentObj.objCatDesc = d.Kantyptxt;
							g.currentObj.linkDesc = d.Kanxt;
							g.currentObj.netId = d.Netid;
							g.currentObj.netIdDesc = d.Netidtxt;
							g.currentObj.linkNum = d.Lfdknr;
							g.currentObj.autGrp = d.Begru;
							g.currentObj.autGrpDesc = d.Begtx;
							g.currentObj.validFrm = formatter.getDateFormat(d.Datva);
							g.currentObj.timeFrm = formatter.getTime(d.Zeitva);
							g.currentObj.validTo = formatter.getDateFormat(d.Datvb);
							g.currentObj.timeTo = formatter.getTime(d.Zeitvb);
							g.currentObj.medium = d.Mediu;
							g.currentObj.mediumDesc = d.Medkxt;
							g.currentObj.linkFrmFlEn = true;
							g.currentObj.linkToFlEn = true;
							g.currentObj.linkObjFlEn = true;
							g.currentObj.linkFromEQEn = true;
							g.currentObj.linkToEQEn = true;
							g.currentObj.linkObjEqEn = true;
							g.currentObj.linkCatEn = false;
							g.currentObj.linkCatVS = "None";
							g.currentObj.objCatEn = false;
							g.currentObj.objCatVS = "None";
							g.currentObj.linkFEqLblRQ = true;
							g.currentObj.linkToEqLblRQ = true;
							g.currentObj.linkFrmEq = "";
							g.currentObj.linkFrmEqDesc = "";
							g.currentObj.linkToEq = "";
							g.currentObj.linkToEqDesc = "";
							g.currentObj.linkObjEq = "";
							g.currentObj.linkObjEqDesc = "";
							g.currentObj.linkFrmflLblV = false;
							g.currentObj.linkFrmFlV = false;
							g.currentObj.linkFrmFlDescV = false;
							g.currentObj.linkToFlLblV = false;
							g.currentObj.linkToFlV = false;
							g.currentObj.linkToFlDescV = false;
							g.currentObj.linkObjFlLblV = false;
							g.currentObj.linkObjFlV = false;
							g.currentObj.linkObjFlDescV = false;
							g.currentObj.linkFrmEqLblV = true;
							g.currentObj.linkFrmEqV = true;
							g.currentObj.linkFrmEqDescV = true;
							g.currentObj.linkToEqLblV = true;
							g.currentObj.linkToEQV = true;
							g.currentObj.linkToEqDescV = true;
							g.currentObj.linkObjEqLblV = true;
							g.currentObj.linkObjEqV = true;
							g.currentObj.linkObjEqDescV = true;

							g.currentObj.LAM = [];
							g.currentObj.Class = [];
							g.currentObj.Char = [];

							if (g.objCat === "E") {
								g.currentObj.linkCatEn = false;
								g.currentObj.linkFrmFlEn = false;
								g.currentObj.linkToFlEn = false;
								g.currentObj.linkObjFlEn = false;
								g.currentObj.linkFEqLblRQ = true;
								g.currentObj.linkToEqLblRQ = true;
								g.currentObj.linkFrmflLblV = false;
								g.currentObj.linkFrmFlV = false;
								g.currentObj.linkFrmFlDescV = false;
								g.currentObj.linkToFlLblV = false;
								g.currentObj.linkToFlV = false;
								g.currentObj.linkToFlDescV = false;
								g.currentObj.linkObjFlLblV = false;
								g.currentObj.linkObjFlV = false;
								g.currentObj.linkObjFlDescV = false;
								g.currentObj.linkCatVS = "None";
								g.currentObj.objCatEn = false;
								g.currentObj.objCatVS = "None";
								g.currentObj.linkFEqLblRQ = true;
								g.currentObj.linkToEqLblRQ = true;
								g.currentObj.linkFrmEq = d.Eqvon;
								g.currentObj.linkFrmEqDesc = d.Eqtxtf;
								g.currentObj.linkToEq = d.Eqnach;
								g.currentObj.linkToEqDesc = d.Eqtxtt;
								g.currentObj.linkObjEq = d.Eqkant;
								g.currentObj.linkObjEqDesc = d.Eqtxtl;
								g.currentObj.linkFrmflLblV = false;
								g.currentObj.linkFrmFlV = false;
								g.currentObj.linkFrmFlDescV = false;
								g.currentObj.linkToFlLblV = false;
								g.currentObj.linkToFlV = false;
								g.currentObj.linkToFlDescV = false;
								g.currentObj.linkObjFlLblV = false;
								g.currentObj.linkObjFlV = false;
								g.currentObj.linkObjFlDescV = false;
								g.currentObj.linkFrmEqLblV = true;
								g.currentObj.linkFrmEqV = true;
								g.currentObj.linkFrmEqDescV = true;
								g.currentObj.linkToEqLblV = true;
								g.currentObj.linkToEQV = true;
								g.currentObj.linkToEqDescV = true;
								g.currentObj.linkObjEqLblV = true;
								g.currentObj.linkObjEqV = true;
								g.currentObj.linkObjEqDescV = true;
								olDetailModel.setData(g.currentObj);
								g.getView().setModel(olDetailModel, "olDetailModel");

								g.readStatusProf(g.linkCat);
							} else if (g.objCat === "T") {
								g.currentObj.linkCatEn = false;
								g.currentObj.linkFromEQEn = false;
								g.currentObj.linkToEQEn = false;
								g.currentObj.linkObjEqEn = false;
								g.currentObj.linkFrmflLblRQ = true;
								g.currentObj.linkToFlLblRQ = true;
								g.currentObj.linkFrmEqLblV = false;
								g.currentObj.linkFrmEqV = false;
								g.currentObj.linkFrmEqDescV = false;
								g.currentObj.linkToEqLblV = false;
								g.currentObj.linkToEQV = false;
								g.currentObj.linkToEqDescV = false;
								g.currentObj.linkObjEqLblV = false;
								g.currentObj.linkObjEqV = false;
								g.currentObj.linkObjEqDescV = false;
								g.currentObj.linkCatVS = "None";
								g.currentObj.objCatEn = false;
								g.currentObj.objCatVS = "None";
								g.currentObj.linkFrmflLblRQ = true;
								g.currentObj.linkToFlLblRQ = true;
								g.currentObj.linkFrmFl = d.Tpvon;
								g.currentObj.linkFrmFlDesc = d.Fltxtf;
								g.currentObj.linkToFl = d.Tpnach;
								g.currentObj.linkToFlDesc = d.Fltxtt;
								g.currentObj.linkObjFl = d.Tpkant;
								g.currentObj.linkObjFlDesc = d.Fltxtl;
								g.currentObj.linkFrmflLblV = true;
								g.currentObj.linkFrmFlV = true;
								g.currentObj.linkFrmFlDescV = true;
								g.currentObj.linkToFlLblV = true;
								g.currentObj.linkToFlV = true;
								g.currentObj.linkToFlDescV = true;
								g.currentObj.linkObjFlLblV = true;
								g.currentObj.linkObjFlV = true;
								g.currentObj.linkObjFlDescV = true;
								g.currentObj.linkFrmEqLblV = false;
								g.currentObj.linkFrmEqV = false;
								g.currentObj.linkFrmEqDescV = false;
								g.currentObj.linkToEqLblV = false;
								g.currentObj.linkToEQV = false;
								g.currentObj.linkToEqDescV = false;
								g.currentObj.linkObjEqLblV = false;
								g.currentObj.linkObjEqV = false;
								g.currentObj.linkObjEqDescV = false;
								olDetailModel.setData(g.currentObj);
								g.getView().setModel(olDetailModel, "olDetailModel");

								g.readStatusProf(g.linkCat);
							}

							if (d.Bezarp === "2") {
								// g._oView.byId("twoWayRel").setSelected(true);
								g.currentObj.twoWayRel = true;
								g.currentObj.oneWayRel = false;
							} else if (d.Bezarp === "1") {
								// g._oView.byId("oneWayRel").setSelected(true);
								g.currentObj.oneWayRel = true;
								g.currentObj.twoWayRel = false;
							}

							if (d.Bezarl === "2") {
								// g._oView.byId("twoWayUsd").setSelected(true);
								g.currentObj.twoWayUsd = true;
								g.currentObj.oneWayUsd = false;
								g.currentObj.relNotUsd = false;
							} else if (d.Bezarl === "1") {
								// g._oView.byId("oneWayUsd").setSelected(true);
								g.currentObj.oneWayUsd = true;
								g.currentObj.relNotUsd = false;
								g.currentObj.twoWayUsd = false;
							} else if (d.Bezarl === "0") {
								// g._oView.byId("relNotUsd").setSelected(true);
								g.currentObj.relNotUsd = true;
								g.currentObj.oneWayUsd = false;
								g.currentObj.twoWayUsd = false;
							}

							var lamData = h.OLLAM.results;
							var lModel = new sap.ui.model.json.JSONModel();
							lModel.setData(lamData);
							g.currentObj.LAM = lamData;

							/*sap.ui.getCore().byId("olLamDetails").setModel(lModel, "ntLinkLam");
							sap.ui.getCore().setModel(lModel, "linkLam");*/

							var classList = h.OLClass.results;
							if (classList) {
								if (classList.length > 0) {
									for (var i = 0; i < classList.length; i++) {
										classList[i].ctEnable = false;
										classList[i].classEnable = false;
										classList[i].ClassTypeDesc = classList[i].Artxt;
										delete classList[i].Artxt;
										sClassList[i].ClassDesc = sClassList[i].Kltxt;
										delete sClassList[i].Kltxt;
										delete classList[i].Changerequestid;
										delete classList[i].Clint;
										delete classList[i].Service;
										classList[i].classDelEnable = true;
									}
									if (g.lockMsg === "true") {
										for (var i = 0; i < classList.length; i++) {
											classList[i].classDelEnable = false;
										}
									}
									var cModel = new sap.ui.model.json.JSONModel();
									cModel.setData(classList);
									g.class.setModel(cModel);
									g.currentObj.Class = classList;
								}
							}

							var charList = h.OLVal.results;
							if (charList) {
								if (charList.length > 0) {
									for (var j = 0; j < charList.length; j++) {
										charList[j].cNameEnable = false;
										delete charList[j].Ataut;
										delete charList[j].Ataw1;
										delete charList[j].Atawe;
										delete charList[j].Atcod;
										delete charList[j].Atflb;
										delete charList[j].Atflv;
										delete charList[j].Atimb;
										delete charList[j].Atsrt;
										delete charList[j].Atvglart;
										delete charList[j].Atzis;
										delete charList[j].Changerequestid;
										delete charList[j].CharName;
										delete charList[j].Charid;
										delete charList[j].Classtype;
										delete charList[j].Service;
										delete charList[j].Valcnt;
										charList[j].slNo = j + 1;
										charList[j].flag = charList[j].Class + "-" + charList[j].slNo;
									}
									if (g.lockMsg === "true") {
										for (var i = 0; i < charList.length; i++) {
											charList[i].charAddEnable = false;
											charList[i].charClrEnable = false;
											charList[i].charDltEnable = false;
										}
									} else {
										for (var z = 0; z < charList.length; z++) {
											var count = 1;
											for (var y = 0; y < charList.length; y++) {
												if (z === y) {
													continue;
												}
												if (charList[y].Atnam === charList[z].Atnam && charList[y].Class ===
													charList[z].Class) {
													count++;
												}
											}
											if (count > 1) {
												charList[z].charDltEnable = true;
											} else {
												charList[z].charDltEnable = false;
											}

											if (charList[z].Atein === true) {
												charList[z].charAddEnable = false;
											}
										}
									}
									var _cModel = new sap.ui.model.json.JSONModel();
									_cModel.setData(charList);
									g.char.setModel(_cModel);
									// g.chData = charList;
									g.currentObj.Char = charList;
								}
							}
							olDetailModel.setData(g.currentObj);
							g.getView().setModel(olDetailModel, "olDetailModel");
						}
					}
				},
				error: function (err) {}
			});
		},

		disableFields: function () {
			var obj = {
				enable: false
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "mainView");
			/*this.class.setEnabled(false);
			this.char.setEnabled(false);*/
			this.class.setMode("None");
			this.char.setMode("None");
			// this.getView().byId("newHeader").setEnabled(false);
			// this.getView().byId("newChar").setEnabled(false);

		},

		enableFields: function () {
			var g = this;
			var obj = {
				enable: true
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "mainView");

			/*var classData = this.class.getModel().getData();
			if (classData !== null) {
				this.class.setEnabled(true);
			} else {
				this.class.setEnabled(false);
			}*/

			this.class.setMode("SingleSelectLeft");
			this.char.setMode("Delete");
			/*this.getView().byId("newHeader").setEnabled(true);
			var classData = this.class.getModel().getData();
			if (classData !== null) {
				this.getView().byId("newChar").setEnabled(true);
			} else {
				this.getView().byId("newChar").setEnabled(false);
			}*/
		},

		onDonePress: function (oEvent) {
			var g = this;
			var doneFlag = true;
			var olDetailModel = this.getView().getModel("olDetailModel");
			var sSourceId = oEvent.getSource().getId();

			// if (this.action === "createOL") {
			var lCat = this.currentObj.linkCat;
			var oCat = this.currentObj.objCat;
			var lDesc = this.currentObj.linkDesc;
			var num = this.currentObj.linkNum;
			var lFrmEq = this.currentObj.linkFrmEq;
			var lToEq = this.currentObj.linkToEq;
			var lObj = this.currentObj.linkObjEq;
			var lFrmFl = this.currentObj.linkFrmFl;
			var lToFl = this.currentObj.linkToFl;
			var lObj1 = this.currentObj.linkObjFl;
			var oWay = this._oView.byId("oneWayRel");
			var tWayU = this._oView.byId("twoWayUsd");

			if ((lCat === "") || (oCat === "") || (lDesc === "") || (num === "")) {
				if (lCat === "") {
					this.currentObj.linkCatVS = "Error";
				}
				if (oCat === "") {
					this.currentObj.objCatVS = "Error";
				}
				if (lDesc === "") {
					this.currentObj.linkDescVS = "Error";
				}
				if (num === "") {
					this.currentObj.linkNumVS = "Error";
				}
				olDetailModel.setData(this.currentObj);
				var value = this.getView().getModel("i18n").getProperty("MANDMSG");
				g.createMessagePopover(value, "Error");
				// sap.m.MessageBox.show(value, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function () {}
				// });
				return;
			}
			var oFlag = this.ObjectIsEmpty();
			if (oFlag === true) {
				return;
			}
			if (oCat === "E") {
				if (lFrmEq === lToEq === lObj) {
					this.validateEquiObject(lFrmEq);
					return;
				} else if (lFrmEq === lToEq) {
					this.validateEquiObject(lFrmEq);
					return;
				} else if (lFrmEq === lObj) {
					this.validateEquiObject(lFrmEq);
					return;
				} else if (lToEq === lObj) {
					this.validateEquiObject(lFrmEq);
					return;
				}
			} else if (oCat === "T") {
				if (lFrmFl === lToFl === lObj1) {
					this.validateFlocObject(lFrmFl);
					return;
				} else if (lFrmFl === lToFl) {
					this.validateFlocObject(lFrmFl);
					return;
				} else if (lFrmFl === lObj1) {
					this.validateFlocObject(lFrmFl);
					return;
				} else if (lToFl === lObj1) {
					this.validateFlocObject(lFrmFl);
					return;
				}
			}

			if (oWay.getSelected() && tWayU.getSelected()) {
				var rMsg = this._oView.getModel("i18n").getProperty("REL_ERR");
				g.createMessagePopover(rMsg, "Error");
				// sap.m.MessageBox.show(rMsg, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function () {}
				// });
				return;
			}

			if (!doneFlag) {
				olDetailModel.setData(this.currentObj);
				return;
			}

			// var olDetailModel = g.getView().getModel("olDetailModel");
			var olDetailData = this.currentObj;
			if (g.class.getModel()) {
				var sClassData = g.class.getModel().getData();
				if (sClassData) {
					olDetailData.Class = [];
					for (var a = 0; a < sClassData.length; a++) {
						olDetailData.Class.push(sClassData[a]);
					}
					olDetailModel.setData(olDetailData);
				}
			}
			if (this.chData) {
				var sCharData = this.chData; //this.char.getModel().getData();
				if (sCharData !== null && sCharData !== undefined) {
					olDetailData.Char = [];
					for (var b = 0; b < sCharData.length; b++) {
						olDetailData.Char.push(sCharData[b]);
					}
				}
				olDetailModel.setData(olDetailData);
			}
			// if (g.char.getModel()) {
			// 	var sCharData = g.char.getModel().getData();
			// 	if (sCharData) {
			// 		olDetailData.Char = [];
			// 		for (var b = 0; b < sCharData.length; b++) {
			// 			olDetailData.Char.push(sCharData[b]);
			// 		}
			// 		olDetailModel.setData(olDetailData);
			// 	}
			// }

			if (sSourceId.indexOf("idBtnCheck") > -1) {
				this.validateCheck();
				return;
			}

			this.chData = [];

			// } else 
			if (this.action === "changeOL") {
				if (this.oModelUpdateFlag && !this.sExistFlag) {
					var sJsonModel = sap.ui.getCore().getModel("AIWListOLModel").getData();
					sJsonModel.push(this.getView().getModel("olDetailModel").getData());
				}
				/*if (this.status !== false) {
					var olObj = olDetailModel.getData();
					var AIWListOLData = sap.ui.getCore().getModel("AIWListOLModel").getData();
					AIWListOLData.push(olObj);
					sap.ui.getCore().getModel("AIWListOLModel").setData(AIWListOLData);
				}*/
			}
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			}
		},

		validateCheck: function () {
			var g = this;
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWListONData = sap.ui.getCore().getModel("AIWListONModel").getData();
			var sAIWData = g.getView().getModel("olDetailModel").getData();
			var oCrType = sap.ui.getCore().getModel("tempCrTypeModel").getData();
			var sPayload = {
				"ChangeRequestType": oCrType.crtype,
				"CrDescription": oCrType.desc,
				"IsDraft": "C",
				"Messages": [],
				// "Reason": this.getView().byId("reasonForRequest").getSelectedKey(),
				// "Guids": this.oAttach,
				"FuncLoc": [],
				"FLAddr": [],
				"FLLAM": [],
				"FLClass": [],
				"FLVal": [],
				"Equipment": [],
				"EqAddr": [],
				"EqPRT": [],
				"EqLAM": [],
				"EqClass": [],
				"EqVal": [],
				"MSPoint": [],
				"MSLAM": [],
				"MSClass": [],
				"MSVal": [],
				"MPLAN": [],
				"MPItem": [],
				"MPLAM": [],
				"MPOBList": [],
				"MPCycle": [],
				"MRBHeader": [],
				"MRBItem": [],
				"MRBSBIT": [],
				"EBHeader": [],
				"EBItem": [],
				"EBSBIT": [],
				"FBHeader": [],
				"FBItem": [],
				"FBSBIT": [],
				"WBHeader": [],
				"WBItem": [],
				"WBSBIT": [],
				"ONetwork": [],
				"ONLAM": [],
				"Workcenter": [],
				"WCCost": [],
				"GTList": [],
				"GTOprs": [],
				"GTComp": [],
				"GTClass": [],
				"GTVal": [],
				"ETList": [],
				"ETOprs": [],
				"ETComp": [],
				"ETClass": [],
				"ETVal": [],
				"FTList": [],
				"FTOprs": [],
				"FTComp": [],
				"FTClass": [],
				"FTVal": [],
				"Olink": [],
				"OLClass": [],
				"OLVal": []
			};

			if (AIWFLOCModel.length > 0) {
				for (var a = 0; a < AIWFLOCModel.length; a++) {
					var sFuncLoc = {
						"Tplnr": AIWFLOCModel[a].Functionallocation,
						"Txtmi": AIWFLOCModel[a].Flocdescription, // Floc Description
						"TplkzFlc": AIWFLOCModel[a].Strucindicator,
						"Tplxt": AIWFLOCModel[a].StrucIndicatorDesc,
						"EditMask": AIWFLOCModel[a].EditMask,
						"Hierarchy": AIWFLOCModel[a].Hierarchy,
						"Fltyp": AIWFLOCModel[a].Floccategory,
						"Flttx": AIWFLOCModel[a].FlocCategoryDesc,
						"Swerk": AIWFLOCModel[a].Maintplant,
						"Plantname": AIWFLOCModel[a].MaintplantDesc,
						"StorFloc": AIWFLOCModel[a].Location, // Location
						"Locationdesc": AIWFLOCModel[a].Locationdesc, // Location Description
						"Abckzfloc": AIWFLOCModel[a].Abckz,
						"Abctx": AIWFLOCModel[a].Abctx,
						"Bukrsfloc": AIWFLOCModel[a].Bukrs,
						"Butxt": AIWFLOCModel[a].Butxt,
						"City": AIWFLOCModel[a].City,
						"KostFloc": AIWFLOCModel[a].Kostl, // Cost Center
						"KokrFloc": AIWFLOCModel[a].Kokrs, // ccPart1
						"Contareaname": AIWFLOCModel[a].Mctxt, // Name
						"PlntFloc": AIWFLOCModel[a].Werks, // Planning Plant
						"Planningplantdes": AIWFLOCModel[a].Planningplantdes, // Planning Plant Description
						"Ingrp": AIWFLOCModel[a].Ingrp, // Planner Group
						"Plannergrpdesc": AIWFLOCModel[a].Innam, // Planner Group Description
						"Arbplfloc": AIWFLOCModel[a].Arbpl, // Work Center
						// "Workcenterdesc" : AIWFLOCModel[a].Ktext, // Plant Work Center
						"Wergwfloc": AIWFLOCModel[a].WcWerks, // Name
						"Gewrkfloc": AIWFLOCModel[a].MainArbpl, // Main Work Center
						// "MainWcDesc" : AIWFLOCModel[a].MainKtext, // Work center Plant
						"MainWcPlant": AIWFLOCModel[a].MainWerks, // Work Center Description
						"Tplma": AIWFLOCModel[a].SupFunctionallocation, // Sup FuncLoc
						"Supflocdesc": AIWFLOCModel[a].SupFlocdescription, // Sup FlocDescription
						"BeberFl": AIWFLOCModel[a].BeberFl, // Plant Section
						"Fing": AIWFLOCModel[a].Fing, // Person responsible
						"Tele": AIWFLOCModel[a].Tele, // Phone
						"Submtiflo": AIWFLOCModel[a].ConstrType, // Construction Type
						"Constdesc": AIWFLOCModel[a].ConstructionDesc, // Construction Description
						"Eqart": AIWFLOCModel[a].TechnicalObjectTyp, // TechnicalObjectTyp
						"Eartx": AIWFLOCModel[a].Description, // TechnicalObjectTyp Description
						"Stattext": AIWFLOCModel[a].Stattext, // System Status
						"StsmFloc": AIWFLOCModel[a].StsmEqui, // Status Profile
						"Statproftxt": AIWFLOCModel[a].StsmEquiDesc, // Status Profile Description
						"UstwFloc": AIWFLOCModel[a].UstwEqui, // Status with Status Number
						"UswoFloc": AIWFLOCModel[a].UswoEqui, // Status without Status Number
						"UstaFloc": AIWFLOCModel[a].UstaEqui, // User Status
						"Adrnri": AIWFLOCModel[a].Adrnri,
						"Deact": AIWFLOCModel[a].Deact
					};
					sPayload.FuncLoc.push(sFuncLoc);

					var sFLAddr = {
						"Funcloc": AIWFLOCModel[a].Functionallocation,
						"Title": AIWFLOCModel[a].TitleCode,
						"Name1": AIWFLOCModel[a].Name1,
						"Name2": AIWFLOCModel[a].Name2,
						"Name3": AIWFLOCModel[a].Name3,
						"Name4": AIWFLOCModel[a].Name4,
						"Sort1": AIWFLOCModel[a].Sort1,
						"Sort2": AIWFLOCModel[a].Sort2,
						"NameCo": AIWFLOCModel[a].NameCo,
						"PostCod1": AIWFLOCModel[a].PostCod1,
						"City1": AIWFLOCModel[a].City1,
						"Building": AIWFLOCModel[a].Building,
						"Floor": AIWFLOCModel[a].Floor,
						"Roomnum": AIWFLOCModel[a].Roomnum,
						"Strsuppl1": AIWFLOCModel[a].Strsuppl1,
						"Strsuppl2": AIWFLOCModel[a].Strsuppl2,
						"Strsuppl3": AIWFLOCModel[a].Strsuppl3,
						"Location": AIWFLOCModel[a].AddrLocation,
						"RPostafl": AIWFLOCModel[a].RefPosta,
						"Landx": AIWFLOCModel[a].Landx,
						"TimeZone": AIWFLOCModel[a].TimeZone,
						"RPostFl": AIWFLOCModel[a].Region,
						"Regiotxt": AIWFLOCModel[a].RegionDesc
					};
					sPayload.FLAddr.push(sFLAddr);

					var aIntlAddr = AIWFLOCModel[a].intlAddr;
					if (aIntlAddr) {
						for (var z = 0; z < aIntlAddr.length; z++) {
							sPayload.FLAddrI.push(aIntlAddr[z]);
						}
					}

					if (g.AltLblDerv === "2" && AIWFLOCModel[a].altlbl) {
						for (var y = 0; y < AIWFLOCModel[a].altlbl.length; y++) {
							var oAltLbl = {
								"Funcloc": AIWFLOCModel[a].Functionallocation,
								"AltAlkey": AIWFLOCModel[a].altlbl[y].AltAlkey,
								"AltStrno": AIWFLOCModel[a].altlbl[y].AltStrno,
								"AltTplkz": AIWFLOCModel[a].altlbl[y].AltTplkz
							};
							sPayload.FLALTLBEL.push(oAltLbl);
						}
					}

					if (AIWFLOCModel[a].Floccategory === "L" && AIWFLOCModel[a].lam) {
						var sFLLAM = {
							"Funcloc": AIWFLOCModel[a].Functionallocation,
							"Lrpid": AIWFLOCModel[a].lam.Lrpid,
							"Strtptatr": AIWFLOCModel[a].lam.Strtptatr,
							"Endptatr": AIWFLOCModel[a].lam.Endptatr,
							"Length": (AIWFLOCModel[a].lam.Length).toString(),
							"LinUnit": AIWFLOCModel[a].lam.LinUnit,
							"Startmrkr": AIWFLOCModel[a].lam.Startmrkr,
							"Endmrkr": AIWFLOCModel[a].lam.Endmrkr,
							"Mrkdisst": AIWFLOCModel[a].lam.Mrkdisst,
							"Mrkdisend": AIWFLOCModel[a].lam.Mrkdisend,
							"MrkrUnit": AIWFLOCModel[a].lam.MrkrUnit
						};
						sPayload.FLLAM.push(sFLLAM);
					}

					var sFLClassList = AIWFLOCModel[a].classItems;
					if (sFLClassList) {
						if (sFLClassList.length > 0) {
							for (var b = 0; b < sFLClassList.length; b++) {
								var sFLClass = {
									"Funcloc": AIWFLOCModel[a].Functionallocation,
									"Classtype": sFLClassList[b].Classtype,
									"Class": sFLClassList[b].Class,
									"Clstatus1": sFLClassList[b].Clstatus1
								};
								sPayload.FLClass.push(sFLClass);
							}
						}
					}

					var sFLCharList = AIWFLOCModel[a].characteristics;
					if (sFLCharList) {
						if (sFLCharList.length > 0) {
							for (var c = 0; c < sFLCharList.length; c++) {
								var sFLVal = {
									"Funcloc": AIWFLOCModel[a].Functionallocation,
									"Atnam": sFLCharList[c].Atnam,
									"Textbez": sFLCharList[c].Textbez,
									"Atwrt": sFLCharList[c].Atwrt,
									"Class": sFLCharList[c].Class
								};
								sPayload.FLVal.push(sFLVal);
							}
						}
					}
				}
			}

			if (AIWEQUIModel.length > 0) {
				for (var d = 0; d < AIWEQUIModel.length; d++) {
					var sEquipment = {
						"Herst": AIWEQUIModel[d].Herst, // Manufacturer
						"Equnr": AIWEQUIModel[d].Equnr,
						"Txtmi": AIWEQUIModel[d].Eqktx,
						//"Eqktx" : AIWEQUIModel[d].Eqktx,
						"Swerk": AIWEQUIModel[d].Maintplant,
						"Name1": AIWEQUIModel[d].MaintplantDesc,
						"TplnEilo": AIWEQUIModel[d].Tplnr,
						"Flocdescription": AIWEQUIModel[d].Pltxt,
						"Eqtyp": AIWEQUIModel[d].EquipmentCatogory,
						"Etytx": AIWEQUIModel[d].EquipCatgDescription,
						"Eqart": AIWEQUIModel[d].TechnicalObjectTyp, // TechnicalObjectTyp
						"Eartx": AIWEQUIModel[d].Description, // TechnicalObjectTyp Description
						"Typbz": AIWEQUIModel[d].Typbz, // Model Number
						"SubmEeqz": AIWEQUIModel[d].ConstrType, // Construction Type
						"Constdesc": AIWEQUIModel[d].ConstructionDesc, // Construction Description
						"BukrEilo": AIWEQUIModel[d].Bukrs,
						"Butxt": AIWEQUIModel[d].Butxt,
						"HequEeqz": AIWEQUIModel[d].SuperordinateEquip, // Superord. Equipment
						"SuperordEqDes": AIWEQUIModel[d].SuperordinateEquipDesc, // Superord. Equipment Description
						"TidnEeqz": AIWEQUIModel[d].TechIdNum, // techIndNo
						"KostEilo": AIWEQUIModel[d].Kostl, // Cost Center
						"KokrEilo": AIWEQUIModel[d].Kokrs, // ccPart1
						"Contareaname": AIWEQUIModel[d].Mctxt, // Name
						"StorEilo": AIWEQUIModel[d].Location,
						"Locationdesc": AIWEQUIModel[d].Locationdesc,
						"AbckEilo": AIWEQUIModel[d].Abckz,
						"Abctx": AIWEQUIModel[d].Abctx,
						"PplaEeqz": AIWEQUIModel[d].Werks, // Planning Plant
						"Planningplantdes": AIWEQUIModel[d].Planningplantdes, // Planning Plant Description
						"IngrEeqz": AIWEQUIModel[d].Ingrp, // Planner Group
						"Plannergrpdesc": AIWEQUIModel[d].Innam, // Planner Group Description
						"Serge": AIWEQUIModel[d].Serge, // manfSerNo
						"MapaEeqz": AIWEQUIModel[d].MapaEeqz, // partNum
						"Stattext": AIWEQUIModel[d].Stattext, // System Status
						"StsmEqui": AIWEQUIModel[d].StsmEqui, // Status Profile
						"Statproftxt": AIWEQUIModel[d].StsmEquiDesc, // Status Profile Description
						"UstwEqui": AIWEQUIModel[d].UstwEqui, // Status with Status Number
						"UswoEqui": AIWEQUIModel[d].UswoEqui, // Status without Status Number
						"UstaEqui": AIWEQUIModel[d].UstaEqui, // User Status
						"Deact": AIWEQUIModel[d].Deact,
						"Answt": AIWEQUIModel[d].Answt,
						"Ansdt": g._formatDate(AIWEQUIModel[d].Ansdt),
						"Waers": AIWEQUIModel[d].Waers, // Currency

						"ArbpEilo": AIWEQUIModel[d].Arbpl, // Work Center
						// "Workcenterdesc" : AIWEQUIModel[d].Ktext, // Plant Work Center
						"WorkCenterPlant": AIWEQUIModel[d].WcWerks, // Name
						"ArbpEeqz": AIWEQUIModel[d].MainArbpl, // Main Work Center
						// "MainWcDesc" : AIWEQUIModel[d].MainKtext, // Work Center Description
						"MainWcPlant": AIWEQUIModel[d].MainWerks, // Work center Plant

						"BebeEilo": AIWEQUIModel[d].BeberFl, // Plant Section
						"Fing": AIWEQUIModel[d].Fing, // Plant Section
						"Tele": AIWEQUIModel[d].Tele, // Plant Section
						"HeqnEeqz": AIWEQUIModel[d].EquipPosition, // Position
						"Adrnri": AIWEQUIModel[d].Adrnri,

						"Funcid": AIWEQUIModel[d].Funcid, // Config Control data
						"Frcfit": AIWEQUIModel[d].Frcfit,
						"Frcrmv": AIWEQUIModel[d].Frcrmv
					};
					sPayload.Equipment.push(sEquipment);

					var sEqPRT = {
						"Equi": AIWEQUIModel[d].Equnr,
						"PlanvPrt": AIWEQUIModel[d].PlanvPrt,
						"SteufPrt": AIWEQUIModel[d].SteufPrt,
						"KtschPrt": AIWEQUIModel[d].KtschPrt,
						"Ewformprt": AIWEQUIModel[d].Ewformprt,
						"SteufRef": AIWEQUIModel[d].SteufRef,
						"KtschRef": AIWEQUIModel[d].KtschRef,
						"EwformRef": AIWEQUIModel[d].EwformRef
					};
					sPayload.EqPRT.push(sEqPRT);

					if (AIWEQUIModel[d].EquipmentCatogory === "L" && AIWEQUIModel[d].lam) {
						var sEqLAM = {
							"Equi": AIWEQUIModel[d].Equnr,
							"Lrpid": AIWEQUIModel[d].lam.Lrpid,
							"Strtptatr": AIWEQUIModel[d].lam.Strtptatr,
							"Endptatr": AIWEQUIModel[d].lam.Endptatr,
							"Length": (AIWEQUIModel[d].lam.Length).toString(),
							"LinUnit": AIWEQUIModel[d].lam.LinUnit,
							"Startmrkr": AIWEQUIModel[d].lam.Startmrkr,
							"Endmrkr": AIWEQUIModel[d].lam.Endmrkr,
							"Mrkdisst": AIWEQUIModel[d].lam.Mrkdisst,
							"Mrkdisend": AIWEQUIModel[d].lam.Mrkdisend,
							"MrkrUnit": AIWEQUIModel[d].lam.MrkrUnit
						};
						sPayload.EqLAM.push(sEqLAM);
					}

					var sEqAddr = {
						"Equi": AIWEQUIModel[d].Equnr,
						"Title": AIWEQUIModel[d].TitleCode,
						"Name1": AIWEQUIModel[d].Name1,
						"Name2": AIWEQUIModel[d].Name2,
						"Name3": AIWEQUIModel[d].Name3,
						"Name4": AIWEQUIModel[d].Name4,
						"Sort1": AIWEQUIModel[d].Sort1,
						"Sort2": AIWEQUIModel[d].Sort2,
						"NameCo": AIWEQUIModel[d].NameCo,
						"PostCod1": AIWEQUIModel[d].PostCod1,
						"City1": AIWEQUIModel[d].City1,
						"Building": AIWEQUIModel[d].Building,
						"Floor": AIWEQUIModel[d].Floor,
						"Roomnum": AIWEQUIModel[d].Roomnum,
						"Strsuppl1": AIWEQUIModel[d].Strsuppl1,
						"Strsuppl2": AIWEQUIModel[d].Strsuppl2,
						"Strsuppl3": AIWEQUIModel[d].Strsuppl3,
						"Location": AIWEQUIModel[d].AddrLocation,
						"RefPosta": AIWEQUIModel[d].RefPosta,
						"Landx": AIWEQUIModel[d].Landx,
						"TimeZone": AIWEQUIModel[d].TimeZone,
						"RfePost": AIWEQUIModel[d].Region,
						"Regiotxt": AIWEQUIModel[d].RegionDesc
					};
					sPayload.EqAddr.push(sEqAddr);

					var aIntlAddrItems = AIWEQUIModel[d].intlAddr;
					if (aIntlAddrItems) {
						for (var z = 0; z < aIntlAddrItems.length; z++) {
							sPayload.EqAddrI.push(aIntlAddrItems[z]);
						}
					}

					var sEqClassList = AIWEQUIModel[d].classItems;
					if (sEqClassList) {
						if (sEqClassList.length > 0) {
							for (var e = 0; e < sEqClassList.length; e++) {
								var sEqClass = {
									"Equi": AIWEQUIModel[d].Equnr,
									"Classtype": sEqClassList[e].Classtype,
									"Class": sEqClassList[e].Class,
									"Clstatus1": sEqClassList[e].Clstatus1
								};
								sPayload.EqClass.push(sEqClass);
							}
						}
					}

					var sEqCharList = AIWEQUIModel[d].characteristics;
					if (sEqCharList) {
						if (sEqCharList.length > 0) {
							for (var f = 0; f < sEqCharList.length; f++) {
								var sEqVal = {
									"Equi": AIWEQUIModel[d].Equnr,
									"Atnam": sEqCharList[f].Atnam,
									"Textbez": sEqCharList[f].Textbez,
									"Atwrt": sEqCharList[f].Atwrt,
									"Class": sEqCharList[f].Class
								};
								sPayload.EqVal.push(sEqVal);
							}
						}
					}
				}
			}
			
			if (AIWListONData.length > 0) {
				for (var i = 0; i < AIWListONData.length; i++) {
					var onNetwork = {
						"Objnetwrk": AIWListONData[i].Objnetwrk,
						"Netgrp": AIWListONData[i].Netgrp,
						"Netwtyp": AIWListONData[i].Netwtyp,
						"Netxt": AIWListONData[i].Netxt,
						"Ntobjtyp": AIWListONData[i].Ntobjtyp
					};
					sPayload.ONetwork.push(onNetwork);

					if (AIWListONData[i].lam) {
						var onLAM = {
							"Objnetwrk": AIWListONData[i].Objnetwrk,
							"Lrpid": AIWListONData[i].lam.Lrpid,
							"Strtptatr": AIWListONData[i].lam.Strtptatr,
							"Endptatr": AIWListONData[i].lam.Endptatr,
							"Length": AIWListONData[i].lam.Length,
							"LinUnit": AIWListONData[i].lam.LinUnit,
							"Startmrkr": AIWListONData[i].lam.Startmrkr,
							"Endmrkr": AIWListONData[i].lam.Endmrkr,
							"Mrkdisst": AIWListONData[i].lam.Mrkdisst,
							"Mrkdisend": AIWListONData[i].lam.Mrkdisend,
							"MrkrUnit": AIWListONData[i].lam.MrkrUnit
						};
						sPayload.ONLAM.push(onLAM);
					}
				}
			}

			var olHeader = {
				"Begru": sAIWData.autGrp,
				"Objlink": sAIWData.link,
				"Kanxt": sAIWData.linkDesc,
				"Eqkant": sAIWData.linkObjEq,
				"Tpkant": sAIWData.linkObjFl,
				"Netyp": sAIWData.linkCat,
				"Eqvon": sAIWData.linkFrmEq,
				"Tpvon": sAIWData.linkFrmFl,
				"Eqnach": sAIWData.linkToEq,
				"Tpnach": sAIWData.linkToFl,
				"Mediu": sAIWData.medium,
				"Lfdknr": sAIWData.linkNum,
				"Kantyp": sAIWData.objCat,
				"Netid": sAIWData.netId,
				"Bezarp": sAIWData.Bezarp,
				"Bezarl": sAIWData.Bezarl,
				"Datva": formatter._formatDate(sAIWData.validFrm),
				"Zeitva": formatter._timeConvert(sAIWData.timeFrm),
				"Datvb": formatter._formatDate(sAIWData.validTo),
				"Zeitvb": formatter._timeConvert(sAIWData.timeTo),
				"Stattext": sAIWData.Stattext,
				"StsmOl": sAIWData.StsmOl,
				"UstwOl": sAIWData.UstwOl,
				"UswoOl": sAIWData.UswoOl,
				"UstaOl": sAIWData.UstaOl
			};
			sPayload.Olink.push(olHeader);

			if (sAIWData.Class) {
				for (var j = 0; j < sAIWData.Class.length; j++) {
					var mClass = {
						"Objlink": sAIWData.Class[j].Objlink,
						"Classtype": sAIWData.Class[j].Classtype,
						"Class": sAIWData.Class[j].Class,
						"Clstatus1": sAIWData.Class[j].Clstatus1
					};
					sPayload.OLClass.push(mClass);
				}
			}

			if (sAIWData.Char) {
				for (var k = 0; k < sAIWData.Char.length; k++) {
					var mChar = {
						"Objlink": sAIWData.Char[k].Objlink,
						"Atnam": sAIWData.Char[k].Atnam,
						"Textbez": sAIWData.Char[k].Textbez,
						"Atwrt": sAIWData.Char[k].Atwrt,
						"Class": sAIWData.Char[k].Class
					};
					sPayload.OLVal.push(mChar);
				}
			}

			this.getView().byId("olDetailPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("olDetailPage").setBusy(false);
					var cr = r;
					var oMessageList = [];
					for (var e = 0; e < cr.Messages.results.length; e++) {
						oMessageList.push({
							type: formatter.getMessageType(cr.Messages.results[e].Type),
							title: cr.Messages.results[e].Message
						});
					}
					g.createMessagePopover(oMessageList, "");
				},
				error: function (err) {
					// g.BusyDialog.close();
					g.getView().byId("olDetailPage").setBusy(false);
					var error = [],
						oMessageList = [];
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

		attachModelEventHandlers: function (oModel) {
			oModel.attachPropertyChange(this.handlePropertyChanged, this);
		},

		handlePropertyChanged: function () {
			this.oModelUpdateFlag = true;
		},

		ObjectIsEmpty: function () {
			var objFlag = true;
			var lFrmEq = this._oView.byId("linkFromEQ");
			var lToEq = this._oView.byId("linkToEQ");
			var lFrmFl = this._oView.byId("linkfrmFl");
			var lToFl = this._oView.byId("linkToFl");
			var oCat = this._oView.byId("objectCategory");
			if (oCat.getSelectedKey() === "E") {
				if (lFrmEq.getValue() === "" && lToEq.getValue() === "") {
					lFrmEq.setValueState("Error");
					lToEq.setValueState("Error");
					var value = this.getView().getModel("i18n").getProperty("OBJ_ERR");
					this.createMessagePopover(value, "Error");
					// sap.m.MessageBox.show(value, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {
					// 	}
					// });
					objFlag = true;
					return objFlag;
				} else if (lFrmEq.getValue() === "" && lToEq.getValue() !== "") {
					lFrmEq.setValueState("Error");
					var fMsg = this.getView().getModel("i18n").getProperty("EQ_FRM_ERR");
					this.createMessagePopover(fMsg, "Error");
					// sap.m.MessageBox.show(fMsg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {
					// 	}
					// });
					objFlag = true;
					return objFlag;
				} else if (lFrmEq.getValue() !== "" && lToEq.getValue() === "") {
					var tMsg = this.getView().getModel("i18n").getProperty("EQ_TO_ERR");
					lToEq.setValueState("Error");
					this.createMessagePopover(tMsg, "Error");
					// sap.m.MessageBox.show(tMsg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {
					// 	}
					// });
					objFlag = true;
					return objFlag;
				}
			} else if (oCat.getSelectedKey() === "T") {

				if (lFrmFl.getValue() === "" && lToFl.getValue() === "") {
					var flvalue = this.getView().getModel("i18n").getProperty("FL_OBJ_ERR");
					lFrmFl.setValueState("Error");
					lToFl.setValueState("Error");
					this.createMessagePopover(flvalue, "Error");
					// sap.m.MessageBox.show(flvalue, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {
					// 	}
					// });
					objFlag = true;
					return objFlag;
				} else if (lFrmFl.getValue() === "" && lToFl.getValue() !== "") {

					var flMsg = this.getView().getModel("i18n").getProperty("FL_FRM_ERR");
					lFrmFl.setValueState("Error");
					this.createMessagePopover(flMsg, "Error");
					// sap.m.MessageBox.show(flMsg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {
					// 	}
					// });
					objFlag = true;
					return objFlag;
				} else if (lFrmFl.getValue() !== "" && lToFl.getValue() === "") {
					var tflMsg = this.getView().getModel("i18n").getProperty("FL_TO_ERR");
					lToFl.setValueState("Error");
					this.createMessagePopover(tflMsg, "Error");
					// sap.m.MessageBox.show(tflMsg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {
					// 	}
					// });
					objFlag = true;
					return objFlag;
				}
			}
		},

		readStatusDetails: function (s) {
			var g = this;
			var q = "/DeriveOLstatusSet(Netyp='" + g.currentObj.linkCat + "',Lvorm=false)";
			var m = this.getView().getModel();
			m.read(q, {
				success: function (r) {
					g._oView.byId("userSts").setValue(r.USER_STAT);
					g._oView.byId("stsObj").setValue(r.USER_STATWITHNUM);
					g._oView.byId("stsWoNo").setValue(r.USER_STATWOUTNUM);
				},
				error: function (err) {}
			});
		},

		validateEquiObject: function (value) {
			var g = this;
			var eqFrm = g._oView.byId("linkFromEQ");
			var eqTo = g._oView.byId("linkToEQ");
			var eqObj = g._oView.byId("linkEquipment");
			var msg = g.getView().getModel("i18n").getProperty("OBJ_ERR_TXT");
			if (eqFrm.getValue() === value && eqTo.getValue() === value && eqObj.getValue() === value) {

				eqFrm.setValueState("Error");
				eqFrm.setValueStateText(msg);
				eqTo.setValueState("Error");
				eqTo.setValueStateText(msg);
				eqObj.setValueState("Error");
				eqObj.setValueStateText(msg);
				g.createMessagePopover(msg, "Error");
				// sap.m.MessageBox.show(msg, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function (oAction) {
				// 	}
				// });
			} else if ((eqFrm.getValue() === value && eqTo.getValue() === value) || (eqFrm.getValue() !== "" && eqTo.getValue() !== "" && eqFrm
					.getValue() === eqTo.getValue())) { //condition modified.

				eqFrm.setValueState("Error");
				eqFrm.setValueStateText(msg);
				eqTo.setValueState("Error");
				eqTo.setValueStateText(msg);
				g.createMessagePopover(msg, "Error");
				// sap.m.MessageBox.show(msg, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function (oAction) {
				// 	}
				// });
			} else if ((eqFrm.getValue() === value && eqObj.getValue() === value) || (eqFrm.getValue() !== "" && eqObj.getValue() !== "" &&
					eqFrm.getValue() === eqObj.getValue())) { //condition modified.
				eqFrm.setValueState("Error");
				eqFrm.setValueStateText(msg);
				eqObj.setValueState("Error");
				eqObj.setValueStateText(msg);
				g.createMessagePopover(msg, "Error");
				// sap.m.MessageBox.show(msg, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function (oAction) {
				// 	}
				// });
			} else if ((eqTo.getValue() === value && eqObj.getValue() === value) || (eqTo.getValue() !== "" && eqObj.getValue() !== "" && eqTo.getValue() ===
					eqObj.getValue())) { //condition modified.
				eqTo.setValueState("Error");
				eqTo.setValueStateText(msg);
				eqObj.setValueState("Error");
				eqObj.setValueStateText(msg);
				g.createMessagePopover(msg, "Error");
				// sap.m.MessageBox.show(msg, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function (oAction) {
				// 	}
				// });
			} else {
				eqTo.setValueState("None");
				eqTo.setValueStateText();
				eqObj.setValueState("None");
				eqObj.setValueStateText();
				eqFrm.setValueState("None");
				eqFrm.setValueStateText();
			}
		},

		validateFlocObject: function (value) {
			var g = this;
			var flFrm = g._oView.byId("linkfrmFl");
			var flTo = g._oView.byId("linkToFl");
			var flObj = g._oView.byId("linkObj1");
			var msg = g.getView().getModel("i18n").getProperty("OBJ_ERR_TXT");
			if (flFrm.getValue() === value && flTo.getValue() === value && flObj.getValue() === value) {
				flFrm.setValueState("Error");
				flFrm.setValueStateText(msg);
				flTo.setValueState("Error");
				flTo.setValueStateText(msg);
				flObj.setValueState("Error");
				flObj.setValueStateText(msg);
				g.createMessagePopover(msg, "Error");
				// sap.m.MessageBox.show(msg, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function (oAction) {
				// 	}
				// });
			} else if ((flFrm.getValue() === value && flTo.getValue() === value) || (flFrm.getValue() !== "" && flTo.getValue() !== "" && flFrm
					.getValue() === flTo.getValue())) { //condition modified. 

				flFrm.setValueState("Error");
				flFrm.setValueStateText(msg);
				flTo.setValueState("Error");
				flTo.setValueStateText(msg);
				g.createMessagePopover(msg, "Error");
				// sap.m.MessageBox.show(msg, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function (oAction) {
				// 	}
				// });
			} else if ((flFrm.getValue() === value && flObj.getValue() === value) || (flFrm.getValue() !== "" && flObj.getValue() !== "" &&
					flFrm.getValue() === flObj.getValue())) { //condition modified. 
				flFrm.setValueState("Error");
				flFrm.setValueStateText(msg);
				flObj.setValueState("Error");
				flObj.setValueStateText(msg);
				g.createMessagePopover(msg, "Error");
				// sap.m.MessageBox.show(msg, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function (oAction) {
				// 	}
				// });
			} else if ((flTo.getValue() === value && flObj.getValue() === value) || (flTo.getValue() !== "" && flObj.getValue() !== "" && flTo.getValue() ===
					flObj.getValue())) { //condition modified. 
				flTo.setValueState("Error");
				flTo.setValueStateText(msg);
				flObj.setValueState("Error");
				flObj.setValueStateText(msg);
				g.createMessagePopover(msg, "Error");
				// sap.m.MessageBox.show(msg, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function (oAction) {
				// 	}
				// });
			} else {
				flTo.setValueState("None");
				flTo.setValueStateText();
				flObj.setValueState("None");
				flObj.setValueStateText();
				flFrm.setValueState("None");
				flFrm.setValueStateText();
			}

		},

		parseRelation: function () {
			var oneWayP = this._oView.byId("oneWayRel");
			var twoWayP = this._oView.byId("twoWayRel");
			if (oneWayP.getSelected()) {
				return "1";
			} else if (twoWayP.getSelected()) {
				return "2";
			} else {
				return "";
			}
		},

		parseRelationUsed: function () {
			var oWayUsd = this._oView.byId("oneWayUsd");
			var tWayUsd = this._oView.byId("twoWayUsd");
			var relNtUsd = this._oView.byId("relNotUsd");
			if (relNtUsd.getSelected()) {
				return "0";
			} else if (oWayUsd.getSelected()) {
				return "1";
			} else if (tWayUsd.getSelected()) {
				return "2";
			} else {
				return "";
			}
		},

		getCurrentDate: function () {
			var date = new Date();
			var mm = date.getMonth();
			var dd = date.getDate();
			var yyyy = date.getFullYear();
			//if (mm < 10) {
			if (mm < 9) { // modified condition as it was giving incorrect value for october month.
				mm = mm + 1;
				mm = "0" + mm;
			} else {
				mm = mm + 1;
			}

			if (dd < 10) {
				dd = "0" + dd;
			}

			return mm + "/" + dd + "/" + yyyy;

		},

		validateDate: function () {
			var cDate = this.getCurrentDate();
			var date = this.getView().byId("validFrm");
			var purchSts = this.getView().byId("purchStatus");
			var flag;
			if (date.getValue() !== null && date.getValue() !== "") {
				if (date.getValue() < cDate) {
					var msg = this.getView().getModel("i18n").getProperty("DATE_MSG");
					date.setValueState("Error");
					flag = false;
					this.createMessagePopover(msg, "Error");
					// sap.m.MessageBox.show(msg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {}
					// });
				} else if (purchSts.getValue() === "" || purchSts.getValue() === null || purchSts.getValue() === undefined) {
					var message = this.getView().getModel("i18n").getProperty("DATE_VALID");
					purchSts.setValueState("Error");
					date.setValueState("None");
					flag = false;
					this.createMessagePopover(message, "Error");
					// sap.m.MessageBox.show(message, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {}
					// });
				} else {
					date.setValueState("None");
					flag = true;
				}
			} else {
				if (purchSts.getValue() !== "") {
					date.setValueState("Error");
					var _msg = this.getView().getModel("i18n").getProperty("DATE_VALID2");
					flag = false;
					this.createMessagePopover(_msg, "Error");
					// sap.m.MessageBox.show(_msg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {}
					// });
				}
			}

			return flag;
		},

		// From date and To date validation
		onDateChange: function () {
			var frm = this._oView.byId("validFrm");
			var to = this._oView.byId("validTo");
			var frmDate = frm.getValue();
			var toDate = to.getValue();

			if (frmDate !== "" && toDate !== "") {
				var frMonth = frmDate.split("/")[0];
				var frDay = frmDate.split("/")[1];
				var frYear = frmDate.split("/")[2];
				var nFrmDate = frYear + frMonth + frDay;

				var toMonth = toDate.split("/")[0];
				var toDay = toDate.split("/")[1];
				var toYear = toDate.split("/")[2];
				var nToDate = toYear + toMonth + toDay;

				if (nFrmDate > nToDate) {
					var msg = this.getView().getModel("i18n").getProperty("DATE_ERR");
					frm.setValueState("Error");
					frm.setValueStateText(msg);
					to.setValueState("Error");
					to.setValueStateText(msg);
					this.createMessagePopover(msg, "Error");
					// sap.m.MessageBox.show(msg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function (oAction) {
					// 	}
					// });
				} else {
					frm.setValueState("None");
					to.setValueState("None");
				}
			}
		},

		//Value Help
		// onNetIdVH: function (oEvent) {
		// 	var g = this;
		// 	var olDetailModel = this.getView().getModel("olDetailModel");

		// 	var settings = {
		// 		title: this.getView().getModel("i18n").getProperty("xtxt.NET_ID"),
		// 		noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
		// 		items: {
		// 			path: "/NetidSet",
		// 			template: new sap.m.StandardListItem({
		// 				title: "{Netwid}",
		// 				description: "{Netxt}"
		// 			})
		// 		},
		// 		confirm: function (E) {
		// 			g.currentObj.netIdVS = "None";
		// 			g.currentObj.netIdVST = "";
		// 			g.currentObj.netIdDesc = E.getParameters().selectedItem.getProperty("description");
		// 			g.currentObj.netId = E.getParameters().selectedItem.getProperty("title");
		// 			olDetailModel.setData(g.currentObj);
		// 		}
		// 	};

		// 	var q = "/NetidSet";
		// 	var M = this.getView().getModel("valueHelp");
		// 	var nSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Netwid", "Netxt");
		// 	nSelectDialog.open();
		// },

		onNetIdVH: function (oEvent) {
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");

			var mpSearchResults;
			if (mpSearchResults === undefined) {
				var mpSelectDialog = new sap.m.SelectDialog({
					title: this.getView().getModel("i18n").getProperty("xtxt.NET_ID"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/NetidSet",
						template: new sap.m.StandardListItem({
							title: "{Netwid}",
							description: "{Netxt}"
						})
					},
					confirm: function (E) {
						g.currentObj.netIdVS = "None";
						g.currentObj.netIdVST = "";
						g.currentObj.netIdDesc = E.getParameters().selectedItem.getProperty("description");
						g.currentObj.netId = E.getParameters().selectedItem.getProperty("title");
						olDetailModel.setData(g.currentObj);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Netwid", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Netxt", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}

					}
				});

				var sPath = "/NetidSet";
				var oModel = g.getView().getModel("valueHelp");
				var fnSuccess = function (h) {
					if (h.results) {
						// if (g._copyFragmentFlag) {
						var oModelData = sap.ui.getCore().getModel("AIWListONModel").getData();
						if (oModelData.length > 0) {
							for (var i = 0; i < oModelData.length; i++) {
								if (oModelData[i].Objnetwrk) {
									var sObj = {
										Netwid: oModelData[i].Objnetwrk,
										Netxt: oModelData[i].Netxt
									};
									h.results.unshift(sObj);
								}
							}
						}
						// }
						mpSearchResults = h;
						var I = new sap.m.StandardListItem({
							title: "{Netwid}",
							description: "{Netxt}",
							active: true
						});
						var e = new sap.ui.model.json.JSONModel();
						e.setData(h);

						mpSelectDialog.setModel(e);
						mpSelectDialog.bindAggregation("items", "/results", I);
					} else {
						mpSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
					}
				};
				var fnError = function () {};
				g._readData(sPath, oModel, fnSuccess, fnError);
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(mpSearchResults);
				mpSelectDialog.setModel(e);
				var I = mpSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			mpSelectDialog.open();
		},

		// onNetIdVH: function (event) {
		// 	var g = this;
		// 	var oSource = event.getSource();
		// 	var Dialog = new sap.m.SelectDialog({
		// 		title: this.getView().getModel("i18n").getProperty("xtxt.NET_ID"),
		// 		noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
		// 		confirm: function (E) {
		// 			g.currentObj.netIdVS = "None";
		// 			g.currentObj.netIdVST = "";
		// 			g.currentObj.netIdDesc = E.getParameters().selectedItem.getProperty("description");
		// 			g.currentObj.netId = E.getParameters().selectedItem.getProperty("title");
		// 			olDetailModel.setData(g.currentObj);
		// 		},
		// 		search: function (E) {
		// 			var sValue = E.getParameter("value");
		// 			E.getSource().getBinding("items").filter(!sValue ? [] : [
		// 				new sap.ui.model.Filter(
		// 					[
		// 						new sap.ui.model.Filter("Netwid", sap.ui.model.FilterOperator.Contains, sValue),
		// 						new sap.ui.model.Filter("Netxt", sap.ui.model.FilterOperator.Contains, sValue)
		// 					],
		// 					false)
		// 			]);
		// 		}
		// 	});

		// 	var results = [];
		// 	var oModelData = sap.ui.getCore().getModel("AIWListONModel").getData();
		// 	if (oModelData.length > 0) {
		// 		for (var i = 0; i < oModelData.length; i++) {
		// 			if (oModelData[i].Objnetwrk !== "") {
		// 				var sObj = {
		// 					Netwid: oModelData[i].Objnetwrk,
		// 					Netxt: oModelData[i].Netxt
		// 				};
		// 				results.unshift(sObj);
		// 			}
		// 		}
		// 	}

		// 	var I = new sap.m.StandardListItem({
		// 		title: "{Netwid}",
		// 		description: "{Netxt}",
		// 		active: true
		// 	});
		// 	var e = new sap.ui.model.json.JSONModel();
		// 	e.setData(results);
		// 	e.isSizeLimit = results.length;
		// 	e.setSizeLimit(results.length);
		// 	Dialog.setModel(e);
		// 	Dialog.setGrowingThreshold(results.length);
		// 	Dialog.bindAggregation("items", "/", I);
		// 	Dialog.setModel(g.getView().getModel("i18n"), "i18n");
		// 	Dialog.open();
		// },

		onStatProfVH: function (oEvent) {
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");

			var settings = {
				title: this.getView().getModel("i18n").getProperty("xtxt.STS_PROF"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/StatusProfileSet",
					template: new sap.m.StandardListItem({
						title: "{Stsma}",
						description: "{Txt}"
					})
				},
				confirm: function (E) {
					g.currentObj.stsProfVS = "None";
					g.currentObj.stsProfVST = "";
					g.currentObj.stsProfDesc = E.getParameters().selectedItem.getProperty("description");
					g.currentObj.stsProf = E.getParameters().selectedItem.getProperty("title");
					olDetailModel.setData(g.currentObj);
					var value = E.getParameters().selectedItem.getProperty("title");
					g.readStatusDetails(value);
				}
			};

			var q = "/StatusProfileSet";
			var M = this.getView().getModel("valueHelp");
			var spSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Stsma", "Txt");
			spSelectDialog.open();
		},

		onStatusVH: function (oEvent) {
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			/*var m = this.getView().byId("stsObj");
			var d = this.getView().byId("stsObjDesc");
			var s = this.getView().byId("stsProf").getValue();*/
			var s = g.currentObj.stsProf;

			var settings = {
				title: this.getView().getModel("i18n").getProperty("xtxt.STS_OBJ"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>STS_PROF}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>USER_STS}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>DESCRIPTION}"
							})
						]
					})
				],
				items: {
					path: "/StatValueHelpSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{STSMA}"
							}),
							new sap.m.Text({
								text: "{WGBEZ}"
							}),
							new sap.m.Text({
								text: "{TXT30}"
							})
						]
					})
				},
				confirm: function (E) {
					/*m.setValueState("None");
					m.setValueStateText("");
					m.setValue(E.getParameter("selectedItem").getCells()[1].getText());*/
					// d.setValue(E.getParameter("selectedItem").getCells()[2].getText());
					g.currentObj.stsObjVS = "None";
					g.currentObj.stsObjVST = "";
					g.currentObj.stsObj = E.getParameter("selectedItem").getCells()[1].getText();
					olDetailModel.setData(g.currentObj);
				}
			};
			var oFilter = [new sap.ui.model.Filter("STONR_FLAG", "EQ", "WI"),
				new sap.ui.model.Filter("STSMA", "EQ", s)
			];
			var q = "/StatValueHelpSet";

			var M = this.getView().getModel("valueHelp");
			var cells = [
				new sap.m.Text({
					text: "{STSMA}"
				}),
				new sap.m.Text({
					text: "{ESTAT}"
				}),
				new sap.m.Text({
					text: "{TXT30}"
				})
			];

			var stSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilter, settings, "ESTAT", "TXT30");
			stSelectDialog.open();
			stSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onStatusWOVH: function (oEvent) {
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			//var m = this.getView().byId("stsWoNo");
			//var s = this.getView().byId("stsProf").getValue();
			var s = g.currentObj.stsProf;

			var settings = {
				title: this.getView().getModel("i18n").getProperty("xtxt.STS_WO_NO"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				multiSelect: true,
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>STS_PROF}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>USER_STS}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>DESCRIPTION}"
							})
						]
					})
				],
				items: {
					path: "/StatValueHelpSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{STSMA}"
							}),
							new sap.m.Text({
								text: "{WGBEZ}"
							}),
							new sap.m.Text({
								text: "{TXT30}"
							})
						]
					})
				},
				confirm: function (E) {
					/*m.setValueState("None");
					m.setValueStateText("");
					m.setValue(E.getParameter("selectedItem").getCells()[1].getText());*/
					var aContexts = E.getParameter("selectedContexts");
					g.currentObj.stsWoNoVS = "None";
					g.currentObj.stsWoNoVST = "";
					g.currentObj.stsWoNo = aContexts.map(function (oContext) {
						return oContext.getObject().ESTAT;
					}).join(" "); //E.getParameter("selectedItem").getCells()[1].getText();
					olDetailModel.setData(g.currentObj);
				}
			};
			var oFilter = [new sap.ui.model.Filter("STONR_FLAG", "EQ", "WO"),
				new sap.ui.model.Filter("STSMA", "EQ", s)
			];
			var q = "/StatValueHelpSet";

			var M = this.getView().getModel("valueHelp");
			var cells = [
				new sap.m.Text({
					text: "{STSMA}"
				}),
				new sap.m.Text({
					text: "{ESTAT}"
				}),
				new sap.m.Text({
					text: "{TXT30}"
				})
			];

			var stWSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilter, settings, "ESTAT", "TXT30");
			stWSelectDialog.open();
			stWSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onEquipVH: function (oEvent) {
			var g = this;
			/*var sPath = oEvent.getSource().getBindingContext("AIWListOLModel").getPath();
			g.sindex = parseInt(sPath.split("/")[1]);
			var olData = oEvent.getSource().getBindingContext("AIWListOLModel").getModel().getData();
			var AIWListOLModel = sap.ui.getCore().getModel("AIWListOLModel");*/
			var olDetailModel = this.getView().getModel("olDetailModel");
			var bindingPath;
			var tInput = oEvent.getSource().mBindingInfos.value.binding;
			if (tInput !== undefined && tInput !== null) {
				bindingPath = tInput.sPath;
			} else {
				bindingPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
			}
			bindingPath = bindingPath.substring(1);
			var eSearchResults;
			if (eSearchResults === undefined) {
				var eSelectDialog = new sap.m.SelectDialog({
					title: this.getView().getModel("i18n").getProperty("EQUIPMENT"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/EquipmentNumberSet",
						template: new sap.m.StandardListItem({
							title: "{Equnr}",
							description: "{Eqktx}"
						})
					},
					confirm: function (E) {
						if (bindingPath === "linkFrmEq") {
							g.currentObj.linkFrmEqVS = "None";
							g.currentObj.linkFrmEqVST = "";
							g.currentObj.linkFrmEq = E.getParameters().selectedItem.getProperty("title");
							g.currentObj.linkFrmEqDesc = E.getParameters().selectedItem.getProperty("description");
						} else if (bindingPath === "linkToEq") {
							g.currentObj.linkToEqVS = "None";
							g.currentObj.linkToEqVST = "";
							g.currentObj.linkToEq = E.getParameters().selectedItem.getProperty("title");
							g.currentObj.linkToEqDesc = E.getParameters().selectedItem.getProperty("description");
						} else if (bindingPath === "linkObjEq") {
							g.currentObj.linkObjEqVS = "None";
							g.currentObj.linkObjEqVST = "";
							g.currentObj.linkObjEq = E.getParameters().selectedItem.getProperty("title");
							g.currentObj.linkObjEqDesc = E.getParameters().selectedItem.getProperty("description");
						}
						olDetailModel.setData(g.currentObj);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Equnr", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Eqktx", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				var q = "/EquipmentNumberSet";

				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						if (h.results.length > 0) {
							var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].Equnr) {
										var sObj = {
											Equnr: oModelData[i].Equnr,
											Eqktx: oModelData[i].Eqktx
										};
										h.results.unshift(sObj);
									}
								}
							}
							eSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Equnr}",
								description: "{Eqktx}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							eSelectDialog.setModel(e);
							// eSelectDialog.setGrowingThreshold(h.results.length);
							eSelectDialog.bindAggregation("items", "/results", I);
						} else {
							eSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(eSearchResults);
				eSelectDialog.setModel(e);
				var I = eSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			eSelectDialog.open();
		},

		onFlocVH: function (oEvent) {
			var g = this;
			/*var sPath = oEvent.getSource().getBindingContext("AIWListOLModel").getPath();
			g.sindex = parseInt(sPath.split("/")[1]);
			var olData = oEvent.getSource().getBindingContext("AIWListOLModel").getModel().getData();
			var AIWListOLModel = sap.ui.getCore().getModel("AIWListOLModel");*/
			var olDetailModel = this.getView().getModel("olDetailModel");
			var bindingPath;
			var tInput = oEvent.getSource().mBindingInfos.value.binding;
			if (tInput !== undefined && tInput !== null) {
				bindingPath = tInput.sPath;
			} else {
				bindingPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
			}
			bindingPath = bindingPath.substring(1);
			var fSearchResults;
			if (fSearchResults === undefined) {
				var fSelectDialog = new sap.m.SelectDialog({
					title: this.getView().getModel("i18n").getProperty("FLOC"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						// path: "/FunclocSHSet",
						path: "/FunctionLocationSet",
						template: new sap.m.StandardListItem({
							title: "{Tplnr}",
							description: "{Pltxt}"
						})
					},
					confirm: function (E) {
						if (bindingPath === "linkFrmFl") {
							g.currentObj.linkFrmFlVS = "None";
							g.currentObj.linkFrmFlVST = "";
							g.currentObj.linkFrmFl = E.getParameters().selectedItem.getProperty("title");
							g.currentObj.linkFrmFlDesc = E.getParameters().selectedItem.getProperty("description");
						} else if (bindingPath === "linkToFl") {
							g.currentObj.linkToFlVS = "None";
							g.currentObj.linkToFlVST = "";
							g.currentObj.linkToFl = E.getParameters().selectedItem.getProperty("title");
							g.currentObj.linkToFlDesc = E.getParameters().selectedItem.getProperty("description");
						} else if (bindingPath === "linkObjFl") {
							g.currentObj.linkObjFlVS = "None";
							g.currentObj.linkObjFlVST = "";
							g.currentObj.linkObjFl = E.getParameters().selectedItem.getProperty("title");
							g.currentObj.linkObjFlDesc = E.getParameters().selectedItem.getProperty("description");
						}
						olDetailModel.setData(g.currentObj);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Tplnr", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Pltxt", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				// var q = "/FunclocSHSet";
				var q = "/FunctionLocationSet";

				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						if (h.results.length > 0) {
							var oModelData = sap.ui.getCore().getModel("AIWFLOC").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].Functionallocation) {
										var sObj = {
											Tplnr: oModelData[i].Functionallocation,
											Pltxt: oModelData[i].Flocdescription
										};
										h.results.unshift(sObj);
									}
								}
							}
							fSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Tplnr}",
								description: "{Pltxt}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							fSelectDialog.setModel(e);
							// fSelectDialog.setGrowingThreshold(h.results.length);
							fSelectDialog.bindAggregation("items", "/results", I);
						} else {
							fSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(fSearchResults);
				fSelectDialog.setModel(e);
				var I = fSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			fSelectDialog.open();
		},

		onAuthGrpVH: function (oEvent) {
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");

			var settings = {
				title: this.getView().getModel("i18n").getProperty("xtxt.AUTH_GRP"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/AuthGroupValueHelpSet",
					template: new sap.m.StandardListItem({
						title: "{BEGRU}",
						description: "{BEGTX}"
					})
				},
				confirm: function (E) {
					g.currentObj.autGrpVS = "None";
					g.currentObj.autGrpVST = "";
					g.currentObj.autGrp = E.getParameters().selectedItem.getProperty("title");
					g.currentObj.autGrpDesc = E.getParameters().selectedItem.getProperty("description");
					olDetailModel.setData(g.currentObj);
				}
			};

			var q = "/AuthGroupValueHelpSet";
			var M = this.getView().getModel("valueHelp");
			var aSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "BEGRU", "BEGTX");
			aSelectDialog.open();
		},

		onMediumVH: function (oEvent) {
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");

			var settings = {
				title: this.getView().getModel("i18n").getProperty("MED"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/MediumValueHelpSet",
					template: new sap.m.StandardListItem({
						title: "{MEDIU}",
						description: "{MEDKXT}"
					})
				},
				confirm: function (E) {
					g.currentObj.mediumVS = "None";
					g.currentObj.mediumVST = "";
					g.currentObj.mediumDesc = E.getParameters().selectedItem.getProperty("description");
					g.currentObj.medium = E.getParameters().selectedItem.getProperty("title");
					olDetailModel.setData(g.currentObj);
				}
			};

			var q = "/MediumValueHelpSet";
			var M = this.getView().getModel("valueHelp");
			var mSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "MEDIU", "MEDKXT");
			mSelectDialog.open();
		},

		onLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		onLinkCatChange: function (oEvent) {
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			var linkCatModel = this.getView().getModel("linkCatModel");
			var linkCatData = linkCatModel.getData();

			if (g.currentObj.linkCat !== "") {
				for (var i = 0; i < linkCatData.length; i++) {
					if (linkCatData[i].NETYP === g.currentObj.linkCat) {
						g.currentObj.linkCatEn = false;
						g.currentObj.linkCatDesc = linkCatData[i].TYPTX;
					}
				}
				this.readStatusProf(g.currentObj.linkCat);
			} else {
				g.currentObj.linkCatEn = true;
			}
			olDetailModel.setData(g.currentObj);
		},

		onObjCatChange: function (oEvent) {
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");

			var objCatModel = this.getView().getModel("objCatModel");
			var objCatData = objCatModel.getData();

			for (var i = 0; i < objCatData.length; i++) {
				if (objCatData[i].Kantyp === g.currentObj.objCat) {
					g.currentObj.objCatEn = false;
					g.currentObj.objCatDesc = objCatData[i].Kantyp_txt;
				}
			}

			if (g.currentObj.objCat === "E") {
				// g.currentObj.objCatDesc = g.currentObj.Kantyp_txt;
				g.currentObj.linkCatEn = false;
				g.currentObj.linkFrmFlEn = false;
				g.currentObj.linkToFlEn = false;
				g.currentObj.linkObjFlEn = false;
				g.currentObj.linkFEqLblRQ = true;
				g.currentObj.linkToEqLblRQ = true;
				g.currentObj.linkFrmflLblV = false;
				g.currentObj.linkFrmFlV = false;
				g.currentObj.linkFrmFlDescV = false;
				g.currentObj.linkToFlLblV = false;
				g.currentObj.linkToFlV = false;
				g.currentObj.linkToFlDescV = false;
				g.currentObj.linkObjFlLblV = false;
				g.currentObj.linkObjFlV = false;
				g.currentObj.linkObjFlDescV = false;

			} else if (g.currentObj.objCat === "T") {
				// g.currentObj.objCatDesc = g.currentObj.Kantyp_txt;
				g.currentObj.linkCatEn = false;
				g.currentObj.linkFromEQEn = false;
				g.currentObj.linkToEQEn = false;
				g.currentObj.linkObjEqEn = false;
				g.currentObj.linkFrmflLblRQ = true;
				g.currentObj.linkToFlLblRQ = true;
				g.currentObj.linkFrmEqLblV = false;
				g.currentObj.linkFrmEqV = false;
				g.currentObj.linkFrmEqDescV = false;
				g.currentObj.linkToEqLblV = false;
				g.currentObj.linkToEQV = false;
				g.currentObj.linkToEqDescV = false;
				g.currentObj.linkObjEqLblV = false;
				g.currentObj.linkObjEqV = false;
				g.currentObj.linkObjEqDescV = false;

			} else if (g.currentObj.objCat === "") {
				g.currentObj.linkCatEn = true;
			}
			olDetailModel.setData(g.currentObj);
		},

		reasSystemStatus: function () {
			var g = this;
			var ObjTyp = this.getObTab();
			var m = this.getView().getModel("valueHelp");
			var query = "/SystemStatValueHelpSet(STSMA=' ',ObjTyp='" + ObjTyp + "')";
			m.read(query, {
				success: function (r) {
					g._oView.byId("systemStatus").setValue(r.TXT04);

				},
				error: function (err) {}
			});
		},

		readStatusProf: function (d, oEvent) {
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			var m = this.getView().getModel();
			//var q = "/DeriveOLstatusSet(NETYP='" + d + "',STSMA='')";
			var q = "/DeriveOLstatusSet(Netyp='" + d + "',Lvorm=false)";
			m.read(q, {
				success: function (r) {
					// if (r.results.length > 0) {
					//if (r.DESC_STSMA !== "" && r.Ustw_oln !== "" && r.Uswo_oln !== "'") {
					if (r.Statproftxt !== "" && (r.Ustw_oln !== "" || r.Uswo_oln !== "")) { //SAP Note 2598463 - Manual Correction
						g.currentObj.usrSts = r.Usta_oln;
						g.currentObj.stProfLblV = true;
						g.currentObj.stsProf = r.Stsm_oln;
						g.currentObj.stsProfV = true;
						g.currentObj.stsProfDesc = r.Statproftxt;
						g.currentObj.stsProfDescV = true;
						g.currentObj.stsObj = r.Ustw_oln;
						g.currentObj.stsObjLblV = true;
						g.currentObj.stsObjV = true;
						g.currentObj.stsWoLblV = true;
						g.currentObj.stsWoNoV = true;
						g.currentObj.stsWoNo = r.Uswo_oln;
						g.currentObj.sysSts = r.Stattext;
					} else {
						g.currentObj.stProfLblV = false;
						g.currentObj.stsProfV = false;
						g.currentObj.stsProfDescV = false;
						g.currentObj.stsObjLblV = false;
						g.currentObj.stsObjV = false;
						g.currentObj.stsWoLblV = false;
						g.currentObj.stsWoNoV = false;
						g.currentObj.usrSts = "";
						g.currentObj.stsProf = "";
						g.currentObj.stsProfDesc = "";
						g.currentObj.stsObj = "";
						g.currentObj.stsWoNo = "";
						g.currentObj.sysSts = "";
					}
					olDetailModel.setData(g.currentObj);
					// }
				},
				error: function (err) {}
			});
		},

		// On Change
		onVHChange: function (oEvent) {
			var value = oEvent.getSource().getValue();
			var bindingPath;
			var tInput = oEvent.getSource().mBindingInfos.value.binding;
			if (tInput !== undefined && tInput !== null) {
				bindingPath = tInput.sPath;
			} else {
				bindingPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
			}
			bindingPath = bindingPath.substring(1);
			switch (bindingPath) {
			case "netId":
				this._networkId(value, oEvent);
				break;
			case "stsProf":
				this._statProfile(value, oEvent);
				break;
			case "stsObj":
				this._statObj(value, oEvent);
				break;
			case "stsWoNo":
				this._statWONum(value, oEvent);
				break;
			case "linkFrmEq":
				this._equipment(value, oEvent);
				break;
			case "linkToEq":
				this._equipment(value, oEvent);
				break;
			case "linkObjEq":
				this._equipment(value, oEvent);
				break;
			case "linkFrmFl":
				this._floc(value, oEvent);
				break;
			case "linkToFl":
				this._floc(value, oEvent);
				break;
			case "linkObjFl":
				this._floc(value, oEvent);
				break;
			case "autGrp":
				this._authGroup(value, oEvent);
				break;
			case "medium":
				this._medium(value, oEvent);
				break;
			}
		},

		_networkId: function (f, oEvent) {
			var c = f.toUpperCase().trim();
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var oModelData = sap.ui.getCore().getModel("AIWListONModel").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						if (a === oModelData[i].Objnetwrk) {
							g.currentObj.netIdDesc = oModelData[i].Netxt;
							g.currentObj.netId = oModelData[i].Objnetwrk;
							g.currentObj.netIdVS = "None";
							olDetailModel.setData(g.currentObj);
							return;
						}
					}
				}
				var oFilter = [new sap.ui.model.Filter("Netwid", "EQ", c)];
				var q = "/NetidSet";
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.currentObj.netIdDesc = d.results[0].Netxt;
							g.currentObj.netId = a;
							g.currentObj.netIdVS = "None";
							olDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.netIdVS = "Error";
							g.currentObj.netIdDesc = "";
							g.currentObj.netIdVST = "Invalid Entry";
							olDetailModel.setData(g.currentObj);
						}

					},
					error: function (e) {
						g.currentObj.netIdVS = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.netIdVST = d;
						olDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.netId = a;
				olDetailModel.setData(g.currentObj);
			}
		},

		_statProfile: function (f, oEvent) {
			var c = f.toUpperCase();
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var oFilter = [new sap.ui.model.Filter("Obtyp", "EQ", "INET"),
					new sap.ui.model.Filter("Stsma", "EQ", c)
				];
				var q = "/StatusProfileSet";
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.currentObj.stsProfDesc = d.results[0].Txt;
							g.currentObj.stsProf = a;
							olDetailModel.setData(g.currentObj);
							g.readStatusDetails(c);
						} else {
							g.currentObj.stsProfVS = "Error";
							g.currentObj.stsProfDesc = "";
							g.currentObj.stsProfVST = "Invalid Entry";
							olDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.stsProfVS = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.stsProfVST = d;
						olDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.stsProf = a;
				olDetailModel.setData(g.currentObj);
			}
		},

		_statObj: function (f, oEvent) {
			var c = f.toUpperCase();
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			// var s = this.getView().byId("stsProf").getValue();
			var s = g.currentObj.stsProf;
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var oFilter = [new sap.ui.model.Filter("STONR_FLAG", "EQ", "WI"),
					new sap.ui.model.Filter("Txt04", "EQ", c),
					new sap.ui.model.Filter("Stsma", "EQ", s)
				];
				var q = "/StatValueHelpSet";
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.currentObj.stsObj = a;
							olDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.stsObjVS = "Error";
							g.currentObj.stsObjVST = "Invalid Entry";
							olDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.stsObjVS = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.stsObjVST = d;
						olDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.stsProf = a;
				olDetailModel.setData(g.currentObj);
			}
		},

		_statWONum: function (f, oEvent) {
			var c = f.toUpperCase();
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			// var s = this.getView().byId("stsProf").getValue();
			var s = g.currentObj.stsProf;
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var oFilter = [new sap.ui.model.Filter("STONR_FLAG", "EQ", "WO"),
					new sap.ui.model.Filter("Txt04", "EQ", c),
					new sap.ui.model.Filter("Stsma", "EQ", s)
				];
				var q = "/StatValueHelpSet";
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.currentObj.stsWoNo = a;
							olDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.stsWoNoVS = "Error";
							g.currentObj.stsWoNoVST = "Invalid Entry";
							olDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.stsWoNoVS = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.stsWoNoVST = d;
						olDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.stsWoNo = a;
				olDetailModel.setData(g.currentObj);
			}
		},

		_authGroup: function (f, oEvent) {
			var c = f.toUpperCase();
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var oFilter = [new sap.ui.model.Filter("BEGRU", "EQ", c)];
				var q = "/AuthGroupValueHelpSet";
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.currentObj.autGrpDesc = d.results[0].BEGTX;
							g.currentObj.autGrp = a;
							olDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.autGrpVS = "Error";
							g.currentObj.autGrpDesc = "";
							g.currentObj.autGrpVST = "Invalid Entry";
							olDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.autGrpVS = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.autGrpVST = d;
						olDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.autGrp = a;
				olDetailModel.setData(g.currentObj);
			}
		},

		_medium: function (f, oEvent) {
			var c = f.toUpperCase();
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			// var cd = this.getView().byId("mediumDesc");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var oFilter = [new sap.ui.model.Filter("MEDIU", "EQ", c)];
				var q = "/MediumValueHelpSet";
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.currentObj.mediumDesc = d.results[0].MEDKXT;
							g.currentObj.medium = a;
							olDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.mediumVS = "Error";
							g.currentObj.mediumDesc = "";
							g.currentObj.mediumVST = "Invalid Entry";
							olDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.mediumVS = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.mediumVST = d;
						olDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.medium = a;
				olDetailModel.setData(g.currentObj);
			}
		},

		onNumberChange: function () {
			var g = this;
			var olDetailModel = this.getView().getModel("olDetailModel");
			var n = this.getView().byId("number");
			if (n.getValue() === "") {
				n.setValue("1");
			}
			g.currentObj.linkNumVS = "None";
			olDetailModel.setData(g.currentObj);

		},

		_equipment: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var olDetailModel = this.getView().getModel("olDetailModel");
			var bindingPath;
			var tInput = oEvent.getSource().mBindingInfos.value.binding;
			if (tInput !== undefined && tInput !== null) {
				bindingPath = tInput.sPath;
			} else {
				bindingPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
			}
			bindingPath = bindingPath.substring(1);
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//var q = "/EquipmentNumberSet?$filter=" + jQuery.sap.encodeURL("Equnr eq '" + c + "'");
				var m = this.getView().getModel("valueHelp");
				var q = "/EquipmentNumberSet";
				var oFilter = [new sap.ui.model.Filter("Equnr", "EQ", c)];
				var lData = false;

				var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						if (oModelData[i].Equnr === c) {
							if (bindingPath === "linkFrmEq") {
								g.currentObj.linkFrmEqVS = "None";
								g.currentObj.linkFrmEqVST = "";
								g.currentObj.linkFrmEq = a;
								g.currentObj.linkFrmEqDesc = oModelData[i].Eqktx;
								lData = true;
							} else if (bindingPath === "linkToEq") {
								g.currentObj.linkToEqVS = "None";
								g.currentObj.linkToEqVST = "";
								g.currentObj.linkToEq = a;
								g.currentObj.linkToEqDesc = oModelData[i].Eqktx;
								lData = true;
							} else if (bindingPath === "linkObjEq") {
								g.currentObj.linkObjEqVS = "None";
								g.currentObj.linkObjEqVST = "";
								g.currentObj.linkObjEq = a;
								g.currentObj.linkObjEqDesc = oModelData[i].Eqktx;
								lData = true;
							}
							olDetailModel.setData(g.currentObj);
						}
					}
				}
				if (lData === true) {
					return;
				} else {
					m.read(q, {
						filters: oFilter,
						success: function (d, e) {
							if (d.results.length > 0) {
								if (bindingPath === "linkFrmEq") {
									g.currentObj.linkFrmEqVS = "None";
									g.currentObj.linkFrmEqVST = "";
									g.currentObj.linkFrmEq = a;
									g.currentObj.linkFrmEqDesc = d.results[0].Eqktx;
								} else if (bindingPath === "linkToEq") {
									g.currentObj.linkToEqVS = "None";
									g.currentObj.linkToEqVST = "";
									g.currentObj.linkToEq = a;
									g.currentObj.linkToEqDesc = d.results[0].Eqktx;
								} else if (bindingPath === "linkObjEq") {
									g.currentObj.linkObjEqVS = "None";
									g.currentObj.linkObjEqVST = "";
									g.currentObj.linkObjEq = a;
									g.currentObj.linkObjEqDesc = d.results[0].Eqktx;
								}
								olDetailModel.setData(g.currentObj);
							} else {
								if (bindingPath === "linkFrmEq") {
									g.currentObj.linkFrmEqVS = "Error";
									g.currentObj.linkFrmEqDesc = "";
									g.currentObj.linkFrmEqVST = "Invalid Entry";
								} else if (bindingPath === "linkToEq") {
									g.currentObj.linkToEqVS = "Error";
									g.currentObj.linkToEqDesc = "";
									g.currentObj.linkToEqVST = "Invalid Entry";
								} else if (bindingPath === "linkObjEq") {
									g.currentObj.linkObjEqVS = "Error";
									g.currentObj.linkObjEqDesc = "";
									g.currentObj.linkObjEqVST = "Invalid Entry";
								}
								olDetailModel.setData(g.currentObj);
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
							g.showMessage(value);
							if (bindingPath === "linkFrmEq") {
								g.currentObj.linkFrmEqVS = "Error";
							} else if (bindingPath === "linkToEq") {
								g.currentObj.linkToEqVS = "Error";
							} else if (bindingPath === "linkObjEq") {
								g.currentObj.linkObjEqVS = "Error";
							}
							olDetailModel.setData(g.currentObj);
						}
					});
				}
			} else {
				if (bindingPath === "linkFrmEq") {
					g.currentObj.linkFrmEq = a;
				} else if (bindingPath === "linkToEq") {
					g.currentObj.linkToEq = a;
				} else if (bindingPath === "linkObjEq") {
					g.currentObj.linkObjEq = a;
				}
				olDetailModel.setData(g.currentObj);
			}
		},

		_floc: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var olDetailModel = this.getView().getModel("olDetailModel");
			var bindingPath;
			var tInput = oEvent.getSource().mBindingInfos.value.binding;
			if (tInput !== undefined && tInput !== null) {
				bindingPath = tInput.sPath;
			} else {
				bindingPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
			}
			bindingPath = bindingPath.substring(1);
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//var q = "/FunctLocatnVHSet?$filter=" + jQuery.sap.encodeURL("TPLNR eq '" + c + "'");
				var m = this.getView().getModel("valueHelp");
				// var q = "/FunclocSHSet";
				var q = "/FunctionLocationSet";
				var oFilter = [new sap.ui.model.Filter("Tplnr", "EQ", c)];
				var lData = false;

				var oModelData = sap.ui.getCore().getModel("AIWFLOC").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						if (oModelData[i].Functionallocation === c) {
							if (bindingPath === "linkFrmFl") {
								g.currentObj.linkFrmFlVS = "None";
								g.currentObj.linkFrmFlVST = "";
								g.currentObj.linkFrmFl = a;
								g.currentObj.linkFrmFlDesc = oModelData[i].Flocdescription;
								lData = true;
							} else if (bindingPath === "linkToFl") {
								g.currentObj.linkToFlVS = "None";
								g.currentObj.linkToFlVST = "";
								g.currentObj.linkToFl = a;
								g.currentObj.linkToFlDesc = oModelData[i].Flocdescription;
								lData = true;
							} else if (bindingPath === "linkObjFl") {
								g.currentObj.linkObjFlVS = "None";
								g.currentObj.linkObjFlVST = "";
								g.currentObj.linkObjFl = a;
								g.currentObj.linkObjFlDesc = oModelData[i].Flocdescription;
								lData = true;
							}
							olDetailModel.setData(g.currentObj);
						}
					}
				}
				if (lData === true) {
					return;
				} else {
					m.read(q, {
						filters: oFilter,
						success: function (d, e) {
							if (d.results.length > 0) {
								if (bindingPath === "linkFrmFl") {
									g.currentObj.linkFrmFlVS = "None";
									g.currentObj.linkFrmFlVST = "";
									g.currentObj.linkFrmFl = a;
									g.currentObj.linkFrmFlDesc = d.results[0].Pltxt;
								} else if (bindingPath === "linkToFl") {
									g.currentObj.linkToFlVS = "None";
									g.currentObj.linkToFlVST = "";
									g.currentObj.linkToFl = a;
									g.currentObj.linkToFlDesc = d.results[0].Pltxt;
								} else if (bindingPath === "linkObjFl") {
									g.currentObj.linkObjFlVS = "None";
									g.currentObj.linkObjFlVST = "";
									g.currentObj.linkObjFl = a;
									g.currentObj.linkObjFlDesc = d.results[0].Pltxt;
								}
								olDetailModel.setData(g.currentObj);
							} else {
								if (bindingPath === "linkFrmFl") {
									g.currentObj.linkFrmFlVS = "Error";
									g.currentObj.linkFrmFlVST = "Invalid Entry";
									g.currentObj.linkFrmFlDesc = "";
								} else if (bindingPath === "linkToFl") {
									g.currentObj.linkToFlVS = "Error";
									g.currentObj.linkToFlVST = "Invalid Entry";
									g.currentObj.linkToFlDesc = "";
								} else if (bindingPath === "linkObjFl") {
									g.currentObj.linkObjFlVS = "Error";
									g.currentObj.linkObjFlDesc = "";
									g.currentObj.linkObjFlVST = "Invalid Entry";
								}
								olDetailModel.setData(g.currentObj);
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
							g.showMessage(value);
							if (bindingPath === "linkFrmFl") {
								g.currentObj.linkFrmFlVS = "Error";
							} else if (bindingPath === "linkToFl") {
								g.currentObj.linkToFlVS = "Error";
							} else if (bindingPath === "linkObjFl") {
								g.currentObj.linkObjFlVS = "Error";
							}
							olDetailModel.setData(g.currentObj);
						}
					});
				}
			} else {
				if (bindingPath === "linkFrmFl") {
					g.currentObj.linkFrmFl = a;
				} else if (bindingPath === "linkToFl") {
					g.currentObj.linkToFl = a;
				} else if (bindingPath === "linkObjFl") {
					g.currentObj.linkObjFl = a;
				}
				olDetailModel.setData(g.currentObj);
			}
		},

		onLinkLamPress: function (oEvent) {
			this._showLamDetail(oEvent.getSource());
		},

		_showLamDetail: function (oItem) {
			var sPath = oItem.oBindingContexts.olDetailModel.sPath;
			this.getRouter().navTo("linkLamDetail", {
				itemPath: encodeURIComponent(sPath)
			});
		},

		// attachRequest: function () {
		// 	var view = this._oView;
		// 	var that = this;
		// 	/*view.byId("type").attachValueHelpRequest(function(e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	view.byId("type").attachChange(function(e) {
		// 		that.onChange(e);
		// 	});
		// 	view.byId("type").attachSubmit(function(e) {
		// 		that.onChange(e);
		// 	});
		// 	view.byId("class").attachValueHelpRequest(function(e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	view.byId("class").attachChange(function(e) {
		// 		that.onChange(e);
		// 	});
		// 	view.byId("class").attachSubmit(function(e) {
		// 		that.onChange(e);
		// 	});
		// 	view.byId("status").attachValueHelpRequest(function(e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	view.byId("status").attachChange(function(e) {
		// 		that.onChange(e);
		// 	});
		// 	view.byId("status").attachSubmit(function(e) {
		// 		that.onChange(e);
		// 	});
		// 	view.byId("charName").attachValueHelpRequest(function(e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	view.byId("charName").attachChange(function(e) {
		// 		that.onChange(e);
		// 	});
		// 	view.byId("charName").attachSubmit(function(e) {
		// 		that.onChange(e);
		// 	});
		// 	view.byId("charValue").attachValueHelpRequest(function(e) {
		// 		that.valueHelpSelect(e);
		// 	});*/
		// 	var classFragmentId = view.createId("clsFrag");
		// 	var type = sap.ui.core.Fragment.byId(classFragmentId, "type");
		// 	var fclass = sap.ui.core.Fragment.byId(classFragmentId, "class");
		// 	var status = sap.ui.core.Fragment.byId(classFragmentId, "status");
		// 	var itemFragmentId = view.createId("charFrag");
		// 	var charName = sap.ui.core.Fragment.byId(itemFragmentId, "charName");
		// 	var charValue = sap.ui.core.Fragment.byId(itemFragmentId, "charValue");
		// 	type.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	type.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	type.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	fclass.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	fclass.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	fclass.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	status.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	status.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	status.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	charName.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	charName.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	charName.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	charValue.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});

		// },
		attachRequest: function () {
			var classFragmentId = this.getView().createId("clsFrag");
			var itemFragmentId = this.getView().createId("charFrag");

			var vTypeClass = sap.ui.core.Fragment.byId(classFragmentId, "type");
			var vClass = sap.ui.core.Fragment.byId(classFragmentId, "class");
			var vStatus = sap.ui.core.Fragment.byId(classFragmentId, "status");
			var vCharName = sap.ui.core.Fragment.byId(itemFragmentId, "charName");
			var vCharValue = sap.ui.core.Fragment.byId(itemFragmentId, "charValue");
			var vCharAdd = sap.ui.core.Fragment.byId(itemFragmentId, "charValueAdd");
			var vCharClr = sap.ui.core.Fragment.byId(itemFragmentId, "charValueClear");
			var vCharDel = sap.ui.core.Fragment.byId(itemFragmentId, "charValueDelete");

			var that = this;
			// vTypeClass.attachValueHelpRequest(function (e) {
			//            that.valueHelpSelect(e);
			// });
			// vTypeClass.attachChange(function (e) {
			//            that.onChange(e);
			// });
			// vTypeClass.attachSubmit(function (e) {
			//            that.onChange(e);
			// });
			// vClass.attachValueHelpRequest(function (e) {
			//            that.valueHelpSelect(e);
			// });
			// vClass.attachChange(function (e) {
			//            that.onChange(e);
			// });
			// vClass.attachSubmit(function (e) {
			//            that.onChange(e);
			// });
			vCharAdd.attachPress(function (e) {
				ClassUtils.handleSelCharAdd(e);
			});
			vCharClr.attachPress(function (e) {
				ClassUtils.handleCharClear(e);
			});
			vCharDel.attachPress(function (e) {
				ClassUtils.charRowDeletePress(e);
			});
			vCharValue.attachChange(function (e) {
				that.onChange(e);
			});
			// vStatus.attachValueHelpRequest(function (e) {
			//            that.valueHelpSelect(e);
			// });
			// vStatus.attachChange(function (e) {
			//            that.onChange(e);
			// });
			// vStatus.attachSubmit(function (e) {
			//            that.onChange(e);
			// });
			// vCharName.attachValueHelpRequest(function (e) {
			//            that.valueHelpSelect(e);
			// });
			// vCharName.attachChange(function (e) {
			//            that.onChange(e);
			// });
			// vCharName.attachSubmit(function (e) {
			//            that.onChange(e);
			// });
			// vCharValue.attachValueHelpRequest(function (e) {
			//            that.valueHelpSelect(e);
			// });
		},

		valueHelpSelect: function (c) {
			var pObTab = this.getObTab();
			var id = c.getSource().getId().split("tskL--");
			id = id[1];

			if (c.getSource().getId().indexOf("type") > -1) {
				ClassUtils.valueHelpClassSelect("type", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("class") > -1) {
				ClassUtils.valueHelpClassSelect("class", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("status") > -1) {
				ClassUtils.valueHelpClassSelect("status", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charName") > -1) {
				ClassUtils.valueHelpCharSelect("charName", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charValue") > -1) {
				var sPath = c.getSource().getParent().getBindingContext().getPath();
				ClassUtils.valueHelpCharSelect("charValue", this, pObTab, c, sPath);
			}
		},

		onChange: function (c) {
			var pObTab = this.getObTab();
			var id = c.getSource().getId().split("tskL--");
			id = id[1];
			if (c.getSource().getId().indexOf("type") > -1) {
				ClassUtils.onClassChange("type", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("class") > -1) {
				ClassUtils.onClassChange("class", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("status") > -1) {
				ClassUtils.onClassChange("status", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charName") > -1) {
				ClassUtils.onCharChange("charName", this, c);
			} else if (c.getSource().getId().indexOf("charValue") > -1) {
				ClassUtils.onCharChange("charValue", this, c);
			}
		},

		onCharChange: function (c) {
			var pObTab = this.getObTab(this.oModelName);
			var id = c.getSource().getId().split("tskL--");
			id = id[1];
			if (c.getSource().getId().indexOf("charValueAdd") > -1) {
				ClassUtils.handleSelCharAdd("charValueAdd", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charValueClear") > -1) {
				ClassUtils.handleCharClear("charValueClear", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("status") > -1) {
				ClassUtils.onClassChange("status", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charName") > -1) {
				ClassUtils.onCharChange("charName", this, c);
			}
		},

		// handleClassRowAdd: function () {
		// 	var pObTab = this.getObTab();
		// 	ClassUtils.classRowAddPress(this, pObTab);

		// },
		// handleCharRowAdd: function () {
		// 	ClassUtils.charRowAddPress(this);
		// },
		// handleCharRowDelete: function (e) {
		// 	var pObTab = this.getObTab();
		// 	ClassUtils.bfrCharRowDelete(e, this, pObTab);
		// },
		// handleClassRowDelete: function (e) {
		// 	ClassUtils.classRowDeletePress(e, this);
		// },

		handleClassRowAdd: function () {
			var pObTab = this.getObTab();
			ClassUtils.classRowAddPress(this, pObTab);
		},

		handleCharRowAdd: function () {
			ClassUtils.charRowAddPress(this);
		},

		handleCharRowDelete: function (e) {
			var pObTab = this.getObTab();
			ClassUtils.charRowDeletePress(e, this, pObTab);
		},
		handleClassRowDelete: function (e) {
			ClassUtils.classRowDeletePress(e, this);
		},

		onClassSelect: function (e) {
			ClassUtils.classSelectPress(e, this);
		},
		onSelect: function (e) {
			ClassUtils.selectPress(e, this);
		},

		/**
		 * Called to invoke the MessagePopover
		 * @function
		 * @private
		 */
		_getMessagePopover: function () {
			// create popover lazily (singleton)
			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.popover.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;
		},

		/*
		 * This function is invoked when 'MeassagePopOver' is pressed
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleMessagePopoverPress: function (oEvent) {
			// oMessagePopover.toggle(oEvent.getSource());
			this._getMessagePopover().openBy(oEvent.getSource());
		},

		/*
		 * Function to set MessagePopOver
		 * @param msg
		 * @param type
		 */
		createMessagePopover: function (msg, type) {
			// var sJsonModel = new JSONModel();
			// sJsonModel.setData(oMessageList);
			// oMessagePopover.setModel(sJsonModel);
			// oMessagePopover.toggle(this.getView().byId("idMessagePopover"));
			var oMessageList = [];
			var oMessage, oMsgPopover = this._getMessagePopover();
			if (typeof msg === "string") {
				oMessageList.push({
					type: type,
					title: msg,
					message: msg
				});
			} else if (Array.isArray(msg)) {
				oMessageList = msg;
				for (var i = 0; i < oMessageList.length; i++) {
					oMessageList[i].message = oMessageList[i].title;
				}
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();
			for (var i = 0; i < oMessageList.length; i++) {
				oMessage = new Message({
					message: oMessageList[i].message,
					type: oMessageList[i].type, //MessageType.Error,
					target: "/Dummy",
					processor: this.getView().getModel()
				});
				sap.ui.getCore().getMessageManager().addMessages(oMessage);
			}
			oMsgPopover.toggle(this.getView().byId("idMessagePopover"));

			this.getView().byId("idMessagePopover").setEnabled(true);
			this.getView().byId("idMessagePopover").setText(oMessageList.length + "");
		},

		/*onNetLinkLamPress: function(oEvent) {
			this.showLinkLamDetail(oEvent.getSource());
		},
		showLinkLamDetail: function(oItem) {
			var path = oItem.oBindingContexts.ntLinkLam.sPath;
			this.getRouter().navTo("linkLamDetail", {
				itemPath: encodeURIComponent(path)
			});
		},*/

		/*valueHelpFun: function(oEvent) {
      var oModel = this.getView().getModel("valueHelp");
      var source = oEvent.getSource();
      this.inputId = source.sId;

      if (this.inputId.indexOf("linkfrmFl") > 0) {
        this.getView().byId("page").setBusy(true);
        jQuery.sap.delayedCall(800, this, function() {
          this._valueHelpDialog = sap.ui.xmlfragment(
            "ugieamui.mdg.eam.objectlink.create.view.Fragment.FlocVH",
            this
          );
          this.getView().addDependent(this._valueHelpDialog);

          this._valueHelpDialog.setModel(oModel);
          this._valueHelpDialog.open();
          this.getView().byId("page").setBusy(false);
        });
      }
      if (this.inputId.indexOf("linkToFl") > 0) {
        this.getView().byId("page").setBusy(true);
        jQuery.sap.delayedCall(800, this, function() {
          this._valueHelpDialog = sap.ui.xmlfragment(
            "ugieamui.mdg.eam.objectlink.create.view.Fragment.FlocVH",
            this
          );
          this.getView().addDependent(this._valueHelpDialog);

          this._valueHelpDialog.setModel(oModel);
          this._valueHelpDialog.open();
          this.getView().byId("page").setBusy(false);
        });
      }
      if (this.inputId.indexOf("linkObj1") > 0) {
        this.getView().byId("page").setBusy(true);
        jQuery.sap.delayedCall(800, this, function() {
          this._valueHelpDialog = sap.ui.xmlfragment(
            "ugieamui.mdg.eam.objectlink.create.view.Fragment.FlocVH",
            this
          );
          this.getView().addDependent(this._valueHelpDialog);

          this._valueHelpDialog.setModel(oModel);
          this._valueHelpDialog.open();
          this.getView().byId("page").setBusy(false);
        });
      }
      if (this.inputId.indexOf("linkFromEQ") > 0) {
        this._valueHelpDialog = sap.ui.xmlfragment(
          "ugieamui.mdg.eam.objectlink.create.view.Fragment.EquipmentVH",
          this
        );
        this.getView().addDependent(this._valueHelpDialog);

        this._valueHelpDialog.setModel(oModel);
        this._valueHelpDialog.open();
      }
      if (this.inputId.indexOf("linkToEQ") > 0) {
        this._valueHelpDialog = sap.ui.xmlfragment(
          "ugieamui.mdg.eam.objectlink.create.view.Fragment.EquipmentVH",
          this
        );
        this.getView().addDependent(this._valueHelpDialog);

        this._valueHelpDialog.setModel(oModel);
        this._valueHelpDialog.open();
      }
      if (this.inputId.indexOf("linkEquipment") > 0) {

        this._valueHelpDialog = sap.ui.xmlfragment(
          "ugieamui.mdg.eam.objectlink.create.view.Fragment.EquipmentVH",
          this
        );
        this.getView().addDependent(this._valueHelpDialog);

        this._valueHelpDialog.setModel(oModel);
        this._valueHelpDialog.open();

      }
    },

    handleSearch: function(E) {
      var sValue = E.getParameter("value");
      if ((this.inputId.indexOf("linkfrmFl") > 0) || (this.inputId.indexOf("linkToFl") > 0) || (this.inputId.indexOf("linkObj1") > 0)) {
        E.getSource().getBinding("items").filter(!sValue ? [] : [
          new sap.ui.model.Filter(
            [
              new sap.ui.model.Filter("Tplnr", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("Pltxt", sap.ui.model.FilterOperator.Contains, sValue)
            ],
            true)
        ]);
      }
      if ((this.inputId.indexOf("linkFromEQ") > 0) || (this.inputId.indexOf("linkToEQ") > 0) || (this.inputId.indexOf("linkEquipment") > 0)) {
        E.getSource().getBinding("items").filter(!sValue ? [] : [
          new sap.ui.model.Filter(
            [
              new sap.ui.model.Filter("Equnr", sap.ui.model.FilterOperator.Contains, sValue),
              new sap.ui.model.Filter("Eqktx", sap.ui.model.FilterOperator.Contains, sValue)
            ],
            true)
        ]);
      }

    },*/

		/* handleClose: function(e) {

      var oSelectedItem = e.getParameter("selectedItem");
      var m, d, value;
      if (oSelectedItem) {

        if (this.inputId.indexOf("linkfrmFl") > 0) {
          m = this.getView().byId("linkfrmFl");
          d = this.getView().byId("linkFrmFlDesc");

          m.setValue(e.getParameter("selectedItem").getProperty("title"));
          d.setValue(e.getParameter("selectedItem").getProperty("description"));
          e.getSource().getBinding("items").filter([]);
          value = e.getParameter("selectedItem").getProperty("title");
          this.validateFlocObject(value);
        }
        if (this.inputId.indexOf("linkToFl") > 0) {
          m = this.getView().byId("linkToFl");
          d = this.getView().byId("linkToFlDesc");

          m.setValue(e.getParameter("selectedItem").getProperty("title"));
          d.setValue(e.getParameter("selectedItem").getProperty("description"));
          e.getSource().getBinding("items").filter([]);
          value = e.getParameter("selectedItem").getProperty("title");
          this.validateFlocObject(value);
        }
        if (this.inputId.indexOf("linkObj1") > 0) {
          m = this.getView().byId("linkObj1");
          d = this.getView().byId("linkObj1Desc");

          m.setValue(e.getParameter("selectedItem").getProperty("title"));
          d.setValue(e.getParameter("selectedItem").getProperty("description"));
          e.getSource().getBinding("items").filter([]);
          value = e.getParameter("selectedItem").getProperty("title");
          this.validateFlocObject(value);
        }
        if (this.inputId.indexOf("linkFromEQ") > 0) {
          m = this.getView().byId("linkFromEQ");
          d = this.getView().byId("linkFrmEqDesc");
          m.setValue(e.getParameters().selectedItem.getProperty("title"));
          d.setValue(e.getParameters().selectedItem.getProperty("description"));
          value = e.getParameters().selectedItem.getProperty("description");
          this.validateEquiObject(value);
        }
        if (this.inputId.indexOf("linkToEQ") > 0) {
          m = this.getView().byId("linkToEQ");
          d = this.getView().byId("linkToEqDesc");
          m.setValue(e.getParameters().selectedItem.getProperty("title"));
          d.setValue(e.getParameters().selectedItem.getProperty("description"));
          value = e.getParameters().selectedItem.getProperty("description");
          this.validateEquiObject(value);
        }
        if (this.inputId.indexOf("linkEquipment") > 0) {
          m = this.getView().byId("linkEquipment");
          d = this.getView().byId("linkObjDesc");
          m.setValue(e.getParameters().selectedItem.getProperty("title"));
          d.setValue(e.getParameters().selectedItem.getProperty("description"));
          value = e.getParameters().selectedItem.getProperty("description");
          this.validateEquiObject(value);
        }

      }

    },
    
  

    locationChange: function() {
      var a = this.getView().byId("location");
      if (a.getValue() === "") {
        this.getView().byId("locationDesc").setValue();
      }
      a.setValueState("None");
    },
    onLocationChange: function() {
      var t = this.getView().byId("location");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._location(t);
    },
    _location: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("locationDesc");

      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("Stand", "EQ", c)];
        var q = "/LocationVHSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].Ktext);

            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    abcIndChange: function() {
      var a = this.getView().byId("abcInd");
      if (a.getValue() === "") {
        this.getView().byId("abcIndDesc").setValue();
      }
      a.setValueState("None");
    },
    onABCIndChange: function() {
      var t = this.getView().byId("abcInd");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._abcInd(t);
    },
    _abcInd: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("abcIndDesc");

      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("Abckz", "EQ", c)];
        var q = "/ABCIndicatorSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].Abctx);

            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    costCenterChange: function() {
      var a = this.getView().byId("costCenter");
      if (a.getValue() === "") {
        this.getView().byId("costCenterPart1").setValue();
        this.getView().byId("costCenterPart2").setValue();
      }
      a.setValueState("None");
    },
    oncostCenterChange: function() {
      var t = this.getView().byId("costCenter");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._costCenter(t);
    },
    _costCenter: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("costCenterPart2");
      var co = this.getView().byId("costCenterPart1");

      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("Kostl", "EQ", c)];
        var q = "/CostCenterSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].Mctxt);
            co.setValue(d.results[0].Kokrs);

            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    plGrpChange: function() {
      var a = this.getView().byId("plannerGrp");
      if (a.getValue() === "") {
        this.getView().byId("plannerGrpDesc").setValue();
      }
      a.setValueState("None");
    },
    onPlGrpChange: function() {
      var t = this.getView().byId("plannerGrp");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._plannerGroup(t);
    },
    _plannerGroup: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("plannerGrpDesc");

      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("Kostl", "EQ", c)];
        var q = "/PlannerGroupSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].Mctxt);
            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },
    companyCodeChange: function() {
      var a = this.getView().byId("CompanyCode");
      if (a.getValue() === "") {
        this.getView().byId("CompanyCodeDesc").setValue();
      }
      a.setValueState("None");
    },
    onCompanyCodeChange: function() {
      var t = this.getView().byId("CompanyCode");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._companyCode(t);
    },
    _companyCode: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("CompanyCodeDesc");
      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("Bukrs", "EQ", c)];
        var q = "/CompanyCodeValueHelpSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].Butxt);
            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },
  
	constTypeChange: function() {
      var a = this.getView().byId("ConstructionType");
      if (a.getValue() === "") {
        this.getView().byId("ConstructionDesc").setValue();
      }
      a.setValueState("None");
    },
    onConstTypeChange: function() {
      var t = this.getView().byId("ConstructionType");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._constructionType(t);
    },
    _constructionType: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("ConstructionDesc");
      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("ConstType", "EQ", c)];
        var q = "/ConstTypeValueHelpSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].ConstTypeDescription);
            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error:function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    uomChange: function() {
      var a = this.getView().byId("BaseUOM");

      if (a.getValue() === "") {
        this.getView().byId("baseUOMDesc").setValue();
      }
      a.setValueState("None");
    },
    onUOMChange: function() {
      var t = this.getView().byId("BaseUOM");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._baseUOM(t);
    },
    _baseUOM: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("baseUOMDesc");
      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("MSEHI", "EQ", c)];
        var q = "/UOM_VALUESet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].MSEH6);
            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    matGrpChange: function() {
      var a = this.getView().byId("matSrvGrp");

      if (a.getValue() === "") {
        this.getView().byId("matSrvGrpDesc").setValue();
      }
      a.setValueState("None");
    },
    onMatGrpChange: function() {
      var t = this.getView().byId("matSrvGrp");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._materialGroup(t);
    },
    _materialGroup: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("matSrvGrpDesc");
      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("MATKL", "EQ", c)];
        var q = "/MAT_GRP_VALSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].WGBEZ);
            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    divChange: function() {
      var a = this.getView().byId("division");
      if (a.getValue() === "") {
        this.getView().byId("divisionDesc").setValue();
      }
      a.setValueState("None");
    },
    onDivChange: function() {
      var t = this.getView().byId("division");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._division(t);
    },
    _division: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("divisionDesc");
      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("SPART", "EQ", c)];
        var q = "/Division_ValueSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].VTEXT);
            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    valClassChange: function() {
      var a = this.getView().byId("valClass");
      if (a.getValue() === "") {
        this.getView().byId("valClassDesc").setValue();
      }
      a.setValueState("None");
    },
    onValClassChange: function() {
      var t = this.getView().byId("valClass");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._valClass(t);
    },
    _valClass: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("valClassDesc");
      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("BKLAS", "EQ", c)];
        var q = "/Valuation_Cls_ValSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].BKBEZ);
            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    taxIndChange: function() {
      var a = this.getView().byId("taxInd");

      a.setValueState("None");
    },
    ontaxIndChange: function() {
      var t = this.getView().byId("taxInd");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._taxIndicator(t);
    },
    _taxIndicator: function(f) {
      var c = f.getValue();

      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("TAXIM", "EQ", c)];
        var q = "/TAX_IND_VALSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {

            f.setValue(a);
          } else {
            f.setValueState("Error");

            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    formulaChange: function() {
      var a = this.getView().byId("formula");

      a.setValueState("None");
    },
    onFormulaChange: function() {
      var t = this.getView().byId("formula");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._formula(t);
    },
    _formula: function(f) {
      var c = f.getValue();

      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("FORMELNR", "EQ", c)];
        var q = "/FORMULA_VALUESet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            f.setValue(a);
          } else {
            f.setValueState("Error");

            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    purchStatusChange: function() {
      var a = this.getView().byId("purchStatus");

      if (a.getValue() === "") {
        this.getView().byId("purchStatusDesc").setValue();
      }
      a.setValueState("None");
    },
    onPurchStatusChange: function() {
      var t = this.getView().byId("purchStatus");
      var d = this.getView().byId("validFrm");
      if (t.getValue() !== "") {
        var c = t.getValue().toUpperCase();
        t.setValue(c);
        this._purchStatus(t);

        if (d.getValue() === "") {
          var value = this.getView().getModel("i18n").getProperty("DATE_VALID2");
          d.setValueState("Error");
          sap.m.MessageBox.show(value, {
            title: "Error",
            icon: sap.m.MessageBox.Icon.ERROR,
            onClose: function(oAction) {

            }
          });
        }
      } else {
        if (d.getValue() !== "") {
          var _value = this.getView().getModel("i18n").getProperty("DATE_VALID");
          t.setValueState("Error");
          sap.m.MessageBox.show(_value, {
            title: "Error",
            icon: sap.m.MessageBox.Icon.ERROR,
            onClose: function(oAction) {

            }
          });
        } else if (d.getValue() === "" && t.getValue() === "") {
          d.setValueState("None");
          t.setValueState("None");
        }
      }

    },
    _purchStatus: function(f) {
      var c = f.getValue();
      var cd = this.getView().byId("purchStatusDesc");
      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("MMSTA", "EQ", c)];
        var q = "/PURCH_STAT_VALSet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].MTSTB);
            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    eanCategoryChange: function() {
      var a = this.getView().byId("eanCategory");

      if (a.getValue() === "") {
        this.getView().byId("eanCategoryDesc").setValue();
      }
      a.setValueState("None");
    },
    onEanCategoryChange: function() {
      var t = this.getView().byId("eanCategory");
      var c = t.getValue().toUpperCase();
      t.setValue(c);
      this._eanCategory(t);
    },
    _eanCategory: function(f) {

      var c = f.getValue();
      var cd = this.getView().byId("eanCategoryDesc");
      var a = c.replace(/^[ ]+|[ ]+$/g, '');
      if (a !== "") {
      	var oFilter = [new sap.ui.model.Filter("NUMTP", "EQ", c)];
        var q = "/EAN_CAT_VALUESet";
        var m = this.getView().getModel();
        m.read(q, {filters: oFilter, success: function(d, e) {
          if (d.results.length > 0) {
            cd.setValue(d.results[0].NTBEZ);
            f.setValue(a);
          } else {
            f.setValueState("Error");
            cd.setValue();
            f.setValueStateText("Invalid Entry");
          }

        }, error: function(e) {
          f.setValueState("Error");
          var b = JSON.parse(e.response.body);
          var d = b.error.message.value;
          f.setValueStateText(d);
        }});
      } else {
        f.setValue(a);
      }
    },

    */

	});

});