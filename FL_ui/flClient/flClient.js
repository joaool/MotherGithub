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
//sysParam 0:Entity, 1: Field, 2: Relation
//  [0]: Mandatory fields for insert 
//  [1]: Updatable fields
//  [2]: Special validation function ['fCN']: function(value){ if (value == good) return true; else return false;}
//


(function() {
    // privates

    var sysParam=[
        //entity
        [
            // mandatory fields for insert, with minimum count
            {'3':1, '4':1, 'E':1},
            // updatable -1 means forgot everything in the array
            {'3':0, '4':0, 'E':0},
            // default projection
            {'_id':1, '3':1, '4':1, 'E':1}  // also used in entity.js
        ],
        [
            // mandatory fields for insert, with minimum count
            {'1':1, '3':1, '4':1, 'K':1, 'M':1, '9':1},
            // updatable -1 means forgot everything in the array
            {'3':0, '4':0, 'K':0, 'M':0, 'N':-1, 'O':1, '9':0, 'P':0},  // optionsname has to be added here
            // default projection
            {'_id':1, '1':1, '3':1, '4':1, 'K':1, 'M':1, 'N':1, 'O':1, '9':1, 'P':1}  // also used in entity.js
        ],
        [
            // mandatory fields for insert, with minimum count
            {'00':1, 'U':2, 'V':2, 'W':2, 'Y':2, 'Z':2},
            // updatable -1 means forgot everything in the array
            {'00':1, 'U':0, 'V':2, 'W':2, 'X':2, 'Y':2, 'Z':2, '01':1, 'option':1},
            // default projection
            {'_id':1, '00.U':1, '00,Z':1, '00.V':1, '00.W':1, '00.Y':1, '01':1}  // also used in entity.js
        ]
    ];
    var axCall =function(protocol, srv, port, path, jsonData, callBack, trace){
        throw new Error("callAjax is not set");
    }
    var tabCodec=[{1: 'OK'}];
    var urlMainProt='http:';
    var urlMainSrv='62.210.97.101';
    //urlMainSrv='localhost';
    var urlMainPort =8123;

    var urlAbeProt;
    var urlAbeSrv;
    var urlAbePort;

    var flTraceClient=0;  // same values as flTools.trace
    var flTraceSession=-1;
    var flTraceServer=-1;  // same values as flTools.trace

    var strTraceTxt="";
    var bResetTraceTxt=true;
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
        // utility API
        flMain.prototype.pingMe = function (){
            return true;
        }
        flMain.prototype.getsId = function (){
            return axCall(null, null, null, 'getsId', { }, false, null, 0, null);
        }

        flMain.prototype.serverName = function (srvName){
            urlMainSrv=srvName;
        }
        function resetTraceValue(traceVal)
        {   if (traceVal <0)
                return -1;
            if (traceVal > 65535)
                return 65535;
            return traceVal;
        }
        flMain.prototype.setTraceClient = function (newTrace){
            flTraceClient = resetTraceValue(newTrace);
        }
        flMain.prototype.flushTraceClient = function (){
            bResetTraceTxt=true;
            return strTraceTxt;
        }
        flMain.prototype.setTraceServer = function (newTrace){
            flTraceServer = resetTraceValue(newTrace);
        }
        flMain.prototype.setTraceSession = function (newTrace){
            flTraceSession = resetTraceValue(newTrace);
        }
        // Login
        flMain.prototype.login = function(j, callBack){
            if (j.username == undefined || j.password == undefined){
                callBack('Bad parameter', null);
                return;
            }
            var superJ=j;
            function myCallBack(err, data){
                //console.log ('in fl.login.callback !');
                if (err)
                    return callBack(err, null);
         
                data.user=undefined;
                return callBack(null, data)
            }
            //console.log('going to '+urlMainSrv);
            sendCommand(1, 'fl/login', "-1", superJ, {}, myCallBack);
        }
        // User API
        flMain.prototype.getSessionInfo = function(callBack){
            if (!checkParam(callBack)){
                callBack('Bad parameter', null);
                return;
            }
            function myCallBack(err, data){
                data.u1 = urlAbeProt;
                data.u2 = urlAbeSrv;
                data.u3 = urlAbePort;
                data.u4= flTraceClient;
                return callBack(err, data);
            }
            sendCommand(1, 'session/get', null, { }, {}, myCallBack);
        }
        // User API
        flMain.prototype.setSessionInfo = function(jsonData, callBack){
            if (!checkParam(jsonData.data1, jsonData.data2, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            urlAbeProt = data.u1;
            urlAbeSrv = data.u2;
            urlAbePort = data.u3;
            flTraceClient = data.u4;

            sendCommand(1, 'session/set', null, jsonData, {}, callBack);
        }
 
        // User API
        flMain.prototype.userCreate = function(jsonData, callBack){
            if (!checkParam(jsonData.userName, jsonData.userPassWord, jsonData.adminName, jsonData.adminPassWord, jsonData.userType, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'userCreate', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/userCreate', "06", jsonData, {}, callBack);
        }
        flMain.prototype.userChangePassWord = function(jsonData, callBack){
            if (!checkParam(jsonData.userName, jsonData.userPassWord, jsonData.adminName, jsonData.adminPassWord, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'userChagePassWord', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/userChangePassWord', "06", jsonData, {}, callBack);
        }
        flMain.prototype.userChangeName = function(jsonData, callBack){
            if (!checkParam(jsonData.userName, jsonData.userPassWord, jsonData.newName, jsonData.newPassWord, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'userChangeName', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/userChangeName', "06", jsonData, {}, callBack);
        }
        flMain.prototype.userChangeType = function(jsonData, callBack){
            if (!checkParam(jsonData.userName, jsonData.userPassWord, jsonData.adminName, jsonData.adminPassWord, jsonData.userType, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'userChangeType', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/userChangeType', "06", jsonData, {}, callBack);
        }
        flMain.prototype.promoteAsClientAdmin = function(jsonData, callBack){
            if (!checkParam(jsonData.userName, jsonData.userPassWord, jsonData.adminName, jsonData.adminPassWord, jsonData.newClientName, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'promoteAsClientAdmin', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/promoteAsClientAdmin', "06", jsonData, {}, callBack);
        }
        flMain.prototype.userRemove = function(jsonData, callBack){
            if (!checkParam(jsonData.userName, jsonData.adminName, jsonData.adminPassWord, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'userRemove', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/userRemove', "06", jsonData, {}, callBack);
        }
        flMain.prototype.isUserExist = function(jsonData, callBack){
            if (!checkParam(jsonData.userName, jsonData.adminName, jsonData.adminPassWord, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'isUserExist', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/isUserExist', "06", jsonData, {}, callBack);
        }
        flMain.prototype.userGetList = function(jsonData, callBack){
            if (!checkParam(jsonData.adminName, jsonData.adminPassWord, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'userGetList', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/userGetList', "06", jsonData, {}, callBack);
        }
        //  CLIENT APIs
        flMain.prototype.clientCreate = function(jsonData, callBack){
            if (!checkParam(jsonData.clientName, jsonData.adminName, jsonData.adminPassWord, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'clientCreate', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/clientCreate', "06", jsonData, {}, callBack);
        }
        flMain.prototype.clientChangeName = function(jsonData, callBack){
            if (!checkParam(jsonData.clientName, json.newClientName, jsonData.adminName, jsonData.adminPassWord, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'clientChangeName', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/clientChangeName', "06", jsonData, {}, callBack);
        }
        flMain.prototype.clientRemove = function(jsonData, callBack){
            if (!checkParam(jsonData.clientName, jsonData.adminName, jsonData.adminPassWord, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'clientRemove', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/clientRemove', "06", jsonData, {}, callBack);
        }
        flMain.prototype.clientGetList = function(jsonData, callBack){
            if (!checkParam(jsonData.adminName, jsonData.adminPassWord, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'clientGetList', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/clientGetList', "06", jsonData, {}, callBack);
        }
        flMain.prototype.applicationFullCreate = function(jsonData, callBack){
            if (!checkParam(jsonData.adminName, jsonData.adminPassWord, callBack)){
                callBack('Bad parameter', null);
            }
            if (isFlagged(4))
                generateFunction('fa', 'applicationFullCreate', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/applicationFullCreate', "-1", jsonData, {}, callBack);
        }
        flMain.prototype.applicationFinalize = function(jsonData, callBack){
            if (!checkParam(jsonData.adminName, jsonData.adminPassWord, jsonData.userName, jsonData.clientName, jsonData.domainName, 
                  jsonData.newUserName, jsonData.newClientName, jsonData.newDescription, callBack)){
                callBack('Bad parameter', null);
            }
            if (isFlagged(4))
                generateFunction('fa', 'applicationfinalizeApp', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/applicationfinalizeApp', "-1", jsonData, {}, callBack);
        }
        flMain.prototype.applicationCreate = function(jsonData, callBack){
            if (!checkParam(jsonData.adminName, jsonData.adminPassWord, jsonData.domainPrefix, jsonData.description, 
                            callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fa', 'applicationCreate', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/applicationCreate', "-1", jsonData, {}, callBack);
        }
        flMain.prototype.applicationRemove = function(jsonData, callBack){
            if (!checkParam(jsonData.adminName, jsonData.adminPassWord, jsonData.domain, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fa', 'applicationRemove', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/applicationRemove', "-1", jsonData, {}, callBack);
        } 
        flMain.prototype.applicationGetNextDomainName = function(jsonData, callBack){
            if (!checkParam(jsonData.domainPrefix, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fl', 'applicationGetNextDomainName', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/applicationGetNextDomainName', "-1", jsonData, {}, callBack);
        }
        flMain.prototype.applicationGrantAccess = function(jsonData, callBack){
            //console.dir(jsonData);
            if (!checkParam(jsonData.domainName, jsonData.adminName, jsonData.adminPassWord, 
                            jsonData.userName, jsonData.accessLevel, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fa', 'applicationGrantAccess', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/applicationGrantAccess', "-1", jsonData, {}, callBack);
        }
        flMain.prototype.applicationChangeDomainName = function(jsonData, callBack){
            //console.dir(jsonData);
            if (!checkParam(jsonData.domainName, jsonData.adminName, jsonData.adminPassWord, 
                            jsonData.newDomainName, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fa', 'applicationChangeDomainName', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/applicationChangeDomainName', "-1", jsonData, {}, callBack);
        }
        flMain.prototype.applicationChangeDescription = function(jsonData, callBack){
            //console.dir(jsonData);
            if (!checkParam(jsonData.domainName, jsonData.adminName, jsonData.adminPassWord, 
                            jsonData.newDescription, callBack)){
                callBack('Bad parameter', null);
                return;
            }
            if (isFlagged(4))
                generateFunction('fa', 'applicationChangeDescription', undefined, JSON.stringify(jsonData));
            sendCommand(1, 'fl/applicationChangeDescription', "-1", jsonData, {}, callBack);
        }

    ///////////
    // appS
    //////////
        flMain.prototype.app = (function() {
            var app = function(){
            }
            app.prototype.logMessage = function (message, callback){
                var j={message: message};
                sendApiSrv("application/message", j, callback);
            }
            app.prototype.connect = function(j, callBack){
                //console.log("=> app.connect trace: " + flTraceClient);
                var self = this;
                if (checkParam(j.apiPort, j.apiServer, j.storeServer, j.storePort, j.dbName, j.secret, j.apiProtocol, callBack) == false)
                    return callBack('bad parameters', null);

                urlAbeProt=j.apiProtocol;
                urlAbeSrv= j.apiServer;
                urlAbePort=j.apiPort;
                //console.log("..." +"app.connect: url saved: " + urlAbeProt+'//' + urlAbeSrv+':' + urlAbePort);

                function appConnectCB (err, dataConnect){
                    tabCodec=[{'_id':'_id'}];
                    if (err){
                        //console.dir(err);
                        return callBack(err, null);
                    }
                    callBack(null, dataConnect);
                };
                sendApiSrv("application/connect", j, appConnectCB.bind(this));
            }
            app.prototype.init = function(initData, callBack){
                if (checkParam(callBack) == false)
                    return callBack('bad parameters', null);

                if (checkParam(initData, initData.application, initData.adminId, callBack) == false)
                    return callBack('bad parameters', null);
                sendApiSrv("flApp/zinit", initData, callBack);
            }
            app.prototype.grantAccess = function(grantData, callBack){
                if (checkParam(grantData.userId, grantData.accessLevel, callBack) == false)
                    return callBack('bad parameters', null);

                sendApiSrv("flApp/zrantAccess", grantData, callBack);
            }
            app.prototype.remove = function(removeData, callBack){
                if (checkParam(callBack) == false)
                    return callBack('bad parameters', null);

                if (checkParam(removeData, removeData.domain, removeData.hash, removeData.date, callBack) == false)
                    return callBack('bad parameters', null);
                sendApiSrv("flApp/zremove", removeData, callBack);
            }
            app.prototype.setMenuLevel = function(menuLevelData, callBack){
                if (checkParam(callBack) == false)
                    return callBack('bad parameters', null);

                if (checkParam(menuLevelData, menuLevelData['0D'], menuLevelData['0E'], callBack) == false)
                    return callBack('bad parameters', null);
                sendApiSrv("application/setmenulevel", menuLevelData, callBack);
            }
            app.prototype.setLoginRestriction = function(loginRestricData, callBack){
                if (checkParam(callBack) == false)
                    return callBack('bad parameters', null);

                if (checkParam(loginRestricData, loginRestricData['1'], loginRestricData['0D'], loginRestricData['0E'], callBack) == false)
                    return callBack('bad parameters', null);
                sendApiSrv("application/setloginrestriction", loginRestricData, callBack);
            }
            app.prototype.disconnect = function(callBack){
                if(strTraceTxt.length >0)
                    console.log(strTraceTxt);
                strTraceTxt="";
                ////console.log("=> app.connect");
                if (checkParam(callBack) == false)
                    return callBack('bad parameters', null);

                sendApiSrv("application/disconnect", { }, callBack);
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
                sendCommand(2, 'data/insert', eCN, d, {}, callBack);
            }
            data.prototype.findOne = function(eCN, options, callBack){
                if (checkParamOnly(options.query, "StopHere") == false)
                    throw new Error ("Invalid parameters");
                if (isFlagged(4))
                    generateFunction('fd', 'findOne', eCN, JSON.stringify(options));
                sendCommand(2, 'data/findOne', eCN, options, callBack);
            }
            data.prototype.findAll = function(eCN, options, callBack){
                if (checkParamOnly(options.query, "StopHere") == false)
                    throw new Error ("Invalid parameters");
                if (isFlagged(4))
                    generateFunction('fd', 'findAll', eCN, JSON.stringify(options));
                sendCommand(2, 'data/findAll', eCN, options, callBack);
            }
            data.prototype.update = function(eCN, options, callBack){
                if (checkParamOnly(options.update, options.query, "StopHere") == false)
                    throw new Error ("Invalid parameters");
                if (isFlagged(4))
                    generateFunction('fd', 'update', eCN, JSON.stringify(options));
                sendCommand(2, 'data/update', eCN, options, callBack);
            }
            data.prototype.findAndModify = function(eCN, options, callBack){
                if (checkParamOnly(options, "StopHere") == false)
                    throw new Error ("Invalid parameters");
                if (isFlagged(4))
                    generateFunction('fd', 'findAndModify', eCN, JSON.stringify(options));
                sendCommand(2, 'data/findandmodify', eCN, options, callBack);
            }
            data.prototype.remove = function(eCN, options, callBack){
                if (checkParamOnly(options.query, "StopHere") == false)
                    throw new Error ("Invalid parameters");
                if (isFlagged(4))
                    generateFunction('fd', 'remove', eCN, JSON.stringify(options));
                sendCommand(2, 'data/remove', eCN, options, callBack);
            }
            data.prototype.count = function(eCN, options, callBack){
                if (typeof options == 'function'){
                    callBack = options;
                    options={};
                }
                if (isFlagged(4))
                    generateFunction('fd', 'count', eCN, JSON.stringify(options));
                sendCommand(2, 'data/count', eCN, options, callBack);
            }
            return data;
        })();


        //////////
        // Entity
        //  Internal:
        //  { _id: eCN, "1":-1, "2":"E", "3": singulier, "4": description,
        //              "A":[{'B':'idxName', 'C':{fCN1:1, fCN2:-1}, 'D':[{'unique':true},..]}], 
        //              "E": pluriel, "F":[fCN1, fCN2,...], "H": 1.01, I: 0, 'J':0, 'T':1, "G": "50", I: 0 };
        //      "G","I" are only for Master_0
        //////////
        flMain.prototype.entity=(function(){
            var entity = function() {
            }
            // API going to the server
            // data=
            entity.prototype.add = function(data, callBack){
                if (miniFieldIncluded(0, data) == false)
                    return callBack("Invalid arguments", null);
                data['2']='E';
                if (isFlagged(4))
                        generateFunction('fEnt', 'add', null, JSON.stringify(data));                        
                sendCommand(2, 'data/insert', "0", {d: data}, { }, callBack);
            }
            entity.prototype.addWithFields = function(data, callBack){
                if (!checkEntityWithFields(data))
                    return callBack("Invalid arguments", null);
                if (isFlagged(4))
                    generateFunction('fEnt', 'addWithField', null, JSON.stringify(data));
                sendCommand(2, 'entity/addWithField', "0", { }, data, callBack);
            }
            // iNet should be like: {"query":{"_id":eCN}, projection:{}}
            entity.prototype.getOne = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'getOne', null, JSON.stringify(options));
                adjustSystemDico(options);
                if (options.projection == undefined)
                    options.projection = getDefaultProjection(0);
                sendCommand(2, 'data/findOne', "0", { }, options, callBack);
            }
            entity.prototype.getAll = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'getAll', null, JSON.stringify(options));
                adjustSystemDico(options);
                if (options.projection == undefined)
                    options.projection = getDefaultProjection(0);
                sendCommand(2, 'data/findAll', "0", { }, options, callBack);
            }
            entity.prototype.count = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'count', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/count', "0", { }, options, callBack);
            }
            entity.prototype.findandmodify = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                if (! updatableFieldOnly(0, options.update))
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'findandmodify', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/findandmodify', "0", { }, options, callBack);
            }
            entity.prototype.update = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                if (! updatableFieldOnly(0, options.update))
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'update', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/update', "0", { }, options, callBack);
            }
            entity.prototype.getAllWithField = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'E'}, "");
                if (isFlagged(4))
                    generateFunction('fEnt', 'getAllWithField', null, JSON.stringify(options));
                adjustSystemDico(options);
                if (options.projection == undefined)
                    options.projection = getDefaultProjection(0);
                sendCommand(2, 'entity/getAllWithField', "0", { }, options, callBack);
            }            
            /*
            entity.prototype.remove = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                if (isFlagged(4))
                    generateFunction('fEnt', 'remove', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/remove', "0", { }, options, callBack);
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

            field.prototype.add = function(data, callBack){
                if (!miniFieldIncluded(1, data))
                    return callBack("Invalid arguments", null);
                data['2']='F';
                if (isFlagged(4))
                    generateFunction('fField', 'add', null, JSON.stringify(data));
                sendCommand(2, 'data/insert', "0", {d: data}, { }, callBack);
            }
            // iNet should be like: {"query":{"_id":eCN}, projection:{}}
            field.prototype.getOne = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'getOne', null, JSON.stringify(options));
                adjustSystemDico(options);
                if (options.projection == undefined)
                    options.projection = getDefaultProjection(1);
                sendCommand(2, 'data/findOne', "0", { }, options, callBack);
            }
            field.prototype.getAll = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'getAll', null, JSON.stringify(options));
                adjustSystemDico(options);
                if (options.projection == undefined)
                    options.projection = getDefaultProjection(1);
                sendCommand(2, 'data/findAll', "0", { }, options, callBack);
            }
            field.prototype.update = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                if (! updatableFieldOnly(1, options.update))
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'update', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/update', "0", { }, options, callBack);
            }
            field.prototype.count = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'count', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/count', "0", { }, options, callBack);
            }
            field.prototype.findandmodify = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                if (! updatableFieldOnly(1, options.update))
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'findandmodify', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/findandmodify', "0", { }, options, callBack);
            }
            field.prototype.update = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                if (! updatableFieldOnly(1, options.update))
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'F'}, "");
                if (isFlagged(4))
                    generateFunction('fField', 'update', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/update', "0", { }, options, callBack);
            }

            /*
            field.prototype.remove = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'F'}, "");
                 if (isFlagged(4))
                    generateFunction('fField', 'remove', null, JSON.stringify(options));
                adjustSystemDico(options);
               sendCommand(2, 'data/remove', "0", { }, options, callBack);
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
            relation.prototype.add = function(data, callBack){
                //console.dir(data);
                if (!miniFieldIncluded(2, data))
                    return callBack("Invalid arguments", null);
                data['1']='-1';
                data['2']='R';
                if (isFlagged(4))
                    generateFunction('fRel', 'add', null, JSON.stringify(data));
                sendCommand(2, 'data/insert', "0", {d: data}, { }, callBack);
            }
            // iNet should be like: {"query":{"_id":eCN}, projection:{}}
            relation.prototype.getOne = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'getOne', null, JSON.stringify(options));
                adjustSystemDico(options);
                if (options.projection == undefined)
                    options.projection = getDefaultProjection(2);
                sendCommand(2, 'data/findOne', "0", { }, options, callBack);
            }
            relation.prototype.getAll = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'getAll', null, JSON.stringify(options));
                adjustSystemDico(options);
                if (options.projection == undefined)
                    options.projection = getDefaultProjection(2);
                sendCommand(2, 'data/findAll', "0", { }, options, callBack);
            }
            /*
            relation.prototype.update = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                if (! updatableFieldOnly(2, options.update))
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'update', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/update', "0", { }, options, callBack);
            }
            */
            relation.prototype.count = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'count', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/count', "0", { }, options, callBack);
            }
            /*
            relation.prototype.findandmodify = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    return callBack("Invalid arguments", null);
                if (! updatableFieldOnly(2, options.update))
                    return callBack("Invalid arguments", null);
                jsonConcat(options.query, {'2': 'R'}, "");
                if (isFlagged(4))
                    generateFunction('fRel', 'findandmodify', null, JSON.stringify(options));
                adjustSystemDico(options);
                sendCommand(2, 'data/findandmodify', "0", { }, options, callBack);
            }
            */

            /*
            relation.prototype.remove = function(options, callBack){
                if(checkParamOnly(options, options['query'], 'StopHere' ) == false)
                    throw new Error("Invalid arguments");
                jsonConcat(options.query, {'2': 'R'}, "");
                 if (isFlagged(4))
                    generateFunction('fRel', 'remove', null, JSON.stringify(options));
                adjustSystemDico(options);
               sendCommand(2, 'data/remove', "0", { }, options, callBack);
            }
            */

            return relation;
        })();
        //////////////////////
        /// mailChimp API
        //////////////////////
        flMain.prototype.mailChimp=(function(){
            var mailChimp = function() {
            }
            // API going to the server
            mailChimp.prototype.ping = function(data, callBack){
                //console.dir(data);
                if(typeof data == 'function')
                    {   callBack=data;
                        data=undefined;
                    }
                console.log("ping: callback type: "+ typeof callBack);
                sendCommand(2, 'mailchimp/ping', "0", data, { }, callBack);
            }
            // iNet should be like: {"query":{"_id":eCN}, projection:{}}
            mailChimp.prototype.campaignList = function(data, callBack){
                sendCommand(2, 'campaign/list', "0", data, { }, callBack);
            }
            mailChimp.prototype.campaignContent = function(data, callBack){
                sendCommand(2, 'campaign/content', "0", data, { }, callBack);
            }
            return mailChimp;
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

     function sendCommand( ){        // (noSrv, api, eCN, [data], [options], cb)
        //console.log("in sendCommand");
        //dumpArg(arguments, 'sendCommand');
        var cb;
        var j={};
        j.eCN=arguments[2];
        j.options={}
        j.data={};

        switch (arguments.length)
        {
            case 4:
                cb=arguments[3];
                break;
            case 5:
                j.options=arguments[3];
                cb=arguments[4];
                break;
            case 6:
                j.data=arguments[3];
                j.options=arguments[4];
                cb=arguments[5];
                break;
            default:
                throw new Exception('sendCommand: wrong number of arguments');
                break;
        }

        if(typeof cb != 'function'){
            dumpArg(arguments, 'sendCommand');
            throw new Error ("sendCommand: no callBack given " + arguments.length);
        }
        if(j.options != undefined){
            //if(j.options.nofix != true)
            prefixFields(j.options);
            delete j.options.noPrefix;
        }
        if(isFlagged(4)){
            dumpArg(arguments, 'sendCommand');
            //console.log(arguments[1] + ', ' + JSON.stringify(j) ) 
        }
        switch(arguments[0]) {
            case 1:
                sendMainSrv(arguments[1], j, cb);
                break;
            case 2:
                sendApiSrv(arguments[1], j, cb);
                break;
            default:
                throw new Error("sendCommand: invalid server No: " + argumants[0]);
                break;
        }
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
    function sendMainSrv (apiName, superJ, callBack){
        if(isFlagged(2) )
            console.log("   => " + apiName + ' : ' + JSON.stringify(superJ));

        function api2CallBack(err, data){
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
        axCall(urlMainProt, urlMainSrv, urlMainPort, '/api/' + apiName, superJ, false, api2CallBack, flTraceSession, flTraceServer);
    }
    function sendApiSrv (apiName, superJ, callBack){
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
        axCall(urlAbeProt, urlAbeSrv, urlAbePort, '/api/' + apiName, superJ, true, apiCallBack, flTraceSession, flTraceServer);
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
                else{
                    if (typeof js[idx] == 'object'){
                        prefixMe(str + '  ', js[idx], !(js[idx] instanceof Array));
                    }
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
    //
    function checkEntityWithFields(data){
        var entity=JSON.parse(JSON.stringify(data));
        delete entity.fields;
        if(!miniFieldIncluded(0, entity)){
            //console.log('miniField ent failed');
            return false;
        }
        console.log('miniField ent ok');
        if(data.fields == undefined){
            //console.log('data.fields is null');
            return false;
        }
        for(fi =0; fi< data.fields.length; fi++){
            data.fields[fi]['1']='xx';
            if(!miniFieldIncluded(1, data.fields[fi])){
                //console.log('miniField fi ' + JSON.stringify(data.fields[fi]) + ' failed');
                return false;
            }
        }
        //console.log('check OK');
        return true;
    }
    ////////////////////////// integrity check for dictionary access ////////////////////////
    function miniFieldIncluded(ind, js)
    {
        var rslt={};
        JSON.stringify(js, function(k, v){
            if(rslt[k] == undefined)
                rslt[k]=1;
            else
                rslt[k]++;
            return v;
        });
        //console.dir(rslt);
        for(var k in sysParam[ind][0]){
            //console.log('  '+k +':'+ sysParam[ind][0][k] + ' <=> '+ rslt[k]);
            if (rslt[k] == undefined || sysParam[ind][0][k] > rslt[k]){
                //console.log("one arg missing");
                return false;
            }
        }
        //console.log("miniField: ok");
        return true;
    }

    function updatableFieldOnly(ind, js2)
    {
        var js=JSON.parse(JSON.stringify(js2));     // deep copy
        var rslt={};
        JSON.stringify(js, function(k, v){
            //console.log(JSON.stringify(k) +':'+ JSON.stringify(v)+' type ' + typeof v + ' Array? ' + (v instanceof Array) + ', sp: '+sysParam[ind][1][k]);
            if(k == "" | k[0] == '$' || (typeof v == 'object' && !(v instanceof Array)))
                return v;
            if(rslt[k] == undefined)
                rslt[k]=1.0;
            else
                rslt[k]=rslt[k]+1;

            if(sysParam[ind][1][k] == -1){
                //console.log (JSON.stringify(v)+ ' becomes ' +JSON.stringify([]));
                return [];
            }
            return v;
        })
        //console.dir(rslt);
        for(var k in rslt){
            //console.log(k +':'+ rslt[k] + ' == ' + sysParam[ind][1][k]);
            if(sysParam[ind][1][k]== undefined)
                return false;
        }
        return true;
    }
    function getDefaultProjection(ind)
    {
        return JSON.parse(JSON.stringify(sysParam[ind][2]));
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////    
    // Declaration for node and browser compatibility
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = flMain;
    else
        window.flMain = flMain;
})();
