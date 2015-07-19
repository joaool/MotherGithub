"use strict";

Elements = Backbone.Collection.extend({
    model: ElementModel,

    saveToDB: function saveToDB() {
        this.models.forEach(function (model) {
            model.saveToDB();
        });
    }
});

//# sourceMappingURL=elements-compiled.js.map