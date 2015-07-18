FormMaker = {};
FormMaker = Backbone.View.extend({
	m_lstTemplates : [],
    model : null,
	initialize : function(){
		this.model = new FormMakerModel();

	},
	loadJSON : function(json){
        this.model.set("json",json);
        this.model.loadEntities(this.entitiesLoaded.bind(this));
	},
    entitiesLoaded: function(){
        this.addElements(this.model.get("json").left,"#formLeft");
		this.addElements(this.model.get("json").right,"#formRight");
    },
    addElements: function(elements,divId){
        var arrObjs = [];
		$.each(elements,(function(i,item){
			console.log("--># "+i+" - elementToDisplay="+item.element+" value="+item.value);
			var field = this.model.get("fields")[item.fCN];
            var elementJson = {
                "element" : FormMaker.DBElements[field.typeUI] || FormMaker.Elements.Text,
                "leftLabel" : field.label,
                "name" : field.name,
                "type" : field.type,
            }
            item = _.extend({},elementJson,item);
            if (FormMaker[item.element])
			{
				var obj = new FormMaker[item.element]({el : divId});
				obj.loadData(item);
				arrObjs.push(obj);
			}
			else
			{
				console.log("Class not found for :" +item.element);
			}
		}).bind(this));
		$.each(arrObjs,function(i,item){
			item.render();
		});
    }
});
FormMaker.Events = {
    "PropertyChange" : "propChange",
    "ElementClick" : "elementClick",
    "ValueChange" : "valueChange",
    "TypeChange" : "typeChange"
}

FormMaker.Elements = {
	Label : "TextLabel",
	Text : "Text",
	Button : "Button",
	Checkbox : "Checkbox",
	Radio : "Radio",
	Combo : "Combo",
	Date : "Date",
    TextArea : "TextArea",
    Image : "Image"
};

FormMaker.DBElements = {
    numberbox : "Text",
    textbox : "Text",
    combobox : "Combo",
    email : "Text",
    emailbox : "Text"
}

FormMaker.DBType = {
    number : "number",
    string : "text",
    text : "text"
}
