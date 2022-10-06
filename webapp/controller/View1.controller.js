sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/m/MessageBox'
], function(Controller, JSONModel, ODataModel, MessageBox) {
	"use strict";

	return Controller.extend("com.dpZODATA_CRUD_OPERATIONS.controller.View1", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.dpZODATA_CRUD_OPERATIONS.view.View1
		 */
		onInit: function() {
			//this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._object, this);

			/* Syntax for bindAggregation for items if we didn't provide items for table in View
						var oTable = this.getView().byId("idTable");
			
						var oItems = new sap.m.ColumnListItem({
							cells : [
								new sap.m.Text({
									text : "{M1>Employeid}"
								}),
								new sap.m.Text({
									text : "{M1>Empname}"
								}),
								new sap.m.Text({
									text : "{M1>Empdesg}"
								}),
								new sap.m.Text({
									text : "{M1>Employeid}"
								}),
								new sap.m.Text({
									text : "{M1>Employeid}"
								})
							]
						});
			
						oTable.bindItems("M1>/employeeSet",oItems);
			
						*/

		},
		onDisplay: function() {
			//Read Operations from ODATA URL
			var that = this;
			var service = '/sap/opu/odata/sap/ZEMP_DETAILS_SRV';
			this.oModel = new ODataModel(service, true);
			var jModel = new JSONModel();

			this.oModel.read("/employeeSet", {
				success: function(odata, response) {
					jModel.setProperty("/employeeSet", odata.results);
				}
			});
			// this.getView().byId("idTable").setModel(jModel,"M1"); //setting the model at table level
			this.getView().setModel(jModel, "M1"); //setting the model at view level
		},
		onDelete: function() {
			var that = this;
			var oTable = this.getView().byId("idTable");
			var selItem = oTable.getSelectedItem();
			var empId = selItem.getAggregation("cells")[0].getProperty("text"); //getting employeid , it is key in entityset

			var service = '/sap/opu/odata/sap/ZEMP_DETAILS_SRV';
			var oModel = new ODataModel(service, true);

			var url = "/employeeSet(" + "'" + empId + "')";

			oModel.remove(url, {
				success: function(odata, response) {
					MessageBox.success("Successfully Deleted");
					that.onDisplay(); //to refresh the table data after deleting

				},
				error: function() {
					MessageBox.error("Not Deleted");
				}
			});
		},

		onEdit: function() {
			var that = this;
			var selItem = this.getView().byId("idTable").getSelectedItem();
			if (selItem === null) { //if no item is selected to update then below message will be shown
				MessageBox.warning("Please Select an item");
			} else {
				var oEdit = this.getView().byId("idEdit");
				oEdit.setText("Update");
				oEdit.setIcon("sap-icon://feed");

				//Making selected cell editable
				var cells = selItem.getAggregation("cells").length; //getting number of cells for a item
				selItem.destroyCells(); //destroying the existing cells of selected item
				var i = 0;

				while (cells > i) {
					if (i === 0) { //first cell
						selItem.addCell(
							new sap.m.Text({
								text: "{M1>Employeid}"
							})
						);
					} else if (i === 1) { //second cell
						selItem.addCell(
							new sap.m.Input({
								value: "{M1>Empname}"
							})
						);
					} else if (i === 2) { //third cell
						selItem.addCell(
							new sap.m.Input({
								value: "{M1>Empdesg}"
							})
						);
					} else if (i === 3) { //fourth cell
						selItem.addCell(
							new sap.m.Input({
								value: "{M1>Empmobile}"
							})
						);
					} else if (i === 4) { //fifth cell
						selItem.addCell(
							new sap.m.Input({
								value: "{M1>Empcity}"
							})
						);
					} else if (i === 5) { //sixth cell
						selItem.addCell(
							new sap.m.Input({
								value: "{M1>Empcountry}"
							})
						);
					}

					i = i + 1;
				}

				oEdit.detachPress(that.onEdit, this); //removing the already existed event
				oEdit.attachPress(that.onUpdate, this); //attaching new event function
			}

		},
		onUpdate: function() {
			var that = this;
			var oEdit = this.getView().byId("idEdit");
			var selItem = this.getView().byId("idTable").getSelectedItem(); //getting the selected item

			//getting the values from selected item which was input enabled in onEdit function
			var empid = selItem.getAggregation("cells")[0].getProperty("text");
			// var empname = selItem.getAggregation("cells")[1].getProperty("value");
			var empname = selItem.getAggregation("cells")[1].getProperty("value");
			var empdesig = selItem.getAggregation("cells")[2].getProperty("value");
			var mobile = selItem.getAggregation("cells")[3].getProperty("value");
			var city = selItem.getAggregation("cells")[4].getProperty("value");
			var country = selItem.getAggregation("cells")[5].getProperty("value");

			var obj = {
				"Employeid": empid,
				"Empname": empname,
				"Empdesg": empdesig,
				"Empmobile": mobile,
				"Empcity": city,
				"Empcountry": country
			};

			var service = '/sap/opu/odata/sap/ZEMP_DETAILS_SRV';
			this.oModel = new ODataModel(service, true);

			this.oModel.update("/employeeSet('" + empid + "')", obj, {
				success: function(odata, response) {
					MessageBox.success("Updated Successfully");
					oEdit.setText("Edit");
					oEdit.setIcon("sap-icon://edit");

					oEdit.detachPress(that.onUpdate, this); //removing the already existed event
					oEdit.attachPress(that.onEdit, this); //attaching previous function
					
					that.onDisplay();  //to update the records in the table
				},
				error: function() {
					MessageBox.error("Not Updated");
				}
			});

		},
		onCreate: function() {
			var empId = this.getView().byId("empId").getValue();
			var empName = this.getView().byId("empName").getValue();
			var empDesig = this.getView().byId("empDesig").getValue();
			var empMobile = this.getView().byId("empMobile").getValue();
			var empCity = this.getView().byId("empCity").getValue();
			var empCtry = this.getView().byId("empCtry").getValue();

			var obj = {
				"Employeid": empId,
				"Empname": empName,
				"Empdesg": empDesig,
				"Empmobile": empMobile,
				"Empcity": empCity,
				"Empcountry": empCtry
			};

			var that = this;
			var service = '/sap/opu/odata/sap/ZEMP_DETAILS_SRV';
			this.oModel = new ODataModel(service, true);

			this.oModel.create("/employeeSet", obj, {
				success: function(odata, response) {
					MessageBox.success("Record successfully created");
					that.getView().byId("idSF").removeContent();
				},
				error: function() {
					MessageBox.error("Record not created");
				}
			});
		},
		onClear: function() {
			this.getView().byId("empId").setValue("");
			this.getView().byId("empName").setValue("");
			this.getView().byId("empDesig").setValue("");
			this.getView().byId("empMobile").setValue("");
			this.getView().byId("empCity").setValue("");
			this.getView().byId("empCtry").setValue("");
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.dpZODATA_CRUD_OPERATIONS.view.View1
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.dpZODATA_CRUD_OPERATIONS.view.View1
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.dpZODATA_CRUD_OPERATIONS.view.View1
		 */
		//	onExit: function() {
		//
		//	}

	});

});