"use strict";

MailerTemplate.Views.PageDesign = Backbone.View.extend({

	pageWidth: null,
	headerBgColor: null,
	bodyBgColor: null,
	footerBgColor: null,
	headerPaddingLeft: null,
	headerPaddingRight: null,
	bodyPaddingLeft: null,
	bodyPaddingRight: null,
	footerPaddingLeft: null,
	footerPaddingRight: null,
	initialize: function initialize() {
		this.pageWidth = this.$("#newsletterWidth");
		this.headerBgColor = this.$("#headerBgColor");
		this.bodyBgColor = this.$("#bodyBgColor");
		this.footerBgColor = this.$("#footerBgColor");
		this.headerPaddingLeft = this.$("#headerPaddingLeft");
		this.headerPaddingRight = this.$("#headerPaddingRight");
		// this.bodyPaddingLeft = this.$("#bodyPaddingLeft");
		// this.bodyPaddingRight = this.$("#bodyPaddingRight");
		// this.footerPaddingLeft = this.$("#footerPaddingLeft");
		// this.footerPaddingRight = this.$("#footerPaddingRight");	
	},
	events: {
		"change #newsletterWidth": "newsletterWidthChange",
		"keyup #newsletterWidth": "newsletterWidthChange",
		"change.bfhcolorpicker #headerBgColor": "headerBgColorChange",
		"change.bfhcolorpicker #bodyBgColor": "bodyBgColorChange",
		"change.bfhcolorpicker #footerBgColor": "footerBgColorChange",
		"change #headerPaddingLeft": "headerPaddingLeftChange",
		"change #headerPaddingRight": "headerPaddingRightChange",
		// "change #bodyPaddingLeft" : "bodyPaddingLeftChange",
		// "change #bodyPaddingRight" : "bodyPaddingRightChange",
		// "change #footerPaddingLeft" : "footerPaddingLeftChange",
		// "change #footerPaddingRight" : "footerPaddingRightChange",
		"keyup #headerPaddingLeft": "headerPaddingLeftChange",
		"keyup #headerPaddingRight": "headerPaddingRightChange"
		// "keyup #bodyPaddingLeft" : "bodyPaddingLeftChange",
		// "keyup #bodyPaddingRight" : "bodyPaddingRightChange",
		// "keyup #footerPaddingLeft" : "footerPaddingLeftChange",
		// "keyup #footerPaddingRight" : "footerPaddingRightChange"
	},
	setValues: function setValues(data) {
		this.pageWidth.val(data.pageWidth);
		this.headerBgColor.val(data.headerBgColor);
		this.bodyBgColor.val(data.bodyBgColor);
		this.footerBgColor.val(data.footerBgColor);
		this.headerPaddingLeft.val(data.headerPaddingLeft);
		this.headerPaddingRight.val(data.headerPaddingRight);
		// this.bodyPaddingLeft.val(data.bodyPaddingLeft);
		// this.bodyPaddingRight.val(data.bodyPaddingRight);
		// this.footerPaddingLeft.val(data.footerPaddingLeft);
		// this.footerPaddingRight.val(data.footerPaddingRight);
	},
	newsletterWidthChange: function newsletterWidthChange(evt) {
		if (evt.which != 8 && evt.which != 0 && (evt.which < 48 || evt.which > 57)) {
			return false;
		}
		var data = {
			property: "width",
			value: $(evt.target).val()
		};
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE, data);
	},
	headerBgColorChange: function headerBgColorChange(evt) {
		var data = {
			property: "headerBgColor",
			value: $(evt.target).val()
		};
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE, data);
	},
	bodyBgColorChange: function bodyBgColorChange(evt) {
		var data = {
			property: "bodyBgColor",
			value: $(evt.target).val()
		};
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE, data);
	},
	footerBgColorChange: function footerBgColorChange(evt) {
		var data = {
			property: "footerBgColor",
			value: $(evt.target).val()
		};
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE, data);
	},
	headerPaddingLeftChange: function headerPaddingLeftChange(evt) {
		var data = {
			property: "headerPaddingLeft",
			value: $(evt.target).val()
		};
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE, data);
		this.bodyPaddingLeftChange(evt);
		this.footerPaddingLeftChange(evt);
	},
	headerPaddingRightChange: function headerPaddingRightChange(evt) {
		var data = {
			property: "headerPaddingRight",
			value: $(evt.target).val()
		};
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE, data);
		this.bodyPaddingRightChange(evt);
		this.footerPaddingRightChange(evt);
	},
	bodyPaddingLeftChange: function bodyPaddingLeftChange(evt) {
		var data = {
			property: "bodyPaddingLeft",
			value: $(evt.target).val()
		};
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE, data);
	},
	bodyPaddingRightChange: function bodyPaddingRightChange(evt) {
		var data = {
			property: "bodyPaddingRight",
			value: $(evt.target).val()
		};
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE, data);
	},
	footerPaddingLeftChange: function footerPaddingLeftChange(evt) {
		var data = {
			property: "footerPaddingLeft",
			value: $(evt.target).val()
		};
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE, data);
	},
	footerPaddingRightChange: function footerPaddingRightChange(evt) {
		var data = {
			property: "footerPaddingRight",
			value: $(evt.target).val()
		};
		this.trigger(MailerTemplate.Views.PageDesign.PROPERTY_CHANGE, data);
	}
});
MailerTemplate.Views.PageDesign.PROPERTY_CHANGE = "propertyChange";

//# sourceMappingURL=PageDesign-compiled.js.map