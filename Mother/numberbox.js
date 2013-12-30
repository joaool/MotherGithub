define([
    "dojo/ready",
    "dojo/_base/declare",
    "dijit/form/Form",
    "dijit/form/NumberTextBox",
    "/pdojo/MotherGitHub/Mother/areaWithText.js",
    "dojo/domReady!"
], function(ready,declare,Form,NumberTextBox,area_text){
    return declare(area_text,{
        obj:null,
        type:"numberbox",
        constructor: function (widgetProperties) {
            // The "constructor" method is special: the parent class (area)constructor is called automatically before this one.
            
            //REVIEW: Imported from MotherLib10 for speed
            var allPossibleProperties={left:0, top:0, width:0, height:0, value:"", name:"", required:false, invalidMessage:"Error...please correct",
                missingMessage:"Must have a value !", regExp:"[^\t]*", preCode:"", posCode:"", changeCode:"", pattern:"#######.###", disable:false,
                disabled:false, title:"@|", headers:"", placeHolder:"", propercase:false, readOnly:false, template:null, zIndex:0};
            declare.safeMixin(allPossibleProperties,this.left, this.top, this.width, this.height);//priority to inherited defaults  
            if (widgetProperties)
                declare.safeMixin(allPossibleProperties,widgetProperties);   
            console.log("INSIDE NUMBERBOX id="+this.id+" left="+this.left+" top="+this.top+" width="+this.width+" height="+this.height+" zIndex="+this.zIndex+" domId="+this.domId);
            // alert("NUMBERBOX id="+this.id);
            
            //HACK: To have something to support the widget
            var form = new Form({
                    //empty
            }, dojo.doc.createElement('div'));
            document.body.appendChild(form.domNode);
            
            allPossibleProperties.id=this.id;//the area class returns the id for this widget id<this.widgets.lastId>
             var JSON_forNumberTextBox=this.JSON_Default_NumberBox(allPossibleProperties);
            this.obj = new NumberTextBox(JSON_forNumberTextBox.props, this.id);
            form.domNode.appendChild(this.obj.domNode) //this places the widget inside the form 
            this.setFontSize(this.fontSize);
            this.setBorder();//now dom is formed
        },

        //REVIEW: Imported from MotherLib10 for speed
        //-------------------------------------------------------------------------------------------
        JSON_Default_NumberBox: function(xProps){//Order within NumberBoxes,xProps
        //-------------------------------------------------------------------------------------------
        // Param: Order within Form, Order within Number Boxes, xProps=json string with all props
        // Builds a JSON object with the format {type:"numberBox",props:JSON_props} for the default label
        //-------------------------------------------------------------------------------------------
        //  var xProps={left:xLeft,top:xTop,width:xWidth,value:xValue,id:xId,name:xName,pattern:xPattern,invalidMessage:xInvalidMessage};
            var xWidth=(xProps["width"]==0) ? 100:xProps["width"];
            var xHeight=(xProps["height"]==0) ? 24:xProps["height"];

            var styleObj={
                "position": "absolute",
                "left"    :xProps["left"]+"px",
                "top"     :xProps["top"]+"px",
                "width"   :xWidth+"px",
                "height"  :xHeight+"px",
                "zIndex"  :xProps["zIndex"]
            }
            var xTitle="NumberBox1"; 
            var xValue=(xProps["value"]=="@|") ? "123":xProps["value"];
            //var xPattern=(xProps["value"]=="@|") ? "0.######":xProps["pattern"];
            //Patterns: (http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
            //      The "." shows where the decimal point should go. It will be  replaced by the characters appropriate for the locale.
            //      The "," shows where the thousands separator should go. It will be  replaced by the characters appropriate for the locale.
            //      A "0" indicates zero-padding
            //      A "#" indicates no padding
            //      A "¤" shows where the currency sign will go. (\u00A4)
            //   There should, however, be at least one zero someplace in the pattern.
            // ex of Patterns for 1234.567: #,##0.## ->1 234,57  #,##0.###->1 234,567 ###0.#####->1234,567
            //    00000.0000 -> 01234,5670
            //ex constraints="{pattern: '+0.000;-0.000'}" //field shows three digits after the decimal point, and has a +/- sign. 
            // constraints:{min:-20000,max:20000,places:0} // Integer between -20000 to +20000:
            //constraints:{min,xMin,max:xMax,places:xPlaces,pattern:xPattern}
            // type constrain ex %
            //To specify a field that must be an integer:{fractional:false}
            //To specify a field where 0 to 3 decimal places are allowed on input:{places:'0,3'
            var constrainObj={
                "min": -2000,
                "max"    :+2000,
                "fractional":false,//the field must be an integer
                "places"   :'0,3',// 0 to 3 places are allowed 
                "pattern"  :'#,####' //1 234,567 
            }

            var xPattern=(xProps["value"]=="@|") ? "0.###":xProps["pattern"];
            var xName=(xProps["name"].length==0) ? xProps["id"]:xProps["name"];

            var props = {
                id      : xProps["id"],
                name    : xName,
                name    : "programmatic",
                cname   : null,
                title   : xTitle,
                tabindex: 1,
                //value   : Number(xValue),
                value   : xValue,
                preCode : xProps["preCode"],
                posCode : xProps["posCode"],
                disable :xProps["disable"], //if true preCode, posCode events will be disabled - defaul=false =>events are enabled
                invalidMessage: xProps["invalidMessage"],
                // pattern:xPattern,//this is  memory for Mother not for dojo - GIVES AN ERROR IN 1.9.2
                constraints: {pattern: xPattern},                   //ex {pattern: "0.######"}, "{pattern: '+0.000;-0.000'}"
                //constraints:{min:-20000,max:20000,places:0},
                style   :styleObj,
                size    : "10",
                readOnly:xProps["readOnly"],                
                template:xProps["template"],
                mType:"numberBox"
 
            };  
            return {"type":"numberBox","props":props}   
        }
     });
}); //end of  module  