/**
 * Common functions to all FL modules
 http://naveensnayak.wordpress.com/2013/06/26/dynamically-loading-css-and-js-files-using-jquery/
 http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
 */
var FL = FL || {};
Number.prototype.toFormattedString = function (decimals) {
    //converts a number into a string with a specific number of decimals with the radixpoint and thousandSeparator from appsettings
    // decimals - optional parameter - if specied defines the number of decimals in the formatted string
    //   ex: x=12345.67 =>x.toFormattedString() -->"12.245,67" with radixpoint="," and thousandSeparator="."
    //   ex: x=12345.668987 =>x.toFormattedString(2) -->"12.245,67" with radixpoint="," and thousandSeparator="."
    if (isNaN(this))
        return null;
    var radixpoint = FL.common.appsettings.radixpoint;
    var thousandsSeparator = FL.common.appsettings.thousandsSeparator;
    var num = this;
    if (decimals || decimals === 0)
        num = this.toFixed(decimals);
    var strNumber = num.toString();

    function format(num) {
        var n = num.toString(), p = n.indexOf('.');
        return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function ($0, i) {
            return p < 0 || i < p ? ($0 + ',') : $0;
        });
    }

    var intNum = Math.floor(num);
    var intStr = format(intNum);
    var tail = FL.common.getTail(strNumber, ".");
    if (thousandsSeparator == ".")
        intStr = intStr.replace(/,/g, '.');
    if (thousandsSeparator == "space")
        intStr = intStr.replace(/,/g, ' ');
    if (tail.length == 0)
        radixpoint = "";//to give a formated integer result
    var retStr = intStr + radixpoint + tail;
    return retStr;
};
String.prototype.pad = function (l, s, t) {
    // l -length amount of characters that the string must have
    // s - substring string that will be concatenated
    // t - type specifies the side where the concatenation will happen, where: 0 = left, 1 = right and 2 = both sides   
    return s || (s = " "), (l -= this.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
        + 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
    + this + s.substr(0, l - t) : this;
};
FL["common"] = (function () {//name space FL.common
    var loadCSS = function (fileCss) {
        var cssLink = $("<link rel='stylesheet' type='text/css' href='FL_ui/css/" + fileCss + "'>");
        //    <link href="../bootstrap/css/cerulean.css" rel="stylesheet">
        $("head").append(cssLink);
        // $('#_css').editable("activate");
    };
    var fillMasterForTemplate = function (templateName, masterJson) {
        // returns masterJson with new values retrieved from the template for ids corresponding to the keys in masterJson
        //ex: if templateName="_A" and masterJson={entityName:"client",entityDescription:"someone we may invoice"}
        //      and if id="_A_entityName" has "xclient" and  id="_A_entityDescription" has "xsomeone we may invoice" 
        //		returns {entityName:"xclient",entityDescription:"xsomeone we may invoice"}
        //  
        // the same as:
        //		var singular = $("#_dictEditEntityTemplate_entityName").val();
        //		var description = $("#_dictEditEntityTemplate_entityDescription").val();
        _.each(masterJson, function (value, key) {
            var domTarget = "#" + templateName + "_" + key;
            var newValue = $(domTarget).val();
            if (domTarget.substr(domTarget.length - 8) == "_options") {//extract from a dropdown
                var pos = domTarget.lastIndexOf("_options");
                var domTarget2 = domTarget.substring(0, pos);
                newValue = $(domTarget2).text();
            }
            masterJson[key] = newValue;
        });
    };
    var getValueForAnyTag = function (id) {
        //ex of id = "#_dictEditEntityTemplate__f1_attribute" - DO NOT FORGET THE #
        var value = $(id).val();//this works for input tags and textarea tags. Not for td or a tags
        var tag = $(id).prop("tagName");
        if (tag == "A") {
            value = $(id).text();
        } else if (tag == "TD") {
            value = $(id).text();
        }
        return value;
    };
    var fillDetailForTemplate = function (templateName, detailJson) {
        // returns the array detailJson with new values retrieved from the lines in the detailled section of template
        // equivalent to (example for line 1...similar for all other lines)
        //		var field1attr =  $("#_dictEditEntityTemplate__f1_attribute").val();
        //		var field1descr = $("#_dictEditEntityTemplate__f1_description").val();
        //		var field1stat = $("#_dictEditEntityTemplate__f1_statement").text();
        _.each(detailJson, function (element, index) {
            _.each(element, function (value, key) {
                var domTarget = "#" + templateName + "__f" + (index + 1) + "_" + key;
                var newValue = getValueForAnyTag(domTarget);
                // var newValue = $(domTarget).val();//this works for input tags and textarea tags. Not for td or a tags
                element[key] = newValue;
            });
            detailJson[index] = element;
        });
    };
    var setDropdown = function (options) {
        //fills the content of a dropdown box in DOM with id=options.boxId with array=options.boxArr presenting options.boxCurrent as default
        // This method updates onscreen the visible dropdown default, and silently updates the dropdown options
        //example options = {boxId: "_getLookupTableAndField2_field_options", boxCurrent: "zzz", boxArr: lookupFieldOptionsObj}
        var $dropDownSelect = $("#" + options.boxId);
        var defaultValue = options.boxCurrent;
        var optionsArr = options.boxArr;
        $dropDownSelect.parents('.btn-group').find('.dropdown-toggle').html(defaultValue + ' <span class="caret"></span>');//shows current value
        $dropDownSelect.empty();//removes the child elements of #styleSet.
        _.each(optionsArr, function (element) {
            var id = options.boxId + "_" + element.text;
            $dropDownSelect.append("<li id='" + id + "'><a href='#'>" + element.text + "</a></li>");
        });
    };
    var selectBox = function (options, onSelection) {
        //fills the content of dropdown box with id=options.boxId with array=options.boxArr presenting options.boxCurrent as default
        //example: selectBox({boxId:"styleSet", boxCurrent:currentStyle, boxArr:stylesForSelection}, function(selected){
        //             //code with what to do on selection
        //             alert(selected); //selected is the selected object element 
        //         });
        //	NOTE:boxArr is an array of JSON where "value" and "text" are mandatory keys. All other are optional
        // var stylesForSelection = [
        // 	{value: 0, text: 'cerulean'},
        // 	{value: 1, text: 'cosmos'},
        // 	{value: 2, text: 'readable'},
        // 	{value: 3, text: 'red'},
        // 	{value: 4, text: 'spacelab'}
        // ];
        // Drop box needs a format like:
        // <div class="btn-group">
        // 	<a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" style="font-size:14px;font-weight:bold;margin-right:-4.0em" href="#"> Style Set <span class="caret"></span></a>
        // 	<ul id="styleSet" class="dropdown-menu">
        // 		<li><a href="#">xxcerulean</a></li>
        // 		<li><a href="#">xxxcosmos</a></li>
        // 		....
        // 	</ul>
        // </div>
        //onSelection argument is the full object corresponding to the choosed option
        //   ex. 	{value: 1, text: 'cosmos'}

        //var $styleSet = $("#styleSet");

        //---------
        var $dropDownSelect = $("#" + options.boxId);
        $dropDownSelect.parents('.btn-group').find('.dropdown-toggle').html(options.boxCurrent + ' <span class="caret"></span>');//shows current value
        //... and we load the select box with the current available values
        $dropDownSelect.empty();//removes the child elements of #styleSet.
        //alert("the place to insert the alternate arr");
        _.each(options.boxArr, function (element) {
            var id = options.boxId + "_" + element.text;
            $dropDownSelect.append("<li id='" + id + "'><a href='#'>" + element.text + "</a></li>");
        });
        //-----------------
        //setDropdown(options); //this does not work !!! why ???
        //--------------------
        // $("#styleSet li a").click(function(){
        $("#" + options.boxId + " li a").click(function () {
            var detailLine = -1; //assumes master
            var detailLineStr = FL.common.stringAfterLast(options.boxId, "__f");//"_dictEditEntityTemplate__f4_userType_options"
            if (detailLineStr) {
                detailLineStr = FL.common.stringBeforeFirst(detailLineStr, "_");//"4_userType_options" =>"4"
                detailLine = parseInt(detailLineStr, 10) - 1;//to convert to base 0
            }
            var selText = $(this).text();
            var list = $("#" + options.boxId + " li a");
            var index = list.index(this);

            var elObj = options.boxArr[index]; //exchanged by test


            $dropDownSelect.parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
            // onSelection(selText);//runs the callback function
            onSelection(elObj, detailLine);//runs the callback function with the element object as argument and the detail line (-1 =>master)
        });
    };
    var loadAllDropdownsPreparingOnSelectCall = function (optionsDropdown, templateName) {
        _.each(optionsDropdown, function (value, key) {
            if (value.default && value.arr && value.onSelect) {
                //    fieldName = s2;
                //var fieldName = extractFieldNameFromKey(key);
                //if (fieldName) {
                //    var buffer = FL.common.generalParametersObj["_" + fieldName];
                //    if (buffer)
                //        optionsArr = FL.common.generalParametersObj["_" + fieldName].alternativeOptions;
                //}
                var optionsArr = value.arr;
                //if (value.preField) {
                //    optionsArr = value.preField();
                //}
                selectBox({boxId: key, boxCurrent: value.default, boxArr: optionsArr}, value.onSelect);
            } else {
                alert("FLcommon2.js loadAllDropdownsPreparingOnSelectCall - Error dropdown definition missing - check default or arr or onselect");
            }
        })
    };
    var getDialogHTML = function (id, stackLevel, title, htmlIn, options) {
        //to work in IE and Firefox always enclose button inside a tag. not a tag inside button tag. - http://stackoverflow.com/questions/12856851/jquery-modal-window-only-working-on-chrome-but-not-ff-ie9
        // CORRECT - Button inside a ref
        //  <div class="btn-group" style="margin: 0 5px 0 0;">
        //     <a href="#?w=385" rel="login_popup" class="poplight" style="text-decoration:none;"><button type="button">Login</button></a>
        //  </div><!-- /btn-group --> 
        // INCORRECT - ref inside a button tag
        //  <div class="btn-group" style="margin: 0 5px 0 0;">
        //      <button class="btn btn-small btn-info" type="button"><a href="#?w=385" rel="login_popup" class="poplight" style="text-decoration:none;">Login</a></button>
        //  </div><!-- /btn-group --> 
        var modalId = "__FLmodalId_" + id;
        var zIndexContent = "";
        if (stackLevel > 1) zIndexContent = "z-Index:" + (1000 * stackLevel);//place a modal inside a modal
        var iconHTML = "";
        if (options.icon) iconHTML = '<i class="glyphicon glyphicon-' + options.icon + '"></i>';
        var button1HTML = "";
        if (options.button1) {
            button1HTML = '<a href="#" id="__FLDialog_button1" data-dismiss="modal" class="btn">' + options.button1 + '</a>';
        }
        var button2HTML = "";
        if (options.button2) { //this button has the parsley validate (like APPLE ->OK at right)
            button2HTML = '<a href="#" id="__FLDialog_button2" class="btn btn-' + options.type + ' validate">' + options.button2 + '</a>';
        }
        var before = '<div class="modal fade" id="' + modalId + '" style="' + zIndexContent + '">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header modal-header-' + options.type + '">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                // '<h3 style="color:white;" class="modal-title">' + title + '</h3>' +
                // '<h3 style="color:white;" class="modal-title"><i class="glyphicon glyphicon-thumbs-up"></i>' + title + '</h3>' +
            '<h3 style="color:white;" class="modal-title">' + iconHTML + title + '</h3>' +
            '</div>' +
            '<div class="modal-body">';
        var after = '</div>' +
            '<div class="modal-footer">' +
                // '<a href="#button1" id="__FLDialog_button1" data-dismiss="modal" class="btn">Close</a>' +
            button1HTML +
                // '<a href="#button2" id="__FLDialog_button2" class="btn btn-primary">Save changes</a>' +
            button2HTML +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        return before + htmlIn + after;
    };
    var extractFieldNameFromKey = function (key) {//extracts name before "_options" or before last "_ "if no "_options" exist. If none condition exists returns null
        //example extracts "table" from "_getLookupTableAndField2_table_options" or from "_getLookupTableAndField2_table"
        var fieldName = null;
        var s1 = FL.common.stringBeforeLast(key, "_options");//input ex _getLookupTableAndField2_table_options or  _getLookupTableAndField2_table
        var s2 = null;
        if (s1)//ex _getLookupTableAndField2_table_options became _getLookupTableAndField2_table
            s2 = FL.common.stringAfterLast(s1, "_");//output ex "table"  or null
        else //_getLookupTableAndField2_table
            s2 = FL.common.stringAfterLast(key, "_");//output ex "table" or null
        if (s2)
            fieldName = s2;
        return fieldName;
    };
    return {
        appsettings: {
            dateformat: "DMY",
            radixpoint: ".",
            thousandsSeparator: ",",//if separator is space - use "space" ->Number.toFormattedString() recognizes space=>" "
            decimals: 2,
            currency: "$"
            // currencies:{
            //     "USD":"$999999999/99", 
            //     "€":"€ 9999999999/99",
            //     "Brazilian Real":"R$ 999999999/99"
            // }
        },
        debug: true,//if it is false  no console log will be shown
        generalBufferArr: [],// to be used  and dispose after use - use to read, but never use to load =>always use FL.common.loadGeneralBufferBegin for the 1st one and FL.common.loadGeneralBufferNext for all others
        loadGeneralBufferBegin: function (load) {
            this.generalBufferArr = [];
            this.generalBufferArr.push(load);
        },
        loadGeneralBufferNext: function (load) {
            this.generalBufferArr.push(load);
        },
        generalParametersObj: {},// to be used  and dispose after use - use to read, but never use to load =>always use FL.common.loadGeneralBufferBegin for the 1st one and FL.common.loadGeneralBufferNext for all others

        setParametersTo: function (bufferName, arrOfParam) {//used to send parameters (only once) from any module to any module via global window
            this.generalParametersObj[bufferName] = arrOfParam;
        },
        getParametersFrom: function (bufferName) {//bufferName is allways destroyed after each get
            ////REMEBER THAT getParametersFrom CAN BE USED ONLY ONCE FOR EACH BUFFER NAME
            // example  var param= FL.common.getParametersFrom("_field");
            paramArrToReturn = this.generalParametersObj[bufferName];
            delete this.generalParametersObj[bufferName];
            return paramArrToReturn;
        },
        setParent: function (o) {//given a nested  object sets a property parent at each object node
            var keysArr = _.keys(o);
            _.each(keysArr, function (element) {
                //FL.common.printToConsole("-->verifies node=" + element, "abc");
                if (FL.common.typeOf(o[element]) == "object") {
                    if (element != "parent") {
                        //FL.common.printToConsole("-------------> node=" + element + " is an object", "abc");
                        o[element].parent = o;
                        FL.common.setParent(o[element]);
                    }
                }
            });
        },
        currencyToStringNumber: function (currencyStr) {
            //converts a currency string ex "€ 12345,67" to a string representing a number ex:"12345.67" using appsettings
            //  "kr. 9.734.123,45" =>"9734123.45", "Din. 1,235.45"=>"1235.45"
            var radixpoint = this.appsettings.radixpoint;
            var thousandsSeparator = this.appsettings.thousandsSeparator;
            var regexSep = "\\" + thousandsSeparator;
            var reSep = new RegExp(regexSep, "g");
            var regex = "[^0-9\\" + radixpoint + "]+";//exclude all chars except numbers and radix
            var re = new RegExp(regex, "g");
            var strNumber = currencyStr.replace(re, "");
            // if(radixpoint == ",")
            //     strNumber=strNumber.replace(/,/g,'.');
            var regexSetRadix = radixpoint;
            var reSetRadix = new RegExp(regexSetRadix, "g");
            strNumber = strNumber.replace(regexSetRadix, '.');

            if (strNumber.indexOf(radixpoint) != strNumber.lastIndexOf(radixpoint))
                strNumber = strNumber.substr(0, strNumber.indexOf(radixpoint)) + strNumber.substr(strNumber.indexOf(radixpoint) + 1);
            return strNumber;
        },
        formatStringNumberWithMask: function (strNumber, mask) {
            //converts a string number ex"12345.67" into a currency string ex "€ 12345,67" using appsettings
            //  "9734123.45"=>"kr. 9.734.123,45" , "1235.45"=>"Din. 1,235.45"
            //var mask = "99-AAA-999";
            var radixpoint = this.appsettings.radixpoint;
            var thousandsSeparator = this.appsettings.thousandsSeparator;
            if (radixpoint == ",")
                strNumber = strNumber.replace(/\./g, ',');
            $('#_freeSlots').append("<input type='text' id='_tempSlot' val='" + strNumber + "'>");////create a temporary slot in the dom under _freeSlots
            $("<input type='text' id='_tempSlot' val='" + strNumber + "'>");//create a temporary slot in the dom
            $("#_tempSlot").val(strNumber);
            $("#_tempSlot").inputmask({
                "mask": mask,
                greedy: false
            });
            var retStr = $("#_tempSlot").val();
            // alert("input="+strNumber+" -->"+retStr);
            $("#_tempSlot").remove();//remove temporary slot from dom
            return retStr;
        },
        editMasterDetail: function (id, title, templateName, masterDetailJson, options, editMasterDetailCB) {
            // returns masterDetailJson with new values collected from modal dialog  with title and templateName - options like makeModa()
            //  EXEMPLE OF FORMAT FOR masterDetailJson:
            //	var masterDetailItems = {
            //		master:{entityName:"client",entityDescription:"someone we may invoice"},
            //		detailHeader:["#","ZAttribute","what is it","Statement to validate"],
            //		detail:[
            //			{attribute:"name", description:"official designation",statement:"the name of the client is the official designation"},
            //			{attribute:"address", description:"place to send invoices",statement:"The address of the client is the place to send invoices"},
            //			{attribute:"city", description:"headquarters place", statement:"The city of the client is the headquarters place"},
            //			{attribute:"postal code", description:"postal reference for delivery",statement:"The postal code of the client is the postal reference for delivery"}
            //		]
            //	};
            // options - {type:"primary", icon:"send",button1:"Cancel",button2:"Send Newsletter",dropdown:{"#_sendNewsletter_templates":{arr:["op1","op2"],onSelect:function(){FL.common.printToConsole("choise was "+selected);}}}
            //   notice the optional dropdown key in options. This is a way to send dropdown options yp edit masterdetail
            //     for each dropdown editmaster detail must receive: the set of values to present, the function to run on selection
            //     Example:
            //          dropdown:{
            //              "#dropdownId1":{ arr:['a','b','c','d','e'],
            //                                  default:"c",
            //                                  onSelect:function(selected){
            //                                        FL.common.printToConsole("The choice was "+selected);    
            //                                  }
            //                             },                                   
            //              "#dropdownId2":{ arr:['a1','a2','a3','a4','a5'],
            //                                  default:"a3",
            //                                  onSelect:function(selected){
            //                                        FL.common.printToConsole("For id2 the choice was "+selected);    
            //                                  }                                   
            //                            }
            //               }
            //          }
            var masterDetailItems = masterDetailJson;
            //FL.common.setParent(options);//this will introduce a parent key in all nested objects - convinient to access one dropdown from another
            this.makeModal(id, title, templateName, options, function (result) {
                if (result) {
                    fillMasterForTemplate(templateName, masterDetailJson.master);
                    fillDetailForTemplate(templateName, masterDetailJson.detail);
                    return editMasterDetailCB(true);
                } else {
                    return editMasterDetailCB(false);
                }
            }, masterDetailJson);
        },
        makeModalInfo: function (message, makeModalInfoCB, stackLevel) {
            if (FL.common.getBrowser() == "Xie") {
                alert(message);
            } else {
                this.makeModal2("Information", "<p>" + message + "</p>", {
                    type: "primary",
                    button1: "Ok",
                    button2: null
                }, makeModalInfoCB, stackLevel);//OK
            }
        },
        makeModalConfirm: function (message, btn1, btn2, makeModalConfirmCB, stackLevel) {//button 2 is the default
            this.makeModal2("Confirmation", "<p>" + message + "</p>", {
                type: "primary",
                button1: btn1,
                button2: btn2
            }, makeModalConfirmCB, stackLevel);//OK
        },
        makeModal2: function (title, message, options, makeModalCB, stackLevel) {
            // version specific for makeModalInfo and makeModal confirm - does not use parsley
            // CONDITIONS NECESSARY FOR makeModal() to work:
            //      1 - THE BODY MUST HAVE A DEDICATED SLOT: <div id="_modalDialog"+{id}></div>
            //	title - Model window title
            //	message - Dialog content
            //	options  - JSON with icon and type
            //      icon - termination of http://getbootstrap.com/components/ -
            //          ex: glyphicon glyphicon-thumbs-up   =>"thumbs-up" 
            //              glyphicon glyphicon-search      =>"search" 
            //              glyphicon glyphicon-ok          =>"ok"   etc...
            //      type - success, primary, info, warning and danger
            //      button1 - name of first button
            //      button2 - name of second button (null =>only one button is available)
            //  callback - to return result example:
            //          makeModal(" Juakim","dictTemplate",{type:"primary", icon:"search",button1:"Close",button2:"Save Changes"},function(result){
            //              if(result){
            //                  alert("Yup");
            //              }else{
            //                  alert("Nope");
            //              }
            //          });
            //          NOTE: Callback argument result = true if button 2 is pressed, result = false if button 1 is pressed
            // http://www.sitepoint.com/understanding-bootstrap-modals/
            var $modalDialog = $("#_modalDialog");
            options = _.extend({icon: null, type: "success", button1: "Cancel", button2: "Ok"}, options);
            if (!stackLevel)
                stackLevel = 0;
            var modalId = "__FLmodalId_";
            var fullHTML = getDialogHTML("", stackLevel, title, message, options);
            $modalDialog.empty().append(fullHTML);
            var $modal = $('#' + modalId);
            if (makeModalCB) {
                $modal.on("click", "#__FLDialog_button1", function () {
                    // alert("makeModal - You clicked button1"); 
                    $modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    return makeModalCB(false);
                });
                $modal.on("click", "#__FLDialog_button2", function () {
                    $modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    return makeModalCB(true);
                });
                $modal.on('hidden.bs.modal', function () {
                    // alert("makeModal - You closed the window !!!");
                    return makeModalCB(false);
                });
            } else {
                // $modal.off('hidden.bs.modal');              
                FL.common.printToConsole("makeModal ----->No callback");
                $modal.modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
            // $('#' + modalId ).modal('show');//to launch it immediatly when calling makeModal
            $modal.modal('show');//to launch it immediatly when calling makeModal	
        },
        makeModal: function (id, title, templateName, options, makeModalCB, dataStructureForSubstitution) {
            //id = "A" or "B" followed by an optional number that indicates the stack level. If number=1 is ignored if number =2 z-index=2000
            //  if number =3 =>z-index=3000   suporting a modal inside a modal
            //CONDITIONS NECESSARY FOR makeModal() to work:
            //      1 - THE BODY MUST HAVE A DEDICATED SLOT: <div id="_modalDialog"+{id}></div>
            // title - Model window title
            // templateName - normally is a html template defined with  <script id="templateName" type="text/template"> 
            //     it can be a direct html string if first char is "<".
            // options  - JSON with icon and type
            //      icon - termination of http://getbootstrap.com/components/ -
            //          ex: glyphicon glyphicon-thumbs-up   =>"thumbs-up" 
            //              glyphicon glyphicon-search      =>"search" 
            //              glyphicon glyphicon-ok          =>"ok"   etc...
            //      type - success, primary, info, warning and danger
            //      button1 - name of first button
            //      button2 - name of second button (null =>only one button is available)
            //      dropdown - optional to be used when template has dropdowns
            //          dropdown:{ "#_sendNewsletter_templates":{ arr:["op1","op2"],default:"op2",onSelect:function(){FL.common.printToConsole("choise was "+selected);} } }
            //
            //  callback - to return result example:
            //          makeModal(" Juakim","dictTemplate",{type:"primary", icon:"search",button1:"Close",button2:"Save Changes"},function(result){
            //              if(result){
            //                  alert("Yup");
            //              }else{
            //                  alert("Nope");
            //              }
            //          });
            //          NOTE: Callback argument result = true if button 2 is pressed, result = false if button 1 is pressed
            // http://www.sitepoint.com/understanding-bootstrap-modals/
            var masterDetailItems = null;
            if (dataStructureForSubstitution)
                window.masterDetailItems = dataStructureForSubstitution;//HACK for _.template()
            var stackLevel = 0; //this is used  to define z-Index allowing to place modals inside modals 0 or 1 => first level          
            if (id.length > 1) {
                stackLevel = parseInt(id.substr(1, 1), 10);//"A2" => 2
                id = id.substr(0, 1);
            }
            var $modalDialog = $("#_modalDialog" + id);
            if ($modalDialog.length === 0) {//if it does not exist in DOM -THIS IS NO WORKING...WHY ??? -IT MUST EXIST ALREADY
                // alert("the id="+ ("#_modalDialog"+id) + " does not exist in DOM !!");
                //<div id='_modalDialogB'></div> -->
                var htmlId = "<div id='#_modalDialog" + id + "'></div>";
                FL.common.printToConsole(htmlId);
                $(htmlId).prependTo('body');
                $modalDialog = $("#_modalDialog" + id);
                var z = 32;
            }
            options = _.extend({icon: null, type: "success", button1: "Cancel", button2: "Ok"}, options);


            var modalId = "__FLmodalId_" + id;
            var htmlIn = null;
            // alert("Inside:"+templateName.substring(0,0));
            var form = null;

            if (templateName.substring(0, 1) == "<") {
                htmlIn = templateName;
            } else {
                var t1 = $("#" + templateName).html();
                var f1 = _.template(t1);
                var htmlT1 = f1();
                var templateFunc = _.template($("#" + templateName).html());
                htmlIn = templateFunc({name: "Joao", age: 58, occupation: "tangas"});
                form = $("#form_" + templateName);
                // form.parsley();
                // form.parsley().validate();
            }

            var fullHTML = getDialogHTML(id, stackLevel, title, htmlIn, options);


            $modalDialog.empty().append(fullHTML);
            if (options.dropdown) {//dropdown is an object with one key per drop down - the key is #id of dropdown on template
                loadAllDropdownsPreparingOnSelectCall(options.dropdown, templateName);
            }
            if (options.detailDropdown) {//detailDropdown is an object with one key per drop down in detail - the key is #id of dropdown on template
                var templateName = templateName; //to make it accessible inside _.each
                var index = 0;
                _.each(options.detailDropdown, function (value, key) {//each key is a dropdown inside detail
                    index++;//the line number inside detail

                    if (key != "parent") {//bypasses all "parent" keys
                        if (value.arr && value.onSelect) {
                            // var arrOfObjs =_.map(value.arr,function(element,index){ //converted to format {value:0,text:arr[0]},{value:1,text:arr[1]}...etc
                            //     return {value:index,text:element};
                            // });
                            _.each(window.masterDetailItems.detail, function (element, index) {//within each dropdown for each detail line.
                                var lineKey = templateName + "__f" + (index + 1) + "_" + key + "_options";
                                var defaultValue = element[key]; //masterDetailItems.detail always has a default value !!!!
                                selectBox({
                                    boxId: lineKey,
                                    boxCurrent: defaultValue,
                                    boxArr: value.arr
                                }, value.onSelect);
                            });
                        } else {
                            alert("FLcommon2.js makeModal - Error detailDropdown definition missing - check default or arr or onselect");
                        }
                    }
                });
            }
            var $modal = $('#' + modalId);
            form = $("#form_" + templateName);
            form.parsley();
            form.parsley().validate();

            if (makeModalCB) {
                $("#__FLDialog_button1").off('click');
                $modal.on("click", "#__FLDialog_button1", function () {
                    // alert("makeModal - You clicked button1");
                    FL.common.printToConsole("Button 1 was clicked");
                    $modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    window.masterDetailItems = null;
                    return makeModalCB(false);
                });
                $("#__FLDialog_button2").off('click');
                $modal.on("click", "#__FLDialog_button2", function () {
                    FL.common.printToConsole("Button 2 was clicked");
                    // var form = $("#form_" + templateName );
                    // form.parsley();
                    // form.parsley().validate();
                    if (form.parsley().isValid()) {//http://stackoverflow.com/questions/19821934/parsley-js-validation-not-triggering
                        FL.common.printToConsole('no client side errors!');
                        $modal.off('hidden.bs.modal');
                        $modal.modal('hide');
                        window.masterDetailItems = null;
                        return makeModalCB(true);
                    } else {
                        FL.common.printToConsole('Client side errors!!!!');
                        $('.invalid-form-error-message')
                            .html("You must correctly fill the fields...")
                            .addClass("filled");
                        event.preventDefault();
                    }
                });
                $modal.on('hidden.bs.modal', function () {
                    // alert("makeModal - You closed the window !!!");
                    window.masterDetailItems = null;
                    return makeModalCB(false);
                });
            } else {
                // $modal.off('hidden.bs.modal');
                FL.common.printToConsole("makeModal ----->No callback");
                $modal.modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
            // $('#' + modalId ).modal('show');//to launch it immediatly when calling makeModal
            $modal.modal('show');//to launch it immediatly when calling makeModal
        },
        setStyleAndFont: function (styleName, fontName) {//the css files FL<styleName>.css and FLfont_<fontName>.css must exist in FL_ui/css
            loadCSS("FL" + styleName + ".css");
            loadCSS("FLfont_" + fontName + ".css");
        },
        getTag: function (str, tagName, tagTerminator) {//returns the content of str after the last separator character or string - no separator found  =>null
            //get tag with name tagName embeded in string str - if several exist it takes the last one
            //ex. FL.common.getTag(fullUrl,"connectionString","#") -->returns  "abc" for fullUrl="#connectionString=abc#pag=home"
            var retTag = null;
            retTag = this.getLastTagInString(str, tagName + "=", tagTerminator);
            if (retTag) {
                var firstChar = retTag.substring(0, 1);
                if (firstChar == "{") {//tag is the string format of a JSON
                    retTag = retTag.replace(/%22/g, '"');
                    retTag = retTag.replace(/%20/g, ' ');
                }
            }
            return retTag;
        },
        stringAfterLast: function (str, separator) {//returns the content of str after the last separator character or string - no separator found  =>null
            //ex. FL.common.stringAfterLast("http://www.framelink.co/app?d=myDomain1","=") -->returns  "myDomain1"
            var retStr = null;
            if (str) {
                var pos = str.lastIndexOf(separator);
                var separatorLen = separator.length;
                if (pos >= 0)
                    retStr = str.substring(pos + separatorLen);
            }
            return retStr;
        },
        stringBeforeLast: function (str, separator) {//simply returns the content of str before the last separator character or string - no separator found  =>null
            //ex. FL.common.stringBeforeLast("this is (one) or (two) values","(") -->returns  "this is (one) or "
            var retStr = null;
            if (str) {
                var pos = str.lastIndexOf(separator);
                if (pos >= 0)
                    retStr = str.substring(0, pos);
            }
            return retStr;
        },
        stringBeforeFirst: function (str, separator) {//simply returns the content of str before the first separator character or string - no separator found  =>null
            //ex. FL.common.stringBeforeFirst("this is (one) or (two) values","(") -->returns  "this is "
            var retStr = null;
            if (str) {
                var pos = str.indexOf(separator);
                if (pos >= 0)
                    retStr = str.substring(0, pos);
            }
            return retStr;
        },
        stringAfterFirst: function (str, separator) {//returns the content of str after the first separator character or string - no separator found  =>null
            //ex. FL.common.stringAfterafter("http://www.framelink.co/app?d=myDomain1","=") -->returns  "myDomain1"
            var retStr = null;
            if (str) {
                var pos = str.indexOf(separator);
                var separatorLen = separator.length;
                if (pos >= 0)
                    retStr = str.substring(pos + separatorLen);
            }
            return retStr;
        },
        getLastTagInString: function (str, separator, tagTerminator) {//returns the content after the last separator until end or terminal char
            // str - string that will be processed
            // separator - last ocurrence to be identified in string
            // tagTerminator - character (or set of caracters) that define the end-of-tag
            //		if tagTerminator is a string any of the string chars will be considered a tag terminator ex "/#"
            //		if no tagTerminator is found the full string after the separator is returned
            //		ex. getTagInString("http://www.framelink.co/app?d=myDomain1#","=","#") -->returns  "myDomain1" (the "#" is excluded)
            var retStr = this.stringAfterLast(str, separator);
            var terminatorChar = null;
            var terminatorPos = null;
            if (retStr) {
                for (var i = 0; i < tagTerminator.length; i++) {
                    terminatorChar = tagTerminator[i];
                    // FL.common.printToConsole("getLastTagInString -> char="+terminatorChar);
                    terminatorPos = retStr.indexOf(terminatorChar);
                    if (terminatorPos >= 0) {
                        retStr = retStr.substring(0, terminatorPos);
                        break;
                    }
                }
            }
            return retStr;
        }
        ,
        repeat: function (str, n) {//repeat str n times
            n = n || 1;
            if (n < 0)
                n = 0;
            return Array(n + 1).join(str);
        }
        ,
        getTail: function (strNumber, radixpoint) {//returns the decimal part of a string representing a number.
            //radixpoint is the decimal separator. If missing uses the appsettings radixpoint
            if (!radixpoint)
                var radixpoint = FL.common.appsettings.radixpoint;//if radixpoint is missing uses the appsettings radixpoint
            var tail = "";
            var posDecimal = strNumber.indexOf(radixpoint);
            if (posDecimal > 0)
                tail = strNumber.substr(posDecimal + 1);
            return tail;
        }
        ,
        validateEmail: function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
        ,
        clearSpaceBelowMenus: function () {
            $("#_placeHolder").empty();
            $("#personContent").empty();
            $("#csvcontent").empty();
            $("#grid").empty();
            $("#paginator").empty();

            $("#addGrid").hide();
            $("#_delete").hide();
            $("#_editGrid").hide();
            $("#_newsletterMC").hide();
            $("#_newsletter").hide();

            // $("#_belowMenus").hide();
            $("#templateHolder").hide();
        }
        ,
        buildDiff: function (arrOfObjA, arrOfObjB, pivotKey) {
            //given two arrays of objects A and B, both containing key pivotKey, returns an array with all the elements
            //  existing in A whose pivotKey exists in A and not in B.
            //example
            //   A = [{_id:"abc1",name:"jojo",email:"jojo@j.com"},{_id:"abc2",name:"toto",email:"toto@t.com"},{_id:"abc3",name:"zozo",email:"zozo@z.com"}];
            //   B = [{_id:"abc1"]},{_id:"abc2"}];
            //   FL.common.buildDiff(A,B,"_id") ->[{_id:"abc3",name:"zozo",email:"zozo@z.com"}]
            var arrA = _.pluck(arrOfObjA, pivotKey)
            var arrB = _.pluck(arrOfObjB, pivotKey)
            var diffArr = _.difference(arrA, arrB); //returns the values of A not present in B
            var outArr = _.map(diffArr, function (element) {
                //scn diffArr and return all arrObjA that match the same _id
                index = _.find(arrOfObjA, function (elementOfA) {
                    return elementOfA[pivotKey] == element
                });
                return arrOfObjA[index - 1];
            });
        }
        ,
        shortEmailName: function (email) {
            var pos = email.indexOf("@");
            return email.substring(0, pos);
        }
        ,
        enc: function (str, incr) {//FL.common.enc("o gato patolinas",1) =>fuzzy => FL.common.enc(fuzzy,-1))=>"o gato patolinas"
            //'H'.charCodeAt(0) =>72 , String.fromCharCode(72) =H
            // var encoded =  FL.common.enc('{Patolinas},:',1);
            // alert("Patolinas >"+encoded+"< - >"+FL.common.enc(encoded,-1)+"<");
            str = str.replace(/"/g, "'");
            var encoded = "";
            for (i = 0; i < str.length; i++) {
                var a = str.charCodeAt(i);//returns a number
                // var b = a ^ 123;    // bitwise XOR with any number, e.g. 123

                encoded = encoded + String.fromCharCode(a + incr);//add a char to the string
            }
            encoded = encoded.replace(/'/g, '"');
            return encoded;
        }
        ,
        loaderAnimationON: function (div) {
            var opts = {
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '50%', // Top position relative to parent in px
                left: '50%' // Left position relative to parent in px
            };
            var target = document.getElementById(div);
            var spinner = new Spinner(opts).spin(target);
            return spinner;
        }
        ,
        makeFirstElementsSample: function (arr, sampleSize) {//returns a similar array with max size of sampleSize
            var sample = [];
            var len = arr.length;
            if (len > sampleSize)
                len = sampleSize;
            for (var i = 0; i < len; i++) {
                sample.push(arr[i]);
            }
            return sample;
        }
        ,
        selectBox: function (options, onSelection) {
            selectBox(options, onSelection);
        }
        ,
        setDropdown: function (options) {
            setDropdown(options);
        }
        ,
        typeOf: function (xVar) {//given a variable, returns one of :  "number","string","boolean","object","array","null","undefined","date"
            //exemple of undefined: a variable declared but never defined -->var foo; alert(foo); //undefined.
            var xRet = typeof xVar;
            if (xRet == "object") {
                if (xVar instanceof Array)
                    xRet = "array";
                if (xVar instanceof Date)
                    xRet = "date";
                if (!xVar)
                    xRet = "null";
            }
            return xRet;
        }
        ,
        is_phone: function (phone) {//validates formatted phone number
            //http://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript - we ignore format and validate numeric content only
            var phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}/;//^begins by one of [2-9] folowed by {2} occurences of any d (digit),folowed by one [2-9] and follwed by 6 digits
            var digits = phone.replace(/\D/g, "");//Do a global search for non-digit characters and removes them
            if (digits.length > 12)
                return false;
            return (digits.match(phoneRe) !== null);
        }
        ,
        forceToString: function (xVar) {//convert a variable of any type to string
            var type = this.typeOf(xVar);
            if (type != "string") {
                if (type == "object" || type == "array")
                    xVar = JSON.stringify(xVar);
                else if (type == "number" || type == "date" || type == "boolean")
                    xVar = xVar.toString();
                else if (type == "null")
                    xVar = "NULL"
            }
            return xVar;
        }
        ,
        formatShortLocalToISODate: function (dateTimeString, sourceFormat) {//return ISO Date for a local dateTimeString "<shortdate> hh:mm <pm|am>"
            //ex:FL.common.formatToISODate("6/25/2015 11:21 am");==>2015-06-25T10:21:00.000Z for PC with -1 hour of time zone difference
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            }

            function p(n) {
                n = n < 10 ? z(n) : n;
                return n < 100 ? z(n) : n;
            }

            if (sourceFormat == "DMY") {
                var index = dateTimeString.indexOf(" ");
                if (index > 0) {
                    var shortDate = dateTimeString.substr(0, index);
                    var YMD = shortDate.split("/").reverse().join("/");
                    var tail = dateTimeString.substr(index);
                    console.log(YMD + "---->" + tail);
                    dateTimeString = YMD + tail;
                } else {
                    alert("FL.common.formatShortLocalToISODate -->" + dateTimeString + " is a bad format for dateTimeString ")
                }
            }
            var d = new Date();
            var difTotalMin = d.getTimezoneOffset();//timezone difference in minutes
            var difHrs = parseInt(difTotalMin / 60);
            var difMin = difTotalMin % 60;
            var d = new Date(dateTimeString);
            var isoDate = d.getUTCFullYear() + "-" + z(d.getUTCMonth() + 1) + "-" + z(d.getUTCDate()) + 'T';
            isoDate += z(d.getUTCHours() + 1 + difHrs) + ":" + z(d.getUTCMinutes() + difMin) + ":" + z(d.getUTCSeconds()) + '.';
            isoDate += p(d.getUTCMilliseconds()) + "Z";
            return isoDate;
        }
        ,
        timeTo24: function (timeString) {//converts a time string "hh:mm <pm|am>" to "hh:mm" where hh=[0-24] if formnat incorret returns null
            //FL.common("11:00 pm") -->"23:00"
            //FL.common("12:00 pm") -->null
            // FL.common("13:00 pm") -->null
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            }

            var hrs = parseInt(timeString.substr(0, 2));
            var min = parseInt(timeString.substr(3, 2));
            var amPm = timeString.substr(6, 2).toLowerCase();
            if (amPm == "pm") {
                hrs += 12;
            }
            if (hrs > 23 || min > 59)
                return null;
            hrs = z(hrs);//2-->"02"  13-->"13"
            var min = timeString.substr(3, 2);
            return hrs + ":" + min;
        }
        ,
        toISODate: function (dateTimeString, sourceFormat) {//returns ISO date from a dateTimeString "<shortdate> hh:mm <pm|am>" and a format DMY or MDY
            //<shortdate> may be:yyyy/mm/dd, dd/mm/yyyy or mm/dd/yyyy
            //examples:
            //   toISODate("6/12/2015 6:00 am","DMY") =>2015-12-06T05:00:00.000Z
            //   toISODate("6/12/2015 6:00 am") =>2015-06-12T05:00:00.000Z
            //      previous is the same as toISODate("6/12/2015 6:00 am","MDY")
            var isoDate = null, shortDate = null, tail = null, time24 = null, d = null;
            var index = dateTimeString.indexOf(" ");
            if (sourceFormat == "DMY") {//we need to reverse shortDate to shortYMD
                if (index > 0) {
                    shortDate = dateTimeString.substr(0, index);
                    var shortYMD = shortDate.split("/").reverse().join("/");
                    tail = dateTimeString.substr(index + 1);
                    time24 = this.timeTo24(tail);
                    YMD_time = shortYMD + " " + time24;
                    isoDate = new Date(YMD_time).toISOString();
                } else {
                    alert("FL.common.toISODate -->" + dateTimeString + " is a bad format for dateTimeString ")
                }
            } else {//case of YMD or MDY
                d = new Date(dateTimeString);
                if (d != "Invalid Date") {
                    isoDate = d.toISOString();
                    if (index > 0) {
                        shortDate = dateTimeString.substr(0, index);
                        tail = dateTimeString.substr(index + 1);
                        time24 = this.timeTo24(tail);
                        if (!time24)
                            isoDate = null;
                        else
                            isoDate = new Date(shortDate + " " + time24).toISOString();
                    }
                }
            }
            return isoDate;
        }
        ,
        fromISODateToShortdate: function (isoDate, outFormat) {//returs a dateTimeString shortdate> may be:yyyy/mm/dd, dd/mm/yyyy or mm/dd/yyyy from ISO date
            // if isoDate is not acceptable it will return null
            //sourceFormat may be "YMD","MDY" or "DMY"
            //examples:
            //   FL.common.fromISODateToShortdate("2015-12-06T05:00:00.000Z","YMD") ==>"2015/06/12"
            //   FL.common.fromISODateToShortdate("2015-12-06T05:00:00.000Z","MDY") ==>"12/06/2015"
            //   FL.common.fromISODateToShortdate("2015-12-06T05:00:00.000Z","DMY") ==>"06/12/2015"
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            }

            var shortDate = null;
            var d = new Date(isoDate);
            if (d == "Invalid Date")
                return null;
            var y = d.getUTCFullYear();
            var m = z(d.getUTCMonth() + 1);
            var day = z(d.getUTCDate());
            if (outFormat == "YMD")
                shortDate = y + "/" + m + "/" + day;
            else if (outFormat == "MDY")
                shortDate = m + "/" + day + "/" + y;
            else if (outFormat == "DMY")
                shortDate = day + "/" + m + "/" + y;
            else
                alert("FL.common.fromISODateToShortdate outFormat=" + outFormat + " is invalid!");
            return shortDate;
        }
        ,
        fromISODateToTime: function (isoDate) {//returs a time string "hh:mm <pm|am>"" from ISO date
            //examples:
            //   FL.common.fromISODateToTime("2015-12-06T05:00:00.000Z") ==>"06:00 am"
            //   FL.common.fromISODateToTime("2015-12-06T15:45:00.000Z") ==>"04:45 pm"
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            }

            var d = new Date(isoDate);
            var hrs = d.getUTCHours() + 1;
            var amPm = "am";
            if (hrs > 12) {
                amPm = "pm";
                hrs -= 12;
            }
            hrs = z(hrs);//2-->"02"  13-->"01"
            var min = z(d.getUTCMinutes());
            return hrs + ":" + min + " " + amPm;
        }
        ,
        fromISODateToShortdateTime: function (isoDate, sourceFormat) {//returs a dateTimeString "<shortdate> hh:mm <pm|am>" from ISO date
            //sourceFormat may be "YMD","MDY" or "DMY"
            //examples:
            //   FL.common.fromISODateToShortdateTime("2015-12-06T05:00:00.000Z","MDY") ==>"12/06/2015 06:00 am"
            //   FL.common.fromISODateToShortdateTime("2015-12-06T15:45:00.000Z","DMY") ==>"06/12/2015 04:45 pm"
            var shortDate = this.fromISODateToShortdate(isoDate, sourceFormat);
            if (!shortDate)
                return null;
            return shortDate + " " + this.fromISODateToTime(isoDate);
        }
        ,
        is_validShortDate: function (shortDate) {//validate  xx-xx-xx or xx/xx/xx or xx.xx.xx where year can be xxxx
            //->accepts DMY(europe), MDY(US), YMD(China - the default accepted by Date.Parse)
            // YMD accepts "2014/12/30","2014-12-30","2014.12.30" -> rejects "14/12/30"
            var bRet = false;
            var reYMD = /^(19|20)\d{2}([- /.])(0[1-9]|1[012]|[1-9])\2(0[1-9]|[12][0-9]|3[01]|[1-9])$/;//Formats accepted yyyy/mm/dd or yyyy/m/d
            var reDMY = /^(0[1-9]|[12][0-9]|3[01]|[1-9])([- /.])(0[1-9]|1[012]|[1-9])\2(19|20)\d\d$/;//Formats accepted dd/mm/yyyy or d-m-yyyy
            var reMDY = /^(0[1-9]|1[012]|[1-9])([- /.])(0[1-9]|[12][0-9]|3[01]|[1-9])\2(19|20)\d\d$/;//Formats accepted mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy format
            //group 1 -  /^(0[1-9]|1[012]) - ^begins by  ()a group of 0 folowed by one of 1-9 =>01-09 or 1 followed by 0,1,o2 2 =>10, 11 or 12 =>02 or 11
            //group 2 -  ([- /.]) - the char - or space or / or .
            //group 3 -  (0[1-9]|[12][0-9]|3[01]) - the digits 01 until 09 or ( 1 or 2 followed by any of 0-9 ) or (3 followed by 0 or 1)
            //group 4 -  \2 Backreference. It matches the contents of the n'th set of parentheses in the expression. repeats ([- /.])
            //group 5 -  (19|20)\d\d$  19 or 20 followed by any d (digit) and d(another digit)  $ means look at the end of string while ^means look at the beginning
            // if( !isNaN( Date.parse(shortDate) ) ){//"24/06/2015" returns isNaN, but it is a valid date !!!!
            //     bRet=true;
            if (reYMD.test(shortDate)) {
                bRet = true;
            } else if (reDMY.test(shortDate)) {
                bRet = true;
            } else if (reMDY.test(shortDate)) {
                bRet = true;
            }
            return bRet;
        }
        ,
        is_ValidDate: function (dateString) {
            // returns true - if dateString has an acceptable format for a date. Ex
            //      ex:"March 21, 2012", "2015/06/24", "2015-06-24"
            //      for xx-xx-xx ->accepts DMY(europe), MDY(US), YMD(China - the default accepted by Date.Parse)
            // refuse ->"Stage Paris 2014", "209999"
            if (isNaN(Date.parse(dateString))) {//"24/06/2015" MDY returns isNaN, but it is a valid date !!!!
                //it will check if it is DMY or MDY(mm/dd/yyy)
                if (dateString.length == 10) {//may be acceptable
                    if (!this.is_validShortDate(dateString)) {
                        return false;//it was a short format but it is invalid
                    }
                } else {
                    return false;//if Date.parse does not return a number it is not a valid date for sure!!!
                }
                //but Date.parse will return a number for ..."Stage Paris 2014" or "209999" ->we must exclude these
            }
            var d = new Date(Date.parse(dateString));//always a valid date because it passed the previous test
            var monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var monthsArr3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var weekDaysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
            var weekDaysArr3 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
            var testArr = [monthsArr[d.getMonth()], monthsArr3[d.getMonth()], weekDaysArr[d.getDay()], weekDaysArr3[d.getDay()]];//possible values for first string
            var firstString = this.stringBeforeFirst(dateString, " ");//for "Stage Paris 2014", first will be -->"Stage"
            if (!firstString) { //examples: "Stage,Paris,2014" or "209999"
                firstString = this.stringBeforeFirst(dateString, ",");//for "Stage,Paris,2014", first will be -->"Stage"
                if (!firstString)
                    firstString = dateString; //example "209999"
            }
            var is_date = false; //it will be false except if firstString matches any of testArr values
            var foundMatch = _.find(testArr, function (element) {
                return (element == firstString);
            });
            if (!_.isUndefined(foundMatch)) {
                is_date = true;
            } else {
                if (this.is_validShortDate(dateString)) {
                    is_date = true;
                } else {
                    var re = /^(0[1-9]|[12][0-9]|3[01])([- /.])(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\2(19|20)\d\d$/;//Formats accepted dd/Mar/yyyy
                    if (re.test(firstString)) {
                        is_date = true;
                    }
                    re = /^(0[1-9]|[12][0-9]|3[01])([- /.])(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\2\d\d$/;//Formats accepted dd/Mar/yy
                    if (re.test(firstString)) {
                        is_date = true;
                    }
                }

                // var re = /^(0[1-9]|1[012])([- /.])(0[1-9]|[12][0-9]|3[01])\2(19|20)\d\d$/;//Formats accepted mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy format
                // if( re.test(firstString) ){
                //     is_date = true;
                // }
                // var re = /^(0[1-9]|1[012])([- /.])(0[1-9]|[12][0-9]|3[01])\2\d\d$/;//Formats accepted mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy format
                // if( re.test(firstString) ){
                //     is_date = true;
                // }
                // var re = /^(0[1-9]|[12][0-9]|3[01])([- /.])(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\2(19|20)\d\d$/;//Formats accepted dd/Mar/yyyy
                // if( re.test(firstString) ){
                //     is_date = true;
                // }
                // var re = /^(0[1-9]|[12][0-9]|3[01])([- /.])(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\2\d\d$/;//Formats accepted dd/Mar/yy
                // if( re.test(firstString) ){
                //     is_date = true;
                // }
            }
            return is_date;
        }
        ,
        is_dateArrInStringFormat: function (arrOfRowValues) {//returns true if all array elements are a valid string format
            //var d = Date.parse("March 21, 2012");//1332288000000
            //var d = Date.parse("03-21-12");//1332288000000
            //var d = Date.parse("15-21-12");//NaN
            //var d = Date.parse("03/21/12 0:01");//1332288060000
            //var d = Date.parse("21-Mar-2012");//1332288000000
            //var d = Date.parse("21-Mar-12");//1332288000000
            //var d = Date.parse("21-Mar-1112");//-27069033600000
            //var d = Date.parse("Wednesday,March 21,2012");//1332288000000
            //var d = Date.parse("Wednesday,  March 21,  2012");//1332288000000
            //var d = Date.parse("Wednesday ,  March 21 ,  2012");//1332288000000
            //var d = Date.parse("Friday,  March 21 ,  2012");//1332288000000
            //var d = Date.parse("Friday,  MARCH 21 ,  2012");//1332288000000
            //var d = Date.parse("Friday MARCH21 2012");//1332288000000
            var is_date = false;
            var dateCandidate = null;
            var thiz = this;
            var emptyCounter = 0;
            var failElement = _.find(arrOfRowValues, function (element) { //if failElement is undefined => all elements are a valid date format
                if (element && element.trim().length > 0) {//skips null,"" and spaces - it enters test if it is a valid element
                    // return isNaN(Date.parse(element));//a non empty element that is not a date -
                    return !thiz.is_ValidDate(element);//a non empty element that is not a date -
                    //This returns a date for string "Stage Paris 2014" or "2013-02-31" or "209999"
                    //return moment(element).isValid() // using moment() =>refuses "2013-02-31" but accepts "Stage Paris 2014" and accepts "209999"
                } else {
                    emptyCounter++;
                }
                return false;
            });
            if (emptyCounter == arrOfRowValues.length) { //all elements are empty
                is_date = false;
            } else if (_.isUndefined(failElement))
                is_date = true;
            return is_date;
        }
        ,
        is_jsonString: function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        ,
        is_enumerableArr: function (arrOfRowValues, percent) {//returns true arrOfRowValues can colapse to less than percent with unique values
            //normally arrOfRowValues is a sample of the whole array, only to decide if it is enumerable or not
            var is_enumerable = false;
            var numOfSampleRows = arrOfRowValues.length;
            var uniqueObj = this.extractUniqueFromArray(arrOfRowValues);//returns {empties:no_of empties,uniqueArr:uniqueArr}
            var columnPercent = ( uniqueObj.uniqueArr.length - ((uniqueObj.empties == 0) ? 0 : 1)) / ( numOfSampleRows - uniqueObj.empties );
            if (columnPercent < percent)
                is_enumerable = true;
            return is_enumerable;
        }
        ,
        extractUniqueFromArray: function (arr) {//returns object with {empties:no_of empties,uniqueArr:uniqueArr}
            //returns an object {empties:no_of empties,uniqueArr:uniqueArr} where:
            //      empties - number of empties ocurrences in arr
            //      uniqueArr - array with all unique occurences in arr including "" if it exists
            var arr = _.filter(arr, function (element) {
                return typeof element != "undefined";
            });//exclude undefined elements
            var arrWrap = _.chain(arr).countBy().pairs(); //arrGroups gives us the number of different elements
            var arrGroups = arrWrap._wrapped; //arrGroups gives us the number of different elements
            //arrGroups has the format: [ ["High",40], ["Medium",47], ["Premium",5], ]
            var emptyPair = _.find(arrGroups, function (pair) {
                return pair[0] === "";
            });
            var empties = 0;
            if (typeof emptyPair !== 'undefined') {//the case where there is no emptyPair =>undefined
                empties = emptyPair[1];
            }
            var uniqueArr = _.map(arrGroups, function (element) {
                return element[0];
            });
            return {empties: empties, uniqueArr: uniqueArr};
        }
        ,
        getLocalLanguage: function () {
            var language = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
            if (_.isUndefined(language))
                language = window.navigator.userLanguage || window.navigator.language;
            return language;
        }
        ,
        is_decimal_US: function (strNumber) {
            is_US = false;
            var lastDotIndex = strNumber.lastIndexOf(".");
            var firstDotIndex = strNumber.indexOf(".");
            if (firstDotIndex >= 0) {//possible: (4.294,00) (4.294.123,00) (0.123) (4,294.00) (4,294,967.00)
                if (lastDotIndex == firstDotIndex)
                    is_us = true; // (0.123) or (4,294.00) or (4,294,967.00)
            }
        }
        ,
        is_oneOfCharsInString: function (str, charList) {//returns true if any of the chars in par2 exists in par1.
            //ex FL.common.is_oneOfCharsInString("anc 1002,3","* ") =>true because space exists in string
            var is = false;
            var targetChar = null;
            var pos = null;
            for (var i = 0; i < charList.length; i++) {
                targetChar = charList.charAt(i);
                pos = str.indexOf(targetChar);
                if (pos >= 0) {
                    is = true;
                    break
                }
            }
            return is;
        }
        ,
        isNumberSep: function (strNumber, sep) {//sep is thousands sep - returns true if string is a valid number with that thousand separator
            var isNumber = false;
            //case strNumber "1.000,3" with sep="," =>should return false. Without the "special if" it would return true =>1.0002 is valid
            if (sep == ",") { //"Special if for comma" will check if there is one last "," ocurrence, the first dot must comme after the ","
                var commaPos = strNumber.lastIndexOf(",");
                if (commaPos >= 0) {
                    var dotPos = strNumber.indexOf(".");
                    if (dotPos >= 0) {
                        if (dotPos < commaPos)
                            return isNumber;
                    }
                }
            }
            if (sep == " ") { //"Special if for space" -> "1 000,3" -> will check if there is one last " " ocurrence, the first dot must comme after the " "
                var spacePos = strNumber.lastIndexOf(" ");
                if (spacePos >= 0) {
                    if (strNumber.indexOf(".") >= 0)//if it exist a space the decimal point must be a "," : "1 000.3" => false
                        return false;
                    var commaPos = strNumber.indexOf(",");
                    if (commaPos >= 0) {
                        if (commaPos < spacePos) //"1,000 3"
                            return isNumber;
                    }
                }
            }
            if (sep == ".") //.. we need to escape the . because it has the meaning of "an arbitrary character" in a regular expression.mystring.replace(/\./g,' ')
                sep = "\\.";
            var regex = new RegExp(sep + "\\d", "g");//ex for sep="," all ocurrences of ,+digit will be deleted "123,,456,789.01" =>"123,456789.01"
            // var noSep = strNumber.replace(/,/g, '');
            var noSep = strNumber.replace(regex, '');//(',') 4,294,967,295.00 => 4294967295.00 ok
                                                     // ('.') 4.294.967.295,00 => 4294967295,00 ok
            if (!isNaN(noSep)) {//4,294,295.00 becomes =>4294295.00
                isNumber = true;
            } else {//failled because it is 4294967295,00 or 124,14,534 or ascd
                var lastCommaIndex = noSep.lastIndexOf(",");
                if (lastCommaIndex >= 0) {//possible: 4294967295,000  or asdasdasd,000
                    noSep = noSep.substr(0, lastCommaIndex) + "." + noSep.substr(lastCommaIndex + 1);
                }
                if (!isNaN(noSep)) {//4294295,00 becomes 4294295.00
                    isNumber = true;
                }
            }
            return isNumber;
        }
        ,
        getArrNumberFormat: function (arrOfRowValues) {//given an array of strings returns id it is a number representation and if yes returns the format
            //Possible formats : us,de,fr
            //returns {number:false, format:null} or {number:true, format:"us"} or (if all integers){number:true, format:null}
            //4,294,967,295.00  US-English, Thai,
            //4 294 967 295,000  =>Dan, Fin, France, sweeden
            //4.294.967.295,000  =>Italy, Norway, Spain, Portugal,Germany(de)
            // returns lang ("us","de","fr","neutral") neutral means a number simply
            var xRet = {"number": null, "format": null};
            var is_de = null;
            var is_fr = null;
            var is_us = null;
            var decimalPos = null;
            var thiz = this;
            var failElement = _.find(arrOfRowValues, function (element) { //if failElement is undefined => all elements are a valid number format
                if (!_.isNumber(element)) {//skips numbers
                    if (element && element.trim().length > 0) {//skips null,"" and spaces - it enters test if it is a valid element
                        if (!xRet.format) {
                            is_de = thiz.isNumberSep(element, ".");//a non empty element that has a "de" format 4.294.967.295,000
                            if (is_de) {//is valid as a german format but may be ambiguous. If it has a comma is not ambiguous otherwise it is ambiguous
                                xRet = {"number": true, "format": null};
                                if (thiz.is_oneOfCharsInString(element, ",."))
                                    xRet = {"number": true, "format": "de"};
                            } else {
                                is_fr = thiz.isNumberSep(element, " ");//a non empty element that has "fr" format 4 294 967 295,000
                                if (is_fr) {
                                    xRet = {"number": true, "format": null};
                                    if (thiz.is_oneOfCharsInString(element, " ,"))
                                    // decimalPos = element.lastIndexOf(",");
                                    // if(decimalPos>=0)
                                        xRet = {"number": true, "format": "fr"};
                                } else {
                                    is_us = thiz.isNumberSep(element, ",");//a non empty element that has "us" format 4,294,967,295.000
                                    if (is_us) {
                                        xRet = {"number": true, "format": null};
                                        if (thiz.is_oneOfCharsInString(element, ",."))
                                            xRet = {"number": true, "format": "us"};
                                    } else {
                                        xRet = {"number": false, "format": null};
                                    }
                                }
                            }
                        } else if (xRet.format == "de") {
                            is_de = thiz.isNumberSep(element, ".");//a non empty element that has a "de" format 4.294.967.295,000
                            if (is_de)
                                return false;//goes to next element
                            else {
                                xRet = {"number": false, "format": null};//its is not a consistent number !!" previous was de but this one is not !"
                                return true;
                            }
                        } else if (xRet.format == "fr") {
                            is_fr = thiz.isNumberSep(element, " ");//a non empty element that has a "de" format 4.294.967.295,000
                            if (is_fr)
                                return false;//goes to next element
                            else {
                                xRet = {"number": false, "format": null};//its is not a consistent number !!" previous was fr but this one is not !"
                                return true;
                            }
                        } else if (xRet.format == "us") {
                            is_us = thiz.isNumberSep(element, ",");//a non empty element that has a "de" format 4.294.967.295,000
                            if (is_us)
                                return false;//goes to next element
                            else {
                                xRet = {"number": false, "format": null};//its is not a consistent number !!" previous was us but this one is not !"
                                return true;
                            }
                        }
                    }
                }
                return false;//goes to next element
            });
            if (!_.isUndefined(failElement))
                xRet = {"number": false, "format": null};
            return xRet;
        }
        ,
        localeStringToNumber: function (str, format) {//returns number or 0 if is unable to convert
            // str - str to convert to number
            // format - us, de or fr -->all other formats return 0
            //ex:FL.common.localeStringToNumber("1,002.3","us") =>1000.3
            //ex:FL.common.localeStringToNumber("1.002,3","de") =>1000.3
            //http://stackoverflow.com/questions/642650/how-to-convert-string-into-float-in-javascript
            // we will use +(str) to cast str to number. We could use parseFloat("554,20") +540. The difference is that parse float ignores invalid chars after the number while cast returns NaN
            if (!isNaN(str))
                return +(str);//always does a cast because str may be a number or a string with a valid number format
            var n = +(str);//tries a simple conversion
            if (isNaN(n)) {//simple conversion fails
                var strNoSepThousands = null;
                var strFinal = null;
                if (format == "de") {//european 1.002.003,4 format
                    strNoSepThousands = str.replace(/\./g, '');
                    strFinal = strNoSepThousands.replace(',', '.');
                } else if (format == "fr") {//french 1 002 003,4 format
                    strNoSepThousands = str.replace(/ /g, '');
                    strFinal = strNoSepThousands.replace(',', '.');
                } else if (format == "us") {//us 1,002,003.4 format
                    strNoSepThousands = str.replace(/,/g, '');
                    strFinal = strNoSepThousands;
                }
                n = +(strFinal);//retries a conversion
                if (isNaN(n))
                    n = 0;
            }
            return n;
        }
        ,
        convertStringVectorToNumber: function (arr, format) {//given an array of strings and a format converts that string to a number to numeric according to string format
            return _.map(arr, function (element) {
                return FL.common.localeStringToNumber(element, format);
            });
        }
        ,
        getServerName: function () {//return server name form url. if server is local host =>test.framelink.co
            //extracts content from url in browser (after // and before the first /)
            //example (in FL.API _login):fl.serverName(FL.common.getServerName());
            var currentURL = window.location.href;
            var server = this.stringAfterLast(currentURL, "//");
            server = this.stringBeforeFirst(server, "/");
            if (server.indexOf(":") > 0)
                server = this.stringBeforeFirst(server, ":");
            if (server == "localhost")
                server = "test.framelink.co";
            FL.common.printToConsole("FL.common.getServerName() -->" + server);
            return server;
        }
        ,
        getMandrillKey: function () {
            var server = this.getServerName();
            var key = "S8_4ExqKlIdZiSBqgiLBUw"; //assume
            if (server == "framelink.co") {//production
                key = "vVC6R5SZJEHq2hjEZfUwRg";
            }
            return key;
        },
        debug: false, //if true shows all FL.common.printToConsole() independentely of filters  ->fallsback to console.log - if false =>only debugFilterToShow will appear
        debugFiltersToShow: null,
        debugFilter: null,//an object with all  filters collected from the app. Each key is a filter with value true or false. To be created by printToConsole()
        printToConsole: function (toDisplay, filter) {//forces (whatever the debug or debugStyle values) a display without line numbers link
            //example of use:FL.common.printToConsole("   => " + apiName + ' : ' + JSON.stringify(superJ),"API");

            // var debugStatus = FL.API.debug;
            // var debugStyleStatus = FL.API.debugStyle;
            // FL.API.debug = true;FL.API.debugStyle = 1;//show FL.common.printToConsole without line numbers link;
            if (filter) {
                this.debugFilter = this.debugFilter || {};
                if (_.isUndefined(this.debugFilter[filter]))
                    this.debugFilter[filter] = true;
            }
            if (FL.common.debug) {//shows all FL.common.printToConsole() even without filter parameter
                console.log(toDisplay);
            } else {
                if (filter) {//if there is no filter, does not display, otherwise checks if there is a reason to display
                    _.each(this.debugFiltersToShow, function (element) {
                        if (element == filter) //checks if print request is inside filters to display (FL.API.debugFiltersToShow)
                            if (this.debugFilter[element])//checks if the current filter is active
                                console.log(" -->" + filter + ":" + toDisplay);
                    }, this);
                }
            }
            // FL.API.debug = debugStatus;
            // FL.API.debugStyle = debugStyleStatus;
        },
        masterDetailItems: null,//used by modalIn
        getBrowserWidth: function () {
            if (window.innerWidth) {
                return window.innerWidth;
            }
            else if (document.documentElement && document.documentElement.clientWidth != 0) {
                return document.documentElement.clientWidth;
            }
            else if (document.body) {
                return document.body.clientWidth;
            }
            return 0;
        }
        ,
        getBase64Width: function (imageData) {
            $("body").append("<img id='hiddenImage' src='" + imageData + "' />");
            var w = $('#hiddenImage').width();
            var h = $('#hiddenImage').height();
            $('#hiddenImage').remove();
            console.log("width:" + w + " height:" + h);
            FL.common.printToConsole("getBase64Width before exit w=" + w + " h=" + h, "abc");
            return w;
        }
        ,
        getBrowser: function () {
            var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if (isChrome)
                return "chrome";
            var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
            if (isSafari)
                return "safari";
            var browser = null;
            var isFF = false;
            var isOpera = false;
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("firefox") > -1) {
                browser = "firefox";
            } else if (ua.indexOf("opera") > -1) {
                browser = "opera";
            } else if (ua.indexOf("msie") > -1 || navigator.appVersion.indexOf('Trident/')) {
                browser = "ie";
            }
            return browser;
        }
        ,
        getDecimalSeparator: function () {//http://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-client-use
            var n = 1.1;
            n = n.toLocaleString().substring(1, 2);
            return n;
        }
        ,
        getLocaleSettings: function () {//http://stackoverflow.com/questions/2388115/get-locale-short-date-format-using-javascript
            var formats = {
                "ar-SA": {mask: "dd/MM/yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "bg-BG": {mask: "dd.M.yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "лв"},
                "ca-ES": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "zh-TW": {mask: "yyyy/M/d", ymdFormat: "YMD", radix: ".", thousands: ",", currency: "NT$"},
                "cs-CZ": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ".", thousands: "space", currency: "Kč"},
                "da-DK": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "de-DE": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "el-GR": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "en-US": {mask: "M/d/yyyy", ymdFormat: "MDY", radix: ".", thousands: ",", currency: "$"},
                "fi-FI": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "fr-FR": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: "space", currency: "€"},
                "he-IL": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "₪ "},
                "hu-HU": {mask: "yyyy. MM. dd.", ymdFormat: "YMD", radix: ".", thousands: ",", currency: "Ft "},
                "is-IS": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "it-IT": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "ja-JP": {mask: "yyyy/MM/dd", ymdFormat: "YMD", radix: ".", thousands: ",", currency: "¥"},
                "ko-KR": {mask: "yyyy-MM-dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},//------------------ok
                "nl-NL": {mask: "d-M-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "nb-NO": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "pl-PL": {mask: "yyyy-MM-dd", ymdFormat: "YMD", radix: ",", thousands: "space", currency: "zł "},
                "pt-BR": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "R$ "},
                "ro-RO": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ru-RU": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "₽"},
                "hr-HR": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sk-SK": {mask: "d. M. yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "sq-AL": {mask: "yyyy-MM-dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "sv-SE": {mask: "yyyy-MM-dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "kr "},
                "th-TH": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "tr-TR": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ur-PK": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "id-ID": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "uk-UA": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "be-BY": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sl-SI": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "et-EE": {mask: "d.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "lv-LV": {mask: "yyyy.MM.dd.", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "€"},
                "lt-LT": {mask: "yyyy.MM.dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "€"},//-------------------------ok
                "fa-IR": {mask: "MM/dd/yyyy", ymdFormat: "MDY", radix: ",", thousands: ".", currency: "$"},
                "vi-VN": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "hy-AM": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "az-Latn-AZ": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "eu-ES": {mask: "yyyy/MM/dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "€"},
                "mk-MK": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "af-ZA": {mask: "yyyy/MM/dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "ka-GE": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "fo-FO": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "hi-IN": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ms-MY": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "kk-KZ": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ky-KG": {mask: "dd.MM.yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sw-KE": {mask: "M/d/yyyy", ymdFormat: "MDY", radix: ",", thousands: ".", currency: "$"},
                "uz-Latn-UZ": {mask: "dd/MM yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "tt-RU": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "pa-IN": {mask: "dd-MM-yy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "Rs. "},
                "gu-IN": {mask: "dd-MM-yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ta-IN": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "te-IN": {mask: "dd-MM-yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "kn-IN": {mask: "dd-MM-yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "mr-IN": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sa-IN": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "mn-MN": {mask: "yy.MM.dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "gl-ES": {mask: "dd/MM/yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "kok-IN": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "syr-SY": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "dv-MV": {mask: "dd/MM/yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-IQ": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "zh-CN": {mask: "yyyy/M/d", ymdFormat: "YMD", radix: ".", thousands: ",", currency: "¥"},//--------------------------ok
                "de-CH": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "CHF "},
                "en-GB": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "£"},
                "es-MX": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "Mex$ "},
                "fr-BE": {mask: "d/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "it-CH": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "CHF "},
                "nl-BE": {mask: "d/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "nn-NO": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "pt-PT": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "sr-Latn-CS": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sv-FI": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "az-Cyrl-AZ": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ms-BN": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "uz-Cyrl-UZ": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-EG": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "zh-HK": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "HK$ "},
                "de-AT": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "en-AU": {mask: "d/MM/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "A$ "},
                "es-ES": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "fr-CA": {mask: "yyyy-MM-dd", ymdFormat: "YMD", radix: ",", thousands: "space", currency: "$"},
                "sr-Cyrl-CS": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-LY": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "zh-SG": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "S$"},
                "de-LU": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "en-CA": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "C$ "},
                "es-GT": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "fr-CH": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "CHF "},
                "ar-DZ": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "zh-MO": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "$"},
                "de-LI": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "en-NZ": {mask: "d/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-CR": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "fr-LU": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-MA": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "en-IE": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},//-----------------------------ok
                "es-PA": {mask: "MM/dd/yyyy", ymdFormat: "MDY", radix: ",", thousands: ".", currency: "$"},
                "fr-MC": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-TN": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "en-ZA": {mask: "yyyy/MM/dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "es-DO": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-OM": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "en-JM": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-VE": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-YE": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "en-029": {mask: "MM/dd/yyyy", ymdFormat: "MDY", radix: ",", thousands: ".", currency: "$"},
                "es-CO": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-SY": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "en-BZ": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-PE": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "S/."},
                "ar-JO": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "en-TT": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-AR": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-LB": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "en-ZW": {mask: "M/d/yyyy", ymdFormat: "MDY", radix: ",", thousands: ".", currency: "$"},
                "es-EC": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-KW": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "en-PH": {mask: "M/d/yyyy", ymdFormat: "MDY", radix: ".", thousands: ",", currency: "₱"},
                "es-CL": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-AE": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-UY": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-BH": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-PY": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ar-QA": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-BO": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-SV": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-HN": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-NI": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-PR": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "am-ET": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},//--------------------------ok
                "tzm-Latn-DZ": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "iu-Latn-CA": {mask: "d/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sma-NO": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "mn-Mong-CN": {mask: "yyyy/M/d", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "gd-GB": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "en-MY": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "prs-AF": {mask: "dd/MM/yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "bn-BD": {mask: "dd-MM-yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "wo-SN": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "rw-RW": {mask: "M/d/yyyy", ymdFormat: "MDY", radix: ",", thousands: ".", currency: "$"},
                "qut-GT": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sah-RU": {mask: "MM.dd.yyyy", ymdFormat: "MDY", radix: ",", thousands: ".", currency: "$"},
                "gsw-FR": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "co-FR": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "oc-FR": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "mi-NZ": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ga-IE": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "se-SE": {mask: "yyyy-MM-dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "br-FR": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "smn-FI": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "moh-CA": {mask: "M/d/yyyy", ymdFormat: "MDY", radix: ",", thousands: ".", currency: "$"},
                "arn-CL": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ii-CN": {mask: "yyyy/M/d", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},//--------------------------ok
                "dsb-DE": {mask: "d. M. yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ig-NG": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "kl-GL": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "lb-LU": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "ba-RU": {mask: "dd.MM.yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "nso-ZA": {mask: "yyyy/MM/dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "quz-BO": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "yo-NG": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ha-Latn-NG": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "fil-PH": {mask: "M/d/yyyy", ymdFormat: "MDY", radix: ".", thousands: ",", currency: "₱"},
                "ps-AF": {mask: "dd/MM/yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "fy-NL": {mask: "d-M-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ne-NP": {mask: "M/d/yyyy", ymdFormat: "MDY", radix: ",", thousands: ".", currency: "$"},
                "se-NO": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "iu-Cans-CA": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sr-Latn-RS": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "si-LK": {mask: "yyyy-MM-dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "sr-Cyrl-RS": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "lo-LA": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "km-KH": {mask: "yyyy-MM-dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "cy-GB": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "bo-CN": {mask: "yyyy/M/d", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "sms-FI": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "as-IN": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ml-IN": {mask: "dd-MM-yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "en-IN": {mask: "dd-MM-yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "or-IN": {mask: "dd-MM-yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "bn-IN": {mask: "dd-MM-yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "tk-TM": {mask: "dd.MM.yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "bs-Latn-BA": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "mt-MT": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "€"},
                "sr-Cyrl-ME": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "se-FI": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},//------------------------------ok
                "zu-ZA": {mask: "yyyy/MM/dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "xh-ZA": {mask: "yyyy/MM/dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "tn-ZA": {mask: "yyyy/MM/dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "hsb-DE": {mask: "d. M. yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "bs-Cyrl-BA": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "tg-Cyrl-TJ": {mask: "dd.MM.yy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sr-Latn-BA": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "smj-NO": {mask: "dd.MM.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "rm-CH": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "smj-SE": {mask: "yyyy-MM-dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "quz-EC": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "quz-PE": {mask: "dd/MM/yyyy", ymdFormat: "DMY", radix: ".", thousands: ",", currency: "S/. "},
                "hr-BA": {mask: "d.M.yyyy.", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sr-Latn-ME": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "sma-SE": {mask: "yyyy-MM-dd", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "en-SG": {mask: "d/M/yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "ug-CN": {mask: "yyyy-M-d", ymdFormat: "YMD", radix: ",", thousands: ".", currency: "$"},
                "sr-Cyrl-BA": {mask: "d.M.yyyy", ymdFormat: "DMY", radix: ",", thousands: ".", currency: "$"},
                "es-US": {mask: "M/d/yyyy", ymdFormat: "MDY", radix: ",", thousands: ".", currency: "$"},
            };
            var locCode = formats[navigator.language];//https://www.microsoft.com/resources/msdn/goglobal/default.mspx
            // locCode = formats["hu-HU"];
            // locCode = formats["es-MX"];
            // locCode = formats["fr-FR"];
            // locCode = formats["he-IL"];
            // locCode = formats["en-US"];
            // locCode = formats["pl-PL"];
            var formatMask = locCode || {
                    mask: "yyyy-MM-dd",
                    ymdFormat: "YMD",
                    radix: ".",
                    thousands: ",",
                    currency: "$"
                };//'dd/MM/yyyy';
            return formatMask;
        },
        setApplicationSettingsFromSystem: function () {
            this.appsettings.radixpoint = this.getLocaleSettings().radix; //this.getDecimalSeparator();//":";
            thousandsSeparator = this.getLocaleSettings().thousands;
            if (this.appsettings.radixpoint == "." && thousandsSeparator == ".") //clash =>force distinction
                thousandsSeparator = ",";
            if (this.appsettings.radixpoint == "," && thousandsSeparator == ",") //clash =>force distinction
                thousandsSeparator = ".";
            this.appsettings.thousandsSeparator = thousandsSeparator;
            this.appsettings.dateformat = this.getLocaleSettings().ymdFormat;
            this.appsettings.currency = this.getLocaleSettings().currency;
        },
        getDOMContentFromId: function (id) {
            var content = null;
            var domTarget = "#" + id;
            var $domTarget = $(domTarget);
            if ($domTarget.length === 0) {//not in DOM
                alert("FL.common.getDOMContentFromId ERROR - id=" + id + " not in DOM");
                return null;
            }
            var tagElement = $domTarget.prop("tagName");
            if (tagElement === "INPUT")
                content = $domTarget.val();
            else
                content = $domTarget.text();
            return content;
        },
        setDOMContentToId: function (id, value) {
            var content = null;
            var domTarget = "#" + id;
            var $domTarget = $(domTarget);
            if ($domTarget.length === 0) {//not in DOM
                alert("FL.common.setDOMContentToId ERROR - id=" + id + " not in DOM");
                return null;
            }
            var tagElement = $domTarget.prop("tagName");
            if (tagElement === "INPUT")
                $domTarget.val(value);
            else {
                var targetExistingContent = $domTarget.html();//if is an anchor it may be:<a ...>sometext<span class="caret"></span></a></a> - we want to change sometext but keep the span !
                if (targetExistingContent) {
                    var existingHTML = null;
                    var existingHTMLPos = targetExistingContent.indexOf("<");
                    if (existingHTMLPos > 0) {
                        existingHTML = targetExistingContent.substring(existingHTMLPos);
                        $domTarget.html(value + existingHTML);
                    } else {
                        $domTarget.text(value);
                    }
                } else {
                    $domTarget.text(value);
                }
             }
            return content;
        },
        checkHTML: function (html) {
            var doc = document.createElement('div');
            doc.innerHTML = html;
            return ( doc.innerHTML === html );
        },
        testFunc: function (x) {
            alert("FL.common.test() -->" + x);
        }
    };
})();
FL["topics"] = {};
jQuery.Topic = function (id) {//https://gist.github.com/addyosmani/1321768 publisher/subscriber
    //publishing ex.	$.Topic( 'signInDone' ).publish( 'hello Sign In !!!' );
    //subscribe example:
    // $.Topic( 'signInDone' ).subscribe( fn1 );//where-> var fn1 = function(par1){alert("par1 says:"+par1);};
    // $.Topic( 'signInDone' ).subscribe( fn2 );//where-> var fn2 = function(par1){alert("par2 ---->says:"+par1);};
    var callbacks,
        topic = id && FL.topics[id];
    if (!topic) {
        callbacks = jQuery.Callbacks();
        topic = {
            publish: callbacks.fire,
            subscribe: callbacks.add,
            unsubscribe: callbacks.remove
        };
        if (id) {
            FL.topics[id] = topic;
        }
    }
    return topic;
};
// BootstrapDialog.alert("FrameLink"); //http://nakupanda.github.io/bootstrap3-dialog/
// BootstrapDialog.confirm("FrameLink menus ?"); //http://nakupanda.github.io/bootstrap3-dialog/
//  BootstrapDialog.confirm = function(message, callback,options) {//http://nakupanda.github.io/bootstrap3-dialog/

// BootstrapDialog.confirm = function(message,callback,options) {//http://nakupanda.github.io/bootstrap3-dialog/	
// 	new BootstrapDialog({
// 		//element = _.extend(element,updatedElement);//passed by reference
// 		title: _.extend({title:"CONFIRMATION"},options).title,
// 		message: message,
// 		// form: '<label>Email </label><input type="text" id="titleDrop"><br><label>User Name</label><input type="text" id="descriptionDrop">',//form,
// 		// type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
// 		type: _.extend({type:'type-primary' },options).type, //'type-primary', 'type-info' .'type-success','type-warning','type-danger' 
// 		draggable:true,
// 		data: {
// 			'callback': callback
// 		},
// 		buttons: [{
// 				label: _.extend({button1:"Cancel"},options).button1,
// 				action: function(dialog) {
// 					typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
// 					dialog.close();
// 				}
// 			}, {
// 				label:  _.extend({button2:"Ok"},options).button2,
// 				cssClass: _.extend({cssButton2:"btn-primary"},options).cssButton2,
// 				action: function(dialog) {
// 					typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
// 					dialog.close();
// 				}
// 			}
// 		]
// 	}).open();
// };

FL["clone"] = function (obj) {//http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object/5344074#5344074
    var ss = JSON.stringify(obj);
    return JSON.parse(ss);
    // return JSON.parse(JSON.stringify(obj));
};
FL["domInject"] = function (id, htmlContent) {//clean and replace content by htmlContent
    var target = "#" + id;
    var $id = $(target);
    $id.empty();//removes the child elements of the selected element(s).
    if (htmlContent)
        $id.append($(htmlContent));//with $(htmlContent) we convert htmlStr to a JQuery object
};
// FL["validateEmail"] = function(email) {
// 	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// 	return re.test(email);
// };
FL["domain"] = null;
FL["mixPanelEnable"] = false;
FL["mix"] = function (mixEvent, propObj) {//if FL.mixPanelEnable = true, trigger  events  to mix panel
    //examples:
    //		FL.mix("Entering",{});
    //		FL.mix("ChangeStyle",{"newStyle":FL.currentStyle});
    //		FL.mix("TourIcon",{step:FL.setNextPrevOfCurrentStep()});
    if (FL.mixPanelEnable) {
        // mixpanel.track("TourIcon", {//-----------------------------------------------mixpanel
        // 	"step":FL.setNextPrevOfCurrentStep()
        // });
        alert("calls mixpanel.track for event=" + mixEvent + " ->props=" + JSON.stringify(propObj));
        //mixpanel.track(mixEvent,propObj);
    }
};