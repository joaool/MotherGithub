window.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplate2: function(views, templates, callback) {//to each view must always correspond one template

        var deferreds = [];

        $.each(views, function(index, view) {
            if (window[view]) {
                console.log(index+" - carrega view="+view+" with template "+ 'tpl/' + templates[index] + '.html');
                deferreds.push($.get('tpl/' + templates[index] + '.html', function(data) {//loads with jquery.get()
                    // alert("data coming from "+view+":\n"+data);
                    window[view].prototype.template = _.template(data);//view should match template names...
                }));
               console.log("utils.loadTemplate-----ok--------->carregou view="+view);
               // console.log("utils.loadTemplate-----ok--------->carregou view="+view+" com:\n"+data);
               // alert("utils.loadTemplate-----ok--------->carregou view="+view+" com:\n"+data);

            } else {
                alert("FrameLink could not find " + view + ".html in directory 'tpl'");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },
        // window.mvt={
        //     _no_model:{//these are fix templates withou any variable data
        //         HeaderView:["HeaderView"],
        //         AboutView:["AboutView"]
        //     },
        //     customer:{
        //         customer_recordView:["customer_recordView_default","customer_recordView_outsideAccess"],
        //         customer_gridView:["customer_gridView_default"]
        //     },
        //     wine:{
        //         wine_recordView:["wine_recordView_default","wine_recordView_outsideAccess"],
        //         wine_gridView:["wine_gridView_default"]
        //     },
        //     csv:{
        //         wine_recordView:["CsvView"]
        //     }
        // };
   createView_Template: function(mvt,callback) {//to each view must always correspond one template
        //Creates views for the mvt structure and loads templates from disk
        //if a view has several templates (array.len>1) loadTemplates creates a duplicate of the base view with the same name as the yemplate
        console.log("--------------------------- load Template ----------------------------");
        var deferreds = [];

        var thiz = this;
        _.map( mvt, function( value, key ) {
            var model = key;
            console.log(    "_.---->Model="+ model);//
            _.map( value, function( value, key ) {
                var view = key;
                var templateArr = value;
                console.log("_.----------View="+view+"  tpl:-->"+templateArr);// value is an array
                _.each( templateArr, function( element, index ) {
                    if (!window[view]) {//if the view does not exist, creates it
                    // if (true) {//if the view does not exist, creates it
                        thiz.createView(view,model);
                    } else {
                        console.log("utils.loadTemplate-------------->existing view="+view);
                        // console.log("utils.loadTemplate-----ok--------->carregou view="+view+" com:\n"+data);
                         // console.log(view+"************>"+index);
                        // console.log(" ------------------> carrega view="+view+" with template "+ 'tpl/' + templates[key] + '.html');
                     // console.log("@@@@@ "+index+"------------------> carrega view="+view+" with template " + 'tpl/' + element + '.html');
                        // deferreds.push($.get('tpl/' + templates[index] + '.html', function(data) {//loads with jquery.get()
                        //     // alert("data coming from "+view+":\n"+data);
                        //     window[view].prototype.template = _.template(data);//view should match template names...
                        // }));
                        // alert("utils.loadTemplate-----ok--------->carregou view="+view+" com:\n"+data);
                    
                        // alert("FrameLink could not find " + view + ".html in directory 'tpl'");
                    // console.log("FrameLink could not find " + view + ". It did not load "+element+".html in directory 'tpl'");
                    }
                    // var x=deferreds; console.log(" inside template type of x=" + utils.typeOf(x));
                    thiz.createTemplate(element,view,model,deferreds);
                });
                // console.log(    "_.---->Value="+value);//
            });
        });
        $.when.apply(null, deferreds).done(callback);
        console.log("--------------------------- load Template END------------------------");
    },
    createView: function(view,model) {
        console.log("utils2.createView ------------------------------------------------------> creates view=" + view + " for model="+model);
        if(model == "_no_model") {
            window[view] = Backbone.View.extend({
                initialize:function () {
                    this.render();
                },
                render:function () {
                    $(this.el).html(this.template());
                    return this;
                }
            });
        } else {
            console.log("we need to define a complex view in utils2.loadTemplate.createView()");
        }
    },
    createTemplate: function(template,view,model,deferreds){
        console.log("utils2.createTemplate ------------------------------------------------------------> creates template="+
                    template + " for view=" + view + " and model="+model);
        console.log(" - carrega view="+view+" with template "+ 'tpl/' + template + '.html');
        // var x=deferreds; console.log(" inside createTemplate type of x=" + utils.typeOf(x));
        deferreds.push($.get('tpl/' + template + '.html', function(data) {//loads with jquery.get()
            if(window[view]) {
                window[view].prototype.template = _.template(data);//view should match template names...
            }else{
                alert("createTemplate Error: Cannot load template tpl/" + template + ".html, because the view " + view + " does not exist !!!");
            }
        }));
    },
    uploadFile: function (file, callbackSuccess) {
        var self = this;
        var data = new FormData();
        data.append('file', file);
        $.ajax({
            url: 'api/upload.php',
            type: 'POST',
            data: data,
            processData: false,
            cache: false,
            contentType: false
        })
        .done(function () {
            console.log(file.name + " uploaded successfully");
            callbackSuccess();
        })
        .fail(function () {
            self.showAlert('Error!', 'An error occurred while uploading ' + file.name, 'alert-error');
        });
    },

    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
    },

    addValidationError: function (field, message) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.addClass('error');
        $('.help-inline', controlGroup).html(message);
    },

    removeValidationError: function (field) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.removeClass('error');
        $('.help-inline', controlGroup).html('');
    },

    showAlert: function(title, text, klass) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(klass);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();
    },

    hideAlert: function() {
        $('.alert').hide();
    },
    is_email: function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    typeOf: function(xVar) {//returns one of :  "number","string","email","boolean","object","array","null","undefined","date"
        //exemple of undefined: a variable declared but never defined -->var foo; alert(foo); //undefined.
        var xRet = typeof xVar;
        if(xRet == "object") {
            if (xVar instanceof Array)
                xRet="array";
            if (xVar instanceof Date)
                xRet="date";
            if (!xVar)
                xRet="null";
        }else if(xRet == "string"){
            if(this.is_email(xVar))
                xRet="email";
        }
        return xRet;
    },
    arrayToLower: function(list){
        return _.map(list,function(element,index){
            return(element.toLowerCase());
        });
    },
    csvToStore:function(rows){//rows is an array of JSON [{},{}...{}]; each JSON  has a key/value = attribute/content
        //feeds the csvStore (memoryCsv.js)  with rows injecting id column and converting other column names to lower case
        var csvrows = [];
        _.each( rows, function( element, index ) {
            // console.log((index+1)+" ---> "+element[data.fields[0]] + " --- " + element[data.fields[6]]);//shows column 0 and column 6
            element["id"] = index+1;//to insert id in element...
            //we need to be sure that each key is lowercase
            var arrOfPairs = _.pairs(element);//returns an array w/ pairs [["one", 1], ["two", 2], ["three", 3]]
            arrOfPairs =  _.map( arrOfPairs, function(value) {
                return [ value[0].toLowerCase(), value[1] ];
            });
            var element2 = _.object(arrOfPairs);//reconstruct object from arrOf Pairs
             csvrows.push(element2);
        });
        csvStore.store(csvrows);
    },
    firstRowAnalisys: function(rows, percent) {
        // assumes that all rows have the same json pattern with same type in the whole array - assumes type of row = type of first row
        // If column row type is "string" search for enumerables within that column
        //    if [(total number of groups)/(number of rows) < percent ] assumes enumerable and identifies an array of enumerables
        // returns
        //   [ {name:{fieldType:"string", label:"Name"}}, ...., {service:{fieldType:"enumerable", label:"Name", enumerable:[*]}} ]
        //      if fieldType="enumerable" the property enumerable has an array with the enumerable options.
        var numOfRows = rows.length;
        var arrOfKeys = _.keys( rows[0] );//at least row[0] must exist
        var arrOfTypes = [];
        _.each(arrOfKeys, function(element, index){
            var obj = {};
            var dataType = utils.typeOf((rows[0][element]).trim());//one of  "number","string","email","boolean","object","array","null","undefined","date"
            // console.log(index+" firstRowAnalisys looking for enumerables -->"+element+ " dataType="+dataType);
            if (dataType == "string") {//possible datatypes:string, integer, number, boolean, date, or json 

                var arrOfRowValues = _.pluck(rows,element);
                // var zz= _.chain(arrOfRowValues).countBy().pairs().max(_.last).value();
                //http://stackoverflow.com/questions/18878571/underscore-js-find-the-most-frequently-occurring-value-in-an-array
                var arrWrap = _.chain(arrOfRowValues).countBy().pairs(); //arrGroups gives us the number of different elements
                var arrGroups = arrWrap._wrapped; //arrGroups gives us the number of different elements
                //arrGroups has the format: [ ["High",40], ["Medium",47], ["Premium",5], ]
                var columnPercent = arrGroups.length/numOfRows;
                if ( columnPercent < percent ) { //we have an enumerable
                    // console.log(index+" firstRowAnalisys looking for enumerables -->"+element+ " fieldType="+fieldType+" is enumerable ");
                    var enumerableArr = _.map(arrGroups, function(element){ return element[0]; });
                    obj[element.toLowerCase()] = {"fieldType":"string","fieldTypeUI":"combobox",enumerable:enumerableArr, label:element};
                }else{
                    obj[element.toLowerCase()] = {"fieldType":"string","fieldTypeUI":"textbox",enumerable:null,label:element};
                }

            }else{
                if (dataType == "number") {//possible datatypes:string, integer, number, boolean, date, or json 
                    obj[element.toLowerCase()] = {"fieldType":"number","fieldTypeUI":"numberbox",enumerable:null, label:element};
                }else if(dataType == "email") {
                    obj[element.toLowerCase()] = {"fieldType":"string","fieldTypeUI":"emailbox",enumerable:null, label:element};
                }else if(dataType == "boolean") {
                    obj[element.toLowerCase()] = {"fieldType":"boolean","fieldTypeUI":"checkbox",enumerable:null, label:element};
                }else if(dataType == "date") {
                    obj[element.toLowerCase()] = {"fieldType":"date","fieldTypeUI":"datetextbox",enumerable:null, label:element};
                }else{
                   obj[element.toLowerCase()] = {"fieldType":"string","fieldTypeUI":"textbox",enumerable:null,label:element};
                }
            }
            arrOfTypes.push(obj);
            var z=32;
        });
        return arrOfTypes;
    },
    createEntityFromCsvAnalisys: function(rows){//creates a dd entry from a set of rows
        var entityName = "_unNamed";
        //this new entity will be called "unNamed" + <num> - we need to evaluate how many unNamed<#> are already in dd.
        entityName = FL.dd.nextEntityBeginningBy(entityName);
        // FL.dd.createEntity("Client152","Individual or Company to whom we may send invoices");//singular, plural, description
        if(!FL.dd.createEntity(entityName,"temporary name for imported entity"))//singular,description
            alert("createEntityFromCsvAnalisys Error entity " + entityName + " already exists !");
        // this.checkTypesForArrayOfObjects(rows);
        var arrOfAttributes = this.firstRowAnalisys(rows, 0.5);
        _.each(arrOfAttributes, function(element,index){
            var attrName = _.keys(element)[0];
            var fieldType =element[attrName].fieldType;
            var label =element[attrName].label;
            var enumerable = null;
            if(fieldType=="enumerable"){
                enumerable = element[attrName].enumerable;
            }
            // console.log(index+" - createEntityFromCsvAnalisys -->"+attrName +" type="+fieldType+" label="+label );
            FL.dd.addAttribute(entityName, attrName,entityName+"' "+attrName,label,fieldType,fieldTypeUI,enumerable);//xEntity,xAttribute,xDescription,xLabel,xType,xEnumerable
        });
        return entityName;
    },
    createAttributesArrFromCsvAnalisys: function(rows){//creates the equivalent to a dd entry from a set of rows
        // returns an array with the same format as dd dictionary array of attributes. Each element has the following format:
        //      ex: {name:"address",description:"address to send invoices",label:"Address",type:"string",enumerable:null,key:false});
        var attributesArr = [];
        var arrOfAttributes = this.firstRowAnalisys(rows, 0.5);
        _.each(arrOfAttributes, function(element,index){
            var attrName = _.keys(element)[0];
            var fieldType =element[attrName].fieldType;
            var fieldTypeUI =element[attrName].fieldTypeUI;
            var label =element[attrName].label;
            var enumerable = null;
            // if(fieldType=="enumerable"){
            //     enumerable = element[attrName].enumerable;
            // }
            if(fieldType=="string" && fieldTypeUI == "combobox"){
                enumerable = element[attrName].enumerable;
            }

            console.log(index+" - createAttributesArrFromCsvAnalisys -->"+attrName +" type="+fieldType+" label="+label );
            attributesArr.push({name: attrName,description: "description of " + attrName,label: label,type: fieldType, typeUI: fieldTypeUI, enumerable: enumerable, key: false});

            // FL.dd.addAttribute(entityName, attrName,entityName+"' "+attrName,label,fieldType,enumerable);//xEntity,xAttribute,xDescription,xLabel,xType,xEnumerable
        });
        // attributesArr.push({label:"Order",name:"id",description: "order of lines",type:"string",enumerable:null,key:true}); //injects id exactly like dd
        return attributesArr;
    },
    injectId: function(idTitle,arrOfColumns){//injects a first id column into the array
        arrOfColumns.splice(0, 0, {label:idTitle,name:"id",description: "order of lines",type:"number",typeUI:"numberbox",enumerable:null,key:true});
    },    
    backGridColumnsExtractedFromDictionary: function(entityName){//prepares a columns object for backgrid
        //first column has a delete button, second a non editable  id then the others       
        var oEntity = FL.dd.getEntityBySingular(entityName);
        return this.backGridColumnsFromArray(oEntity.attributes);
    },
    backGridColumnsFromArray: function(arrOfColumns){//prepares a columns object for backgrid
        //arrOfColumns has the format: [{label:"xx",name:fieldName,type:xtype,enumerable:xEnumerable},{col2}...{}]
        //    label ->The column Label
        //    name -> the field name stored in csvStore (csvStore.csvRows) - one name must be called id (second columns) non-editable
        //    type -> the type of content (string, number etc...)
        //      if xtype!="enumerable" =>xEnumerable = null 
        //      if xtype="enumerable" =>xEnumerable = array with enumerable elements
        //    ewnumerable -> null or an array of enumerable elements
        //first column has a delete button, second a non editable  id then the others       
        var DeleteCell = Backgrid.Cell.extend({
            template: _.template($("#gridDelButton").html()),
            className: "backgridDelColumn",
            events: {
                "click": "deleteRow"
            },
            deleteRow: function (e) {
                e.preventDefault();
                alert("we will remove "+this.model.get("id"));
                // csvSetCollection.sync("delete",this.model);
                this.model.collection.sync("delete",this.model);
                this.model.collection.remove(this.model);
            },
            render: function () {
                this.$el.html(this.template());
                this.delegateEvents();
                return this;
            }
        });
        var columns = [{name: "del", label: "Delete", cell: DeleteCell }];
        // var oEntity = FL.dd.getEntity(entityName);
        _.each(arrOfColumns, function(element,index){
            console.log("defaultEntityColumns *********************--->"+element.name);
            var column = {};
            column["name"] = element.name;
            if( element.name=="id" ) {
                column["editable"] = false;
                column["label"] = element.label;
                column["cell"] = Backgrid.IntegerCell.extend({ orderSeparator: '' });
                // column["cell"] = Backgrid.IntegerCell.extend({ className:'bacgridId',orderSeparator: '' });
            }else if(element.type=="string" && element.typeUI=="combobox"){
                var enumValues = _.map(element.enumerable, function(element){ return [element,element]; });
                // var MySelect2Cell = Backgrid.Extension.Select2Cell.extend({
                var MySelectCell = Backgrid.SelectCell.extend({
                    select2Options: {openOnEnter: false},
                    optionValues: enumValues
                 });
                column["label"] = element.label;
                column["cell"] = MySelectCell;
            }else{
                // ex {label:"Col4",name:"f4",type:"integer",enumerable:null}, "date", "url"
                //     "number","string","email","boolean","object","array","null","undefined"
                //http://backgridjs.com/ref/cell.html
                column["label"] = element.label;
                if(element.type=="number"){
                    column["cell"] = "number";// A cell type for floating point value, defaults to have a precision 2 decimal numbers  
                }else if(element.type=="integer"){
                    column["cell"] = "integer";//An integer cell is a number cell that displays humanized integers
                }else if(element.type=="date"){
                    column["cell"] = "date";
                }else if(element.type=="url"){
                    column["cell"] = "url";
                }else{
                    column["cell"] = "string";
                }
            }
            columns.push(column);
        });
        return columns;
    },
    defaultNewGridRow: function(columnsArr,last){//returns an array of fields with empty content
        // columnsArr is columns definition to mountGrid. Format: [{label:"xx",name:fieldName,type:xtype,enumerable:xEnumerable},{col2}...{}]
        var newRow = {};
        _.each(columnsArr, function(element,index){
            var fieldName = element.name;
            if( fieldName =="id" ) {
                newRow[fieldName] = last;
             }else if(element.type=="enumerable"){
                newRow[fieldName] = '';
            }else{
                newRow[fieldName] = '';
            }
           console.log("defaultNewGridRow newRow="+JSON.stringify(newRow));
        });
        return newRow;
    },
    mountGridInCsvStore: function(columnsArr) {//creates backbone classes and uses them
        // columnsArr is columns definition to mountGrid. 
        //      Format: [{label:"xx",name:fieldName,type:xtype,enumerable:xEnumerable},{col2}...{}]
        //Classes: Model ->CsvElement, Collection ->CsvSet
        //Instances:                  , collection ->csvSetCollection
        var myColumns = new Backgrid.Columns(columnsArr);
        Backbone.sync = csvStore.sync;

        var CsvElement = Backbone.Model.extend({
            initialize: function () {
                console.log("initializing CsvElement model");
                this.on('change',this.modelUpdate,this);
            },
            modelUpdate: function(){
                // alert("CsvElement modelUpdate !!!! --->"+ this.get("id") +  " nome="+this.get("nome"));
                // alert("CsvElement modelUpdate !!!! --->"+ JSON.stringify(this.toJSON()));
                csvSetCollection.sync("update",this);
            },
            // sync:csvStore.sync
            sync:function(method, model, options){
                return csvStore.sync(method, model, options);
            }
        });//every row is a model object
        var CsvSet = Backbone.Collection.extend({//the whole table is backed by a simple Backbone collection
            model: CsvElement,
        });
        var csvSetCollection = new CsvSet(csvStore.csvRows);//We can instantiate our new collection by passing in an array of models.       
        csvSetCollection.fetch({success: function(){
            console.log(" csvSetCollection.fetch ==========================================> success !!!");
        }});

        var CsvPageableCollection = Backbone.PageableCollection.extend({
            state: {
                pageSize: 10,
                // sortKey: "updated_at",
                order: 1
            },
            sync:function(method, model, options){
                return csvStore.sync(method, model, options);
            },
            mode: "client",
            model: CsvElement //necessary for update
        });
        var csvPageableCollection = new CsvPageableCollection();

        // var z=32;
        var grid = new Backgrid.Grid({
            // row:ClickableRow,
            columns:myColumns,
            // collection:csvSetCollection //grid without paginator
            collection:csvPageableCollection //<-------------- necessary for pagination !!!!
        });
        var paginator = new Backgrid.Extension.Paginator({
            // windowSize: 20, // Default is 10
            collection: csvPageableCollection // the collection subclass that supports pagination
        });

        $("#csvcontent").empty();
        $("#addGrid").click(function () {
            // var last = csvSetCollection.length +1;
            var last = csvStore.getNextId();
            var newRow = utils.defaultNewGridRow(columnsArr, last);

            var CsvElementModel = Backbone.Model.extend({});
            var csvLine = new CsvElementModel(newRow);

            // csvSetCollection.add(newRow);//grid without paginator - collection does not have a save method
            csvPageableCollection.getLastPage();//we force lastPage display !!! - remove this line if no paginator
            csvPageableCollection.add(newRow);//the new model was inserted in the collection <--- necessary for paginator - - remove this line if no paginator

            csvLine.sync("create",newRow);

            grid.insertRow(csvLine);
        });
        $("#grid").append(grid.render().$el);
        // $("#csvcontent").append(grid.render().el);
        $("#paginator").append(paginator.render().$el);
        csvPageableCollection.fetch();
    },
    csvToGrid: function(csvFile){//input is a JQuery object (a file representation). Ex var csvFile = $('input[type=file]');
        csvFile.parse({//http://papaparse.com/  
            config: {
               // base config to use for each file
               encoding:"ISO-8859-1" // ISO-8859-1 is the good encoding for Portuguese chars  - "UTF-8" or "utf-8", "latin-1", "windows-1255"
            },
            before: function(file,inputElem) {
                // alert("file name="+file.name);
                // alert("inputElem="+inputElem);
            },
            complete: function(data) {
                // data is an object data = {errors:{}, meta:{}, results:{fields:[ elements are fields],rows:[elements are objects]} } 
                // data.results.fields - array with columns titles to show
                // data.results.rows - an array of JSON [{},{}...{}]; each JSON  has a key/value = attribute/content
                //     eventualy key names have upper case chars ->if columnsArr is provided by 
                //       method utils.backGridColumnsExtractedFromDictionary() they will be converted to lower case only
                //     eventually id will be missing among key names -  utils.csvToStore() will inject id into csvStore
                
                //now we pass this entity to the data dictionary. Then the data dictionary will feed the grid columns
                // csvStore.currentGridCandidate["entityName"] = entityName;
                // var entityName = utils.createEntityFromCsvAnalisys(data.results.rows);
                // FL.dd.displayEntities();
                // var columnsArr2 = utils.backGridColumnsExtractedFromDictionary(entityName);//extracts attributes from dictionary and prepares columns object for backgrid
                

                // this is an alternative without creating any entry in data dictionary
                // to use backGridColumnsFromArray() we need arrOfColumns with format: [{label:"xx",name:fieldName,type:xtype,enumerable:xEnumerable},{col2}...{}]
                //  to get arrOfColumns we need a method similar to  createEntityFromCsvAnalisys(rows)
                var arrOfColumns =  utils.createAttributesArrFromCsvAnalisys(data.results.rows);//returns all coluns from CSV
                utils.injectId("id",arrOfColumns); //now the first column is an "id" column 
                var columnsArr = utils.backGridColumnsFromArray(arrOfColumns);//extracts attributes from dictionary and prepares columns object for backgrid

                console.log("columns defined...");
                var columnsArr2 = [//columns definition to mountGrid - Manual equivalent  to utils.backGridColumnsExtractedFromDictionary()
                    {label:"Order",name:"id",type:"string",enumerable:null},
                    {label:"Col1",name:"f1",type:"string",enumerable:null},
                    {label:"Col2",name:"f2",type:"string",enumerable:null},
                    {label:"Col3",name:"f3",type:"enumerable",enumerable:["A","B","C"]},
                    // {label:"Col4",name:"f4",type:"number",enumerable:null}
                    {label:"Col4",name:"f4",type:"number",enumerable:null}
                ];
                var rowsArr2 = [
                    {id:1,f1:"abcd Lda", f2:"Av Mortirmer 12",  f3:"C",f4:225},
                    {id:2,f1:"Jua Lda",  f2:"Dr Vaquero 5",     f3:"A",f4:322},
                    {id:3,f1:"Moe Corp", f2:"Latham Street 24C",f3:"A",f4:242},
                    {id:4,f1:"Zuka",     f2:"123, Zuka Build.5",f3:"B",f4:357},
                    {id:5,f1:"One World",f2:"One way street 23",f3:"A",f4:196},
                    {id:6,f1:"Moe Corp", f2:"Latham Street 24C",f3:"A",f4:242},
                    {id:7,f1:"ZumZum",   f2:"Vitesse Road.5",   f3:"B",f4:357},
                    {id:8,f1:"2nd Lab",  f2:"Two way street 57",f3:"A",f4:196},
                    {id:9,f1:"Moe Corp", f2:"Latin America 1",  f3:"A",f4:242},
                    {id:10,f1:"Zukerman",f2:"29,Zukerman Bld.7",f3:"B",f4:357},
                    {id:11,f1:"third A", f2:"One Str, 632",     f3:"A",f4:196}

                 ];
                // columnsArr - columns definition to mountGrid has the format: [{label:"xx",name:fieldName,type:xtype,enumerable:xEnumerable},{col2}...{}]
                // columnsArr2 = utils.backGridColumnsFromArray(columnsArr2);
                csvStore.setAttributesArr(arrOfColumns);
                utils.csvToStore(data.results.rows); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
                // utils.csvToStore(rowsArr2); //feeds the csvStore data store object. It inserts id element and converts keys to lowercase
                
                utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
                // to prepare columnArr to backGrid use utils.backGridColumnsExtractedFromDictionary() or backGridColumnsFromArray()
                // utils.mountGridInCsvStore(columnsArr2);//mount backbone views and operates grid - columnsArr must be prepared to backGrid
            }
        });
    },
    buildMasterDetailStructureFromattributesArr: function(attributesArr){
        var items = [];
        var detailLine = null;
        _.each(attributesArr, function(element,index){
            detailLine = {attribute:element.name, description:element.description, statement: "The " + element.name + " of entity is..."};
            items.push(detailLine);
        });
        return items;
    },
    singleFormTemplate: function(formTitle,entitySingular,fieldArr){// returns a function with a template that has the tagged fields
        // returns a template function with tags for fields defined in fieldArr
        // exemple of field Arr:
        // fieldArr = [//fieldType:text,number,email,date
        //     {fieldId: "f1",fieldLabel: "Name",fieldType: "text",fieldValue: "<%= name %>"},
        //     {fieldId: "f2",fieldLabel: "Age",fieldType: "number",fieldValue: "<%= age %>"},
        //     {fieldId: "f3",fieldLabel: "Occupation",fieldType: "text",fieldValue: "<%= occupation %>"}
        // ];       
        var base =
            "<div class='container'>" +
                "<legend><%= title %></legend>" +
                "<div class='row'>" +
                    "<form class='form-horizontal col-sm-12'>" +
                        "<fieldset>" +
                            "<div class='row'>" +
                                "<div class='col-sm-4'>" +
                                    "<%= controlGroupHtml %>" +
                                "</div>" +
                                "<div class='col-sm-4'>" +
                                    "<h5>Column 5</h5>" +
                                "</div>" +
                                "<div class='col-sm-4'>" +
                                    "<h5>Column 9</h5>" +
                                "</div>" +
                                "</div>" +
                            "</div>" +
                        "</fieldset>" +
                        "</br>" +
                        "<div class='form-actions'>" +
                            "<a href='#' class='btn btn-primary save'>Save</a>" +
                            "<a href='#' class='btn delete'>Delete</a>" +
                        "</div>" +
                    "</form>" +
                "</div>" +
                "<div class='row status-bar'>" +
                    "<div class='col-sm-12'>" +
                        "<div class='alert alert-success' style='display: none'>" +
                            "<b>Success!</b> <%= entitySingular %> saved successfully" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>";
        var fieldControlGroup =
            "<div class='control-group'>" +
                "<label for='<%= fieldId %>' class='control-label'><%= fieldLabel %>:</label>" +
                "<div class='controls'>" +
                    "<input type='<%= fieldType %>' id='<%= fieldId %>' name='<%= fieldId %>' value='<%= fieldValue %>'/>" +
                    "<span class='help-inline'></span>" +
                "</div>" +
            "</div>";

        var test = {title:formTitle,entitySingular:entitySingular};

        // fieldArr = [//fieldType:text,number,email,date
        //     {fieldId: "f1",fieldLabel: "Name",fieldType: "text",fieldValue: "<%= name %>"},
        //     {fieldId: "f2",fieldLabel: "Age",fieldType: "number",fieldValue: "<%= age %>"},
        //     {fieldId: "f3",fieldLabel: "Occupation",fieldType: "text",fieldValue: "<%= occupation %>"}
        // ];

        
        var fieldControlGroupHtml0 = '';
        var compiledFieldControlGroup = _.template(fieldControlGroup);
        var fieldControlGroupJSON = null;
        _.each(fieldArr, function(el){//fills fieldControlGroupHtml0 with all the fields in fieldArr
            fieldControlGroupJSON = {fieldId: el.fieldId,fieldLabel: el.fieldLabel,fieldType: el.fieldType,fieldValue: el.fieldValue};
            fieldControlGroupHtml0 += compiledFieldControlGroup(fieldControlGroupJSON);
        });


        

        var compiledBase = _.template(base);
        var baseJSON = {title: test.title,controlGroupHtml: fieldControlGroupHtml0,entitySingular: test.entitySingular};
        var fullHtml = compiledBase(baseJSON);//title,controlGroupHtml,entitySingular

        //fullHtml has the final template with tags for the field names
        var funcToReturn = _.template(fullHtml);
        return funcToReturn;
    }
};