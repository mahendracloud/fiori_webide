sap.ui.define(["sap/ui/test/Opa5","ugiaiwui/mdg/aiw/request/localService/mockserver","sap/ui/model/odata/v2/ODataModel","sap/ui/core/routing/HashChanger","ugiaiwui/mdg/aiw/request/test/flpSandbox","sap/ui/fl/FakeLrepConnectorLocalStorage"],function(e,t,a,i,s,r){"use strict";return e.extend("ugiaiwui.mdg.aiw.request.test.integration.arrangements.Startup",{iStartMyFLPApp:function(e){var a=e||{};this._clearSharedData();a.delay=a.delay||1;var n=[];n.push(t.init(a));n.push(s.init());this.iWaitForPromise(Promise.all(n));r.enableFakeConnector();this.waitFor({autoWait:a?a.autoWait:true,success:function(){(new i).setHash(a.intent+(a.hash?"&/"+a.hash:""))}})},iRestartTheAppWithTheRememberedItem:function(e){var t;this.waitFor({success:function(){t=this.getContext().currentItem.id}});this.waitFor({success:function(){e.hash="ChangeRequestSet/"+t;this.iStartMyFLPApp(e)}})},_clearSharedData:function(){a.mSharedData={server:{},service:{},meta:{}}}})});