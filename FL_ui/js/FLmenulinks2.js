// jQuery(document).ready(function($){
/**
 * data dictionary UI methods
 */
    // FL = FL || {}; //gives undefined if FL is undefined
    // FL = {};
    // // a="A";
    // b="B";
    // var a = (typeof a === 'undefined') ? b : a;//if a is defined returns "A" otherwise returns the content of b
    // alert("zzz="+a);//sets "B"


FL = (typeof FL === 'undefined') ? {} : FL;
FL["links"] = (function () {//name space FL.dd
    var internalTest = function (x) { //returns a 2 bytes string from number
        FL.common.printToConsole("FLmenulinks2.js internalTest -->" + x);
    };
    var XgetMailchimpHTML = function (cId) {
        var def = $.Deferred();
        var arr = null;
        var fl = FL.fl;
        if (fl) {
            var mc = new fl.mailChimp();
            mc.campaignContent({cid: cId}, function (err, data) {
                if (!err) {
                    FL.common.printToConsole("campaignlist returns no error data=" + JSON.stringify(data.html));
                    def.resolve(data.html);
                } else {
                    return def.reject("FLmenulink2.js getMailchimpHTML - ERROR:" + err);
                }
            });
        } else {
            return def.reject("FLmenulink2.js getMailchimpHTML ->ERROR: token is empty");
        }
        return def.promise();
    };
    var XconvertsToArrOfObj = function (templateOptionsArr) {
        //receives [{"_id": "t 115",jsonTemplate:"dfdfdg"},{"_id": "t 116",jsonTemplate:"dfgd"}] and returns [{value:1,text: "t 115",template:"dfdfdg"},{value:2,text: "t 116",template:"dfgd"}]
        return _.map(templateOptionsArr, function (el, index) {
            return {"value": index + 1, "text": el._id, "template": el.jsonTemplate};
        });
    };
    var mountTemplate = function (jsonObj, header, body, footer) {
        window.templateCounter = 0;
        appendTemplate(jsonObj.templateItems.header, header);
        appendTemplate(jsonObj.templateItems.body, body);
        appendTemplate(jsonObj.templateItems.footer, footer);
    };
    var tt = function () {
        FL.common.printToConsole("tt");
    };

    var set3ButtonsAndGrid = function (entityName) {//displays addGrid, delete and editGrid buttons (with clicks prepared) and services to the right
        $('#_editGrid').off('click');
        $("#_editGrid").click(function () {
            editGrid(entityName);
        });
        $('#_newsletter').off('click');
        $("#_newsletter").click(function () {
            var templatePromise = FL.API.createTemplates_ifNotExisting();
            templatePromise.done(function () {
                prepareNewsletterEmission(entityName);
                return;
            });
            templatePromise.fail(function (err) {
                alert("FLmenulinks2.js set3ButtonsAndGrid ->FAILURE with createTemplates_ifNotExisting err=" + err);
                return;
            });
        });
        $('#_newsletterMC').off('click');
        $("#_newsletterMC").click(function () {
            prepareNewsletterMCEmission(entityName);
        });
        FL.common.clearSpaceBelowMenus();
        $("#addGrid").show();
        $("#addGrid").html(" Add Row");
        $("#_delete").show();
        $("#_editGrid").show();
        $("#_newsletter").show();
        $("#_newsletter").html(" Newsletter");
        $("#_newsletterMC").show();
        $("#_newsletterMC").html(" MC");

        // $("#_editGrid").html(" Edit Grid");
        FL.grid.displayDefaultGrid(entityName);
    };
    var DefaultGridWithNewsLetterAndEditButtons = function (entityName) {
        //A)shows add button, newsletter and grid edit buttons if an email field exist in entityName
        //  	checks if _histoMail_<ecn(entityName)> exists. If not creates it.
        //B)shows add button and grid edit buttons if no email field exist in entityName
        if (FL.dd.isHistoMailPeer(entityName)) {
            // var promiseUnblock = FL.API.checkServerCallBlocked()
            // .then(function(){
            // 	FL.grid.displayDefaultGrid(entityName);//loads from server and display buttons and Grid
            // 	return;
            // }, function(err){ alert("FL.links.DefaultGridWithNewsLetterAndEditButtons ERROR: Please try again " + err); } );
            FL.grid.displayDefaultGrid(entityName);//loads from server and display buttons and Grid
        } else {
            // alert("_histoMail for "+entityName+" does not exist! we need to create it");
            promise = FL.API.createTableHistoMails_ifNotExisting(entityName)
                .then(function () {
                    // this.setSync(FL.dd.histoMailPeer(entityName),true);
                    // set3ButtonsAndGrid(entityName);
                    FL.grid.displayDefaultGrid(entityName);//loads from server and display buttons and Grid
                    return;
                }
                , function (err) {
                    alert("FL.links.DefaultGridWithNewsLetterAndEditButtons ERROR: cannot create histoMail peer for " + entityName + " - " + err);
                    return;
                });
            // set3ButtonsAndGrid(entityName);//displays addGrid, newletter and editGrid buttons (with clicks prepared) and displays grid
        }
    };
    var DefaultGridWithNewsLetterAndEditButtonsByCN = function (eCN) {//TO BE COMPLETED
        //A)shows add button, newsletter and grid edit buttons if an email field exist in entityName
        //  	checks if _histoMail_<ecn(entityName)> exists. If not creates it.
        //B)shows add button and grid edit buttons if no email field exist in entityName
        var entityName = FL.dd.getEntityByCName(eCN);//to be removed	<----------------------------------- REMOVE LATER ON
        if (FL.dd.isHistoMailPeerByCN(eCN)) {
            // set3ButtonsAndGrid(entityName);//displays addGrid, newletter and editGrid buttons (with clicks prepared) and displays grid
            FL.grid.displayDefaultGrid(entityName);//loads from server and display buttons and Grid
        } else {
            // alert("_histoMail for "+entityName+" does not exist! we need to create it");
            promise = FL.API.createTableHistoMails_ifNotExisting(entityName)
                .then(function () {
                    // this.setSync(FL.dd.histoMailPeer(entityName),true);
                    // set3ButtonsAndGrid(entityName);
                    FL.grid.displayDefaultGrid(entityName);//loads from server and display buttons and Grid
                    return;
                }
                , function (err) {
                    alert("FL.links.DefaultGridWithNewsLetterAndEditButtons ERROR: cannot create histoMail peer for " + entityName + " - " + err);
                    return;
                });
            // set3ButtonsAndGrid(entityName);//displays addGrid, newletter and editGrid buttons (with clicks prepared) and displays grid
        }
    };
    return {
        abc: "abc",
        test: function (x) {//call with menu key "uri": "javascript:FL.links.test('JOJO')"
            internalTest(x);
            alert("Fl.link.test(x) x=" + x);
        },
        sendMessage: function () {
            var boxData = {
                master: {
                    toWhom: "to users of this database",
                    toWhom_options: [{value: 0, text: "to users of this database", op: "A"}, {
                        value: 1,
                        text: "to all FrameLink users",
                        op: "B"
                    }],
                    content: "",
                }
            };
            var boxOptions = {
                type: "primary",
                icon: "send",
                button1: "Cancel",
                button2: "Confirm message to send"
            };
            var sendMessageModal = new FL.modal.Box(" Send a message", "sendMessage", boxData, boxOptions, function (result, data) {
                if (result) {
                    //alert("sendMessageModal Master  " + JSON.stringify(data.master));
                    var msg = "Message from " + FL.login.token.userName + " : " + data.master.content;
                    FL.services.msgSend('my_channel',msg);
                    $("#_FL_totUsers").text(msg);
                }
            });
            sendMessageModal.show();
        },
        appSettings: function () {//call with menu key "uri": "javascript:FL.grid.createGrid()"
            var masterDetailItems = {
                master: {
                    radixpoint_options: FL.common.appsettings.radixpoint,
                    thousandsSeparator_options: FL.common.appsettings.thousandsSeparator,
                    decimals: FL.common.appsettings.decimals,
                    dateformat_options: FL.common.appsettings.dateformat,
                    currency_options: FL.common.appsettings.currency
                },
                detail: {} //format is array with {attribute:<attribute name>,description:<attr description>,statement;<phrase>}
            };
            var options = {
                type: "primary",
                icon: "book",
                button1: "Cancel",
                button2: "Change Settings",
                dropdown: {
                    "_editAppSettings_radixpoint_options": {
                        arr: [{value: 1, text: ". point (used in US)", op: "."}, {
                            value: 2,
                            text: ", comma (used in Europe)",
                            op: ","
                        }],
                        default: FL.common.appsettings.radixpoint,
                        onSelect: function (objSelected) {
                            $("#_editAppSettings_radixpoint").text(objSelected.op);
                            // FL.common.appsettings.radixpoint = objSelected.op;
                        }
                    },
                    "_editAppSettings_thousandsSeparator_options": {
                        arr: [{value: 1, text: ", comma (used in US)", op: ","}, {
                            value: 2,
                            text: ". point (used in Europe)",
                            op: "."
                        }, {value: 3, text: " space (used in France)", op: "space"}],
                        default: FL.common.appsettings.thousandsSeparator,
                        onSelect: function (objSelected) {
                            $("#_editAppSettings_thousandsSeparator").text(objSelected.op);
                            // FL.common.appsettings.radixpoint = objSelected.op;
                        }
                    },
                    "_editAppSettings_dateformat_options": {
                        arr: [{value: 1, text: "YMD (used in China)", op: "YMD"}, {
                            value: 2,
                            text: "MDY (used in US)",
                            op: "MDY"
                        }, {value: 3, text: "DMY (used in Europe)", op: "DMY"}],
                        default: FL.common.appsettings.dateformat,
                        onSelect: function (objSelected) {
                            $("#_editAppSettings_dateformat").text(objSelected.op);
                            // FL.common.appsettings.dateformat = objSelected.op;
                        }
                    },
                    "_editAppSettings_currency_options": {
                        arr: [{value: 1, text: "$ (Dollar)", op: "$"}, {value: 2, text: "€ (Euro)", op: "€"}, {
                            value: 3,
                            text: "£ (Pound)",
                            op: "£"
                        }, {value: 4, text: "Kr (Krona)", op: "Kr "},
                            {value: 5, text: "Kz (Kwanza)", op: "Kz "}, {
                                value: 6,
                                text: "MT (Metical)",
                                op: "MT "
                            }, {value: 7, text: "R$ (Real)", op: "R$ "},
                            {value: 8, text: "元 (Renmimbi)", op: "元"}, {
                                value: 9,
                                text: "₹ (Rupee)",
                                op: "₹"
                            }, {value: 10, text: "Rs (Rupee)", op: "Rs "},
                            {value: 11, text: "¥ (Yen)", op: "¥"}],
                        default: FL.common.appsettings.currency,
                        onSelect: function (objSelected) {
                            $("#_editAppSettings_currency").text(objSelected.op);
                            // FL.common.appsettings.currency = objSelected.op;
                        }
                    },
                }
            };
            // document.getElementById('_editAppSettings_dateformat').options[2].selected = true;
            FL.common.editMasterDetail("B", " Edit application settings", "_editAppSettingsTemplate", masterDetailItems, options, function (result) {
                if (result) {//user choosed create
                    var radixpoint = $("#_editAppSettings_radixpoint").text();
                    var thousandsSeparator = $("#_editAppSettings_thousandsSeparator").text();
                    var decimals = $("#_editAppSettings_decimals").val();
                    var dateformat = $("#_editAppSettings_dateformat").text();//comming from dropdown
                    var currency = $("#_editAppSettings_currency").text();
                    // alert("Title:"+entityName+"-->"+headerString);
                    if (thousandsSeparator === "")
                        FL.common.makeModalInfo("Empty information => no changes in application setting");
                    else {
                        radixpoint = radixpoint.trim();
                        thousandsSeparator = thousandsSeparator.trim();
                        FL.common.appsettings.radixpoint = radixpoint;
                        FL.common.appsettings.thousandsSeparator = thousandsSeparator.trim();
                        if (radixpoint == "." && thousandsSeparator == ".") //clash =>force distinction
                            FL.common.appsettings.thousandsSeparator = ",";
                        if (radixpoint == "," && thousandsSeparator == ",") //clash =>force distinction
                            FL.common.appsettings.thousandsSeparator = ".";
                        FL.common.appsettings.decimals = decimals;
                        FL.common.appsettings.dateformat = dateformat;
                        FL.common.appsettings.currency = currency;
                        // now we should save this to framelink database
                    }
                } else {
                    // alert("Create Grid canceled");
                    FL.common.makeModalInfo("No changes in application settings");
                }
            });
        },
        appSettingsForceButton: function () {
            // FL.common.setApplicationSettingsFromSystem();
            var browserSettings = FL.common.getLocaleSettings();
            $("#_editAppSettings_radixpoint").text(browserSettings.radix);
            $("#_editAppSettings_thousandsSeparator").text(browserSettings.thousands);
            $("#_editAppSettings_decimals").val(2);
            $("#_editAppSettings_dateformat").text(browserSettings.ymdFormat);
            $("#_editAppSettings_currency").text(browserSettings.currency);
        },
        pageEditor: function (xPage) {//call with menu key "uri": "javascript:FL.links.pageEditor('home')"
            var loginStr = localStorage.login;// Retrieve format {email:x1,password:x3,domain:x4};
            if (loginStr.length === 0) {
                alert("Fl.link.pageEditor no login in storage !. PLEASE CONNECT TO THE DATABASE ");
                return;
            }
            var API_key = FL.API.generateAPI_key(JSON.parse(loginStr));
            var style = localStorage.style;
            var font = localStorage.fontFamily;
            var child = window.open("./page_editor.html?API_key=" + API_key + "#page=" + xPage + "#style=" + style + "#font=" + font, 'theWindow');
            if (window.focus) {
                child.focus();
            }
            var timer = setInterval(checkChild, 500);

            function checkChild() {
                if (child.closed) {// we need this to show the new home page
                    clearInterval(timer);
                    FL.login.home();
                } else {
                    // child.focus();
                }
            }
        },
        newsletterEditor: function () {//call with menu key "uri": "javascript:FL.links.newsletterEditor()"
            var connectionString = localStorage.login;// Retrieve format {email:x1,password:x3,domain:x4};
            if (connectionString.length === 0) {
                alert("Fl.link.newsletterEditor PLEASE CONNECT TO THE DATABASE ");
                return;
            }
            connectionString = FL.common.enc(connectionString, 1);
            var child = window.open("./newsletter_editor.html?connectionString=" + connectionString + "#", 'theWindow');
            // var child = window.open("./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font, "_blank");
            if (window.focus) {
                child.focus();
            }
            var timer = setInterval(checkChild, 500);

            function checkChild() {
                if (child.closed) {// we need this to show the new home page
                    // alert("FrameLink Page Editor was closed \nconnectionString="+connectionString);
                    clearInterval(timer);
                    //FL.login.home();
                } else {
                    // child.focus();
                }
            }
        },
        setDefaultGridByCN: function (eCN) {//called with menu key "uri": "javascript:FL.links.setDefaultGridByCN('55')"
            var entityName = FL.dd.getEntityByCName(eCN);

            if (entityName == "_unNamed") {
                FL.dd.updateEntityByCName(eCN, {singular: "unNamed"});
                entityName = "unNamed";
            }
            // alert("entityName="+entityName+" eCN="+eCN+" synch="+FL.dd.isEntityInSync(entityName));

            if (entityName) {
                this.setDefaultGrid(entityName);
            } else {
                alert("FL.links.setDefaultGridByCN ERROR: EntityCompressedName=" + eCN + " does not exist !!!");
            }
        },
        setDefaultGridByCN2: function (eCN) {//called with menu key "uri": "javascript:FL.links.setDefaultGridByCN('55')"
            if (FL.dd.isEntityInLocalDictionaryByCN(eCN)) {
                if (FL.dd.isEntityByCNInSync(eCN)) {//eCN exists in local dictionary and is in sync
                    DefaultGridWithNewsLetterAndEditButtons(entityName);
                } else {//entityName exists but is not in sync - we force synchronization
                    alert("FL.links.setDefaultGrid - " + entityName + " not in sync we will syncronize local to backend.");
                    FL.API.syncLocalDictionaryToServer(entityName)
                        .then(function () {
                            DefaultGridWithNewsLetterAndEditButtons(entityName);
                            return;
                        }
                        , function (err) {
                            alert("FL.links.setDefaultGrid ERROR: cannot sync " + entityName + " to server!");
                            return;
                        });
                }
            } else {//entity is not in local dictionary =>we force an update of local dictionary with server dictionary data
                // FL.API.syncLocalDictionary()
                // 	.then(function(){DefaultGridWithNewsLetterAndEditButtons(entityName);return;}
                // 		,function(err){alert("FL.links.setDefaultGrid ERROR: cannot read back end Dictionary !"); return;});

                alert("FL.links.setDefaultGrid - cannot display grid. Entity -->" + entityName + "<-- does not exist in Local Data Dictionary.");
                return;
            }
        },
        setDefaultGrid: function (entityName) {//called with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
            // alert("setDefaultGrid"+entityName);
            // entityName = entityName.replace(/_/g," ");//if entityName as a space like "test contacts" it will be saved in menu as "test_contact"
            if (FL.dd.isEntityInLocalDictionary(entityName)) {
                if (FL.dd.isEntityInSync(entityName)) {//entityName exists in local dictionary and is in sync
                    DefaultGridWithNewsLetterAndEditButtons(entityName);
                } else {//entityName exists but is not in sync - we force synchronization
                    alert("FL.links.setDefaultGrid - " + entityName + " not in sync we will syncronize local to backend.");
                    FL.API.syncLocalDictionaryToServer(entityName)
                        .then(function () {
                            DefaultGridWithNewsLetterAndEditButtons(entityName);
                            return;
                        }
                        , function (err) {
                            alert("FL.links.setDefaultGrid ERROR: cannot sync " + entityName + " to server!");
                            return;
                        });
                }
            } else {//entity is not in local dictionary =>we force an update of local dictionary with server dictionary data
                // FL.API.syncLocalDictionary()
                // 	.then(function(){DefaultGridWithNewsLetterAndEditButtons(entityName);return;}
                // 		,function(err){alert("FL.links.setDefaultGrid ERROR: cannot read back end Dictionary !"); return;});

                alert("FL.links.setDefaultGrid - cannot display grid. Entity -->" + entityName + "<-- does not exist in Local Data Dictionary.");
                return;
            }
        },
        clearDictionary: function () {
            FL.common.printToConsole("------------------------- before clearing data dictionary -----------------------------");
            FL.dd.displayEntities();
            FL.common.printToConsole("------------------------- after clearing data dictionary -----------------------------");
            FL.dd.clear();
            FL.dd.displayEntities();
            FL.common.makeModalInfo("Local frameLink dictionary deleted. Synchronization with server failled.");

            // FL.server.syncLocalStoreToServer(function(err){
            // 	if(err){
            // 		FL.common.printToConsole("FL.server.clearDictionary() ERROR --> failled !");
            // 		FL.common.makeModalInfo("Local frameLink dictionary deleted. Synchronization with server failled.");
            // 	}else{
            // 		FL.dd.displayEntities();
            // 		FL.common.makeModalInfo("FrameLink dictionary was successfully deleted (client and server).");
            // 	}
            // });
        },
        userGrid: function () {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
            FL.common.makeModalInfo("To be implemented.");
        },
        userAdministration: function () {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
            FL.common.makeModalInfo("You are the sole user, for the time being.");
            // var message = "<p>You are the sole user, for the time being.</p><br>" +
            // 			  "<button type='submit' class='btn btn-primary' onclick='xFL.links.userGrid()'>Add users</button>'";
            // FL.common.makeModal("A","User Administration",message,{type:"primary", icon:"pencil",button1:"",button2:"Ok"},function(){
            // 	if(result){
            // 		alert("Yup");
            // 	}else{
            // 		alert("Nope");
            // 	}
            // });
        },
        editStylesAndFonts: function () {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
            FL.common.makeModalInfo("Edit styles and fonts to be implemented here. Meanwhile use the cog slide at left");
        },
        resetMenus: function () {//saves factory default menu in current user"
            // var lastMenuStr  = localStorage.storedMenu
            var oMenu = {
                "menu": [
                    {
                        "title": "User Administration",//0
                        "uri": "javascript:FL.links.userAdministration()"
                    }
                ]
            };
            localStorage.storedMenu = JSON.stringify(oMenu);
            FL.server.syncLocalStoreToServer();
            FL.menu.topicUpdateJsonMenu(oMenu);
        },
        getMandrillRejectListForSender: function (senderEmail) {//returns Madrill rejectList for sender=senderEmail
            if (!senderEmail)
                senderEmail = null;
            promise = FL.API.mandrillRejectListForSender(senderEmail);
            // promise = FL.API.mandrillRejectListForSender('jessica.costa@weadvice.pt');
            promise.done(function (data) {
                FL.common.printToConsole(">>>>> FL.links.getMandrillRejectListForSender() SUCCESS <<<<< list returned!");
                // alert("getMandrillRejectListForSender:"+JSON.stringify(data));
                FL.common.clearSpaceBelowMenus();
                $("#_placeHolder").show();
                $("#_placeHolder").append('<h2 style="margin-left: 30px">Rejected Email List for sender ' + senderEmail + ' </h2>');
                $("#_placeHolder").append('<dl style="margin-left: 30px"></dl>');
                _.each(data, function (element) {
                    $("#_placeHolder dl").append('<dt><span class="tab" >' + element.email + ' - rejected by ' + element.reason + '</span></dt><dd style="margin-left: 30px">' + element.detail + '</dd>');
                });
                return;
            });
            promise.fail(function (err) {
                FL.common.printToConsole(">>>>> FL.links.getMandrillRejectListForSender() FAILURE returning list<<<<<" + err);
                return def.reject(err);
            });
        },
        setMandrillDeleteFromReject: function (arrayOfEmails) {//delete Emails from  Madrill rejectList
            promise = FL.API.mandrillDeleteFromReject(arrayOfEmails);
            promise.done(function (data) {
                FL.common.printToConsole(">>>>> FL.links.setMandrillDeleteFromReject() SUCCESS <<<<< list returned!");
                alert("setMandrillDeleteFromReject:" + JSON.stringify(data));
                return;
            });
            promise.fail(function (err) {
                FL.common.printToConsole(">>>>> FL.links.getMandrillRejectListForSender() FAILURE returning list<<<<<" + err);
                return def.reject(err);
            });

        },
        displayStatistics: function () {//show all user statistics in mandrill
            var user = "test";
            promise = FL.emailServices.mandrillStats();
            promise.done(function (data) {
                FL.common.printToConsole(">>>>> FL.links.displayStatistics() SUCCESS <<<<< list returned!");
                // alert("FL.links.displayStatistics():"+JSON.stringify(data));
                FL.common.clearSpaceBelowMenus();
                $("#_placeHolder").show();
                $("#_placeHolder").append('<h2 style="margin-left: 30px">email statistics per user ' + user + ' </h2>');
                $("#_placeHolder").append('<dl style="margin-left: 30px"></dl>');
                _.each(data, function (element) {
                    $("#_placeHolder dl").append('<dt><span class="tab" >' + element.address + ' - created at ' + element.created_at + '</span></dt>' +
                        '<dd style="margin-left: 30px"> Sent         :' + element.sent + '</dd>' +
                        '<dd style="margin-left: 30px"> Hard-bounces :' + element.hard_bounces + '</dd>' +
                        '<dd style="margin-left: 30px"> Soft-bounces :' + element.soft_bounces + '</dd>' +
                        '<dd style="margin-left: 30px"> Rejects      :' + element.rejects + '</dd>' +
                        '<dd style="margin-left: 30px"> Complaints    :' + element.complaints + '</dd>' +
                        '<dd style="margin-left: 30px"> Unsubs       :' + element.unsubs + '</dd>' +
                        '<dd style="margin-left: 30px"> Opens        :' + element.opens + '</dd>' +
                        '<dd style="margin-left: 30px"> Clicks       :' + element.clicks + '</dd>' +
                        '<dd style="margin-left: 30px"> Unique-opens :' + element.unique_opens + '</dd>' +
                        '<dd style="margin-left: 30px"> Unique-clicks:' + element.unique_clicks + '</dd>'
                    );
                });
                return;
            });
            promise.fail(function (err) {
                FL.common.printToConsole(">>>>> FL.links.getMandrillRejectListForSender() FAILURE returning list<<<<<" + err);
                return def.reject(err);
            });

        }
    };
})();
// });