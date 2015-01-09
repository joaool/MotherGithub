HtmlGenerator = function(jsonData,header,body,footer){
	this.m_jsonData = jsonData
	this.m_Header = $("#template_holder_header");
	this.m_Body = $("#template_holder_body");
	this.m_Footer = $("#template_holder_footer");
}

HtmlGenerator.prototype = {
	m_jsonData : null,
	m_Header : null,
	m_Body : null,
	m_Footer : null,
	m_Index : 0,
	
	renderHtml : function(){
		
	},
	
	parseJSON : function(){
		var templateItems = this.m_jsonData.templateItems;
		var header = templateItems.header;
		var body = templateItems.body;
		var footer = templateItems.footer;
		

		this.AppendHeader(header,this.m_Header);
		this.AppendHeader(body,this.m_Body);
		this.AppendHeader(footer,this.m_Footer);
	},
	AppendHeader : function(jsonObject, parentElement){
		var temp = this;
		
		$.each(jsonObject,function(i,item){
			var element = temp.getElementToDrop(item.type);
			element = $(element).filter("div");
			$(parentElement).append(element);
			$(element).prop("id","template"+(temp.m_Index++));
			var model = temp.getTemplateModel(item.type);
			model.fromJson(item);
			var elementView = temp.getTemplateObject(item.type,$(element).attr("id"));
			elementView.setModel(model);
		});
	},
	getElementToDrop : function(type){
		var childToAppend = $('#' + type + 'DroppedItem').html();
		return childToAppend;
	},
	getTemplateObject : function(type,id){
		switch (type)
		{
			case MailerTemplate.TemplateItems.TITLE:
				return new MailerTemplate.Views.Title({el : "#"+id});
				break;
			case MailerTemplate.TemplateItems.IMAGE:
				return new MailerTemplate.Views.Image({el : "#"+id});
				break;
		}
	},
	getTemplateModel : function(type){
		switch (type)
		{
			case MailerTemplate.TemplateItems.TITLE:
				return new MailerTemplate.Models.Title();
				break;
			case MailerTemplate.TemplateItems.IMAGE:
				return new MailerTemplate.Models.Image();
				break;
		}
	}
}

$(document).ready(function(){
	if (window.opener)
	{
		var template = _.template($("#templatePreview").html());
		$(document.body).append($.parseHTML(template()));
		header = $("#template_holder_header");
		body = $("#template_holder_body");
		footer = $("#template_holder_footer");
		var htmlGenerator = new HtmlGenerator(window.opener.jsonObject,header,body,footer);
		htmlGenerator.parseJSON();
	}
});