/*global location history */
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"ugiaiwui/mdg/aiw/library/js/ClassUtils",
	"sap/ui/core/message/Message",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, MessageBox, ClassUtils, Message, ValueHelpRequest,
	ValueHelpProvider) {
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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.DetailWorkCenter", {

		formatter: formatter,
		oAttach: [],
		oFileUpload: "",
		charFlag: "",
		codeFlag: "",
		pSelectDialog: undefined,
		wcSelectDialog: undefined,
		wcCatSelectDialog: undefined,
		uSelectDialog: undefined,
		stdSelectDialog: undefined,
		prSelectDialog: undefined,
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
		// charFlag: "",
		codeFlag: "",

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

			var ApprovalModel = this.getView().getModel("ApprovalModel");
			this.getView().setModel(ApprovalModel, "ApprModel");

			//this.cost = this.getView().byId("cosCenterTable");
			this.getRouter().getRoute("wcDetail").attachPatternMatched(this._onRouteMatched, this);

			var aVisModel = new sap.ui.model.json.JSONModel();
			var aVis = {
				visible: false
			};
			aVisModel.setData(aVis);
			this.getView().setModel(aVisModel, "aVisModel");

			var aEnModel = new sap.ui.model.json.JSONModel();
			var aEnbl = {
				enable: false,
				wcEnable: false,
				plEnable: false,
				wcatEnable: false
			};
			aEnModel.setData(aEnbl);
			this.getView().setModel(aEnModel, "aEnModel");
			this.BusyDialog = new sap.m.BusyDialog();
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

			sObTab = oJsonModel.getProperty("/0").Obtab;

			return sObTab;
		},

		_onRouteMatched: function (oEvent) {
			var g = this;
			var sParameter = oEvent.getParameter("name");
			if (sParameter === "wcDetail") {
				this.currentObj = undefined;
				var sPath = decodeURIComponent(oEvent.getParameter("arguments").itemPath);
				this.action = oEvent.getParameter("arguments").action;
				this.mode = oEvent.getParameter("arguments").mode;
				var wcDetailModel = new sap.ui.model.json.JSONModel();
				var AIWListWCModel = sap.ui.getCore().getModel("AIWListWCModel");
				var AIWListWCData = AIWListWCModel.getData();
				this.currentObj = AIWListWCModel.getProperty(sPath);

				this.sExistFlag = false;
				this.oModelUpdateFlag = false;
				this.attachModelEventHandlers(wcDetailModel);

				this.wc = oEvent.getParameter("arguments").wc;
				this.status = oEvent.getParameter("arguments").status;
				this.plant = oEvent.getParameter("arguments").plant;
				this.getView().byId("idBtnCheck").setVisible(true);

				var classFragmentId = this.getView().createId("clsFrag");
				this.class = sap.ui.core.Fragment.byId(classFragmentId, "assignmentTab");

				var itemFragmentId = this.getView().createId("charFrag");
				this.char = sap.ui.core.Fragment.byId(itemFragmentId, "characteristicsTab");

				if (this.mode === "display") {
					this.class.setVisible(false);
					this.char.setVisible(false);
					this.getView().byId("idBtnCheck").setVisible(false);
					var vis = this.getView().getModel("aVisModel").getData();
					vis.visible = true;
					this.getView().getModel("aVisModel").setData(vis);

					var enbl = this.getView().getModel("aEnModel").getData();
					enbl.enable = false;
					this.getView().getModel("aEnModel").setData(enbl);

					this.getView().byId("cosCenterTable").setVisible(false);
					for (var i = 0; i < AIWListWCData.length; i++) {
						if (AIWListWCData[i].wc === this.wc && AIWListWCData[i].plant === this.plant) {
							wcDetailModel.setData(this.currentObj);
							break;
						}
					}

					var AIWAPPROVE = new JSONModel();
					var pApproveData = sap.ui.getCore().getModel("AIWAPPROVE").getProperty("/AIWListWCModel" + sPath);
					AIWAPPROVE.setData(pApproveData);
					this.getView().setModel(AIWAPPROVE, "AIWAPPROVE");

					// if (this.action === "createWC") {
					// 	if (this.currentObj.classItems) {
					// 		var cModel = new sap.ui.model.json.JSONModel();
					// 		cModel.setData(this.currentObj.classItems);
					// 		this.class.setModel(cModel);
					// 	}
					// 	if (this.currentObj.characteristics) {
					// 		var _chModel = new sap.ui.model.json.JSONModel();
					// 		_chModel.setData(this.currentObj.characteristics);
					// 		this.char.setModel(_chModel);
					// 	}
					// }

				} else {
					var vis = this.getView().getModel("aVisModel").getData();
					vis.visible = false;
					this.getView().getModel("aVisModel").setData(vis);

					this.class.setVisible(true);
					this.char.setVisible(true);

					if (this.action === "createWC") {
						var enbl = this.getView().getModel("aEnModel").getData();
						enbl.enable = true;
						enbl.wcEnable = this.currentObj.wc === "" ? true : false;
						enbl.plEnable = this.currentObj.plant === "" ? true : false;
						enbl.wcatEnable = this.currentObj.wcCat === "" ? true : false;
						this.getView().getModel("aEnModel").setData(enbl);
						this.getView().byId("cosCenterTable").setVisible(true);

						if (this.currentObj.classItems) {
							var cModel = new sap.ui.model.json.JSONModel();
							cModel.setData(this.currentObj.classItems);
							this.class.setModel(cModel);
						}
						// if (this.currentObj.characteristics) {
						// 	var _chModel = new sap.ui.model.json.JSONModel();
						// 	_chModel.setData(this.currentObj.characteristics);
						// 	this.char.setModel(_chModel);
						// }
						var sClassData = [],
							sCharData = [];
						sClassData = this.currentObj.classItems;
						this.chData = this.currentObj.characteristics;
						if (this.chData.length > 0) {
							if (sClassData.length > 0) {
								for (var j = 0; j < this.chData.length; j++) {
									if (sClassData[0].Class === this.chData[j].Class) {
										sCharData.push(this.chData[j]);
									}
								}
							}
						}

						this.class.setModel(new JSONModel(sClassData));
						this.char.setModel(new JSONModel(sCharData));
						
						wcDetailModel.setData(this.currentObj);
					}

					if (this.action === "changeWC") {
						var oMatchItem;
						if (AIWListWCData.length > 0) {
							for (var i = 0; i < AIWListWCData.length; i++) {
								if (AIWListWCData[i].wc === this.wc && AIWListWCData[i].plant === this.plant) {
									oMatchItem = i;
									this.sExistFlag = true;
									break;
								}
							}
						}
						if (this.sExistFlag) {
							this.currentObj = oMatchItem;
							wcDetailModel.setData(this.currentObj);
							// this.class.setModel(new JSONModel(this.currentObj.classItems));
							// this.char.setModel(new JSONModel(this.currentObj.characteristics));
							if (this.currentObj.classItems) {
								var cModel = new sap.ui.model.json.JSONModel();
								cModel.setData(this.currentObj.classItems);
								this.class.setModel(cModel);
							}
							var sClassData = [],
								sCharData = [];
							sClassData = this.currentObj.classItems;
							this.chData = this.currentObj.characteristics;
							if (this.chData.length > 0) {
								if (sClassData.length > 0) {
									for (var j = 0; j < this.chData.length; j++) {
										if (sClassData[0].Class === this.chData[j].Class) {
											sCharData.push(this.chData[j]);
										}
									}
								}
							}
							this.class.setModel(new JSONModel(sClassData));
							this.char.setModel(new JSONModel(sCharData));

							var enbl = this.getView().getModel("aEnModel").getData();
							enbl.enable = true;
							enbl.wcEnable = this.currentObj.wc === "" ? true : false;
							enbl.plEnable = this.currentObj.plant === "" ? true : false;
							enbl.wcatEnable = this.currentObj.wcCat === "" ? true : false;
							this.getView().getModel("aEnModel").setData(enbl);
							this.getView().byId("cosCenterTable").setVisible(true);
							
							wcDetailModel.setData(this.currentObj);
						} else {
							this.readWCDetails(this.wc, this.plant);
						}
						this.getView().byId("wcDetailPage").setTitle(this.getView().getModel("i18n").getProperty("changeWC"));

						if (this.status === "true" || this.lockMsg === true) {
							this.disableFields();
						} else {
							this.enableFields();
						}

						if (sap.ui.getCore().getModel("refreshModel") !== undefined) {
							var refreshModel = sap.ui.getCore().getModel("refreshModel");
							refreshModel.setProperty("/refreshSearch", false);
						}
					}
				}

				if (this.currentObj.mode === "create") {
					this.getView().byId("wcDetailPage").setTitle(this.getView().getModel("i18n").getProperty("wcMasterTitle"));
				} else {
					this.getView().byId("wcDetailPage").setTitle(this.getView().getModel("i18n").getProperty("changeWC"));
				}

				// if (this.action === "createWC") {
				// 	var wcDetailModel = new JSONModel();
				// 	for (var i = 0; i < AIWListWCData.length; i++) {
				// 		if (AIWListWCData[i].wc === this.wc && AIWListWCData[i].plant === this.plant) {
				// 			wcDetailModel.setData(this.currentObj);
				// 			break;
				// 		}
				// 	}
				// 	if (this.status === "true" || this.lockMsg === true) {
				// 		this.disableFields();
				// 	} else {
				// 		this.enableFields();
				// 	}
				// }
				this.getView().setModel(wcDetailModel, "wcDetailModel");
				sap.ui.getCore().setModel(wcDetailModel, "wcDetailModel");
			} else {
				return;
			}
		},

		disableFields: function () {

			var obj = {
				enable: false
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "mainView");
			// this.cost.setMode("None");
			this.getView().byId("cosCenterTable").setMode("None");
			this.getView().byId("newCost").setEnabled(false);
			// this.class.setMode("None");
			// this.char.setMode("None");
		},

		enableFields: function () {
			var g = this;
			var obj = {
				enable: true
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "mainView");
			// this.cost.setMode("Delete");
			this.getView().byId("cosCenterTable").setMode("Delete");
			this.getView().byId("newCost").setEnabled(true);
			// this.class.setMode("SingleSelectLeft");
			// this.char.setMode("Delete");
		},

		readWCDetails: function (w, p) {
			var g = this;
			if (this.action === "approveWC") {
				var m = this.getView().getModel("ApprModel");
				var oFilter = [new sap.ui.model.Filter("ChangeRequestId", "EQ", "")];
			} else {
				var m = this.getView().getModel();
				var oFilter = [new sap.ui.model.Filter("Arbpl", "EQ", w),
					new sap.ui.model.Filter("Werks", "EQ", p)
				];
			}

			g.BusyDialog.open();
			m.read("/ChangeRequestSet", {
				filters: oFilter,
				urlParameters: {
					"$expand": "Workcenter,WCCapa,WCCost,CrAttachments,Notes,ValueWC,ClassWC"
				},
				success: function (r) {
					g.BusyDialog.close();
					var wcDetailModel = g.getView().getModel("wcDetailModel");
					if (r.results.length > 0) {
						var message = r.results[0].Message;
						g.lockMsg = false;
						if (message !== "") {
							g.lockMsg = true;
							sap.m.MessageToast.show(message, {
								duration: 15000,
								animationDuration: 15000
							});
						}

						var h = r.results[0].Workcenter.results[0];
						g.currentObj = h;
						if (g.currentObj) {
							g.currentObj.mode = "change";
							g.currentObj.wc = h.Arbpl;
							g.currentObj.wcDesc = h.Txtmi;
							g.currentObj.plant = h.Werks;
							g.currentObj.plantDesc = h.Plantdesc;
							g.currentObj.wcCat = h.Verwe;
							g.currentObj.wcCatDesc = h.Ktext;
							g.currentObj.person = h.Crveran;
							g.currentObj.personDesc = h.Persresptxt;
							g.currentObj.usg = h.Planv;
							g.currentObj.usgDesc = h.UsageTxt;
							g.currentObj.stdVal = h.Vgwts;
							g.currentObj.stdValDesc = h.Vgwtx;
							g.currentObj.ctrlKey = h.Crsteus;
							g.currentObj.ctrlKeyDesc = h.Steutxt;

							g.currentObj.wcValueState = "None";
							g.currentObj.wcDescValueState = "None";
							g.currentObj.plantValueState = "None";
							g.currentObj.wcCatValueState = "None";
							g.currentObj.personResValueState = "None";
							g.currentObj.usgValueState = "None";
							g.currentObj.stdValueState = "None";
							g.currentObj.cntrlKeyValueState = "None";

							g.currentObj.wcValueStateTxt = "";
							g.currentObj.wcDescValueStateTxt = "";
							g.currentObj.plantValueStateTxt = "";
							g.currentObj.wcCatValueStateTxt = "";
							g.currentObj.personResValueStateTxt = "";
							g.currentObj.usgValueStateTxt = "";
							g.currentObj.stdValueStateTxt = "";
							g.currentObj.cntrlKeyValueStateTxt = "";

							g.currentObj.cost = [];
							g.currentObj.capacity = [];
							g.currentObj.classItems = [];
							g.currentObj.characteristics = [];

							var cost = r.results[0].WCCost.results;
							if (cost) {
								if (cost.length > 0) {
									var cModel = new sap.ui.model.json.JSONModel();
									cModel.setData(cost);
									// g.cost.setModel(cModel);
									g.currentObj.cost = cost;
								}
							}

							var capacity = r.results[0].WCCapa.results;
							if (capacity) {
								if (capacity.length > 0) {
									var capModel = new sap.ui.model.json.JSONModel();
									capModel.setData(capacity);
									g.currentObj.capacity = capacity;
								}
							}

							var classList = r.results[0].ClassWC.results;
							if (classList) {
								if (classList.length > 0) {
									for (var i = 0; i < classList.length; i++) {
										classList[i].ctEnable = false;
										classList[i].classEnable = false;
										classList[i].ClassTypeDesc = classList[i].Artxt;
										delete classList[i].Artxt;
										classList[i].ClassDesc = classList[i].Kltxt;
										delete classList[i].Kltxt;
										delete classList[i].Changerequestid;
										delete classList[i].Clint;
										delete classList[i].Service;
										classList[i].classDelEnable = true;
									}
									if (g.lockMsg === true) {
										for (var i = 0; i < classList.length; i++) {
											classList[i].classDelEnable = false;
										}
									}
									var cModel = new sap.ui.model.json.JSONModel();
									cModel.setData(classList);
									g.class.setModel(cModel);
									g.currentObj.classItems = classList;
								}
							}

							var charList = r.results[0].ValueWC.results;
							if (charList) {
								if (charList.length > 0) {
									for (var j = 0; j < charList.length; j++) {
										charList[j].cNameEnable = false;
										charList[j].Textbz = charList[j].Atwtb;
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
									if (g.lockMsg === true) {
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
									g.currentObj.characteristics = charList;
								}
							}
						}

						if (g.lockMsg === true) {
							var enbl = g.getView().getModel("aEnModel").getData();
							enbl.enable = false;
							enbl.wcEnable = false;
							enbl.plEnable = false;
							enbl.wcatEnable = false;
							g.getView().getModel("aEnModel").setData(enbl);
							g.getView().byId("cosCenterTable").setVisible(true);
						} else {
							var enbl = g.getView().getModel("aEnModel").getData();
							enbl.enable = true;
							enbl.wcEnable = g.currentObj.wc === "" ? true : false;
							enbl.plEnable = g.currentObj.plant === "" ? true : false;
							enbl.wcatEnable = g.currentObj.wcCat === "" ? true : false;
							g.getView().getModel("aEnModel").setData(enbl);
							g.getView().byId("cosCenterTable").setVisible(true);
						}

						wcDetailModel.setData(g.currentObj);
						g.getView().setModel(wcDetailModel, "wcDetailModel");
						g.getView().getModel("wcDetailModel").refresh();
						sap.ui.getCore().setModel(wcDetailModel, "wcDetailModel");
					}
				},
				error: function (err) {
					g.BusyDialog.close();
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
					g.invokeMessage(value);
				}
			});
		},

		onDonePress: function (oEvent) {
			var g = this;
			var sSourceId = oEvent.getSource().getId();
			var doneFlag = true;

			// var costData = this.cost.getModel().getData();
			var costData = this.getView().getModel("wcDetailModel").getProperty("/cost");
			var wcDetailModel = this.getView().getModel("wcDetailModel");

			if (this.currentObj.wc === "") {
				doneFlag = false;
				this.currentObj.wcValueState = "Error";
			}
			if (this.currentObj.wcDesc === "") {
				doneFlag = false;
				this.currentObj.wcDescValueState = "Error";
			}
			if (this.currentObj.plant === "") {
				doneFlag = false;
				this.currentObj.plantValueState = "Error";
			}
			if (this.currentObj.wcCat === "") {
				doneFlag = false;
				this.currentObj.wcCatValueState = "Error";
			}
			if (this.currentObj.person === "") {
				doneFlag = false;
				this.currentObj.personResValueState = "Error";
			}
			if (this.currentObj.usg === "") {
				doneFlag = false;
				this.currentObj.usgValueState = "Error";
			}
			if (this.currentObj.stdVal === "") {
				doneFlag = false;
				this.currentObj.stdValueState = "Error";
			}
			if (!doneFlag) {
				wcDetailModel.setData(this.currentObj);
				var msg = this.getView().getModel("i18n").getProperty("MANDMSG");
				this.createMessagePopover(msg, "Error");
				// MessageBox.show(msg, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function () {}
				// });
				return;
			}

			var isCostEmpty = false;
			if (costData && costData.length > 0) {
				for (var i = 0; i < costData.length; i++) {
					if (costData[i].CrKostl === "" && costData[i].CrKokrs !== "") {
						costData[i].ccState = "Error";
						isCostEmpty = true;
					}
				}
				var model = new sap.ui.model.json.JSONModel();
				model.setData(costData);
				// this.cost.setModel(model);
				this.getView().getModel("wcDetailModel").setProperty("/cost", costData);
				if (isCostEmpty) {
					var _msg = this.getView().getModel("i18n").getProperty("CC_ERR");
					g.createMessagePopover(_msg, "Error");
					// MessageBox.show(_msg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {}
					// });
					return;
				}
			}

			var wcDetailData = this.currentObj;
			if (g.class.getModel()) {
				var sClassData = g.class.getModel().getData();
				if (sClassData) {
					wcDetailData.classItems = [];
					for (var a = 0; a < sClassData.length; a++) {
						wcDetailData.classItems.push(sClassData[a]);
					}
					wcDetailModel.setData(wcDetailData);
				}
			}
			// if (g.char.getModel()) {
			// 	var sCharData = g.char.getModel().getData();
			// 	if (sCharData) {
			// 		wcDetailData.characteristics = [];
			// 		for (var b = 0; b < sCharData.length; b++) {
			// 			wcDetailData.characteristics.push(sCharData[b]);
			// 		}
			// 		wcDetailModel.setData(wcDetailData);
			// 	}
			// }
			if (this.chData) {
				var sCharData = this.chData; //this.char.getModel().getData();
				if (sCharData !== null && sCharData !== undefined) {
					wcDetailData.characteristics = [];
					for (var b = 0; b < sCharData.length; b++) {
						wcDetailData.characteristics.push(sCharData[b]);
					}
				}
				wcDetailModel.setData(wcDetailData);
			}

			if (sSourceId.indexOf("idBtnCheck") > -1) {
				this.validateCheck();
				return;
			}

			this.chData = [];

			if (this.action === "changeWC") {
				if (this.oModelUpdateFlag && !this.sExistFlag) {
					var sJsonModel = sap.ui.getCore().getModel("AIWListWCModel").getData();
					sJsonModel.push(this.getView().getModel("wcDetailModel").getData());
				}
				/*if (this.status !== false) {
					var wcObj = wcDetailModel.getData();
					var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();
					AIWListWCData.push(wcObj);
					sap.ui.getCore().getModel("AIWListWCModel").setData(AIWListWCData);
				}*/
			}
			/*else {
				var wcObj = wcDetailModel.getData();
				var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();
				sap.ui.getCore().getModel("AIWListWCModel").setData(AIWListWCData);
			}*/

			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			}
		},

		validateCheck: function () {
			var g = this;
			var sAIWData = g.getView().getModel("wcDetailModel").getData();
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
				"ClassWC": [],
				"ValueWC": [],
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

			var mHeader = {
				"Werks": sAIWData.plant,
				"Arbpl": sAIWData.wc,
				"Txtmi": sAIWData.wcDesc,
				"Verwe": sAIWData.wcCat,
				"Crveran": sAIWData.person,
				"Planv": sAIWData.usg,
				"Vgwts": sAIWData.stdVal,
				"Crsteus": sAIWData.ctrlKey
			};
			if (sAIWData.hasOwnProperty("Type")) {
				if (sAIWData.Type === "X") {
					mHeader.Type = "X"
				}

			}
			sPayload.Workcenter.push(mHeader);

			if (sAIWData.cost) {
				for (var j = 0; j < sAIWData.cost.length; j++) {
					var mCost = {
						"Werks": sAIWData.cost[j].CrKokrs,
						"Arbpl": sAIWData.wc,
						"CrKostl": sAIWData.cost[j].CrKostl,
						"Costcentxt": sAIWData.cost[j].Costcentxt,
						"CrLstar": sAIWData.cost[j].CrLstar,
						"Forn1": sAIWData.cost[j].Forn1,
						"ActvttypeTxt": sAIWData.cost[j].ActvttypeTxt,
						"Frmltxt": sAIWData.cost[j].Frmltxt,
						"Begda": formatter._formatDate(sAIWData.cost[j].Begda),
						"Endda": formatter._formatDate(sAIWData.cost[j].Endda)
					};
					sPayload.WCCost.push(mCost);
				}
			}

			var sWCClassList = sAIWData.classItems;
			if (sWCClassList) {
				if (sWCClassList.length > 0) {
					for (var e = 0; e < sWCClassList.length; e++) {
						var sWCClass = {
							"Arbpl": sAIWData.wc,
							"Werks": sAIWData.plant,
							"Classtype": sWCClassList[e].Classtype,
							"Class": sWCClassList[e].Class,
							// "Clstatus1": sWCClassList[e].Clstatus1
						};
						sPayload.ClassWC.push(sWCClass);
					}
				}
			}

			var sWCCharList = sAIWData.characteristics;
			if (sWCCharList) {
				if (sWCCharList.length > 0) {
					for (var f = 0; f < sWCCharList.length; f++) {
						var sWCVal = {
							"Arbpl": sAIWData.wc,
							"Werks": sAIWData.plant,
							"Atnam": sWCCharList[f].Atnam,
							"Textbez": sWCCharList[f].Textbez,
							"Atwrt": sWCCharList[f].Atwrt,
							"Class": sWCCharList[f].Class
						};
						sPayload.ValueWC.push(sWCVal);
					}
				}
			}

			this.getView().byId("wcDetailPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("wcDetailPage").setBusy(false);
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
					g.getView().byId("wcDetailPage").setBusy(false);
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

		/** Value Help for Work Center **/
		onPlantVH: function (oEvent) {
			var g = this;
			// var g = this.getParent().getController();
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			if (this.pSearchResults === undefined || this.pSearchResults === {}) {
				this.pSelectDialog = new sap.m.TableSelectDialog({

					title: this.getView().getModel("i18n").getProperty("PLANT"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "Search Term 1"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Search Term 2"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Postal Code"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "City"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Name2"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Name"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Company Name"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Addess Version"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Plant"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Description"
								})
							]
						})
					],
					items: {
						path: "/PlantVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{SearchTerm1}"
								}),
								new sap.m.Text({
									text: "{SearchTerm2}"
								}),
								new sap.m.Text({
									text: "{PostalCode}"
								}),
								new sap.m.Text({
									text: "{City}"
								}),
								new sap.m.Text({
									text: "{Name2}"
								}),
								new sap.m.Text({
									text: "{Name}"
								}),
								new sap.m.Text({
									text: "{CompanyName}"
								}),
								new sap.m.Text({
									text: "{AddrVersion}"
								}),
								new sap.m.Text({
									text: "{Plant}"
								}),
								new sap.m.Text({
									text: "{PlantName}"
								})
							]
						})

					},
					confirm: function (E) {
						g.currentObj.plantValueState = "None";
						g.currentObj.plantValueStateTxt = "";
						g.currentObj.plant = E.getParameter("selectedItem").getCells()[8].getText();
						g.currentObj.plantDesc = E.getParameter("selectedItem").getCells()[9].getText();
						wcDetailModel.setData(g.currentObj);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("PlantName", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}

					}
				});
				var q = "/PlantVHSet";
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h) {
						if (h.results.length > 0) {
							g.pSearchResults = h;
							var I = new sap.m.ColumnListItem({
								type: "Active",
								unread: false,
								cells: [
									new sap.m.Text({
										text: "{SearchTerm1}"
									}),
									new sap.m.Text({
										text: "{SearchTerm2}"
									}),
									new sap.m.Text({
										text: "{PostalCode}"
									}),
									new sap.m.Text({
										text: "{City}"
									}),
									new sap.m.Text({
										text: "{Name2}"
									}),
									new sap.m.Text({
										text: "{Name}"
									}),
									new sap.m.Text({
										text: "{CompanyName}"
									}),
									new sap.m.Text({
										text: "{AddrVersion}"
									}),
									new sap.m.Text({
										text: "{Plant}"
									}),
									new sap.m.Text({
										text: "{PlantName}"
									})
								]
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							g.pSelectDialog.setModel(e);
							// g.pSelectDialog.setGrowingThreshold(h.results.length);
							g.pSelectDialog.bindAggregation("items", "/results", I);
						} else {
							g.pSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var template = new sap.m.ColumnListItem({
					type: "Active",
					unread: false,
					cells: [
						new sap.m.Text({
							text: "{SearchTerm1}"
						}),
						new sap.m.Text({
							text: "{SearchTerm2}"
						}),
						new sap.m.Text({
							text: "{PostalCode}"
						}),
						new sap.m.Text({
							text: "{City}"
						}),
						new sap.m.Text({
							text: "{Name2}"
						}),
						new sap.m.Text({
							text: "{Name}"
						}),
						new sap.m.Text({
							text: "{CompanyName}"
						}),
						new sap.m.Text({
							text: "{AddrVersion}"
						}),
						new sap.m.Text({
							text: "{Plant}"
						}),
						new sap.m.Text({
							text: "{PlantName}"
						})
					]
				});
				var e = new sap.ui.model.json.JSONModel();
				e.setData(this.pSearchResults);
				this.pSelectDialog.setModel(e);
				this.pSelectDialog.setGrowingThreshold(this.pSearchResults.results.length);
				this.pSelectDialog.bindAggregation("items", "/results", template);
				var I = this.pSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			this.pSelectDialog.open();

		},

		onWcVH: function (oEvent) {
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			if (this.wcSearchResults === undefined || this.wcSearchResults === {}) {

				this.wcSelectDialog = new sap.m.TableSelectDialog({

					title: this.getView().getModel("i18n").getProperty("WORK_CENTER"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "Work Center Category"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Plant"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Work Center"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Description"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Language"
							})
						]
					})],
					items: {
						path: "/WorkCenterVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Verwe}"
								}),
								new sap.m.Text({
									text: "{Werks}"
								}),
								new sap.m.Text({
									text: "{Arbpl}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								}),
								new sap.m.Text({
									text: "{Spras}"
								})
							]
						})

					},
					confirm: function (E) {
						g.currentObj.wcValueState = "None";
						g.currentObj.wcValueStateTxt = "";
						// m.setValue(E.getParameter("selectedItem").getCells()[2].getText());
						g.currentObj.wc = E.getParameter("selectedItem").getCells()[2].getText();
						g.currentObj.wcDesc = E.getParameter("selectedItem").getCells()[3].getText();
						if (g.currentObj.wcDesc) {
							g.currentObj.wcDescValueState = "None";
							g.currentObj.wcDescValueStateTxt = "";
						}
						wcDetailModel.setData(g.currentObj);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
									],
									true)
							]);
						}

					}
				});
				var q = "/WorkCenterVHSet";

				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h) {
						if (h.results.length > 0) {
							var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									var sObj = {
										Verwe: oModelData[i].wcCat,
										Werks: oModelData[i].plant,
										Arbpl: oModelData[i].wc,
										Ktext: oModelData[i].wcDesc,
										Spras: h.results[0].Spras
									};
									h.results.unshift(sObj);
								}
							}
							g.wcSearchResults = h;
							var I = new sap.m.ColumnListItem({
								type: "Active",
								unread: false,
								cells: [
									new sap.m.Text({
										text: "{Verwe}"
									}),
									new sap.m.Text({
										text: "{Werks}"
									}),
									new sap.m.Text({
										text: "{Arbpl}"
									}),
									new sap.m.Text({
										text: "{Ktext}"
									}),
									new sap.m.Text({
										text: "{Spras}"
									})
								]
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							g.wcSelectDialog.setModel(e);
							// g.wcSelectDialog.setGrowingThreshold(h.results.length);
							g.wcSelectDialog.bindAggregation("items", "/results", I);
						} else {
							g.wcSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});

			} else {
				var template = new sap.m.ColumnListItem({
					type: "Active",
					unread: false,
					cells: [
						new sap.m.Text({
							text: "{Verwe}"
						}),
						new sap.m.Text({
							text: "{Werks}"
						}),
						new sap.m.Text({
							text: "{Arbpl}"
						}),
						new sap.m.Text({
							text: "{Ktext}"
						}),
						new sap.m.Text({
							text: "{Spras}"
						})
					]
				});

				var e = new sap.ui.model.json.JSONModel();
				e.setData(this.wcSearchResults);
				this.wcSelectDialog.setModel(e);
				this.wcSelectDialog.setGrowingThreshold(this.wcSearchResults.results.length);
				this.wcSelectDialog.bindAggregation("items", "/results", template);
				var I = this.wcSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			this.wcSelectDialog.open();
		},

		onWcCatVH: function (oEvent) {

			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			if (this.wcCatSearchResults === undefined || this.wcCatSearchResults === {}) {

				this.wcCatSelectDialog = new sap.m.SelectDialog({

					title: this.getView().getModel("i18n").getProperty("WORK_CENTER_CAT"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/WorkCentCatVHSet",
						template: new sap.m.StandardListItem({
							title: "{Verwe}",
							description: "{Ktext}"
						})
					},
					confirm: function (E) {
						g.currentObj.wcCatValueState = "None";
						g.currentObj.wcCatValueStateTxt = "";
						//m.setValue(E.getParameters().selectedItem.getProperty("title"));
						g.currentObj.wcCat = E.getParameters().selectedItem.getProperty("title");
						g.currentObj.wcCatDesc = E.getParameters().selectedItem.getProperty("description");
						wcDetailModel.setData(g.currentObj);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Verwe", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}

					}
				});
				var q = "/WorkCentCatVHSet";

				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h) {
						if (h.results.length > 0) {
							g.wcCatSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Verwe}",
								description: "{Ktext}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							g.wcCatSelectDialog.setModel(e);
							g.wcCatSelectDialog.setGrowingThreshold(h.results.length);
							g.wcCatSelectDialog.bindAggregation("items", "/results", I);
						} else {
							g.wcCatSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var template = new sap.m.StandardListItem({
					title: "{Verwe}",
					description: "{Ktext}",
					active: true
				});
				var e = new sap.ui.model.json.JSONModel();
				e.setData(this.wcCatSearchResults);
				this.wcCatSelectDialog.setModel(e);
				this.wcCatSelectDialog.setGrowingThreshold(this.wcCatSearchResults.results.length);
				this.wcCatSelectDialog.bindAggregation("items", "/results", template);
				var I = this.wcCatSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			this.wcCatSelectDialog.open();
		},

		onCtrlKeyVH: function (oEvent) {
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			if (this.ctrSearchResults === undefined || this.ctrSearchResults === {}) {
				this.ctrSelectDialog = new sap.m.SelectDialog({
					title: this.getView().getModel("i18n").getProperty("CTRL_KEY"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/ControlKeySet",
						template: new sap.m.StandardListItem({
							title: "{Steus}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						g.currentObj.cntrlKeyValueState = "None";
						g.currentObj.cntrlKeyValueStateTxt = "";
						// m.setValue(E.getParameters().selectedItem.getProperty("title"));
						g.currentObj.ctrlKey = E.getParameters().selectedItem.getProperty("title");
						g.currentObj.ctrlKeyDesc = E.getParameters().selectedItem.getProperty("description");
						wcDetailModel.setData(g.currentObj);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Steus", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Txt", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}

					}
				});
				var q = "/ControlKeySet";
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h) {
						if (h.results.length > 0) {
							g.ctrSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Steus}",
								description: "{Txt}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							g.ctrSelectDialog.setModel(e);
							g.ctrSelectDialog.setGrowingThreshold(h.results.length);
							g.ctrSelectDialog.bindAggregation("items", "/results", I);
						} else {
							g.ctrSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var template = new sap.m.StandardListItem({
					title: "{Steus}",
					description: "{Txt}",
					active: true
				});

				var e = new sap.ui.model.json.JSONModel();
				e.setData(this.ctrSearchResults);
				this.ctrSelectDialog.setModel(e);
				this.ctrSelectDialog.setGrowingThreshold(this.ctrSearchResults.results.length);
				this.ctrSelectDialog.bindAggregation("items", "/results", template);
				var I = this.ctrSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			this.ctrSelectDialog.open();
		},

		onCostCenterVH: function (oEvent) {
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var md = new sap.ui.model.json.JSONModel();
			// md = g.cost.getModel();
			md = g.getView().getModel("wcDetailModel");
			var costData = md.getProperty("/cost");
			var sPath = oEvent.getSource().getBindingContext("wcDetailModel").sPath;
			// g.index = parseInt(sPath.substr(1));
			g.index = parseInt(sPath.substr(sPath.lastIndexOf("/") + 1));

			this.ccSelectDialog = new sap.m.TableSelectDialog({

				title: this.getView().getModel("i18n").getProperty("CC"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "Cost Center"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "CO Area"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Company Code"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "CCtr Category"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Person Responsible"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "User Responsible"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Short Text"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Language"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Valid From"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Valid To"
							})
						]
					})
				],
				items: {
					path: "/CostCenterSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Kostl}"
							}),
							new sap.m.Text({
								text: "{Kokrs}"
							}),
							new sap.m.Text({
								text: "{Bukrs}"
							}),
							new sap.m.Text({
								text: "{Kosar}"
							}),
							new sap.m.Text({
								text: "{Verak}"
							}),
							new sap.m.Text({
								text: "{VerakUser}"
							}),
							new sap.m.Text({
								text: "{Mctxt}"
							}),
							new sap.m.Text({
								text: "{Spras}"
							}),
							new sap.m.Text({
								//text: "{Datab}",
								text: {
									parts: [{
										path: 'Datab'
									}],
									formatter: formatter.dateFormat
								}
							}),
							new sap.m.Text({
								//text: "{Datbi}"
								text: {
									parts: [{
										path: 'Datbi'
									}],
									formatter: formatter.dateFormat
								}
							})

						]
					})

				},
				confirm: function (E) {

					costData[g.index].CrKostl = E.getParameter("selectedItem").getCells()[0].getText();
					costData[g.index].Costcentxt = E.getParameter("selectedItem").getCells()[6].getText();
					costData[g.index].ccState = "None";
					// md.setData(costData);
					// g.cost.setModel(null, md);
					wcDetailModel.setProperty("/cost", costData);
				},
				search: function (E) {
					var sValue = E.getParameter("value");
					if (E.getSource().getBinding("items")) {
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Kostl", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Mctxt", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
					E.getSource().getBinding("items").filter(!sValue ? [] : [
						new sap.ui.model.Filter(
							[
								new sap.ui.model.Filter("Kostl", sap.ui.model.FilterOperator.Contains, sValue),
								new sap.ui.model.Filter("Mctxt", sap.ui.model.FilterOperator.Contains, sValue)
							],
							false)
					]);
				}
			});
			var q = "/CostCenterSet";

			var M = this.getView().getModel("valueHelp");
			M.read(q, {
				success: function (h) {
					if (h.results.length > 0) {
						g.ccSearchResults = h;
						var I = new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Kostl}"
								}),
								new sap.m.Text({
									text: "{Kokrs}"
								}),
								new sap.m.Text({
									text: "{Bukrs}"
								}),
								new sap.m.Text({
									text: "{Kosar}"
								}),
								new sap.m.Text({
									text: "{Verak}"
								}),
								new sap.m.Text({
									text: "{VerakUser}"
								}),
								new sap.m.Text({
									text: "{Mctxt}"
								}),
								new sap.m.Text({
									text: "{Spras}"
								}),
								new sap.m.Text({
									//text: "{Datab}"
									text: {
										parts: [{
											path: 'Datab'
										}],
										formatter: g.formatter.dateFormat
									}
								}),
								new sap.m.Text({
									//text: "{Datbi}"
									text: {
										parts: [{
											path: 'Datbi'
										}],
										formatter: g.formatter.dateFormat
									}
								})

							]
						});
						var e = new sap.ui.model.json.JSONModel();
						e.setData(h);
						g.ccSelectDialog.setModel(e);
						// g.ccSelectDialog.setGrowingThreshold(h.results.length);
						g.ccSelectDialog.bindAggregation("items", "/results", I);
					} else {
						g.ccSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
					}
				}
			});

			this.ccSelectDialog.open();
		},

		onActTypeVH: function (c) {
			this.actTypeVH("actType", c);
		},

		actTypeVH: function (p, c) {

			var g = this;
			/*var a;
			var P = p;
			a = this.getView().byId(p);*/
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var md = new sap.ui.model.json.JSONModel();
			// md = g.cost.getModel();
			md = g.getView().getModel("wcDetailModel");
			var costData = md.getProperty("/cost");
			var sPath = c.getSource().getBindingContext("wcDetailModel").sPath;
			// g.index = parseInt(sPath.substr(1));
			g.index = parseInt(sPath.substr(sPath.lastIndexOf("/") + 1));

			if (this.actSearchResults === undefined) {

				this.actSelectDialog = new sap.m.SelectDialog({

					title: this.getView().getModel("i18n").getProperty("ACT_TYPE"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/WCActivitySet", //"/ActivityTypeSet",
						template: new sap.m.StandardListItem({
							title: "{Lstar}",
							description: "{Ktext}"
						})
					},
					confirm: function (E) {
						costData[g.index].aState = "None";
						costData[g.index].CrLstar = E.getParameters().selectedItem.getProperty("title");
						costData[g.index].ActvttypeTxt = E.getParameters().selectedItem.getProperty("description");
						// md.setData(costData);
						// g.cost.setModel(md);
						wcDetailModel.setProperty("/cost", costData);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Lstar", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}

					}
				});
				var q = "/WCActivitySet"; //ActivityTypeSet";
				var aFilters = [new sap.ui.model.Filter("Kokrs", "EQ", costData[g.index].CrKokrs),
								new sap.ui.model.Filter("Kostl", "EQ", costData[g.index].CrKostl)];
				var M = this.getView().getModel("valueHelp2");
				M.read(q, {
					filters: aFilters,
					success: function (h) {
						if (h.results.length > 0) {
							g.actSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Lstar}",
								description: "{Ktext}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							g.actSelectDialog.setModel(e);
							// g.actSelectDialog.setGrowingThreshold(h.results.length);
							g.actSelectDialog.bindAggregation("items", "/results", I);
						} else {
							g.actSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});

			} else {

				var e = new sap.ui.model.json.JSONModel();
				e.setData(this.actSearchResults);
				this.actSelectDialog.setModel(e);
				var I = this.actSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			this.actSelectDialog.open();

		},

		onFormulaKeyVH: function (c) {
			this.formulaKeyVH("formKey", c);
		},

		formulaKeyVH: function (p, c) {

			var g = this;
			/*var a;
			var P = p;
			a = this.getView().byId(p);*/
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var md = new sap.ui.model.json.JSONModel();
			// md = g.cost.getModel();
			md = g.getView().getModel("wcDetailModel");
			var costData = md.getProperty("/cost");
			var sPath = c.getSource().getBindingContext("wcDetailModel").sPath;
			// g.index = parseInt(sPath.substr(1));
			g.index = parseInt(sPath.substr(sPath.lastIndexOf("/") + 1));

			if (this.fSearchResults === undefined) {

				this.fSelectDialog = new sap.m.SelectDialog({

					title: this.getView().getModel("i18n").getProperty("FORM_KEY"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/FormKeyCostingSet",
						template: new sap.m.StandardListItem({
							title: "{Ident}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						costData[g.index].fState = "None";
						costData[g.index].Forn1 = E.getParameters().selectedItem.getProperty("title");
						costData[g.index].Frmltxt = E.getParameters().selectedItem.getProperty("description");
						// md.setData(costData);
						// g.cost.setModel(md);
						wcDetailModel.setProperty("/cost", costData);

					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Ident", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Txt", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}

					}
				});
				var q = "/FormKeyCostingSet";

				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h) {
						if (h.results.length > 0) {
							g.fSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Ident}",
								description: "{Txt}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							g.fSelectDialog.setModel(e);
							// g.fSelectDialog.setGrowingThreshold(h.results.length);
							g.fSelectDialog.bindAggregation("items", "/results", I);
						} else {
							g.fSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});

			} else {

				var e = new sap.ui.model.json.JSONModel();
				e.setData(this.fSearchResults);
				this.fSelectDialog.setModel(e);
				var I = this.fSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			this.fSelectDialog.open();

		},

		onWCUsageVH: function (oEvent) {
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			if (this.uSearchResults === undefined || this.uSearchResults === {}) {

				this.uSelectDialog = new sap.m.SelectDialog({

					title: this.getView().getModel("i18n").getProperty("USAGE"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/WCUsageVHSet",
						template: new sap.m.StandardListItem({
							title: "{PLANV}",
							description: "{TXT}"
						})
					},
					confirm: function (E) {
						g.currentObj.usgValueState = "None";
						g.currentObj.usgValueStateTxt = "";
						g.currentObj.usg = E.getParameters().selectedItem.getProperty("title");
						g.currentObj.usgDesc = E.getParameters().selectedItem.getProperty("description");
						wcDetailModel.setData(g.currentObj);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("PLANV", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("TXT", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}

					}
				});
				var q = "/WCUsageVHSet";
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h) {
						if (h.results.length > 0) {
							g.uSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{PLANV}",
								description: "{TXT}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							g.uSelectDialog.setModel(e);
							g.uSelectDialog.setGrowingThreshold(h.results.length);
							g.uSelectDialog.bindAggregation("items", "/results", I);
						} else {
							g.uSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});

			} else {
				var template = new sap.m.StandardListItem({
					title: "{PLANV}",
					description: "{TXT}",
					active: true
				});
				var e = new sap.ui.model.json.JSONModel();
				e.setData(this.uSearchResults);
				this.uSelectDialog.setModel(e);
				this.uSelectDialog.setGrowingThreshold(this.uSearchResults.results.length);
				this.uSelectDialog.bindAggregation("items", "/results", template);
				var I = this.uSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			this.uSelectDialog.open();
		},

		onStdValVH: function (oEvent) {
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			if (this.stdSearchResults === undefined || this.stdSearchResults === {}) {
				this.stdSelectDialog = new sap.m.SelectDialog({

					title: this.getView().getModel("i18n").getProperty("STD_VALUE_KEY"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/StandardValueKeySet",
						template: new sap.m.StandardListItem({
							title: "{Vgwts}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						g.currentObj.stdValueState = "None";
						g.currentObj.stdValueStateTxt = "";
						g.currentObj.stdVal = E.getParameters().selectedItem.getProperty("title");
						g.currentObj.stdValDesc = E.getParameters().selectedItem.getProperty("description");
						wcDetailModel.setData(g.currentObj);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Vgwts", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Txt", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}

					}
				});
				var q = "/StandardValueKeySet";

				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h) {
						if (h.results.length > 0) {
							g.stdSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Vgwts}",
								description: "{Txt}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							g.stdSelectDialog.setModel(e);
							g.stdSelectDialog.setGrowingThreshold(h.results.length);
							g.stdSelectDialog.bindAggregation("items", "/results", I);
						} else {
							g.stdSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});

			} else {
				var template = new sap.m.StandardListItem({
					title: "{Vgwts}",
					description: "{Txt}",
					active: true
				});
				var e = new sap.ui.model.json.JSONModel();
				e.setData(this.stdSearchResults);
				this.stdSelectDialog.setModel(e);
				this.stdSelectDialog.setGrowingThreshold(this.stdSearchResults.results.length);
				this.stdSelectDialog.bindAggregation("items", "/results", template);
				var I = this.stdSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			this.stdSelectDialog.open();
		},

		onPerRespVH: function (oEvent) {
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var plant = g.currentObj.plant;
			var oFilter = new sap.ui.model.Filter("Werks", "EQ", plant);
			if (this.prSearchResults === undefined || this.prSearchResults === {}) {
				this.prSelectDialog = new sap.m.TableSelectDialog({

					title: this.getView().getModel("i18n").getProperty("PERSON_RESP"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "Plant"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Person Responsible"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Name"
							})
						]
					})],
					items: {
						//path: "/PersonRespVHSet?$filter=Werks%20eq%20%27" + plant + "%27",
						path: "/PersonRespVHSet",
						filters: oFilter,
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Werks}"
								}),
								new sap.m.Text({
									text: "{Veran}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								})
							]
						})
					},
					confirm: function (E) {
						g.currentObj.personResValueState = "None";
						g.currentObj.personResValueStateTxt = "";
						g.currentObj.person = E.getParameter("selectedItem").getCells()[1].getText();
						g.currentObj.personDesc = E.getParameter("selectedItem").getCells()[2].getText();
						wcDetailModel.setData(g.currentObj);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Veran", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}

					}
				});
				var q = "/PersonRespVHSet";
				// var oFilter = new sap.ui.model.Filter("Werks", "EQ", plant);
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					filters: [oFilter],
					success: function (h) {
						if (h.results.length > 0) {
							g.prSearchResults = h;
							var I = new sap.m.ColumnListItem({
								type: "Active",
								unread: false,
								cells: [
									new sap.m.Text({
										text: "{Werks}"
									}),
									new sap.m.Text({
										text: "{Veran}"
									}),
									new sap.m.Text({
										text: "{Ktext}"
									})
								]
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							g.prSelectDialog.setModel(e);
							g.prSelectDialog.setGrowingThreshold(h.results.length);
							g.prSelectDialog.bindAggregation("items", "/results", I);
						} else {
							g.prSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var template = new sap.m.ColumnListItem({
					type: "Active",
					unread: false,
					cells: [
						new sap.m.Text({
							text: "{Werks}"
						}),
						new sap.m.Text({
							text: "{Veran}"
						}),
						new sap.m.Text({
							text: "{Ktext}"
						})
					]
				});
				var e = new sap.ui.model.json.JSONModel();
				e.setData(this.prSearchResults);
				this.prSelectDialog.setModel(e);
				this.prSelectDialog.setGrowingThreshold(this.prSearchResults.results.length);
				this.prSelectDialog.bindAggregation("items", "/results", template);
				var I = this.prSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			this.prSelectDialog.open();
		},

		/** End **/

		/** Change Functions for Work Center **/
		/*plantChange: function() {
			var a = this.getView().byId("plant");
			if (a.getValue() === "") {
				this.getView().byId("plantDesc").setValue();
			}
			a.setValueState("None");
		},*/
		onLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		onWCChange: function (oEvent) {
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
			case "wc":
				this._workCenter(value, oEvent);
				break;
			case "plant":
				this._plant(value, oEvent);
				break;
			case "wcCat":
				this._workCenterCategory(value, oEvent);
				break;
			case "person":
				this._personResponsible(value, oEvent);
				break;
			case "usg":
				this._usage(value, oEvent);
				break;
			case "stdVal":
				this._standardValueKey(value, oEvent);
				break;
			case "ctrlKey":
				this._controlKey(value, oEvent);
				break;
			}
		},

		/*onPlantChange: function() {
			var t = this.getView().byId("plant");
			var c = t.getValue().toUpperCase();
			t.setValue(c);
			this._plant(t);
		},*/
		_plant: function (f, oEvent) {
			var c = f.toUpperCase();
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/PlantVHSet";
				var oFilter = new sap.ui.model.Filter("Plant", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.plantDesc = d.results[0].PlantName;
							g.currentObj.plant = a;
							wcDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.plantValueState = "Error";
							g.currentObj.plantDesc = "";
							g.currentObj.plantValueStateTxt = "Invalid Entry";
							wcDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.plantValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.plantValueStateTxt = d;
						wcDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.plant = a;
				wcDetailModel.setData(g.currentObj);
			}
		},
		/*workCenterChange: function() {
			var a = this.getView().byId("workCenter");
			if (a.getValue() === "") {
				this.getView().byId("workCenterDesc").setValue();
			}
			a.setValueState("None");
		},*/
		/*onWorkCenterChange: function() {
			var t = this.getView().byId("workCenter");
			var c = t.getValue().toUpperCase();
			t.setValue(c);
			this._workCenter(t);
		},*/
		_workCenter: function (f) {
			var c = f.toUpperCase();
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/WorkCenterVHSet";
				var oFilter = new sap.ui.model.Filter("Arbpl", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				var lData = false;

				var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						if (oModelData[i].wc === c) {
							g.currentObj.wc = a;
							g.currentObj.wcDesc = oModelData[i].Ktext;
							wcDetailModel.setData(g.currentObj);
							lData = true;
						}
					}
				}

				if (lData === true) {
					return;
				} else {
					m.read(q, {
						filters: [oFilter],
						success: function (d) {
							if (d.results.length > 0) {
								g.currentObj.wc = a;
								g.currentObj.wcDesc = d.results[0].Ktext;
								wcDetailModel.setData(g.currentObj);
							} else {
								g.currentObj.wcValueState = "Error";
								g.currentObj.wcValueStateTxt = "Invalid Entry";
								wcDetailModel.setData(g.currentObj);
							}
						},
						error: function (e) {
							g.currentObj.wcValueState = "Error";
							var b = JSON.parse(e.responseText);
							var d = b.error.message.value;
							g.currentObj.wcValueStateTxt = d;
							wcDetailModel.setData(g.currentObj);
						}
					});
				}
			} else {
				g.currentObj.wc = a;
				wcDetailModel.setData(g.currentObj);
			}
		},

		/*workCategoryChange: function() {
			var a = this.getView().byId("workCategory");
			if (a.getValue() === "") {
				this.getView().byId("workCenterCatDesc").setValue();
			}
			a.setValueState("None");
		},*/
		/*onWrkCatChange: function() {
			var t = this.getView().byId("workCategory");
			var c = t.getValue().toUpperCase();
			t.setValue(c);
			this._workCenterCategory(t);
		},*/
		_workCenterCategory: function (f) {
			var c = f.toUpperCase();
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/WorkCentCatVHSet";
				var oFilter = new sap.ui.model.Filter("Verwe", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.wcCatDesc = d.results[0].Ktext;
							g.currentObj.wcCat = a;
							wcDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.wcCatValueState = "Error";
							g.currentObj.wcCatDesc = "";
							g.currentObj.wcCatValueStateTxt = "Invalid Entry";
							wcDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.wcCatValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.wcCatValueStateTxt = d;
						wcDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.wcCat = a;
				wcDetailModel.setData(g.currentObj);
			}
		},

		/*personRespChange: function() {
			var a = this.getView().byId("personResp");
			if (a.getValue() === "") {
				this.getView().byId("personRespDesc").setValue();
			}
			a.setValueState("None");
		},*/
		/*onPersonRespChange: function() {
			var t = this.getView().byId("personResp");
			var c = t.getValue().toUpperCase();
			t.setValue(c);
			this._personResponsible(t);
		},*/
		_personResponsible: function (f) {
			var c = f.toUpperCase();
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var p = g.currentObj.plant;
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/PersonRespVHSet";
				var oFilter = [new sap.ui.model.Filter("Werks", "EQ", p),
					new sap.ui.model.Filter("Veran", "EQ", c)
				];
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.personDesc = d.results[0].Ktext;
							g.currentObj.person = a;
							wcDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.personResValueState = "Error";
							g.currentObj.personDesc = "";
							g.currentObj.personResValueStateTxt = "Invalid Entry";
							wcDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.personResValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.personResValueStateTxt = d;
						wcDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.person = a;
				wcDetailModel.setData(g.currentObj);
			}
		},

		/*usageChange: function() {
			var a = this.getView().byId("usage");
			if (a.getValue() === "") {
				this.getView().byId("usageDesc").setValue();
			}
			a.setValueState("None");
		},*/
		/*onusageChange: function() {
			var t = this.getView().byId("usage");
			var c = t.getValue().toUpperCase();
			t.setValue(c);
			this._usage(t);
		},*/
		_usage: function (f) {
			var c = f.toUpperCase();
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/WCUsageVHSet";
				var oFilter = new sap.ui.model.Filter("PLANV", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							/*cd.setValue(d.results[0].);
							f.setValue(a);*/
							g.currentObj.usgDesc = d.results[0].TXT;
							g.currentObj.usg = a;
							wcDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.usgValueState = "Error";
							g.currentObj.usgDesc = "";
							g.currentObj.usgValueStateTxt = "Invalid Entry";
							wcDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.usgValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.usgValueStateTxt = d;
						wcDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.usg = a;
				wcDetailModel.setData(g.currentObj);
			}
		},

		/*ctrlKeyChange: function() {
			var a = this.getView().byId("ctrlKey");
			if (a.getValue() === "") {
				this.getView().byId("ctrlKeyDesc").setValue();
			}
			a.setValueState("None");
		},*/
		/*onCtrlKeyChange: function() {
			var t = this.getView().byId("ctrlKey");
			var c = t.getValue().toUpperCase();
			t.setValue(c);
			this._controlKey(t);
		},*/
		_controlKey: function (f) {
			var c = f.toUpperCase();
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/ControlKeySet";
				var oFilter = new sap.ui.model.Filter("Steus", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.ctrlKeyDesc = d.results[0].Txt;
							g.currentObj.ctrlKey = a;
							wcDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.cntrlKeyValueState = "Error";
							g.currentObj.ctrlKeyDesc = "";
							g.currentObj.cntrlKeyValueStateTxt = "Invalid Entry";
							wcDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.cntrlKeyValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.cntrlKeyValueStateTxt = d;
						wcDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.ctrlKey = a;
				wcDetailModel.setData(g.currentObj);
			}
		},
		/*stdvalueChange: function() {
			var a = this.getView().byId("stdValueKey");
			if (a.getValue() === "") {
				this.getView().byId("stdValueKeyDesc").setValue();
			}
			a.setValueState("None");
		},*/
		/*onStdValueChange: function() {
			var t = this.getView().byId("stdValueKey");
			var c = t.getValue().toUpperCase();
			t.setValue(c);
			this._standardValueKey(t);
		},*/
		_standardValueKey: function (f) {
			var c = f.toUpperCase();
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/StandardValueKeySet";
				var oFilter = new sap.ui.model.Filter("Vgwts", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.stdValDesc = d.results[0].Txt;
							g.currentObj.stdVal = a;
							wcDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.stdValueState = "Error";
							g.currentObj.stdValDesc = "";
							g.currentObj.stdValueStateTxt = "Invalid Entry";
							wcDetailModel.setData(g.currentObj);
						}
					},
					error: function (e) {
						g.currentObj.stdValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.currentObj.stdValueStateTxt = d;
						wcDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.stdVal = a;
				wcDetailModel.setData(g.currentObj);
			}
		},

		onCostChange: function (oEvent) { // var md = this.cost.getModel();
			// var md = this.getView().getModel("wcDetailModel");
			var wcDetailModel = this.getView().getModel("wcDetailModel");
			var cData = wcDetailModel.getProperty("/cost");
			var link = oEvent.getSource();
			var _iD = link.sId;
			var value = oEvent.getParameters().value;
			var sPath = oEvent.getSource().getBindingContext("wcDetailModel").sPath;
			// var index = parseInt(sPath.substr(1));
			var index = parseInt(sPath.substr(sPath.lastIndexOf("/") + 1));
			var g = this;
			var m = this.getView().getModel("valueHelp2");
			var oFilter;
			if (_iD.indexOf("costCenter") > -1) {
				if (value !== "") {
					var c = value.toUpperCase();
					var a = c.replace(/^[ ]+|[ ]+$/g, '');
					if (a !== "") {
						var q = "/CostCenterSet";
						oFilter = new sap.ui.model.Filter("Kostl", "EQ", c);
						m.read(q, {
							filters: [oFilter],
							success: function (d) {
								if (d.results.length > 0) {
									cData[index].ccState = "None";
									cData[index].CrKostl = value.toUpperCase();
									cData[index].Costcentxt = d.results[0].Mctxt;
									// md.setData(cData);
									// g.cost.setModel(null, md);
									wcDetailModel.setProperty("/cost", cData);
								} else {
									cData[index].ccState = "Error";
									// md.setData(cData);
									// g.cost.setModel(null, md);
									wcDetailModel.setProperty("/cost", cData);
								}

							},
							error: function () {
								cData[index].ccState = "Error";
								// md.setData(cData);
								// g.cost.setModel(null, md);
								wcDetailModel.setProperty("/cost", cData);
							}
						});
					}

				} else {
					cData[index].ccState = "Error";
					// md.setData(cData);
					// this.cost.setModel(null, md);
					g.getView().getModel("wcDetailModel").setProperty("/cost", cData);
				}
			}
			if (_iD.indexOf("actType") > -1) {
				if (value !== "") {
					var c = value.toUpperCase();
					var a = c.replace(/^[ ]+|[ ]+$/g, '');
					if (a !== "") {
						var q = "/WCActivitySet"; //ActivityTypeSet";
						// oFilter = new sap.ui.model.Filter("Lstar", "EQ", c);
						var aFilters = [new sap.ui.model.Filter("Kokrs", "EQ", cData[index].CrKokrs),
										new sap.ui.model.Filter("Kostl", "EQ", cData[index].CrKostl),
										new sap.ui.model.Filter("Lstar", "EQ", c)];
						m.read(q, {
							filters: aFilters, //[oFilter],
							success: function (d) {
								if (d.results.length > 0) {
									cData[index].aState = "None";
									cData[index].CrLstar = value.toUpperCase();
									cData[index].ActvttypeTxt = d.results[0].Ktext;
									// md.setData(cData);
									// g.cost.setModel(null, md);
									wcDetailModel.setProperty("/cost", cData);
								} else {
									cData[index].aState = "Error";
									// md.setData(cData);
									// g.cost.setModel(null, md);
									wcDetailModel.setProperty("/cost", cData);
								}

							},
							error: function () {
								cData[index].aState = "Error";
								// md.setData(cData);
								// g.cost.setModel(null, md);
								g.getView().getModel("wcDetailModel").setProperty("/cost", cData);
							}
						});
					}

				} else {
					cData[index].aState = "None";
					cData[index].ActvttypeTxt = "";
					// md.setData(cData);
					// this.cost.setModel(null, md);
					g.getView().getModel("wcDetailModel").setProperty("/cost", cData);
				}

			}
			if (_iD.indexOf("formKey") > -1) {
				if (value !== "") {
					var c = value.toUpperCase();
					var a = c.replace(/^[ ]+|[ ]+$/g, '');
					if (a !== "") {
						var q = "/FormKeyCostingSet";
						oFilter = new sap.ui.model.Filter("Ident", "EQ", c);
						m.read(q, {
							filters: [oFilter],
							success: function (d) {
								if (d.results.length > 0) {
									cData[index].fState = "None";
									cData[index].Forn1 = value.toUpperCase();
									cData[index].Frmltxt = d.results[0].Txt;
									// md.setData(cData);
									// g.cost.setModel(null, md);
									wcDetailModel.setProperty("/cost", cData);
								} else {
									cData[index].fState = "Error";
									// md.setData(cData);
									// g.cost.setModel(null, md);
									wcDetailModel.setProperty("/cost", cData);
								}

							},
							error: function () {
								cData[index].fState = "Error";
								// md.setData(cData);
								// g.cost.setModel(null, md);
								wcDetailModel.setProperty("/cost", cData);
							}
						});
					}

				} else {
					cData[index].fState = "None";
					cData[index].Frmltxt = "";
					// md.setData(cData);
					//this.cost.setModel(null, md);
					g.getView().getModel("wcDetailModel").setProperty("/cost", cData);
				}

			}
		},

		onWCDescChange: function () {
			var wcDetailModel = this.getView().getModel("wcDetailModel");
			this.currentObj.wcDescValueState = "None";
			wcDetailModel.setData(this.currentObj);
			// this.getView().byId("workCenterDesc").setValueState("None");
		},

		handleCostRowAdd: function () {
			var g = this;
			var wcDetailModel = g.getView().getModel("wcDetailModel");
			var wcDetailData = wcDetailModel.getData();
			var costModel = new sap.ui.model.json.JSONModel();
			var costData = g.getView().getModel("wcDetailModel").getProperty("/cost");
			if (costData) {
				costModel.setData(costData);
			}
			var m = this.getView().getModel();
			var p = this.currentObj.plant;
			var obj = {};
			if (p !== "") {
				m.read("/DerviceWCcostdefaultvalSet('" + p + "')", {
					success: function (r) {
						obj.Kokrs = r.Kokrs;
						obj.Bezei = r.Bezei;
						if (costData === undefined || costData === null) {
							var tableArray = [{
								CrKokrs: obj.Kokrs,
								Bezei: obj.Bezei,
								CrKostl: "",
								Costcentxt: "",
								CrLstar: "",
								Forn1: "",
								ActvttypeTxt: "",
								Frmltxt: "",
								ccState: "None",
								aState: "None",
								fState: "None",
								Begda: new Date(),
								Endda: new Date('December 31, 9999 23:59:59')
							}];
							// var model = new sap.ui.model.json.JSONModel();
							costModel.setData(tableArray);
							wcDetailModel.setProperty("/cost", tableArray);
						} else {
							var arr = {
								CrKokrs: obj.Kokrs,
								Bezei: obj.Bezei,
								CrKostl: "",
								Costcentxt: "",
								CrLstar: "",
								Forn1: "",
								ActvttypeTxt: "",
								Frmltxt: "",
								ccState: "None",
								aState: "None",
								fState: "None",
								Begda: null,
								Endda: new Date('December 31, 9999 23:59:59')
							};

							costData.push(arr);
							// var _model = new sap.ui.model.json.JSONModel();
							costModel.setData(costData);
							wcDetailModel.setProperty("/cost", costData);
						}
						g.getView().setModel(wcDetailModel, "wcDetailModel");
						sap.ui.getCore().setModel(wcDetailModel, "wcDetailModel");
						g.getView().getModel("wcDetailModel").refresh();
						// g.getView().byId("cosCenterTable").setModel(wcDetailModel, "wcDetailModel");
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
						g.invokeMessage(value);
					}

				});
			}
			// this.getView().setModel(wcDetailModel, "wcDetailModel");	
		},

		handleCostRowDelete: function (e) {
			var path = e.getParameter('listItem').getBindingContext("wcDetailModel").sPath;
			var obj = parseInt(path.substr(path.lastIndexOf("/") + 1));
			var wcDetailModel = this.getView().getModel("wcDetailModel");
			if (wcDetailModel.getProperty("/cost").length > 0) {
				wcDetailModel.getProperty("/cost").splice(obj, 1);
			}
			this.getView().getModel("wcDetailModel").refresh();
			this.getView().setModel(wcDetailModel, "wcDetailModel");
		},

		onCCStartDateChange: function (e) {
			var oSource = e.getSource();
			var sDateValue = oSource.getDateValue();
			var sBindPath = oSource.getBindingInfo("dateValue").binding.getContext().getPath();
			var sBindMoodel = oSource.getBindingInfo("dateValue").binding.getModel();
			var sBindIdx = sBindPath.split("/")[2];
			if (sBindIdx > 0) {
				var sPrevIdx = parseInt(sBindIdx) - 1;
				var sPrevPath = "/cost/" + sPrevIdx;
				sBindMoodel.getProperty(sPrevPath).Endda = new Date(sDateValue.getTime() - (24 * 60 * 60 * 1000));
				sBindMoodel.refresh();
			}
		},

		onCCEndDateChange: function (e) {
			var oSource = e.getSource();
			var sDateValue = oSource.getDateValue();
			var sBindPath = oSource.getBindingInfo("dateValue").binding.getContext().getPath();
			var sBindMoodel = oSource.getBindingInfo("dateValue").binding.getModel();
			var sBindIdx = sBindPath.split("/")[2];

			var sLengthCC = oSource.getBindingInfo("dateValue").binding.getModel().getData().cost.length;
			if (sBindIdx < (sLengthCC - 1)) {
				var sNxtIdx = parseInt(sBindIdx) + 1;
				var sNxtPath = "/cost/" + sNxtIdx;
				var sNxtStartDate = sBindMoodel.getProperty(sNxtPath).Begda;
				if (sNxtStartDate !== null) {
					sBindMoodel.getProperty(sBindPath).Endda = new Date(sNxtStartDate.getTime() - (24 * 60 * 60 * 1000));
					sBindMoodel.refresh();
				}
			}
		},

		invokeMessage: function (msg) {
			g.createMessagePopover(msg, "Error");
			// MessageBox.show(msg, {
			// 	title: "Error",
			// 	icon: sap.m.MessageBox.Icon.ERROR,
			// 	onClose: function () {}
			// });
		},

		wcCapacityPress: function (oEvent) {
			this._showWcCapacityDetail(oEvent.getSource());
		},

		_showWcCapacityDetail: function (oItem) {
			var path = oItem.oBindingContexts.wcDetailModel.sPath;
			this.getRouter().navTo("wccapacity", {
				itemPath: encodeURIComponent(path)
			});
		},
		wcCostingPress: function (oEvent) {
			this._showWcCostingDetail(oEvent.getSource());
		},

		_showWcCostingDetail: function (oItem) {
			var path = oItem.oBindingContexts.wcDetailModel.sPath;
			this.getRouter().navTo("wccosting", {
				itemPath: encodeURIComponent(path)
			});
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

		//////////////// Lean classification ////////////////////
		onAfterRendering: function () {
			this.attachRequest();
		},

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

		onControlAreaVH: function (oEvent) {
			ValueHelpRequest.ControlAreaVH(this, oEvent);
		},

		onControlAreaChange: function (oEvent) {
			ValueHelpRequest.ControlAreaChange(this, oEvent);
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

		/*onCharChange: function() {
			if (this.getView().byId("charName").getValue() !== "") {
				this.getView().byId("codeGroup").setValueState("None");
				this.getView().byId("codeGroupLbl").setRequired(false);
			} else {
				this.getView().byId("charName").setValueState("Error");
				this.getView().byId("charNameLbl").setRequired(true);
				this.getView().byId("codeGroup").setValueState("Error");
				this.getView().byId("codeGroupLbl").setRequired(true);
				this.charFlag = false;

			}
		},*/
		/*onCodeGroupChange: function() {
			if (this.getView().byId("codeGroup").getValue() !== "") {
				this.getView().byId("charName").setValueState("None");
				this.getView().byId("charNameLbl").setRequired(false);
			} else {
				this.getView().byId("charName").setValueState("Error");
				this.getView().byId("charNameLbl").setRequired(true);
				this.getView().byId("codeGroup").setValueState("Error");
				this.getView().byId("codeGroupLbl").setRequired(true);

			}
		},*/

		/*valueHelpFun: function(oEvent) {
			this.url = "/sap/opu/odata/UGIOD01/MDG_EAM_WORKCENTER_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(this.url, true);
			var source = oEvent.getSource();
			this.inputId = source.sId;
			var str = [];
			str = this.inputId.split("--");

			var inputId = str[1];

			if (this.inputId.indexOf("plant") > 0) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"ugieamui.mdg.eam.wc.view.Fragment.Plant",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);

				this._valueHelpDialog.setModel(oModel);

				this._valueHelpDialog.open();
			}
			if (this.inputId.indexOf("workCenter") > 0) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"ugieamui.mdg.eam.wc.view.Fragment.WC",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
				var plant = this.getView().byId("plant").getValue();

				this._valueHelpDialog.setModel(oModel);
				this._valueHelpDialog.bindAggregation("items", "/WorkCenterVHSet?$filter=Werks%20eq%20%27" + plant + "%27", new sap.m.ColumnListItem({
					type: "Active",
					unread: false,
					cells: [
						new sap.m.Text({
							text: "{Verwe}"
						}),
						new sap.m.Text({
							text: "{Werks}"
						}),
						new sap.m.Text({
							text: "{Arbpl}"
						}),
						new sap.m.Text({
							text: "{Ktext}"
						}),
						new sap.m.Text({
							text: "{Spras}"
						})
					]
				}));
				this._valueHelpDialog.open();

			}
			if (this.inputId.indexOf("workCategory") > 0) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"ugieamui.mdg.eam.wc.view.Fragment.WCCategory",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);

				this._valueHelpDialog.setModel(oModel);

				this._valueHelpDialog.open();
			}
			if (this.inputId.indexOf("personResp") > 0) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"ugieamui.mdg.eam.wc.view.Fragment.PersonResp",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);

				var plant = this.getView().byId("plant").getValue();

				this._valueHelpDialog.setModel(oModel);
				this._valueHelpDialog.bindAggregation("items", "/PersonRespVHSet?$filter=Werks%20eq%20%27" + plant + "%27", new sap.m.ColumnListItem({
					type: "Active",
					unread: false,
					cells: [
						new sap.m.Text({
							text: "{Werks}"
						}),
						new sap.m.Text({
							text: "{Veran}"
						}),
						new sap.m.Text({
							text: "{Ktext}"
						})
					]
				}));
				this._valueHelpDialog.open();
			}
			if (this.inputId.indexOf("usage") > 0) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"ugieamui.mdg.eam.wc.view.Fragment.Usage",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);

				this._valueHelpDialog.setModel(oModel);
				this._valueHelpDialog.open();
			}
			if (this.inputId.indexOf("stdValueKey") > 0) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"ugieamui.mdg.eam.wc.view.Fragment.StdValueKey",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);

				this._valueHelpDialog.setModel(oModel);
				this._valueHelpDialog.open();
			}

		},*/

		/*handleValueHelpClose: function(oEvent) {

			var oSelectedItem = oEvent.getParameter("selectedItem");

			var str = [];
			str = this.inputId.split("--");
			var inputId = str[1];
			if (oSelectedItem) {
				if (this.inputId.indexOf("plant") > 0) {

					var pInput = this.getView().byId(this.inputId);
					var pDesc = this.getView().byId("plantDesc");
					var cells = oSelectedItem.getCells();
					pInput.setValue(cells[8].getText());
					pDesc.setValue(cells[9].getText());

					oEvent.getSource().getBinding("items").filter([]);

					if (this.getView().byId("plant").getValue() !== "") {
						this.getView().byId("plant").setValueState("None");
					} else {
						this.getView().byId("plant").setValueState("Error");
					}
				}

				if (this.inputId.indexOf("workCenter") > 0) {

					var wcInput = this.getView().byId(this.inputId);

					var cells = oSelectedItem.getCells();
					wcInput.setValue(cells[2].getText());
					oEvent.getSource().getBinding("items").filter([]);

					if (this.getView().byId("workCenter").getValue() !== "") {
						this.getView().byId("workCenter").setValueState("None");
					} else {
						this.getView().byId("workCenter").setValueState("Error");
					}
				}

				if (this.inputId.indexOf("workCategory") > 0) {

					var catInput = this.getView().byId(this.inputId);
					var cattDesc = this.getView().byId("workCenterCatDesc");

					catInput.setValue(oSelectedItem.getTitle());
					cattDesc.setValue(oSelectedItem.getDescription());

					if (this.getView().byId("workCategory").getValue() !== "") {
						this.getView().byId("workCategory").setValueState("None");
					} else {
						this.getView().byId("workCategory").setValueState("Error");
					}

					oEvent.getSource().getBinding("items").filter([]);
				}

				if (this.inputId.indexOf("personResp") > 0) {

					var prInput = this.getView().byId(this.inputId);
					var prDesc = this.getView().byId("personRespDesc");
					var cells = oSelectedItem.getCells();
					prInput.setValue(cells[1].getText());
					prDesc.setValue(cells[2].getText());

					oEvent.getSource().getBinding("items").filter([]);
					if (this.getView().byId("personResp").getValue() !== "") {
						this.getView().byId("personResp").setValueState("None");
					} else {
						this.getView().byId("personResp").setValueState("Error");
					}

				}
				if (this.inputId.indexOf("usage") > 0) {
					var usage = this.getView().byId(this.inputId);
					var usageDesc = this.getView().byId("usageDesc");

					usage.setValue(oSelectedItem.getTitle());
					usageDesc.setValue(oSelectedItem.getDescription());

					oEvent.getSource().getBinding("items").filter([]);
					if (this.getView().byId("usage").getValue() !== "") {
						this.getView().byId("usage").setValueState("None");
					} else {
						this.getView().byId("usage").setValueState("Error");
					}
				}
				if (this.inputId.indexOf("stdValueKey") > 0) {
					var key = this.getView().byId(this.inputId);
					var keyDesc = this.getView().byId("stdValueKeyDesc");

					key.setValue(oSelectedItem.getTitle());
					keyDesc.setValue(oSelectedItem.getDescription());

					oEvent.getSource().getBinding("items").filter([]);
					if (this.getView().byId("stdValueKey").getValue() !== "") {
						this.getView().byId("stdValueKey").setValueState("None");
					} else {
						this.getView().byId("stdValueKey").setValueState("Error");
					}
				}

			}
		},

		handleVlaueHelpSearch: function(oEvent) {
			var str = [];
			str = this.inputId.split("--");
			var inputId = str[1];
			var sValue = oEvent.getParameter("value");
			if (inputId === "workCenter") {

				oEvent.getSource().getBinding("items").filter(!sValue ? [] : [
					new sap.ui.model.Filter(
						[
							new sap.ui.model.Filter("Verwe", sap.ui.model.FilterOperator.Contains, sValue),
							new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.Contains, sValue),
							new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.contains, sValue),
							new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.contains, sValue)
						],
						true)
				]);

			}

		},*/

		/** Other Required Functions - Work Center **/

		/*readDefaultCost: function() {

			var m = this.getView().getModel();
			// var p = this.getView().byId("plant").getValue();
			var p = this.currentObj.plant;
			var obj = {};

			m.read("/DerviceWCcostdefaultvalSet('" + p + "')", {
				success: function(r) {
					obj.Kokrs = r.Kokrs;
					obj.Bezei = r.Bezei;
				},
				error: function() {}

			});

			return obj;
		},*/

		/*handleCostRowAdd: function() {
			var costModel = new sap.ui.model.json.JSONModel();
			var items = this.getView().byId("costItems");
			var costData = null;
			if (this.cost.getModel() !== undefined) {
				costData = this.cost.getModel().getData();
			}
			var g = this;
			//costModel = this.cost.getModel().getData();
			// var p = this.getView().byId("plant").getValue();
			var m = this.getView().getModel();
			var p = this.currentObj.plant;
			// var obj = {};
			if (p !== "") {
				// var result = this.readDefaultCost();
				m.read("/DerviceWCcostdefaultvalSet('" + p + "')", {
					success: function(r) {
						if (costData === null) {
							var tableArray = [{
								CrKokrs: r.Kokrs,
								Bezei: r.Bezei,
								CrKostl: "",
								Costcentxt: "",
								CrLstar: "",
								Forn1: "",
								ActvttypeTxt: "",
								Frmltxt: "",
								ccState: "None",
								aState: "None",
								fState: "None"
							}];
							var model = new sap.ui.model.json.JSONModel();
							model.setData(tableArray);
							g.cost.setModel(model);
						} else {
							var arr = {
								CrKokrs: r.Kokrs,
								Bezei: r.Bezei,
								CrKostl: "",
								Costcentxt: "",
								CrLstar: "",
								Forn1: "",
								ActvttypeTxt: "",
								Frmltxt: "",
								ccState: "None",
								aState: "None",
								fState: "None"
							};

							costData.push(arr);
							var _model = new sap.ui.model.json.JSONModel();
							_model.setData(costData);
							g.cost.setModel(_model);
							g.cost.bindItems("/", items);
						}
					}
				});
			}
		},*/

	});

});