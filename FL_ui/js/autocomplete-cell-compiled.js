/*
  backgrid-autocomplete-cell
  https://github.com/PeterDowdy/backgrid-autocomplete-cell

  Copyright (c) 2013 Peter Dowdy and contributors
  Licensed under the MIT @license.
*/
"use strict";

(function (factory) {

    // CommonJS
    if (typeof exports == "object") {
        module.exports = factory(require("underscore"), require("backgrid"));
    }
    // Browser
    else if (typeof _ !== "undefined" && typeof Backgrid !== "undefined") {
        factory(_, Backgrid);
    }
})(function (_, Backgrid) {

    /**
     AutocompleteCellEditor is a cell editor that renders an <input> element and initializes it as an autocomplete widget
       See:
         - [Autocomplete](http://jqueryui.com/autocomplete/)
       @class Backgrid.Extension.AutocompleteCellEditor
     @extends Backgrid.InputCellEditor
    */
    var AutocompleteCellEditor = Backgrid.Extension.AutocompleteCellEditor = Backgrid.InputCellEditor.extend({
        formatter: Backgrid.StringFormatter,
        tagName: "input",
        attributes: {
            type: "text"
        },

        /** @property */
        autocompleteOptions: null,

        /**
           Sets the options for `autocomplete`. Called by the parent AutocompleteCell during edit mode.
         */
        setAutocompleteOptions: function setAutocompleteOptions(options) {
            this.autocompleteOptions = options;
        },
        events: {},
        initialize: function initialize(options) {
            Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
            this.autocompleteUrl = options.column.get("autocompleteUrl");
            if (this.autocompleteUrl[this.autocompleteUrl.length] != "/") this.autocompleteUrl += "/";
            this.minTermLength = options.column.get("minTermLength");
            this.resultsFormatter = options.column.get("resultsFormatter");
            this.labelProperty = options.column.get("labelProperty");
            _.bindAll(this, "render", "getAutocompleteCustomers", "saveOrCancel", "postRender");
        },

        /**
           Renders an <input> element and then initializes an autocomplete widget off of it
             @chainable
         */
        render: function render() {
            var thisView = this;
            this.$el.autocomplete({
                source: thisView.getAutocompleteCustomers,
                select: function select(event, ui) {
                    if (!ui.item.value) {
                        return;
                    } else {
                        thisView.model.set(thisView.column.attributes.name, ui.item.label);
                    }
                    thisView.saveOrCancel(event);
                },
                close: function close(event) {
                    thisView.saveOrCancel(event);
                }
            });
            return this;
        },
        getAutocompleteCustomers: function getAutocompleteCustomers(request, response) {
            var thisView = this;
            var term = request.term;
            if (term.length < this.minTermLength) {
                response([]);
                return;
            }
            $.ajax({
                url: thisView.autocompleteUrl + term,
                contentType: "application/json",
                type: "GET",
                success: function success(data) {
                    var results = [];
                    for (var i = 0; i < data.length; i++) {
                        if (typeof thisView.resultsFormatter == "function") results.push(thisView.resultsFormatter(data[i]));else if (thisView.labelProperty) results.push({
                            label: data[i][thisView.labelProperty]
                        });else results.push({
                            label: data[i]
                        });
                    }
                    results = _.compact(results);
                    if (results.length == 0) {
                        results.push({
                            label: "No results found",
                            value: ""
                        });
                    }
                    response(results);
                    return;
                },
                error: function error(err) {
                    results.push({
                        label: "No results found",
                        value: ""
                    });
                    response(results);
                    return;
                }
            });
        },
        saveOrCancel: function saveOrCancel(e) {
            var model = this.model;
            var column = this.column;

            var command = new Backgrid.Command(e);
            if (e.type == "autocompleteclose") {
                e.stopPropagation();
                model.trigger("backgrid:edited", model, column, command);
            }
        },
        postRender: function postRender(model, column) {
            if (column == null || column.get("name") == this.column.get("name")) {
                // move the cursor to the end on firefox if text is right aligned
                if (this.$el.css("text-align") === "right") {
                    var val = this.$el.val();
                    this.$el.focus().val(null).val(val);
                } else this.$el.focus();
            }
            return this;
        }
    });

    /**
     AutocompleteCell is a cell class that renders a jQuery autocomplete widget during edit mode.
       @class Backgrid.Extension.Select2Cell
     @extends Backgrid.SelectCell
    */
    Backgrid.Extension.AutocompleteCell = Backgrid.StringCell.extend({
        initialize: function initialize(options) {
            Backgrid.StringCell.prototype.initialize.apply(this, arguments);
            this.listenTo(this.model, "backgrid:edit", function (model, column, cell, editor) {
                if (column.get("name") == this.column.get("name")) {
                    editor.setAutocompleteOptions(this.autocompleteOptions);
                }
            });
        },
        className: "autocomplete-cell",
        editor: AutocompleteCellEditor
    });
});

//# sourceMappingURL=autocomplete-cell-compiled.js.map