/**
* mImage
* @original author: boatboat001 http://boatboat001.com/index.php/blogs/view/ibutton
* @contact: http://twitter.com/boatboat001
* adapted to Mother inteligent image detector, respecting ratio - adapted to AMD, adapted to version 1.7.1
**/
define([
        "dojo/_base/declare",
        "dojo/on",
        "dojo/dom-style",   
        "dojo/dom-attr",
        "dojo/_base/lang",
        "dijit/_WidgetBase", //old dojo.require("dijit._Widget");
        "dijit/_TemplatedMixin" //old  dojo.require("dijit._Templated");
        ],
function(Declare,On,DomStyle,DomAttr,Lang,_WidgetBase,_TemplatedMixin){
return Declare("mImage",[_WidgetBase, _TemplatedMixin],{
        // -----------------------------
        // mImage widget
        //mImage was 4 possible states: normal, hover, active (or pressed) and disable 
        //   To show a picture only - use normal image only   
        //            if hoverImage is missing, normal image will take its place
        //            if activeImage is missing, normal image will take its place
        //            if disabledImage is missing, normal image will take its place
        //
        // Basic features:
        //   Image is always at original ratio. Whenever we set onde dimension (width or height) the other is scaled to the ratio
        //      in constructor if both values are defined, height will be the priority to define ratio. (constructor width will be ignored)
        //      therefore: if constructor has:
        //                      no height and no width definied ->width will be 100 and height will be calculated to respect ratio
        //                      only height defined             ->width will be calculated to respect ratio
        //                      only width  defined             ->height will be calculated to respect ratio
        //                      both heigth and width defined   ->height will rule, with will be calculated (and constructor value ignored)
        //Methods
        //    toggle() - switches between active and normal state (calling activate() and deactivate())
        //       Normally this will be associated to the click event:
        //          ex:  On(dijit.byId("btnSearch").domNode, "click", function(){dijit.byId("btnSearch").toggle();});
        //    setTitle()
        //    setWidth(),setHeight(),setLeft(),set(top),
        //    activate() - forces active state (showing activeImage) (pressing a button)
        //    deactivate() - forces normal  state (showing normalImage) (reposition a button in normal state)
        //    disable() - forces disabled  state (showing disabledImage)  (dimming a button putting it inactive)
        //    enable() - forces normal  state (showing normalImage) (reposition a button in normal state)
        //
        // future -
        // http://www.dsw.com/shoe/jessica+simpson+aven+metallic+pump?prodId=dsw12prod4830023&category=cat20006&activeCats=cat10006,cat20006
        // http://spaceforaname.com/galleryview/demo-default.html
        templateString:"<div class='iButton' dojoAttachPoint='iButton'></div>",
        originalTitle: "",
        title: "",
        isActivated: false,
        isDisabled: false,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        url: "",
        hoverUrl: "",
        disabledUrl: "",
        activeUrl: "",
        activeHoverUrl: "",
        activeDisabledUrl: "",
        defaultWidth: 0,
        defaultHeight: 0,
        originalWidth: 0,
        originalHeight: 0,
        prePath:"images/mImage/",//this is a prefix to the image name for each state
        constructor: function (/*Object*/params) {
            this.width = params.width || this.defaultWidth; //if params.width is empty (the "OR" will give null and left side will prevail
            this.height = params.height || this.defaultHeight;
 
            this.title = params.title || "mImage";
            this.originalTitle=this.title;
            //this.url = params.url || "";                    /* image representing iButton*/
            this.url = this.prePath+params.normalImage || "";  /* first show image */
            //this.hoverUrl = params.hoverUrl || "";          /* image representing hovered action over iButton*/
            this.hoverImage = params.hoverImage || params.normalImage;//if hoverImage is missing takes normal as hover Image
            this.hoverUrl = this.prePath+this.hoverImage; /* hovered image */
        //this.clickUrl = params.clickUrl || ""; 			/* image representing clicked action over iButton*/
            //this.disabledUrl = params.disabledUrl || "";    /* image representing disabled state of iButton*/
            //this.disabledUrl = this.prePath+params.disabledImage || "";    /* image representing disabled state */
            //this.activeUrl = params.activeUrl || params.url;
            this.activeImage = params.activeImage || params.normalImage;//if activeImage is missing takes normal as active Image
            this.activeUrl = this.prePath+this.activeImage;
            
            this.disabledImage = params.disabledImage || params.normalImage;//if disabledImage is missing takes normal as active Image
            this.disabledUrl = this.prePath+this.disabledImage;
 

            //this.activeHoverUrl = params.activeHoverUrl || params.hoverUrl;
            this.activeHoverUrl = this.activeUrl; //now active Hover becomes the same as active - hover has no effect on active
         //this.activeClickUrl = params.activeClickUrl || params.clickUrl;
        // this.activeDisabledUrl = params.activeDisabledUrl || params.disabledUrl;
            this.activeDisabledUrl =this.disabledUrl;// //now active Hover disable becomes the same as disabled  - click has no effect on disable
            this.isActivated = params.isActivated || false; /* representing state of iButton [true, false]*/
            this.left = params.left || this.left; 
            this.top = params.top || this.top; 
 
            //normal image dimensions are extracted here
            var image = new Image();
            image.src =this.url;
            this.originalWidth= image.width;
            this.originalHeight= image.height;
            console.log("The width is "+this.originalWidth); //original image width
            console.log("The height is "+this.originalHeight);//original image height
 

            this.onmouseover = null; 					/* mouseover event handler of iButton */
            this.onmouseout = null; 						/* mouseout event handler of iButton */
            this.onclick = null; 						/* mouseclick event handler of iButton */

            //this.MM_preloadImages([this.hoverUrl, this.disabledUrl, this.activeUrl, this.activeHoverUrl, this.activeDisabledUrl]);
        },
        postMixInProperties: function () {
            try {
                this.inherited(arguments);
            }
            catch (err) {
                console.error(err);
            }
        },
        postCreate: function () {
            try {
                this.inherited(arguments);
            //this.setHeight(this.height);
            //this.setWidth(this.width);
                if(this.height>0){//height rules ration if it exists
                    this.setHeight(this.height);
                    this.scaleWidth();  
                }else{
                    if(this.width<=0)
                        this.width=100;
                    this.setWidth(this.width);
                    this.scaleHeight();
                 };
                this.setLeft(this.left);
                this.setTop(this.top);
                this.setIcon(this.url);
            }
            catch (err) {
                console.error(err);
            }
        },
        startup: function () {
            try {
                this.inherited(arguments);
                //this.onmouseover = dojo.connect(this.iButton, "onmouseover", dojo.hitch(this, function () {
                this.onmouseover = On(this.iButton, "mouseover", Lang.hitch(this, function () {
                    this.onMouseOverButton(this.iButton, this.hoverUrl);
                }));
                this.onmouseout = On(this.iButton, "mouseout", Lang.hitch(this, function () {
                    this.onMouseOutButton(this.iButton, this.url);
                }));
            }catch (err) {
                console.error(err);
            };
        },

        onMouseOverButton: function (elem, url) {
             DomStyle.set(elem, "backgroundImage", "url('" + url + "')");
        },

        onMouseOutButton: function (elem, url) {
            DomStyle.set(elem, "backgroundImage", "url('" + url + "')");
        },

        onMouseClickButton: function (elem, url) {
             DomStyle.set(elem, "backgroundImage", "url('" + url + "')");
        },

        deactivate: function () {
            this.isActivated = false;
            this.setIcon(this.url);
            this.title=this.originalTitle;
            console.log("Volta ao normal ->"+this.title);

            //disconnect previous event handlers
            this.onmouseover.remove();
            this.onmouseout.remove();

            this.onmouseover = On(this.iButton, "mouseover", Lang.hitch(this, function () {
                this.onMouseOverButton(this.iButton, this.hoverUrl);
            }));
             this.onmouseout = On(this.iButton, "mouseout", Lang.hitch(this, function () {
                this.onMouseOutButton(this.iButton, this.url);
            }));

            this.iButton.title=this.title;
            console.log("End of deactive with:->"+this.title);
        },
        activate: function () {
            this.isActivated = true;
            this.setIcon(this.activeUrl);
            this.title=this.originalTitle+" - active";
            console.log("Passa a active->"+this.title);

            //disconnect previous event handlers
            this.onmouseover.remove();
            this.onmouseout.remove();

            this.onmouseover = On(this.iButton, "mouseover", Lang.hitch(this, function () {
                this.onMouseOverButton(this.iButton, this.activeHoverUrl);
            }));
            this.onmouseout = On(this.iButton, "mouseout", Lang.hitch(this, function () {
                this.onMouseOutButton(this.iButton, this.activeUrl);
            }));
            this.iButton.title=this.title;
            console.log("End of active with:->"+this.title);
        },

        toggle: function () {//if state is isDisabled=true nothing is done
            if (!this.isDisabled){
                if (this.isActivated) {
                    this.deactivate();
                  }else{
                    this.activate();
                };
            };    
        },

        enable: function () {
            this.isDisabled=false;
            this.title=this.originalTitle;
            this.iButton.title=this.title;
 
            DomAttr.remove(this.iButton, "disabled");
            //dojo.style(this.iButton, "cursor", "pointer");
            if (this.isActivated) {
                this.activate();
            }
            else {
                this.deactivate();
            }
        },

        disable: function () {
            //disconnect previous event handlers
            this.isDisabled=true;
            this.title=this.originalTitle+" - disabled";
            this.iButton.title=this.title;
 
            this.onmouseover.remove();
            this.onmouseout.remove();


            this.setIcon(this.disabledUrl);
            //dojo.attr(this.iButton, "disabled", "disabled");
            DomAttr.set(this.iButton, "disabled", "disabled");
            //dojo.style(this.iButton, "cursor", "default");
        },
        setLeft: function (/*left*/xLeft) {//sets left position 
            this.left=xLeft;
            DomStyle.set(this.iButton, "position", "absolute");
            DomStyle.set(this.iButton, "left", xLeft+"px");

        },
        setTop: function (/*top*/xTop) {//sets top position 
            console.log("setTop");
            this.top=xTop;
            DomStyle.set(this.iButton, "position", "absolute");
            DomStyle.set(this.iButton, "top", xTop+"px");

        },

        setWidth: function (/*width*/width) {//this is the leading dimension to keep the ratio - it buids proportional image to be cutted or enlarged by height
            //if we set a huge width with a short height the width is respected but the height is cropped to respect the ratio withou distortion
            this.width=width;
            var widthUnit = (typeof width == "number") ? (width + "px") : width;
            DomStyle.set(this.iButton, "width", widthUnit);
        },

        setHeight: function (/*height*/height) {
            this.height=height;
            var heightUnit = (typeof height == "number") ? (height + "px") : height;
            DomStyle.set(this.iButton, "height", heightUnit);
        },
        scaleHeight: function () {//Forces height to grow or to shrink to respect image ratio
            var ratio=(this.originalHeight/this.originalWidth);
            //console.log("width="+this.width+" ratio="+ratio+" product="+ratio*this.width);
            this.height=ratio*this.width;
            DomStyle.set(this.iButton, "height", this.height+"px");
            return this.height;
        },
        scaleWidth: function () {//Forces width to grow or to shrink to respect image ratio
            var ratio=(this.originalWidth/this.originalHeight);
            //console.log("width="+this.width+" ratio="+ratio+" product="+ratio*this.width);
            this.width=ratio*this.height;
            DomStyle.set(this.iButton, "width", this.width+"px");
            return this.width;
        },        
        setCursor: function (/*cursor type*/cursor) {
            DomStyle.set(this.iButton, "cursor", cursor);
        },
        setTitle: function (/*title - tooltip - */xTitle) {
            DomAttr.set(this.iButton, "title", xTitle);
         },
        setIcon: function (/*URL*/iconUrl) {
            //var element = dojo.query(".menuIcon", this.domNode)[0];
            DomStyle.set(this.iButton, "backgroundImage", "url(" + iconUrl + ")");
            DomStyle.set(this.iButton, "backgroundRepeat", "no-repeat");
            DomStyle.set(this.iButton, "backgroundSize", "100%");
            
            DomStyle.set(this.iButton, "border", "red");
            DomStyle.set(this.iButton, "cursor", "pointer");
            DomAttr.set(this.iButton, "title", this.title);
        }
     });//end of class image
}//call back function
); //end of require for module  image
