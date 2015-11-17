define(function(require){
	'use strict';

	var Template = require("text!templates/main.html");
	var RightContainer = require("views/right-container");
	var TableListItem = require("text!templates/table-list-item.html");

	var View = Backbone.View.extend({
		initialize: function(){
			
		},
		events: {
			"click #newTable" : "onNewTableClick",
			"click .table-list-item" : "onTableListItemClick"
		},
		onNewTableClick: function(){
			this.rightContainer.setNewTableView();
		},
		onTableListItemClick: function(evt){
			this.rightContainer.setEditTableView($(evt.currentTarget).data("id"));
		},
		render: function(){
			this.$el.append(Template);
			this.templateFixes();
			this.rightContainer = new RightContainer({"el" : "#rightContainer"});
			this.listenTo(this.rightContainer,"NEW_TABLE_CREATED",this.onTableCreated);
		},
		onTableCreated: function(table){
			$(Handlebars.compile(TableListItem)(table)).insertBefore(this.$el.find("#newTableListItem"));
		},
		init : function(){
			this.render();
		},
        templateFixes: function() {
            $(window).resize();
            $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
        },
	});
	return View;
});