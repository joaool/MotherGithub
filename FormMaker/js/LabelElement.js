FormMaker.BaseElement = Backbone.View.extend({
	m_template : null,
	m_html : null,
    name : null,
    element : null,
    placeholder : null,
    value : null,
    icon : null,
    btnType : null,
    label : null,
    tooltip : null,
	initialize : function(){
		console.log('baseElement init');
	},
	events : {
		"focus input" : "focusIn",
		"blur input" : "focusOut",
		"change input" : "valueChange",
		"keyup input" : "valueChange",
        "click " : "onElementClick",
	},
	focusIn : function(evt){
		console.log("Focus In");
	},
	focusOut : function(evt){
		console.log("focus out");
	},
	valueChange : function(evt){
		console.log("value change");
        var cname = $(evt.target).closest(".dropped").attr("cname");
        this.trigger(FormDesigner.Events.ElementClick,cname);
	},
	loadData : function(data){
        this.jsonData = data;
	},
	render : function(){
		var element = $.parseHTML(this.m_template(this.jsonData).trim());
        this.$el.append(element);
        this.setElement(element);
		this.onRender();
        this.setElements();
	},
    setElements : function(){
        this.name = this.$("#name");
        this.element = this.$("#element");
        this.placeholder = this.$("#placeholder");
        this.value = this.$("#value");
        this.icon = this.$("#icon");
        this.btnType = this.$("#btnType");
        this.leftLabel = this.$("#leftLabel");
        this.tooltip = this.$("#tooltip");
    },
	onRender : function(){
		
	},
    update: function(data){
        this.jsonData[data.property] = data.value;
        this.m_html = this.m_template(this.jsonData);
        var newElement = $.parseHTML(this.m_html.trim());
        this.$el.replaceWith(newElement);
        this.setElement(newElement);
        this.onRender();
        this.setElements();
    },
    onElementClick: function(evt){
        var cname = $(evt.target).closest(".dropped").attr("cname");
        this.trigger(FormDesigner.Events.ElementClick,cname);
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

FormMaker.TextArea = FormMaker.BaseElement.extend({
	
	initialize : function(){
		console.log('TextArea init');
		this.m_template = Handlebars.compile($("#__textarea").html());
	}
});

FormMaker.Image = FormMaker.BaseElement.extend({
	
    m_ImagePreview : null,
    m_ImageUploadBtn : null,
	initialize : function(){
		console.log('Image init');
		this.m_template = Handlebars.compile($("#__image").html());
	},
    onRender: function(){
        this.m_ImagePreview = this.$("#imagePreview");
		this.m_ImageUploadBtn = this.$("#imageUploadBtn");  
    },
    events : {
        "change #imageUploadBtn" : "ImageFileSelected",
        "load #imagePreview" : "OnImageLoaded"
    },
	OnImageLoaded : function(evt,obj){
		obj.m_ImagePreview[0].src = evt.target.result;
		
	},
	ImageFileSelected : function(evt){
		if (evt.target.files && evt.target.files[0]) {
			var reader = new FileReader();
			var temp = this;
			reader.onload = function(evt){temp.OnImageLoaded(evt,temp)};
			reader.readAsDataURL     (evt.target.files[0]);
		}
	},
});

FormMaker.Date = FormMaker.BaseElement.extend({
	datePicker : null,
	
	initialize : function(){
		console.log('Date init');
		this.m_template = Handlebars.compile($("#__date").html());
		
	},
	events : {
		"change .datePicker" : "onDatePickerValueChange"
	},
	onDatePickerValueChange : function(){
		
	},
	onRender: function(){
		$(".datePicker").datetimepicker({
            timeFormat: "hh:mm tt",
            controlType: 'select',
            oneLine: true,
        });
	}
	
});
