define(function(require){
	'use strict';

	var Template = require("text!templates/main.html");
	var RightContainer = require("views/right-container");
	var TableListItem = require("text!templates/table-list-item.html");
	var EntityModel = require("formMakerLib/js/models/entity_model");

	var View = Backbone.View.extend({
		initialize: function(){
			this.entityModel = new FormDesigner.Models.EntityModel();
	        this.listenTo(this.entityModel,"change:entities",this.onEntitiesLoaded.bind(this));
		},
		events: {
			"click #newTable" : "onNewTableClick",
			"click .table-list-item" : "onTableListItemClick"
		},
		onNewTableClick: function(){
			this.rightContainer.setNewTableView();
		},
		onTableListItemClick: function(evt){
			this.rightContainer.editTable($(evt.currentTarget).data("id"));
		},
		render: function(){
			this.$el.append(Template);
			this.templateFixes();
			this.rightContainer = new RightContainer({"el" : "#rightContainer"});
			this.listenTo(this.rightContainer,"NEW_TABLE_CREATED",this.onTableCreated);
			this.listenTo(this.rightContainer,"TABLE_UPDATED",this.onTableUpdated);
	        var entityLoaded = this.entityModel.get("entities");
	        var self = this;
	        $.each(entityLoaded,function(index,entity){
	        	$(Handlebars.compile(TableListItem)({
	        		"id" : entity.csingular,
	        		"tableName" : entity.description
	        	})).insertBefore(self.$el.find("#newTableListItem"));
	        });
		},
		onTableCreated: function(table){
			this.renderTableToList(table);
		},
		renderTableToList : function(table){
			$(Handlebars.compile(TableListItem)(table)).insertBefore(this.$el.find("#newTableListItem"));
		},
		onTableUpdated: function(table){
			this.$el.find("#table-list-item-"+table.id).replaceWith($(Handlebars.compile(TableListItem)(table)));
		},
		init : function(){
			this.loadEntities();
		},
		loadEntities: function(){
			this.entityModel.loadEntities();
		},
		onEntitiesLoaded: function(){
			this.render();	        
	    },
        templateFixes: function() {
            $(window).resize();
            $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
        },
	});
	return View;
});