define([
    "dojo/_base/declare"
], function(declare, lang, dom, domStyle, ready) {//Entity CRUD
    return declare(null,{
        name:null,
        constructor: function() {//dictionary operations
             this.name=name;
        },
        // to be changed - getAll: function (param) { //always return an array of json (where is passed directly to mongo) Chhodrow chap Querying 
        //     var paramExample = {where:{}};//return all compressed names (Entity, Fields and Relations) for this appllication
        //     //j.m: type (E,R,F) - j.k entityCN (if type=="F") j.l Compressed Name j.n - realName
        //     var paramExample2 = {where:{"j.k":"22", "j.m":"F"}};//all entity fields from entity 22  - returns { ctrl:{isOk:true}, j:{name:"city"} 
        //     var paramExample3 = {where:{"j.k":"22", "j.n":"city"}};//entity fields from entity 22  - returns { ctrl:{isOk:true}, j:{name:"city"} 
        //     return [{"j":{"k":"2","l":"b3","m":"F","n":"city"}];            
        //     var paramExample4 = {where:{"j.k":"22", "j.n":"city"}, {"j.m":1}  };//mongo search 1-show
        //     return [{"j":{"m":"F"}}];
        // },            
        entityAdd: function (param) {
            var param1 = {singular:"customer",plural:"customers",description:"someone to send invoices"};
            // process..
            return { ctrl:{isOk:false,errNo:23,errMsg:"big error"}, j:{"cn":"23"} };
        },
        entityGet: function (param) {
            var param1 = {entityCN:"23"};
            // process..
            return { ctrl:{isOk:true}, j:{singular:"customer",plural:"customers",description:"someone to send invoices"} };
        },
        entityGetAll: function (param) { //cache refresh 
            var param1 = {where:{}};
            // process..
            return { ctrl:{isOk:true}, j:[{singular:"customer",plural:"customers",description:"someone to send invoices"}] };
        },
        entityUpdate: function (param) {
            var param1 = {cn:"23", singular:"client"};
            // process..
            return { ctrl:{isOk:false,errNo:123,errMsg:"compress name does not exist"}, j:{} };
        },
        entityRemove: function (param) {
            var param1 = {cn:"23",force:true};//default is false - is force=true relations deleted
            // process..
            return { ctrl:{isOk:false,errNo:23,errMsg:"not existing"}, j:{} };
        },
        //------------------------ fields
         fieldAdd: function (param) {
            var param1 = {entityCN:"45",name:"dlvryAddress",description:"place where goods should be delivered",typeUI:"textBox"};
            // process..
            return { ctrl:{isOk:true}, j:{"cn":"23"} };
        },
        fieldGet: function (param) {
            var param1 = {entityCN:"23"};
            // process..
            return { ctrl:{isOk:true}, j:{name:"dlvryAddress",description:"place where goods should be delivered",typeUI:"textBox"} };
        },
        fieldGetAll: function (param) { //cache refresh 
            var param1 = {where:{}};
            // process..
            return { ctrl:{isOk:true}, j:[{name:"dlvryAddress",description:"place where goods should be delivered",typeUI:"textBox"}] };
        },
        fieldUpdate: function (param) {
            var param1 = {cn:"45", name:"deliveryAddress"}; //we can change namem description or typeUI
            // process..
            return { ctrl:{isOk:false,errNo:123,errMsg:"compress name does not exist"}, j:{} };
        },
        fieldRemove: function (param) {
            var param1 = {cn:"23",force:true};//default is false - is force=true relations based on the field will be deleted
            // process..
            return { ctrl:{isOk:false,errNo:23,errMsg:"not existing"}, j:{} };
        },
        //------------------------ relations
        relationAdd: function (param) {
            //dDictionary.addRelation("Invoice","Client","is addressed to","1","En");

            var param1 = {
                left:{entityCN:"45",cardinality:"1",verb:"is invoicing ",storeRelation:true,cached:false,format:null},
                right:{entityCN:"50",cardinality:"N",verb:"has",storeRelation:false,cached:false,format:null}
            };
            // process..
            return { ctrl:{isOk:true}, j:{"relationCN":"23"} };
        },
        relationGet: function (param) {
            var param1 = {relationCN:"23"};
            // process..
            return { ctrl:{isOk:true}, j:{
                left:{entityCN:"45",cardinality:"1",verb:"is invoicing ",storeRelation:true,cached:false,format:null},
                right:{entityCN:"50",cardinality:"N",verb:"has",storeRelation:false,cached:false,format:null}
            };
         },
        relationGetAll: function (param) { //cache refresh 
            var param1 = {where:{}};//
            // process..
           return { ctrl:{isOk:true}, j:[{
                left:{entityCN:"45",cardinality:"1",verb:"is invoicing ",storeRelation:true,cached:false,format:null},
                right:{entityCN:"50",cardinality:"N",verb:"has",storeRelation:false,cached:false,format:null}
            ]};     
        },
        relationUpdate: function (param) {
            var param1 = {
                relationCN:"23",j:{
                    left:{entityCN:"45",cardinality:"1",verb:"is invoicing ",storeRelation:true,cached:false,format:null},
                    right:{entityCN:"50",cardinality:"N",verb:"has",storeRelation:false,cached:false,format:null}
                } 
            };       
            // process..
            return { ctrl:{isOk:false,errNo:123,errMsg:"compress name does not exist"} };
        },
        relationRemove: function (param) {
            var param1 = {relationCN:"23"};
            // process..
            return { ctrl:{isOk:false,errNo:23,errMsg:"not existing"}, j:{} };
        },               
    });
}); //end of  module  