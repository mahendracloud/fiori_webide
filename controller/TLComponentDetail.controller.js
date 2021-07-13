sap.ui.define(["ugiaiwui/mdg/aiw/request/controller/BaseController","sap/ui/model/json/JSONModel","ugiaiwui/mdg/aiw/request/model/formatter","sap/ui/core/routing/History"],function(e,t,a,o){"use strict";return e.extend("ugiaiwui.mdg.aiw.request.controller.TLComponentDetail",{formatter:a,onInit:function(){var e,a=new t({busy:true,delay:0});this.getRouter().getRoute("tlComponent").attachPatternMatched(this._onObjectMatched,this);e=this.getView().getBusyIndicatorDelay();this.setModel(a,"objectView");this.getOwnerComponent().getModel().metadataLoaded().then(function(){a.setProperty("/delay",e)});var o=sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));var r=o.getModel();r.setDefaultCountMode(sap.ui.model.odata.CountMode.None);this.getView().setModel(r);var n=o.getModel("NewModel");this.getView().setModel(n,"valueHelp");var i=o.getModel("NewModel2");this.getView().setModel(i,"valueHelp2")},typeCheck:function(e){if(e){var t="";if(typeof e==="boolean"){return e}else if(typeof e==="string"){if(e.indexOf("false")>-1){t=false}else if(e.indexOf("true")>-1){t=true}else if(e.indexOf("X")>-1){t=true}else{t=false}return t}}else{return false}},onNavBack:function(){window.history.go(-1)},parseQualification:function(e){if(e==="S"||e==="C"||e==="QP"){return true}else{return false}},_onObjectMatched:function(e){var t=new sap.ui.model.json.JSONModel;var a=sap.ui.getCore().getModel("tlDetailModel");t.setData(a.getProperty(decodeURIComponent(e.getParameter("arguments").itemPath)));this.setModel(t,"tlComp");this.getView().bindElement({path:decodeURIComponent(e.getParameter("arguments").itemPath),model:"operOverview"})},_bindView:function(e){var t=this.getModel("objectView"),a=this.getModel();this.getView().bindElement({path:e,parameters:{expand:"ToSupplier"},events:{change:this._onBindingChange.bind(this),dataRequested:function(){a.metadataLoaded().then(function(){t.setProperty("/busy",true)})},dataReceived:function(){t.setProperty("/busy",false)}}})},_onBindingChange:function(){var e=this.getView(),t=this.getModel("objectView"),a=e.getElementBinding();if(!a.getBoundContext()){this.getRouter().getTargets().display("objectNotFound");return}var o=this.getResourceBundle(),r=e.getBindingContext().getObject(),n=r.ProductID,i=r.ProductID;t.setProperty("/busy",false);t.setProperty("/shareSendEmailSubject",o.getText("shareSendEmailObjectSubject",[n]));t.setProperty("/shareSendEmailMessage",o.getText("shareSendEmailObjectMessage",[i,n,location.href]))},onComponentVH:function(e){var t=this;var a=sap.ui.getCore().getModel("tlDetailModel");var o=this.getModel("tlComp");var r=o.getData();var n=new sap.m.TableSelectDialog({title:this.getView().getModel("i18n").getProperty("COMPO"),noDataText:this.getView().getModel("i18n").getProperty("LOAD")+"...",columns:[new sap.m.Column({header:[new sap.m.Text({text:"{i18n>DESCRIPTION}"})]}),new sap.m.Column({demandPopin:true,minScreenWidth:"Tablet",header:[new sap.m.Text({text:"{i18n>LANGUAGE}"})]}),new sap.m.Column({demandPopin:true,minScreenWidth:"Tablet",header:[new sap.m.Text({text:"{i18n>MAT}"})]})],growing:true,growingThreshold:30,items:{path:"/MaterialVH_PRTSet?$skip=0&$top=30",template:new sap.m.ColumnListItem({type:"Active",unread:false,cells:[new sap.m.Text({text:"{Maktg}"}),new sap.m.Text({text:"{Spras}"}),new sap.m.Text({text:"{Matnr}"})]})},confirm:function(e){r.matState="None";r.Idnrk=e.getParameter("selectedItem").getCells()[2].getText();r.matDesc=e.getParameter("selectedItem").getCells()[0].getText();var n=e.getParameter("selectedItem").getCells()[2].getText();var i=a.getData().lHeader.Iwerk;t.deriveMatDetails(n,i);o.setData(r);t.setModel(o,"tlComp")}});var i=this.getView().getModel("valueHelp");n.setModel(i);n.setModel(t.getView().getModel("i18n"),"i18n");n.open()},deriveMatDetails:function(e,t){var a=this;var o=[];var r="/MaterialDataSet";var n=sap.ui.getCore().getModel("tlDetailModel");var i=this.getModel("tlComp");var s=i.getData();var l=[new sap.ui.model.Filter("Matnr","EQ",e),new sap.ui.model.Filter("Werks","EQ",t)];var d=this.getView().getModel();d.read(r,{filters:l,success:function(e){if(e.results.length>0){o=e.results;if(o.length>0){s.Menge=o[0].Menge;s.MeinsGcp=o[0].Meins;s.Postp=o[0].Postp}i.setData(s);a.setModel(i,"tlComp")}},error:function(e){}})},onComponentChange:function(e){var t=this;var a=e.getSource().getBindingInfo("value").binding.sPath;var o=e.getParameters().newValue;var r=sap.ui.getCore().getModel("tlDetailModel");var n=this.getModel("tlComp");var i=n.getData();var s=this.getView().getModel("valueHelp");var l;if(a==="/Idnrk"){l=o.toUpperCase();var d="/MaterialVH_PRTSet";var g=[new sap.ui.model.Filter("Matnr","EQ",l)];s.read(d,{filters:g,success:function(e){if(e.results.length>0){i.Idnrk=l;i.matDesc=e.results[0].Maktg;i.matState="None";var a=e.results[0].Matnr;var o=r.getData().lHeader.Iwerk;t.deriveMatDetails(a,o);n.setData(i);t.setModel(n,"tlComp")}else{i.matState="Error";n.setData(i);t.setModel(n,"tlComp")}},error:function(e){i.matState="Error";n.setData(i);t.setModel(n,"tlComp")}})}if(a==="/Menge"){if(o!==""){i.qtyState="None";i.Menge=o;n.setData(i);t.setModel(n,"tlComp")}else{i.qtyState="Error";n.setData(i);t.setModel(n,"tlComp")}}if(a==="/MeinsGcp"){l=o.toUpperCase();var u=this.getView().getModel("valueHelp");var d="/QuantityUOMSet";var g=[new sap.ui.model.Filter("Mseh3","EQ",l)];u.read(d,{filters:g,success:function(e){if(e.results.length>0){i.MeinsGcp=l;i.qtyUnitState="None";n.setData(i);t.setModel(n,"tlComp")}else{i.qtyUnitState="Error";n.setData(i);t.setModel(n,"tlComp")}},error:function(e){i.qtyUnitState="Error";n.setData(i);t.setModel(n,"tlComp")}})}}})});