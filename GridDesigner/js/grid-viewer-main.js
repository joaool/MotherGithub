window.gridBaseUrl = "/Joaool/MotherGithub/GridDesigner/";
require.config({
    baseUrl: 'js',
    paths: {
        "jquery": '../../mailer/js/lib/jquery-1.11.0',
        "jquery.ui" : "../../mailer/js/lib/jquery-ui-1.10.4",
        "jquery-datetime": "../../mailer/js/lib/jquery-ui-timepicker",
        "bootstrap" : "lib/bootstrap",
        "handlebars": '../../mailer/js/lib/handlebars-v1.3.0',
        "underscore": '../../mailer/js/lib/underscore',
        "backbone": '../../mailer/js/lib/backbone',
        "text" : "lib/helper/text",
        "backgrid" : "lib/backgrid",
        "backgrid-select-all" : "lib/backgrid-select-all",
        "backbone.paginator" : "lib/backbone.paginator",
        "backgrid-paginator" : "lib/backgrid-paginator",
        "backgrid-filter" : "lib/backgrid-filter",
        "backgrid-grouped-columns" : "lib/backgrid-grouped-columns",
        "backgrid-sizeable-columns" : "lib/backgrid-sizeable-columns",
        "backgrid-orderable-columns" : "lib/backgrid-orderable-columns",
        "Backgrid.ColumnManager" : "lib/Backgrid.ColumnManager",
        "Backgrid.AdvancedFilter" : "lib/Backgrid.AdvancedFilter",
        "backgrid-patch" : "lib/backgrid-patch",
        
        "FLSlidePanels" : "../../FL_ui/js/FLSlidePanels",
        "FLMenu2" : "../../FL_ui/js/FLMenu2",
        "FLlogin2" : "../../FL_ui/js/FLlogin2",
        "FLCommon2" : "../../FL_ui/js/FLCommon2",
        "FLdd2" : "../../FL_ui/js/FLdd2",
        "flClient" : "../../FL_ui/flClient/flClient",
        "ajaxBrowser" : "../../FL_ui/flClient/ajaxBrowser",
        "FLAPI" : "../../FL_ui/js/FLAPI",
        "FLmodal2" : "../../FL_ui/js/FLmodal2",
        "spin.min" : "../../FL_ui/js/spin.min",
        "async" : "../../FL_ui/js/async",
        
        "templates" : "../templates/grid-viewer/",
        "views" : "grid-viewer/views",
        "models" : "grid-viewer/models",
        "collections" : "grid-viewer/collections",

        "formMaker" : "../../FormMaker",
        "mailer" : "../../mailer"
    },
    shim : {
        "backgrid-grouped-columns" : ["backgrid"],
        "backgrid-patch" : ["backgrid"],
        "FLSlidePanels" : ["jquery","flClient","FLCommon2"],
        "FLMenu2" : ["flClient"],
        "FLlogin2" : ["flClient","FLAPI"],
        "FLCommon2" : ["flClient"],
        "FLdd2" : ["flClient"],
        "flClient" : ["jquery"],
        "ajaxBrowser" : ["flClient"],
        "FLAPI" : ["flClient"],
        "FLmodal2" : ["flClient"],
    }
});
require(['jquery'],function() {
    require([
        "async",
        'jquery.ui',
        'jquery-datetime',
        'bootstrap',
        'handlebars',
        'underscore',
        'backbone',
        "spin.min",

        "flClient",
        "FLMenu2",
        "FLlogin2",
        "FLCommon2",
        "FLdd2",
        "ajaxBrowser",
        "FLAPI",
        "FLmodal2",
        "FLSlidePanels",
        
        "backgrid",
        "backgrid-select-all",
        "backbone.paginator",
        "backgrid-paginator",
        "backgrid-filter",
        "backgrid-grouped-columns",
        "backgrid-sizeable-columns",
        "backgrid-orderable-columns",
        "Backgrid.ColumnManager",
        "Backgrid.AdvancedFilter",
        "backgrid-patch"
    ], function (async) {
        window.async = async;
        require([
            "views/main-view",
            "common-utils",
            "form-designer-util",
            "mailer/js/DragNDrop",
            "formMaker/js/FormMaker",
            "grid-viewer-constants"
        ],function(MainView){
            $.widget.bridge('uibutton', $.ui.button);
            var mainView = new MainView({el : 'body'});
            mainView.init();
            if (window.opener && window.opener.gridData){
                mainView.setGrid(window.opener.gridData);
            }
            
        });
    });
});