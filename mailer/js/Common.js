
window.MailerTemplate = {
	Models : {},
	Collections : {},
	Views : {},
	Lib :{},
	TemplateItems : {
		TITLE : "title",
		IMAGE : "image",
		/*TEXTPLUSIMAGE : "textPlusImage",
		IMAGECARD : "ImageCard",
		DIVIDER : "Divider",
		GALLERY : "Gallery",
		BUTTON : "Button",
		VIDEO : "Video",*/
		SOCIALLINKS : "SocialLinks"
	},
	Templates : [ 
			"title",
			"image",
			/*"TextPlusImage",
			"ImageCard",
			"Divider",
			"Gallery",
			"Button",
			"Video",*/
			"SocialLinks"
		 ],
	DesignTemplate : [
		"background",
		"headingTextColor",
		"fontFamily",
		"fontSize",
		"fontstyle",
		"fontWeight",
		"lineHeight",
		"letterspacing",
		"textAlign"
		],
	StyleProperties : {
		fontColor : "#000",
		fontFamily : "Arial",
		fontSize : "16px",
		fontWeight : "initial",
		lineHeight : "initial",
		textAlign : "center",
		imageAlign : "center",
		imageMargin : "0px",
		imagePadding : "10px",
		backgroundColor : "white",
		borderSize : "1px",
		borderStyle : "none",
		borderColor : "transparent"
	},
	CssStyleConnector : {
		fontColor : "color",
		fontFamily : "font-family",
		fontSize : "font-size",
		fontWeight : "font-weight",
		lineHeight : "line-height",
		textAlign : "text-align",
		imageAlign : "align",
		imageMargin : "margin",
		imagePadding : "padding",
		backgroundColor : "background-color",
		borderSize : "border-size",
		borderStyle : "border-top-style",
		borderColor : "border-color"
	},
	SocialLinks : {
		facebook : "facebook",
		linkedIn : "linkedIn",
		twitter : "twitter",
		youTube : "youtube"
	}
}

