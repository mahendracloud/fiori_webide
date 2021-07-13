sap.ui.define(["jquery.sap.global"],function(e){"use strict";var i={oData:{_persoSchemaVersion:"1.0",aColumns:[{id:"ugiaiwui-mdg-aiw-request-myCRTab-changeRequestCol",order:0,text:"Change Request",visible:true},{id:"ugiaiwui-mdg-aiw-request-myCRTab-statusCol",order:2,text:"Status",visible:true},{id:"ugiaiwui-mdg-aiw-request-myCRTab-changedOnCol",order:3,text:"Changed On",visible:true},{id:"ugiaiwui-mdg-aiw-request-myCRTab-changedByCol",order:4,text:"Changed By",visible:true},{id:"ugiaiwui-mdg-aiw-request-myCRTab-draftCol",order:5,text:"Draft",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-editionCol",order:6,text:"Edition",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-changedAtCol",order:7,text:"Changed At",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-typeCol",order:8,text:"Type",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-createdOnCol",order:9,text:"Created On",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-createdAtCol",order:10,text:"Created At",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-createdByCol",order:11,text:"Created By",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-finalizedOnCol",order:12,text:"Finalized On",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-finalizedAtCol",order:13,text:"Finalized At",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-finalizedByCol",order:14,text:"Finalized By",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-descEditionCol",order:15,text:"Description of Edition",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-dueDateCol",order:16,text:"Due Date",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-priorityCol",order:17,text:"Priority",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-reasonCol",order:18,text:"Reason",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-reasonForRejectionCol",order:19,text:"Reason for Rejection",visible:false}]},getPersData:function(){var i=new e.Deferred;if(!this._oBundle){this._oBundle=this.oData}var t=this._oBundle;i.resolve(t);return i.promise()},setPersData:function(i){var t=new e.Deferred;this._oBundle=i;t.resolve();return t.promise()},resetPersData:function(){var i=new e.Deferred;var t={_persoSchemaVersion:"1.0",aColumns:[{id:"ugiaiwui-mdg-aiw-request-myCRTab-changeRequestCol",order:0,text:"Change Request",visible:true},{id:"ugiaiwui-mdg-aiw-request-myCRTab-statusCol",order:2,text:"Status",visible:true},{id:"ugiaiwui-mdg-aiw-request-myCRTab-changedOnCol",order:3,text:"Changed On",visible:true},{id:"ugiaiwui-mdg-aiw-request-myCRTab-changedByCol",order:4,text:"Changed By",visible:true},{id:"ugiaiwui-mdg-aiw-request-myCRTab-draftCol",order:5,text:"Draft",visible:true},{id:"ugiaiwui-mdg-aiw-request-myCRTab-editionCol",order:6,text:"Edition",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-changedAtCol",order:7,text:"Changed At",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-typeCol",order:8,text:"Type",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-createdOnCol",order:9,text:"Created On",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-createdAtCol",order:10,text:"Created At",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-createdByCol",order:11,text:"Created By",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-finalizedOnCol",order:12,text:"Finalized On",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-finalizedAtCol",order:13,text:"Finalized At",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-finalizedByCol",order:14,text:"Finalized By",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-descEditionCol",order:15,text:"Description of Edition",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-dueDateCol",order:16,text:"Due Date",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-priorityCol",order:17,text:"Priority",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-reasonCol",order:18,text:"Reason",visible:false},{id:"ugiaiwui-mdg-aiw-request-myCRTab-reasonForRejectionCol",order:19,text:"Reason for Rejection",visible:false}]};this._oBundle=t;i.resolve();return i.promise()},getCaption:function(e){if(e.getHeader()&&e.getHeader().getText){if(e.getHeader().getText()==="Weight"){return"Weight (Important!)"}}return null},getGroup:function(e){if(e.getId().indexOf("productCol")!=-1||e.getId().indexOf("supplierCol")!=-1){return"Primary Group"}return"Secondary Group"}};return i},true);