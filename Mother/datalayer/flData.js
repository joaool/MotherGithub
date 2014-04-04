define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/ready"
], function(declare, lang, dom, domStyle, ready) {
    return declare(null,{
        name:null,
        constructor: function(databaseName) {
             this.name=databaseName;
        },
        //ewnvelope
        getData: function (param) {
            //option full/mini full - all JSON from connected documents - mini - only pointers in details and cache data if it exists
            var param1 = {entityCN:"15",_id:"35",option:"mini"}; //only fields of 35@15  
            var param2 = {entityCN:"15",_id:"35",option:"full"}; //fields of 35@15 and fields of all connected documents  
            return1 { ctrl:{isOk:true}, j:{_id:35,"M3":"2014/03/2","N3":12345.56,R:[{e:10,s:0,r:R3,i:16,u:"n"}}]}}};
            return2 { ctrl:{isOk:true}, j:{_id:35,"M3":"2014/03/2","N3":12345.56,R:[{e:10,s:0,r:R3,i:16,u:"n",j:{_id:16,"C1":"Joao","C2":"351911655"}}]};//all foreigner fields are returned
            //           U:"n" no change"
        }, 
        updateData: function (param) {
            //option full/mini full - all JSON from connected documents - mini - only pointers in details and cache data if it exists
            var param = {entityCN:"15", j:{_id:35,"M3":"2014/03/2","N3":12345.56 }; //update master only 
            //to update invoice data (detail) to a different customer
             var param2 = {entityCN:"15", j:{_id:35,"M3":"2014/03/2","N3":12345.56,R:[{e:10,s:0,r:R3,i:16,u:"d"},{e:10,s:0,r:R3,i:17,u:"i"}}}] }; //only fields of 35@15  

            return { ctrl:{isOk:true};
            //           U:"n" no change"
        },
        insertData: function (param) {
            //option full/mini full - all JSON from connected documents - mini - only pointers in details and cache data if it exists
            var param = {entityCN:"15", j:{_id:35,"M3":"2014/03/2","N3":12345.56,R:[{e:10,s:0,r:R3,i:16,u:"i"}}] }; //only fields of 35@15  

            return { ctrl:{isOk:true};
            //           U:"n" no change"
        },                  
    });
}); //end of  module  