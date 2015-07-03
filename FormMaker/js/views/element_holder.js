FormDesigner.Views.ElementHolder = Backbone.View.extend({
    model : null,
    dragNDropHandler : null,
    propertiesPanel : null,
    currentHoverElement : null,
    elementCount : 0,
    droppedElements : [],

    initialize: function(){
        this.propertiesPanel = new FormDesigner.Views.PropertyPanel({el : "#properties"});
        this.listenTo(this.propertiesPanel,FormDesigner.Events.PropertyChange,this.onPropertyChange);
        this.listenTo(this.propertiesPanel,FormDesigner.Events.TypeChange,this.onTypeChange);

        this.model = new FormDesigner.Models.DesignerModel();
        $(".menuItem").on("click",this.onMenuItemClick.bind(this))

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

            }
        }
    },
    OnStart : function(event, ui){
		console.log("Drag Started");
	},
	OnStop : function(event, ui){
		console.log("Drop End");
        //this.onDrop(event.target,ui.item[0]);
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
			}
		});
		$( ".sortable" ).disableSelection();
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
        var element = {
            element : FormMaker.Elements.Text
        };
        if (cname != "new"){
            element = this.model.getElement(cname);
            element = jQuery.extend(true,{},element);
            var id = this.getNextId();
            element.id = id;
            element.cname = cname;
        }
        var obj = new FormMaker[element.element]({el : "#"+target.id,model : element});
        this.listenTo(obj, FormDesigner.Events.ElementClick,this.onElementClick.bind(this));
        this.listenTo(obj, FormDesigner.Events.ValueChange,this.onValueChange.bind(this));
        obj.loadData(element);
        obj.setParent("#"+target.id);
        obj.render();
        this.droppedElements[id] = obj;

        $(droppedObject).remove();
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
        var model = elementView.getModel();
        model.set("element", data.value);

        var obj =  new FormMaker[data.value]({el : elementView.getParentSelector(),model : model});
        this.listenTo(obj, FormDesigner.Events.ElementClick,this.onElementClick.bind(this));
        this.listenTo(obj, FormDesigner.Events.ValueChange,this.onValueChange.bind(this));
        obj.loadData(model);
        obj.renderBefore(elementView);

        this.removeElement(elementView)
        this.droppedElements[data.id] = obj;

    },
    setTypeField: function(data){
        this.$("#type #Type" + data.element).prop("checked",true);
    },
    removeElement: function(element){
        element.remove()
        delete this.droppedElements[element.model.get("id")];
        this.propertiesPanel.setElementProperties({});
    },
    getNextId : function(){
        return "Element" + (++this.elementCount);
    },
    onPropertyChange: function(data){
        var elementView = this.droppedElements[data.id];
        if (elementView)
            elementView.update(data);

    }
});
