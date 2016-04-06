jQuery(document).ready(function ($) {
    /**
     * function to load a given css file
     http://naveensnayak.wordpress.com/2013/06/26/dynamically-loading-css-and-js-files-using-jquery/
     http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
     */
        // var FL = FL || {};
    FL["services"] = (function () {//name space FL.services
        // var privateCommonVar  = null; //shared by all services
        // var privateFunction = function(options, onSelection) {};//shared by all services
        return {//public properties and methods
            publicProperty: "abc",
            msg: null,
            //msgInit: function () {
            //    this.msg = PUBNUB.init({
            //        publish_key: 'pub-c-04ba4469-fe37-4fb2-b4ec-4c3e4a48e194',
            //        subscribe_key: 'sub-c-d629b394-498c-11e5-81b5-02ee2ddab7fe'
            //    });
            //},
            //msgSend: function (channel, message) {//wrapper of FL.services.msg.publish({channel: 'my_channel', message: msg});
            //    if(!this.msg)
            //        this.msgInit();
            //    this.msg.unsubscribe({channel: channel});//stops listening to the sending channel
            //    this.msg.publish({channel: channel, message: message});
            //    this.msg.subscribe({//undoes the unsubscribe
            //        channel: channel,
            //        message: function (m) {
            //            alert("You received the message:" + m);
            //        }
            //    });
            //},
            //msgSubscribe: function (channel, callback) {//wrapper of FL.services.msg.subscribe({channel: 'my_channel', message: msg});
            //    this.msg.subscribe({channel: channel, message: callback});
            //},
            publicNA: function (par1) {//not available
                alert("FL.services.publicNA --> The " + par1 + " service, is not available for the moment.");
            }
        };
    })();
});