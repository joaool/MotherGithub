"use strict";

FormDesigner.Models.DesignerModel = Backbone.Model.extend({
    url: function url() {
        return "Entities.json";
    },

    initialize: function initialize() {
        this.loadJSON();
    },
    loadJSON: function loadJSON() {
        this.fetch({
            url: this.url(),
            success: this.onSuccess.bind(this),
            error: this.onError.bind(this)
        });
    },
    onSuccess: function onSuccess(obj, resp) {
        var elements = resp["elements"];
        var elems = [];
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            elems[element.cname] = element;
        }
        this.set("elems", elems);
    },
    onError: function onError(obj, resp) {},
    getElement: function getElement(cname) {
        return this.get("elems")[cname];
    },
    update: function update(data) {
        var element = this.getElementById(data.id);
        element[data.property] = data.value;
    },
    getElementById: function getElementById(id) {
        var elements = resp["elements"];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].id == id) {
                return elements[i];
            }
        }
        return {};
    }
});

//# sourceMappingURL=designer_model-compiled.js.map