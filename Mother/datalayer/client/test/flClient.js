/*
    FrameLink client library

Documentation
    Implement frameLink API for client application
    this version supports only async calls

    The lib can be traced. it use the FLTRACE env. variable, as fltools.js
    you can also call flMain.changeTraceLevel(newTrace) to control the tracing
    for a specific (set of) call.
    specific client tracing:
        traceFlag=128 => dump args
        traceFlag= 2 => Trace API call, returns form the server
        traceFlag= 32 => Trace network traffic. use with a pipe to bunyan
        the trace is sent to the console, and to a log file (../log/<apps name>.log)
            you can format the display of the log file with bunyan with the command:
                bunyan file.log

version 0.9 : Nicolas Cuvillier
    - first alpha release

TODO

*/

(function() {
    // privates
    var axCall =function(protocol, srv, port, path, jsonData, callBack, trace){
        throw new Error("callAjax is not set");
    }
    var tabCodec=[{1: 'OK'}];
    var urlMainProt='http:';
    var urlMainSrv='62.210.97.101';
    var urlMainPort =8124;

    var urlAbeProt;
    var urlAbeSrv;
    var urlAbePort;

    var flTraceClient=0;  // same values as flTools.trace
    var flTraceServer=0;  // same values as flTools.trace

    var strTraceTxt="";
    var bResetTraceTxt=true;
    var userName;
    //////////
    // flMain
    //////////
    var flMain = (function() {
        flTraceClient=0;

        var flMain = function(ax) {
            if (typeof callAjax == 'function'){
                //console.log("Using global callAjax");
                axCall = callAjax;
            }
            else{
                if (typeof ax == 'function'){
                    //console.log("Installing specific callAjax");
                    axCall = ax;
                }
                else
                    throw new Error("flMain: bad argument-callAjax is not defined");
            }
        }

        flMain.prototype.pingMe = function (){
            return true;
        }
        flMain.prototype.serverName = function (srvName){
            urlMainSrv=srvName;
        }
        flMain.prototype.setTraceClient = function (newTrace){
            flTraceClient = newTrace;
        }
        flMain.prototype.flushTraceClient = function (){
            bResetTraceTxt=true;
            return strTraceTxt;
        }

        flMain.prototype.setTraceServer = function (newTrace){
            flTraceServer = newTrace;
        }
        flMain.prototype.logMessage = function (message){
            axCall(urlMainProt, urlMainSrv, urlMainPort, "/fl/login", superJ, false, myCallBack, flTraceServer);
        }

        flMain.prototype.login = function(j, callBack){
            if (j.username == undefined || j.password == undefined){
                callBack('Bad parameter', null);
                return;
            }
            var superJ=j;
            function myCallBack(err, data){
                ////console.log ('in fl.login.callback !');
                if (err)
                    return callBack(err, null);
         
                userName = data.user;
                //console.log("fl.login: saving userName: " + userName);
                data.user=undefined;
                return callBack(null, data)
            }
            axCall(urlMainProt, urlMainSrv, urlMainPort, "/fl/login", superJ, false, myCallBack, flTraceServer);
        }        

    //////////
    // appS
    //////////
        flMain.prototype.app = (function() {
            var app = function(){
            }
            app.prototype.connect = function(j, callBack){
                //console.log("=> app.connect trace: " + flTraceClient);
                var self = this;
                if (checkParam(j.abe, j.abePort, j.store, j.storePort, j.db, j.secret, j.abeProtocol, callBack) == false)
                    return callBack('bad parameters', null);

                urlAbeProt=j.abeProtocol;
                urlAbeSrv= j.abe;
                urlAbePort=j.abePort;
                console.log("..." +"app.connect: url saved: " + urlAbeProt+'//' + urlAbeSrv+':' + urlAbePort);

                function appConnectCB (err, dataConnect){
                    tabCodec=[{'_id':'_id'}];
                    if (err){
                        console.dir(err);
                        return callBack(err, null);
                    }
                    callBack(null, dataConnect);
                };
                sendApi("application/connect", j, appConnectCB.bind(this));
            }
            app.prototype.init = function(callBack){
                if (checkParam(callBack) == false)
                    return callBack('bad parameters', null);

                sendApi("application/init", { }, callBack);
            }
            app.prototype.disconnect = function(callBack){
                if(strTraceTxt.length >0)
                    console.log(strTraceTxt);
                strTraceTxt="";
                ////console.log("=> app.connect");
                if (checkParam(callBack) == false)
                    return callBack('bad parameters', null);

                sendApi("application/disconnect", { }, callBack);
            }

            return app;
        })();
        //////////
        // data
        //////////
        flMain.prototype.data=(function(){
            var data = function() {
            }
            /*
            for all:
            options.noPrefix:true : do not prefix the compressed name

            for getxxx:
            options.query={-id: xyz} => query clause valid for mongo
            options.projection={field:0/1,... _id:0} : list of fields to return valid for mongo
            options.system=true: include system dictionary (for master_0 request)

            for getOne:
            options.relations {info:0/1/2, relations:[rel1, rel2]}

            for getAll:
            options.limit:xx => limit to xx documents
            options.sort {field:-1/1, field:-1/1,...}
            option.skip {s:yy} => skip yy first documents
            options.relations {info:0/1/2, relations:[rel1, rel2]}

            for count:
            options.skip: Number, The number of documents to skip for the count.  

            for update:
            ..:true update more than 1 document

            for find and update:
            options.options: {
                remove:true set to a true to remove the object before returning
                new:true set to true if you want to return the modified object rather than the original. Ignored for remove.
                upsert:true Atomically inserts the document if no documents matched.
            }
            */
            data.prototype.insert = function(eCN, d, callBack){
                if( (d.length == undefined && checkParamOnly(d.d, "StopHere") == false) || (d.length == 0)){
                    if (isFlagged(4))
                        console.log('// fd.insert("'+eCN+'", ' + JSON.stringify(d) + ');        // *** INVALID PARAMETERS ***');
                        throw new Error ("Invalid parameters");
                }
                if (isFlagged(4))
                    generateFunction('fd', 'insert', eCN, JSON.stringify(d));
                sendCommand('data/insert', eCN, d, {}, callBack);
            }
            data.prototype.findOne = function(eCN, options, callBack){
                if (checkParamOnly(options.query, "StopHere") == false)
                    throw new Error ("Invalid parameters");
                if (isFlagged(4))
                    generateFunction('fd', 'findOne', eCN, JSON.stringify(options));
                sendCommand('data/findOne', eCN, options, callBack);
            }
            data.prototype.findAll = function(eCN, options, callBack){
                if (checkParamOnly(options.query, "StopHere") == false)
                    throw new Error ("Invalid parameters");
                if (isFlagged(4))
                    generateFunction('fd', 'findAll', eCN, JSON.stringify(options));
                sendCommand('data/findAll', eCN, options, callBack);
            }
            data.prototype.update = function(eCN, options, callBack){
                if (checkParamOnly(options.update, options.query, "StopHere") == false)
                    throw new Error ("Invalid parameters");
                if (isFlagged(4))
                    generateFunction('fd', 'update', eCN, JSON.stringify(options));
                sendCommand('data/update', eCN, options, callBack);
            }
            data.prototype.findAndModify = function(eCN, options, callBack){
                if (checkParamOnly(options, "StopHere") == false)
                    throw new Error ("Invalid parameters");
                if (isFlagged(4))
                    generateFunction('fd', 'findAndModify', eCN, JSON.stringify(options));
                sendCommand('data/findandmodify', eCN, options, callBack);
            }
            data.prototype.remove = function(eCN, options, callBack){
                if (checkParamOnly(options.query, "StopHere") == false)
                    throw new Error ("Invalid parameters");
                if (isFlagged(4))
                    generateFunction('fd', 'remove', eCN, JSON.stringify(options));
                sendCommand('data/remove', eCN, options, callBack);
            }
            data.prototype.count = function(eCN, options, callBack){
                if (typeof options == 'function'){
                    callBack = options;
                    options={};
                }
                if (isFlagged(4))
                    generateFunction('fd', 'count', eCN, JSON.stringify(options));
                sendCommand('data/count', eCN, options, callBack);
            }
            return data;
        })();


        //////////
        // Entity
        //  Internal:
        //  { _id: eCN, "1": eCN, "2": ["E","S/U"], "3": singulier, "4": description,
        //              "A":[], "E": pluriel, "F":[], "G": "50", "H": 0, I: 0 };
        //      "G","I" are only for Master_0
        //////////
        flMain.prototype.entity=(function(){
            var entity = function() {
            }
            // API going to the server
            entity.prototype.add = function(data, options, callBack){
                if(checkParamOnly(data['3'], data['4'], data['E'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                data['2']='E';
                if(typeof(options == 'function'))
                {
                    callBack=options;
                    options=null;
                }
                if (isFlagged(4))
                {
                    if (options == undefined)
                        generateFunction('fEnt', 'add', null, JSON.stringify(data));
                    else
                        generateFunction('fEnt', 'add', null, JSON.stringify(data));                        
                }
                sendCommand('data/insert', "0", {d: data}, options, callBack);
            }
            // iNet should be like: {"query":{"_id":eCN}, projection:{}}
            entity.prototype.getOne = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'getOne', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/findOne', "0", { }, options, callBack);
            }
            entity.prototype.getAll = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'getAll', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/findAll', "0", { }, options, callBack);
            }
            entity.prototype.count = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'count', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/count', "0", { }, options, callBack);
            }
            entity.prototype.findandmodify = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                if(flTools.areKeysAllowed(['0','1','2','G','H'], options.update) == false)
                    throw new error("can't update those fields");
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'findandmodify', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/findandmodify', "0", { }, options, callBack);
            }
            entity.prototype.update = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                if(flTools.areKeysAllowed(['0','1','2','G','H'], options.update) == false)
                    throw new error("can't update those fields");
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'update', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/update', "0", { }, options, callBack);
            }
            /*
            entity.prototype.remove = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                if (isFlagged(4))
                    generateFunction('fEnt', 'remove', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/remove', "0", { }, options, callBack);
            }
            */
            return entity;
        })();
        //////////
        // Field
        //      Internal:
        //  { _id: fCN, "1": eCN, "2": "F", "3": name, "4": description,
        //              "K": textUI, "L": 'd.' + fCN, "M": type };
        //      full version:
        //  {"fieldCN":_id, entityCN:"1", "typeCN":"F", "name":"xxx", "description":"yyy", "typeUI":"zzz", "type":"xyxyxy"}
        //////////
        flMain.prototype.field=(function(){
            var field = function() {
            }

            field.prototype.add = function(data, options, callBack){
                if(checkParamOnly(data['1'], data['3'], data['4'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                data['2']='F';
                if(typeof(options == 'function'))
                {
                    callBack=options;
                    options=null;
                }
                if (isFlagged(4))
                    generateFunction('fField', 'add', null, JSON.stringify(data));
                sendCommand('data/insert', "0", {d: data}, options, callBack);
            }
            // iNet should be like: {"query":{"_id":eCN}, projection:{}}
            field.prototype.getOne = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'getOne', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/findOne', "0", { }, options, callBack);
            }
            field.prototype.getAll = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'getAll', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/findAll', "0", { }, options, callBack);
            }
            field.prototype.update = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'update', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/update', "0", { }, options, callBack);
            }
            field.prototype.count = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'count', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/count', "0", { }, options, callBack);
            }
            field.prototype.findandmodify = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                if(flTools.areKeysAllowed(['0','1','2','L'], options.update) == false)
                    throw new error("can't update those fields");
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'findandmodify', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/findandmodify', "0", { }, options, callBack);
            }
            field.prototype.update = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                if(flTools.areKeysAllowed(['0','1','2','L'], options.update) == false)
                    throw new error("can't update those fields");
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'update', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/update', "0", { }, options, callBack);
            }

            /*
            field.prototype.remove = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'F'}, "");
                 if (isFlagged(4))
                    generateFunction('fField', 'remove', null, JSON.stringify(options));
                adjustSystemDico(options);
               sendCommand('data/remove', "0", { }, options, callBack);
            }
            */
            return field;
        })();

////////////
        //////////
        // relation
        //      Internal:
        //  { _id: fCN, "1": eCN, "2": "F", "3": name, "4": description,
        //              "K": textUI, "L": 'd.' + fCN, "M": type };
        //      full version:
        //  {"relationCN":_id, entityCN:"1", "typeCN":"F", "name":"xxx", "description":"yyy", "typeUI":"zzz", "type":"xyxyxy"}
        //////////
        flMain.prototype.relation=(function(){
            var relation = function() {
            }
            // API going to the server
            relation.prototype.add = function(data, options, callBack){
                console.dir(data);
                if(checkParamOnly(data['3'], data['4'], data['00'], 
                    data['00'][0]['U'], data['00'][0]['V'],data['00'][0]['W'],data['00'][0]['X'],data['00'][0]['Y'],data['00'][0]['Z'],     
                    data['00'][1]['U'], data['00'][1]['V'],data['00'][1]['W'],data['00'][1]['X'],data['00'][1]['Y'],data['00'][1]['Z'],
                    'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                data['1']='-1';
                data['2']='R';
                if(typeof(options == 'function'))
                {
                    callBack=options;
                    options=null;
                }
                if (isFlagged(4))
                    generateFunction('fRel', 'add', null, JSON.stringify(data));
                sendCommand('data/insert', "0", {d: data}, options, callBack);
            }
            // iNet should be like: {"query":{"_id":eCN}, projection:{}}
            relation.prototype.getOne = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'getOne', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/findOne', "0", { }, options, callBack);
            }
            relation.prototype.getAll = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'getAll', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/findAll', "0", { }, options, callBack);
            }
            relation.prototype.update = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'update', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/update', "0", { }, options, callBack);
            }
            relation.prototype.count = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'count', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/count', "0", { }, options, callBack);
            }
            relation.prototype.findandmodify = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                if(flTools.areKeysAllowed(['0','1','2','L'], options.update) == false)
                    throw new error("can't update those relations");
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'findandmodify', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/findandmodify', "0", { }, options, callBack);
            }
            relation.prototype.update = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                if(flTools.areKeysAllowed(['0','1','2','L'], options.update) == false)
                    throw new error("can't update those relations");
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'update', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand('data/update', "0", { }, options, callBack);
            }

            /*
            relation.prototype.remove = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'R'}, "");
                 if (isFlagged(4))
                    generateFunction('fRel', 'remove', null, JSON.stringify(options));
                adjustSystemDico(options);
               sendCommand('data/remove', "0", { }, options, callBack);
            }
            */

            return relation;
        })();

        ///////////////////////
        // return our instance
        ///////////////////////
        return flMain;
    })();

    /////////////////////
    // Utility functions
    /////////////////////
    function generateFunction(flObj, fName, eCN, fParam)
    {
        if (bResetTraceTxt){
            strTraceTxt="";
            bResetTraceTxt=false;
        }
        strTraceTxt+='   function(callback){\n';
        if (eCN == undefined){
            strTraceTxt+="       console.log('" + flObj + "." + fName + "(" + fParam + ") ');\n";
            strTraceTxt+='       ' + flObj + '.' + fName + '(' + fParam + ', function(err, result){\n';
        }
        else{
            strTraceTxt+="       console.log('" + flObj + "." + fName + "(\"" + eCN +"\", " + fParam + ") ');\n";
            strTraceTxt+='       ' + flObj + '.' + fName + '("' + eCN + '", ' + fParam + ', function(err, result){\n';
        }

        strTraceTxt+='           if(err) console.log("** ERROR ** : " + JSON.stringify(err)); else console.log("    --> returns: " + JSON.stringify(result));\n';
        strTraceTxt+='           console.log(" "); callback(err);\n';
        strTraceTxt+='       })\n';
        strTraceTxt+='   },\n';
    }

     function sendCommand(){        // (api, eCN, [data], [options], cb)
        //console.log("in sendCommand");
        //dumpArg(arguments, 'sendCommand');
        var cb;
        var j={};
        j.eCN=arguments[1];
        j.options={}
        j.data={};

        switch (arguments.length)
        {
            case 3:
                cb=arguments[2];
                break;
            case 4:
                j.options=arguments[2];
                cb=arguments[3];
                break;
            case 5:
                j.data=arguments[2];
                j.options=arguments[3];
                cb=arguments[4];
                break;
            default:
                throw new Exception('missing arguments');
                break;
        }

        if(typeof cb != 'function'){
            dumpArg(arguments, 'sendCommand');
            throw new Error ("no callBack given "+arguments.length);
        }
        
        if(j.options != undefined){
            if(j.options.noPrefix != true)
                prefixFields(j.options);
            delete j.options.noPrefix;
        }
        if(isFlagged(4)){
            dumpArg(arguments, 'sendCommand');
            console.log(arguments[0] + ', ' + JSON.stringify(j) ) 
        }
        sendApi(arguments[0], j, cb);
    }

    function adjustSystemDico(options){
        if(options == undefined)
            options={};
        if(options.query == undefined)
            options.query={};
        if(options.noPrefix == true)
            throw new Error("impossible to use noPrefix:true in this call");
        if(options.options != undefined && options.options.system == true){
            ;
        }
        else {
            options.query=jsonConcat(options.query, {'J':{$ne: 0}}, "");
        }
        delete options.system;
    }

    function areKeysAllowed(forbidenKeys, js)
    {
        var forbidWithPrefix=[];
        for(var fk in forbidenKeys)
            forbidWithPrefix.push('d.'+forbidenKeys[fk]);
        //console.dir(forbidWithPrefix);
        for (ii in js)
        {
            if(typeof js[ii] == 'object')
                if(this.areKeysAllowed(forbidenKeys, js[ii]) == false)
                    return false;
            if (forbidenKeys.indexOf(ii) >= 0 || forbidWithPrefix.indexOf(ii) >= 0)
                return false;
        }
        return true;
    }
    function jsonConcat(o1, o2, prefix) {
     for (var key in o2) {
      //console.log ("key: " + prefix+key + " => " + 2[key]);
      o1[prefix+key] = o2[key];
     }
     return o1;
    }
    function sendApi (apiName, superJ, callBack){
        if(isFlagged(2) )
            console.log("   => " + apiName + ' : ' + JSON.stringify(superJ));

        function apiCallBack(err, data){
            //console.log ('<= ' + apiName + '-callBack data= ' + JSON.stringify(data) + ', err: ' + err);
            if (err){
                if(isFlagged(2) )
                        console.log("   <= " +apiName + '-callBack : ** ERROR ** : ' + err);
                return callBack(err, null);
            }
            if(isFlagged(2) )
                console.log("   <= " + apiName + " data: " + JSON.stringify(data));
            return callBack(null, data);
        }
        axCall(urlAbeProt, urlAbeSrv, urlAbePort, '/api/' + apiName, superJ, true, apiCallBack, flTraceServer);
    }
    function isFlagged(flg){
        if ((flg & flTraceClient) == flg)
            return true;
        return false;
    }
    function checkParam(allArguments){
        var args = arguments;
        //console.log("checkParam testing " + JSON.stringify(args));
        var callBack=undefined;
        for(var o in arguments){
            ////console.log(arguments[o]);
            if(typeof arguments[o] == "function"){
                callBack = arguments[o];
                //console.log("checkParam : callback found");
            }
        }

        if (callBack == undefined){
            console.log("... checkParam : **** NO CALLBACK GIVEN ***");
            return false;
        }
        return checkParamOnly(allArguments, "StopHere");
    }
    function checkParamOnly(){
        var ii = 0;
        for (var indArg in arguments){
            if (arguments[indArg] == undefined ){ //} && ii != 2){
                console.log("checkParam: at least one Parameter is missing, callBack with an error");
            dumpArg(arguments, 'checkParamOnly');

                return false;
            }
            ii++;
            if (arguments[indArg] == 'StopHere')
                return true;
        }
        //console.log("..." +"checkParam ok");
        return true;
    }
        function prefixMe(str, js, aFlg){
            for (var jsK in js){
                var idx=jsK;
                if(aFlg && idx != '_id' && idx.indexOf('$') != 0){
                    idx='d.'+jsK;
                    js[idx]=js[jsK];
                    delete js[jsK];
                }
                if (typeof js[idx] == 'object'){
                    prefixMe(str + '  ', js[idx], !(js[idx] instanceof Array));
                }
            }
        }
        function prefixFields(options){
            //console.log("before: " + JSON.stringify(options));
            if (options.query){
                prefixMe('  ', options.query, true);
            }
            if (options.projection){
                prefixMe('  ', options.projection, true);
            }
            if (options.sort){
                prefixMe('  ', options.sort, true);
            }
            if (options.update){
                prefixMe('  ', options.update, true);
            }

            //console.log("after all: " + JSON.stringify(options));
        }

        function dumpArg(args, functionName){
            var tmpStr=[];

            tmpStr.push(functionName+ " args(#" + args.length +'):');
            for (var ii =0; ii < args.length; ii++){
                tmpStr.push('   '+ii + ' type: ' + typeof args[ii] +' value: <' + JSON.stringify(args[ii]) +'>, typeof: ' + typeof args[ii]);
            }
            //console.log(tmpStr);
        }

    // Declaration for node and browser compatibility
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = flMain;
    else
        window.flMain = flMain;
})();
