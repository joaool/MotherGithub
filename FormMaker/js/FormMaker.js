FormMaker = {};
FormMaker = Backbone.View.extend({
	m_lstTemplates : [],
	initialize : function(){
		// $.each(FormMaker.Elements,function(i,item){
		// 	this.m_lstTemplate = _.template("#"+item);
		// });

	},
	loadJSON : function(json){
        this.addElements(json.left,"#formLeft");
		this.addElements(json.right,"#formRight");
	},
    addElements: function(elements,divId){
        var arrObjs = [];
		$.each(elements,(function(i,item){
			console.log("--># "+i+" - elementToDisplay="+item.element+" value="+item.value);
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
