FL = (typeof FL === 'undefined') ? {} : FL;
FL["modal"] = (function () {//name space FL.modalIn
    var internalTest = function (x) {//
        alert("internalTest() -->" + x);
    };
    //-------- END OF private functions ------------------
    return {
        xx: "test",
        externalTest: function (x) {
            internalTest(x);
        },
        bufferObj: {},// to be used  for masterDetailItems of each template. Via public. Warrants separation of content among diferent templates
        setToBuffer: function (bufferName, value) {//used to send parameters (only once) from any module to any module via global window
            this.bufferObj[bufferName] = value;
        },
        getFromBuffer: function (bufferName) {//used to send parameters (only once) from any module to any module via global window
            return this.bufferObj[bufferName];
        },
        Box: function (title, templateName, data, options, makeModalCB) {
            var that = this;//This is a workaround for an error in the ECMAScript Language Specification which causes this to be set incorrectly for inner functions.
            var getDialogHTML = function (modalId, stackLevel, title, htmlIn, options) {
                //to work in IE and Firefox always enclose button inside a tag. not a tag inside button tag. - http://stackoverflow.com/questions/12856851/jquery-modal-window-only-working-on-chrome-but-not-ff-ie9
                // CORRECT - Button inside a ref
                //  <div class="btn-group" style="margin: 0 5px 0 0;">
                //     <a href="#?w=385" rel="login_popup" class="poplight" style="text-decoration:none;"><button type="button">Login</button></a>
                //  </div>
                <!-- /btn-group -->
                // INCORRECT - ref inside a button tag
                //  <div class="btn-group" style="margin: 0 5px 0 0;">
                //      <button class="btn btn-small btn-info" type="button"><a href="#?w=385" rel="login_popup" class="poplight" style="text-decoration:none;">Login</a></button>
                //  </div>
                <!-- /btn-group -->
                var zIndexContent = "";
                if (stackLevel > 1) zIndexContent = "z-Index:" + (1000 * stackLevel);//place a modal inside a modal
                var iconHTML = "";
                if (options.icon) iconHTML = '<i class="glyphicon glyphicon-' + options.icon + '"></i>';
                var button1HTML = "";
                if (options.button1) {
//                    button1HTML = '<a href="#" id="__FLDialog_button1" data-dismiss="modal" class="btn">' + options.button1 + '</a>';
                    button1HTML = '<a href="#" id="' + modalId + '_button1" data-dismiss="modal" class="btn">' + options.button1 + '</a>';
                }
                var button2HTML = "";
                if (options.button2) { //this button has the parsley validate (like APPLE ->OK at right)
//                    button2HTML = '<a href="#" id="__FLDialog_button2" class="btn btn-' + options.type + ' validate">' + options.button2 + '</a>';
                    button2HTML = '<a href="#" id="' + modalId + '_button2" class="btn btn-' + options.type + ' ">' + options.button2 + '</a>';
                }
                var z = '<div class="modal-dialog" style="position:absolute;margin:0;width:'+options.width+';top:'+options.top+';left:'+options.left+';">';
                //var before = '<div class="modal fade" id="' + modalId + '_modal" style="' + zIndexContent + '">' +
                var before = '<div class="modal fade" id="' + modalId + '_modal" >' +
                    '<div class="modal-dialog" style="position:absolute;margin:0;width:'+ options.width +';top:'+ options.top +';left:'+ options.left +';">' +
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
            var prepareButtonsClick = function (makeModalCB, $modal, modalId, templateName, dataObj, modalIn) {
                var button1Id = modalId + "_button1";
                var button2Id = modalId + "_button2";
                templateName = templateName;//to pass value by closure to click events
                $("#" + button1Id).off('click');
                $modal.on("click", "#" + button1Id, function () {
                    FL.common.printToConsole("Button 1 was clicked", "modalIn");
                    $modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    result(false, templateName, modalIn);
                });
//                $("#__FLDialog_button2").off('click');
                $("#" + button2Id).off('click');
                $modal.on("click", "#" + button2Id, function () {
                    FL.common.printToConsole("Button 2 was clicked", "modalIn");
                    $modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    result(true, templateName, modalIn);
                });
                $modal.on('hidden.bs.modal', function () {
                    //alert("makeModal - You closed the window !!!");
                    FL.common.printToConsole("Window was closed - the same as cancel", "modalIn");
                    result(false, templateName, modalIn);
                });
            };
            var getAllFieldsFromDisplay = function (modalIn) {
                // returns an object similar to masterJson with current values retrieved from the display
                var retObj = {};
                var masterJson = modalIn.data;
                _.each(masterJson.master, function (value, key) {
                    if (key.substr(key.length - 8) != "_options") {//dropdown options are excluded
                        var fieldContent = modalIn.getFieldFromDisplay(key);
                        retObj[key] = fieldContent;
                    }
                }, this);
                return retObj;
            };
            var checkChange = function (modalIn) {
                // updates modalIn changed status is any field was changed -
                var beforeObj = modalIn.previousFields;
                if (!beforeObj)//the first time it runs previousFiels is null (in the constructor) =>nothing to do
                    return;
                modalIn.changed = false; //ir is reevaluated each time - allowing a change=true to become change=false
                var masterJson = modalIn.data;
                _.each(masterJson.master, function (value, key) {
                    if (key.substr(key.length - 8) != "_options") {//dropdown options are excluded
                        var previousFieldContent = beforeObj[key];
                        var fieldContent = modalIn.getFieldFromDisplay(key);
                        if (previousFieldContent != fieldContent)
                            modalIn.changed = true;
                    }
                }, this);
            };
            var fillMasterForTemplate = function (templateName, masterJson, modalIn) {
                // returns masterJson with new values retrieved from the template for ids corresponding to the keys in masterJson
                _.each(masterJson, function (value, key) {
                    if (key.substr(key.length - 8) == "_options") {//extract from a dropdown
                        //tbd
                    } else {
                        var fieldContent = modalIn.getFieldFromDisplay(key);
                        modalIn.setFieldToStore(key, fieldContent);
                    }
                });
            };
            var result = function (bOk, templateName, modalIn) {
                if (bOk) {//button 2 was pressed
                    //fillMasterForTemplate(templateName, FL.common.masterDetailItems.master, modalIn);
                    fillMasterForTemplate(templateName, FL.modal.getFromBuffer(templateName).master, modalIn);
                    return makeModalCB(true, FL.modal.getFromBuffer(templateName), modalIn.changed);
                } else {//button1 was pressed
                    return makeModalCB(false, FL.modal.getFromBuffer(templateName), modalIn.changed);
                }
            };
            var abc = function () {//test to show access to public and private members
                FL.common.printToConsole("INSIDE ABC", "modalIn");
                //we have access to all var functions and all Box paramenters
                FL.common.printToConsole("INSIDE ABC--->title=" + title + " templateName=" + templateName, "modalIn");
                that.test("inside abc");//Douglas Crockford workaround the ECMAScript Language Specification error that prevents access to for inner functions.
                FL.common.printToConsole("INSIDE ABC--->this.modalId=" + that.modalId, "modalIn");
                z = 32;

            };
            var setEventsForCombo = function (headOfOptionsFieldName) {
                var headOfOptionsFieldName = headOfOptionsFieldName;//to pass by closure
                var optionsFieldName = headOfOptionsFieldName + "_options";
                var selectorOptions = templateName + "_" + optionsFieldName + " li";
                var $selectedOptions = $("#" + selectorOptions);
                $selectedOptions.each(function (index, value) {
                    var $optionItem = $("#" + value.id);
                    $optionItem.off('click');
                    $optionItem.on("click", {
                        modalIn: that,
                        selected: that.data.master[headOfOptionsFieldName + "_options"][index]
                    }, function (e) {
                        var optionText = e.data.selected.text;  // e.data.selected;
                        if (_.has(options, "option")) {
                            //FL.common.printToConsole("*******===========================>options have a option key !!!!", "modalIn");
                            var fieldName = FL.common.stringBeforeLast(value.id, "_");
                            fieldName = FL.common.stringAfterFirst(fieldName, "_");
                            if (_.has(options.option, fieldName)) {
                                options.option[fieldName](e.data.modalIn, e.data.selected);
                                FL.common.printToConsole("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% returned from option =" + fieldName, "modalIn");
                                e.data.modalIn.refreshEvents();//so that user does not have to do it in option code
                            }
                        }
                        var contentOfheadOfOptions = e.data.modalIn.setFieldToDisplay(headOfOptionsFieldName, optionText + " ");
                        checkChange(e.data.modalIn);//compares displayed fields with previousFields
                        FL.common.printToConsole("*******====================>user clicked option event for option =" + value.id + " --->changed=" + e.data.modalIn.changed + " --->text=" + optionText, "modalIn");
                    });
                    var z = 32;
                });

            };
            this.getOptions = function (optionsFieldName) {
                //return FL.common.masterDetailItems.master[optionsFieldName];
                return FL.modal.getFromBuffer(this.templateName).master[optionsFieldName];
            };
            this.setOptions = function (optionsFieldName, optionsArr) {
                if (optionsFieldName.substr(optionsFieldName.length - 8) != "_options") {
                    alert("modalIn object ERROR in method setOptions -->optionsFieldName parameter must have the format <name>_options !!! Instead it is->" + optionsFieldName);
                    return;
                }
                //FL.common.masterDetailItems.master[optionsFieldName] = optionsArr;
                var dataObj = FL.modal.getFromBuffer(this.templateName);
                dataObj.master[optionsFieldName] = optionsArr;
                FL.modal.setToBuffer(this.templateName, dataObj);

                var $dropDownSelectOptions = $("#" + this.templateName + "_" + optionsFieldName);
                $dropDownSelectOptions.empty();//removes the options.
                _.each(optionsArr, function (element, index) {
                    var id = templateName + "_" + optionsFieldName + "_" + index;
                    $dropDownSelectOptions.append("<li id='" + id + "'><a href='#'>" + element.text + "</a></li>");
                });
            };
            this.test = function (display) {
                FL.common.printToConsole("************************ " + display + " test ***************************", "modalIn");
            };
            this.checkChanged = function (fieldName) {
                var z1 = this.getFieldFromDisplay(fieldName);
                var z2 = this.getFieldFromStore(fieldName);
                if (this.getFieldFromDisplay(fieldName) != this.getFieldFromStore(fieldName))
                    changed = true;
            };
            this.resetChanged = function (fieldName) {
                changed = false;
            };
            this.getFieldFromDisplay = function (fieldName) {
                var id = this.templateName + "_" + fieldName;
                var content = FL.common.getDOMContentFromId(id).trim();
                return content;
            };
            this.setFieldToDisplay = function (fieldName, value) {
                var id = this.templateName + "_" + fieldName;
                var content = FL.common.setDOMContentToId(id, value);
            };
            this.getFieldFromStore = function (fieldName) {
                //var fieldContent = FL.common.masterDetailItems.master[fieldName];
                var fieldContent = FL.modal.getFromBuffer(this.templateName).master[fieldName];
                return fieldContent;
            };
            this.setFieldToStore = function (fieldName, value) {
                //FL.common.masterDetailItems.master[fieldName] = value;
                var dataObj = FL.modal.getFromBuffer(this.templateName);
                dataObj.master[fieldName] = value;
                FL.modal.setToBuffer(this.templateName, dataObj);

            };
            this.get = function (fieldName) {
                var fieldContent = this.getFieldFromDisplay(fieldName);
                this.setFieldToStore(fieldName, fieldContent);
                return fieldContent;
            };
            this.set = function (fieldName, value) {
                this.setFieldToDisplay(fieldName, value);
                this.setFieldToStore(fieldName, value);
            };
            this.refreshEvents = function () {//prepares click and blur events for all fields (includes dropdown headers, not options)
                FL.common.printToConsole("---------- refreshEvents ---------------------------------------------------------------->changed=" + this.changed, "modalIn");
                var options = this.options;
                //checkChange(this);//compares displayed fields with previousFields
                var master = this.data.master; //to pass to _each by closure
                _.each(this.data.master, function (value, key) {
                    FL.common.printToConsole("Loading events for field:" + key, "modalIn");
                    var selector = templateName + "_" + key;
                    var $field = $("#" + selector);
                    var options = this.options;
                    if (key.substr(key.length - 8) != "_options") {//Load events for not combo
                        FL.common.printToConsole("Loading preField events for field:" + key, "modalIn");
                        $field.off('click');
                        $field.on("click", {modalIn: this}, function (e) {
                            var id = $field.prop("id");
                            FL.common.printToConsole("====================>user clicked prefield event for field=" + id, "modalIn");
                            if (_.has(options, "preField")) {
                                var fieldName = FL.common.stringAfterLast(id, "_");
                                if (_.has(options.preField, fieldName)) {
                                    options.preField[fieldName](e.data.modalIn);
                                }
                            }
                            if (master[key + "_options"]) {
                                FL.common.printToConsole("==========================>the field " + key + " is the head of a combo - we will load events for this combo", "modalIn");
                                //abc();
                                setEventsForCombo(key);
                            }
                        });
                        FL.common.printToConsole("Loading posField events for field:" + key, "modalIn");//Load blur events for combo
                        $field.off('blur');
                        $field.on("blur", {modalIn: this}, function (e) {
                            var id = $field.prop("id");
                            if (_.has(options, "posField")) {
                                var fieldName = FL.common.stringAfterLast(id, "_");
                                if (_.has(options.posField, fieldName)) {
                                    options.posField[fieldName](e.data.modalIn);
                                    e.data.modalIn.refreshEvents();//so that coder does not have to do it in posField code
                                }
                            }
                            checkChange(e.data.modalIn);//compares displayed fields with previousFields
                            FL.common.printToConsole("====================>user exited (posField event) field " + id + " changed=" + e.data.modalIn.changed, "modalIn");
                        });
                    }
                }, this);
            };
            this.show = function () {
                var dataObj = this.data;
                //FL.common.masterDetailItems = dataObj;
                FL.modal.setToBuffer(this.templateName, dataObj);//places the data in a slot accessible via public
                var fullHTML = this.compiled(dataObj);
                this.$modalDialog.empty().append(fullHTML);//places final HTML  (with empty dropboxes...) in slot
                var templateName = this.templateName;

                //for master, loads dropdown options in slot - for each <fieldName>_option field
                _.each(dataObj.master, function (value, key) {
                    if (key.substr(key.length - 8) == "_options") {//extract from a dropdown
                        this.setOptions(key, value);
                    }
                }, this);

                var $modal = $('#' + this.modalId + "_modal");
                form = $("#form_" + this.templateName);
                //form.parsley();
                this.refreshEvents();//prepares click and blur events for all fields (includes dropdown headers, not options)
                //form.parsley().validate();
                if (makeModalCB) {
                    prepareButtonsClick(makeModalCB, $modal, this.modalId, this.templateName, dataObj, this);
                } else {
                    FL.common.printToConsole("makeModal ----->No callback");
                    $modal.modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                }
                $modal.modal('show');//to launch it immediatly when calling makeModal
                this.previousFields = getAllFieldsFromDisplay(this);//for all fields (dropdown options not included..) gets the last displayed values
            };
            // function modalIn(title, templateName, data, options, makeModalCB) {//the constructor
            this.title = title;
            this.templateName = templateName;
            this.data = data;
            this.options = options;
            if(this.options.width){
                if(!this.options.left){//because left is missing we will center it
                    this.options.left = (50-parseInt(this.options.width)/2)+"%";
                }
            }
            this.options = _.extend({
                icon: null,
                type: "success",
                button1: "Cancel",
                button2: "Ok",
                width: "35%",
                top:"10%",
                left:"33%"
            }, options);
            this.modalId = "_modalIn_" + templateName;
            this.changed = false;//gives the form status - true=>changed from beginning or last reset
            this.previousFields = null; //this will receive an object with the content of all displayed fields (not dropdown options)
            var rawTemplate = $("#" + templateName).html();
            var stackLevel = 2;
            var modalTemplate = getDialogHTML(this.modalId, stackLevel, title, rawTemplate, this.options);//adjust htmlIn to modal form adding title and buttons
            FL.common.printToConsole(modalTemplate, "modalIn");
            this.compiled = _.template(modalTemplate);
            this.$modalDialog = $("#" + this.modalId);
            if (this.$modalDialog.length === 0) {//not in DOM
                var $domBase = $("#_modalIn");
                if ($domBase.length === 0) {//not in DOM
                    $('body').append("<div id='_modalIn'></div>");
                    $domBase = $("#_modalIn");
                }
                $domBase.append("<div id='" + this.modalId + "'></div>"); //not working because parsley needs the dom ready
                this.$modalDialog = $("#" + this.modalId);
            }
            return this;
        },
        externalTest2: function (x) {
            internalTest("Test2--->" + x);
        },
    };
})
();
