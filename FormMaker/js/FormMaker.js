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
            var elementJson = {};
            if (item.fCN = ""){
                var styleString = ";font-size:"+elementData.fontSize+";color:"+elementData.fontColor+";white-space:"+elementData.titleAlignment+";";
                elementJSON = {
                    "element" : FormMaker.Elements.Text,
                    leftLabel : item.label,
                    fontSize : item.fontSize,
                    fontColor : item.fontColor,
                    textAlignment : item.textAlignment,
                    style : styleString
                };
            }
            else {
                var field = this.model.get("fields")[item.fCN];
                elementJson = {
                    "element": FormMaker.DBElements[field.typeUI] || FormMaker.Elements.Text,
                    "leftLabel": field.label,
                    "name": field.name,
                    "type": field.type,
                    "id": item.fCN,
                    "value": this.model.get("values")[item.fCN]
                }
            }
            item = _.extend({},elementJson,item);
            if (FormMaker[item.element])
			{
				var obj = new FormMaker[item.element]({el : divId});
				obj.loadData(item);
				this.arrObjs[item   .fCN] = obj;
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
    "LabelClick" : "labelClick",
    "ValueChange" : "valueChange",
    "TypeChange" : "typeChange",
    "LabelTypeChange" : "labelTypeChange"
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
    emailbox : "Text",
    "text" : "Text",
    datetime : "Date",
    date : "Date",
    "integerbox": "Text",
    "percentbox": "Text",
    "currencybox": "Text",
    "textUpperbox": "Text",
    "areabox": "TextArea",
    "phonebox": "Text",
    "datetimebox": "Date",
    "checkbox": "Checkbox",
    "urlbox": "Text",
    "lookupbox": "Text"
}

FormMaker.DBType = {
    number : "number",
    string : "text",
    text : "text"
}

FormMaker.TypeTemplate = [
    {
        typeId : "TypeTextLabel",
        typeValue : "TextLabel",
        displayLabel: "Label"
    },
    {
        typeId : "TypeText",
        typeValue : "Text",
        displayLabel: "Textbox"
    },
    {
        typeId : "TypeButton",
        typeValue : "Button",
        displayLabel: "Button"   
    },
    {
        typeId : "TypeCheckbox",
        typeValue : "Checkbox",
        displayLabel: "Checkbox"
    },
    {
        typeId : "TypeRadio",
        typeValue : "Radio",
        displayLabel: "Radio"
    },
    {
        typeId : "TypeCombo",
        typeValue : "Combo",
        displayLabel: "Combo"
    },
    {
        typeId : "TypeDate",
        typeValue : "Date",
        displayLabel: "Date"
    },
    {
        typeId : "TypeTextArea",
        typeValue : "TextArea",
        displayLabel: "Text area"
    },
    {
        typeId : "TypeImage",
        typeValue : "Image",
        displayLabel: "Image"
    },
    {
        typeId : "TypeNumber",
        typeValue : "Number",
        displayLabel: "Number"
    },
    {
        typeId : "TypePercent",
        typeValue : "Percent",
        displayLabel: "Percent"
    },
    {
        typeId : "TypeCurrency",
        typeValue : "Currency",
        displayLabel: "Currency"
    },
    {
        typeId : "TypeEmail",
        typeValue : "Email",
        displayLabel: "Email"
    },
    {
        typeId : "TypePhone",
        typeValue : "Phone",
        displayLabel: "Phone"
    },
    {
        typeId : "TypeUrl",
        typeValue : "Url",
        displayLabel: "Url"
    },
    {
        typeId : "TypeLookup",
        typeValue : "LoolUp",
        displayLabel: "LookUp"
    }
]
