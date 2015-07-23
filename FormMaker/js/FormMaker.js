FormMaker = {};
FormMaker = Backbone.View.extend({
	m_lstTemplates : [],
    model : null,
    arrObjs : null,
    
	initialize : function(){
		this.model = new FormMakerModel();
        this.arrObjs = {};
	},
    events: {
        "click #saveBtn" : "saveBtnClick",
        "click #insertBtn" : "insertBtnClick"
    },
	loadJSON : function(json){
        this.model.set("json",json);
        this.model.loadEntities(this.entitiesLoaded.bind(this));
	},
    loadValues: function(json){
        this.model.set("values",json);  
    },
    entitiesLoaded: function(){
        this.arrObjs = {};
        this.addElements(this.model.get("json").left,"#formLeft");
		this.addElements(this.model.get("json").right,"#formRight");
        
        $.each(Object.keys(this.arrObjs),(function(i,key){
			var item = this.arrObjs[key];
            item.render();
		}).bind(this));
        
        //this.applyValues(this.model.get("values"));
    },
    addElements: function(elements,divId){
        
		$.each(elements,(function(i,item){
			console.log("--># "+i+" - elementToDisplay="+item.element+" value="+item.value);
			var field = this.model.get("fields")[item.fCN];
            var elementJson = {
                "element" : FormMaker.DBElements[field.typeUI] || FormMaker.Elements.Text,
                "leftLabel" : field.label,
                "name" : field.name,
                "type" : field.type,
                "id" : item.fCN,
                "value" : this.model.get("values")[item.fCN]
            }
            item = _.extend({},elementJson,item);
            if (FormMaker[item.element])
			{
				var obj = new FormMaker[item.element]({el : divId});
				obj.loadData(item);
				this.arrObjs[item.fCN] = obj;
			}
			else
			{
				console.log("Class not found for :" +item.element);
			}
		}).bind(this));
		
    },
    applyValues:  function(values){
        if (values){
            $.each(Object.keys(values),(function(key){
                if ($(key).length){
                   // this.arrObjs[key].update({property : "value", value : values[key]});
                }
            }).bind(this));
        }
    },
    saveBtnClick: function(){
        var eCN = this.model.get("json")["eCN"];   
        var data = {};
        $.each(Object.keys(this.arrObjs),(function(i,key){
			var item = this.arrObjs[key];
            data[key] = item.getValue();
		}).bind(this));
        // save Data to Table
        console.log(data);
    },
    insertBtnClick: function(){
        var eCN = this.model.get("json")["eCN"];
        var data = {};
        $.each(Object.keys(this.arrObjs),(function(i,key){
			var item = this.arrObjs[key];
            data[key] = item.getValue();
		}).bind(this));
        // insert Data to Table
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
