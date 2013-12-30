define([
    "dojo/ready",
    "dojo/_base/declare",
    "dijit/form/Form",
    "dijit/form/ValidationTextBox",
    //"Mother/area_text.js",
    "/pdojo/MotherGitHub/Mother/areaWithText.js",
    "dojo/domReady!"
], function(ready,declare,Form,ValidationTextBox,areaWithText){
    return declare(areaWithText,{
        obj:null,//the dojo object 
        constructor: function (widgetProperties) {
            // The "constructor" method is special: the parent class areaWithText and area constructor are called automatically before this one.
            var allPossibleProperties={value:"", name:"", required:false, invalidMessage:"Error...please correct",
                missingMessage:"Must have a value !", regExp:"[^\t]*", preCode:"", posCode:"", changeCode:"", pattern:"0.###", disable:false,
                disabled:false, title:"@|", headers:"", placeHolder:"", propercase:false, readOnly:false, template:null, zIndex:0};
            declare.safeMixin(allPossibleProperties,this.left, this.top, this.width, this.height);//priority to inherited defaults  
            if (widgetProperties)
                declare.safeMixin(allPossibleProperties,widgetProperties);   
            
            console.log("INSIDE TEXTBOX id="+this.id+" left="+this.left+" top="+this.top+" width="+this.width+" height="+this.height);
            var form = new Form({
                    //empty
            }, dojo.doc.createElement('div'));
            document.body.appendChild(form.domNode);
            allPossibleProperties.id=this.id;//the area class returns the id for this widget id<this.widgets.lastId>
            var JSON_forValidationTextBox=this.JSON_Default_TextBox(allPossibleProperties);
            this.obj = new ValidationTextBox(JSON_forValidationTextBox.props,this.id);
            form.domNode.appendChild(this.obj.domNode) //this places the widget inside the form 
            this.setFontSize(this.fontSize);
            this.setBorder();
        },
        //-------------------------------------------------------------------------------------------
        JSON_Default_TextBox: function(xProps){//Order within TextBoxes,xProps
        //-------------------------------------------------------------------------------------------
        // Param: Order within Form, Order within TextBoxes, xProps=json string with all props
        // Builds a JSON object with the format {type:"textBox",props:JSON_props} for the default TextBox
        //-------------------------------------------------------------------------------------------
            var xWidth=(xProps["width"]==0) ? 100:xProps["width"];
            var xHeight=(xProps["height"]==0) ? 24:xProps["height"];
            var styleObj={
                "position": "absolute",
                 "left"    :xProps["left"]+"px",
                 "top"     :xProps["top"]+"px",
                 "width"   :xWidth+"px",
                 "height"  :xHeight+"px",
                "zIndex"  :xProps["zIndex"] 
            };
            var xTextBoxOrder=1;
            var xTitle=(xProps["title"]=="@|") ? "TextBox"+xTextBoxOrder:xProps["title"];
            var xValue=(xProps["value"]=="@|") ? xTitle:xProps["value"];//if  xValue="@|" the tooltip will be the value 

            //var xTitle="TextBox"+xTextBoxOrder;
            //xValue=(xProps["value"]=="@|") ? xTitle:xProps["value"];
            var xName=(xProps["name"].length==0) ? xProps["id"]:xProps["name"];
            var xPlaceHolder=(xProps["placeHolder"].length==0) ? "Type data":xProps["placeHolder"];
            var props = {
                //tb_order: xTextBoxOrder,
                id      : xProps["id"],
                name    : xName,
                cname   : null,
                title   : xTitle,
                tabindex: 1,
                value   : xValue,
                preCode : xProps["preCode"],
                posCode : xProps["posCode"],
                disable :xProps["disable"], //if true preCode, posCode events will be disabled - defaul=false =>events are enabled
                style   :styleObj,
                promptMessage: "",     //"No spaces please !!!",
                //regExp  : "^[A-Za-z0-9 _]*$",//to accept letters, numbers, spaces and underscores.//"[\\w]+" sem espaços http://www.stratulat.com/Regular_Expressions_JavaScript.html
                regExp  : xProps["regExp"],//"^[A-Za-z0-9 _]*$",//to accept letters, numbers, spaces and underscores.//"[\\w]+" sem espaços http://www.stratulat.com/Regular_Expressions_JavaScript.html
                invalidMessage: xProps["invalidMessage"],//"",    //"You have spaces in text !!!",
                missingMessage: xProps["missingMessage"],//"The value is required",  //message para qdo é required e não está preenchido
                size    : "10",
                trim    : true,
                //placeHolder   : xPlaceHolder,  //o que aparece inicialmente dentro da combo                 
                required: xProps["required"], //false
                readOnly:xProps["readOnly"],
                template:xProps["template"],
                mType:"textBox"
            };  
            return {"type":"textBox","props":props} 
        }
     });
}); //end of  module  