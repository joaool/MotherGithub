FormDesigner.Views.PropertyPanel = Backbone.View.extend({
    
    name : null,
    label: null,
    value: null,
    placeholder: null,
    icon: null,
    tooltip: null,
    currentId : null,
    
    initialize: function(){
        this.name = this.$("#name");
        this.label = this.$("#leftLabel");
        this.value = this.$("#value");
        this.placeholder = this.$("#placeholder");
        this.icon = this.$("#icon");
        this.tooltip = this.$("#tooltip");
    },
    events: {
        "keyup #name" : "onNameChange",
        "keyup #leftLabel" : "onLabelChange",
        "keyup #value" : "onValueChange",
        "keyup #placeholder" : "onPlaceholderChange",
        "keyup #icon" : "onTconChange",
        "keyup #tooltip" : "onTooltipChange",
    },
    onNameChange : function(evt){
        var value = this.name.val();
        var data = {
            property : "name",
            value : value,
            id : this.currentId
        }
        this.trigger(FormDesigner.Events.PropertyChange,data);
    },
    onLabelChange : function(evt){
        var value = this.label.val();
        var data = {
            property : "leftLabel",
            value : value,
            id : this.currentId
        }
        this.trigger(FormDesigner.Events.PropertyChange,data);
    },
    onValueChange : function(evt){
        var value = this.value.val();
        var data = {
            property : "value",
            value : value,
            id : this.currentId
        }
        this.trigger(FormDesigner.Events.PropertyChange,data);
    },
    onPlaceholderChange : function(evt){
        var value = this.placeholder.val();
        var data = {
            property : "placeholder",
            value : value,
            id : this.currentId
        }
        this.trigger(FormDesigner.Events.PropertyChange,data);
    },
    onTconChange : function(evt){
        var value = this.icon.val();
        var data = {
            property : "icon",
            value : value,
            id : this.currentId
        }
        this.trigger(FormDesigner.Events.PropertyChange,data);
    },
    onTooltipChange : function(evt){
        var value = this.tooltip.val();
        var data = {
            property : "tooltip",
            value : value,
            id : this.currentId
        }
        this.trigger(FormDesigner.Events.PropertyChange,data);
    },
    setElementProperties : function(element){
        this.name.val(element.name);
        this.label.val(element.leftLabel);
        this.value.val(element.value);
        this.placeholder.val(element.placeholder);
        this.icon.val(element.icon);
        this.tooltip.val(element.tooltip);
        this.currentId = element.id;
    }
});