"use strict";

FormMaker.CurrentElement = null;
FormMaker.BaseElement = Backbone.View.extend({
  m_template: null,
  m_html: null,
  name: null,
  element: null,
  placeholder: null,
  value: null,
  icon: null,
  btnType: null,
  label: null,
  tooltip: null,
  parentSelector: null,

  initialize: function initialize(options) {
    this.model = new ElementModel(options.model);
  },
  getModel: function getModel() {
    return this.model;
  },
  events: {
    "focus input": "focusIn",
    "blur input": "focusOut",
    "change input": "valueChange",
    "keyup input": "valueChange",
    "click ": "onElementClick"
  },
  onRightClick: function onRightClick(e) {
    console.log(e);
    var offset = { left: e.pageX, top: e.pageY };
    $("#contextMenu").css(offset);
    $("#contextMenu").show();
    FormMaker.CurrentElement = this;
    e.stopPropagation();
    e.preventDefault();
  },
  loadData: function loadData(data) {
    this.model.set(data);
  },
  setParent: function setParent(selector) {
    this.parentSelector = selector;
  },
  getParentSelector: function getParentSelector() {
    return this.parentSelector;
  },
  renderBefore: function renderBefore(view) {
    var element = $.parseHTML(this.m_template(this.model.toJSON()).trim());
    $(element).insertBefore(view.$el);
    this.setElement(element);
    this.onRender();
    this.setElements();
    this.$el.on("contextmenu", this.onRightClick.bind(this));
  },
  render: function render() {
    var element = $.parseHTML(this.m_template(this.model.toJSON()).trim());
    this.$el.append(element);
    this.setElement(element);
    this.onRender();
    this.setElements();
    this.$el.on("contextmenu", this.onRightClick.bind(this));
  },
  setElements: function setElements() {
    this.name = this.$("#name");
    this.element = this.$("#element");
    this.placeholder = this.$("#placeholder");
    this.value = this.$("#value");
    this.icon = this.$("#icon");
    this.btnType = this.$("#btnType");
    this.leftLabel = this.$("#leftLabel");
    this.tooltip = this.$("#tooltip");
  },
  onRender: function onRender() {},
  update: function update(data) {
    this.model.set(data.property, data.value);
    var newElement = $.parseHTML(this.m_template(this.model.toJSON()).trim());
    this.$el.replaceWith(newElement);
    this.setElement(newElement);
    this.onRender();
    this.setElements();
    this.$el.on("contextmenu", this.onRightClick.bind(this));
  },
  onElementClick: function onElementClick(evt) {
    console.log("Element click");
    this.trigger(FormMaker.Events.ElementClick, this.model.toJSON());
  },
  focusIn: function focusIn(evt) {
    console.log("Focus In");
  },
  focusOut: function focusOut(evt) {
    console.log("focus out");
  },
  valueChange: function valueChange(evt) {
    console.log("value change");
    this.model.set("value", this.value.val());
    this.trigger(FormMaker.Events.ValueChange, this.model.toJSON());
  }
});
FormMaker.TextLabel = FormMaker.BaseElement.extend({

  initialize: function initialize(options) {
    FormMaker.TextLabel.__super__.initialize.apply(this, arguments);
    console.log("TextLabel init");
    this.m_template = Handlebars.compile($("#__textLabel").html());
  }
});

FormMaker.Text = FormMaker.BaseElement.extend({

  initialize: function initialize(options) {
    FormMaker.Text.__super__.initialize.apply(this, arguments);
    console.log("Text init");
    this.m_template = Handlebars.compile($("#__text").html());
  }
});

FormMaker.Button = FormMaker.BaseElement.extend({

  initialize: function initialize(options) {
    FormMaker.Button.__super__.initialize.apply(this, arguments);
    console.log("Button init");
    this.m_template = Handlebars.compile($("#__button").html());
  }
});

FormMaker.Checkbox = FormMaker.BaseElement.extend({

  initialize: function initialize(options) {
    FormMaker.Checkbox.__super__.initialize.apply(this, arguments);
    console.log("Checkbox init");
    this.m_template = Handlebars.compile($("#__checkbox").html());
  }
});

FormMaker.Radio = FormMaker.BaseElement.extend({

  initialize: function initialize(options) {
    FormMaker.Radio.__super__.initialize.apply(this, arguments);
    console.log("Radio init");
    this.m_template = Handlebars.compile($("#__radiobox").html());
  }
});

FormMaker.Combo = FormMaker.BaseElement.extend({

  initialize: function initialize(options) {
    FormMaker.Combo.__super__.initialize.apply(this, arguments);
    console.log("Combo init");
    this.m_template = Handlebars.compile($("#__combo").html());
  },
  update: function update(data) {
    var comboArr = data.value.split(",").map(function (ele) {
      return { "value": ele, "label": ele };
    });
    this.model.set("comboArr", comboArr);
    FormMaker.Combo.__super__.update.apply(this, arguments);
  },
  render: function render() {
    var comboArr = this.model.get("value").split(",").map(function (ele) {
      return { "value": ele, "label": ele };
    });
    this.model.set("comboArr", comboArr);
    FormMaker.Combo.__super__.render.apply(this, arguments);
  },
  renderBefore: function renderBefore() {
    var comboArr = this.model.get("value").split(",").map(function (ele) {
      return { "value": ele, "label": ele };
    });
    this.model.set("comboArr", comboArr);
    FormMaker.Combo.__super__.renderBefore.apply(this, arguments);
  }
});

FormMaker.TextArea = FormMaker.BaseElement.extend({

  initialize: function initialize(options) {
    FormMaker.TextArea.__super__.initialize.apply(this, arguments);
    console.log("TextArea init");
    this.m_template = Handlebars.compile($("#__textarea").html());
  }
});

FormMaker.Image = FormMaker.BaseElement.extend({

  m_ImagePreview: null,
  m_ImageUploadBtn: null,
  initialize: function initialize(options) {
    FormMaker.Image.__super__.initialize.apply(this, arguments);
    console.log("Image init");
    this.m_template = Handlebars.compile($("#__image").html());
  },
  onRender: function onRender() {
    this.m_ImagePreview = this.$("#imagePreview");
    this.m_ImageUploadBtn = this.$("#imageUploadBtn");
  },
  events: {
    "change #imageUploadBtn": "ImageFileSelected",
    "load #imagePreview": "OnImageLoaded"
  },
  OnImageLoaded: function OnImageLoaded(evt, obj) {
    obj.m_ImagePreview[0].src = evt.target.result;
  },
  ImageFileSelected: function ImageFileSelected(evt) {
    if (evt.target.files && evt.target.files[0]) {
      var reader = new FileReader();
      var temp = this;
      reader.onload = function (evt) {
        temp.OnImageLoaded(evt, temp);
      };
      reader.readAsDataURL(evt.target.files[0]);
    }
  }
});

FormMaker.Date = FormMaker.BaseElement.extend({
  datePicker: null,

  initialize: function initialize(options) {
    FormMaker.Date.__super__.initialize.apply(this, arguments);
    console.log("Date init");
    this.m_template = Handlebars.compile($("#__date").html());
  },
  events: {
    "change .datePicker": "onDatePickerValueChange"
  },
  onDatePickerValueChange: function onDatePickerValueChange() {},
  onRender: function onRender() {
    $(".datePicker").datetimepicker({
      timeFormat: "hh:mm tt",
      controlType: "select",
      oneLine: true
    });
  }

});

//# sourceMappingURL=LabelElement-compiled.js.map