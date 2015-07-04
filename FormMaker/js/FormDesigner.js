    window.FormDesigner = {
        Views : {},
        Models : {},
        Events : {
            "PropertyChange" : "propChange",
            "ElementClick" : "elementClick",
            "ValueChange" : "valueChange",
            "TypeChange" : "typeChange"
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
            $("#contextMenu").hide();
        });
        $("#entities li,#name li").click(function(evt){
            if ($(this).attr("value") == "new"){
                //alert("create new dialog box");
            } 
        });
        
        var mainView = new FormDesigner.Views.MainView({el : "body"});
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