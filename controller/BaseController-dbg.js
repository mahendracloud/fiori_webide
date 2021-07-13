sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
	"ugiaiwui/mdg/aiw/library/js/ClassUtils",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	// "sap/ui/core/format/NumberFormat"
], function (Controller, JSONModel, History, formatter, ValueHelpRequest, ClassUtils, ValueHelpProvider) { //NumberFormat
	"use strict";

	// var oNumberFormat = NumberFormat.getFloatInstance({
	// 	// maxFractionDigits: 7,
	// 	// minFractionDigits: 2,
	// 	decimalSeparator: ",",
	// 	decimals: 3,
	// 	groupingEnabled: true,
	// 	groupingSeparator: "."
	// }, sap.ui.getCore().getConfiguration().getLocale());

	var gDOIElementFrag = undefined;
	var gDOIMainFrag = undefined;

	return Controller.extend("ugiaiwui.mdg.aiw.request.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */
		addHistoryEntry: (function () {
			var aHistoryEntries = [];

			return function (oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function (entry) {
					return entry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function (oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})(),

		/*
		 * Function to handle 'change' event of Measuring Point
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMeasuringPointChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeMeasPointNumber(oEvent, g);
			}
		},

		/*
		 * Function to handle 'change' event of Postal Code
		 * @public
		 */
		onPostalCodeChange: function () {
			var g = this;
			var oAIWModel = g.getView().getModel(g.oModelName);
			var oAIWData = oAIWModel.getData();
			oAIWModel.setData(oAIWData);
			if ((oAIWData.Title !== "" && oAIWData.Title !== undefined) || (oAIWData.TitleCode !== "" && oAIWData.TitleCode !== undefined) || (
					oAIWData.Name1 !== "" && oAIWData.Name1 !== undefined) || (oAIWData.Name2 !== "" && oAIWData.Name2 !== undefined) || (oAIWData.Name3 !==
					"" && oAIWData.Name3 !== undefined) || (oAIWData.Name4 !== "" && oAIWData.Name4 !== undefined) ||
				(oAIWData.Sort1 !== "" && oAIWData.Sort1 !== undefined) || (oAIWData.Sort2 !== "" && oAIWData.Sort2 !== undefined) || (oAIWData.NameCo !==
					"" && oAIWData.NameCo !== undefined) || (oAIWData.PostCod1 !== "" && oAIWData.PostCod1 !== undefined) || (oAIWData.City1 !== "" &&
					oAIWData.City1 !== undefined) || (oAIWData.Building !== "" && oAIWData.Building !== undefined) ||
				(oAIWData.Floor !== "" && oAIWData.Floor !== undefined) || (oAIWData.Roomnum !== "" && oAIWData.Roomnum !== undefined) || (
					oAIWData.AddrLocation !== "" && oAIWData.AddrLocation !== undefined) || (oAIWData.Strsuppl1 !== "" && oAIWData.Strsuppl1 !==
					undefined) || (oAIWData.Strsuppl2 !== "" && oAIWData.Strsuppl2 !== undefined) ||
				(oAIWData.Strsuppl3 !== "" && oAIWData.Strsuppl3 !== undefined) || (oAIWData.TimeZone !== "" && oAIWData.TimeZone !== undefined) ||
				(oAIWData.RefPosta !== "" && oAIWData.RefPosta !== undefined) || (oAIWData.Region !== "" && oAIWData.Region !== undefined)) {
				oAIWData.RefPostaLblReq = true;
				g.onTimeZoneValidation("", oAIWData.RefPosta, oAIWData.PostCod1);
			} else {
				oAIWData.RefPostaLblReq = false;
				oAIWData.RefPostaVS = "None";
			}
			oAIWModel.setData(oAIWData);
		},

		/*
		 * Function to validate Time Zone
		 * @public
		 * @param {string} pTimeZone
		 * @param {string} pCountryKey
		 * @param {string} pPostalCode
		 */
		onTimeZoneValidation: function (pTimeZone, pCountryKey, pPostalCode) {
			var g = this;
			var oMainModel = g.getView().getModel("mainView");
			var oMainData = oMainModel.getData();
			var oAIWModel = g.getView().getModel(g.oModelName);
			var oAIWData = oAIWModel.getData();
			var oModel = g.getView().getModel("valueHelp");
			var sPath = "/TzoneValidSet(Tzone='" + pTimeZone + "',Land1='" + pCountryKey + "',PostalCode='" + pPostalCode + "')";
			var fnSuccess = function (data) {
				oAIWData.TimeZone = data.Tzone;
				oAIWData.TimeZoneVS = "None";
				oAIWData.PostCod1VS = "None";
				oAIWModel.setData(oAIWData);
				if ((oAIWData.Title !== "" && oAIWData.Title !== undefined) || (oAIWData.TitleCode !== "" && oAIWData.TitleCode !== undefined) ||
					(oAIWData.Name1 !== "" && oAIWData.Name1 !== undefined) || (oAIWData.Name2 !== "" && oAIWData.Name2 !== undefined) || (oAIWData.Name3 !==
						"" && oAIWData.Name3 !== undefined) || (oAIWData.Name4 !== "" && oAIWData.Name4 !== undefined) ||
					(oAIWData.Sort1 !== "" && oAIWData.Sort1 !== undefined) || (oAIWData.Sort2 !== "" && oAIWData.Sort2 !== undefined) || (oAIWData.NameCo !==
						"" && oAIWData.NameCo !== undefined) || (oAIWData.PostCod1 !== "" && oAIWData.PostCod1 !== undefined) || (oAIWData.City1 !== "" &&
						oAIWData.City1 !== undefined) || (oAIWData.Building !== "" && oAIWData.Building !== undefined) ||
					(oAIWData.Floor !== "" && oAIWData.Floor !== undefined) || (oAIWData.Roomnum !== "" && oAIWData.Roomnum !== undefined) || (
						oAIWData.AddrLocation !== "" && oAIWData.AddrLocation !== undefined) || (oAIWData.Strsuppl1 !== "" && oAIWData.Strsuppl1 !==
						undefined) || (oAIWData.Strsuppl2 !== "" && oAIWData.Strsuppl2 !== undefined) ||
					(oAIWData.Strsuppl3 !== "" && oAIWData.Strsuppl3 !== undefined) || (oAIWData.TimeZone !== "" && oAIWData.TimeZone !== undefined) ||
					(oAIWData.RefPosta !== "" && oAIWData.RefPosta !== undefined) || (oAIWData.Region !== "" && oAIWData.Region !== undefined)) {
					oAIWData.RefPostaLblReq = true;
				} else {
					oAIWData.RefPostaLblReq = false;
					oAIWData.RefPostaVS = "None";
				}

				oAIWModel.setData(oAIWData);
				oMainData.viewBusy = false;
				oMainModel.setData(oMainData);
			};
			var fnError = function (e) {
				var b = JSON.parse(e.responseText);
				var d = b.error.message.value;
				if (pTimeZone !== "") {
					oAIWData.TimeZoneVS = "Error";
				} else {
					oAIWData.PostCod1VS = "Error";
				}
				oAIWModel.setData(oAIWData);
				oMainData.viewBusy = false;
				oMainModel.setData(oMainData);
				// g.invokeMessage(d);
				sap.m.MessageBox.show(d, {
					title: "Error",
					icon: sap.m.MessageBox.Icon.ERROR,
					onClose: function () {}
				});
			};
			if (pCountryKey !== "") {
				oMainData.viewBusy = true;
				oMainModel.setData(oMainData);
				g._readData(sPath, oModel, fnSuccess, fnError);
			}
		},

		/*
		 * Function to handle 'change' event of Time Zone
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onTimeZoneChange: function (oEvent) {
			var oAIWModel = this.getView().getModel(this.oModelName);
			var oAIWData = oAIWModel.getData();
			var sValue = oEvent.getSource().getValue();
			oAIWModel.setData(oAIWData);

			if ((oAIWData.Title !== "" && oAIWData.Title !== undefined) || (oAIWData.TitleCode !== "" && oAIWData.TitleCode !== undefined) || (
					oAIWData.Name1 !== "" && oAIWData.Name1 !== undefined) || (oAIWData.Name2 !== "" && oAIWData.Name2 !== undefined) || (oAIWData.Name3 !==
					"" && oAIWData.Name3 !== undefined) || (oAIWData.Name4 !== "" && oAIWData.Name4 !== undefined) ||
				(oAIWData.Sort1 !== "" && oAIWData.Sort1 !== undefined) || (oAIWData.Sort2 !== "" && oAIWData.Sort2 !== undefined) || (oAIWData.NameCo !==
					"" && oAIWData.NameCo !== undefined) || (oAIWData.PostCod1 !== "" && oAIWData.PostCod1 !== undefined) || (oAIWData.City1 !== "" &&
					oAIWData.City1 !== undefined) || (oAIWData.Building !== "" && oAIWData.Building !== undefined) ||
				(oAIWData.Floor !== "" && oAIWData.Floor !== undefined) || (oAIWData.Roomnum !== "" && oAIWData.Roomnum !== undefined) || (
					oAIWData.AddrLocation !== "" && oAIWData.AddrLocation !== undefined) || (oAIWData.Strsuppl1 !== "" && oAIWData.Strsuppl1 !==
					undefined) || (oAIWData.Strsuppl2 !== "" && oAIWData.Strsuppl2 !== undefined) ||
				(oAIWData.Strsuppl3 !== "" && oAIWData.Strsuppl3 !== undefined) || (oAIWData.TimeZone !== "" && oAIWData.TimeZone !== undefined) ||
				(oAIWData.RefPosta !== "" && oAIWData.RefPosta !== undefined) || (oAIWData.Region !== "" && oAIWData.Region !== undefined)) {
				oAIWData.RefPostaLblReq = true;
				oAIWModel.setData(oAIWData);
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeTimeZoneChange(oEvent, this);
			} else {
				oAIWData.RefPostaLblReq = false;
				oAIWData.RefPostaVS = "None";
				oAIWModel.setData(oAIWData);
			}
		},

		/*
		 * Function to read Address Title
		 * @public
		 */
		readAddressTitle: function () {
			var g = this;
			var sPath = "/AddrTittleSet";
			var oModel = g.getView().getModel("valueHelp");
			var fnSuccess = function (d) {
				if (d.results.length > 0) {
					var sArray = [{
						Title: "",
						TitleCode: ""
					}];
					for (var i = 0; i < d.results.length; i++) {
						var sObj = {
							Title: d.results[i].TitleMedi,
							TitleCode: d.results[i].Title
						};
						sArray.push(sObj);
					}
					var oJson = new JSONModel([]);
					oJson.setData(sArray);
					g.getView().setModel(oJson, "AddressTitleModel");
				}
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError);
		},

		/*
		 * Function to handle 'change' event of Address Title
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onAddressTitleChange: function (oEvent) {
			var g = this;
			var selectedItem = oEvent.getParameter("selectedItem");
			var oAIWModel = g.getView().getModel(g.oModelName);
			var oAIWData = oAIWModel.getData();

			oEvent.getSource().setValueState("None");
			oEvent.getSource().setSelectedKey(selectedItem.getKey());
			oAIWData.Title = selectedItem.getText();
			oAIWModel.setData(oAIWData);

			if ((oAIWData.Title !== "" && oAIWData.Title !== undefined) || (oAIWData.TitleCode !== "" && oAIWData.TitleCode !== undefined) || (
					oAIWData.Name1 !== "" && oAIWData.Name1 !== undefined) || (oAIWData.Name2 !== "" && oAIWData.Name2 !== undefined) || (oAIWData.Name3 !==
					"" && oAIWData.Name3 !== undefined) || (oAIWData.Name4 !== "" && oAIWData.Name4 !== undefined) ||
				(oAIWData.Sort1 !== "" && oAIWData.Sort1 !== undefined) || (oAIWData.Sort2 !== "" && oAIWData.Sort2 !== undefined) || (oAIWData.NameCo !==
					"" && oAIWData.NameCo !== undefined) || (oAIWData.PostCod1 !== "" && oAIWData.PostCod1 !== undefined) || (oAIWData.City1 !== "" &&
					oAIWData.City1 !== undefined) || (oAIWData.Building !== "" && oAIWData.Building !== undefined) ||
				(oAIWData.Floor !== "" && oAIWData.Floor !== undefined) || (oAIWData.Roomnum !== "" && oAIWData.Roomnum !== undefined) || (
					oAIWData.AddrLocation !== "" && oAIWData.AddrLocation !== undefined) || (oAIWData.Strsuppl1 !== "" && oAIWData.Strsuppl1 !==
					undefined) || (oAIWData.Strsuppl2 !== "" && oAIWData.Strsuppl2 !== undefined) ||
				(oAIWData.Strsuppl3 !== "" && oAIWData.Strsuppl3 !== undefined) || (oAIWData.TimeZone !== "" && oAIWData.TimeZone !== undefined) ||
				(oAIWData.RefPosta !== "" && oAIWData.RefPosta !== undefined) || (oAIWData.Region !== "" && oAIWData.Region !== undefined)) {
				oAIWData.RefPostaLblReq = true;
			} else {
				oAIWData.RefPostaLblReq = false;
				oAIWData.RefPostaVS = "None";
			}

			oAIWModel.setData(oAIWData);
		},

		/*
		 * Function to handle 'change' event of Functional Location
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onFunctionalLocChange: function (oEvent) {
			var g = this;
			var sIndex, oModelData;
			var sModelName = "AIWFLOC";
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
			} else {
				sValue = sValue.toUpperCase().trim();
				oEvent.getSource().setValue(sValue);
				var AIWFLOCModel = sap.ui.getCore().getModel(sModelName);
				var oAIWData = AIWFLOCModel.getData();
				var sCounter = 0;
				var oMessageList = [];
				var sStrucindicator = oEvent.getSource().getModel(sModelName).getData().Strucindicator;
				var sBindingContext = oEvent.getSource().getBindingContext(sModelName);

				if (oAIWData.length > 1) {
					for (var i = 0; i < oAIWData.length; i++) {
						if (sValue === oAIWData[i].Functionallocation) {
							sCounter++;
						}
					}

					if (sCounter > 1) {
						oEvent.getSource().setValue("");
						oEvent.getSource().setValueState("Error");
						if (g.oMessagePopover) {
							oMessageList.push({
								type: "Error",
								title: g.getResourceBundle().getText("flocExist", [sValue])
							});
							g.createMessagePopover(oMessageList, false);
						} else {
							g.invokeMessage(g.getResourceBundle().getText("flocExist", [sValue]));
						}
					} else {
						if (sStrucindicator) {
							g.readSupFlocDetails(sValue);
						}
						if (sBindingContext) {
							sIndex = sBindingContext.getPath();
							oModelData = sBindingContext.getProperty(sIndex);
							if (oModelData.Strucindicator) {
								AIWFLOCModel.setProperty(sIndex, oModelData);
								g.readSupFlocDetails(sValue);
							}
						}
					}
				} else {
					if (sStrucindicator) {
						g.readSupFlocDetails(sValue);
					}
					if (sBindingContext) {
						sIndex = sBindingContext.getPath();
						oModelData = sBindingContext.getProperty(sIndex);
						if (oModelData.Strucindicator) {
							g.readSupFlocDetails(sValue);
						}
					}
				}
			}
		},

		/*
		 * Function to handle 'select' event of Cycle Indicator
		 * @public
		 * @param {} sIndex
		 */
		cycleIndicatorSelected: function (sIndex) {
			var pIndex = sIndex;
			if (typeof sIndex === "string") {
				pIndex = parseInt(sIndex.substr(sIndex.indexOf("/") + 1));
			}
			var sAIWModel = sap.ui.getCore().getModel("AIWMPMI");
			var sAIWData = sAIWModel.getData()[pIndex];
			sAIWData.cycleIndSingle = false;
			sAIWData.cycleIndStrategy = false;
			sAIWData.cycleIndMultCntr = false;
			sAIWData.StratEnabled = false;
			sAIWData.MehrfachEnabled = false;
			sAIWData.WsetEnabled = false;

			switch (sAIWData.cycleType) {
			case 0:
				sAIWData.cycleType = 0;
				sAIWData.cycleIndSingle = true;
				sAIWData.cycleIndStrategyEnabled = false;
				sAIWData.cycleIndMultCntrEnabled = false;
				sAIWData.Strat = " ";
				sAIWData.StratDesc = " ";
				sAIWData.StratLBL = false;
				sAIWData.StratVis = false;
				sAIWData.StratDescVis = false;
				sAIWData.Wset = " ";
				sAIWData.Ktext = " ";
				sAIWData.WsetLBL = false;
				sAIWData.WsetVis = false;
				sAIWData.KtextVis = false;
				sAIWData.Mehrfach = false;
				sAIWData.MehrfachLBL = false;
				sAIWData.MehrfachVis = false;
				sAIWData.ButtonNewCycleEnabled = true;

				if (sAIWData.ScheIndRbPerformance === true) {
					sAIWData.SzaehLBL = true;
					sAIWData.SzaehVis = true;
					sAIWData.UnitcVis = true;
					sAIWData.StadtLBL = false;
					sAIWData.StadtVis = false;
				}
				break;
			case 1:
				sAIWData.cycleType = 1;
				sAIWData.cycleIndStrategy = true;
				sAIWData.cycleIndSingleEnabled = false;
				sAIWData.cycleIndMultCntrEnabled = false;
				sAIWData.StratLBL = true;
				sAIWData.StratVis = true;
				sAIWData.StratDescVis = true;
				sAIWData.StratEnabled = true;
				sAIWData.Mehrfach = false;
				sAIWData.MehrfachLBL = false;
				sAIWData.MehrfachVis = false;
				sAIWData.Wset = " ";
				sAIWData.Ktext = " ";
				sAIWData.WsetLBL = false;
				sAIWData.WsetVis = false;
				sAIWData.KtextVis = false;
				sAIWData.ButtonNewCycleEnabled = false;
				break;
			case 2:
				sAIWData.cycleType = 2;
				sAIWData.cycleIndMultCntr = true;
				sAIWData.cycleIndStrategyEnabled = false;
				sAIWData.cycleIndSingleEnabled = false;
				sAIWData.Strat = " ";
				sAIWData.StratDesc = " ";
				sAIWData.StratLBL = false;
				sAIWData.StratVis = false;
				sAIWData.StratDescVis = false;
				sAIWData.MehrfachLBL = true;
				sAIWData.MehrfachVis = true;
				sAIWData.MehrfachEnabled = true;
				sAIWData.WsetLBL = true;
				sAIWData.WsetVis = true;
				sAIWData.WsetEnabled = true;
				sAIWData.KtextVis = true;
				sAIWData.ButtonNewCycleEnabled = true;
				sAIWData.cycleSetSeqColVis = true;
				break;
			}

			if (sAIWData.menuAction === "copy" || sAIWData.menuAction === "change") {
				if (sAIWData.Mptyp === "" || sAIWData.Mptyp === undefined || sAIWData.Mptyp === " ") {
					sAIWData.MptypEnabled = true;
				} else {
					sAIWData.MptypEnabled = false;
				}
				if (sAIWData.cycleType === 1 && (sAIWData.Strat === "" || sAIWData.Strat === undefined || sAIWData.Strat === " ")) {
					sAIWData.StratEnabled = true;
				} else {
					sAIWData.StratEnabled = false;
				}
				if (sAIWData.cycleType === 2 && (sAIWData.Mehrfach === false || sAIWData.Mehrfach === "" || sAIWData.Mehrfach === undefined ||
						sAIWData.Mehrfach === " ")) {
					sAIWData.MehrfachEnabled = true;
				} else {
					sAIWData.MehrfachEnabled = false;
				}
				if (sAIWData.cycleType === 2 && (sAIWData.Wset === "" || sAIWData.Wset === undefined || sAIWData.Wset === " ")) {
					sAIWData.WsetEnabled = true;
				} else {
					sAIWData.WsetEnabled = false;
				}
			}

			pIndex = "/" + pIndex;
			sAIWModel.setProperty(pIndex, sAIWData);

			if (this.getView().getModel("AIWMPMI")) {
				this.getView().getModel("AIWMPMI").refresh();
			}
		},

		/*
		 * Common function to handle 'liveChange' event of inputs
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onLiveChange: function (oEvent) {
			var sValue = oEvent.getSource().getValue();
			if (sValue === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Common function to handle 'change' event of inputs
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onValueChange: function (oEvent) {
			var sValue = oEvent.getSource().getValue();
			if (sValue === " " || sValue === undefined) {
				oEvent.getSource().setValue("");
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
			}
		},

		/*
		 * Setter method to set 'valueState' of inputs to 'None'
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		setValueStateNone: function (oEvent) {
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Common function make 'read' odata call
		 * @public
		 * @param {string} sPath
		 * @param {object} oModel
		 * @param {function} fnSuccess
		 * @param {function} fnError
		 * @param {array} oFilters
		 * @param {object} urlParameters
		 */
		_readData: function (sPath, oModel, fnSuccess, fnError, oFilters, urlParameters) {
			oModel.read(sPath, {
				filters: oFilters,
				urlParameters: urlParameters,
				success: fnSuccess,
				error: fnError
			});
		},

		/*
		 * Common function to handle valueState of inputs
		 * @public
		 * @param {string} sParameter
		 * @param {string} sParameterVS
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleValueState: function (sParameter, sParameterVS, oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData()[sParameter];
			if (sValue === "" || sValue === undefined) {
				g.doneFlag = false;
				oEvent.getSource().getModel(g.oModelName).getData()[sParameterVS] = "Error";
			} else {
				oEvent.getSource().getModel(g.oModelName).getData()[sParameterVS] = "None";
			}
			oEvent.getSource().getModel(g.oModelName).refresh();
		},

		/*
		 * To read system type and set max lengths
		 * @public
		 * @param {object} g
		 */
		readSystem: function (g) {
			var m = g.getView().getModel("valueHelp");
			m.read("/SystemTypeSet", {
				success: function (r) {
					g.system = r.results[0].System;
					if (g.system === true) {
						g.getModel(g.oModelName).getData().ConstrTypeMaxL = 40;
						g.getModel(g.oModelName).getData().charValueMaxL = 70;
					} else {
						g.getModel(g.oModelName).getData().ConstrTypeMaxL = 18;
						g.getModel(g.oModelName).getData().charValueMaxL = 30;
					}
					g.getModel(g.oModelName).refresh();
					return g.system;
				},
				error: function () {}
			});
		},

		/*
		 * To read system status
		 * @public
		 * @param {object} g
		 */
		readSystemStatus: function (g) {
			var oJsonModel;
			if (g.getView().getModel(g.oModelName)) {
				oJsonModel = g.getView().getModel(g.oModelName);
			} else {
				oJsonModel = sap.ui.getCore().getModel(g.oModelName);
			}
			var oJsonData = oJsonModel.getData();

			var ObjTyp = "";
			if (g.oModelName === "AIWEQUI") {
				ObjTyp = "IEQ";
			} else if (g.oModelName === "AIWFLOC") {
				ObjTyp = "IFL";
			}

			var oModel = g.getView().getModel("valueHelp");
			var sPath = "/SystemStatValueHelpSet(STSMA='',ObjTyp='" + ObjTyp + "')";
			var fnSuccess = function (r) {
				if (g.oModelName === "AIWEQUI" && (oJsonData.Tplnr === "" || oJsonData.Tplnr === undefined) && (oJsonData.SuperordinateEquip ===
						"" || oJsonData.SuperordinateEquip === undefined) && oJsonData.Deact != true) {
					oJsonData.Stattext = r.TXT04;
				}
				if (g.oModelName === "AIWFLOC" && oJsonData.Deact != true) {
					oJsonData.Stattext = r.TXT04;
				}
				// oJsonData.Stattext = r.TXT04;

				oJsonModel.setData(oJsonData);
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError);
		},

		/*
		 * Function to handle 'change' event of Equipment
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		equipmentChange: function (oEvent) {
			var g = this;
			var sDescription;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Eqktx = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				var sExistFlag = false;
				var sTplnr = oEvent.getSource().getModel(g.oModelName).getData().Tplnr;
				var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						if (oModelData[i].Equnr === sValue) {
							sDescription = oModelData[i].Eqktx;
							sExistFlag = true;
							break;
						}
					}
				}

				if (g.oModelName.indexOf("Search") !== -1) {
					if (sExistFlag) {
						return;
					}
					ValueHelpRequest._changeEquiment(oEvent, g);
				} else {
					if (sExistFlag) {
						oEvent.getSource().getModel(g.oModelName).getData().Eqktx = sDescription;
						var oModelName = g.oModelName;
						if (g.oModelName === "itemDetailView") {
							if (sTplnr !== "" || sTplnr !== undefined) {
								oEvent.getSource().getModel(g.oModelName).getData().Tplnr = "";
								oEvent.getSource().getModel(g.oModelName).getData().Pltxt = "";
							}
							oModelName = "AIWMPMI";
						}
						g.fetchData(oModelName);
					} else {
						ValueHelpRequest._changeEquiment(oEvent, g);
					}
				}
			}
		},

		/*
		 * Function to handle 'change' event of Equipment
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onEquipmentChange: function (oEvent) {
			var g = this;
			var sDescription;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Eqktx = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				var sExistFlag = false;
				var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						if (oModelData[i].Equnr === sValue) {
							sDescription = oModelData[i].Eqktx;
							sExistFlag = true;
							break;
						}
					}
				}

				if (g.oModelName.indexOf("Search") !== -1) {
					if (sExistFlag) {
						return;
					}
					ValueHelpRequest._changeEquiment(oEvent, g);
				} else {
					if (sExistFlag) {
						oEvent.getSource().getModel(g.oModelName).getData().Eqktx = sDescription;
						var oModelName = g.oModelName;
						if (g.oModelName === "itemDetailView") {
							oModelName = "AIWMPMI";
						}
						g.fetchData(oModelName);
					} else {
						ValueHelpRequest._changeEquiment(oEvent, g);
					}
				}
			}
		},

		/*
		 * Function to handle 'change' event of Maintainence Plan Description
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMaintPlanDescChange: function (oEvent) {
			oEvent.getSource().setValueState("None");
			var oItemData;
			var sWpTxt = oEvent.getSource().getValue();
			var sModelData = oEvent.getSource().getModel("AIWMPMI").getData();
			if (sModelData.length) {
				for (var i = 0; i < sModelData.length; i++) {
					if (sModelData[i].Wptxt === sWpTxt) {
						oItemData = sModelData[i].itemModel;
						for (var j = 0; j < oItemData.length; j++) {
							oItemData[j].Pstxt = sWpTxt;
						}
						break;
					}
				}
			} else {
				oItemData = sModelData.itemModel;
				for (var k = 0; k < oItemData.length; k++) {
					oItemData[k].Pstxt = sWpTxt;
				}
			}
		},

		/*
		 * Function to handle 'change' event of Equipment Category
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onEquipCatChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().EquipCatgDescription = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeEquipmentCategory(oEvent, g);
			}
		},

		/*
		 * Function to read Status Profile data
		 * @public
		 * @param {string} d - Equipment type
		 * @param {object} g - Global object of controller
		 */
		readStatusProf: function (d, g) {
			var q;
			var m = g.getView().getModel();
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			var oMainModel = g.getView().getModel("mainView");
			var oMainData = oMainModel.getData();
			if (g.oModelName === "AIWEQUI") {
				q = "/DeriveSTProfileSet(Eqtyp='" + d + "',Lvorm=false,Deact=" + oJsonData.Deact + ",Fltyp='')";
			}
			if (g.oModelName === "AIWFLOC") {
				q = "/DeriveSTProfileSet(Eqtyp='',Lvorm=false,Deact=" + oJsonData.Deact + ",Fltyp='" + d + "')";
			}
			m.read(q, {
				success: function (r) {
					if (r.DescStsma !== "" && (r.Dscstatwithnum !== "" || r.Dscstatwoutnum !== "")) { //SAP Note 2598463 - Manual Correction
						oJsonData.Stattext = r.Txt30;
						oJsonData.UstaEqui = r.Txt30;
						oJsonData.StsmEqui = r.Stsma;
						oJsonData.StsmEquiDesc = r.DescStsma;
						oJsonData.UstwEqui = r.Dscstatwithnum;
						oJsonData.UswoEqui = r.Dscstatwoutnum;

						g.userWithSts = r.Dscstatwithnum;
						g.userWithoutSts = r.Dscstatwoutnum;
						oMainData.visible = true;
					} else {
						oMainData.visible = false;
						oJsonData.Stattext = ""; //r.Txt30;
						oJsonData.UstaEqui = "";
						oJsonData.StsmEqui = "";
						oJsonData.StsmEquiDesc = "";
						oJsonData.UstwEqui = "";
						oJsonData.UswoEqui = "";
					}
					oMainModel.setData(oMainData);
					oJsonModel.setData(oJsonData);
				},
				error: function () {}
			});
		},

		/*
		 * Function to handle 'liveChange' event of Status Profile
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		statProfChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().StsmEquiDesc = "";
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Status Profile
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onStatProfChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().StsmEquiDesc = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeStatProfile(oEvent, g);
			}
		},

		/*
		 * Setter method for User Status
		 * @public
		 * @param {string} s - Status object
		 * @param {string} u - Status WO
		 * @param {object} g
		 */
		generateUserStatus: function (s, u, g) {
			var user = s + " " + u;
			g.getModel(g.oModelName).getData().UstaEqui = user;
		},

		/*
		 * Function to handle 'change' event of Status Object
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onStatObjChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue(g.userWithSts);
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				g.generateUserStatus(sValue.toUpperCase(), oEvent.getSource().getModel(g.oModelName).getData().UswoEqui, g);
				ValueHelpRequest._changeStatObj(oEvent, g);
			}
		},

		/*
		 * Function to handle 'change' event of Status WO
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onStatWOChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue(g.userWithoutSts);
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				g.generateUserStatus(oEvent.getSource().getModel(g.oModelName).getData().UstwEqui, sValue.toUpperCase(), g);
				ValueHelpRequest._changeStatWONum(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Technical Object Type
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		techObjTypeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Description = "";
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Technical Object Type 
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onTechObjTypeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				if (g.detailFlag) {
					oEvent.getSource().getModel(g.oModelName).getData().Description = "";
				}
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeTechnicalObjectType(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Maintainence Plant
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		maintPlantChange: function (oEvent) {
			// var g = this;
			// var sValue = oEvent.getSource().getValue();
			// if (sValue === "" || sValue === undefined) {
			// 	oEvent.getSource().setValue("");
			// 	oEvent.getSource().getModel(g.oModelName).getData().MaintplantDesc = "";
			// 	oEvent.getSource().getModel(g.oModelName).getData().BukrsEnabled = true;
			// 	if (g.oModelName === "AIWFLOC") {
			// 		oEvent.getSource().getModel(g.oModelName).getData().City = "";
			// 	}
			// 	var dData = g.getView().getModel("dataOrigin").getData();
			// 	var name = oEvent.getSource().getName();
			// 	dData.forEach(function (data) {
			// 		if (data.property === name) {
			// 			data.maintenance = true;
			// 			data.currentVal = oEvent.getSource().getValue();
			// 		}
			// 		if (data.property === "PplaEeqz") {
			// 			data.maintenance = true;
			// 			data.currentVal = "";
			// 		}
			// 	});
			// }
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Maintainence Plant
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMaintPlantChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				var oSource = oEvent.getSource();
				sap.m.MessageBox.show("Dependent fields would be cleared after changing the Maintenance Plant. Do you want to continue", {
					// "Dependent fields must be entered again after changing the Maintainence Plant"
					title: "Warning",
					icon: sap.m.MessageBox.Icon.WARNING,
					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					onClose: function (oAction) {
						if (oAction === "OK") {
							g.SOPMaintPlant = "";
							oSource.setValue("");
							// if (g.detailFlag) {
							oSource.getModel(g.oModelName).getData().MaintplantDesc = "";
							oSource.getModel(g.oModelName).getData().Bukrs = "";
							oSource.getModel(g.oModelName).getData().Butxt = "";
							oSource.getModel(g.oModelName).getData().BukrsEnabled = true;
							oSource.getModel(g.oModelName).getData().Werks = "";
							oSource.getModel(g.oModelName).getData().Planningplantdes = "";
							oSource.getModel(g.oModelName).getData().Kokrs = "";
							// }
							if (g.oModelName === "AIWFLOC") {
								oSource.getModel(g.oModelName).getData().City = "";
							}
							oSource.getModel(g.oModelName).refresh();

							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = oSource.getValue();
								}
								if (data.property === "PplaEeqz" || data.property === "PlntFloc") {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = "";
								}
							});
						} else {
							oSource.setValue(g.SOPMaintPlant);
						}
					}
				});
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				if (oEvent.getSource().getValue() !== g.SOPMaintPlant) {
					g.validateMaintPlantChange(oEvent.getSource().getValue(), g.SOPMaintPlant, oEvent.getSource());
				} else {
					ValueHelpRequest._changeMaintenancePlant(oEvent, g);
				}
			}
		},

		/*
		 * Method to validate maintainence plant change
		 * @public
		 * @param {string} chngPlant
		 * @param {string} prevPlant
		 * @param {object} imoSource
		 */
		validateMaintPlantChange: function (chngPlant, prevPlant, imoSource) {
			var g = this;
			var oSource = imoSource;
			var q = "/MaintPlantVHSet";
			var aFilters = [new sap.ui.model.Filter("Werks", "EQ", chngPlant),
				new sap.ui.model.Filter("IWerk", "EQ", (prevPlant ? prevPlant : "")),
				new sap.ui.model.Filter("Pplant", "EQ", oSource.getModel(g.oModelName).getData().Werks)
			];
			var m = g.getView().getModel("valueHelp2");
			m.read(q, {
				filters: aFilters,
				success: function (d) {
					ValueHelpRequest._changeMaintenancePlant(oSource, g);
				},
				error: function (e) {
					var b = JSON.parse(e.responseText);
					var d = b.error.message.value;
					sap.m.MessageBox.show(d, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {
							g.getView().getModel(g.oModelName).getData().Maintplant = g.SOPMaintPlant;
							g.getView().getModel(g.oModelName).refresh();
						}
					});
				}
			});
		},

		/*
		 * Function to handle 'liveChange' event of Location
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		locationChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Locationdesc = "";
				var dData = g.getView().getModel("dataOrigin").getData();
				var name = oEvent.getSource().getName();
				dData.forEach(function (data) {
					if (data.property === name) {
						data.instLoc = false;
						data.maintenance = true;
						data.currentVal = oEvent.getSource().getValue();
					}
				});
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Location
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onLocationChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Locationdesc = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeLocation(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of ABC Indicator
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		abcIndChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Abctx = "";
				var dData = g.getView().getModel("dataOrigin").getData();
				var name = oEvent.getSource().getName();
				dData.forEach(function (data) {
					if (data.property === name) {
						data.instLoc = false;
						data.maintenance = true;
						data.currentVal = oEvent.getSource().getValue();
					}
				});
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of ABC Indicator
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onAbcIndChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Abctx = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeAbcIndicator(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Work Center
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		wcChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Ktext = "";
				oEvent.getSource().getModel(g.oModelName).getData().WcWerks = "";
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Work Center
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onWcChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Ktext = "";
				oEvent.getSource().getModel(g.oModelName).getData().WcWerks = "";
			} else {
				var lData = false;
				oEvent.getSource().setValue(sValue.toUpperCase());
				if (sap.ui.getCore().getModel("AIWListWCModel")) {
					var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].wc.toUpperCase() === sValue.toUpperCase()) {
								oEvent.getSource().setValue(sValue.toUpperCase());
								oEvent.getSource().getModel(g.oModelName).getData().Ktext = oModelData[i].wcDesc;
								oEvent.getSource().getModel(g.oModelName).getData().WcWerks = oModelData[i].plant;
								lData = true;
							}
						}
					}
				}

				if (lData === true) {
					return;
				} else {
					ValueHelpRequest._changeWorkCenter(oEvent, g);
				}
			}
		},

		/*
		 * Function to handle 'liveChange' event of Plant Section
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		plantSecChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Fing = "";
				oEvent.getSource().getModel(g.oModelName).getData().Tele = "";
				var dData = g.getView().getModel("dataOrigin").getData();
				var name = oEvent.getSource().getName();
				dData.forEach(function (data) {
					if (data.property === name) {
						data.instLoc = false;
						data.maintenance = true;
						data.currentVal = oEvent.getSource().getValue();
					}
				});
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Plant Section
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onPlantSecChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Fing = "";
				oEvent.getSource().getModel(g.oModelName).getData().Tele = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changePlantSec(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Company Code
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		companyCodeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Butxt = "";
				oEvent.getSource().getModel(g.oModelName).getData().Kokrs = "";
				if (g.oModelName === "AIWFLOC") {
					oEvent.getSource().getModel(g.oModelName).getData().City = "";
				}
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Company Code
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onCompanyCodeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Butxt = "";
				oEvent.getSource().getModel(g.oModelName).getData().Kokrs = "";
				if (g.oModelName === "AIWFLOC") {
					oEvent.getSource().getModel(g.oModelName).getData().City = "";
				}
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeCompanyCode(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Cost Center
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		costCenterChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().getModel(g.oModelName).getData().Kokrs = "";
				oEvent.getSource().getModel(g.oModelName).getData().Mctxt = "";
				var dData = g.getView().getModel("dataOrigin").getData();
				var name = oEvent.getSource().getName();
				dData.forEach(function (data) {
					if (data.property === name) {
						data.instLoc = false;
						data.maintenance = true;
						data.currentVal = oEvent.getSource().getValue();
					}
				});
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Cost Center
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onCostCenterdChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				// oEvent.getSource().getModel(g.oModelName).getData().Kokrs = "";
				oEvent.getSource().getModel(g.oModelName).getData().Mctxt = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeCostCenter(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Planning Plant
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		plPlantChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Planningplantdes = "";
				var dData = g.getView().getModel("dataOrigin").getData();
				var name = oEvent.getSource().getName();
				dData.forEach(function (data) {
					if (data.property === name) {
						data.instLoc = false;
						data.maintenance = true;
						data.currentVal = oEvent.getSource().getValue();
					}
				});
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Planning Plant
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onPlPlantChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Planningplantdes = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changePlanningPlant(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Planning Group
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		plGrpChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Innam = "";
				var dData = g.getView().getModel("dataOrigin").getData();
				var name = oEvent.getSource().getName();
				dData.forEach(function (data) {
					if (data.property === name) {
						data.instLoc = false;
						data.maintenance = true;
						data.currentVal = oEvent.getSource().getValue();
					}
				});
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Planning Group
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onPlGrpdChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Innam = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changePlannerGroup(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Main Work Center
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		mainWcChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().MainKtext = "";
				oEvent.getSource().getModel(g.oModelName).getData().MainWerks = "";
				var dData = g.getView().getModel("dataOrigin").getData();
				var name = oEvent.getSource().getName();
				dData.forEach(function (data) {
					if (data.property === name) {
						data.instLoc = false;
						data.maintenance = true;
						data.currentVal = oEvent.getSource().getValue();
					}
				});
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Main Work Center
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMainWcChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().MainKtext = "";
				oEvent.getSource().getModel(g.oModelName).getData().MainWerks = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				var lData = false;
				if (sap.ui.getCore().getModel("AIWListWCModel")) {
					var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].wc.toUpperCase() === sValue.toUpperCase()) {
								oEvent.getSource().setValue(sValue.toUpperCase());
								oEvent.getSource().getModel(g.oModelName).getData().MainKtext = oModelData[i].wcDesc;
								oEvent.getSource().getModel(g.oModelName).getData().MainWerks = oModelData[i].plant;
								lData = true;
								var dData = g.getView().getModel("dataOrigin").getData();
								var name = oEvent.getSource().getName();
								dData.forEach(function (data) {
									if (data.property === name) {
										data.instLoc = false;
										data.maintenance = true;
										data.currentVal = oModelData[i].plant;
									}
								});
								break;
							}
						}
					}
				}

				if (lData === true) {
					return;
				} else {
					ValueHelpRequest._changeMainArbpl(oEvent, g);
				}
			}
		},

		/*
		 * Function to handle 'liveChange' event of Functional Location
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		flocChange: function (oEvent) {
			var g = this;
			if (g.oModelName === "AIWEQUI") {
				g.EquiTplnr = oEvent.getSource().getModel(g.oModelName).getData().Tplnr;
				oEvent.getSource().setValueState("None");
			}

			if (g.oModelName === "AIWMSPT" || g.oModelName === "itemDetailView") {
				var sValue = oEvent.getSource().getModel(g.oModelName).getData().Tplnr;
				if (sValue === "" || sValue === undefined) {
					oEvent.getSource().getModel(g.oModelName).getData().Tplnr = "";
					oEvent.getSource().getModel(g.oModelName).getData().Pltxt = "";
				}
				oEvent.getSource().setValueState("None");
			}
		},

		/*
		 * Function to handle 'change' event of Functional Location
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onFlocChange: function (oEvent) {
			var g = this;
			var sDescription;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				// if (g.oModelName === "AIWEQUI") {
				// 	if (g.getView().getModel("SUP_EQUI_DATA")) {
				// 		var mSupEquiModel = sap.ui.getCore().getModel("SUP_EQUI_DATA");
				// 		var mSupEquiData = mSupEquiModel.getData();
				// 		var mSupEquiIndex;
				// 		for (var a = 0; a < mSupEquiData.length; a++) {
				// 			if (g.EquiTplnr === mSupEquiData[a].Tplnr) {
				// 				mSupEquiIndex = a;
				// 				break;
				// 			}
				// 		}
				// 		var localModel = g.getView().getModel(g.oModelName);
				// 		var localData = localModel.getData();
				// 		var sSupEquiData = g.getView().getModel("SUP_EQUI_DATA").getData()[0];
				// 		if (sSupEquiData) {
				// 			localData.BeberFl = localData.BeberFl === sSupEquiData.BeberFl ? "" : localData.BeberFl;
				// 			localData.Fing = localData.Fing === sSupEquiData.Fing ? "" : localData.Fing;
				// 			localData.Tele = localData.Tele === sSupEquiData.Tele ? "" : localData.Tele;
				// 			localData.Location = localData.Location === sSupEquiData.Location ? "" : localData.Location;
				// 			localData.Locationdesc = localData.Locationdesc === sSupEquiData.Locationdesc ? "" : localData.Locationdesc;
				// 			localData.Arbpl = localData.Arbpl === sSupEquiData.Arbpl ? "" : localData.Arbpl;
				// 			localData.Ktext = localData.Ktext === sSupEquiData.Ktext ? "" : localData.Ktext;
				// 			localData.WcWerks = localData.WcWerks === sSupEquiData.WcWerks ? "" : localData.WcWerks;
				// 			localData.Abckz = localData.Abckz === sSupEquiData.Abckz ? "" : localData.Abckz;
				// 			localData.Abctx = localData.Abctx === sSupEquiData.Abctx ? "" : localData.Abctx;
				// 			localData.MainArbpl = localData.MainArbpl === sSupEquiData.MainArbpl ? "" : localData.MainArbpl;
				// 			localData.MainKtext = localData.MainKtext === sSupEquiData.MainKtext ? "" : localData.MainKtext;
				// 			localData.MainWerks = localData.MainWerks === sSupEquiData.MainWerks ? "" : localData.MainWerks;
				// 			localData.Kostl = localData.Kostl === sSupEquiData.Kostl ? "" : localData.Kostl;
				// 			localData.Mctxt = localData.Mctxt === sSupEquiData.Mctxt ? "" : localData.Mctxt;
				// 			localData.Ingrp = localData.Ingrp === sSupEquiData.Ingrp ? "" : localData.Ingrp;
				// 			localData.Innam = localData.Innam === sSupEquiData.Innam ? "" : localData.Innam;

				// 			if (localData.Maintplant !== "") {
				// 				localData.SuperordinateEquipEnabled = true;
				// 				localData.MaintplantEnabled = true;
				// 				localData.BukrsEnabled = false;
				// 				localData.Bukrs = localData.Bukrs;
				// 				localData.Butxt = localData.Butxt;
				// 				localData.Kokrs = localData.Kokrs;
				// 				localData.Werks = localData.Werks;
				// 				localData.Planningplantdes = localData.Planningplantdes;
				// 			} else {
				// 				localData.BukrsEnabled = true;
				// 				localData.Bukrs = localData.Bukrs === sSupEquiData.Bukrs ? "" : localData.Bukrs;
				// 				localData.Butxt = localData.Butxt === sSupEquiData.Butxt ? "" : localData.Butxt;
				// 				localData.Kokrs = localData.Kokrs === sSupEquiData.Kokrs ? "" : localData.Kokrs;
				// 				localData.Werks = localData.Werks === sSupEquiData.Werks ? "" : localData.Werks;
				// 				localData.Planningplantdes = localData.Planningplantdes === sSupEquiData.Planningplantdes ? "" : localData.Planningplantdes;
				// 			}
				// 			localData.Title = "";
				// 			localData.TitleCode = "";
				// 			localData.Name1 = "";
				// 			localData.Name2 = "";
				// 			localData.Name3 = "";
				// 			localData.Name4 = "";
				// 			localData.Sort1 = "";
				// 			localData.Sort2 = "";
				// 			localData.NameCo = "";
				// 			localData.PostCod1 = "";
				// 			localData.City1 = "";
				// 			localData.Building = "";
				// 			localData.Floor = "";
				// 			localData.Roomnum = "";
				// 			localData.Strsuppl1 = "";
				// 			localData.Strsuppl2 = "";
				// 			localData.Strsuppl3 = "";
				// 			localData.AddrLocation = "";
				// 			localData.RefPosta = "";
				// 			localData.Landx = "";
				// 			localData.TimeZone = "";
				// 			localData.Region = "";
				// 			localData.RegionDesc = "";
				// 			localData.RefPostaLblReq = false;

				// 			var mAddressModel = sap.ui.getCore().getModel("equiAddressView");
				// 			var mAddressData = mAddressModel.getData();
				// 			for (var as = 0; as < mAddressData.length; as++) {
				// 				if (oEvent.getSource().getModel(g.oModelName).getData().Tplnr === mAddressData[as].Tplnr) {
				// 					mAddressData.splice(as, 1);
				// 					mAddressModel.setData(mAddressData);
				// 					break;
				// 				}
				// 			}

				// 			var sAddressModel = g.getView().getModel("equiAddressView");
				// 			var sAddressData = sAddressModel.getData();
				// 			sAddressData.enabled = true;
				// 			sAddressModel.setData(sAddressData);

				// 			mSupEquiData.splice(mSupEquiIndex, 1);
				// 			mSupEquiModel.setData(mSupEquiData);
				// 			oEvent.getSource().getModel(g.oModelName).getData().Stattext = "AVLB";
				// 		}
				// 	}
				// }
				if (g.oModelName === "AIWEQUI") {
					g.openDoiView(sValue);
				}
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Pltxt = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				var sExistFlag = false;
				var oModelData = sap.ui.getCore().getModel("AIWFLOC").getData();
				var sEqunr = oEvent.getSource().getModel(g.oModelName).getData().Equnr;
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						if (oModelData[i].Functionallocation === sValue.toUpperCase()) {
							sDescription = oModelData[i].Flocdescription;
							sExistFlag = true;
							break;
						}
					}
				}

				if (g.oModelName.indexOf("Search") !== -1) {
					if (sExistFlag) {
						return;
					}
					ValueHelpRequest._changeFunctionalLocation(oEvent, g);
				} else {
					if (sExistFlag) {
						oEvent.getSource().getModel(g.oModelName).getData().Pltxt = sDescription;
						var oModelName = g.oModelName;
						if (g.oModelName === "itemDetailView") {
							if (sEqunr !== "" || sEqunr !== undefined) {
								oEvent.getSource().getModel(g.oModelName).getData().Equnr = "";
								oEvent.getSource().getModel(g.oModelName).getData().Eqktx = "";
							}
							oModelName = "AIWMPMI";
						}
						g.fetchData(oModelName);
					} else {
						ValueHelpRequest._changeFunctionalLocation(oEvent, g);
					}
				}
			}
		},

		/*
		 * Function to handle 'change' event of Functional Location Category
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onFlocCatChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().FlocCategoryDesc = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeFlocCategory(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Construction Type
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		constTypeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().ConstructionDesc = "";
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Construction Type
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onConstTypeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().ConstructionDesc = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeConstructionType(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Country
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		cntryChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Landx = "";
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Country
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onCntryChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Landx = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeCntryChange(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Language
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		langChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().LanguP = "";
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Language
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onLangChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().LanguP = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeLangChange(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Maintinence Strategy
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		maintStrategyChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().StratDesc = "";
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Maintinence Strategy
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMaintStrategyChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().StratDesc = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeMaintStrategy(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Cycle
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		cycleSetChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Ktext = "";
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Cycle
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onCycleSetChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Ktext = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeCycleSet(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Factory Calender
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		factCalendarChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().FabklDesc = "";
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Factory Calender
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onFactCalendarChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().FabklDesc = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeFactoryCalendar(oEvent, g);
			}
		},

		/*
		 * Function to handle 'change' event of Counter
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onCounterChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeCounter(oEvent, g);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Region
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		regionChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().RegionDesc = "";
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Function to handle 'change' event of Region
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onRegionChange: function (oEvent) {
			var g = this;
			var oAIWModel = g.getView().getModel(g.oModelName);
			var oAIWData = oAIWModel.getData();
			var sValue = oEvent.getSource().getValue();
			oAIWModel.setData(oAIWData);

			if ((oAIWData.Title !== "" && oAIWData.Title !== undefined) || (oAIWData.TitleCode !== "" && oAIWData.TitleCode !== undefined) || (
					oAIWData.Name1 !== "" && oAIWData.Name1 !== undefined) || (oAIWData.Name2 !== "" && oAIWData.Name2 !== undefined) || (oAIWData.Name3 !==
					"" && oAIWData.Name3 !== undefined) || (oAIWData.Name4 !== "" && oAIWData.Name4 !== undefined) ||
				(oAIWData.Sort1 !== "" && oAIWData.Sort1 !== undefined) || (oAIWData.Sort2 !== "" && oAIWData.Sort2 !== undefined) || (oAIWData.NameCo !==
					"" && oAIWData.NameCo !== undefined) || (oAIWData.PostCod1 !== "" && oAIWData.PostCod1 !== undefined) || (oAIWData.City1 !== "" &&
					oAIWData.City1 !== undefined) || (oAIWData.Building !== "" && oAIWData.Building !== undefined) ||
				(oAIWData.Floor !== "" && oAIWData.Floor !== undefined) || (oAIWData.Roomnum !== "" && oAIWData.Roomnum !== undefined) || (
					oAIWData.AddrLocation !== "" && oAIWData.AddrLocation !== undefined) || (oAIWData.Strsuppl1 !== "" && oAIWData.Strsuppl1 !==
					undefined) || (oAIWData.Strsuppl2 !== "" && oAIWData.Strsuppl2 !== undefined) ||
				(oAIWData.Strsuppl3 !== "" && oAIWData.Strsuppl3 !== undefined) || (oAIWData.TimeZone !== "" && oAIWData.TimeZone !== undefined) ||
				(oAIWData.RefPosta !== "" && oAIWData.RefPosta !== undefined) || (oAIWData.Region !== "" && oAIWData.Region !== undefined)) {
				oAIWData.RefPostaLblReq = true;

				if (oAIWData.RefPosta !== "") {
					oEvent.getSource().setValue(sValue.toUpperCase());
					ValueHelpRequest._changeRegionChange(oEvent, g);
				} else {
					g.invokeMessage(g.getResourceBundle().getText("countryKeyMand"));
					oAIWData.RefPostaVS = "Error";
					oEvent.getSource().setValue("");
					oEvent.getSource().getModel(g.oModelName).getData().RegionDesc = "";
				}
				oAIWModel.setData(oAIWData);
			} else {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().RegionDesc = "";
				oAIWData.RefPostaLblReq = false;
				oAIWData.RefPostaVS = "None";
				oAIWModel.setData(oAIWData);
			}
		},

		/*
		 * Function to handle Search of Value Help
		 * @public
		 * @param {sap.ui.base.Event} E
		 */
		handleSearch: function (E) {
			var g = this;
			var sValue = E.getParameter("value");
			if (g.inputId.indexOf("EQUI_FunctionalLoc") !== -1 || g.inputId.indexOf("SuperiorFloc") !== -1 ||
				g.inputId.indexOf("MSPT_FunctionalLoc") !== -1 || g.inputId.indexOf("Item_FunctionalLoc") !== -1 ||
				g.inputId.indexOf("SRCH_FunctionalLoc") !== -1 || g.inputId.indexOf("COPY_FunctionalLoc") !== -1) {
				E.getSource().getBinding("items").filter(!sValue ? [] : [
					new sap.ui.model.Filter(
						[
							new sap.ui.model.Filter("Tplnr", sap.ui.model.FilterOperator.Contains, sValue),
							new sap.ui.model.Filter("Pltxt", sap.ui.model.FilterOperator.Contains, sValue)
						],
						true)
				]);
			} else if (g.inputId.indexOf("EQUI_Equipment") !== -1 || g.inputId.indexOf("SuperordEqui") !== -1 ||
				g.inputId.indexOf("MSPT_Equipment") !== -1 || g.inputId.indexOf("Item_Equipment") !== -1 ||
				g.inputId.indexOf("COPY_Equipment") !== -1) {
				E.getSource().getBinding("items").filter(!sValue ? [] : [
					new sap.ui.model.Filter(
						[
							new sap.ui.model.Filter("Equnr", sap.ui.model.FilterOperator.Contains, sValue),
							new sap.ui.model.Filter("Eqktx", sap.ui.model.FilterOperator.Contains, sValue)
						],
						true)
				]);
			} else if (g.inputId.indexOf("ConstructionType") !== -1) {
				E.getSource().getBinding("items").filter(!sValue ? [] : [
					new sap.ui.model.Filter(
						[
							new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, sValue),
							new sap.ui.model.Filter("Maktx", sap.ui.model.FilterOperator.Contains, sValue)
						],
						true)
				]);
			}
		},

		/*
		 * Function to handle CONFIRM of valuehelps
		 * @public
		 * @param {sap.ui.base.Event} e
		 */
		handleClose: function (e) {
			var g = this;
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			var oSelectedItem = e.getParameter("selectedItem");
			if (oSelectedItem) {
				if (g.inputId.indexOf("EQUI_FunctionalLoc") !== -1) {
					e.getSource().getBinding("items").filter([]);
					oJsonData.TplnrVS = "None";
					oJsonData.TplnrVST = "";
					oJsonData.Tplnr = e.getParameter("selectedItem").getProperty("title");
					oJsonData.Pltxt = e.getParameter("selectedItem").getProperty("description");
					oJsonModel.setData(oJsonData);
					g.fetchData();
				} else if (g.inputId.indexOf("MSPT_FunctionalLoc") !== -1 || g.inputId.indexOf("SRCH_FunctionalLoc") !== -1) {
					e.getSource().getBinding("items").filter([]);
					oJsonData.TplnrVS = "None";
					oJsonData.TplnrVST = "";
					oJsonData.Tplnr = e.getParameter("selectedItem").getProperty("title");
					oJsonData.Pltxt = e.getParameter("selectedItem").getProperty("description");
					oJsonModel.setData(oJsonData);
				} else if (g.inputId.indexOf("SuperiorFloc") !== -1) {
					e.getSource().getBinding("items").filter([]);
					oJsonData.SupFunctionallocationVS = "None";
					oJsonData.SupFunctionallocationVST = "";
					oJsonData.SupFunctionallocation = e.getParameter("selectedItem").getProperty("title");
					oJsonData.SupFlocdescription = e.getParameter("selectedItem").getProperty("description");
					oJsonModel.setData(oJsonData);
					g.readSupFlocDetails();
				} else if (g.inputId.indexOf("SuperordEqui") !== -1) {
					oJsonData.SuperordinateEquipVS = "None";
					oJsonData.SuperordinateEquipVST = "";
					oJsonData.SuperordinateEquip = e.getParameter("selectedItem").getProperty("title");
					oJsonData.SuperordinateEquipDesc = e.getParameter("selectedItem").getProperty("description");
					oJsonModel.setData(oJsonData);
					g.fetchData();
				}
				// else if(g.inputId.indexOf("EQUI_Equipment") !== -1) {
				// 	oJsonData.Equnr = e.getParameter("selectedItem").getProperty("title");
				// 	oJsonData.EqunrVS = "None";
				// 	oJsonData.EqunrVST = "";
				// 	g.getModel(g.oModelName).refresh();
				// } 
				else if (g.inputId.indexOf("EQUI_Equipment") !== -1 || g.inputId.indexOf("MSPT_Equipment") !== -1) {
					e.getSource().getBinding("items").filter([]);
					oJsonData.Equnr = e.getParameter("selectedItem").getProperty("title");
					oJsonData.Eqktx = e.getParameter("selectedItem").getProperty("description");
					oJsonData.EqunrVS = "None";
					oJsonData.EqunrVST = "";
					oJsonModel.setData(oJsonData);
				} else if (g.inputId.indexOf("ConstructionType") !== -1) {
					e.getSource().getBinding("items").filter([]);
					oJsonData.ConstrType = e.getParameter("selectedItem").getProperty("title");
					oJsonData.ConstructionDesc = e.getParameter("selectedItem").getProperty("description");
					oJsonData.ConstrTypeVS = "None";
					oJsonData.ConstrTypeVST = "";
					oJsonModel.setData(oJsonData);
				}
			}
		},

		/*
		 * Function to read derive data of Functional Location, Equipment, Measuring Point & Maintainence Plan
		 * @public
		 * @param {string} sModelName
		 * @param {string} sMainRowIndex
		 * @param {string} sItemIndex
		 */
		fetchData: function (sModelName, sMainRowIndex, sItemIndex) {
			var g = this;
			var sPath = "/ChangeRequestSet";
			var oModel = g.getView().getModel();
			var sArray = [];
			var sObject = {};
			var sPayload = {
				"ChangeRequestType": "AIWEAM0P",
				"CrDescription": "",
				"Reason": "01",
				"DeriveData": true,
				"FuncLoc": [],
				"FLAddr": [],
				"FLAddrI": [],
				"FLLAM": [],
				"FLClass": [],
				"FLVal": [],
				"FLALTLBEL": [],
				"Equipment": [],
				"EqAddr": [],
				"EqAddrI": [],
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
				"ClassMpl": [],
				"ValuaMpl": [],
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
				"OLVal": [],
				"FLLAMCH": [],
				"EqLAMCH": []
			};
			var oAIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC");
			var oAIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI");
			var oAIWMSPTModel = sap.ui.getCore().getModel("AIWMSPT");
			var oAIWMPMIModel = sap.ui.getCore().getModel("AIWMPMI");
			var oLocalModel = g.getView().getModel(sModelName);
			var sLocalVar;

			if (sModelName === "AIWFLOC") {
				sLocalVar = oLocalModel.getData().Functionallocation;
			}

			if (sModelName === "AIWEQUI") {
				sLocalVar = oLocalModel.getData().Equnr;
			}
			if (sModelName === "AIWMSPT") {
				sLocalVar = oLocalModel.getData().Mspoint;
			}
			if (sModelName === "AIWMPMI") {
				// sLocalVar = oLocalModel.getData().Warpl;
				sLocalVar = oAIWMPMIModel.getData()[sMainRowIndex].Warpl;
			}
			if (sModelName === "itemDetailView") {
				sLocalVar = oAIWMPMIModel.getData()[sMainRowIndex].Warpl;
			}

			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var AIWMSPTModel = sap.ui.getCore().getModel("AIWMSPT").getData();
			var AIWMPMIModel = sap.ui.getCore().getModel("AIWMPMI").getData();

			if (AIWFLOCModel.length > 0) {
				for (var a = 0; a < AIWFLOCModel.length; a++) {
					var sFuncLoc = {
						// "Type" : true, 
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
						"Workcenterdesc": AIWFLOCModel[a].Ktext, // Plant Work Center
						"Wergwfloc": AIWFLOCModel[a].WcWerks, // Name
						"Gewrkfloc": AIWFLOCModel[a].MainArbpl, // Main Work Center
						"MainWcDesc": AIWFLOCModel[a].MainKtext, // Work center Plant
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
						"IsMenu": AIWFLOCModel[a].menuAction,
						"Adrnr": AIWFLOCModel[a].Adrnr,
						"Adrnri": AIWFLOCModel[a].Adrnri,
						Modeldesc: AIWFLOCModel[a].Modeldesc,
						Modelref: AIWFLOCModel[a].Modelref,
						Modelrver: AIWFLOCModel[a].Modelrver,
						Modelext: AIWFLOCModel[a].Modelext,
						Modelname: AIWFLOCModel[a].Modelname,
						Modelver: AIWFLOCModel[a].Modelver,
					};

					var aFLDOI = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
					if (aFLDOI && aFLDOI.length > 0) {
						var aDOIFields = aFLDOI[a].DOI;
						// sFuncLoc.Begrui = aDOIFields[0].instLoc ? "H" : "D";
						sFuncLoc.Swerki = aDOIFields[0].instLoc ? "H" : (aDOIFields[0].maintenance ? "D" : "");
						sFuncLoc.Storti = aDOIFields[1].instLoc ? "H" : (aDOIFields[1].maintenance ? "D" : "");
						// sFuncLoc.Msgrpi = aDOIFields[3].instLoc ? "H" : "D";
						sFuncLoc.Beberi = aDOIFields[2].instLoc ? "H" : (aDOIFields[2].maintenance ? "D" : "");
						sFuncLoc.Ppsidi = aDOIFields[3].instLoc ? "H" : (aDOIFields[3].maintenance ? "D" : "");
						sFuncLoc.Abckzi = aDOIFields[4].instLoc ? "H" : (aDOIFields[4].maintenance ? "D" : "");
						sFuncLoc.Bukrsi = aDOIFields[5].instLoc ? "H" : (aDOIFields[5].maintenance ? "D" : "");
						// sFuncLoc.Gsberi = aDOIFields[8].instLoc ? "H" : "D";
						// sFuncLoc.Anlnri = aDOIFields[9].instLoc ? "H" : "D";
						// sFuncLoc.Anlnri = aDOIFields[10].instLoc ? "H" : "D";
						sFuncLoc.Kostli = aDOIFields[6].instLoc ? "H" : (aDOIFields[6].maintenance ? "D" : "");
						sFuncLoc.Kokrsi = aDOIFields[7].instLoc ? "H" : (aDOIFields[7].maintenance ? "D" : "");
						// sFuncLoc.Proidi = aDOIFields[13].instLoc ? "H" : "D";
						// sFuncLoc.Daufni = aDOIFields[14].instLoc ? "H" : "D";
						// sFuncLoc.Aufnri = aDOIFields[15].instLoc ? "H" : "D";
						sFuncLoc.Iwerki = aDOIFields[8].instLoc ? "H" : (aDOIFields[8].maintenance ? "D" : "");
						sFuncLoc.Ingrpi = aDOIFields[9].instLoc ? "H" : (aDOIFields[9].maintenance ? "D" : "");
						sFuncLoc.Lgwidi = aDOIFields[10].instLoc ? "H" : (aDOIFields[10].maintenance ? "D" : "");
						// sFuncLoc.Swerki = aDOIFields[19].instLoc ? "H" : "D";
						// sFuncLoc.RbnrI = aDOIFields[20].instLoc ? "H" : "D";
						// sFuncLoc.Submti = aDOIFields[21].instLoc ? "H" : "D";
						// sFuncLoc.Einzli = aDOIFields[22].instLoc ? "H" : "D";
						// sFuncLoc.Iequii = aDOIFields[23].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[24].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[25].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[26].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[27].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[28].instLoc ? "H" : "D";
						sFuncLoc.Adrnri = aDOIFields[12].instLoc ? "H" : (aDOIFields[12].maintenance ? "D" : "");
					}

					if (AIWFLOCModel[a].viewParameter === "create") {
						sFuncLoc.Type = true;
					}
					sPayload.FuncLoc.push(sFuncLoc);

					if ((AIWFLOCModel[a].Title !== "" && AIWFLOCModel[a].Title !== undefined) || (AIWFLOCModel[a].TitleCode !== "" && AIWFLOCModel[a]
							.TitleCode !== undefined) || (AIWFLOCModel[a].Name1 !== "" && AIWFLOCModel[a].Name1 !== undefined) || (AIWFLOCModel[a].Name2 !==
							"" && AIWFLOCModel[a].Name2 !== undefined) || (AIWFLOCModel[a].Name3 !== "" && AIWFLOCModel[a].Name3 !== undefined) ||
						(AIWFLOCModel[a].Name4 !== "" && AIWFLOCModel[a].Name4 !== undefined) ||
						(AIWFLOCModel[a].Sort1 !== "" && AIWFLOCModel[a].Sort1 !== undefined) || (AIWFLOCModel[a].Sort2 !== "" && AIWFLOCModel[a].Sort2 !==
							undefined) || (AIWFLOCModel[a].NameCo !== "" && AIWFLOCModel[a].NameCo !== undefined) || (AIWFLOCModel[a].PostCod1 !== "" &&
							AIWFLOCModel[a].PostCod1 !== undefined) || (AIWFLOCModel[a].City1 !== "" && AIWFLOCModel[a].City1 !== undefined) || (
							AIWFLOCModel[a].Building !== "" && AIWFLOCModel[a].Building !==
							undefined) || (AIWFLOCModel[a].Floor !== "" && AIWFLOCModel[a].Floor !== undefined) || (AIWFLOCModel[a].Roomnum !== "" &&
							AIWFLOCModel[a].Roomnum !== undefined) || (AIWFLOCModel[a].AddrLocation !== "" && AIWFLOCModel[a].AddrLocation !== undefined) ||
						(AIWFLOCModel[a].Strsuppl1 !== "" && AIWFLOCModel[a].Strsuppl1 !== undefined) || (AIWFLOCModel[a].Strsuppl2 !== "" &&
							AIWFLOCModel[a].Strsuppl2 !== undefined) || (AIWFLOCModel[a].Strsuppl3 !== "" && AIWFLOCModel[a].Strsuppl3 !== undefined) || (
							AIWFLOCModel[a].TimeZone !== "" && AIWFLOCModel[a].TimeZone !== undefined) || (AIWFLOCModel[a].RefPosta !== "" && AIWFLOCModel[
							a].RefPosta !== undefined) || (AIWFLOCModel[a].Region !== "" && AIWFLOCModel[a].Region !== undefined)) {
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
					}

					var aIntlAddr = AIWFLOCModel[a].intlAddr;
					if (aIntlAddr.length > 0) {
						for (var z = 0; z < aIntlAddr.length; z++) {
							sPayload.FLAddrI.push(aIntlAddr[z]);
						}
					}

					if (g.AltLblDerv === "2" && AIWFLOCModel[a].altlbl.length > 0) {
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

					if (AIWFLOCModel[a].lam) {
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
							"MrkrUnit": AIWFLOCModel[a].lam.MrkrUnit,
							"LamDer": AIWFLOCModel[a].lam.LamDer
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
									"Clstatus1": sFLClassList[b].Clstatus1,
									"Artxt": sFLClassList[b].ClassTypeDesc
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

					var aFLLinChar = AIWFLOCModel[a].linearChar;
					if (aFLLinChar) {
						if (aFLLinChar.length > 0) {
							var alinearChar = $.map(aFLLinChar, function (obj) {
								return $.extend(true, {}, obj);
							});
							for (var c = 0; c < alinearChar.length; c++) {
								delete alinearChar[c].linCharEnable;
								alinearChar[c].Funcloc = AIWFLOCModel[a].Functionallocation;
								sPayload.FLLAMCH.push(alinearChar[c]);
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

						"Answt": AIWEQUIModel[d].Answt,
						"Ansdt": g._formatDate(AIWEQUIModel[d].Ansdt),
						"Waers": AIWEQUIModel[d].Waers, // Currency

						"ArbpEilo": AIWEQUIModel[d].Arbpl, // Work Center
						"Workcenterdesc": AIWEQUIModel[d].Ktext, // Plant Work Center
						"WorkCenterPlant": AIWEQUIModel[d].WcWerks, // Name
						"ArbpEeqz": AIWEQUIModel[d].MainArbpl, // Main Work Center
						"MainWcDesc": AIWEQUIModel[d].MainKtext, // Work Center Description
						"MainWcPlant": AIWEQUIModel[d].MainWerks, // Work center Plant

						"BebeEilo": AIWEQUIModel[d].BeberFl, // Plant Section
						"Fing": AIWEQUIModel[d].Fing, // Plant Section
						"Tele": AIWEQUIModel[d].Tele, // Plant Section
						"HeqnEeqz": AIWEQUIModel[d].EquipPosition, // Position
						"IsMenu": AIWEQUIModel[d].menuAction,
						"Adrnr": AIWEQUIModel[d].Adrnr,
						"Adrnri": AIWEQUIModel[d].Adrnri,

						Fhmkz: AIWEQUIModel[d].Fhmkz, // PRT fields visible
						Funcid: AIWEQUIModel[d].Funcid, //Config control data
						Frcfit: AIWEQUIModel[d].Frcfit,
						Frcrmv: AIWEQUIModel[d].Frcrmv,
					};

					var aEQDOI = sap.ui.getCore().getModel("dataOriginMOP").getData().EQ;
					if (aEQDOI && aEQDOI.length > 0) {
						var aDOIFields = aEQDOI[d].DOI;
						// sEquipment.Begrui = aDOIFields[0].instLoc ? "R" : "D";
						sEquipment.Swerki = aDOIFields[0].instLoc ? "R" : (aDOIFields[0].maintenance ? "D" : "");
						sEquipment.Storti = aDOIFields[1].instLoc ? "R" : (aDOIFields[1].maintenance ? "D" : "");
						// sEquipment.Msgrpi = aDOIFields[3].instLoc ? "R" : "D";
						sEquipment.Beberi = aDOIFields[2].instLoc ? "R" : (aDOIFields[2].maintenance ? "D" : "");
						sEquipment.Ppsidi = aDOIFields[3].instLoc ? "R" : (aDOIFields[3].maintenance ? "D" : "");
						sEquipment.Abckzi = aDOIFields[4].instLoc ? "R" : (aDOIFields[4].maintenance ? "D" : "");
						// sEquipment.Eqfnri = aDOIFields[7].instLoc ? "R" : "D";
						// sEquipment.Gsberi = aDOIFields[8].instLoc ? "R" : "D";
						sEquipment.Kostli = aDOIFields[5].instLoc ? "R" : (aDOIFields[5].maintenance ? "D" : "");
						// sEquipment.Proidi = aDOIFields[10].instLoc ? "R" : "D";
						// sEquipment.Daufni = aDOIFields[11].instLoc ? "R" : "D";
						// sEquipment.Aufnri = aDOIFields[12].instLoc ? "R" : "D";
						// sEquipment.Ppsidi = aDOIFields[13].instLoc ? "R" : "D";
						sEquipment.Iwerki = aDOIFields[6].instLoc ? "R" : (aDOIFields[6].maintenance ? "D" : "");
						sEquipment.Ingrpi = aDOIFields[7].instLoc ? "R" : (aDOIFields[7].maintenance ? "D" : "");
						sEquipment.Gewrki = aDOIFields[8].instLoc ? "R" : (aDOIFields[8].maintenance ? "D" : "");
						// sEquipment.Gewrki = aDOIFields[16].instLoc ? "R" : "D";
						// sEquipment.RbnrI = aDOIFields[17].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[18].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[19].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[20].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[21].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[22].instLoc ? "R" : "D";
						sEquipment.Adrnri = aDOIFields[10].instLoc ? "R" : (aDOIFields[10].maintenance ? "D" : "");
					}

					if (AIWEQUIModel[d].viewParameter === "create") {
						sEquipment.Type = true;
					}
					sPayload.Equipment.push(sEquipment);

					if ((AIWEQUIModel[d].Title !== "" && AIWEQUIModel[d].Title !== undefined) || (AIWEQUIModel[d].TitleCode !== "" && AIWEQUIModel[d]
							.TitleCode !== undefined) || (AIWEQUIModel[d].Name1 !== "" && AIWEQUIModel[d].Name1 !== undefined) || (AIWEQUIModel[d].Name2 !==
							"" && AIWEQUIModel[d].Name2 !== undefined) || (AIWEQUIModel[d].Name3 !== "" && AIWEQUIModel[d].Name3 !== undefined) ||
						(AIWEQUIModel[d].Name4 !== "" && AIWEQUIModel[d].Name4 !== undefined) ||
						(AIWEQUIModel[d].Sort1 !== "" && AIWEQUIModel[d].Sort1 !== undefined) || (AIWEQUIModel[d].Sort2 !== "" && AIWEQUIModel[d].Sort2 !==
							undefined) || (AIWEQUIModel[d].NameCo !== "" && AIWEQUIModel[d].NameCo !== undefined) || (AIWEQUIModel[d].PostCod1 !== "" &&
							AIWEQUIModel[d].PostCod1 !== undefined) || (AIWEQUIModel[d].City1 !== "" && AIWEQUIModel[d].City1 !== undefined) ||
						(AIWEQUIModel[d].Building !== "" && AIWEQUIModel[d].Building !== undefined) ||
						(AIWEQUIModel[d].Floor !== "" && AIWEQUIModel[d].Floor !== undefined) || (AIWEQUIModel[d].Roomnum !== "" && AIWEQUIModel[d].Roomnum !==
							undefined) || (AIWEQUIModel[d].AddrLocation !== "" && AIWEQUIModel[d].AddrLocation !== undefined) || (AIWEQUIModel[d].Strsuppl1 !==
							"" && AIWEQUIModel[d].Strsuppl1 !== undefined) || (AIWEQUIModel[d].Strsuppl2 !== "" && AIWEQUIModel[d].Strsuppl2 !== undefined) ||
						(AIWEQUIModel[d].Strsuppl3 !== "" && AIWEQUIModel[d].Strsuppl3 !== undefined) || (AIWEQUIModel[d].TimeZone !== "" &&
							AIWEQUIModel[d].TimeZone !== undefined) || (AIWEQUIModel[d].RefPosta !== "" && AIWEQUIModel[d].RefPosta !== undefined) || (
							AIWEQUIModel[d].Region !== "" && AIWEQUIModel[d].Region !== undefined)) {
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
					}

					var aIntlAddr = AIWEQUIModel[d].intlAddr;
					if (aIntlAddr.length > 0) {
						for (var z = 0; z < aIntlAddr.length; z++) {
							sPayload.EqAddrI.push(aIntlAddr[z]);
						}
					}

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

					if (AIWEQUIModel[d].lam) {
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
							"MrkrUnit": AIWEQUIModel[d].lam.MrkrUnit,
							"LamDer": AIWEQUIModel[d].lam.LamDer
						};
						sPayload.EqLAM.push(sEqLAM);
					}

					var sEqClassList = AIWEQUIModel[d].classItems;
					if (sEqClassList) {
						if (sEqClassList.length > 0) {
							for (var e = 0; e < sEqClassList.length; e++) {
								var sEqClass = {
									"Equi": AIWEQUIModel[d].Equnr,
									"Classtype": sEqClassList[e].Classtype,
									"Class": sEqClassList[e].Class,
									"Clstatus1": sEqClassList[e].Clstatus1,
									"Artxt": sEqClassList[e].ClassTypeDesc
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

					var aFLLinChar = AIWEQUIModel[d].linearChar;
					if (aFLLinChar) {
						if (aFLLinChar.length > 0) {
							var alinearChar = $.map(aFLLinChar, function (obj) {
								return $.extend(true, {}, obj);
							});
							for (var c = 0; c < alinearChar.length; c++) {
								delete alinearChar[c].linCharEnable;
								alinearChar[c].Equi = AIWEQUIModel[d].Equnr;
								sPayload.EqLAMCH.push(alinearChar[c]);
							}
						}
					}
				}
			}
			if (AIWMSPTModel.length > 0) {
				for (var j = 0; j < AIWMSPTModel.length; j++) {
					var sMsPoint = {
						"Point": AIWMSPTModel[j].Mspoint,
						"Equnr": AIWMSPTModel[j].Equnr,
						"Eqktx": AIWMSPTModel[j].Eqktx,
						"Tplnr": AIWMSPTModel[j].Tplnr,
						"Floctxt": AIWMSPTModel[j].Pltxt,
						"Mptyp": AIWMSPTModel[j].Mptyp,
						"Mpttx": AIWMSPTModel[j].Mpttx,
						"Codgr": AIWMSPTModel[j].Codgr,
						"Codgrtxt": AIWMSPTModel[j].Codgrtxt,
						"ObtypMs": AIWMSPTModel[j].ObtypMs,
						"Objtypetxt": AIWMSPTModel[j].Txt,
						"AtnamMs": AIWMSPTModel[j].AtnamMs,
						"Atbez": AIWMSPTModel[j].Atbez,
						"Mseh6": AIWMSPTModel[j].Mseh6,
						"Msehl": AIWMSPTModel[j].Msehl,
						"Indct": AIWMSPTModel[j].Indct,
						"Cdsuf": AIWMSPTModel[j].Cdsuf,
						"Cjumc": AIWMSPTModel[j].Cjumc,
						"Desir": AIWMSPTModel[j].Desir,
						"Pyeac": AIWMSPTModel[j].Pyeac,
						"Mrmin": AIWMSPTModel[j].Mrmin,
						"Mrmax": AIWMSPTModel[j].Mrmax,
						"Pttxt": AIWMSPTModel[j].Pttxt,
						"Psort": AIWMSPTModel[j].Psort,
						"Inact": AIWMSPTModel[j].Inact,
						"Decim": AIWMSPTModel[j].Decim.toString(),
						"Locas": AIWMSPTModel[j].Locas,
						"Maktx": AIWMSPTModel[j].Maktx,
						"Begru": AIWMSPTModel[j].Begru,
						"Begtx": AIWMSPTModel[j].Begtx,
						"Expon": AIWMSPTModel[j].Expon,
						"Mrngu": AIWMSPTModel[j].Mrngu,
						"Dstxt": AIWMSPTModel[j].Dstxt,
						"Indrv": AIWMSPTModel[j].Indrv,
						"IsMenu": AIWMSPTModel[j].menuAction
					};

					if (AIWMSPTModel[j].viewParameter === "create") {
						sMsPoint.Type = true;
					}
					sPayload.MSPoint.push(sMsPoint);

					if (AIWMSPTModel[j].lam) {
						var sMSLAM = {
							"Mspoint": AIWMSPTModel[j].Mspoint,
							"Lrpid": AIWMSPTModel[j].lam.Lrpid,
							"Strtptatr": AIWMSPTModel[j].lam.Strtptatr,
							"Endptatr": AIWMSPTModel[j].lam.Endptatr,
							"Length": (AIWMSPTModel[j].lam.Length).toString(),
							"LinUnit": AIWMSPTModel[j].lam.LinUnit,
							"Startmrkr": AIWMSPTModel[j].lam.Startmrkr,
							"Endmrkr": AIWMSPTModel[j].lam.Endmrkr,
							"Mrkdisst": AIWMSPTModel[j].lam.Mrkdisst,
							"Mrkdisend": AIWMSPTModel[j].lam.Mrkdisend,
							"MrkrUnit": AIWMSPTModel[j].lam.MrkrUnit,
							"LamDer": AIWMSPTModel[j].lam.LamDer
						};
						sPayload.MSLAM.push(sMSLAM);
					}

					var sMsClassList = AIWMSPTModel[j].classItems;
					if (sMsClassList) {
						if (sMsClassList.length > 0) {
							for (var h = 0; h < sMsClassList.length; h++) {
								var sMsClass = {
									"Mspoint": AIWMSPTModel[j].Mspoint,
									"Classtype": sMsClassList[h].Classtype,
									"Class": sMsClassList[h].Class,
									"Clstatus1": sMsClassList[h].Clstatus1,
									"Artxt": sMsClassList[h].ClassTypeDesc
								};
								sPayload.MSClass.push(sMsClass);
							}
						}
					}

					var sMsCharList = AIWMSPTModel[j].characteristics;
					if (sMsCharList) {
						if (sMsCharList.length > 0) {
							for (var i = 0; i < sMsCharList.length; i++) {
								var sMsVal = {
									"Mspoint": AIWMSPTModel[j].Mspoint,
									"Atnam": sMsCharList[i].Atnam,
									"Textbez": sMsCharList[i].Textbez,
									"Atwrt": sMsCharList[i].Atwrt,
									"Class": sMsCharList[i].Class
								};
								sPayload.MSVal.push(sMsVal);
							}
						}
					}
				}
			}
			if (AIWMPMIModel.length > 0) {
				for (var k = 0; k < AIWMPMIModel.length; k++) {
					var sMPLAN = {
						"Warpl": AIWMPMIModel[k].Warpl,
						"Abrho": AIWMPMIModel[k].Abrho,
						"Hunit": AIWMPMIModel[k].Hunit,
						"Mptyp": AIWMPMIModel[k].Mptyp,
						"Wptxt": AIWMPMIModel[k].Wptxt,
						"Stich": AIWMPMIModel[k].Stich.toString(),
						"Fabkl": AIWMPMIModel[k].Fabkl,
						"FabklDesc": AIWMPMIModel[k].FabklDesc,
						"Sfakt": AIWMPMIModel[k].Sfakt,
						"Andor": g.parseValue(AIWMPMIModel[k].Andor),
						"Mehrfach": g.parseValue(AIWMPMIModel[k].Mehrfach),
						"Strat": AIWMPMIModel[k].Strat,
						"StratDesc": AIWMPMIModel[k].StratDesc,
						"Wset": AIWMPMIModel[k].Wset,
						"Startdate": g._formatDate(AIWMPMIModel[k].Stadt),
						"Unitc": AIWMPMIModel[k].Unitc,
						"Szaeh": AIWMPMIModel[k].Szaeh,
						"PointStp": AIWMPMIModel[k].Mpcycleno,
						"Vspos": AIWMPMIModel[k].Vspos,
						"Topos": AIWMPMIModel[k].Topos,
						"Vsneg": AIWMPMIModel[k].Vsneg,
						"Toneg": AIWMPMIModel[k].Toneg,
						"Horiz": AIWMPMIModel[k].Horiz,
						"CallConf": AIWMPMIModel[k].CallConf,
						"PlanSort": AIWMPMIModel[k].PlanSort,
						"Begru": AIWMPMIModel[k].Begru,
						"IsMenu": AIWMPMIModel[k].menuAction
					};

					if (AIWMPMIModel[k].viewParameter === "create") {
						sMPLAN.Type = true;
					}
					sPayload.MPLAN.push(sMPLAN);

					var sItem = AIWMPMIModel[k].itemModel;
					if (sItem) {
						for (var l = 0; l < sItem.length; l++) {
							var sMPItem = {
								"Mplan": AIWMPMIModel[k].Warpl,
								"Qmart": sItem[l].Qmart, // notif type
								"Qmartx": sItem[l].nTypeTxt, // notif type desc
								"PlntMi": sItem[l].Werks, // planning plant
								"Planningplantdes": sItem[l].Planningplantdes, // planning plant desc
								"IngrpMi": sItem[l].Ingrp, // planner grp
								"Plannergrpdesc": sItem[l].Innam, // planner grp desc
								"Pstxt": sItem[l].Pstxt, // maint item desc
								"WergwMi": sItem[l].WergwMi, // main wc desc
								"ArbpMi": sItem[l].ArbpMi, // main wc
								"Auart": sItem[l].Auart, // order type 
								"Ordertypedesc": sItem[l].oTypeTxt, // order type desc
								"Bautl": sItem[l].AsmblyOb, // assembly
								"Cycleseq": sItem[l].Cycleseq,
								"Equnr": sItem[l].Equnr, // equip
								"Equipdesc": sItem[l].Eqktx, // equip desc
								"TplnrMi": sItem[l].Tplnr, // floc
								"Flocdesc": sItem[l].Pltxt, // floc desc
								"Mitemnumb": sItem[l].Mitemnumb, // maint item 
								"PlnnrMi": sItem[l].PlnnrMi,
								"PlntyMi": sItem[l].PlntyMi,
								"PlnalMi": sItem[l].PlnalMi,

								SwerkMil: sItem[l].SwerkMil,
								Name1: sItem[l].Name1,
								StortMil: sItem[l].StortMil,
								Locationdesc: sItem[l].StortMilTxt,
								MsgrpIl: sItem[l].MsgrpIl,
								BeberMil: sItem[l].BeberMil,
								Fing: sItem[l].Fing,
								// Tele: sItem[l].Tele,
								ArbplIl: sItem[l].ArbplIl,
								Workcenterdesc: sItem[l].ArbplIlTxt,
								AbckzIl: sItem[l].AbckzIl,
								Abctx: sItem[l].Abctx,
								EqfnrIl: sItem[l].EqfnrIl,
							};

							if (AIWMPMIModel[k].viewParameter === "create") {
								sMPItem.Type = true;
							}
							sPayload.MPItem.push(sMPItem);

							if (sItem[l].lam) {
								var sMPLAM = {
									"Mplan": AIWMPMIModel[k].Warpl,
									"Mitemnumb": sItem[l].lam.Mitemnumb,
									"Lrpid": sItem[l].lam.Lrpid,
									"Mspoint": sItem[l].Mspoint,
									"Strtptatr": sItem[l].lam.Strtptatr,
									"Endptatr": sItem[l].lam.Endptatr,
									"Length": (sItem[l].lam.Length).toString(),
									"LinUnit": sItem[l].lam.LinUnit,
									"Startmrkr": sItem[l].lam.Startmrkr,
									"Endmrkr": sItem[l].lam.Endmrkr,
									"Mrkdisst": sItem[l].lam.Mrkdisst,
									"Mrkdisend": sItem[l].lam.Mrkdisend,
									"MrkrUnit": sItem[l].lam.MrkrUnit,
									"LamDer": sItem[l].lam.LamDer
								};
								sPayload.MPLAM.push(sMPLAM);
							}
						}
					}

					var sObjListItem = AIWMPMIModel[k].ObjListItems;
					if (sObjListItem) {
						for (var z = 0; z < sObjListItem.length; z++) {
							var oOLI = {
								"AsmblyOb": sObjListItem[z].AsmblyOb,
								"EquiObj": sObjListItem[z].EquiObj,
								"FlocObj": sObjListItem[z].FlocObj,
								"MatnrObj": sObjListItem[z].MatnrObj,
								"Mitemnumb": sObjListItem[z].Mitemnumb,
								"Mplan": sObjListItem[z].Warpl
							};
							sPayload.MPOBList.push(oOLI);
						}
					}

					var sCycle = AIWMPMIModel[k].cycleModel;
					if (sCycle) {
						for (var m = 0; m < sCycle.length; m++) {
							var sMPCycle = {
								"Mplan": AIWMPMIModel[k].Warpl,
								"Point": sCycle[m].Point,
								"PointTxt": sCycle[m].Psort,
								"Offset": sCycle[m].Offset,
								"Ofsetunit": sCycle[m].Ofsetunit,
								"PakText": sCycle[m].PakText,
								"Zeieh": sCycle[m].Zeieh,
								"Zykl1": sCycle[m].Zykl1,
								"Cycleseqi": sCycle[m].Cycleseqi,
								"Mpcycleno": sCycle[m].Mpcycleno
							};
							sPayload.MPCycle.push(sMPCycle);
						}
					}

					var sMsClassList = AIWMPMIModel[k].classItems;
					if (sMsClassList) {
						if (sMsClassList.length > 0) {
							for (var h = 0; h < sMsClassList.length; h++) {
								var sMsClass = {
									"Mplan": AIWMPMIModel[k].Warpl,
									"Classtype": sMsClassList[h].Classtype,
									"Class": sMsClassList[h].Class,
									"Clstatus1": sMsClassList[h].Clstatus1
								};
								sPayload.ClassMpl.push(sMsClass);
							}
						}
					}

					var sMsCharList = AIWMPMIModel[k].characteristics;
					if (sMsCharList) {
						if (sMsCharList.length > 0) {
							for (var i = 0; i < sMsCharList.length; i++) {
								var sMsVal = {
									"Mplan": AIWMPMIModel[k].Warpl,
									"Atnam": sMsCharList[i].Atnam,
									"Textbez": sMsCharList[i].Textbez,
									"Atwrt": sMsCharList[i].Atwrt,
									"Class": sMsCharList[i].Class
								};
								sPayload.ValuaMpl.push(sMsVal);
							}
						}
					}
				}
			}

			var oMainViewModel = g.getView().getModel("mainView");
			var oMainViewData = oMainViewModel.getData();
			oMainViewData.tableBusy = true;
			oMainViewModel.setData(oMainViewData);

			var fnSuccess = function (r) {
				if (r.FuncLoc) {
					if (r.FuncLoc.results.length > 0) {
						sArray = [];
						if (r.FuncLoc.results.length > 0) {
							for (var ifl = 0; ifl < r.FuncLoc.results.length; ifl++) {
								var h = r.FuncLoc.results[ifl];
								var sModelData = {
									intlAddr: [],
									altlbl: [],
									classItems: [],
									characteristics: [],
									linearChar: [],
									FunctionallocationVS: "None",
									FunctionallocationVST: "",
									FlocdescriptionVS: "None",
									FlocdescriptionVST: "",
									StrucindicatorVS: "None",
									StrucindicatorVST: "",
									FloccategoryVS: "None",
									FloccategoryVST: "",
									SupFunctionallocationVS: "None",
									SupFunctionallocationVST: "",
									MaintplantVS: "None",
									MaintplantVST: "",
									StsmEquiVS: "None",
									StsmEquiVST: "",
									UstwEquiVS: "None",
									UstwEquiVST: "",
									UswoEquiVS: "None",
									UswoEquiVST: "",
									TechnicalObjectTypVS: "None",
									TechnicalObjectTypVST: "",
									LocationVS: "None",
									LocationVST: "",
									AbckzVS: "None",
									AbckzVST: "",
									MainArbplVS: "None",
									MainArbplVST: "",
									BeberFlVS: "None",
									BeberFlVST: "",
									BukrsVS: "None",
									BukrsVST: "",
									KostlVS: "None",
									KostlVST: "",
									WerksVS: "None",
									WerksVST: "",
									IngrpVS: "None",
									IngrpVST: "",
									ArbplVS: "None",
									ArbplVST: "",
									ConstrTypeVS: "None",
									ConstrTypeVST: "",
									RefPostaVS: "None",
									RefPostaVST: "",
									LangucodeVS: "None",
									LangucodeVST: "",
									TimeZoneVS: "None",
									TimeZoneVST: "",

									TplnrEnabled: true,
									FunctionalLocEnabled: true,
									FlocCatEnabled: true,
									StrucIndEnabled: true,
									MaintplantEnabled: true,
									BukrsEnabled: true
								};
								sModelData.Functionallocation = h.Tplnr;
								sModelData.Flocdescription = h.Txtmi;
								sModelData.EditMask = h.EditMask;
								sModelData.Hierarchy = h.Hierarchy;
								sModelData.Floccategory = h.Fltyp;
								sModelData.FlocCategoryDesc = h.Flttx;
								sModelData.Strucindicator = h.TplkzFlc;
								sModelData.StrucIndicatorDesc = h.Tplxt;
								sModelData.SupFunctionallocation = h.Tplma; // Sup FuncLoc
								sModelData.SupFlocdescription = h.Supflocdesc; // Sup FlocDescription
								sModelData.Stattext = h.Stattext; // System Status
								sModelData.StsmEqui = h.StsmFloc; // Status Profile
								sModelData.StsmEquiDesc = h.Statproftxt; // Status Profile Description
								sModelData.UstwEqui = h.UstwFloc; // Status with Status Number
								sModelData.UswoEqui = h.UswoFloc; // Status without Status Number
								sModelData.UstaEqui = h.UstaFloc; // User Status
								sModelData.TechnicalObjectTyp = h.Eqart; // TechnicalObjectTyp
								sModelData.Description = h.Eartx; // TechnicalObjectTyp Description
								sModelData.Maintplant = h.Swerk;
								sModelData.MaintplantDesc = h.Plantname;
								sModelData.Location = h.StorFloc; // Location
								sModelData.Locationdesc = h.Locationdesc; // Location Description
								sModelData.BeberFl = h.BeberFl; // Plant Section
								sModelData.Fing = h.Fing; // Person responsible
								sModelData.Tele = h.Tele; // Phone
								sModelData.Arbpl = h.Arbplfloc; // Work Center
								sModelData.Ktext = h.Workcenterdesc; // Work Center Description
								sModelData.WcWerks = h.Wergwfloc; // Work center Plant
								sModelData.MainArbpl = h.Gewrkfloc; // Main Work Center
								sModelData.MainKtext = h.MainWcDesc; // Plant Work Center
								sModelData.MainWerks = h.MainWcPlant; // Name
								sModelData.Abckz = h.Abckzfloc;
								sModelData.Abctx = h.Abctx;
								sModelData.Bukrs = h.Bukrsfloc;
								sModelData.Butxt = h.Butxt;
								sModelData.City = h.City;
								sModelData.Kostl = h.KostFloc; // Cost Center
								sModelData.Kokrs = h.KokrFloc; // ccPart1
								sModelData.Mctxt = h.Contareaname; // Name
								sModelData.Werks = h.PlntFloc; // Planning Plant
								sModelData.Planningplantdes = h.Planningplantdes; // Planning Plant Description
								sModelData.Ingrp = h.Ingrp; // Planner Group
								sModelData.Innam = h.Plannergrpdesc; // Planner Group Description
								sModelData.ConstrType = h.Submtiflo; // Construction Type
								sModelData.ConstructionDesc = h.Constdes; // Construction Description
								sModelData.menuAction = h.IsMenu;
								sModelData.Adrnr = h.Adrnr;
								sModelData.Adrnri = h.Adrnri;
								sModelData.Modeldesc = h.Modeldesc;
								sModelData.Modelref = h.Modelref;
								sModelData.Modelrver = h.Modelrver;
								sModelData.Modelext = h.Modelext;
								sModelData.Modelname = h.Modelname;
								sModelData.Modelver = h.Modelver;

								if (h.Type === true) {
									sModelData.viewParameter = "create";
								}
								if (h.Type === false) {
									sModelData.viewParameter = "change";
									if (sModelData.Floccategory === "" || sModelData.Floccategory === undefined) {
										sModelData.FlocCatEnabled = true;
									} else {
										sModelData.FlocCatEnabled = false;
									}
									if (sModelData.Strucindicator === "" || sModelData.Strucindicator === undefined) {
										sModelData.StrucIndEnabled = true;
									} else {
										sModelData.StrucIndEnabled = false;
									}
									sModelData.FunctionalLocEnabled = false;
								}

								if (h.Swerk !== "") {
									// sModelData.MaintplantEnabled = false;
									sModelData.BukrsEnabled = false;
								} else {
									sModelData.MaintplantEnabled = true;
									sModelData.BukrsEnabled = true;
								}

								if (r.FLLAM.results.length > 0) {
									var aFlLam = r.FLLAM.results;
									for (var x = 0; x < aFlLam.length; x++) {
										if (aFlLam[x].Funcloc === sModelData.Functionallocation) {
											var oFLLAM = {
												"Funcloc": aFlLam[x].Funcloc,
												"Lrpid": aFlLam[x].Lrpid,
												"LrpidDesc": aFlLam[x].LrpDescr,
												"Strtptatr": aFlLam[x].Strtptatr,
												"Endptatr": aFlLam[x].Endptatr,
												"Length": parseInt(aFlLam[x].Length !== "" ? aFlLam[x].Length : "0"),
												"LinUnit": aFlLam[x].LinUnit,
												"LinUnitDesc": aFlLam[x].Uomtext,
												"Startmrkr": aFlLam[x].Startmrkr,
												"Endmrkr": aFlLam[x].Endmrkr,
												"Mrkdisst": aFlLam[x].Mrkdisst,
												"Mrkdisend": aFlLam[x].Mrkdisend,
												"MrkrUnit": aFlLam[x].MrkrUnit,
												"LamDer": aFlLam[x].LamDer
											};
											sModelData.lam = oFLLAM;
											break;
										}
									}
								}

								if (r.FLAddr) {
									if (r.FLAddr.results) {
										var sAddress = r.FLAddr.results;
										if (sAddress) {
											if (sAddress.length > 0) {
												for (var jfl = 0; jfl < sAddress.length; jfl++) {
													if (sModelData.Functionallocation === sAddress[jfl].Funcloc) {
														var oAddressModel = sap.ui.getCore().getModel("flocAddressView");
														var oAddressData = oAddressModel.getData();
														var mCountFlag = true;
														var sObj, sMatchIndex;
														if (oAddressData.length > 0) {
															for (var sa = 0; sa < oAddressData.length; sa++) {
																if (sModelData.Functionallocation === oAddressData[sa].Functionallocation) {
																	mCountFlag = false;
																	sMatchIndex = sa;
																	break;
																}
															}
														}
														if (mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
															sObj = {
																Functionallocation: sModelData.Functionallocation,
																IsEditable: sAddress[jfl].IsEditable
															};
															oAddressData.push(sObj);
															oAddressModel.setData(oAddressData);
														}
														if (!mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
															oAddressData[sMatchIndex].Functionallocation = sModelData.Functionallocation;
															oAddressData[sMatchIndex].IsEditable = sModelData.IsEditable;
															oAddressModel.setData(oAddressData);
														}

														sModelData.Title = sAddress[jfl].Titletxt ? sAddress[jfl].Titletxt : "";
														sModelData.TitleCode = sAddress[jfl].Title ? sAddress[jfl].Title : "";
														sModelData.Name1 = sAddress[jfl].Name1 ? sAddress[jfl].Name1 : "";
														sModelData.Name2 = sAddress[jfl].Name2 ? sAddress[jfl].Name2 : "";
														sModelData.Name3 = sAddress[jfl].Name3 ? sAddress[jfl].Name3 : "";
														sModelData.Name4 = sAddress[jfl].Name4 ? sAddress[jfl].Name4 : "";
														sModelData.Sort1 = sAddress[jfl].Sort1 ? sAddress[jfl].Sort1 : "";
														sModelData.Sort2 = sAddress[jfl].Sort2 ? sAddress[jfl].Sort2 : "";
														sModelData.NameCo = sAddress[jfl].NameCo ? sAddress[jfl].NameCo : "";
														sModelData.PostCod1 = sAddress[jfl].PostCod1 ? sAddress[jfl].PostCod1 : "";
														sModelData.City1 = sAddress[jfl].City1 ? sAddress[jfl].City1 : "";
														sModelData.Building = sAddress[jfl].Building ? sAddress[jfl].Building : "";
														sModelData.Floor = sAddress[jfl].Floor ? sAddress[jfl].Floor : "";
														sModelData.Roomnum = sAddress[jfl].Roomnum ? sAddress[jfl].Roomnum : "";
														sModelData.Strsuppl1 = sAddress[jfl].Strsuppl1 ? sAddress[jfl].Strsuppl1 : "";
														sModelData.Strsuppl2 = sAddress[jfl].Strsuppl2 ? sAddress[jfl].Strsuppl2 : "";
														sModelData.Strsuppl3 = sAddress[jfl].Strsuppl3 ? sAddress[jfl].Strsuppl3 : "";
														sModelData.AddrLocation = sAddress[jfl].Location ? sAddress[jfl].Location : "";
														sModelData.RefPosta = sAddress[jfl].RPostafl ? sAddress[jfl].RPostafl : "";
														sModelData.Landx = sAddress[jfl].Landx ? sAddress[jfl].Landx : "";
														sModelData.TimeZone = sAddress[jfl].TimeZone ? sAddress[jfl].TimeZone : "";
														sModelData.Region = sAddress[jfl].RPostFl ? sAddress[jfl].RPostFl : "";
														sModelData.ReigonDesc = sAddress[jfl].Regiotxt ? sAddress[jfl].Regiotxt : "";
													}
												}
											} else {
												sModelData.Title = sModelData.Title ? sModelData.Title : "";
												sModelData.TitleCode = sModelData.TitleCode ? sModelData.TitleCode : "";
												sModelData.Name1 = sModelData.Name1 ? sModelData.Name1 : "";
												sModelData.Name2 = sModelData.Name2 ? sModelData.Name2 : "";
												sModelData.Name3 = sModelData.Name3 ? sModelData.Name3 : "";
												sModelData.Name4 = sModelData.Name4 ? sModelData.Name4 : "";
												sModelData.Sort1 = sModelData.Sort1 ? sModelData.Sort1 : "";
												sModelData.Sort2 = sModelData.Sort2 ? sModelData.Sort2 : "";
												sModelData.NameCo = sModelData.NameCo ? sModelData.NameCo : "";
												sModelData.PostCod1 = sModelData.PostCod1 ? sModelData.PostCod1 : "";
												sModelData.City1 = sModelData.City1 ? sModelData.City1 : "";
												sModelData.Building = sModelData.Building ? sModelData.Building : "";
												sModelData.Floor = sModelData.Floor ? sModelData.Floor : "";
												sModelData.Roomnum = sModelData.Roomnum ? sModelData.Roomnum : "";
												sModelData.Strsuppl1 = sModelData.Strsuppl1 ? sModelData.Strsuppl1 : "";
												sModelData.Strsuppl2 = sModelData.Strsuppl2 ? sModelData.Strsuppl2 : "";
												sModelData.Strsuppl3 = sModelData.Strsuppl3 ? sModelData.Strsuppl3 : "";
												sModelData.AddrLocation = sModelData.AddrLocation ? sModelData.AddrLocation : "";
												sModelData.RefPosta = sModelData.RefPosta ? sModelData.RefPosta : "";
												sModelData.Landx = sModelData.Landx ? sModelData.Landx : "";
												sModelData.TimeZone = sModelData.TimeZone ? sModelData.TimeZone : "";
												sModelData.Region = sModelData.Region ? sModelData.Region : "";
												sModelData.RegionDesc = sModelData.RegionDesc ? sModelData.RegionDesc : "";
											}
										}
									}
								}

								var aIntlAddr = r.FLAddrI.results;
								if (aIntlAddr.length > 0) {
									for (var z = 0; z < aIntlAddr.length; z++) {
										if (aIntlAddr[z].Funcloc === sModelData.Functionallocation) {
											aIntlAddr[z].AdNationEnable = false;
											aIntlAddr[z].City1iVS = "None";
											aIntlAddr[z].StreetiVS = "None";
											sModelData.intlAddr.push(aIntlAddr[z]);
										}
									}
								}

								var aAltLbl = r.FLALTLBEL.results;
								if (aAltLbl.length > 0) {
									for (var y = 0; y < aAltLbl.length; y++) {
										if (aAltLbl[y].Funcloc === sModelData.Functionallocation) {
											var oAltLbl = {
												"Funcloc": aAltLbl[y].Funcloc,
												"AltAlkey": aAltLbl[y].AltAlkey, // Labeling system
												"Altxt": aAltLbl[y].Altxt, // Labeling system descr
												"AltStrno": aAltLbl[y].AltStrno, // Alternative Label
												"AltTplkz": aAltLbl[y].AltTplkz, // Strycture Indicator
												"Tplxt": aAltLbl[y].Tplxt, // Structure Indicator Descr
												"Name1i": aAltLbl[y].Editm, // Edit Mask
												"Actvs": aAltLbl[y].Actvs, // Active
												"AltPrkey": aAltLbl[y].AltPrkey, // Primary
												"AltReuse": aAltLbl[y].AltReuse, // Reusable

												"enableLblSys": false,
												"enableAltLbl": true,
												"enableStrInd": true,

												"LblSysVS": "None",
												"AltLblVS": "None",
												"StrIndVS": "None"
											};
											sModelData.altlbl.push(oAltLbl);
										}
									}
								}

								if (r.FLClass) {
									var sClassList = r.FLClass.results;
									if (sClassList) {
										if (sClassList.length > 0) {
											for (var afl = 0; afl < sClassList.length; afl++) {
												if (sModelData.Functionallocation === sClassList[afl].Funcloc) {
													sClassList[afl].ctEnable = false;
													sClassList[afl].classEnable = false;
													sClassList[afl].ClassTypeDesc = sClassList[afl].Artxt;
													delete sClassList[afl].Artxt;
													sClassList[afl].ClassDesc = sClassList[afl].Kltxt;
													delete sClassList[afl].Kltxt;
													delete sClassList[afl].Changerequestid;
													delete sClassList[afl].Clint;
													delete sClassList[afl].Service;
													sModelData.classItems.push(sClassList[afl]);
												}
											}
											sModelData.charNewButton = true;
											if (g.class && g.class.getId().includes("detailFloc") === true) {
												// var itemFragmentId = g.getView().createId("charFrag");
												// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
												// newCharBtn.setEnabled(true);
												g.class.setModel(new JSONModel(sModelData.classItems));
											}
										}
									}
								}

								if (r.FLVal) {
									var sCharList = r.FLVal.results;
									if (sCharList) {
										if (sCharList.length > 0) {
											for (var jfv = 0; jfv < sCharList.length; jfv++) {
												if (sModelData.Functionallocation === sCharList[jfv].Funcloc) {
													sCharList[jfv].cNameEnable = false;
													sCharList[jfv].Textbz = sCharList[jfv].Atwtb;
													delete sCharList[jfv].Ataut;
													delete sCharList[jfv].Ataw1;
													delete sCharList[jfv].Atawe;
													delete sCharList[jfv].Atcod;
													delete sCharList[jfv].Atflb;
													delete sCharList[jfv].Atflv;
													delete sCharList[jfv].Atimb;
													delete sCharList[jfv].Atsrt;
													delete sCharList[jfv].Atvglart;
													delete sCharList[jfv].Atzis;
													delete sCharList[jfv].Changerequestid;
													delete sCharList[jfv].CharName;
													delete sCharList[jfv].Charid;
													delete sCharList[jfv].Classtype;
													delete sCharList[jfv].Service;
													delete sCharList[jfv].Valcnt;
													sCharList[jfv].slNo = jfv + 1; // ()
													sCharList[jfv].flag = sCharList[jfv].Class + "-" + sCharList[jfv].slNo; // ()
													sModelData.characteristics.push(sCharList[jfv]);
												}
											}
											for (var z = 0; z < sModelData.characteristics.length; z++) {
												var count = 1;
												for (var y = 0; y < sModelData.characteristics.length; y++) {
													if (z === y) {
														continue;
													}
													if (sModelData.characteristics[y].Atnam === sModelData.characteristics[z].Atnam && sModelData.characteristics[y].Class ===
														sModelData.characteristics[z].Class) {
														count++;
													}
												}
												if (count > 1) {
													sModelData.characteristics[z].charDltEnable = true;
												} else {
													sModelData.characteristics[z].charDltEnable = false;
												}

												if (sModelData.characteristics[z].Atein === true) {
													sModelData.characteristics[z].charAddEnable = false;
												}
											}
											if (g.char && g.char.getId().includes("detailFloc") === true) {
												g.char.setModel(new JSONModel(sModelData.characteristics));
											}
										}
									}
								}

								if (r.FLLAMCH) {
									var alinearChar = r.FLLAMCH.results;
									if (alinearChar) {
										if (alinearChar.length > 0) {
											for (var j = 0; j < alinearChar.length; j++) {
												if (sModelData.Functionallocation === alinearChar[j].Funcloc) {
													alinearChar[j].linCharEnable = true;
													sModelData.linearChar.push(alinearChar[j]);
												}
											}
											// if (g.linearChar && g.linearChar.getId().includes("detailFloc") === true) {
											// 	g.linearChar.setModel(new JSONModel(sModelData.linearChar));
											// }
										}
									}
								}

								if (sModelData.UstaEqui) {
									oMainViewData.visible = true;
								} else {
									oMainViewData.visible = false;
								}
								oMainViewModel.setData(oMainViewModel);
								sArray.push(sModelData);
							}
							oAIWFLOCModel.setData(sArray);

							var aFLDOIdata = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
							for (var i = 0; i < r.FuncLoc.results.length; i++) {
								var h = r.FuncLoc.results[i];
								for (var z = 0; z < aFLDOIdata.length; z++) {
									if (h.Tplnr === aFLDOIdata[z].key) {
										var aDOIFields = aFLDOIdata[z].DOI;
										if (h.Swerki === "") {
											aDOIFields[0].maintenance = false;
											aDOIFields[0].instLoc = false;
											aDOIFields[0].SupFlVal = "";
											aDOIFields[0].currentVal = "";
											aDOIFields[0].targetVal = "";
										} else if (h.Swerki === "D") {
											aDOIFields[0].maintenance = true;
											aDOIFields[0].instLoc = false;
											aDOIFields[0].SupFlVal = "";
											aDOIFields[0].currentVal = h.Swerk;
											aDOIFields[0].targetVal = h.Swerk;
										} else {
											aDOIFields[0].maintenance = false;
											aDOIFields[0].instLoc = true;
											aDOIFields[0].SupFlVal = h.Swerk;
											aDOIFields[0].currentVal = "";
											aDOIFields[0].targetVal = h.Swerk;
										}

										if (h.Storti === "") {
											aDOIFields[1].maintenance = false;
											aDOIFields[1].instLoc = false;
											aDOIFields[1].SupFlVal = "";
											aDOIFields[1].currentVal = "";
											aDOIFields[1].targetVal = "";
										} else if (h.Storti === "D") {
											aDOIFields[1].maintenance = true;
											aDOIFields[1].instLoc = false;
											aDOIFields[1].SupFlVal = "";
											aDOIFields[1].currentVal = h.StorFloc;
											aDOIFields[1].targetVal = h.StorFloc;
										} else {
											aDOIFields[1].maintenance = false;
											aDOIFields[1].instLoc = true;
											aDOIFields[1].SupFlVal = h.StorFloc;
											aDOIFields[1].currentVal = "";
											aDOIFields[1].targetVal = h.StorFloc;
										}

										if (h.Beberi === "") {
											aDOIFields[2].maintenance = false;
											aDOIFields[2].instLoc = false;
											aDOIFields[2].SupFlVal = "";
											aDOIFields[2].currentVal = "";
											aDOIFields[2].targetVal = "";
										} else if (h.Beberi === "D") {
											aDOIFields[2].maintenance = true;
											aDOIFields[2].instLoc = false;
											aDOIFields[2].SupFlVal = "";
											aDOIFields[2].currentVal = h.BeberFl;
											aDOIFields[2].targetVal = h.BeberFl;
										} else {
											aDOIFields[2].maintenance = false;
											aDOIFields[2].instLoc = true;
											aDOIFields[2].SupFlVal = h.BeberFl;
											aDOIFields[2].currentVal = "";
											aDOIFields[2].targetVal = h.BeberFl;
										}

										if (h.Ppsidi === "") {
											aDOIFields[3].maintenance = false;
											aDOIFields[3].instLoc = false;
											aDOIFields[3].SupFlVal = "";
											aDOIFields[3].currentVal = "";
											aDOIFields[3].targetVal = "";
										} else if (h.Ppsidi === "D") {
											aDOIFields[3].maintenance = true;
											aDOIFields[3].instLoc = false;
											aDOIFields[3].SupFlVal = "";
											aDOIFields[3].currentVal = h.Arbplfloc;
											aDOIFields[3].targetVal = h.Arbplfloc;
										} else {
											aDOIFields[3].maintenance = false;
											aDOIFields[3].instLoc = true;
											aDOIFields[3].SupFlVal = h.Arbplfloc;
											aDOIFields[3].currentVal = "";
											aDOIFields[3].targetVal = h.Arbplfloc;
										}

										if (h.Abckzi === "") {
											aDOIFields[4].maintenance = false;
											aDOIFields[4].instLoc = false;
											aDOIFields[4].SupFlVal = "";
											aDOIFields[4].currentVal = "";
											aDOIFields[4].targetVal = "";
										} else if (h.Abckzi === "D") {
											aDOIFields[4].maintenance = true;
											aDOIFields[4].instLoc = false;
											aDOIFields[4].SupFlVal = "";
											aDOIFields[4].currentVal = h.Abckzfloc;
											aDOIFields[4].targetVal = h.Abckzfloc;
										} else {
											aDOIFields[4].maintenance = false;
											aDOIFields[4].instLoc = true;
											aDOIFields[4].SupFlVal = h.Abckzfloc;
											aDOIFields[4].currentVal = "";
											aDOIFields[4].targetVal = h.Abckzfloc;
										}

										if (h.Bukrsi === "") {
											aDOIFields[5].maintenance = false;
											aDOIFields[5].instLoc = false;
											aDOIFields[5].SupFlVal = "";
											aDOIFields[5].currentVal = "";
											aDOIFields[5].targetVal = "";
										} else if (h.Bukrsi === "D") {
											aDOIFields[5].maintenance = true;
											aDOIFields[5].instLoc = false;
											aDOIFields[5].SupFlVal = "";
											aDOIFields[5].currentVal = h.Bukrsfloc;
											aDOIFields[5].targetVal = h.Bukrsfloc;
										} else {
											aDOIFields[5].maintenance = false;
											aDOIFields[5].instLoc = true;
											aDOIFields[5].SupFlVal = h.Bukrsfloc;
											aDOIFields[5].currentVal = "";
											aDOIFields[5].targetVal = h.Bukrsfloc;
										}

										if (h.Kostli === "") {
											aDOIFields[6].maintenance = false;
											aDOIFields[6].instLoc = false;
											aDOIFields[6].SupFlVal = "";
											aDOIFields[6].currentVal = "";
											aDOIFields[6].targetVal = "";
										} else if (h.Kostli === "D") {
											aDOIFields[6].maintenance = true;
											aDOIFields[6].instLoc = false;
											aDOIFields[6].SupFlVal = "";
											aDOIFields[6].currentVal = h.KostFloc;
											aDOIFields[6].targetVal = h.KostFloc;
										} else {
											aDOIFields[6].maintenance = false;
											aDOIFields[6].instLoc = true;
											aDOIFields[6].SupFlVal = h.KostFloc;
											aDOIFields[6].currentVal = "";
											aDOIFields[6].targetVal = h.KostFloc;
										}

										if (h.Kokrsi === "") {
											aDOIFields[7].maintenance = false;
											aDOIFields[7].instLoc = false;
											aDOIFields[7].SupFlVal = "";
											aDOIFields[7].currentVal = "";
											aDOIFields[7].targetVal = "";
										} else if (h.Kokrsi === "D") {
											aDOIFields[7].maintenance = true;
											aDOIFields[7].instLoc = false;
											aDOIFields[7].SupFlVal = "";
											aDOIFields[7].currentVal = h.KokrFloc;
											aDOIFields[7].targetVal = h.KokrFloc;
										} else {
											aDOIFields[7].maintenance = false;
											aDOIFields[7].instLoc = true;
											aDOIFields[7].SupFlVal = h.KokrFloc;
											aDOIFields[7].currentVal = "";
											aDOIFields[7].targetVal = h.KokrFloc;
										}

										if (h.Iwerki === "") {
											aDOIFields[8].maintenance = false;
											aDOIFields[8].instLoc = false;
											aDOIFields[8].SupFlVal = "";
											aDOIFields[8].currentVal = "";
											aDOIFields[8].targetVal = "";
										} else if (h.Iwerki === "D") {
											aDOIFields[8].maintenance = true;
											aDOIFields[8].instLoc = false;
											aDOIFields[8].SupFlVal = "";
											aDOIFields[8].currentVal = h.PlntFloc;
											aDOIFields[8].targetVal = h.PlntFloc;
										} else {
											aDOIFields[8].maintenance = false;
											aDOIFields[8].instLoc = true;
											aDOIFields[8].SupFlVal = h.PlntFloc;
											aDOIFields[8].currentVal = "";
											aDOIFields[8].targetVal = h.PlntFloc;
										}

										if (h.Ingrpi === "") {
											aDOIFields[9].maintenance = false;
											aDOIFields[9].instLoc = false;
											aDOIFields[9].SupFlVal = "";
											aDOIFields[9].currentVal = "";
											aDOIFields[9].targetVal = "";
										} else if (h.Ingrpi === "D") {
											aDOIFields[9].maintenance = true;
											aDOIFields[9].instLoc = false;
											aDOIFields[9].SupFlVal = "";
											aDOIFields[9].currentVal = h.Ingrp;
											aDOIFields[9].targetVal = h.Ingrp;
										} else {
											aDOIFields[9].maintenance = false;
											aDOIFields[9].instLoc = true;
											aDOIFields[9].SupFlVal = h.Ingrp;
											aDOIFields[9].currentVal = "";
											aDOIFields[9].targetVal = h.Ingrp;
										}

										if (h.Lgwidi === "") {
											aDOIFields[10].maintenance = false;
											aDOIFields[10].instLoc = false;
											aDOIFields[10].SupFlVal = "";
											aDOIFields[10].currentVal = "";
											aDOIFields[10].targetVal = "";
										} else if (h.Lgwidi === "D") {
											aDOIFields[10].maintenance = true;
											aDOIFields[10].instLoc = false;
											aDOIFields[10].SupFlVal = "";
											aDOIFields[10].currentVal = h.Gewrkfloc;
											aDOIFields[10].targetVal = h.Gewrkfloc;
										} else {
											aDOIFields[10].maintenance = false;
											aDOIFields[10].instLoc = true;
											aDOIFields[10].SupFlVal = h.Gewrkfloc;
											aDOIFields[10].currentVal = "";
											aDOIFields[10].targetVal = h.Gewrkfloc;
										}

										if (h.Adrnri === "") {
											aDOIFields[12].maintenance = false;
											aDOIFields[12].instLoc = false;
											aDOIFields[12].SupFlVal = "";
											aDOIFields[12].currentVal = "";
											aDOIFields[12].targetVal = "";
										} else if (h.Adrnri === "D") {
											aDOIFields[12].maintenance = true;
											aDOIFields[12].instLoc = false;
											aDOIFields[12].SupFlVal = "";
											aDOIFields[12].currentVal = h.Adrnr;
											aDOIFields[12].targetVal = h.Adrnr;
										} else {
											aDOIFields[12].maintenance = false;
											aDOIFields[12].instLoc = true;
											aDOIFields[12].SupFlVal = h.Adrnr;
											aDOIFields[12].currentVal = "";
											aDOIFields[12].targetVal = h.Adrnr;
										}
									}
								}
							}

							for (var z = 0; z < oAIWFLOCModel.getData().length; z++) {
								if (sLocalVar === oAIWFLOCModel.getData()[z].Functionallocation) {
									// g.rowIndex = "/" + lms;
									var sRowInd = "/" + z;
									var oJsonModel = new JSONModel();
									oJsonModel.setData(oAIWFLOCModel.getProperty(sRowInd));
									// g.getView().setModel(oJsonModel, sModelName);
									g.lam.setModel(oJsonModel, "AIWLAM");
									// oMainViewData.tableBusy = false;
									// oMainViewModel.setData(oMainViewData);
									return;
								}
							}
						}
					}
				}
				if (r.Equipment) {
					if (r.Equipment.results.length > 0) {
						sArray = [];
						for (var ieq = 0; ieq < r.Equipment.results.length; ieq++) {
							var sModelData = r.Equipment.results[ieq];
							sObject = {
								intlAddr: [],
								classItems: [],
								characteristics: [],
								linearChar: [],
								charNewButton: false,
								attachmentCount: "0", // Attachment Count
								Guids: "", // Attachment
								EqunrEnabled: true,
								EquipCatEnabled: true,
								MaintplantEnabled: true,
								BukrsEnabled: true,
								EqunrVS: "None",
								EqunrVST: "",
								EqktxVS: "None",
								EqktxVST: "",
								EquipmentCatogoryVS: "None",
								EquipmentCatogoryVST: "",
								MaintplantVS: "None",
								MaintplantVST: "",
								TplnrVS: "None",
								TplnrVST: "",
								SuperordinateEquipVS: "None",
								SuperordinateEquipVST: "",
								StsmEquiVS: "None",
								StsmEquiVST: "",
								UstwEquiVS: "None",
								UstwEquiVST: "",
								UswoEquiVS: "None",
								UswoEquiVST: "",
								TechnicalObjectTypVS: "None",
								TechnicalObjectTypVST: "",
								LocationVS: "None",
								LocationVSTL: "",
								AbckzVS: "None",
								AbckzVST: "",
								ArbplVS: "None",
								ArbplVST: "",
								BukrsVS: "None",
								BukrsVST: "",
								KostlVS: "None",
								KostlVST: "",
								WerksVS: "None",
								WerksVST: "",
								IngrpVS: "None",
								IngrpVST: "",
								ConstrTypeVS: "None",
								ConstrTypeVST: "",
								RefPostaVS: "None",
								RefPostaVST: "",
								MainArbplVS: "None",
								MainArbplVST: "",
								LangucodeVS: "None",
								LangucodeVST: "",
								TimeZoneVS: "None",
								TimeZoneVST: "",
								ConstrTypeMaxL: 0,
								charValueMaxL: 0
							};
							sObject.Equnr = sModelData.Equnr;
							sObject.Eqktx = sModelData.Txtmi;
							// sObject.Eqktx = sModelData.Eqktx;
							sObject.EquipmentCatogory = sModelData.Eqtyp;
							sObject.EquipCatgDescription = sModelData.Etytx;
							sObject.Maintplant = sModelData.Swerk;
							sObject.MaintplantDesc = sModelData.Name1;

							sObject.SuperordinateEquip = sModelData.HequEeqz; // Superord. Equipment
							sObject.SuperordinateEquipDesc = sModelData.SuperordEqDes; // Superord. Equipment Description
							sObject.Bukrs = sModelData.BukrEilo;
							sObject.Butxt = sModelData.Butxt;
							sObject.Location = sModelData.StorEilo; // Location
							sObject.Locationdesc = sModelData.Locationdesc; // Location Description
							sObject.Abckz = sModelData.AbckEilo;
							sObject.Abctx = sModelData.Abctx;
							sObject.Kostl = sModelData.KostEilo; // Cost Center
							sObject.Kokrs = sModelData.KokrEilo; // ccPart1
							sObject.Mctxt = sModelData.Contareaname; // Name
							sObject.Answt = sModelData.Answt;
							sObject.Ansdt = formatter.getDateFormat(sModelData.Ansdt);
							sObject.Waers = sModelData.Waers; // Currency
							sObject.Werks = sModelData.PplaEeqz; // Planning Plant
							sObject.Planningplantdes = sModelData.Planningplantdes; // Planning Plant Description
							sObject.Ingrp = sModelData.IngrEeqz; // Planner Group
							sObject.Innam = sModelData.Plannergrpdesc; // Planner Group Description
							sObject.Arbpl = sModelData.ArbpEilo; // Work Center
							sObject.Ktext = sModelData.Workcenterdesc; // Work Center Description
							sObject.WcWerks = sModelData.WorkCenterPlant; // Work center Plant
							sObject.MainArbpl = sModelData.ArbpEeqz; // Main Work Center
							sObject.MainKtext = sModelData.MainWcDesc; // Plant Work Center
							sObject.MainWerks = sModelData.MainWcPlant; // Name
							sObject.BeberFl = sModelData.BebeEilo; // Plant Section
							sObject.Fing = sModelData.Fing; // Plant Section
							sObject.Tele = sModelData.Tele; // Plant Section
							sObject.Herst = sModelData.Herst; // Manufacturer
							sObject.TechnicalObjectTyp = sModelData.Eqart; // TechnicalObjectTyp
							sObject.Description = sModelData.Eartx; // TechnicalObjectTyp Description
							sObject.Typbz = sModelData.Typbz; // Model Number
							sObject.ConstrType = sModelData.SubmEeqz; // Construction Type
							sObject.ConstructionDesc = sModelData.Constdesc; // Construction Description
							sObject.TechIdNum = sModelData.TidnEeqz; // techIndNo
							sObject.Serge = sModelData.Serge; // manfSerNo
							sObject.MapaEeqz = sModelData.MapaEeqz; // partNum
							sObject.EquipPosition = sModelData.HeqnEeqz; // Position

							sObject.Stattext = sModelData.Stattext; // System Status
							sObject.StsmEqui = sModelData.StsmEqui; // Status Profile
							sObject.StsmEquiDesc = sModelData.Statproftxt; // Status Profile Description
							sObject.UstwEqui = sModelData.UstwEqui; // Status with Status Number
							sObject.UswoEqui = sModelData.UswoEqui; // Status without Status Number
							sObject.UstaEqui = sModelData.UstaEqui; // User Status
							sObject.menuAction = sModelData.IsMenu;
							sObject.Adrnr = sModelData.Adrnr;
							sObject.Adrnri = sModelData.Adrnri;
							sObject.Fhmkz = sModelData.Fhmkz; // PRT fields visible
							sObject.Funcid = sModelData.Funcid; //Config control data
							sObject.Frcfit = sModelData.Frcfit;
							sObject.Frcrmv = sModelData.Frcrmv;

							if (r.EqPRT) {
								var sPRT = r.EqPRT.results[ieq];
								if (sPRT) {
									sObject.PlanvPrt = sPRT.PlanvPrt;
									sObject.SteufPrt = sPRT.SteufPrt;
									sObject.KtschPrt = sPRT.KtschPrt;
									sObject.Ewformprt = sPRT.Ewformprt;
									sObject.PlanvPrtText = AIWEQUIModel[ieq].PlanvPrtText;
									sObject.SteufPrtText = AIWEQUIModel[ieq].SteufPrtText;
									sObject.KtschPrtText = AIWEQUIModel[ieq].KtschPrtText;
									sObject.EwformprtText = AIWEQUIModel[ieq].EwformprtText;
									sObject.SteufRef = sPRT.SteufRef;
									sObject.KtschRef = sPRT.KtschRef;
									sObject.EwformRef = sPRT.EwformRef;
								} else {
									sObject.PlanvPrt = "";
									sObject.SteufPrt = "";
									sObject.KtschPrt = "";
									sObject.Ewformprt = "";
									sObject.PlanvPrtText = "";
									sObject.SteufPrtText = "";
									sObject.KtschPrtText = "";
									sObject.EwformprtText = "";
									sObject.SteufRef = false;
									sObject.KtschRef = false;
									sObject.EwformRef = false;
								}
							}

							if (r.EqLAM.results.length > 0) {
								var aEqLAM = r.EqLAM.results;
								for (var x = 0; x < aEqLAM.length; x++) {
									if (aEqLAM[x].Equi === sModelData.Equnr) {
										var oEqLAM = {
											"Equi": aEqLAM[x].Equi,
											"Lrpid": aEqLAM[x].Lrpid,
											"LrpidDesc": aEqLAM[x].LrpDescr,
											"Strtptatr": aEqLAM[x].Strtptatr,
											"Endptatr": aEqLAM[x].Endptatr,
											"Length": parseInt(aEqLAM[x].Length !== "" ? aEqLAM[x].Length : "0"),
											"LinUnit": aEqLAM[x].LinUnit,
											"LinUnitDesc": aEqLAM[x].Uomtext,
											"Startmrkr": aEqLAM[x].Startmrkr,
											"Endmrkr": aEqLAM[x].Endmrkr,
											"Mrkdisst": aEqLAM[x].Mrkdisst,
											"Mrkdisend": aEqLAM[x].Mrkdisend,
											"MrkrUnit": aEqLAM[x].MrkrUnit,
											"LamDer": aEqLAM[x].LamDer
										};
										sObject.lam = oEqLAM;
										break;
									}
								}
							}

							if (sModelData.Type === true) {
								sObject.viewParameter = "create";
							}

							if (sModelData.Type === false) {
								sObject.viewParameter = "change";
								sObject.EqunrEnabled = false;

								if (sObject.EquipmentCatogory === "" || sObject.EquipmentCatogory === undefined) {
									sObject.EquipCatEnabled = true;
								} else {
									sObject.EquipCatEnabled = false;
								}
								if (sObject.Maintplant === "" || sObject.Maintplant === undefined) {
									sObject.MaintplantEnabled = true;
								} else {
									sObject.MaintplantEnabled = false;
								}
								if (sObject.Tplnr === "" || sObject.Tplnr === undefined) {
									sObject.TplnrEnabled = true;
								} else {
									sObject.TplnrEnabled = false;
								}
							}

							if (sModelData.Swerk !== "") {
								sObject.BukrsEnabled = false;
							} else {
								sObject.BukrsEnabled = true;
							}

							if (sModelData.Eqtyp !== "P") {
								sObject.Tplnr = sModelData.TplnEilo; // Functional Location
								sObject.Pltxt = sModelData.Flocdescription; // Functional Location Description
								sObject.TplnrEnabled = true;
							} else {
								sObject.Tplnr = "";
								sObject.Pltxt = "";
								sObject.TplnrEnabled = false;
							}
							if (sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) {
								sObject.TplnrEnabled = false;
								sObject.SuperordinateEquipEnabled = true;
							}
							if (sObject.Tplnr !== "" && sObject.Tplnr !== undefined) {
								sObject.TplnrEnabled = true;
								sObject.SuperordinateEquipEnabled = false;
							}
							if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) || (sObject.Tplnr !== "" && sObject.Tplnr !==
									undefined)) {
								sObject.MaintplantEnabled = false;
							} else {
								sObject.MaintplantEnabled = true;
							}

							if (r.EqAddr) {
								if (r.EqAddr.results) {
									var sAddress = r.EqAddr.results;
									if (sAddress) {
										if (sAddress.length > 0) {
											for (var jeq = 0; jeq < sAddress.length; jeq++) {
												if (sObject.Equnr === sAddress[jeq].Equi) {
													var oAddressEquiModel = sap.ui.getCore().getModel("equiAddressView");
													var oAddressEquiData = oAddressEquiModel.getData();
													var mCountEquiFlag = true;
													var sEquiObj, sEquiMatchIndex;
													if (oAddressEquiData.length > 0) {
														for (var sfa = 0; sfa < oAddressEquiData.length; sfa++) {
															if (sModelData.Equnr === oAddressEquiData[sfa].Equnr) {
																mCountEquiFlag = false;
																sEquiMatchIndex = sfa;
																break;
															}
														}
													}
													if (mCountEquiFlag === true) {
														if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
															(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
															sEquiObj = {
																Equnr: sModelData.Equnr,
																Tplnr: sObject.Tplnr,
																IsEditable: sAddress[jeq].IsEditable
															};
															oAddressEquiData.push(sEquiObj);
															oAddressEquiModel.setData(oAddressEquiData);
														}
													}
													if (mCountEquiFlag === false) {
														if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
															(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
															oAddressEquiData[sEquiMatchIndex].Equnr = sModelData.Equnr;
															oAddressEquiData[sEquiMatchIndex].Tplnr = sModelData.Tplnr;
															oAddressEquiData[sEquiMatchIndex].IsEditable = sModelData.IsEditable;
															oAddressEquiModel.setData(oAddressEquiData);
														}
													}

													sObject.IsEditable = sAddress[jeq].IsEditable;
													sObject.Title = sAddress[jeq].Titletxt ? sAddress[jeq].Titletxt : "";
													sObject.TitleCode = sAddress[jeq].Title ? sAddress[jeq].Title : "";
													sObject.Name1 = sAddress[jeq].Name1 ? sAddress[jeq].Name1 : "";
													sObject.Name2 = sAddress[jeq].Name2 ? sAddress[jeq].Name2 : "";
													sObject.Name3 = sAddress[jeq].Name3 ? sAddress[jeq].Name3 : "";
													sObject.Name4 = sAddress[jeq].Name4 ? sAddress[jeq].Name4 : "";
													sObject.Sort1 = sAddress[jeq].Sort1 ? sAddress[jeq].Sort1 : "";
													sObject.Sort2 = sAddress[jeq].Sort2 ? sAddress[jeq].Sort2 : "";
													sObject.NameCo = sAddress[jeq].NameCo ? sAddress[jeq].NameCo : "";
													sObject.PostCod1 = sAddress[jeq].PostCod1 ? sAddress[jeq].PostCod1 : "";
													sObject.City1 = sAddress[jeq].City1 ? sAddress[jeq].City1 : "";
													sObject.Building = sAddress[jeq].Building ? sAddress[jeq].Building : "";
													sObject.Floor = sAddress[jeq].Floor ? sAddress[jeq].Floor : "";
													sObject.Roomnum = sAddress[jeq].Roomnum ? sAddress[jeq].Roomnum : "";
													sObject.AddrLocation = sAddress[jeq].Location ? sAddress[jeq].Location : "";
													sObject.Strsuppl1 = sAddress[jeq].Strsuppl1 ? sAddress[jeq].Strsuppl1 : "";
													sObject.Strsuppl2 = sAddress[jeq].Strsuppl2 ? sAddress[jeq].Strsuppl2 : "";
													sObject.Strsuppl3 = sAddress[jeq].Strsuppl3 ? sAddress[jeq].Strsuppl3 : "";
													sObject.RefPosta = sAddress[jeq].RefPosta ? sAddress[jeq].RefPosta : "";
													sObject.Landx = sAddress[jeq].Landx ? sAddress[jeq].Landx : "";
													sObject.TimeZone = sAddress[jeq].TimeZone ? sAddress[jeq].TimeZone : "";
													sObject.Region = sAddress[jeq].RfePost ? sAddress[jeq].RfePost : "";
													sObject.RegionDesc = sAddress[jeq].Regiotxt ? sAddress[jeq].Regiotxt : "";
												}
											}
										} else {
											sObject.Title = sObject.Title ? sObject.Title : "";
											sObject.TitleCode = sObject.TitleCode ? sObject.TitleCode : "";
											sObject.Name1 = sObject.Name1 ? sObject.Name1 : "";
											sObject.Name2 = sObject.Name2 ? sObject.Name2 : "";
											sObject.Name3 = sObject.Name3 ? sObject.Name3 : "";
											sObject.Name4 = sObject.Name4 ? sObject.Name4 : "";
											sObject.Sort1 = sObject.Sort1 ? sObject.Sort1 : "";
											sObject.Sort2 = sObject.Sort2 ? sObject.Sort2 : "";
											sObject.NameCo = sObject.NameCo ? sObject.NameCo : "";
											sObject.PostCod1 = sObject.PostCod1 ? sObject.PostCod1 : "";
											sObject.City1 = sObject.City1 ? sObject.City1 : "";
											sObject.Building = sObject.Building ? sObject.Building : "";
											sObject.Floor = sObject.Floor ? sObject.Floor : "";
											sObject.Roomnum = sObject.Roomnum ? sObject.Roomnum : "";
											sObject.Strsuppl1 = sObject.Strsuppl1 ? sObject.Strsuppl1 : "";
											sObject.Strsuppl2 = sObject.Strsuppl2 ? sObject.Strsuppl2 : "";
											sObject.Strsuppl3 = sObject.Strsuppl3 ? sObject.Strsuppl3 : "";
											sObject.AddrLocation = sObject.AddrLocation ? sObject.AddrLocation : "";
											sObject.RefPosta = sObject.RefPosta ? sObject.RefPosta : "";
											sObject.Landx = sObject.Landx ? sObject.Landx : "";
											sObject.TimeZone = sObject.TimeZone ? sObject.TimeZone : "";
											sObject.Region = sObject.Region ? sObject.Region : "";
											sObject.RegionDesc = sObject.RegionDesc ? sObject.RegionDesc : "";
										}
									}
								}
							}

							var aIntlAddr = r.EqAddrI.results;
							if (aIntlAddr.length > 0) {
								for (var z = 0; z < aIntlAddr.length; z++) {
									if (aIntlAddr[z].Equi === sObject.Equnr) {
										aIntlAddr[z].AdNationEnable = false;
										aIntlAddr[z].City1iVS = "None";
										aIntlAddr[z].StreetiVS = "None";
										sObject.intlAddr.push(aIntlAddr[z]);
									}
								}
							}

							if (r.EqClass) {
								var sClassList = r.EqClass.results;
								if (sClassList) {
									if (sClassList.length > 0) {
										for (var aeq = 0; aeq < sClassList.length; aeq++) {
											if (sObject.Equnr === sClassList[aeq].Equi) {
												sClassList[aeq].ctEnable = false;
												sClassList[aeq].classEnable = false;
												sClassList[aeq].ClassTypeDesc = sClassList[aeq].Artxt;
												delete sClassList[aeq].Artxt;
												sClassList[aeq].ClassDesc = sClassList[aeq].Kltxt;
												delete sClassList[aeq].Kltxt;
												delete sClassList[aeq].Changerequestid;
												delete sClassList[aeq].Clint;
												delete sClassList[aeq].Service;
												sObject.classItems.push(sClassList[aeq]);
											}
										}
										sObject.charNewButton = true;
										if (g.class && g.class.getId().includes("detailEqui") === true) {
											// var itemFragmentId = g.getView().createId("charFrag");
											// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
											// newCharBtn.setEnabled(true);
											g.class.setModel(new JSONModel(sObject.classItems));
										}
									}
								}
							}

							if (r.EqVal) {
								var sCharList = r.EqVal.results;
								if (sCharList) {
									if (sCharList.length > 0) {
										for (var jev = 0; jev < sCharList.length; jev++) {
											if (sObject.Equnr === sCharList[jev].Equi) {
												sCharList[jev].cNameEnable = false;
												sCharList[jev].Textbz = sCharList[jev].Atwtb;
												delete sCharList[jev].Ataut;
												delete sCharList[jev].Ataw1;
												delete sCharList[jev].Atawe;
												delete sCharList[jev].Atcod;
												delete sCharList[jev].Atflb;
												delete sCharList[jev].Atflv;
												delete sCharList[jev].Atimb;
												delete sCharList[jev].Atsrt;
												delete sCharList[jev].Atvglart;
												delete sCharList[jev].Atzis;
												delete sCharList[jev].Changerequestid;
												delete sCharList[jev].CharName;
												delete sCharList[jev].Charid;
												delete sCharList[jev].Classtype;
												delete sCharList[jev].Service;
												delete sCharList[jev].Valcnt;
												sCharList[jev].slNo = jev + 1; // ()
												sCharList[jev].flag = sCharList[jev].Class + "-" + sCharList[jev].slNo; // ()
												sObject.characteristics.push(sCharList[jev]);
											}
										}
										for (var z = 0; z < sObject.characteristics.length; z++) {
											var count = 1;
											for (var y = 0; y < sObject.characteristics.length; y++) {
												if (z === y) {
													continue;
												}
												if (sObject.characteristics[y].Atnam === sObject.characteristics[z].Atnam && sObject.characteristics[y].Class ===
													sObject.characteristics[z].Class) {
													count++;
												}
											}
											if (count > 1) {
												sObject.characteristics[z].charDltEnable = true;
											} else {
												sObject.characteristics[z].charDltEnable = false;
											}

											if (sObject.characteristics[z].Atein === true) {
												sObject.characteristics[z].charAddEnable = false;
											}
										}
										if (g.char && g.char.getId().includes("detailEqui") === true) {
											g.char.setModel(new JSONModel(sObject.characteristics));
										}
									}
								}
							}

							if (r.EqLAMCH) {
								var alinearChar = r.EqLAMCH.results;
								if (alinearChar) {
									if (alinearChar.length > 0) {
										for (var j = 0; j < alinearChar.length; j++) {
											if (sModelData.Equnr === alinearChar[j].Equi) {
												alinearChar[j].linCharEnable = true;
												sModelData.linearChar.push(alinearChar[j]);
											}
										}
										// if (g.linearChar && g.linearChar.getId().includes("detailFloc") === true) {
										// 	g.linearChar.setModel(new JSONModel(sModelData.linearChar));
										// }
									}
								}
							}

							if (sObject.UstaEqui) {
								oMainViewData.visible = true;
							} else {
								oMainViewData.visible = false;
							}
							oMainViewModel.setData(oMainViewData);
							sArray.push(sObject);
						}
						oAIWEQUIModel.setData(sArray);

						for (var leq = 0; leq < oAIWEQUIModel.getData().length; leq++) {
							if (sLocalVar === oAIWEQUIModel.getData()[leq].Equnr) {
								g.rowIndex = "/" + leq;
								var oJsonModel = new JSONModel();
								var sCurrentObject = oAIWEQUIModel.getProperty(g.rowIndex);

								sCurrentObject.Title = sCurrentObject.Title ? sCurrentObject.Title : "";
								sCurrentObject.TitleCode = sCurrentObject.TitleCode ? sCurrentObject.TitleCode : "";
								sCurrentObject.Name1 = sCurrentObject.Name1 ? sCurrentObject.Name1 : "";
								sCurrentObject.Name2 = sCurrentObject.Name2 ? sCurrentObject.Name2 : "";
								sCurrentObject.Name3 = sCurrentObject.Name3 ? sCurrentObject.Name3 : "";
								sCurrentObject.Name4 = sCurrentObject.Name4 ? sCurrentObject.Name4 : "";
								sCurrentObject.Sort1 = sCurrentObject.Sort1 ? sCurrentObject.Sort1 : "";
								sCurrentObject.Sort2 = sCurrentObject.Sort2 ? sCurrentObject.Sort2 : "";
								sCurrentObject.NameCo = sCurrentObject.NameCo ? sCurrentObject.NameCo : "";
								sCurrentObject.PostCod1 = sCurrentObject.PostCod1 ? sCurrentObject.PostCod1 : "";
								sCurrentObject.City1 = sCurrentObject.City1 ? sCurrentObject.City1 : "";
								sCurrentObject.Building = sCurrentObject.Building ? sCurrentObject.Building : "";
								sCurrentObject.Floor = sCurrentObject.Floor ? sCurrentObject.Floor : "";
								sCurrentObject.Roomnum = sCurrentObject.Roomnum ? sCurrentObject.Roomnum : "";
								sCurrentObject.Strsuppl1 = sCurrentObject.Strsuppl1 ? sCurrentObject.Strsuppl1 : "";
								sCurrentObject.Strsuppl2 = sCurrentObject.Strsuppl2 ? sCurrentObject.Strsuppl2 : "";
								sCurrentObject.Strsuppl3 = sCurrentObject.Strsuppl3 ? sCurrentObject.Strsuppl3 : "";
								sCurrentObject.AddrLocation = sCurrentObject.AddrLocation ? sCurrentObject.AddrLocation : "";
								sCurrentObject.RefPosta = sCurrentObject.RefPosta ? sCurrentObject.RefPosta : "";
								sCurrentObject.Landx = sCurrentObject.Landx ? sCurrentObject.Landx : "";
								sCurrentObject.TimeZone = sCurrentObject.TimeZone ? sCurrentObject.TimeZone : "";
								sCurrentObject.Region = sCurrentObject.Region ? sCurrentObject.Region : "";
								sCurrentObject.RegionDesc = sCurrentObject.RegionDesc ? sCurrentObject.RegionDesc : "";

								if ((sCurrentObject.Title !== "" && sCurrentObject.Title !== undefined) || (sCurrentObject.TitleCode !== "" && sCurrentObject
										.TitleCode !== undefined) || (sCurrentObject.Name1 !== "" && sCurrentObject.Name1 !== undefined) || (sCurrentObject.Name2 !==
										"" && sCurrentObject.Name2 !== undefined) || (sCurrentObject.Name3 !== "" && sCurrentObject.Name3 !== undefined) ||
									(sCurrentObject.Name4 !== "" && sCurrentObject.Name4 !== undefined) ||
									(sCurrentObject.Sort1 !== "" && sCurrentObject.Sort1 !== undefined) || (sCurrentObject.Sort2 !== "" && sCurrentObject.Sort2 !==
										undefined) || (sCurrentObject.NameCo !== "" && sCurrentObject.NameCo !== undefined) || (sCurrentObject.PostCod1 !== "" &&
										sCurrentObject.PostCod1 !== undefined) || (sCurrentObject.City1 !== "" && sCurrentObject.City1 !== undefined) ||
									(sCurrentObject.Building !== "" && sCurrentObject.Building !== undefined) ||
									(sCurrentObject.Floor !== "" && sCurrentObject.Floor !== undefined) || (sCurrentObject.Roomnum !== "" && sCurrentObject.Roomnum !==
										undefined) || (sCurrentObject.AddrLocation !== "" && sCurrentObject.AddrLocation !== undefined) || (sCurrentObject.Strsuppl1 !==
										"" && sCurrentObject.Strsuppl1 !== undefined) || (sCurrentObject.Strsuppl2 !== "" && sCurrentObject.Strsuppl2 !== undefined) ||
									(sCurrentObject.Strsuppl3 !== "" && sCurrentObject.Strsuppl3 !== undefined) || (sCurrentObject.TimeZone !== "" &&
										sCurrentObject.TimeZone !== undefined) || (sCurrentObject.RefPosta !== "" && sCurrentObject.RefPosta !== undefined) || (
										sCurrentObject.Region !== "" && sCurrentObject.Region !== undefined)) {
									sCurrentObject.RefPostaLblReq = true;

									var sAddressModel = g.getView().getModel("equiAddressView");
									var sAddressData = sAddressModel.getData();
									sAddressData.enabled = sCurrentObject.IsEditable;
									sAddressModel.setData(sAddressData);
								}
								oJsonModel.setData(sCurrentObject);
								g.getView().setModel(oJsonModel, g.oModelName);
								g.lam.setModel(oJsonModel, "AIWLAM");

								var sCopyArray = [oJsonModel.getData()];
								var sSupEquiData = $.map(sCopyArray, function (obj) {
									return $.extend(true, {}, obj);
								});
								var sSupEquiModel = new JSONModel();
								sSupEquiModel.setData(sSupEquiData);
								g.getView().setModel(sSupEquiModel, "SUP_EQUI_DATA");

								var mSupEquiModel = sap.ui.getCore().getModel("SUP_EQUI_DATA");
								var mSupEquiData = mSupEquiModel.getData();
								var mCountCEquiFlag = true;
								for (var se = 0; se < mSupEquiData.length; se++) {
									if (sCurrentObject.Equnr === mSupEquiData[se].Equnr) {
										mCountCEquiFlag = false;
									}
								}
								if (mCountCEquiFlag === true) {
									if ((sCurrentObject.SuperordinateEquip !== "" && sCurrentObject.SuperordinateEquip !== undefined) ||
										(sCurrentObject.Tplnr !== "" && sCurrentObject.Tplnr !== undefined)) {
										mSupEquiData.push(sSupEquiData[0]);
										mSupEquiModel.setData(mSupEquiData);
									}
								}

								oMainViewData.tableBusy = false;
								oMainViewModel.setData(oMainViewData);
								return;
							}
						}

						var aEQDOIdata = sap.ui.getCore().getModel("dataOriginMOP").getData().EQ;
						for (var i = 0; i < r.Equipment.results.length; i++) {
							var h = r.Equipment.results[i];
							for (var z = 0; z < aEQDOIdata.length; z++) {
								if (h.Equnr === aEQDOIdata[z].key) {
									var aDOIFields = aEQDOIdata[z].DOI;
									if (h.Swerki === "") {
										aDOIFields[0].maintenance = false;
										aDOIFields[0].instLoc = false;
										aDOIFields[0].SupFlVal = "";
										aDOIFields[0].currentVal = "";
										aDOIFields[0].targetVal = "";
									} else if (h.Swerki === "D") {
										aDOIFields[0].maintenance = true;
										aDOIFields[0].instLoc = false;
										aDOIFields[0].SupFlVal = "";
										aDOIFields[0].currentVal = h.Swerk;
										aDOIFields[0].targetVal = h.Swerk;
									} else {
										aDOIFields[0].maintenance = false;
										aDOIFields[0].instLoc = true;
										aDOIFields[0].SupFlVal = h.Swerk;
										aDOIFields[0].currentVal = "";
										aDOIFields[0].targetVal = h.Swerk;
									}

									if (h.Storti === "") {
										aDOIFields[1].maintenance = false;
										aDOIFields[1].instLoc = false;
										aDOIFields[1].SupFlVal = "";
										aDOIFields[1].currentVal = "";
										aDOIFields[1].targetVal = "";
									} else if (h.Storti === "D") {
										aDOIFields[1].maintenance = true;
										aDOIFields[1].instLoc = false;
										aDOIFields[1].SupFlVal = "";
										aDOIFields[1].currentVal = h.StorEilo;
										aDOIFields[1].targetVal = h.StorEilo;
									} else {
										aDOIFields[1].maintenance = false;
										aDOIFields[1].instLoc = true;
										aDOIFields[1].SupFlVal = h.StorEilo;
										aDOIFields[1].currentVal = "";
										aDOIFields[1].targetVal = h.StorEilo;
									}

									if (h.Beberi === "") {
										aDOIFields[2].maintenance = false;
										aDOIFields[2].instLoc = false;
										aDOIFields[2].SupFlVal = "";
										aDOIFields[2].currentVal = "";
										aDOIFields[2].targetVal = "";
									} else if (h.Beberi === "D") {
										aDOIFields[2].maintenance = true;
										aDOIFields[2].instLoc = false;
										aDOIFields[2].SupFlVal = "";
										aDOIFields[2].currentVal = h.BebeEilo;
										aDOIFields[2].targetVal = h.BebeEilo;
									} else {
										aDOIFields[2].maintenance = false;
										aDOIFields[2].instLoc = true;
										aDOIFields[2].SupFlVal = h.BebeEilo;
										aDOIFields[2].currentVal = "";
										aDOIFields[2].targetVal = h.BebeEilo;
									}

									if (h.Ppsidi === "") {
										aDOIFields[3].maintenance = false;
										aDOIFields[3].instLoc = false;
										aDOIFields[3].SupFlVal = "";
										aDOIFields[3].currentVal = "";
										aDOIFields[3].targetVal = "";
									} else if (h.Ppsidi === "D") {
										aDOIFields[3].maintenance = true;
										aDOIFields[3].instLoc = false;
										aDOIFields[3].SupFlVal = "";
										aDOIFields[3].currentVal = h.ArbpEilo;
										aDOIFields[3].targetVal = h.ArbpEilo;
									} else {
										aDOIFields[3].maintenance = false;
										aDOIFields[3].instLoc = true;
										aDOIFields[3].SupFlVal = h.ArbpEilo;
										aDOIFields[3].currentVal = "";
										aDOIFields[3].targetVal = h.ArbpEilo;
									}

									if (h.Abckzi === "") {
										aDOIFields[4].maintenance = false;
										aDOIFields[4].instLoc = false;
										aDOIFields[4].SupFlVal = "";
										aDOIFields[4].currentVal = "";
										aDOIFields[4].targetVal = "";
									} else if (h.Abckzi === "D") {
										aDOIFields[4].maintenance = true;
										aDOIFields[4].instLoc = false;
										aDOIFields[4].SupFlVal = "";
										aDOIFields[4].currentVal = h.AbckEilo;
										aDOIFields[4].targetVal = h.AbckEilo;
									} else {
										aDOIFields[4].maintenance = false;
										aDOIFields[4].instLoc = true;
										aDOIFields[4].SupFlVal = h.AbckEilo;
										aDOIFields[4].currentVal = "";
										aDOIFields[4].targetVal = h.AbckEilo;
									}

									if (h.Kostli === "") {
										aDOIFields[5].maintenance = false;
										aDOIFields[5].instLoc = false;
										aDOIFields[5].SupFlVal = "";
										aDOIFields[5].currentVal = "";
										aDOIFields[5].targetVal = "";
									} else if (h.Kostli === "D") {
										aDOIFields[5].maintenance = true;
										aDOIFields[5].instLoc = false;
										aDOIFields[5].SupFlVal = "";
										aDOIFields[5].currentVal = h.KostEilo;
										aDOIFields[5].targetVal = h.KostEilo;
									} else {
										aDOIFields[5].maintenance = false;
										aDOIFields[5].instLoc = true;
										aDOIFields[5].SupFlVal = h.KostEilo;
										aDOIFields[5].currentVal = "";
										aDOIFields[5].targetVal = h.KostEilo;
									}

									if (h.Iwerki === "") {
										aDOIFields[6].maintenance = false;
										aDOIFields[6].instLoc = false;
										aDOIFields[6].SupFlVal = "";
										aDOIFields[6].currentVal = "";
										aDOIFields[6].targetVal = "";
									} else if (h.Iwerki === "D") {
										aDOIFields[6].maintenance = true;
										aDOIFields[6].instLoc = false;
										aDOIFields[6].SupFlVal = "";
										aDOIFields[6].currentVal = h.PplaEeqz;
										aDOIFields[6].targetVal = h.PplaEeqz;
									} else {
										aDOIFields[6].maintenance = false;
										aDOIFields[6].instLoc = true;
										aDOIFields[6].SupFlVal = h.PplaEeqz;
										aDOIFields[6].currentVal = "";
										aDOIFields[6].targetVal = h.PplaEeqz;
									}

									if (h.Ingrpi === "") {
										aDOIFields[7].maintenance = false;
										aDOIFields[7].instLoc = false;
										aDOIFields[7].SupFlVal = "";
										aDOIFields[7].currentVal = "";
										aDOIFields[7].targetVal = "";
									} else if (h.Ingrpi === "D") {
										aDOIFields[7].maintenance = true;
										aDOIFields[7].instLoc = false;
										aDOIFields[7].SupFlVal = "";
										aDOIFields[7].currentVal = h.IngrEeqz;
										aDOIFields[7].targetVal = h.IngrEeqz;
									} else {
										aDOIFields[7].maintenance = false;
										aDOIFields[7].instLoc = true;
										aDOIFields[7].SupFlVal = h.IngrEeqz;
										aDOIFields[7].currentVal = "";
										aDOIFields[7].targetVal = h.IngrEeqz;
									}

									if (h.Gewrki === "") {
										aDOIFields[8].maintenance = false;
										aDOIFields[8].instLoc = false;
										aDOIFields[8].SupFlVal = "";
										aDOIFields[8].currentVal = "";
										aDOIFields[8].targetVal = "";
									} else if (h.Gewrki === "D") {
										aDOIFields[8].maintenance = true;
										aDOIFields[8].instLoc = false;
										aDOIFields[8].SupFlVal = "";
										aDOIFields[8].currentVal = h.ArbpEeqz;
										aDOIFields[8].targetVal = h.ArbpEeqz;
									} else {
										aDOIFields[8].maintenance = false;
										aDOIFields[8].instLoc = true;
										aDOIFields[8].SupFlVal = h.ArbpEeqz;
										aDOIFields[8].currentVal = "";
										aDOIFields[8].targetVal = h.ArbpEeqz;
									}

									if (h.Adrnri === "") {
										aDOIFields[10].maintenance = false;
										aDOIFields[10].instLoc = false;
										aDOIFields[10].SupFlVal = "";
										aDOIFields[10].currentVal = "";
										aDOIFields[10].targetVal = "";
									} else if (h.Adrnri === "D") {
										aDOIFields[10].maintenance = true;
										aDOIFields[10].instLoc = false;
										aDOIFields[10].SupFlVal = "";
										aDOIFields[10].currentVal = h.Adrnr;
										aDOIFields[10].targetVal = h.Adrnr;
									} else {
										aDOIFields[10].maintenance = false;
										aDOIFields[10].instLoc = true;
										aDOIFields[10].SupFlVal = h.Adrnr;
										aDOIFields[10].currentVal = "";
										aDOIFields[10].targetVal = h.Adrnr;
									}
								}
							}
						}
					}
				}
				if (r.MSPoint) {
					sArray = [];
					var sMsPoint = r.MSPoint.results;
					if (sMsPoint) {
						if (sMsPoint.length > 0) {
							for (var ims = 0; ims < sMsPoint.length; ims++) {
								sObject = {
									classItems: [],
									characteristics: [],
									charNewButton: false,
									attachmentCount: "0", // Attachment Count
									Guids: "", // Attachment

									PttxtVS: "None",
									PttxtVST: "",
									ObtypMsVS: "None",
									ObtypMsVST: "",
									MptypVS: "None",
									MptypVST: "",
									AtnamMsVS: "None",
									AtnamMsVST: "",
									EqunrVS: "None",
									EqunrVST: "",
									TplnrVS: "None",
									TplnrVST: "",
									CodgrVS: "None",
									CodgrVST: "",

									MspointEnabled: true,
									ObtypMsEnabled: true,
									EqunrEnabled: true,
									TplnrEnabled: true,
									MptypEnabled: true,
									AtnamMsEnabled: true,

									// Visibility
									valCodeStuffSel: false
								};
								sObject.Mspoint = sMsPoint[ims].Point;
								sObject.Psort = sMsPoint[ims].Psort;
								sObject.Pttxt = sMsPoint[ims].Pttxt;
								sObject.ObtypMs = sMsPoint[ims].ObtypMs;
								sObject.Txt = sMsPoint[ims].Objtypetxt;
								sObject.Equnr = sMsPoint[ims].Equnr;
								sObject.Eqktx = sMsPoint[ims].Eqktx;
								sObject.Tplnr = sMsPoint[ims].Tplnr;
								sObject.Pltxt = sMsPoint[ims].Floctxt;
								sObject.Mptyp = sMsPoint[ims].Mptyp;
								sObject.Mpttx = sMsPoint[ims].Mpttx;
								sObject.Inact = sMsPoint[ims].Inact;
								sObject.AtnamMs = sMsPoint[ims].AtnamMs;
								sObject.Atbez = sMsPoint[ims].Atbez;
								sObject.Mseh6 = sMsPoint[ims].Mseh6;
								sObject.Msehl = sMsPoint[ims].Msehl;
								sObject.Decim = sMsPoint[ims].Decim.toString();
								sObject.Codgr = sMsPoint[ims].Codgr;
								sObject.Codgrtxt = sMsPoint[ims].Codgrtxt;
								sObject.Locas = sMsPoint[ims].Locas;
								sObject.Maktx = sMsPoint[ims].Maktx;
								sObject.Begru = sMsPoint[ims].Begru;
								sObject.Begtx = sMsPoint[ims].Begtx;
								sObject.Indct = sMsPoint[ims].Indct;
								sObject.Expon = sMsPoint[ims].Expon;
								sObject.Cdsuf = sMsPoint[ims].Cdsuf;
								sObject.Cjumc = sMsPoint[ims].Cjumc;
								sObject.Pyeac = sMsPoint[ims].Pyeac;
								sObject.Desir = sMsPoint[ims].Desir;
								sObject.Mrngu = sMsPoint[ims].Mrngu;
								sObject.Dstxt = sMsPoint[ims].Dstxt;
								sObject.Indrv = sMsPoint[ims].Indrv;
								sObject.Mrmax = sMsPoint[ims].Mrmax;
								sObject.Mrmin = sMsPoint[ims].Mrmin;
								sObject.valCodeStuffSel = false;
								sObject.menuAction = sMsPoint[ims].IsMenu;

								if (sMsPoint[ims].Type === true) {
									sObject.viewParameter = "create";
								}

								if (sMsPoint[ims].Type === false) {
									sObject.viewParameter = "change";
									sObject.MspointEnabled = false;
									if (sObject.ObtypMs === "" || sObject.ObtypMs === undefined) {
										sObject.ObtypMsEnabled = true;
									} else {
										sObject.ObtypMsEnabled = false;
									}

									if (sObject.ObtypMs === "IEQ") {
										sObject.TplnrEnabled = false;
										if ((sObject.Equnr === "" || sObject.Equnr === undefined)) {
											sObject.EqunrEnabled = true;
										} else {
											sObject.EqunrEnabled = false;
										}
									}

									if (sObject.ObtypMs === "IFL") {
										sObject.EqunrEnabled = false;
										if ((sObject.Tplnr === "" || sObject.Tplnr === undefined)) {
											sObject.TplnrEnabled = true;
										} else {
											sObject.TplnrEnabled = false;
										}
									}

									if (sObject.Mptyp === "" || sObject.Mptyp === undefined) {
										sObject.MptypEnabled = true;
									} else {
										sObject.MptypEnabled = false;
									}
									if (sObject.AtnamMs === "" || sObject.AtnamMs === undefined) {
										sObject.AtnamMsEnabled = true;
									} else {
										sObject.AtnamMsEnabled = false;
									}
								}

								if (sMsPoint[ims].Indct) {
									sObject.countEnable = true;
									sObject.tEnable = false;
								} else {
									sObject.countEnable = false;
									sObject.tEnable = true;
								}
								if (sMsPoint[ims].Equnr !== "") {
									sObject.EqunrEnabled = true;
									sObject.EqunrLblVis = true;
									sObject.EqunrInpVis = true;
									sObject.EqktxInpVis = true;
									sObject.TplnrEnabled = false;
									sObject.TplnrLblVis = false;
									sObject.TplnrInpVis = false;
									sObject.PltxtInpVis = false;
								} else {
									sObject.EqunrEnabled = false;
									sObject.EqunrLblVis = false;
									sObject.EqunrInpVis = false;
									sObject.EqktxInpVis = false;
									sObject.TplnrEnabled = true;
									sObject.TplnrLblVis = true;
									sObject.TplnrInpVis = true;
									sObject.PltxtInpVis = true;
								}

								if (r.MSLAM.results.length > 0) {
									var aMSLAM = r.MSLAM.results;
									for (var x = 0; x < aMSLAM.length; x++) {
										if (aMSLAM[x].Mspoint === sMsPoint[ims].Point) {
											var oMSLAM = {
												"Mspoint": aMSLAM[x].Mspoint,
												"Lrpid": aMSLAM[x].Lrpid,
												"LrpidDesc": aMSLAM[x].LrpDescr,
												"Strtptatr": aMSLAM[x].Strtptatr,
												"Endptatr": aMSLAM[x].Endptatr,
												"Length": parseInt(aMSLAM[x].Length !== "" ? aMSLAM[x].Length : "0"),
												"LinUnit": aMSLAM[x].LinUnit,
												"LinUnitDesc": aMSLAM[x].Uomtext,
												"Startmrkr": aMSLAM[x].Startmrkr,
												"Endmrkr": aMSLAM[x].Endmrkr,
												"Mrkdisst": aMSLAM[x].Mrkdisst,
												"Mrkdisend": aMSLAM[x].Mrkdisend,
												"MrkrUnit": aMSLAM[x].MrkrUnit,
												"LamDer": aMSLAM[x].LamDer
											};
											sObject.lam = oMSLAM;
											break;
										}
									}
								}

								if (r.MSClass) {
									var sClassList = r.MSClass.results;
									if (sClassList) {
										if (sClassList.length > 0) {
											for (var ams = 0; ams < sClassList.length; ams++) {
												if (sObject.Mspoint === sClassList[ams].Mspoint) {
													sClassList[ams].ctEnable = false;
													sClassList[ams].classEnable = false;
													sClassList[ams].ClassTypeDesc = sClassList[ams].Artxt;
													delete sClassList[ams].Artxt;
													sClassList[ams].ClassDesc = sClassList[ams].Kltxt;
													delete sClassList[ams].Kltxt;
													delete sClassList[ams].Changerequestid;
													delete sClassList[ams].Clint;
													delete sClassList[ams].Service;
													sObject.classItems.push(sClassList[ams]);
												}
											}
											sObject.charNewButton = true;
											if (g.class && g.class.getId().includes("detailMspt") === true) {
												// var itemFragmentId = g.getView().createId("charFrag");
												// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
												// newCharBtn.setEnabled(true);
												g.class.setModel(new JSONModel(sObject.classItems));
											}
										}
									}
								}

								if (r.MSVal) {
									var sCharList = r.MSVal.results;
									if (sCharList) {
										if (sCharList.length > 0) {
											for (var jms = 0; jms < sCharList.length; jms++) {
												if (sObject.Mspoint === sCharList[jms].Mspoint) {
													sCharList[jms].cNameEnable = false;
													sCharList[jms].Textbz = sCharList[jms].Atwtb;
													delete sCharList[jms].Ataut;
													delete sCharList[jms].Ataw1;
													delete sCharList[jms].Atawe;
													delete sCharList[jms].Atcod;
													delete sCharList[jms].Atflb;
													delete sCharList[jms].Atflv;
													delete sCharList[jms].Atimb;
													delete sCharList[jms].Atsrt;
													delete sCharList[jms].Atvglart;
													delete sCharList[jms].Atzis;
													delete sCharList[jms].Changerequestid;
													delete sCharList[jms].CharName;
													delete sCharList[jms].Charid;
													delete sCharList[jms].Classtype;
													delete sCharList[jms].Service;
													delete sCharList[jms].Valcnt;
													sCharList[jms].slNo = jms + 1; // ()
													sCharList[jms].flag = sCharList[jms].Class + "-" + sCharList[jms].slNo; // ()
													sObject.characteristics.push(sCharList[jms]);
												}
											}
											for (var z = 0; z < sObject.characteristics.length; z++) {
												var count = 1;
												for (var y = 0; y < sObject.characteristics.length; y++) {
													if (z === y) {
														continue;
													}
													if (sObject.characteristics[y].Atnam === sObject.characteristics[z].Atnam && sObject.characteristics[y].Class ===
														sObject.characteristics[z].Class) {
														count++;
													}
												}
												if (count > 1) {
													sObject.characteristics[z].charDltEnable = true;
												} else {
													sObject.characteristics[z].charDltEnable = false;
												}

												if (sObject.characteristics[z].Atein === true) {
													sObject.characteristics[z].charAddEnable = false;
												}
											}
											if (g.char && g.char.getId().includes("detailMspt") === true) {
												g.char.setModel(new JSONModel(sObject.characteristics));
											}
										}
									}
								}

								sArray.push(sObject);
							}
							oAIWMSPTModel.setData(sArray);

							for (var lms = 0; lms < oAIWMSPTModel.getData().length; lms++) {
								if (sLocalVar === oAIWMSPTModel.getData()[lms].Mspoint) {
									g.rowIndex = "/" + lms;
									var oJsonModel = new JSONModel();
									oJsonModel.setData(oAIWMSPTModel.getProperty(g.rowIndex));
									g.getView().setModel(oJsonModel, sModelName);
									g.lam.setModel(oJsonModel, "AIWLAM");
									oMainViewData.tableBusy = false;
									oMainViewModel.setData(oMainViewData);
									return;
								}
							}
						}
					}
				}
				if (r.MPLAN) {
					sArray = [];
					var sMaintenance = r.MPLAN.results;
					if (sMaintenance) {
						for (var ih = 0; ih < sMaintenance.length; ih++) {
							sObject = {
								classItems: [],
								characteristics: [],
								cycleIndSingle: false, // RBSC
								cycleIndStrategy: false, // RBST
								cycleIndMultCntr: false, // RBMC

								// Fields Enability
								WarplEnabled: true,
								StratEnabled: true,
								MehrfachEnabled: true,
								WsetEnabled: true,
								MptypEnabled: true,
								cycleIndSingleEnabled: true,
								cycleIndStrategyEnabled: true,
								cycleIndMultCntrEnabled: true,
								FabklLBLReq: false,
								ButtonNewItemEnabled: true,
								ButtonAssignItemEnabled: true,

								// Label Visibility
								OPText: false,
								OPTitle: false,
								OPLBL: false,
								MpcyclenoLBL: false,
								FabklLBL: true,
								AbrhoLBL: true,
								MehrfachLBL: false, // Multiple counter Label
								ScheIndText: true,
								ScheIndTitle: true,
								ScheIndLBL: true,
								StratLBL: false,
								StratDescLBL: false,
								WsetLBL: false,
								SzaehLBL: false,
								StadtLBL: true,

								// Fields Visibility
								HorizVisible: false,
								cycleSetSeqColVis: false,
								OROPVis: false,
								AndOPvis: false,
								ScheIndRbTimeVis: true,
								ScheIndRbTimeKeyDateVis: true,
								ScheIndRbTimeFactCalVis: true,
								ScheIndRbPerformanceVis: true,
								MpcyclenoVis: false,
								HunitVis: true,
								AbrhoVis: true,
								MehrfachVis: false,
								StratVis: false, // Strategy Visibility
								StratDescVis: false,
								WsetVis: false,
								KtextVis: false,
								SzaehVis: false,
								UnitcVis: false,
								StadtVis: true,

								cycleModel: [],
								attachmentCount: "0", // Attachment Count
								Guids: "", // Attachment
								MaintenanceItemMode: "Delete",

								// Fields ValueState
								WarplVS: "None",
								WarplVST: "",
								WptxtVS: "None",
								WptxtVST: "",
								StratVS: "None",
								StratVST: "",
								WsetVS: "None",
								WsetVST: "",
								StadtVS: "None",
								StadtVST: "",
								StichVS: "None",
								StichVST: "",
								HunitVS: "None",
								HunitVST: ""
							};
							sObject.Warpl = sMaintenance[ih].Warpl;
							sObject.Wptxt = sMaintenance[ih].Wptxt;
							sObject.Mptyp = sMaintenance[ih].Mptyp;
							sObject.Strat = sMaintenance[ih].Strat;
							sObject.StratDesc = sMaintenance[ih].StratDesc;
							sObject.StratEnabled = false;
							sObject.MehrfachEnabled = false;
							sObject.WsetEnabled = false;
							sObject.menuAction = sMaintenance[ih].IsMenu;

							if (sMaintenance[ih].Type === true) {
								sObject.viewParameter = "create";
							}

							if (sMaintenance[ih].Mehrfach === "X" || sMaintenance[ih].Stich === "4") {
								sObject.cycleSetSeqColVis = true;
								sObject.CycleSetSeqVis = true;
								sObject.ScheIndText = false;
								sObject.ScheIndTitle = false;
								sObject.ScheIndLBL = false;
								sObject.ScheIndRbTimeVis = false;
								sObject.ScheIndRbTimeKeyDateVis = false;
								sObject.ScheIndRbTimeFactCalVis = false;
								sObject.ScheIndRbPerformanceVis = false;
								sObject.ScheIndRbTimeEnabled = false;
								sObject.ScheIndRbTimeKeyDateEnabled = false;
								sObject.ScheIndRbTimeFactCalEnabled = false;
								sObject.ScheIndRbPerformanceEnabled = false;
								sObject.AbrhoLBL = false;
								sObject.AbrhoVis = false;
								sObject.HunitVis = false;
								sObject.FabklLBL = false;
								sObject.FabklVis = false;
								sObject.FabklDescVis = false;
								sObject.Fabkl = "";
								sObject.FabklDesc = "";
								sObject.ButtonNewCycleEnabled = true;
								sObject.OPText = true;
								sObject.OPTitle = true;
								sObject.OPLBL = true;
								sObject.OROPVis = true;
								sObject.AndOPvis = true;
								sObject.WsetLBL = true;
								sObject.WsetVis = true;
								sObject.KtextVis = true;
								sObject.StratLBL = true;
								sObject.StratVis = true;
								sObject.StratDescVis = true;
								sObject.MehrfachLBL = true;
								sObject.MehrfachVis = true;
								sObject.Mehrfach = true;
								sObject.StadtLBL = true;
								sObject.StadtVis = true;
								sObject.Stadt = formatter.getDateFormat(sMaintenance[ih].Startdate);
								sObject.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_STDATE");
								sObject.SzaehLBL = false;
								sObject.SzaehVis = false;
								sObject.UnitcVis = false;
								sObject.Unitc = " ";
								sObject.MpcyclenoLBL = false;
								sObject.MpcyclenoVis = false;
								sObject.MaintenanceCycleMode = "Delete";
								sObject.cycleIndMultCntr = true;
								sObject.cycleType = 2;
							} else if (sMaintenance[ih].Strat === "" && (sMaintenance[ih].Stich === " " || sMaintenance[ih].Stich === "1" || sMaintenance[
									ih].Stich === "2")) {
								sObject.cycleSetSeqColVis = false;
								sObject.CycleSetSeqVis = false;
								sObject.ScheIndText = true;
								sObject.ScheIndTitle = true;
								sObject.ScheIndLBL = true;
								sObject.ScheIndRbTimeEnabled = true;
								sObject.ScheIndRbTimeKeyDateEnabled = true;
								sObject.ScheIndRbTimeFactCalEnabled = true;
								sObject.ScheIndRbPerformanceEnabled = true;
								sObject.AbrhoLBL = true;
								sObject.AbrhoVis = true;
								sObject.HunitVis = true;
								sObject.FabklLBL = true;
								sObject.FabklVis = true;
								sObject.FabklDescVis = true;
								sObject.Fabkl = "";
								sObject.FabklDesc = "";
								sObject.StadtLBL = true;
								sObject.StadtVis = true;
								sObject.Stadt = formatter.getDateFormat(sMaintenance[ih].Startdate);
								sObject.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_START_TXT");
								sObject.SzaehLBL = false;
								sObject.SzaehVis = false;
								sObject.UnitcVis = false;
								sObject.Unitc = " ";
								sObject.MpcyclenoLBL = false;
								sObject.MpcyclenoVis = false;
								sObject.MaintenanceCycleMode = "Delete";
								sObject.cycleIndSingle = true;
								sObject.cycleType = 0;
							} else if (sMaintenance[ih].Strat !== "" && sMaintenance[ih].Stich === "3") {
								sObject.cycleSetSeqColVis = false;
								sObject.CycleSetSeqVis = false;
								sObject.ScheIndText = false;
								sObject.ScheIndTitle = false;
								sObject.ScheIndLBL = false;
								sObject.ScheIndRbTimeVis = false;
								sObject.ScheIndRbTimeKeyDateVis = false;
								sObject.ScheIndRbTimeFactCalVis = false;
								sObject.ScheIndRbPerformanceVis = false;
								sObject.ScheIndRbTimeEnabled = false;
								sObject.ScheIndRbTimeKeyDateEnabled = false;
								sObject.ScheIndRbTimeFactCalEnabled = false;
								sObject.ScheIndRbPerformance = true;
								sObject.AbrhoLBL = false;
								sObject.AbrhoVis = false;
								sObject.HunitVis = false;
								sObject.FabklLBL = false;
								sObject.FabklVis = false;
								sObject.FabklDescVis = false;
								sObject.Fabkl = "";
								sObject.FabklDesc = "";
								sObject.StratLBL = true;
								sObject.StratVis = true;
								sObject.StratDescVis = true;
								sObject.Strat = sMaintenance[ih].Strat;
								g.readScheduling(sMaintenance[ih], sMaintenance[ih].Strat, sModelName);
								sObject.StadtLBL = false;
								sObject.StadtVis = false;
								sObject.Stadt = formatter.getDateFormat(sMaintenance[ih].Startdate);
								sObject.SzaehLBL = true;
								sObject.SzaehVis = true;
								sObject.UnitcVis = true;
								sObject.MpcyclenoLBL = true;
								sObject.MpcyclenoVis = true;
								sObject.MaintenanceCycleMode = "None";
								sObject.cycleIndStrateg = true;
								sObject.cycleType = 1;
							} else if (sMaintenance[ih].Strat.indexOf("TIME") > -1 && sMaintenance[ih].Mehrfach === "" && sMaintenance[ih].Stich !== "3") {
								sObject.ScheIndText = true;
								sObject.ScheIndTitle = true;
								sObject.ScheIndLBL = true;
								sObject.ScheIndRbTimeVis = true;
								sObject.ScheIndRbTimeKeyDateVis = true;
								sObject.ScheIndRbTimeFactCalVis = true;
								sObject.ScheIndRbPerformanceVis = true;
								sObject.AbrhoLBL = true;
								sObject.AbrhoVis = true;
								sObject.HunitVis = true;
								sObject.FabklLBL = true;
								sObject.FabklVis = true;
								sObject.FabklDescVis = true;
								sObject.Fabkl = "";
								sObject.FabklDesc = "";
								sObject.StratLBL = true;
								sObject.StratVis = true;
								sObject.StratDescVis = true;
								sObject.Strat = sMaintenance[ih].Strat;
								sObject.StadtLBL = true;
								sObject.StadtVis = true;
								sObject.Stadt = formatter.getDateFormat(sMaintenance[ih].Startdate);
								sObject.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_START_TXT");
								g.readScheduling(sMaintenance[ih], sMaintenance[ih].Strat, sModelName);
								sObject.SzaehLBL = false;
								sObject.SzaehVis = false;
								sObject.UnitcVis = false;
								sObject.Unitc = sMaintenance[ih].Unitc;
								sObject.MpcyclenoLBL = false;
								sObject.MpcyclenoVis = false;
								sObject.MaintenanceCycleMode = "Delete";
								sObject.cycleIndStrateg = true;
								sObject.cycleType = 1;
							} else if (sMaintenance[ih].Strat === "" && sMaintenance[ih].Stich === "3" && sMaintenance[ih].Mehrfach === "") {
								sObject.cycleIndSingle = true;
								sObject.cycleType = 0;
								sObject.ScheIndText = true;
								sObject.ScheIndTitle = true;
								sObject.ScheIndLBL = true;
								sObject.ScheIndRbTimeVis = true;
								sObject.ScheIndRbTimeKeyDateVis = true;
								sObject.ScheIndRbTimeFactCalVis = true;
								sObject.ScheIndRbPerformanceVis = true;
								sObject.ScheIndRbTimeEnabled = false;
								sObject.ScheIndRbTimeKeyDateEnabled = false;
								sObject.ScheIndRbTimeFactCalEnabled = false;
								// sObject.AbrhoLBL = false;
								// sObject.AbrhoVis = false;
								// sObject.HunitVis = false;
								sObject.FabklLBL = true;
								sObject.FabklVis = true;
								sObject.FabklDescVis = true;
								sObject.Fabkl = "";
								sObject.FabklDesc = "";
								sObject.StratLBL = false;
								sObject.StratVis = false;
								sObject.StratDescVis = false;
								sObject.Strat = sMaintenance[ih].Strat;
								sObject.StadtLBL = false;
								sObject.StadtVis = false;
								sObject.Stadt = formatter.getDateFormat(sMaintenance[ih].Startdate);
								sObject.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_START_TXT");
								sObject.SzaehLBL = true;
								sObject.SzaehVis = true;
								sObject.UnitcVis = true;
								sObject.Unitc = " ";
								// sObject.MpcyclenoLBL = true;
								// sObject.MpcyclenoVis = true;
								sObject.MaintenanceCycleMode = "Delete";
							}

							if (sMaintenance[ih].Stich === "1") {
								sObject.ScheIndRbTimeKeyDate = true;
								sObject.FabklEnabled = true;
								sObject.Fabkl = sMaintenance[ih].Fabkl;
								sObject.FabklDesc = sMaintenance[ih].FabklDesc;
							} else if (sMaintenance[ih].Stich === "2") {
								sObject.ScheIndRbTimeFactCal = true;
								sObject.FabklEnabled = true;
								sObject.Fabkl = sMaintenance[ih].Fabkl;
								sObject.FabklDesc = sMaintenance[ih].FabklDesc;
							} else if (sMaintenance[ih].Stich === "3") {
								sObject.ScheIndRbPerformance = true;
								sObject.FabklEnabled = false;
							} else if (sMaintenance[ih].Stich === " " || sMaintenance[ih].Stich === "") {
								sObject.ScheIndRbTime = true;
								sObject.FabklEnabled = false;
								sObject.Fabkl = sMaintenance[ih].Fabkl;
								sObject.FabklDesc = sMaintenance[ih].FabklDesc;
							}

							if (sMaintenance[ih].Stich) {
								sObject.Stich = parseInt(sMaintenance[ih].Stich);
							} else {
								sObject.Stich = 0;
							}
							sObject.Wset = sMaintenance[ih].Wset;
							sObject.Ktext = sMaintenance[ih].Ktext;
							sObject.Sfakt = sMaintenance[ih].Sfakt;
							sObject.Abrho = sMaintenance[ih].Abrho;
							sObject.Hunit = sMaintenance[ih].Hunit;
							sObject.StratDesc = sMaintenance[ih].StratDesc;
							sObject.Szaeh = sMaintenance[ih].Szaeh;
							sObject.Mpcycleno = sMaintenance[ih].PointStp;
							sObject.Andor = sMaintenance[ih].Andor;

							if (sMaintenance[ih].PointStp !== "") {
								sObject.Unitc = sMaintenance[ih].Unitc;
								// g.readCounterData(sMaintenance[ih], sMaintenance[ih].PointStp, "counterUnit");
							}
							if (sMaintenance[ih].Andor === "X") {
								sObject.AndOP = true;
							} else {
								sObject.OROP = true;
							}

							sObject.Vspos = sMaintenance[ih].Vspos;
							sObject.Topos = sMaintenance[ih].Topos;
							sObject.Vsneg = sMaintenance[ih].Vsneg;
							sObject.Toneg = sMaintenance[ih].Toneg;
							sObject.Horiz = sMaintenance[ih].Horiz;
							sObject.CallConf = sMaintenance[ih].CallConf;
							sObject.PlanSort = sMaintenance[ih].PlanSort;
							sObject.Begru = sMaintenance[ih].Begru;

							sObject.cycleIndSingle = false;
							sObject.cycleIndStrategy = false;
							sObject.cycleIndMultCntr = false;
							sObject.StratEnabled = false;
							sObject.MehrfachEnabled = false;
							sObject.WsetEnabled = false;
							switch (sObject.cycleType) {
							case 0:
								sObject.cycleType = 0;
								sObject.cycleIndSingle = true;
								sObject.cycleIndStrategyEnabled = false;
								sObject.cycleIndMultCntrEnabled = false;
								sObject.Strat = " ";
								sObject.StratDesc = " ";
								sObject.StratLBL = false;
								sObject.StratVis = false;
								sObject.StratDescVis = false;
								sObject.Wset = " ";
								sObject.Ktext = " ";
								sObject.WsetLBL = false;
								sObject.WsetVis = false;
								sObject.KtextVis = false;
								sObject.Mehrfach = false;
								sObject.MehrfachLBL = false;
								sObject.MehrfachVis = false;
								sObject.ButtonNewCycleEnabled = true;

								if (sObject.ScheIndRbPerformance === true) {
									sObject.SzaehLBL = true;
									sObject.SzaehVis = true;
									sObject.UnitcVis = true;
									sObject.StadtLBL = false;
									sObject.StadtVis = false;
								}
								break;
							case 1:
								sObject.cycleType = 1;
								sObject.cycleIndStrategy = true;
								sObject.cycleIndSingleEnabled = false;
								sObject.cycleIndMultCntrEnabled = false;
								sObject.StratLBL = true;
								sObject.StratVis = true;
								sObject.StratDescVis = true;
								sObject.StratEnabled = true;
								sObject.Mehrfach = false;
								sObject.MehrfachLBL = false;
								sObject.MehrfachVis = false;
								sObject.Wset = " ";
								sObject.Ktext = " ";
								sObject.WsetLBL = false;
								sObject.WsetVis = false;
								sObject.KtextVis = false;
								sObject.ButtonNewCycleEnabled = false;
								break;
							case 2:
								sObject.cycleType = 2;
								sObject.cycleIndMultCntr = true;
								sObject.cycleIndStrategyEnabled = false;
								sObject.cycleIndSingleEnabled = false;
								sObject.Strat = " ";
								sObject.StratDesc = " ";
								sObject.StratLBL = false;
								sObject.StratVis = false;
								sObject.StratDescVis = false;
								sObject.MehrfachLBL = true;
								sObject.MehrfachVis = true;
								sObject.MehrfachEnabled = true;
								sObject.WsetLBL = true;
								sObject.WsetVis = true;
								sObject.WsetEnabled = true;
								sObject.KtextVis = true;
								sObject.ButtonNewCycleEnabled = true;
								sObject.cycleSetSeqColVis = true;
								break;
							}

							if (sObject.menuAction === "copy" || sObject.menuAction === "change") {
								if (sObject.Mptyp === "" || sObject.Mptyp === undefined || sObject.Mptyp === " ") {
									sObject.MptypEnabled = true;
								} else {
									sObject.MptypEnabled = false;
								}
								if (sObject.cycleType === 1 && (sObject.Strat === "" || sObject.Strat === undefined || sObject.Strat === " ")) {
									sObject.StratEnabled = true;
								} else {
									sObject.StratEnabled = false;
								}
								if (sObject.cycleType === 2 && (sObject.Mehrfach === false || sObject.Mehrfach === "" || sObject.Mehrfach === undefined ||
										sObject.Mehrfach === " ")) {
									sObject.MehrfachEnabled = true;
								} else {
									sObject.MehrfachEnabled = false;
								}
								if (sObject.cycleType === 2 && (sObject.Wset === "" || sObject.Wset === undefined || sObject.Wset === " ")) {
									sObject.WsetEnabled = true;
								} else {
									sObject.WsetEnabled = false;
								}
							}

							if (sMaintenance[ih].Type === false) {
								sObject.viewParameter = "change";
								sObject.WarplEnabled = false;

								if (sObject.Mptyp === "" || sObject.Mptyp === undefined || sObject.Mptyp === " ") {
									sObject.MptypEnabled = true;
								} else {
									sObject.MptypEnabled = false;
								}
								if (sObject.cycleType === 1 && (sObject.Strat === "" || sObject.Strat === undefined || sObject.Strat === " ")) {
									sObject.StratEnabled = true;
								} else {
									sObject.StratEnabled = false;
								}
								if (sObject.cycleType === 2 && (sObject.Mehrfach === false || sObject.Mehrfach === "" || sObject.Mehrfach === undefined ||
										sObject.Mehrfach === " ")) {
									sObject.MehrfachEnabled = true;
								} else {
									sObject.MehrfachEnabled = false;
								}
								if (sObject.cycleType === 2 && (sObject.Wset === "" || sObject.Wset === undefined || sObject.Wset === " ")) {
									sObject.WsetEnabled = true;
								} else {
									sObject.WsetEnabled = false;
								}
							}

							if (r.MPCycle) {
								var sMPFCycle = r.MPCycle.results;
								if (sMPFCycle) {
									for (var cf = 0; cf < sMPFCycle.length; cf++) {
										if (sObject.Warpl === sMPFCycle[cf].Mplan) {
											sMPFCycle[cf].Psort = sMPFCycle[cf].PointTxt;
											sObject.cycleModel.push(sMPFCycle[cf]);
										}
									}
								}
							}

							if (sObject.cycleModel) {
								var sLength = sObject.cycleModel.length;
								for (var cl = 0; cl < sLength; cl++) {
									if (sObject.menuAction === "copy" || sObject.menuAction === "change") {
										sObject.cycleModel[cl].Zykl1Enabled = false;
										sObject.cycleModel[cl].ZeiehEnabled = false;
										sObject.cycleModel[cl].PakTextEnabled = false;
										sObject.cycleModel[cl].OffsetEnabled = false;
										sObject.cycleModel[cl].PointEnabled = false;
										sObject.cycleModel[cl].CycleseqiEnabled = false;
									} else {
										sObject.cycleModel[cl].Zykl1Enabled = true;
										sObject.cycleModel[cl].ZeiehEnabled = true;
										sObject.cycleModel[cl].PakTextEnabled = true;
										sObject.cycleModel[cl].OffsetEnabled = true;
										sObject.cycleModel[cl].PointEnabled = true;
										sObject.cycleModel[cl].CycleseqiEnabled = true;
									}
								}
							}

							if (r.MPItem) {
								var items = r.MPItem.results;
								if (items) {
									var iModel = new JSONModel();
									var temp = [];
									for (var im = 0; im < items.length; im++) {
										if (sObject.Warpl === items[im].Mplan) {
											var obj = {};
											obj.Mitemnumb = items[im].Mitemnumb; // maint item 
											obj.Pstxt = items[im].Pstxt; // maint item desc
											obj.Cycleseq = items[im].Cycleseq;
											obj.Tplnr = items[im].TplnrMi; // floc
											obj.Pltxt = items[im].Flocdesc; // floc desc
											obj.Equnr = items[im].Equnr; // equip
											obj.Eqktx = items[im].Equipdesc; // equip desc
											obj.AsmblyOb = items[im].Bautl; // assembly
											obj.Werks = items[im].PlntMi; // planning plant
											obj.Planningplantdes = items[im].Planningplantdes; // planning plant desc
											obj.Auart = items[im].Auart; // order type 
											obj.oTypeTxt = items[im].Ordertypedesc; // order type desc
											obj.Qmart = items[im].Qmart; // notif type
											obj.nTypeTxt = items[im].Qmartx; // notif type desc
											obj.ArbpMi = items[im].ArbpMi; // main wc
											obj.WergwMi = items[im].WergwMi; // main wc desc
											obj.Ingrp = items[im].IngrpMi; // planner grp
											obj.Innam = items[im].Plannergrpdesc; // planner grp desc

											// Approve Fields
											obj.Zeieh = items[im].Zeieh;
											obj.Priok = items[im].Priok;
											obj.ItmPriotxt = items[im].GsberMi;
											obj.GsberMi = items[im].GsberMi;
											obj.Gtext = items[im].Gtext;
											obj.TaskDet = items[im].TaskDet;
											obj.Ilart = items[im].Ilart;
											obj.Ilatx = items[im].Ilatx;
											obj.PlntyMi = items[im].PlntyMi;
											obj.ApfktMi = items[im].ApfktMi;
											obj.PlnnrMi = items[im].PlnnrMi;
											obj.PlnalMi = items[im].PlnalMi;
											obj.Gpcounterdesc = items[im].Gpcounterdesc;
											obj.AnlzuMi = items[im].AnlzuMi;
											obj.Anlzux = items[im].Anlzux;

											obj.SwerkMil = items[im].SwerkMil;
											obj.Name1 = items[im].SwerkMilTxt; //Name1;
											obj.StortMil = items[im].StortMil;
											obj.Locationdesc = items[im].StortMilTxt;
											obj.MsgrpIl = items[im].MsgrpIl;
											obj.BeberMil = items[im].BeberMil;
											obj.Fing = items[im].BeberMilTxt; //Fing;
											obj.Tele = items[im].Tele;
											obj.ArbplIl = items[im].ArbplIl;
											obj.Workcenterdesc = items[im].ArbplIlTxt;
											obj.AbckzIl = items[im].AbckzIl;
											obj.Abctx = items[im].Abctx;
											obj.EqfnrIl = items[im].EqfnrIl;

											obj.BukrsMil = items[im].BukrsMil;
											obj.Butxt = items[im].Butxt;
											obj.City = items[im].City;
											obj.Anln1Mil = items[im].Anln1Mil;
											obj.Anln2Mil = items[im].Anln2Mil;
											obj.Txt50 = items[im].Anln1MilTxt; //Txt50;
											obj.GsberIl = items[im].GsberIl;
											obj.KostlMil = items[im].KostlMil;
											obj.Contareaname = items[im].KostlMilTxt; //Contareaname;
											obj.KokrsMil = items[im].KokrsMil;
											obj.Posid = items[im].Post1; //Posid;
											obj.Post1 = items[im].Post1;
											obj.AufnrIl = items[im].AufnrIl;
											obj.SettleOrdDesc = items[im].SettleOrdDesc;
											obj.enableLoc = false;

											obj.PlnnrMi = items[im].PlnnrMi;
											obj.PlntyMi = items[im].PlntyMi;
											obj.PlnalMi = items[im].PlnalMi;

											obj.QmartLBL = true;
											obj.QmartVis = true;
											obj.nTypetxtVis = true;
											obj.AuartLBL = true;
											obj.AuartVis = true;
											obj.oTypeTxtVis = true;
											obj.CycleseqLBL = false;
											obj.CycleseqVis = false;

											obj.AsmblyObMaxLength = 0;
											obj.maintItemE = false;
											obj.cycleSetE = false;
											obj.TplnrEnabled = false;
											obj.equiE = false;
											obj.assemblyE = false;

											obj.CycleseqVS = "None";
											obj.CycleseqVST = "";
											obj.TplnrVS = "None";
											obj.TplnrVST = "";
											obj.EqunrVS = "None";
											obj.EqunrVST = "";
											obj.AsmblyObVS = "None";
											obj.AsmblyObVST = "";
											obj.WerksVS = "None";
											obj.WerksVST = "";
											obj.AuartVS = "None";
											obj.AuartVST = "";
											obj.QmartVS = "None";
											obj.QmartVST = "";
											obj.ArbpMiVS = "None";
											obj.ArbpMiVST = "";
											obj.WergwMiVS = "None";
											obj.WergwMiVST = "";
											obj.IngrpVS = "None";
											obj.IngrpVST = "";

											if (sObject.Mptyp === "NO") {
												obj.AuartLBL = false;
												obj.AuartVis = false;
												obj.oTypeTxtVis = false;
											}
											if (sObject.Mptyp === "PM") {
												obj.QmartLBL = false;
												obj.QmartVis = false;
												obj.nTypetxtVis = false;
											}

											if (r.MPLAM.results.length > 0) {
												var aMPLAM = r.MPLAM.results;
												for (var z = 0; z < aMPLAM.length; z++) {
													if (aMPLAM[z].Mplan === items[im].Mplan && aMPLAM[z].Mitemnumb === items[im].Mitemnumb) {
														var oMPLAM = {
															Mplan: items[im].Mplan,
															Mitemnumb: items[im].Mitemnumb,
															Lrpid: aMPLAM[z].Lrpid,
															LrpidDesc: aMPLAM[z].LrpDescr,
															Strtptatr: aMPLAM[z].Strtptatr,
															Endptatr: aMPLAM[z].Endptatr,
															Length: aMPLAM[z].Length,
															LinUnit: aMPLAM[z].LinUnit,
															LinUnitDesc: aMPLAM[z].Uomtext,
															Startmrkr: aMPLAM[z].Startmrkr,
															Endmrkr: aMPLAM[z].Endmrkr,
															Mrkdisst: aMPLAM[z].Mrkdisst,
															Mrkdisend: aMPLAM[z].Mrkdisend,
															MrkrUnit: aMPLAM[z].MrkrUnit,
															LamDer: aMPLAM[z].LamDer
														};
														obj.lam = oMPLAM;
														obj.LDVisible = true;
														break;
													}
												}
											}

											temp.push(obj);
										}
									}
									iModel.setData(temp);
									sObject.itemModel = temp;
								}
							}

							if (r.MPOBList) {
								var aObjListItems = r.MPOBList.results;
								if (aObjListItems) {
									var temp2 = [];
									for (var i = 0; i < aObjListItems.length; i++) {
										if (sObject.Warpl === aObjListItems[i].Mplan) {
											var obj = {};
											obj.Warpl = aObjListItems[i].Mplan;
											obj.Mitemnumb = aObjListItems[i].Mitemnumb;
											obj.MatnrObj = aObjListItems[i].MatnrObj;
											obj.FlocObj = aObjListItems[i].FlocObj;
											obj.EquiObj = aObjListItems[i].EquiObj;
											obj.AsmblyOb = aObjListItems[i].AsmblyOb;
											obj.Matnrtxt = aObjListItems[i].Matnrtxt;
											obj.Equnrtxt = aObjListItems[i].Equnrtxt;
											obj.Tplnrtxt = aObjListItems[i].Tplnrtxt;
											obj.Bautltxt = aObjListItems[i].Bautltxt;
											obj.Enable = false;
											temp2.push(obj);
										}
									}
									sObject.ObjListItems = temp2;
								}
							}

							if (r.ClassMpl) {
								var sClassList = r.ClassMpl.results;
								if (sClassList) {
									if (sClassList.length > 0) {
										for (var ams = 0; ams < sClassList.length; ams++) {
											if (sObject.Warpl === sClassList[ams].Mplan) {
												sClassList[ams].ctEnable = false;
												sClassList[ams].classEnable = false;
												sClassList[ams].ClassTypeDesc = sClassList[ams].Artxt;
												delete sClassList[ams].Artxt;
												sClassList[ams].ClassDesc = sClassList[ams].Kltxt;
												delete sClassList[ams].Kltxt;
												delete sClassList[ams].Changerequestid;
												delete sClassList[ams].Clint;
												delete sClassList[ams].Service;
												sObject.classItems.push(sClassList[ams]);
											}
										}
										sObject.charNewButton = true;
										if (g.class && g.class.getId().includes("detailMpmi") === true) {
											// var itemFragmentId = g.getView().createId("charFrag");
											// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
											// newCharBtn.setEnabled(true);
											g.class.setModel(new JSONModel(sObject.classItems));
										}
									}
								}
							}

							if (r.ValuaMpl) {
								var sCharList = r.ValuaMpl.results;
								if (sCharList) {
									if (sCharList.length > 0) {
										for (var jms = 0; jms < sCharList.length; jms++) {
											if (sObject.Warpl === sCharList[jms].Mplan) {
												sCharList[jms].cNameEnable = false;
												sCharList[jms].Textbz = sCharList[jms].Atwtb;
												delete sCharList[jms].Ataut;
												delete sCharList[jms].Ataw1;
												delete sCharList[jms].Atawe;
												delete sCharList[jms].Atcod;
												delete sCharList[jms].Atflb;
												delete sCharList[jms].Atflv;
												delete sCharList[jms].Atimb;
												delete sCharList[jms].Atsrt;
												delete sCharList[jms].Atvglart;
												delete sCharList[jms].Atzis;
												delete sCharList[jms].Changerequestid;
												delete sCharList[jms].CharName;
												delete sCharList[jms].Charid;
												delete sCharList[jms].Classtype;
												delete sCharList[jms].Service;
												delete sCharList[jms].Valcnt;
												sCharList[jms].slNo = jms + 1; // ()
												sCharList[jms].flag = sCharList[jms].Class + "-" + sCharList[jms].slNo; // ()
												sObject.characteristics.push(sCharList[jms]);
											}
										}
										for (var z = 0; z < sObject.characteristics.length; z++) {
											var count = 1;
											for (var y = 0; y < sObject.characteristics.length; y++) {
												if (z === y) {
													continue;
												}
												if (sObject.characteristics[y].Atnam === sObject.characteristics[z].Atnam && sObject.characteristics[y].Class ===
													sObject.characteristics[z].Class) {
													count++;
												}
											}
											if (count > 1) {
												sObject.characteristics[z].charDltEnable = true;
											} else {
												sObject.characteristics[z].charDltEnable = false;
											}

											if (sObject.characteristics[z].Atein === true) {
												sObject.characteristics[z].charAddEnable = false;
											}
										}
										if (g.char && g.char.getId().includes("detailMpmi") === true) {
											g.char.setModel(new JSONModel(sObject.characteristics));
										}
									}
								}
							}

							sArray.push(sObject);
						}
						oAIWMPMIModel.setData(sArray);

						for (var lm = 0; lm < oAIWMPMIModel.getData().length; lm++) {
							if (sLocalVar === oAIWMPMIModel.getData()[lm].Warpl) {
								g.rowIndex = "/" + lm;
								var oJsonModel = new JSONModel();
								oJsonModel.setData(oAIWMPMIModel.getProperty(g.rowIndex));
								g.getView().setModel(oJsonModel, sModelName);

								var sItemStatus = {
									itemStatus: true,
									oModelUpdateFlag: false
								};
								sap.ui.getCore().setModel(new JSONModel(sItemStatus), "AIWMPMIStatus");
								sap.ui.getCore().setModel(oJsonModel, "AIWMPMIDetail");

								var itemDetailView = new JSONModel();
								itemDetailView.setData(oJsonModel.getData().itemModel[sItemIndex]);
								g.getView().setModel(itemDetailView, "itemDetailView");
								g.lam.setModel(itemDetailView, "AIWLAM");

								if (g.strategy === "PERF" || g.strategy === "singlePerf") {
									g.readCounter(itemDetailView.getData(), g);
								}

								oMainViewData.tableBusy = false;
								oMainViewModel.setData(oMainViewData);
								return;
							}
						}
					}
				}
				oMainViewData.tableBusy = false;
				oMainViewModel.setData(oMainViewData);
			};
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
				oMainViewData.tableBusy = false;
				oMainViewModel.setData(oMainViewData);
				// g.invokeMessage(value);
				sap.m.MessageBox.show(value, {
					title: "Error",
					icon: sap.m.MessageBox.Icon.ERROR,
					onClose: function () {}
				});
			};

			if (sPayload.FLAddrI.length > 0) {
				sPayload.FLAddrI = $.map(sPayload.FLAddrI, function (obj) {
					return $.extend(true, {}, obj);
				});
				for (var i = 0; i < sPayload.FLAddrI.length > 0; i++) {
					delete sPayload.FLAddrI[i].AdNationEnable;
					delete sPayload.FLAddrI[i].City1iVS;
					delete sPayload.FLAddrI[i].StreetiVS;
				}
			}
			if (sPayload.EqAddrI.length > 0) {
				sPayload.EqAddrI = $.map(sPayload.EqAddrI, function (obj) {
					return $.extend(true, {}, obj);
				});
				for (var i = 0; i < sPayload.EqAddrI.length > 0; i++) {
					delete sPayload.EqAddrI[i].AdNationEnable;
					delete sPayload.EqAddrI[i].City1iVS;
					delete sPayload.EqAddrI[i].StreetiVS;
				}
			}
			oModel.create(sPath, sPayload, {
				success: fnSuccess,
				error: fnError
			});
		},

		/*
		 * Setter method for Object Address
		 * @public
		 * @param {string} pModelName
		 */
		setObjectAddress: function (pModelName) {
			var sCurrentModel = this.getView().getModel(pModelName);
			var sCurrentObject = sCurrentModel.getData();
			sCurrentObject.Title = sCurrentObject.Title ? sCurrentObject.Title : "";
			sCurrentObject.TitleCode = sCurrentObject.TitleCode ? sCurrentObject.TitleCode : "";
			sCurrentObject.Name1 = sCurrentObject.Name1 ? sCurrentObject.Name1 : "";
			sCurrentObject.Name2 = sCurrentObject.Name2 ? sCurrentObject.Name2 : "";
			sCurrentObject.Name3 = sCurrentObject.Name3 ? sCurrentObject.Name3 : "";
			sCurrentObject.Name4 = sCurrentObject.Name4 ? sCurrentObject.Name4 : "";
			sCurrentObject.Sort1 = sCurrentObject.Sort1 ? sCurrentObject.Sort1 : "";
			sCurrentObject.Sort2 = sCurrentObject.Sort2 ? sCurrentObject.Sort2 : "";
			sCurrentObject.NameCo = sCurrentObject.NameCo ? sCurrentObject.NameCo : "";
			sCurrentObject.PostCod1 = sCurrentObject.PostCod1 ? sCurrentObject.PostCod1 : "";
			sCurrentObject.City1 = sCurrentObject.City1 ? sCurrentObject.City1 : "";
			sCurrentObject.Building = sCurrentObject.Building ? sCurrentObject.Building : "";
			sCurrentObject.Floor = sCurrentObject.Floor ? sCurrentObject.Floor : "";
			sCurrentObject.Roomnum = sCurrentObject.Roomnum ? sCurrentObject.Roomnum : "";
			sCurrentObject.Strsuppl1 = sCurrentObject.Strsuppl1 ? sCurrentObject.Strsuppl1 : "";
			sCurrentObject.Strsuppl2 = sCurrentObject.Strsuppl2 ? sCurrentObject.Strsuppl2 : "";
			sCurrentObject.Strsuppl3 = sCurrentObject.Strsuppl3 ? sCurrentObject.Strsuppl3 : "";
			sCurrentObject.AddrLocation = sCurrentObject.AddrLocation ? sCurrentObject.AddrLocation : "";
			sCurrentObject.RefPosta = sCurrentObject.RefPosta ? sCurrentObject.RefPosta : "";
			sCurrentObject.Landx = sCurrentObject.Landx ? sCurrentObject.Landx : "";
			sCurrentObject.TimeZone = sCurrentObject.TimeZone ? sCurrentObject.TimeZone : "";
			sCurrentObject.Region = sCurrentObject.Region ? sCurrentObject.Region : "";
			sCurrentObject.RegionDesc = sCurrentObject.RegionDesc ? sCurrentObject.RegionDesc : "";

			sCurrentModel.setData(sCurrentObject);
		},

		/*
		 * Function to handle 'change' event of Address
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onAddressFieldChange: function () {
			var oAIWModel = this.getView().getModel(this.oModelName);
			var oAIWData = oAIWModel.getData();
			oAIWModel.setData(oAIWData);

			if ((oAIWData.Title !== "" && oAIWData.Title !== undefined) || (oAIWData.TitleCode !== "" && oAIWData.TitleCode !== undefined) || (
					oAIWData.Name1 !== "" && oAIWData.Name1 !== undefined) || (oAIWData.Name2 !== "" && oAIWData.Name2 !== undefined) || (oAIWData.Name3 !==
					"" && oAIWData.Name3 !== undefined) || (oAIWData.Name4 !== "" && oAIWData.Name4 !== undefined) ||
				(oAIWData.Sort1 !== "" && oAIWData.Sort1 !== undefined) || (oAIWData.Sort2 !== "" && oAIWData.Sort2 !== undefined) || (oAIWData.NameCo !==
					"" && oAIWData.NameCo !== undefined) || (oAIWData.PostCod1 !== "" && oAIWData.PostCod1 !== undefined) || (oAIWData.City1 !== "" &&
					oAIWData.City1 !== undefined) || (oAIWData.Building !== "" && oAIWData.Building !== undefined) ||
				(oAIWData.Floor !== "" && oAIWData.Floor !== undefined) || (oAIWData.Roomnum !== "" && oAIWData.Roomnum !== undefined) || (
					oAIWData.AddrLocation !== "" && oAIWData.AddrLocation !== undefined) || (oAIWData.Strsuppl1 !== "" && oAIWData.Strsuppl1 !==
					undefined) || (oAIWData.Strsuppl2 !== "" && oAIWData.Strsuppl2 !== undefined) ||
				(oAIWData.Strsuppl3 !== "" && oAIWData.Strsuppl3 !== undefined) || (oAIWData.TimeZone !== "" && oAIWData.TimeZone !== undefined) ||
				(oAIWData.RefPosta !== "" && oAIWData.RefPosta !== undefined) || (oAIWData.Region !== "" && oAIWData.Region !== undefined)) {
				oAIWData.RefPostaLblReq = true;
			} else {
				oAIWData.RefPostaLblReq = false;
				oAIWData.RefPostaVS = "None";
			}

			oAIWModel.setData(oAIWData);
		},

		/*
		 * To parse value (boolean to string)
		 * @public
		 * @param {boolean} d
		 * @returns {string}
		 */
		parseValue: function (d) {
			if (d) {
				return "X";
			} else {
				return "";
			}
		},

		/*
		 * To format date
		 * @public
		 * @param {date} _validFrm
		 * @returns {string} formatDate
		 */
		_formatDate: function (_validFrm) {
			if (_validFrm !== "" && _validFrm !== null && _validFrm !== undefined) {
				var formatDate = "";
				var date = new Date(_validFrm);
				var yyyy = date.getFullYear();
				var mm = date.getMonth() + 1;
				if (mm < 10) {
					mm = "0" + mm;
				}
				var dd = date.getDate();
				if (dd < 10) {
					dd = "0" + dd;
				}
				var hh = date.getHours();
				if (hh < 10) {
					hh = "0" + hh;
				}
				var min = date.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				var ss = date.getSeconds();
				if (ss < 10) {
					ss = "0" + ss;
				}
				formatDate = yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + min + ":" + ss;
				return formatDate;
			} else {
				return null;
			}
		},

		/*
		 * Method to create instance of Message Popover
		 * @public
		 */
		configureMessagePopover: function () {
			var oMessageTemplate = new sap.m.MessageItem({
				type: "{type}",
				title: "{title}"
			});

			this.oMessagePopover = new sap.m.MessagePopover({
				items: {
					path: "/",
					template: oMessageTemplate
				}
			});
		},

		/*
		 * Triggered by 'updateFinished' event of table
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			// var mainModel = this._searchFragment.getModel("mainView");
			var mainData = this.getView().getModel(this.oModelName).getData();
			if (mainData !== null && mainData !== undefined) {
				var oTable = oEvent.getSource();
				var iTotalItems = oEvent.getParameter("total");
				// ononly update the counter if the length is final and
				// the table is not empty
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					mainData.tableResultCount = this.getResourceBundle().getText("RESULTS", [iTotalItems]);
				} else {
					mainData.tableResultCount = this.getResourceBundle().getText("RESULTS", [0]);
				}
				this.getView().getModel(this.oModelName).refresh();
			}
		},

		/*
		 * Function to handle Search button press from Search screen
		 * @public
		 */
		onSearch: function () {
			var g = this;
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			var maxNo = oJsonData.MaxNo;
			maxNo = parseInt(maxNo);
			if (maxNo === "" || maxNo === 0 || isNaN(maxNo)) {
				var msg = g.getView().getModel("i18n").getProperty("VALUE_ERR");
				oJsonData.MaxNoVS = "Error";
				oJsonModel.setData(oJsonData);
				g.invokeMessage(msg);
				return;
			} else {
				oJsonData.MaxNoVS = "None";
				oJsonModel.setData(oJsonData);
			}

			var oModel = g.getView().getModel();
			var urlParameters = {
				"$top": maxNo
			};
			var results = [],
				oFilters = [];
			var sPath;

			if (g.oModelName === "AIWFLOC" || g.oSearchModelName === "AIWFLOC") {
				sPath = "/FLSearchSet";
				oFilters = [new sap.ui.model.Filter("Itplnr", "EQ", oJsonData.Tplnr.toUpperCase()), new sap.ui.model.Filter("Ipltxt", "EQ",
						oJsonData.Pltxt.toUpperCase()),
					new sap.ui.model.Filter("Ifltyp", "EQ", oJsonData.Floccategory.toUpperCase()), new sap.ui.model.Filter("Iswerk", "EQ",
						oJsonData.Maintplant.toUpperCase()),
					new sap.ui.model.Filter("Iingrp", "EQ", oJsonData.Ingrp.toUpperCase()), new sap.ui.model.Filter("Igewrkfloc", "EQ", oJsonData.MainArbpl)
				];
			}
			if (g.oModelName === "AIWEQUI" || g.oSearchModelName === "AIWEQUI") {
				sPath = "/EQSearchSet";
				oFilters = [new sap.ui.model.Filter("IEqunr", "EQ", oJsonData.Equnr.toUpperCase()), new sap.ui.model.Filter("Itxtmi", "EQ",
						oJsonData.Eqktx.toUpperCase()),
					new sap.ui.model.Filter("Iswerk", "EQ", oJsonData.Maintplant.toUpperCase()), new sap.ui.model.Filter("Ieqtyp", "EQ", oJsonData
						.EquipmentCatogory.toUpperCase()),
					new sap.ui.model.Filter("Ieqart", "EQ", oJsonData.TechnicalObjectTyp.toUpperCase())
				];
			}
			if (g.oModelName === "AIWMSPT" || g.oSearchModelName === "AIWMSPT") {
				sPath = "/MSSearchSet";
				oFilters = [new sap.ui.model.Filter("Ipoint", "EQ", oJsonData.Mspoint.toUpperCase()), new sap.ui.model.Filter("Ipttxt", "EQ",
						oJsonData.Pttxt.toUpperCase()),
					new sap.ui.model.Filter("Iequnr", "EQ", oJsonData.Equnr.toUpperCase()), new sap.ui.model.Filter("Itplnr", "EQ", oJsonData.Tplnr
						.toUpperCase()),
					new sap.ui.model.Filter("Imptyp", "EQ", oJsonData.Mptyp.toUpperCase())
				];
			}
			if (g.oModelName === "AIWMPMI" || g.oSearchModelName === "AIWMPMI") {
				sPath = "/MPSearchSet";
				oFilters = [new sap.ui.model.Filter("Istrat", "EQ", oJsonData.Strat.toUpperCase()), new sap.ui.model.Filter("Iwarpl", "EQ",
						oJsonData.Warpl.toUpperCase()),
					new sap.ui.model.Filter("Imptyp", "EQ", oJsonData.Mptyp.toUpperCase()), new sap.ui.model.Filter("IplanSort", "EQ", oJsonData.MplanSort
						.toUpperCase()),
					new sap.ui.model.Filter("Iwptxt", "EQ", oJsonData.Wptxt.toUpperCase())
				];
			}

			oJsonData.tableBusy = true;
			oJsonModel.setData(oJsonData);

			jQuery.sap.delayedCall(10, g, function () {
				var fnSuccess = function (r) {
					var oSearchModel = new JSONModel([]);
					if (r.results.length > 0) {
						results = r.results;
						// if (results[0].Message !== "") {
						// 	var message = results[0].Message;
						// 	sap.m.MessageToast.show(message, {
						// 		duration: 12000,
						// 		animationDuration: 12000
						// 	});
						// } else {
						oJsonData.tableBusy = false;
						oJsonData.tableThresholdLength = results.length;
						oSearchModel.setData(results);
						g.getView().setModel(oSearchModel, g.oSearchModelTable);
						// }
					} else {
						oJsonData.tableBusy = false;
						oJsonData.tableThresholdLength = results.length;
						oSearchModel.setData(results);
						g.getView().setModel(oSearchModel, g.oSearchModelTable);
					}
					oJsonModel.setData(oJsonData);
				};
				var fnError = function () {
					g.setModel(new JSONModel(), g.oSearchModelTable);
					oJsonData.tableBusy = false;
					oJsonModel.setData(oJsonData);
				};
				g._readData(sPath, oModel, fnSuccess, fnError, oFilters, urlParameters);
			});
		},

		/*
		 * Function to handle 'select' of Search table
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onSearchItemSelect: function (oEvent) {
			this.selectedIndex = oEvent.getSource()._aSelectedPaths;
			var oMainModel = this.getView().getModel("mainView");
			var oMainData = oMainModel.getData();

			if (this.selectedIndex.length > 0) {
				oMainData.importEnabled = true;
			} else {
				oMainData.importEnabled = false;
			}
			oMainModel.setData(oMainData);
		},

		/*
		 * Function to handle 'Import to MOCR' press
		 * @public
		 */
		onImportToMocrPress: function () {
			var g = this;
			var existFlag = false;
			var oMessageList = [];
			var successCount = 0;
			var AIWModel;
			// if(this.detailFlag) {
			// 	AIWModel = sap.ui.getCore().getModel(this.oModelName).getData();
			// } else {
			AIWModel = sap.ui.getCore().getModel(this.oSearchModelName).getData();
			// }
			// var searchData = this.getView().getModel(this.oSearchModelTable).getData();
			var searchData = this.getView().byId("searchResults").getModel().getData();

			if (this.selectedIndex.length > 0) {
				for (var i = 0; i < this.selectedIndex.length; i++) {
					var index = this.selectedIndex[i].split("/")[1];
					index = parseInt(index);

					if (searchData[index].UsmdActive && searchData[index].UsmdActive === "1") { //CrStatus
						if (this.oSearchModelName === "AIWEQUI") {
							oMessageList.push({
								type: "Error",
								title: "Equipment " + searchData[index].Equi + " already locked in the Change Request"
							});
						}
						if (this.oSearchModelName === "AIWFLOC") {
							oMessageList.push({
								type: "Error",
								title: "Functional Location " + searchData[index].Funcloc + " already locked in the Change Request"
							});
						}
						if (this.oSearchModelName === "AIWMSPT") {
							oMessageList.push({
								type: "Error",
								title: "Measuring Point " + searchData[index].Mspoint + " already locked in the Change Request"
							});
						}
						if (this.oSearchModelName === "AIWMPMI") {
							oMessageList.push({
								type: "Error",
								title: "Maintenance Plan " + searchData[index].Mplan + " already locked in the Change Request"
							});
						}
						continue;
					}
					if (AIWModel.length > 0) {
						for (var j = 0; j < AIWModel.length; j++) {
							if (this.oSearchModelName === "AIWEQUI") {
								if (AIWModel[j].Equnr === searchData[index].Equi) {
									oMessageList.push({
										type: "Error",
										title: "Equipment " + searchData[index].Equi + g.getResourceBundle().getText("locked")
									});
									existFlag = true;
									break;
								}
							}
							if (this.oSearchModelName === "AIWFLOC") {
								if (AIWModel[j].Functionallocation === searchData[index].Funcloc) {
									oMessageList.push({
										type: "Error",
										title: "Functional Location " + searchData[index].Funcloc + g.getResourceBundle().getText("locked")
									});
									existFlag = true;
									break;
								}
							}
							if (this.oSearchModelName === "AIWMSPT") {
								if (AIWModel[j].Mspoint === searchData[index].Mspoint) {
									oMessageList.push({
										type: "Error",
										title: "Measuring Point " + searchData[index].Mspoint + g.getResourceBundle().getText("locked")
									});
									existFlag = true;
									break;
								}
							}
							if (this.oSearchModelName === "AIWMPMI") {
								if (AIWModel[j].Warpl === searchData[index].Mplan) {
									oMessageList.push({
										type: "Error",
										title: "Maintenance Plan " + searchData[index].Mplan + g.getResourceBundle().getText("locked")
									});
									existFlag = true;
									break;
								}
							}
						}
					}
					if (!existFlag) {
						existFlag = false;
						successCount = successCount + 1;

						if (this.oSearchModelName === "AIWEQUI") {
							this.readEquipmentData(searchData[index].Equi);
						}
						if (this.oSearchModelName === "AIWFLOC") {
							this.readFunctionalLocData(searchData[index].Funcloc);
						}
						if (this.oSearchModelName === "AIWMSPT") {
							this.readMeasuringPointData(searchData[index].Mspoint);
						}
						if (this.oSearchModelName === "AIWMPMI") {
							this.readMaintenancePlanData(searchData[index].Mplan);
						}
					}
				}
				this.createMessagePopover(oMessageList, successCount);
			}
		},

		/*
		 * Function to handle search import press
		 * @public
		 * @param {object} sObject
		 * @param {string} sModelName
		 */
		handleSearchImportPress: function (sObject, sModelName) {
			var sJsonModel;
			sJsonModel = sap.ui.getCore().getModel(sModelName).getData();
			sJsonModel.push(sObject);
			sap.ui.getCore().getModel(sModelName).refresh();
		},

		/*
		 * Function to set MessagePopOver
		 * @public
		 * @param {array} oMessageList
		 * @param {string} successCount
		 */
		createMessagePopover: function (oMessageList, successCount) {
			if (successCount > 0) {
				oMessageList.push({
					type: "Success",
					title: "Successfuly import added to the MOCR: " + successCount
				});
			}
			var sJsonModel = new JSONModel();
			sJsonModel.setData(oMessageList);
			this.oMessagePopover.setModel(sJsonModel);
			this.oMessagePopover.toggle(this.getView().byId("idMessagePopover"));

			this.getView().byId("idMessagePopover").setEnabled(true);
			this.getView().byId("idMessagePopover").setText(oMessageList.length + "");
		},

		/*
		 * This function is invoked when 'MeassagePopOver' is pressed
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleMessagePopoverPress: function (oEvent) {
			this.oMessagePopover.toggle(oEvent.getSource());
		},

		/*
		 * Function to handle Done button press of search screen
		 * @public
		 */
		onSearchDonePress: function () {
			this.selectedIndex = [];
			var refreshModel = sap.ui.getCore().getModel("refreshModel");
			refreshModel.setProperty("/refreshSearch", true);

			var oControl = this.getView().byId("idPanel");
			var oTable = this.getView().byId("searchResults");
			var items = this.getView().byId("sColListItem");
			oControl.destroyContent();
			oTable.destroyColumns();
			oTable.destroyItems();
			items.destroyCells();
			oTable.setModel();
			if (this._oTPC) {
				this._oTPC.destroyPersoService();
				this._oTPC.destroy();
			}

			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("main", {}, true);
			}
		},

		/*
		 * Function to set Aiw main table model
		 * @public
		 * @param {object} sObject
		 * @param {string} sModelName
		 */
		handleMainTableRow: function (sObject, sModelName) {
			var sJsonModel;
			sJsonModel = new JSONModel();
			sJsonModel.setData(sObject);
			this.getView().setModel(sJsonModel, sModelName);
			this.getView().getModel(sModelName).refresh();
			this.attachModelEventHandlers(sJsonModel);
		},

		/*
		 * Function to set object to model
		 * @public
		 * @param {object} sObject
		 * @param {string} sModelName
		 */
		handleCreatePress: function (sObject, sModelName) {
			var sJsonModel, sArray;
			// sJsonModel = sap.ui.getCore().getModel(sModelName);
			sJsonModel = this.getView().getModel(sModelName);
			// sArray = sJsonModel.getData();
			// sArray.push(sObject);
			sJsonModel.setData(sObject);
			// this.onUpdateTitleCount(sModelName, sArray);
			this.getView().setModel(sJsonModel, sModelName);
			// sap.ui.getCore().setModel(sJsonModel, sModelName);
		},

		/*
		 * Setter method of common approval data
		 * @public
		 * @param {object} pObject
		 * @param {string} pModelName
		 * @param {string} flag
		 */
		setCommonApprovalData: function (pModelName, pObject, flag) {
			var sArray = [];
			var sJsonModel = sap.ui.getCore().getModel("AIWAPPROVE");
			var oModelName = "/" + pModelName;
			var sObject = {
				classItems: pObject.classItems, // Class Details
				characteristics: pObject.characteristics, // Characteristics Details
			};

			if (pObject.linearChar) {
				sObject.linearChar = pObject.linearChar;
			}

			if (flag) {
				sObject.Title = pObject.Title;
				sObject.Name1 = pObject.Name1;
				sObject.Name2 = pObject.Name2;
				sObject.Name3 = pObject.Name3;
				sObject.Name4 = pObject.Name4;
				sObject.Sort1 = pObject.Sort1; // searchTerm1
				sObject.Sort2 = pObject.Sort2; // searchTerm2
				sObject.NameCo = pObject.NameCo; // Company 
				sObject.Building = pObject.Building;
				sObject.Floor = pObject.Floor;
				sObject.Roomnum = pObject.Roomnum;
				sObject.Street = pObject.Street;
				sObject.HouseNr1 = pObject.HouseNr1;
				sObject.HouseNr2 = pObject.HouseNr2;
				sObject.Strsuppl1 = pObject.Strsuppl1;
				sObject.Strsuppl2 = pObject.Strsuppl2;
				sObject.Strsuppl3 = pObject.Strsuppl3;
				sObject.AddrLocation = pObject.AddrLocation;
				sObject.District = pObject.District;
				sObject.PostCod1 = pObject.PostCod1;
				sObject.City1 = pObject.City1; // City
				sObject.RPostafl = pObject.RPostafl;
				sObject.Landx = pObject.Landx;
				sObject.RfePost = pObject.RfePost;
				sObject.Regiotxt = pObject.Regiotxt;
				sObject.HomeCity = pObject.HomeCity;
				sObject.TimeZone = pObject.TimeZone;
				sObject.Taxjurcod = pObject.Taxjurcod;
				sObject.Regiogrou = pObject.Regiogrou;
				sObject.RfePostl = pObject.RfePostl;
				sObject.Dontusestxt = pObject.Dontusestxt;
				sObject.PoBox = pObject.PoBox;
				sObject.PoboxNum = pObject.PoboxNum;
				sObject.DlvsrvTy = pObject.DlvsrvTy;
				sObject.DlvsrvNr = pObject.DlvsrvNr;
				sObject.PostCod2 = pObject.PostCod2;
				sObject.PoboxLoc = pObject.PoboxLoc;
				sObject.PoboxLby = pObject.PoboxLby;
				sObject.PoboxCty = pObject.PoboxCty;
				sObject.LandxP = pObject.LandxP;
				sObject.RfePstal = pObject.RfePstal;
				sObject.RegiotxtP = pObject.RegiotxtP;
				sObject.Dontuseptxt = pObject.Dontuseptxt;
				sObject.PostCod3 = pObject.PostCod3;
				sObject.Remark = pObject.Remark;
				sObject.emailAddress = [];
				sObject.urlAddress = [];
				sObject.telephoneData = [];
				sObject.faxData = [];

				if (pObject.emailAddress) {
					if (pObject.emailAddress.length > 0) {
						sObject.emailAddress = pObject.emailAddress;
					}
				}

				if (pObject.urlAddress) {
					if (pObject.urlAddress.length > 0) {
						sObject.urlAddress = pObject.urlAddress;
					}
				}

				if (pObject.telephoneData) {
					if (pObject.telephoneData.length > 0) {
						sObject.telephoneData = pObject.telephoneData;
					}
				}

				if (pObject.faxData) {
					if (pObject.faxData.length > 0) {
						sObject.faxData = pObject.faxData;
					}
				}

				if (pObject.intlAddr) {
					if (pObject.intlAddr.length > 0) {
						sObject.intlAddr = pObject.intlAddr;
					}
				}

				// if (pObject.altlbl) {
				// 	if (pObject.altlbl.length > 0) {
				// 		sObject.altlbl = pObject.altlbl;
				// 	}
				// }
			}

			if (sJsonModel.getProperty(oModelName)) {
				sArray = sJsonModel.getProperty(oModelName);
			} else {
				sArray = [];
			}
			sArray.push(sObject);
			sJsonModel.setProperty(oModelName, sArray);
		},

		/*
		 * Function to read Functional Location data
		 * @public
		 * @param {string} sTplnr
		 * @param {string} sCrStatus
		 */
		readFunctionalLocData: function (sTplnr, sCrStatus) {
			var g = this;
			// var oMainModel = g.getView().getModel("mainView");
			// var oMainData = oMainModel.getData();
			// oMainData.viewBusy = true;
			// oMainModel.setData(oMainData);

			var sModelName = "AIWFLOC";
			var sPath = "/ChangeRequestSet";
			var oExpand = ["FLClass", "FLAddr", "FLAddrI", "FLEmail", "FLFax", "FLMltxt", "FLPermit", "FuncLoc", "FLLAM", "FLLAMCH", "FLPrtnr",
				"FLTele", "FLUrl", "FLVal", "FLALTLBEL", "FLLAMCH", "FLDOI"
			];

			var urlParameters = {
				"$expand": oExpand
			};

			var oModel = g.getView().getModel();
			var oFilters = [new sap.ui.model.Filter("Tplnr", "EQ", sTplnr), new sap.ui.model.Filter("Tplma", "EQ", "")];
			var fnSuccess = function (data) {
				g.BusyDialog.close();
				var results = data.results[0];

				if (results === undefined) {
					// oMainData.viewBusy = false;
					// oMainModel.setData(oMainData);
					return;
				}
				var sObject = {
					// functional Location
					Functionallocation: sTplnr,

					intlAddr: [], // International Address
					altlbl: [], // Alternate Labels
					Partners: [], // Partners
					Permits: [], // Permit
					classItems: [], // Class Details
					characteristics: [], // Characteristics Details
					linearChar: [],
					linearCharAddEnable: false,

					attachmentCount: "0", // Attachment Count
					Guids: "", // Attachment
					charNewButton: false,

					FunctionallocationVS: "None",
					FunctionallocationVST: "",
					FlocdescriptionVS: "None",
					FlocdescriptionVST: "",
					StrucindicatorVS: "None",
					StrucindicatorVST: "",
					FloccategoryVS: "None",
					FloccategoryVST: "",
					SupFunctionallocationVS: "None",
					SupFunctionallocationVST: "",
					MaintplantVS: "None",
					MaintplantVST: "",
					StsmEquiVS: "None",
					StsmEquiVST: "",
					UstwEquiVS: "None",
					UstwEquiVST: "",
					UswoEquiVS: "None",
					UswoEquiVST: "",
					TechnicalObjectTypVS: "None",
					TechnicalObjectTypVST: "",
					LocationVS: "None",
					LocationVST: "",
					AbckzVS: "None",
					AbckzVST: "",
					MainArbplVS: "None",
					MainArbplVST: "",
					BeberFlVS: "None",
					BeberFlVST: "",
					BukrsVS: "None",
					BukrsVST: "",
					KostlVS: "None",
					KostlVST: "",
					WerksVS: "None",
					WerksVST: "",
					IngrpVS: "None",
					IngrpVST: "",
					ArbplVS: "None",
					ArbplVST: "",
					ConstrTypeVS: "None",
					ConstrTypeVST: "",
					RefPostaVS: "None",
					RefPostaVST: "",
					LangucodeVS: "None",
					LangucodeVST: "",
					TimeZoneVS: "None",
					TimeZoneVST: "",

					TplnrEnabled: true,
					FunctionalLocEnabled: true,
					FlocCatEnabled: true,
					StrucIndEnabled: true,
					MaintplantEnabled: true,
					BukrsEnabled: true
				};

				if (results.FuncLoc) {
					var sFunctionalLoc = results.FuncLoc.results[0];
					if (sFunctionalLoc) {
						sObject.Flocdescription = sFunctionalLoc.Txtmi; // Floc Description
						sObject.Strucindicator = sFunctionalLoc.TplkzFlc;
						sObject.StrucIndicatorDesc = sFunctionalLoc.Tplxt;
						sObject.EditMask = sFunctionalLoc.EditMask;
						sObject.Hierarchy = sFunctionalLoc.Hierarchy;
						sObject.Floccategory = sFunctionalLoc.Fltyp;
						sObject.FlocCategoryDesc = sFunctionalLoc.Flttx;
						sObject.Maintplant = sFunctionalLoc.Swerk;
						sObject.MaintplantDesc = sFunctionalLoc.Plantname;
						sObject.Location = sFunctionalLoc.StorFloc; // Location
						sObject.Locationdesc = sFunctionalLoc.Locationdesc; // Location Description
						sObject.Abckz = sFunctionalLoc.Abckzfloc;
						sObject.Abctx = sFunctionalLoc.Abctx;
						sObject.Bukrs = sFunctionalLoc.Bukrsfloc;
						sObject.Butxt = sFunctionalLoc.Butxt;
						sObject.City = sFunctionalLoc.City;
						sObject.Kostl = sFunctionalLoc.KostFloc; // Cost Center
						sObject.Kokrs = sFunctionalLoc.KokrFloc; // ccPart1
						sObject.Mctxt = sFunctionalLoc.Contareaname; // Name
						sObject.Werks = sFunctionalLoc.PlntFloc; // Planning Plant
						sObject.Planningplantdes = sFunctionalLoc.Planningplantdes; // Planning Plant Description
						sObject.Ingrp = sFunctionalLoc.Ingrp; // Planner Group
						sObject.Innam = sFunctionalLoc.Plannergrpdesc; // Planner Group Description
						sObject.Arbpl = sFunctionalLoc.Arbplfloc; // Work Center
						sObject.Ktext = sFunctionalLoc.Workcenterdesc; // Work Center Description
						sObject.WcWerks = sFunctionalLoc.Wergwfloc; // Work center Plant
						sObject.MainArbpl = sFunctionalLoc.Gewrkfloc; // Main Work Center
						sObject.MainKtext = sFunctionalLoc.MainWcDesc; // Plant Work Center
						sObject.MainWerks = sFunctionalLoc.MainWcPlant; // Name
						sObject.SupFunctionallocation = sFunctionalLoc.Tplma; // Sup FuncLoc
						sObject.SupFlocdescription = sFunctionalLoc.Supflocdesc; // Sup FlocDescription
						sObject.BeberFl = sFunctionalLoc.BeberFl; // Plant Section
						sObject.Fing = sFunctionalLoc.Fing; // Person responsible
						sObject.Tele = sFunctionalLoc.Tele; // Phone
						sObject.ConstrType = sFunctionalLoc.Submtiflo; // Construction Type
						sObject.ConstructionDesc = sFunctionalLoc.Constdesc; // Construction Description
						sObject.TechnicalObjectTyp = sFunctionalLoc.Eqart; // TechnicalObjectTyp
						sObject.Description = sFunctionalLoc.Eartx; // TechnicalObjectTyp Description

						sObject.Stattext = sFunctionalLoc.Stattext; // System Status
						sObject.StsmEqui = sFunctionalLoc.StsmFloc; // Status Profile
						sObject.StsmEquiDesc = sFunctionalLoc.Statproftxt; // Status Profile Description
						sObject.UstwEqui = sFunctionalLoc.UstwFloc; // Status with Status Number
						sObject.UswoEqui = sFunctionalLoc.UswoFloc; // Status without Status Number
						sObject.UstaEqui = sFunctionalLoc.UstaFloc; // User Status
						sObject.Deact = sFunctionalLoc.Deact; //Inactive Status
						sObject.DeactEnable = sCrStatus === "true" ? false : true; //Inactive Status Enable
						sObject.Alkey = sFunctionalLoc.Alkey; //Labeling system
						sObject.Altxt = sFunctionalLoc.Altxt; //Labeling system Desc
						sObject.Adrnr = sFunctionalLoc.Adrnr;
						if (sFunctionalLoc.Swerk !== "") {
							// sObject.MaintplantEnabled = false;
							sObject.BukrsEnabled = false;
						} else {
							sObject.MaintplantEnabled = true;
							sObject.BukrsEnabled = true;
						}

						// var oMainViewModel = g.getView().getModel("mainView");
						// var oMainViewData = oMainViewModel.getData();
						// if (sObject.UstaEqui) {
						// 	oMainViewData.visible = true;
						// } else {
						// 	oMainViewData.visible = false;
						// }
						// oMainViewModel.setData(oMainViewData);
					}
				}

				// if (sFunctionalLoc.Fltyp === "L") {
				if (results.FLLAM.results.length > 0) {
					var sLAM = results.FLLAM.results[0];
					sObject.lam = {
						Funcloc: sTplnr,
						Lrpid: sLAM.Lrpid,
						LrpidDesc: sLAM.LrpDescr,
						Strtptatr: sLAM.Strtptatr,
						Endptatr: sLAM.Endptatr,
						Length: sLAM.Length, //parseInt(sLAM.Length !== "" ? sLAM.Length : "0"),
						LinUnit: sLAM.LinUnit,
						LinUnitDesc: sLAM.Uomtext,
						Startmrkr: sLAM.Startmrkr,
						Endmrkr: sLAM.Endmrkr,
						Mrkdisst: sLAM.Mrkdisst,
						Mrkdisend: sLAM.Mrkdisend,
						MrkrUnit: sLAM.MrkrUnit,
						enableLrp: true,
						enableMarker: true,
						LrpidVS: "None",
						StrtptatrVS: "None",
						EndptatrVS: "None",
						LinUnitVS: "None",
						StartmrkrVS: "None",
						EndmrkrVS: "None",
						MrkdisstVS: "None",
						MrkdisendVS: "None",
						MrkrUnitVS: "None",
						LamDer: "D"
					};
				} else {
					sObject.lam = {
						Lrpid: "",
						LrpidDesc: "",
						Strtptatr: "",
						Endptatr: "",
						Length: "",
						LinUnit: "",
						LinUnitDesc: "",
						Startmrkr: "",
						Endmrkr: "",
						Mrkdisst: "",
						Mrkdisend: "",
						MrkrUnit: "",
						enableLrp: true,
						enableMarker: false,
						LrpidVS: "None",
						StrtptatrVS: "None",
						EndptatrVS: "None",
						LinUnitVS: "None",
						StartmrkrVS: "None",
						EndmrkrVS: "None",
						MrkdisstVS: "None",
						MrkdisendVS: "None",
						MrkrUnitVS: "None"
					};
				}
				// }

				if (results.FLAddr) {
					var sAddress = results.FLAddr.results[0];
					if (sAddress) {
						var oAddressModel = sap.ui.getCore().getModel("flocAddressView");
						var oAddressData = oAddressModel.getData();
						var mCountFlag = true;
						var sObj;
						if (oAddressData.length > 0) {
							for (var sa = 0; sa < oAddressData.length; sa++) {
								if (sObject.Functionallocation === oAddressData[sa].Functionallocation) {
									mCountFlag = false;
									break;
								}
							}
						}
						if (mCountFlag) {
							sObj = {
								Functionallocation: sObject.Functionallocation,
								IsEditable: sAddress.IsEditable
							};
							oAddressData.push(sObj);
							oAddressModel.setData(oAddressData);
						}

						sObject.IsEditable = sAddress.IsEditable;
						sObject.Title = sAddress.Titletxt; // searchTerm1
						sObject.TitleCode = sAddress.Title; // searchTerm1
						sObject.Name1 = sAddress.Name1; // searchTerm1
						sObject.Name2 = sAddress.Name2; // searchTerm1
						sObject.Name3 = sAddress.Name3; // searchTerm1
						sObject.Name4 = sAddress.Name4; // searchTerm1
						sObject.Sort1 = sAddress.Sort1; // searchTerm1
						sObject.Sort2 = sAddress.Sort2; // searchTerm2
						sObject.NameCo = sAddress.NameCo; // Company 
						sObject.PostCod1 = sAddress.PostCod1;
						sObject.City1 = sAddress.City1; // City
						sObject.Building = sAddress.Building;
						sObject.Floor = sAddress.Floor;
						sObject.Roomnum = sAddress.Roomnum;
						sObject.AddrLocation = sAddress.Location;
						sObject.Strsuppl1 = sAddress.Strsuppl1;
						sObject.Strsuppl2 = sAddress.Strsuppl2;
						sObject.Strsuppl3 = sAddress.Strsuppl3;
						sObject.RefPosta = sAddress.RPostafl;
						sObject.Landx = sAddress.Landx;
						sObject.TimeZone = sAddress.TimeZone;
						sObject.Region = sAddress.RPostFl;
						sObject.RegionDesc = sAddress.Regiotxt;
						// sObject.Langucode = sAddress.Langucode;
						// sObject.LanguP = sAddress.LanguP;
					} else {
						sObject.Title = sObject.Title ? sObject.Title : "";
						sObject.TitleCode = sObject.TitleCode ? sObject.TitleCode : "";
						sObject.Name1 = sObject.Name1 ? sObject.Name1 : "";
						sObject.Name2 = sObject.Name2 ? sObject.Name2 : "";
						sObject.Name3 = sObject.Name3 ? sObject.Name3 : "";
						sObject.Name4 = sObject.Name4 ? sObject.Name4 : "";
						sObject.Sort1 = sObject.Sort1 ? sObject.Sort1 : "";
						sObject.Sort2 = sObject.Sort2 ? sObject.Sort2 : "";
						sObject.NameCo = sObject.NameCo ? sObject.NameCo : "";
						sObject.PostCod1 = sObject.PostCod1 ? sObject.PostCod1 : "";
						sObject.City1 = sObject.City1 ? sObject.City1 : "";
						sObject.Building = sObject.Building ? sObject.Building : "";
						sObject.Floor = sObject.Floor ? sObject.Floor : "";
						sObject.Roomnum = sObject.Roomnum ? sObject.Roomnum : "";
						sObject.Strsuppl1 = sObject.Strsuppl1 ? sObject.Strsuppl1 : "";
						sObject.Strsuppl2 = sObject.Strsuppl2 ? sObject.Strsuppl2 : "";
						sObject.Strsuppl3 = sObject.Strsuppl3 ? sObject.Strsuppl3 : "";
						sObject.AddrLocation = sObject.AddrLocation ? sObject.AddrLocation : "";
						sObject.RefPosta = sObject.RefPosta ? sObject.RefPosta : "";
						sObject.Landx = sObject.Landx ? sObject.Landx : "";
						sObject.TimeZone = sObject.TimeZone ? sObject.TimeZone : "";
						sObject.Region = sObject.Region ? sObject.Region : "";
						sObject.RegionDesc = sObject.RegionDesc ? sObject.RegionDesc : "";
					}
				}

				var aIntlAddr = results.FLAddrI.results;
				if (aIntlAddr.length > 0) {
					for (var z = 0; z < aIntlAddr.length; z++) {
						aIntlAddr[z].AdNationEnable = false;
						aIntlAddr[z].City1iVS = "None";
						aIntlAddr[z].StreetiVS = "None";
						sObject.intlAddr.push(aIntlAddr[z]);
					}
				}

				var aAltLbl = results.FLALTLBEL.results;
				if (aAltLbl.length > 0) {
					for (var y = 0; y < aAltLbl.length; y++) {
						var oAltLbl = {
							"Funcloc": sTplnr,
							"AltAlkey": aAltLbl[y].AltAlkey, // Labeling system
							"Altxt": aAltLbl[y].Altxt, // Labeling system descr
							"AltStrno": aAltLbl[y].AltStrno, // Alternative Label
							"AltTplkz": aAltLbl[y].AltTplkz, // Strycture Indicator
							"Tplxt": aAltLbl[y].Tplxt, // Structure Indicator Descr
							"Name1i": aAltLbl[y].Editm, // Edit Mask
							"Actvs": aAltLbl[y].Actvs, // Active
							"AltPrkey": aAltLbl[y].AltPrkey, // Primary
							"AltReuse": aAltLbl[y].AltReuse, // Reusable

							"enableLblSys": false,
							"enableAltLbl": true,
							"enableStrInd": true,

							"LblSysVS": "None",
							"AltLblVS": "None",
							"StrIndVS": "None"
						};
						sObject.altlbl.push(oAltLbl);
					}
				}

				if (results.FLClass) {
					// var sClassList = results.FLClass.results;
					var sClassList = $.map(results.FLClass.results, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (sClassList) {
						if (sClassList.length > 0) {
							for (var i = 0; i < sClassList.length; i++) {
								sClassList[i].ctEnable = false;
								sClassList[i].classEnable = false;
								sClassList[i].ClassTypeDesc = sClassList[i].Artxt;
								delete sClassList[i].Artxt;
								sClassList[i].ClassDesc = sClassList[i].Kltxt;
								delete sClassList[i].Kltxt;
								delete sClassList[i].Changerequestid;
								delete sClassList[i].Clint;
								delete sClassList[i].Service;
								sClassList[i].classDelEnable = true;
								sObject.classItems.push(sClassList[i]);
							}
							if (sCrStatus === "true") {
								for (var i = 0; i < Object.classItems.length; i++) {
									Object.classItems[i].classDelEnable = false;
								}
							}
							sObject.charNewButton = true;
							if (g.class) {
								// var itemFragmentId = g.getView().createId("charFrag");
								// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
								// newCharBtn.setEnabled(true);
								g.class.setModel(new JSONModel(sObject.classItems));
							}
						}
					}
				}

				if (results.FLVal) {
					// var sCharList = results.FLVal.results;
					var sCharList = $.map(results.FLVal.results, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (sCharList) {
						if (sCharList.length > 0) {
							for (var j = 0; j < sCharList.length; j++) {
								sCharList[j].cNameEnable = false;
								sCharList[j].Textbz = sCharList[j].Atwtb;
								delete sCharList[j].Ataut;
								delete sCharList[j].Ataw1;
								delete sCharList[j].Atawe;
								delete sCharList[j].Atcod;
								delete sCharList[j].Atflb;
								delete sCharList[j].Atflv;
								delete sCharList[j].Atimb;
								delete sCharList[j].Atsrt;
								delete sCharList[j].Atvglart;
								delete sCharList[j].Atzis;
								delete sCharList[j].Changerequestid;
								delete sCharList[j].CharName;
								delete sCharList[j].Charid;
								delete sCharList[j].Classtype;
								delete sCharList[j].Service;
								delete sCharList[j].Valcnt;
								sCharList[j].slNo = j + 1; // ()
								sCharList[j].flag = sCharList[j].Class + "-" + sCharList[j].slNo; // ()
								sObject.characteristics.push(sCharList[j]);
							}
							if (sCrStatus === "true") {
								for (var i = 0; i < sObject.characteristics.length; i++) {
									sObject.characteristics[i].charAddEnable = false;
									sObject.characteristics[i].charClrEnable = false;
									sObject.characteristics[i].charDltEnable = false;
								}
							} else {
								for (var z = 0; z < sObject.characteristics.length; z++) {
									var count = 1;
									for (var y = 0; y < sObject.characteristics.length; y++) {
										if (z === y) {
											continue;
										}
										if (sObject.characteristics[y].Atnam === sObject.characteristics[z].Atnam && sObject.characteristics[y].Class ===
											sObject.characteristics[z].Class) {
											count++;
										}
									}
									if (count > 1) {
										sObject.characteristics[z].charDltEnable = true;
									} else {
										sObject.characteristics[z].charDltEnable = false;
									}

									if (sObject.characteristics[z].Atein === true) {
										sObject.characteristics[z].charAddEnable = false;
									}
								}
							}
							if (g.char) {
								g.char.setModel(new JSONModel(sObject.characteristics));
							}
						}
					}
				}

				if (results.FLLAMCH) {
					var alinearChar = $.map(results.FLLAMCH.results, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (alinearChar) {
						if (alinearChar.length > 0) {
							for (var j = 0; j < alinearChar.length; j++) {
								// sCharList[j].slNo = j + 1; // ()
								// sCharList[j].flag = sCharList[j].Class + "-" + sCharList[j].slNo; // ()
								alinearChar[j].linCharEnable = true;
								delete alinearChar[j].__metadata;
								sObject.linearChar.push(alinearChar[j]);
							}
							if (sCrStatus === "true") {
								for (var i = 0; i < sObject.linearChar.length; i++) {
									sObject.linearChar[i].linCharEnable = false;
								}
							}
							if (g.linearChar) {
								g.linearChar.setModel(new JSONModel(sObject.linearChar));
							}
						}
					}
				}

				if (g.noOfCopyObjects !== undefined || g.noOfCopyObjects < 0) {
					sObject.Functionallocation = "";
					// sObject.SupFunctionallocation = "";
					// sObject.SupFlocdescription = "";
					sObject.FunctionallocationVS = "Error";
					sObject.viewParameter = "create";
					// sObject.UswoEqui = g.userWithoutSts;
					sObject.altlbl = []; //Alt Labels not to be copied (Copy case)
					var sJsonModel, sArray;
					sJsonModel = g.getView().getModel(sModelName);
					sArray = sJsonModel.getData();
					sArray.push(sObject);

					if (g.noOfCopyObjects <= 1) {
						var sArray = $.map(sArray, function (obj) {
							return $.extend(true, {}, obj);
						});
						if (sArray.length > 0) {
							sArray.forEach(function (obj) {
								if (obj.intlAddr.length > 0) {
									obj.intlAddr.forEach(function (item) {
										item.Funcloc = obj.Functionallocation;
									});
								}
							});
						}
					}

					sJsonModel.setData(sArray);
					sap.ui.getCore().setModel(new JSONModel(sJsonModel.getData()), sModelName);
					g.onUpdateTitleCount(sModelName, sArray);
					g.noOfCopyObjects--;

					if (sObject.SupFunctionallocation !== "") {
						g.DOIonReadFL(sObject.Functionallocation, sObject.SupFunctionallocation, "copy");
					} else {
						g.modifyDoiForCopyChange(sFunctionalLoc, "CPY");
						// sap.ui.getCore().getModel("dataOriginMOP").getData().FL.push({
						// 	key: sObject.Functionallocation,
						// 	DOI: g.DOIarrayFL
						// });
					}
					// oMainData.viewBusy = false;
					// oMainModel.setData(oMainData);
					return;
				}

				if (sObject.Floccategory === "" || sObject.Floccategory === undefined) {
					sObject.FlocCatEnabled = true;
				} else {
					sObject.FlocCatEnabled = false;
				}
				if (sObject.Strucindicator === "" || sObject.Strucindicator === undefined) {
					sObject.StrucIndEnabled = true;
				} else {
					sObject.StrucIndEnabled = false;
				}
				if (sObject.Maintplant === "" || sObject.Maintplant === undefined) {
					sObject.MaintplantEnabled = true;
				} else {
					sObject.MaintplantEnabled = false;
				}
				if (sObject.Bukrs === "" || sObject.Bukrs === undefined) {
					sObject.BukrsEnabled = true;
				} else {
					sObject.BukrsEnabled = false;
				}
				sObject.FunctionalLocEnabled = false;

				var sAddressViewEnabled;
				if (sCrStatus === "true") {
					sAddressViewEnabled = false;
					sObject.FunctionalLocEnabled = false;
					sObject.FlocCatEnabled = false;
					sObject.StrucIndEnabled = false;
					sObject.MaintplantEnabled = false;
					sObject.BukrsEnabled = false;
				} else {
					sAddressViewEnabled = sObject.IsEditable;
				}

				if (g.detailFlag === true) {
					if (sCrStatus === "true") {
						for (var x = 0; x < sObject.altlbl.length; x++) {
							sObject.altlbl[x].enableAltLbl = false;
							sObject.altlbl[x].enableStrInd = false;
						}
					}
					g.handleMainTableRow(sObject, sModelName);

					if (sObject.Floccategory === "L" && g.lamSwitch === "X") {
						g.lam.setVisible(true);
						g.lam.setModel(new JSONModel(sObject), "AIWLAM");
						g.linearChar.setVisible(true);
					} else {
						g.lam.setVisible(false);
						g.linearChar.setVisible(false);
					}

					if (sObject.SupFunctionallocation !== "") {
						g.DOIonReadFL(sObject.Functionallocation, sObject.SupFunctionallocation, "change");
					} else {
						// g.getView().getModel("dataOrigin").setData(g.DOIarrayFL);
						g.modifyDoiForCopyChange(sFunctionalLoc, "CHREAD");
						g.functionalLocation = "";
						g.functionalLocDesc = "";
					}

					if (sObject.Maintplant !== "" && sObject.MaintplantVS !== "Error") {
						this.SOPMaintPlant = sObject.Maintplant;
					} else {
						this.SOPMaintPlant = "";
					}
				} else {
					sAddressViewEnabled = sObject.IsEditable;
					sObject.viewParameter = "change";
					///// AIW Model Data /////////
					sObject.Modeldesc = sFunctionalLoc.Modeldesc;
					sObject.Modelref = sFunctionalLoc.Modelref;
					sObject.Modelrver = sFunctionalLoc.Modelrver;
					sObject.Modelext = sFunctionalLoc.Modelext;
					sObject.Modelname = sFunctionalLoc.Modelname;
					sObject.Modelver = sFunctionalLoc.Modelver;
					var flocImportFlag = true;
					sap.ui.getCore().setModel(flocImportFlag, "flocImportFlag");
					g.handleSearchImportPress(sObject, sModelName);

					if (sObject.SupFunctionallocation !== "") {
						g.DOIonReadFL(sObject.Functionallocation, sObject.SupFunctionallocation, "change", results);
					} else {
						g.modifyDoiForCopyChange(sFunctionalLoc, "CHIMPT");
						// sap.ui.getCore().getModel("dataOriginMOP").getData().FL.push({
						// 	key: sObject.Functionallocation,
						// 	DOI: g.DOIarrayFL
						// });
					}
				}

				// oMainData.viewBusy = false;
				// oMainModel.setData(oMainData);

				if (g.getView().getModel("flocAddressView")) {
					var oAddressViewModel = g.getView().getModel("flocAddressView");
					var oAddressViewData = oAddressViewModel.getData();
					oAddressViewData.enabled = sAddressViewEnabled;
					oAddressViewModel.setData(oAddressViewData);
				}
			};
			var fnError = function (err) {
				g.BusyDialog.close();
				// oMainData.viewBusy = false;
				// oMainModel.setData(oMainData);
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
				// g.invokeMessage(value);
				// sap.m.MessageBox.show(value, {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function () {}
				// });
				g.createMessagePopover([{
					title: value,
					type: "Error"
				}], false);
			};
			g.BusyDialog.open();
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters, urlParameters);
		},

		modifyDoiForCopyChange: function (sObject, flag) {
			var g = this;
			var aDefaultDoi = $.map(g.DOIarrayFL, function (obj) {
				return $.extend(true, {}, obj);
			});

			if (sObject.Swerk !== "") {
				aDefaultDoi[0].maintenance = true;
				aDefaultDoi[0].currentVal = sObject.Swerk;
				aDefaultDoi[0].currentValDesc = sObject.Plantname;
				aDefaultDoi[0].targetVal = sObject.Swerk;
			}
			if (sObject.StorFloc !== "") {
				aDefaultDoi[1].maintenance = true;
				aDefaultDoi[1].currentVal = sObject.StorFloc;
				aDefaultDoi[1].currentValDesc = sObject.Locationdesc;
				aDefaultDoi[1].targetVal = sObject.StorFloc;
			}
			if (sObject.BeberFl !== "") {
				aDefaultDoi[2].maintenance = true;
				aDefaultDoi[2].currentVal = sObject.BeberFl;
				aDefaultDoi[2].currentValDesc = sObject.Fing;
				aDefaultDoi[2].targetVal = sObject.BeberFl;
			}
			if (sObject.Arbplfloc !== "") {
				aDefaultDoi[3].maintenance = true;
				aDefaultDoi[3].currentVal = sObject.Arbplfloc;
				aDefaultDoi[3].currentValDesc = sObject.Workcenterdesc;
				aDefaultDoi[3].targetVal = sObject.Arbplfloc;
			}
			if (sObject.Abckzfloc !== "") {
				aDefaultDoi[4].maintenance = true;
				aDefaultDoi[4].currentVal = sObject.Abckzfloc;
				aDefaultDoi[4].currentValDesc = sObject.Abctx;
				aDefaultDoi[4].targetVal = sObject.Abckzfloc;
			}
			if (sObject.KostFloc !== "") {
				aDefaultDoi[6].maintenance = true;
				aDefaultDoi[6].currentVal = sObject.KostFloc;
				aDefaultDoi[6].currentValDesc = sObject.Contareaname;
				aDefaultDoi[6].targetVal = sObject.KostFloc;
			}
			if (sObject.PlntFloc !== "") {
				aDefaultDoi[8].maintenance = true;
				aDefaultDoi[8].currentVal = sObject.PlntFloc;
				aDefaultDoi[8].currentValDesc = sObject.Planningplantdes;
				aDefaultDoi[8].targetVal = sObject.PlntFloc;
			}
			if (sObject.Ingrp !== "") {
				aDefaultDoi[9].maintenance = true;
				aDefaultDoi[9].currentVal = sObject.Ingrp;
				aDefaultDoi[9].currentValDesc = sObject.Plannergrpdesc;
				aDefaultDoi[9].targetVal = sObject.Ingrp;
			}
			if (sObject.Gewrkfloc !== "") {
				aDefaultDoi[10].maintenance = true;
				aDefaultDoi[10].currentVal = sObject.Gewrkfloc;
				aDefaultDoi[10].currentValDesc = sObject.MainWcDesc;
				aDefaultDoi[10].targetVal = sObject.Gewrkfloc;
			}
			if (sObject.Bukrsfloc !== "") {
				aDefaultDoi[5].maintenance = true;
				aDefaultDoi[5].currentVal = sObject.Bukrsfloc;
				aDefaultDoi[5].currentValDesc = "";
				aDefaultDoi[5].targetVal = sObject.Bukrsfloc;
			}
			if (sObject.KokrFloc !== "") {
				aDefaultDoi[7].maintenance = true;
				aDefaultDoi[7].currentVal = sObject.KokrFloc;
				aDefaultDoi[7].currentValDesc = "";
				aDefaultDoi[7].targetVal = sObject.KokrFloc;
			}
			if (sObject.Wergwfloc !== "") {
				aDefaultDoi[11].maintenance = true;
				aDefaultDoi[11].currentVal = sObject.Wergwfloc;
				aDefaultDoi[11].currentValDesc = "";
				aDefaultDoi[11].targetVal = sObject.Wergwfloc;
			}
			if (sObject.Adrnr !== "") {
				aDefaultDoi[12].maintenance = true;
				aDefaultDoi[12].currentVal = sObject.Adrnr;
				aDefaultDoi[12].currentValDesc = "";
				aDefaultDoi[12].targetVal = sObject.Adrnr;
			}

			if (flag === "CHREAD") {
				g.getView().getModel("dataOrigin").setData(aDefaultDoi)
			} else {
				sap.ui.getCore().getModel("dataOriginMOP").getData().FL.push({
					key: sObject.Tplnr,
					DOI: aDefaultDoi
				});
			}
		},

		/*
		 * Function to read DOI fields list of Functional Location
		 * @public
		 * @param {string} sFloc
		 * @param {string} superFloc
		 * @param {string} sMode
		 */
		DOIonReadFL: function (sFloc, superFloc, sMode, readResults) {
			var g = this;
			var sModelName = "AIWFLOC";
			var sPath = "/ChangeRequestSet";
			var oExpand = ["FuncLoc", "FLDOI"];

			var urlParameters = {
				"$expand": oExpand
			};

			var oModel = g.getView().getModel();
			var oFilters = [new sap.ui.model.Filter("Tplnr", "EQ", ""), new sap.ui.model.Filter("Tplma", "EQ", superFloc)];

			var fnSuccess = function (data) {
				g.BusyDialog.close();
				var results = data.results[0];
				var fields = [];
				if (results.FLDOI.results.length > 0) {
					var fields = results.FLDOI.results;
				}
				// else {
				// 	var fields = g.DOIarrayFL;
				// }
				var dData = g.DOIarrayFL;
				for (var f = 0; f < fields.length; f++) {
					fields[f].instLoc = true;
					if (fields[f].hasOwnProperty("maintenance")) {
						if (!fields[f].maintenance) {
							fields[f].targetVal = fields[f].SupFlVal;
						}
					} else {
						fields[f].maintenance = dData[f].maintenance;
						if (fields[f].maintenance) {
							fields[f].instLoc = false;
						} else {
							fields[f].instLoc = true;
						}

						fields[f].currentVal = dData[f].currentVal;
					}
					if (fields[f].Property === "Maintplant" || fields[f].Property === "PplaEeqz") {
						fields[f].locEnable = false;
						fields[f].maintEnable = false;
					} else {
						fields[f].locEnable = true;
						fields[f].maintEnable = true;
					}
					fields[f].targetVal = fields[f].SupFlVal;
				}
				if (sMode === "change" && g.detailFlag === true) {
					g.getView().getModel("dataOrigin").setData(fields);
					// g.getView().getModel("dataOrigin").getData().push({
					// 	key: sFloc,
					// 	DOI: fields
					// });
				} else {
					sap.ui.getCore().getModel("dataOriginMOP").getData().FL.push({
						key: sFloc,
						DOI: fields
					});

					if (readResults && sMode === "change") {
						var aFLDOIdata = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
						for (var i = 0; i < readResults.FuncLoc.results.length; i++) {
							var h = readResults.FuncLoc.results[i];
							for (var z = 0; z < aFLDOIdata.length; z++) {
								if (sFloc === aFLDOIdata[z].key) {
									var aDOIFields = aFLDOIdata[z].DOI;
									if (h.Swerki === "") {
										aDOIFields[0].maintenance = false;
										aDOIFields[0].instLoc = false;
										aDOIFields[0].SupFlVal = "";
										aDOIFields[0].currentVal = "";
										aDOIFields[0].targetVal = "";
									} else if (h.Swerki === "D") {
										aDOIFields[0].maintenance = true;
										aDOIFields[0].instLoc = false;
										aDOIFields[0].SupFlVal = "";
										aDOIFields[0].currentVal = h.Swerk;
										aDOIFields[0].targetVal = h.Swerk;
									} else {
										aDOIFields[0].maintenance = false;
										aDOIFields[0].instLoc = true;
										aDOIFields[0].SupFlVal = h.Swerk;
										aDOIFields[0].currentVal = "";
										aDOIFields[0].targetVal = h.Swerk;
									}

									if (h.Storti === "") {
										aDOIFields[1].maintenance = false;
										aDOIFields[1].instLoc = false;
										aDOIFields[1].SupFlVal = "";
										aDOIFields[1].currentVal = "";
										aDOIFields[1].targetVal = "";
									} else if (h.Storti === "D") {
										aDOIFields[1].maintenance = true;
										aDOIFields[1].instLoc = false;
										aDOIFields[1].SupFlVal = "";
										aDOIFields[1].currentVal = h.StorFloc;
										aDOIFields[1].targetVal = h.StorFloc;
									} else {
										aDOIFields[1].maintenance = false;
										aDOIFields[1].instLoc = true;
										aDOIFields[1].SupFlVal = h.StorFloc;
										aDOIFields[1].currentVal = "";
										aDOIFields[1].targetVal = h.StorFloc;
									}

									if (h.Beberi === "") {
										aDOIFields[2].maintenance = false;
										aDOIFields[2].instLoc = false;
										aDOIFields[2].SupFlVal = "";
										aDOIFields[2].currentVal = "";
										aDOIFields[2].targetVal = "";
									} else if (h.Beberi === "D") {
										aDOIFields[2].maintenance = true;
										aDOIFields[2].instLoc = false;
										aDOIFields[2].SupFlVal = "";
										aDOIFields[2].currentVal = h.BeberFl;
										aDOIFields[2].targetVal = h.BeberFl;
									} else {
										aDOIFields[2].maintenance = false;
										aDOIFields[2].instLoc = true;
										aDOIFields[2].SupFlVal = h.BeberFl;
										aDOIFields[2].currentVal = "";
										aDOIFields[2].targetVal = h.BeberFl;
									}

									if (h.Ppsidi === "") {
										aDOIFields[3].maintenance = false;
										aDOIFields[3].instLoc = false;
										aDOIFields[3].SupFlVal = "";
										aDOIFields[3].currentVal = "";
										aDOIFields[3].targetVal = "";
									} else if (h.Ppsidi === "D") {
										aDOIFields[3].maintenance = true;
										aDOIFields[3].instLoc = false;
										aDOIFields[3].SupFlVal = "";
										aDOIFields[3].currentVal = h.Arbplfloc;
										aDOIFields[3].targetVal = h.Arbplfloc;
									} else {
										aDOIFields[3].maintenance = false;
										aDOIFields[3].instLoc = true;
										aDOIFields[3].SupFlVal = h.Arbplfloc;
										aDOIFields[3].currentVal = "";
										aDOIFields[3].targetVal = h.Arbplfloc;
									}

									if (h.Abckzi === "") {
										aDOIFields[4].maintenance = false;
										aDOIFields[4].instLoc = false;
										aDOIFields[4].SupFlVal = "";
										aDOIFields[4].currentVal = "";
										aDOIFields[4].targetVal = "";
									} else if (h.Abckzi === "D") {
										aDOIFields[4].maintenance = true;
										aDOIFields[4].instLoc = false;
										aDOIFields[4].SupFlVal = "";
										aDOIFields[4].currentVal = h.Abckzfloc;
										aDOIFields[4].targetVal = h.Abckzfloc;
									} else {
										aDOIFields[4].maintenance = false;
										aDOIFields[4].instLoc = true;
										aDOIFields[4].SupFlVal = h.Abckzfloc;
										aDOIFields[4].currentVal = "";
										aDOIFields[4].targetVal = h.Abckzfloc;
									}

									if (h.Bukrsi === "") {
										aDOIFields[5].maintenance = false;
										aDOIFields[5].instLoc = false;
										aDOIFields[5].SupFlVal = "";
										aDOIFields[5].currentVal = "";
										aDOIFields[5].targetVal = "";
									} else if (h.Bukrsi === "D") {
										aDOIFields[5].maintenance = true;
										aDOIFields[5].instLoc = false;
										aDOIFields[5].SupFlVal = "";
										aDOIFields[5].currentVal = h.Bukrsfloc;
										aDOIFields[5].targetVal = h.Bukrsfloc;
									} else {
										aDOIFields[5].maintenance = false;
										aDOIFields[5].instLoc = true;
										aDOIFields[5].SupFlVal = h.Bukrsfloc;
										aDOIFields[5].currentVal = "";
										aDOIFields[5].targetVal = h.Bukrsfloc;
									}

									if (h.Kostli === "") {
										aDOIFields[6].maintenance = false;
										aDOIFields[6].instLoc = false;
										aDOIFields[6].SupFlVal = "";
										aDOIFields[6].currentVal = "";
										aDOIFields[6].targetVal = "";
									} else if (h.Kostli === "D") {
										aDOIFields[6].maintenance = true;
										aDOIFields[6].instLoc = false;
										aDOIFields[6].SupFlVal = "";
										aDOIFields[6].currentVal = h.KostFloc;
										aDOIFields[6].targetVal = h.KostFloc;
									} else {
										aDOIFields[6].maintenance = false;
										aDOIFields[6].instLoc = true;
										aDOIFields[6].SupFlVal = h.KostFloc;
										aDOIFields[6].currentVal = "";
										aDOIFields[6].targetVal = h.KostFloc;
									}

									if (h.Kokrsi === "") {
										aDOIFields[7].maintenance = false;
										aDOIFields[7].instLoc = false;
										aDOIFields[7].SupFlVal = "";
										aDOIFields[7].currentVal = "";
										aDOIFields[7].targetVal = "";
									} else if (h.Kokrsi === "D") {
										aDOIFields[7].maintenance = true;
										aDOIFields[7].instLoc = false;
										aDOIFields[7].SupFlVal = "";
										aDOIFields[7].currentVal = h.KokrFloc;
										aDOIFields[7].targetVal = h.KokrFloc;
									} else {
										aDOIFields[7].maintenance = false;
										aDOIFields[7].instLoc = true;
										aDOIFields[7].SupFlVal = h.KokrFloc;
										aDOIFields[7].currentVal = "";
										aDOIFields[7].targetVal = h.KokrFloc;
									}

									if (h.Iwerki === "") {
										aDOIFields[8].maintenance = false;
										aDOIFields[8].instLoc = false;
										aDOIFields[8].SupFlVal = "";
										aDOIFields[8].currentVal = "";
										aDOIFields[8].targetVal = "";
									} else if (h.Iwerki === "D") {
										aDOIFields[8].maintenance = true;
										aDOIFields[8].instLoc = false;
										aDOIFields[8].SupFlVal = "";
										aDOIFields[8].currentVal = h.PlntFloc;
										aDOIFields[8].targetVal = h.PlntFloc;
									} else {
										aDOIFields[8].maintenance = false;
										aDOIFields[8].instLoc = true;
										aDOIFields[8].SupFlVal = h.PlntFloc;
										aDOIFields[8].currentVal = "";
										aDOIFields[8].targetVal = h.PlntFloc;
									}

									if (h.Ingrpi === "") {
										aDOIFields[9].maintenance = false;
										aDOIFields[9].instLoc = false;
										aDOIFields[9].SupFlVal = "";
										aDOIFields[9].currentVal = "";
										aDOIFields[9].targetVal = "";
									} else if (h.Ingrpi === "D") {
										aDOIFields[9].maintenance = true;
										aDOIFields[9].instLoc = false;
										aDOIFields[9].SupFlVal = "";
										aDOIFields[9].currentVal = h.Ingrp;
										aDOIFields[9].targetVal = h.Ingrp;
									} else {
										aDOIFields[9].maintenance = false;
										aDOIFields[9].instLoc = true;
										aDOIFields[9].SupFlVal = h.Ingrp;
										aDOIFields[9].currentVal = "";
										aDOIFields[9].targetVal = h.Ingrp;
									}

									if (h.Lgwidi === "") {
										aDOIFields[10].maintenance = false;
										aDOIFields[10].instLoc = false;
										aDOIFields[10].SupFlVal = "";
										aDOIFields[10].currentVal = "";
										aDOIFields[10].targetVal = "";
									} else if (h.Lgwidi === "D") {
										aDOIFields[10].maintenance = true;
										aDOIFields[10].instLoc = false;
										aDOIFields[10].SupFlVal = "";
										aDOIFields[10].currentVal = h.Gewrkfloc;
										aDOIFields[10].targetVal = h.Gewrkfloc;
									} else {
										aDOIFields[10].maintenance = false;
										aDOIFields[10].instLoc = true;
										aDOIFields[10].SupFlVal = h.Gewrkfloc;
										aDOIFields[10].currentVal = "";
										aDOIFields[10].targetVal = h.Gewrkfloc;
									}

									if (h.Adrnri === "") {
										aDOIFields[12].maintenance = false;
										aDOIFields[12].instLoc = false;
										aDOIFields[12].SupFlVal = "";
										aDOIFields[12].currentVal = "";
										aDOIFields[12].targetVal = "";
									} else if (h.Adrnri === "D") {
										aDOIFields[12].maintenance = true;
										aDOIFields[12].instLoc = false;
										aDOIFields[12].SupFlVal = "";
										aDOIFields[12].currentVal = h.Adrnr;
										aDOIFields[12].targetVal = h.Adrnr;
									} else {
										aDOIFields[12].maintenance = false;
										aDOIFields[12].instLoc = true;
										aDOIFields[12].SupFlVal = h.Adrnr;
										aDOIFields[12].currentVal = "";
										aDOIFields[12].targetVal = h.Adrnr;
									}
								}
							}
						}
					}
				}
			};
			var fnError = function () {
				g.BusyDialog.close();
			};
			g.BusyDialog.open();
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters, urlParameters);
		},

		/*
		 * Function to read Equipment data
		 * @public
		 * @param {string} sEqunr
		 * @param {string} sCrStatus
		 */
		readEquipmentData: function (sEqunr, sCrStatus) {
			var g = this;
			// var oMainModel = g.getView().getModel("mainView");
			// var oMainData = oMainModel.getData();
			// oMainData.viewBusy = true;
			// oMainModel.setData(oMainData);

			var sModelName = "AIWEQUI";
			var sPath = "/ChangeRequestSet";
			var oExpand = ["EqClass", "EqAddr", "EqAddrI", "EqEmail", "EqFax", "EqMltxt", "EqPermt", "Equipment", "EqLAM", "EqPRT",
				"EqPRTNR", "EqStock", "EqTel", "EqUrl", "EqVal", "Equi_DOI", "AINHeaderinfo", "AINAttachments", "AINCharacteristics",
				"AINAnnounce", "EqDFPS", "EqLAMCH"
			];
			var urlParameters = {
				"$expand": oExpand
			};

			var oModel = g.getView().getModel();
			var oFilters = [new sap.ui.model.Filter("Equnr", "EQ", sEqunr), new sap.ui.model.Filter("HequEeqz", "EQ", ""), new sap.ui.model.Filter(
				"Werks", "EQ", "")];
			var fnSuccess = function (data) {
				g.BusyDialog.close();
				var results = data.results[0];

				if (results === undefined) {
					// oMainData.viewBusy = false;
					// oMainModel.setData(oMainData);
					return;
				}
				var sObject = {
					Equnr: sEqunr,
					intlAddr: [], // International Address
					Partners: [], // Partners
					Permits: [], // Permit
					PRTInfo: {},
					Stock: {},
					dfps: {},
					classItems: [], // Class Details
					characteristics: [], // Characteristics Details
					charNewButton: false,
					linearChar: [],
					linearCharAddEnable: false,

					attachmentCount: "0", // Attachment Count
					Guids: "", // Attachment

					EqunrEnabled: true,
					EquipCatEnabled: true,
					MaintplantEnabled: true,
					BukrsEnabled: true,

					EqunrVS: "None",
					EqunrVST: "",
					EqktxVS: "None",
					EqktxVST: "",
					EquipmentCatogoryVS: "None",
					EquipmentCatogoryVST: "",
					MaintplantVS: "None",
					MaintplantVST: "",
					TplnrVS: "None",
					TplnrVST: "",
					SuperordinateEquipVS: "None",
					SuperordinateEquipVST: "",
					StsmEquiVS: "None",
					StsmEquiVST: "",
					UstwEquiVS: "None",
					UstwEquiVST: "",
					UswoEquiVS: "None",
					UswoEquiVST: "",
					TechnicalObjectTypVS: "None",
					TechnicalObjectTypVST: "",
					LocationVS: "None",
					LocationVSTL: "",
					AbckzVS: "None",
					AbckzVST: "",
					ArbplVS: "None",
					ArbplVST: "",
					BukrsVS: "None",
					BukrsVST: "",
					KostlVS: "None",
					KostlVST: "",
					WerksVS: "None",
					WerksVST: "",
					IngrpVS: "None",
					IngrpVST: "",
					ConstrTypeVS: "None",
					ConstrTypeVST: "",
					RefPostaVS: "None",
					RefPostaVST: "",
					MainArbplVS: "None",
					MainArbplVST: "",
					LangucodeVS: "None",
					LangucodeVST: "",
					TimeZoneVS: "None",
					TimeZoneVST: "",
					PlanvPrtVS: "None",
					PlanvPrtVST: "",
					SteufPrtVS: "None",
					SteufPrtVST: "",
					KtschPrtVS: "None",
					KtschPrtVST: "",
					EwformprtVS: "None",
					EwformprtVST: "",
					ConstrTypeMaxL: 0,
					charValueMaxL: 0,
				};

				if (results.Equipment) {
					var sEquipment = results.Equipment.results[0];
					if (sEquipment) {
						sObject.Eqktx = sEquipment.Txtmi;
						// sObject.Eqktx = sEquipment.Eqktx;
						sObject.EquipmentCatogory = sEquipment.Eqtyp;
						sObject.EquipCatgDescription = sEquipment.Etytx;
						sObject.Maintplant = sEquipment.Swerk;
						sObject.MaintplantDesc = sEquipment.Name1;

						sObject.SuperordinateEquip = sEquipment.HequEeqz; // Superord. Equipment
						sObject.SuperordinateEquipDesc = sEquipment.SuperordEqDes; // Superord. Equipment Description
						sObject.Bukrs = sEquipment.BukrEilo;
						sObject.Butxt = sEquipment.Butxt;
						sObject.Location = sEquipment.StorEilo; // Location
						sObject.Locationdesc = sEquipment.Locationdesc; // Location Description
						sObject.Abckz = sEquipment.AbckEilo;
						sObject.Abctx = sEquipment.Abctx;
						sObject.Kostl = sEquipment.KostEilo; // Cost Center
						sObject.Kokrs = sEquipment.KokrEilo; // ccPart1
						sObject.Mctxt = sEquipment.Contareaname; // Name
						sObject.Answt = sEquipment.Answt;
						sObject.Ansdt = formatter.getDateFormat(sEquipment.Ansdt);
						sObject.Waers = sEquipment.Waers; // Currency
						sObject.Werks = sEquipment.PplaEeqz; // Planning Plant
						sObject.Planningplantdes = sEquipment.Planningplantdes; // Planning Plant Description
						sObject.Ingrp = sEquipment.IngrEeqz; // Planner Group
						sObject.Innam = sEquipment.Plannergrpdesc; // Planner Group Description
						sObject.Arbpl = sEquipment.ArbpEilo; // Work Center
						sObject.Ktext = sEquipment.Workcenterdesc; // Work Center Description
						sObject.WcWerks = sEquipment.WorkCenterPlant; // Work center Plant
						sObject.MainArbpl = sEquipment.ArbpEeqz; // Main Work Center
						sObject.MainKtext = sEquipment.MainWcDesc; // Plant Work Center
						sObject.MainWerks = sEquipment.MainWcPlant; // Name
						sObject.BeberFl = sEquipment.BebeEilo; // Plant Section
						sObject.Fing = sEquipment.Fing; // Plant Section
						sObject.Tele = sEquipment.Tele; // Plant Section
						sObject.Herst = sEquipment.Herst; // Manufacturer
						sObject.TechnicalObjectTyp = sEquipment.Eqart; // TechnicalObjectTyp
						sObject.Description = sEquipment.Eartx; // TechnicalObjectTyp Description
						sObject.Typbz = sEquipment.Typbz; // Model Number
						sObject.ConstrType = sEquipment.SubmEeqz; // Construction Type
						sObject.ConstructionDesc = sEquipment.Constdesc; // Construction Description
						sObject.TechIdNum = sEquipment.TidnEeqz; // techIndNo
						sObject.Serge = sEquipment.Serge; // manfSerNo
						sObject.MapaEeqz = sEquipment.MapaEeqz; // partNum
						sObject.EquipPosition = sEquipment.HeqnEeqz; // Position
						sObject.Stattext = sEquipment.Stattext; // System Status
						sObject.StsmEqui = sEquipment.StsmEqui; // Status Profile
						sObject.StsmEquiDesc = sEquipment.Statproftxt; // Status Profile Description
						sObject.UstwEqui = sEquipment.UstwEqui; // Status with Status Number
						sObject.UswoEqui = sEquipment.UswoEqui; // Status without Status Number
						sObject.UstaEqui = sEquipment.UstaEqui; // User Status
						sObject.Deact = sEquipment.Deact; //Inactive Status
						sObject.DeactEnable = sCrStatus === "true" ? false : true; //Inactive Status Enable
						sObject.Fhmkz = sEquipment.Fhmkz; // PRT fields visible
						sObject.Funcid = sEquipment.Funcid; // Config control data
						sObject.Frcfit = sEquipment.Frcfit;
						sObject.Frcrmv = sEquipment.Frcrmv;
						sObject.Adrnr = sEquipment.Adrnr;

						sObject.AcsnodeIppe = "";
						sObject.DescIppe = "";
						sObject.VariantIppe = "";
						sObject.AltIppe = "";
						sObject.Ppeguid = sEquipment.Ppeguid;

						if (sEquipment.Swerk !== "") {
							sObject.BukrsEnabled = false;
						} else {
							sObject.BukrsEnabled = true;
						}

						if (sEquipment.Eqtyp !== "P") {
							sObject.Tplnr = sEquipment.TplnEilo; // Functional Location
							sObject.Pltxt = sEquipment.Flocdescription; // Functional Location Description
							sObject.TplnrEnabled = true;
						} else {
							sObject.Tplnr = "";
							sObject.Pltxt = "";
							sObject.TplnrEnabled = false;
						}
						if (sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) {
							sObject.TplnrEnabled = false;
							sObject.SuperordinateEquipEnabled = true;
						}
						if (sObject.SuperordinateEquip === "" && sObject.Tplnr !== "" && sObject.Tplnr !== undefined) {
							sObject.TplnrEnabled = true;
							sObject.SuperordinateEquipEnabled = false;
						}
						if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) || (sObject.Tplnr !== "" && sObject.Tplnr !==
								undefined)) {
							sObject.MaintplantEnabled = false;
						} else {
							sObject.MaintplantEnabled = true;
						}

						// var oMainViewModel = g.getView().getModel("mainView");
						// var oMainViewData = oMainViewModel.getData();
						// if (sObject.UstaEqui) {
						// 	oMainViewData.visible = true;
						// } else {
						// 	oMainViewData.visible = false;
						// }
						// oMainViewModel.setData(oMainViewData);
					}
				}
				if (results.EqPRT) {
					var sPRT = results.EqPRT.results[0];
					if (sPRT) {
						sObject.PlanvPrt = sPRT.PlanvPrt;
						sObject.SteufPrt = sPRT.SteufPrt;
						sObject.KtschPrt = sPRT.KtschPrt;
						sObject.Ewformprt = sPRT.Ewformprt;
						sObject.SteufRef = sPRT.SteufRef;
						sObject.KtschRef = sPRT.KtschRef;
						sObject.EwformRef = sPRT.EwformRef;
					} else {
						sObject.PlanvPrt = "";
						sObject.SteufPrt = "";
						sObject.KtschPrt = "";
						sObject.Ewformprt = "";
						sObject.SteufRef = false;
						sObject.KtschRef = false;
						sObject.EwformRef = false;
					}
				}

				// if (sEquipment.Eqtyp === "L") {
				if (results.EqLAM.results.length > 0) {
					var sLAM = results.EqLAM.results[0];
					sObject.lam = {
						Equi: sEqunr,
						Lrpid: sLAM.Lrpid,
						LrpidDesc: sLAM.LrpDescr,
						Strtptatr: sLAM.Strtptatr,
						Endptatr: sLAM.Endptatr,
						Length: sLAM.Length, //parseInt(sLAM.Length !== "" ? sLAM.Length : "0"),
						LinUnit: sLAM.LinUnit,
						LinUnitDesc: sLAM.Uomtext,
						Startmrkr: sLAM.Startmrkr,
						Endmrkr: sLAM.Endmrkr,
						Mrkdisst: sLAM.Mrkdisst,
						Mrkdisend: sLAM.Mrkdisend,
						MrkrUnit: sLAM.MrkrUnit,
						enableLrp: true,
						enableMarker: true,
						LrpidVS: "None",
						StrtptatrVS: "None",
						EndptatrVS: "None",
						LinUnitVS: "None",
						StartmrkrVS: "None",
						EndmrkrVS: "None",
						MrkdisstVS: "None",
						MrkdisendVS: "None",
						MrkrUnitVS: "None",
						LamDer: "N"
					};
				} else {
					sObject.lam = {
						Lrpid: "",
						LrpidDesc: "",
						Strtptatr: "",
						Endptatr: "",
						Length: "",
						LinUnit: "",
						LinUnitDesc: "",
						Startmrkr: "",
						Endmrkr: "",
						Mrkdisst: "",
						Mrkdisend: "",
						MrkrUnit: "",
						enableLrp: true,
						enableMarker: false,
						LrpidVS: "None",
						StrtptatrVS: "None",
						EndptatrVS: "None",
						LinUnitVS: "None",
						StartmrkrVS: "None",
						EndmrkrVS: "None",
						MrkdisstVS: "None",
						MrkdisendVS: "None",
						MrkrUnitVS: "None"
					};
				}
				// }

				if (results.EqAddr) {
					var sAddress = results.EqAddr.results[0];
					if (sAddress) {
						sObject.IsEditable = sAddress.IsEditable;
						sObject.Title = sAddress.Titletxt; // searchTerm1
						sObject.TitleCode = sAddress.Title; // searchTerm1
						sObject.Name1 = sAddress.Name1; // searchTerm1
						sObject.Name2 = sAddress.Name2; // searchTerm1
						sObject.Name3 = sAddress.Name3; // searchTerm1
						sObject.Name4 = sAddress.Name4; // searchTerm1
						sObject.Sort1 = sAddress.Sort1; // searchTerm1
						sObject.Sort2 = sAddress.Sort2; // searchTerm2
						sObject.NameCo = sAddress.NameCo; // Company 
						sObject.PostCod1 = sAddress.PostCod1;
						sObject.City1 = sAddress.City1; // City
						sObject.Building = sAddress.Building;
						sObject.Floor = sAddress.Floor;
						sObject.Roomnum = sAddress.Roomnum;
						sObject.AddrLocation = sAddress.Location;
						sObject.Strsuppl1 = sAddress.Strsuppl1;
						sObject.Strsuppl2 = sAddress.Strsuppl2;
						sObject.Strsuppl3 = sAddress.Strsuppl3;
						sObject.RefPosta = sAddress.RefPosta;
						sObject.Landx = sAddress.Landx;
						sObject.TimeZone = sAddress.TimeZone;
						sObject.Region = sAddress.RfePost;
						sObject.RegionDesc = sAddress.Regiotxt;
						// sObject.Langucode = sAddress.Langucode;
						// sObject.LanguP = sAddress.LanguP;
					} else {
						sObject.Title = sObject.Title ? sObject.Title : "";
						sObject.TitleCode = sObject.TitleCode ? sObject.TitleCode : "";
						sObject.Name1 = sObject.Name1 ? sObject.Name1 : "";
						sObject.Name2 = sObject.Name2 ? sObject.Name2 : "";
						sObject.Name3 = sObject.Name3 ? sObject.Name3 : "";
						sObject.Name4 = sObject.Name4 ? sObject.Name4 : "";
						sObject.Sort1 = sObject.Sort1 ? sObject.Sort1 : "";
						sObject.Sort2 = sObject.Sort2 ? sObject.Sort2 : "";
						sObject.NameCo = sObject.NameCo ? sObject.NameCo : "";
						sObject.PostCod1 = sObject.PostCod1 ? sObject.PostCod1 : "";
						sObject.City1 = sObject.City1 ? sObject.City1 : "";
						sObject.Building = sObject.Building ? sObject.Building : "";
						sObject.Floor = sObject.Floor ? sObject.Floor : "";
						sObject.Roomnum = sObject.Roomnum ? sObject.Roomnum : "";
						sObject.Strsuppl1 = sObject.Strsuppl1 ? sObject.Strsuppl1 : "";
						sObject.Strsuppl2 = sObject.Strsuppl2 ? sObject.Strsuppl2 : "";
						sObject.Strsuppl3 = sObject.Strsuppl3 ? sObject.Strsuppl3 : "";
						sObject.AddrLocation = sObject.AddrLocation ? sObject.AddrLocation : "";
						sObject.RefPosta = sObject.RefPosta ? sObject.RefPosta : "";
						sObject.Landx = sObject.Landx ? sObject.Landx : "";
						sObject.TimeZone = sObject.TimeZone ? sObject.TimeZone : "";
						sObject.Region = sObject.Region ? sObject.Region : "";
						sObject.RegionDesc = sObject.RegionDesc ? sObject.RegionDesc : "";
					}
				}

				var aIntlAddr = results.EqAddrI.results;
				if (aIntlAddr.length > 0) {
					for (var z = 0; z < aIntlAddr.length; z++) {
						aIntlAddr[z].AdNationEnable = false;
						aIntlAddr[z].City1iVS = "None";
						aIntlAddr[z].StreetiVS = "None";
						sObject.intlAddr.push(aIntlAddr[z]);
					}
				}

				var ainResults = results.AINHeaderinfo.results;
				if (ainResults.length > 0) {
					for (var ai = 0; ai < ainResults.length; ai++) {
						var ainData = ainResults[0];
						// g.isAin = true;
						var oAin = {};
						oAin.Name = ainData.Name;
						oAin.Modelid = ainData.Modelid;
						oAin.Description = ainData.Description;
						oAin.Manufacturer = ainData.Manufacturer;
						oAin.Modeltemplate = ainData.Modeltemplate;
						oAin.Globalid = ainData.Globalid;
						oAin.moreInfo = true;
						oAin.linkVisible = false;
						oAin.deLinkVisible = true;
						oAin.equiCreate = data.results[0].AineqInd;
						oAin.AinEqunr = data.results[0].AinEqunr;

						// if (sCrStatus === "true") {
						// 	oAin.moreInfo = false;
						// 	oAin.linkVisible = false;
						// 	oAin.deLinkVisible = false;
						// }

						// var aModel = new sap.ui.model.json.JSONModel();
						// aModel.setData(ainData);
						// g.getView().setModel(aModel, "ain");
						// sap.ui.getCore().setModel(aModel, "ain");
					}
				}

				if (results.EqDFPS && results.EqDFPS.results.length > 0) {
					var oDfps = results.EqDFPS.results[0];
					sObject.dfps = {
						Equnr: sEquipment.Equi,
						Tailno: oDfps.DeviceId,
						Area: oDfps.Topsiteid,
						AreaDesc: oDfps.Topsitede,
						AreaPrfl: oDfps.AreaPro,
						AreaPro: oDfps.AreaPrfl,
						Site: oDfps.SiteId,
						SiteDesc: oDfps.SiteDesc,
						SitePrfl: oDfps.SitePro,
						SitePro: oDfps.SitePrfl,
						MPO: oDfps.MpoId,
						MPODesc: oDfps.MpoDescr,
						RIC: oDfps.RicId,
						RICDesc: oDfps.RicDescr,
						ModelId: oDfps.ModelId,
						ModelIdDesc: oDfps.ModelDes,
						ForeignEq: formatter.XtoTrue(oDfps.Foreignob),
						TechSts: oDfps.TecState,
						OperSts: oDfps.DepState,
						Remark: oDfps.DfpsRmrk,
						dfpsCrtEnabled: false,
						dfpsDltEnabled: true,
						dfpsEnabled: true,
						TailnoReq: true,
						Foreignob: oDfps.Foreignob,
					};
				} else {
					sObject.dfps = {
						Equnr: sEquipment.Equi,
						Tailno: "",
						Area: "",
						AreaDesc: "",
						AreaPrfl: "",
						AreaPro: "",
						Site: "",
						SiteDesc: "",
						SitePrfl: "",
						SitePro: "",
						MPO: "",
						MPODesc: "",
						RIC: "",
						RICDesc: "",
						ModelId: "",
						ModelIdDesc: "",
						ForeignEq: false,
						TechSts: "",
						OperSts: "",
						Remark: "",
						dfpsCrtEnabled: true,
						dfpsDltEnabled: false,
						dfpsEnabled: false,
						TailnoReq: false,
						SitePro: "",
						Foreignob: false,
						AreaPro: ""
					};
				}

				if (results.EqClass) {
					// var sClassList = results.EqClass.results;
					var sClassList = $.map(results.EqClass.results, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (sClassList) {
						if (sClassList.length > 0) {
							for (var i = 0; i < sClassList.length; i++) {
								sClassList[i].ctEnable = false;
								sClassList[i].classEnable = false;
								sClassList[i].ClassTypeDesc = sClassList[i].Artxt;
								delete sClassList[i].Artxt;
								sClassList[i].ClassDesc = sClassList[i].Kltxt;
								delete sClassList[i].Kltxt;
								delete sClassList[i].Changerequestid;
								delete sClassList[i].Clint;
								delete sClassList[i].Service;
								sClassList[i].classDelEnable = true;
								sObject.classItems.push(sClassList[i]);
							}
							if (sCrStatus === "true") {
								for (var i = 0; i < Object.classItems.length; i++) {
									Object.classItems[i].classDelEnable = false;
								}
							}
							sObject.charNewButton = true;
							if (g.class) {
								// var itemFragmentId = g.getView().createId("charFrag");
								// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
								// newCharBtn.setEnabled(true);
								g.class.setModel(new JSONModel(sObject.classItems));
							}
						}
					}
				}

				if (results.EqVal) {
					// var sCharList = results.EqVal.results;
					var sCharList = $.map(results.EqVal.results, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (sCharList) {
						if (sCharList.length > 0) {
							for (var j = 0; j < sCharList.length; j++) {
								sCharList[j].cNameEnable = false;
								sCharList[j].Textbz = sCharList[j].Atwtb;
								delete sCharList[j].Ataut;
								delete sCharList[j].Ataw1;
								delete sCharList[j].Atawe;
								delete sCharList[j].Atcod;
								delete sCharList[j].Atflb;
								delete sCharList[j].Atflv;
								delete sCharList[j].Atimb;
								delete sCharList[j].Atsrt;
								delete sCharList[j].Atvglart;
								delete sCharList[j].Atzis;
								delete sCharList[j].Changerequestid;
								delete sCharList[j].CharName;
								delete sCharList[j].Charid;
								delete sCharList[j].Classtype;
								delete sCharList[j].Service;
								delete sCharList[j].Valcnt;
								sCharList[j].slNo = j + 1; // ()
								sCharList[j].flag = sCharList[j].Class + "-" + sCharList[j].slNo; // ()
								sObject.characteristics.push(sCharList[j]);
							}
							if (sCrStatus === "true") {
								for (var i = 0; i < sObject.characteristics.length; i++) {
									sObject.characteristics[i].charAddEnable = false;
									sObject.characteristics[i].charClrEnable = false;
									sObject.characteristics[i].charDltEnable = false;
								}
							} else {
								for (var z = 0; z < sObject.characteristics.length; z++) {
									var count = 1;
									for (var y = 0; y < sObject.characteristics.length; y++) {
										if (z === y) {
											continue;
										}
										if (sObject.characteristics[y].Atnam === sObject.characteristics[z].Atnam && sObject.characteristics[y].Class ===
											sObject.characteristics[z].Class) {
											count++;
										}
									}
									if (count > 1) {
										sObject.characteristics[z].charDltEnable = true;
									} else {
										sObject.characteristics[z].charDltEnable = false;
									}

									if (sObject.characteristics[z].Atein === true) {
										sObject.characteristics[z].charAddEnable = false;
									}
								}
							}
							if (g.char) {
								g.char.setModel(new JSONModel(sObject.characteristics));
							}
						}
					}
				}

				if (results.EqLAMCH) {
					var alinearChar = $.map(results.EqLAMCH.results, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (alinearChar) {
						if (alinearChar.length > 0) {
							for (var j = 0; j < alinearChar.length; j++) {
								// sCharList[j].slNo = j + 1; // ()
								// sCharList[j].flag = sCharList[j].Class + "-" + sCharList[j].slNo; // ()
								alinearChar[j].linCharEnable = true;
								delete alinearChar[j].__metadata;
								sObject.linearChar.push(alinearChar[j]);
							}
							if (sCrStatus === "true") {
								for (var i = 0; i < sObject.linearChar.length; i++) {
									sObject.linearChar[i].linCharEnable = false;
								}
							}
							if (g.linearChar) {
								g.linearChar.setModel(new JSONModel(sObject.linearChar));
							}
						}
					}
				}

				if (results.EqPRTNR) {
					var sPartnerObj = {};
					var sPartnerData = results.EqPRTNR.results;
					if (sPartnerData) {
						if (sPartnerData.length > 0) {
							for (var k = 0; k < sPartnerData.length; k++) {
								sPartnerObj.Partnrfun = sPartnerData[k].Partnrfun;
								sPartnerObj.Partnereq = sPartnerData[k].Partnereq;
								sPartnerObj.NameList = sPartnerData[k].NameList;
								sPartnerObj.AddInd = sPartnerData[k].AddInd;
								sPartnerObj.Address = sPartnerData[k].Address;
								sPartnerObj.Partnrfuntxt = sPartnerData[k].Partnrfuntxt;
								sObject.Partners.push(sPartnerObj);
							}
						}
					}
				}

				if (results.EqPermt) {
					var sPermitObj = {};
					var sPermitData = results.EqPermt.results;
					if (sPermitData) {
						if (sPermitData.length > 0) {
							for (var l = 0; l < sPermitData.length; l++) {
								sPermitObj.Countereq = sPermitData[l].Countereq;
								sPermitObj.Pmsog = sPermitData[l].Pmsog;
								sPermitObj.KAa = sPermitData[l].KAa;
								sPermitObj.KDruck = sPermitData[l].KDruck;
								sPermitObj.KPro = sPermitData[l].KPro;
								sObject.Permits.push(sPermitObj);
							}
							sObject.PmtLtext = sPermitData[0].PmtLtext;
						}
					}
				}

				if (results.EqPRT) {
					if (results.EqPRT.results) {
						var sPrtData = results.EqPRT.results[0];
						if (sPrtData) {
							sObject.PRTInfo.PlanvPrt = sPrtData.PlanvPrt;
							sObject.PRTInfo.Fgru1 = sPrtData.Fgru1;
							sObject.PRTInfo.Fgru2 = sPrtData.Fgru2;

							sObject.PRTInfo.Kzkbl = sPrtData.Kzkbl;
							sObject.PRTInfo.SteufPrt = sPrtData.SteufPrt;
							sObject.PRTInfo.SteufRef = sPrtData.SteufRef;
							sObject.PRTInfo.KtschPrt = sPrtData.KtschPrt;
							sObject.PRTInfo.Ktschref = sPrtData.Ktschref;
							sObject.PRTInfo.Ewformprt = sPrtData.Ewformprt;
							sObject.PRTInfo.Ewformref = sPrtData.Ewformref;
							sObject.PRTInfo.Bzoffbprt = sPrtData.Bzoffbprt;
							sObject.PRTInfo.Bzoffbref = sPrtData.Bzoffbref;
							sObject.PRTInfo.Offstb = sPrtData.Offstb;
							sObject.PRTInfo.Ehoffbprt = sPrtData.Ehoffbprt;
							sObject.PRTInfo.Offstbref = sPrtData.Offstbref;
							sObject.PRTInfo.Bzoffeprt = sPrtData.Bzoffeprt;
							sObject.PRTInfo.Offsteref = sPrtData.Offsteref;
							sObject.PRTInfo.Offste = sPrtData.Offste;
							sObject.PRTInfo.Ehoffeprt = sPrtData.Ehoffeprt;
							sObject.PRTInfo.Offsteref = sPrtData.Offsteref;

							sObject.PRTInfo.Warpl = sPrtData.Warpl;
							sObject.PRTInfo.PointEq = sPrtData.PointEq;
						}
					}
				}

				if (results.EqStock) {
					if (results.EqStock.results) {
						var sStock = results.EqStock.results[0];
						if (sStock) {
							sObject.Stock.Equilbbsa = sStock.Equilbbsa;
							sObject.Stock.BWerk = sStock.BWerk;
							sObject.Stock.Sloc2equi = sStock.Sloc2equi;
							sObject.Stock.Chrg2stk = sStock.Chrg2stk;
							sObject.Stock.Sobk2stk = sStock.Sobk2stk;
							sObject.Stock.Kunnr = sStock.Kunnr;
							sObject.Stock.Kdauf = sStock.Kdauf;
							sObject.Stock.PsPspPn = sStock.PsPspPn;
							sObject.Stock.LifnrStc = sStock.LifnrStc;
						}
					}
				}

				if (g.CopyTempArray && g.CopyTempArray.length > 0) {
					sObject.Equnr = g.CopyTempArray[0];
					sObject.viewParameter = "create";
					sObject.EqunrEnabled = true;
					sObject.EquipCatEnabled = true;
					sObject.MaintplantEnabled = true;
					sObject.BukrsEnabled = true;
					// sObject.UswoEqui = g.userWithoutSts;
					// sObject.SuperordinateEquip = "";
					// sObject.SuperordinateEquipDesc = "";

					var oAddressModel = sap.ui.getCore().getModel("equiAddressView");
					var oAddressData = oAddressModel.getData();
					var mCountFlag = true;
					var sObj;
					if (oAddressData.length > 0) {
						for (var sa = 0; sa < oAddressData.length; sa++) {
							if (sObject.Equnr === oAddressData[sa].Equnr) {
								mCountFlag = false;
								break;
							}
						}
					}
					if (mCountFlag) {
						sObj = {
							Equnr: sObject.Equnr,
							IsEditable: sObject.IsEditable
						};
						oAddressData.push(sObj);
						oAddressModel.setData(oAddressData);
					}
					if (sObject.EquipmentCatogory === "" || sObject.EquipmentCatogory === undefined) {
						sObject.EquipCatEnabled = true;
					} else {
						sObject.EquipCatEnabled = true;
					}
					if (sObject.Maintplant === "" || sObject.Maintplant === undefined) {
						sObject.MaintplantEnabled = true;
					} else {
						sObject.MaintplantEnabled = true; //false;
					}
					if (sObject.Bukrs === "" || sObject.Bukrs === undefined) {
						sObject.BukrsEnabled = true;
					} else {
						sObject.BukrsEnabled = false;
					}
					// if (sObject.Tplnr === "" || sObject.Tplnr === undefined) {
					// 	sObject.TplnrEnabled = true;
					// } else {
					// 	sObject.TplnrEnabled = false;
					// }
					g.CopyTempArray.shift();

					var sJsonModel, sArray;
					sJsonModel = g.getView().getModel(sModelName);
					sArray = sJsonModel.getData();
					sArray.push(sObject);

					if (g.CopyTempArray.length <= 0) {
						var sArray = $.map(sArray, function (obj) {
							return $.extend(true, {}, obj);
						});
						if (sArray.length > 0) {
							sArray.forEach(function (obj) {
								if (obj.intlAddr.length > 0) {
									obj.intlAddr.forEach(function (item) {
										item.Equi = obj.Equnr;
									});
								}
							});
						}
					}

					sJsonModel.setData(sArray);
					sap.ui.getCore().setModel(new JSONModel(sJsonModel.getData()), sModelName);
					g.onUpdateTitleCount(sModelName, sArray);

					if (sObject.SuperordinateEquip !== "") {
						g.DOIonReadEQ(sObject.Equnr, sObject.SuperordinateEquip, "copy");
					} else {
						g.modifyEQDoiForCopyChange(sEquipment, "CPY");
						// sap.ui.getCore().getModel("dataOriginMOP").getData().EQ.push({
						// 	key: sObject.Equnr,
						// 	DOI: g.DOIarrayEQ
						// });
					}

					if (oAin) {
						sap.ui.getCore().getModel("ainMOP").getData().push({
							key: sObject.Equnr,
							AIN: oAin
						});
					}

					// oMainData.viewBusy = false;
					// oMainModel.setData(oMainData);
					return;
				}

				if (sObject.EquipmentCatogory === "" || sObject.EquipmentCatogory === undefined) {
					sObject.EquipCatEnabled = true;
				} else {
					sObject.EquipCatEnabled = false;
				}
				if (sObject.Maintplant === "" || sObject.Maintplant === undefined) {
					sObject.MaintplantEnabled = true;
				} else {
					sObject.MaintplantEnabled = false;
				}
				if (sObject.Bukrs === "" || sObject.Bukrs === undefined) {
					sObject.BukrsEnabled = true;
				} else {
					sObject.BukrsEnabled = false;
				}
				// if (sObject.Tplnr === "" || sObject.Tplnr === undefined) {
				// 	sObject.TplnrEnabled = true;
				// } else {
				// 	sObject.TplnrEnabled = false;
				// }
				sObject.EqunrEnabled = false;

				var sAddressViewEnabled;
				if (sCrStatus === "true") {
					sAddressViewEnabled = false;
					sObject.EqunrEnabled = false;
					sObject.EquipCatEnabled = false;
					sObject.MaintplantEnabled = false;
					sObject.BukrsEnabled = false;
					sObject.TplnrEnabled = false;
				} else {
					sAddressViewEnabled = sObject.IsEditable;
				}

				if (g.detailFlag === true) {
					var PRTVisibleEnableModel = sap.ui.getCore().getModel("PRTVisibleEnableModel");
					var PRTVisibleEnableData = PRTVisibleEnableModel.getData();
					if (sObject.Fhmkz && sCrStatus === "true") {
						PRTVisibleEnableData.PRTVisible = true;
						PRTVisibleEnableData.PRTEnable = false;
					} else if (sObject.Fhmkz && sCrStatus === "false") {
						PRTVisibleEnableData.PRTVisible = true;
						PRTVisibleEnableData.PRTEnable = true;
					} else {
						PRTVisibleEnableData.PRTVisible = false;
						PRTVisibleEnableData.PRTEnable = false;
					}
					PRTVisibleEnableModel.setData(PRTVisibleEnableData);
					g.getView().setModel(PRTVisibleEnableModel, "PRTVisibleEnableModel");

					if (sObject.EquipmentCatogory === "L" && g.lamSwitch === "X") {
						g.lam.setVisible(true);
						g.linearChar.setVisible(true);
						if (sCrStatus === "true") {
							sObject.lam.enableLrp = false;
							sObject.lam.enableMarker = false;
						}
						g.lam.setModel(new JSONModel(sObject), "AIWLAM");
					} else {
						g.lam.setVisible(false);
						g.linearChar.setVisible(false);
					}

					g.handleMainTableRow(sObject, sModelName);

					if (sObject.SuperordinateEquip !== "") {
						g.DOIonReadEQ(sObject.Equnr, sObject.SuperordinateEquip, "change");
					} else {
						// g.getView().getModel("dataOrigin").setData(g.DOIarrayEQ);
						g.modifyEQDoiForCopyChange(sEquipment, "CHREAD");
						g.superiorEquipment = "";
						g.superiorEqDesc = "";
						g.functionalLocation = "";
						g.functionalLocDesc = "";
					}

					if (oAin) {
						g.getView().getModel("ain").setData(oAin);
						sap.ui.getCore().getModel("ain").setData(oAin);
					}

					if (sObject.Maintplant !== "" && sObject.MaintplantVS !== "Error") {
						this.SOPMaintPlant = sObject.Maintplant;
					} else {
						this.SOPMaintPlant = "";
					}

					if (sObject.Ppeguid !== null && sObject.Ppeguid !== "") {
						g.getIPPEConfig(sObject.Ppeguid);
					}
				} else {
					sAddressViewEnabled = sObject.IsEditable;
					sObject.viewParameter = "change";
					g.handleSearchImportPress(sObject, sModelName);
					if (sObject.SuperordinateEquip !== "") {
						g.DOIonReadEQ(sObject.Equnr, sObject.SuperordinateEquip, "change", results);
					} else {
						g.modifyEQDoiForCopyChange(sEquipment, "CHIMPT");
						// sap.ui.getCore().getModel("dataOriginMOP").getData().EQ.push({
						// 	key: sEqunr,
						// 	DOI: g.DOIarrayEQ
						// });
					}

					if (oAin) {
						sap.ui.getCore().getModel("ainMOP").getData().push({
							key: sObject.Equnr,
							AIN: oAin
						});
					}

					var oAddressModel = sap.ui.getCore().getModel("equiAddressView");
					var oAddressData = oAddressModel.getData();
					var mCountFlag = true;
					var sObj;
					if (oAddressData.length > 0) {
						for (var sa = 0; sa < oAddressData.length; sa++) {
							if (sObject.Equnr === oAddressData[sa].Equnr) {
								mCountFlag = false;
								break;
							}
						}
					}
					if (mCountFlag) {
						sObj = {
							Equnr: sObject.Equnr,
							IsEditable: sObject.IsEditable
						};
						oAddressData.push(sObj);
						oAddressModel.setData(oAddressData);
					}
				}

				g.readSystem(g);
				// oMainData.viewBusy = false;
				// oMainModel.setData(oMainData);

				if (g.getView().getModel("equiAddressView")) {
					var oAddressViewModel = g.getView().getModel("equiAddressView");
					var oAddressViewData = oAddressViewModel.getData();
					oAddressViewData.enabled = sAddressViewEnabled;
					oAddressViewModel.setData(oAddressViewData);
				}
			};
			var fnError = function () {
				g.BusyDialog.close();
				// oMainData.viewBusy = false;
				// oMainModel.setData(oMainData);
			};
			g.BusyDialog.open();
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters, urlParameters);
		},

		/*
		 * Function to read DOI fields list of Equipment
		 * @public
		 * @param {string} sEqunr
		 * @param {string} superEqui
		 * @param {string} sMode
		 */
		DOIonReadEQ: function (sEqunr, superEqui, sMode, readResults) {
			var g = this;
			var sModelName = "AIWEQUI";
			var sPath = "/ChangeRequestSet";
			var oExpand = ["Equipment", "Equi_DOI"];

			var urlParameters = {
				"$expand": oExpand
			};

			var oModel = g.getView().getModel();
			var oFilters = [new sap.ui.model.Filter("Equnr", "EQ", ""), new sap.ui.model.Filter("HequEeqz", "EQ", superEqui), new sap.ui.model
				.Filter("Werks", "EQ", "")
			];

			var fnSuccess = function (data) {
				g.BusyDialog.close();
				var results = data.results[0];
				var fields = [];
				if (results.Equi_DOI.results.length > 0) {
					var fields = results.Equi_DOI.results;
				}
				// else {
				// 	var fields = g.DOIarrayEQ;
				// }
				var dData = g.DOIarrayEQ;
				for (var f = 0; f < fields.length; f++) {
					fields[f].instLoc = true;
					if (fields[f].hasOwnProperty("maintenance")) {
						if (!fields[f].maintenance) {
							fields[f].targetVal = fields[f].SupFlVal;
						}
					} else {
						fields[f].maintenance = dData[f].maintenance;
						if (fields[f].maintenance) {
							fields[f].instLoc = false;
						} else {
							fields[f].instLoc = true;
						}

						fields[f].currentVal = dData[f].currentVal;
					}
					if (fields[f].Property === "Maintplant" || fields[f].Property === "PplaEeqz") {
						fields[f].locEnable = false;
						fields[f].maintEnable = false;
					} else {
						fields[f].locEnable = true;
						fields[f].maintEnable = true;
					}
					fields[f].targetVal = fields[f].SupFlVal;
				}
				if (sMode === "change" && g.detailFlag === true) {
					g.getView().getModel("dataOrigin").setData(fields);
					// g.getView().getModel("dataOrigin").getData().push({
					// 	key: sEqunr,
					// 	DOI: fields
					// });
				} else {
					sap.ui.getCore().getModel("dataOriginMOP").getData().EQ.push({
						key: sEqunr,
						DOI: fields
					});

					if (readResults && sMode === "change") {
						var aEQDOIdata = sap.ui.getCore().getModel("dataOriginMOP").getData().EQ;
						for (var i = 0; i < readResults.Equipment.results.length; i++) {
							var h = readResults.Equipment.results[i];
							for (var z = 0; z < aEQDOIdata.length; z++) {
								if (sEqunr === aEQDOIdata[z].key) {
									var aDOIFields = aEQDOIdata[z].DOI;
									if (h.Swerki === "") {
										aDOIFields[0].maintenance = false;
										aDOIFields[0].instLoc = false;
										aDOIFields[0].SupFlVal = "";
										aDOIFields[0].currentVal = "";
										aDOIFields[0].targetVal = "";
									} else if (h.Swerki === "D") {
										aDOIFields[0].maintenance = true;
										aDOIFields[0].instLoc = false;
										aDOIFields[0].SupFlVal = "";
										aDOIFields[0].currentVal = h.Swerk;
										aDOIFields[0].targetVal = h.Swerk;
									} else {
										aDOIFields[0].maintenance = false;
										aDOIFields[0].instLoc = true;
										aDOIFields[0].SupFlVal = h.Swerk;
										aDOIFields[0].currentVal = "";
										aDOIFields[0].targetVal = h.Swerk;
									}

									if (h.Storti === "") {
										aDOIFields[1].maintenance = false;
										aDOIFields[1].instLoc = false;
										aDOIFields[1].SupFlVal = "";
										aDOIFields[1].currentVal = "";
										aDOIFields[1].targetVal = "";
									} else if (h.Storti === "D") {
										aDOIFields[1].maintenance = true;
										aDOIFields[1].instLoc = false;
										aDOIFields[1].SupFlVal = "";
										aDOIFields[1].currentVal = h.StorEilo;
										aDOIFields[1].targetVal = h.StorEilo;
									} else {
										aDOIFields[1].maintenance = false;
										aDOIFields[1].instLoc = true;
										aDOIFields[1].SupFlVal = h.StorEilo;
										aDOIFields[1].currentVal = "";
										aDOIFields[1].targetVal = h.StorEilo;
									}

									if (h.Beberi === "") {
										aDOIFields[2].maintenance = false;
										aDOIFields[2].instLoc = false;
										aDOIFields[2].SupFlVal = "";
										aDOIFields[2].currentVal = "";
										aDOIFields[2].targetVal = "";
									} else if (h.Beberi === "D") {
										aDOIFields[2].maintenance = true;
										aDOIFields[2].instLoc = false;
										aDOIFields[2].SupFlVal = "";
										aDOIFields[2].currentVal = h.BebeEilo;
										aDOIFields[2].targetVal = h.BebeEilo;
									} else {
										aDOIFields[2].maintenance = false;
										aDOIFields[2].instLoc = true;
										aDOIFields[2].SupFlVal = h.BebeEilo;
										aDOIFields[2].currentVal = "";
										aDOIFields[2].targetVal = h.BebeEilo;
									}

									if (h.Ppsidi === "") {
										aDOIFields[3].maintenance = false;
										aDOIFields[3].instLoc = false;
										aDOIFields[3].SupFlVal = "";
										aDOIFields[3].currentVal = "";
										aDOIFields[3].targetVal = "";
									} else if (h.Ppsidi === "D") {
										aDOIFields[3].maintenance = true;
										aDOIFields[3].instLoc = false;
										aDOIFields[3].SupFlVal = "";
										aDOIFields[3].currentVal = h.ArbpEilo;
										aDOIFields[3].targetVal = h.ArbpEilo;
									} else {
										aDOIFields[3].maintenance = false;
										aDOIFields[3].instLoc = true;
										aDOIFields[3].SupFlVal = h.ArbpEilo;
										aDOIFields[3].currentVal = "";
										aDOIFields[3].targetVal = h.ArbpEilo;
									}

									if (h.Abckzi === "") {
										aDOIFields[4].maintenance = false;
										aDOIFields[4].instLoc = false;
										aDOIFields[4].SupFlVal = "";
										aDOIFields[4].currentVal = "";
										aDOIFields[4].targetVal = "";
									} else if (h.Abckzi === "D") {
										aDOIFields[4].maintenance = true;
										aDOIFields[4].instLoc = false;
										aDOIFields[4].SupFlVal = "";
										aDOIFields[4].currentVal = h.AbckEilo;
										aDOIFields[4].targetVal = h.AbckEilo;
									} else {
										aDOIFields[4].maintenance = false;
										aDOIFields[4].instLoc = true;
										aDOIFields[4].SupFlVal = h.AbckEilo;
										aDOIFields[4].currentVal = "";
										aDOIFields[4].targetVal = h.AbckEilo;
									}

									if (h.Kostli === "") {
										aDOIFields[5].maintenance = false;
										aDOIFields[5].instLoc = false;
										aDOIFields[5].SupFlVal = "";
										aDOIFields[5].currentVal = "";
										aDOIFields[5].targetVal = "";
									} else if (h.Kostli === "D") {
										aDOIFields[5].maintenance = true;
										aDOIFields[5].instLoc = false;
										aDOIFields[5].SupFlVal = "";
										aDOIFields[5].currentVal = h.KostEilo;
										aDOIFields[5].targetVal = h.KostEilo;
									} else {
										aDOIFields[5].maintenance = false;
										aDOIFields[5].instLoc = true;
										aDOIFields[5].SupFlVal = h.KostEilo;
										aDOIFields[5].currentVal = "";
										aDOIFields[5].targetVal = h.KostEilo;
									}

									if (h.Iwerki === "") {
										aDOIFields[6].maintenance = false;
										aDOIFields[6].instLoc = false;
										aDOIFields[6].SupFlVal = "";
										aDOIFields[6].currentVal = "";
										aDOIFields[6].targetVal = "";
									} else if (h.Iwerki === "D") {
										aDOIFields[6].maintenance = true;
										aDOIFields[6].instLoc = false;
										aDOIFields[6].SupFlVal = "";
										aDOIFields[6].currentVal = h.PplaEeqz;
										aDOIFields[6].targetVal = h.PplaEeqz;
									} else {
										aDOIFields[6].maintenance = false;
										aDOIFields[6].instLoc = true;
										aDOIFields[6].SupFlVal = h.PplaEeqz;
										aDOIFields[6].currentVal = "";
										aDOIFields[6].targetVal = h.PplaEeqz;
									}

									if (h.Ingrpi === "") {
										aDOIFields[7].maintenance = false;
										aDOIFields[7].instLoc = false;
										aDOIFields[7].SupFlVal = "";
										aDOIFields[7].currentVal = "";
										aDOIFields[7].targetVal = "";
									} else if (h.Ingrpi === "D") {
										aDOIFields[7].maintenance = true;
										aDOIFields[7].instLoc = false;
										aDOIFields[7].SupFlVal = "";
										aDOIFields[7].currentVal = h.IngrEeqz;
										aDOIFields[7].targetVal = h.IngrEeqz;
									} else {
										aDOIFields[7].maintenance = false;
										aDOIFields[7].instLoc = true;
										aDOIFields[7].SupFlVal = h.IngrEeqz;
										aDOIFields[7].currentVal = "";
										aDOIFields[7].targetVal = h.IngrEeqz;
									}

									if (h.Gewrki === "") {
										aDOIFields[8].maintenance = false;
										aDOIFields[8].instLoc = false;
										aDOIFields[8].SupFlVal = "";
										aDOIFields[8].currentVal = "";
										aDOIFields[8].targetVal = "";
									} else if (h.Gewrki === "D") {
										aDOIFields[8].maintenance = true;
										aDOIFields[8].instLoc = false;
										aDOIFields[8].SupFlVal = "";
										aDOIFields[8].currentVal = h.ArbpEeqz;
										aDOIFields[8].targetVal = h.ArbpEeqz;
									} else {
										aDOIFields[8].maintenance = false;
										aDOIFields[8].instLoc = true;
										aDOIFields[8].SupFlVal = h.ArbpEeqz;
										aDOIFields[8].currentVal = "";
										aDOIFields[8].targetVal = h.ArbpEeqz;
									}

									if (h.Adrnri === "") {
										aDOIFields[10].maintenance = false;
										aDOIFields[10].instLoc = false;
										aDOIFields[10].SupFlVal = "";
										aDOIFields[10].currentVal = "";
										aDOIFields[10].targetVal = "";
									} else if (h.Adrnri === "D") {
										aDOIFields[10].maintenance = true;
										aDOIFields[10].instLoc = false;
										aDOIFields[10].SupFlVal = "";
										aDOIFields[10].currentVal = h.Adrnr;
										aDOIFields[10].targetVal = h.Adrnr;
									} else {
										aDOIFields[10].maintenance = false;
										aDOIFields[10].instLoc = true;
										aDOIFields[10].SupFlVal = h.Adrnr;
										aDOIFields[10].currentVal = "";
										aDOIFields[10].targetVal = h.Adrnr;
									}
								}
							}
						}
					}
				}
			};
			var fnError = function () {
				g.BusyDialog.close();
			};
			g.BusyDialog.open();
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters, urlParameters);
		},

		modifyEQDoiForCopyChange: function (sObject, flag) {
			var g = this;
			var aDefaultDoi = $.map(g.DOIarrayEQ, function (obj) {
				return $.extend(true, {}, obj);
			});

			if (sObject.Swerk !== "") {
				aDefaultDoi[0].maintenance = true;
				aDefaultDoi[0].currentVal = sObject.Swerk;
				aDefaultDoi[0].currentValDesc = sObject.Name1;
				aDefaultDoi[0].targetVal = sObject.Swerk;
			}
			if (sObject.StorEilo !== "") {
				aDefaultDoi[1].maintenance = true;
				aDefaultDoi[1].currentVal = sObject.StorEilo;
				aDefaultDoi[1].currentValDesc = sObject.Locationdesc;
				aDefaultDoi[1].targetVal = sObject.StorEilo;
			}
			if (sObject.BebeEilo !== "") {
				aDefaultDoi[2].maintenance = true;
				aDefaultDoi[2].currentVal = sObject.BebeEilo;
				aDefaultDoi[2].currentValDesc = sObject.Fing;
				aDefaultDoi[2].targetVal = sObject.BebeEilo;
			}
			if (sObject.ArbpEilo !== "") {
				aDefaultDoi[3].maintenance = true;
				aDefaultDoi[3].currentVal = sObject.ArbpEilo;
				aDefaultDoi[3].currentValDesc = sObject.Workcenterdesc;
				aDefaultDoi[3].targetVal = sObject.ArbpEilo;
			}
			if (sObject.AbckEilo !== "") {
				aDefaultDoi[4].maintenance = true;
				aDefaultDoi[4].currentVal = sObject.AbckEilo;
				aDefaultDoi[4].currentValDesc = sObject.Abctx;
				aDefaultDoi[4].targetVal = sObject.AbckEilo;
			}
			if (sObject.KostEilo !== "") {
				aDefaultDoi[5].maintenance = true;
				aDefaultDoi[5].currentVal = sObject.KostEilo;
				aDefaultDoi[5].currentValDesc = sObject.Contareaname;
				aDefaultDoi[5].targetVal = sObject.KostEilo;
			}
			if (sObject.PplaEeqz !== "") {
				aDefaultDoi[6].maintenance = true;
				aDefaultDoi[6].currentVal = sObject.PplaEeqz;
				aDefaultDoi[6].currentValDesc = sObject.Planningplantdes;
				aDefaultDoi[6].targetVal = sObject.PplaEeqz;
			}
			if (sObject.IngrEeqz !== "") {
				aDefaultDoi[7].maintenance = true;
				aDefaultDoi[7].currentVal = sObject.IngrEeqz;
				aDefaultDoi[7].currentValDesc = sObject.Plannergrpdesc;
				aDefaultDoi[7].targetVal = sObject.IngrEeqz;
			}
			if (sObject.ArbpEeqz !== "") {
				aDefaultDoi[8].maintenance = true;
				aDefaultDoi[8].currentVal = sObject.ArbpEeqz;
				aDefaultDoi[8].currentValDesc = sObject.MainWcDesc;
				aDefaultDoi[8].targetVal = sObject.ArbpEeqz;
			}
			if (sObject.WorkCenterPlant !== "") {
				aDefaultDoi[9].maintenance = true;
				aDefaultDoi[9].currentVal = sObject.WorkCenterPlant;
				aDefaultDoi[9].currentValDesc = "";
				aDefaultDoi[9].targetVal = sObject.WorkCenterPlant;
			}
			if (sObject.Adrnr !== "") {
				aDefaultDoi[10].maintenance = true;
				aDefaultDoi[10].currentVal = sObject.Adrnr;
				aDefaultDoi[10].currentValDesc = "";
				aDefaultDoi[10].targetVal = sObject.Adrnr;
			}

			if (flag === "CHREAD") {
				g.getView().getModel("dataOrigin").setData(aDefaultDoi)
			} else {
				sap.ui.getCore().getModel("dataOriginMOP").getData().EQ.push({
					key: sObject.Equnr,
					DOI: aDefaultDoi
				});
			}
		},

		/*
		 * Function to read Measuring point data
		 * @public
		 * @param {string} sMspt
		 * @param {string} sCrStatus
		 */
		readMeasuringPointData: function (sMspt, sCrStatus) {
			var g = this;
			// var oMainModel = g.getView().getModel("mainView");
			// var oMainData = oMainModel.getData();
			// oMainData.viewBusy = true;
			// oMainModel.setData(oMainData);

			var sModelName = "AIWMSPT";
			var sPath = "/ChangeRequestSet";
			var oExpand = ["MSClass", "MSLAM", "MSPoint", "MSVal", "DataOrigin_N"];

			var urlParameters = {
				"$expand": oExpand
			};

			var oModel = g.getView().getModel();
			var oFilters = [new sap.ui.model.Filter("Point", "EQ", sMspt)];
			var fnSuccess = function (data) {
				g.BusyDialog.close();
				var results = data.results[0];

				if (results === undefined) {
					// oMainData.viewBusy = false;
					// oMainModel.setData(oMainData);
					return;
				}
				var sObject = {
					// Measuring POint
					Mspoint: sMspt,

					classItems: [], // Class Details
					characteristics: [], // Characteristics Details
					charNewButton: false,
					attachmentCount: "0", // Attachment Count
					Guids: "", // Attachment

					PttxtVS: "None",
					PttxtVST: "",
					ObtypMsVS: "None",
					ObtypMsVST: "",
					MptypVS: "None",
					MptypVST: "",
					AtnamMsVS: "None",
					AtnamMsVST: "",
					EqunrVS: "None",
					EqunrVST: "",
					TplnrVS: "None",
					TplnrVST: "",
					CodgrVS: "None",
					CodgrVST: "",

					MspointEnabled: true,
					ObtypMsEnabled: true,
					EqunrEnabled: true,
					TplnrEnabled: true,
					MptypEnabled: true,
					AtnamMsEnabled: true,

					// Visibility
					valCodeStuffSel: false
				};

				if (results.MSPoint) {
					var sMsPoint = results.MSPoint.results[0];
					if (sMsPoint) {
						sObject.Pttxt = sMsPoint.Pttxt;
						sObject.ObtypMs = sMsPoint.ObtypMs;
						if (sObject.ObtypMs === "IFL") {
							sObject.EqunrEnabled = false;
							sObject.TplnrEnabled = true;
						} else if (sObject.ObtypMs === "IEQ") {
							sObject.EqunrEnabled = true;
							sObject.TplnrEnabled = false;
						}
						sObject.Txt = sMsPoint.Objtypetxt;
						sObject.Mptyp = sMsPoint.Mptyp;
						sObject.Mpttx = sMsPoint.Mpttx;
						sObject.Equnr = sMsPoint.Equnr;
						sObject.Eqktx = sMsPoint.Eqktx;
						sObject.Tplnr = sMsPoint.Tplnr;
						sObject.Pltxt = sMsPoint.Floctxt;
						sObject.Indct = sMsPoint.Indct;
						sObject.AtnamMs = sMsPoint.AtnamMs;
						sObject.Atbez = sMsPoint.Atbez;
						sObject.Mseh6 = sMsPoint.Mseh6;
						sObject.Msehl = sMsPoint.Msehl;
						sObject.Codgr = sMsPoint.Codgr;
						sObject.Codgrtxt = sMsPoint.Codgrtxt;
						sObject.Cjumc = sMsPoint.Cjumc;
						sObject.Cdsuf = sMsPoint.Cdsuf;
						sObject.Pyeac = sMsPoint.Pyeac;
						sObject.Desir = sMsPoint.Desir;
						sObject.Mrmax = sMsPoint.Mrmax;
						sObject.Mrmin = sMsPoint.Mrmin;
						sObject.Deact = sMsPoint.Inact;
						sObject.DeactEnable = true;

						if (sMsPoint.Equnr !== "") {
							sObject.EqunrEnabled = true;
							sObject.EqunrLblVis = true;
							sObject.EqunrInpVis = true;
							sObject.EqktxInpVis = true;
							sObject.TplnrEnabled = false;
							sObject.TplnrLblVis = false;
							sObject.TplnrInpVis = false;
							sObject.PltxtInpVis = false;
						} else {
							sObject.EqunrEnabled = false;
							sObject.EqunrLblVis = false;
							sObject.EqunrInpVis = false;
							sObject.EqktxInpVis = false;
							sObject.TplnrEnabled = true;
							sObject.TplnrLblVis = true;
							sObject.TplnrInpVis = true;
							sObject.PltxtInpVis = true;
						}

						if (sMsPoint.Indct) {
							sObject.countEnable = true;
							sObject.tEnable = false;
						} else {
							sObject.countEnable = false;
							sObject.tEnable = true;
						}

						sObject.Psort = sMsPoint.Psort;
						sObject.Inact = sMsPoint.Inact;
						sObject.Mseh6 = sMsPoint.Mseh6;
						sObject.Msehl = sMsPoint.Msehl;
						sObject.Decim = sMsPoint.Decim.toString();
						sObject.Locas = sMsPoint.Locas;
						sObject.Maktx = sMsPoint.Maktx;
						sObject.Begru = sMsPoint.Begru;
						sObject.Begtx = sMsPoint.Begtx;
						sObject.Expon = sMsPoint.Expon;
						sObject.Mrngu = sMsPoint.Mrngu;
						sObject.Dstxt = sMsPoint.Dstxt;
						sObject.Indrv = sMsPoint.Indrv;
						sObject.Inact = sMsPoint.Inact;
					}
				}

				// if (sMsPoint.Mptyp === "L") {
				if (results.MSLAM.results.length > 0) {
					var sLAM = results.MSLAM.results[0];
					sObject.lam = {
						Mspoint: sMspt,
						Lrpid: sLAM.Lrpid,
						LrpidDesc: sLAM.LrpDescr,
						Strtptatr: sLAM.Strtptatr,
						Endptatr: sLAM.Endptatr,
						Length: sLAM.Length, //parseInt(sLAM.Length !== "" ? sLAM.Length : "0"),
						LinUnit: sLAM.LinUnit,
						LinUnitDesc: sLAM.Uomtext,
						Startmrkr: sLAM.Startmrkr,
						Endmrkr: sLAM.Endmrkr,
						Mrkdisst: sLAM.Mrkdisst,
						Mrkdisend: sLAM.Mrkdisend,
						MrkrUnit: sLAM.MrkrUnit,
						enableLrp: true,
						enableMarker: true,
						LrpidVS: "None",
						StrtptatrVS: "None",
						EndptatrVS: "None",
						LinUnitVS: "None",
						StartmrkrVS: "None",
						EndmrkrVS: "None",
						MrkdisstVS: "None",
						MrkdisendVS: "None",
						MrkrUnitVS: "None"
					};
				} else {
					sObject.lam = {
						Lrpid: "",
						LrpidDesc: "",
						Strtptatr: "",
						Endptatr: "",
						Length: "",
						LinUnit: "",
						LinUnitDesc: "",
						Startmrkr: "",
						Endmrkr: "",
						Mrkdisst: "",
						Mrkdisend: "",
						MrkrUnit: "",
						enableLrp: true,
						enableMarker: false,
						LrpidVS: "None",
						StrtptatrVS: "None",
						EndptatrVS: "None",
						LinUnitVS: "None",
						StartmrkrVS: "None",
						EndmrkrVS: "None",
						MrkdisstVS: "None",
						MrkdisendVS: "None",
						MrkrUnitVS: "None"
					};
				}
				// }

				if (results.MSClass) {
					// var sClassList = results.MSClass.results;
					var sClassList = $.map(results.MSClass.results, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (sClassList) {
						if (sClassList.length > 0) {
							for (var i = 0; i < sClassList.length; i++) {
								sClassList[i].ctEnable = false;
								sClassList[i].classEnable = false;
								sClassList[i].ClassTypeDesc = sClassList[i].Artxt;
								delete sClassList[i].Artxt;
								sClassList[i].ClassDesc = sClassList[i].Kltxt;
								delete sClassList[i].Kltxt;
								delete sClassList[i].Changerequestid;
								delete sClassList[i].Clint;
								delete sClassList[i].Service;
								sClassList[i].classDelEnable = true;
								sObject.classItems.push(sClassList[i]);
							}
							if (sCrStatus === "true") {
								for (var i = 0; i < Object.classItems.length; i++) {
									Object.classItems[i].classDelEnable = false;
								}
							}
							sObject.charNewButton = true;
							if (g.class) {
								// var itemFragmentId = g.getView().createId("charFrag");
								// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
								// newCharBtn.setEnabled(true);
								g.class.setModel(new JSONModel(sObject.classItems));
							}
						}
					}
				}

				if (results.MSVal) {
					// var sCharList = results.MSVal.results;
					var sCharList = $.map(results.MSVal.results, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (sCharList) {
						if (sCharList.length > 0) {
							for (var j = 0; j < sCharList.length; j++) {
								sCharList[j].cNameEnable = false;
								sCharList[j].Textbz = sCharList[j].Atwtb;
								delete sCharList[j].Ataut;
								delete sCharList[j].Ataw1;
								delete sCharList[j].Atawe;
								delete sCharList[j].Atcod;
								delete sCharList[j].Atflb;
								delete sCharList[j].Atflv;
								delete sCharList[j].Atimb;
								delete sCharList[j].Atsrt;
								delete sCharList[j].Atvglart;
								delete sCharList[j].Atzis;
								delete sCharList[j].Changerequestid;
								delete sCharList[j].CharName;
								delete sCharList[j].Charid;
								delete sCharList[j].Classtype;
								delete sCharList[j].Service;
								delete sCharList[j].Valcnt;
								sCharList[j].slNo = j + 1; // ()
								sCharList[j].flag = sCharList[j].Class + "-" + sCharList[j].slNo; // ()
								sObject.characteristics.push(sCharList[j]);
							}
							if (sCrStatus === "true") {
								for (var i = 0; i < sObject.characteristics.length; i++) {
									sObject.characteristics[i].charAddEnable = false;
									sObject.characteristics[i].charClrEnable = false;
									sObject.characteristics[i].charDltEnable = false;
								}
							} else {
								for (var z = 0; z < sObject.characteristics.length; z++) {
									var count = 1;
									for (var y = 0; y < sObject.characteristics.length; y++) {
										if (z === y) {
											continue;
										}
										if (sObject.characteristics[y].Atnam === sObject.characteristics[z].Atnam && sObject.characteristics[y].Class ===
											sObject.characteristics[z].Class) {
											count++;
										}
									}
									if (count > 1) {
										sObject.characteristics[z].charDltEnable = true;
									} else {
										sObject.characteristics[z].charDltEnable = false;
									}

									if (sObject.characteristics[z].Atein === true) {
										sObject.characteristics[z].charAddEnable = false;
									}
								}
							}
							if (g.char) {
								g.char.setModel(new JSONModel(sObject.characteristics));
							}
						}
					}
				}

				if (results.DataOrigin_N.results.length > 0) {
					var DOobj = results.DataOrigin_N.results[0];
					sObject.readTransfSel = true;
					sObject.readTransf = DOobj.Trans;
					sObject.RT = {
						readTransfSel: true,
						readTransf: DOobj.Trans,
						RTValidFrom: formatter.dateFormat(DOobj.Datlo),
						RTTime: formatter.getTime(DOobj.Timlo),
						RTMeasPos: DOobj.Psort,
						RTMeasDesc: DOobj.Pttxt,
						RTFloc: DOobj.Tplnr,
						RTFlocDesc: DOobj.Pltxt,
						RTEqui: DOobj.Equnr,
						RTEquiDesc: DOobj.Eqktx,
					};
				} else {
					sObject.readTransfSel = false;
					sObject.readTransf = "";
					sObject.RT = {
						readTransfSel: false,
						readTransf: "",
						RTValidFrom: "",
						RTTime: "",
						RTMeasPos: "",
						RTMeasDesc: "",
						RTFloc: "",
						RTFlocDesc: "",
						RTEqui: "",
						RTEquiDesc: "",
					};
				}

				g.setCommonApprovalData(sModelName, sObject);

				if (g.CopyTempArray && g.CopyTempArray.length > 0) {
					sObject.Mspoint = g.CopyTempArray[0];
					sObject.viewParameter = "create";
					sObject.MspointEnabled = true;
					sObject.ObtypMsEnabled = true;
					if (sObject.Equnr === "" || sObject.Equnr === undefined) {
						sObject.EqunrEnabled = false;
					} else {
						sObject.EqunrEnabled = true;
					}
					if (sObject.Tplnr === "" || sObject.Tplnr === undefined) {
						sObject.TplnrEnabled = false;
					} else {
						sObject.TplnrEnabled = true;
					}
					sObject.MptypEnabled = true;
					sObject.AtnamMsEnabled = true;
					g.CopyTempArray.shift();

					var sJsonModel, sArray;
					sJsonModel = g.getView().getModel(sModelName);
					sArray = sJsonModel.getData();
					sArray.push(sObject);
					sJsonModel.setData(sArray);
					sap.ui.getCore().setModel(new JSONModel(sJsonModel.getData()), sModelName);
					g.onUpdateTitleCount(sModelName, sArray);
					// oMainData.viewBusy = false;
					// oMainModel.setData(oMainData);
					return;
				}

				if (sObject.ObtypMs === "" || sObject.ObtypMs === undefined) {
					sObject.ObtypMsEnabled = true;
				} else {
					sObject.ObtypMsEnabled = false;
				}

				if (sObject.ObtypMs === "IEQ") {
					sObject.TplnrEnabled = false;
					if ((sObject.Equnr === "" || sObject.Equnr === undefined)) {
						sObject.EqunrEnabled = true;
					} else {
						sObject.EqunrEnabled = false;
					}
				}

				if (sObject.ObtypMs === "IFL") {
					sObject.EqunrEnabled = false;
					if ((sObject.Tplnr === "" || sObject.Tplnr === undefined)) {
						sObject.TplnrEnabled = true;
					} else {
						sObject.TplnrEnabled = false;
					}
				}

				if (sObject.Mptyp === "" || sObject.Mptyp === undefined) {
					sObject.MptypEnabled = true;
				} else {
					sObject.MptypEnabled = false;
				}
				if (sObject.AtnamMs === "" || sObject.AtnamMs === undefined) {
					sObject.AtnamMsEnabled = true;
				} else {
					sObject.AtnamMsEnabled = false;
				}
				sObject.MspointEnabled = false;

				if (sCrStatus === "true") {
					sObject.MspointEnabled = false;
					sObject.ObtypMsEnabled = false;
					sObject.EqunrEnabled = false;
					sObject.TplnrEnabled = false;
					sObject.MptypEnabled = false;
					sObject.AtnamMsEnabled = false
					sObject.DeactEnable = false;
				}

				if (g.detailFlag === true) {
					if (sObject.Mptyp === "L" && g.lamSwitch === "X") {
						g.lam.setVisible(true);
						if (sCrStatus === "true") {
							sObject.lam.enableLrp = false;
							sObject.lam.enableMarker = false;
						}
						g.lam.setModel(new JSONModel(sObject), "AIWLAM");
					} else {
						g.lam.setVisible(false);
					}
					g.handleMainTableRow(sObject, sModelName);
				} else {
					sObject.viewParameter = "change";
					g.handleSearchImportPress(sObject, sModelName);
				}

				// oMainData.viewBusy = false;
				// oMainModel.setData(oMainData);
			};
			var fnError = function () {
				g.BusyDialog.close();
				// oMainData.viewBusy = false;
				// oMainModel.setData(oMainData);
			};
			g.BusyDialog.open();
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters, urlParameters);
		},

		/*
		 * Function to read Maintainence Plan data
		 * @public
		 * @param {string} sMplan
		 * @param {string} sCrStatus
		 */
		readMaintenancePlanData: function (sMplan, sCrStatus) {
			var g = this;
			// var oMainModel = g.getView().getModel("mainView");
			// var oMainData = oMainModel.getData();
			// oMainData.viewBusy = true;
			// oMainModel.setData(oMainData);

			var sModelName = "AIWMPMI";
			var sPath = "/ChangeRequestSet";
			var oExpand = ["MPCycle", "MPItem", "MPLAM", "MPLAN", "MPOBList", "ClassMpl", "ValuaMpl"];

			var urlParameters = {
				"$expand": oExpand
			};

			var oModel = g.getView().getModel();
			var oFilters = [new sap.ui.model.Filter("Mplan", "EQ", sMplan)];
			var fnSuccess = function (data) {
				g.BusyDialog.close();
				var results = data.results[0];

				if (results === undefined) {
					// oMainData.viewBusy = false;
					// oMainModel.setData(oMainData);
					return;
				}
				var sObject = {
					// MPMIpmentsDetail
					classItems: [], // Class Details
					characteristics: [], // Characteristics Details
					charNewButton: false,
					cycleModel: [],
					itemModel: [],
					ObjListItems: [],
					lam: [],
					Warpl: sMplan,
					cycleIndSingle: false, // RBSC
					cycleIndStrategy: false, // RBST
					cycleIndMultCntr: false, // RBMC

					// Fields Enability
					WarplEnabled: true,
					StratEnabled: true,
					MehrfachEnabled: true,
					WsetEnabled: true,
					MptypEnabled: true,
					cycleIndSingleEnabled: true,
					cycleIndStrategyEnabled: true,
					cycleIndMultCntrEnabled: true,
					FabklLBLReq: false,
					ButtonNewItemEnabled: true,
					ButtonAssignItemEnabled: true,

					// Label Visibility
					OPText: false,
					OPTitle: false,
					OPLBL: false,
					MpcyclenoLBL: false,
					FabklLBL: true,
					AbrhoLBL: true,
					MehrfachLBL: false, // Multiple counter Label
					ScheIndText: true,
					ScheIndTitle: true,
					ScheIndLBL: true,
					StratLBL: false,
					StratDescLBL: false,
					WsetLBL: false,
					SzaehLBL: false,
					StadtLBL: true,

					// Fields Visibility
					HorizVisible: false,
					cycleSetSeqColVis: false,
					OROPVis: false,
					AndOPvis: false,
					ScheIndRbTimeVis: true,
					ScheIndRbTimeKeyDateVis: true,
					ScheIndRbTimeFactCalVis: true,
					ScheIndRbPerformanceVis: true,
					MpcyclenoVis: false,
					HunitVis: true,
					AbrhoVis: true,
					MehrfachVis: false,
					StratVis: false, // Strategy Visibility
					StratDescVis: false,
					WsetVis: false,
					KtextVis: false,
					SzaehVis: false,
					UnitcVis: false,
					StadtVis: true,

					attachmentCount: "0", // Attachment Count
					Guids: "", // Attachment
					MaintenanceItemMode: "Delete",

					// Fields ValueState
					WarplVS: "None",
					WarplVST: "",
					WptxtVS: "None",
					WptxtVST: "",
					StratVS: "None",
					StratVST: "",
					WsetVS: "None",
					WsetVST: "",
					StadtVS: "None",
					StadtVST: "",
					StichVS: "None",
					StichVST: "",
					HunitVS: "None",
					HunitVST: ""
				};

				if (results.MPLAN) {
					var sMaintenance = results.MPLAN.results[0];
					if (sMaintenance) {
						sObject.Wptxt = sMaintenance.Wptxt;
						sObject.Mptyp = sMaintenance.Mptyp;
						sObject.Strat = sMaintenance.Strat;
						sObject.StratDesc = sMaintenance.StratDesc;
						sObject.Deact = sMaintenance.InactMp; //Inactive Status
						sObject.DeactEnable = true; //Inactive Status Enable

						if (sMaintenance.Mehrfach === "X" || sMaintenance.Stich === "4") {
							sObject.cycleSetSeqColVis = true;
							sObject.CycleSetSeqVis = true;
							sObject.ScheIndText = false;
							sObject.ScheIndTitle = false;
							sObject.ScheIndLBL = false;
							sObject.ScheIndRbTimeVis = false;
							sObject.ScheIndRbTimeKeyDateVis = false;
							sObject.ScheIndRbTimeFactCalVis = false;
							sObject.ScheIndRbPerformanceVis = false;
							sObject.ScheIndRbTimeEnabled = false;
							sObject.ScheIndRbTimeKeyDateEnabled = false;
							sObject.ScheIndRbTimeFactCalEnabled = false;
							sObject.ScheIndRbPerformanceEnabled = false;
							sObject.AbrhoLBL = false;
							sObject.AbrhoVis = false;
							sObject.HunitVis = false;
							sObject.FabklLBL = false;
							sObject.FabklVis = false;
							sObject.FabklDescVis = false;
							sObject.Fabkl = "";
							sObject.FabklDesc = "";
							sObject.ButtonNewCycleEnabled = true;
							sObject.OPText = true;
							sObject.OPTitle = true;
							sObject.OPLBL = true;
							sObject.OROPVis = true;
							sObject.AndOPvis = true;
							sObject.WsetLBL = true;
							sObject.WsetVis = true;
							sObject.KtextVis = true;
							sObject.StratLBL = true;
							sObject.StratVis = true;
							sObject.StratDescVis = true;
							sObject.MehrfachLBL = true;
							sObject.MehrfachVis = true;
							sObject.Mehrfach = true;
							sObject.StadtLBL = true;
							sObject.StadtVis = true;
							sObject.Stadt = formatter.getDateFormat(sMaintenance.Startdate);
							sObject.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_STDATE");
							sObject.SzaehLBL = false;
							sObject.SzaehVis = false;
							sObject.UnitcVis = false;
							sObject.Unitc = " ";
							sObject.MpcyclenoLBL = false;
							sObject.MpcyclenoVis = false;
							sObject.MaintenanceCycleMode = "Delete";
							sObject.cycleIndMultCntr = true;
							sObject.cycleType = 2;
						} else if (sMaintenance.Strat === "" && (sMaintenance.Stich === "" || sMaintenance.Stich === "1" || sMaintenance.Stich === "2")) {
							sObject.cycleSetSeqColVis = false;
							sObject.CycleSetSeqVis = false;
							sObject.ScheIndText = true;
							sObject.ScheIndTitle = true;
							sObject.ScheIndLBL = true;
							sObject.ScheIndRbTimeEnabled = true;
							sObject.ScheIndRbTimeKeyDateEnabled = true;
							sObject.ScheIndRbTimeFactCalEnabled = true;
							sObject.ScheIndRbPerformanceEnabled = true;
							sObject.AbrhoLBL = true;
							sObject.AbrhoVis = true;
							sObject.HunitVis = true;
							sObject.FabklLBL = true;
							sObject.FabklVis = true;
							sObject.FabklDescVis = true;
							sObject.Fabkl = "";
							sObject.FabklDesc = "";
							sObject.StadtLBL = true;
							sObject.StadtVis = true;
							sObject.Stadt = formatter.getDateFormat(sMaintenance.Startdate);
							sObject.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_START_TXT");
							sObject.SzaehLBL = false;
							sObject.SzaehVis = false;
							sObject.UnitcVis = false;
							sObject.Unitc = " ";
							sObject.MpcyclenoLBL = false;
							sObject.MpcyclenoVis = false;
							sObject.MaintenanceCycleMode = "Delete";
							sObject.cycleIndSingle = true;
							sObject.cycleType = 0;
						} else if (sMaintenance.Strat !== "" && sMaintenance.Stich === "3") {
							sObject.cycleSetSeqColVis = false;
							sObject.CycleSetSeqVis = false;
							sObject.ScheIndText = false;
							sObject.ScheIndTitle = false;
							sObject.ScheIndLBL = false;
							sObject.ScheIndRbTimeVis = false;
							sObject.ScheIndRbTimeKeyDateVis = false;
							sObject.ScheIndRbTimeFactCalVis = false;
							sObject.ScheIndRbPerformanceVis = false;
							sObject.ScheIndRbTimeEnabled = false;
							sObject.ScheIndRbTimeKeyDateEnabled = false;
							sObject.ScheIndRbTimeFactCalEnabled = false;
							sObject.ScheIndRbPerformance = true;
							sObject.AbrhoLBL = false;
							sObject.AbrhoVis = false;
							sObject.HunitVis = false;
							sObject.FabklLBL = false;
							sObject.FabklVis = false;
							sObject.FabklDescVis = false;
							sObject.Fabkl = "";
							sObject.FabklDesc = "";
							sObject.StratLBL = true;
							sObject.StratVis = true;
							sObject.StratDescVis = true;
							sObject.Strat = sMaintenance.Strat;
							g.readScheduling(sMaintenance, sMaintenance.Strat, sModelName);
							sObject.StadtLBL = false;
							sObject.StadtVis = false;
							sObject.Stadt = formatter.getDateFormat(sMaintenance.Startdate);
							sObject.SzaehLBL = true;
							sObject.SzaehVis = true;
							sObject.UnitcVis = true;
							sObject.MpcyclenoLBL = true;
							sObject.MpcyclenoVis = true;
							sObject.MaintenanceCycleMode = "None";
							sObject.cycleIndStrateg = true;
							sObject.cycleType = 1;
						} else if (sMaintenance.Strat.indexOf("TIME") > -1 && sMaintenance.Mehrfach === "" && sMaintenance.Stich !== "3") {
							sObject.ScheIndText = true;
							sObject.ScheIndTitle = true;
							sObject.ScheIndLBL = true;
							sObject.ScheIndRbTimeVis = true;
							sObject.ScheIndRbTimeKeyDateVis = true;
							sObject.ScheIndRbTimeFactCalVis = true;
							sObject.ScheIndRbPerformanceVis = true;
							sObject.AbrhoLBL = true;
							sObject.AbrhoVis = true;
							sObject.HunitVis = true;
							sObject.FabklLBL = true;
							sObject.FabklVis = true;
							sObject.FabklDescVis = true;
							sObject.Fabkl = "";
							sObject.FabklDesc = "";
							sObject.StratLBL = true;
							sObject.StratVis = true;
							sObject.StratDescVis = true;
							sObject.Strat = sMaintenance.Strat;
							sObject.StadtLBL = true;
							sObject.StadtVis = true;
							sObject.Stadt = formatter.getDateFormat(sMaintenance.Startdate);
							sObject.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_START_TXT");
							g.readScheduling(sMaintenance, sMaintenance.Strat, sModelName);
							sObject.SzaehLBL = false;
							sObject.SzaehVis = false;
							sObject.UnitcVis = false;
							sObject.Unitc = sMaintenance.Unitc;
							sObject.MpcyclenoLBL = false;
							sObject.MpcyclenoVis = false;
							sObject.MaintenanceCycleMode = "Delete";
							sObject.cycleIndStrateg = true;
							sObject.cycleType = 1;
						} else if (sMaintenance.Strat === "" && sMaintenance.Stich === "3" && sMaintenance.Mehrfach === "") {
							sObject.cycleIndSingle = true;
							sObject.cycleType = 0;
							sObject.ScheIndText = true;
							sObject.ScheIndTitle = true;
							sObject.ScheIndLBL = true;
							sObject.ScheIndRbTimeVis = true;
							sObject.ScheIndRbTimeKeyDateVis = true;
							sObject.ScheIndRbTimeFactCalVis = true;
							sObject.ScheIndRbPerformanceVis = true;
							sObject.ScheIndRbTimeEnabled = false;
							sObject.ScheIndRbTimeKeyDateEnabled = false;
							sObject.ScheIndRbTimeFactCalEnabled = false;
							// sObject.AbrhoLBL = false;
							// sObject.AbrhoVis = false;
							// sObject.HunitVis = false;
							sObject.FabklLBL = true;
							sObject.FabklVis = true;
							sObject.FabklDescVis = true;
							sObject.Fabkl = "";
							sObject.FabklDesc = "";
							sObject.StratLBL = false;
							sObject.StratVis = false;
							sObject.StratDescVis = false;
							sObject.Strat = sMaintenance.Strat;
							sObject.StadtLBL = false;
							sObject.StadtVis = false;
							sObject.Stadt = formatter.getDateFormat(sMaintenance.Startdate);
							sObject.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_START_TXT");
							sObject.SzaehLBL = true;
							sObject.SzaehVis = true;
							sObject.UnitcVis = true;
							sObject.Unitc = " ";
							// sObject.MpcyclenoLBL = true;
							// sObject.MpcyclenoVis = true;
							sObject.MaintenanceCycleMode = "Delete";
						}

						if (sMaintenance.Stich === "1") {
							sObject.ScheIndRbTimeKeyDate = true;
							sObject.FabklEnabled = true;
							sObject.Fabkl = sMaintenance.Fabkl;
							sObject.FabklDesc = sMaintenance.FabklDesc;
						} else if (sMaintenance.Stich === "2") {
							sObject.ScheIndRbTimeFactCal = true;
							sObject.FabklEnabled = true;
							sObject.Fabkl = sMaintenance.Fabkl;
							sObject.FabklDesc = sMaintenance.FabklDesc;
						} else if (sMaintenance.Stich === "3") {
							sObject.ScheIndRbPerformance = true;
							sObject.FabklEnabled = false;
						} else if (sMaintenance.Stich === "" || sMaintenance.Stich === " ") {
							sObject.ScheIndRbTime = true;
							sObject.FabklEnabled = false;
							sObject.Fabkl = sMaintenance.Fabkl;
							sObject.FabklDesc = sMaintenance.FabklDesc;
						}

						if (sMaintenance.Stich) {
							sObject.Stich = parseInt(sMaintenance.Stich);
						} else {
							sObject.Stich = 0;
						}
						sObject.Wset = sMaintenance.Wset;
						sObject.Ktext = sMaintenance.Ktext;
						sObject.Sfakt = sMaintenance.Sfakt;
						sObject.Abrho = sMaintenance.Abrho;
						sObject.Hunit = sMaintenance.Hunit;
						sObject.StratDesc = sMaintenance.StratDesc;
						sObject.Szaeh = sMaintenance.Szaeh;
						sObject.Mpcycleno = sMaintenance.PointStp;
						sObject.Andor = sMaintenance.Andor;

						if (sMaintenance.PointStp !== "") {
							sObject.Unitc = sMaintenance.Unitc;
							// g.readCounterData(sMaintenance, sMaintenance.PointStp, "counterUnit");
						}
						if (sMaintenance.Andor === "X") {
							sObject.AndOP = true;
						} else {
							sObject.OROP = true;
						}

						g.stratUnit = sObject.Unitc;

						sObject.Vspos = sMaintenance.Vspos;
						sObject.Topos = sMaintenance.Topos;
						sObject.Vsneg = sMaintenance.Vsneg;
						sObject.Toneg = sMaintenance.Toneg;

						sObject.Horiz = sMaintenance.Horiz;
						sObject.CallConf = sMaintenance.CallConf;

						sObject.PlanSort = sMaintenance.PlanSort;
						sObject.Begru = sMaintenance.Begru;

						sObject.cycleIndSingle = false;
						sObject.cycleIndStrategy = false;
						sObject.cycleIndMultCntr = false;
						sObject.StratEnabled = false;
						sObject.MehrfachEnabled = false;
						sObject.WsetEnabled = false;
						sObject.MaintenanceCycleMode = "None";
						switch (sObject.cycleType) {
						case 0:
							sObject.cycleType = 0;
							sObject.cycleIndSingle = true;
							sObject.cycleIndStrategyEnabled = false;
							sObject.cycleIndMultCntrEnabled = false;
							sObject.Strat = " ";
							sObject.StratDesc = " ";
							sObject.StratLBL = false;
							sObject.StratVis = false;
							sObject.StratDescVis = false;
							sObject.Wset = " ";
							sObject.Ktext = " ";
							sObject.WsetLBL = false;
							sObject.WsetVis = false;
							sObject.KtextVis = false;
							sObject.Mehrfach = false;
							sObject.MehrfachLBL = false;
							sObject.MehrfachVis = false;
							sObject.ButtonNewCycleEnabled = true;

							if (sObject.ScheIndRbPerformance === true) {
								sObject.SzaehLBL = true;
								sObject.SzaehVis = true;
								sObject.UnitcVis = true;
								sObject.StadtLBL = false;
								sObject.StadtVis = false;
							}
							break;
						case 1:
							sObject.cycleType = 1;
							sObject.cycleIndStrategy = true;
							sObject.cycleIndSingleEnabled = false;
							sObject.cycleIndMultCntrEnabled = false;
							sObject.StratLBL = true;
							sObject.StratVis = true;
							sObject.StratDescVis = true;
							sObject.StratEnabled = true;
							sObject.Mehrfach = false;
							sObject.MehrfachLBL = false;
							sObject.MehrfachVis = false;
							sObject.Wset = " ";
							sObject.Ktext = " ";
							sObject.WsetLBL = false;
							sObject.WsetVis = false;
							sObject.KtextVis = false;
							sObject.ButtonNewCycleEnabled = false;
							break;
						case 2:
							sObject.cycleType = 2;
							sObject.cycleIndMultCntr = true;
							sObject.cycleIndStrategyEnabled = false;
							sObject.cycleIndSingleEnabled = false;
							sObject.Strat = " ";
							sObject.StratDesc = " ";
							sObject.StratLBL = false;
							sObject.StratVis = false;
							sObject.StratDescVis = false;
							sObject.MehrfachLBL = true;
							sObject.MehrfachVis = true;
							sObject.MehrfachEnabled = true;
							sObject.WsetLBL = true;
							sObject.WsetVis = true;
							sObject.WsetEnabled = true;
							sObject.KtextVis = true;
							sObject.ButtonNewCycleEnabled = true;
							sObject.cycleSetSeqColVis = true;
							break;
						}
					}
				}

				if (results.MPCycle) {
					var sCycle = results.MPCycle.results;
					if (sCycle) {
						for (var c = 0; c < sCycle.length; c++) {
							sCycle[c].Psort = sCycle[c].PointTxt;
							sObject.cycleModel.push(sCycle[c]);
						}
						// g.maintCycle.setModel(cyModel);
					}
				}

				if (results.MPItem) {
					var items = results.MPItem.results;
					if (items) {
						var iModel = new JSONModel();
						var temp = [];
						for (var i = 0; i < items.length; i++) {
							var obj = {};
							obj.Mitemnumb = items[i].Mitemnumb; // maint item 
							obj.Pstxt = items[i].Pstxt; // maint item desc
							obj.Cycleseq = items[i].Cycleseq;
							obj.Tplnr = items[i].TplnrMi; // floc
							obj.Pltxt = items[i].Flocdesc; // floc desc
							obj.Equnr = items[i].Equnr; // equip
							obj.Eqktx = items[i].Equipdesc; // equip desc
							obj.AsmblyOb = items[i].Bautl; // assembly
							obj.Assemblydesc = items[i].Assemblydesc;
							obj.Serialnr = items[i].Serialnr;
							obj.Sermat = items[i].Sermat;
							obj.UiiMitem = items[i].UiiMitem;
							obj.Deviceid = items[i].Deviceid;
							obj.Werks = items[i].PlntMi; // planning plant
							obj.Planningplantdes = items[i].Planningplantdes; // planning plant desc
							obj.Auart = items[i].Auart; // order type 
							obj.oTypeTxt = items[i].Ordertypedesc; // order type desc
							obj.Qmart = items[i].Qmart; // notif type
							obj.nTypeTxt = items[i].Qmartx; // notif type desc
							obj.ArbpMi = items[i].ArbpMi; // main wc
							obj.WergwMi = items[i].WergwMi; // main wc desc
							obj.Ingrp = items[i].IngrpMi; // planner grp
							obj.Innam = items[i].Plannergrpdesc; // planner grp desc

							// Approve Fields
							obj.Zeieh = items[i].Zeieh;
							obj.Priok = items[i].Priok;
							obj.ItmPriotxt = items[i].GsberMi;
							obj.GsberMi = items[i].GsberMi;
							obj.Gtext = items[i].Gtext;
							obj.TaskDet = items[i].TaskDet;
							obj.Ilart = items[i].Ilart;
							obj.Ilatx = items[i].Ilatx;
							obj.PlntyMi = items[i].PlntyMi;
							obj.ApfktMi = items[i].ApfktMi;
							obj.PlnnrMi = items[i].PlnnrMi;
							obj.PlnalMi = items[i].PlnalMi;
							obj.Gpcounterdesc = items[i].Gpcounterdesc;
							obj.AnlzuMi = items[i].AnlzuMi;
							obj.Anlzux = items[i].Anlzux;
							obj.SwerkMil = items[i].SwerkMil;
							obj.Name1 = items[i].Name1;
							obj.StortMil = items[i].StortMil;
							obj.Locationdesc = items[i].Locationdesc;
							obj.MsgrpIl = items[i].MsgrpIl;
							obj.BeberMil = items[i].BeberMil;
							obj.Fing = items[i].Fing;
							obj.Tele = items[i].Tele;
							obj.ArbplIl = items[i].ArbplIl;
							obj.Workcenterdesc = items[i].Workcenterdesc;
							obj.AbckzIl = items[i].AbckzIl;
							obj.Abctx = items[i].Abctx;
							obj.EqfnrIl = items[i].EqfnrIl;
							obj.BukrsMil = items[i].BukrsMil;
							obj.Butxt = items[i].Butxt;
							obj.City = items[i].City;
							obj.Anln1Mil = items[i].Anln1Mil;
							obj.Anln2Mil = items[i].Anln2Mil;
							obj.Txt50 = items[i].Txt50;
							obj.GsberIl = items[i].GsberIl;
							obj.KostlMil = items[i].KostlMil;
							obj.Contareaname = items[i].Contareaname;
							obj.KokrsMil = items[i].KokrsMil;
							obj.Posid = items[i].Posid;
							obj.Post1 = items[i].Post1;
							obj.AufnrIl = items[i].AufnrIl;
							obj.SettleOrdDesc = items[i].SettleOrdDesc;
							obj.PlnnrMi = items[i].PlnnrMi;
							obj.PlntyMi = items[i].PlntyMi;
							obj.PlnalMi = items[i].PlnalMi;

							obj.QmartLBL = true;
							obj.QmartVis = true;
							obj.nTypetxtVis = true;
							obj.AuartLBL = true;
							obj.AuartVis = true;
							obj.oTypeTxtVis = true;
							obj.CycleseqLBL = false;
							obj.CycleseqVis = false;

							obj.AsmblyObMaxLength = 0;
							obj.maintItemE = false;
							obj.cycleSetE = false;
							obj.TplnrEnabled = false;
							obj.equiE = false;
							obj.assemblyE = false;

							obj.CycleseqVS = "None";
							obj.CycleseqVST = "";
							obj.TplnrVS = "None";
							obj.TplnrVST = "";
							obj.EqunrVS = "None";
							obj.EqunrVST = "";
							obj.AsmblyObVS = "None";
							obj.AsmblyObVST = "";
							obj.WerksVS = "None";
							obj.WerksVST = "";
							obj.AuartVS = "None";
							obj.AuartVST = "";
							obj.QmartVS = "None";
							obj.QmartVST = "";
							obj.ArbpMiVS = "None";
							obj.ArbpMiVST = "";
							obj.WergwMiVS = "None";
							obj.WergwMiVST = "";
							obj.IngrpVS = "None";
							obj.IngrpVST = "";
							temp.push(obj);
						}
						iModel.setData(temp);
						sObject.itemModel = temp;
					}
				}

				if (results.MPLAM) {
					var aLAM = results.MPLAM.results;
					if (aLAM) {
						for (var z = 0; z < sObject.itemModel.length; z++) {
							for (var y = 0; y < aLAM.length; y++) {
								if (sObject.itemModel[z].Mitemnumb === aLAM[y].Mitemnumb) {
									sObject.itemModel[z].lam = {};
									sObject.itemModel[z].lam = aLAM[y];
								}
							}
						}
					}
				}

				if (results.MPOBList) {
					var aObjListItems = results.MPOBList.results;
					if (aObjListItems) {
						var temp2 = [];
						for (var i = 0; i < aObjListItems.length; i++) {
							var obj = {};
							if (g.CopyTempArray && g.CopyTempArray.length > 0) { //COPY
								obj.Warpl = g.CopyTempArray[0];
							} else { //CHANGE
								obj.Warpl = aObjListItems[i].Mplan;
							}
							obj.Mitemnumb = aObjListItems[i].Mitemnumb;
							obj.MatnrObj = aObjListItems[i].MatnrObj;
							obj.FlocObj = aObjListItems[i].FlocObj;
							obj.EquiObj = aObjListItems[i].EquiObj;
							obj.AsmblyOb = aObjListItems[i].AsmblyOb;
							obj.Matnrtxt = aObjListItems[i].Matnrtxt;
							obj.Equnrtxt = aObjListItems[i].Equnrtxt;
							obj.Tplnrtxt = aObjListItems[i].Tplnrtxt;
							obj.Bautltxt = aObjListItems[i].Bautltxt;
							obj.Enable = false;
							temp2.push(obj);
						}
						sObject.ObjListItems = temp2;
					}
				}

				if (results.ClassMpl) {
					var sClassList = $.map(results.ClassMpl.results, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (sClassList) {
						if (sClassList.length > 0) {
							for (var i = 0; i < sClassList.length; i++) {
								sClassList[i].ctEnable = false;
								sClassList[i].classEnable = false;
								sClassList[i].ClassTypeDesc = sClassList[i].Artxt;
								delete sClassList[i].Artxt;
								sClassList[i].ClassDesc = sClassList[i].Kltxt;
								delete sClassList[i].Kltxt;
								delete sClassList[i].Changerequestid;
								delete sClassList[i].Clint;
								delete sClassList[i].Service;
								sClassList[i].classDelEnable = true;
								sObject.classItems.push(sClassList[i]);
							}
							if (sCrStatus === "true") {
								for (var i = 0; i < Object.classItems.length; i++) {
									Object.classItems[i].classDelEnable = false;
								}
							}
							sObject.charNewButton = true;
							if (g.class) {
								g.class.setModel(new JSONModel(sObject.classItems));
							}
						}
					}
				}

				if (results.ValuaMpl) {
					var sCharList = $.map(results.ValuaMpl.results, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (sCharList) {
						if (sCharList.length > 0) {
							for (var j = 0; j < sCharList.length; j++) {
								sCharList[j].cNameEnable = false;
								sCharList[j].Textbz = sCharList[j].Atwtb;
								delete sCharList[j].Ataut;
								delete sCharList[j].Ataw1;
								delete sCharList[j].Atawe;
								delete sCharList[j].Atcod;
								delete sCharList[j].Atflb;
								delete sCharList[j].Atflv;
								delete sCharList[j].Atimb;
								delete sCharList[j].Atsrt;
								delete sCharList[j].Atvglart;
								delete sCharList[j].Atzis;
								delete sCharList[j].Changerequestid;
								delete sCharList[j].CharName;
								delete sCharList[j].Charid;
								delete sCharList[j].Classtype;
								delete sCharList[j].Service;
								delete sCharList[j].Valcnt;
								sCharList[j].slNo = j + 1; // ()
								sCharList[j].flag = sCharList[j].Class + "-" + sCharList[j].slNo; // ()
								sObject.characteristics.push(sCharList[j]);
							}
							if (sCrStatus === "true") {
								for (var i = 0; i < sObject.characteristics.length; i++) {
									sObject.characteristics[i].charAddEnable = false;
									sObject.characteristics[i].charClrEnable = false;
									sObject.characteristics[i].charDltEnable = false;
								}
							} else {
								for (var z = 0; z < sObject.characteristics.length; z++) {
									var count = 1;
									for (var y = 0; y < sObject.characteristics.length; y++) {
										if (z === y) {
											continue;
										}
										if (sObject.characteristics[y].Atnam === sObject.characteristics[z].Atnam && sObject.characteristics[y].Class ===
											sObject.characteristics[z].Class) {
											count++;
										}
									}
									if (count > 1) {
										sObject.characteristics[z].charDltEnable = true;
									} else {
										sObject.characteristics[z].charDltEnable = false;
									}

									if (sObject.characteristics[z].Atein === true) {
										sObject.characteristics[z].charAddEnable = false;
									}
								}
							}
							if (g.char) {
								g.char.setModel(new JSONModel(sObject.characteristics));
							}
						}
					}
				}

				if (g.CopyTempArray && g.CopyTempArray.length > 0) {
					if (sObject.cycleModel) {
						if (sObject.cycleModel.length > 0) {
							for (var cm = 0; cm < sObject.cycleModel.length; cm++) {
								sObject.cycleModel[cm].Zykl1Enabled = false;
								sObject.cycleModel[cm].ZeiehEnabled = false;
								sObject.cycleModel[cm].PakTextEnabled = false;
								sObject.cycleModel[cm].OffsetEnabled = false;
								sObject.cycleModel[cm].PointEnabled = false;
								sObject.cycleModel[cm].CycleseqiEnabled = false;
							}
						}
					}
					sObject.Warpl = g.CopyTempArray[0];
					sObject.menuAction = "copy";
					sObject.viewParameter = "create";
					sObject.WarplEnabled = true;
					if (sObject.Mptyp === "" || sObject.Mptyp === undefined || sObject.Mptyp === " ") {
						sObject.MptypEnabled = true;
					} else {
						sObject.MptypEnabled = false;
					}
					if (sObject.cycleType === 1 && (sObject.Strat === "" || sObject.Strat === undefined || sObject.Strat === " ")) {
						sObject.StratEnabled = true;
					} else {
						sObject.StratEnabled = false;
					}
					if (sObject.cycleType === 2 && (sObject.Mehrfach === false || sObject.Mehrfach === "" || sObject.Mehrfach === undefined ||
							sObject.Mehrfach === " ")) {
						sObject.MehrfachEnabled = true;
					} else {
						sObject.MehrfachEnabled = false;
					}
					if (sObject.cycleType === 2 && (sObject.Wset === "" || sObject.Wset === undefined || sObject.Wset === " ")) {
						sObject.WsetEnabled = true;
					} else {
						sObject.WsetEnabled = false;
					}
					g.CopyTempArray.shift();

					var sJsonModel, sArray;
					sJsonModel = g.getView().getModel("copyModel");
					sArray = sJsonModel.getData();
					sArray.push(sObject);
					sJsonModel.setData(sArray);
					g.onUpdateTitleCount(sModelName, sArray);

					if (g.CopyTempArray.length === 0) {
						g.readCreateTempKey("MPITEM", sModelName, "active_copy", results.MPItem.results.length * parseInt(g.noOfCopyObjects),
							sJsonModel.getData(), "MPITEM");
					}
					// oMainData.viewBusy = false;
					// oMainModel.setData(oMainData);
					return;
				}

				if (sObject.Mptyp === "" || sObject.Mptyp === undefined || sObject.Mptyp === " ") {
					sObject.MptypEnabled = true;
				} else {
					sObject.MptypEnabled = false;
				}
				if (sObject.cycleType === 1 && (sObject.Strat === "" || sObject.Strat === undefined || sObject.Strat === " ")) {
					sObject.StratEnabled = true;
				} else {
					sObject.StratEnabled = false;
				}
				if (sObject.cycleType === 2 && (sObject.Mehrfach === false || sObject.Mehrfach === "" || sObject.Mehrfach === undefined ||
						sObject.Mehrfach === " ")) {
					sObject.MehrfachEnabled = true;
				} else {
					sObject.MehrfachEnabled = false;
				}
				if (sObject.cycleType === 2 && (sObject.Wset === "" || sObject.Wset === undefined || sObject.Wset === " ")) {
					sObject.WsetEnabled = true;
				} else {
					sObject.WsetEnabled = false;
				}
				sObject.WarplEnabled = false;

				if (sCrStatus === "true") {
					if (sObject.cycleModel) {
						if (sObject.cycleModel.length > 0) {
							for (var cms = 0; cms < sObject.cycleModel.length; cms++) {
								sObject.cycleModel[cms].Zykl1Enabled = false;
								sObject.cycleModel[cms].ZeiehEnabled = false;
								sObject.cycleModel[cms].PakTextEnabled = false;
								sObject.cycleModel[cms].OffsetEnabled = false;
								sObject.cycleModel[cms].PointEnabled = false;
								sObject.cycleModel[cms].CycleseqiEnabled = false;
							}
						}
					}

					sObject.MaintenanceItemMode = "None";
					sObject.ButtonNewCycleEnabled = false;
					sObject.ButtonNewItemEnabled = false;
					sObject.ButtonAssignItemEnabled = false;
					sObject.WarplEnabled = false;
					sObject.MptypEnabled = false;
					sObject.StratEnabled = false;
					sObject.WsetEnabled = false;
					sObject.MehrfachEnabled = false;
					sObject.FabklEnabled = false;
					sObject.DeactEnable = false;
				}

				if (g.detailFlag === true) {
					g.handleMainTableRow(sObject, sModelName);
				} else {
					if (sObject.cycleModel) {
						if (sObject.cycleModel.length > 0) {
							for (var cmc = 0; cmc < sObject.cycleModel.length; cmc++) {
								sObject.cycleModel[cmc].Zykl1Enabled = false;
								sObject.cycleModel[cmc].ZeiehEnabled = false;
								sObject.cycleModel[cmc].PakTextEnabled = false;
								sObject.cycleModel[cmc].OffsetEnabled = false;
								sObject.cycleModel[cmc].PointEnabled = false;
								sObject.cycleModel[cmc].CycleseqiEnabled = false;
							}
						}
					}
					sObject.menuAction = "change";
					sObject.viewParameter = "change";
					g.handleSearchImportPress(sObject, sModelName);
					// g.cycleIndicatorSelected(sap.ui.getCore().getModel(sModelName).getData().length - 1);
				}

				// oMainData.viewBusy = false;
				// oMainModel.setData(oMainData);
			};
			var fnError = function () {
				g.BusyDialog.close();
				// oMainData.viewBusy = false;
				// oMainModel.setData(oMainData);
			};
			g.BusyDialog.open();
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters, urlParameters);
		},

		/*
		 * Function to read Scheduling data
		 * @public
		 * @param {object} f
		 * @param {string} str
		 * @param {string} sModelName
		 */
		readScheduling: function (f, str, sModelName) {
			var g = this;
			var sPath = "/MPSHDParamSet('" + str + "')";
			var oModel = g.getView().getModel();
			var fnSuccess = function (r) {
				f.Fabkl = r.Fabkl;
				f.FabklDesc = r.FabklDesc;
				f.Abrho = r.Abrho;
				var ind = r.Termk;
				if (ind === "1") {
					f.Stich = 1;
					f.ScheIndRbTimeKeyDate = true;
					f.ScheIndRbTimeKeyDateEnabled = true;
					f.ScheIndRbTimeEnabled = true;
					f.ScheIndRbTimeFactCalEnabled = true;
					f.ScheIndRbPerformanceEnabled = false;
				} else if (ind === "2") {
					f.Stich = 2;
					f.ScheIndRbTimeEnabled = true;
					f.ScheIndRbTimeKeyDateEnabled = true;
					f.ScheIndRbPerformanceEnabled = false;
					f.ScheIndRbTimeFactCal = true;
					f.ScheIndRbTimeFactCalEnabled = true;
				} else if (ind === "3") {
					f.Stich = 3;
					f.ScheIndRbTimeEnabled = false;
					f.ScheIndRbTimeKeyDateEnabled = false;
					f.ScheIndRbTimeFactCalEnabled = false;
					f.ScheIndRbPerformance = true;
					f.ScheIndRbPerformanceEnabled = true;
					g.stratUnit = r.Zeieh;
				} else if (ind === "") {
					f.Stich = 0;
					f.ScheIndRbTime = true;
					f.ScheIndRbTimeKeyDateEnabled = true;
					f.ScheIndRbTimeEnabled = true;
					f.ScheIndRbTimeFactCalEnabled = true;
					f.ScheIndRbPerformanceEnabled = false;
				}
				if (g.getView().getModel(sModelName)) {
					g.getView().getModel(sModelName).refresh();
				}
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError);
		},

		/*
		 * Function to read Counter data
		 * @public
		 * @param {object} oModelData
		 * @param {string} value
		 * @param {string} flag
		 * @param {string} sProperty
		 */
		readCounterData: function (oModelData, value, flag, sProperty) {
			var g = this;
			var sPath = "/CounterDataSet('" + value + "')";
			var oModel = g.getView().getModel("valueHelp");
			var fnSuccess = function (r) {
				if (flag === "counterUnit") {
					if (g.stratUnit === "" || g.stratUnit === undefined) {
						oModelData.Unitc = r.Unitc;
						g.stratUnit = r.Unitc;
					}
					if (r.Unitc !== g.stratUnit) {
						var msg = "Unit " + g.stratUnit + " and counter unit " + r.Unitc + " have different dimensions";
						if (sProperty === "Point") {
							oModelData.FabklVS = "Error";
						} else if (sProperty === "Mpcycleno") {
							oModelData.MpcyclenoVS = "Error";
						}
						g.invokeMessage(msg);
					}
					g.counterUnit = r.Unitc;
					g.getView().getModel(g.oModelName).refresh();
				} else if (flag === "cycleUnit") {
					g.cycleUnit = r.Unitc;
				}
				return r.Unitc;
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError);
		},

		// class and charactertistics code

		/*
		 * getter method to read obtab data
		 * @public
		 * @param {string} sModelName
		 */
		getObTab: function (sModelName, flag) {
			var mEAMCRtypes = sap.ui.getCore().getModel("EAMCRModel");
			var aEAMCRtypes = mEAMCRtypes.getData();
			var sObTab = "";
			var crType = "";

			switch (sModelName) {
			case "AIWEQUI":
				for (var a = 0; a < aEAMCRtypes.length; a++) {
					if (aEAMCRtypes[a].Obtab === "EQUI") {
						if (flag === "type") {
							crType = aEAMCRtypes[a].CRType;
						} else {
							sObTab = aEAMCRtypes[a].Obtab;
						}
						break;
					}
				}
				// sObTab = mEAMCRtypes.getProperty("/12").Obtab;
				break;
			case "AIWFLOC":
				for (var a = 0; a < aEAMCRtypes.length; a++) {
					if (aEAMCRtypes[a].Obtab === "IFLOT") {
						if (flag === "type") {
							crType = aEAMCRtypes[a].CRType;
						} else {
							sObTab = aEAMCRtypes[a].Obtab;
						}
						break;
					}
				}
				// sObTab = mEAMCRtypes.getProperty("/10").Obtab;
				break;
			case "AIWMSPT":
				for (var a = 0; a < aEAMCRtypes.length; a++) {
					if (aEAMCRtypes[a].Obtab === "IMPTT") {
						if (flag === "type") {
							crType = aEAMCRtypes[a].CRType;
						} else {
							sObTab = aEAMCRtypes[a].Obtab;
						}
						break;
					}
				}
				// sObTab = mEAMCRtypes.getProperty("/8").Obtab;
				break;
			case "AIWMPMI":
				for (var a = 0; a < aEAMCRtypes.length; a++) {
					if (aEAMCRtypes[a].Obtab === "MPLA") {
						if (flag === "type") {
							crType = aEAMCRtypes[a].CRType;
						} else {
							sObTab = aEAMCRtypes[a].Obtab;
						}
						break;
					}
				}
				// sObTab = mEAMCRtyoes.getProperty("/7").Obtab;
				break;
			}

			if (flag === "type") {
				return crType;
			} else {
				return sObTab;
			}
			// return sObTab;
		},

		// attachRequest: function () {
		// 	var classFragmentId = this.getView().createId("clsFrag");
		// 	var itemFragmentId = this.getView().createId("charFrag");

		// 	var vTypeClass = sap.ui.core.Fragment.byId(classFragmentId, "type");
		// 	var vClass = sap.ui.core.Fragment.byId(classFragmentId, "class");
		// 	var vStatus = sap.ui.core.Fragment.byId(classFragmentId, "status");
		// 	var vCharName = sap.ui.core.Fragment.byId(itemFragmentId, "charName");
		// 	var vCharValue = sap.ui.core.Fragment.byId(itemFragmentId, "charValue");

		// 	var that = this;
		// 	vTypeClass.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	vTypeClass.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	vTypeClass.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	vClass.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	vClass.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	vClass.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	vStatus.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	vStatus.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	vStatus.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	vCharName.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	vCharName.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	vCharName.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	vCharValue.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// },

		/*
		 * Function to attach change event handlers
		 * @public
		 */
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

		/*
		 * Function handle valueHelpRequest event handlers
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		valueHelpSelect: function (c) {
			var pObTab = this.getObTab(this.oModelName);
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

		/*
		 * Function to handle change event of class table fields
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onChange: function (c) {
			var pObTab = this.getObTab(this.oModelName);
			var id = c.getSource().getId().split("tskL--");
			id = id[1];

			this.classType = this.Classtype;
			var cvPath = c.getSource().getBindingContext().sPath;
			this._class = c.getSource().getBindingContext().getModel().getProperty(cvPath).Class;

			if (c.getSource().getId().indexOf("type") > -1) {
				ClassUtils.onClassChange("type", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("class") > -1) {
				ClassUtils.onClassChange("class", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("status") > -1) {
				ClassUtils.onClassChange("status", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charName") > -1) {
				ClassUtils.onCharChange("charName", this, c);
			} else if (c.getSource().getId().indexOf("charValue") > -1) {
				ClassUtils.onCharChange("charValue", this, c, pObTab);
			}
		},

		/*
		 * Function to handle change event of char table fields
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onCharChange: function (c) {
			var pObTab = this.getObTab(this.oModelName);
			var id = c.getSource().getId().split("tskL--");
			id = id[1];

			this.classType = this.Classtype;
			var cvPath = c.getSource().getBindingContext().sPath;
			this._class = c.getSource().getBindingContext().getModel().getProperty(cvPath).Class;

			if (c.getSource().getId().indexOf("charValueAdd") > -1) {
				ClassUtils.handleSelCharAdd("charValueAdd", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charValueClear") > -1) {
				ClassUtils.handleCharClear("charValueClear", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("status") > -1) {
				ClassUtils.onClassChange("status", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charName") > -1) {
				ClassUtils.onCharChange("charName", this, c);
			} else if (c.getSource().getId().indexOf("charValue") > -1) {
				ClassUtils.onCharChange("charValue", this, c, pObTab);
			}
		},

		// handleClassRowAdd: function () {
		// 	var pObTab = this.getObTab(this.oModelName);
		// 	ClassUtils.classRowAddPress(this, pObTab);
		// },

		// handleCharRowAdd: function () {
		// 	ClassUtils.charRowAddPress(this);
		// },

		// handleCharRowDelete: function (e) {
		// 	var pObTab = this.getObTab(this.oModelName);
		// 	ClassUtils.bfrCharRowDelete(e, this, pObTab);
		// },

		// handleClassRowDelete: function (e) {
		// 	ClassUtils.classRowDeletePress(e, this);
		// },

		/*
		 * Function to handle Class table row add
		 * @public
		 */
		handleClassRowAdd: function () {
			var pObTab = this.getObTab(this.oModelName);
			ClassUtils.classRowAddPress(this, pObTab);
		},

		/*
		 * Function to handle Char table row add
		 * @public
		 */
		handleCharRowAdd: function () {
			ClassUtils.charRowAddPress(this);
		},

		/*
		 * Function to handle Char table row delete
		 * @public
		 * @param {sap.ui.base.Event} e
		 */
		handleCharRowDelete: function (e) {
			var pObTab = this.getObTab(this.oModelName);
			ClassUtils.charRowDeletePress(e, this, pObTab);
		},

		/*
		 * Function to handle Class table row delete
		 * @public
		 * @param {sap.ui.base.Event} e
		 */
		handleClassRowDelete: function (e) {
			ClassUtils.classRowDeletePress(e, this);
		},

		/*
		 * Function to handle Class table row select
		 * @public
		 * @param {sap.ui.base.Event} e
		 */
		onClassSelect: function (e) {
			ClassUtils.classSelectPress(e, this);
		},

		/*
		 * Function to handle Class table row select
		 * @public
		 * @param {sap.ui.base.Event} e
		 */
		onSelect: function (e) {
			ClassUtils.selectPress(e, this);
		},

		/*
		 * Function to invoke Message box
		 * @param {string} msg - Message
		 * @public
		 */
		invokeMessage: function (msg) {
			this.createMessagePopover(msg, "Error");
			// sap.m.MessageBox.show(msg, {
			// 	title: "Error",
			// 	icon: sap.m.MessageBox.Icon.ERROR,
			// 	onClose: function () {}
			// });
		},

		/*
		 * Function to calculate LAM data
		 * @public
		 */
		calculateLAM: function () {
			var g = this;
			var aLam = g.lam.getModel("AIWLAM").getData();
			var oCrType = sap.ui.getCore().getModel("tempCrTypeModel").getData();
			var aFilters = [new sap.ui.model.Filter("Crtype", "EQ", oCrType.crtype),
				new sap.ui.model.Filter("Lrpid", "EQ", aLam.lam.Lrpid),
				new sap.ui.model.Filter("StartPoint", "EQ", aLam.lam.Strtptatr),
				new sap.ui.model.Filter("EndPoint", "EQ", aLam.lam.Endptatr),
				new sap.ui.model.Filter("LinearLength", "EQ", aLam.lam.Length),
				new sap.ui.model.Filter("LinearUnit", "EQ", aLam.lam.LinUnit),
				new sap.ui.model.Filter("Startmrkr", "EQ", aLam.lam.Startmrkr),
				new sap.ui.model.Filter("Endmrkr", "EQ", aLam.lam.Endmrkr),
				new sap.ui.model.Filter("Mrkdisst", "EQ", aLam.lam.Mrkdisst),
				new sap.ui.model.Filter("Mrkdisend", "EQ", aLam.lam.Mrkdisend),
				new sap.ui.model.Filter("MrkrUnit", "EQ", aLam.lam.MrkrUnit)
			];

			var oFilter;
			if (g.viewName.indexOf("Floc") > -1) {
				oFilter = new sap.ui.model.Filter("Tplnr", "EQ", g.getView().getModel("AIWFLOC").getData().Functionallocation);
				aFilters.push(oFilter);
			} else if (g.viewName.indexOf("Equi") > -1) {
				oFilter = new sap.ui.model.Filter("Equi", "EQ", g.getView().getModel("AIWEQUI").getData().Equnr);
				aFilters.push(oFilter);
			} else if (g.viewName.indexOf("Mspt") > -1) {
				oFilter = new sap.ui.model.Filter("Mspoint", "EQ", g.getView().getModel("AIWMSPT").getData().Mspoint);
				aFilters.push(oFilter);
			} else if (g.viewName.indexOf("Mpmi") > -1) {
				oFilter = new sap.ui.model.Filter("Mpitem", "EQ", g.getView().getModel(g.oModelName).getData().Mitemnumb);
				aFilters.push(oFilter);
			} else {
				oFilter = new sap.ui.model.Filter("Objnetwrk", "EQ", g.getView().getModel("ONDetailModel").getData().Objnetwrk);
				aFilters.push(oFilter);
			}

			var q = "/LAMDerivationSet";
			var m = g.getView().getModel("valueHelp2");
			m.read(q, {
				filters: aFilters,
				success: function (d, e) {
					var result = d.results[0];
					aLam.lam.Lrpid = result.Lrpid;
					aLam.lam.Strtptatr = result.StartPoint;
					aLam.lam.Endptatr = result.EndPoint;
					aLam.lam.Length = result.LinearLength;
					aLam.lam.LinUnit = result.LinearUnit;
					aLam.lam.Startmrkr = result.Startmrkr;
					aLam.lam.Endmrkr = result.Endmrkr;
					aLam.lam.Mrkdisst = result.Mrkdisst;
					aLam.lam.Mrkdisend = result.Mrkdisend;
					aLam.lam.MrkrUnit = result.MrkrUnit;
					g.lam.getModel("AIWLAM").setData(aLam);
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

		/*
		 * Function to handle 'valueHelpRequest' event of Liner Reference Pattern of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onLrpHelp: function (c) {
			ValueHelpRequest.networkLrpVH(c, this);
		},

		/*
		 * Function to handle 'change' event of Liner Reference Pattern of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onLrpChange: function (c) {
			ValueHelpRequest._LRPChange(c, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Start Point of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onStartPointVH: function (c) {
			switch (this.oModelName) {
			case 'AIWFLOC':
				ValueHelpRequest._startPointVH("startPoint", c, this, "IF");
				break;
			case 'AIWEQUI':
				ValueHelpRequest._startPointVH("startPoint", c, this, "IE");
				break;
			case 'AIWMSPT':
				ValueHelpRequest._startPointVH("startPoint", c, this, "ML");
				break;
			case 'AIWListONModel':
				ValueHelpRequest._startPointVH("startPoint", c, this, "NW");
				break;
			case 'itemDetailView': //MPLAN
				ValueHelpRequest._startPointVH("startPoint", c, this, "WP");
				break;
			};
		},

		/*
		 * Function to handle 'change' event of Start Point of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onStartPointChange: function (c) {
			switch (this.oModelName) {
			case 'AIWFLOC':
				ValueHelpRequest._startPointChange("startPoint", c, this, "IF");
				break;
			case 'AIWEQUI':
				ValueHelpRequest._startPointChange("startPoint", c, this, "IE");
				break;
			case 'AIWMSPT':
				ValueHelpRequest._startPointChange("startPoint", c, this, "ML");
				break;
			case 'AIWListONModel':
				ValueHelpRequest._startPointChange("startPoint", c, this, "NW");
				break;
			case 'itemDetailView': //MPLAN
				ValueHelpRequest._startPointChange("startPoint", c, this, "WP");
				break;
			};
		},

		/*
		 * Function to handle 'valueHelpRequest' event of End Point of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onEndPointVH: function (c) {
			switch (this.oModelName) {
			case 'AIWFLOC':
				ValueHelpRequest._endPointVH("endPoint", c, this, "IF");
				break;
			case 'AIWEQUI':
				ValueHelpRequest._endPointVH("endPoint", c, this, "IE");
				break;
			case 'AIWMSPT':
				ValueHelpRequest._endPointVH("endPoint", c, this, "ML");
				break;
			case 'AIWListONModel':
				ValueHelpRequest._endPointVH("endPoint", c, this, "NW");
				break;
			case 'itemDetailView': //MPLAN
				ValueHelpRequest._endPointVH("endPoint", c, this, "WP");
				break;
			};
		},

		/*
		 * Function to handle 'change' event of End Point of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onEndPointChange: function (c) {
			switch (this.oModelName) {
			case 'AIWFLOC':
				ValueHelpRequest._endPointChange("endPoint", c, this, "IF");
				break;
			case 'AIWEQUI':
				ValueHelpRequest._endPointChange("endPoint", c, this, "IE");
				break;
			case 'AIWMSPT':
				ValueHelpRequest._endPointChange("endPoint", c, this, "ML");
				break;
			case 'AIWListONModel':
				ValueHelpRequest._endPointChange("endPoint", c, this, "NW");
				break;
			case 'itemDetailView': //MPLAN
				ValueHelpRequest._endPointChange("endPoint", c, this, "WP");
				break;
			};
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Unit of Measure of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onLamUOMVH: function (c) {
			ValueHelpRequest.lamUOMVH("uom", c, this);
		},

		/*
		 * Function to handle 'change' event of Unit of Measure of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onUomChange: function (c) {
			ValueHelpRequest._uomMarkerDistUnitChange("uom", c, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Marker Distance Unit of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onMarkerDistUnit: function (c) {
			ValueHelpRequest.lamUOMVH("mrkrDistUnit", c, this);
		},

		/*
		 * Function to handle 'change' event of Marker Distance Unit of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onMarkerUnitChange: function (c) {
			ValueHelpRequest._uomMarkerDistUnitChange("mrkrDistUnit", c, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Start Marker of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onStartMarkerVH: function (c) {
			switch (this.oModelName) {
			case 'AIWFLOC':
				ValueHelpRequest._startPointVH("startMarker", c, this, "IF");
				break;
			case 'AIWEQUI':
				ValueHelpRequest._startPointVH("startMarker", c, this, "IE");
				break;
			case 'AIWMSPT':
				ValueHelpRequest._startPointVH("startMarker", c, this, "ML");
				break;
			case 'AIWListONModel':
				ValueHelpRequest._startPointVH("startMarker", c, this, "NW");
				break;
			case 'itemDetailView': //MPLAN
				ValueHelpRequest._startPointVH("startMarker", c, this, "WP");
				break;
			};
		},

		/*
		 * Function to handle 'change' event of Start Marker of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onStartMarkerChange: function (c) {
			switch (this.oModelName) {
			case 'AIWFLOC':
				ValueHelpRequest._startPointChange("startMarker", c, this, "IF");
				break;
			case 'AIWEQUI':
				ValueHelpRequest._startPointChange("startMarker", c, this, "IE");
				break;
			case 'AIWMSPT':
				ValueHelpRequest._startPointChange("startMarker", c, this, "ML");
				break;
			case 'AIWListONModel':
				ValueHelpRequest._startPointChange("startMarker", c, this, "NW");
				break;
			case 'itemDetailView': //MPLAN
				ValueHelpRequest._startPointChange("startMarker", c, this, "WP");
				break;
			};
		},

		/*
		 * Function to handle 'valueHelpRequest' event of End Marker of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onEndMarkerVH: function (c) {
			switch (this.oModelName) {
			case 'AIWFLOC':
				ValueHelpRequest._endPointVH("endMarker", c, this, "IF");
				break;
			case 'AIWEQUI':
				ValueHelpRequest._endPointVH("endMarker", c, this, "IE");
				break;
			case 'AIWMSPT':
				ValueHelpRequest._endPointVH("endMarker", c, this, "ML");
				break;
			case 'AIWListONModel':
				ValueHelpRequest._endPointVH("endMarker", c, this, "NW");
				break;
			case 'itemDetailView': //MPLAN
				ValueHelpRequest._endPointVH("endMarker", c, this, "WP");
				break;
			};
		},

		/*
		 * Function to handle 'change' event of End Marker of LAM
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onEndMarkerChange: function (c) {
			switch (this.oModelName) {
			case 'AIWFLOC':
				ValueHelpRequest._endPointChange("endMarker", c, this, "IF");
				break;
			case 'AIWEQUI':
				ValueHelpRequest._endPointChange("endMarker", c, this, "IE");
				break;
			case 'AIWMSPT':
				ValueHelpRequest._endPointChange("endMarker", c, this, "ML");
				break;
			case 'AIWListONModel':
				ValueHelpRequest._endPointChange("endMarker", c, this, "NW");
				break;
			case 'itemDetailView': //MPLAN
				ValueHelpRequest._endPointChange("endMarker", c, this, "WP");
				break;
			};
		},

		/*
		 * Function to handle 'change' event of Length of LAM
		 * @public
		 */
		onLengthChange: function () {
			var AIWLAM = this.lam.getModel("AIWLAM");
			var aLam = AIWLAM.getData();
			if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
				this.calculateLAM();
			}
		},

		/*
		 * Function to handle 'change' event of Distance Start of LAM
		 * @public
		 */
		onDistStartChange: function () {
			var AIWLAM = this.lam.getModel("AIWLAM");
			var aLam = AIWLAM.getData();
			if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
				this.calculateLAM();
			}
		},

		/*
		 * Function to handle 'change' event of Distance End of LAM
		 * @public
		 */
		onDistEndChange: function () {
			var AIWLAM = this.lam.getModel("AIWLAM");
			var aLam = AIWLAM.getData();
			if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
				this.calculateLAM();
			}
		},

		/*
		 * To read Characteristic Unit
		 * @public
		 * @param {object} f
		 * @param {object} g
		 * @param {string} value
		 */
		readCharUnit: function (f, g, value) {
			var sPath = "/DerCharUnitSet('" + value + "')";
			var oModel = g.getView().getModel("valueHelp");
			var fnSuccess = function (d) {
				g.BusyDialog.close();
				if (d) {
					f.Mseh6 = d.Mseh3;
					f.Msehl = d.Msehl;
					f.Decim = d.Decim.toString();
				} else {
					f.Mseh6 = "";
					f.Msehl = "";
					f.Decim = "";
				}
				g.getModel(g.oModelName).refresh();
			};
			var fnError = function (e) {
				g.BusyDialog.close();
				var b = JSON.parse(e.response.body);
				var d = b.error.message.value;
			};
			g.BusyDialog.open();
			this._readData(sPath, oModel, fnSuccess, fnError, []);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of City Address
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onCityAddrVH: function (oEvent) {
			ValueHelpRequest.CityAddrVH(oEvent.getSource().getModel(this.oModelName).getData(), this);
		},

		/*
		 * Function to handle 'change' event of City Address
		 * @public
		 * @param {sap.ui.base.Event} c
		 */
		onCityAddrChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue !== "" && sValue !== undefined) {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeCityAddr(oEvent, g);
			}
		},

		///////////////////// International Address ///////////////////////

		/*
		 * To read Address version data
		 * @public
		 * @param {object} g
		 */
		readAddressVersion: function (g) {
			var sPath = "/AddrVerSet";
			var oModel = g.getView().getModel("valueHelp");
			var fnSuccess = function (d) {
				if (d.results.length > 0) {
					var oJson = new JSONModel([]);
					oJson.setData(d.results);
					g.getView().setModel(oJson, "AddressVersionModel");
				}
			};
			var fnError = function () {};
			this._readData(sPath, oModel, fnSuccess, fnError);
		},

		/*
		 * To add International Address
		 * @public
		 */
		handleIntlAddrAdd: function () {
			var data = this.getView().getModel(this.oModelName).getData();
			if (data.RefPosta === "") {
				// sap.m.MessageBox.show("Enter Country Key", {
				// 	title: "Error",
				// 	icon: sap.m.MessageBox.Icon.ERROR,
				// 	onClose: function () {}
				// });
				this.createMessagePopover("Enter Country Key", "Error");
				return;
			}
			if (this.oModelName === "AIWEQUI") {
				var oIntlAddr = {
					"AdNation": "",
					"AdNationEnable": true,
					"Equi": data.Equnr,
					"Equiaddrn": "",
					"Buildingi": "",
					"City1i": "",
					"Floori": "",
					"Homecityi": "",
					"Housenr1i": "",
					"Housenr2i": "",
					"Locationi": "",
					"Name1i": "",
					"Name2i": "",
					"Name3i": "",
					"Name4i": "",
					"Nametexti": "",
					"NameCoi": "",
					"Poboxlbyi": "",
					"Remarki": "",
					"Roomnumi": "",
					"Sort1i": "",
					"Sort2i": "",
					"Streeti": "",
					"Stsuppl1i": "",
					"Stsuppl2i": "",
					"Stsuppl3i": "",
					"Titlei": "",
					"NationTex": "",
					"City1iVS": "None",
					"StreetiVS": "None"
				};
			} else if (this.oModelName === "AIWFLOC") {
				var oIntlAddr = {
					"AdNation": "",
					"AdNationEnable": true,
					"Funcloc": data.Functionallocation,
					"Funclocan": "",
					"Buildingi": "",
					"City1i": "",
					"Floori": "",
					"Homecityi": "",
					"Housenr1i": "",
					"Housenr2i": "",
					"Locationi": "",
					"Name1i": "",
					"Name2i": "",
					"Name3i": "",
					"Name4i": "",
					"Nametexti": "",
					"NameCoi": "",
					"Poboxlbyi": "",
					"Remarki": "",
					"Roomnumi": "",
					"Sort1i": "",
					"Sort2i": "",
					"Streeti": "",
					"Stsuppl1i": "",
					"Stsuppl2i": "",
					"Stsuppl3i": "",
					"Titlei": "",
					"NationTex": "",
					"City1iVS": "None",
					"StreetiVS": "None"
				};
			}

			data.intlAddr.push(oIntlAddr);
			this.getView().getModel(this.oModelName).refresh();
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Street of International Address
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onStreetVH: function (oEvent) {
			ValueHelpRequest.streetVH(oEvent, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of City of International Address
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onCityVH: function (oEvent) {
			ValueHelpRequest.cityVH(oEvent, this);
		},

		/*
		 * Function to handle 'change' event of Street of International Address
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onStreetIChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue !== "" && sValue !== undefined) {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeStreetI(oEvent, g);
			}
		},

		/*
		 * Function to handle 'change' event of City of International Address
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onCityIChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue !== "" && sValue !== undefined) {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeCityI(oEvent, g);
			}
		},

		/*
		 * Method to handle International Address row press
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleIntlAddrPress: function (oEvent) {
			var g = this;
			var tempModelName = this.oModelName;
			if (g.viewName.indexOf("Approve") > -1) {
				var path = oEvent.getSource().getBindingContext("AIWAPPROVE").sPath;
			} else {
				var path = oEvent.getSource().getBindingContext(this.oModelName).sPath;
			}

			if (g.viewName.indexOf("Change") > -1) {
				sap.ui.getCore().setModel(this.getView().getModel(this.oModelName), "EQFLChangeModel");
				tempModelName = "EQFLChangeModel";
			}

			var addrEnable = true;
			if (g.viewName.indexOf("Equi") > -1) {
				addrEnable = g.getView().getModel("equiAddressView").getData().enabled;
			} else if (g.viewName.indexOf("Floc") > -1) {
				addrEnable = g.getView().getModel("flocAddressView").getData().enabled;
			}

			this.getRouter().navTo("intlAddr", {
				modelName: tempModelName,
				sCrStatus: g.sCrStatus,
				itemPath: encodeURIComponent(path),
				viewName: this.viewName,
				rowIndex: encodeURIComponent(this.rowIndex),
				addrEnable: addrEnable
			});
		},

		/*
		 * Method to handle International Address row delete
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleIntlAddrDelete: function (oEvent) {
			var g = this;
			var path = oEvent.getParameter('listItem').getBindingContext(this.oModelName).sPath;
			path = path.substring(path.lastIndexOf('/') + 1);

			var aIntlAddr = oEvent.getSource().getModel(this.oModelName).getData().intlAddr;
			aIntlAddr.splice(path, 1);

			this.getView().getModel(this.oModelName).refresh();
		},

		/*
		 * Function to handle 'change' event of Address version of International Address
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onAddrVersionChange: function (oEvent) {
			var g = this;
			var oSource = oEvent.getSource();
			var sIntlPath = oEvent.getSource().getParent().getBindingContext(this.oModelName).getPath();
			var sIntlIndex = parseInt(sIntlPath.split("/")[2]);
			var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
			var existFlag = false;

			var data = this.getView().getModel(this.oModelName).getData();
			var aIntlAddr = data.intlAddr;
			for (var i = 0; i < aIntlAddr.length; i++) {
				if (i === sIntlIndex) {
					continue;
				}

				if (aIntlAddr[i].AdNation === sSelectedKey) {
					existFlag = true;
					// sap.m.MessageBox.show("Address Version already exists", {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {
					// 		aIntlAddr[sIntlIndex].AdNation = "";
					// 		oSource.setSelectedKey();
					// 	}
					// });
					g.createMessagePopover("Address Version already exists", "Error");
					aIntlAddr[sIntlIndex].AdNation = "";
					oSource.setSelectedKey();
					break;
				}
			}

			if (!existFlag) {
				aIntlAddr[sIntlIndex].AdNation = oSource.getSelectedKey();
				aIntlAddr[sIntlIndex].AdNationEnable = false;
				this.getView().getModel(this.oModelName).setData(data);
			}
		},

		/*
		 * Function to read Class Type
		 * @public
		 * @param {object} g
		 */
		getClassType: function (g) {
			var m = g.getView().getModel("valueHelp");
			var sObtab = g.getObTab(g.oModelName);
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

		/*
		 * Function to read derivation data of EQ, FL & WC
		 * @public
		 */
		dataDerivationFlow: function () {
			var g = this;
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();

			var sPayload = {
				"ChangeRequestType": "AIWEAM0P",
				"CrDescription": "",
				"Reason": "01",
				"DeriveData": true,
				"IsDraft": "",
				"Messages": [],
				"FuncLoc": [],
				"FLAddr": [],
				"FLAddrI": [],
				"FLALTLBEL": [],
				"FLLAM": [],
				"FLClass": [],
				"FLVal": [],
				"Equipment": [],
				"EqAddr": [],
				"EqAddrI": [],
				"EqPRT": [],
				"EqLAM": [],
				"EqDFPS": [],
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
				"OLVal": [],
				"FLLAMCH": [],
				"EqLAMCH": [],
				"EqDFPS": []
			};

			if (AIWFLOCModel.length > 0) {
				for (var a = 0; a < AIWFLOCModel.length; a++) {
					if (AIWFLOCModel[a].Functionallocation === "" || AIWFLOCModel[a].Functionallocation === undefined) {
						return;
					}
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
						"Adrnr": AIWFLOCModel[a].Adrnr,
						"Adrnri": AIWFLOCModel[a].Adrnri,
						"Deact": AIWFLOCModel[a].Deact,
						Modeldesc: AIWFLOCModel[a].Modeldesc,
						Modelref: AIWFLOCModel[a].Modelref,
						Modelrver: AIWFLOCModel[a].Modelrver,
						Modelext: AIWFLOCModel[a].Modelext,
						Modelname: AIWFLOCModel[a].Modelname,
						Modelver: AIWFLOCModel[a].Modelver,

					};

					if (AIWFLOCModel[a].viewParameter === "create") {
						sFuncLoc.Type = true;
					}

					var aFLDOI = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
					if (aFLDOI && aFLDOI.length > 0) {
						var aDOIFields = aFLDOI[a].DOI;
						// sFuncLoc.Begrui = aDOIFields[0].instLoc ? "H" : "D";
						sFuncLoc.Swerki = aDOIFields[0].instLoc ? "H" : (aDOIFields[0].maintenance ? "D" : "");
						sFuncLoc.Storti = aDOIFields[1].instLoc ? "H" : (aDOIFields[1].maintenance ? "D" : "");
						// sFuncLoc.Msgrpi = aDOIFields[3].instLoc ? "H" : "D";
						sFuncLoc.Beberi = aDOIFields[2].instLoc ? "H" : (aDOIFields[2].maintenance ? "D" : "");
						sFuncLoc.Ppsidi = aDOIFields[3].instLoc ? "H" : (aDOIFields[3].maintenance ? "D" : "");
						sFuncLoc.Abckzi = aDOIFields[4].instLoc ? "H" : (aDOIFields[4].maintenance ? "D" : "");
						sFuncLoc.Bukrsi = aDOIFields[5].instLoc ? "H" : (aDOIFields[5].maintenance ? "D" : "");
						// sFuncLoc.Gsberi = aDOIFields[8].instLoc ? "H" : "D";
						// sFuncLoc.Anlnri = aDOIFields[9].instLoc ? "H" : "D";
						// sFuncLoc.Anlnri = aDOIFields[10].instLoc ? "H" : "D";
						sFuncLoc.Kostli = aDOIFields[6].instLoc ? "H" : (aDOIFields[6].maintenance ? "D" : "");
						sFuncLoc.Kokrsi = aDOIFields[7].instLoc ? "H" : (aDOIFields[7].maintenance ? "D" : "");
						// sFuncLoc.Proidi = aDOIFields[13].instLoc ? "H" : "D";
						// sFuncLoc.Daufni = aDOIFields[14].instLoc ? "H" : "D";
						// sFuncLoc.Aufnri = aDOIFields[15].instLoc ? "H" : "D";
						sFuncLoc.Iwerki = aDOIFields[8].instLoc ? "H" : (aDOIFields[8].maintenance ? "D" : "");
						sFuncLoc.Ingrpi = aDOIFields[9].instLoc ? "H" : (aDOIFields[9].maintenance ? "D" : "");
						sFuncLoc.Lgwidi = aDOIFields[10].instLoc ? "H" : (aDOIFields[10].maintenance ? "D" : "");
						// sFuncLoc.Swerki = aDOIFields[19].instLoc ? "H" : "D";
						// sFuncLoc.RbnrI = aDOIFields[20].instLoc ? "H" : "D";
						// sFuncLoc.Submti = aDOIFields[21].instLoc ? "H" : "D";
						// sFuncLoc.Einzli = aDOIFields[22].instLoc ? "H" : "D";
						// sFuncLoc.Iequii = aDOIFields[23].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[24].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[25].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[26].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[27].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[28].instLoc ? "H" : "D";
						sFuncLoc.Adrnri = aDOIFields[12].instLoc ? "H" : (aDOIFields[12].maintenance ? "D" : "");
					}
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

					if (AIWFLOCModel[a].altlbl) {
						if (g.AltLblDerv === "2" && AIWFLOCModel[a].altlbl.length > 0) {
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
					}

					if (AIWFLOCModel[a].Floccategory === "L" && AIWFLOCModel[a].lam) {
						var sFLLAM = {
							"Funcloc": AIWFLOCModel[a].Functionallocation,
							"Lrpid": AIWFLOCModel[a].lam.Lrpid,
							"Strtptatr": AIWFLOCModel[a].lam.Strtptatr,
							"Endptatr": AIWFLOCModel[a].lam.Endptatr,
							"Length": AIWFLOCModel[a].lam.Length,
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

					var aFLLinChar = AIWFLOCModel[a].linearChar;
					if (aFLLinChar) {
						if (aFLLinChar.length > 0) {
							var alinearChar = $.map(aFLLinChar, function (obj) {
								return $.extend(true, {}, obj);
							});
							for (var c = 0; c < alinearChar.length; c++) {
								delete alinearChar[c].linCharEnable;
								alinearChar[c].Funcloc = AIWFLOCModel[a].Functionallocation;
								sPayload.FLLAMCH.push(alinearChar[c]);
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
						"Adrnr": AIWEQUIModel[d].Adrnr,
						"Adrnri": AIWEQUIModel[d].Adrnri,

						"Funcid": AIWEQUIModel[d].Funcid, // Config Control data
						"Frcfit": AIWEQUIModel[d].Frcfit,
						"Frcrmv": AIWEQUIModel[d].Frcrmv,
						"Modelid": "",
						Ppeguid: AIWEQUIModel[d].Ppeguid,
					};

					var aEQDOI = sap.ui.getCore().getModel("dataOriginMOP").getData().EQ;
					if (aEQDOI && aEQDOI.length > 0) {
						var aDOIFields = aEQDOI[d].DOI;
						// sEquipment.Begrui = aDOIFields[0].instLoc ? "R" : "D";
						sEquipment.Swerki = aDOIFields[0].instLoc ? "R" : (aDOIFields[0].maintenance ? "D" : "");
						sEquipment.Storti = aDOIFields[1].instLoc ? "R" : (aDOIFields[1].maintenance ? "D" : "");
						// sEquipment.Msgrpi = aDOIFields[3].instLoc ? "R" : "D";
						sEquipment.Beberi = aDOIFields[2].instLoc ? "R" : (aDOIFields[2].maintenance ? "D" : "");
						sEquipment.Ppsidi = aDOIFields[3].instLoc ? "R" : (aDOIFields[3].maintenance ? "D" : "");
						sEquipment.Abckzi = aDOIFields[4].instLoc ? "R" : (aDOIFields[4].maintenance ? "D" : "");
						// sEquipment.Eqfnri = aDOIFields[7].instLoc ? "R" : "D";
						// sEquipment.Gsberi = aDOIFields[8].instLoc ? "R" : "D";
						sEquipment.Kostli = aDOIFields[5].instLoc ? "R" : (aDOIFields[5].maintenance ? "D" : "");
						// sEquipment.Proidi = aDOIFields[10].instLoc ? "R" : "D";
						// sEquipment.Daufni = aDOIFields[11].instLoc ? "R" : "D";
						// sEquipment.Aufnri = aDOIFields[12].instLoc ? "R" : "D";
						// sEquipment.Ppsidi = aDOIFields[13].instLoc ? "R" : "D";
						sEquipment.Iwerki = aDOIFields[6].instLoc ? "R" : (aDOIFields[6].maintenance ? "D" : "");
						sEquipment.Ingrpi = aDOIFields[7].instLoc ? "R" : (aDOIFields[7].maintenance ? "D" : "");
						sEquipment.Gewrki = aDOIFields[8].instLoc ? "R" : (aDOIFields[8].maintenance ? "D" : "");
						// sEquipment.Gewrki = aDOIFields[16].instLoc ? "R" : "D";
						// sEquipment.RbnrI = aDOIFields[17].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[18].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[19].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[20].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[21].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[22].instLoc ? "R" : "D";
						sEquipment.Adrnri = aDOIFields[10].instLoc ? "R" : (aDOIFields[10].maintenance ? "D" : "");
					}

					if (AIWEQUIModel[d].viewParameter === "create") {
						sEquipment.Type = true;
					}
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
							"Length": AIWEQUIModel[d].lam.Length,
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

					var aIntlAddr = AIWEQUIModel[d].intlAddr;
					if (aIntlAddr) {
						for (var z = 0; z < aIntlAddr.length; z++) {
							sPayload.EqAddrI.push(aIntlAddr[z]);
						}
					}

					if (AIWEQUIModel[d].dfps) {
						var oEqDFPS = {
							Equi: AIWEQUIModel[d].Equnr,
							DeviceId: AIWEQUIModel[d].dfps.Tailno,
							Topsiteid: AIWEQUIModel[d].dfps.Area,
							Topsitede: AIWEQUIModel[d].dfps.AreaDesc,
							AreaPro: AIWEQUIModel[d].dfps.AreaPrfl,
							SiteId: AIWEQUIModel[d].dfps.Site,
							SiteDesc: AIWEQUIModel[d].dfps.SiteDesc,
							SitePro: AIWEQUIModel[d].dfps.SitePrfl,
							MpoId: AIWEQUIModel[d].dfps.MPO,
							MpoDescr: AIWEQUIModel[d].dfps.MPODesc,
							RicId: AIWEQUIModel[d].dfps.RIC,
							RicDescr: AIWEQUIModel[d].dfps.RICDesc,
							ModelId: AIWEQUIModel[d].dfps.ModelId,
							ModelDes: AIWEQUIModel[d].dfps.ModelIdDesc,
							Foreignob: formatter.truetoX(AIWEQUIModel[d].dfps.ForeignEq),
							TecState: AIWEQUIModel[d].dfps.TechSts,
							DepState: AIWEQUIModel[d].dfps.OperSts,
							DfpsRmrk: AIWEQUIModel[d].dfps.Remark
						};
						sPayload.EqDFPS.push(oEqDFPS);
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

					var aFLLinChar = AIWEQUIModel[d].linearChar;
					if (aFLLinChar) {
						if (aFLLinChar.length > 0) {
							var alinearChar = $.map(aFLLinChar, function (obj) {
								return $.extend(true, {}, obj);
							});
							for (var c = 0; c < alinearChar.length; c++) {
								delete alinearChar[c].linCharEnable;
								alinearChar[c].Equi = AIWEQUIModel[d].Equnr;
								sPayload.EqLAMCH.push(alinearChar[c]);
							}
						}
					}

					var aAinMOP = sap.ui.getCore().getModel("ainMOP").getData();
					if (aAinMOP) {
						for (var z = 0; z < aAinMOP.length; z++) {
							if (sEquipment.Equnr === aAinMOP[z].key) {
								sEquipment.Modelid = aAinMOP[z].AIN.Modelid;
							}
						}
					}
				}
			}

			if (AIWListWCData.length > 0) {
				for (var i = 0; i < AIWListWCData.length; i++) {
					var mHeader = {
						"Werks": AIWListWCData[i].plant,
						"Arbpl": AIWListWCData[i].wc,
						"Txtmi": AIWListWCData[i].wcDesc,
						"Verwe": AIWListWCData[i].wcCat,
						"Crveran": AIWListWCData[i].person,
						"Planv": AIWListWCData[i].usg,
						"Vgwts": AIWListWCData[i].stdVal,
						"Crsteus": AIWListWCData[i].ctrlKey
					};
					if (AIWListWCData[i].hasOwnProperty("Type")) {
						if (AIWListWCData[i].Type === "X") {
							mHeader.Type = "X";
						}

					}
					sPayload.Workcenter.push(mHeader);

					if (AIWListWCData[i].cost) {
						for (var j = 0; j < AIWListWCData[i].cost.length; j++) {
							var mCost = {
								"Werks": AIWListWCData[i].cost[j].CrKokrs,
								"Arbpl": AIWListWCData[i].wc,
								"CrKostl": AIWListWCData[i].cost[j].CrKostl,
								"Costcentxt": AIWListWCData[i].cost[j].Costcentxt,
								"CrLstar": AIWListWCData[i].cost[j].CrLstar,
								"Forn1": AIWListWCData[i].cost[j].Forn1,
								"ActvttypeTxt": AIWListWCData[i].cost[j].ActvttypeTxt,
								"Frmltxt": AIWListWCData[i].cost[j].Frmltxt
							};
							sPayload.WCCost.push(mCost);
						}
					}

					var sWCClassList = AIWListWCData[i].classItems;
					if (sWCClassList) {
						if (sWCClassList.length > 0) {
							for (var e = 0; e < sWCClassList.length; e++) {
								var sWCClass = {
									"Arbpl": AIWListWCData[i].wc,
									"Werks": AIWListWCData[i].plant,
									"Classtype": sWCClassList[e].Classtype,
									"Class": sWCClassList[e].Class,
									// "Clstatus1": sWCClassList[e].Clstatus1
								};
								sPayload.ClassWC.push(sWCClass);
							}
						}
					}

					var sWCCharList = AIWListWCData[i].characteristics;
					if (sWCCharList) {
						if (sWCCharList.length > 0) {
							for (var f = 0; f < sWCCharList.length; f++) {
								var sWCVal = {
									"Arbpl": AIWListWCData[i].wc,
									"Werks": AIWListWCData[i].plant,
									"Atnam": sWCCharList[f].Atnam,
									"Textbez": sWCCharList[f].Textbez,
									"Atwrt": sWCCharList[f].Atwrt,
									"Class": sWCCharList[f].Class
								};
								sPayload.ValueWC.push(sWCVal);
							}
						}
					}

				}
			}

			this.BusyDialog.open();
			var fnSuccess = function (r) {
				g.BusyDialog.close();
				var sPreviousHash = History.getInstance().getPreviousHash();
				if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					g.getRouter().navTo("main", {}, true);
				}

				if (r.FuncLoc.results.length > 0) {
					var sArray = [];
					for (var i = 0; i < r.FuncLoc.results.length; i++) {
						var h = r.FuncLoc.results[i];
						var sModelData = {
							intlAddr: [],
							altlbl: [],
							classItems: [],
							characteristics: [],
							linearChar: [],
							FunctionallocationVS: "None",
							FunctionallocationVST: "",
							FlocdescriptionVS: "None",
							FlocdescriptionVST: "",
							StrucindicatorVS: "None",
							StrucindicatorVST: "",
							FloccategoryVS: "None",
							FloccategoryVST: "",
							SupFunctionallocationVS: "None",
							SupFunctionallocationVST: "",
							MaintplantVS: "None",
							MaintplantVST: "",
							StsmEquiVS: "None",
							StsmEquiVST: "",
							UstwEquiVS: "None",
							UstwEquiVST: "",
							UswoEquiVS: "None",
							UswoEquiVST: "",
							TechnicalObjectTypVS: "None",
							TechnicalObjectTypVST: "",
							LocationVS: "None",
							LocationVST: "",
							AbckzVS: "None",
							AbckzVST: "",
							MainArbplVS: "None",
							MainArbplVST: "",
							BeberFlVS: "None",
							BeberFlVST: "",
							BukrsVS: "None",
							BukrsVST: "",
							KostlVS: "None",
							KostlVST: "",
							WerksVS: "None",
							WerksVST: "",
							IngrpVS: "None",
							IngrpVST: "",
							ArbplVS: "None",
							ArbplVST: "",
							ConstrTypeVS: "None",
							ConstrTypeVST: "",
							RefPostaVS: "None",
							RefPostaVST: "",
							LangucodeVS: "None",
							LangucodeVST: "",
							TimeZoneVS: "None",
							TimeZoneVST: "",

							TplnrEnabled: true,
							FunctionalLocEnabled: true,
							FlocCatEnabled: true,
							StrucIndEnabled: true,
							MaintplantEnabled: true,
							BukrsEnabled: true
						};
						sModelData.Functionallocation = h.Tplnr;
						sModelData.Flocdescription = h.Txtmi;
						sModelData.EditMask = h.EditMask;
						sModelData.Hierarchy = h.Hierarchy;
						sModelData.Floccategory = h.Fltyp;
						sModelData.FlocCategoryDesc = h.Flttx;
						sModelData.Strucindicator = h.TplkzFlc;
						sModelData.StrucIndicatorDesc = h.Tplxt;
						sModelData.SupFunctionallocation = h.Tplma; // Sup FuncLoc
						sModelData.SupFlocdescription = h.Supflocdesc; // Sup FlocDescription
						sModelData.Stattext = h.Stattext; // System Status
						sModelData.StsmEqui = h.StsmFloc; // Status Profile
						sModelData.StsmEquiDesc = h.Statproftxt; // Status Profile Description
						sModelData.UstwEqui = h.UstwFloc; // Status with Status Number
						sModelData.UswoEqui = h.UswoFloc; // Status without Status Number
						sModelData.UstaEqui = h.UstaFloc; // User Status
						sModelData.TechnicalObjectTyp = h.Eqart; // TechnicalObjectTyp
						sModelData.Description = h.Eartx; // TechnicalObjectTyp Description
						sModelData.Maintplant = h.Swerk;
						sModelData.MaintplantDesc = h.Plantname;
						sModelData.Location = h.StorFloc; // Location
						sModelData.Locationdesc = h.Locationdesc; // Location Description
						sModelData.BeberFl = h.BeberFl; // Plant Section
						sModelData.Fing = h.Fing; // Person responsible
						sModelData.Tele = h.Tele; // Phone
						sModelData.Arbpl = h.Arbplfloc; // Work Center
						sModelData.Ktext = h.Workcenterdesc; // Work Center Description
						sModelData.WcWerks = h.Wergwfloc; // Work center Plant
						sModelData.MainArbpl = h.Gewrkfloc; // Main Work Center
						sModelData.MainKtext = h.MainWcDesc; // Plant Work Center
						sModelData.MainWerks = h.MainWcPlant; // Name
						sModelData.Abckz = h.Abckzfloc;
						sModelData.Abctx = h.Abctx;
						sModelData.Bukrs = h.Bukrsfloc;
						sModelData.Butxt = h.Butxt;
						sModelData.City = h.City;
						sModelData.Kostl = h.KostFloc; // Cost Center
						sModelData.Kokrs = h.KokrFloc; // ccPart1
						sModelData.Mctxt = h.Contareaname; // Name
						sModelData.Werks = h.PlntFloc; // Planning Plant
						sModelData.Planningplantdes = h.Planningplantdes; // Planning Plant Description
						sModelData.Ingrp = h.Ingrp; // Planner Group
						sModelData.Innam = h.Plannergrpdesc; // Planner Group Description
						sModelData.ConstrType = h.Submtiflo; // Construction Type
						sModelData.ConstructionDesc = h.Constdesc; // Construction Description
						sModelData.menuAction = h.IsMenu;
						sModelData.Adrnr = h.Adrnr;
						sModelData.Adrnri = h.Adrnri;
						sModelData.Deact = h.Deact;
						sModelData.Alkey = h.Alkey;
						sModelData.Altxt = h.Altxt;
						sModelData.Modeldesc = h.Modeldesc;
						sModelData.Modelref = h.Modelref;
						sModelData.Modelrver = h.Modelrver;
						sModelData.Modelext = h.Modelext;
						sModelData.Modelname = h.Modelname;
						sModelData.Modelver = h.Modelver;

						if (h.Type === true) {
							sModelData.viewParameter = "create";
						}
						if (h.Type === false) {
							sModelData.viewParameter = "change";
							if (sModelData.Floccategory === "" || sModelData.Floccategory === undefined) {
								sModelData.FlocCatEnabled = true;
							} else {
								sModelData.FlocCatEnabled = false;
							}
							if (sModelData.Strucindicator === "" || sModelData.Strucindicator === undefined) {
								sModelData.StrucIndEnabled = true;
							} else {
								sModelData.StrucIndEnabled = false;
							}
							sModelData.FunctionalLocEnabled = false;
						}

						if (h.Swerk !== "") {
							// sModelData.MaintplantEnabled = false;
							sModelData.BukrsEnabled = false;
						} else {
							sModelData.MaintplantEnabled = true;
							sModelData.BukrsEnabled = true;
						}

						var aFlLam = r.FLLAM.results;
						if (aFlLam) {
							for (var x = 0; x < aFlLam.length; x++) {
								if (aFlLam[x].Funcloc === sModelData.Functionallocation) {
									var oFLLAM = {
										"Funcloc": aFlLam[x].Funcloc,
										"Lrpid": aFlLam[x].Lrpid,
										"LrpidDesc": aFlLam[x].LrpDescr,
										"Strtptatr": aFlLam[x].Strtptatr,
										"Endptatr": aFlLam[x].Endptatr,
										"Length": aFlLam[x].Length,
										"LinUnit": aFlLam[x].LinUnit,
										"LinUnitDesc": aFlLam[x].Uomtext,
										"Startmrkr": aFlLam[x].Startmrkr,
										"Endmrkr": aFlLam[x].Endmrkr,
										"Mrkdisst": aFlLam[x].Mrkdisst,
										"Mrkdisend": aFlLam[x].Mrkdisend,
										"MrkrUnit": aFlLam[x].MrkrUnit,
										"LamDer": aFlLam[x].LamDer
									};
									sModelData.lam = oFLLAM;
									break;
								}
							}
						}

						if (r.FLAddr) {
							if (r.FLAddr.results) {
								var sAddress = r.FLAddr.results;
								if (sAddress) {
									if (sAddress.length > 0) {
										for (var j = 0; j < sAddress.length; j++) {
											if (sModelData.Functionallocation === sAddress[j].Funcloc) {
												var oAddressModel = sap.ui.getCore().getModel("flocAddressView");
												var oAddressData = oAddressModel.getData();
												var mCountFlag = true;
												var sObj, sMatchIndex;
												if (oAddressData.length > 0) {
													for (var sa = 0; sa < oAddressData.length; sa++) {
														if (sModelData.Functionallocation === oAddressData[sa].Functionallocation) {
															mCountFlag = false;
															sMatchIndex = sa;
															break;
														}
													}
												}
												if (mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
													sObj = {
														Functionallocation: sModelData.Functionallocation,
														IsEditable: sAddress[j].IsEditable
													};
													oAddressData.push(sObj);
													oAddressModel.setData(oAddressData);
												}
												if (!mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
													oAddressData[sMatchIndex].Functionallocation = sModelData.Functionallocation;
													oAddressData[sMatchIndex].IsEditable = sAddress[j].IsEditable; //sModelData.IsEditable;
													oAddressModel.setData(oAddressData);
												}

												sModelData.Title = sAddress[j].Titletxt; // searchTerm1
												sModelData.TitleCode = sAddress[j].Title; // searchTerm1
												sModelData.Name1 = sAddress[j].Name1; // searchTerm1
												sModelData.Name2 = sAddress[j].Name2; // searchTerm1
												sModelData.Name3 = sAddress[j].Name3; // searchTerm1
												sModelData.Name4 = sAddress[j].Name4; // searchTerm1
												sModelData.Sort1 = sAddress[j].Sort1; // searchTerm1
												sModelData.Sort2 = sAddress[j].Sort2; // searchTerm2
												sModelData.NameCo = sAddress[j].NameCo; // Company 
												sModelData.PostCod1 = sAddress[j].PostCod1;
												sModelData.City1 = sAddress[j].City1; // City
												sModelData.Building = sAddress[j].Building;
												sModelData.Floor = sAddress[j].Floor;
												sModelData.Roomnum = sAddress[j].Roomnum;
												sModelData.Street = sAddress[j].Street;
												sModelData.Strsuppl1 = sAddress[j].Strsuppl1;
												sModelData.Strsuppl2 = sAddress[j].Strsuppl2;
												sModelData.Strsuppl3 = sAddress[j].Strsuppl3;
												sModelData.RefPosta = sAddress[j].RPostafl;
												sModelData.Landx = sAddress[j].Landx;
												sModelData.TimeZone = sAddress[j].TimeZone;
												sModelData.AddrLocation = sAddress[j].Location;
												sModelData.Region = sAddress[j].RPostFl;
												sModelData.RegionDesc = sAddress[j].Regiotxt;
											}
										}
									} else {
										sModelData.Title = sModelData.Title ? sModelData.Title : "";
										sModelData.TitleCode = sModelData.TitleCode ? sModelData.TitleCode : "";
										sModelData.Name1 = sModelData.Name1 ? sModelData.Name1 : "";
										sModelData.Name2 = sModelData.Name2 ? sModelData.Name2 : "";
										sModelData.Name3 = sModelData.Name3 ? sModelData.Name3 : "";
										sModelData.Name4 = sModelData.Name4 ? sModelData.Name4 : "";
										sModelData.Sort1 = sModelData.Sort1 ? sModelData.Sort1 : "";
										sModelData.Sort2 = sModelData.Sort2 ? sModelData.Sort2 : "";
										sModelData.NameCo = sModelData.NameCo ? sModelData.NameCo : "";
										sModelData.PostCod1 = sModelData.PostCod1 ? sModelData.PostCod1 : "";
										sModelData.City1 = sModelData.City1 ? sModelData.City1 : "";
										sModelData.Building = sModelData.Building ? sModelData.Building : "";
										sModelData.Floor = sModelData.Floor ? sModelData.Floor : "";
										sModelData.Roomnum = sModelData.Roomnum ? sModelData.Roomnum : "";
										sModelData.Strsuppl1 = sModelData.Strsuppl1 ? sModelData.Strsuppl1 : "";
										sModelData.Strsuppl2 = sModelData.Strsuppl2 ? sModelData.Strsuppl2 : "";
										sModelData.Strsuppl3 = sModelData.Strsuppl3 ? sModelData.Strsuppl3 : "";
										sModelData.AddrLocation = sModelData.AddrLocation ? sModelData.AddrLocation : "";
										sModelData.RefPosta = sModelData.RefPosta ? sModelData.RefPosta : "";
										sModelData.Landx = sModelData.Landx ? sModelData.Landx : "";
										sModelData.TimeZone = sModelData.TimeZone ? sModelData.TimeZone : "";
										sModelData.Region = sModelData.Region ? sModelData.Region : "";
										sModelData.RegionDesc = sModelData.RegionDesc ? sModelData.RegionDesc : "";
									}
								}
							}
						}

						var aIntlAddr = r.FLAddrI.results;
						if (aIntlAddr) {
							for (var z = 0; z < aIntlAddr.length; z++) {
								if (aIntlAddr[z].Funcloc === sModelData.Functionallocation) {
									aIntlAddr[z].AdNationEnable = false;
									aIntlAddr[z].City1iVS = "None";
									aIntlAddr[z].StreetiVS = "None";
									sModelData.intlAddr.push(aIntlAddr[z]);
								}
							}
						}

						var aAltLbl = r.FLALTLBEL.results;
						if (aAltLbl) {
							for (var y = 0; y < aAltLbl.length; y++) {
								if (aAltLbl[y].Funcloc === sModelData.Functionallocation) {
									var oAltLbl = {
										"Funcloc": aAltLbl[y].Funcloc,
										"AltAlkey": aAltLbl[y].AltAlkey, // Labeling system
										"Altxt": aAltLbl[y].Altxt, // Labeling system descr
										"AltStrno": aAltLbl[y].AltStrno, // Alternative Label
										"AltTplkz": aAltLbl[y].AltTplkz, // Strycture Indicator
										"Tplxt": aAltLbl[y].Tplxt, // Structure Indicator Descr
										"Name1i": aAltLbl[y].Editm, // Edit Mask
										"Actvs": aAltLbl[y].Actvs, // Active
										"AltPrkey": aAltLbl[y].AltPrkey, // Primary
										"AltReuse": aAltLbl[y].AltReuse, // Reusable

										"enableLblSys": false,
										"enableAltLbl": true,
										"enableStrInd": true,

										"LblSysVS": "None",
										"AltLblVS": "None",
										"StrIndVS": "None"
									};
									sModelData.altlbl.push(oAltLbl);
								}
							}
						}

						if (r.FLClass) {
							var sClassList = r.FLClass.results;
							if (sClassList) {
								if (sClassList.length > 0) {
									for (var a = 0; a < sClassList.length; a++) {
										if (sModelData.Functionallocation === sClassList[a].Funcloc) {
											sClassList[a].ctEnable = false;
											sClassList[a].classEnable = false;
											sClassList[a].ClassTypeDesc = sClassList[a].Artxt;
											delete sClassList[a].Artxt;
											sClassList[a].ClassDesc = sClassList[a].Kltxt;
											delete sClassList[a].Kltxt;
											delete sClassList[a].Changerequestid;
											delete sClassList[a].Clint;
											delete sClassList[a].Service;
											sModelData.classItems.push(sClassList[a]);
										}
									}
									sModelData.charNewButton = true;
									if (g.class && g.class.getId().includes("detailFloc") === true) {
										// var itemFragmentId = g.getView().createId("charFrag");
										// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
										// newCharBtn.setEnabled(true);
										g.class.setModel(new JSONModel(sModelData.classItems));
									}
								}
							}
						}

						if (r.FLVal) {
							var sCharList = r.FLVal.results;
							if (sCharList) {
								if (sCharList.length > 0) {
									for (var j = 0; j < sCharList.length; j++) {
										if (sModelData.Functionallocation === sCharList[j].Funcloc) {
											sCharList[j].cNameEnable = false;
											sCharList[j].Textbz = sCharList[j].Atwtb;
											delete sCharList[j].Ataut;
											delete sCharList[j].Ataw1;
											delete sCharList[j].Atawe;
											delete sCharList[j].Atcod;
											delete sCharList[j].Atflb;
											delete sCharList[j].Atflv;
											delete sCharList[j].Atimb;
											delete sCharList[j].Atsrt;
											delete sCharList[j].Atvglart;
											delete sCharList[j].Atzis;
											delete sCharList[j].Changerequestid;
											delete sCharList[j].CharName;
											delete sCharList[j].Charid;
											delete sCharList[j].Classtype;
											delete sCharList[j].Service;
											delete sCharList[j].Valcnt;
											sCharList[j].slNo = j + 1; // ()
											sCharList[j].flag = sCharList[j].Class + "-" + sCharList[j].slNo; // ()
											sModelData.characteristics.push(sCharList[j]);
										}
									}
									for (var z = 0; z < sModelData.characteristics.length; z++) {
										var count = 1;
										for (var y = 0; y < sModelData.characteristics.length; y++) {
											if (z === y) {
												continue;
											}
											if (sModelData.characteristics[y].Atnam === sModelData.characteristics[z].Atnam && sModelData.characteristics[y].Class ===
												sModelData.characteristics[z].Class) {
												count++;
											}
										}
										if (count > 1) {
											sModelData.characteristics[z].charDltEnable = true;
										} else {
											sModelData.characteristics[z].charDltEnable = false;
										}

										if (sModelData.characteristics[z].Atein === true) {
											sModelData.characteristics[z].charAddEnable = false;
										}
									}
									if (g.char && g.char.getId().includes("detailFloc") === true) {
										g.char.setModel(new JSONModel(sModelData.characteristics));
									}
								}
							}
						}

						if (r.FLLAMCH) {
							var alinearChar = r.FLLAMCH.results;
							if (alinearChar) {
								if (alinearChar.length > 0) {
									for (var j = 0; j < alinearChar.length; j++) {
										if (sModelData.Functionallocation === alinearChar[j].Funcloc) {
											alinearChar[j].linCharEnable = true;
											sModelData.linearChar.push(alinearChar[j]);
										}
									}
									// if (g.char && g.char.getId().includes("detailFloc") === true) {
									// 	g.char.setModel(new JSONModel(sModelData.characteristics));
									// }
								}
							}
						}

						// if (sModelData.UstaEqui) {
						// 	oMainData.visible = true;
						// } else {
						// 	oMainData.visible = false;
						// }
						// oMainModel.setData(oMainData);
						sArray.push(sModelData);
					}
					sap.ui.getCore().getModel("AIWFLOC").setData(sArray);
					// oGlobalModel.setData(sArray);

					var aFLDOIdata = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
					for (var i = 0; i < r.FuncLoc.results.length; i++) {
						var h = r.FuncLoc.results[i];
						for (var z = 0; z < aFLDOIdata.length; z++) {
							if (h.Tplnr === aFLDOIdata[z].key) {
								var aDOIFields = aFLDOIdata[z].DOI;
								if (h.Swerki === "") {
									aDOIFields[0].maintenance = false;
									aDOIFields[0].instLoc = false;
									aDOIFields[0].SupFlVal = "";
									aDOIFields[0].currentVal = "";
									aDOIFields[0].targetVal = "";
								} else if (h.Swerki === "D") {
									aDOIFields[0].maintenance = true;
									aDOIFields[0].instLoc = false;
									aDOIFields[0].SupFlVal = "";
									aDOIFields[0].currentVal = h.Swerk;
									aDOIFields[0].targetVal = h.Swerk;
								} else {
									aDOIFields[0].maintenance = false;
									aDOIFields[0].instLoc = true;
									aDOIFields[0].SupFlVal = h.Swerk;
									aDOIFields[0].currentVal = "";
									aDOIFields[0].targetVal = h.Swerk;
								}

								if (h.Storti === "") {
									aDOIFields[1].maintenance = false;
									aDOIFields[1].instLoc = false;
									aDOIFields[1].SupFlVal = "";
									aDOIFields[1].currentVal = "";
									aDOIFields[1].targetVal = "";
								} else if (h.Storti === "D") {
									aDOIFields[1].maintenance = true;
									aDOIFields[1].instLoc = false;
									aDOIFields[1].SupFlVal = "";
									aDOIFields[1].currentVal = h.StorFloc;
									aDOIFields[1].targetVal = h.StorFloc;
								} else {
									aDOIFields[1].maintenance = false;
									aDOIFields[1].instLoc = true;
									aDOIFields[1].SupFlVal = h.StorFloc;
									aDOIFields[1].currentVal = "";
									aDOIFields[1].targetVal = h.StorFloc;
								}

								if (h.Beberi === "") {
									aDOIFields[2].maintenance = false;
									aDOIFields[2].instLoc = false;
									aDOIFields[2].SupFlVal = "";
									aDOIFields[2].currentVal = "";
									aDOIFields[2].targetVal = "";
								} else if (h.Beberi === "D") {
									aDOIFields[2].maintenance = true;
									aDOIFields[2].instLoc = false;
									aDOIFields[2].SupFlVal = "";
									aDOIFields[2].currentVal = h.BeberFl;
									aDOIFields[2].targetVal = h.BeberFl;
								} else {
									aDOIFields[2].maintenance = false;
									aDOIFields[2].instLoc = true;
									aDOIFields[2].SupFlVal = h.BeberFl;
									aDOIFields[2].currentVal = "";
									aDOIFields[2].targetVal = h.BeberFl;
								}

								if (h.Ppsidi === "") {
									aDOIFields[3].maintenance = false;
									aDOIFields[3].instLoc = false;
									aDOIFields[3].SupFlVal = "";
									aDOIFields[3].currentVal = "";
									aDOIFields[3].targetVal = "";
								} else if (h.Ppsidi === "D") {
									aDOIFields[3].maintenance = true;
									aDOIFields[3].instLoc = false;
									aDOIFields[3].SupFlVal = "";
									aDOIFields[3].currentVal = h.Arbplfloc;
									aDOIFields[3].targetVal = h.Arbplfloc;
								} else {
									aDOIFields[3].maintenance = false;
									aDOIFields[3].instLoc = true;
									aDOIFields[3].SupFlVal = h.Arbplfloc;
									aDOIFields[3].currentVal = "";
									aDOIFields[3].targetVal = h.Arbplfloc;
								}

								if (h.Abckzi === "") {
									aDOIFields[4].maintenance = false;
									aDOIFields[4].instLoc = false;
									aDOIFields[4].SupFlVal = "";
									aDOIFields[4].currentVal = "";
									aDOIFields[4].targetVal = "";
								} else if (h.Abckzi === "D") {
									aDOIFields[4].maintenance = true;
									aDOIFields[4].instLoc = false;
									aDOIFields[4].SupFlVal = "";
									aDOIFields[4].currentVal = h.Abckzfloc;
									aDOIFields[4].targetVal = h.Abckzfloc;
								} else {
									aDOIFields[4].maintenance = false;
									aDOIFields[4].instLoc = true;
									aDOIFields[4].SupFlVal = h.Abckzfloc;
									aDOIFields[4].currentVal = "";
									aDOIFields[4].targetVal = h.Abckzfloc;
								}

								if (h.Bukrsi === "") {
									aDOIFields[5].maintenance = false;
									aDOIFields[5].instLoc = false;
									aDOIFields[5].SupFlVal = "";
									aDOIFields[5].currentVal = "";
									aDOIFields[5].targetVal = "";
								} else if (h.Bukrsi === "D") {
									aDOIFields[5].maintenance = true;
									aDOIFields[5].instLoc = false;
									aDOIFields[5].SupFlVal = "";
									aDOIFields[5].currentVal = h.Bukrsfloc;
									aDOIFields[5].targetVal = h.Bukrsfloc;
								} else {
									aDOIFields[5].maintenance = false;
									aDOIFields[5].instLoc = true;
									aDOIFields[5].SupFlVal = h.Bukrsfloc;
									aDOIFields[5].currentVal = "";
									aDOIFields[5].targetVal = h.Bukrsfloc;
								}

								if (h.Kostli === "") {
									aDOIFields[6].maintenance = false;
									aDOIFields[6].instLoc = false;
									aDOIFields[6].SupFlVal = "";
									aDOIFields[6].currentVal = "";
									aDOIFields[6].targetVal = "";
								} else if (h.Kostli === "D") {
									aDOIFields[6].maintenance = true;
									aDOIFields[6].instLoc = false;
									aDOIFields[6].SupFlVal = "";
									aDOIFields[6].currentVal = h.KostFloc;
									aDOIFields[6].targetVal = h.KostFloc;
								} else {
									aDOIFields[6].maintenance = false;
									aDOIFields[6].instLoc = true;
									aDOIFields[6].SupFlVal = h.KostFloc;
									aDOIFields[6].currentVal = "";
									aDOIFields[6].targetVal = h.KostFloc;
								}

								if (h.Kokrsi === "") {
									aDOIFields[7].maintenance = false;
									aDOIFields[7].instLoc = false;
									aDOIFields[7].SupFlVal = "";
									aDOIFields[7].currentVal = "";
									aDOIFields[7].targetVal = "";
								} else if (h.Kokrsi === "D") {
									aDOIFields[7].maintenance = true;
									aDOIFields[7].instLoc = false;
									aDOIFields[7].SupFlVal = "";
									aDOIFields[7].currentVal = h.KokrFloc;
									aDOIFields[7].targetVal = h.KokrFloc;
								} else {
									aDOIFields[7].maintenance = false;
									aDOIFields[7].instLoc = true;
									aDOIFields[7].SupFlVal = h.KokrFloc;
									aDOIFields[7].currentVal = "";
									aDOIFields[7].targetVal = h.KokrFloc;
								}

								if (h.Iwerki === "") {
									aDOIFields[8].maintenance = false;
									aDOIFields[8].instLoc = false;
									aDOIFields[8].SupFlVal = "";
									aDOIFields[8].currentVal = "";
									aDOIFields[8].targetVal = "";
								} else if (h.Iwerki === "D") {
									aDOIFields[8].maintenance = true;
									aDOIFields[8].instLoc = false;
									aDOIFields[8].SupFlVal = "";
									aDOIFields[8].currentVal = h.PlntFloc;
									aDOIFields[8].targetVal = h.PlntFloc;
								} else {
									aDOIFields[8].maintenance = false;
									aDOIFields[8].instLoc = true;
									aDOIFields[8].SupFlVal = h.PlntFloc;
									aDOIFields[8].currentVal = "";
									aDOIFields[8].targetVal = h.PlntFloc;
								}

								if (h.Ingrpi === "") {
									aDOIFields[9].maintenance = false;
									aDOIFields[9].instLoc = false;
									aDOIFields[9].SupFlVal = "";
									aDOIFields[9].currentVal = "";
									aDOIFields[9].targetVal = "";
								} else if (h.Ingrpi === "D") {
									aDOIFields[9].maintenance = true;
									aDOIFields[9].instLoc = false;
									aDOIFields[9].SupFlVal = "";
									aDOIFields[9].currentVal = h.Ingrp;
									aDOIFields[9].targetVal = h.Ingrp;
								} else {
									aDOIFields[9].maintenance = false;
									aDOIFields[9].instLoc = true;
									aDOIFields[9].SupFlVal = h.Ingrp;
									aDOIFields[9].currentVal = "";
									aDOIFields[9].targetVal = h.Ingrp;
								}

								if (h.Lgwidi === "") {
									aDOIFields[10].maintenance = false;
									aDOIFields[10].instLoc = false;
									aDOIFields[10].SupFlVal = "";
									aDOIFields[10].currentVal = "";
									aDOIFields[10].targetVal = "";
								} else if (h.Lgwidi === "D") {
									aDOIFields[10].maintenance = true;
									aDOIFields[10].instLoc = false;
									aDOIFields[10].SupFlVal = "";
									aDOIFields[10].currentVal = h.Gewrkfloc;
									aDOIFields[10].targetVal = h.Gewrkfloc;
								} else {
									aDOIFields[10].maintenance = false;
									aDOIFields[10].instLoc = true;
									aDOIFields[10].SupFlVal = h.Gewrkfloc;
									aDOIFields[10].currentVal = "";
									aDOIFields[10].targetVal = h.Gewrkfloc;
								}

								if (h.Adrnri === "") {
									aDOIFields[12].maintenance = false;
									aDOIFields[12].instLoc = false;
									aDOIFields[12].SupFlVal = "";
									aDOIFields[12].currentVal = "";
									aDOIFields[12].targetVal = "";
								} else if (h.Adrnri === "D") {
									aDOIFields[12].maintenance = true;
									aDOIFields[12].instLoc = false;
									aDOIFields[12].SupFlVal = "";
									aDOIFields[12].currentVal = h.Adrnr;
									aDOIFields[12].targetVal = h.Adrnr;
								} else {
									aDOIFields[12].maintenance = false;
									aDOIFields[12].instLoc = true;
									aDOIFields[12].SupFlVal = h.Adrnr;
									aDOIFields[12].currentVal = "";
									aDOIFields[12].targetVal = h.Adrnr;
								}
							}
						}
					}

					// for (var leq = 0; leq < oGlobalModel.getData().length; leq++) {
					// 	if (pFunctionallocation === oGlobalModel.getData()[leq].Functionallocation) {
					// 		var oJsonModel = new JSONModel();
					// 		var sCurrentObject = oGlobalModel.getProperty("/" + leq);

					// 		if ((sCurrentObject.Title !== "" && sCurrentObject.Title !== undefined) || (sCurrentObject.TitleCode !== "" && sCurrentObject
					// 				.TitleCode !== undefined) || (sCurrentObject.Name1 !== "" && sCurrentObject.Name1 !== undefined) || (sCurrentObject.Name2 !==
					// 				"" && sCurrentObject.Name2 !== undefined) || (sCurrentObject.Name3 !== "" && sCurrentObject.Name3 !== undefined) ||
					// 			(sCurrentObject.Name4 !== "" && sCurrentObject.Name4 !== undefined) ||
					// 			(sCurrentObject.Sort1 !== "" && sCurrentObject.Sort1 !== undefined) || (sCurrentObject.Sort2 !== "" && sCurrentObject.Sort2 !==
					// 				undefined) || (sCurrentObject.NameCo !== "" && sCurrentObject.NameCo !== undefined) || (sCurrentObject.PostCod1 !== "" &&
					// 				sCurrentObject.PostCod1 !== undefined) || (sCurrentObject.City1 !== "" && sCurrentObject.City1 !== undefined) ||
					// 			(sCurrentObject.Building !== "" && sCurrentObject.Building !== undefined) ||
					// 			(sCurrentObject.Floor !== "" && sCurrentObject.Floor !== undefined) || (sCurrentObject.Roomnum !== "" && sCurrentObject.Roomnum !==
					// 				undefined) || (sCurrentObject.AddrLocation !== "" && sCurrentObject.AddrLocation !== undefined) || (sCurrentObject.Strsuppl1 !==
					// 				"" && sCurrentObject.Strsuppl1 !== undefined) || (sCurrentObject.Strsuppl2 !== "" && sCurrentObject.Strsuppl2 !== undefined) ||
					// 			(sCurrentObject.Strsuppl3 !== "" && sCurrentObject.Strsuppl3 !== undefined) || (sCurrentObject.TimeZone !== "" &&
					// 				sCurrentObject.TimeZone !== undefined) || (sCurrentObject.RefPosta !== "" && sCurrentObject.RefPosta !== undefined) || (
					// 				sCurrentObject.Region !== "" && sCurrentObject.Region !== undefined)) {
					// 			sCurrentObject.RefPostaLblReq = true;
					// 		}

					// 		oJsonModel.setData(sCurrentObject);
					// 		var sCopyArray = [oJsonModel.getData()];
					// 		var sSupFlocData = $.map(sCopyArray, function (obj) {
					// 			return $.extend(true, {}, obj);
					// 		});

					// 		var mSupFlocModel = sap.ui.getCore().getModel("SUP_FLOC_DATA");
					// 		var mSupFlocData = mSupFlocModel.getData();
					// 		var mCountFlocFlag = true;
					// 		for (var se = 0; se < mSupFlocData.length; se++) {
					// 			if (sCurrentObject.Functionallocation === mSupFlocData[se].Functionallocation) {
					// 				mCountFlocFlag = false;
					// 			}
					// 		}
					// 		if (mCountFlocFlag && sCurrentObject.SupFunctionallocation !== "" && sCurrentObject.SupFunctionallocation !== undefined) {
					// 			mSupFlocData.push(sSupFlocData[0]);
					// 			mSupFlocModel.setData(mSupFlocData);
					// 		}

					// 		oMainData.tableBusy = false;
					// 		oMainModel.setData(oMainData);

					// 		if (supflag !== undefined) {
					// 			var dData = [];
					// 			sap.ui.getCore().getModel("dataOriginMOP").getData().FL.forEach(function (item) {
					// 				if (item.key === pFunctionallocation) {
					// 					dData = item.DOI;
					// 				}
					// 			});
					// 			var fields = r.FLDOI.results;
					// 			for (var f = 0; f < fields.length; f++) {
					// 				fields[f].instLoc = true;
					// 				if (fields[f].hasOwnProperty("maintenance")) {
					// 					if (!fields[f].maintenance) {
					// 						fields[f].targetVal = fields[f].SupFlVal;
					// 					}
					// 				} else {
					// 					fields[f].maintenance = dData[f].maintenance;
					// 					if (fields[f].maintenance) {
					// 						fields[f].instLoc = false;
					// 					} else {
					// 						fields[f].instLoc = true;
					// 					}

					// 					fields[f].currentVal = dData[f].currentVal;
					// 				}
					// 				if (fields[f].Property === "Maintplant" || fields[f].Property === "PlntFloc") {
					// 					fields[f].locEnable = false;
					// 					fields[f].maintEnable = false;
					// 				} else {
					// 					fields[f].locEnable = true;
					// 					fields[f].maintEnable = true;
					// 				}
					// 				fields[f].targetVal = fields[f].SupFlVal;
					// 			}

					// 			sap.ui.getCore().getModel("dataOriginMOP").getData().FL.forEach(function (item) {
					// 				if (item.key === pFunctionallocation) {
					// 					item.DOI = fields;
					// 				}
					// 			});
					// 		} else {
					// 			g.handleDoiCreate(pFunctionallocation, "FL");
					// 		}
					// 		// return;
					// 		break;
					// 	}
					// }
				}

				if (r.Equipment.results.length > 0) {
					var sArray = [];
					for (var ieq = 0; ieq < r.Equipment.results.length; ieq++) {
						var sModelData = r.Equipment.results[ieq];
						var sObject = {
							intlAddr: [],
							classItems: [],
							characteristics: [],
							linearChar: [],
							charNewButton: false,
							attachmentCount: "0", // Attachment Count
							Guids: "", // Attachment
							EqunrEnabled: true,
							EquipCatEnabled: true,
							MaintplantEnabled: true,
							BukrsEnabled: true,
							EqunrVS: "None",
							EqunrVST: "",
							EqktxVS: "None",
							EqktxVST: "",
							EquipmentCatogoryVS: "None",
							EquipmentCatogoryVST: "",
							MaintplantVS: "None",
							MaintplantVST: "",
							TplnrVS: "None",
							TplnrVST: "",
							SuperordinateEquipVS: "None",
							SuperordinateEquipVST: "",
							StsmEquiVS: "None",
							StsmEquiVST: "",
							UstwEquiVS: "None",
							UstwEquiVST: "",
							UswoEquiVS: "None",
							UswoEquiVST: "",
							TechnicalObjectTypVS: "None",
							TechnicalObjectTypVST: "",
							LocationVS: "None",
							LocationVSTL: "",
							AbckzVS: "None",
							AbckzVST: "",
							ArbplVS: "None",
							ArbplVST: "",
							BukrsVS: "None",
							BukrsVST: "",
							KostlVS: "None",
							KostlVST: "",
							WerksVS: "None",
							WerksVST: "",
							IngrpVS: "None",
							IngrpVST: "",
							ConstrTypeVS: "None",
							ConstrTypeVST: "",
							RefPostaVS: "None",
							RefPostaVST: "",
							MainArbplVS: "None",
							MainArbplVST: "",
							LangucodeVS: "None",
							LangucodeVST: "",
							TimeZoneVS: "None",
							TimeZoneVST: "",
							ConstrTypeMaxL: 0,
							charValueMaxL: 0,

							dfps: {
								Tailno: "",
								TailnoVS: "None",
								Area: "",
								AreaDesc: "",
								AreaPrfl: "",
								Site: "",
								SiteDesc: "",
								SiteVS: "None",
								SitePrfl: "",
								MPO: "",
								MPODesc: "",
								RIC: "",
								RICDesc: "",
								ModelId: "",
								ModelIdDesc: "",
								ModelIdVS: "None",
								ForeignEq: false,
								TechSts: "",
								OperSts: "0001",
								Remark: "",
								dfpsCrtEnabled: true,
								dfpsDltEnabled: false,
								dfpsEnabled: false,
								TailnoReq: false,
							}
						};
						sObject.Equnr = sModelData.Equnr;
						sObject.Eqktx = sModelData.Txtmi;
						// sObject.Eqktx = sModelData.Eqktx;
						sObject.EquipmentCatogory = sModelData.Eqtyp;
						sObject.EquipCatgDescription = sModelData.Etytx;
						sObject.Maintplant = sModelData.Swerk;
						sObject.MaintplantDesc = sModelData.Name1;

						sObject.SuperordinateEquip = sModelData.HequEeqz; // Superord. Equipment
						sObject.SuperordinateEquipDesc = sModelData.SuperordEqDes; // Superord. Equipment Description
						sObject.Bukrs = sModelData.BukrEilo;
						sObject.Butxt = sModelData.Butxt;
						sObject.Location = sModelData.StorEilo; // Location
						sObject.Locationdesc = sModelData.Locationdesc; // Location Description
						sObject.Abckz = sModelData.AbckEilo;
						sObject.Abctx = sModelData.Abctx;
						sObject.Kostl = sModelData.KostEilo; // Cost Center
						sObject.Kokrs = sModelData.KokrEilo; // ccPart1
						sObject.Mctxt = sModelData.Contareaname; // Name
						sObject.Answt = sModelData.Answt;
						sObject.Ansdt = formatter.getDateFormat(sModelData.Ansdt);
						sObject.Waers = sModelData.Waers; // Currency
						sObject.Werks = sModelData.PplaEeqz; // Planning Plant
						sObject.Planningplantdes = sModelData.Planningplantdes; // Planning Plant Description
						sObject.Ingrp = sModelData.IngrEeqz; // Planner Group
						sObject.Innam = sModelData.Plannergrpdesc; // Planner Group Description
						sObject.Arbpl = sModelData.ArbpEilo; // Work Center
						sObject.Ktext = sModelData.Workcenterdesc; // Work Center Description
						sObject.WcWerks = sModelData.WorkCenterPlant; // Work center Plant
						sObject.MainArbpl = sModelData.ArbpEeqz; // Main Work Center
						sObject.MainKtext = sModelData.MainWcDesc; // Plant Work Center
						sObject.MainWerks = sModelData.MainWcPlant; // Name
						sObject.BeberFl = sModelData.BebeEilo; // Plant Section
						sObject.Fing = sModelData.Fing; // Plant Section
						sObject.Tele = sModelData.Tele; // Plant Section
						sObject.Herst = sModelData.Herst; // Manufacturer
						sObject.TechnicalObjectTyp = sModelData.Eqart; // TechnicalObjectTyp
						sObject.Description = sModelData.Eartx; // TechnicalObjectTyp Description
						sObject.Typbz = sModelData.Typbz; // Model Number
						sObject.ConstrType = sModelData.SubmEeqz; // Construction Type
						sObject.ConstructionDesc = sModelData.Constdesc; // Construction Description
						sObject.TechIdNum = sModelData.TidnEeqz; // techIndNo
						sObject.Serge = sModelData.Serge; // manfSerNo
						sObject.MapaEeqz = sModelData.MapaEeqz; // partNum
						sObject.EquipPosition = sModelData.HeqnEeqz; // Position

						sObject.Stattext = sModelData.Stattext; // System Status
						sObject.StsmEqui = sModelData.StsmEqui; // Status Profile
						sObject.StsmEquiDesc = sModelData.Statproftxt; // Status Profile Description
						sObject.UstwEqui = sModelData.UstwEqui; // Status with Status Number
						sObject.UswoEqui = sModelData.UswoEqui; // Status without Status Number
						sObject.UstaEqui = sModelData.UstaEqui; // User Status
						sObject.menuAction = sModelData.IsMenu;
						sObject.Adrnr = sModelData.Adrnr;
						sObject.Adrnri = sModelData.Adrnri;
						sObject.Fhmkz = sModelData.Fhmkz; // PRT fields visible
						sObject.Funcid = sModelData.Funcid; //Config control data
						sObject.Frcfit = sModelData.Frcfit;
						sObject.Frcrmv = sModelData.Frcrmv;
						sObject.Deact = sModelData.Deact;

						if (r.EqPRT) {
							var sPRT = r.EqPRT.results[ieq];
							if (sPRT) {
								sObject.PlanvPrt = sPRT.PlanvPrt;
								sObject.SteufPrt = sPRT.SteufPrt;
								sObject.KtschPrt = sPRT.KtschPrt;
								sObject.Ewformprt = sPRT.Ewformprt;
								sObject.PlanvPrtText = AIWEQUIModel[ieq].PlanvPrtText;
								sObject.SteufPrtText = AIWEQUIModel[ieq].SteufPrtText;
								sObject.KtschPrtText = AIWEQUIModel[ieq].KtschPrtText;
								sObject.EwformprtText = AIWEQUIModel[ieq].EwformprtText;
								sObject.SteufRef = sPRT.SteufRef;
								sObject.KtschRef = sPRT.KtschRef;
								sObject.EwformRef = sPRT.EwformRef;
							} else {
								sObject.PlanvPrt = "";
								sObject.SteufPrt = "";
								sObject.KtschPrt = "";
								sObject.Ewformprt = "";
								sObject.PlanvPrtText = "";
								sObject.SteufPrtText = "";
								sObject.KtschPrtText = "";
								sObject.EwformprtText = "";
								sObject.SteufRef = false;
								sObject.KtschRef = false;
								sObject.EwformRef = false;
							}
						}

						var aEqLAM = r.EqLAM.results;
						if (aEqLAM) {
							for (var x = 0; x < aEqLAM.length; x++) {
								if (aEqLAM[x].Equi === sModelData.Equnr) {
									var oEqLAM = {
										"Equi": aEqLAM[x].Equi,
										"Lrpid": aEqLAM[x].Lrpid,
										"LrpidDesc": aEqLAM[x].LrpDescr,
										"Strtptatr": aEqLAM[x].Strtptatr,
										"Endptatr": aEqLAM[x].Endptatr,
										"Length": aEqLAM[x].Length,
										"LinUnit": aEqLAM[x].LinUnit,
										"LinUnitDesc": aEqLAM[x].Uomtext,
										"Startmrkr": aEqLAM[x].Startmrkr,
										"Endmrkr": aEqLAM[x].Endmrkr,
										"Mrkdisst": aEqLAM[x].Mrkdisst,
										"Mrkdisend": aEqLAM[x].Mrkdisend,
										"MrkrUnit": aEqLAM[x].MrkrUnit
									};
									sObject.lam = oEqLAM;
									break;
								}
							}
						}

						if (sModelData.Type === true) {
							sObject.viewParameter = "create";
						}

						if (sModelData.Type === false) {
							sObject.viewParameter = "change";
							sObject.EqunrEnabled = false;

							if (sObject.EquipmentCatogory === "" || sObject.EquipmentCatogory === undefined) {
								sObject.EquipCatEnabled = true;
							} else {
								sObject.EquipCatEnabled = false;
							}
							if (sObject.Maintplant === "" || sObject.Maintplant === undefined) {
								sObject.MaintplantEnabled = true;
							} else {
								sObject.MaintplantEnabled = false;
							}
							if (sObject.Tplnr === "" || sObject.Tplnr === undefined) {
								sObject.TplnrEnabled = true;
							} else {
								sObject.TplnrEnabled = false;
							}
						}

						if (sModelData.Swerk !== "") {
							sObject.BukrsEnabled = false;
						} else {
							sObject.BukrsEnabled = true;
						}

						if (sModelData.Eqtyp !== "P") {
							sObject.Tplnr = sModelData.TplnEilo; // Functional Location
							sObject.Pltxt = sModelData.Flocdescription; // Functional Location Description
							sObject.TplnrEnabled = true;
						} else {
							sObject.Tplnr = "";
							sObject.Pltxt = "";
							sObject.TplnrEnabled = false;
						}
						if (sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) {
							sObject.TplnrEnabled = false;
							sObject.SuperordinateEquipEnabled = true;
						}
						if (sObject.SuperordinateEquip === "" && sObject.Tplnr !== "" && sObject.Tplnr !== undefined) {
							sObject.TplnrEnabled = true;
							sObject.SuperordinateEquipEnabled = false;
						}
						if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) || (sObject.Tplnr !== "" && sObject.Tplnr !==
								undefined)) {
							sObject.MaintplantEnabled = false;
						} else {
							sObject.MaintplantEnabled = true;
						}

						if (r.EqAddr) {
							if (r.EqAddr.results) {
								var sAddress = r.EqAddr.results;
								if (sAddress) {
									if (sAddress.length > 0) {
										for (var jeq = 0; jeq < sAddress.length; jeq++) {
											if (sObject.Equnr === sAddress[jeq].Equi) {
												var oAddressEquiModel = sap.ui.getCore().getModel("equiAddressView");
												var oAddressEquiData = oAddressEquiModel.getData();
												var mCountEquiFlag = true;
												var sEquiObj, sEquiMatchIndex;
												if (oAddressEquiData.length > 0) {
													for (var sfa = 0; sfa < oAddressEquiData.length; sfa++) {
														if (sModelData.Equnr === oAddressEquiData[sfa].Equnr) {
															mCountEquiFlag = false;
															sEquiMatchIndex = sfa;
															break;
														}
													}
												}
												if (mCountEquiFlag === true) {
													if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
														(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
														sEquiObj = {
															Equnr: sModelData.Equnr,
															Tplnr: sObject.Tplnr,
															IsEditable: sAddress[jeq].IsEditable
														};
														oAddressEquiData.push(sEquiObj);
														oAddressEquiModel.setData(oAddressEquiData);
													}
												}
												if (mCountEquiFlag === false) {
													if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
														(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
														oAddressEquiData[sEquiMatchIndex].Equnr = sModelData.Equnr;
														oAddressEquiData[sEquiMatchIndex].Tplnr = sModelData.Tplnr;
														oAddressEquiData[sEquiMatchIndex].IsEditable = sAddress[jeq].IsEditable; //sModelData.IsEditable;
														oAddressEquiModel.setData(oAddressEquiData);
													}
												}

												sObject.IsEditable = sAddress[jeq].IsEditable;
												sObject.Title = sAddress[jeq].Titletxt ? sAddress[jeq].Titletxt : "";
												sObject.TitleCode = sAddress[jeq].Title ? sAddress[jeq].Title : "";
												sObject.Name1 = sAddress[jeq].Name1 ? sAddress[jeq].Name1 : "";
												sObject.Name2 = sAddress[jeq].Name2 ? sAddress[jeq].Name2 : "";
												sObject.Name3 = sAddress[jeq].Name3 ? sAddress[jeq].Name3 : "";
												sObject.Name4 = sAddress[jeq].Name4 ? sAddress[jeq].Name4 : "";
												sObject.Sort1 = sAddress[jeq].Sort1 ? sAddress[jeq].Sort1 : "";
												sObject.Sort2 = sAddress[jeq].Sort2 ? sAddress[jeq].Sort2 : "";
												sObject.NameCo = sAddress[jeq].NameCo ? sAddress[jeq].NameCo : "";
												sObject.PostCod1 = sAddress[jeq].PostCod1 ? sAddress[jeq].PostCod1 : "";
												sObject.City1 = sAddress[jeq].City1 ? sAddress[jeq].City1 : "";
												sObject.Building = sAddress[jeq].Building ? sAddress[jeq].Building : "";
												sObject.Floor = sAddress[jeq].Floor ? sAddress[jeq].Floor : "";
												sObject.Roomnum = sAddress[jeq].Roomnum ? sAddress[jeq].Roomnum : "";
												sObject.AddrLocation = sAddress[jeq].Location ? sAddress[jeq].Location : "";
												sObject.Strsuppl1 = sAddress[jeq].Strsuppl1 ? sAddress[jeq].Strsuppl1 : "";
												sObject.Strsuppl2 = sAddress[jeq].Strsuppl2 ? sAddress[jeq].Strsuppl2 : "";
												sObject.Strsuppl3 = sAddress[jeq].Strsuppl3 ? sAddress[jeq].Strsuppl3 : "";
												sObject.RefPosta = sAddress[jeq].RefPosta ? sAddress[jeq].RefPosta : "";
												sObject.Landx = sAddress[jeq].Landx ? sAddress[jeq].Landx : "";
												sObject.TimeZone = sAddress[jeq].TimeZone ? sAddress[jeq].TimeZone : "";
												sObject.Region = sAddress[jeq].RfePost ? sAddress[jeq].RfePost : "";
												sObject.RegionDesc = sAddress[jeq].Regiotxt ? sAddress[jeq].Regiotxt : "";
											}
										}
									} else {
										sObject.Title = sObject.Title ? sObject.Title : "";
										sObject.TitleCode = sObject.TitleCode ? sObject.TitleCode : "";
										sObject.Name1 = sObject.Name1 ? sObject.Name1 : "";
										sObject.Name2 = sObject.Name2 ? sObject.Name2 : "";
										sObject.Name3 = sObject.Name3 ? sObject.Name3 : "";
										sObject.Name4 = sObject.Name4 ? sObject.Name4 : "";
										sObject.Sort1 = sObject.Sort1 ? sObject.Sort1 : "";
										sObject.Sort2 = sObject.Sort2 ? sObject.Sort2 : "";
										sObject.NameCo = sObject.NameCo ? sObject.NameCo : "";
										sObject.PostCod1 = sObject.PostCod1 ? sObject.PostCod1 : "";
										sObject.City1 = sObject.City1 ? sObject.City1 : "";
										sObject.Building = sObject.Building ? sObject.Building : "";
										sObject.Floor = sObject.Floor ? sObject.Floor : "";
										sObject.Roomnum = sObject.Roomnum ? sObject.Roomnum : "";
										sObject.Strsuppl1 = sObject.Strsuppl1 ? sObject.Strsuppl1 : "";
										sObject.Strsuppl2 = sObject.Strsuppl2 ? sObject.Strsuppl2 : "";
										sObject.Strsuppl3 = sObject.Strsuppl3 ? sObject.Strsuppl3 : "";
										sObject.AddrLocation = sObject.AddrLocation ? sObject.AddrLocation : "";
										sObject.RefPosta = sObject.RefPosta ? sObject.RefPosta : "";
										sObject.Landx = sObject.Landx ? sObject.Landx : "";
										sObject.TimeZone = sObject.TimeZone ? sObject.TimeZone : "";
										sObject.Region = sObject.Region ? sObject.Region : "";
										sObject.RegionDesc = sObject.RegionDesc ? sObject.RegionDesc : "";
									}
								}
							}
						}

						var aIntlAddr = r.EqAddrI.results;
						if (aIntlAddr) {
							for (var z = 0; z < aIntlAddr.length; z++) {
								if (aIntlAddr[z].Equi === sObject.Equnr) {
									aIntlAddr[z].AdNationEnable = false;
									aIntlAddr[z].City1iVS = "None";
									aIntlAddr[z].StreetiVS = "None";
									sObject.intlAddr.push(aIntlAddr[z]);
								}
							}
						}

						if (r.EqDFPS) {
							if (r.EqDFPS.results) {
								var sDpfs = r.EqDFPS.results;
								if (sDpfs) {
									if (sDpfs.length > 0) {
										for (var ud = 0; ud < sDpfs.length; ud++) {
											if (sObject.Equnr === sDpfs[ud].Equi) {
												sObject.dfps.Equnr = sDpfs[ud].Equi;
												sObject.dfps.MeOwner = sDpfs[ud].MeOwner;
												sObject.dfps.MeUser = sDpfs[ud].MeUser;
												sObject.dfps.Tailno = sDpfs[ud].DeviceId;
												sObject.dfps.Area = sDpfs[ud].Topsiteid;
												sObject.dfps.AreaDesc = sDpfs[ud].Topsitede;
												sObject.dfps.AreaPrfl = sDpfs[ud].AreaPro;
												sObject.dfps.Site = sDpfs[ud].SiteId;
												sObject.dfps.SiteDesc = sDpfs[ud].SiteDesc;
												sObject.dfps.SitePrfl = sDpfs[ud].SitePro;
												sObject.dfps.MPO = sDpfs[ud].MpoId;
												sObject.dfps.MPODesc = sDpfs[ud].MpoDescr;
												sObject.dfps.RIC = sDpfs[ud].RicId;
												sObject.dfps.RICDesc = sDpfs[ud].RicDescr;
												sObject.dfps.ModelId = sDpfs[ud].ModelId;
												sObject.dfps.ModelIdDesc = sDpfs[ud].ModelDes;
												sObject.dfps.ForeignEq = formatter.XtoTrue(sDpfs[ud].Foreignob);
												sObject.dfps.TechSts = sDpfs[ud].TecState;
												sObject.dfps.OperSts = sDpfs[ud].DepState;
												sObject.dfps.Remark = sDpfs[ud].DfpsRmrk;
												if (sDpfs[ud].DeviceId !== "") {
													sObject.dfps.dfpsCrtEnabled = false;
													sObject.dfps.dfpsDltEnabled = true;
													sObject.dfps.dfpsEnabled = true;
													sObject.dfps.TailnoReq = true;
												}
											}
										}
									}
								}
							}
						}

						if (r.EqClass) {
							var sClassList = r.EqClass.results;
							if (sClassList) {
								if (sClassList.length > 0) {
									for (var aeq = 0; aeq < sClassList.length; aeq++) {
										if (sObject.Equnr === sClassList[aeq].Equi) {
											sClassList[aeq].ctEnable = false;
											sClassList[aeq].classEnable = false;
											sClassList[aeq].ClassTypeDesc = sClassList[aeq].Artxt;
											delete sClassList[aeq].Artxt;
											sClassList[aeq].ClassDesc = sClassList[aeq].Kltxt;
											delete sClassList[aeq].Kltxt;
											delete sClassList[aeq].Changerequestid;
											delete sClassList[aeq].Clint;
											delete sClassList[aeq].Service;
											sObject.classItems.push(sClassList[aeq]);
										}
									}
									sObject.charNewButton = true;
									if (g.class && g.class.getId().includes("detailEqui") === true) {
										g.class.setModel(new JSONModel(sObject.classItems));
									}
								}
							}
						}

						if (r.EqVal) {
							var sCharList = r.EqVal.results;
							if (sCharList) {
								if (sCharList.length > 0) {
									for (var jev = 0; jev < sCharList.length; jev++) {
										if (sObject.Equnr === sCharList[jev].Equi) {
											sCharList[jev].cNameEnable = false;
											sCharList[jev].Textbz = sCharList[jev].Atwtb;
											delete sCharList[jev].Ataut;
											delete sCharList[jev].Ataw1;
											delete sCharList[jev].Atawe;
											delete sCharList[jev].Atcod;
											delete sCharList[jev].Atflb;
											delete sCharList[jev].Atflv;
											delete sCharList[jev].Atimb;
											delete sCharList[jev].Atsrt;
											delete sCharList[jev].Atvglart;
											delete sCharList[jev].Atzis;
											delete sCharList[jev].Changerequestid;
											delete sCharList[jev].CharName;
											delete sCharList[jev].Charid;
											delete sCharList[jev].Classtype;
											delete sCharList[jev].Service;
											delete sCharList[jev].Valcnt;
											sCharList[jev].slNo = jev + 1; // ()
											sCharList[jev].flag = sCharList[jev].Class + "-" + sCharList[jev].slNo; // ()
											sObject.characteristics.push(sCharList[jev]);
										}
									}
									for (var z = 0; z < sObject.characteristics.length; z++) {
										var count = 1;
										for (var y = 0; y < sObject.characteristics.length; y++) {
											if (z === y) {
												continue;
											}
											if (sObject.characteristics[y].Atnam === sObject.characteristics[z].Atnam && sObject.characteristics[y].Class ===
												sObject.characteristics[z].Class) {
												count++;
											}
										}
										if (count > 1) {
											sObject.characteristics[z].charDltEnable = true;
										} else {
											sObject.characteristics[z].charDltEnable = false;
										}

										if (sObject.characteristics[z].Atein === true) {
											sObject.characteristics[z].charAddEnable = false;
										}
									}
									if (g.char && g.char.getId().includes("detailEqui") === true) {
										g.char.setModel(new JSONModel(sObject.characteristics));
									}
								}
							}
						}

						if (r.EqLAMCH) {
							var alinearChar = r.EqLAMCH.results;
							if (alinearChar) {
								if (alinearChar.length > 0) {
									for (var j = 0; j < alinearChar.length; j++) {
										if (sObject.Equnr === alinearChar[j].Equi) {
											alinearChar[j].linCharEnable = true;
											sObject.linearChar.push(alinearChar[j]);
										}
									}
									// if (g.char && g.char.getId().includes("detailFloc") === true) {
									// 	g.char.setModel(new JSONModel(sModelData.characteristics));
									// }
								}
							}
						}

						// if (sObject.UstaEqui) {
						// 	oMainViewData.visible = true;
						// } else {
						// 	oMainViewData.visible = false;
						// }
						// oMainViewModel.setData(oMainViewData);
						sArray.push(sObject);
					}
					sap.ui.getCore().getModel("AIWEQUI").setData(sArray);

					var aEQDOIdata = sap.ui.getCore().getModel("dataOriginMOP").getData().EQ;
					for (var i = 0; i < r.Equipment.results.length; i++) {
						var h = r.Equipment.results[i];
						for (var z = 0; z < aEQDOIdata.length; z++) {
							if (h.Equnr === aEQDOIdata[z].key) {
								var aDOIFields = aEQDOIdata[z].DOI;
								if (h.Swerki === "") {
									aDOIFields[0].maintenance = false;
									aDOIFields[0].instLoc = false;
									aDOIFields[0].SupFlVal = "";
									aDOIFields[0].currentVal = "";
									aDOIFields[0].targetVal = "";
								} else if (h.Swerki === "D") {
									aDOIFields[0].maintenance = true;
									aDOIFields[0].instLoc = false;
									aDOIFields[0].SupFlVal = "";
									aDOIFields[0].currentVal = h.Swerk;
									aDOIFields[0].targetVal = h.Swerk;
								} else {
									aDOIFields[0].maintenance = false;
									aDOIFields[0].instLoc = true;
									aDOIFields[0].SupFlVal = h.Swerk;
									aDOIFields[0].currentVal = "";
									aDOIFields[0].targetVal = h.Swerk;
								}

								if (h.Storti === "") {
									aDOIFields[1].maintenance = false;
									aDOIFields[1].instLoc = false;
									aDOIFields[1].SupFlVal = "";
									aDOIFields[1].currentVal = "";
									aDOIFields[1].targetVal = "";
								} else if (h.Storti === "D") {
									aDOIFields[1].maintenance = true;
									aDOIFields[1].instLoc = false;
									aDOIFields[1].SupFlVal = "";
									aDOIFields[1].currentVal = h.StorEilo;
									aDOIFields[1].targetVal = h.StorEilo;
								} else {
									aDOIFields[1].maintenance = false;
									aDOIFields[1].instLoc = true;
									aDOIFields[1].SupFlVal = h.StorEilo;
									aDOIFields[1].currentVal = "";
									aDOIFields[1].targetVal = h.StorEilo;
								}

								if (h.Beberi === "") {
									aDOIFields[2].maintenance = false;
									aDOIFields[2].instLoc = false;
									aDOIFields[2].SupFlVal = "";
									aDOIFields[2].currentVal = "";
									aDOIFields[2].targetVal = "";
								} else if (h.Beberi === "D") {
									aDOIFields[2].maintenance = true;
									aDOIFields[2].instLoc = false;
									aDOIFields[2].SupFlVal = "";
									aDOIFields[2].currentVal = h.BebeEilo;
									aDOIFields[2].targetVal = h.BebeEilo;
								} else {
									aDOIFields[2].maintenance = false;
									aDOIFields[2].instLoc = true;
									aDOIFields[2].SupFlVal = h.BebeEilo;
									aDOIFields[2].currentVal = "";
									aDOIFields[2].targetVal = h.BebeEilo;
								}

								if (h.Ppsidi === "") {
									aDOIFields[3].maintenance = false;
									aDOIFields[3].instLoc = false;
									aDOIFields[3].SupFlVal = "";
									aDOIFields[3].currentVal = "";
									aDOIFields[3].targetVal = "";
								} else if (h.Ppsidi === "D") {
									aDOIFields[3].maintenance = true;
									aDOIFields[3].instLoc = false;
									aDOIFields[3].SupFlVal = "";
									aDOIFields[3].currentVal = h.ArbpEilo;
									aDOIFields[3].targetVal = h.ArbpEilo;
								} else {
									aDOIFields[3].maintenance = false;
									aDOIFields[3].instLoc = true;
									aDOIFields[3].SupFlVal = h.ArbpEilo;
									aDOIFields[3].currentVal = "";
									aDOIFields[3].targetVal = h.ArbpEilo;
								}

								if (h.Abckzi === "") {
									aDOIFields[4].maintenance = false;
									aDOIFields[4].instLoc = false;
									aDOIFields[4].SupFlVal = "";
									aDOIFields[4].currentVal = "";
									aDOIFields[4].targetVal = "";
								} else if (h.Abckzi === "D") {
									aDOIFields[4].maintenance = true;
									aDOIFields[4].instLoc = false;
									aDOIFields[4].SupFlVal = "";
									aDOIFields[4].currentVal = h.AbckEilo;
									aDOIFields[4].targetVal = h.AbckEilo;
								} else {
									aDOIFields[4].maintenance = false;
									aDOIFields[4].instLoc = true;
									aDOIFields[4].SupFlVal = h.AbckEilo;
									aDOIFields[4].currentVal = "";
									aDOIFields[4].targetVal = h.AbckEilo;
								}

								if (h.Kostli === "") {
									aDOIFields[5].maintenance = false;
									aDOIFields[5].instLoc = false;
									aDOIFields[5].SupFlVal = "";
									aDOIFields[5].currentVal = "";
									aDOIFields[5].targetVal = "";
								} else if (h.Kostli === "D") {
									aDOIFields[5].maintenance = true;
									aDOIFields[5].instLoc = false;
									aDOIFields[5].SupFlVal = "";
									aDOIFields[5].currentVal = h.KostEilo;
									aDOIFields[5].targetVal = h.KostEilo;
								} else {
									aDOIFields[5].maintenance = false;
									aDOIFields[5].instLoc = true;
									aDOIFields[5].SupFlVal = h.KostEilo;
									aDOIFields[5].currentVal = "";
									aDOIFields[5].targetVal = h.KostEilo;
								}

								if (h.Iwerki === "") {
									aDOIFields[6].maintenance = false;
									aDOIFields[6].instLoc = false;
									aDOIFields[6].SupFlVal = "";
									aDOIFields[6].currentVal = "";
									aDOIFields[6].targetVal = "";
								} else if (h.Iwerki === "D") {
									aDOIFields[6].maintenance = true;
									aDOIFields[6].instLoc = false;
									aDOIFields[6].SupFlVal = "";
									aDOIFields[6].currentVal = h.PplaEeqz;
									aDOIFields[6].targetVal = h.PplaEeqz;
								} else {
									aDOIFields[6].maintenance = false;
									aDOIFields[6].instLoc = true;
									aDOIFields[6].SupFlVal = h.PplaEeqz;
									aDOIFields[6].currentVal = "";
									aDOIFields[6].targetVal = h.PplaEeqz;
								}

								if (h.Ingrpi === "") {
									aDOIFields[7].maintenance = false;
									aDOIFields[7].instLoc = false;
									aDOIFields[7].SupFlVal = "";
									aDOIFields[7].currentVal = "";
									aDOIFields[7].targetVal = "";
								} else if (h.Ingrpi === "D") {
									aDOIFields[7].maintenance = true;
									aDOIFields[7].instLoc = false;
									aDOIFields[7].SupFlVal = "";
									aDOIFields[7].currentVal = h.IngrEeqz;
									aDOIFields[7].targetVal = h.IngrEeqz;
								} else {
									aDOIFields[7].maintenance = false;
									aDOIFields[7].instLoc = true;
									aDOIFields[7].SupFlVal = h.IngrEeqz;
									aDOIFields[7].currentVal = "";
									aDOIFields[7].targetVal = h.IngrEeqz;
								}

								if (h.Gewrki === "") {
									aDOIFields[8].maintenance = false;
									aDOIFields[8].instLoc = false;
									aDOIFields[8].SupFlVal = "";
									aDOIFields[8].currentVal = "";
									aDOIFields[8].targetVal = "";
								} else if (h.Gewrki === "D") {
									aDOIFields[8].maintenance = true;
									aDOIFields[8].instLoc = false;
									aDOIFields[8].SupFlVal = "";
									aDOIFields[8].currentVal = h.ArbpEeqz;
									aDOIFields[8].targetVal = h.ArbpEeqz;
								} else {
									aDOIFields[8].maintenance = false;
									aDOIFields[8].instLoc = true;
									aDOIFields[8].SupFlVal = h.ArbpEeqz;
									aDOIFields[8].currentVal = "";
									aDOIFields[8].targetVal = h.ArbpEeqz;
								}

								if (h.Adrnri === "") {
									aDOIFields[10].maintenance = false;
									aDOIFields[10].instLoc = false;
									aDOIFields[10].SupFlVal = "";
									aDOIFields[10].currentVal = "";
									aDOIFields[10].targetVal = "";
								} else if (h.Adrnri === "D") {
									aDOIFields[10].maintenance = true;
									aDOIFields[10].instLoc = false;
									aDOIFields[10].SupFlVal = "";
									aDOIFields[10].currentVal = h.Adrnr;
									aDOIFields[10].targetVal = h.Adrnr;
								} else {
									aDOIFields[10].maintenance = false;
									aDOIFields[10].instLoc = true;
									aDOIFields[10].SupFlVal = h.Adrnr;
									aDOIFields[10].currentVal = "";
									aDOIFields[10].targetVal = h.Adrnr;
								}
							}
						}
					}

					// for (var leq = 0; leq < oAIWEQUIModel.getData().length; leq++) {
					// 	if (sLocalVar === oAIWEQUIModel.getData()[leq].Equnr) {
					// 		g.rowIndex = "/" + leq;
					// 		var oJsonModel = new JSONModel();
					// 		var sCurrentObject = oAIWEQUIModel.getProperty(g.rowIndex);

					// 		sCurrentObject.Title = sCurrentObject.Title ? sCurrentObject.Title : "";
					// 		sCurrentObject.TitleCode = sCurrentObject.TitleCode ? sCurrentObject.TitleCode : "";
					// 		sCurrentObject.Name1 = sCurrentObject.Name1 ? sCurrentObject.Name1 : "";
					// 		sCurrentObject.Name2 = sCurrentObject.Name2 ? sCurrentObject.Name2 : "";
					// 		sCurrentObject.Name3 = sCurrentObject.Name3 ? sCurrentObject.Name3 : "";
					// 		sCurrentObject.Name4 = sCurrentObject.Name4 ? sCurrentObject.Name4 : "";
					// 		sCurrentObject.Sort1 = sCurrentObject.Sort1 ? sCurrentObject.Sort1 : "";
					// 		sCurrentObject.Sort2 = sCurrentObject.Sort2 ? sCurrentObject.Sort2 : "";
					// 		sCurrentObject.NameCo = sCurrentObject.NameCo ? sCurrentObject.NameCo : "";
					// 		sCurrentObject.PostCod1 = sCurrentObject.PostCod1 ? sCurrentObject.PostCod1 : "";
					// 		sCurrentObject.City1 = sCurrentObject.City1 ? sCurrentObject.City1 : "";
					// 		sCurrentObject.Building = sCurrentObject.Building ? sCurrentObject.Building : "";
					// 		sCurrentObject.Floor = sCurrentObject.Floor ? sCurrentObject.Floor : "";
					// 		sCurrentObject.Roomnum = sCurrentObject.Roomnum ? sCurrentObject.Roomnum : "";
					// 		sCurrentObject.Strsuppl1 = sCurrentObject.Strsuppl1 ? sCurrentObject.Strsuppl1 : "";
					// 		sCurrentObject.Strsuppl2 = sCurrentObject.Strsuppl2 ? sCurrentObject.Strsuppl2 : "";
					// 		sCurrentObject.Strsuppl3 = sCurrentObject.Strsuppl3 ? sCurrentObject.Strsuppl3 : "";
					// 		sCurrentObject.AddrLocation = sCurrentObject.AddrLocation ? sCurrentObject.AddrLocation : "";
					// 		sCurrentObject.RefPosta = sCurrentObject.RefPosta ? sCurrentObject.RefPosta : "";
					// 		sCurrentObject.Landx = sCurrentObject.Landx ? sCurrentObject.Landx : "";
					// 		sCurrentObject.TimeZone = sCurrentObject.TimeZone ? sCurrentObject.TimeZone : "";
					// 		sCurrentObject.Region = sCurrentObject.Region ? sCurrentObject.Region : "";
					// 		sCurrentObject.RegionDesc = sCurrentObject.RegionDesc ? sCurrentObject.RegionDesc : "";

					// 		if ((sCurrentObject.Title !== "" && sCurrentObject.Title !== undefined) || (sCurrentObject.TitleCode !== "" && sCurrentObject
					// 				.TitleCode !== undefined) || (sCurrentObject.Name1 !== "" && sCurrentObject.Name1 !== undefined) || (sCurrentObject.Name2 !==
					// 				"" && sCurrentObject.Name2 !== undefined) || (sCurrentObject.Name3 !== "" && sCurrentObject.Name3 !== undefined) ||
					// 			(sCurrentObject.Name4 !== "" && sCurrentObject.Name4 !== undefined) ||
					// 			(sCurrentObject.Sort1 !== "" && sCurrentObject.Sort1 !== undefined) || (sCurrentObject.Sort2 !== "" && sCurrentObject.Sort2 !==
					// 				undefined) || (sCurrentObject.NameCo !== "" && sCurrentObject.NameCo !== undefined) || (sCurrentObject.PostCod1 !== "" &&
					// 				sCurrentObject.PostCod1 !== undefined) || (sCurrentObject.City1 !== "" && sCurrentObject.City1 !== undefined) ||
					// 			(sCurrentObject.Building !== "" && sCurrentObject.Building !== undefined) ||
					// 			(sCurrentObject.Floor !== "" && sCurrentObject.Floor !== undefined) || (sCurrentObject.Roomnum !== "" && sCurrentObject.Roomnum !==
					// 				undefined) || (sCurrentObject.AddrLocation !== "" && sCurrentObject.AddrLocation !== undefined) || (sCurrentObject.Strsuppl1 !==
					// 				"" && sCurrentObject.Strsuppl1 !== undefined) || (sCurrentObject.Strsuppl2 !== "" && sCurrentObject.Strsuppl2 !== undefined) ||
					// 			(sCurrentObject.Strsuppl3 !== "" && sCurrentObject.Strsuppl3 !== undefined) || (sCurrentObject.TimeZone !== "" &&
					// 				sCurrentObject.TimeZone !== undefined) || (sCurrentObject.RefPosta !== "" && sCurrentObject.RefPosta !== undefined) || (
					// 				sCurrentObject.Region !== "" && sCurrentObject.Region !== undefined)) {
					// 			sCurrentObject.RefPostaLblReq = true;

					// 			var sAddressModel = g.getView().getModel("equiAddressView");
					// 			var sAddressData = sAddressModel.getData();
					// 			sAddressData.enabled = sCurrentObject.IsEditable;
					// 			sAddressModel.setData(sAddressData);
					// 		}
					// 		oJsonModel.setData(sCurrentObject);
					// 		g.getView().setModel(oJsonModel, g.oModelName);
					// 		g.lam.setModel(oJsonModel, "AIWLAM");

					// 		var sCopyArray = [oJsonModel.getData()];
					// 		var sSupEquiData = $.map(sCopyArray, function (obj) {
					// 			return $.extend(true, {}, obj);
					// 		});
					// 		var sSupEquiModel = new JSONModel();
					// 		sSupEquiModel.setData(sSupEquiData);
					// 		g.getView().setModel(sSupEquiModel, "SUP_EQUI_DATA");

					// 		var mSupEquiModel = sap.ui.getCore().getModel("SUP_EQUI_DATA");
					// 		var mSupEquiData = mSupEquiModel.getData();
					// 		var mCountCEquiFlag = true;
					// 		for (var se = 0; se < mSupEquiData.length; se++) {
					// 			if (sCurrentObject.Equnr === mSupEquiData[se].Equnr) {
					// 				mCountCEquiFlag = false;
					// 			}
					// 		}
					// 		if (mCountCEquiFlag === true) {
					// 			if ((sCurrentObject.SuperordinateEquip !== "" && sCurrentObject.SuperordinateEquip !== undefined) ||
					// 				(sCurrentObject.Tplnr !== "" && sCurrentObject.Tplnr !== undefined)) {
					// 				mSupEquiData.push(sSupEquiData[0]);
					// 				mSupEquiModel.setData(mSupEquiData);
					// 			}
					// 		}

					// 		oMainViewData.tableBusy = false;
					// 		oMainViewModel.setData(oMainViewData);
					// 		//return;
					// 		break;
					// 	}
					// }
				}
				// oMainData.tableBusy = false;
				// oMainModel.setData(oMainData);
			};
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
				// oMainData.tableBusy = false;
				// oMainModel.setData(oMainData);
				// g.invokeMessage(value);
				sap.m.MessageBox.show(value, {
					title: "Error",
					icon: sap.m.MessageBox.Icon.ERROR,
					onClose: function () {}
				});
			};

			var oModel = this.getView().getModel();
			if (sPayload.FLAddrI.length > 0) {
				sPayload.FLAddrI = $.map(sPayload.FLAddrI, function (obj) {
					return $.extend(true, {}, obj);
				});
				for (var i = 0; i < sPayload.FLAddrI.length > 0; i++) {
					delete sPayload.FLAddrI[i].AdNationEnable;
					delete sPayload.FLAddrI[i].City1iVS;
					delete sPayload.FLAddrI[i].StreetiVS;
				}
			}
			if (sPayload.EqAddrI.length > 0) {
				sPayload.EqAddrI = $.map(sPayload.EqAddrI, function (obj) {
					return $.extend(true, {}, obj);
				});
				for (var i = 0; i < sPayload.EqAddrI.length > 0; i++) {
					delete sPayload.EqAddrI[i].AdNationEnable;
					delete sPayload.EqAddrI[i].City1iVS;
					delete sPayload.EqAddrI[i].StreetiVS;
				}
			}

			oModel.create("/ChangeRequestSet", sPayload, {
				success: fnSuccess,
				error: fnError
			});
		},

		/*
		 * Function to create instance of main DOI fragment
		 * @public
		 */
		getDOIMainFrag: function () {
			if (!gDOIMainFrag) {
				gDOIMainFrag = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.doi.DataOrigin", this);
			}

			return gDOIMainFrag;
		},

		/*
		 * Function to create instance of element level DOI fragment
		 * @public
		 */
		getDOIElementFrag: function () {
			if (!gDOIElementFrag) {
				gDOIElementFrag = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.doi.DOIElement", this);
			}

			return gDOIElementFrag;
		},

		onCRDescChange: function () {
			var crtype = this.getCrType();
			this.setCrType(crtype);
		},

		addLinearChar: function (sModelName) {
			var oSelChar = this.char.getSelectedItem().getBindingContext().getObject();
			var currentData = this.getView().getModel(this.oModelName).getData();
			var oLinChar = {
				Atbez: "",
				Atwrt: oSelChar.Atwrt,
				Charid: oSelChar.Atnam,
				Classtype: oSelChar.Classtype,
				EndPt: 0.00,
				EndPtDisp: "",
				// Equi: "18003449",
				LamLengt: 0.00,
				LamLengtDisp: "",
				LamUnit: "",
				Lamcntr: "",
				Lamlrpid: "",
				MrkrDiE: "0",
				MrkrDiS: "0",
				MrkrDiU: "",
				MrkrEd: "",
				MrkrSt: "",
				StartPt: 0.00,
				StartPtDisp: "",
				Valcnt: "",
				linCharEnable: true
			};

			if (sModelName === "AIWFLOC") {
				oLinChar.Funcloc = currentData.Functionallocation;
			} else if (sModelName === "AIWEQUI") {
				oLinChar.Equi = currentData.Equnr;
			}

			currentData.linearChar.push(oLinChar);
			this.lnrChData.push(oLinChar);
			this.linearChar.setModel(new JSONModel(currentData.linearChar));
		},

		deleteLinearChar: function (oEvent, sModelName) {
			var currentData = this.getView().getModel(this.oModelName).getData();
			var sDelPath = oEvent.getParameter("listItem").getBindingContextPath();
			var sDelIndex = sDelPath.substring(sDelPath.lastIndexOf('/') + 1);
			var oDelObj = oEvent.getParameter("listItem").getBindingContext().getObject();
			currentData.linearChar.splice(sDelIndex, 1);
			this.linearChar.setModel(new JSONModel(currentData.linearChar));

			for (var i in this.lnrChData) {
				if (this.lnrChData[i].Charid === oDelObj.Charid && this.lnrChData[i].Atwrt === oDelObj.Atwrt && this.lnrChData[i].StartPtDisp ===
					oDelObj.StartPtDisp && this.lnrChData[i].EndPtDisp === oDelObj.EndPtDisp) {
					this.lnrChData.splice(i, 1);
				}
			}
		},

		handleCharSelectChange: function (oEvent) {
			var g = this;
			var currentData = g.getView().getModel(g.oModelName).getData();
			var linearCharFragmentId = this.getView().createId("linearcharFrag");
			var sBtnAddLinChar = sap.ui.core.Fragment.byId(linearCharFragmentId, "idBtnAddLinChar");
			var oSelChar = oEvent.getParameter("listItem").getBindingContext().getObject();
			var m = g.getView().getModel("valueHelp2");
			var aFilter = [new sap.ui.model.Filter("Class", "EQ", oSelChar.Class), new sap.ui.model.Filter("ClassType", "EQ", oSelChar.Classtype),
				new sap.ui.model.Filter("Atnam", "EQ", oSelChar.Atnam)
			];
			var q = "/LamCharCheckSet";
			m.read(q, {
				filters: aFilter,
				success: function (d) {
					if (d.results[0].IsLinear === true) {
						sBtnAddLinChar.setEnabled(true);
						if (g.lnrChData && g.lnrChData.length > 0) {
							for (var i in g.lnrChData) {
								currentData.linearChar = [];
								if (g.lnrChData[i].Charid === oSelChar.Atnam && g.lnrChData[i].Atbez === oSelChar.Atwrt) {
									currentData.linearChar.push(g.lnrChData[i]);
								}
							}
							g.linearChar.setModel(new JSONModel(currentData.linearChar));
						}
					} else {
						sBtnAddLinChar.setEnabled(false);
						currentData.linearChar = [];
						g.linearChar.setModel(new JSONModel(currentData.linearChar));
					}
				},
				error: function () {
					sBtnAddLinChar.setEnabled(false);
					currentData.linearChar = [];
					g.linearChar.setModel(new JSONModel(currentData.linearChar));
				}
			});
		},

		onLCHStPtChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var sSelObj = oSource.getParent().getBindingContext().getObject();
			var sStPt = sSelObj.StartPtDisp;
			var sEdPt = sSelObj.EndPtDisp;
			oSource.setValueState("None");

			if (sEdPt === "") {
				return;
			}

			if (sEdPt < sStPt) {
				oSource.setValueState("Error");
			} else {
				sSelObj.LamLengtDisp = (sEdPt - sStPt).toString();
			}
		},
		onLCHEdPtChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var sSelObj = oSource.getParent().getBindingContext().getObject();
			var sStPt = sSelObj.StartPtDisp;
			var sEdPt = sSelObj.EndPtDisp;
			oSource.setValueState("None");

			if (sStPt === "") {
				return;
			}

			if (sEdPt < sStPt) {
				oSource.setValueState("Error");
			} else {
				sSelObj.LamLengtDisp = (sEdPt - sStPt).toString();
			}
		},

		onLCHuomVH: function (oEvent) {
			ValueHelpRequest.UOMVH(oEvent, this);
		},
		onLCHuomChange: function (oEvent) {
			ValueHelpRequest._UOMchange(oEvent, this);
		},

		/**
		 * Triggered on press of Data Origin button at element level
		 * @function
		 * @public
		 * @param {sap.ui.base.Event} oEvent the press event
		 */
		// onDataOriginPress: function (oEvent) {
		// 	var g = this;
		// 	if (!gDOIElementFrag) {
		// 		gDOIElementFrag = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.doi.DOIElement", this);
		// 	}

		// 	var oDoiElement = {
		// 		flocVisible: true,
		// 		equiVisible: true,
		// 		parent: "",
		// 		parentDesc: "",
		// 		parentSelected: false,
		// 		IndvSelected: false,
		// 		currentObj: "",
		// 		currentObjDesc: "",
		// 		DOIindex: null
		// 	};
		// 	var mDoiElement = new JSONModel(oDoiElement);
		// 	gDOIElementFrag.setModel(mDoiElement, "doiElement");
		// 	// this.getView().setModel(doiElementModel, "doiElement");

		// 	var aData = this.getView().getModel(this.oModelName).getData();
		// 	var aDOIdata = this.getView().getModel("dataOrigin").getData();

		// 	if (this.oModelName === "AIWEQUI") {
		// 		if (aData.SuperordinateEquip !== "") {
		// 			oDoiElement.flocVisible = false;
		// 			oDoiElement.equiVisible = true;
		// 		} else if (aData.SuperordinateEquip === "" && aData.Tplnr !== "") {
		// 			oDoiElement.flocVisible = true;
		// 			oDoiElement.equiVisible = false;
		// 		}
		// 	} else if (this.oModelName === "AIWFLOC") {
		// 		oDoiElement.flocVisible = true;
		// 		oDoiElement.equiVisible = false;
		// 	}

		// 	var oSource = oEvent.getSource(),
		// 		dataOriginInput,
		// 		dataOrgFlocInp = gDOIElementFrag.getContent()[0].getContent()[1],
		// 		dataOrgFlocCheck = gDOIElementFrag.getContent()[0].getContent()[2],
		// 		dataOrgEquiInp = gDOIElementFrag.getContent()[0].getContent()[4],
		// 		dataOrgEquiCheck = gDOIElementFrag.getContent()[0].getContent()[5],
		// 		dataOrgIndvInp = gDOIElementFrag.getContent()[0].getContent()[7],
		// 		dataOrgIndvCheck = gDOIElementFrag.getContent()[0].getContent()[8];

		// 	dataOrgIndvInp.mEventRegistry.valueHelpRequest = [];
		// 	if (oSource.getId().includes("MaintenancePlant")) {
		// 		gDOIElementFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("MAINT_PLANT"));
		// 		dataOriginInput = this.getView().byId("idMaintenancePlant").getValue();
		// 		dataOrgIndvInp.setShowValueHelp(true);
		// 		dataOrgIndvInp.attachValueHelpRequest(function (e) {
		// 			this.onMaintPlantVH("idMaintenancePlant", e);
		// 		});
		// 		if (dataOriginInput === "") {
		// 			dataOrgFlocInp.setEnabled(false);
		// 			dataOrgFlocCheck.setEnabled(false);
		// 			dataOrgEquiInp.setEnabled(false);
		// 			dataOrgEquiCheck.setEnabled(false);
		// 		}

		// 		var sDOIindex = 1;
		// 		oDoiElement.DOIindex = sDOIindex;
		// 		oDoiElement.parent = aDOIdata[sDOIindex].SupFlVal;
		// 		if (aDOIdata[sDOIindex].maintenance === false) {
		// 			oDoiElement.parentSelected = true;
		// 			oDoiElement.IndvSelected = false;
		// 		} else {
		// 			oDoiElement.parentSelected = false;
		// 			oDoiElement.IndvSelected = true;
		// 		}
		// 	} else if (oSource.getId().includes("Location")) {
		// 		gDOIElementFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("LOC"));
		// 		dataOriginInput = this.getView().byId("idLocation").getValue();
		// 		dataOrgIndvInp.setShowValueHelp(true);
		// 		dataOrgIndvInp.attachValueHelpRequest(function (e) {
		// 			g.onDOILocationVH(g, e);
		// 		});
		// 		if (dataOriginInput === "") {
		// 			dataOrgFlocInp.setEnabled(false);
		// 			dataOrgFlocCheck.setEnabled(false);
		// 			dataOrgEquiInp.setEnabled(false);
		// 			dataOrgEquiCheck.setEnabled(false);
		// 		}

		// 		var sDOIindex = 6;
		// 		oDoiElement.DOIindex = sDOIindex;
		// 		oDoiElement.parent = aDOIdata[sDOIindex].SupFlVal;
		// 		if (aDOIdata[2].maintenance === false) {
		// 			oDoiElement.parentSelected = true;
		// 			oDoiElement.IndvSelected = false;
		// 		} else {
		// 			oDoiElement.parentSelected = false;
		// 			oDoiElement.IndvSelected = true;
		// 		}
		// 	} else if (oSource.getId().includes("abcInd")) {
		// 		gDOIElementFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("ABC_IND"));
		// 		dataOriginInput = this.getView().byId("idAbcInd").getValue();
		// 		dataOrgIndvInp.setShowValueHelp(true);
		// 		dataOrgIndvInp.attachValueHelpRequest(function (e) {
		// 			g.onDOIabcIndVH(g, e);
		// 		});
		// 		if (dataOriginInput === "") {
		// 			dataOrgFlocInp.setEnabled(false);
		// 			dataOrgFlocCheck.setEnabled(false);
		// 			dataOrgEquiInp.setEnabled(false);
		// 			dataOrgEquiCheck.setEnabled(false);
		// 		}

		// 		var sDOIindex = 6;
		// 		oDoiElement.DOIindex = sDOIindex
		// 		oDoiElement.parent = aDOIdata[sDOIindex].SupFlVal;
		// 		if (aDOIdata[sDOIindex].maintenance === false) {
		// 			oDoiElement.parentSelected = true;
		// 			oDoiElement.IndvSelected = false;
		// 		} else {
		// 			oDoiElement.parentSelected = false;
		// 			oDoiElement.IndvSelected = true;
		// 		}
		// 	} else if (oSource.getId().includes("PlantSec")) {
		// 		gDOIElementFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("PL_SEC"));
		// 		dataOriginInput = this.getView().byId("idPlntSec").getValue();
		// 		dataOrgIndvInp.setShowValueHelp(true);
		// 		dataOrgIndvInp.attachValueHelpRequest(function (e) {
		// 			g.onDOIPlantSecVH(g, e);
		// 		});
		// 		if (dataOriginInput === "") {
		// 			dataOrgFlocInp.setEnabled(false);
		// 			dataOrgFlocCheck.setEnabled(false);
		// 			dataOrgEquiInp.setEnabled(false);
		// 			dataOrgEquiCheck.setEnabled(false);
		// 		}

		// 		var sDOIindex = 4;
		// 		oDoiElement.DOIindex = sDOIindex
		// 		oDoiElement.parent = aDOIdata[sDOIindex].SupFlVal;
		// 		if (aDOIdata[sDOIindex].maintenance === false) {
		// 			oDoiElement.parentSelected = true;
		// 			oDoiElement.IndvSelected = false;
		// 		} else {
		// 			oDoiElement.parentSelected = false;
		// 			oDoiElement.IndvSelected = true;
		// 		}
		// 	} else if (oSource.getId().includes("WorkCen")) {
		// 		gDOIElementFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("WC"));
		// 		dataOriginInput = this.getView().byId("idWorkCen").getValue();
		// 		dataOrgIndvInp.setShowValueHelp(true);
		// 		dataOrgIndvInp.attachValueHelpRequest(function (e) {
		// 			g.onDOIMainwcVH(g, e);
		// 		});
		// 		if (dataOriginInput === "") {
		// 			dataOrgFlocInp.setEnabled(false);
		// 			dataOrgFlocCheck.setEnabled(false);
		// 			dataOrgEquiInp.setEnabled(false);
		// 			dataOrgEquiCheck.setEnabled(false);
		// 		}

		// 		var sDOIindex = 5;
		// 		oDoiElement.DOIindex = sDOIindex
		// 		oDoiElement.parent = aDOIdata[sDOIindex].SupFlVal;
		// 		if (aDOIdata[sDOIindex].maintenance === false) {
		// 			oDoiElement.parentSelected = true;
		// 			oDoiElement.IndvSelected = false;
		// 		} else {
		// 			oDoiElement.parentSelected = false;
		// 			oDoiElement.IndvSelected = true;
		// 		}
		// 	} else if (oSource.getId().includes("CostCenter")) {
		// 		gDOIElementFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("CC"));
		// 		dataOriginInput = this.getView().byId("idCostCtr").getValue();
		// 		dataOrgIndvInp.setShowValueHelp(true);
		// 		dataOrgIndvInp.attachValueHelpRequest(function (e) {
		// 			g.onDOICostCenterVH(g, e);
		// 		});
		// 		if (dataOriginInput === "") {
		// 			dataOrgFlocInp.setEnabled(false);
		// 			dataOrgFlocCheck.setEnabled(false);
		// 			dataOrgEquiInp.setEnabled(false);
		// 			dataOrgEquiCheck.setEnabled(false);
		// 		}

		// 		var sDOIindex = this.oModelName === "AIWEQUI" ? 13: 16;
		// 		oDoiElement.DOIindex = sDOIindex
		// 		oDoiElement.parent = aDOIdata[sDOIindex].SupFlVal;
		// 		if (aDOIdata[sDOIindex].maintenance === false) {
		// 			oDoiElement.parentSelected = true;
		// 			oDoiElement.IndvSelected = false;
		// 		} else {
		// 			oDoiElement.parentSelected = false;
		// 			oDoiElement.IndvSelected = true;
		// 		}
		// 	}

		// 	// if (this.oModelName === "AIWEQUI") {
		// 	// 	if (aData.SuperordinateEquip !== "") {
		// 	// 		dataOrgEquiInp.setValue(dataOriginInput);
		// 	// 	} else if (aData.SuperordinateEquip === "" && aData.Tplnr !== "") {
		// 	// 		dataOrgFlocInp.setValue(dataOriginInput);
		// 	// 	}
		// 	// } else if (this.oModelName === "AIWFLOC") {

		// 	// }
		// 	// dataOrgIndvInp.setValue(dataOriginInput);

		// 	// oDoiElement.parent = dataOriginInput;
		// 	oDoiElement.currentObj = dataOriginInput;
		// 	mDoiElement = new JSONModel(oDoiElement);
		// 	gDOIElementFrag.setModel(mDoiElement, "doiElement");

		// 	gDOIElementFrag.open();
		// },

		// /**
		//  * 'Select'event handler for Parent/Individual check boxes in DOI Element dialog
		//  * @function
		//  * @public
		//  * @param {sap.ui.base.Event} oEvent the press event
		//  */
		// onCheckSelect: function (oEvent) {
		// 	var sSourceId = oEvent.getSource().getId();
		// 	var mDoiElement = gDOIElementFrag.getModel("doiElement");
		// 	var oDoiElement = mDoiElement.getData();

		// 	if (sSourceId.includes("IndvMaint")) {
		// 		oDoiElement.parentSelected = false;
		// 		oDoiElement.IndvSelected = true;
		// 	} else {
		// 		oDoiElement.parentSelected = true;
		// 		oDoiElement.IndvSelected = false;
		// 	}
		// 	gDOIElementFrag.setModel(mDoiElement, "doiElement");
		// },

		// /**
		//  * Triggered on press of INSTALL in DOI Element dialog
		//  * @function
		//  * @public
		//  * @param {sap.ui.base.Event} oEvent the press event
		//  */
		// onElementActionPress: function (oEvent) {
		// 	var sValue, sDesc, sDesc2;
		// 	var mDoiElement = gDOIElementFrag.getModel("doiElement");
		// 	var oDoiElement = mDoiElement.getData();

		// 	var aData = this.getView().getModel(this.oModelName).getData();
		// 	var aDOIdata = this.getView().getModel("dataOrigin").getData();

		// 	if (oDoiElement.IndvSelected) {
		// 		aDOIdata[oDoiElement.DOIindex].instLoc = false;
		// 		aDOIdata[oDoiElement.DOIindex].maintenance = true;
		// 		aDOIdata[oDoiElement.DOIindex].currentVal = oDoiElement.currentObj;
		// 		sValue = oDoiElement.currentObj;
		// 		sDesc = oDoiElement.currentObjDesc;
		// 		sDesc2 = oDoiElement.currentObjDesc2 !== undefined ? oDoiElement.currentObjDesc2 : "";
		// 	} else if (oDoiElement.parentSelected) {
		// 		aDOIdata[oDoiElement.DOIindex].instLoc = true;
		// 		aDOIdata[oDoiElement.DOIindex].maintenance = false;
		// 		aDOIdata[oDoiElement.DOIindex].currentVal = oDoiElement.parent;
		// 		sValue = oDoiElement.parent;
		// 		sDesc = oDoiElement.parentDesc;
		// 		sDesc2 = oDoiElement.currentObjDesc2 !== undefined ? oDoiElement.currentObjDesc2 : "";
		// 	}

		// 	if (oDoiElement.DOIindex === 2) { //Location
		// 		aData.Location = sValue;
		// 		aData.Locationdesc = sDesc;
		// 	}
		// 	if (oDoiElement.DOIindex === 4) { //Plant Section
		// 		aData.BeberFl = sValue;
		// 		aData.Fing = sDesc;
		// 		aData.Tele = sDesc2;
		// 	}
		// 	if (oDoiElement.DOIindex === 5) { //Work center
		// 		aData.Arbpl = sValue;
		// 		aData.Ktext = sDesc;
		// 	}
		// 	if (oDoiElement.DOIindex === 6) { //ABC Indicator
		// 		aData.Abckz = sValue;
		// 		aData.Abctx = sDesc;
		// 	}
		// 	if (oDoiElement.DOIindex === 11) { //Cost Center
		// 		aData.Kostl = sValue;
		// 		aData.Kokrs = sDesc;
		// 		aData.Mctxt = sDesc2;
		// 	}

		// 	this.getView().getModel("dataOrigin").refresh();
		// 	this.getView().getModel(this.oModelName).refresh();

		// 	oEvent.getSource().getParent().close();
		// },

		// /**
		//  * Triggered on press of CANCEL in DOI Element dialog
		//  * @function
		//  * @public
		//  * @param {sap.ui.base.Event} oEvent the press event
		//  */
		// onElementCancelPress: function (oEvent) {
		// 	oEvent.getSource().getParent().close();
		// },
	});
});