define(function(require){
	'use strict';

	var Template = require("text!templates/main.html");
	var RightContainer = require("views/right-container");
	var TableListItem = require("text!templates/table-list-item.html");
	var EntityModel = require("formMaker/js/models/entity_model");
	var Tables = require("collections/tables");
	var DBUtil = require("db-util");

	var View = Backbone.View.extend({
		initialize: function(){
			this.entityModel = new FormDesigner.Models.EntityModel();
	        this.listenTo(this.entityModel,"change:entities",this.onEntitiesLoaded.bind(this));
		},
		events: {
			"click #newTable" : "onNewTableClick",
			"click #newForm" : "onNewFormClick",
			"click .table-list-item" : "onTableListItemClick",
			"click .table-icons.form": "onFormIconClick" ,
			"click .table-icons.grid": "onGridIconClick",
			"click #okButton" : "onOkButtonClick",
			"click #cancelButton" : "onCancelButtonClick"
		},
		onOkButtonClick: function(){
			this.rightContainer.okBtnClick();
		},
		onCancelButtonClick: function(){
			this.rightContainer.cancelBtnClick();
		},
		onNewFormClick : function(){
			this.rightContainer.showFormView();
		},
		onFormIconClick: function(event){
			var entityId = $(event.currentTarget).data("id");
			var entity = DBUtil.getEntity(entityId);
			this.rightContainer.showFormView();
			this.rightContainer.setEntity(entity);
			event.stopPropagation();
		},
		onGridIconClick: function(event){
			var entityId = $(event.currentTarget).data("id");
			var entity = DBUtil.getEntity(entityId);
			// this.rightContainer.editTable(entityId);
			this.rightContainer.clearTableModel();
			this.rightContainer.setNewTableView();
			this.rightContainer.setEntity(entity);
			event.stopPropagation();
		},
		onNewTableClick: function(){
			this.rightContainer.clearTableModel();
			this.rightContainer.setNewTableView();
		},
		onTableListItemClick: function(evt){
			
		},
		render: function(){
			this.$el.html(Template);
			//this.templateFixes();
			this.initRightController();
			this.listTables();
		},
		initRightController : function(){
			this.rightContainer = new RightContainer({"el" : "#rightContainer"});
			this.listenTo(this.rightContainer,"TABLE_SAVED",this.renderTableToList);
			this.rightContainer.setTables(this.tables);
		},
	    listTables : function(){   
	        var self = this;
	        $.each(this.tables.models,function(index,table){
	        	$(Handlebars.compile(TableListItem)(table.toJSON())).insertBefore(self.$el.find("#newFormListItem"));
	        });
		},
		onTableCreated: function(table){
			this.renderTableToList(table);
		},
		renderTableToList : function(table){
			if (this.$el.find("#table-list-item-"+table.id).length > 0) {
				this.$el.find("#table-list-item-"+table.id).replaceWith($(Handlebars.compile(TableListItem)(table)));
			}
			else {
				$(Handlebars.compile(TableListItem)(table)).insertBefore(this.$el.find("#newFormListItem"));
			}
		},
		onTableUpdated: function(table){
			this.renderTableToList(table);
			this.tables = DBUtil.generateTablesFromEntities(this.entityModel.get("entities"));
			this.rightContainer.setTables(this.tables);
		},
		init : function(){
			this.loadEntities();
		},
		loadEntities: function(){
			this.entityModel.loadEntities();
		},
		onEntitiesLoaded: function(){
			this.tables = DBUtil.generateTablesFromEntities(this.entityModel.get("entities"));
			this.render();	        
	    },
        templateFixes: function() {
            $(window).resize();
            $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
        },
	});
	return View;
});