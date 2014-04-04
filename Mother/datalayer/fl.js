define([
    "dojo/_base/declare"
], function(declare) {
    return declare(null,{
        isConnected:false,
        constructor: function() {//global access
             this.isConnected=false;
        },
        login: function (param) {
            return { ctrl:{isOk:false,errNo:23,errMsg:"Invalid User"}, j:{} };
        },
    });
}); //end of  module  