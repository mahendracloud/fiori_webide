sap.ui.define([
		"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageBox",
		// "sap/ui/core/format/NumberFormat"
	],
	function (ValueHelpProvider, JSONModel, MessageBox) { //NumberFormat
		"use strict";
		// var oNumberFormat = NumberFormat.getFloatInstance({
		// 	// maxFractionDigits: 7,
		// 	// minFractionDigits: 2,
		// 	decimalSeparator:",",
		// 	decimals: 3,
		// 	groupingEnabled: true,
		// 	groupingSeparator: "."
		// }, sap.ui.getCore().getConfiguration().getLocale());
		return {
			onTaskListUsageVH: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("TLUSG"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/TLUsageSet",
						template: new sap.m.StandardListItem({
							title: "{Planv}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						p.PlanvPrt = E.getParameters().selectedItem.getProperty("title");
						p.PlanvPrtText = E.getParameters().selectedItem.getProperty("description");
						p.PlanvPrtVS = "None";
						p.PlanvPrtVST = "";
						g.getModel(g.oModelName).refresh();
					}
				};

				var q = "/TLUsageSet";
				var M = g.getView().getModel("valueHelp");
				var tlUsgSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Planv", "Txt");
				tlUsgSelectDialog.open();
			},

			onStdTextKeyVH: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("STDTXTKEY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/StTextKeySet",
						template: new sap.m.StandardListItem({
							title: "{Vlsch}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						p.KtschPrt = E.getParameters().selectedItem.getProperty("title");
						p.KtschPrtText = E.getParameters().selectedItem.getProperty("description");
						p.KtschPrtVS = "None";
						p.KtschPrtVST = "";
						g.getModel(g.oModelName).refresh();
					}
				};

				var q = "/StTextKeySet";
				var M = g.getView().getModel("valueHelp");
				var stdTextKeySelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Vlsch", "Txt");
				stdTextKeySelectDialog.open();
			},

			onUsgValFormulaVH: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("STDTXTKEY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/PrtUsageSet",
						template: new sap.m.StandardListItem({
							title: "{Ident}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						p.Ewformprt = E.getParameters().selectedItem.getProperty("title");
						p.EwformprtText = E.getParameters().selectedItem.getProperty("description");
						p.EwformprtVS = "None";
						p.EwformprtVST = "";
						g.getModel(g.oModelName).refresh();
					}
				};

				var q = "/PrtUsageSet";
				var M = g.getView().getModel("valueHelp");
				var usgValFormulaSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Ident", "Txt");
				usgValFormulaSelectDialog.open();
			},

			onControlKeyVH: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("CTRLKEY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/PRTCtlKeySet",
						template: new sap.m.StandardListItem({
							title: "{Steuf}",
							description: "{Stftxt}"
						})
					},
					confirm: function (E) {
						p.SteufPrt = E.getParameters().selectedItem.getProperty("title");
						p.SteufPrtText = E.getParameters().selectedItem.getProperty("description");
						p.SteufPrtVS = "None";
						p.SteufPrtVST = "";
						g.getModel(g.oModelName).refresh();
					}
				};

				var q = "/PRTCtlKeySet";
				var M = g.getView().getModel("valueHelp");
				var controlKeySelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Steuf", "Stftxt");
				controlKeySelectDialog.open();
			},

			_changeTLUSG: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.PlanvPrt;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/TLUsageSet";
					var oFilters = [new sap.ui.model.Filter("Planv", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.PlanvPrt = d.results[0].Planv;
							oSource.setValueState("None");
							oSource.setValueStateText("");
						} else {
							oJsonData.PlanvPrt = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				}
			},

			_changeStdTxtKey: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.KtschPrt;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/StTextKeySet";
					var oFilters = [new sap.ui.model.Filter("Vlsch", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.KtschPrt = d.results[0].Vlsch;
							oSource.setValueState("None");
							oSource.setValueStateText("");
						} else {
							oJsonData.KtschPrt = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				}
			},

			_changeUsgValFormula: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Ewformprt;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/PrtUsageSet";
					var oFilters = [new sap.ui.model.Filter("Ident", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Ewformprt = d.results[0].Ident;
							oSource.setValueState("None");
							oSource.setValueStateText("");
						} else {
							oJsonData.Ewformprt = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				}
			},

			_changeControlKey: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.SteufPrt;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/PRTCtlKeySet";
					var oFilters = [new sap.ui.model.Filter("Steuf", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.SteufPrt = d.results[0].Steuf;
							oSource.setValueState("None");
							oSource.setValueStateText("");
						} else {
							oJsonData.SteufPrt = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				}
			},

			_changeRegionChange: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Region;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/RegionSet";
					var oFilters = [new sap.ui.model.Filter("Bland", "EQ", c), new sap.ui.model.Filter("Land1", "EQ", oJsonData.RefPosta)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Region = d.results[0].Bland; //a;
							oJsonData.RegionDesc = d.results[0].Bezei;
						} else {
							oJsonData.Region = "";
							oJsonData.RegionDesc = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Region = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunRegion: function (p, g) { // var strSearchResults;
				var oSource = p.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("RGIN"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>CNTRY}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>RGIN}"
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
						path: "/RegionSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Land1}"
								}),
								new sap.m.Text({
									text: "{Bland}"
								}),
								new sap.m.Text({
									text: "{Bezei}"
								})
							]
						})

					},
					confirm: function (E) {
						oJsonData.Region = E.getParameter("selectedItem").getCells()[1].getText();
						oJsonData.RegionDesc = E.getParameter("selectedItem").getCells()[2].getText();
						oSource.setValueState("None");
						oSource.setValueStateText("");
						oJsonModel.setData(oJsonData);
					}
				};

				var sPath = "/RegionSet";
				var oFilters = [new sap.ui.model.Filter("Land1", "EQ", oJsonData.RefPosta)];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Land1}"
					}),
					new sap.m.Text({
						text: "{Bland}"
					}),
					new sap.m.Text({
						text: "{Bezei}"
					})
				];

				var strSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Bland", "Bezei");
				strSelectDialog.open();
				strSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},
			_changeTimeZoneChange: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.TimeZone;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/TimezoneSet";
					var oFilters = [new sap.ui.model.Filter("Tzone", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.TimeZone = d.results[0].Tzone;
							g.onTimeZoneValidation(oJsonData.TimeZone, oJsonData.RefPosta, oJsonData.PostCod1);
						} else {
							oJsonData.TimeZone = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
					// } else {
					// 	oJsonData.RefPosta = a;
					// 	oJsonModel.setData(oJsonData);
				}
			},
			_changeEquiment: function (f, g) {
				var sModelName;
				if (g.oModelName) {
					sModelName = g.oModelName;
				} else if (g.oSearchModelName) {
					sModelName = g.oSearchModelName;
				}
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Equnr;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/EquipmentNumberSet";
					var oModel = g.getView().getModel("valueHelp");
					var oFilters = [new sap.ui.model.Filter("Equnr", "EQ", c)];
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							g.Equnr = a;
							oJsonData.Equnr = d.results[0].Equnr; //a;
							oJsonData.Eqktx = d.results[0].Eqktx;

							if (sModelName.indexOf("Search") > -1) {
								return;
							}
							if (sModelName !== "AIWEQUI") {
								if (sModelName === "itemDetailView") {
									if (oJsonData.Tplnr !== "" || oJsonData.Tplnr !== undefined) {
										oJsonData.Tplnr = "";
										oJsonData.Pltxt = "";
										oJsonModel.setData(oJsonData);
									}
									sModelName = "AIWMPMI";
									g.fetchData(sModelName, parseInt(g.mainRowIndex), parseInt(g.itemPath));
									if (d.results[0].Eqtyp === "L" && g.lamSwitch === "X") {
										g.lam.setVisible(true);
									} else {
										g.lam.setVisible(false);
									}

								} else {
									g.fetchData(sModelName);
								}
							}
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Equnr = g.Equnr;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunTimeZone: function (p, g) {
				var oSource = p.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("TIME_ZONE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>TIME_ZONE}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>TIMEZONE_TXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>DIFF_FRM_UTC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>DAYLGHT_SAVE_RULE}"
								})
							]
						})
					],
					items: {
						path: "/TimezoneSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Tzone}"
								}),
								new sap.m.Text({
									text: "{Descript}"
								}),
								new sap.m.Text({
									text: "{Zonedesc}"
								}),
								new sap.m.Text({
									text: "{Dstrule}"
								})
							]
						})
					},
					confirm: function (E) {
						oJsonData.RefPostaLblReq = true;
						oJsonData.TimeZone = E.getParameter("selectedItem").getCells()[0].getText();
						oSource.setValueState("None");
						oSource.setValueStateText("");
						oJsonModel.setData(oJsonData);
						g.onTimeZoneValidation(oJsonData.TimeZone, oJsonData.RefPosta, oJsonData.PostCod1);
					}
				};
				var sPath = "/TimezoneSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Tzone}"
					}),
					new sap.m.Text({
						text: "{Descript}"
					}),
					new sap.m.Text({
						text: "{Zonedesc}"
					}),
					new sap.m.Text({
						text: "{Dstrule}"
					})
				];

				var cgSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Tzone", "Descript");
				cgSelectDialog.open();
				cgSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeMeasPointNumber: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Mspoint;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MSPT_FL_VHSet";
					var oFilters = [new sap.ui.model.Filter("Point", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Mspoint = d.results[0].Point; //a;
						} else {
							oJsonData.Mspoint = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Mspoint = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunEquipment: function (oEvent, g) {
				var mpSearchResults;
				if (mpSearchResults === undefined) {
					var sModelName;
					if (g.oModelName) {
						sModelName = g.oModelName;
					} else if (g.oSearchModelName) {
						sModelName = g.oSearchModelName;
					}
					var oSource = oEvent.getSource();
					var oJsonModel = g.getView().getModel(sModelName);
					var oJsonData = oJsonModel.getData();
					var mpSelectDialog = new sap.m.SelectDialog({
						title: g.getView().getModel("i18n").getProperty("EQUIP_TXT"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
						growingThreshold: 5000,
						items: {
							path: "/EquipmentNumberSet",
							template: new sap.m.StandardListItem({
								title: "{Equnr}",
								description: "{Eqktx}"
							})
						},
						confirm: function (E) {
							oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
							oJsonData.Eqktx = E.getParameters().selectedItem.getProperty("description");
							oSource.setValueState("None");
							oSource.setValueStateText("");
							oJsonModel.setData(oJsonData);

							if (sModelName.indexOf("Search") > -1) {
								return;
							}
							if (sModelName !== "AIWEQUI") {
								if (sModelName === "itemDetailView") {
									if (oJsonData.Tplnr !== "" || oJsonData.Tplnr !== undefined) {
										oJsonData.Tplnr = "";
										oJsonData.Pltxt = "";
										oJsonModel.setData(oJsonData);
									}
									sModelName = "AIWMPMI";
									g.fetchData(sModelName, parseInt(g.mainRowIndex), parseInt(g.itemPath));
									var sSelPath = E.getParameter("selectedItem").getBindingContext().sPath;
									var sSelCat = E.getSource().getModel().getProperty(sSelPath).Eqtyp;
									if (sSelCat === "L" && g.lamSwitch === "X") {
										g.lam.setVisible(true);
									} else {
										g.lam.setVisible(false);
									}
								} else {
									g.fetchData(sModelName);
								}
							}
						},
						search: function (E) {
							var sValue = E.getParameter("value");
							if (E.getSource().getBinding("items")) {
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Equnr", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Eqktx", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}

						}
					});

					var sPath = "/EquipmentNumberSet";
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							if (sModelName !== "AIWEQUI") {
								var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
								if (oModelData.length > 0) {
									for (var i = 0; i < oModelData.length; i++) {
										if (oModelData[i].Equnr) {
											var sObj = {
												Equnr: oModelData[i].Equnr,
												Eqktx: oModelData[i].Eqktx,
												Eqtyp: oModelData[i].EquipmentCatogory
											};
											h.results.unshift(sObj);
										}
									}
								}
							}
							mpSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Equnr}",
								description: "{Eqktx}",
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

				// var oModel = g.getView().getModel("valueHelp");
				// g._valueHelpDialog = sap.ui.xmlfragment("ugiaiwui.mdg.aiw.ZAIW_UI_03.Fragments.EquipmentVH", g);
				// g.getView().addDependent(g._valueHelpDialog);
				// g._valueHelpDialog.setModel(oModel);
				// g._valueHelpDialog.open();
				// if (g.oModelName === "AIWEQUI" || g.oSearchModelName === "AIWEQUI") {
				// 	g.inputId = "EQUI_Equipment";
				// } else if (g.oModelName === "AIWMSPT" || g.oSearchModelName === "AIWMSPT") {
				// 	g.inputId = "MSPT_Equipment";
				// } else if (g.oModelName === "itemDetailView") {
				// 	g.inputId = "Item_Equipment";
				// }

			},

			valueHelpFunCycleCounter: function (oEvent, p, g) {
				var sModelData, coSelectDialog, coSearchResults;
				var sContextPath = oEvent.getSource().getBindingContext(g.oModelName).sPath;
				sModelData = g.getView().getModel(g.oModelName).getProperty("/cycleModel");
				sContextPath = sContextPath.substring(sContextPath.lastIndexOf("/") + 1);
				g.index = parseInt(sContextPath.substr(-1));

				var settings = {
					title: g.getView().getModel("i18n").getProperty("COUNTER_TXT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>MEASPOINT_TXT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MEAS_POS}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MEAS_PT_CAT}"
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
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>COUNTER}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MEAS_RANGE_UNIT}"
								})
							]
						})
					],
					items: {
						path: "/MSCounterSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Point}"
								}),
								new sap.m.Text({
									text: "{Psort}"
								}),
								new sap.m.Text({
									text: "{Mptyp}"
								}),
								new sap.m.Text({
									text: "{Pttxt}"
								}),
								new sap.m.Text({
									text: "{Indct}"
								}),
								new sap.m.Text({
									text: "{MsUnit}"
								})
							]
						})
					},
					confirm: function (E) {
						sModelData[g.index].Point = E.getParameter("selectedItem").getCells()[0].getText();
						sModelData[g.index].Psort = E.getParameter("selectedItem").getCells()[1].getText();
						sModelData[g.index].PointVS = "None";
						g.getView().getModel(g.oModelName).setProperty("/cycleModel", sModelData);
						g.getView().getModel(g.oModelName).refresh();
						p.SzaehLBL = true;
						p.SzaehVis = true;
						p.UnitcVis = true;
						p.StadtLBL = false;
						p.StadtVis = false;

						p.ScheIndRbTimeEnabled = false;
						p.ScheIndRbTimeKeyDateEnabled = false;
						p.ScheIndRbTimeFactCalEnabled = false;
						p.ScheIndRbPerformanceEnabled = true;
						p.ScheIndRbPerformance = true;
						p.Stich = 3;
						p.Fabkl = "";
						p.FabklDesc = "";
						p.FabklEnabled = false;
						p.FabklLBLReq = false;
						g.getView().getModel(g.oModelName).refresh();
						g.readCycleCounterData(p, sModelData[g.index].Point);
						if (sModelData[g.index].Zeieh !== "" && sModelData[g.index].Point !== "") {
							g.readCounterReading(sModelData[g.index].Point, sModelData[g.index].Zeieh);
						}
						g.counter = false;
					}
				};

				var sPath = "/MSCounterSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Point}"
					}),
					new sap.m.Text({
						text: "{Psort}"
					}),
					new sap.m.Text({
						text: "{Mptyp}"
					}),
					new sap.m.Text({
						text: "{Pttxt}"
					}),
					new sap.m.Text({
						text: "{Indct}"
					}),
					new sap.m.Text({
						text: "{MsUnit}"
					})
				];

				var coSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Point", "Psort");
				coSelectDialog.open();
				coSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeMaintPlan: function (f, g) {
				var c = f.Warpl;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MPlanVHSet";
					var oFilters = [new sap.ui.model.Filter("Warpl", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.Warpl = d.results[0].Warpl; //a;
						} else {
							f.WarplVS = "Error";
							f.WarplVST = "Invalid Entry";
						}
						g.getView().getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.WarplVS = "Error";
						f.WarplVST = d;
						g.getView().getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.Warpl = a;
					g.getView().getModel(g.oModelName).refresh();
				}
			},

			_changeEquipmentCategory: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.EquipmentCatogory;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var PRTVisibleEnableModel = g.getView().getModel("PRTVisibleEnableModel");
				if (PRTVisibleEnableModel) {
					var PRTVisibleEnableData = PRTVisibleEnableModel.getData();
				}
				// var AIWEQUI = g.getView().getModel("AIWEQUI");
				// var AIWEQUIData = AIWEQUI.getData();
				if (a !== "") {
					var sPath = "/EquipCatgValueHelps";
					var oFilters = [new sap.ui.model.Filter("EquipmentCatogory", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							g.EquipmentCatogory = d.results[0].EquipmentCatogory; //a;
							oJsonData.EquipmentCatogory = d.results[0].EquipmentCatogory; //a;
							oJsonModel.setData(oJsonData);

							if (g.detailFlag) {
								oJsonData.EquipCatgDescription = d.results[0].EquipCatgDescription;
								oJsonModel.setData(oJsonData);
								g.readStatusProf(c, g);
							}

							if (PRTVisibleEnableModel) {
								var prtEnable = d.results[0].Fhmkz;
								if (prtEnable) {
									PRTVisibleEnableData.PRTVisible = true;
									PRTVisibleEnableData.PRTEnable = true;
									oJsonData.Fhmkz = true;
								} else {
									PRTVisibleEnableData.PRTVisible = false;
									PRTVisibleEnableData.PRTEnable = false;
									oJsonData.Fhmkz = false;
									oJsonData.PlanvPrt = "";
									oJsonData.SteufPrt = "";
									oJsonData.KtschPrt = "";
									oJsonData.Ewformprt = "";
									oJsonData.SteufRef = false;
									oJsonData.KtschRef = false;
									oJsonData.EwformRef = false;
								}
								oJsonModel.setData(oJsonData);
								PRTVisibleEnableModel.setData(PRTVisibleEnableData);
							}

							if (oJsonData.EquipmentCatogory === "L" && g.lamSwitch === "X") {
								if (oJsonData.lam === undefined) {
									oJsonData.lam = {
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
								g.lam.setVisible(true);
								g.lam.setModel(oJsonModel, "AIWLAM");
								g.linearChar.setVisible(true);
							} else {
								g.lam.setVisible(false);
								g.linearChar.setVisible(false);
							}
						} else {
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.EquipmentCatogory = g.EquipmentCatogory;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunEquipCat: function (p, g) {
				var PRTVisibleEnableModel = g.getView().getModel("PRTVisibleEnableModel");
				if (PRTVisibleEnableModel) {
					var PRTVisibleEnableData = PRTVisibleEnableModel.getData();
				}
				// var AIWEQUI = g.getView().getModel("AIWEQUI");
				// var AIWEQUIData = AIWEQUI.getData();

				var settings = {
					title: g.getView().getModel("i18n").getProperty("xtxt.EQUIP_CAT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/EquipCatgValueHelps",
						template: new sap.m.StandardListItem({
							title: "{EquipmentCatogory}",
							description: "{EquipCatgDescription}"
						})
					},
					confirm: function (E) {
						p.EquipmentCatogoryVS = "None";
						p.EquipmentCatogoryVST = "";
						p.EquipmentCatogory = E.getParameters().selectedItem.getProperty("title");
						if (g.detailFlag) {
							p.EquipCatgDescription = E.getParameters().selectedItem.getProperty("description");
							g.readStatusProf(p.EquipmentCatogory, g);
							if (p.EquipmentCatogory === "L" && g.lamSwitch === "X") {
								if (p.lam === undefined) {
									p.lam = {
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
								g.lam.setVisible(true);
								g.lam.setModel(new JSONModel(p), "AIWLAM");
								g.linearChar.setVisible(true);
							} else {
								g.lam.setVisible(false);
								g.linearChar.setVisible(false);
							}
						} else {
							g.getModel(g.oModelName).refresh();
						}

						if (PRTVisibleEnableModel) {
							var sPath = E.getParameter("selectedItem").getBindingContext().sPath;
							sPath = sPath + "/Fhmkz";
							var prtEnable = E.getParameter("selectedItem").getModel().getProperty(sPath);
							if (prtEnable) {
								PRTVisibleEnableData.PRTVisible = true;
								PRTVisibleEnableData.PRTEnable = true;
								p.Fhmkz = true;
							} else {
								PRTVisibleEnableData.PRTVisible = false;
								PRTVisibleEnableData.PRTEnable = false;
								p.Fhmkz = false;
								p.PlanvPrt = "";
								p.SteufPrt = "";
								p.KtschPrt = "";
								p.Ewformprt = "";
								p.SteufRef = false;
								p.KtschRef = false;
								p.EwformRef = false;
								// AIWEQUI.setData(p);
							}
							PRTVisibleEnableModel.setData(PRTVisibleEnableData);
						}
					}
				};

				var q = "/EquipCatgValueHelps";
				var M = g.getView().getModel("valueHelp");
				var eqCatSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "EquipmentCatogory", "EquipCatgDescription");
				eqCatSelectDialog.open();
			},

			_changeCurrency: function (f, g) {
				// var g = this;
				var c = f.Waers;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/CurrencySet";
					var oFilters = [new sap.ui.model.Filter("Waers", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.Waers = d.results[0].Waers; //a;
							g.Waers = d.results[0].Waers; //a;
						} else {
							f.WaersVS = "Error";
							f.WaersVST = "Invaid Entry";
						}
						g.getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						f.WaersVS = "Error";
						f.WaersVST = d;
						g.getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.Waers = g.Waers;
					g.getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunCurrency: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("xtxt.CURRENCY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/CurrencySet",
						template: new sap.m.StandardListItem({
							title: "{Waers}",
							description: "{Ltext}"
						})
					},
					confirm: function (E) {
						p.WaersVS = "None";
						p.WaersVST = "";
						p.Waers = E.getParameters().selectedItem.getProperty("title");
						p.Ltext = E.getParameters().selectedItem.getProperty("description");
						g.getView().getModel(g.oModelName).refresh();
					}
				};

				var q = "/CurrencySet";
				var M = g.getView().getModel("valueHelp");
				var currSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Waers", "Ltext");
				currSelectDialog.open();
			},

			_changeStatProfile: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.StsmEqui;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/StatusProfileSet";
					var oFilters = [new sap.ui.model.Filter("Obtyp", "EQ", "IEQ"), new sap.ui.model.Filter("Stsma", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.StsmEqui = d.results[0].Obtyp; //a;
							oJsonData.StsmEquiDesc = d.results[0].Txt;
						} else {
							oJsonData.StsmEqui = "";
							oJsonData.StsmEquiDesc = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.StsmEqui = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunStatProf: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("xtxt.STS_PROF"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/StatusProfileSet",
						template: new sap.m.StandardListItem({
							title: "{Stsma}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						p.StsmEquiVS = "None";
						p.StsmEquiVST = "";
						p.StsmEqui = E.getParameters().selectedItem.getProperty("title");
						p.StsmEquiDesc = E.getParameters().selectedItem.getProperty("description");
						g.getModel(g.oModelName).refresh();
					}
				};

				var q = "/StatusProfileSet";
				var oFilters = [new sap.ui.model.Filter("Obtyp", "EQ", "IFL")];
				var M = g.getView().getModel("valueHelp");
				var spSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilters, settings, "Stsma", "Txt");
				spSelectDialog.open();
			},

			_changeStatObj: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.UstwEqui;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/StatusobjectSet";
					var oFilters = [new sap.ui.model.Filter("Txt04", "EQ", c), new sap.ui.model.Filter("Stsma", "EQ", oJsonData.StsmEqui)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.UstwEqui = d.results[0].Txt04; //a;
						} else {
							oJsonData.UstwEqui = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.UstwEqui = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunStatus: function (p, g) {
				// var g = this;
				var stSearchResults;
				if (stSearchResults === undefined) {
					var stSelectDialog = new sap.m.TableSelectDialog({
						title: g.getView().getModel("i18n").getProperty("xtxt.STS_OBJ"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
						columns: [new sap.m.Column({
								header: [
									new sap.m.Text({
										text: "Status Profile"
									})
								]
							}), new sap.m.Column({
								demandPopin: true,
								minScreenWidth: "Tablet",
								header: [
									new sap.m.Text({
										text: "User Status"
									})
								]
							}),
							new sap.m.Column({
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
							path: "/StatusobjectSet?$filter=Stsma eq '" + p.StsmEqui + "'",
							template: new sap.m.ColumnListItem({
								type: "Active",
								unread: false,
								cells: [
									new sap.m.Text({
										text: "{Stsma}"
									}),
									new sap.m.Text({
										text: "{Txt04}"
									}),
									new sap.m.Text({
										text: "{txt30}"
									})
								]
							})

						},
						confirm: function (E) {
							p.UstwEqui = E.getParameter("selectedItem").getCells()[1].getText();
							p.UstwEquiVS = "None";
							p.UstwEquiVST = "";
							g.generateUserStatus(p.UstwEqui, p.UswoEqui, g);
							g.getModel(g.oModelName).refresh();

						},
						search: function (E) {
							if (stSelectDialog.getItems()) {
								var v = E.getParameter("value").toUpperCase();
								v = v.replace(/^[ ]+|[ ]+$/g, '');
								var h = stSelectDialog.getItems();
								for (var i = 0; i < h.length; i++) {
									if (v.length > 0) {
										var s = h[i].getBindingContext().getProperty("Txt04");
										var j = h[i].getBindingContext().getProperty("txt30");
										if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
											h[i].setVisible(false);
										} else {
											h[i].setVisible(true);
										}
									} else {
										h[i].setVisible(true);
									}
								}
							}
						}
					});
					//var q = "/StatusobjectSet?$filter=Stsma eq '" + p.StsmEqui + "'";
					var sPath = "/StatusobjectSet";
					var oFilters = [new sap.ui.model.Filter("Stsma", "EQ", p.StsmEqui)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							stSearchResults = h;
							var I = new sap.m.ColumnListItem({
								type: "Active",
								unread: false,
								cells: [
									new sap.m.Text({
										text: "{Stsma}"
									}),
									new sap.m.Text({
										text: "{Txt04}"
									}),
									new sap.m.Text({
										text: "{txt30}"
									})
								]
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							stSelectDialog.setModel(e);
							stSelectDialog.setGrowingThreshold(h.results.length);
							stSelectDialog.bindAggregation("items", "/results", I);
						} else {
							stSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					};
					var fnError = function () {};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					var e = new sap.ui.model.json.JSONModel();
					e.setData(stSearchResults);
					stSelectDialog.setModel(e);
					var I = stSelectDialog.getItems();
					for (var i = 0; i < I.length; i++) {
						I[i].setVisible(true);
					}
				}
				stSelectDialog.open();
			},

			_changeStatWONum: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.UswoEqui;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/UserstatwonumberSet";
					var oFilters = [new sap.ui.model.Filter("Txt04", "EQ", c), new sap.ui.model.Filter("Stsma", "EQ", oJsonData.StsmEqui)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.UswoEqui = d.results[0].Txt04; //a;
						} else {
							oJsonData.UswoEqui = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.UswoEqui = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunStatusWO: function (p, g) { // var g = this;
				var settings = {
					title: g.getView().getModel("i18n").getProperty("xtxt.STS_WO_NO"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					multiSelect: true,
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>xtxt.STS_PROF}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>xtxt.USER_STS}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>DESCRIPTION}"
								})
							]
						})
					],
					items: {
						path: "/UserstatwonumberSet?$filter=Stsma eq '" + p.StsmEqui + "'",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Stsma}"
								}),
								new sap.m.Text({
									text: "{Txt04}"
								}),
								new sap.m.Text({
									text: "{Txt30}"
								})
							]
						})

					},
					confirm: function (E) {
						var aContexts = E.getParameter("selectedContexts");
						p.UswoEqui = aContexts.map(function (oContext) {
							return oContext.getObject().Txt04;
						}).join(" "); //E.getParameter("selectedItem").getCells()[1].getText();
						p.UswoEquiVS = "None";
						p.UswoEquiVST = "";
						g.generateUserStatus(p.UstwEqui, p.UswoEqui, g);
						g.getModel(g.oModelName).refresh();
						// d.setValue(E.getParameter("selectedItem").getCells()[2].getText());
					}
				};
				//var q = "/UserstatwonumberSet?$filter=Stsma eq '" + stsProf + "'";
				var sPath = "/UserstatwonumberSet";
				var oFilters = [new sap.ui.model.Filter("Stsma", "EQ", p.StsmEqui)];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Stsma}"
					}),
					new sap.m.Text({
						text: "{Txt04}"
					}),
					new sap.m.Text({
						text: "{Txt30}"
					})
				];

				var stWSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Txt04", "Txt30");
				stWSelectDialog.open();
				stWSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeTechnicalObjectType: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.TechnicalObjectTyp;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/TechObjTypeValueHelpSet";
					var oFilters = [new sap.ui.model.Filter("TechnicalObjectTyp", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.TechnicalObjectTyp = d.results[0].TechnicalObjectTyp; //a;
							oJsonData.Description = d.results[0].Description;
						} else {
							oJsonData.TechnicalObjectTyp = "";
							oJsonData.Description = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.TechnicalObjectTyp = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunTechObj: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("xtxt.TECH_OBJ_TYPE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/TechObjTypeValueHelpSet",
						template: new sap.m.StandardListItem({
							title: "{TechnicalObjectTyp}",
							description: "{Description}"
						})
					},
					confirm: function (E) {
						p.TechnicalObjectTypVS = "None";
						p.TechnicalObjectTypVST = "";
						p.TechnicalObjectTyp = E.getParameters().selectedItem.getProperty("title");
						if (g.detailFlag) {
							p.Description = E.getParameters().selectedItem.getProperty("description");
						}
						g.getModel(g.oModelName).refresh();
					}
				};

				var q = "/TechObjTypeValueHelpSet";
				var M = g.getView().getModel("valueHelp");
				var techObjSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "TechnicalObjectTyp", "Description");
				techObjSelectDialog.open();
			},

			_changeMaintenancePlant: function (f, g) {
				if (f.oSource) {
					var oSource = f.getSource();
				} else {
					var oSource = f;
				}
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Maintplant;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MaintPlantVHSet";
					var oFilters = [new sap.ui.model.Filter("Werks", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Maintplant = d.results[0].Werks; //a;
							oJsonModel.setData(oJsonData);

							if (g.detailFlag) {
								g.Maintplant = d.results[0].Werks; //a;
								oJsonData.MaintplantDesc = d.results[0].Name1;
								oJsonData.Bukrs = d.results[0].Bukrs;
								oJsonData.Butxt = d.results[0].Butxt;
								oJsonData.BukrsEnabled = false;
								oJsonData.Werks = d.results[0].IWerk;
								oJsonData.Planningplantdes = d.results[0].IName1;
								oJsonData.Kokrs = d.results[0].Kokrs; //a;
								g.SOPMaintPlant = a;
								// oJsonModel.setData(oJsonData);

								// if (g.oModelName === "AIWEQUI") {
								// 	if (oJsonData.SuperordinateEquip !== "" || oJsonData.Tplnr !== "") {
								// 		g.fetchData("", c, oJsonData.SuperordinateEquip, oJsonData.Tplnr, "change");
								// 	}
								// }
								if (g.oModelName === "AIWFLOC") {
									oJsonData.City = d.results[0].City1;
								}
								oJsonModel.setData(oJsonData);
							}

							var dData = g.getView().getModel("dataOrigin").getData(); //DOI
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = a;
								}
								if (data.property === "PplaEeqz" || data.property === "PlntFloc") {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = oJsonData.Werks;
								}
							});
						} else {
							g.SOPMaintPlant = "";
							oJsonData.MaintplantDesc = "";
							oJsonModel.setData(oJsonData);
							oSource.setValueState("Error");
							var dData = g.getView().getModel("dataOrigin").getData(); //DOI
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
								if (data.property === "PplaEeqz" || data.property === "PlntFloc") {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
							});
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Maintplant = g.Maintplant;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunTitle: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("ADDTITLE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/AddrTittleSet",
						template: new sap.m.StandardListItem({
							title: "{Title}",
							description: "{TitleMedi}"
						})
					},
					confirm: function (E) {
						p.Title = E.getParameters().selectedItem.getProperty("description");
						p.TitleCode = E.getParameters().selectedItem.getProperty("title");
						p.TitleVS = "None";
						p.TitleVST = "";
						g.getView().getModel(g.oModelName).refresh();
					}
				};

				var q = "/AddrTittleSet";
				var M = g.getView().getModel("valueHelp");
				var sfSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Title", "TitleMedi");
				sfSelectDialog.open();
			},

			valueHelpFunMaintPlant: function (p, g, e) {
				if (e !== undefined && e !== null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("MAINT_PLANT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PLANT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SEARCHTERM2}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SEARCHTERM1}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>POST_CODE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>Name2}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>Name1}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>ADDR_VERSION}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE_DESC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>PLAN_PLANT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>PLPLANT_DESC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>CC_PLANT}"
								})
							]
						})
					],
					items: {
						path: "/MaintPlantVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Werks}"
								}),
								new sap.m.Text({
									text: "{Sort2}"
								}),
								new sap.m.Text({
									text: "{Sort1}"
								}),
								new sap.m.Text({
									text: "{PostCode1}"
								}),
								new sap.m.Text({
									text: "{City1}"
								}),
								new sap.m.Text({
									text: "{Name2}"
								}),
								new sap.m.Text({
									text: "{Name1}"
								}),
								new sap.m.Text({
									text: "{Nation}"
								}),
								new sap.m.Text({
									text: "{Bukrs}"
								}),
								new sap.m.Text({
									text: "{Butxt}"
								}),
								new sap.m.Text({
									text: "{IWerk}"
								}),
								new sap.m.Text({
									text: "{IName1}"
								}),
								new sap.m.Text({
									text: "{Kokrs}"
								})
							]
						})
					},
					confirm: function (E) {
						p.MaintplantVS = "None";
						p.MaintplantVST = "";
						p.Maintplant = E.getParameter("selectedItem").getCells()[0].getText();
						var mpTxt = E.getParameter("selectedItem").getCells()[6].getText();;
						var cc = E.getParameter("selectedItem").getCells()[8].getText();
						var ccTxt = E.getParameter("selectedItem").getCells()[9].getText();
						var pp = E.getParameter("selectedItem").getCells()[10].getText();
						var ppTxt = E.getParameter("selectedItem").getCells()[11].getText();
						var kokrs = E.getParameter("selectedItem").getCells()[0].getText();
						var city = E.getParameter("selectedItem").getCells()[4].getText();;
						g.getModel(g.oModelName).refresh();

						var q = "/MaintPlantVHSet";
						var aFilters = [new sap.ui.model.Filter("Werks", "EQ", p.Maintplant),
							new sap.ui.model.Filter("IWerk", "EQ", g.SOPMaintPlant),
							new sap.ui.model.Filter("Pplant", "EQ", p.Werks)
						];
						var m = g.getView().getModel("valueHelp2");
						m.read(q, {
							filters: aFilters,
							success: function (d) {
								g.SOPMaintPlant = p.Maintplant;
								if (g.detailFlag) {
									p.MaintplantDesc = mpTxt;
									p.Bukrs = cc;
									p.Butxt = ccTxt;
									p.Werks = pp;
									p.Planningplantdes = ppTxt;
									p.Kokrs = kokrs;
									p.BukrsEnabled = false;
									// g.getModel(g.oModelName).refresh();

									// if (g.oModelName === "AIWEQUI") {
									// 	if (p.SuperordinateEquip !== "" || p.Tplnr !== "") {
									// 		g.fetchData("", p.Maintplant, p.SuperordinateEquip, p.Tplnr, "change");
									// 	}
									// }
									if (g.oModelName === "AIWFLOC") {
										p.City = city;
									}
									g.getModel(g.oModelName).refresh();
								} else {
									g.getModel(g.oModelName).refresh();
								}

								if (oSource !== undefined && oSource !== null) {
									var dData = g.getView().getModel("dataOrigin").getData();
									var name = oSource.getName();
									dData.forEach(function (data) {
										if (data.property === name) {
											data.instLoc = false;
											data.maintenance = true;
											data.currentVal = p.Maintplant;
										}
										if (data.property === "PplaEeqz" || data.property === "PlntFloc") {
											data.instLoc = false;
											data.maintenance = true;
											data.currentVal = p.Werks;
										}
									});
								}
							},
							error: function (e) {
								var b = JSON.parse(e.responseText);
								var d = b.error.message.value;
								sap.m.MessageBox.show(d, {
									title: "Error",
									icon: sap.m.MessageBox.Icon.ERROR,
									actions: [sap.m.MessageBox.Action.OK],
									onClose: function (oAction) {
										p.Maintplant = g.SOPMaintPlant;
										g.getModel(g.oModelName).setData(p);
									}
								});
							}
						});
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};
				var sPath = "/MaintPlantVHSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp2");
				var cells = [
					new sap.m.Text({
						text: "{Werks}"
					}),
					new sap.m.Text({
						text: "{Sort2}"
					}),
					new sap.m.Text({
						text: "{Sort1}"
					}),
					new sap.m.Text({
						text: "{PostCode1}"
					}),
					new sap.m.Text({
						text: "{City1}"
					}),
					new sap.m.Text({
						text: "{Name2}"
					}),
					new sap.m.Text({
						text: "{Name1}"
					}),
					new sap.m.Text({
						text: "{Nation}"
					}),
					new sap.m.Text({
						text: "{Bukrs}"
					}),
					new sap.m.Text({
						text: "{Butxt}"
					}),
					new sap.m.Text({
						text: "{IWerk}"
					}),
					new sap.m.Text({
						text: "{IName1}"
					}),
					new sap.m.Text({
						text: "{Kokrs}"
					})
				];

				var mPlantSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Werks", "Name1");
				mPlantSelectDialog.open();
				mPlantSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			valueHelpFunCopyFloc: function (p, g) {
				var mpSearchResults;
				if (mpSearchResults === undefined) {
					var mpSelectDialog = new sap.m.SelectDialog({
						title: g.getView().getModel("i18n").getProperty("FLOC_TXT"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
						growingThreshold: 5000,
						items: {
							path: "/FunctionLocationSet",
							template: new sap.m.StandardListItem({
								title: "{Tplnr}",
								description: "{Pltxt}"
							})
						},
						confirm: function (E) {
							p.Tplnr = E.getParameters().selectedItem.getProperty("title");
							p.TplnrVS = "None";
							p.TplnrVST = "";
							g._copyFragment.getModel("copyModel").refresh();
						},
						search: function (E) {
							var sValue = E.getParameter("value");
							if (E.getSource().getBinding("items")) {
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Tplnr", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Pltxt", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}

						}
					});

					var sPath = "/FunctionLocationSet";
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							if (g._copyFragmentFlag) {
								var oModelData = g.getView().getModel(g.oModelAIWFLOC).getData();
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
							}
							mpSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Tplnr}",
								description: "{Pltxt}",
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

			valueHelpFunCopyEqui: function (p, g) {
				var mpSearchResults;
				if (mpSearchResults === undefined) {
					var mpSelectDialog = new sap.m.SelectDialog({
						title: g.getView().getModel("i18n").getProperty("EQUIP_TXT"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
						growingThreshold: 5000,
						items: {
							path: "/EquipmentNumberSet",
							template: new sap.m.StandardListItem({
								title: "{Equnr}",
								description: "{Eqktx}"
							})
						},
						confirm: function (E) {
							p.Equnr = E.getParameters().selectedItem.getProperty("title");
							p.EqunrVS = "None";
							p.EqunrVST = "";
							g._copyFragment.getModel("copyModel").refresh();
						},
						search: function (E) {
							var sValue = E.getParameter("value");
							if (E.getSource().getBinding("items")) {
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Equnr", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Eqktx", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}

						}
					});

					var sPath = "/EquipmentNumberSet";
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							if (g._copyFragmentFlag) {
								var oModelData = g.getView().getModel(g.oModelAIWEQUI).getData();
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
							}
							mpSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Equnr}",
								description: "{Eqktx}",
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

			_changeLocation: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Location;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/LocationVHSet";
					var oFilters = [new sap.ui.model.Filter("Stand", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Location = a;
							oJsonData.Locationdesc = d.results[0].Ktext;
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = a;
								}
							});
						} else {
							oJsonData.Location = "";
							oJsonData.Locationdesc = "";
							oSource.setValueState("Error");
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
							});
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Location = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunLocation: function (p, g, e) {
				if (e !== undefined && e !== null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("LOC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PLANT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LOC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>NAME}"
								})
							]
						})
					],
					items: {
						path: "/LocationVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Werks}"
								}),
								new sap.m.Text({
									text: "{Stand}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								})
							]
						})

					},
					confirm: function (E) {
						p.LocationVS = "None";
						p.LocationVST = "";
						p.Location = E.getParameter("selectedItem").getCells()[1].getText();
						p.Locationdesc = E.getParameter("selectedItem").getCells()[2].getText();
						g.getModel(g.oModelName).refresh();

						if (oSource !== undefined && oSource != null) {
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = p.Location;
								}
							});
						}
					}
				};

				var sPath = "/LocationVHSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Werks}"
					}),
					new sap.m.Text({
						text: "{Stand}"
					}),
					new sap.m.Text({
						text: "{Ktext}"
					})
				];

				var locSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Stand", "Ktext");
				locSelectDialog.open();
				locSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeAbcIndicator: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Abckz;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/ABCIndicatorSet";
					var oFilters = [new sap.ui.model.Filter("Abckz", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Abckz = a;
							oJsonData.Abctx = d.results[0].Abctx;
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = a;
								}
							});
						} else {
							oJsonData.Abctx = "";
							oJsonData.Abckz = "";
							oSource.setValueState("Error");
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
							});
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Abckz = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunAbcInd: function (p, g, e) {
				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("ABC_IND"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/ABCIndicatorSet",
						template: new sap.m.StandardListItem({
							title: "{Abckz}",
							description: "{Abctx}"
						})
					},
					confirm: function (E) {
						p.Abckz = E.getParameters().selectedItem.getProperty("title");
						p.Abctx = E.getParameters().selectedItem.getProperty("description");
						p.AbckzVS = "None";
						p.AbckzVST = "";
						g.getModel(g.oModelName).refresh();
						if (oSource !== undefined && oSource != null) {
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = p.Abckz;
								}
							});
						}
					}
				};

				var q = "/ABCIndicatorSet";
				var M = g.getView().getModel("valueHelp");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Abckz", "Abctx");
				abcSelectDialog.open();
			},

			_changeWorkCenter: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Arbpl;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/WorkCenterVHSet";
					var sWerks = oJsonData.Werks ? oJsonData.Werks : "";
					var oFilters = [new sap.ui.model.Filter("Arbpl", "EQ", c), new sap.ui.model.Filter("Werks", "EQ", sWerks)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Arbpl = a;
							oJsonData.Ktext = d.results[0].Ktext;
							oJsonData.WcWerks = d.results[0].Werks;
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = a;
								}
							});
						} else {
							oJsonData.Arbpl = "";
							oJsonData.Ktext = "";
							oJsonData.WcWerks = "";
							oSource.setValueState("Error");
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
							});
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Arbpl = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunWc: function (p, g, e) { // var g = this;
			if (e !== undefined && e !== null) {
					var oSource = e.getSource();
				}
				var wcSearchResults;
				if (wcSearchResults === undefined) {
					var wcSelectDialog = new sap.m.TableSelectDialog({
						title: g.getView().getModel("i18n").getProperty("WC"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
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
							}),
							new sap.m.Column({
								demandPopin: true,
								minScreenWidth: "Tablet",
								header: [
									new sap.m.Text({
										text: "Work Center"
									})
								]
							}),
							new sap.m.Column({
								demandPopin: true,
								minScreenWidth: "Tablet",
								header: [
									new sap.m.Text({
										text: "Description"
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
							})
						],
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
							p.Arbpl = E.getParameter("selectedItem").getCells()[2].getText();
							p.Ktext = E.getParameter("selectedItem").getCells()[3].getText();
							p.WcWerks = E.getParameter("selectedItem").getCells()[1].getText();
							p.ArbplVS = "None";
							p.ArbplVST = "";
							g.getModel(g.oModelName).refresh();
							
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = a;
								}
							});
						},
						search: function (E) {
							if (E.getSource().getBinding("items")) {
								var sValue = E.getParameter("value");
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}
						}
					});

					var sPath = "/WorkCenterVHSet";
					var oModel = g.getView().getModel("valueHelp");
					var sWerks = p.Werks ? p.Werks : "";
					var oFilters = [new sap.ui.model.Filter("Werks", "EQ", sWerks)];
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							if (sap.ui.getCore().getModel("AIWListWCModel")) {
								var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
								if (oModelData.length > 0) {
									for (var i = 0; i < oModelData.length; i++) {
										if (oModelData[i].wc) {
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
								}
							}
							wcSearchResults = h;
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
							e.setSizeLimit(h.results.length);
							e.isSizeLimit = h.results.length;
							wcSelectDialog.setModel(e);
							// wcSelectDialog.setGrowingThreshold(h.results.length);
							wcSelectDialog.bindAggregation("items", "/results", I);
						} else {
							wcSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					};
					var fnError = function () {};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					var e = new sap.ui.model.json.JSONModel();
					e.setData(wcSearchResults);
					wcSelectDialog.setModel(e);
					var I = wcSelectDialog.getItems();
					for (var i = 0; i < I.length; i++) {
						I[i].setVisible(true);
					}
				}
				wcSelectDialog.open();
			},

			_changePlantSec: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.BeberFl;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/PlantSectionSet";
					var oFilters = [new sap.ui.model.Filter("Beber", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.BeberFl = a;
							oJsonData.Fing = d.results[0].Fing;
							oJsonData.Tele = d.results[0].Tele;
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = a;
								}
							});
						} else {
							oJsonData.BeberFl = "";
							oJsonData.Fing = "";
							oJsonData.Tele = "";
							oSource.setValueState("Error");
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
							});
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.BeberFl = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunPlantSec: function (p, g, e) {
				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PL_SEC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PLANT_SEC}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PERSON_RESP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PHONE}"
								})
							]
						})
					],
					items: {
						path: "/PlantSectionSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Beber}"
								}),
								new sap.m.Text({
									text: "{Fing}"
								}),
								new sap.m.Text({
									text: "{Tele}"
								})
							]
						})
					},
					confirm: function (E) {
						p.BeberFl = E.getParameter("selectedItem").getCells()[0].getText();
						p.Fing = E.getParameter("selectedItem").getCells()[1].getText();
						p.Tele = E.getParameter("selectedItem").getCells()[2].getText();
						p.BeberFlVS = "None";
						p.BeberFlVST = "";
						g.getModel(g.oModelName).refresh();
						if (oSource !== undefined && oSource != null) {
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = p.BeberFl;
								}
							});
						}
					}
				};

				var sPath = "/PlantSectionSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Beber}"
					}),
					new sap.m.Text({
						text: "{Fing}"
					}),
					new sap.m.Text({
						text: "{Tele}"
					})

				];

				var ccSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Beber", "Fing");
				ccSelectDialog.open();
				ccSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeCompanyCode: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Bukrs;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/CompanyCodeVHSet";
					var oFilters = [new sap.ui.model.Filter("Bukrs", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Bukrs = a;
							oJsonData.Butxt = d.results[0].Butxt;
							if (g.oModelName === "AIWFLOC") {
								oJsonData.City = d.results[0].Ort01;
							}
						} else {
							oJsonData.Bukrs = "";
							oJsonData.Butxt = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Bukrs = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunCompCode: function (p, g) { // var g = this;
				var settings = {
					title: g.getView().getModel("i18n").getProperty("COMPCODE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>COMP_NAME}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>xtxt.CURRENCY}"
								})
							]
						})
					],
					items: {
						path: "/CompanyCodeVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Bukrs}"
								}),
								new sap.m.Text({
									text: "{Butxt}"
								}),
								new sap.m.Text({
									text: "{Ort01}"
								}),
								new sap.m.Text({
									text: "{Waers}"
								})
							]
						})
					},
					confirm: function (E) {
						p.Bukrs = E.getParameter("selectedItem").getCells()[0].getText();
						p.Butxt = E.getParameter("selectedItem").getCells()[1].getText();
						p.BukrsVS = "None";
						p.BukrsVST = "";
						if (g.oModelName === "AIWFLOC") {
							p.City = E.getParameter("selectedItem").getCells()[2].getText();
						}
						g.getModel(g.oModelName).refresh();
					}
				};

				var sPath = "/CompanyCodeVHSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Bukrs}"
					}),
					new sap.m.Text({
						text: "{Butxt}"
					}),
					new sap.m.Text({
						text: "{Ort01}"
					}),
					new sap.m.Text({
						text: "{Waers}"
					})
				];

				var ccSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Bukrs", "Butxt");
				ccSelectDialog.open();
				ccSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeCostCenter: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Kostl;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/CostCenterSet";
					var oFilters = [new sap.ui.model.Filter("Kostl", "EQ", c)];
					if (oJsonData.Kokrs !== "") {
						oFilters.push(new sap.ui.model.Filter("Kokrs", "EQ", oJsonData.Kokrs));
					}
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Kostl = a;
							oJsonData.Kokrs = d.results[0].Kokrs;
							oJsonData.Mctxt = d.results[0].Mctxt;
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = a;
								}
							});
						} else {
							oJsonData.Kostl = "";
							oJsonData.Kokrs = "";
							oJsonData.Mctxt = "";
							oSource.setValueState("Error");
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
							});
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Kostl = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunCostCenter: function (p, g, e) { // var g = this;
				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("CC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>CC}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CCTR_CATGRY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CO_AREA}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PERSON_RESP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>USR_RESP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SHRT_TXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LANGUAGE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>VALID_FRM}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>VALID_TO}"
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
									text: "{Bukrs}"
								}),
								new sap.m.Text({
									text: "{Kosar}"
								}),
								new sap.m.Text({
									text: "{Kokrs}"
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
						})
					},
					confirm: function (E) {
						p.Kostl = E.getParameter("selectedItem").getCells()[0].getText();
						p.Kokrs = E.getParameter("selectedItem").getCells()[3].getText(); //[2]
						p.Mctxt = E.getParameter("selectedItem").getCells()[6].getText();
						p.KostlVS = "None";
						p.KostlVST = "";
						g.getModel(g.oModelName).refresh();

						if (oSource !== undefined && oSource != null) {
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = p.Kostl;
								}
							});
						}
					}
				};

				var sPath = "/CostCenterSet";
				var oFilters = [];
				if (p.Kokrs !== "") {
					oFilters.push(new sap.ui.model.Filter("Kokrs", "EQ", p.Kokrs));
				}
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Kostl}"
					}),
					new sap.m.Text({
						text: "{Bukrs}"
					}),
					new sap.m.Text({
						text: "{Kosar}"
					}),
					new sap.m.Text({
						text: "{Kokrs}"
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
				];

				var ccostcSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Kostl", "Mctxt");
				ccostcSelectDialog.open();
				ccostcSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changePlanningPlant: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Werks;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/PlanningPlantSet";
					var oFilters = [new sap.ui.model.Filter("Werks", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Werks = a;
							oJsonData.Planningplantdes = d.results[0].Name1;
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = a;
								}
							});
						} else {
							oJsonData.Werks = "";
							oJsonData.Planningplantdes = "";
							oSource.setValueState("Error");
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
							});
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Werks = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunPlanPlant: function (p, g, e) {
				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PL_PLANT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/PlanningPlantSet",
						template: new sap.m.StandardListItem({
							title: "{Werks}",
							description: "{Name1}"
						})
					},
					confirm: function (E) {
						p.Werks = E.getParameters().selectedItem.getProperty("title");
						p.Planningplantdes = E.getParameters().selectedItem.getProperty("description");
						p.WerksVS = "None";
						p.WerksVST = "";
						g.getModel(g.oModelName).refresh();
						if (oSource !== undefined && oSource != null) {
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = p.Werks;
								}
							});
						}
					}
				};

				var q = "/PlanningPlantSet";
				var M = g.getView().getModel("valueHelp");
				var plPlantSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Werks", "Name1");
				plPlantSelectDialog.open();
			},

			_changePlannerGroup: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Ingrp;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/PlannerGroupSet";
					var oFilters = [new sap.ui.model.Filter("Ingrp", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Ingrp = a;
							oJsonData.Innam = d.results[0].Innam;
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = a;
								}
							});
						} else {
							oJsonData.Ingrp = "";
							oJsonData.Innam = "";
							oSource.setValueState("Error");
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
							});
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Ingrp = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunPlGrp: function (p, g, e) { // var g = this;
				if (e !== undefined && e !== null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PL_GRP"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PL_PLANT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PLANNER_GRP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PM_PLNRGRP_NAME}"
								})
							]
						})
					],
					items: {
						path: "/PlannerGroupSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Iwerk}"
								}),
								new sap.m.Text({
									text: "{Ingrp}"
								}),
								new sap.m.Text({
									text: "{Innam}"
								})
							]
						})
					},
					confirm: function (E) {
						p.Ingrp = E.getParameter("selectedItem").getCells()[1].getText();
						p.Innam = E.getParameter("selectedItem").getCells()[2].getText();
						p.IngrpVS = "None";
						p.IngrpVST = "";
						g.getModel(g.oModelName).refresh();
						if (oSource !== undefined && oSource !== null) {
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = p.Ingrp;
								}
							});
						}
					}
				};

				var sPath = "/PlannerGroupSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Iwerk}"
					}),
					new sap.m.Text({
						text: "{Ingrp}"
					}),
					new sap.m.Text({
						text: "{Innam}"
					})
				];

				var plGSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Ingrp", "Innam");
				plGSelectDialog.open();
				plGSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeMainArbpl: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.MainArbpl;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/WorkCenterVHSet";
					var sWerks = oJsonData.Werks ? oJsonData.Werks : "";
					var oFilters = [new sap.ui.model.Filter("Arbpl", "EQ", c), new sap.ui.model.Filter("Arbpl", "EQ", sWerks)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.MainArbpl = a;
							oJsonData.MainKtext = d.results[0].Ktext;
							oJsonData.MainWerks = d.results[0].Werks;
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = oJsonData.MainWerks;
								}
								if (data.property === "WorkCenterPlant") {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = p.MainWerks;
								}
							});
						} else {
							oJsonData.MainArbpl = "";
							oJsonData.MainWerks = "";
							oJsonData.MainKtext = "";
							oSource.setValueState("Error");
							oJsonModel.setData(oJsonData);
							var dData = g.getView().getModel("dataOrigin").getData();
							var name = oSource.getName();
							dData.forEach(function (data) {
								if (data.property === name) {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
								if (data.property === "WorkCenterPlant") {
									data.instLoc = false;
									data.maintenance = false;
									data.currentVal = "";
								}
							});
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.MainArbpl = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunMainWc: function (p, g, e) { // var g = this;
				if (e !== undefined && e !== null) {
					var oSource = e.getSource();
				}
				var wcSearchResults;
				if (wcSearchResults === undefined) {
					var wcSelectDialog = new sap.m.TableSelectDialog({
						title: g.getView().getModel("i18n").getProperty("MAIN_WC"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
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
							}),
							new sap.m.Column({
								demandPopin: true,
								minScreenWidth: "Tablet",
								header: [
									new sap.m.Text({
										text: "Work Center"
									})
								]
							}),
							new sap.m.Column({
								demandPopin: true,
								minScreenWidth: "Tablet",
								header: [
									new sap.m.Text({
										text: "Description"
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
							})
						],
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
							p.MainArbpl = E.getParameter("selectedItem").getCells()[2].getText();
							p.MainKtext = E.getParameter("selectedItem").getCells()[3].getText();
							p.MainWerks = E.getParameter("selectedItem").getCells()[1].getText();
							p.MainArbplVS = "None";
							p.MainArbplVST = "";
							g.getModel(g.oModelName).refresh();
							if (oSource !== undefined && oSource !== null) {
								var dData = g.getView().getModel("dataOrigin").getData();
								var name = oSource.getName();
								dData.forEach(function (data) {
									if (data.property === name) {
										data.instLoc = false;
										data.maintenance = true;
										data.currentVal = p.MainArbpl;
									}
									if (data.property === "WorkCenterPlant") {
										data.instLoc = false;
										data.maintenance = true;
										data.currentVal = p.MainWerks;
									}
								});
							}
						},
						search: function (E) {
							if (E.getSource().getBinding("items")) {
								var sValue = E.getParameter("value");
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}
						}
					});

					var sPath = "/WorkCenterVHSet";
					var oModel = g.getView().getModel("valueHelp");
					var sWerks = p.Werks ? p.Werks : "";
					var oFilters = [new sap.ui.model.Filter("Werks", "EQ", sWerks)];
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							if (sap.ui.getCore().getModel("AIWListWCModel")) {
								var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
								if (oModelData.length > 0) {
									for (var i = 0; i < oModelData.length; i++) {
										if (oModelData[i].wc) {
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
								}
							}
							wcSearchResults = h;
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
							e.setSizeLimit(h.results.length);
							e.isSizeLimit = h.results.length;
							wcSelectDialog.setModel(e);
							// wcSelectDialog.setGrowingThreshold(h.results.length);
							wcSelectDialog.bindAggregation("items", "/results", I);
						} else {
							wcSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					};
					var fnError = function () {};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					var e = new sap.ui.model.json.JSONModel();
					e.setData(wcSearchResults);
					wcSelectDialog.setModel(e);
					var I = wcSelectDialog.getItems();
					for (var i = 0; i < I.length; i++) {
						I[i].setVisible(true);
					}
				}
				wcSelectDialog.open();
			},

			_changeFunctionalLocation: function (f, g) {
				var sModelName;
				if (g.oModelName) {
					sModelName = g.oModelName;
				} else if (g.oSearchModelName) {
					sModelName = g.oSearchModelName;
				}
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(sModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Tplnr;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/FunctionLocationSet";
					var oFilters = [new sap.ui.model.Filter("Tplnr", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							g.Tplnr = a;
							oJsonData.Tplnr = a;
							oJsonData.Pltxt = d.results[0].Pltxt;
							oJsonModel.setData(oJsonData);

							if (sModelName.indexOf("Search") > -1) {
								return;
							}
							if (sModelName === "AIWEQUI") {
								// g.fetchData(sModelName);
								g.fetchSupFlocEquiData(a, "FL", oJsonData.Pltxt, "change");
							}
							if (sModelName === "AIWMSPT") {
								g.fetchData(sModelName);
							}
							if (sModelName === "itemDetailView") {
								if (oJsonData.Equnr !== "" || oJsonData.Equnr !== undefined) {
									oJsonData.Equnr = "";
									oJsonData.Eqktx = "";
									oJsonModel.setData(oJsonData);
								}
								sModelName = "AIWMPMI";
								g.fetchData(sModelName, parseInt(g.mainRowIndex), parseInt(g.itemPath));
								if (d.results[0].Fltyp === "L" && g.lamSwitch === "X") {
									g.lam.setVisible(true);
								} else {
									g.lam.setVisible(false);
								}
							}
						} else {
							oJsonData.Tplnr = "";
							oJsonData.Pltxt = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Tplnr = g.Tplnr;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunFloc: function (p, g) {
				var mpSearchResults;
				if (mpSearchResults === undefined) {
					var sModelName;
					if (g.oModelName) {
						sModelName = g.oModelName;
					} else if (g.oSearchModelName) {
						sModelName = g.oSearchModelName;
					}
					var oSource = p.getSource();
					var oJsonModel = g.getView().getModel(sModelName);
					var oJsonData = oJsonModel.getData();
					var mpSelectDialog = new sap.m.SelectDialog({
						title: g.getView().getModel("i18n").getProperty("FLOC_TXT"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
						growingThreshold: 5000,
						items: {
							path: "/FunctionLocationSet",
							template: new sap.m.StandardListItem({
								title: "{Tplnr}",
								description: "{Pltxt}"
							})
						},
						confirm: function (E) {
							oJsonData.Tplnr = E.getParameter("selectedItem").getProperty("title");
							oJsonData.Pltxt = E.getParameter("selectedItem").getProperty("description");
							oSource.setValueState("None");
							oSource.setValueStateText("");
							oJsonModel.setData(oJsonData);

							if (sModelName.indexOf("Search") > -1) {
								return;
							}
							if (sModelName !== "AIWFLOC") {
								if (sModelName === "AIWEQUI") {
									g.fetchSupFlocEquiData(oJsonData.Tplnr, "FL", oJsonData.Pltxt, "change");
									$("#" + g.getView().byId("FunctionalLocation").sId + "-inner").val(E.getParameter("selectedItem").getProperty("title")).change();
								}
								if (sModelName === "itemDetailView") {
									if (oJsonData.Equnr !== "" || oJsonData.Equnr !== undefined) {
										oJsonData.Equnr = "";
										oJsonData.Eqktx = "";
										oJsonModel.setData(oJsonData);
									}
									sModelName = "AIWMPMI";
									g.fetchData(sModelName, parseInt(g.mainRowIndex), parseInt(g.itemPath));
									var sSelPath = E.getParameter("selectedItem").getBindingContext().sPath;
									var sSelCat = E.getSource().getModel().getProperty(sSelPath).Fltyp;
									if (sSelCat === "L" && g.lamSwitch === "X") {
										g.lam.setVisible(true);
									} else {
										g.lam.setVisible(false);
									}

								} else {
									g.fetchData(sModelName);
								}
							}
							// p.Tplnr = E.getParameters().selectedItem.getProperty("title");
						},
						search: function (E) {
							var sValue = E.getParameter("value");
							if (E.getSource().getBinding("items")) {
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Tplnr", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Pltxt", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}

						}
					});

					var sPath = "/FunctionLocationSet";
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (h) {
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
							mpSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Tplnr}",
								description: "{Pltxt}",
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

				// var oModel = g.getView().getModel("valueHelp");
				// g.getModel("mainView").getData().viewBusy = true;
				// jQuery.sap.delayedCall(800, g, function() {
				// 	g._valueHelpDialog = sap.ui.xmlfragment("ugiaiwui.mdg.aiw.ZAIW_UI_03.Fragments.FlocVH", g);
				// 	g.getView().addDependent(g._valueHelpDialog);
				// 	g._valueHelpDialog.setModel(oModel);
				// 	g.getModel("mainView").getData().viewBusy = false;
				// 	g._valueHelpDialog.open();
				// 	if (g.oModelName === "AIWEQUI") {
				// 		g.inputId = "EQUI_FunctionalLoc";
				// 	} 
				// 	else if (g.oModelName === "AIWMSPT" || g.oSearchModelName === "AIWMSPT") {
				// 		g.inputId = "MSPT_FunctionalLoc";
				// 	} 
				// 	else if (g.oModelName === "itemDetailView") { //MPMI
				// 		g.inputId = "Item_FunctionalLoc";
				// 	} 
				// 	else if (g.oSearchModelName === "AIWFLOC") {
				// 		g.inputId = "SRCH_FunctionalLoc";
				// 	}
				// });

			},

			_changeSuperOrdEqui: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.SuperordinateEquip;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/EquipmentNumberSet";
					var oFilters = [new sap.ui.model.Filter("Equnr", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						g.BusyDialog.close();
						if (d.results.length > 0) {
							g.SuperordinateEquip = a;
							oJsonData.SuperordinateEquipDesc = d.results[0].Eqktx;
							oJsonData.SuperordinateEquip = a;
							oJsonModel.setData(oJsonData);
							// g.fetchData("AIWEQUI");
							if (g.viewName && g.viewName === "ChangeEqui") {
								g.fetchSupFlocEquiDataChange(a, "EQ", oJsonData.SuperordinateEquipDesc, "change");
							} else {
								g.fetchSupFlocEquiData(a, "EQ", oJsonData.SuperordinateEquipDesc, "change");
							}
						} else {
							oJsonData.SuperordinateEquipDesc = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						g.BusyDialog.close();
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g.BusyDialog.open();
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.SuperordinateEquip = g.SuperordinateEquip;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunSuperOrdEq: function (oEvent, g) {
				var mpSearchResults;
				if (mpSearchResults === undefined) {
					var oSource = oEvent.getSource();
					var oJsonModel = g.getView().getModel("AIWEQUI");
					var oJsonData = oJsonModel.getData();
					var mpSelectDialog = new sap.m.SelectDialog({
						title: g.getView().getModel("i18n").getProperty("EQUIP_TXT"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
						growingThreshold: 5000,
						items: {
							path: "/EquipmentNumberSet",
							template: new sap.m.StandardListItem({
								title: "{Equnr}",
								description: "{Eqktx}"
							})
						},
						confirm: function (E) {
							oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
							oJsonData.SuperordinateEquipDesc = E.getParameters().selectedItem.getProperty("description");
							oSource.setValueState("None");
							oSource.setValueStateText("");
							oJsonModel.setData(oJsonData);
							// g.fetchData("AIWEQUI");
							g.fetchSupFlocEquiData(oSource.getValue(), "EQ", oJsonData.SuperordinateEquipDesc, "change");
							$("#" + g.getView().byId("superOrdEq").sId + "-inner").val(E.getParameter("selectedItem").getProperty("title")).change();
						},
						search: function (E) {
							var sValue = E.getParameter("value");
							if (E.getSource().getBinding("items")) {
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Equnr", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Eqktx", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}

						}
					});

					var sPath = "/EquipmentNumberSet";
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (h) {
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
							mpSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Equnr}",
								description: "{Eqktx}",
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

				// var oModel = g.getView().getModel("valueHelp");
				// g._valueHelpDialog = sap.ui.xmlfragment("ugiaiwui.mdg.aiw.ZAIW_UI_03.Fragments.EquipmentVH", this);
				// g.getView().addDependent(g._valueHelpDialog);
				// g._valueHelpDialog.setModel(oModel);
				// g._valueHelpDialog.open();
				// g.inputId = "SuperordEqui";
			},

			_changeConstructionType: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.ConstrType;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MaterialSHSet";
					var oFilters = [new sap.ui.model.Filter("Matnr", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.ConstrType = a;
							oJsonData.ConstructionDesc = d.results[0].Maktx;
						} else {
							oJsonData.ConstrType = "";
							oJsonData.ConstructionDesc = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.ConstrType = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunConstType: function (g) {
				var oModel = g.getView().getModel("valueHelp");
				oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
				oModel.setRefreshAfterChange(false)
				g._valueHelpDialog = sap.ui.xmlfragment("ugiaiwui.mdg.aiw.request.Fragments.Common.MaterialVH", g);
				// g.getView().addDependent(g._valueHelpDialog);
				g._valueHelpDialog.setModel(oModel);
				g._valueHelpDialog.open();
				g.inputId = "ConstructionType";
			},

			_changeCntryChange: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.RefPosta;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/CountrySet";
					var oFilters = [new sap.ui.model.Filter("Land1", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.RefPosta = a;
							oJsonData.Landx = d.results[0].Landx;
							oJsonData.addIntlBtn = true;
							oSource.setValueState("None");
							oSource.setValueStateText("");

							g.onTimeZoneValidation("", oJsonData.RefPosta, oJsonData.PostCod1);

							var dData = g.getView().getModel("dataOrigin").getData();
							if (dData) {
								dData.forEach(function (data) {
									if (data.property === "Adrnr") {
										data.instLoc = false;
										data.maintenance = true;
										data.currentVal = "";
									}
								});
							}
						} else {
							oJsonData.RefPosta = "";
							oJsonData.Landx = "";
							oJsonData.addIntlBtn = false;
							oSource.setValueState("Error");
							var dData = g.getView().getModel("dataOrigin").getData();
							if (dData) {
								dData.forEach(function (data) {
									if (data.property === "Adrnr") {
										data.instLoc = false;
										data.maintenance = false;
										data.currentVal = "";
									}
								});
							}
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.RefPosta = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunCntry: function (p, g) {
				var oSource = p.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();

				var settings = {
					title: g.getView().getModel("i18n").getProperty("COUNTRY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/CountrySet",
						template: new sap.m.StandardListItem({
							title: "{Land1}",
							description: "{Landx}"
						})
					},
					confirm: function (E) {
						oJsonData.RefPosta = E.getParameter("selectedItem").getProperty("title");
						oJsonData.Landx = E.getParameter("selectedItem").getProperty("description");
						oJsonData.addIntlBtn = true;
						oSource.setValueState("None");
						oSource.setValueStateText("");
						oJsonModel.setData(oJsonData);
						g.onTimeZoneValidation("", oJsonData.RefPosta, oJsonData.PostCod1);

						var dData = g.getView().getModel("dataOrigin").getData();
						if (dData) {
							dData.forEach(function (data) {
								if (data.property === "Adrnr") {
									data.instLoc = false;
									data.maintenance = true;
									data.currentVal = oJsonData.RefPosta;
								}
							});
						}
					}
				};

				var q = "/CountrySet";
				var M = g.getView().getModel("valueHelp");
				var cntrySelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Land1", "Landx");
				cntrySelectDialog.open();
			},

			_changeLangChange: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Langucode;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/LanguageSet";
					var oFilters = [new sap.ui.model.Filter("Sprsl", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Langucode = a;
							oJsonData.LanguP = d.results[0].Sptxt;
						} else {
							oJsonData.Langucode = "";
							oJsonData.LanguP = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Langucode = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunLang: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("LangKey"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/LanguageSet",
						template: new sap.m.StandardListItem({
							title: "{Sprsl}",
							description: "{Sptxt}"
						})
					},
					confirm: function (E) {
						p.Langucode = E.getParameter("selectedItem").getProperty("title");
						p.LanguP = E.getParameter("selectedItem").getProperty("description");
						p.LangucodeVS = "None";
						p.LangucodeVST = "";
						g.getModel(g.oModelName).refresh();
					}
				};

				var q = "/LanguageSet";
				var M = g.getView().getModel("valueHelp");
				var langSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Sprsl", "Sptxt");
				langSelectDialog.open();
			},

			_changeMaintStrategy: function (f, g) {
				var oMainModel = g.getView().getModel("mainView");
				var oMainData = oMainModel.getData();

				oMainData.viewBusy = true;
				oMainModel.setData(oMainData);

				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Strat;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/StrategySet";
					var oModel = g.getView().getModel("valueHelp");
					var oFilters = [new sap.ui.model.Filter("Strat", "EQ", c)];
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.StratDesc = d.results[0].Ktext;
							oJsonData.ButtonNewCycleEnabled = false;
							var ind = d.results[0].Termk;
							if (ind === "3") {
								oJsonData.Stich = 3;
								oJsonData.AbrhoLBL = false;
								oJsonData.AbrhoVis = false;
								oJsonData.HunitVis = false;
								oJsonData.FabklLBL = false;
								oJsonData.Fabkl = "";
								oJsonData.FabklVis = false;
								oJsonData.FabklDesc = "";
								oJsonData.FabklDescVis = false;
								g.stratUnit = d.results[0].Zeieh;
								oJsonData.Unitc = g.stratUnit;
								oJsonData.UnitcVis = true;
								oJsonData.SzaehLBL = true;
								oJsonData.SzaehVis = true;
								oJsonData.Szaeh = "";
								oJsonData.MpcyclenoLBL = true;
								oJsonData.MpcyclenoVis = true;
								oJsonData.StadtVis = false;
								oJsonData.StadtLBL = false;
							} else {
								oJsonData.AbrhoLBL = true;
								oJsonData.AbrhoVis = true;
								oJsonData.HunitVis = true;
								oJsonData.FabklLBL = true;
								oJsonData.Fabkl = "";
								oJsonData.FabklVis = true;
								oJsonData.FabklDesc = "";
								oJsonData.FabklDescVis = true;
								oJsonData.SzaehLBL = false;
								oJsonData.SzaehVis = false;
								oJsonData.Szaeh = "";
								oJsonData.MpcyclenoLBL = false;
								oJsonData.MpcyclenoVis = false;
								oJsonData.Unitc = "";
								oJsonData.UnitcVis = false;
								oJsonData.StadtVis = true;
								oJsonData.StadtLBL = true;
								oJsonData.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_START_TXT");
							}
							oJsonData.Strat = a;
							oJsonModel.setData(oJsonData);
							g.readScheduling(oJsonData, c);
						} else {
							oJsonData.Strat = "";
							oJsonData.StratDesc = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oMainData.viewBusy = false;
						oMainModel.setData(oMainData);
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						oMainData.viewBusy = false;
						oMainModel.setData(oMainData);
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Strat = a;
					oJsonModel.setData(oJsonData);
					oMainData.viewBusy = false;
					oMainModel.setData(oMainData);
				}
			},

			valueHelpFunMaintStrategy: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("MAINT_STR"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>STRATEGY}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>DESCRIPTION}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SCHE_IND_TXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>UNIT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>FACT_CAL}"
								})
							]
						})
					],
					items: {
						path: "/StrategySet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Strat}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								}),
								new sap.m.Text({
									text: "{Termk}"
								}),
								new sap.m.Text({
									text: "{Zeieh}"
								}),
								new sap.m.Text({
									text: "{Fabkl}"
								})
							]
						})

					},
					confirm: function (E) {
						p.StratVS = "None";
						p.StratVST = "";
						p.Strat = E.getParameter("selectedItem").getCells()[0].getText();
						p.StratDesc = E.getParameter("selectedItem").getCells()[1].getText();

						var value = E.getParameter("selectedItem").getCells()[0].getText();
						var ind = E.getParameter("selectedItem").getCells()[2].getText();

						p.ButtonNewCycleEnabled = false;
						if (ind === "3") {
							p.ScheIndRbPerformance = false;
							p.AbrhoLBL = false;
							p.AbrhoVis = false;
							p.HunitVis = false;
							p.FabklLBL = false;
							p.Fabkl = "";
							p.FabklVis = false;
							p.FabklDesc = "";
							p.FabklDescVis = false;
							g.stratUnit = E.getParameter("selectedItem").getCells()[3].getText();
							p.SzaehLBL = true;
							p.SzaehVis = true;
							p.Szaeh = "";
							p.Unitc = g.stratUnit;
							p.UnitcVis = true;
							p.StadtVis = false;
							p.StadtLBL = false;
							p.MpcyclenoLBL = true;
							p.MpcyclenoVis = true;
						} else {
							p.AbrhoLBL = true;
							p.AbrhoVis = true;
							p.HunitVis = true;
							p.FabklLBL = true;
							p.Fabkl = "";
							p.FabklVis = true;
							p.FabklDesc = "";
							p.FabklDescVis = true;
							p.SzaehLBL = false;
							p.SzaehVis = false;
							p.Szaeh = "";
							p.Unitc = "";
							p.UnitcVis = false;
							p.StadtVis = true;
							p.StadtLBL = true;
							p.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_START_TXT");
							p.MpcyclenoLBL = false;
							p.MpcyclenoVis = false;
						}
						g.getView().getModel(g.oModelName).refresh();
						g.readScheduling(p, value);
					}
				};

				var sPath = "/StrategySet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Strat}"
					}),
					new sap.m.Text({
						text: "{Ktext}"
					}),
					new sap.m.Text({
						text: "{Termk}"
					}),
					new sap.m.Text({
						text: "{Zeieh}"
					}),
					new sap.m.Text({
						text: "{Fabkl}"
					})
				];

				var strSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Strat", "Ktext");
				strSelectDialog.open();
				strSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeCycleSet: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Wset;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/CyclesetSet";
					var oModel = g.getView().getModel("valueHelp");
					var oFilters = [new sap.ui.model.Filter("Strat", "EQ", c)];
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Wset = a;
							oJsonData.Ktext = d.results[0].Ktext;
							oJsonData.ScheIndText = false;
							oJsonData.ScheIndTitle = false;
							oJsonData.ScheIndLBL = false;
							oJsonData.ScheIndRbTimeVis = false;
							oJsonData.ScheIndRbTimeKeyDateVis = false;
							oJsonData.ScheIndRbTimeFactCalVis = false;
							oJsonData.ScheIndRbPerformanceVis = false;
							oJsonData.Stich = 0;
							oJsonData.AbrhoLBL = false;
							oJsonData.AbrhoVis = false;
							oJsonData.HunitVis = false;
							oJsonData.FabklLBL = false;
							oJsonData.Fabkl = "";
							oJsonData.FabklVis = false;
							oJsonData.FabklDesc = "";
							oJsonData.FabklDescVis = false;
							oJsonData.ButtonNewCycleEnabled = true;
							oJsonData.OPText = true;
							oJsonData.OPTitle = true;
							oJsonData.OPLBL = true;
							oJsonData.OROPVis = true;
							oJsonData.AndOPvis = true;
							oJsonModel.setData(oJsonData);
							g.readCycleDetails(c);
						} else {
							oJsonData.Wset = "";
							oJsonData.Ktext = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Wset = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunCycleSet: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("CYC_SET"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>STRATEGY}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>DESCRIPTION}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SCHE_IND_TXT}"
								})
							]
						})
					],
					items: {
						path: "/CyclesetSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Strat}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								}),
								new sap.m.Text({
									text: "{Termk}"
								}),
								new sap.m.Text({
									text: "{Zeieh}"
								}),
								new sap.m.Text({
									text: "{Fabkl}"
								})
							]
						})

					},
					confirm: function (E) {
						p.WsetVS = "None";
						p.WsetVST = "";
						p.Wset = E.getParameter("selectedItem").getCells()[0].getText();
						p.Ktext = E.getParameter("selectedItem").getCells()[1].getText();
						p.ScheIndText = false;
						p.ScheIndTitle = false;
						p.ScheIndLBL = false;
						p.ScheIndRbTimeVis = false;
						p.ScheIndRbTimeKeyDateVis = false;
						p.ScheIndRbTimeFactCalVis = false;
						p.ScheIndRbPerformanceVis = false;
						p.Stich = 0;
						p.AbrhoLBL = false;
						p.AbrhoVis = false;
						p.HunitVis = false;
						p.FabklLBL = false;
						p.Fabkl = "";
						p.FabklVis = false;
						p.FabklDesc = "";
						p.FabklDescVis = false;
						p.ButtonNewCycleEnabled = true;
						p.OPText = true;
						p.OPTitle = true;
						p.OPLBL = true;
						p.OROPVis = true;
						p.AndOPvis = true;
						g.getView().getModel(g.oModelName).refresh();
						g.readCycleDetails(p.Wset);
					}
				};

				var sPath = "/CyclesetSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Strat}"
					}),
					new sap.m.Text({
						text: "{Ktext}"
					}),
					new sap.m.Text({
						text: "{Termk}"
					}),
					new sap.m.Text({
						text: "{Zeieh}"
					}),
					new sap.m.Text({
						text: "{Fabkl}"
					})
				];

				var csSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Strat", "Ktext");
				csSelectDialog.open();
				csSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			valueHelpFunSchedulePeriod: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("SCHE_PERIOD_TXT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/SchPeriodUnitSet",
						template: new sap.m.StandardListItem({
							title: "{Mseh3}",
							description: "{Msehl}"
						})
					},
					confirm: function (E) {
						p.HunitVS = "None";
						p.HunitVST = "";
						p.Hunit = E.getParameters().selectedItem.getProperty("title");
						g.getView().getModel(g.oModelName).refresh();
					}
				};

				var q = "/SchPeriodUnitSet";
				var M = g.getView().getModel("valueHelp");
				var spSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Mseh3", "Msehl");
				spSelectDialog.open();
			},
			
			SchedulePeriodUnitChange:function(f, p, g){
				var oSource = f.getSource();
				var c = oSource.getValue().toUpperCase();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/SchPeriodUnitSet";
					var oFilters = [new sap.ui.model.Filter("Mseh3", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							p.Hunit = a;
							p.HunitVS = "None";
							p.HunitVST = "";
						} else {
							p.Hunit = "";
							p.HunitVS = "Error";
							p.HunitVST = "";
						}
						g.getView().getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						// oSource.setValueState("Error");
						// oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					p.Hunit = "";
					p.HunitVS = "None";
					p.HunitVST = "";
					g.getView().getModel(g.oModelName).refresh();
				}
			},

			_changeFactoryCalendar: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Fabkl;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/FactoryCalenderSet";
					var oFilters = [new sap.ui.model.Filter("Ident", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.FabklDesc = d.results[0].Ltext;
							oJsonData.Fabkl = a;
						} else {
							oJsonData.FabklDesc = "";
							oJsonData.Fabkl = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Fabkl = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunFactoryCalendar: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("FACT_CAL"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/FactoryCalenderSet",
						template: new sap.m.StandardListItem({
							title: "{Ident}",
							description: "{Ltext}"
						})
					},
					confirm: function (E) {
						p.FabklVS = "None";
						p.FabklVST = "";
						p.Fabkl = E.getParameters().selectedItem.getProperty("title");
						p.FabklDesc = E.getParameters().selectedItem.getProperty("description");
						g.getView().getModel(g.oModelName).refresh();
					}
				};

				var q = "/FactoryCalenderSet";
				var M = g.getView().getModel("valueHelp");
				var fSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Ident", "Ltext");
				fSelectDialog.open();
			},

			_changeCounter: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Mpcycleno;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MSCounterSet";
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Mpcycleno = a;
							oJsonModel.setData(oJsonData);

							if (g.stratUnit === "" || g.stratUnit === undefined) {
								oJsonData.Unitc = g.readCounterData(oJsonData, a, "counterUnit");
							}
							g.counter = false;
							// if (oJsonData.Unitc !== g.stratUnit) {
							// 	oSource.setValueState("Error");
							// 	var msg = "Unit " + g.stratUnit + " and counter unit " + f.Unitc + " have different dimensions";
							// 	g.invokeMessage(msg);
							// } else {
							// 	oSource.setValueState("None");
							// }
						} else {
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						g.getView().getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					var oFilters = [new sap.ui.model.Filter("Point", "EQ", c)];
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Mpcycleno = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunCounter: function (sProperty, c, p, g) {
				var sModelData, coSelectDialog, coSearchResults;
				if (sProperty === "Point") {
					sModelData = g.getView().getModel(g.oModelName).getProperty("/cycleModel");
					var sContextPath = c.getSource().getBindingContext(g.oModelName).sPath;
					sContextPath = sContextPath.substring(sContextPath.lastIndexOf("/") + 1);
					g.index = parseInt(sContextPath.substr(-1));
				}

				var settings = {
					title: g.getView().getModel("i18n").getProperty("COUNTER_TXT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/MSCounterSet",
						template: new sap.m.StandardListItem({
							title: "{Point}",
							description: "{Psort}"
						})
					},
					confirm: function (E) {
						if (sProperty === "Mpcycleno") {
							p.Mpcycleno = E.getParameters().selectedItem.getProperty("title");
							p.MpcyclenoVS = "None";
							g.getView().getModel(g.oModelName).refresh();
							g.readCounterData(p, p.Mpcycleno, "counterUnit");
						} else if (sProperty === "Point") {
							sModelData[g.index].Point = E.getParameters().selectedItem.getProperty("title");
							sModelData[g.index].Psort = E.getParameters().selectedItem.getProperty("description");
							sModelData[g.index].PointVS = "None";
							g.getView().getModel(g.oModelName).setProperty("/cycleModel", sModelData);
							g.getView().getModel(g.oModelName).refresh();
							p.SzaehLBL = true;
							p.SzaehVis = true;
							p.UnitcVis = true;
							p.StadtLBL = false;
							p.StadtVis = false;

							p.ScheIndRbTimeEnabled = false;
							p.ScheIndRbTimeKeyDateEnabled = false;
							p.ScheIndRbTimeFactCalEnabled = false;
							p.ScheIndRbPerformanceEnabled = true;
							p.ScheIndRbPerformance = true;
							p.Stich = 3;
							p.Fabkl = "";
							p.FabklDesc = "";
							p.FabklEnabled = false;
							p.FabklLBLReq = false;
							g.getView().getModel(g.oModelName).refresh();
							g.readCounterData(p, sModelData[g.index].Point, "counterUnit", "Point");
							if (sModelData[g.index].Zeieh !== "" && sModelData[g.index].Point !== "") {
								g.readCounterReading(sModelData[g.index].Point, sModelData[g.index].Zeieh);
							}
						}
						g.counter = false;
					}
				};

				var q = "/MSCounterSet";
				var M = g.getView().getModel("valueHelp");
				var coSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Point", "Psort");
				coSelectDialog.open();
			},

			valueHelpFunUnit: function (c, sModelData, g) {
				var oItemCycleData = g.getView().getModel(g.oModelName).getProperty("/cycleModel");
				var sPath = c.getSource().getBindingContext(g.oModelName).sPath;
				sPath = sPath.substring(sPath.lastIndexOf("/") + 1);
				g.index = parseInt(sPath.substr(-1));

				var settings = {
					title: g.getView().getModel("i18n").getProperty("CYCLE_UNIT_TXT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/SchPeriodUnitSet",
						template: new sap.m.StandardListItem({
							title: "{Mseh3}",
							description: "{Msehl}"
						})
					},
					confirm: function (E) {
						g.cycleCounterUnit = E.getParameters().selectedItem.getProperty("title");
						oItemCycleData[g.index].Zeieh = E.getParameters().selectedItem.getProperty("title");
						oItemCycleData[g.index].Ofsetunit = E.getParameters().selectedItem.getProperty("title");
						oItemCycleData[g.index].ZeiehVS = "None";
						var value = E.getParameters().selectedItem.getProperty("title");

						if (value === "D" || value === "DAY" ||
							value === "WK" || value === "YR" ||
							value === "MON" || value === "HR" || value === "H") {
							g.counter = false;
							sModelData.ScheIndRbTimeEnabled = true;
							sModelData.ScheIndRbTimeKeyDateEnabled = true;
							sModelData.ScheIndRbTimeFactCalEnabled = true;
							if (sModelData.ScheIndRbPerformance === true) {
								sModelData.ScheIndRbTime = true;
								sModelData.Stich = 0;
							}
							sModelData.SzaehLBL = false;
							sModelData.SzaehVis = false;
							sModelData.UnitcVis = false;
							sModelData.StadtLBL = true;
							sModelData.StadtVis = true;

							sModelData.ScheIndRbPerformanceEnabled = false;
							oItemCycleData[g.index].PointVS = "None";
							g.ValidateTimeKey(oItemCycleData, g.index, sModelData);
						} else {
							g.counter = true;
							sModelData.SzaehLBL = true;
							sModelData.SzaehVis = true;
							sModelData.UnitcVis = true;
							sModelData.StadtLBL = false;
							sModelData.StadtVis = false;

							oItemCycleData[g.index].PointVS = "Error";
							sModelData.Stich = 3;
							sModelData.ScheIndRbPerformance = true;
							sModelData.ScheIndRbPerformanceEnabled = true;
							sModelData.ScheIndRbTimeEnabled = false;
							sModelData.ScheIndRbTimeKeyDateEnabled = false;
							sModelData.ScheIndRbTimeFactCalEnabled = false;
							var msg = g.getView().getModel("i18n").getProperty("COUNTER_MANDMSG");
							g.invokeMessage(msg);
						}
						g.getView().getModel(g.oModelName).setProperty("/cycleModel", oItemCycleData);
						g.getView().getModel(g.oModelName).refresh();

						if (oItemCycleData[g.index].Zeieh !== "" && oItemCycleData[g.index].Point !== "") {
							g.readCounterReading(oItemCycleData[g.index].Point, oItemCycleData[g.index].Zeieh);
						}
					}
				};

				var q = "/SchPeriodUnitSet";
				var M = g.getView().getModel("valueHelp");
				var cuSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Mseh3", "Msehl");
				cuSelectDialog.open();
			},

			_changeFlocCategory: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Floccategory;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/FLocCatgValueHelpSet";
					var oFilters = [new sap.ui.model.Filter("FlocCategory", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Floccategory = a;
							oJsonData.FlocCategoryDesc = d.results[0].FlocCategoryDesc;
							oJsonModel.setData(oJsonData);
							if (g.detailFlag) {
								g.readStatusProf(c, g);
								if (oJsonData.Floccategory === "L" && g.lamSwitch === "X") {
									if (oJsonData.lam === undefined) {
										oJsonData.lam = {
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
									g.lam.setVisible(true);
									g.lam.setModel(oJsonModel, "AIWLAM");
									g.linearChar.setVisible(true);
								} else {
									g.lam.setVisible(false);
									g.linearChar.setVisible(false);
								}
							}
						} else {
							oJsonData.FlocCategoryDesc = "";
							oJsonData.Floccategory = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Floccategory = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunFlocCat: function (p, g) {
				var flCatSearchResults;
				if (flCatSearchResults === undefined) {
					var flCatSelectDialog = new sap.m.SelectDialog({
						title: g.getView().getModel("i18n").getProperty("FUNLOC_CAT"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
						items: {
							path: "/FLocCatgValueHelpSet",
							template: new sap.m.StandardListItem({
								title: "{FlocCategory}",
								description: "{FlocCategoryDesc}"
							})
						},
						confirm: function (E) {
							p.Floccategory = E.getParameters().selectedItem.getProperty("title");
							p.FloccategoryVS = "None";
							p.FloccategoryVST = "";
							p.FlocCategoryDesc = E.getParameters().selectedItem.getProperty("description");
							g.getModel(g.oModelName).refresh();
							if (g.detailFlag) {
								g.readStatusProf(p.Floccategory, g);
								if (p.Floccategory === "L" && g.lamSwitch === "X") {
									if (p.lam === undefined) {
										p.lam = {
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
									g.lam.setVisible(true);
									g.lam.setModel(new JSONModel(p), "AIWLAM");
									g.linearChar.setVisible(true);
								} else {
									g.lam.setVisible(false);
									g.linearChar.setVisible(false);
								}
							}
						},
						search: function (E) {
							var sValue = E.getParameter("value");
							if (E.getSource().getBinding("items")) {
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("FlocCategory", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("FlocCategoryDesc", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}

						}
					});

					var sPath = "/FLocCatgValueHelpSet";
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							flCatSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{FlocCategory}",
								description: "{FlocCategoryDesc}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							flCatSelectDialog.setModel(e);
							// flCatSelectDialog.setGrowingThreshold(h.results.length);
							flCatSelectDialog.bindAggregation("items", "/results", I);
						} else {
							flCatSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					};
					var fnError = function () {};
					g._readData(sPath, oModel, fnSuccess, fnError);
				} else {
					var e = new sap.ui.model.json.JSONModel();
					e.setData(flCatSearchResults);
					flCatSelectDialog.setModel(e);
					var I = flCatSelectDialog.getItems();
					for (var i = 0; i < I.length; i++) {
						I[i].setVisible(true);
					}
				}
				flCatSelectDialog.open();
			},

			_changeStrIndicator: function (f, g) {
				var c = f.Strucindicator;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/StrucIndicatorValueHelpSet";
					var oFilters = [new sap.ui.model.Filter("StrucIndicator", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.Strucindicator = a;
							f.StrucIndicatorDesc = d.results[0].StrucIndicatorDesc;
							f.EditMask = d.results[0].EditMask;
							f.Hierarchy = d.results[0].Hierarchy;
							g.getModel(g.oModelName).refresh();
							g.readSupFlocDetails();
						} else {
							f.Strucindicator = "";
							f.StrucIndicatorDesc = "";
							f.EditMask = "";
							f.Hierarchy = "";
							f.StrucindicatorVS = "Error";
							f.StrucindicatorVST = "Invalid Entry";
							g.getModel(g.oModelName).refresh();
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						f.StrucindicatorVS = "Error";
						f.StrucindicatorVST = d;
						g.getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.Strucindicator = a;
					g.getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunStrInd: function (p, g) { // var g = this;
				var settings = {
					title: g.getView().getModel("i18n").getProperty("STR_IND"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>STR_IND}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>STR_IND_DESC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>EDIT_MASK}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>HIER_LEVELS}"
								})
							]
						})
					],
					items: {
						path: "/StrucIndicatorValueHelpSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{StrucIndicator}"
								}),
								new sap.m.Text({
									text: "{StrucIndicatorDesc}"
								}),
								new sap.m.Text({
									text: "{EditMask}"
								}),
								new sap.m.Text({
									text: "{Hierarchy}"
								})
							]
						})
					},
					confirm: function (E) {
						if (p.Functionallocation === "" || p.Functionallocation === undefined) {
							p.Strucindicator = "";
							g.getModel(g.oModelName).refresh();
							g.invokeMessage(g.getResourceBundle().getText("functionalLocationMand"));
						} else {
							p.StrucindicatorVS = "None";
							p.StrucindicatorVST = "";
							p.Strucindicator = E.getParameter("selectedItem").getCells()[0].getText();
							p.StrucIndicatorDesc = E.getParameter("selectedItem").getCells()[1].getText();
							p.EditMask = E.getParameter("selectedItem").getCells()[2].getText();
							p.Hierarchy = E.getParameter("selectedItem").getCells()[3].getText();
							g.getModel(g.oModelName).refresh();
							g.readSupFlocDetails();
						}
					}
				};

				var sPath = "/StrucIndicatorValueHelpSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{StrucIndicator}"
					}),
					new sap.m.Text({
						text: "{StrucIndicatorDesc}"
					}),
					new sap.m.Text({
						text: "{EditMask}"
					}),
					new sap.m.Text({
						text: "{Hierarchy}"
					})
				];

				var stSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "StrucIndicator", "StrucIndicatorDesc");
				stSelectDialog.open();
				stSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeSupFunctionalLocation: function (f, g) { // var g = this;
				var c = f.SupFunctionallocation;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/ChangeRequestSet";
					var oFilters = [new sap.ui.model.Filter("Tplma", "EQ", c),
						new sap.ui.model.Filter("Tplkz", "EQ", f.Strucindicator),
						new sap.ui.model.Filter("Tplnr", "EQ", f.Functionallocation)
					];
					var oExpand = ["FLAddr", "FLClass", "FLEmail", "FLFax", "FLLAM", "FLLAMCH", "FLMltxt", "FLPermit", "FLPrtnr", "FLTele", "FLUrl",
						"FLVal", "FuncLoc"
					];
					var urlParameters = {
						"$expand": oExpand
					};
					var oModel = g.getView().getModel();
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							var h = d.results[0].FuncLoc.results[0];
							f.SupFunctionallocation = a;
							f.SupFlocdescription = h.Supflocdesc;
							g.getModel(g.oModelName).refresh();
							if (g.viewName && g.viewName === "ChangeFloc") {
								g.readSupFlocDetailsChange(a, "SUP", h.Supflocdesc);
							} else {
								g.readSupFlocDetails(a, "SUP", h.Supflocdesc);
							}
						} else {
							// f.SupFunctionallocation = "";
							// f.SupFlocdescription = "";
							f.SupFunctionallocationVS = "Error";
							f.SupFunctionallocationVST = "Invalid Entry";
							g.getModel(g.oModelName).refresh();
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						f.SupFunctionallocationVS = "Error";
						f.SupFunctionallocationVST = d;
						g.getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters, urlParameters);
				} else {
					f.SupFunctionallocation = a;
					g.getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunSupFloc: function (p, g) {
				var mpSearchResults;
				if (mpSearchResults === undefined) {
					var sModelName;
					if (g.oModelName) {
						sModelName = g.oModelName;
					} else if (g.oSearchModelName) {
						sModelName = g.oSearchModelName;
					}
					var oSource = p.getSource();
					var oJsonModel = g.getView().getModel(sModelName);
					var oJsonData = oJsonModel.getData();
					var mpSelectDialog = new sap.m.SelectDialog({
						title: g.getView().getModel("i18n").getProperty("FLOC_TXT"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
						growingThreshold: 5000,
						items: {
							path: "/FunctionLocationSet",
							template: new sap.m.StandardListItem({
								title: "{Tplnr}",
								description: "{Pltxt}"
							})
						},
						confirm: function (E) {
							oJsonData.SupFunctionallocation = E.getParameter("selectedItem").getProperty("title");
							oJsonData.SupFlocdescription = E.getParameter("selectedItem").getProperty("description");
							oSource.setValueState("None");
							oSource.setValueStateText("");
							oJsonModel.setData(oJsonData);
							g.readSupFlocDetails(oJsonData.SupFunctionallocation, "SUP", oJsonData.SupFlocdescription);
							$("#" + g.getView().byId("FunctionalLocation").sId + "-inner").val(e.getParameter("selectedItem").getProperty("title")).change();
							// p.Tplnr = E.getParameters().selectedItem.getProperty("title");
						},
						search: function (E) {
							var sValue = E.getParameter("value");
							if (E.getSource().getBinding("items")) {
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Tplnr", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Pltxt", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}

						},
						liveChange: function (E) {
							var v = E.getParameter("value").toUpperCase();
							v = v.replace(/^[ ]+|[ ]+$/g, '');
							var h = mpSelectDialog.getItems();
							for (var i = 0; i < h.length; i++) {
								if (v.length > 0) {
									var s = h[i].getBindingContext().getProperty("Tplnr");
									var j = h[i].getBindingContext().getProperty("Pltxt");
									if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
										h[i].setVisible(false);
									} else {
										h[i].setVisible(true);
									}
								} else {
									h[i].setVisible(true);
								}
							}
						}
					});

					var sPath = "/FunctionLocationSet";
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (h) {
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
							mpSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Tplnr}",
								description: "{Pltxt}",
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

				// var g = this;
				// var oModel = g.getView().getModel("valueHelp");
				// g._valueHelpDialog = sap.ui.xmlfragment("ugiaiwui.mdg.aiw.ZAIW_UI_03.Fragments.FlocVH", g);
				// g.getView().addDependent(g._valueHelpDialog);
				// g._valueHelpDialog.setModel(oModel);
				// g._valueHelpDialog.open();
				// // g.inputId = g._valueHelpDialog.getTitle();
				// g.inputId = "SuperiorFloc";
			},

			_changeMeasPointObject: function (f, g) { // var g = this;
				var c = f.ObtypMs;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MSPObjTypeSet";
					var oFilters = [new sap.ui.model.Filter("Obtyp", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.ObtypMs = a;
							f.Txt = d.results[0].Txt;
						} else {
							f.ObtypMs = "";
							f.Txt = "";
							f.ObtypMsVS = "Error";
							f.ObtypMsVST = "Invalid Entry";
						}
						g.getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.ObtypMsVS = "Error";
						f.ObtypMsVST = d;
						g.getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
					f.EqunrVS = "None";
					f.TplnrVS = "None";
					f.Equnr = "";
					f.Eqktx = "";
					f.Tplnr = "";
					f.Pltxt = "";

					if (a === "IEQ") {
						f.EqunrInpVis = true;
						f.EqunrLblVis = true;
						f.EqktxInpVis = true;
						f.EqunrEnabled = true;
						f.TplnrInpVis = false;
						f.TplnrLblVis = false;
						f.PltxtInpVis = false;
						f.TplnrEnabled = false;
						g.getModel(g.oModelName).refresh();
					}
					if (a === "IFL") {
						f.EqunrInpVis = false;
						f.EqunrLblVis = false;
						f.EqktxInpVis = false;
						f.EqunrEnabled = false;
						f.TplnrInpVis = true;
						f.TplnrLblVis = true;
						f.PltxtInpVis = true;
						f.TplnrEnabled = true;
						g.getModel(g.oModelName).refresh();
					}
				} else {
					f.ObtypMs = a;
					g.getModel(g.oModelName).refresh();
				}
			},

			valueHelpMeasPointObj: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("MEASPOINT_OBJ_TXT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/MSPObjTypeSet",
						template: new sap.m.StandardListItem({
							title: "{Obtyp}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						p.ObtypMs = E.getParameters().selectedItem.getProperty("title");
						p.Txt = E.getParameters().selectedItem.getProperty("description");
						p.ObtypMsVS = "None";
						p.ObtypMsVST = "";
						p.EqunrVS = "None";
						p.TplnrVS = "None";
						p.Equnr = "";
						p.Eqktx = "";
						p.Tplnr = "";
						p.Pltxt = "";

						if (p.ObtypMs === "IEQ") {
							p.EqunrInpVis = true;
							p.EqunrLblVis = true;
							p.EqktxInpVis = true;
							p.EqunrEnabled = true;
							p.TplnrInpVis = false;
							p.TplnrLblVis = false;
							p.PltxtInpVis = false;
							p.TplnrEnabled = false;
						}
						if (p.ObtypMs === "IFL") {
							p.EqunrInpVis = false;
							p.EqunrLblVis = false;
							p.EqktxInpVis = false;
							p.EqunrEnabled = false;
							p.TplnrInpVis = true;
							p.TplnrLblVis = true;
							p.PltxtInpVis = true;
							p.TplnrEnabled = true;
						}
						g.getModel(g.oModelName).refresh();
					}
				};

				var q = "/MSPObjTypeSet";
				var M = g.getView().getModel("valueHelp");
				var objSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Obtyp", "Txt");
				objSelectDialog.open();
			},

			_changeMeasPointCategory: function (f, g) {
				// var g = this;
				var c = f.Mptyp;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MSPTypeSet";
					var oFilters = [new sap.ui.model.Filter("Mptyp", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.Mptyp = a;
							f.Mpttx = d.results[0].Mpttx;
							if (f.Mptyp === "L" && g.lamSwitch === "X") {
								if (f.Mptyp === "L" && f.lam === undefined) {
									f.lam = {
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
								g.lam.setVisible(true);
								g.lam.setModel(new JSONModel(f), "AIWLAM");
							} else {
								g.lam.setVisible(false);
							}
						} else {
							f.Mptyp = "";
							f.Mpttx = "";
							f.MptypVS = "Error";
							f.MptypVST = "Invalid Entry";
						}
						g.getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.MptypVS = "Error";
						f.MptypVST = d;
						g.getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.Mptyp = a;
					g.getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunMsptCat: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("MP_CAT_TXT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/MSPTypeSet",
						template: new sap.m.StandardListItem({
							title: "{Mptyp}",
							description: "{Mpttx}"
						})
					},
					confirm: function (E) {
						p.MptypVS = "None";
						p.MptypVST = "";
						p.Mptyp = E.getParameters().selectedItem.getProperty("title");
						p.Mpttx = E.getParameters().selectedItem.getProperty("description");
						g.getModel(g.oModelName).refresh();

						if (p.Mptyp === "L" && g.lamSwitch === "X") {
							if (p.lam === undefined) {
								p.lam = {
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
							g.lam.setVisible(true);
							g.lam.setModel(new JSONModel(p), "AIWLAM");
						} else {
							g.lam.setVisible(false);
						}
					}
				};

				var q = "/MSPTypeSet";
				var M = g.getView().getModel("valueHelp");
				var msTypSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Mptyp", "Mpttx");
				msTypSelectDialog.open();
			},

			_changeCharacteristicName: function (f, g) {
				// var g = this;
				var c = f.AtnamMs;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/CharNameSet";
					var oFilters = [new sap.ui.model.Filter("Atnam", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						g.BusyDialog.close();
						if (d.results.length > 0) {
							f.AtnamMs = a;
							f.Atbez = d.results[0].Atbez;
							g.readCharUnit(f, g, a);
						} else {
							f.AtnamMs = "";
							f.Atbez = "";
							f.AtnamMsVS = "Error";
							f.AtnamMsVST = "Invalid Entry";
						}
						g.getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						g.BusyDialog.close();
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.AtnamMsVS = "Error";
						f.AtnamMsVST = d;
						g.getModel(g.oModelName).refresh();
					};
					g.BusyDialog.open();
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.AtnamMs = a;
					g.getModel(g.oModelName).refresh();
				}
			},

			_changeDecimalPlace: function (f, g) {
				var c = f.Decim;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/DecimalSet";
					var oFilters = [new sap.ui.model.Filter("Decim", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.Decim = a;
							// f.Atbez = d.results[0].Atbez;
							// g.readCharUnit(f, g, a);
						} else {
							f.Decim = "";
							// f.Atbez = "";
							// f.AtnamMsVS = "Error";
							// f.AtnamMsVST = "Invalid Entry";
						}
						g.getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						// f.AtnamMsVS = "Error";
						// f.AtnamMsVST = d;
						g.getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.Decim = a;
					g.getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunChar: function (p, g) { // var g = this;
				var settings = {
					title: g.getView().getModel("i18n").getProperty("CHAR_NAME_TXT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>CHARACTERISTIC}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>DESCRIPTION}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>VALID_FRM}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CHARS_GRP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>FORMAT}"
								})
							]
						})
					],
					items: {
						path: "/CharNameSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Atnam}"
								}),
								new sap.m.Text({
									text: "{Atbez}"
								}),
								new sap.m.Text({
									text: "{Datuv}"
								}),
								new sap.m.Text({
									text: "{Atkla}"
								}),
								new sap.m.Text({
									text: "{Atfor}"
								})
							]
						})
					},
					confirm: function (E) {
						p.AtnamMs = E.getParameter("selectedItem").getCells()[0].getText();
						p.Atbez = E.getParameter("selectedItem").getCells()[1].getText();
						p.AtnamMsVS = "None";
						p.AtnamMsVSt = "";
						g.getModel(g.oModelName).refresh();
						E.getSource().getBinding("items").filter([]);
						g.readCharUnit(p, g, p.AtnamMs);
					}
				};

				var sPath = "/CharNameSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Atnam}"
					}),
					new sap.m.Text({
						text: "{Atbez}"
					}),
					new sap.m.Text({
						text: "{Datuv}"
					}),
					new sap.m.Text({
						text: "{Atkla}"
					}),
					new sap.m.Text({
						text: "{Atfor}"
					})
				];

				var cSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Atnam", "Atbez");
				cSelectDialog.open();
				cSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeCodeGroup: function (f, g) {
				// var g = this;
				var c = f.Codgr;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/CodeGrpSet";
					var oFilters = [new sap.ui.model.Filter("Codegruppe", "EQ", c), new sap.ui.model.Filter("Mptyp", "EQ", f.Mptyp)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.Codgr = a;
							f.Codgrtxt = d.results[0].Kurztext;
						} else {
							// f.Codgr = "";
							f.Codgrtxt = "";
							f.CodgrVS = "Error";
							f.CodgrVST = "Invalid Entry";
						}
						g.getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.CodgrVS = "Error";
						f.CodgrVST = d;
						g.getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.Codgr = a;
					g.getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunCodeGrp: function (p, g) { // var g = this;
				var settings = {
					title: g.getView().getModel("i18n").getProperty("CODE_GRP_TXT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>CATALOG}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CODE_GRP_TXT}"
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
						})
					],
					items: {
						path: "/CodeGrpSet?$filter=Mptyp%20eq%20%27" + p.Mptyp + "%27",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Katalogart}"
								}),
								new sap.m.Text({
									text: "{Codegruppe}"
								}),
								new sap.m.Text({
									text: "{Kurztext}"
								})
							]
						})
					},
					confirm: function (E) {
						p.Codgr = E.getParameter("selectedItem").getCells()[1].getText();
						p.Codgrtxt = E.getParameter("selectedItem").getCells()[2].getText();
						p.CodgrVS = "None";
						p.CodgrVST = "";
						g.getModel(g.oModelName).refresh();
					}
				};
				var sPath = "/CodeGrpSet";
				var oFilters = [new sap.ui.model.Filter("Mptyp", "EQ", p.Mptyp)];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Katalogart}"
					}),
					new sap.m.Text({
						text: "{Codegruppe}"
					}),
					new sap.m.Text({
						text: "{Kurztext}"
					})
				];

				var cgSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Katalogart", "Codegruppe");
				cgSelectDialog.open();
				cgSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			valueHelpDecimalPlace: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("DECIMAL_PLACES"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/DecimalSet",
						template: new sap.m.StandardListItem({
							title: "{Decim}",
							description: "{Text}"
						})
					},
					confirm: function (E) {
						// p.MptypVS = "None";
						// p.MptypVST = "";
						p.Decim = E.getParameters().selectedItem.getProperty("title");
						// p.Mpttx = E.getParameters().selectedItem.getProperty("description");
						g.getModel(g.oModelName).refresh();
					}
				};

				var q = "/DecimalSet";
				var M = g.getView().getModel("valueHelp");
				var msTypSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Decim", "Text");
				msTypSelectDialog.open();
			},

			valueHelpCycleSetSeq: function (p, g) {
				var csSelectDialog = new sap.m.SelectDialog({
					title: g.getView().getModel("i18n").getProperty("CYCLE_SET_SEQ"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/",
						template: new sap.m.StandardListItem({
							title: "{Cycleseqi}",
							description: ""
						})
					},
					confirm: function (E) {
						p.CycleseqVS = "None";
						p.Cycleseq = E.getParameters().selectedItem.getProperty("title");
						g.getView().getModel(g.oModelName).refresh();
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						if (E.getSource().getBinding("items")) {
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Cycleseqi", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}

					}
				});

				if (g.cycleSeq.length > 0) {
					var cModel = new sap.ui.model.json.JSONModel();
					cModel.setData(g.cycleSeq);
					csSelectDialog.setModel(cModel);
					// csSelectDialog.setGrowingThreshold(cModel.getData().length);
				} else {
					csSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
				}
				csSelectDialog.open();
			},

			_changeAssembly: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel("itemDetailView");
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.AsmblyOb;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MaterialVH_PRTSet";
					var oFilters = [new sap.ui.model.Filter("Matnr", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.AsmblyOb = a;
							oJsonData.Assemblydesc = d.results[0].Maktg;
							oJsonModel.setData(oJsonData);
						} else {
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
						oJsonModel.setData(oJsonData);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.AsmblyOb = a;
					g.getView().getModel(g.oModelName).refresh();
				}
			},

			valueHelpAssembly: function (p, g) {
				var oSource = p.getSource();
				var oJsonModel = g.getView().getModel("itemDetailView");
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("ASSEMBLY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>DESCRIPTION}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LANGUAGE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MATERIAL}"
								})
							]
						})
					],
					items: {
						path: "/MaterialVH_PRTSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Maktg}"
								}),
								new sap.m.Text({
									text: "{Spras}"
								}),
								new sap.m.Text({
									text: "{Matnr}"
								})
							]
						})

					},
					confirm: function (E) {
						oJsonData.AsmblyOb = E.getParameter("selectedItem").getCells()[2].getText();
						oJsonData.Assemblydesc = E.getParameter("selectedItem").getCells()[0].getText();
						oSource.setValueState("None");
						oSource.setValueStateText("");
						oJsonModel.setData(oJsonData);
					}
				};

				var sPath = "/MaterialVH_PRTSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Maktg}"
					}),
					new sap.m.Text({
						text: "{Spras}"
					}),
					new sap.m.Text({
						text: "{Matnr}"
					})
				];

				var aSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Matnr", "Maktg");
				aSelectDialog.open();
				aSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeOrderType: function (f, g) {
				var c = f.Auart;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MPLANOrdertypeSet";
					var oFilters = [new sap.ui.model.Filter("Auart", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.Auart = a;
							f.oTypeTxt = d.results[0].Txt;
						} else {
							f.Auart = "";
							f.oTypeTxt = "";
							f.AuartVS = "Error";
							f.AuartVST = "Invalid Entry";
						}
						g.getView().getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.AuartVS = "Error";
						f.AuartVST = d;
						g.getView().getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.Auart = a;
					g.getView().getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunOrderType: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("ORDER_TYPE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/MPLANOrdertypeSet",
						template: new sap.m.StandardListItem({
							title: "{Auart}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						p.Auart = E.getParameters().selectedItem.getProperty("title");
						p.oTypeTxt = E.getParameters().selectedItem.getProperty("description");
						p.AuartVS = "None";
						g.getView().getModel(g.oModelName).refresh();
					}
				};

				var q = "/MPLANOrdertypeSet";
				var M = g.getView().getModel("valueHelp");
				var otSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Auart", "Txt");
				otSelectDialog.open();
			},

			_changeNotifType: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel("itemDetailView");
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.Qmart;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/NotifType_genSet";
					var oFilters = [new sap.ui.model.Filter("Qmart", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.Qmart = a;
							oJsonData.nTypeTxt = d.results[0].Qmartx;
						} else {
							oJsonData.Qmart = "";
							oJsonData.nTypeTxt = "";
							oSource.setValueState("Error");
							oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.Qmart = a;
					oJsonModel.setData(oJsonData);
				}
			},

			valueHelpFunNotifType: function (p, g) {
				var oSource = p.getSource();
				var oJsonModel = g.getView().getModel("itemDetailView");
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("NOTIF_TYPE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/NotifType_genSet",
						template: new sap.m.StandardListItem({
							title: "{Qmart}",
							description: "{Qmartx}"
						})
					},
					confirm: function (E) {
						oJsonData.Qmart = E.getParameters().selectedItem.getProperty("title");
						oJsonData.nTypeTxt = E.getParameters().selectedItem.getProperty("description");
						oSource.setValueState("None");
						oSource.setValueStateText("");
						oJsonModel.setData(oJsonData);
					}
				};

				var q = "/NotifType_genSet";
				var M = g.getView().getModel("valueHelp");
				var ntSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Qmart", "Qmartx");
				ntSelectDialog.open();
			},

			_changeMpmiMainWc: function (f, g) {
				var c = f.ArbpMi;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/WorkCenterVHSet";
					var sWerks = f.Werks ? f.Werks : "";
					var oFilters = [new sap.ui.model.Filter("Arbpl", "EQ", c), new sap.ui.model.Filter("Werks", "EQ", sWerks)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.ArbpMi = a;
							f.WergwMi = d.results[0].Werks;
							if (f.enableLoc === false) {
								f.ArbplIl = a;
								f.Workcenterdesc = "";
							}
						} else {
							f.ArbpMi = "";
							f.WergwMi = "";
							f.ArbpMiVS = "Error";
							f.ArbpMiVST = "Invalid Entry";
						}
						g.getView().getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.ArbpMiVS = "Error";
						f.ArbpMiVST = d;
						g.getView().getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.ArbpMi = a;
					g.getView().getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunMpmiMainWc: function (p, g) {
				var wcSearchResults;
				if (wcSearchResults === undefined) {
					var wcSelectDialog = new sap.m.TableSelectDialog({
						title: g.getView().getModel("i18n").getProperty("MAIN_WC"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
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
							}),
							new sap.m.Column({
								demandPopin: true,
								minScreenWidth: "Tablet",
								header: [
									new sap.m.Text({
										text: "Work Center"
									})
								]
							}),
							new sap.m.Column({
								demandPopin: true,
								minScreenWidth: "Tablet",
								header: [
									new sap.m.Text({
										text: "Description"
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
							})
						],
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
							p.ArbpMi = E.getParameter("selectedItem").getCells()[2].getText();
							p.WergwMi = E.getParameter("selectedItem").getCells()[1].getText();
							p.ArbpMiVS = "None";
							p.ArbpMiVST = "";
							if (p.enableLoc === false) {
								p.ArbplIl = E.getParameter("selectedItem").getCells()[2].getText();
								p.Workcenterdesc = "";
							}
							g.getView().getModel(g.oModelName).refresh();
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
										false)
								]);
							}

						}
					});
					var sPath = "/WorkCenterVHSet";
					var oModel = g.getView().getModel("valueHelp");
					var sWerks = p.Werks ? p.Werks : "";
					var oFilters = [new sap.ui.model.Filter("Werks", "EQ", sWerks)];
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							if (sap.ui.getCore().getModel("AIWListWCModel")) {
								var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
								if (oModelData.length > 0) {
									for (var i = 0; i < oModelData.length; i++) {
										if (oModelData[i].wc) {
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
								}
							}
							wcSearchResults = h;
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
							wcSelectDialog.setModel(e);
							// wcSelectDialog.setGrowingThreshold(h.results.length);
							wcSelectDialog.bindAggregation("items", "/results", I);
						} else {
							wcSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					};
					var fnError = function () {};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					var e = new sap.ui.model.json.JSONModel();
					e.setData(wcSearchResults);
					wcSelectDialog.setModel(e);
					var I = wcSelectDialog.getItems();
					for (var i = 0; i < I.length; i++) {
						I[i].setVisible(true);
					}
				}
				wcSelectDialog.open();
			},

			_changeMpmiMainWcPlnt: function (f, g) {
				var c = f.WergwMi;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/WorkCenterVHSet";
					var oFilters = [new sap.ui.model.Filter("Werks", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.WergwMi = a;
						} else {
							f.WergwMiVS = "Error";
							f.WergwMiVST = "Invalid Entry";
						}
						g.getView().getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.WergwMiVS = "Error";
						f.WergwMiVST = d;
						g.getView().getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.WergwMi = a;
					g.getView().getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunMpmiMainWcPlnt: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PLAN_FOR_WC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>WC_CATEGORY}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PLANT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>WC}"
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
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LANGUAGE}"
								})
							]
						})
					],
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
						p.WergwMi = E.getParameter("selectedItem").getCells()[1].getText();
						p.WergwMiVS = "None";
						g.getView().getModel(g.oModelName).refresh();
					}
				};

				var sPath = "/WorkCenterVHSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
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
				];

				var wcpSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Werks", "Arbpl");
				wcpSelectDialog.open();
				wcpSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeFloc: function (f, g) {
				var c = f.Tplnr;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					//var q = "/FlocAssestVHSet?$filter=" + jQuery.sap.encodeURL("Tplnr eq '" + c + "'");
					var sPath = "/FunctionLocationSet";
					var oFilters = [new sap.ui.model.Filter("Tplnr", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.Tplnr = a;
							f.Pltxt = d.results[0].Pltxt;
							g.getView().getModel(g.oModelName).refresh();
							if (f.Equnr !== "" && c === "") {
								g.readPlantData(c);
							} else if (f.Equnr !== "" && c !== "") {
								g.readPlantData(c);
							} else if (f.Equnr === "" && c !== "") {
								g.readPlantData(c);
							}
							if (g.strategy === "PERF" || g.strategy === "singlePerf") {
								g.readCounter();
							}
						} else {
							f.Tplnr = "";
							f.Pltxt = "";
							f.TplnrVS = "Error";
							f.TplnrVST = "Invalid Entry";
						}
						g.getView().getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.TplnrVS = "Error";
						f.TplnrVST = d;
						g.getView().getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.Tplnr = a;
					g.getView().getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunMaintPlan: function (p, g) {
				var mpSearchResults;
				if (mpSearchResults === undefined) {
					var mpSelectDialog = new sap.m.SelectDialog({
						title: g.getView().getModel("i18n").getProperty("MAINTPLAN_TXT"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
						growingThreshold: 5000,
						items: {
							path: "/MPlanVHSet",
							template: new sap.m.StandardListItem({
								title: "{Warpl}",
								description: "{Wptxt}"
							})
						},
						confirm: function (E) {
							p.Warpl = E.getParameters().selectedItem.getProperty("title");
							p.WarplVS = "None";
							p.WarplVST = "";
							g.getView().getModel(g.oModelName).refresh();

							if (g._copyFragmentFlag) {
								g._copyFragment.getModel("copyModel").refresh();
							}
						},
						search: function (E) {
							var sValue = E.getParameter("value");
							if (E.getSource().getBinding("items")) {
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Warpl", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Wptxt", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}

						}
					});

					var sPath = "/MPlanVHSet";
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							if (g._copyFragmentFlag) {
								var oModelData = g.getView().getModel(g.oModelAIWMPMI).getData();
								if (oModelData.length > 0) {
									for (var i = 0; i < oModelData.length; i++) {
										if (oModelData[i].Warpl) {
											var sObj = {
												Warpl: oModelData[i].Warpl,
												Wptxt: oModelData[i].Wptxt
											};
											h.results.unshift(sObj);
										}
									}
								}
							}
							mpSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Warpl}",
								description: "{Wptxt}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);

							mpSelectDialog.setModel(e);
							// mpSelectDialog.setGrowingThreshold(h.results.length);
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

			_changeMaintenanceCatPlan: function (f, g) {
				var c = f.Mptyp;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MPLANItemCatgSet";
					var oFilters = [new sap.ui.model.Filter("Mptyp", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.Mptyp = a;
						} else {
							f.MptypVS = "Error";
							f.MptypVST = "Invalid Entry";
						}
						g.getView().getModel(g.ModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.MptypVS = "Error";
						f.MptypVST = d;
						g.getView().getModel(g.ModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.Mptyp = a;
					g.getView().getModel(g.ModelName).refresh();
				}
			},

			valueHelpFunMaintCat: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("MAINTPLAN_TXT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/MPLANItemCatgSet",
						template: new sap.m.StandardListItem({
							title: "{Mptyp}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						p.Mptyp = E.getParameters().selectedItem.getProperty("title");
						p.MptypVS = "None";
						p.MptypVST = "";
						g.getView().getModel(g.oModelName).refresh();
					}
				};

				var q = "/MPLANItemCatgSet";
				var M = g.getView().getModel("valueHelp");
				var mpCatSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Mptyp", "Txt");
				mpCatSelectDialog.open();
			},

			_changeMaintenanceStrategy: function (f, g) {
				var c = f.Strat;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/StrategySet";
					var oFilters = [new sap.ui.model.Filter("Strat", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							f.Strat = a;
						} else {
							f.StratVS = "Error";
							f.StratVST = "Invalid Entry";
						}
						g.getView().getModel(g.oModelName).refresh();
					};
					var fnError = function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.StratVS = "Error";
						f.StratVST = d;
						g.getView().getModel(g.oModelName).refresh();
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					f.Strat = a;
					g.getView().getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunMaintenanceStrategy: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("MAINT_STR"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>STRATEGY}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>DESCRIPTION}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SCHE_IND_TXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>UNIT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>FACT_CAL}"
								})
							]
						})
					],
					items: {
						path: "/StrategySet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Strat}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								}),
								new sap.m.Text({
									text: "{Termk}"
								}),
								new sap.m.Text({
									text: "{Zeieh}"
								}),
								new sap.m.Text({
									text: "{Fabkl}"
								})
							]
						})

					},
					confirm: function (E) {
						p.Strat = E.getParameter("selectedItem").getCells()[0].getText();
						p.StratVS = "None";
						p.StratVST = "";
						g.getView().getModel(g.oModelName).refresh();
					}
				};

				var q = "/StrategySet";
				var M = g.getView().getModel("valueHelp");
				var oFilters = [];
				var cells = [
					new sap.m.Text({
						text: "{Strat}"
					}),
					new sap.m.Text({
						text: "{Ktext}"
					}),
					new sap.m.Text({
						text: "{Termk}"
					}),
					new sap.m.Text({
						text: "{Zeieh}"
					}),
					new sap.m.Text({
						text: "{Fabkl}"
					})
				];

				var strSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Strat", "Ktext");
				strSelectDialog.open();
				strSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeSortField: function (f, g) {
				var c = f.MplanSort;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var q = "/MplanSortSet";
					var oFilter = [new sap.ui.model.Filter("PlanSort", "EQ", c)];
					var m = g.getView().getModel("valueHelp");
					m.read(q, {
						filters: oFilter,
						success: function (d) {
							if (d.results.length > 0) {
								f.MplanSort = a;
							} else {
								f.MplanSortVS = "Error";
								f.MplanSortVST = "Invalid Entry";
							}
							g.getView().getModel(g.oModelName).refresh();
						},
						error: function (e) {
							var b = JSON.parse(e.response.body);
							var d = b.error.message.value;
							f.MplanSortVS = "Error";
							f.MplanSortVST = d;
							g.getView().getModel(g.oModelName).refresh();
						}
					});
				} else {
					f.MplanSort = a;
					g.getView().getModel(g.oModelName).refresh();
				}
			},

			valueHelpFunSortField: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("MP_SORT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/MplanSortSet",
						template: new sap.m.StandardListItem({
							title: "{PlanSort}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						p.MplanSort = E.getParameters().selectedItem.getProperty("title");
						p.MplanSortVS = "None";
						p.MplanSortVST = "";
						g.getView().getModel(g.oModelName).refresh();
					}
				};

				var q = "/MplanSortSet";
				var M = g.getView().getModel("valueHelp");
				var sfSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "PlanSort", "Txt");
				sfSelectDialog.open();
			},

			valueHelpFunMeasPoint: function (p, g) {
				var objSearchResults, objSelectDialog;
				if (objSearchResults === undefined) {
					objSelectDialog = new sap.m.TableSelectDialog({
						title: g.getView().getModel("i18n").getProperty("MEASPOINT_TXT"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
						columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "Measuring Point"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Meas. Position"
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
									text: "MeasPt Category"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Counter"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Functional Location"
								})
							]
						})],
						items: {
							path: "/MSPT_FL_VHSet",
							template: new sap.m.ColumnListItem({
								type: "Active",
								unread: false,
								cells: [
									new sap.m.Text({
										text: "{Point}"
									}),
									new sap.m.Text({
										text: "{Psort}"
									}),
									new sap.m.Text({
										text: "{Pttxt}"
									}),
									new sap.m.Text({
										text: "{Mptyp}"
									}),
									new sap.m.Text({
										text: "{Indct}"
									}),
									new sap.m.Text({
										text: "{Tplnr}"
									})
								]
							})

						},
						confirm: function (E) {
							p.Mspoint = E.getParameter("selectedItem").getCells()[0].getText();
							p.MspointVS = "None";
							p.MspointVST = "";
							g.getView().getModel(g.oModelName).refresh();

							if (g._copyFragmentFlag) {
								g._copyFragment.getModel("copyModel").refresh();
							}
						},
						search: function (E) {
							var sValue = E.getParameter("value");
							if (E.getSource().getBinding("items")) {
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Point", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Pttxt", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}

						}
					});

					var sPath = "/MSPT_FL_VHSet";
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							if (g._copyFragmentFlag) {
								var oModelData = g.getView().getModel(g.oModelAIWMSPT).getData();
								if (oModelData.length > 0) {
									for (var i = 0; i < oModelData.length; i++) {
										if (oModelData[i].Mspoint) {
											var sObj = {
												Indct: oModelData[i].Indct,
												Mptyp: oModelData[i].Mptyp,
												Point: oModelData[i].Mspoint,
												Psort: oModelData[i].Psort,
												Pttxt: oModelData[i].Pttxt,
												Tplnr: oModelData[i].Tplnr
											};
											h.results.unshift(sObj);
										}
									}
								}
							}
							g.pSearchResults = h;
							var I = new sap.m.ColumnListItem({
								type: "Active",
								unread: false,
								cells: [
									new sap.m.Text({
										text: "{Point}"
									}),
									new sap.m.Text({
										text: "{Psort}"
									}),
									new sap.m.Text({
										text: "{Pttxt}"
									}),
									new sap.m.Text({
										text: "{Mptyp}"
									}),
									new sap.m.Text({
										text: "{Indct}"
									}),
									new sap.m.Text({
										text: "{Tplnr}"
									})
								]
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							objSelectDialog.setModel(e);
							// objSelectDialog.setGrowingThreshold(h.results.length);
							objSelectDialog.bindAggregation("items", "/results", I);
						} else {
							objSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					};
					var fnError = function () {};
					g._readData(sPath, oModel, fnSuccess, fnError());
				} else {
					var e = new sap.ui.model.json.JSONModel();
					e.setData(objSearchResults);
					objSelectDialog.setModel(e);
					var I = objSelectDialog.getItems();
					for (var i = 0; i < I.length; i++) {
						I[i].setVisible(true);
					}
				}
				objSelectDialog.open();
			},

			TLTypeVH: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("TL_TYPE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/MPTlTypeSet",
						template: new sap.m.StandardListItem({
							title: "{Plnty}",
							description: "{Txt}"
						})
					},
					confirm: function (E) {
						p.PlntyMi = E.getParameters().selectedItem.getProperty("title");
						p.PlnnrMi = "";
						p.PlnalMi = "";
						p.Gpcounterdesc = "";
						p.PlntyMiState = "None";
						g.getView().getModel(g.oModelName).refresh();
					}
				};

				var q = "/MPTlTypeSet";
				var oFilter = [new sap.ui.model.Filter("Equnr", "EQ", p.Equnr),
					new sap.ui.model.Filter("Tplnr", "EQ", p.Tplnr),
					new sap.ui.model.Filter("Plnty", "EQ", '')
				];
				var M = g.getView().getModel("valueHelp");
				var TTSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "Plnty", "Txt");
				TTSelectDialog.open();
			},

			TLGroupVH: function (p, g) {
				var tlGrpSelectDialog = new sap.m.TableSelectDialog({
					title: g.getView().getModel("i18n").getProperty("GRP"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>TL_TYPE}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>GRP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>GRP_C}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>description}"
								})
							]
						})
					],
					items: {
						path: "/MPTListSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Plnty}"
								}),
								new sap.m.Text({
									text: "{Plnnr}"
								}),
								new sap.m.Text({
									text: "{Plnal}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								})
							]
						})
					},
					confirm: function (E) {
						p.PlntyMi = E.getParameter("selectedItem").getCells()[0].getText();
						p.PlnnrMi = E.getParameter("selectedItem").getCells()[1].getText();
						p.PlnalMi = E.getParameter("selectedItem").getCells()[2].getText();
						p.Gpcounterdesc = E.getParameter("selectedItem").getCells()[3].getText();
						p.PlnnrMiState = "None";
						g.getView().getModel(g.oModelName).refresh();
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Plnnr", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				var tempStrat = "";
				if (g.strategy !== "Blank") {
					tempStrat = g.strategy;
				}
				var sPath = "/MPTListSet";
				var oFilters = [new sap.ui.model.Filter("Equnr", "EQ", p.Equnr),
					new sap.ui.model.Filter("Tplnr", "EQ", p.Tplnr),
					new sap.ui.model.Filter("Plnty", "EQ", p.PlntyMi),
					new sap.ui.model.Filter("Werks", "EQ", p.Werks),
					new sap.ui.model.Filter("Plnal", "EQ", ''),
					new sap.ui.model.Filter("Plnnr", "EQ", ''),
					new sap.ui.model.Filter("Strat", "EQ", tempStrat)
				];
				var oModel = g.getView().getModel("valueHelp");
				var fnSuccess = function (h) {
					var oModelData;
					if (p.PlntyMi === "A" && sap.ui.getCore().getModel("AIWListGTLModel")) {
						oModelData = sap.ui.getCore().getModel("AIWListGTLModel").getData();
						if (oModelData.length > 0) {
							for (var i = 0; i < oModelData.length; i++) {
								for (var j = 0; j < oModelData[i].header.length; j++) {
									var sObj = {
										Plnty: p.PlntyMi,
										Plnnr: oModelData[i].grp,
										Plnal: oModelData[i].header[j].Plnal,
										Ktext: oModelData[i].header[j].Ktext,
									};
									h.results.unshift(sObj);
								}
							}
						}
					} else if (p.PlntyMi === "E" && sap.ui.getCore().getModel("AIWListETLModel")) {
						oModelData = sap.ui.getCore().getModel("AIWListETLModel").getData();
						if (oModelData.length > 0) {
							for (var i = 0; i < oModelData.length; i++) {
								if (oModelData[i].equipment === p.Equnr) {
									for (var j = 0; j < oModelData[i].header.length; j++) {
										var sObj = {
											Plnty: p.PlntyMi,
											Plnnr: oModelData[i].grp,
											Plnal: oModelData[i].header[j].Plnal,
											Ktext: oModelData[i].header[j].Ktext,
										};
										h.results.unshift(sObj);
									}
								}
							}
						}
					} else if (p.PlntyMi === "T" && sap.ui.getCore().getModel("AIWListFTLModel")) {
						oModelData = sap.ui.getCore().getModel("AIWListFTLModel").getData();
						if (oModelData.length > 0) {
							for (var i = 0; i < oModelData.length; i++) {
								if (oModelData[i].floc === p.Tplnr) {
									for (var j = 0; j < oModelData[i].header.length; j++) {
										var sObj = {
											Plnty: p.PlntyMi,
											Plnnr: oModelData[i].grp,
											Plnal: oModelData[i].header[j].Plnal,
											Ktext: oModelData[i].header[j].Ktext,
										};
										h.results.unshift(sObj);
									}
								}
							}
						}
					}
					if (h.results.length > 0) {
						var I = new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Plnty}"
								}),
								new sap.m.Text({
									text: "{Plnnr}"
								}),
								new sap.m.Text({
									text: "{Plnal}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								})
							]
						});
						var e = new sap.ui.model.json.JSONModel();
						e.setData(h);
						tlGrpSelectDialog.setModel(e);
						tlGrpSelectDialog.bindAggregation("items", "/results", I);
					} else {
						tlGrpSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
					}
				};
				var fnError = function () {};
				g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				tlGrpSelectDialog.open();
				tlGrpSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			TLCounterVH: function (p, g) {
				var tlGrpSelectDialog = new sap.m.TableSelectDialog({
					title: g.getView().getModel("i18n").getProperty("COUNTER"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [
						new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>TL_TYPE}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>GRP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>GRP_C}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>description}"
								})
							]
						})
					],
					items: {
						path: "/MPTListSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Plnty}"
								}),
								new sap.m.Text({
									text: "{Plnnr}"
								}),
								new sap.m.Text({
									text: "{Plnal}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								})
							]
						})
					},
					confirm: function (E) {
						p.PlntyMi = E.getParameter("selectedItem").getCells()[0].getText();
						p.PlnnrMi = E.getParameter("selectedItem").getCells()[1].getText();
						p.PlnalMi = E.getParameter("selectedItem").getCells()[2].getText();
						p.Gpcounterdesc = E.getParameter("selectedItem").getCells()[3].getText();
						p.PlnnrMiState = "None";
						g.getView().getModel(g.oModelName).refresh();
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Plnal", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});

				var tempStrat = "";
				if (g.strategy !== "Blank") {
					tempStrat = g.strategy;
				}
				var sPath = "/MPTListSet";
				var oFilters = [new sap.ui.model.Filter("Equnr", "EQ", p.Equnr),
					new sap.ui.model.Filter("Tplnr", "EQ", p.Tplnr),
					new sap.ui.model.Filter("Plnty", "EQ", p.PlntyMi),
					new sap.ui.model.Filter("Werks", "EQ", p.Werks),
					new sap.ui.model.Filter("Plnal", "EQ", ''),
					new sap.ui.model.Filter("Plnnr", "EQ", p.PlnnrMi),
					new sap.ui.model.Filter("Strat", "EQ", tempStrat)
				];
				var oModel = g.getView().getModel("valueHelp");
				var fnSuccess = function (h) {
					var oModelData;
					if (p.PlntyMi === "A" && sap.ui.getCore().getModel("AIWListGTLModel")) {
						oModelData = sap.ui.getCore().getModel("AIWListGTLModel").getData();
						if (oModelData.length > 0) {
							for (var i = 0; i < oModelData.length; i++) {
								if (oModelData[i].grp === p.PlnnrMi) {
									for (var j = 0; j < oModelData[i].header.length; j++) {
										var sObj = {
											Plnty: p.PlntyMi,
											Plnnr: oModelData[i].grp,
											Plnal: oModelData[i].header[j].Plnal,
											Ktext: oModelData[i].header[j].Ktext,
										};
										h.results.unshift(sObj);
									}
								}
							}
						}
					} else if (p.PlntyMi === "E" && sap.ui.getCore().getModel("AIWListETLModel")) {
						oModelData = sap.ui.getCore().getModel("AIWListETLModel").getData();
						if (oModelData.length > 0) {
							for (var i = 0; i < oModelData.length; i++) {
								if (oModelData[i].equipment === p.Equnr && oModelData[i].grp === p.PlnnrMi) {
									for (var j = 0; j < oModelData[i].header.length; j++) {
										var sObj = {
											Plnty: p.PlntyMi,
											Plnnr: oModelData[i].grp,
											Plnal: oModelData[i].header[j].Plnal,
											Ktext: oModelData[i].header[j].Ktext,
										};
										h.results.unshift(sObj);
									}
								}
							}
						}
					} else if (p.PlntyMi === "T" && sap.ui.getCore().getModel("AIWListFTLModel")) {
						oModelData = sap.ui.getCore().getModel("AIWListFTLModel").getData();
						if (oModelData.length > 0) {
							for (var i = 0; i < oModelData.length; i++) {
								if (oModelData[i].floc === p.Tplnr && oModelData[i].grp === p.PlnnrMi) {
									for (var j = 0; j < oModelData[i].header.length; j++) {
										var sObj = {
											Plnty: p.PlntyMi,
											Plnnr: oModelData[i].grp,
											Plnal: oModelData[i].header[j].Plnal,
											Ktext: oModelData[i].header[j].Ktext,
										};
										h.results.unshift(sObj);
									}
								}
							}
						}
					}
					if (h.results.length > 0) {
						var I = new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Plnty}"
								}),
								new sap.m.Text({
									text: "{Plnnr}"
								}),
								new sap.m.Text({
									text: "{Plnal}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								})
							]
						});
						var e = new sap.ui.model.json.JSONModel();
						e.setData(h);
						tlGrpSelectDialog.setModel(e);
						tlGrpSelectDialog.bindAggregation("items", "/results", I);
					} else {
						tlGrpSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
					}
				};
				var fnError = function () {};
				g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				tlGrpSelectDialog.open();
				tlGrpSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeTLType: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				oJsonData.PlnnrMi = "";
				oJsonData.PlnalMi = "";
				oJsonData.Gpcounterdesc = "";
				var c = oJsonData.PlntyMi;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/MPTlTypeSet";
					var oFilters = [new sap.ui.model.Filter("Equnr", "EQ", oJsonData.Equnr),
						new sap.ui.model.Filter("Tplnr", "EQ", oJsonData.Tplnr),
						new sap.ui.model.Filter("Plnty", "EQ", a)
					];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.PlntyMi = a;
							oJsonData.PlntyMiState = "None";
						} else {
							oJsonData.PlntyMi = "";
							oJsonData.PlnnrMi = "";
							oJsonData.PlnalMi = "";
							oJsonData.PlntyMiState = "Error";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.PlntyMi = a;
					oJsonModel.setData(oJsonData);
				}
			},

			_changeTLGroup: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.PlnnrMi;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var tempStrat = "";
					if (g.strategy !== "Blank") {
						tempStrat = g.strategy;
					}
					var sPath = "/MPTListSet";
					var oFilters = [new sap.ui.model.Filter("Equnr", "EQ", oJsonData.Equnr),
						new sap.ui.model.Filter("Tplnr", "EQ", oJsonData.Tplnr),
						new sap.ui.model.Filter("Plnty", "EQ", oJsonData.PlntyMi),
						new sap.ui.model.Filter("Werks", "EQ", oJsonData.Werks),
						new sap.ui.model.Filter("Plnal", "EQ", ''),
						new sap.ui.model.Filter("Plnnr", "EQ", a),
						new sap.ui.model.Filter("Strat", "EQ", tempStrat)
					];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						var oModelData;
						if (d.results.length > 0) {
							oJsonData.PlnnrMi = a;
							oJsonData.PlnnrMiState = "None";
							oJsonData.PlntyMi = d.results[0].Plnty;
							oJsonData.PlnalMi = d.results[0].Plnal;
							oJsonData.Gpcounterdesc = d.results[0].Ktext;
						} else if (oJsonData.PlntyMi === "A" && sap.ui.getCore().getModel("AIWListGTLModel")) {
							oModelData = sap.ui.getCore().getModel("AIWListGTLModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].grp === a) {
										for (var j = 0; j < oModelData[i].header.length; j++) {
											oJsonData.PlnnrMi = a;
											oJsonData.PlnnrMiState = "None";
											oJsonData.PlntyMi = oModelData[i].header[j].Plnty;
											oJsonData.PlnalMi = oModelData[i].header[j].Plnal;
											oJsonData.Gpcounterdesc = oModelData[i].header[j].Ktext;
										}
									}
								}
							}
						} else if (oJsonData.PlntyMi === "E" && sap.ui.getCore().getModel("AIWListETLModel")) {
							oModelData = sap.ui.getCore().getModel("AIWListETLModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].equipment === oJsonData.Equnr && oModelData[i].grp === a) {
										for (var j = 0; j < oModelData[i].header.length; j++) {
											oJsonData.PlnnrMi = a;
											oJsonData.PlnnrMiState = "None";
											oJsonData.PlntyMi = oModelData[i].header[j].Plnty;
											oJsonData.PlnalMi = oModelData[i].header[j].Plnal;
											oJsonData.Gpcounterdesc = oModelData[i].header[j].Ktext;
										}
									}
								}
							}
						} else if (oJsonData.PlntyMi === "T" && sap.ui.getCore().getModel("AIWListFTLModel")) {
							oModelData = sap.ui.getCore().getModel("AIWListFTLModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].floc === oJsonData.Tplnr && oModelData[i].grp === a) {
										for (var j = 0; j < oModelData[i].header.length; j++) {
											oJsonData.PlnnrMi = a;
											oJsonData.PlnnrMiState = "None";
											oJsonData.PlntyMi = oModelData[i].header[j].Plnty;
											oJsonData.PlnalMi = oModelData[i].header[j].Plnal;
											oJsonData.Gpcounterdesc = oModelData[i].header[j].Ktext;
										}
									}
								}
							}
						} else {
							oJsonData.PlnnrMi = "";
							oJsonData.PlnnrMiState = "Error";
							oJsonData.PlnalMi = "";
							oJsonData.Gpcounterdesc = "";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.PlnnrMi = a;
					oJsonModel.setData(oJsonData);
				}
			},

			_changeTLCounter: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.PlnalMi;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var tempStrat = "";
					if (g.strategy !== "Blank") {
						tempStrat = g.strategy;
					}
					var sPath = "/MPTListSet";
					var oFilters = [new sap.ui.model.Filter("Equnr", "EQ", oJsonData.Equnr),
						new sap.ui.model.Filter("Tplnr", "EQ", oJsonData.Tplnr),
						new sap.ui.model.Filter("Plnty", "EQ", oJsonData.PlntyMi),
						new sap.ui.model.Filter("Werks", "EQ", oJsonData.Werks),
						new sap.ui.model.Filter("Plnal", "EQ", a),
						new sap.ui.model.Filter("Plnnr", "EQ", oJsonData.PlnnrMi),
						new sap.ui.model.Filter("Strat", "EQ", tempStrat)
					];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						var oModelData;
						if (d.results.length > 0) {
							oJsonData.PlnalMi = a;
							oJsonData.PlnalMiState = "None";
							oJsonData.PlntyMi = d.results[0].Plnty;
							oJsonData.PlnnrMi = d.results[0].Plnnr;
							oJsonData.Gpcounterdesc = d.results[0].Ktext;
						} else if (oJsonData.PlntyMi === "A" && sap.ui.getCore().getModel("AIWListGTLModel")) {
							oModelData = sap.ui.getCore().getModel("AIWListGTLModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].grp === oJsonData.PlnnrMi) {
										for (var j = 0; j < oModelData[i].header.length; j++) {
											if (oModelData[i].header[j].Plnal === a) {
												oJsonData.PlnalMiState = "None";
												oJsonData.PlnalMi = a;
												oJsonData.Gpcounterdesc = oModelData[i].header[j].Ktext;
												oJsonData.PlntyMi = oModelData[i].header[j].Plnty;
												oJsonData.PlnnrMi = oModelData[i].header[j].Plnnr;
											}
										}
									}
								}
							}
						} else if (oJsonData.PlntyMi === "E" && sap.ui.getCore().getModel("AIWListETLModel")) {
							oModelData = sap.ui.getCore().getModel("AIWListETLModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].equipment === oJsonData.Equnr && oModelData[i].grp === oJsonData.PlnnrMi) {
										for (var j = 0; j < oModelData[i].header.length; j++) {
											if (oModelData[i].header[j].Plnal === a) {
												oJsonData.PlnalMiState = "None";
												oJsonData.PlnalMi = oModelData[i].header[j].Plnal;
												oJsonData.Gpcounterdesc = oModelData[i].header[j].Ktext;
												oJsonData.PlntyMi = oModelData[i].header[j].Plnty;
												oJsonData.PlnnrMi = oModelData[i].header[j].Plnnr;
											}
										}
									}
								}
							}
						} else if (oJsonData.PlntyMi === "T" && sap.ui.getCore().getModel("AIWListFTLModel")) {
							oModelData = sap.ui.getCore().getModel("AIWListFTLModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].floc === oJsonData.Tplnr && oModelData[i].grp === oJsonData.PlnnrMi) {
										for (var j = 0; j < oModelData[i].header.length; j++) {
											if (oModelData[i].header[j].Plnal === a) {
												oJsonData.PlnalMiState = "None";
												oJsonData.PlnalMi = oModelData[i].header[j].Plnal;
												oJsonData.Gpcounterdesc = oModelData[i].header[j].Ktext;
												oJsonData.PlntyMi = oModelData[i].header[j].Plnty;
												oJsonData.PlnnrMi = oModelData[i].header[j].Plnnr;
											}
										}
									}
								}
							}
						} else {
							oJsonData.PlnalMi = "";
							oJsonData.PlnalMiState = "Error";
							oJsonData.Gpcounterdesc = "";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
						oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.PlnalMi = a;
					oJsonModel.setData(oJsonData);
				}
			},

			networkLrpVH: function (c, g) {
				var AIWLAM = g.lam.getModel("AIWLAM");
				var aLam = AIWLAM.getData();

				var settings = {
					title: g.getView().getModel("i18n").getProperty("LRP"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/NWLRPSet",
						template: new sap.m.StandardListItem({
							title: "{LRPID}",
							description: "{LRP_TXT}"
						})
					},
					confirm: function (E) {
						aLam.lam.Lrpid = E.getParameters().selectedItem.getProperty("title");
						aLam.lam.LrpidDesc = E.getParameters().selectedItem.getProperty("description");
						aLam.lam.LrpidVS = "None";
						aLam.lam.enableMarker = true;
						aLam.lam.LamDer = "C";
						var oMessageList = [];
						if (aLam.lam.Startmrkr != "" && aLam.lam.Endmrkr != "") {
							aLam.lam.StartmrkrVS = "Error";
							aLam.lam.EndmrkrVS = "Error";
							oMessageList.push({
								type: "Error",
								title: "Enter a valid start marker and end marker for LRP " + aLam.lam.Lrpid
							});
						} else if (aLam.lam.Startmrkr != "") {
							aLam.lam.StartmrkrVS = "Error";
							oMessageList.push({
								type: "Error",
								title: "Enter a valid start marker for LRP " + aLam.lam.Lrpid
							});
						} else if (aLam.lam.Endmrkr != "") {
							aLam.lam.EndmrkrVS = "Error";
							oMessageList.push({
								type: "Error",
								title: "Enter a valid start marker for LRP " + aLam.lam.Lrpid
							});
						}
						AIWLAM.setData(aLam);
						if (oMessageList.length > 0) {
							g.createMessagePopover(oMessageList, false);
						} else {
							g.calculateLAM();
						}
					}
				};

				var q = "/NWLRPSet";
				var M = g.getView().getModel("valueHelp");
				var nLrpSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "LRPID", "LRP_TXT");
				nLrpSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				nLrpSelectDialog.open();
			},

			_LRPChange: function (c, g) {
				var AIWLAM = g.lam.getModel("AIWLAM");
				var aLam = AIWLAM.getData();
				var s = c.getSource().getValue();
				s = s.toUpperCase();
				var a = s.replace(/^[ ]+|[ ]+$/g, '');
				if (a != "") {
					var oFilter = [new sap.ui.model.Filter("LRPID", "EQ", a)];
					var q = "/NWLRPSet";
					var m = g.getView().getModel("valueHelp");
					m.read(q, {
						filters: oFilter,
						success: function (d, e) {
							if (d.results.length > 0) {
								aLam.lam.Lrpid = a;
								aLam.lam.LrpidDesc = d.results[0].LRP_TXT;
								aLam.lam.LrpidVS = "None";
								aLam.lam.enableMarker = true;
								aLam.lam.LamDer = "C";
								var oMessageList = [];
								if (aLam.lam.Startmrkr != "" && aLam.lam.Endmrkr != "") {
									aLam.lam.StartmrkrVS = "Error";
									aLam.lam.EndmrkrVS = "Error";
									oMessageList.push({
										type: "Error",
										title: "Enter a valid start marker and end marker for LRP " + aLam.lam.Lrpid
									});
								} else if (aLam.lam.Startmrkr != "") {
									aLam.lam.StartmrkrVS = "Error";
									oMessageList.push({
										type: "Error",
										title: "Enter a valid start marker for LRP " + aLam.lam.Lrpid
									});
								} else if (aLam.lam.Endmrkr != "") {
									aLam.lam.EndmrkrVS = "Error";
									oMessageList.push({
										type: "Error",
										title: "Enter a valid start marker for LRP " + aLam.lam.Lrpid
									});
								}
								AIWLAM.setData(aLam);
								if (oMessageList.length > 0) {
									g.createMessagePopover(oMessageList, false);
								} else {
									g.calculateLAM();
								}
							} else {
								aLam.lam.Lrpid = "";
								aLam.lam.LrpidVS = "Error";
								aLam.lam.LrpidDesc = "";
								AIWLAM.setData(aLam);
							}
						},
						error: function (e) {
							aLam.lam.Lrpid = "";
							aLam.lam.LrpidVS = "Error";
							aLam.lam.LrpidDesc = "";
							AIWLAM.setData(aLam);
							var b = JSON.parse(e.response.body);
							var d = b.error.message.value;
							g.invokeMessage(d);
						}
					});
				} else {
					aLam.lam.Lrpid = "";
					aLam.lam.LrpidDesc = "";
					aLam.lam.LrpidVS = "None";
				}
			},

			lengthCheck: function (g) {
				var l;
				var AIWLAM = g.lam.getModel("AIWLAM");
				var aLam = AIWLAM.getData();
				if (aLam.lam.Length === "0" || aLam.lam.Length === "") {
					var sp = aLam.lam.Strtptatr;
					var ep = aLam.lam.Endptatr;
					var temp, stTemp;
					if (ep !== "" && sp !== "") {
						temp = parseFloat(ep);
						stTemp = parseFloat(sp);
						if (ep.indexOf("+") > -1) {
							temp = ep.split("+");
							temp = +parseFloat(temp[1]);
						}
						if (ep.indexOf("-") > -1) {
							temp = ep.split("-");
							temp = -parseFloat(temp[1]);
						}
						if (sp.indexOf("+") > -1) {
							stTemp = sp.split("+");
							stTemp = +parseFloat(stTemp[1]);
						}
						if (sp.indexOf("-") > -1) {
							stTemp = sp.split("-");
							stTemp = -parseFloat(stTemp[1]);
						}
						l = temp - stTemp;
						// aLam.lam.Strtptatr = oNumberFormat.format(stTemp);
						// aLam.lam.Endptatr = oNumberFormat.format(temp);
					} else if (ep === "" && sp === "") {
						l = 0;
					} else if (ep === "" && sp !== "") {
						if (sp.indexOf("+") > -1) {
							stTemp = sp.split("+");
							stTemp = +parseFloat(stTemp[1]);
						}
						if (sp.indexOf("-") > -1) {
							stTemp = sp.split("-");
							stTemp = -parseFloat(stTemp[1]);
						}
						// aLam.lam.Strtptatr = oNumberFormat.format(stTemp);
						l = stTemp - 0;
					} else if (ep !== "" && sp === "") {
						if (ep.indexOf("+") > -1) {
							temp = ep.split("+");
							temp = +parseFloat(temp[1]);
						}
						if (ep.indexOf("-") > -1) {
							temp = ep.split("-");
							temp = -parseFloat(temp[1]);
						}
						// aLam.lam.Endptatr = oNumberFormat.format(temp);
						l = 0 - temp;
					}
					// var x = oNumberFormat.format(l);
					// aLam.lam.Length = x.toString();
					aLam.lam.Length = l.toString();
					AIWLAM.setData(aLam);
				}
			},

			lamUOMVH: function (p, c, g) {
				var AIWLAM = g.lam.getModel("AIWLAM");
				var aLam = AIWLAM.getData();

				var settings = {
					title: g.getView().getModel("i18n").getProperty("UOM"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>COMMERCIAL}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>INTMEASUNIT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",

							header: [
								new sap.m.Text({
									text: "{i18n>UNITTXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>DIMSNTXT}"
								})
							]
						})
					],
					items: {
						path: "/LAMuomSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Mseh3}"
								}),
								new sap.m.Text({
									text: "{Msehi}"
								}),
								new sap.m.Text({
									text: "{Msehl}"
								}),
								new sap.m.Text({
									text: "{Txdim}"
								})
							]
						})

					},
					confirm: function (E) {
						if (p === "uom") {
							aLam.lam.LinUnit = E.getParameter("selectedItem").getCells()[1].getText();
							aLam.lam.LinUnitDesc = E.getParameter("selectedItem").getCells()[2].getText();
						} else if (p === "mrkrDistUnit") {
							aLam.lam.MrkrUnit = E.getParameter("selectedItem").getCells()[1].getText();
						}
						aLam.lam.LamDer = "C";
						AIWLAM.setData(aLam);
						g.calculateLAM();
					}
				};
				var sPath = "/LAMuomSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Mseh3}"
					}),
					new sap.m.Text({
						text: "{Msehi}"
					}),
					new sap.m.Text({
						text: "{Msehl}"
					}),
					new sap.m.Text({
						text: "{Txdim}"
					})
				];

				var uSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Msehi", "Msehl");
				uSelectDialog.open();
				uSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_uomMarkerDistUnitChange: function (p, c, g) {
				var lc = this;
				var AIWLAM = g.lam.getModel("AIWLAM");
				var aLam = AIWLAM.getData();
				var s = c.getSource().getValue();
				s = s.toUpperCase();
				var a = s.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var oFilter = [new sap.ui.model.Filter("Msehi", "EQ", a)];
					var q = "/LAMuomSet";
					var m = g.getView().getModel("valueHelp");
					m.read(q, {
						filters: oFilter,
						success: function (d, e) {
							if (d.results.length > 0) {
								if (p === "uom") {
									aLam.lam.LinUnit = a;
									aLam.lam.LinUnitDesc = d.results[0].Msehl;
									aLam.lam.LinUnitVS = "None";
								} else if (p === "mrkrDistUnit") {
									aLam.lam.MrkrUnit = a;
									aLam.lam.MrkrUnitVS = "None";
								}
								aLam.lam.LamDer = "C";
								AIWLAM.setData(aLam);
								g.calculateLAM();
							} else {
								if (p === "uom") {
									aLam.lam.LinUnitDesc = "";
									aLam.lam.LinUnitVS = "Error";
								} else if (p === "mrkrDistUnit") {
									aLam.lam.MrkrUnitVS = "Error";
								}
							}
						},
						error: function (e) {
							if (p === "uom") {
								aLam.lam.LinUnitDesc = "";
								aLam.lam.LinUnitVS = "Error";
							} else if (p === "mrkrDistUnit") {
								aLam.lam.MrkrUnitVS = "Error";
							}
							var b = JSON.parse(e.response.body);
							var d = b.error.message.value;
						}
					});
				}
			},

			EquipmentSelectDialog: function (g) {
				var Dialog = new sap.m.SelectDialog({
					title: "{i18n>EQUI_TXT}",
					noDataText: "{i18n>LOAD}" + "...",
					confirm: g.handleEquimentConfirm,
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
				var M = this.getF4Model(g);
				M.read(q, {
					success: function (h, E) {
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
						if (h.results.length > 0) {
							//gC.plantSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Equnr}",
								description: "{Eqktx}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							e.isSizeLimit = h.results.length;
							e.setSizeLimit(h.results.length);
							Dialog.setModel(e);
							Dialog.setGrowingThreshold(h.results.length);
							Dialog.bindAggregation("items", "/results", I);
						} else {
							Dialog.setNoDataText(Dialog.getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
				return Dialog;
			},

			FLocSelectDialog: function (g) {
				//var gC = g;
				var Dialog = new sap.m.SelectDialog({
					title: "{i18n>FUNLOC_TXT}",
					noDataText: "{i18n>LOAD}" + "...",
					confirm: g.handleFLocConfirm,
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

				var q = "/FunctionLocationSet";
				var M = this.getF4Model(g);
				M.read(q, {
					success: function (h, E) {
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
						if (h.results.length > 0) {
							//gC.plantSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Tplnr}",
								description: "{Pltxt}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							e.isSizeLimit = h.results.length;
							e.setSizeLimit(h.results.length);
							Dialog.setModel(e);
							Dialog.setGrowingThreshold(h.results.length);
							Dialog.bindAggregation("items", "/results", I);
						} else {
							Dialog.setNoDataText(Dialog.getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
				return Dialog;
			},

			getF4Model: function (g) {
				this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(g.getView()));
				// var serviceUrl = this._oComponent.getModel("NewModel").sServiceUrl;
				// var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
				// 	json: true,
				// 	useBatch: false,
				// 	defaultCountMode: sap.ui.model.odata.CountMode.None
				// });

				var vhModel = this._oComponent.getModel("NewModel");

				return vhModel;
			},

			CityAddrVH: function (p, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("CITY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY_EXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>RGIN}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CNTRY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY_NUM}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LANGUAGE}"
								})
							]
						})
					],
					items: {
						path: "/CitySet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{CityName}"
								}),
								new sap.m.Text({
									text: "{CityExt}"
								}),
								new sap.m.Text({
									text: "{Region}"
								}),
								new sap.m.Text({
									text: "{Country}"
								}),
								new sap.m.Text({
									text: "{CityCode}"
								}),
								new sap.m.Text({
									text: "{CityName}"
								}),
								new sap.m.Text({
									text: "{Langu}"
								})
							]
						})
					},
					confirm: function (E) {
						p.City1 = E.getParameter("selectedItem").getCells()[0].getText();
						p.PostCod1 = E.getParameter("selectedItem").getBindingContext().getObject().PostCode;
						p.Region = E.getParameter("selectedItem").getBindingContext().getObject().Region;
						p.RegionDesc = E.getParameter("selectedItem").getBindingContext().getObject().Regiotxt;
						p.RefPosta = E.getParameter("selectedItem").getBindingContext().getObject().Country;
						p.Landx = E.getParameter("selectedItem").getBindingContext().getObject().Landx;
						p.TimeZone = E.getParameter("selectedItem").getBindingContext().getObject().TimeZone;
						p.City1VS = "None";
						p.PostCod1VS = "None";
						p.RegionVS = "None";
						p.RefPostaVS = "None";
						p.TimeZoneVS = "None";
						g.getView().getModel(g.oModelName).refresh();
						// oSource.setValue(E.getParameter("selectedItem").getCells()[0].getText());
						// oSource.setValueState("None");
						// // oSource.setValueStateText("");
						// oJsonModel.refresh();
					}
				};

				var sPath = "/CitySet";
				var oFilters = [new sap.ui.model.Filter("Country", "EQ", p.RefPosta)];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{CityName}"
					}),
					new sap.m.Text({
						text: "{CityExt}"
					}),
					new sap.m.Text({
						text: "{Region}"
					}),
					new sap.m.Text({
						text: "{Country}"
					}),
					new sap.m.Text({
						text: "{CityCode}"
					}),
					new sap.m.Text({
						text: "{CityName}"
					}),
					new sap.m.Text({
						text: "{Langu}"
					})
				];

				var citySelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "CityName", "CityCode");
				citySelectDialog.open();
				citySelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},
			_changeCityAddr: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonData.City1;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/CitySet";
					var oFilters = [new sap.ui.model.Filter("CityName", "EQ", a), new sap.ui.model.Filter("Country", "EQ", oJsonData.RefPosta)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonData.City1 = d.results[0].CityName;
							oJsonData.PostCod1 = d.results[0].PostCode;
							oJsonData.Region = d.results[0].Region;
							oJsonData.RegionDesc = d.results[0].Regiotxt;
							oJsonData.RefPosta = d.results[0].Country;
							oJsonData.Landx = d.results[0].Landx;
							oJsonData.TimeZone = d.results[0].TimeZone;
							oJsonData.City1VS = "None";
							oJsonData.PostCod1VS = "None";
							oJsonData.RegionVS = "None";
							oJsonData.RefPostaVS = "None";
							oJsonData.TimeZoneVS = "None";
							// oJsonData.City1i = d.results[0].CityName;
							// oJsonData.City1iVS = "None";
							// oSource.setValue(d.results[0].CityName);
							// oSource.setValueState("None");
							// oSource.setValueStateText("");
						} else {
							// oJsonData.City1i = "";
							// oJsonData.City1iVS = "Error";
							oJsonData.City1VS = "Error";
							// oSource.setValue();
							// oSource.setValueState("Error");
							// oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						// oJsonData.City1iVS = "Error";
						oJsonData.City1VS = "Error";
						oJsonModel.setData(oJsonData);
						// oSource.setValueState("Error");
						// oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.City1VS = "None";
					oJsonModel.setData(oJsonData);
				}
			},

			streetVH: function (p, g) {
				var oSource = p.getSource();
				var sBindPath = oSource.getBindingInfo("value").binding.getContext().sPath;
				var oJsonModel = g.getView().getModel(g.oModelName);
				var settings = {
					title: g.getView().getModel("i18n").getProperty("STREET"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>STREET}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY_EXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>RGIN}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LANGUAGE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CNTRY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>STREET_NUM}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>STREET}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY_NUM}"
								})
							]
						})
					],
					items: {
						path: "/StrtNameSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Street}"
								}),
								new sap.m.Text({
									text: "{CityName}"
								}),
								new sap.m.Text({
									text: "{CityExt}"
								}),
								new sap.m.Text({
									text: "{Region}"
								}),
								new sap.m.Text({
									text: "{Langu}"
								}),
								new sap.m.Text({
									text: "{Country}"
								}),
								new sap.m.Text({
									text: "{StrtCode}"
								}),
								new sap.m.Text({
									text: "{McStreet}"
								}),
								new sap.m.Text({
									text: "{CityCode}"
								})
							]
						})
					},
					confirm: function (E) {
						oJsonModel.getProperty(sBindPath).Streeti = E.getParameter("selectedItem").getCells()[0].getText();
						oJsonModel.getProperty(sBindPath).StreetiVS = "None";
						oJsonModel.getProperty(sBindPath).City1i = E.getParameter("selectedItem").getCells()[1].getText();
						oJsonModel.getProperty(sBindPath).City1iVS = "None";
						// oSource.setValue(E.getParameter("selectedItem").getCells()[0].getText());
						oSource.setValueState("None");
						// oSource.setValueStateText("");
						oJsonModel.refresh();
					}
				};

				var sPath = "/StrtNameSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Street}"
					}),
					new sap.m.Text({
						text: "{CityName}"
					}),
					new sap.m.Text({
						text: "{CityExt}"
					}),
					new sap.m.Text({
						text: "{Region}"
					}),
					new sap.m.Text({
						text: "{Langu}"
					}),
					new sap.m.Text({
						text: "{Country}"
					}),
					new sap.m.Text({
						text: "{StrtCode}"
					}),
					new sap.m.Text({
						text: "{McStreet}"
					}),
					new sap.m.Text({
						text: "{CityCode}"
					})
				];

				var strtSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Street", "StrtCode");
				strtSelectDialog.open();
				strtSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			cityVH: function (p, g) {
				var oSource = p.getSource();
				var sBindPath = oSource.getBindingInfo("value").binding.getContext().sPath;
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("CITY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY_EXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>RGIN}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CNTRY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY_NUM}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LANGUAGE}"
								})
							]
						})
					],
					items: {
						path: "/CitySet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{CityName}"
								}),
								new sap.m.Text({
									text: "{CityExt}"
								}),
								new sap.m.Text({
									text: "{Region}"
								}),
								new sap.m.Text({
									text: "{Country}"
								}),
								new sap.m.Text({
									text: "{CityCode}"
								}),
								new sap.m.Text({
									text: "{CityName}"
								}),
								new sap.m.Text({
									text: "{Langu}"
								})
							]
						})
					},
					confirm: function (E) {
						oJsonModel.getProperty(sBindPath).City1i = E.getParameter("selectedItem").getCells()[0].getText();
						oJsonModel.getProperty(sBindPath).City1iVS = "None";
						// oSource.setValue(E.getParameter("selectedItem").getCells()[0].getText());
						oSource.setValueState("None");
						// oSource.setValueStateText("");
						oJsonModel.refresh();
					}
				};

				var sPath = "/CitySet";
				// var oFilters = [];
				var oFilters = [new sap.ui.model.Filter("Country", "EQ", oJsonData.RefPosta)];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{CityName}"
					}),
					new sap.m.Text({
						text: "{CityExt}"
					}),
					new sap.m.Text({
						text: "{Region}"
					}),
					new sap.m.Text({
						text: "{Country}"
					}),
					new sap.m.Text({
						text: "{CityCode}"
					}),
					new sap.m.Text({
						text: "{CityName}"
					}),
					new sap.m.Text({
						text: "{Langu}"
					})
				];

				var citySelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "CityName", "CityCode");
				citySelectDialog.open();
				citySelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeStreetI: function (f, g) {
				var oSource = f.getSource();
				var sBindPath = oSource.getBindingInfo("value").binding.getContext().sPath;
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonModel.getProperty(sBindPath).Streeti;
				// var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/StrtNameSet";
					var oFilters = [new sap.ui.model.Filter("Street", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonModel.getProperty(sBindPath).Streeti = d.results[0].Street;
							oJsonModel.getProperty(sBindPath).StreetiVS = "None";
							oJsonModel.getProperty(sBindPath).City1i = d.results[0].CityName;
							oJsonModel.getProperty(sBindPath).City1iVS = "None";
							// oJsonData.Streeti = d.results[0].Street;
							// oJsonData.StreetiVS = "None";
							// oSource.setValue(d.results[0].Street);
							oSource.setValueState("None");
							// oSource.setValueStateText("");
						} else {
							// oJsonData.Streeti = "";
							oJsonModel.getProperty(sBindPath).StreetiVS = "Error";
							oJsonData.StreetiVS = "Error";
							// oSource.setValue();
							// oSource.setValueState("Error");
							// oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						// oJsonData.StreetiVS = "Error";
						oJsonModel.getProperty(sBindPath).StreetiVS = "Error";
						oJsonModel.setData(oJsonData);
						oSource.setValueState("Error");
						// oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonModel.getProperty(sBindPath).StreetiVS = "None";
					oJsonModel.setData(oJsonData);
				}
			},

			_changeCityI: function (f, g) {
				var oSource = f.getSource();
				var sBindPath = oSource.getBindingInfo("value").binding.getContext().sPath;
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonModel.getProperty(sBindPath).City1i;
				// var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/CitySet";
					var oFilters = [new sap.ui.model.Filter("CityName", "EQ", a), new sap.ui.model.Filter("Country", "EQ", oJsonData.RefPosta)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonModel.getProperty(sBindPath).City1i = d.results[0].CityName;
							oJsonModel.getProperty(sBindPath).City1iVS = "None";
							// oJsonData.City1i = d.results[0].CityName;
							// oJsonData.City1iVS = "None";
							// oSource.setValue(d.results[0].CityName);
							oSource.setValueState("None");
							// oSource.setValueStateText("");
						} else {
							// oJsonData.City1i = "";
							// oJsonData.City1iVS = "Error";
							oJsonModel.getProperty(sBindPath).City1iVS = "Error";
							// oSource.setValue();
							oSource.setValueState("Error");
							// oSource.setValueStateText("Invalid Entry");
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						// oJsonData.City1iVS = "Error";
						oJsonModel.getProperty(sBindPath).City1iVS = "Error";
						oJsonModel.setData(oJsonData);
						oSource.setValueState("Error");
						// oSource.setValueStateText(d);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonModel.getProperty(sBindPath).City1iVS = "None";
					oJsonModel.setData(oJsonData);
				}
			},

			handleImportToMocr: function (g) {
				var existFlag = false;
				var oMessageList = [];
				var successCount = 0;
				var AIWModel;
				AIWModel = sap.ui.getCore().getModel(g.oSearchModelName).getData();
				var searchData = g.getView().byId("searchResults").getModel().getData();

				if (g.selectedIndices.length > 0) {
					for (var i = 0; i < g.selectedIndices.length; i++) {
						var index = g.selectedIndices[i].split("/")[1];
						index = parseInt(index);

						if (searchData[index].UsmdActive && searchData[index].UsmdActive === "1") { //CrStatus
							if (g.oSearchModelName === "AIWEQUI") {
								oMessageList.push({
									type: "Error",
									title: searchData[index].Message, //"Equipment " + searchData[index].Equi + " already locked in the Change Request",
									message: searchData[index].Message, //"Equipment " + searchData[index].Equi + " already locked in the Change Request"
								});
							}
							if (g.oSearchModelName === "AIWFLOC") {
								oMessageList.push({
									type: "Error",
									title: searchData[index].Message, //"Functional Location " + searchData[index].Funcloc + " already locked in the Change Request",
									message: searchData[index].Message //"Functional Location " + searchData[index].Funcloc + " already locked in the Change Request"
								});
							}
							if (g.oSearchModelName === "AIWMSPT") {
								oMessageList.push({
									type: "Error",
									title: searchData[index].Message, //"Measuring Point " + searchData[index].Mspoint + " already locked in the Change Request",
									message: searchData[index].Message //"Measuring Point " + searchData[index].Mspoint + " already locked in the Change Request"
								});
							}
							if (g.oSearchModelName === "AIWMPMI") {
								oMessageList.push({
									type: "Error",
									title: searchData[index].Message, //"Maintenance Plan " + searchData[index].Mplan + " already locked in the Change Request",
									message: searchData[index].Message //"Maintenance Plan " + searchData[index].Mplan + " already locked in the Change Request"
								});
							}
							continue;
						}
						if (AIWModel.length > 0) {
							for (var j = 0; j < AIWModel.length; j++) {
								if (g.oSearchModelName === "AIWEQUI") {
									if (AIWModel[j].Equnr === searchData[index].Equi) {
										oMessageList.push({
											type: "Error",
											title: "Equipment " + searchData[index].Equi + g.getResourceBundle().getText("locked"),
											message: "Equipment " + searchData[index].Equi + g.getResourceBundle().getText("locked")
										});
										existFlag = true;
										break;
									}
								}
								if (g.oSearchModelName === "AIWFLOC") {
									if (AIWModel[j].Functionallocation === searchData[index].Funcloc) {
										oMessageList.push({
											type: "Error",
											title: "Functional Location " + searchData[index].Funcloc + g.getResourceBundle().getText("locked"),
											message: "Functional Location " + searchData[index].Funcloc + g.getResourceBundle().getText("locked")
										});
										existFlag = true;
										break;
									}
								}
								if (g.oSearchModelName === "AIWMSPT") {
									if (AIWModel[j].Mspoint === searchData[index].Mspoint) {
										oMessageList.push({
											type: "Error",
											title: "Measuring Point " + searchData[index].Mspoint + g.getResourceBundle().getText("locked"),
											message: "Measuring Point " + searchData[index].Mspoint + g.getResourceBundle().getText("locked")
										});
										existFlag = true;
										break;
									}
								}
								if (g.oSearchModelName === "AIWMPMI") {
									if (AIWModel[j].Warpl === searchData[index].Mplan) {
										oMessageList.push({
											type: "Error",
											title: "Maintenance Plan " + searchData[index].Mplan + g.getResourceBundle().getText("locked"),
											message: "Maintenance Plan " + searchData[index].Mplan + g.getResourceBundle().getText("locked")
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

							if (g.oSearchModelName === "AIWEQUI") {
								g.readEquipmentData(searchData[index].Equi);
							}
							if (g.oSearchModelName === "AIWFLOC") {
								g.readFunctionalLocData(searchData[index].Funcloc);
							}
							if (g.oSearchModelName === "AIWMSPT") {
								g.readMeasuringPointData(searchData[index].Mspoint);
							}
							if (g.oSearchModelName === "AIWMPMI") {
								g.readMaintenancePlanData(searchData[index].Mplan);
							}
						}
					}
					g.createMessagePopover(oMessageList, successCount);
				}
			},

			///////////////////// Functional Location : Alternate Labels /////////////////////////////
			LblSysVH: function (p, g) {
				var oModel = p.getSource().getModel(g.oModelName);
				var sBindPath = p.getSource().getBindingInfo("value").binding.getContext().sPath;;
				var settings = {
					title: g.getView().getModel("i18n").getProperty("LBLSYS_TXT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/AltlabelVHSet",
						template: new sap.m.StandardListItem({
							title: "{Alkey}",
							description: "{Altxt}"
						})
					},
					confirm: function (E) {
						oModel.getProperty(sBindPath).AltAlkey = E.getParameters().selectedItem.getProperty("title");
						oModel.getProperty(sBindPath).Altxt = E.getParameters().selectedItem.getProperty("description");
						oModel.getProperty(sBindPath).LblSysVS = "None";
						oModel.refresh();
						g.validateLabelSystem(sBindPath, oModel.getData());
					}
				};

				var q = "/AltlabelVHSet";
				var M = g.getView().getModel("valueHelp");
				var LblSysSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Alkey", "Altxt");
				LblSysSelectDialog.open();
			},

			StrIndAltLblVH: function (p, g) {
				var oModel = p.getSource().getModel(g.oModelName);
				var sBindPath = p.getSource().getBindingInfo("value").binding.getContext().sPath;;
				var settings = {
					title: g.getView().getModel("i18n").getProperty("STR_IND"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/StrucIndicatorValueHelpSet",
						template: new sap.m.StandardListItem({
							title: "{StrucIndicator}",
							description: "{StrucIndicatorDesc}"
						})
					},
					confirm: function (E) {
						var pth = E.getParameter("selectedItem").getBindingContextPath();
						var mdl = E.getSource().getModel();
						oModel.getProperty(sBindPath).AltTplkz = E.getParameters().selectedItem.getProperty("title");
						oModel.getProperty(sBindPath).Tplxt = E.getParameters().selectedItem.getProperty("description");
						oModel.getProperty(sBindPath).Name1i = mdl.getProperty(pth).EditMask;
						oModel.getProperty(sBindPath).StrIndVS = "None";
						oModel.refresh();
						g.validateAltLabel(sBindPath, oJsonModel);
					}
				};

				var q = "/StrucIndicatorValueHelpSet";
				var M = g.getView().getModel("valueHelp");
				var StrIndSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "StrucIndicator", "StrucIndicatorDesc");
				StrIndSelectDialog.open();
			},

			_changeLblSys: function (f, g) {
				var sBindPath = f.getSource().getBindingInfo("value").binding.getContext().sPath;
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonModel.getProperty(sBindPath).AltAlkey;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/AltlabelVHSet";
					var oFilters = [new sap.ui.model.Filter("Alkey", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonModel.getProperty(sBindPath).AltAlkey = d.results[0].Alkey;
							oJsonModel.getProperty(sBindPath).Altxt = d.results[0].Altxt;
							oJsonModel.getProperty(sBindPath).LblSysVS = "None";
							g.validateLabelSystem(sBindPath, oJsonData);
						} else {
							oJsonModel.getProperty(sBindPath).LblSysVS = "Error";
							oJsonModel.getProperty(sBindPath).Altxt = "";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oJsonModel.getProperty(sBindPath).LblSysVS = "Error";
						oJsonModel.getProperty(sBindPath).Altxt = "";
						oJsonModel.setData(oJsonData);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonModel.getProperty(sBindPath).LblSysVS = "None";
					oJsonModel.getProperty(sBindPath).Altxt = "";
					oJsonModel.setData(oJsonData);
				}
			},

			_changeStrIntAltLbl: function (f, g) {
				var sBindPath = f.getSource().getBindingInfo("value").binding.getContext().sPath;
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var c = oJsonModel.getProperty(sBindPath).AltTplkz;
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/StrucIndicatorValueHelpSet";
					var oFilters = [new sap.ui.model.Filter("StrucIndicator", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oJsonModel.getProperty(sBindPath).AltTplkz = d.results[0].StrucIndicator;
							oJsonModel.getProperty(sBindPath).Tplxt = d.results[0].StrucIndicatorDesc;
							oJsonModel.getProperty(sBindPath).Name1i = d.results[0].EditMask;
							oJsonModel.getProperty(sBindPath).StrIndVS = "None";
							g.validateAltLabel(sBindPath, oJsonModel);
							return;
						} else {
							oJsonModel.getProperty(sBindPath).StrIndVS = "Error";
							oJsonModel.getProperty(sBindPath).Tplxt = "";
							oJsonModel.getProperty(sBindPath).Name1i = "";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oJsonModel.getProperty(sBindPath).StrIndVS = "Error";
						oJsonModel.getProperty(sBindPath).Tplxt = "";
						oJsonModel.getProperty(sBindPath).Name1i = "";
						oJsonModel.setData(oJsonData);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonModel.getProperty(sBindPath).StrIndVS = "None";
					oJsonModel.getProperty(sBindPath).Tplxt = "";
					oJsonModel.getProperty(sBindPath).Name1i = "";
					oJsonModel.setData(oJsonData);
				}
			},

			////////////// NEW LAM FUCTIONS /////////////////
			_startPointVH: function (p, c, g, obj) {
				var lc = this;
				var AIWLAM = g.lam.getModel("AIWLAM");
				var aLam = AIWLAM.getData();

				var settings = {
					title: g.getView().getModel("i18n").getProperty("STRT_POINT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>LINEARPOINT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>UOMSHORT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",

							header: [
								new sap.m.Text({
									text: "{i18n>DISTANCE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>UOMSHORT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MARKER}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MARKERLOC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>UOMSHORT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MARKTYPE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MARKDESC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LINREFPATTERN}"
								})
							]
						})
					],
					items: {
						path: "/StartpointSet?$filter=LRPID eq '" + aLam.lam.Lrpid + "'",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Linear_point}"
								}),
								new sap.m.Text({
									text: "{Linear_unit}"
								}),
								new sap.m.Text({
									text: "{Distance}"
								}),
								new sap.m.Text({
									text: "{Distance_unit}"
								}),
								new sap.m.Text({
									text: "{Marker}"
								}),
								new sap.m.Text({
									text: "{Start_point}"
								}),
								new sap.m.Text({
									text: "{Marker_linear_unit}"
								}),
								new sap.m.Text({
									text: "{Marker_type}"
								}),
								new sap.m.Text({
									text: "{marker_txt}"
								}),
								new sap.m.Text({
									text: "{LRPID}"
								})
							]
						})

					},
					confirm: function (E) {
						aLam.lam.Startmrkr = E.getParameter("selectedItem").getCells()[4].getText();
						aLam.lam.Strtptatr = E.getParameter("selectedItem").getCells()[5].getText();
						aLam.lam.StrtptatrVS = "None";
						aLam.lam.StartmrkrVS = "None";
						aLam.lam.MrkdisstVS = "None";
						aLam.lam.LinUnit = E.getParameter("selectedItem").getCells()[1].getText();
						aLam.lam.MrkrUnit = E.getParameter("selectedItem").getCells()[6].getText();
						aLam.lam.LamDer = "C";
						AIWLAM.setData(aLam);
						if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
							g.calculateLAM();
						}
					}
				};

				var sPath = "/StartpointSet";
				var oFilters = [new sap.ui.model.Filter("LRPID", "EQ", aLam.lam.Lrpid),
					new sap.ui.model.Filter("Obart", "EQ", obj)
				];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Linear_point}"
					}),
					new sap.m.Text({
						text: "{Linear_unit}"
					}),
					new sap.m.Text({
						text: "{Distance}"
					}),
					new sap.m.Text({
						text: "{Distance_unit}"
					}),
					new sap.m.Text({
						text: "{Marker}"
					}),
					new sap.m.Text({
						text: "{Start_point}"
					}),
					new sap.m.Text({
						text: "{Marker_linear_unit}"
					}),
					new sap.m.Text({
						text: "{Marker_type}"
					}),
					new sap.m.Text({
						text: "{marker_txt}"
					}),
					new sap.m.Text({
						text: "{LRPID}"
					})
				];

				var stSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Start_point", "Marker");
				stSelectDialog.open();
				stSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_startPointChange: function (p, c, g, obj) {
				var lc = this;
				var AIWLAM = g.lam.getModel("AIWLAM");
				var aLam = AIWLAM.getData();
				var s = c.getSource().getValue();
				s = s.toUpperCase();
				var a = s.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var oFilter, q;
					if (p === "startPoint") {
						oFilter = [new sap.ui.model.Filter("LRPID", "EQ", aLam.lam.Lrpid),
							new sap.ui.model.Filter("Start_point", "EQ", a),
							new sap.ui.model.Filter("Obart", "EQ", obj)
						];
						q = "/StartpointSet";
					}
					if (p === "startMarker") {
						oFilter = [new sap.ui.model.Filter("LRPID", "EQ", aLam.lam.Lrpid),
							new sap.ui.model.Filter("Marker", "EQ", a),
							new sap.ui.model.Filter("Obart", "EQ", obj)
						];
						q = "/StartpointSet";
					}
					var m = g.getView().getModel("valueHelp");
					m.read(q, {
						filters: oFilter,
						success: function (d, e) {
							if (d.results.length > 0) {
								aLam.lam.Startmrkr = d.results[0].Marker;
								aLam.lam.Strtptatr = d.results[0].Start_point;
								if (aLam.lam.Mrkdisst === "") {
									aLam.lam.Mrkdisst = d.results[0].Distance;
								}
								aLam.lam.StrtptatrVS = "None";
								aLam.lam.StartmrkrVS = "None";
								aLam.lam.MrkdisstVS = "None";
								aLam.lam.LinUnit = d.results[0].Linear_unit;
								aLam.lam.MrkrUnit = d.results[0].Marker_linear_unit;
								aLam.lam.LamDer = "C";
								AIWLAM.setData(aLam);
								if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
									g.calculateLAM();
								}
							} else {
								if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
									g.calculateLAM();
								}
							}
						},
						error: function (e) {
							c.getSource().setValueState("Error");
							var b = JSON.parse(e.response.body);
							var d = b.error.message.value;
						}
					});
				} else {
					if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
						g.calculateLAM();
					}
				}
			},

			_endPointVH: function (p, c, g, obj) {
				var lc = this;
				var AIWLAM = g.lam.getModel("AIWLAM");
				var aLam = AIWLAM.getData();

				var settings = {
					title: g.getView().getModel("i18n").getProperty("STRT_POINT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>LINEARPOINT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>UOMSHORT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",

							header: [
								new sap.m.Text({
									text: "{i18n>DISTANCE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>UOMSHORT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MARKER}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MARKERLOC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>UOMSHORT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MARKTYPE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>MARKDESC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LINREFPATTERN}"
								})
							]
						})
					],
					items: {
						path: "/StartpointSet?$filter=LRPID eq '" + aLam.lam.Lrpid + "'",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Linear_point}"
								}),
								new sap.m.Text({
									text: "{Linear_unit}"
								}),
								new sap.m.Text({
									text: "{Distance}"
								}),
								new sap.m.Text({
									text: "{Distance_unit}"
								}),
								new sap.m.Text({
									text: "{Marker}"
								}),
								new sap.m.Text({
									text: "{Start_point}"
								}),
								new sap.m.Text({
									text: "{Marker_linear_unit}"
								}),
								new sap.m.Text({
									text: "{Marker_type}"
								}),
								new sap.m.Text({
									text: "{marker_txt}"
								}),
								new sap.m.Text({
									text: "{LRPID}"
								})
							]
						})
					},
					confirm: function (E) {
						aLam.lam.Endmrkr = E.getParameter("selectedItem").getCells()[4].getText();
						aLam.lam.Endptatr = E.getParameter("selectedItem").getCells()[5].getText();
						aLam.lam.EndptatrVS = "None";
						aLam.lam.EndmrkrVS = "None";
						aLam.lam.MrkdisendVS = "None";
						aLam.lam.LinUnit = E.getParameter("selectedItem").getCells()[1].getText();
						aLam.lam.MrkrUnit = E.getParameter("selectedItem").getCells()[6].getText();
						aLam.lam.LamDer = "C";
						AIWLAM.setData(aLam);
						if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
							g.calculateLAM();
						}
					}
				};

				var sPath = "/StartpointSet";
				var oFilters = [new sap.ui.model.Filter("LRPID", "EQ", aLam.lam.Lrpid),
					new sap.ui.model.Filter("Obart", "EQ", obj)
				];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Linear_point}"
					}),
					new sap.m.Text({
						text: "{Linear_unit}"
					}),
					new sap.m.Text({
						text: "{Distance}"
					}),
					new sap.m.Text({
						text: "{Distance_unit}"
					}),
					new sap.m.Text({
						text: "{Marker}"
					}),
					new sap.m.Text({
						text: "{Start_point}"
					}),
					new sap.m.Text({
						text: "{Marker_linear_unit}"
					}),
					new sap.m.Text({
						text: "{Marker_type}"
					}),
					new sap.m.Text({
						text: "{marker_txt}"
					}),
					new sap.m.Text({
						text: "{LRPID}"
					})
				];

				var stSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Start_point", "Marker");
				stSelectDialog.open();
				stSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_endPointChange: function (p, c, g, obj) {
				var lc = this;
				var AIWLAM = g.lam.getModel("AIWLAM");
				var aLam = AIWLAM.getData();
				var s = c.getSource().getValue();
				s = s.toUpperCase();
				var a = s.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var oFilter, q;
					if (p === "endPoint") {
						oFilter = [new sap.ui.model.Filter("LRPID", "EQ", aLam.lam.Lrpid),
							new sap.ui.model.Filter("Start_point", "EQ", a),
							new sap.ui.model.Filter("Obart", "EQ", obj)
						];
						q = "/StartpointSet";
					}
					if (p === "endMarker") {
						oFilter = [new sap.ui.model.Filter("LRPID", "EQ", aLam.lam.Lrpid),
							new sap.ui.model.Filter("Marker", "EQ", a),
							new sap.ui.model.Filter("Obart", "EQ", obj)
						];
						q = "/StartpointSet";
					}
					var m = g.getView().getModel("valueHelp");
					m.read(q, {
						filters: oFilter,
						success: function (d, e) {
							if (d.results.length > 0) {
								aLam.lam.Endmrkr = d.results[0].Marker;
								aLam.lam.Endptatr = d.results[0].Start_point;
								if (aLam.lam.Mrkdisend === "") {
									aLam.lam.Mrkdisend = d.results[0].Distance;
								}
								aLam.lam.EndptatrVS = "None";
								aLam.lam.EndmrkrVS = "None";
								aLam.lam.MrkdisendVS = "None";
								aLam.lam.LinUnit = d.results[0].Linear_unit;
								aLam.lam.MrkrUnit = d.results[0].Marker_linear_unit;
								aLam.lam.LamDer = "C";
								AIWLAM.setData(aLam);
								if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
									g.calculateLAM();
								}
							} else {
								if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
									g.calculateLAM();
								}
							}
						},
						error: function (e) {
							c.getSource().setValueState("Error");
							var b = JSON.parse(e.response.body);
							var d = b.error.message.value;
						}
					});
				} else {
					if (aLam.lam.Strtptatr !== "" && aLam.lam.Endptatr !== "") {
						g.calculateLAM();
					}
				}
			},

			addPointDist: function (p, g) {
				var AIWLAM = g.lam.getModel("AIWLAM");
				var aLam = AIWLAM.getData();

				var temp;
				if (p === "SP") {
					var tempVal = g.startPoint;
					if (tempVal.indexOf("+") > -1) {
						temp = tempVal.split("+");
						tempVal = +parseFloat(temp[1]);
					} else if (tempVal.indexOf("-") > -1) {
						temp = tempVal.split("-");
						tempVal = -parseFloat(temp[1]);
					}
					var tempDis = aLam.lam.Mrkdisst;
					if (tempDis.indexOf("+") > -1) {
						temp = tempDis.split("+");
						tempDis = +parseFloat(temp[1]);
					} else if (tempDis.indexOf("-") > -1) {
						temp = tempDis.split("-");
						tempDis = -parseFloat(temp[1]);
					}
					if (tempDis !== 0) {
						aLam.lam.Strtptatr = (parseFloat(tempVal) + parseFloat(tempDis)).toString();
					}
				}
				if (p === "EP") {
					var tempVal = g.endPoint;
					if (tempVal.indexOf("+") > -1) {
						temp = tempVal.split("+");
						tempVal = +parseFloat(temp[1]);
					} else if (tempVal.indexOf("-") > -1) {
						temp = tempVal.split("-");
						tempVal = -parseFloat(temp[1]);
					}
					var tempDis = aLam.lam.Mrkdisend;
					if (tempDis.indexOf("+") > -1) {
						temp = tempDis.split("+");
						tempDis = +parseFloat(temp[1]);
					} else if (tempDis.indexOf("-") > -1) {
						temp = tempDis.split("-");
						tempDis = -parseFloat(temp[1]);
					}
					if (tempDis !== 0) {
						aLam.lam.Endptatr = (parseFloat(tempVal) + parseFloat(tempDis)).toString();
					}
				}
			},

			/*
			 * Method to show valuehelp for Purchase Organization - BOM item
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			purchaseOrgValueHelp: function (oEvent, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PURCH_ORG"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/xugiod01xI_EKORG",
						template: new sap.m.StandardListItem({
							title: "{PurchasingOrganization}",
							description: "{PurchasingOrganizationName}"
						})
					},
					confirm: function (E) {
						var itemDetailModel = g.getView().getModel("itemDetailModel");
						var itemDetailData = itemDetailModel.getData();
						itemDetailData.Ekorg = E.getParameters().selectedItem.getProperty("title");
						itemDetailData.Ekotx = E.getParameters().selectedItem.getProperty("description");
						itemDetailData.POrgVS = "None";
						itemDetailModel.setData(itemDetailData);
					}
				};

				var q = "/xugiod01xI_EKORG";
				var M = g.getView().getModel("valueHelp2");
				var prchseOrgSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "PurchasingOrganization",
					"PurchasingOrganizationName");
				prchseOrgSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				prchseOrgSelectDialog.open();
			},

			/*
			 * Method to validate change of Purchase Organization - BOM item
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			purchaseOrgChange: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemDetailModel = g.getView().getModel("itemDetailModel");
				var itemDetailData = itemDetailModel.getData();
				var oSource = oEvent.getSource();
				var newValue = oEvent.getSource().getValue();

				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("PurchasingOrganization", "EQ", c)];
				M.read("/xugiod01xI_EKORG", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Ekorg = d.results[0].PurchasingOrganization;
							itemDetailData.Ekotx = d.results[0].PurchasingOrganizationName;
							itemDetailData.POrgVS = "None";
						} else {
							itemDetailData.Ekotx = "";
							itemDetailData.POrgVS = "Error";
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						itemDetailData.POrgVS = "Error";
					}
				});
			},

			/*
			 * Method to show valuehelp for Purchase Group - BOM item
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			purchaseGrpValueHelp: function (oEvent, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PURCH_GRP"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/xUGIOD01xI_EKGRP",
						template: new sap.m.StandardListItem({
							title: "{PurchasingGroup}",
							description: "{PurchasingGroupName}"
						})
					},
					confirm: function (E) {
						var itemDetailModel = g.getView().getModel("itemDetailModel");
						var itemDetailData = itemDetailModel.getData();
						itemDetailData.Ekgrp = E.getParameters().selectedItem.getProperty("title");
						itemDetailData.Eknam = E.getParameters().selectedItem.getProperty("description");
						itemDetailData.PGrpVS = "None";
						itemDetailModel.setData(itemDetailData);
					}
				};

				var q = "/xUGIOD01xI_EKGRP";
				var M = g.getView().getModel("valueHelp2");
				var prchseGrpSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "PurchasingGroup",
					"PurchasingGroupName");
				prchseGrpSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				prchseGrpSelectDialog.open();
			},

			/*
			 * Method to validate change of Purchase Organization - BOM item
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			purchaseGrpChange: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemDetailModel = g.getView().getModel("itemDetailModel");
				var itemDetailData = itemDetailModel.getData();
				var oSource = oEvent.getSource();
				var newValue = oEvent.getSource().getValue();

				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("PurchasingGroup", "EQ", c)];
				M.read("/xUGIOD01xI_EKGRP", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Ekgrp = d.results[0].PurchasingGroup;
							itemDetailData.Eknam = d.results[0].PurchasingGroupName;
							itemDetailData.PGrpVS = "None";
						} else {
							itemDetailData.Eknam = "";
							itemDetailData.PGrpVS = "Error";
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						itemDetailData.PGrpVS = "Error";
					}
				});
			},

			/*
			 * Method to show valuehelp for Currency - BOM item
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			crncyValueHelp: function (oEvent, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("CURRENCY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/CurrencySet",
						template: new sap.m.StandardListItem({
							title: "{Waers}",
							description: "{Ltext}"
						})
					},
					confirm: function (E) {
						var itemDetailModel = g.getView().getModel("itemDetailModel");
						var itemDetailData = itemDetailModel.getData();
						itemDetailData.Waers = E.getParameters().selectedItem.getProperty("title");
						itemDetailData.CrncyVS = "None";
						itemDetailModel.setData(itemDetailData);
					}
				};

				var q = "/CurrencySet";
				var M = g.getView().getModel("valueHelp2");
				var currencySelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Waers", "Ltext");
				currencySelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				currencySelectDialog.open();
			},

			/*
			 * Method to validate change of Currency - BOM item
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			crncyChange: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemDetailModel = g.getView().getModel("itemDetailModel");
				var itemDetailData = itemDetailModel.getData();
				var oSource = oEvent.getSource();
				var newValue = oEvent.getSource().getValue();

				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Waers", "EQ", c)];
				M.read("/CurrencySet", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Waers = d.results[0].Waers;
							itemDetailData.CrncyVS = "None";
						} else {
							itemDetailData.CrncyVS = "Error";
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						itemDetailData.CrncyVS = "Error";
					}
				});
			},

			/*
			 * Method to show valuehelp for Material Group - BOM item
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			matGrpValueHelp: function (oEvent, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("MAT_GRP"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/I_MaterialGroupText",
						template: new sap.m.StandardListItem({
							title: "{MaterialGroup}",
							description: "{MaterialGroupName}"
						})
					},
					confirm: function (E) {
						var itemDetailModel = g.getView().getModel("itemDetailModel");
						var itemDetailData = itemDetailModel.getData();
						itemDetailData.Matkl = E.getParameters().selectedItem.getProperty("title");
						itemDetailData.Wgbez = E.getParameters().selectedItem.getProperty("description");
						itemDetailData.MatGrpVS = "None";
						itemDetailModel.setData(itemDetailData);
					}
				};

				var q = "/I_MaterialGroupText";
				var M = g.getView().getModel("valueHelp2");
				var oFilter = [new sap.ui.model.Filter("Language", "EQ", 'EN')];
				var matGrpSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "MaterialGroup", "MaterialGroupName");
				matGrpSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				matGrpSelectDialog.open();
			},

			/*
			 * Method to validate change of Material Group - BOM item
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			matGrpChange: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemDetailModel = g.getView().getModel("itemDetailModel");
				var itemDetailData = itemDetailModel.getData();
				var oSource = oEvent.getSource();
				var newValue = oEvent.getSource().getValue();

				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("MaterialGroup", "EQ", c), new sap.ui.model.Filter("Language", "EQ", 'EN')];
				M.read("/I_MaterialGroupText", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Matkl = d.results[0].MaterialGroup;
							itemDetailData.Wgbez = d.results[0].MaterialGroupName;
							itemDetailData.MatGrpVS = "None";
						} else {
							itemDetailData.Wgbez = "";
							itemDetailData.MatGrpVS = "Error";
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						itemDetailData.MatGrpVS = "Error";
					}
				});
			},

			/*
			 * Method to show valuehelp for Document - BOM item
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			documentValueHelp: function (oEvent, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("DOC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [
						new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>DOC}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>DOC_TYP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>DOC_PART}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>DOC_VER}"
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
						path: "/DocumentSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Doknr}"
								}),
								new sap.m.Text({
									text: "{Dokar}"
								}),
								new sap.m.Text({
									text: "{Doktl}"
								}),
								new sap.m.Text({
									text: "{Dokvr}"
								}),
								new sap.m.Text({
									text: "{Dktxt}"
								})
							]
						})

					},
					confirm: function (E) {
						var itemDetailModel = g.getView().getModel("itemDetailModel");
						var itemDetailData = itemDetailModel.getData();
						itemDetailData.Bomdocitm = E.getParameter("selectedItem").getCells()[0].getText();
						itemDetailData.Bomitmdkr = E.getParameter("selectedItem").getCells()[1].getText();
						itemDetailData.BomitmdkrTxt = E.getParameter("selectedItem").getCells()[4].getText();
						itemDetailData.Bomitmdtl = E.getParameter("selectedItem").getCells()[2].getText();
						itemDetailData.Bomitmdvr = E.getParameter("selectedItem").getCells()[3].getText();
						itemDetailData.Itmcmpdesc = E.getParameter("selectedItem").getCells()[4].getText();
						itemDetailData.ItmcmpdescEnabled = false;
						itemDetailData.DocVS = "None";
						itemDetailModel.setData(itemDetailData);
					}
				};

				var sPath = "/DocumentSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp2");
				var cells = [
					new sap.m.Text({
						text: "{Doknr}"
					}),
					new sap.m.Text({
						text: "{Dokar}"
					}),
					new sap.m.Text({
						text: "{Doktl}"
					}),
					new sap.m.Text({
						text: "{Dokvr}"
					}),
					new sap.m.Text({
						text: "{Dktxt}"
					})
				];

				var docSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Doknr", "Dktxt");
				docSelectDialog.open();
				docSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			/*
			 * Method to validate change of Document - BOM item
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			documentChange: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemDetailModel = g.getView().getModel("itemDetailModel");
				var itemDetailData = itemDetailModel.getData();
				var oSource = oEvent.getSource();
				var newValue = oEvent.getSource().getValue();

				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Doknr", "EQ", c)];
				M.read("/DocumentSet", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Bomdocitm = d.results[0].Doknr;
							itemDetailData.Bomitmdkr = d.results[0].Dokar;
							itemDetailData.BomitmdkrTxt = d.results[0].Dktxt;
							itemDetailData.Bomitmdtl = d.results[0].Doktl;
							itemDetailData.Bomitmdvr = d.results[0].Dokvr;
							itemDetailData.Itmcmpdesc = d.results[0].Dktxt;
							itemDetailData.ItmcmpdescEnabled = false;
							itemDetailData.DocVS = "None";
						} else {
							itemDetailData.Bomitmdkr = "";
							itemDetailData.BomitmdkrTxt = "";
							itemDetailData.Bomitmdtl = "";
							itemDetailData.Bomitmdvr = "";
							itemDetailData.DocVS = "Error";
							itemDetailData.Itmcmpdesc = "";
							itemDetailData.ItmcmpdescEnabled = true;
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						itemDetailData.Bomitmdkr = "";
						itemDetailData.BomitmdkrTxt = "";
						itemDetailData.Bomitmdtl = "";
						itemDetailData.Bomitmdvr = "";
						itemDetailData.DocVS = "Error";
					}
				});
			},

			/*
			 * Method to show valuehelp for Size unit
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			sizeunitValueHelp: function (oEvent, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("SIZE_UNIT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/UOMSet",
						template: new sap.m.StandardListItem({
							title: "{Mseh3}",
							description: "{Msehl}"
						})
					},
					confirm: function (E) {
						var itemDetailModel = g.getView().getModel("itemDetailModel");
						var itemDetailData = itemDetailModel.getData();
						itemDetailData.Romei = E.getParameters().selectedItem.getProperty("title");
						// itemDetailData.Wgbez = E.getParameters().selectedItem.getProperty("description");
						itemDetailData.sizeunitVS = "None";
						itemDetailModel.setData(itemDetailData);
						g.readSizeDetails();
					}
				};

				var q = "/UOMSet";
				var M = g.getView().getModel("valueHelp2");
				var oFilter = [];
				var sizeUnitSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "Mseh3", "Msehl");
				sizeUnitSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				sizeUnitSelectDialog.open();
			},

			/*
			 * Method to validate change of Size Unit
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			sizeunitChange: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemDetailModel = g.getView().getModel("itemDetailModel");
				var itemDetailData = itemDetailModel.getData();
				var oSource = oEvent.getSource();
				var newValue = oEvent.getSource().getValue();

				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Mseh3", "EQ", c)];
				M.read("/UOMSet", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Romei = d.results[0].Mseh3;
							// itemDetailData.Wgbez = d.results[0].MaterialGroupName;
							itemDetailData.sizeunitVS = "None";
							g.readSizeDetails();
						} else {
							// itemDetailData.Wgbez = "";
							itemDetailData.sizeunitVS = "Error";
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						itemDetailData.sizeunitVS = "Error";
					}
				});
			},

			/*
			 * Method to show valuehelp for Formula Key
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			formulakeyValueHelp: function (oEvent, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("FORMULA_KEY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/I_BillOfMaterialFormulaVH",
						template: new sap.m.StandardListItem({
							title: "{VariableSizeCompFormulaKey}",
							description: "{VariableSizeCompFormulaText}"
						})
					},
					confirm: function (E) {
						var itemDetailModel = g.getView().getModel("itemDetailModel");
						var itemDetailData = itemDetailModel.getData();
						itemDetailData.Rform = E.getParameters().selectedItem.getProperty("title");
						itemDetailData.FrmlaKeyDesc = E.getParameters().selectedItem.getProperty("description");
						itemDetailData.FrmlaKeyVS = "None";
						itemDetailModel.setData(itemDetailData);
						g.readSizeDetails();
					}
				};

				var q = "/I_BillOfMaterialFormulaVH";
				var M = g.getView().getModel("valueHelp2");
				var oFilter = [];
				var formulakeySelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "VariableSizeCompFormulaKey",
					"VariableSizeCompFormulaText");
				formulakeySelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				formulakeySelectDialog.open();
			},

			/*
			 * Method to validate change of Formula KeyformulakeyValueHelp
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			formulakeyChange: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemDetailModel = g.getView().getModel("itemDetailModel");
				var itemDetailData = itemDetailModel.getData();
				var oSource = oEvent.getSource();
				var newValue = oEvent.getSource().getValue();

				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("VariableSizeCompFormulaKey", "EQ", c)];
				M.read("/I_BillOfMaterialFormulaVH", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Rform = d.results[0].VariableSizeCompFormulaKey;
							itemDetailData.FrmlaKeyDesc = d.results[0].VariableSizeCompFormulaText;
							itemDetailData.FrmlaKeyVS = "None";
							g.readSizeDetails();
						} else {
							itemDetailData.FrmlaKeyDesc = "";
							itemDetailData.FrmlaKeyVS = "Error";
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						itemDetailData.FrmlaKeyVS = "Error";
					}
				});
			},

			/*
			 * Method to show valuehelp for Quantity Var-Size
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			qtyVarUnitValueHelp: function (oEvent, g) {
				var settings = {
					title: g.getView().getModel("i18n").getProperty("COMP_UNIT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/UOMSet",
						template: new sap.m.StandardListItem({
							title: "{Mseh3}",
							description: "{Msehl}"
						})
					},
					confirm: function (E) {
						var itemDetailModel = g.getView().getModel("itemDetailModel");
						var itemDetailData = itemDetailModel.getData();
						itemDetailData.Rokme = E.getParameters().selectedItem.getProperty("title");
						// itemDetailData.Wgbez = E.getParameters().selectedItem.getProperty("description");
						itemDetailData.QtyVarUnitVS = "None";
						itemDetailModel.setData(itemDetailData);
						g.readSizeDetails();
					}
				};

				var q = "/UOMSet";
				var M = g.getView().getModel("valueHelp2");
				var oFilter = [];
				var sizeUnitSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "Mseh3", "Msehl");
				sizeUnitSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				sizeUnitSelectDialog.open();
			},

			/*
			 * Method to validate change of Quantity Var-Size
			 * @public
			 * @param {sap.ui.base.Event} oEvent
			 * @param {object} g
			 */
			qtyVarUnitChange: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemDetailModel = g.getView().getModel("itemDetailModel");
				var itemDetailData = itemDetailModel.getData();
				var oSource = oEvent.getSource();
				var newValue = oEvent.getSource().getValue();

				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Mseh3", "EQ", c)];
				M.read("/UOMSet", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Rokme = d.results[0].Mseh3;
							// itemDetailData.Wgbez = d.results[0].MaterialGroupName;
							itemDetailData.QtyVarUnitVS = "None";
							g.readSizeDetails();
						} else {
							// itemDetailData.Wgbez = "";
							itemDetailData.QtyVarUnitVS = "Error";
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						itemDetailData.QtyVarUnitVS = "Error";
					}
				});
			},

			onDOILocationVH: function (g, e) {
				var mDoiElement = g.dataOriginFrag.getModel("doiElement");
				var oDoiElement = mDoiElement.getData();

				if (e !== undefined && e !== null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("LOC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PLANT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LOC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>NAME}"
								})
							]
						})
					],
					items: {
						path: "/LocationVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Werks}"
								}),
								new sap.m.Text({
									text: "{Stand}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								})
							]
						})

					},
					confirm: function (E) {
						oDoiElement.currentObj = E.getParameter("selectedItem").getCells()[1].getText();
						oDoiElement.currentObjDesc = E.getParameter("selectedItem").getCells()[2].getText();
						g.dataOriginFrag.setModel(mDoiElement, "doiElement");
						g.dataOriginFrag.getModel("doiElement").refresh();
					}
				};

				var sPath = "/LocationVHSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Werks}"
					}),
					new sap.m.Text({
						text: "{Stand}"
					}),
					new sap.m.Text({
						text: "{Ktext}"
					})
				];

				var locSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Stand", "Ktext");
				locSelectDialog.open();
				locSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			onDOIabcIndVH: function (g, e) {
				var mDoiElement = g.dataOriginFrag.getModel("doiElement");
				var oDoiElement = mDoiElement.getData();

				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("ABC_IND"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/ABCIndicatorSet",
						template: new sap.m.StandardListItem({
							title: "{Abckz}",
							description: "{Abctx}"
						})
					},
					confirm: function (E) {
						oDoiElement.currentObj = E.getParameters().selectedItem.getProperty("title");
						oDoiElement.currentObjDesc = E.getParameters().selectedItem.getProperty("description");
						g.dataOriginFrag.setModel(mDoiElement, "doiElement");
						g.dataOriginFrag.getModel("doiElement").refresh();
					}
				};

				var q = "/ABCIndicatorSet";
				var M = g.getView().getModel("valueHelp");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Abckz", "Abctx");
				abcSelectDialog.open();
			},

			onDOIPlantSecVH: function (g, e) {
				var mDoiElement = g.dataOriginFrag.getModel("doiElement");
				var oDoiElement = mDoiElement.getData();

				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PL_SEC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PLANT_SEC}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PERSON_RESP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PHONE}"
								})
							]
						})
					],
					items: {
						path: "/PlantSectionSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Beber}"
								}),
								new sap.m.Text({
									text: "{Fing}"
								}),
								new sap.m.Text({
									text: "{Tele}"
								})
							]
						})
					},
					confirm: function (E) {
						oDoiElement.currentObj = E.getParameter("selectedItem").getCells()[0].getText();
						oDoiElement.currentObjDesc = E.getParameter("selectedItem").getCells()[1].getText();
						oDoiElement.currentObjDesc2 = E.getParameter("selectedItem").getCells()[2].getText();
						g.dataOriginFrag.setModel(mDoiElement, "doiElement");
						g.dataOriginFrag.getModel("doiElement").refresh();
					}
				};

				var sPath = "/PlantSectionSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Beber}"
					}),
					new sap.m.Text({
						text: "{Fing}"
					}),
					new sap.m.Text({
						text: "{Tele}"
					})

				];

				var ccSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Beber", "Fing");
				ccSelectDialog.open();
				ccSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			onDOIMainwcVH: function (g, e) {
				var mDoiElement = g.dataOriginFrag.getModel("doiElement");
				var oDoiElement = mDoiElement.getData();

				var wcSearchResults;
				if (wcSearchResults === undefined) {
					var wcSelectDialog = new sap.m.TableSelectDialog({
						title: g.getView().getModel("i18n").getProperty("WC"),
						noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
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
							}),
							new sap.m.Column({
								demandPopin: true,
								minScreenWidth: "Tablet",
								header: [
									new sap.m.Text({
										text: "Work Center"
									})
								]
							}),
							new sap.m.Column({
								demandPopin: true,
								minScreenWidth: "Tablet",
								header: [
									new sap.m.Text({
										text: "Description"
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
							})
						],
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
							oDoiElement.currentObj = E.getParameter("selectedItem").getCells()[2].getText();
							oDoiElement.currentObjDesc = E.getParameter("selectedItem").getCells()[3].getText();
							oDoiElement.currentObjDesc2 = E.getParameter("selectedItem").getCells()[1].getText();
							g.dataOriginFrag.setModel(mDoiElement, "doiElement");
							g.dataOriginFrag.getModel("doiElement").refresh();
						},
						search: function (E) {
							if (E.getSource().getBinding("items")) {
								var sValue = E.getParameter("value");
								E.getSource().getBinding("items").filter(!sValue ? [] : [
									new sap.ui.model.Filter(
										[
											new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, sValue),
											new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
										],
										false)
								]);
							}
						}
					});

					var sPath = "/WorkCenterVHSet";
					var oModel = g.getView().getModel("valueHelp");
					// var sWerks = p.Werks ? p.Werks : "";
					var sWerks = g.getView().getModel(g.oModelName).getData().Werks;
					var oFilters = [new sap.ui.model.Filter("Werks", "EQ", sWerks)];
					var fnSuccess = function (h) {
						if (h.results.length > 0) {
							if (sap.ui.getCore().getModel("AIWListWCModel")) {
								var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
								if (oModelData.length > 0) {
									for (var i = 0; i < oModelData.length; i++) {
										if (oModelData[i].wc) {
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
								}
							}
							wcSearchResults = h;
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
							e.setSizeLimit(h.results.length);
							e.isSizeLimit = h.results.length;
							wcSelectDialog.setModel(e);
							// wcSelectDialog.setGrowingThreshold(h.results.length);
							wcSelectDialog.bindAggregation("items", "/results", I);
						} else {
							wcSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					};
					var fnError = function () {};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					var e = new sap.ui.model.json.JSONModel();
					e.setData(wcSearchResults);
					wcSelectDialog.setModel(e);
					var I = wcSelectDialog.getItems();
					for (var i = 0; i < I.length; i++) {
						I[i].setVisible(true);
					}
				}
				wcSelectDialog.open();
			},

			onDOICostCenterVH: function (g, e) {
				var mDoiElement = g.dataOriginFrag.getModel("doiElement");
				var oDoiElement = mDoiElement.getData();

				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("CC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>CC}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CCTR_CATGRY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CO_AREA}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PERSON_RESP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>USR_RESP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SHRT_TXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LANGUAGE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>VALID_FRM}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>VALID_TO}"
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
						})
					},
					confirm: function (E) {
						oDoiElement.currentObj = E.getParameter("selectedItem").getCells()[0].getText();
						oDoiElement.currentObjDesc = E.getParameter("selectedItem").getCells()[2].getText();
						oDoiElement.currentObjDesc2 = E.getParameter("selectedItem").getCells()[6].getText();
						g.dataOriginFrag.setModel(mDoiElement, "doiElement");
						g.dataOriginFrag.getModel("doiElement").refresh();
					}
				};

				var sPath = "/CostCenterSet";
				var oFilters = [];
				var kokrs = g.getView().getModel(g.oModelName).getData().Kokrs;
				if (kokrs !== "") {
					oFilters.push(new sap.ui.model.Filter("Kokrs", "EQ", kokrs));
				}
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
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
				];

				var ccostcSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Kostl", "Mctxt");
				ccostcSelectDialog.open();
				ccostcSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			onDOIPlanPlantVH: function (g, e) {
				var mDoiElement = g.dataOriginFrag.getModel("doiElement");
				var oDoiElement = mDoiElement.getData();

				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PL_PLANT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/PlanningPlantSet",
						template: new sap.m.StandardListItem({
							title: "{Werks}",
							description: "{Name1}"
						})
					},
					confirm: function (E) {
						oDoiElement.currentObj = E.getParameters().selectedItem.getProperty("title");
						oDoiElement.currentObjDesc = E.getParameters().selectedItem.getProperty("description");
						g.dataOriginFrag.setModel(mDoiElement, "doiElement");
						g.dataOriginFrag.getModel("doiElement").refresh();
					}
				};

				var q = "/PlanningPlantSet";
				var M = g.getView().getModel("valueHelp");
				var plPlantSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Werks", "Name1");
				plPlantSelectDialog.open();
			},

			onDOIPlanrGrpVH: function (g, e) {
				var mDoiElement = g.dataOriginFrag.getModel("doiElement");
				var oDoiElement = mDoiElement.getData();

				if (e !== undefined && e !== null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PL_GRP"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PL_PLANT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PLANNER_GRP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PM_PLNRGRP_NAME}"
								})
							]
						})
					],
					items: {
						path: "/PlannerGroupSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Iwerk}"
								}),
								new sap.m.Text({
									text: "{Ingrp}"
								}),
								new sap.m.Text({
									text: "{Innam}"
								})
							]
						})
					},
					confirm: function (E) {
						oDoiElement.currentObj = E.getParameter("selectedItem").getCells()[1].getText();
						oDoiElement.currentObjDesc = E.getParameter("selectedItem").getCells()[2].getText();
						g.dataOriginFrag.setModel(mDoiElement, "doiElement");
						g.dataOriginFrag.getModel("doiElement").refresh();
					}
				};

				var sPath = "/PlannerGroupSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Iwerk}"
					}),
					new sap.m.Text({
						text: "{Ingrp}"
					}),
					new sap.m.Text({
						text: "{Innam}"
					})
				];

				var plGSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Ingrp", "Innam");
				plGSelectDialog.open();
				plGSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			UOMVH: function (event, g) {
				var oSource = event.getSource();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("UOM"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/UOMSet",
						template: new sap.m.StandardListItem({
							title: "{Mseh3}",
							description: "{Msehl}"
						})
					},
					confirm: function (E) {
						oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
						oSource.setValueState("None");
					}
				};

				var q = "/UOMSet";
				var M = g.getView().getModel("valueHelp2");
				var oFilter = [];
				var relTypeSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "Mseh3", "Msehl");
				relTypeSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				relTypeSelectDialog.open();
			},

			_UOMchange: function (event, g) {
				var oSource = event.getSource();
				var c = oSource.getValue().toUpperCase();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/UOMSet";
					var oFilters = [new sap.ui.model.Filter("Mseh3", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oSource.setValue(d.results[0].Mseh3);
							oSource.setValueState("None");
						} else {
							oSource.setValueState("Error");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				}
			},

			RelTypeVH: function (event, g) {
				var oSource = event.getSource();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("REL_TYPE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/TLRelCatSet",
						template: new sap.m.StandardListItem({
							title: "{Aobkt}",
							description: "{Aobtx}"
						})
					},
					confirm: function (E) {
						oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
						oSource.setValueState("None");
					}
				};

				var q = "/TLRelCatSet";
				var M = g.getView().getModel("valueHelp2");
				var oFilter = [];
				var relTypeSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "Aobkt", "Aobtx");
				relTypeSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				relTypeSelectDialog.open();
			},

			_changeRelType: function (event, g) {
				var oSource = event.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/TLRelCatSet";
					var oFilters = [new sap.ui.model.Filter("Aobkt", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oSource.setValue(d.results[0].Aobkt);
							oSource.setValueState("None");
						} else {
							oSource.setValueState("Error");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				}
			},

			OffIntrpVH: function (event, g) {
				var oSource = event.getSource();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("OFFSET_INTRP"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/TLProvgVHSet",
						template: new sap.m.StandardListItem({
							title: "{Interval}",
							description: "{Description}"
						})
					},
					confirm: function (E) {
						oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
						oSource.setValueState("None");
					}
				};

				var q = "/TLProvgVHSet";
				var M = g.getView().getModel("valueHelp2");
				var oFilter = [];
				var offIntrpSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "Interval", "Description");
				offIntrpSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				offIntrpSelectDialog.open();
			},

			_changeOffIntrp: function (event, g) {
				var oSource = event.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/TLProvgVHSet";
					var oFilters = [new sap.ui.model.Filter("Interval", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oSource.setValue(d.results[0].Interval);
							oSource.setValueState("None");
						} else {
							oSource.setValueState("Error");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				}
			},

			FactryIdVH: function (event, g) {
				var oSource = event.getSource();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("FACTORY_ID"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/TLKalidVHSet",
						template: new sap.m.StandardListItem({
							title: "{Ident}",
							description: "{Ltext}"
						})
					},
					confirm: function (E) {
						oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
						oSource.setValueState("None");
					}
				};

				var q = "/TLKalidVHSet";
				var M = g.getView().getModel("valueHelp2");
				var oFilter = [];
				var offIntrpSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "Ident", "Ltext");
				offIntrpSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				offIntrpSelectDialog.open();
			},

			_changeFactryId: function (event, g) {
				var oSource = event.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/TLKalidVHSet";
					var oFilters = [new sap.ui.model.Filter("Ident", "EQ", c)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oSource.setValue(d.results[0].Ident);
							oSource.setValueState("None");
						} else {
							oSource.setValueState("Error");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				}
			},

			WrkCtrORVH: function (event, g) {
				var oSource = event.getSource();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("WC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/TLKalidVHSet",
						template: new sap.m.StandardListItem({
							title: "{Ident}",
							description: "{Ltext}"
						})
					},
					confirm: function (E) {
						oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
						oSource.setValueState("None");
					}
				};

				var q = "/TLKalidVHSet";
				var M = g.getView().getModel("valueHelp2");
				var oFilter = [];
				var offIntrpSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "Ident", "Ltext");
				offIntrpSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
				offIntrpSelectDialog.open();
			},

			WrkCtrORVH: function (e, g) {
				var oSource = e.getSource();
				var wcSelectDialog = new sap.m.TableSelectDialog({
					title: g.getView().getModel("i18n").getProperty("WC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [
						new sap.m.Column({
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
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Work Center"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Description"
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
						})
					],
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
						oSource.setValue(E.getParameter("selectedItem").getCells()[2].getText());
						oSource.setValueState("None");
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				});

				var sPath = "/WorkCenterVHSet";
				var oModel = g.getView().getModel("valueHelp");
				// var sWerks = p.Werks ? p.Werks : "";
				// var oFilters = [new sap.ui.model.Filter("Werks", "EQ", sWerks)];
				var oFilters = [];
				var fnSuccess = function (h) {
					if (h.results.length > 0) {
						if (sap.ui.getCore().getModel("AIWListWCModel")) {
							var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].wc) {
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
							}
						}
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
						e.setSizeLimit(h.results.length);
						e.isSizeLimit = h.results.length;
						wcSelectDialog.setModel(e);
						// wcSelectDialog.setGrowingThreshold(h.results.length);
						wcSelectDialog.bindAggregation("items", "/results", I);
					} else {
						wcSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
					}
				};
				var fnError = function () {};
				g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				wcSelectDialog.open();
			},

			_changeWrkCtrOR: function (event, g) {
				var oSource = event.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/WorkCenterVHSet";
					var oFilters = [new sap.ui.model.Filter("Arbpl", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oSource.setValue(d.results[0].Arbpl);
							oSource.setValueState("None");
						} else {
							oSource.setValueState("Error");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {}
			},

			PlantORVH: function (e, g) {
				var oSource = e.getSource();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PLANT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/PlanningPlantSet",
						template: new sap.m.StandardListItem({
							title: "{Werks}",
							description: "{Name1}"
						})
					},
					confirm: function (E) {
						oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
						oSource.setValueState("None");
					}
				};

				var q = "/PlanningPlantSet";
				var M = g.getView().getModel("valueHelp");
				var plPlantSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Werks", "Name1");
				plPlantSelectDialog.open();
			},

			_changePlantOR: function (f, g) {
				var oSource = f.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/PlanningPlantSet";
					var oFilters = [new sap.ui.model.Filter("Werks", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oSource.setValue(d.results[0].Werks);
							oSource.setValueState("None");
						} else {
							oSource.setValueState("Error");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {}
			},

			ActNumVH: function (e, g) {
				var oSource = e.getSource();
				// var tlDetailModel = g.getView().getModel("tlDetailModel");
				// var sBindPath = oSource.getBindingInfo("value").binding.getContext().getPath();
				// var oSrvPcg = tlDetailModel.getProperty(sBindPath);
				var settings = {
					title: g.getView().getModel("i18n").getProperty("SRV_NUM"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/TlSpackNoSet",
						template: new sap.m.StandardListItem({
							title: "{Asnum}",
							description: "{Asktx}"
						})
					},
					confirm: function (E) {
						oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
						oSource.setValueState("None");
						// oSrvPcg.UnitOfWork = E.getParameters().selectedItem.getBindingContext().getObject().Iwein;
						// oSrvPcg.BUomSP = E.getParameters().selectedItem.getBindingContext().getObject().Meins;
						// tlDetailModel.refresh();
						g.deriveActQty(oSource, E.getParameters().selectedItem.getBindingContext().getObject().Iwein, E.getParameters().selectedItem.getBindingContext()
							.getObject().Meins);
					}
				};

				var q = "/TlSpackNoSet";
				var M = g.getView().getModel("valueHelp2");
				var actNumSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Asnum", "Asktx");
				actNumSelectDialog.open();
			},

			_ActNumchange: function (f, g) {
				var oSource = f.getSource();
				var c = oSource.getValue();
				// var tlDetailModel = g.getView().getModel("tlDetailModel");
				// var sBindPath = oSource.getBindingInfo("value").binding.getContext().getPath();
				// var oSrvPcg = tlDetailModel.getProperty(sBindPath);
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/TlSpackNoSet";
					var oFilters = [new sap.ui.model.Filter("Asnum", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oSource.setValue(d.results[0].Asnum);
							oSource.setValueState("None");
							// oSrvPcg.UnitOfWork = d.results[0].Iwein;
							// oSrvPcg.BUomSP = d.results[0].Meins;
							// tlDetailModel.refresh();
							g.deriveActQty(oSource, d.results[0].Iwein, d.results[0].Meins);
						} else {
							oSource.setValueState("Error");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				}
			},

			Qtychange: function (oEvent, g) {
				if (oEvent.getSource().getValue() === "" || parseInt(oEvent.getSource().getValue()) === 0) {
					oEvent.getSource().setValueState("Error");
				} else {
					oEvent.getSource().setValueState("None");
				}
				g.deriveActQty(oEvent.getSource());
			},

			ShrtTxtchange: function (oEvent, g) {
				if (oEvent.getSource().getValue() === "") {
					oEvent.getSource().setValueState("Error");
				} else {
					oEvent.getSource().setValueState("None");
				}
			},

			CurKeyVH: function (oEvent, g, aFilter) {
				var oSource = oEvent.getSource();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("xtxt.CURRENCY"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/CurrencySet",
						template: new sap.m.StandardListItem({
							title: "{Waers}",
							description: "{Ltext}"
						})
					},
					confirm: function (E) {
						oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
						oSource.setValueState("None");
					}
				};

				var q = "/CurrencySet";
				var M = g.getView().getModel("valueHelp2");
				var currSelectDialog = ValueHelpProvider.getSelectDialog(M, q, aFilter, settings, "Waers", "Ltext");
				currSelectDialog.open();
			},

			_CurKeychange: function (f, g, aFilter) {
				var oSource = f.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/CurrencySet";
					// var oFilters = [new sap.ui.model.Filter("Waers", "EQ", a)];
					aFilter.push(new sap.ui.model.Filter("Waers", "EQ", a));
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oSource.setValue(d.results[0].Waers);
							oSource.setValueState("None");
						} else {
							oSource.setValueState("Error");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
					};
					g._readData(sPath, oModel, fnSuccess, fnError, aFilter);
				} else {
					oSource.setValueState("Error");
				}
			},

			UnitOfWorkVH: function (e, g) {
				var oSource = e.getSource();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("UNIT_WORK"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/TLWorkUomSet",
						template: new sap.m.StandardListItem({
							title: "{Msehi}",
							description: "{Msehl}"
						})
					},
					confirm: function (E) {
						oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
						oSource.setValueState("None");
					}
				};

				var q = "/TLWorkUomSet";
				var M = g.getView().getModel("valueHelp2");
				var actNumSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Msehi", "Msehl");
				actNumSelectDialog.open();
			},

			_UnitOfWorkchange: function (f, g) {
				var oSource = f.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/TLWorkUomSet";
					var oFilters = [new sap.ui.model.Filter("Msehi", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oSource.setValue(d.results[0].Msehi);
							oSource.setValueState("None");
							
							// if(g.getModel("tlSrvPckge")){
							// 	g.updateWorkforOperation();
							// }
						} else {
							oSource.setValueState("Error");
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oSource.setValueState("Error");
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				}
			},

			InspPointVH: function (oEvent, g) {
				var oSource = oEvent.getSource();
				var tlDetailModel = g.getModel("tlDetailModel");
				var tData = tlDetailModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("INS_PT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/InspPointSet",
						template: new sap.m.StandardListItem({
							title: "{Slwbez}",
							description: "{Kurztext}"
						})
					},
					confirm: function (E) {
						tData.lHeader.insPt = E.getParameters().selectedItem.getProperty("title");
						tData.lHeader.insPtDesc = E.getParameters().selectedItem.getProperty("description");
						tData.lHeader.insPtVS = "None";
						if (tData.lOperation.length > 0) {
							tData.lHeader.bAddInspChar = true;
						}
						tlDetailModel.setData(tData);
					}
				};

				var q = "/InspPointSet";
				var M = g.getView().getModel("valueHelp2");
				var sTLType = "";
				if (g.action.indexOf("GTL") > 0) {
					sTLType = "A";
				} else if (g.action.indexOf("ETL") > 0) {
					sTLType = "E";
				} else if (g.action.indexOf("FTL") > 0) {
					sTLType = "T";
				}
				var aFilters = [new sap.ui.model.Filter("Plnty", "EQ", sTLType)];
				var inspPtSelectDialog = ValueHelpProvider.getSelectDialog(M, q, aFilters, settings, "Slwbez", "Kurztext");
				inspPtSelectDialog.open();
			},

			_InspPointchange: function (f, g) {
				var tlDetailModel = g.getModel("tlDetailModel");
				var tData = tlDetailModel.getData();
				var oSource = f.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/InspPointSet";
					var sTLType = "";
					if (g.action.indexOf("GTL") > 0) {
						sTLType = "A";
					} else if (g.action.indexOf("ETL") > 0) {
						sTLType = "E";
					} else if (g.action.indexOf("FTL") > 0) {
						sTLType = "T";
					}
					var aFilters = [new sap.ui.model.Filter("Slwbez", "EQ", a), new sap.ui.model.Filter("Plnty", "EQ", sTLType)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							tData.lHeader.insPt = d.results[0].Slwbez;
							tData.lHeader.insPtDesc = d.results[0].Kurztext;
							tData.lHeader.insPtVS = "None";

							if (tData.lOperation.length > 0) {
								tData.lHeader.bAddInspChar = true;
							}
						} else {
							tData.lHeader.insPtVS = "Error";
						}
						tlDetailModel.setData(tData);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						tData.lHeader.insPtVS = "Error";
						tlDetailModel.setData(tData);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, aFilters);
				} else {
					tData.lHeader.insPtVS = "Error";
					tlDetailModel.setData(tData);
				}
			},

			CostEleVH: function (oEvent, g) {
				var oSource = oEvent.getSource();
				var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
				var settings = {
					title: g.getView().getModel("i18n").getProperty("COST_ELE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/CostElemSet",
						template: new sap.m.StandardListItem({
							title: "{Kstar}",
							description: "{Ktext}"
						})
					},
					confirm: function (E) {
						g.operationDetail.costElement = E.getParameters().selectedItem.getProperty("title");
						g.operationDetail.costElementVS = "None";
						tlOpDetailModel.setData(g.operationDetail);
					}
				};

				var q = "/CostElemSet";
				var M = g.getView().getModel("valueHelp2");
				var aFilters = [];
				var inspPtSelectDialog = ValueHelpProvider.getSelectDialog(M, q, aFilters, settings, "Kstar", "Ktext");
				inspPtSelectDialog.open();
			},

			_CostElechange: function (f, g) {
				var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
				var oSource = f.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/CostElemSet";
					var aFilters = [new sap.ui.model.Filter("Kstar", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							g.operationDetail.costElement = d.results[0].Slwbez;
							g.operationDetail.costElementVS = "None";
						} else {
							g.operationDetail.costElementVS = "Error";
						}
						tlOpDetailModel.setData(g.operationDetail);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.costElementVS = "Error";
						tlOpDetailModel.setData(g.operationDetail);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, aFilters);
				}
			},

			MatGrpVH: function (oEvent, g) {
				var oSource = oEvent.getSource();
				var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
				var settings = {
					title: g.getView().getModel("i18n").getProperty("MAT_GRP"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/MatGroupSet",
						template: new sap.m.StandardListItem({
							title: "{Matkl}",
							description: "{Wgbez}"
						})
					},
					confirm: function (E) {
						g.operationDetail.materialGrp = E.getParameters().selectedItem.getProperty("title");
						g.operationDetail.materialGrpVS = "None";
						tlOpDetailModel.setData(g.operationDetail);
					}
				};

				var q = "/MatGroupSet";
				var M = g.getView().getModel("valueHelp2");
				var aFilters = [];
				var inspPtSelectDialog = ValueHelpProvider.getSelectDialog(M, q, aFilters, settings, "Matkl", "Wgbez");
				inspPtSelectDialog.open();
			},

			_MatGrpchange: function (f, g) {
				var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
				var oSource = f.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/MatGroupSet";
					var aFilters = [new sap.ui.model.Filter("Matkl", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							g.operationDetail.materialGrp = d.results[0].Matkl;
							g.operationDetail.materialGrpVS = "None";
						} else {
							g.operationDetail.materialGrpVS = "Error";
						}
						tlOpDetailModel.setData(g.operationDetail);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.materialGrpVS = "Error";
						tlOpDetailModel.setData(g.operationDetail);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, aFilters);
				}
			},

			PuchGroupVH: function (oEvent, g) {
				var oSource = oEvent.getSource();
				var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PURCH_GRP"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "Purch. Group"
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
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Tel. No. Purch. Group"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Fax Number"
								})
							]
						})
					],
					items: {
						path: "/RegionSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Ekgrp}"
								}),
								new sap.m.Text({
									text: "{Eknam}"
								}),
								new sap.m.Text({
									text: "{Ektel}"
								}),
								new sap.m.Text({
									text: "{Telfx}"
								})
							]
						})

					},
					confirm: function (E) {
						g.operationDetail.puchGroup = E.getParameter("selectedItem").getCells()[0].getText();
						g.operationDetail.puchGroupVS = "None";
						tlOpDetailModel.setData(g.operationDetail);
					}
				};

				var sPath = "/PurGrpSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp2");
				var cells = [
					new sap.m.Text({
						text: "{Ekgrp}"
					}),
					new sap.m.Text({
						text: "{Eknam}"
					}),
					new sap.m.Text({
						text: "{Ektel}"
					}),
					new sap.m.Text({
						text: "{Telfx}"
					})
				];

				var strSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Ekgrp", "Eknam");
				strSelectDialog.open();
				strSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_PuchGroupchange: function (f, g) {
				var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
				var oSource = f.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/PurGrpSet";
					var aFilters = [new sap.ui.model.Filter("Ekgrp", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							g.operationDetail.puchGroup = d.results[0].Ekgrp;
							g.operationDetail.puchGroupVS = "None";
						} else {
							g.operationDetail.puchGroupVS = "Error";
						}
						tlOpDetailModel.setData(g.operationDetail);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.puchGroupVS = "Error";
						tlOpDetailModel.setData(g.operationDetail);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, aFilters);
				}
			},

			PurchOrgVH: function (oEvent, g) {
				var oSource = oEvent.getSource();
				var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PURCH_ORG"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/PurOrgSet",
						template: new sap.m.StandardListItem({
							title: "{Ekorg}",
							description: "{Ekotx}"
						})
					},
					confirm: function (E) {
						g.operationDetail.purchOrg = E.getParameters().selectedItem.getProperty("title");
						g.operationDetail.purchOrgVS = "None";
						tlOpDetailModel.setData(g.operationDetail);
					}
				};

				var q = "/PurOrgSet";
				var M = g.getView().getModel("valueHelp2");
				var aFilters = [];
				var inspPtSelectDialog = ValueHelpProvider.getSelectDialog(M, q, aFilters, settings, "Ekorg", "Ekotx");
				inspPtSelectDialog.open();
			},

			_PurchOrgchange: function (f, g) {
				var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
				var oSource = f.getSource();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/PurOrgSet";
					var aFilters = [new sap.ui.model.Filter("Ekorg", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							g.operationDetail.purchOrg = d.results[0].Ekorg;
							g.operationDetail.purchOrgVS = "None";
						} else {
							g.operationDetail.purchOrgVS = "Error";
						}
						tlOpDetailModel.setData(g.operationDetail);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.purchOrgVS = "Error";
						tlOpDetailModel.setData(g.operationDetail);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, aFilters);
				}
			},

			/////////// Location Data ValueHelps - Item Maintainence Plan ////////////////
			maintPlantIPVH: function (oEvent, g) {
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();

				var settings = {
					title: g.getView().getModel("i18n").getProperty("MAINT_PLANT"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PLANT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SEARCHTERM2}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SEARCHTERM1}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>POST_CODE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>Name2}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>Name1}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>ADDR_VERSION}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE_DESC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>PLAN_PLANT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>PLPLANT_DESC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>CC_PLANT}"
								})
							]
						})
					],
					items: {
						path: "/MaintPlantVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Werks}"
								}),
								new sap.m.Text({
									text: "{Sort2}"
								}),
								new sap.m.Text({
									text: "{Sort1}"
								}),
								new sap.m.Text({
									text: "{PostCode1}"
								}),
								new sap.m.Text({
									text: "{City1}"
								}),
								new sap.m.Text({
									text: "{Name2}"
								}),
								new sap.m.Text({
									text: "{Name1}"
								}),
								new sap.m.Text({
									text: "{Nation}"
								}),
								new sap.m.Text({
									text: "{Bukrs}"
								}),
								new sap.m.Text({
									text: "{Butxt}"
								}),
								new sap.m.Text({
									text: "{IWerk}"
								}),
								new sap.m.Text({
									text: "{IName1}"
								}),
								new sap.m.Text({
									text: "{Kokrs}"
								})
							]
						})
					},
					confirm: function (E) {
						oItem.SwerkMil = E.getParameter("selectedItem").getCells()[0].getText();
						oItem.Name1 = E.getParameter("selectedItem").getCells()[6].getText();
						oItem.SwerkMilVS = "None";
						itemModel.setData(oItem);
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};
				var sPath = "/MaintPlantVHSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp2");
				var cells = [
					new sap.m.Text({
						text: "{Werks}"
					}),
					new sap.m.Text({
						text: "{Sort2}"
					}),
					new sap.m.Text({
						text: "{Sort1}"
					}),
					new sap.m.Text({
						text: "{PostCode1}"
					}),
					new sap.m.Text({
						text: "{City1}"
					}),
					new sap.m.Text({
						text: "{Name2}"
					}),
					new sap.m.Text({
						text: "{Name1}"
					}),
					new sap.m.Text({
						text: "{Nation}"
					}),
					new sap.m.Text({
						text: "{Bukrs}"
					}),
					new sap.m.Text({
						text: "{Butxt}"
					}),
					new sap.m.Text({
						text: "{IWerk}"
					}),
					new sap.m.Text({
						text: "{IName1}"
					}),
					new sap.m.Text({
						text: "{Kokrs}"
					})
				];

				var mPlantSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Werks", "Name1");
				mPlantSelectDialog.open();
				mPlantSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			maintPlantIPchange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/MaintPlantVHSet";
					var oFilters = [new sap.ui.model.Filter("Werks", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oItem.SwerkMil = d.results[0].SwerkMil;
							oItem.Name1 = d.results[0].Name1;
							oItem.SwerkMilVS = "None";
							itemModel.setData(oItem);
						} else {
							oItem.Name1 = "";
							oItem.SwerkMilVS = "Error";
							itemModel.setData(oItem);
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oItem.Name1 = "";
						oItem.SwerkMilVS = "Error";
						itemModel.setData(oItem);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oItem.Name1 = "";
					oItem.SwerkMilVS = "None";
					itemModel.setData(oItem);
				}
			},

			LocationIPVH: function (oEvent, g) {
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("LOC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PLANT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LOC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>NAME}"
								})
							]
						})
					],
					items: {
						path: "/LocationVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Werks}"
								}),
								new sap.m.Text({
									text: "{Stand}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								})
							]
						})

					},
					confirm: function (E) {
						oItem.StortMil = E.getParameter("selectedItem").getCells()[1].getText();
						oItem.Locationdesc = E.getParameter("selectedItem").getCells()[2].getText();
						oItem.StortMilVS = "None";
						itemModel.setData(oItem);
					}
				};

				var sPath = "/LocationVHSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Werks}"
					}),
					new sap.m.Text({
						text: "{Stand}"
					}),
					new sap.m.Text({
						text: "{Ktext}"
					})
				];

				var locSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Stand", "Ktext");
				locSelectDialog.open();
				locSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			LocationIPchange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/LocationVHSet";
					var oFilters = [new sap.ui.model.Filter("Stand", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oItem.StortMil = d.results[0].Stand;
							oItem.Locationdesc = d.results[0].Ktext;
							oItem.StortMilVS = "None";
							itemModel.setData(oItem);
						} else {
							oItem.Locationdesc = "";
							oItem.StortMilVS = "Error";
							itemModel.setData(oItem);
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oItem.Locationdesc = "";
						oItem.StortMilVS = "Error";
						itemModel.setData(oItem);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oItem.Locationdesc = "";
					oItem.StortMilVS = "None";
					itemModel.setData(oItem);
				}
			},

			PlntSecIPVH: function (oEvent, g) {
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("PL_SEC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PLANT_SEC}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PERSON_RESP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PHONE}"
								})
							]
						})
					],
					items: {
						path: "/PlantSectionSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Beber}"
								}),
								new sap.m.Text({
									text: "{Fing}"
								}),
								new sap.m.Text({
									text: "{Tele}"
								})
							]
						})
					},
					confirm: function (E) {
						oItem.BeberMil = E.getParameter("selectedItem").getCells()[0].getText();
						oItem.Fing = E.getParameter("selectedItem").getCells()[1].getText();
						// oItem.StortMil = E.getParameter("selectedItem").getCells()[2].getText();
						oItem.BeberMilVS = "None";
						itemModel.setData(oItem);
					}
				};

				var sPath = "/PlantSectionSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Beber}"
					}),
					new sap.m.Text({
						text: "{Fing}"
					}),
					new sap.m.Text({
						text: "{Tele}"
					})
				];

				var ccSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Beber", "Fing");
				ccSelectDialog.open();
				ccSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			PlntSecIPchange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/PlantSectionSet";
					var oFilters = [new sap.ui.model.Filter("Beber", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oItem.BeberMil = d.results[0].Beber;
							oItem.Fing = d.results[0].Fing;
							// oJsonData.Tele = d.results[0].Tele;
							oItem.BeberMilVS = "None";
							itemModel.setData(oItem);
						} else {
							oItem.Fing = "";
							// oJsonData.Tele = d.results[0].Tele;
							oItem.BeberMilVS = "Error";
							itemModel.setData(oItem);

						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oItem.Fing = "";
						// oJsonData.Tele = d.results[0].Tele;
						oItem.BeberMilVS = "Error";
						itemModel.setData(oItem);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oItem.Fing = "";
					// oJsonData.Tele = d.results[0].Tele;
					oItem.BeberMilVS = "None";
					itemModel.setData(oItem);
				}
			},

			WrkCtrIPVH: function (oEvent, g) {
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var wcSelectDialog = new sap.m.TableSelectDialog({
					title: g.getView().getModel("i18n").getProperty("WC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [
						new sap.m.Column({
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
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Work Center"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Description"
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
						})
					],
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
						oItem.ArbplIl = E.getParameter("selectedItem").getCells()[2].getText();
						oItem.Workcenterdesc = E.getParameter("selectedItem").getCells()[3].getText();
						oItem.ArbplIlVS = "None";
						itemModel.setData(oItem);
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				});

				var sPath = "/WorkCenterVHSet";
				var oModel = g.getView().getModel("valueHelp");
				var oFilters = [];
				var fnSuccess = function (h) {
					if (h.results.length > 0) {
						if (sap.ui.getCore().getModel("AIWListWCModel")) {
							var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].wc) {
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
							}
						}
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
						e.setSizeLimit(h.results.length);
						e.isSizeLimit = h.results.length;
						wcSelectDialog.setModel(e);
						// wcSelectDialog.setGrowingThreshold(h.results.length);
						wcSelectDialog.bindAggregation("items", "/results", I);
					} else {
						wcSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
					}
				};
				var fnError = function () {};
				g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				wcSelectDialog.open();
			},

			WrkCtrIPchange: function (event, g) {
				var oSource = event.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/WorkCenterVHSet";
					var oFilters = [new sap.ui.model.Filter("Arbpl", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oItem.ArbplIl = d.results[0].Arbpl;
							oItem.Workcenterdesc = d.results[0].Ktext;
							oItem.ArbplIlVS = "None";
						} else {
							oItem.Workcenterdesc = "";
							oItem.ArbplIlVS = "Error";
						}
						itemModel.setData(oItem);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oItem.Workcenterdesc = "";
						oItem.ArbplIlVS = "Error";
						itemModel.setData(oItem);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oItem.Workcenterdesc = "";
					oItem.ArbplIlVS = "None";
					itemModel.setData(oItem);
				}
			},

			AbcIndIPVH: function (oEvent, g) {
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("ABC_IND"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/ABCIndicatorSet",
						template: new sap.m.StandardListItem({
							title: "{Abckz}",
							description: "{Abctx}"
						})
					},
					confirm: function (E) {
						oItem.AbckzIl = E.getParameters().selectedItem.getProperty("title");
						oItem.Abctx = E.getParameters().selectedItem.getProperty("description");
						oItem.AbckzIlVS = "None";
						itemModel.setData(oItem);
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Abckz", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Abctx", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};

				var q = "/ABCIndicatorSet";
				var M = g.getView().getModel("valueHelp");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Abckz", "Abctx");
				abcSelectDialog.open();
			},

			AbcIndIPchange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/ABCIndicatorSet";
					var oFilters = [new sap.ui.model.Filter("Abckz", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oItem.AbckzIl = d.results[0].Abckz;
							oItem.Abctx = d.results[0].Abctx;
							oItem.AbckzIlVS = "None";
						} else {
							oItem.Abctx = "";
							oItem.AbckzIlVS = "Error";
						}
						itemModel.setData(oItem);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oItem.Abctx = "";
						oItem.AbckzIlVS = "Error";
						itemModel.setData(oItem);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oItem.Abctx = "";
					oItem.AbckzIlVS = "None";
					itemModel.setData(oItem);
				}
			},

			/////////////////// Account Assignment ValueHelps ////////////////////////

			CompCodeIPVH: function (oEvent, g) {
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("COMPCODE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>COMP_NAME}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>xtxt.CURRENCY}"
								})
							]
						})
					],
					items: {
						path: "/CompanyCodeVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Bukrs}"
								}),
								new sap.m.Text({
									text: "{Butxt}"
								}),
								new sap.m.Text({
									text: "{Ort01}"
								}),
								new sap.m.Text({
									text: "{Waers}"
								})
							]
						})
					},
					confirm: function (E) {
						oItem.BukrsMil = E.getParameter("selectedItem").getCells()[0].getText();
						oItem.Butxt = E.getParameter("selectedItem").getCells()[1].getText();
						oItem.City = E.getParameter("selectedItem").getCells()[2].getText();
						oItem.BukrsMilVS = "None";
						itemModel.setData(oItem);
					}
				};

				var sPath = "/CompanyCodeVHSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp");
				var cells = [
					new sap.m.Text({
						text: "{Bukrs}"
					}),
					new sap.m.Text({
						text: "{Butxt}"
					}),
					new sap.m.Text({
						text: "{Ort01}"
					}),
					new sap.m.Text({
						text: "{Waers}"
					})
				];

				var ccSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Bukrs", "Butxt");
				ccSelectDialog.open();
				ccSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			CompCodeIPchange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/CompanyCodeVHSet";
					var oFilters = [new sap.ui.model.Filter("Bukrs", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oItem.BukrsMil = d.results[0].Bukrs;
							oItem.Butxt = d.results[0].Butxt;
							oItem.City = d.results[0].Ort01;
							oItem.BukrsMilVS = "None";
							itemModel.setData(oItem);
						} else {
							oItem.Butxt = "";
							oItem.City = "";
							oItem.BukrsMilVS = "Error";
							itemModel.setData(oItem);
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oItem.Butxt = "";
						oItem.City = "";
						oItem.BukrsMilVS = "Error";
						itemModel.setData(oItem);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oItem.Butxt = "";
					oItem.City = "";
					oItem.BukrsMilVS = "None";
					itemModel.setData(oItem);
				}
			},

			AssetIPVH: function (oEvent, g) {
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var settings = {
					title: "Asset",
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Asset"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Sub. Number"
								})
							]
						}),
						new sap.m.Column({
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
						path: "/AssetNumberSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Bukrs}"
								}),
								new sap.m.Text({
									text: "{Anln1}"
								}),
								new sap.m.Text({
									text: "{Anln2}"
								}),
								new sap.m.Text({
									text: "{Txt50}"
								})
							]
						})
					},
					confirm: function (E) {
						oItem.Anln1Mil = E.getParameter("selectedItem").getCells()[1].getText();
						oItem.Txt50 = E.getParameter("selectedItem").getCells()[3].getText();
						oItem.Anln2Mil = E.getParameter("selectedItem").getCells()[2].getText();
						oItem.Anln1MilVS = "None";
						oItem.Anln2MilVS = "None";
						itemModel.setData(oItem);
					}
				};

				var sPath = "/AssetNumberSet";
				var oFilters = [new sap.ui.model.Filter("Bukrs", "EQ", oItem.BukrsMil)];
				var oModel = g.getView().getModel("valueHelp2");
				var cells = [
					new sap.m.Text({
						text: "{Bukrs}"
					}),
					new sap.m.Text({
						text: "{Anln1}"
					}),
					new sap.m.Text({
						text: "{Anln2}"
					}),
					new sap.m.Text({
						text: "{Txt50}"
					})
				];

				var ccSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Anln1", "Txt50");
				ccSelectDialog.open();
				ccSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},
			AssetIPchange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/AssetNumberSet";
					var oFilters = [new sap.ui.model.Filter("Bukrs", "EQ", oItem.BukrsMil), new sap.ui.model.Filter("Anln1", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oItem.Anln1Mil = d.results[0].Anln1;
							oItem.Txt50 = d.results[0].Txt50;
							oItem.Anln2Mil = d.results[0].Anln2;
							oItem.Anln1MilVS = "None";
							oItem.Anln2MilVS = "None";
							itemModel.setData(oItem);
						} else {
							oItem.Txt50 = "";
							oItem.Anln1MilVS = "Error";
							itemModel.setData(oItem);
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oItem.Txt50 = "";
						oItem.Anln1MilVS = "Error";
						itemModel.setData(oItem);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oItem.Txt50 = "";
					oItem.Anln1MilVS = "None";
					itemModel.setData(oItem);
				}
			},

			SubIPVH: function (oEvent, g) {
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var settings = {
					title: "Sub. Number",
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Asset"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Sub. Number"
								})
							]
						}),
						new sap.m.Column({
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
						path: "/AssetNumberSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Bukrs}"
								}),
								new sap.m.Text({
									text: "{Anln1}"
								}),
								new sap.m.Text({
									text: "{Anln2}"
								}),
								new sap.m.Text({
									text: "{Txt50}"
								})
							]
						})
					},
					confirm: function (E) {
						oItem.Anln1Mil = E.getParameter("selectedItem").getCells()[1].getText();
						oItem.Txt50 = E.getParameter("selectedItem").getCells()[3].getText();
						oItem.Anln2Mil = E.getParameter("selectedItem").getCells()[2].getText();
						oItem.Anln1MilVS = "None";
						oItem.Anln2MilVS = "None";
						itemModel.setData(oItem);
					}
				};

				var sPath = "/AssetNumberSet";
				var oFilters = [new sap.ui.model.Filter("Bukrs", "EQ", oItem.BukrsMil), new sap.ui.model.Filter("Anln1", "EQ", oItem.Anln1Mil)];
				var oModel = g.getView().getModel("valueHelp2");
				var cells = [
					new sap.m.Text({
						text: "{Bukrs}"
					}),
					new sap.m.Text({
						text: "{Anln1}"
					}),
					new sap.m.Text({
						text: "{Anln2}"
					}),
					new sap.m.Text({
						text: "{Txt50}"
					})
				];

				var ccSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Anln2", "Txt50");
				ccSelectDialog.open();
				ccSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},
			SubIPchange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/AssetNumberSet";
					var oFilters = [new sap.ui.model.Filter("Bukrs", "EQ", oItem.BukrsMil), new sap.ui.model.Filter("Anln1", "EQ",
						oItem.Anln1Mil), new sap.ui.model.Filter("Anln2", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oItem.Anln1Mil = d.results[0].Anln1;
							oItem.Txt50 = d.results[0].Txt50;
							oItem.Anln2Mil = d.results[0].Anln2;
							oItem.Anln1MilVS = "None";
							oItem.Anln2MilVS = "None";
							itemModel.setData(oItem);
						} else {
							oItem.Anln2MilVS = "Error";
							itemModel.setData(oItem);
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oItem.Anln2MilVS = "Error";
						itemModel.setData(oItem);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oItem.Anln2MilVS = "None";
					itemModel.setData(oItem);
				}
			},

			ITBusinessIPVH: function (oEvent, g) {
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("IT_BA"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/BusinessAreaSet",
						template: new sap.m.StandardListItem({
							title: "{Gsber}",
							description: "{Gtext}"
						})
					},
					confirm: function (E) {
						oItem.GsberIl = E.getParameters().selectedItem.getProperty("title");
						oItem.Gtext = E.getParameters().selectedItem.getProperty("description");
						oItem.GsberIlVS = "None";
						itemModel.setData(oItem);
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Gsber", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Gtext", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};

				var q = "/BusinessAreaSet";
				var M = g.getView().getModel("valueHelp2");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Gsber", "Gtext");
				abcSelectDialog.open();
			},

			ITBusinessIPchange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/BusinessAreaSet";
					var oFilters = [new sap.ui.model.Filter("Gsber", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oItem.GsberIl = d.results[0].Gsber;
							oItem.Gtext = d.results[0].Gtext;
							oItem.GsberIlVS = "None";
						} else {
							oItem.Gtext = "";
							oItem.GsberIlVS = "Error";
						}
						itemModel.setData(oItem);
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oItem.Gtext = "";
						oItem.GsberIlVS = "Error";
						itemModel.setData(oItem);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oItem.Abctx = "";
					oItem.GsberIlVS = "None";
					itemModel.setData(oItem);
				}
			},

			CostCenterIPVH: function (oEvent, g) {
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("CC"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>CC}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CCTR_CATGRY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CO_AREA}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PERSON_RESP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>USR_RESP}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SHRT_TXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>LANGUAGE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>VALID_FRM}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>VALID_TO}"
								})
							]
						})
					],
					items: {
						path: "/CostCenterVHSet",
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
						})
					},
					confirm: function (E) {
						oItem.KostlMil = E.getParameter("selectedItem").getCells()[0].getText();
						oItem.KokrsMil = E.getParameter("selectedItem").getCells()[2].getText();
						oItem.Contareaname = E.getParameter("selectedItem").getCells()[6].getText();
						oItem.KostlMilVS = "None";
						itemModel.setData(oItem);
					}
				};

				var sPath = "/CostCenterVHSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp2");
				var cells = [
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
				];

				var ccostcSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Kostl", "Mctxt");
				ccostcSelectDialog.open();
				ccostcSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_changeCostCenter: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					a = a.toUpperCase();
					var sPath = "/CostCenterVHSet";
					var oFilters = [new sap.ui.model.Filter("Kostl", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						if (d.results.length > 0) {
							oItem.KostlMil = d.results[0].Kostl;
							oItem.Contareaname = d.results[0].Mctxt;
							oItem.KokrsMil = d.results[0].Kokrs;
							oItem.KostlMilVS = "None";
							itemModel.setData(oItem);
						} else {
							oItem.Contareaname = "";
							oItem.KostlMilVS = "Error";
							itemModel.setData(oItem);
						}
					};
					var fnError = function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oItem.Contareaname = "";
						oItem.KokrsMil = "";
						oItem.KostlMilVS = "Error";
						itemModel.setData(oItem);
					};
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oItem.Contareaname = "";
					oItem.KokrsMil = "";
					oItem.KostlMilVS = "None";
					itemModel.setData(oItem);
				}
			},

			WBSEleIPVH: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();

				var settings = {
					title: "{i18n>WBS_TXT}",
					noDataText: "{i18n>LOAD}" + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>DESC_TXT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>WBS_TXT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SHORTID}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>PROJDEF}"
								})
							]
						})
					],
					items: {
						path: "/WBSElementSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Post1}"
								}),
								new sap.m.Text({
									text: "{Posid}"
								}),
								new sap.m.Text({
									text: "{Poski}"
								}),
								new sap.m.Text({
									text: "{Objnr}"
								})
							]
						})

					},
					confirm: function (E) {
						oItem.Posid = E.getParameter("selectedItem").getCells()[1].getText();
						oItem.Post1 = E.getParameter("selectedItem").getCells()[0].getText();
						oItem.PosidVS = "None";
						itemModel.setData(oItem);
					}
				};

				var sPath = "/WBSElementSet";
				var oFilter = [];
				var cells = [
					new sap.m.Text({
						text: "{Post1}"
					}),
					new sap.m.Text({
						text: "{Posid}"
					}),
					new sap.m.Text({
						text: "{Poski}"
					}),
					new sap.m.Text({
						text: "{Objnr}"
					})
				];
				var WbsSelectDialog = ValueHelpProvider.getValueHelp(M, sPath, cells, oFilter, settings, "Post1", "Posid");
				WbsSelectDialog.open();
				WbsSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			WBSEleIPchange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var oFilter = [new sap.ui.model.Filter("Posid", "EQ", a)];
					M.read("/WBSElementSet", {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								oItem.Posid = r.results[0].Posid;
								oItem.Post1 = r.results[0].Post1;
								oItem.PosidVS = "None";
								itemModel.setData(oItem);
							} else {
								oItem.Post1 = "";
								oItem.PosidVS = "Error";
								itemModel.setData(oItem);
							}
						},
						error: function (err) {
							oItem.Post1 = "";
							oItem.PosidVS = "Error";
							itemModel.setData(oItem);
						}
					});
				} else {
					oItem.Post1 = "";
					oItem.PosidVS = "None";
					itemModel.setData(oItem);
				}
			},

			SetlOrdIPVH: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();

				var settings = {
					title: "{i18n>SETTLE_ORD}",
					noDataText: "{i18n>LOAD}" + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "CO Area"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Order Type"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Order"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Descrption"
								})
							]
						})
					],
					items: {
						path: "/SettleOrderVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Kokrs}"
								}),
								new sap.m.Text({
									text: "{Auart}"
								}),
								new sap.m.Text({
									text: "{Aufnr}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								})
							]
						})

					},
					confirm: function (E) {
						oItem.AufnrIl = E.getParameter("selectedItem").getCells()[2].getText();
						oItem.SettleOrdDesc = E.getParameter("selectedItem").getCells()[3].getText();
						oItem.AufnrIlVS = "None";
						itemModel.setData(oItem);
					}
				};

				var sPath = "/SettleOrderVHSet";
				var oFilter = [new sap.ui.model.Filter("Kokrs", "EQ", oItem.KokrsMil)];
				var cells = [
					new sap.m.Text({
						text: "{Kokrs}"
					}),
					new sap.m.Text({
						text: "{Auart}"
					}),
					new sap.m.Text({
						text: "{Aufnr}"
					}),
					new sap.m.Text({
						text: "{Ktext}"
					})
				];
				var WbsSelectDialog = ValueHelpProvider.getValueHelp(M, sPath, cells, oFilter, settings, "Aufnr", "Ktext");
				WbsSelectDialog.open();
				WbsSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			SetlOrdIPchange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var oFilter = [new sap.ui.model.Filter("Aufnr", "EQ", a), new sap.ui.model.Filter("Kokrs", "EQ", oItem.KokrsMil)];
					M.read("/SettleOrderVHSet", {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								oItem.AufnrIl = r.results[0].Aufnr;
								oItem.SettleOrdDesc = r.results[0].Ktext;
								oItem.AufnrIlVS = "None";
								itemModel.setData(oItem);
							} else {
								oItem.SettleOrdDesc = "";
								oItem.AufnrIlVS = "Error";
								itemModel.setData(oItem);
							}
						},
						error: function (err) {
							oItem.SettleOrdDesc = "";
							oItem.AufnrIlVS = "Error";
							itemModel.setData(oItem);
						}
					});
				} else {
					oItem.SettleOrdDesc = "";
					oItem.AufnrIlVS = "None";
					itemModel.setData(oItem);
				}
			},

			SerialNumVH: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();

				var settings = {
					title: "Serial Number",
					noDataText: "{i18n>LOAD}" + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "Serial Number"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Material"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "UII"
								})
							]
						})
					],
					items: {
						path: "/EqsnsSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Sernr}"
								}),
								new sap.m.Text({
									text: "{Matnr}"
								}),
								new sap.m.Text({
									text: "{Uii}"
								})
							]
						})

					},
					confirm: function (E) {
						oItem.Serialnr = E.getParameter("selectedItem").getCells()[0].getText();
						oItem.Sermat = E.getParameter("selectedItem").getCells()[1].getText();
						oItem.UiiMitem = E.getParameter("selectedItem").getCells()[2].getText();
						oItem.SerialnrVS = "None";
						oItem.SermatVS = "None";
						oItem.UiiMitemVS = "None";
						itemModel.setData(oItem);
					}
				};

				var sPath = "/EqsnsSet";
				var oFilter = [];
				var cells = [
					new sap.m.Text({
						text: "{Sernr}"
					}),
					new sap.m.Text({
						text: "{Matnr}"
					}),
					new sap.m.Text({
						text: "{Uii}"
					})
				];
				var snSelectDialog = ValueHelpProvider.getValueHelp(M, sPath, cells, oFilter, settings, "Sernr", "Matnr");
				snSelectDialog.open();
				snSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			SerialNumChange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var oFilter = [new sap.ui.model.Filter("Sernr", "EQ", a)];
					M.read("/EqsnsSet", {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								oItem.Serialnr = r.results[0].Sernr;
								oItem.Sermat = r.results[0].Matnr;
								oItem.UiiMitem = r.results[0].Uii;
								oItem.SerialnrVS = "None";
								oItem.SermatVS = "None";
								oItem.UiiMitemVS = "None";
								itemModel.setData(oItem);
							} else {
								oItem.SerialnrVS = "Error";
								itemModel.setData(oItem);
							}
						},
						error: function (err) {
							oItem.SerialnrVS = "Error";
							itemModel.setData(oItem);
						}
					});
				} else {
					oItem.SerialnrVS = "None";
					itemModel.setData(oItem);
				}
			},

			UIIVH: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();

				var settings = {
					title: "UII",
					noDataText: "{i18n>LOAD}" + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "UII"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Material"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Serial Number"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Equipement"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Equi. Desc."
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "UII Plant"
								})
							]
						})
					],
					items: {
						path: "/UIIVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Uii}"
								}),
								new sap.m.Text({
									text: "{Matnr}"
								}),
								new sap.m.Text({
									text: "{Sernr}"
								}),
								new sap.m.Text({
									text: "{Equnr}"
								}),
								new sap.m.Text({
									text: "{Eqktu}"
								}),
								new sap.m.Text({
									text: "{UiiPlant}"
								})
							]
						})

					},
					confirm: function (E) {
						oItem.UiiMitem = E.getParameter("selectedItem").getCells()[0].getText();
						oItem.Serialnr = E.getParameter("selectedItem").getCells()[2].getText();
						oItem.Sermat = E.getParameter("selectedItem").getCells()[1].getText();
						oItem.Equnr = E.getParameter("selectedItem").getCells()[3].getText();
						oItem.Eqktx = E.getParameter("selectedItem").getCells()[4].getText();
						oItem.UiiMitemVS = "None";
						oItem.SerialnrVS = "None";
						oItem.SermatVS = "None";
						oItem.EqunrVS = "None";
						itemModel.setData(oItem);
					}
				};

				var sPath = "/UIIVHSet";
				var oFilter = [];
				var cells = [
					new sap.m.Text({
						text: "{Uii}"
					}),
					new sap.m.Text({
						text: "{Matnr}"
					}),
					new sap.m.Text({
						text: "{Sernr}"
					}),
					new sap.m.Text({
						text: "{Equnr}"
					}),
					new sap.m.Text({
						text: "{Eqktu}"
					}),
					new sap.m.Text({
						text: "{UiiPlant}"
					})
				];
				var uiiSelectDialog = ValueHelpProvider.getValueHelp(M, sPath, cells, oFilter, settings, "Uii", "Matnr");
				uiiSelectDialog.open();
				uiiSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			UIIChange: function (f, g) {
				var oSource = f.getSource();
				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var oFilter = [new sap.ui.model.Filter("Uii", "EQ", a)];
					M.read("/UIIVHSet", {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								oItem.UiiMitem = r.results[0].Uii;
								oItem.Serialnr = r.results[0].Sernr;
								oItem.Sermat = r.results[0].Matnr;
								oItem.Equnr = r.results[0].Equnr;
								oItem.Eqktx = r.results[0].Eqktu;
								oItem.UiiMitemVS = "None";
								oItem.SerialnrVS = "None";
								oItem.SermatVS = "None";
								oItem.EqunrVS = "None";
								itemModel.setData(oItem);
							} else {
								oItem.UiiMitemVS = "Error";
								itemModel.setData(oItem);
							}
						},
						error: function (err) {
							oItem.UiiMitemVS = "Error";
							itemModel.setData(oItem);
						}
					});
				} else {
					oItem.UiiMitemVS = "None";
					itemModel.setData(oItem);
				}
			},

			CycleShrtTxtVH: function (oEvent, g, strategy) {
				var M = g.getView().getModel("valueHelp2");
				var mtlMaintPckg = g.getModel("mtlMaintPckg");
				var otlMaintPckg = mtlMaintPckg.getData();
				var sPath = oEvent.getSource().getParent().getBindingContextPath();

				var settings = {
					title: "Cycle short text",
					noDataText: "{i18n>LOAD}" + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "Strategy"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Package"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Cycle text"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Hier. Short text"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Cycle Short text"
								})
							]
						})
					],
					items: {
						path: "/MpackSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Strat}"
								}),
								new sap.m.Text({
									text: "{Paket}"
								}),
								new sap.m.Text({
									text: "{Ktex1}"
								}),
								new sap.m.Text({
									text: "{Ktxhi}"
								}),
								new sap.m.Text({
									text: "{Kzyk1}"
								})
							]
						})

					},
					confirm: function (E) {
						mtlMaintPckg.getProperty(sPath).Paket = E.getParameter("selectedItem").getCells()[1].getText();
						mtlMaintPckg.getProperty(sPath).Ktex1 = E.getParameter("selectedItem").getCells()[2].getText();
						mtlMaintPckg.getProperty(sPath).Ktxhi = E.getParameter("selectedItem").getCells()[3].getText();
						mtlMaintPckg.getProperty(sPath).Kzyk1 = E.getParameter("selectedItem").getCells()[4].getText();
						mtlMaintPckg.getProperty(sPath).Kzyk1VSVS = "None";
						mtlMaintPckg.refresh();
					}
				};

				var q = "/MpackSet";
				var aFilter = [new sap.ui.model.Filter("Strat", "EQ", otlMaintPckg.Strat)]
				var cells = [
					new sap.m.Text({
						text: "{Strat}"
					}),
					new sap.m.Text({
						text: "{Paket}"
					}),
					new sap.m.Text({
						text: "{Ktex1}"
					}),
					new sap.m.Text({
						text: "{Ktxhi}"
					}),
					new sap.m.Text({
						text: "{Kzyk1}"
					})
				];
				var cstSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, aFilter, settings, "Ktex1", "Kzyk1");
				cstSelectDialog.open();
				cstSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			_CycleShrtTxtchange: function (f, g) {
				var oSource = f.getSource();
				var mtlMaintPckg = g.getModel("mtlMaintPckg");
				var otlMaintPckg = mtlMaintPckg.getData();
				var sPath = oSource.getParent().getBindingContextPath();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var aFilter = [new sap.ui.model.Filter("Strat", "EQ", otlMaintPckg.Strat)]
					M.read("/MpackSet", {
						filters: aFilter,
						success: function (r) {
							if (r.results.length > 0) {
								mtlMaintPckg.getProperty(sPath).Paket = r.results[0].Paket;
								mtlMaintPckg.getProperty(sPath).Ktex1 = r.results[0].Ktex1;
								mtlMaintPckg.getProperty(sPath).Ktxhi = r.results[0].Ktxhi;
								mtlMaintPckg.getProperty(sPath).Kzyk1 = r.results[0].Kzyk1;
								mtlMaintPckg.getProperty(sPath).Kzyk1VSVS = "None";
								mtlMaintPckg.refresh();
							} else {
								mtlMaintPckg.getProperty(sPath).Kzyk1VSVS = "Error";
								mtlMaintPckg.refresh();
							}
						},
						error: function (err) {
							mtlMaintPckg.getProperty(sPath).Kzyk1VSVS = "Error";
							mtlMaintPckg.refresh();
						}
					});
				} else {
					mtlMaintPckg.getProperty(sPath).Kzyk1VSVS = "None";
					mtlMaintPckg.refresh();
				}
			},

			/////////////////////////////////// TL PRT ////////////////////////////////////////////////////////
			prtCtrlKeyVH: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var tlDetailModel = g.getView().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				var sPath = oEvent.getSource().getParent().getBindingContextPath();

				var settings = {
					title: "Control Key",
					noDataText: "{i18n>LOAD}" + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "PRT Control Profile"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Schedule"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Calculate"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Control"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Print"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Expand"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Ctrl Key Text"
								})
							]
						})
					],
					items: {
						path: "/PrtCtlProfSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Steuf}"
								}),
								new sap.m.Text({
									text: "{path:'Xterm', formatter:'.formatter.truetoX'}"
								}),
								new sap.m.Text({
									text: "{path:'Xkalk', formatter:'.formatter.truetoX'}"
								}),
								new sap.m.Text({
									text: "{path:'Xrueck', formatter:'.formatter.truetoX'}"
								}),
								new sap.m.Text({
									text: "{path:'Xdruck', formatter:'.formatter.truetoX'}"
								}),
								new sap.m.Text({
									text: "{path:'Xexpand', formatter:'.formatter.truetoX'}"
								}),
								new sap.m.Text({
									text: "{Stftxt}"
								})
							]
						})

					},
					confirm: function (E) {
						tlDetailModel.getProperty(sPath).PRTCtrl = E.getParameter("selectedItem").getCells()[0].getText();
						tlDetailModel.getProperty(sPath).PRTCtrlDesc = E.getParameter("selectedItem").getCells()[6].getText();
						tlDetailModel.getProperty(sPath).PRTCtrlVS = "None";
						tlDetailModel.refresh();
					}
				};

				var q = "/PrtCtlProfSet";
				var aFilter = []
				var cells = [
					new sap.m.Text({
						text: "{Steuf}"
					}),
					new sap.m.Text({
						text: "{path:'Xterm', formatter:'.formatter.truetoX'}"
					}),
					new sap.m.Text({
						text: "{path:'Xkalk', formatter:'.formatter.truetoX'}"
					}),
					new sap.m.Text({
						text: "{path:'Xrueck', formatter:'.formatter.truetoX'}"
					}),
					new sap.m.Text({
						text: "{path:'Xdruck', formatter:'.formatter.truetoX'}"
					}),
					new sap.m.Text({
						text: "{path:'Xexpand', formatter:'.formatter.truetoX'}"
					}),
					new sap.m.Text({
						text: "{Stftxt}"
					})
				];
				var prtCKtSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, aFilter, settings, "Steuf", "Stftxt");
				prtCKtSelectDialog.open();
				prtCKtSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			prtCtrlKeyChange: function (f, g) {
				var oSource = f.getSource();
				var tlDetailModel = g.getView().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				var sPath = oSource.getParent().getBindingContextPath();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var aFilter = [new sap.ui.model.Filter("Steuf", "EQ", a)]
					M.read("/PrtCtlProfSet", {
						filters: aFilter,
						success: function (r) {
							if (r.results.length > 0) {
								tlDetailModel.getProperty(sPath).PRTCtrl = r.results[0].Steuf;
								tlDetailModel.getProperty(sPath).PRTCtrlDesc = r.results[0].Stftxt;
								tlDetailModel.getProperty(sPath).PRTCtrlVS = "None";
								tlDetailModel.refresh();
							} else {
								tlDetailModel.getProperty(sPath).PRTCtrlVS = "Error";
								tlDetailModel.refresh();
							}
						},
						error: function (err) {
							tlDetailModel.getProperty(sPath).PRTCtrlVS = "Error";
							tlDetailModel.refresh();
						}
					});
				} else {
					tlDetailModel.getProperty(sPath).PRTCtrlVS = "None";
					tlDetailModel.refresh();
				}
			},

			////////////////////// TL Inspection Characteristics /////////////////////
			MastInspCharVH: function (oEvent, g) {
				var M = g.getView().getModel("valueHelp2");
				var tlDetailModel = g.getView().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				var sPath = oEvent.getSource().getParent().getBindingContextPath();

				var settings = {
					title: "Master Insp. Charac.",
					noDataText: "{i18n>LOAD}" + "...",
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
									text: "Mstr Insp. Charac."
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Version"
								})
							]
						})
					],
					items: {
						path: "/TLInspCharVHSet",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Zaehler}"
								}),
								new sap.m.Text({
									text: "{Mkmnr}"
								}),
								new sap.m.Text({
									text: "{Version}"
								})
							]
						})

					},
					confirm: function (E) {
						tlDetailModel.getProperty(sPath).MastInspChar = E.getParameter("selectedItem").getCells()[1].getText();
						tlDetailModel.getProperty(sPath).ShrtTxt = E.getParameter("selectedItem").getCells()[1].getText();
						tlDetailModel.getProperty(sPath).Plant = E.getParameter("selectedItem").getCells()[0].getText();
						tlDetailModel.getProperty(sPath).Version = E.getParameter("selectedItem").getCells()[2].getText();
						tlDetailModel.getProperty(sPath).MastInspCharVS = "None";
						tlDetailModel.getProperty(sPath).VersionVS = "None";
						tlDetailModel.getProperty(sPath).InspMthdPlntVS = "None";
						tlDetailModel.refresh();
						g.readInspChar(tlDetailModel.getProperty(sPath).Plant, tlDetailModel.getProperty(sPath).MastInspChar, tlDetailModel.getProperty(sPath).Version, sPath);
					}
				};

				var q = "/TLInspCharVHSet";
				var aFilter = []
				var cells = [
					new sap.m.Text({
						text: "{Zaehler}"
					}),
					new sap.m.Text({
						text: "{Mkmnr}"
					}),
					new sap.m.Text({
						text: "{Version}"
					})
				];
				var inspSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, aFilter, settings, "Mkmnr", "Zaehler");
				inspSelectDialog.open();
				inspSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			MastInspCharChange: function (f, g) {
				var oSource = f.getSource();
				var tlDetailModel = g.getView().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				var sPath = oSource.getParent().getBindingContextPath();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var aFilter = [new sap.ui.model.Filter("Mkmnr", "EQ", a)]
					M.read("/TLInspCharVHSet", {
						filters: aFilter,
						success: function (r) {
							if (r.results.length > 0) {
								tlDetailModel.getProperty(sPath).MastInspChar = r.results[0].Mkmnr;
								tlDetailModel.getProperty(sPath).ShrtTxt = r.results[0].Mkmnr;
								tlDetailModel.getProperty(sPath).MastInspCharVS = "None";
								tlDetailModel.refresh();
								g.readInspChar(tlDetailModel.getProperty(sPath).Plant, tlDetailModel.getProperty(sPath).MastInspChar, tlDetailModel.getProperty(sPath).Version, sPath);
							} else {
								tlDetailModel.getProperty(sPath).MastInspCharVS = "Error";
								tlDetailModel.refresh();
							}
						},
						error: function (err) {
							tlDetailModel.getProperty(sPath).MastInspCharVS = "Error";
							tlDetailModel.refresh();
						}
					});
				} else {
					tlDetailModel.getProperty(sPath).MastInspCharVS = "None";
					tlDetailModel.refresh();
				}
			},

			ICPlantChange: function (f, g) {
				var oSource = f.getSource();
				var tlDetailModel = g.getView().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				var sPath = oSource.getParent().getBindingContextPath();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var aFilter = [new sap.ui.model.Filter("Zaehler", "EQ", a)]
					M.read("/TLInspCharVHSet", {
						filters: aFilter,
						success: function (r) {
							if (r.results.length > 0) {
								tlDetailModel.getProperty(sPath).Plant = r.results[0].Zaehler;
								tlDetailModel.getProperty(sPath).PlantVS = "None";
								tlDetailModel.refresh();
							} else {
								tlDetailModel.getProperty(sPath).PlantVS = "Error";
								tlDetailModel.refresh();
							}
						},
						error: function (err) {
							tlDetailModel.getProperty(sPath).PlantVS = "Error";
							tlDetailModel.refresh();
						}
					});
				} else {
					tlDetailModel.getProperty(sPath).PlantVS = "None";
					tlDetailModel.refresh();
				}
			},

			ICVersionChange: function (f, g) {
				var oSource = f.getSource();
				var tlDetailModel = g.getView().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				var sPath = oSource.getParent().getBindingContextPath();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var aFilter = [new sap.ui.model.Filter("Version", "EQ", a)]
					M.read("/TLInspCharVHSet", {
						filters: aFilter,
						success: function (r) {
							if (r.results.length > 0) {
								tlDetailModel.getProperty(sPath).Version = r.results[0].Version;
								tlDetailModel.getProperty(sPath).VersionVS = "None";
								tlDetailModel.refresh();
							} else {
								tlDetailModel.getProperty(sPath).VersionVS = "Error";
								tlDetailModel.refresh();
							}
						},
						error: function (err) {
							tlDetailModel.getProperty(sPath).VersionVS = "Error";
							tlDetailModel.refresh();
						}
					});
				} else {
					tlDetailModel.getProperty(sPath).VersionVS = "None";
					tlDetailModel.refresh();
				}
			},

			InspMthdPlntVH: function (oEvent, g) {
				var tlDetailModel = g.getView().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				var sPath = oEvent.getSource().getParent().getBindingContextPath();

				var settings = {
					title: "Insp. Method Plant",
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "{i18n>PLANT}"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SEARCHTERM2}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>SEARCHTERM1}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>POST_CODE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>CITY}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>Name2}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>Name1}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "{i18n>ADDR_VERSION}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>COMPCODE_DESC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>PLAN_PLANT}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>PLPLANT_DESC}"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "{i18n>CC_PLANT}"
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
									text: "{Plant}"
								}),
								new sap.m.Text({
									text: "{SearchTerm2}"
								}),
								new sap.m.Text({
									text: "{SearchTerm1}"
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
									text: "{AddrVersion}"
								}),
							]
						})
					},
					confirm: function (E) {
						tlDetailModel.getProperty(sPath).InspMthdPlnt = E.getParameter("selectedItem").getCells()[0].getText();
						tlDetailModel.getProperty(sPath).InspMthdPlntVS = "None";
						tlDetailModel.refresh();
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};
				var q = "/PlantVHSet";
				var oFilters = [];
				var oModel = g.getView().getModel("valueHelp2");
				var cells = [
					new sap.m.Text({
						text: "{Plant}"
					}),
					new sap.m.Text({
						text: "{SearchTerm2}"
					}),
					new sap.m.Text({
						text: "{SearchTerm1}"
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
						text: "{AddrVersion}"
					}),
				];

				var mPlantSelectDialog = ValueHelpProvider.getValueHelp(oModel, q, cells, oFilters, settings, "Plant", "Name1");
				mPlantSelectDialog.open();
				mPlantSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			},

			InspMthdPlntChange: function (oEvent, g) {
				var oSource = f.getSource();
				var tlDetailModel = g.getView().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				var sPath = oSource.getParent().getBindingContextPath();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var aFilter = [new sap.ui.model.Filter("Werks", "EQ", a)]
					M.read("/PlantVHSet", {
						filters: aFilter,
						success: function (r) {
							if (r.results.length > 0) {
								tlDetailModel.getProperty(sPath).InspMthdPlnt = r.results[0].Werks;
								tlDetailModel.getProperty(sPath).InspMthdPlntVS = "None";
								tlDetailModel.refresh();
							} else {
								tlDetailModel.getProperty(sPath).InspMthdPlntVS = "Error";
								tlDetailModel.refresh();
							}
						},
						error: function (err) {
							tlDetailModel.getProperty(sPath).InspMthdPlntVS = "Error";
							tlDetailModel.refresh();
						}
					});
				} else {
					tlDetailModel.getProperty(sPath).InspMthdPlntVS = "None";
					tlDetailModel.refresh();
				}
			},

			SampProcVH: function (oEvent, g) {
				var tlDetailModel = g.getView().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				var sPath = oEvent.getSource().getParent().getBindingContextPath();
				var settings = {
					title: "Sample Procedure",
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/TLSampPrcVHSet",
						template: new sap.m.StandardListItem({
							title: "{Stichprver}",
							description: "{Kurztext}"
						})
					},
					confirm: function (E) {
						tlDetailModel.getProperty(sPath).SampProc = E.getParameters().selectedItem.getProperty("title");
						tlDetailModel.getProperty(sPath).SampProcVS = "None";
						tlDetailModel.refresh();
					}
				};

				var q = "/TLSampPrcVHSet";
				var M = g.getView().getModel("valueHelp2");
				var tlUsgSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Stichprver", "Kurztext");
				tlUsgSelectDialog.open();
			},

			SampProcChange: function (oEvent, g) {
				var oSource = f.getSource();
				var tlDetailModel = g.getView().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				var sPath = oSource.getParent().getBindingContextPath();
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				var M = g.getView().getModel("valueHelp2");
				if (a !== "") {
					a = a.toUpperCase();
					var aFilter = [new sap.ui.model.Filter("Stichprver", "EQ", a)]
					M.read("/TLSampPrcVHSet", {
						filters: aFilter,
						success: function (r) {
							if (r.results.length > 0) {
								tlDetailModel.getProperty(sPath).SampProc = r.results[0].Stichprver;
								tlDetailModel.getProperty(sPath).SampProcVS = "None";
								tlDetailModel.refresh();
							} else {
								tlDetailModel.getProperty(sPath).SampProcVS = "Error";
								tlDetailModel.refresh();
							}
						},
						error: function (err) {
							tlDetailModel.getProperty(sPath).SampProcVS = "Error";
							tlDetailModel.refresh();
						}
					});
				} else {
					tlDetailModel.getProperty(sPath).SampProcVS = "None";
					tlDetailModel.refresh();
				}
			},

			///////////////////////////////////// DFPS ///////////////////////////////////////
			TailNoChange: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				// var c = oJsonData.SuperordinateEquip;
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/EqDfpsIdSet";
					var oFilters = [new sap.ui.model.Filter("Ident", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						g.BusyDialog.close();
						if (d.results.length > 0) {
							oJsonData.dfps.Tailno = d.results[0].Ident;
							oJsonData.dfps.TailnoVS = "Error";
							oJsonModel.setData(oJsonData);
							var msg = "Identifier " + d.results[0].Ident + " is already being used by equipment " + d.results[0].Ident;
							g.createMessagePopover(msg, "Error");
						} else {
							oJsonData.dfps.Tailno = a;
							oJsonData.dfps.TailnoVS = "None";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						g.BusyDialog.close();
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oJsonData.dfps.TailnoVS = "Error";
						oJsonModel.setData(oJsonData);
					};
					g.BusyDialog.open();
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.dfps.TailnoVS = "None";
					oJsonModel.setData(oJsonData);
				}
			},
			TailNoVH: function (oEvent, g) {
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("TAIL_NO"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/EqDfpsIdSet",
						template: new sap.m.StandardListItem({
							title: "{Ident}",
							description: "{Equnr}"
						})
					},
					confirm: function (E) {
						oJsonData.dfps.Tailno = E.getParameters().selectedItem.getProperty("title");
						oJsonData.dfps.TailnoVS = "Error";
						oJsonModel.setData(oJsonData);
						var desc = E.getParameters().selectedItem.getProperty("description");
						var msg = "Identifier " + oJsonData.dfps.Tailno + " is already being used by equipment " + desc;
						g.createMessagePopover(msg, "Error");
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Ident", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Equnr", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};

				var q = "/EqDfpsIdSet";
				var M = g.getView().getModel("valueHelp2");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Ident", "Equnr");
				abcSelectDialog.open();
			},

			DFPSSiteVH: function (oEvent, g) {
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("SITE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/EqDfpsSiteSet",
						template: new sap.m.StandardListItem({
							title: "{SiteId}",
							description: "{SiteDescr}"
						})
					},
					confirm: function (E) {
						oJsonData.dfps.Site = E.getParameters().selectedItem.getProperty("title");
						oJsonData.dfps.SiteDesc = E.getParameters().selectedItem.getProperty("description");
						oJsonData.dfps.SiteVS = "None";
						oJsonModel.setData(oJsonData);
						g.deriveDFPSdata();
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("SiteId", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("SiteDescr", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};

				var q = "/EqDfpsSiteSet";
				var M = g.getView().getModel("valueHelp2");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "SiteId", "SiteDescr");
				abcSelectDialog.open();
			},

			DFPSSiteChange: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				// var c = oJsonData.SuperordinateEquip;
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/EqDfpsSiteSet";
					var oFilters = [new sap.ui.model.Filter("SiteId", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						g.BusyDialog.close();
						if (d.results.length > 0) {
							oJsonData.dfps.Site = d.results[0].SiteId;
							oJsonData.dfps.SiteDesc = d.results[0].SiteId;
							oJsonData.dfps.SiteVS = "None";
							oJsonModel.setData(oJsonData);
							g.deriveDFPSdata();
						} else {
							oJsonData.dfps.SiteDesc = "";
							oJsonData.dfps.SiteVS = "Error";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						g.BusyDialog.close();
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oJsonData.dfps.SiteDesc = "";
						oJsonData.dfps.SiteVS = "Error";
						oJsonModel.setData(oJsonData);
					};
					g.BusyDialog.open();
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.dfps.SiteDesc = "";
					oJsonData.dfps.SiteVS = "None";
					oJsonModel.setData(oJsonData);
				}
			},

			DFPSAreaVH: function (oEvent, g) {
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("AREA"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/EqDfpsAreaIdSet",
						template: new sap.m.StandardListItem({
							title: "{AreaId}",
							description: "{AreaDescr}"
						})
					},
					confirm: function (E) {
						oJsonData.dfps.Area = E.getParameters().selectedItem.getProperty("title");
						oJsonData.dfps.AreaDesc = E.getParameters().selectedItem.getProperty("description");
						// oJsonData.dfps.SiteVS = "None";
						oJsonModel.setData(oJsonData);
						// g.deriveDFPSdata();
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("AreaId", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("AreaDescr", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};

				var q = "/EqDfpsAreaIdSet";
				var M = g.getView().getModel("valueHelp2");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "AreaId", "AreaDescr");
				abcSelectDialog.open();
			},

			DFPSAreaChange: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				// var c = oJsonData.SuperordinateEquip;
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/EqDfpsAreaIdSet";
					var oFilters = [new sap.ui.model.Filter("AreaId", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						g.BusyDialog.close();
						if (d.results.length > 0) {
							oJsonData.dfps.Area = d.results[0].AreaId;
							oJsonData.dfps.AreaDesc = d.results[0].AreaDescr;
							// oJsonData.dfps.SiteVS = "None";
							oJsonModel.setData(oJsonData);
							// g.deriveDFPSdata();
						} else {
							oJsonData.dfps.AreaDesc = "";
							// oJsonData.dfps.SiteVS = "Error";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						g.BusyDialog.close();
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oJsonData.dfps.AreaDesc = "";
						// oJsonData.dfps.SiteVS = "Error";
						oJsonModel.setData(oJsonData);
					};
					g.BusyDialog.open();
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.dfps.AreaDesc = "";
					// oJsonData.dfps.SiteVS = "None";
					oJsonModel.setData(oJsonData);
				}
			},

			DFPSSiteProVH: function (oEvent, g) {
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("SITE_PRFL"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/EqDfpsProfSet",
						template: new sap.m.StandardListItem({
							title: "{ProfileId}",
							description: "{TextS}"
						})
					},
					confirm: function (E) {
						oJsonData.dfps.SitePrfl = E.getParameters().selectedItem.getProperty("title");
						// oJsonData.dfps.SiteDesc = E.getParameters().selectedItem.getProperty("description");
						// oJsonData.dfps.SiteVS = "None";
						oJsonModel.setData(oJsonData);
						// g.deriveDFPSdata();
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("ProfileId", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("TextS", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};

				var q = "/EqDfpsProfSet";
				var M = g.getView().getModel("valueHelp2");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "ProfileId", "TextS");
				abcSelectDialog.open();
			},

			DFPSSiteProChange: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				// var c = oJsonData.SuperordinateEquip;
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/EqDfpsProfSet";
					var oFilters = [new sap.ui.model.Filter("ProfileId", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						g.BusyDialog.close();
						if (d.results.length > 0) {
							oJsonData.dfps.SitePrfl = d.results[0].ProfileId;
							// oJsonData.dfps.SiteDesc = d.results[0].SiteId;
							// oJsonData.dfps.SiteVS = "None";
							oJsonModel.setData(oJsonData);
							// g.deriveDFPSdata();
						} else {
							// oJsonData.dfps.SiteDesc = "";
							// oJsonData.dfps.SiteVS = "Error";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						g.BusyDialog.close();
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						// oJsonData.dfps.SiteDesc = "";
						// oJsonData.dfps.SiteVS = "Error";
						oJsonModel.setData(oJsonData);
					};
					g.BusyDialog.open();
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					// oJsonData.dfps.SiteDesc = "";
					// oJsonData.dfps.SiteVS = "None";
					oJsonModel.setData(oJsonData);
				}
			},

			DFPSAreaProVH: function (oEvent, g) {
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("AREA_PRFL"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/EqDfpsProfSet",
						template: new sap.m.StandardListItem({
							title: "{ProfileId}",
							description: "{TextS}"
						})
					},
					confirm: function (E) {
						oJsonData.dfps.AreaPrfl = E.getParameters().selectedItem.getProperty("title");
						// oJsonData.dfps.SiteDesc = E.getParameters().selectedItem.getProperty("description");
						// oJsonData.dfps.SiteVS = "None";
						oJsonModel.setData(oJsonData);
						// g.deriveDFPSdata();
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("ProfileId", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("TextS", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};

				var q = "/EqDfpsProfSet";
				var M = g.getView().getModel("valueHelp2");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "ProfileId", "TextS");
				abcSelectDialog.open();
			},

			DFPSAreaProChange: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				// var c = oJsonData.SuperordinateEquip;
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/EqDfpsProfSet";
					var oFilters = [new sap.ui.model.Filter("ProfileId", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						g.BusyDialog.close();
						if (d.results.length > 0) {
							oJsonData.dfps.AreaPrfl = d.results[0].ProfileId;
							// oJsonData.dfps.SiteDesc = d.results[0].SiteId;
							// oJsonData.dfps.SiteVS = "None";
							oJsonModel.setData(oJsonData);
							// g.deriveDFPSdata();
						} else {
							// oJsonData.dfps.SiteDesc = "";
							// oJsonData.dfps.SiteVS = "Error";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						g.BusyDialog.close();
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						// oJsonData.dfps.SiteDesc = "";
						// oJsonData.dfps.SiteVS = "Error";
						oJsonModel.setData(oJsonData);
					};
					g.BusyDialog.open();
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					// oJsonData.dfps.SiteDesc = "";
					// oJsonData.dfps.SiteVS = "None";
					oJsonModel.setData(oJsonData);
				}
			},

			ModelIdWsVH: function (oEvent, g) {
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				var settings = {
					title: g.getView().getModel("i18n").getProperty("ModelIdWsVH"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/EqDfpsModelIdSet",
						template: new sap.m.StandardListItem({
							title: "{Modelid}",
							description: "{Text}"
						})
					},
					confirm: function (E) {
						oJsonData.dfps.ModelId = E.getParameters().selectedItem.getProperty("title");
						oJsonData.dfps.ModelIdDesc = E.getParameters().selectedItem.getProperty("description");
						oJsonData.dfps.ModelIdVS = "None";
						oJsonModel.setData(oJsonData);
						g.deriveDFPSdata();
					},
					search: function (E) {
						if (E.getSource().getBinding("items")) {
							var sValue = E.getParameter("value");
							E.getSource().getBinding("items").filter(!sValue ? [] : [
								new sap.ui.model.Filter(
									[
										new sap.ui.model.Filter("Modelid", sap.ui.model.FilterOperator.Contains, sValue),
										new sap.ui.model.Filter("Text", sap.ui.model.FilterOperator.Contains, sValue)
									],
									false)
							]);
						}
					}
				};

				var q = "/EqDfpsModelIdSet";
				var M = g.getView().getModel("valueHelp2");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Modelid", "Text");
				abcSelectDialog.open();
			},
			ModelIdWsChange: function (f, g) {
				var oSource = f.getSource();
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				// var c = oJsonData.SuperordinateEquip;
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/EqDfpsModelIdSet";
					var oFilters = [new sap.ui.model.Filter("Modelid", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						g.BusyDialog.close();
						if (d.results.length > 0) {
							oJsonData.dfps.ModelId = d.results[0].Modelid;
							oJsonData.dfps.ModelIdDesc = d.results[0].Text;
							oJsonData.dfps.ModelIdVS = "None";
							oJsonModel.setData(oJsonData);
							g.deriveDFPSdata();
						} else {
							oJsonData.dfps.ModelIdDesc = "";
							oJsonData.dfps.ModelIdVS = "Error";
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						g.BusyDialog.close();
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						oJsonData.dfps.ModelIdDesc = "";
						oJsonData.dfps.ModelIdVS = "Error";
						oJsonModel.setData(oJsonData);
					};
					g.BusyDialog.open();
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					oJsonData.dfps.ModelIdDesc = "";
					oJsonData.dfps.ModelIdVS = "None";
					oJsonModel.setData(oJsonData);
				}
			},

			/////////////////////////////////// AIW MODEL ///////////////////////
			RootFlocVH: function (event, g) {
				var oSource = event.getSource();
				var Dialog = new sap.m.SelectDialog({
					title: "{i18n>FUNLOC_TXT}",
					noDataText: "No Data",
					confirm: function (E) {
						oSource.setValue(E.getParameters().selectedItem.getProperty("title"));
						oSource.setValueState("None");
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

				var results = [];
				var oModelData = sap.ui.getCore().getModel("AIWFLOC").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						if (oModelData[i].Functionallocation !== "") {
							var sObj = {
								Tplnr: oModelData[i].Functionallocation,
								Pltxt: oModelData[i].Flocdescription
							};
							results.unshift(sObj);
						}
					}
				}

				var I = new sap.m.StandardListItem({
					title: "{Tplnr}",
					description: "{Pltxt}",
					active: true
				});
				var e = new sap.ui.model.json.JSONModel();
				e.setData(results);
				e.isSizeLimit = results.length;
				e.setSizeLimit(results.length);
				Dialog.setModel(e);
				Dialog.setGrowingThreshold(results.length);
				Dialog.bindAggregation("items", "/", I);
				Dialog.setModel(g.getView().getModel("i18n"), "i18n");
				Dialog.open();
			},

			RootFlocChange: function (event, g) {
				var oSource = event.getSource();
				var c = oSource.getValue();
				c = c.toUpperCase();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var existFlag = false;
					var oModelData = sap.ui.getCore().getModel("AIWFLOC").getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].Functionallocation === a) {
								existFlag = true;
								break;
							}
						}

						if (existFlag) {
							oSource.setValue(a);
							oSource.setValueState("None");
						} else {
							oSource.setValueState("Error");
							g.invokeMessage("Functional Location doesn't exist");
						}
					}
				}
			},

			ConstrTypeVH: function (g, e) {
				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var settings = {
					title: g.getView().getModel("i18n").getProperty("xtxt.CONSTRUCTION_TYPE"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/MaterialSHSet",
						template: new sap.m.StandardListItem({
							title: "{Matnr}",
							description: "{Maktx}"
						})
					},
					confirm: function (E) {
						g.handleClose(E);
					}
				};

				var q = "/MaterialSHSet";
				var M = g.getView().getModel("valueHelp");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Matnr", "Maktx");
				abcSelectDialog.setNoDataText("Loading...");
				abcSelectDialog.open();
				g.inputId = "ConstructionType";
			},

			ControlAreaVH: function (g, e) {
				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var wcDetailModel = g.getView().getModel("wcDetailModel");
				var costData = wcDetailModel.getProperty("/cost");
				var sPath = e.getSource().getBindingContext("wcDetailModel").sPath;
				var sIdx = parseInt(sPath.substr(sPath.lastIndexOf("/") + 1));
				var settings = {
					title: g.getView().getModel("i18n").getProperty("Controlling Area"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/ControlAreaVHSet",
						template: new sap.m.StandardListItem({
							title: "{Kokrs}",
							description: "{Bezei}"
						})
					},
					confirm: function (E) {
						costData[sIdx].CrKokrs = E.getParameters().selectedItem.getProperty("title");
						costData[sIdx].Bezei = E.getParameters().selectedItem.getProperty("description");
						oSource.setValueState("None");
						wcDetailModel.refresh();
					}
				};

				var q = "/ControlAreaVHSet";
				var M = g.getView().getModel("valueHelp2");
				var abcSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Kokrs", "Bezei");
				abcSelectDialog.setNoDataText("Loading...");
				abcSelectDialog.open();
			},

			ControlAreaChange: function (g, e) {
				if (e !== undefined && e != null) {
					var oSource = e.getSource();
				}
				var wcDetailModel = g.getView().getModel("wcDetailModel");
				var costData = wcDetailModel.getProperty("/cost");
				var sPath = e.getSource().getBindingContext("wcDetailModel").sPath;
				var sIdx = parseInt(sPath.substr(sPath.lastIndexOf("/") + 1));
				var c = oSource.getValue();
				var a = c.replace(/^[ ]+|[ ]+$/g, '');
				if (a !== "") {
					var sPath = "/ControlAreaVHSet";
					var oFilters = [new sap.ui.model.Filter("Kokrs", "EQ", a)];
					var oModel = g.getView().getModel("valueHelp2");
					var fnSuccess = function (d) {
						g.BusyDialog.close();
						if (d.results.length > 0) {
							costData[sIdx].CrKokrs = d.results[0].Kokrs;
							costData[sIdx].Bezei = d.results[0].Bezei;
							oSource.setValueState("None");
							wcDetailModel.refresh();
							// oJsonModel.setData(oJsonData);
							// g.deriveDFPSdata();
						} else {
							costData[sIdx].Bezei = "";
							oSource.setValueState("Error");
							wcDetailModel.refresh();
						}
						oJsonModel.setData(oJsonData);
					};
					var fnError = function (e) {
						g.BusyDialog.close();
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						costData[sIdx].Bezei = "";
						oSource.setValueState("Error");
						wcDetailModel.refresh();
					};
					g.BusyDialog.open();
					g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
				} else {
					costData[sIdx].Bezei = "";
					oSource.setValueState("None");
					wcDetailModel.refresh();
				}
			},
		};
	});