require.config({
    baseUrl: 'js',
    paths: {
        "jquery": '../../mailer/js/lib/jquery-1.11.0',
        "jquery.ui" : "../../mailer/js/lib/jquery-ui-1.10.4",
        "bootstrap" : "lib/bootstrap",
        "handlebars": '../../mailer/js/lib/handlebars-v1.3.0',
        "underscore": '../../mailer/js/lib/underscore',
        "backbone": '../../mailer/js/lib/backbone',
        "text" : "lib/helper/text",
        "template" : "template/main",
        "templates" : "../templates/",
        "views" : "views",
        "models" : "models",
        "collections" : "collections",
        "formMakerLib" : "../../FormMaker",
        "FLSlidePanels" : "../../FL_ui/js/FLSlidePanels",
        "spin.min" : "../../FL_ui/js/spin.min",
        "FLMenu2" : "../../FL_ui/js/FLMenu2",
        "FLlogin2" : "../../FL_ui/js/FLlogin2",
        "FLCommon2" : "../../FL_ui/js/FLCommon2",
        "FLdd2" : "../../FL_ui/js/FLdd2",
        "flClient" : "../../FL_ui/flClient/flClient",
        "ajaxBrowser" : "../../FL_ui/flClient/ajaxBrowser",
        "FLAPI" : "../../FL_ui/js/FLAPI",
        "FLmodal2" : "../../FL_ui/js/FLmodal2"
    }
});
require(['jquery'],function() {
    require([
        'jquery.ui',
        'bootstrap',
        'handlebars',
        'underscore',
        'backbone',
        "ajaxBrowser",
        "spin.min",
        "flClient",
        "template"
    ], function () {
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
        require([
            "views/main-view",
            "common-utils",
            "FLCommon2",
            "FLAPI",
            "FLlogin2",
            "FLdd2",
            "FLSlidePanels",
            "FLmodal2",
            "FLMenu2"
        ],function(MainView){
            $.widget.bridge('uibutton', $.ui.button);
            var mainView = new MainView({el : 'body'});
            mainView.init();
        })
    });
});