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
        "formMaker" : "../../FormMaker",
        "mailer" : "../../mailer",
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
    $("head").append('<script src="../FormMaker/js/LabelElement.js');
    $("head").append('<script src="../FormMaker/js/models/designer_model');
    $("head").append('<script src="../FormMaker/js/models/element_model');
    $("head").append('<script src="../FormMaker/js/models/entity_model');
    $("head").append('<script src="../FormMaker/js/models/form_maker_model');
    $("head").append('<script src="../FormMaker/js/collections/elements');
    $("head").append('<script src="../FormMaker/js/views/main_view');
    $("head").append('<script src="../FormMaker/js/views/element_holder');
    $("head").append('<script src="../FormMaker/js/views/property_panel');
    require([
        "async",
        'jquery.ui',
        'bootstrap',
        'handlebars',
        'underscore',
        'backbone',
        
        "spin.min"
    ], function (async) {
        window.async = async;
        
        require([
            "views/main-view",
            "common-utils",
            "form-designer-util",
            "mailer/js/DragNDrop",
            "formMaker/js/FormMaker",
        ],function(MainView){
            $.widget.bridge('uibutton', $.ui.button);
            var mainView = new MainView({el : 'body'});
            mainView.init();
        })
    });
});