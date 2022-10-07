sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/m/MessageBox',
	"sap/ui/core/Fragment"
], function(Controller, JSONModel, ODataModel, MessageBox, Fragment) {
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
			if (!this.dialog) { // if this.dialog is not assigned
				this.dialog = sap.ui.xmlfragment("com.dpZFRAGMENTS.fragments.employeid", this);
			}
			this.getView().addDependent(this.dialog);
			this.dialog.open();
		},
		onObjClose: function() {
			this.dialog.close(this);
		},
		onObjListItem: function(oEvent) {
			var empId = oEvent.getParameter("listItem").getAggregation("attributes")[1].getProperty("text");
			this.getView().byId("idObj").setValue(empId);
			this.dialog.close(this);
		},

		//TABLE SELECT DIALOG
		onTableVHRequest: function() {
			if (!this.tdialog) { // if this.dialog is not assigned
				this.tdialog = sap.ui.xmlfragment("com.dpZFRAGMENTS.fragments.tableVH", this);
			}
			this.getView().addDependent(this.tdialog);
			this.tdialog.open();
		},
		onConfirm: function(oEvent) { //confirm event for Table Select Dialog
			var empId = oEvent.getParameters().selectedItem.getAggregation("cells")[0].getProperty("text");
			this.getView().byId("idObj2").setValue(empId);
		},

		//SELECT DIALOG
		onSDVHRequest: function() {
			var that = this;
			//Another way of loading the fragment
			if (!this.sDialog) {
				Fragment.load({ //load function will work with latest src url
					name: "com.dpZFRAGMENTS.fragments.selectDialog",
					id: "idSD",
					type: "XML",
					controller: this
				}).then(function(oDialog) {
					oDialog.setTitle("Employee Details");
					oDialog.bindAggregation("items",{
						path: "M1>/employeeSet",
						template: new sap.m.DisplayListItem({
							label: "{M1>Employeid}",
							value: "{M1>Empname}"
						})
					});
					that.getView().addDependent(oDialog);
					that.sDialog = oDialog;
					oDialog.open();
					// return oDialog;
				});
			}
			else{
			this.sDialog.open();
			}
		},
		onSDConfirm : function(oEvent){
			var empId = oEvent.getParameters().selectedItem.getProperty("label");
			this.getView().byId("idObj3").setValue(empId);
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