MailerTemplate.Views.PageDesign = Backbone.View.extend({
	
	pageWidth: null,
	headerBgColor: null,
	bodyBgColor : null,
	footerBgColor : null,
	headerPaddingLeft : null,
	headerPaddingRight : null,
	bodyPaddingLeft : null,
	bodyPaddingRight : null,
	footerPaddingLeft : null,
	footerPaddingRight : null,
	initialize : function(){
		this.pageWidth = this.$("#newsletterWidth");
		this.headerBgColor = this.$("#headerBgColor");
		this.bodyBgColor = this.$("#bodyBgColor");
		this.footerBgColor = this.$("#footerBgColor");
		this.headerPaddingLeft = this.$("#headerPaddingLeft");
		this.headerPaddingRight = this.$("#headerPaddingRight");
		this.bodyPaddingLeft = this.$("#bodyPaddingLeft");
		this.bodyPaddingRight = this.$("#bodyPaddingRight");
		this.footerPaddingLeft = this.$("#footerPaddingLeft");
		this.footerPaddingRight = this.$("#footerPaddingRight");
		
	},
	events:{
		"change #newsletterWidth" : "newsletterWidthChange",
		"keyup #newsletterWidth" : "newsletterWidthChange",
		"change.bfhcolorpicker #headerBgColor" : "headerBgColorChange",
		"change.bfhcolorpicker #bodyBgColor" : "bodyBgColorChange",
		"change.bfhcolorpicker #footerBgColor" : "footerBgColorChange",
		"change #headerPaddingLeft" : "headerPaddingLeftChange",
		"change #headerPaddingRight" : "headerPaddingRightChange",
		"change #bodyPaddingLeft" : "bodyPaddingLeftChange",
		"change #bodyPaddingRight" : "bodyPaddingRightChange",
		"change #footerPaddingLeft" : "footerPaddingLeftChange",
		"change #footerPaddingRight" : "footerPaddingRightChange",
		"keyup #headerPaddingLeft" : "headerPaddingLeftChange",
		"keyup #headerPaddingRight" : "headerPaddingRightChange",
		"keyup #bodyPaddingLeft" : "bodyPaddingLeftChange",
		"keyup #bodyPaddingRight" : "bodyPaddingRightChange",
		"keyup #footerPaddingLeft" : "footerPaddingLeftChange",
		"keyup #footerPaddingRight" : "footerPaddingRightChange"
	},
	setValues : function(data){
		this.pageWidth.val(data.pageWidth);
		this.headerBgColor.val(data.headerBgColor);
		this.bodyBgColor.val(data.bodyBgColor);
		this.footerBgColor.val(data.footerBgColor);
		this.headerPaddingLeft.val(data.headerPaddingLeft);
		this.headerPaddingRight.val(data.headerPaddingRight);
		this.bodyPaddingLeft.val(data.bodyPaddingLeft);
		this.bodyPaddingRight.val(data.bodyPaddingRight);
		this.footerPaddingLeft.val(data.footerPaddingLeft);
		this.footerPaddingRight.val(data.footerPaddingRight);
	},
	newsletterWidthChange : function(evt){
		if (evt.which != 8 && evt.which != 0 && (evt.which < 48 || evt.which > 57)) {
		   return false;
		}
		var data = {
			property : "width",
			value : $(evt.target).val()
		}
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,data);
	},
	headerBgColorChange : function(evt){
		var data = {
			property : "headerBgColor",
			value : $(evt.target).val()
		}
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,data);
	},
	bodyBgColorChange : function(evt){
		var data = {
			property : "bodyBgColor",
			value : $(evt.target).val()
		}
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,data);
	},
	footerBgColorChange : function(evt){
		var data = {
			property : "footerBgColor",
			value : $(evt.target).val()
		}
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,data);
	},
	headerPaddingLeftChange : function(evt){
		var data = {
			property : "headerPaddingLeft",
			value : $(evt.target).val()
		}
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,data);
	},
	headerPaddingRightChange : function(evt){
		var data = {
			property : "headerPaddingRight",
			value : $(evt.target).val()
		}
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,data);
	},
	bodyPaddingLeftChange : function(evt){
		var data = {
			property : "bodyPaddingLeft",
			value : $(evt.target).val()
		}
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,data);
	},
	bodyPaddingRightChange : function(evt){
		var data = {
			property : "bodyPaddingRight",
			value : $(evt.target).val()
		}
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,data);
	},
	footerPaddingLeftChange : function(evt){
		var data = {
			property : "footerPaddingLeft",
			value : $(evt.target).val()
		}
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,data);
	},
	footerPaddingRightChange : function(evt){
		var data = {
			property : "footerPaddingRight",
			value : $(evt.target).val()
		}
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,data);
	},
});
MailerTemplate.Views.PageDesign.PROPERTY_CHANGE= "propertyChange";