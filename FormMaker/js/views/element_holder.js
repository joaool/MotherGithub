FormDesigner.Views.ElementHolder = Backbone.View.extend({
    model : null,
    dragNDropHandler : null,
    propertiesPanel : null,
    currentHoverElement : null,
    elementCount : 0,
    droppedElements : [],
    entityLoaded : null,
    modelsCollection : null,
    
    initialize: function(){
        this.propertiesPanel = new FormDesigner.Views.PropertyPanel({el : "#properties"});
        this.listenTo(this.propertiesPanel,FormMaker.Events.PropertyChange,this.onPropertyChange);
        this.listenTo(this.propertiesPanel,FormMaker.Events.TypeChange,this.onTypeChange);

        this.model = new FormDesigner.Models.DesignerModel();
        $(".menuItem").on("click",this.onMenuItemClick.bind(this))

        this.modelsCollection = new Elements();
        // this.$("#fieldstemp").html((Handlebars.compile($("#tempTemplate").html()))());
        this.bindDraggableObject();
    },
    bindDraggableObject : function(){
        this.dragNDropHandler = new DragNDrop();
        oDragNDrop = DragNDrop.getInstance();
        oDragNDrop.setDroppableObject({droppableSelectors : [{
											droppable : ".ui-dropppable"
											}],
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
    onMenuItemClick: function(e){
        if (e.currentTarget.id == "delete"){
            if (FormMaker.CurrentElement){
                this.removeElement(FormMaker.CurrentElement);
                $("[field_id='"+FormMaker.CurrentElement.model.get('fieldId')+"']").draggable("enable");
            }
        }
    },
    OnStart : function(event, ui){
		console.log("Drag Started");
	},
	OnStop : function(event, ui){
		console.log("Drop End");
        //this.onDrop(event.target,ui.item[0]);
        
        $(ui.helper.context).draggable('disable');
        
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
            revert: true,
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
		var element = this.model.getElement($(obj).attr("cname"));
        this.currentHoverElement = obj;
		//this.m_PropertyToolbar.setElement(obj);
	},
    onDrop : function(target,droppedObject){
        if ($(droppedObject).hasClass("dropped")) return;
        
        var cname = $(droppedObject).attr("cname");
        var elementType =  FormMaker.DBElements[$(droppedObject).data("type")];
        var inputType = FormMaker.DBType[$(droppedObject).data("input-type")];
        var leftLabel = $(droppedObject).data("label");
        var name = $(droppedObject).data("name");
        var dropDownEnum = $(droppedObject).data("enum");
        var description = $(droppedObject).data("description");
        var fieldName = $(droppedObject).data("fieldname");
        var id = this.getNextId();
        var alignment = target.id == "designerCol1" ? "left" : "right";
        var fieldId = $(droppedObject).attr("field_id");
        var element = {
            "element" : elementType || FormMaker.Elements.Text,
            "leftLabel" : leftLabel,
            "name" : name,
            "type" : inputType,
            "value" : dropDownEnum,
            "id" : id,
            "fieldName" : fieldName,
            "fieldId" : fieldId
        };
        if (cname){
            var fieldName = FL.dd.t.entities[this.entityLoaded.csingular].getFieldCName(name);
            element = this.model.getElement(cname);
            element = jQuery.extend(true,{},element);
            var id = this.getNextId();
            element.id = id;
            element.cname = cname;
            element.fieldName = fieldName;
        }
        if(this.entityLoaded)
            element.entityName = this.entityLoaded.csingular;
        element.alignment = alignment;
        
        this.addElement(target.id,element);
        $(droppedObject).remove();
    },
    addElement: function(id,element){
        var obj = new FormMaker[element.element]({el : "#"+id,model : element});
        this.listenTo(obj, FormMaker.Events.ElementClick,this.onElementClick.bind(this));
        this.listenTo(obj, FormMaker.Events.ValueChange,this.onValueChange.bind(this));
        obj.loadData(element);
        obj.setParent("#"+id);
        obj.render();
        this.droppedElements[element.id] = obj;
        this.modelsCollection.set(obj.getModel(),{remove:false});
        
		this.propertiesPanel.setElementProperties(element);
        this.setTypeField(element);
        $("body").css("cursor","default");
	},
    onValueChange: function(data){
        this.propertiesPanel.setElementProperties(data);
    },
    onElementClick: function(data){
        this.propertiesPanel.setElementProperties(data);
        this.setTypeField(data);
    },
    onTypeChange: function(data){
        var elementView = this.droppedElements[data.id];
        if (!elementView) return;
        var model = elementView.getModel();
        model.set("element", data.value);

        var obj =  new FormMaker[data.value]({el : elementView.getParentSelector(),model : model});
        this.listenTo(obj, FormMaker.Events.ElementClick,this.onElementClick.bind(this));
        this.listenTo(obj, FormMaker.Events.ValueChange,this.onValueChange.bind(this));
        obj.loadData(model.toJSON());
        obj.renderBefore(elementView);

        this.removeElement(elementView)
        this.droppedElements[data.id] = obj;
        this.modelsCollection.set(obj.getModel(),{remove:false});
        this.propertiesPanel.setElementProperties(model.toJSON());
    },
    setTypeField: function(data){
        this.$("#type #Type" + data.element).prop("checked",true);
    },
    removeElement: function(element){
        element.remove()
        
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
        var left = this.modelsCollection.where({"alignment" : "left"})
                    .reduce(function(prev,curr){
                        var json = curr.toJSON();
                        var jsonToSave = {
                            fCN : json.fieldName,
                            leftLabel : json.leftLabel,
                            alignment : json.alignment
                        };
                        prev.push(jsonToSave);
                        return prev;
                    },[]);
        var right = this.modelsCollection.where({"alignment" : "right"})
                    .reduce(function(prev,curr){
                        var json = curr.toJSON();
                        var jsonToSave = {
                            fCN : json.fieldName,
                            leftLabel : json.leftLabel,
                            alignment : json.alignment
                        };
                        prev.push(jsonToSave);
                        return prev;
                    },[]);
        var form = {
            "eCN" : this.entityLoaded.csingular,
            "left" : left, 
            "right" : right
        }
        return form;
    },
    setEntity: function(entity){
        this.entityLoaded = entity;
    },
    loadJson: function(data){
        var leftElements = data.left;
        var rightElements = data.right;
        $.each(leftElements,(function(i,element){
            this.addElement("designerCol1",element);
        }).bind(this));
        $.each(rightElements,(function(i,element){
            this.addElement("designerCol2",element);
        }).bind(this))
    }
});
