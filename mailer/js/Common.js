
window.MailerTemplate = {
	UNSUBSCRIBELINK : "http://62.210.97.101/#unsubscribe",
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
		backgroundColor : "transparent",
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
	SocialLinks : [
		{
			type : "facebook",
			defaultUrl : "http://www.facebook.com",
			defaultText : "Facebook"
		},
		{
			type : "linkedIn",
			defaultUrl : "http://www.linkedIn.com",
			defaultText : "LinkedIn"
		},
		{
			type : "twitter",
			defaultUrl : "http://www.twitter.com",
			defaultText : "Twitter"
		},
		{	
			type : "youTube",
			defaultUrl : "http://www.youtube.com",
			defaultText : "YouTube"
		},
	    {
			type : "googlePlus",
			defaultUrl : "http://plus.google.com",
			defaultText : "Google Plus"
		},
	    {
	    	type : "mail",
			defaultUrl : "your@email.com",
			defaultText : "Email"
	    }
	],
	pageStyle : {
		pageWidth : "500",
		headerBgColor : "white",
		bodyBgColor : 'white',
		footerBgColor: "white",
		headerPaddingLeft : "0",
		headerPaddingRight : "0",
		bodyPaddingLeft : "0",
		bodyPaddingRight : "0",
		footerPaddingLeft : "0",
		footerPaddingRight : "0",
	}
}

