define(function(require){
	'use strict';

	var Template = require("text!templates/main.html");
	var EntityModel = require("formMaker/js/models/entity_model");
	
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
			// this.loadEntities();
			this.render();
		},
		loadEntities: function(){
			this.entityModel.loadEntities();
		},
		onEntitiesLoaded: function(){
			this.render();	        
	    },
	    render: function(){
			this.$el.html(Template);
		    $(this.gridContainerId).empty();
		    var columnCollection = this.getColumnCollection();
    		var dataCollection = this.getDataCollection();
    		var grid = new Backgrid.Grid({
		        header: Backgrid.Header,
		        columns: columnCollection,
		        collection: dataCollection
		    });

		    var $grid = $(this.gridContainerId).appendTo(this.gridContainerId).append(grid.render().el);
		    this.renderPagination($grid, dataCollection);
		    this.renderSizeableColumns($grid, grid, dataCollection, columnCollection);
	    },
	    renderPagination: function($grid, dataCollection){
		    // Initialize the paginator
		    var paginator = new Backgrid.Extension.Paginator({
		        collection: dataCollection
		    });
		    // Render the paginator
		    $grid.after(paginator.render().el);
		},
		renderSizeableColumns: function($grid, grid, dataCollection,columnCollection) {
		    // Add sizeable columns
		    var sizeAbleCol = new Backgrid.Extension.SizeAbleColumns({
		        collection: dataCollection,
		        columns: columnCollection,
		        grid: grid
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
		        grid: grid,
		        sizeAbleColumns: sizeAbleCol
		    });
		    $grid.find('thead').before(orderHandler.render().el);
		},
		getDataCollection : function() {
		    var PageableTerritories = Backbone.PageableCollection.extend({
		        model: this.model,
		        url : "",
		        state: {
		            pageSize: 15
		        },
		        mode: "client" // page entirely on the client side
		    });
		    var dataCollection = new PageableTerritories(this.getGridData());
		    return dataCollection;
		},
		getColumnCollection : function() {
		    var extraSettings = {
		        "select-column": {
		            nesting: [],
		            width: "*",
		            resizeAble: false,
		            orderable: false
		        },
		        "id": {
		            width: "*",
		            nesting: [],
		            resizeable: false,
		            orderable: true
		        }
		    };
		    var columnDefinition = [{
		        name: "select-column",
		        cell: "select-row",
		        headerCell: "select-all"
		    }, {
		        name: "id", // The key of the model attribute
		        label: "ID", // The name to display in the header
		        editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
		        cell: Backgrid.IntegerCell.extend({
		            orderSeparator: ""
		        })
		    }];
		    for (var j = 0; j < columnDefinition.length; j++) {
		        var column = columnDefinition[j];
		        if (_.has(extraSettings, column.name)) {
		            column.nesting = extraSettings[column.name].nesting;
		            column.resizeable = extraSettings[column.name].resizeable;
		            column.width = extraSettings[column.name].width;
		        }
		    }
		    for (var j = 0; j < columnDefinition.length; j++) {
		        var columno = columnDefinition[j];
		        if (_.has(extraSettings, columno.name)) {
		            columno.orderable = extraSettings[columno.name].orderable;
		        }
		    }
		    var columns = new Backgrid.Extension.OrderableColumns.orderableColumnCollection(columnDefinition);
		    columns.setPositions().sort();
		    return columns;
		},
		getGridData: function(){
			return [];
		}
	});
	return View;
});