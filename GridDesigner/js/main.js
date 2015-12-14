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
        "spin.min" : "../../FL_ui/js/spin.min",
        "async" : "../../FL_ui/js/async"
    },
});
require(['jquery'],function() {
    $("head").append('<script src="../FL_ui/js/FLSlidePanels.js"></script>');
    $("head").append('<script src="../FL_ui/js/FLMenu2.js"></script>');
    $("head").append('<script src="../FL_ui/js/FLlogin2.js"></script>');
    $("head").append('<script src="../FL_ui/js/FLCommon2.js"></script>');
    $("head").append('<script src="../FL_ui/js/FLdd2.js"></script>');
    $("head").append('<script src="../FL_ui/flClient/flClient.js"></script>');
    $("head").append('<script src="../FL_ui/flClient/ajaxBrowser.js"></script>');
    $("head").append('<script src="../FL_ui/js/FLAPI.js"></script>');
    $("head").append('<script src="../FL_ui/js/FLmodal2.js"></script>');
    
    require([
        "async",
        'jquery.ui',
        'bootstrap',
        'handlebars',
        'underscore',
        'backbone',
        "template",
        "spin.min"
    ], function (async) {
        window.async = async;
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
            "common-utils"
        ],function(MainView){
            $.widget.bridge('uibutton', $.ui.button);
            var mainView = new MainView({el : 'body'});
            mainView.init();
        })
    });
});