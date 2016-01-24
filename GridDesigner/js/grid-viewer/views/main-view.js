define(function(require){
	'use strict';

	var Template = require("text!templates/main.html");
	var fieldEditionTemplate = require("text!templates/field-Edition.html");
	var EntityModel = require("formMaker/js/models/entity_model");
	var GridUtils = require("grid-viewer/grid-utils");

	var View = Backbone.View.extend({
		initialize: function(){
			this.gridContainerId = "#grid-container";
			this.entityModel = new FormDesigner.Models.EntityModel();
	        this.listenTo(this.entityModel,"change:entities",this.onEntitiesLoaded.bind(this));
	        this.model = Backbone.Model.extend({});
		},
		events: {
			"click #addColumnButton" : "addColumn",
			'click .delete-icon' : "deleteColumnIconClick"
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
		    this.$("th.editable").append("<div class='delete-icon' data-id='{{id}}'><i class='glyphicon glyphicon-plus' data-id='{{id}}'></i></div>");
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
		        url : "",
		        state: {
		            pageSize: 15
		        },
		        mode: "client" // page entirely on the client side
		    });
		    var dataCollection = new PageableGrid(this.getGridData());
		    return dataCollection;
		},
		getColumnCollection : function() {
			var self = this;
		    var columnDefinition = GridUtils.generateGridViewerData(this.entity,this.gridData);
		    var columns = new Backgrid.Extension.OrderableColumns.orderableColumnCollection(columnDefinition);
		    columns.setPositions().sort();
		    return columns;
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
	    deleteColumnIconClick: function(evt){
    		var element = $(evt.currentTarget);
    		evt.preventDefault();
    		evt.stopPropagation();
    		var cid = element.parent().data("column-cid");
			GridUtils.removeField(this.entity,this.columns.get({cid:cid}).toJSON().fieldData);
			this.renderGrid();
	    },
		getGridData: function(){
			return [];
		},
		setGrid: function(gridData) {
			this.entity = gridData.entity;
			this.gridData = gridData.data;
        },
	});
	return View;
});