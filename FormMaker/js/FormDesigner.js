    window.FormDesigner = {
        Views : {},
        Models : {},
        Events : {
            "PropertyChange" : "propChange",
            "ElementClick" : "elementClick",
            "ValueChange" : "valueChange"
        }
        
    }; 
    $(document).ready(function(){
        $("#templates").load("Template.html");
         $("#menu-toggle").click(function(e) {
            $("#wrapper").toggleClass("toggled");
            e.preventDefault();
            e.stopPropagation();
        });
        $(".selectbox").click(function(e) {
            $(this).find(".options").toggleClass("toggled");
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
         $.getJSON("Entities.json",function(data){
            var designer = new FormDesigner.Views.MainView({el : "body"});
            designer.loadJSON(data);
        });

        Array.prototype.remove = function(item){
            if (item){
                var index = this.indexOf(item);
                if (index != -1)
                    return this.slice(index,1);
            }
            return this;
        }
    })