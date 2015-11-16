define(function(require){
	'use strict';

	var Template = require("text!templates/main.html");
	var RightContainer = require("views/right-container");

	var View = Backbone.View.extend({
		initialize: function(){
			
		},
		events: {
			"click #newTable" : "onNewTableClick"		
		},
		onNewTableClick: function(){
			this.rightContainer.setNewTableView();
		},
		render: function(){
			this.$el.append(Template);
			this.templateFixes();
			this.rightContainer = new RightContainer({"el" : "#rightContainer"});
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