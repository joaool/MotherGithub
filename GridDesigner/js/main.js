require.config({
    baseUrl: 'js',
    paths: {
        "jquery": '../../mailer/js/lib/jquery-1.11.0',
        "jquery.ui" : "../../mailer/js/lib/jquery-ui-1.10.4",
        "bootstrap" : "../../FL_ui/js/bootstrap.min",
        "handlebars": '../../mailer/js/lib/handlebars-v1.3.0',
        "underscore": '../../mailer/js/lib/underscore',
        "backbone": '../../mailer/js/lib/backbone',
        "text" : "lib/helper/text",
        "template" : "template/main",
        "templates" : "../templates/",
        "views" : "views",
        "models" : "models",
        "collections" : "collections"
    }
});
require(['jquery'],function() {
    require([
        'jquery.ui',
        'bootstrap',
        'handlebars',
        'underscore',
        'backbone',
        "template"
    ], function () {
        require(["common","views/main-view"],function(Common,MainView){
            Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
                lvalue = parseFloat(lvalue);
                rvalue = parseFloat(rvalue);

                return {
                    "+": lvalue + rvalue
                }[operator];
            });
            Handlebars.registerHelper('isAdmin', function(userId, options) {
                if (parseInt(userId) == window.userData.id) {
                    return options.fn(userId, options);
                }
            });
            $.widget.bridge('uibutton', $.ui.button);
            var mainView = new MainView({el : 'body'});
            mainView.init();
        })
    });
});