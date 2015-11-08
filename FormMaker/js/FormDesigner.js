    window.FormDesigner = {
        Views : {},
        Models : {},
        Events : {
            "PropertyChange" : "propChange",
            "ElementClick" : "elementClick",
            "ValueChange" : "valueChange",
            "TypeChange" : "typeChange",
            "LabelTypeChange" : "labelTypeChange"
        }
    }; 
    $(document).ready(function(){
        $("#templates").load("Template.html");
         $("#menu-toggle").click(function(e) {
            $("#wrapper").toggleClass("toggled");
            e.preventDefault();
            e.stopPropagation();
        });
        $(".selectedOption").click(function(e) {
            $(this).parent().find(".options").toggleClass("toggled");
            e.preventDefault();
            e.stopPropagation();
        });
        $(document).click(function(e){
            $(this).find(".options").removeClass("toggled");
            
        });
        $("#entities li,#name li").click(function(evt){
            if ($(this).attr("value") == "new"){
                //alert("create new dialog box");
            } 
        });
        
        
        var mainView = new FormDesigner.Views.MainView({el : "body"});
        mainView.on("ENTITIES_LOADED",function(){
           // mainView.addJsonData(JSON.parse("{\"eCN\":\"8P\",\"left\":[{\"fCN\":\"8U\",\"leftLabel\":\"email\",\"alignment\":\"left\"},{\"fCN\":\"8T\",\"leftLabel\":\"city\",\"alignment\":\"left\"},{\"fCN\":\"8X\",\"leftLabel\":\"email\",\"alignment\":\"left\"},{\"fCN\":\"8Y\",\"leftLabel\":\"phone number\",\"alignment\":\"left\"}],\"right\":[]}"));
        });
        mainView.loadEntities();

        

        Array.prototype.remove = function(item){
            if (item){
                var index = this.indexOf(item);
                if (index != -1)
                    return this.slice(index,1);
            }
            return this;
        }
    })