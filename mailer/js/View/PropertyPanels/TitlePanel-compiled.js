"use strict";

MailerTemplate.Views.TitlePanel = Backbone.View.extend({
	m_titleTemplate: null,
	m_propertyPanel: null,
	m_Model: null,
	bSupressChangeEvent: true,
	m_styleTab: null,
	m_titleBody: null,

	initialize: function initialize() {
		this.m_propertyPanel = $("#propertyPanel");
		this.m_titleBody = $("#titleBody");
		this.m_titleBody.show();

		this.m_styleTab = new MailerTemplate.Views.StyleTab({ el: "#styletab" });
		CKEDITOR.timestamp = Math.round(Math.random() * 10000);
	},

	render: function render() {
		this.initCkEditor();
	},
	show: function show() {
		//this.render();
		this.m_titleBody.show();
		this.m_styleTab.setTemplateType(MailerTemplate.TemplateItems.TITLE);
		this.listenTo(this.m_styleTab, MailerTemplate.Views.StyleTab.STYLE_PROPERTY_CHANGED, this.OnStylePropertyChanged);
		this.bSupressChangeEvent = false;
	},
	clear: function clear() {
		this.bSupressChangeEvent = true;
	},
	hide: function hide() {
		this.m_titleBody.hide();
		this.stopListening(this.m_styleTab);
	},
	initCkEditor: function initCkEditor() {
		var temp = this;
		CKEDITOR.replace("titleText");
		CKEDITOR.instances["titleText"].on("change", function () {
			temp.onCKEditorChangeEvent();
		});
	},
	onCKEditorChangeEvent: function onCKEditorChangeEvent() {
		if (!this.bSupressChangeEvent) {
			var data = CKEDITOR.instances["titleText"].getData();
			if (this.m_Model != null) this.m_Model.setTitle(data);
		}
	},
	renderModel: function renderModel(model) {
		this.m_Model = model;
		CKEDITOR.instances["titleText"].setData(model.getTitle());
		this.m_styleTab.setStyleProperty(model.getStyleProperty());
	},
	OnStylePropertyChanged: function OnStylePropertyChanged(data) {
		this.m_Model.setStyleProperty(data);
	}
});

//# sourceMappingURL=TitlePanel-compiled.js.map