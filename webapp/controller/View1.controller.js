sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/m/MessageBox'
], function(Controller, JSONModel, ODataModel, MessageBox) {
	"use strict";

	return Controller.extend("com.dpzsample.controller.View1", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.dpzsample.view.View1
		 */
		onInit: function() {

		},
		onCreate: function() {
			var empid = this.getView().byId("empId").getValue();
			var empname = this.getView().byId("empName").getValue();
			var empCity = this.getView().byId("empCity").getValue();
			var empDesig = this.getView().byId("empDesig").getValue();
			var empCountry = this.getView().byId("empCountry").getValue();

			var obj = {
				"Employeid": empid,
				"Empname": empname,
				"Empdesg": empDesig,
				"Empmobile": "9867542812",
				"Empcity": empCity,
				"Empcountry": empCountry
			};

			var service = '/sap/opu/odata/sap/ZEMP_DETAILS_SRV';
			var oModel = new ODataModel(service, true);
			// var oJModel = new JSONModel();
			oModel.create('/employeeSet', obj, {
				success: function(odata, response) {
					MessageBox.success("Created Sucessfully");
				},
				error: function(odata, response) {
					MessageBox.error(odata.responseText);
				}
			});

		},
		onDisplay: function() {

				var that = this;
				var service = '/sap/opu/odata/sap/ZEMP_DETAILS_SRV/';
				this.oModel = new ODataModel(service, true);
				var oJModel = new JSONModel();

				this.oModel.read("/employeeSet", {
					success: function(odata, response) {
							oJModel.setProperty("/employeeSet", odata.results);
						}
						// ,
						// error : function(){
						// 	MessageBox.error("Unable to read");
						// }
				});

				this.getView().setModel(oJModel, "M1");

				this.getView().byId("idTab").setVisible(true);

			},
			onMCreate : function(){
				this.getOwnerComponent().getRouter().navTo("View2");
			}
			//,
			// onBeforePageChanged : function(){
			// 	var caro = this.getView().byId("idCaro");
			// 	caro.next();
			// },
			// onPageChanged : function(){
			// 	var caro = this.getView().byId("idCaro");
			// 	caro.previous();
			// }

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.dpzsample.view.View1
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.dpzsample.view.View1
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.dpzsample.view.View1
		 */
		//	onExit: function() {
		//
		//	}

	});

});