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
		},
		init : function(){
			this.loadEntities();
			//this.render();
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
		    $(this.gridContainerId).empty();
		    var columnCollection = this.columns = this.getColumnCollection();
    		var dataCollection = this.getDataCollection();
    		this.backGrid = new Backgrid.Grid({
		        columns: columnCollection,
		        collection: dataCollection
		    });

		    var $grid = $(this.gridContainerId).appendTo(this.gridContainerId).append(this.backGrid.render().el);
		    this.renderPagination($grid, dataCollection);
		    this.renderSizeableColumns($grid, dataCollection, columnCollection);
	    },
	    renderPagination: function($grid, dataCollection){
		    // Initialize the paginator
		    var paginator = new Backgrid.Extension.Paginator({
		        collection: dataCollection
		    });
		    // Render the paginator
		    $grid.after(paginator.render().el);
		},
		renderSizeableColumns: function($grid, dataCollection,columnCollection) {
		    // Add sizeable columns
		    var sizeAbleCol = new Backgrid.Extension.SizeAbleColumns({
		        collection: dataCollection,
		        columns: columnCollection,
		        grid: this.backGrid
		    });
		    $grid.find('thead').before(sizeAbleCol.render().el);
		    // Add resize handlers
		    var sizeHandler = new Backgrid.Extension.SizeAbleColumnsHandlers({
		        sizeAbleColumns: sizeAbleCol,
		        saveColumnWidth: true
		    });
		    $grid.find('thead').before(sizeHandler.render().el);
		    // Make columns reorderable
		    var orderHandler = new Backgrid.Extension.OrderableColumns({
		        grid: this.backGrid,
		        sizeAbleColumns: sizeAbleCol
		    });
		    $grid.find('thead').before(orderHandler.render().el);
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
		    columnDefinition.push({
		    	"name" : "+",
		    	"width" : 50,
		    	"sortable":false,
		    	"resizeable": false,
		    	cell: Backgrid.HeaderCell.extend({
		    		render:function(){
		    			this.$el.empty();
		    		}
		    	}),
		    	headerCell: Backgrid.HeaderCell.extend({
			  		// Implement your "select all" logic here
				  	render : function(){
				  		this.$el.empty();
				  		this.$el.append("<a class='new-column'>+</a>");
            			var column = this.column;
            			this.$el.addClass(column.get("name"));
            			this.delegateEvents();
            			return this;
				  	},
					onClick: function(evt){
				  		//debugger;
		  				self.addColumn();
				  	}
				})
		    });
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
	                    debugger;
	                    var column = GridUtils.addField(self.entity,data.master);
	                    self.backGrid.insertColumn(column,{at:self.columns.models.length - 1});
	                    //self.m_Editor.updateElement(data.master);
	                }
	            }
	        });
	        fieldEditorModal.show();
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