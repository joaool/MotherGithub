FormDesigner.Views.ElementHolder = Backbone.View.extend({
    model : null,
    dragNDropHandler : null,
    propertiesPanel : null,
    currentHoverElement : null,
    elementCount : 0,
    droppedElements : [],
    entityLoaded : null,
    modelsCollection : null,
    labelIdCnt : 0,

    initialize: function(){
        this.propertiesPanel = new FormDesigner.Views.PropertyPanel({el : "#properties"});
        this.listenTo(this.propertiesPanel,FormMaker.Events.PropertyChange,this.onPropertyChange);
        this.listenTo(this.propertiesPanel,FormMaker.Events.TypeChange,this.onTypeChange);
        this.listenTo(this.propertiesPanel,FormMaker.Events.LabelTypeChange,this.onLabelTypeChange);

        //this.model = new FormDesigner.Models.DesignerModel();

        this.modelsCollection = new Elements();
        // this.$("#fieldstemp").html((Handlebars.compile($("#tempTemplate").html()))());
        this.bindDraggableObject();
    },
    events : {
        "click #fields .ui-draggable" : "onEntityFieldItemClicked",
        "click #addLabel" : "onAddLabelClick",
        "click .edit-field" : "onEditFieldIconClick",
        "click #fieldNameLabel" : "onFieldLabelClicked",
        "blur .editableLabel" : "focusOutLabel",
    },
    onFieldLabelClicked : function(evt){
        this.replaceWithInputField($(evt.currentTarget));
        evt.stopPropagation();
    },
    replaceWithInputField: function(element){

        var editableElement = $("<input type='text' data-fieldname='"+element.data("fieldname")+"' class='editableLabel' id='FieldNameEditableDiv' value='"+element.html()+"'/>");
        $(element).replaceWith(editableElement);
        editableElement.focus();
    },
    focusOutLabel: function(evt){
        var element = $(evt.currentTarget);
        var value = element.val();
        var fieldData = FL.dd.t.entities[this.entityLoaded.csingular].fields[element.data("fieldname")];
        fieldData.name = value;
        fieldData.set(fieldData);
        $(element).replaceWith("<div id='fieldNameLabel'>"+value+"</div>");
    },
    bindDraggableObject : function(){
        this.dragNDropHandler = new DragNDrop();
        oDragNDrop = DragNDrop.getInstance();
        oDragNDrop.setDroppableObject({droppableSelectors : [{
											droppable : ".ui-dropppable"
											}]
									  });
        oDragNDrop.setDraggableObject({draggableSelectors : [{
											   draggable : ".ui-draggable"
										  }],
										 helper : "clone",
										 helperCss : '',
										 revert : this.OnRevert,
										 OnStartCallBack : this.OnStart.bind(this),
										 OnStopCallBack : this.OnStop.bind(this)
							 		  });

        this.ApplySortingEvent();
    },
    onEntityFieldItemClicked: function(e){
        var target = e.currentTarget;
        if (!$(e.currentTarget).hasClass("ui-draggable-disabled")) {

        }
    },
    onDeleteClick: function(e){
        var element = this.droppedElements[$(e.currentTarget).data("id")]
        if (element){
            this.removeElement(element);
            $("[field_id='"+element.model.get('fieldId')+"']").draggable("enable");
            $("[field_id='"+element.model.get('fieldId')+"']").removeClass("field-hovered");
        }
        e.stopPropagation();
    },
    onEditFieldIconClick: function(evt){
        var fCN = $(evt.currentTarget).data("fieldname");
        var fields = FL.dd.t.entities[this.entityLoaded.csingular].fields[fCN];
        var element = {
            "element" : fields.type,
            "leftLabel" : fields.label,
            "name" : fields.name,
            "type" : fields.typeUI,
            "value" : fields.enumerable,
            "fieldName" : fCN,
            "entityName" : this.entityLoaded.csingular
        };
        this.trigger(FormMaker.Events.ElementClick,element);
    },
    OnStart : function(event, ui){
		console.log("Drag Started");
	},
	OnStop : function(event, ui){
		console.log("Drop End");
	},
	OnRevert : function(dropped){
		console.log(dropped);
		return dropped;
	},

    ApplySortingEvent : function(){
		var temp = this;
    $( ".sortable" ).sortable();
    $( ".sortable" ).sortable("destroy");
	$( ".sortable" ).sortable({
		connectWith : ".sortable",
	 	placeholder: "ui-state-highlight",
		tolerance: "pointer",
		stop : function(event, ui){
            temp.onDrop(event.target,ui.item[0]);
		},
		beforeStop : function(event, ui){
			temp.DroppedObjectOnMove = ui.helper;
		},
        update: (function(event, ui){
            var droppedObject = ui.item[0];
            var alignment = event.target.id == "designerCol1" ? "left" : "right";
            var cname = $(droppedObject).attr("id");
            if (cname){
                var element = this.modelsCollection.where({"id" : cname})[0];
                element.set("alignment", alignment);
            }
        }).bind(this)
	});
	//$( ".sortable" ).disableSelection();
	},
    ApplyHoverEvent : function(){
		var temp = this;
		$(".droppedObject").hover(function(obj){
								temp.OnHoverIn(obj.currentTarget)
							},function(obj){});
	},

	OnHoverIn : function(obj){
		/*var element = this.model.getElement($(obj).attr("cname"));
        this.currentHoverElement = obj;*/
	},
    onAddLabelClick: function(){
        if (!this.entityLoaded) {
            alert("Select a entity first");
            return;
        }
        var label = $("#addLabel");
        var element = {
            "element" : FormMaker.Elements.Label,
            "leftLabel" : "new label",
            "name" : "label",
            "type" : "TextLabel",
            "value" : null,
            "id" : "Label"+this.labelIdCnt++,
            "fieldName" : "lbl",
            "entityName" : this.entityLoaded.csingular,
            "alignment": "left"
        };
        this.addElement("designerCol1",element);
    },
    onDrop : function(target,droppedObject){
        var cname = $(droppedObject).attr("cname");
        if ($(droppedObject).hasClass("dropped") && cname != "new") return;
        var fCN = $(droppedObject).data("fieldname");
        var entity = FL.dd.t.entities[this.entityLoaded.csingular].fields[fCN];
        var element = {
            "element" : FormMaker.DBElements[entity["typeUI"]] || FormMaker.Elements.Text,
            "leftLabel" : entity["label"],
            "name" : entity["name"],
            "type" : FormMaker.DBType[entity["type"]],
            "value" : entity["enum"],
            "id" : this.getNextId(),
            "fieldName" : fCN,
            "fCN" : fCN,
            "fieldId" : $(droppedObject).attr("field_id"),
            "entityName" : this.entityLoaded.csingular,
            "alignment": "left"
        };
        if (element.element == "TextLabel") {
            element.id = "Label"+this.labelIdCnt++;
        }
        this.addElement(target.id,element);
        $(droppedObject).remove();
    },
    addElement: function(id,element){
        if (!this.entityLoaded) {
            alert("Select a entity first");
            return;
        }
        var obj = new FormMaker[element.element]({el : "#"+id,model : element});
        this.listenTo(obj, FormMaker.Events.ElementClick,this.onElementClick.bind(this));
        this.listenTo(obj, FormMaker.Events.MouseOver,this.onElementHoverIn.bind(this));
        this.listenTo(obj, FormMaker.Events.MouseOut,this.onElementHoverOut.bind(this));
        this.listenTo(obj, FormMaker.Events.ValueChange,this.onValueChange.bind(this));
        this.listenTo(obj, FormMaker.Events.DELETE_CLICK,this.onDeleteClick.bind(this));
        obj.loadData(element);
        obj.setParent("#"+id);
        obj.render();
        this.droppedElements[element.id] = obj;

        this.modelsCollection.set(obj.getModel(),{remove:false});
        
		this.propertiesPanel.setElementProperties(element);
        this.setTypeField(element);
        $("body").css("cursor","default");
        if (element.fCN != '')
            $("#fields td[data-fieldname="+element.fCN+"]").draggable('disable');
	},
    onElementHoverIn: function(data){
        if (data.fCN != "")
            $("#fields td[data-fieldname="+data.fCN+"]").addClass("field-hovered");
    },
    onElementHoverOut: function(data){
        if (data.fCN != "")
            $("#fields td[data-fieldname="+data.fCN+"]").removeClass("field-hovered");
    },
    onValueChange: function(data){
        this.propertiesPanel.setElementProperties(data);
    },
    onElementClick: function(data){
        if (data.element == "TextLabel")
            this.trigger(FormMaker.Events.ElementClick,data);
    },
    onTypeChange: function(data){
        this.changeType(data.id,data.value);
    },
    onLabelTypeChange: function (data) {
        if (data.value == 1)
            $("#"+data.id).css({"white-space":"normal"});
        else
            $("#"+data.id).css({
                "white-space":"nowrap",
                "width" : $("#"+data.id).parent().width()*2 + "px"
            });
    },
    setTypeField: function(data){
        this.$("#type #Type" + data.element).prop("checked",true);
    },
    removeElement: function(element){
        element.remove();
        delete this.droppedElements[element.model.get("id")];
        this.modelsCollection.remove(element.model);
        this.propertiesPanel.setElementProperties({});
    },
    getNextId : function(){
        return "Element" + (++this.elementCount);
    },
    onPropertyChange: function(data){
        var elementView = this.droppedElements[data.id];
        if (elementView)
            elementView.update(data);
        this.modelsCollection.set(elementView.getModel(),{remove:false});
    },
    save: function(){
        this.modelsCollection.saveToDB();
        var self = this;
        var leftElementsToSave = [];
        leftElements = $("#designerCol1 .dropped").map(function (prev,element) {
            var curr = self.modelsCollection.get(element.id);
            var json = curr.toJSON();
            var jsonToSave = {
                fCN : json.fieldName,
                leftLabel : json.leftLabel,
                alignment : json.alignment
            };
            if (json.element == FormMaker.Elements.Label) {
                jsonToSave = {
                    fCN : '',
                    text : json.leftLabel,
                    fontSize:json.fontSize || 12,
                    fontColor:json.fontColor || "black",
                    textAlignment : json.textAlignment,
                    alignment : json.alignment
                };
            }
            leftElementsToSave.push(jsonToSave);
        });
        var right = [];
        var form = {
            "eCN" : this.entityLoaded.csingular,
            "left" : leftElementsToSave,
            "right" : right
        }
        return form;
    },
    setEntity: function(entity){
        this.entityLoaded = entity;
    },
    loadJson: function(data){
        this.entityLoaded = FL.dd.t.entities[data.eCN];
        this.trigger(FormMaker.Events.FormLoaded,data.eCN);
        var leftElements = data.left || [];
        var rightElements = data.right || [];
        $.each(leftElements,(function(i,element){
            if (element.fCN == ""){
                var styleString = ";font-size:"+element.fontSize+";color:"+element.fontColor+";white-space:"+element.titleAlignment+";";
                elementJson = {
                    "element" : FormMaker.Elements.Label,
                    leftLabel : element.text,
                    fontSize : element.fontSize,
                    fontColor : element.fontColor,
                    textAlignment : element.textAlignment,
                    style : styleString,
                    "entityName" : this.entityLoaded.csingular,
                    fieldId : element.fCN
                };
            }
            else {
                var field = FL.dd.t.entities[data.eCN].fields[element.fCN];
                elementJson = {
                    "element": FormMaker.DBElements[field.typeUI] || FormMaker.Elements.Text,
                    "leftLabel": field.label,
                    "name": field.name,
                    "type": field.type,
                    "id": element.fCN,
                    "fieldName" : element.fCN,
                    "entityName" : this.entityLoaded.csingular,
                    fieldId : element.fCN
                }
            }
            item = _.extend({},elementJson,element);
            this.addElement("designerCol1",item);
        }).bind(this));
        $.each(rightElements,(function(i,element){
            this.addElement("designerCol2",element);
        }).bind(this));
    },
    updateLabel : function(elementData){
        var styleString = ";font-size:"+elementData.fontSize+";color:"+elementData.fontColor+";text-align:"+elementData.titleAlignment+";";
        var data = {
            leftLabel : elementData.titleText,
            fontSize : elementData.fontSize,
            fontColor : elementData.fontColor,
            textAlignment : elementData.titleAlignment,
            style : styleString
        };
        var elementType = FormMaker.CurrentElement.model.get("type");
        FormMaker.CurrentElement.model.set(data);
        FormMaker.CurrentElement.reRender();
    },
    updateElement: function (elementData) {
        var data = {
            leftLabel : elementData.fieldLabel,
            name : elementData.fieldName,
            type : elementData.userType,
            typeUI : FL.dd.userTypes[elementData.userType].typeUI,
            description : elementData.fieldDescription,
            placeholder : elementData.placeholder,
            icon : elementData.icon,
            mergeWith : elementData.mergeWith
        };
        FL.dd.t.entities[this.entityLoaded.csingular].
        fields[elementData.fCN].
        set({
            description: elementData.fieldDescription,
            label: elementData.fieldLabel,
            name: elementData.fieldName,
            typeUI: FL.dd.userTypes[elementData.userType].typeUI
        });
        var model = this.modelsCollection.where({"fieldName":elementData.fCN})[0];
        if (model) {
            var elementType = model.get("type");
            model.set(data);
            if(elementType != elementData.userType){
                this.changeType(model.id,elementData.userType);
            }
            else{
                this.droppedElements[model.id].reRender();
                $("#fields td[data-fieldname="+elementData.fCN+"]").draggable('disable');
            }
        }
    },
    changeType: function (id, type) {
        var elementView = this.droppedElements[id];
        if (!elementView) return;
        var model = elementView.getModel();
        model.set("element", type);
        var Class = FormMaker[type] || FormMaker[FormMaker.DBElements[type]];
        var obj =  new Class({el : elementView.getParentSelector(),model : model.attributes});
        obj.renderBefore(elementView);

        this.listenTo(obj, FormMaker.Events.ElementClick,this.onElementClick.bind(this));
        this.listenTo(obj, FormMaker.Events.ValueChange,this.onValueChange.bind(this));
        obj.loadData(model.toJSON());

        this.removeElement(elementView)
        this.droppedElements[id] = obj;
        this.modelsCollection.set(obj.getModel(),{remove:false});
        this.propertiesPanel.setElementProperties(model.toJSON());
        $("#fields td[data-fieldname="+model.get("fieldName")+"]").draggable('disable');
    }
});
