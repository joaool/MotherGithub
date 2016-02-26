define(function(require){
	'use strict';

	var Template = require("text!templates/main.html");
	var fieldEditionTemplate = require("text!templates/field-Edition.html");
	var EntityModel = require("formMaker/js/models/entity_model");
	var GridUtils = require("grid-viewer/grid-utils");
	var ColumnContextMenu = require("text!templates/column-context-menu.html");

	var View = Backbone.View.extend({
		initialize: function(){
			this.gridContainerId = "#grid-container";
			this.entityModel = new FormDesigner.Models.EntityModel();
	        this.listenTo(this.entityModel,"change:entities",this.onEntitiesLoaded.bind(this));
	        this.model = Backbone.Model.extend({});
		},
		events: {
			"click #addColumnButton" : "addColumn",
			'click .delete-icon' : "deleteColumnIconClick",
			'click .settings-icon' : "settingsColumnIconClick",
			"click #saveGridButton" : "onSaveGridButtonClick",
			"click #columnTypeContextMenu > li.menu-option" : "onSubMenuClick",
			"click #columnContextMenu > li.menu-option" : "onContextMenuItemClick"	,
			"click #getGridJSON" : "onGridJsonBtnClick",
			"click .add-row-controls input" : "onAddRowInpuBoxClick",
			"click .add-row-controls textarea" : "onAddRowInpuBoxClick",
			"click #addRow" : "addRowBtnClick",
			"click .columnType": "onColumnTypeClicked"
		},
		init : function(){
			this.loadEntities();
		},
		loadEntities: function(){
			this.entityModel.loadEntities();
		},
		onEntitiesLoaded: function(){
			if (this.entity)
				this.render();	        
	    },
	    render: function(){
			this.$el.html(Template);
			this.$el.append(fieldEditionTemplate);
			this.renderGrid();
		},
		renderGrid: function(){
			this.columns = this.getColumnCollection();
    		this.dataCollection = this.getDataCollection();
		    $(this.gridContainerId).empty();
		    $(".backgrid-paginator").remove();
    		this.backGrid = new Backgrid.Grid({
		        columns: this.columns,
		        collection: this.dataCollection
		    });

		    this.$grid = $(this.gridContainerId).appendTo(this.gridContainerId).append(this.backGrid.render().el);
		    this.renderPagination();
		    this.renderSizeableColumns();
		    this.$("th.editable").append("<i class='glyphicon glyphicon-cog settings-icon'></i>");
		    this.bindDatePicker();
		    this.renderFilter();
		    this.dataCollection.fetch({reset: true});
	    },
	    renderFilter: function(){
	    	this.filter = new Backgrid.Extension.ClientSideFilter({
			  collection: this.dataCollection
			});
			this.$grid.before(this.filter.render().el);
	    },
	    renderPagination: function(){
		    // Initialize the paginator
		    var paginator = new Backgrid.Extension.Paginator({
		        collection: this.dataCollection
		    });
		    // Render the paginator
		    this.$grid.after(paginator.render().el);
		},
		renderSizeableColumns: function() {
		    // Add sizeable columns
		    var sizeAbleCol = this.sizeableColumns = new Backgrid.Extension.SizeAbleColumns({
		        collection: this.dataCollection,
		        columns: this.columnCollection,
		        grid: this.backGrid
		    });
		    this.$grid.find('thead').before(sizeAbleCol.render().el);
		    // Add resize handlers
		    var sizeHandler = new Backgrid.Extension.SizeAbleColumnsHandlers({
		        sizeAbleColumns: sizeAbleCol,
		        saveColumnWidth: true
		    });
		    this.$grid.find('thead').before(sizeHandler.render().el);
		    // Make columns reorderable
		    var orderHandler = new Backgrid.Extension.OrderableColumns({
		        grid: this.backGrid,
		        sizeAbleColumns: sizeAbleCol
		    });
		    this.$grid.find('thead').before(orderHandler.render().el);
		},
		getDataCollection : function() {
		    var PageableGrid = Backbone.PageableCollection.extend({
		        model: this.model,
		        url : window.gridBaseUrl+"customer.json",
		        state: {
		            pageSize: 15
		        },
		        mode: "client" // page entirely on the client side
		    });
		    var dataCollection = new PageableGrid();
		    this.listenTo(dataCollection,"backgrid:editing",function(){
		    	//this.bindDatePicker();
		    });
		    return dataCollection;
		},
		bindDatePicker: function(){
			$(".datepicker").datetimepicker({
	            timeFormat: "hh:mm tt",
	            controlType: 'select',
	            oneLine: true
	        });
		},
		getColumnCollection : function() {
			var mainView = this;
			var headerRenderer = Backgrid.HeaderCell.extend({
		    	render: function(){
	    			this.$el.empty();
		            var column = this.column;
		            var sortable = Backgrid.callByNeed(column.sortable(), column, this.collection);
		            var label;
		            if (sortable) {
		                label = $("<a>").text(column.get("label")).append("<b class='sort-caret'></b>");
		            } else {
		                label = document.createTextNode(column.get("label"));
		            }
		            this.$el.append(label);
		            if(column.get("inputType").toLowerCase() == "textArea") {
			    		this.$el.append("<div class='add-row-controls'><textarea class='control'></textarea></div>");
			    	}
			    	else if(column.get("inputType").toLowerCase() == "number") {
			    		this.$el.append("<div class='add-row-controls'><input type='number' class='control'/></div>");
			    	}
			    	else if (column.get("inputType").toLowerCase() == "date" || column.get("inputType").toLowerCase() == "datetime") {
			    		var inputElement = $("<input type='text' class='control datepicker'/>");
			    		var container = $("<div class='add-row-controls'></div>");
			    		container.append(inputElement);
		    			this.$el.append(container);
		    			
			    	}
			    	else {
			    		this.$el.append("<div class='add-row-controls'><input type='text' class='control'/></div>");
			    	}
		            this.$el.addClass(column.get("name"));
		            this.$el.addClass(column.get("direction"));
		            this.delegateEvents();
		            return this;
		    	}
		    });
		    var formatter = _.extend(Backgrid.CellFormatter.prototype, {
				fromRaw: this.fromFormatter.bind(this),
			  	toRaw: this.toFormatter.bind(this)
			});

		    var columnDefinition = GridUtils.generateGridViewerData(this.entity,this.gridData,headerRenderer,formatter);
		    var columns = new Backgrid.Extension.OrderableColumns.orderableColumnCollection(columnDefinition);
		    columns.setPositions().sort();
		    return columns;
		},
		fromFormatter : function (rawValue, model,column) {
			return this.validateBeforeRender(rawValue,model,column);
	  	},
	  	toFormatter : function (rawValue, model,column) {
	  		return this.validateBeforeRender(rawValue,model,column);
	  	},
	  	validateBeforeRender: function(value,model,column){
	  		if (!column) {
	  			console.log("column not found");
	  		}
  			var col = column.get("inputType");
			if (col.toLowerCase() == "date" || col.toLowerCase() == "datetime"){
				var dt = new Date(value);
				if (dt == 'Invalid Date') {
					return "";
				}
				else {
					return dt.toDateString();
				}
			} else if (col.toLowerCase() == 'integer') {
				if (Number.isNaN(parseInt(value))) {
					return 0;
				}
			} else if (col.toLowerCase() == 'number') {
				if (Number.isNaN(parseFloat(value))) {
					return 0;
				}
			}
			return value;
	  	},
		validateAfterEditting: function(value,model){
			return value;
		},
		addColumn : function(){
			this.newColumnDialog();
		},
		newColumnDialog: function(){
	        var self = this;
	        var boxOptions = {
	            type: "primary",
	            icon: "th-list",
	            button1: "Cancel",
	            button2: "Confirm field edition",
	            posField: {
	                fieldLabel: function (Box) {
	                },
	                fieldName: function (Box) {
	                }
	            },
	            preField: {
	                fieldDescription: function (Box) {
	                }
	            },
	            option: {
	                userType_options: function (Box, selected) {
	                    FL.common.printToConsole("%%%%%%%%>user code typeUI_options --> content=" + JSON.stringify(selected), "modalIn");
	                }
	            }
	        };
	        var dataItems = {
	            master: {
	                fieldLabel: "",
	                fieldName: "",
	                fieldDescription: "",
	                placeholder : "",
	                icon:"text",
	                userType: "",
	                userType_options: GridUtils.getUserTypes()
	            }
	        };
	        var fieldEditorModal = new FL.modal.Box(" Field Editor", "fieldEdition", dataItems, boxOptions, function (result, data, changed) {
	            if (result) {
	                if (changed) {
	                    console.log("fieldEditorModal Master  " ,data.master);
	                    //data.master.fCN = self.elementClickModel.fieldName;
	                    var field = GridUtils.addField(self.entity,data.master);
	                    self.gridData.fields.push({
	                    	"fCN" : field.fCN,
	                    	"width" : field.width
	                    })
	                    self.renderGrid();
	                    //self.columns.setPositions().sort();
	                    //self.m_Editor.updateElement(data.master);
	                }
	            }
	        });
	        fieldEditorModal.show();
	    },
	    settingsColumnIconClick: function(evt){
	    	this.currentSettingsColumn = $(evt.currentTarget);
    		evt.preventDefault();
    		evt.stopPropagation();
    		this.currentColumnCid = this.currentSettingsColumn.parent().data("column-cid");
			var menuOptions = window.constants.columnContextMenuOptions;
			$(".column-context-menu").remove();
			this.displayMenu(this.currentSettingsColumn.parent(),{
				"menuOptions": menuOptions,
				"id" : "columnContextMenu",
				"type" : ""
			});

	    },
	    displayMenu: function(parent,options){
    		$(parent).append(_.template(ColumnContextMenu)(options));
    		$(document).click(function(e){
    			e.preventDefault();
    			e.stopPropagation();
    			$(".column-context-menu").remove();
    		})
	    },
	    onContextMenuItemClick: function(evt){
	    	var key = $(evt.currentTarget).data("key");
	    	evt.preventDefault();
    		evt.stopPropagation();
			if (key === "columnType") {
				var menuOptions = window.constants.columnType;
	    		this.displayMenu($(evt.currentTarget),{
					"menuOptions": menuOptions,
					"id" : "columnTypeContextMenu",
					"type" : key
				});
	    	}
	    	else {
	    		$("#columnContextMenu").hide();
	    	}
	    },
	    onSubMenuClick: function(evt){
	    	evt.preventDefault();
	    	evt.stopPropagation();
	    	$("#columnTypeContextMenu").hide();
	    	var fieldData = this.columns.get({cid:this.currentColumnCid}).toJSON().fieldData;
	    	fieldData.typeUI = $(evt.currentTarget).data("key");
	    	GridUtils.updateField(this.entity,fieldData);
	    	if(fieldData.typeUI == "singleLineText") {
	    		this.currentSettingsColumn.parents("th").find(".add-row-controls").html("<input type='text' class='control'/>");
	    	} else if(fieldData.typeUI == "textArea") {
	    		this.currentSettingsColumn.parents("th").find(".add-row-controls").html("<textarea class='control'></textarea>");
	    	} else if(fieldData.typeUI == "number") {
	    		this.currentSettingsColumn.parents("th").find(".add-row-controls").html("<input type='number' class='control'/>");
	    	} else if (fieldData.typeUI == "date") {
	    		var inputElement = $("<input type='text' class='control datepicker'/>");
    			this.currentSettingsColumn.parents("th").find(".add-row-controls").html(inputElement);
    			this.bindDatePicker();	
	    	}
	    	this.columns.get({cid:this.currentColumnCid}).set({
    			"cell": Backgrid.resolveNameToClass("Custom", "Cell"), //window.constants.BackgridCell[fieldData.typeUI],
		        "filterType": window.constants.BackgridCell[fieldData.typeUI],
		        "inputType": window.constants.BackgridCell[fieldData.typeUI],
	    	});
	    	this.backGrid.body.refresh();
	    	//this.dataCollection.reset(this.dataCollection.toJSON());
	    },
	    displaySubMenu: function(parent){
	    	var menuOptions
	    },
	    deleteColumnIconClick: function(evt){
    		var element = $(evt.currentTarget);
    		evt.preventDefault();
    		evt.stopPropagation();
    		var cid = element.parent().data("column-cid");
			GridUtils.removeField(this.entity,this.columns.get({cid:cid}).toJSON().fieldData);
			this.renderGrid();
	    },
	    onColumnTypeClicked: function(evt){
	    	var key = $(evt.currentTarget).data("key");
	    	$("#columnContextMenu").hide();
	    },
	    addRowBtnClick: function(){
	    	this.getDataFromAddControls();
	    	$(".add-row-controls .control").val('');
	    },
	    getDataFromAddControls: function(){
	    	var addControls = $('.add-row-controls .control');
	    	var fields = _.filter(this.columns.toJSON(),function(model){return model.fieldData != null});
	    	var columnNames = _.pluck(fields,"name");
	    	var model =  new Backbone.Model();
	    	_.each(columnNames,function(columnName,i){
	    		model.set(columnName,$(addControls[i]).val());
	    	});
	    	this.dataCollection.add(model);
	    	// this.backGrid.insertRow(model);
	    },	
	    onAddRowInpuBoxClick: function(evt){
	    	evt.preventDefault();
	    	evt.stopPropagation();
	    	evt.currentTarget.focus();
	    },
	    onGridJsonBtnClick: function(){
	    	alert(JSON.stringify(this.columns.toJSON()));
	    },
	    onSaveGridButtonClick: function(){
	    	GridUtils.saveToDb(this.entity.csingular,function(){
	    	});
	    },
		getGridData: function(){
			var self = this;
			$.getJSON(window.gridBaseUrl+"customer.json",(function(data){
	            self.dataCollection.reset(data);
	            self.renderPagination();
	        }).bind(this));
		},
		setGrid: function(gridData) {
			this.entity = gridData.entity;
			this.gridData = gridData.data;
        },
	});
	return View;
});