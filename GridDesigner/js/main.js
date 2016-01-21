require.config({
    baseUrl: 'js',
    paths: {
        "jquery": '../../mailer/js/lib/jquery-1.11.0',
        "bootstrap" : "lib/bootstrap",
        "underscore": '../../mailer/js/lib/underscore',
        "backbone": '../../mailer/js/lib/backbone',
        "text" : "lib/helper/text",
        "template" : "template/main",
        "templates" : "../templates/grid-viewer/",
        "views" : "grid-viewer/views",
        "models" : "grid-viewer/models",
        "collections" : "grid-viewer/collections",
        "gridViewer" : "grid-viewer",
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
        'jquery-datetime',
        'bootstrap',
        'handlebars',
        'underscore',
        'backbone',
        "spin.min"
    ], function (async) {
        window.async = async;
        require([
            "grid-viewer/views/main-view",
            "common-utils",
        ],function(MainView){
            var mainView = new MainView({el : 'body'});
            mainView.init();
        })
    });
});