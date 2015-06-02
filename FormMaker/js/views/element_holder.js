FormDesigner.Views.ElementHolder = Backbone.View.extend({
    model : null,
    dragNDropHandler : null,
    propertiesPanel : null,
    currentHoverElement : null,
    elementCount : 0,
    droppedElements : [],
    
    initialize: function(){
        this.dragNDropHandler = new DragNDrop();
		this.ApplySortingEvent();
        
        this.propertiesPanel = new FormDesigner.Views.PropertyPanel({el : "#properties"});
        this.listenTo(this.propertiesPanel,FormDesigner.Events.PropertyChange,this.onPropertyChange);
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
										 OnStartCallBack : this.OnStart,
										 OnStopCallBack : this.OnStop
									  });
        
        this.model = new FormDesigner.Models.DesignerModel();
        $(".menuItem").on("click",this.onMenuItemClick.bind(this))
    },
    onMenuItemClick: function(e){
        if (e.currentTarget.id == "delete"){
            if (FormMaker.CurrentElement){
                FormMaker.CurrentElement.remove()
                delete this.droppedElements[FormMaker.CurrentElement.model.get("id")];
                this.propertiesPanel.setElementProperties({});
            }
        }
    },
    OnStart : function(){
		console.log("Drag Started");	
	},
	OnStop : function(){
		console.log("Drop End");
	},
	OnRevert : function(dropped){
		console.log(dropped);
		return dropped;
	},
    ApplySortingEvent : function(){
		var temp = this;
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
        obj.render();
        this.droppedElements[id] = obj;
        
        $(droppedObject).remove();
		this.propertiesPanel.setElementProperties(element);
        $("body").css("cursor","default");
	},
    onValueChange: function(data){
        this.propertiesPanel.setElementProperties(data);  
    },
    onElementClick: function(data){
        this.propertiesPanel.setElementProperties(data);
    },
    getNextId : function(){
        return "Element" + (++this.elementCount);
    },
    onPropertyChange: function(data){
        var elementView = this.droppedElements[data.id];
        elementView.update(data);
        
    }
});