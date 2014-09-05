// The in-memory Store. Encapsulates logic to access wine data.
window.csvStore = {
    csvRows:{}, //a JSON of JSONs  {1:{},2:{}...n:{}}; //NOTE:each row  should have a boolean sync field to work in offline mode
    lastId:0,
    setAttributesArr: function(attributesArr){
        //format [{label:"xx",name:fieldName,description:xDescription,type:xtype,enumerable:xEnumerable},{col2}...{}]
        this.attributesArr = attributesArr;
    },
    getAttributesArr: function(){
        return this.attributesArr;
    },
    getAttributesArrNoId: function(){
        var retArr = [];
        _.each(this.attributesArr, function(element,index){
            if (element.name!="id")
                retArr.push(element);
        });
        return retArr;
    },
    store: function( arrToStore ) {//arrToStore is an array of objects [{},{},....{}] where id field is mandatory inside {}
        var arrOfIds = _.map(arrToStore,function(element){return element.id;});
        this.csvRows = _.object(arrOfIds,arrToStore); //becomes ->{1:arrToStore[1],2:arrToSAtore[2]....} 
        // this.csvRows = arrToStore;
        this.lastId = arrOfIds.length;
    },
    getNextId: function(){//returns a number with the id of the last element + 1 
        var arrOfKeys = _.keys(this.csvRows);
        // arrOfKeys[3] = "101";// to test
        var last = _.max(arrOfKeys,function(element){ return  parseInt(element,10); });
        return parseInt(last,10)+1;
    },
    getNumberOfLines: function(){//returns a number with the id of the last element + 1 
        var arrOfKeys = _.keys(this.csvRows);
        var numberOfLines = arrOfKeys.length;
        return numberOfLines;
    },
    populate: function () {
        this.csvRows[1] = {
            id: 1,
            name: "CHATEAU DE SAINT COSME",
            year: "2009",
            grapes: "Grenache / Syrah",
            country: "France",
            region: "Southern Rhone",
            description: "The aromas of fruit and spice give one a hint of the light drinkability of this lovely wine, which makes an excellent complement to fish dishes.",
            picture: "saint_cosme.jpg"
        };
        this.csvRows[2] = {
            id: 2,
            name: "WATERBROOK",
            year: "2009",
            grapes: "Merlot",
            country: "USA",
            region: "Washington",
            description: "Legend has it the gods didn't share their ambrosia with mere mortals.  This merlot may be the closest we've ever come to a taste of heaven.",
            picture: "waterbrook.jpg"
        };

        this.lastId = 2;
    },

    find: function (model) {
        alert("memoryCsv find !!!!");
        return this.csvRows[model.id];//NOT USED
    },

    findAll: function () {
        return _.values(this.csvRows);//it is used !!!
    },

    create: function (model) {
        this.lastId++;
        // model.set('id', this.lastId);
        this.csvRows[this.lastId] = model;//it is used !!!
        return model;
    },

    update: function (model) {
        this.csvRows[model.id] = model;//it is used !!!
        return model;
    },

    destroy: function (model) {
        delete this.csvRows[model.id];//it is used !!!
        return model;
    },
    sync: function (method, model, options) {

        var resp;
        // console.log("Backbone.sync ---------------->"+method+" id="+model.id);
        console.log("----------------- debug before------------------------------------------");

        console.log("csvStore.csvRows[1]:\n"+JSON.stringify(csvStore.csvRows[1]));
        console.log("csvStore.csvRows[2]:\n"+JSON.stringify(csvStore.csvRows[2]));
        console.log("csvStore.csvRows[3]:\n"+JSON.stringify(csvStore.csvRows[3]));
        var last = csvStore.getNextId()-1;
        console.log("LastId= "+last);
        console.log("csvStore.csvRows[last]:\n"+JSON.stringify(csvStore.csvRows[last]));
        console.log("----------------- debug fim ------------------------------------------");
        // alert("Backbone.sync ---------------->"+method+" ---> id="+model.id);

        switch (method) {
            case "read":
                resp = model.id ? csvStore.find(model) : csvStore.findAll();
                break;
            case "create":
                resp = csvStore.create(model);
                break;
            case "update":
                resp = csvStore.update(model);
                break;
            case "delete":
                resp = csvStore.destroy(model);
                break;
        }

        if(options) {
            if (resp) {
                options.success(resp);
            } else {
                options.error("Record not found");
            }
        }
        // console.log("csvStore.csvRows:\n"+JSON.stringify(csvStore.csvRows));
        console.log("----------------- debug after------------------------------------------");

        console.log("csvStore.csvRows[1]:\n"+JSON.stringify(csvStore.csvRows[1]));
        console.log("csvStore.csvRows[2]:\n"+JSON.stringify(csvStore.csvRows[2]));
        console.log("csvStore.csvRows[3]:\n"+JSON.stringify(csvStore.csvRows[3]));
        last = csvStore.getNextId()-1;
        console.log("LastId= "+last);
        console.log("csvStore.csvRows[last]:\n"+JSON.stringify(csvStore.csvRows[last]));

        console.log("----------------- debug fim ------------------------------------------");

        // alert("Leaving csv.Store !!!");

    },
    // currentGridCandidate:'',
    currentGridCandidate:{fileName:'',entityName:null},
    arrayOfGrids: [],//array with pairs [[entitySingularName,{a JSON of JSONs with csvRows}],[xxx,{}],.....]
    insertInArrayOfGrids: function(singularEntityName) {//inserts current JSON of JSONs in an pair array with first element = singular
        this.arrayOfGrids.push([singularEntityName,csvStore.csvRows]);
    },
    setGrid: function(singular){
        var arrPair = _.find(this.arrayOfGrids, function(element) {return element[0] == singular;});
        this.csvRows = arrPair[1];
    }
};

// csvStore.populate();

// Overriding Backbone's sync method. Replace the default RESTful services-based implementation
// with a simple in-memory approach.
//Backbone.sync = store.sync;
// Backbone.sync = function (method, model, options) {