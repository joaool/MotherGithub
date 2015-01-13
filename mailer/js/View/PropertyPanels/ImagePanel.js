MailerTemplate.Views.ImagePanel = Backbone.View.extend({
	m_ImageTemplate : null,
	m_propertyPanel : null,
	m_Model : null,
	m_styleTab : null,
	m_ImageBody : null,
	m_ImagePreview : null,
	m_ImageUploadBtn : null,
	m_ImageLinkUpdateBtn : null,
	m_ImageSize : null,
	m_ImageName : null,
	m_ImageLink : null,
	
	initialize : function(){
		this.m_propertyPanel = $("#propertyPanel");
		this.m_ImageBody = $("#imageBody");
		this.m_ImageBody.show();
		this.m_ImagePreview = $("#imagePreview");
		this.m_ImageUploadBtn = $("#imageUploadBtn");
		this.m_ImageLinkUpdateBtn = $("#updateImageLinkBtn");
		this.m_ImageSize = $("#imageSize");
		this.m_ImageName = $("#imageName");
		this.m_ImageLink = $("#txtImageLink");
		
		this.m_styleTab = new MailerTemplate.Views.StyleTab({el : "#styletab"});
		this.hide();
		
	},
	events : {
		"load #imagePreview" : "OnImageLoaded",
		"change #imageUploadBtn" : "ImageFileSelected",
		"click #updateImageLinkBtn" : "UpdateImageLink"
	},
	OnImageLoaded : function(evt,obj){
		obj.m_ImagePreview[0].src = evt.target.result;
		obj.m_Model.setSource(evt.target.result);
	},
	ImageFileSelected : function(evt){
		if (evt.target.files && evt.target.files[0]) {
			var reader = new FileReader();
			var temp = this;
			reader.onload = function(evt){temp.OnImageLoaded(evt,temp)};
			reader.readAsDataURL(evt.target.files[0]);
		}
	},
	UpdateImageLink : function(evt){
		this.m_Model.setLink(this.m_ImageLink.val());
	},
	render : function(){
		
	},
	show : function(){
		this.m_ImageBody.show();
		this.m_styleTab.setTemplateType(MailerTemplate.TemplateItems.IMAGE);
		this.listenTo(this.m_styleTab,MailerTemplate.Views.StyleTab.STYLE_PROPERTY_CHANGED,this.OnStylePropertyChanged);
	},
	clear: function(){
	},
	hide: function(){
		this.m_ImageBody.hide();
		this.stopListening(this.m_styleTab);
	},
	renderModel : function(model){
		this.m_Model = model;
		this.m_ImagePreview[0].src = model.getSource();
		this.m_ImageLink.val(model.getLink());
		this.m_styleTab.setStyleProperty(model.getStyleProperty());
	},
	OnStylePropertyChanged : function(data){
		this.m_Model.setStyleProperty(data);

	}
});