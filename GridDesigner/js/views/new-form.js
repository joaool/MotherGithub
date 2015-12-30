define(function(require) {
    'use strict';
    var NewFormTemplate = require("text!templates/form-container.html");
    require("formMaker/js/loadJsFiles");
    var templates = require("text!formMaker/Template.html");
    var DesignerTemplates = require("text!formMaker/designer-templates.html");
    var formListItemTemplate = require("text!templates/form-list-item.html");
    var DBUtil = require("db-util");
    var Forms = require("collections/forms");
    var View = Backbone.View.extend({
        initialize: function(options) {
            // this.model = new FormModel({"id":options.id});
            this.mainView = new FormDesigner.Views.MainView({
                el: "#newFormContainer"
            });
            this.forms = new Forms();
        },
        events: {
            "click .form-list-item": "onFormListItemClick"
        },
        render: function() {
            this.$el.html(Handlebars.compile(NewFormTemplate)());
            $("#templates").html(templates);
            $("#designerTemplates").html(DesignerTemplates);
            this.mainView.render();
        },
        loadJson: function() {
            this.mainView.loadJson("../FormMaker/Sample.json");
        },
        loadForms: function(jsonFile) {
            $.getJSON(jsonFile, (function(data) {
                this.addForms(data.forms);
            }).bind(this));
        },
        addForms: function(forms) {
            this.forms.reset(forms);
            var self = this;
            self.$("#formsList").html();
            $.each(forms, function(i, formData) {
                self.$("#formsList").append(Handlebars.compile(formListItemTemplate)(formData));
            })
        },
        onFormListItemClick: function(event) {
            var formId = $(event.currentTarget).data("formid");
            var form = this.forms.where({
                "formId": formId
            });
            this.mainView.addJsonData(form[0].get("fields"));
        },
        setEntity: function(entity) {
        	this.hideEntityList();
            this.loadForms("../FormMaker/forms.json");
            this.mainView.setEntity(entity);
        },
        hideEntityList: function() {
            this.mainView.hideEntityList();
        },
        onOkBtnClick: function() {
            this.mainView.saveBtnClick(function(){
            	this.hide();
            });
        },
        onCancelBtnClick: function() {
            this.hide();
        },
        hide: function() {
            $("#newFormContainer").addClass("hide");
        }
    });
    return View;
});