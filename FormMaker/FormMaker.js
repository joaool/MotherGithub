FormMaker = Backbone.View.extend({	
	m_lstTemplates : [],
	initialize : function(){
		$.each(FormMaker.Elements,function(i,item){
			this.m_lstTemplate = _.template("#"+item);
		});
		
	},
	loadJSON : function(json){
		var elements = json.elements;
		var arrObjs = [];
		$.each(elements,(function(i,item){
			if (FormMaker[item.element])
			{
				var obj = new FormMaker[item.element]();
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

FormMaker.Elements = {
	Label : "TextLabel",
	Text : "Text",
	Button : "Button",
	Checkbox : "Checkbox",
	Radio : "Radio",
	Combo : "Combo"
	};