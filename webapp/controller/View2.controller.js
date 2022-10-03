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
           var table = this.getView().byId("idTable");
			var selItems = table.getSelectedItems();
			
			var aItems = [];
			for (var i = 0; i < selItems.length; i++) {
				var empId = selItems[i].getAggregation("cells")[0].getProperty("text");
                //employeeid is key field to delete a record
				aItems.push({
					"Employeid": empId
				});
			}

			//BATCH OPERATION CODE TO GET MULTIPLE DELETE OPERATION
			var that = this;
			// var service = '/sap/opu/odata/sap/ZEMP_DETAILS_SRV';
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZEMP_DETAILS_SRV/", true);

			var aBatchCall = [];
			for (var m = 0; m < aItems.length; m++) {
				var url = "/employeeSet('" + aItems[m].Employeid + "')";
				aBatchCall.push(oModel.createBatchOperation(url, "DELETE"));
			}

			oModel.addBatchChangeOperations(aBatchCall);
			oModel.setUseBatch(true);
			oModel.submitBatch(function(odata, oResponse, aErrorResponses) {
				if (aErrorResponses == 0) {
					MessageBox.success("Record Deleted Successfully");
					that._object();
				} else {
					MessageBox.error("Not deleted");
				}

			});
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

			//BATCH OPERATION CODE TO GET MULTIPLE CREATION
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
		},
		onEdit: function() { //making table rows as editable
		this.getView().byId("idBtnUpdate").setVisible(true); //initially Update button is not visible but when click on edit button then update button will be enabled
		var that = this;
			var aSelItems = this.getView().byId("idTable").getSelectedItems(); //getting selected items
			var aAllItems = this.getView().byId("idTable").getItems(); //getting all items in table
			var cells = Number(this.getView().byId("idTable").getItems()[0].getAggregation("cells").length); //getting number of cells(columns) in the table
   
			for (var j = 0; j < aSelItems.length; j++) { //looping selected itmes
				for (var i = 0; i < aAllItems.length; i++) { //looping all items in table
					if (aAllItems[i] === aSelItems[j]) {  //if selected item will match then we will take the index of the row
						that.getView().byId("idTable").getItems()[i].destroyCells();
						for (var k = 0; k < cells; k++) { //by looping the number of cells , we can add input fields to each cell
							if (k == 0) {
								that.getView().byId("idTable").getItems()[i].addCell(new sap.m.Input({
									value: "{M1>Employeid}",
									editable: true
								}));
							} else if (k == 1) {

								that.getView().byId("idTable").getItems()[i].addCell(new sap.m.Input({
									value: "{M1>Empname}",
									editable: true
								}));
							} else if (k == 2) {

							that.getView().byId("idTable").getItems()[i].addCell(new sap.m.Input({
									value: "{M1>Empdesg}",
									editable: true
								}));
							} else if (k == 3) {

								that.getView().byId("idTable").getItems()[i].addCell(new sap.m.Input({
									value: "{M1>Empcity}",
									editable: true
								}));
							} else if (k == 4) {

								that.getView().byId("idTable").getItems()[i].addCell(new sap.m.Input({
									value: "{M1>Empcountry}",
									editable: true
								}));
							}
						}

					}

				}
			}

		},
		
		onUpdate : function(){  //batch update
			var table = this.getView().byId("idTable");
			var selItems = table.getSelectedItems();
			
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

			//BATCH OPERATION CODE TO GET MULTIPLE UPDATION
			var that = this;
			// var service = '/sap/opu/odata/sap/ZEMP_DETAILS_SRV';
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZEMP_DETAILS_SRV/", true);

			var aBatchCall = [];
			for (var m = 0; m < aItems.length; m++) {
				var url = "/employeeSet('" + aItems[m].Employeid + "')";
				aBatchCall.push(oModel.createBatchOperation(url, "PUT", aItems[m]));
			}

			oModel.addBatchChangeOperations(aBatchCall);
			oModel.setUseBatch(true);
			oModel.submitBatch(function(odata, oResponse, aErrorResponses) {
				if (aErrorResponses == 0) {
					MessageBox.success("Record Updated Successfully");
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