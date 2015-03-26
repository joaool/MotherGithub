FormMaker.BaseElement = Backbone.View.extend({
	m_template : null,
	m_html : null,
	initialize : function(){
		console.log('baseElement init');
	},
	events : {
		"focus input" : "focusIn",
		"blur input" : "focusOut",
		"change input" : "valueChange",
		"keyup input" : "valueChange"
	},
	focusIn : function(evt){
		console.log("Focus In");
	},
	focusOut : function(evt){
		console.log("focus out");
	},
	valueChange : function(evt){
		console.log("value change");
	},
	loadData : function(item){
		this.m_html = this.m_template(item);
		//console.log(this.m_html);
	},
	render : function(){
		$("body").append($.parseHTML(this.m_html));
	}
});
FormMaker.TextLabel = FormMaker.BaseElement.extend({
	
	initialize : function(){
		console.log('TextLabel init');
		this.m_template = Handlebars.compile($("#__textLabel").html());
	}
});

FormMaker.Text = FormMaker.BaseElement.extend({
	
	initialize : function(){
		console.log('Text init');
		this.m_template = Handlebars.compile($("#__text").html());
	}
});

FormMaker.Button = FormMaker.BaseElement.extend({
	
	initialize : function(){
		console.log('Button init');
		this.m_template = Handlebars.compile($("#__button").html());
	}
});

FormMaker.Checkbox = FormMaker.BaseElement.extend({
	
	initialize : function(){
		console.log('Checkbox init');
		this.m_template = Handlebars.compile($("#__checkbox").html());
	}
});

FormMaker.Radio = FormMaker.BaseElement.extend({
	
	initialize : function(){
		console.log('Radio init');
		this.m_template = Handlebars.compile($("#__radiobox").html());
	}
});

FormMaker.Combo = FormMaker.BaseElement.extend({
	
	initialize : function(){
		console.log('Combo init');
		this.m_template = Handlebars.compile($("#__combo").html());
	}
});