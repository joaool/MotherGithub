/**
* test of a basic widget
* http://stackoverflow.com/questions/7606782/how-to-extend-dijit-form-button
* http://dojotoolkit.org/reference-guide/1.7/quickstart/writingWidgets/example.html
* http://dojotoolkit.org/reference-guide/1.7/dojo/fadeIn.html
* http://dojotoolkit.org/reference-guide/1.9/dojo/_base/fx.html
* http://marcellbranco.wordpress.com/2012/10/24/dojo-lazy-loading-image-component/ - maing a widget...
* http://blog.niftysnippets.org/2008/02/closures-are-not-complicated.html //about closures and scope chain
* http://stackoverflow.com/questions/111102/how-do-javascript-closures-work //JavaScript Closures for Dummies
* https://vaadin.com/comparison
**/
define([
        "dojo/_base/declare",
        "dojo/on",
        "dojo/dom-style",   
        "dojo/dom-attr",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/parser",
        "dojo/ready",  
        "dojo/_base/lang",
        "dojo/_base/fx",
        "dojo/_base/kernel",
        "dijit/_Container",
        "dijit/Tooltip",     
        "dijit/_WidgetBase", //old dojo.require("dijit._Widget");
        "dijit/_TemplatedMixin" //old  dojo.require("dijit._Templated");
        ],
function(Declare,On,DomStyle,DomAttr,DomClass,DomConstruct,Parser,Ready,Lang,Fx,Kernel,_Container,Tooltip,_WidgetBase,_TemplatedMixin){
return Declare("picture",[_WidgetBase,_TemplatedMixin,_Container],{
        //the Dojo attach point is a clean mechanism for referring to the HTML elements of the component without needing 
        //  to use the IDs of the HTML elements
        // without _Container the invisibiity of the form would not propagate to this picture widget
        templateString:"<div dojoAttachPoint='containerNode' >"+ 
                            //"<span dojoAttachPoint='nameNode' class='highlightedName'  > ${sayHelloTo} ?</span>"+
                            "<div id=${idImageNode} dojoAttachPoint='imageNode' style='position: absolute; height: 50px; width:50px;'></div>"+
                            //"<img dojoAttachPoint='imageNode' style='position: absolute; height: 50px; width:50px;'>"+
                            "<div id=${idPHNode} dojoAttachPoint='phNode' style='position: absolute;  height: 100px; width:100px;'></div>"+
                            //"<img dojoAttachPoint='phNode' style='position: absolute;  height: 100px; width:100px;'>"+
                       "</div>",
        // parameters
        sayHelloTo: "me",
        id:"defaultId",
        idImageNode:"_imageId_",
        idPHNode:"_phId_",
        title:"picture widget",
        left:0,
        top:0,
        width: 0,
        height: 0,
        imageLoaded:false,
        img:null,
        originalWidth:0,
        originalHeight:0,
        ratio:0,
        prePath:"images/mImage/",//this is a prefix to the image to assign a location... if images begin by http:// this will not be used
        //prePath:"http://localhost/pdojo/M17/images/mImage/",//this is a prefix to the image to assign a location... if images begin by http:// this will not be used
        url:"",
        url2:"",
        glowPercent:0,//this will increase image by x% when mouse is hover 
        glowPercent2:null,//????
        constructor: function (/*Object*/params) {
            // ratio of original picture is always respected
            // height will  prevail over width. If both are zero heigh will be 50 and will define width
            // if height is missing width will define the image
            //example:
            /*   dijitObj= new ThumbNail({
                    id      : xProps["id"],
                    left:5,
                    top:100,
                    height:30,
                    glowPercent:100,
                    url:"http://google.com/images/logo.gif",
                    title:"the beautiful photo1",
                    sayHelloTo:"pict1"
                 },xId);
            */
            this.id=params.id || this.id;
            this.idImageNode+=this.id;//unique id for imageNode
            this.idPHNode+=this.id;//unique id for phNode
            this.left = params.left || this.left; 
            this.top = params.top || this.top; 
            this.width = params.width || this.width; 
            this.height = params.height || this.height; 

            this.title = params.title || this.title; 
            this.sayHelloTo= params.sayHelloTo || this.sayHelloTo; 
            this.glowPercent= params.glowPercent || this.glowPercent; 
            this.glowPercent2=this.glowPercent;
            this.url = params.url || this.url; 
            if(this.url.substr(0,5)!="http:"){
                 this.url = this.prePath+this.url; // the prepath is introduced is not a net url
            };
            this.url2=this.url;//by any unclear reason this.url is changed when it arrives to posMixInProperties
            console.log(" url="+this.url);
            this.inherited(arguments);
            //alert("constructor left,top="+this.left+","+this.top+" sayHelloTo="+this.sayHelloTo);
        },
        postMixInProperties: function () {
            // Method will be invoked before rendering occurs, and before any dom nodes are created. 
            // If you need to add or change the instance’s properties before the widget is rendered. 
            //console.log("postMixInProperties called "+this.title+" url="+this.url2);
            this.img=new Image();
            this.img.onload=Lang.hitch(this,this.loadImage);//event will trigger loadImage with "this" scope
            this.img.src=this.url2;           
        },    
        postCreate: function(){// add here anything that will be executed after the DOM is loaded and ready.
            // For example, adding events on the dojo attach points is suitable here.   
            //this.inherited(arguments);

            var localSayHelloTo = this.sayHelloTo;
            var localImageNode=this.imageNode;
            var localPhNode=this.phNode;
            var localLeft=this.left;
            var localTop=this.top;
            DomStyle.set(this.containerNode,{
                left:this.left+"px",
                top: this.top+"px"
            });
            DomStyle.set(this.imageNode,{
                width:this.width+"px",
                height:this.height+"px",
                backgroundImage:"url(" + this.url2 + ")",
                backgroundRepeat:"no-repeat",
                backgroundSize:"100%",
                title:this.title
            });
            var phHeight=((1+this.glowPercent2/100)*this.height);   
            var phWidth=phHeight*this.ratio;
            DomStyle.set(this.phNode,{
                width:phWidth+"px",
                height:phHeight+"px",
                backgroundImage:"url(" + this.url2 + ")",
                backgroundRepeat:"no-repeat",
                backgroundSize:"100%",
                title:this.title,
                visibility:"hidden"
            });      
             // Show a Dojo tooltip on the user name node.
            new dijit.Tooltip({
                    connectId: [this.phNode],//the DOM id of the element that will be hovered to show the label as a tooltip
                    label: "picture widget: selected picture is " + this.sayHelloTo
            });
            // Attach an onclick event on the user name node.  
 
            On(this.phNode, "click", function (event) {
                console.log("click event....");
                //alert("The selected picture is: " + localSayHelloTo);
            });  
            
            On(this.imageNode, "mouseover", function (event) {
                console.log("picture " + localSayHelloTo+" was hovered...");
                DomStyle.set(localPhNode, "opacity", "0.2");
                DomStyle.set(localPhNode, "visibility","visible");//oposite is hidden/visible - when it changes to hidden launches mouseout
                Fx.fadeIn({ node:localPhNode, duration: 500 }).play();
                DomStyle.set(localImageNode, "visibility","hidden");//oposite is hidden/visible - when it changes to hidden launches mouseout
            }); 

            On(this.phNode, "mouseout", function (event) {
                //console.log("picture " + localSayHelloTo+" was abandoned...");
                DomStyle.set(localPhNode, "opacity", "1");//fade out will make this chage from 1 to 0
                Fx.fadeOut({ 
                    node:localPhNode, 
                    onEnd:function(){
                        DomStyle.set(localImageNode, "opacity", "0.7");//we prepare it to be still invisible even after visibility:visible
                        DomStyle.set(localImageNode, "visibility","visible");//oposite is hidden/visible

                        Fx.fadeIn({ node:localImageNode, duration: 300 }).play();
                        DomStyle.set(localPhNode, "visibility","hidden");//oposite is hidden/visible - when it changes to hidden launches mouseout

                    },
                    duration: 300
                }).play();
            });
            // Event listeners for loading the image when the node enters the viewport
            var windowEventListeners = new Array();
            //windowEventListeners.push(On(Kernel.global, "scroll", Lang.hitch(this, "windowEventHandler", windowEventListeners)));
            windowEventListeners.push(On(Kernel.global, "scroll", Lang.hitch(this, function(){
               // alert("scroll !!!");//the event triggers whenever there's a scroll in browser window done by the user
            })));
            //windowEventListeners.push(On(Kernel.global, "resize", Lang.hitch(this, "windowEventHandler", windowEventListeners)));            
            windowEventListeners.push(On(Kernel.global, "resize", Lang.hitch(this, function(){
                //alert("resize !!!");//the event triggers whenever there's a rezise in browser window done by the user
            })));            
         },
         loadImage: function(){
            //console.log("loadImage ");
            //alert("loadImage !!!!!!!!!!!! ");
            this.imageLoaded=true;
            this.originalWidth= this.img.width;//the first one is the normalImage
            this.originalHeight= this.img.height;
            this.ratio=(this.originalWidth/this.originalHeight);
            //console.log("The width is "+this.originalWidth); //original image width
            //console.log("The height is "+this.originalHeight);//original image height
            //console.log("The ratio is "+this.ratio);//
            if(this.height==0){
                if(this.width==0){//both are zero
                    this.height=50;//if width and height are 0 =>height will prevail from a base of 50
                    this.width=this.height*this.ratio;
                }else{ //width will determine the dimensions
                    this.height=this.width/this.ratio;
                };    
            }else{
                this.width=this.height*this.ratio;                
            };
            //console.log("normalImage="+this.img.src+" -- All images have loaded (or died trying)!");
            this.postCreate();
        },
        refreshUrl: function(xUrl){//is called with a new url, or without url just to refresh positions l,t,w,h
            if(xUrl){
                this.url = xUrl; 
                if(this.url.substr(0,5)!="http:"){
                     this.url = this.prePath+this.url; // the prepath is introduced is not a net url
                };
                this.url2=this.url;//by any unclear reason this.url is changed when it arrives to posMixInProperties
            };
            //alert("refreshUrl->"+this.url2+" title="+this.title+" left="+this.left+" top="+this.top+" height="+this.height);
            this.postMixInProperties();//this will will call image load and when loaded will call postCreate();
            //this.postCreate();
        },
        visible: function(bSet){//is called with a new url, or without url just to refresh positions l,t,w,h
            var xProp=(bSet) ? "visible":"hidden";
            DomStyle.set(this.idImageNode, "visibility",xProp);
            DomStyle.set(this.idPHNode, "visibility",xProp);
        },//visible
        setDim: function(oDim){//receives an object {l:xl}is called with a new url, or without url just to refresh positions l,t,w,h
            //alert("hello inside picture.js");
            // ex. dijitObj.setDim({l:xLeft});
            var oPDim={l:DomStyle.get(this.id,"left"),t:DomStyle.get(this.id,"top"),w:DomStyle.get(this.idImageNode,"width"),h:DomStyle.get(this.idImageNode,"height")};
            Declare.safeMixin(oPDim, oDim);
            DomStyle.set(this.id,"left",oPDim.l);
            DomStyle.set(this.id,"top",oPDim.t);
            DomStyle.set(this.idImageNode,"width",oPDim.w);
            DomStyle.set(this.idImageNode,"height",oPDim.h);
            DomStyle.set(this.idPHNode,"width",oPDim.w);
            DomStyle.set(this.idPHNode,"height",oPDim.h);
        }//setDim                
     });//end of class picture
}//call back function
); //end of require for module  