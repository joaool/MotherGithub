"use strict";

FormDesigner.Views.PropertyPanel = Backbone.View.extend({

    name: null,
    label: null,
    value: null,
    placeholder: null,
    icon: null,
    tooltip: null,
    currentId: null,
    type: null,

    initialize: function initialize() {
        this.name = this.$("#name");
        this.label = this.$("#leftLabel");
        this.value = this.$("#value");
        this.placeholder = this.$("#placeholder");
        this.icon = this.$("#icon");
        this.tooltip = this.$("#tooltip");
        this.type = this.$("#type");
    },
    events: {
        "keyup #name": "onNameChange",
        "keyup #leftLabel": "onLabelChange",
        "keyup #value": "onValueChange",
        "keyup #placeholder": "onPlaceholderChange",
        "keyup #icon": "onTconChange",
        "keyup #tooltip": "onTooltipChange",
        "change #type input[type='radio']": "onTypeChange"
    },
    onNameChange: function onNameChange(evt) {
        var value = this.name.val();
        var data = {
            property: "name",
            value: value,
            id: this.currentId
        };
        this.trigger(FormDesigner.Events.PropertyChange, data);
    },
    onLabelChange: function onLabelChange(evt) {
        var value = this.label.val();
        var data = {
            property: "leftLabel",
            value: value,
            id: this.currentId
        };
        this.trigger(FormDesigner.Events.PropertyChange, data);
    },
    onValueChange: function onValueChange(evt) {
        var value = this.value.val();
        var data = {
            property: "value",
            value: value,
            id: this.currentId
        };
        this.trigger(FormDesigner.Events.PropertyChange, data);
    },
    onPlaceholderChange: function onPlaceholderChange(evt) {
        var value = this.placeholder.val();
        var data = {
            property: "placeholder",
            value: value,
            id: this.currentId
        };
        this.trigger(FormDesigner.Events.PropertyChange, data);
    },
    onTconChange: function onTconChange(evt) {
        var value = this.icon.val();
        var data = {
            property: "icon",
            value: value,
            id: this.currentId
        };
        this.trigger(FormDesigner.Events.PropertyChange, data);
    },
    onTooltipChange: function onTooltipChange(evt) {
        var value = this.tooltip.val();
        var data = {
            property: "tooltip",
            value: value,
            id: this.currentId
        };
        this.trigger(FormDesigner.Events.PropertyChange, data);
    },
    onTypeChange: function onTypeChange(evt) {
        var type = $(evt.target).val();
        var data = {
            property: "type",
            value: type,
            id: this.currentId
        };
        this.trigger(FormDesigner.Events.TypeChange, data);
    },
    setElementProperties: function setElementProperties(element) {
        this.name.val(element.name);
        this.label.val(element.leftLabel);
        this.value.val(element.value);
        this.placeholder.val(element.placeholder);
        this.icon.val(element.icon);
        this.tooltip.val(element.tooltip);
        this.currentId = element.id;
    }
});

//# sourceMappingURL=property_panel-compiled.js.map