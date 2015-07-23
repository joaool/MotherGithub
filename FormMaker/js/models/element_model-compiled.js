"use strict";

ElementModel = Backbone.Model.extend({

    saveToDB: function saveToDB() {
        FL.dd.t.entities[this.get("entityName")].fields[this.get("fieldName")].setField(this.toJSON());
    }
});

//# sourceMappingURL=element_model-compiled.js.map