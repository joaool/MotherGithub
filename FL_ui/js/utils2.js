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
    is_url: function(url) {
        // var re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        // var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
        // var re= /^[a-z](?:[-a-z0-9\+\.])*:(?:\/\/(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}!\$&'\(\)\*\+,;=:])*@)?(?:\[(?:(?:(?:[0-9a-f]{1,4}:){6}(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|::(?:[0-9a-f]{1,4}:){5}(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:[0-9a-f]{1,4}:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3})|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|v[0-9a-f]+[-a-z0-9\._~!\$&'\(\)\*\+,;=:]+)\]|(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\.(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}|(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}!\$&'\(\)\*\+,;=@])*)(?::[0-9]*)?(?:\/(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}!\$&'\(\)\*\+,;=:@]))*)*|\/(?:(?:(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}!\$&'\(\)\*\+,;=:@]))+)(?:\/(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}!\$&'\(\)\*\+,;=:@]))*)*)?|(?:(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}!\$&'\(\)\*\+,;=:@]))+)(?:\/(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}!\$&'\(\)\*\+,;=:@]))*)*|(?!(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}!\$&'\(\)\*\+,;=:@])))(?:\?(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}!\$&'\(\)\*\+,;=:@])|[\x{E000}-\x{F8FF}\x{F0000}-\x{FFFFD}|\x{100000}-\x{10FFFD}\/\?])*)?(?:\#(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~\x{A0}-\x{D7FF}\x{F900}-\x{FDCF}\x{FDF0}-\x{FFEF}\x{10000}-\x{1FFFD}\x{20000}-\x{2FFFD}\x{30000}-\x{3FFFD}\x{40000}-\x{4FFFD}\x{50000}-\x{5FFFD}\x{60000}-\x{6FFFD}\x{70000}-\x{7FFFD}\x{80000}-\x{8FFFD}\x{90000}-\x{9FFFD}\x{A0000}-\x{AFFFD}\x{B0000}-\x{BFFFD}\x{C0000}-\x{CFFFD}\x{D0000}-\x{DFFFD}\x{E1000}-\x{EFFFD}!\$&'\(\)\*\+,;=:@])|[\/\?])*)?$/i;
        // var re = /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;
        var re =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
        return re.test(url);
    },
    is_phone: function(phone) {//validates numbers without format
        //format NANP North American Numbering Plan is (123) 456-7890 or 123-456-7890 -  three-digit area code, a three-digit central office code, and a four-digit station number
        //    in NANP the format is NXX NXX XXXX where N is [2-9] and X is [0-9]
        // E164 is an unambiguous, internationally recognized standard for telephone numbers 
        //      A telephone number can have a maximum of 15 digits
        //      The first part of the telephone number is the country code
        //      The second part is the national destination code (NDC)
        //      The last part is the subscriber number (SN)
        //      The NDC and SN together are collectively called the national (significant) number
        // E164 It’s also commonly used for telephony based services such as SMS providers
        // The E.164 standard might be great for storage, but terrible for two things. 
        //      First, virtually no one would type or read out their number in that format. 
        //      Second, it’s hopeless in terms of its readability. 
        //  http://www.sitepoint.com/working-phone-numbers-javascript/
        //  http://jackocnr.com/intl-tel-input.html
        //  http://www.phoneformat.com/  (290K minified !!!)   for a number and a country retrieves Local, International, E164, Mobile dialing and is valid or not
        
        // var re = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
        //return re.test(phone);
        var is = false;
        if(phone.charAt(0)=="+")
            phone = phone.substr(1);
        var phoneObj=parsePhone(phone);//https://github.com/Gilshallem/phoneparser (68 Kb)
        if(phoneObj)
            is=true;
        return is;
    },
    typeOf: function(xVar) {//returns one of :  "number","string","boolean","object","array","null","undefined","date"
        //exemple of undefined: a variable declared but never defined -->var foo; alert(foo); //undefined.
        var xRet = typeof xVar;
        if(xRet == "object") {
            if (xVar instanceof Array)
                xRet="array";
            if (xVar instanceof Date)
                xRet="date";
            if (!xVar)
                xRet="null";
        // }else if(xRet == "string"){
        //     if(this.is_email(xVar))
        //         xRet="email";
        }
        return xRet;
    },
    typeUIOf: function(xVar) {//for string type returns one of the typeUI "email", "url", "phone"etc. If not string returns null
        // used in FL.grid   private function  is_ColumnOfSubtype(subtype,sampleArr)
        var subtype = null;
        var xtype = typeof xVar;
        if(xtype == "string") {
            if(this.is_email(xVar))
                subtype="email";
            else if(this.is_url(xVar))
                subtype="url";
            else if(this.is_phone(xVar))
                subtype="phone";
        }
        return subtype;
    },
    arrayToLower: function(list){
        return _.map(list,function(element,index){
            return(element.toLowerCase());
        });
    },
    createEntityFromCsvAnalisys: function(rows){//creates a dd entry from a set of rows
        var entityName = "unNamed";
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
    backGridColumnsExtractedFromDictionary: function(entityName){//prepares a columns object for backgrid
        //first column has a delete button, second a non editable  id then the others       
        var oEntity = FL.dd.getEntityBySingular(entityName);
        // alert("backGridColumnsExtractedFromDictionary ->"+JSON.stringify(oEntity.attributes));
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

        // http://amiliaapp.github.io/backgrid-select-filter/   - filter
        //https://bugcode.wordpress.com/2013/09/12/adding-action-function-as-a-listener-of-grid-using-backgrid/   - date
        //http://www.snip2code.com/Snippet/171272/backgrid-datetimepicker-cell-with-bootst date
        //http://backgridjs.com/ref/extensions/moment-cell.html - http://momentjs.com/docs/ - date
        //http://www.pythoneye.com/54_23092624/ image cell type
        //http://www.lostiemposcambian.com/blog/javascript/backgrid-componente-datagrid-para-backbone/ image
        //http://vimeo.com/32765088
        //http://handsontable.com/demo/backbone.html
        //http://amiliaapp.github.io/backgrid-object-cell/
        //https://github.com/DJCrossman/backgrid-subgrid-cell
        //http://blog.joshsoftware.com/2011/09/28/filter-js-client-side-search-filtering-using-json-and-jquery/
        //http://techwuppet.com/backgrid_poc_demo/ - resize columns, search
        //http://stackoverflow.com/questions/17940454/how-to-delete-select-all-and-select-row-in-backgrid-js
        var DeleteCell = Backgrid.Cell.extend({
            template: _.template($("#gridDelButton").html()),
            className: "backgridDelColumn",
            events: {
                "click": "deleteRow"
            },
            deleteRow: function (e) {
                e.preventDefault();
                // alert("we will remove "+this.model.get("id"));
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
        // var columns = [{name: "del", label: "Delete", cell: DeleteCell }];

        // var SelectAllHeaderCell = Backgrid.HeaderCell.extend({
        //     // Implement your "select all" logic here
        // });
        var columns = [{name: "del", label: "Delete", cell: DeleteCell },{name:"",cell:"select-row",headerCell: "select-all"}];
        //http://pastie.org/pastes/8312516
        var DialogButtonCell = Backgrid.Cell.extend({
            title: 'Title',
            allowCancel: true,
            cancelButtonType: 'danger',
            okButtonType: 'success',
            getDialog: function() {
              var dialogClass = this.dialogClass;
              var dialog = new dialogClass();
              return dialog;
            },
            onClick: function() {
              var dialog = this.getDialog();
              dialog.show();
            },
            onOk: function(e) {},
        });
        MyDatePickerCellEditor = Backgrid.InputCellEditor.extend({
            events:{},
            initialize:function(){
                //https://github.com/eternicode/bootstrap-datepicker - the code is in bootstrap-editable.js and css in bootstrap-editable.css
                //http://jsfiddle.net/qiruiwei/B4BzK/
                Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
                var input = this;
                var columnName = input.column.get("name");
                var currentDateValue = this.model.attributes[columnName];
                window.currentDateValue = currentDateValue;//terrible HACK !!!
                window.input = input;//terrible HACK !!!
                $(this.el).datepicker({
                    autoclose: true,
                    todayBtn: "linked",
                    format: "yyyy-M-dd",//the format that will be displayed after we select a date in calendar              
                    // onClose: function(newValue){
                    //     var command = new Backgrid.Command({});
                    //     input.model.set(input.column.get("name"), newValue);
                    //     input.model.trigger("backgrid:edited", input.model, input.column, command);
                    //     command = input = null;
                    //     // alert("On close MyDatePickerCellEditor");
                    //     this.render();
                    // }
                }).on('show', function(ev) {//necessary to convert 
                    console.log("show calendar !!!");
                    var z=  ev.target.value;
                    console.log("--->"+z);
                    // ev.target.value = window.currentDateValue;////terrible HACK !!!
                    var formatedValue = window.input.formatter.fromRaw(window.currentDateValue.toISOString());
                    ev.target.value = formatedValue;////terrible HACK !!!
                }).on('hide', function(ev) {
                    var formatedValue = ev.target.value;
                    var newDateValue = new Date(formatedValue);
                    //if only date is selected we will consider mid day
                    if( newDateValue.getHours() === 0 && newDateValue.getMinutes() === 0 && newDateValue.getSeconds() === 0 && newDateValue.getMilliseconds() === 0){
                        newDateValue.setHours(12);
                    }
                    input.model.set(input.column.get("name"),newDateValue);
                    console.log("hide calendar !!!");
                });
                // $(this.el).datepicker("setDate",new Date(2006, 11, 24));
                $(this.el).datepicker("setDate", currentDateValue);
                $(this.el).datepicker("update");
                // $('.datepicker').datepicker().on("changeDate", function(e){
                //     //# `e` here contains the extra attributes
                // });
                // $( ".datepicker prev icon-arrow-left" ).addClass( "glyphicon arrow-left" );

                console.log("datepicker initialize()");
                var z=32;
            },
        });
        DateCell =Backgrid.Extension.MomentCell.extend({
            //1) all cell contents will be text
            // 2) all cell contents will be exactly the (formatted) corresponding model attribute
            //http://stackoverflow.com/questions/18781358/how-do-i-add-a-datepicker-for-a-backgrid-cell       
            modelFormat: "YYYY/M/D",//"YYYY-MMM-DD" gives error
            // You can specify the locales of the model and display formats too
            // displayLang: "zh-tw",
            displayFormat: "YYYY-MMM-DD",
            editor: MyDatePickerCellEditor,
            render: function () {
                var dateValue = this.model.get(this.column.get("name"));
                if( dateValue === "" || dateValue == "Invalid Date"){//if it is a new line dateValue = "" =>the default is today
                    dateValue = new Date();
                }
                var formatedValue = this.formatter.fromRaw(dateValue.toISOString());
                console.log("render----->"+dateValue + " formated->"+formatedValue);
                this.$el.html(formatedValue);
                this.delegateEvents();
                return this;
            }
        });

        var BooleanCell = Backgrid.BooleanCell.extend({
            //http://stackoverflow.com/questions/28368744/avoid-clicking-twice-to-begin-editing-boolean-checkbox-cell-in-backgrid/28420049#28420049
            editor: Backgrid.BooleanCellEditor.extend({
                render: function () {
                    var model = this.model;
                    var columnName = this.column.get("name");
                    var val = this.formatter.fromRaw(model.get(columnName), model);

                    /*
                     * Toggle checked property since a click is what triggered enterEditMode
                    */
                    this.$el.prop("checked", !val);
                    model.set(columnName, !val);

                    return this;
                }
            })
        });
        var EmailCell = Backgrid.EmailCell.extend({
            className: "email-cell",
            render: function () {
                this.$el.empty();
                var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")));
                this.$el.append($("<a>", {
                    tabIndex: -1,
                    // href: "mailto:" + formattedValue,
                    title: formattedValue
                }).text(formattedValue));
                this.delegateEvents();
                return this;
            }
        });
        var DateTimeCell = Backgrid.Extension.MomentCell.extend({
            modelInUTC: true,
            modelFormat: "YYYY-MM-DDTHH:mm:ss.SSSZ",
            displayFormat: "MMMM Do YYYY, h:mm:ss a",
            displayInUTC: false
            // render: function() {
            //   Backgrid.Extension.MomentCell.prototype.render.call(this);
            //   this.$el.addClass('friendly-datetime-cell');
            //   return this;
            // },
          });

        // columns.push({name: "diag", label: "Dialog", cell: DialogButtonCell });
        // var MomentCell = Backgrid.Extension.MomentCell.extend({
        //     modelFormat: "YYYY/M/D",
        //     displayFormat: "YYYY-MMM-DD",
        // });
        // var oEntity = FL.dd.getEntity(entityName);
        _.each(arrOfColumns, function(element,index){
            console.log("utils2 backGridColumnsFromArray defaultEntityColumns *********************--->"+element.name);
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
            }else if(element.type=="string" && (element.typeUI=="email" || element.typeUI=="emailbox") ){
                column["label"] = element.label;
                column["cell"] = EmailCell;
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
                    column["cell"] = DateCell;//MyDatePickerCell;
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
    prepareColArrForClientSideFilter: function(backgridColumnsArr){
        var filterFieldsArr = [];
        _.each(backgridColumnsArr, function(element,index){
            if(index>2){//skips del, select-all and id columns
                filterFieldsArr.push(element.name);
            }
        });
        return filterFieldsArr;
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
                this.on('add',this.modelAdd,this);
            },
            modelUpdate: function(){
                // alert("CsvElement modelUpdate !!!! --->"+ this.get("id") + " _id="+ this.get("_id") + " nome="+this.get("nome"));
                // alert("CsvElement modelUpdate !!!! --->"+ JSON.stringify(this.toJSON()));
                csvSetCollection.sync("update",this);
            },
            modelAdd: function(){
                // alert("CsvElement modelUpdate !!!! --->"+ this.get("id") + " _id="+ this.get("_id") + " nome="+this.get("nome"));
                // alert("CsvElement modelAdd !!!! --->"+ JSON.stringify(this.toJSON()));
                console.log("mountGridInCsvStore CsvElement Add model id="+this.id+" marca="+this.attributes.marca+" _id="+this.attributes._id);

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
        csvSetCollection.fetch({remove:false,success: function(){
            console.log(" csvSetCollection.fetch ==========================================> success !!!");
        },error:function(){
            console.log(" csvSetCollection.fetch ==========================================> ERROR !!!");
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

        // ClientSideFilter performs a case-insensitive regular
        // expression search on the client side by OR-ing the keywords in
        // the search box together.
        //https://gist.github.com/martindrapeau/9812237
        var clientSideFilter = new Backgrid.Extension.ClientSideFilter({
          collection: csvPageableCollection,
          placeholder: "Search in any column",
          // The model fields to search for matches
          // fields: ['Name','birth date','email'],
          fields: utils.prepareColArrForClientSideFilter(columnsArr),
          // How long to wait after typing has stopped before searching can start
          wait: 150,
        });
        // $("#client-side-filter-example-result").prepend(clientSideFilter.render().el);

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
        csvPageableCollection.on('backgrid:selected', function(model, selected) {
            console.log("model--->"+model);
            // $(".backgrid").before("<p style='padding-top:30px;float:right;margin-right:800px'>abcde</p>");
        });

        $("#csvcontent").empty();
        $('#addGrid').off('click');
        $("#addGrid").click(function () {
            csvStore.addOneEmptyRow();
            var lastKeyInStore = csvStore.getNextId() - 1; //get the highest key in csvStore.csvRows
            var CsvElementModel = Backbone.Model.extend({});

            newRow = csvStore.csvRows[lastKeyInStore];
            var csvLine = new CsvElementModel(newRow);

            csvSetCollection.add(newRow);//grid without paginator - collection does not have a save method
            csvPageableCollection.getLastPage();//we force lastKeyInStorePage display !!! - remove this line if no paginator
            csvPageableCollection.add(newRow);//the new model was inserted in the collection <--- necessary for paginator - - remove this line if no paginator

            csvLine.sync("create",newRow);

            grid.insertRow(csvLine);
        });
        $("#_select").click(function () {
            //alert("selection !!!");
            // var selectedModels = pageableGrid.getSelectedModels();
            var selectedModels = grid.getSelectedModels();
                _.each(selectedModels, function (model) {
                model.destroy();
            });
        });    
        $("#_unSelect").click(function () {
            alert("Unselection !!!");
            grid.clearSelectedModels();
        });
        // $(clientSideFilter.el).css({float: "right", margin: "20px"});
        // $('<p style="padding-top:30px;float:right;margin-right:800px">abc</p>').insertBefore(".backgrid");
        // $(".backgrid").before("<p style='padding-top:30px;float:right;margin-right:800px'>abcde</p>");
        // $("#_select").insertBefore($(".backgrid"));

        $("#grid").prepend(clientSideFilter.render().el);
        $("#grid").append(grid.render().$el);
        $(".backgrid").before("<p style='padding-top:30px;float:right;margin-right:800px'>abcde</p>");
        // $("#csvcontent").append(grid.render().el);
        $("#paginator").append(paginator.render().$el);
        csvPageableCollection.fetch();
    },
    buildMasterDetailStructureFromAttributesArr: function(attributesArr){
        var items = [];
        var detailLine = null;
        _.each(attributesArr, function(element,index){
            var userType = FL.dd.userType(element);
            detailLine = {
                attribute:element.name, 
                description:element.description, 
                statement: "The " + element.name + " of entity is...",
                userType:userType
            };
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