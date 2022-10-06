sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/m/MessageBox'
], function(Controller, JSONModel, ODataModel, MessageBox) {
	"use strict";

	return Controller.extend("com.dpZFRAGMENTS.controller.fragments_1", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.dpZFRAGMENTS.view.fragments_1
		 */
		onInit: function() {
			var that = this;
			var service = '/sap/opu/odata/sap/ZEMP_DETAILS_SRV';
			var oModel = new ODataModel(service, true);
			var jModel = new JSONModel();

			oModel.read('/employeeSet', {
				success: function(oData, response) {
					jModel.setProperty('/employeeSet', oData.results);
					that.getView().setModel(jModel, 'M1');
				}
			});
		},
		onValueHelpRequest: function() { //for ObjectListItem
			this.dialog = sap.ui.xmlfragment("com.dpZFRAGMENTS.fragments.employeid", this);
			this.getView().addDependent(this.dialog);
			this.dialog.open();
		},
		onObjClose : function(){
			this.dialog.close(this);
		},
		onObjListItem : function(oEvent){
			var empId = oEvent.getParameter("listItem").getAggregation("attributes")[1].getProperty("text");
			this.getView().byId("idObj").setValue(empId);
			this.dialog.close(this);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.dpZFRAGMENTS.view.fragments_1
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.dpZFRAGMENTS.view.fragments_1
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.dpZFRAGMENTS.view.fragments_1
		 */
		//	onExit: function() {
		//
		//	}

	});

});