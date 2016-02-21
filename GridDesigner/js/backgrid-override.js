define(function(require) {
    'use strict';

    var CustomCellEditor = Backgrid.CustomCellEditor = Backgrid.InputCellEditor.extend({
		initialize: function (options) {
			Backgrid.CustomCellEditor.__super__.initialize.apply(this, arguments);

			if (options.placeholder) {
			  this.$el.attr("placeholder", options.placeholder);
			}
		},
		saveOrCancel: function (e) {
		    var formatter = this.formatter;
		    var model = this.model;
		    var column = this.column;

		    var command = new Backgrid.Command(e);
		    var blurred = e.type === "blur";

		    if (command.moveUp() || command.moveDown() || command.moveLeft() || command.moveRight() ||
		        command.save() || blurred) {

		      e.preventDefault();
		      e.stopPropagation();

		      var val = this.$el.val();
		      var newValue = formatter.toRaw(val, model,column);
		      if (_.isUndefined(newValue)) {
		        model.trigger("backgrid:error", model, column, val);
		      }
		      else {
		        model.set(column.get("name"), newValue);
		        model.trigger("backgrid:edited", model, column, command);
		      }
		    }
		    // esc
		    else if (command.cancel()) {
		      // undo
		      e.stopPropagation();
		      model.trigger("backgrid:edited", model, column, command);
		    }
		 },
		render: function(){
			var model = this.model;
		    this.$el.val(this.formatter.fromRaw(model.get(this.column.get("name")), model,this.column));
		    return this;
		}
	});

	Backgrid.CustomCell = Backgrid.Cell.extend({
		initialize : function(){
			var column = arguments[0].column;
			 var formatter = Backgrid.resolveNameToClass(column.get("formatter") ||
	                                    this.formatter, "Formatter");

		    if (!_.isFunction(formatter.fromRaw) && !_.isFunction(formatter.toRaw)) {
		      formatter = new formatter();
		    }
		    arguments[0].formatter = formatter;
			Backgrid.CustomCell.__super__.initialize.apply(this, arguments);
			this.editor = Backgrid.CustomCellEditor;
		},
		render: function () {
		    this.$el.empty();
		    var model = this.model;
		    this.$el.text(this.formatter.fromRaw(model.get(this.column.get("name")), model, this.column));
		    this.delegateEvents();
		    return this;
	  	}
	});
	Backgrid.CustomStringCell = Backgrid.StringCell.extend({
		
	});
	Backgrid.CustomUriCell = Backgrid.UriCell.extend({
		render: function () {
		    this.$el.empty();
		    var rawValue = this.model.get(this.column.get("name"));
		    var formattedValue = this.formatter.fromRaw(rawValue, this.model, this.column);
		    this.$el.append($("<a>", {
		      tabIndex: -1,
		      href: rawValue,
		      title: this.title || formattedValue,
		      target: this.target
		    }).text(formattedValue));
		    this.delegateEvents();
		    return this;
		  }
	});
});