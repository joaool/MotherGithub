define(function(require) {
    'use strict';

    Backgrid.CustomHeaderCell = Backgrid.HeaderCell.extend({
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
            this.$el.append("<i class='glyphicon glyphicon-cog settings-icon'></i>");
            this.delegateEvents();
            return this;
    	}
    });

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
		    var col = this.column.get("inputType");

		    var command = new Backgrid.Command(e);
		    var blurred = e.type === "blur";
 			
 			if (blurred && (col.toLowerCase() == "date" || col.toLowerCase() == "datetime") &&
 				this.$el.val() == "")
		    {
		    	model.trigger("backgrid:error", model, column, val);
		    	return;
		    }
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
		    var col = this.column.get("inputType");
			var model = this.model;
			if (col.toLowerCase() == "textarea") {
		    	var textarea = ("<textarea></textarea>");
		    	var parent = this.$el.parent()
		    	parent.empty();
		    	this.setElement(textarea);
		    	parent.append(this.$el);
		    	this.$el.val(this.formatter.fromRaw(model.get(this.column.get("name")), model,this.column));
			} else {
			    this.$el.val(this.formatter.fromRaw(model.get(this.column.get("name")), model,this.column));
			    if (col.toLowerCase() == "date" || col.toLowerCase() == "datetime"){
		    		this.$el.datetimepicker({
			            timeFormat: "hh:mm tt",
			            controlType: 'select',
			            oneLine: true
			        });
			    }
			}
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