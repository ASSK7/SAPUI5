sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/m/MessageBox'
], function(Controller, JSONModel, ODataModel, MessageBox) {
	"use strict";

	return Controller.extend("com.dpzsample.controller.View2", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.dpzsample.view.view.View2
		 */
		onInit: function() {
			this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._object, this);

		},
		_object: function() {
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
		onAdd: function() { // In this function adding am empty row on first in table
			var table = this.getView().byId("idTable");
			var items = table.getItems(); // getting all items in table
			table.removeAllItems(); // after storing items in an array, now removing items from table

			var oItem = new sap.m.ColumnListItem({ //creating an empty item with input fields
				cells: [
					new sap.m.Input({

					}),
					new sap.m.Input({

					}),
					new sap.m.Input({

					}),
					new sap.m.Input({

					}),
					new sap.m.Input({

					}),
				]
			});

			table.addItem(oItem); // adding that empty item to table at first
			for (var i = 0; i < items.length; i++) { //now adding remaining items in table
				table.addItem(items[i]);
			}
		},
		onDelete: function() {

		},
		onEdit: function() {

		},
		onSubmit: function() {
			var oTable = this.getView().byId("idTable");
			var selItems = oTable.getSelectedItems();
			var aItems = [];
			for (var i = 0; i < selItems.length; i++) {
				var empId = selItems[i].getAggregation("cells")[0].getProperty("value");
				var empName = selItems[i].getAggregation("cells")[1].getProperty("value");
				var empDesig = selItems[i].getAggregation("cells")[2].getProperty("value");
				var empCity = selItems[i].getAggregation("cells")[3].getProperty("value");
				var empCtry = selItems[i].getAggregation("cells")[4].getProperty("value");
				//Pushing to an array

				aItems.push({
					"Employeid": empId,
					"Empname": empName,
					"Empdesg": empDesig,
					"Empmobile": "9867542812",
					"Empcity": empCity,
					"Empcountry": empCtry
				});
			}

			//BATCH OPERATION CODE
			var that = this;
			// var service = '/sap/opu/odata/sap/ZEMP_DETAILS_SRV';
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZEMP_DETAILS_SRV/", true);
			
            
            var aBatchCall = [];
			for (var m = 0; m < aItems.length; m++) {
				aBatchCall.push(oModel.createBatchOperation('/employeeSet', "POST", aItems[m]));
			}
			
			
			oModel.addBatchChangeOperations(aBatchCall);
				oModel.setUseBatch(true);
			
			oModel.submitBatch(function(odata, oResponse, aErrorResponses) {
					if (aErrorResponses == 0) {
						 MessageBox.success("Record Saved Successfully");
						 
			         that._object();
					} else {
						MessageBox.error("Not saved");
					}

				});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.dpzsample.view.view.View2
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.dpzsample.view.view.View2
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.dpzsample.view.view.View2
		 */
		//	onExit: function() {
		//
		//	}

	});

});