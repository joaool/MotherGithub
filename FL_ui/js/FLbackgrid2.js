//jo.js to test widgets in backgrid
var FL = FL || {};

$.mockjax({
    url: '/names/*',
    type: 'GET',
    responseTime: 250,
    response: function (body) {
        var searchTerm = body.url.split('/')[2];
        var lookupObj = FL.common.generalBufferArr[0];
        //var fCN = FL.common.generalBufferArr[1];
        //alert("mockjax  ***********************************  specialTypeDef=" + JSON.stringify(lookupObj.getColumn(fCN) + "\n lookupFCN=" + fCN));
        var optionsArr = lookupObj.getColumn();//extract the default column - set in FL.grid.displayDefaultGrid inside openTable promise
        var optionsArrOfObj = _.map(optionsArr, function (el) {
            return {name: el};
        });
        this.status = 200;
        this.responseText = JSON.stringify(_.filter(optionsArrOfObj, function (obj) {
            return obj.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1;
        }));
        //this.responseText = JSON.stringify(_.filter([
        //    {
        //        name: "Franz"
        //    },
        //    {
        //        name: "Theodore"
        //    },
        //    {
        //        name: "Matilda"
        //    },
        //    {
        //        name: "Roosevelt"
        //    },
        //    {
        //        name: "Ferdinand"
        //    },
        //    {
        //        name: "Dillon"
        //    },
        //    {
        //        name: "Sheila"
        //    },
        //    {
        //        name: "Francine"
        //    }
        //], function (obj) {
        //    return obj.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1;
        //}));
    }
});
FL["bg"] = (function () {//name space FL.common
    validatePhone = function (phone) {
        // var re = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;//(123) 456-7890
        var re = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{3}(-|\s)\d{3}$/;//(123) 456-789-012
        return re.test(phone);
    };
    validatePhone2 = function validatePhone(phoneVal) {//https://saikiran78.wordpress.com/2011/04/20/phone-number-validation-using-jquery/
        var phoneRegExp = /^((\+)?[1-9]{1,2})?([-\s\.])?((\(\d{1,4}\))|\d{1,4})(([-\s\.])?[0-9]{1,12}){1,2}$/;
        //http://stackoverflow.com/questions/16385366/masking-input-with-optional-alphabet-prefix-to-a-phone-number-format
        var numbers = phoneVal.split("").length;
        if (10 <= numbers && numbers <= 20 && phoneRegExp.test(phoneVal)) {
            return true;
        }
        return false;
    };
    validateDatetime = function (datetime) {//ex "01/06/2015 12:00 am"
        var bRet = false;
        var date = datetime.substr(0, 10);
        if (FL.common.is_ValidDate(date)) {
            var space = datetime.substr(10, 1);
            if (space = " ") {//a space is in position 10
                var timeAnd = datetime.substr(11);//ex "12:00 am"
                var time = datetime.substr(11, 5);
                var re = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;//HH:MM
                if (re.test(time)) {//format correct for 12:00
                    if (timeAnd.lenght == 5) {
                        bRet = true;//the format is "01/06/2015 22:14"
                    } else {
                        space = timeAnd.substr(5, 1);
                        if (space = " ") {//a space is in position 5 of "12:00 am"
                            var amPm = timeAnd.substr(6);
                            var re = /^[APap][mM]$/;//am
                            if (re.test(amPm)) {//format correct for am or pm
                                bRet = true;//the format is "01/06/2015 22:14 am"
                            }
                        }
                    }
                }
            }
        }
        return bRet;
    };
    var setDateformat = function () {//possible values:"YMD","MDY","DMY"
        var oRet = {datetimepicker: "yy/mm/dd", format: "YMD"};//default value
        if (FL.bg.dateFormat == "MDY")
            oRet = {datetimepicker: "mm/dd/yy", format: "MDY"};
        else if (FL.bg.dateFormat == "DMY")
            oRet = {datetimepicker: "dd/mm/yy", format: "DMY"};
        return oRet;
    };
    var NumberCellEditor = Backgrid.InputCellEditor.extend({
        initialize: function (options) {
            Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
            var decimals = NumberCellEditor.prototype.decimals;//4;
            var decimalMask = ("0000000000000000000").substr(0, decimals);
            var mask = "#" + FL.common.appsettings.thousandsSeparator + "##0" + FL.common.appsettings.radixpoint + decimalMask;//ex."#.##0,00"
            var cellVal = $(this.el).val();
            $(this.el).focus(function () {
                var paddedValue = function (cellValStr, decimals) {
                    var xRet = cellValStr;
                    var radixpoint = FL.common.appsettings.radixpoint;
                    var decimalPos = cellValStr.indexOf(radixpoint);
                    if (decimalPos >= 0) {
                        var tail = FL.common.getTail(cellValStr);
                        var intValueStr = cellValStr.substr(0, decimalPos);
                        if (tail.length < decimals) {
                            tail = tail.pad(decimals, "0", 1);
                        }
                        ;
                        xRet = intValueStr + radixpoint + tail;
                    }
                    return xRet
                };
                var cellVal = $(this).val();
                var paddedCell = paddedValue(cellVal, decimals);
                console.log('------------->on focus ==>' + $(this).val() + " -->" + paddedCell);

                $(this).val(paddedCell);
                $(this).select();
            });
            var options = {
                reverse: true,
                maxlength: false,
                onKeyPress: function (val, event, currentField, options) {
                    console.log('------------->An key was pressed!:', val, ' event: ', event, 'currentField: ', currentField, ' options: ', options);
                    console.log('------------->current value=' + val);
                }
            };
            $(this.el).mask(mask, options);//https://github.com/igorescobar/jQuery-Mask-Plugin
        },
        render: function (model) {
            var cellVal = this.model.get(this.column.get("name"));//extracts from model
            cellVal = this.formatter.fromRaw(cellVal);//converts to cell
            this.$el.val(cellVal);
            console.log("render number....<" + cellVal + ">-->" + JSON.stringify(this.model.toJSON()));
            this.delegateEvents();
            return this;
        }
    });
    var CurrencyCellEditor = Backgrid.InputCellEditor.extend({
        initialize: function (options) {
            Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
            //alert("CurrencyCellEditor.initialize ");
            var decimals = CurrencyCellEditor.prototype.decimals;
            var currency = CurrencyCellEditor.prototype.currency;
            var thousandsSeparator = FL.common.appsettings.thousandsSeparator;
            if (thousandsSeparator == "space")
                thousandsSeparator = " ";
            var decimalMask = ("0000000000000000000").substr(0, decimals);
            var mask = "#" + thousandsSeparator + "##0" + FL.common.appsettings.radixpoint + decimalMask;//ex."#.##0,00"
            var cellVal = $(this.el).val();
            $(this.el).focus(function () {
                var paddedValue = function (cellValStr, decimals) {
                    var xRet = cellValStr;
                    var radixpoint = FL.common.appsettings.radixpoint;
                    var decimalPos = cellValStr.indexOf(radixpoint);
                    if (decimalPos >= 0) {
                        var tail = FL.common.getTail(cellValStr);
                        var intValueStr = cellValStr.substr(0, decimalPos);
                        if (tail.length < decimals) {
                            tail = tail.pad(decimals, "0", 1);
                        }
                        xRet = intValueStr + radixpoint + tail;
                    }
                    return xRet
                };
                var cellVal = $(this).val();
                var paddedCell = paddedValue(cellVal, decimals);
                console.log('------------->on focus ==>' + $(this).val() + " -->" + paddedCell);
                var cellNoPre_NoPos = FL.common.minusAndPointInEmbededDigit(paddedCell) + FL.common.extractContentBetweenFirstAndLastDigit(paddedCell);
                $(this).val(cellNoPre_NoPos);
                //$(this).FLnumeric("JOJO",true,",");
                $(this).mask(mask, options);//modified https://github.com/igorescobar/jQuery-Mask-Plugin   1234512345 123

                $(this).select();
            });
            //http://www.mredkj.com/javascript/numberFormat.html
            var options = {
                reverse: true,
                maxlength: false,
                onKeyPress: function (val, event, currentField, options) {
                    FL.common.printToConsole('------------->A key was pressed! currentValue=' + val, "bg");
                    //console.log('------------->An key was pressed!:', val, ' event: ', event, 'currentField: ', currentField, ' options: ', options);
                    //console.log('------------->current value=' + val);
                }
            };
            //$(this.el).mask(mask, options);//https://github.com/igorescobar/jQuery-Mask-Plugin   1234512345 123
            //$(this.el).FLnumeric("JOJO",true,",");
            //var z= this.$el.find("selector");
            //$("#display2").val("11111111");
            //$("#display2").FLnumeric("JOJO",true,",");
            //this.$el.val("111111");
            //this.render();
        },
        render: function (model) {
            var cellVal = this.model.get(this.column.get("name"));//extracts from model
            cellVal = this.formatter.fromRaw(cellVal);//converts to cell
            this.$el.val(cellVal);
            //this.$el.FLnumeric("JOJO",true,",");
            console.log("render number....<" + cellVal + ">-->" + JSON.stringify(this.model.toJSON()));
            this.delegateEvents();
            return this;
        }
    });
    var IntegerCellEditor = Backgrid.InputCellEditor.extend({
        initialize: function (options) {
            Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
            //alert("IntegerCellEditor.initialize");
            var mask = "#" + FL.common.appsettings.thousandsSeparator + "##0";//ex."#.##0"
            var cellVal = $(this.el).val();
            $(this.el).focus(function () {
                $(this).select();
            });
            var options = {
                reverse: true,
                maxlength: false,
                onKeyPress: function (val, event, currentField, options) {
                    console.log('------------->An key was pressed!:', val, ' event: ', event, 'currentField: ', currentField, ' options: ', options);
                    console.log('------------->current value=' + val);
                }
            };
            $(this.el).mask(mask, options);//https://github.com/igorescobar/jQuery-Mask-Plugin
        },
        render: function (model) {
            var cellVal = this.model.get(this.column.get("name"));//extracts from model
            cellVal = this.formatter.fromRaw(cellVal);//converts to cell
            this.$el.val(cellVal);
            console.log("render number....<" + cellVal + ">-->" + JSON.stringify(this.model.toJSON()));
            this.delegateEvents();
            return this;
        }
    });
    var PercentCellEditor = Backgrid.InputCellEditor.extend({
        initialize: function (options) {
            Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
            var decimals = CurrencyCellEditor.prototype.decimals;
            // var currency = CurrencyCellEditor.prototype.currency;

            var decimalMask = ("0000000000000000000").substr(0, decimals);
            var mask = "#" + FL.common.appsettings.thousandsSeparator + "##0" + FL.common.appsettings.radixpoint + decimalMask;//ex."#.##0,00"
            var cellVal = $(this.el).val();
            $(this.el).focus(function () {
                var paddedValue = function (cellValStr, decimals) {
                    var xRet = cellValStr;
                    var radixpoint = FL.common.appsettings.radixpoint;
                    var decimalPos = cellValStr.indexOf(radixpoint);
                    if (decimalPos >= 0) {
                        var tail = FL.common.getTail(cellValStr);
                        var intValueStr = cellValStr.substr(0, decimalPos);
                        if (tail.length < decimals) {
                            tail = tail.pad(decimals, "0", 1);
                        }
                        ;
                        xRet = intValueStr + radixpoint + tail;
                    }
                    return xRet
                };
                var cellVal = $(this).val();
                var paddedCell = paddedValue(cellVal, decimals);
                console.log('------------->on focus ==>' + $(this).val() + " -->" + paddedCell);

                $(this).val(paddedCell);
                $(this).select();
            });
            var options = {
                reverse: true,
                maxlength: false,
                onKeyPress: function (val, event, currentField, options) {
                    console.log('------------->An key was pressed!:', val, ' event: ', event, 'currentField: ', currentField, ' options: ', options);
                    console.log('------------->current value=' + val);
                }
            };
            $(this.el).mask(mask, options);//https://github.com/igorescobar/jQuery-Mask-Plugin
        },
        render: function (model) {
            var cellVal = this.model.get(this.column.get("name"));//extracts from model
            cellVal = this.formatter.fromRaw(cellVal);//converts to cell
            this.$el.val(cellVal);
            console.log("render number....<" + cellVal + ">-->" + JSON.stringify(this.model.toJSON()));
            this.delegateEvents();
            return this;
        }
    });
    // });
    //http://jsfiddle.net/bh5nd/
    //http://jsfiddle.net/Cj7UG/1/
    var DateTimeCellEditor = Backgrid.InputCellEditor.extend({
        //http://stackoverflow.com/questions/30115158/check-if-backgrid-cell-was-edited
        events: {
            "change": "onDatePickerValueChange",
            "keydown": "onKeydown"
        },
        onDatePickerValueChange: function (e) {
            var command = new Backgrid.Command(e);
            var changedVal = this.$el.val();
            console.log('onDatePickerValueChange CurrentCell with content: >' + changedVal + "<---" + JSON.stringify(this.model.toJSON()));
            var isoDate = this.formatter.toRaw(changedVal);//transform cell value to isoDate
            this.model.set(this.column.get("name"), isoDate);//places isodate into the model
            var val = this.formatter.fromRaw(changedVal);
            this.onKeydown(e);
        },
        onKeydown: function (e) {
            console.log("onKeydown !!!!!!!!!!!!!!!!!");
            var command = new Backgrid.Command(e);
            if (command.passThru()) return true; // skip ahead to `change`
            if (command.cancel()) {//the user pressed ESC
                e.stopPropagation();
                console.log("CANCEL !!!");
            }
            if (command.save()) {//the user pressed enter
                e.preventDefault();
                e.stopPropagation();
                this.model.trigger("backgrid:edited", this.model, this.column, command);
                console.log("save !!!!!!!!!!!!!!!!!");
                $("#ui-datepicker-div").css('visibility', 'hidden');//with enter the datepicker will disappear
                // alert(setDateformat().datetimepicker);//to test setDateformat()
            }
        },
        onCloseDatepicker: function (e) {
            var command = new Backgrid.Command(e);
            this.model.trigger("backgrid:edited", this.model, this.column, command);//r4emove blue mark
            console.log("onCloseDatepicker !!!!!!!!!!!!!!!!!");
        },
        initialize: function (options) {
            Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
            //alert("DateTimeCellEditor.initialize");
            this.column = options.column;
            var input = this;
            var thisView = this;
            var z = $(this.el);
            _.bindAll(this, 'render');
            $("#ui-datepicker-div").css('visibility', 'visible');//works with onKeydown() ENTER
            $(this.el).datetimepicker({
                timeFormat: "hh:mm tt",
                dateFormat: setDateformat().datetimepicker,//"dd/mm/yy",
                controlType: 'select',
                oneLine: true,
                onClose: function (dateText, inst) {//an event belonging to the widget
                    var newValue = thisView.formatter.toRaw(dateText);
                    console.log("close !!!->" + newValue + " -->" + inst.id);
                    thisView.render(thisView.model);
                    thisView.onCloseDatepicker(inst);
                },
                onSelect: function (selectedDateTime) {
                    console.log("select ->" + selectedDateTime);
                }
            });
        },
        render: function (model) {
            var cellVal = this.model.get(this.column.get("name"));//extracts from model
            cellVal = this.formatter.fromRaw(cellVal);//converts to cell
            this.$el.val(cellVal);
            console.log("render....<" + cellVal + ">-->" + JSON.stringify(this.model.toJSON()));
            this.delegateEvents();
            return this;
        }
    });
    var PhoneCellEditor = Backgrid.InputCellEditor.extend({
        events: {
            'focus #customer_phone': "entersCurrentCell",
            'focusout #customer_phone': "updateCurrentCell"
        },
        entersCurrentCell: function (event) {
            console.log('enters CurrentCell  content: >' + this.$el.val() + "<--- row:" + JSON.stringify(this.model.toJSON()));
        },
        updateCurrentCell: function (event) {
            console.log('Update CurrentCell with content: >' + this.$el.val() + "<---" + JSON.stringify(this.model.toJSON()));
            var val = this.$el.val();// $("#customer_phone").val();
            var newValue = this.formatter.toRaw(val);
            this.model.set(this.column.get("name"), newValue);
            console.log('After Update CurrentCell with content:' + JSON.stringify(this.model.toJSON()));
            if (_.isUndefined(newValue)) {
                this.model.trigger("backgrid:error", this.model, this.column, val);
            } else {
                this.model.trigger("backgrid:edited", this.model, this.column, new Backgrid.Command(event));
            }
        },
        initialize: function () {
            Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
            this.$el.prop("id", "customer_phone");
            this.$el.prop("value", "");
            this.$el.prop("size", "25");
            var maskList = $.masksSort($.masksLoad("phone-codes.json"), ['#'], /[0-9]|#/, "mask");
            var maskOpts = {
                inputmask: {
                    definitions: {
                        '#': {
                            validator: "[0-9]",
                            cardinality: 1
                        }
                    },
                    //clearIncomplete: true,
                    showMaskOnHover: false,
                    autoUnmask: false,
                    oncomplete: function () {
                        // console.log('inputmask in complete');
                        console.log("inputmask is complete ");
                    }
                },
                match: /[0-9]/,
                replace: '#',
                list: maskList,
                listKey: "mask",
                onMaskChange: function (maskObj, determined) {
                    if (determined) {
                        var hint = maskObj.name_en;
                        if (maskObj.desc_en && maskObj.desc_en != "") {
                            hint += " (" + maskObj.desc_en + ")";
                        }
                        $("#descr").html(hint);
                    } else {
                        $("#descr").html("Mask of input");
                    }
                    var valWithMask = $('#customer_phone').val();
                    console.log("--->" + valWithMask);
                }
            };
            this.$el.blur(function () {
                console.log("This input field has lost its focus.");
            });
            this.$el.inputmasks(maskOpts);
        },
    });
    var UrlCellEditor = Backgrid.CellEditor.extend({
        initialize: function (options) {
            Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
            var cellVal = $(this.el).val();
            // $(this.el).focus(function() {
            // 		$(this).select();
            // });
            $(this.el).val("xxx");
        }
    });
    var AutocompleteCellEditor = Backgrid.Extension.AutocompleteCellEditor = Backgrid.InputCellEditor.extend({
        formatter: Backgrid.StringFormatter,
        tagName: "input",
        attributes: {
            type: "text"
        },

        /** @property */
        autocompleteOptions: null,

        /**
         Sets the options for `autocomplete`. Called by the parent AutocompleteCell during edit mode.
         */
        setAutocompleteOptions: function (options) {
            this.autocompleteOptions = options;
        },
        events: {},
        initialize: function (options) {
            Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
            //http://stackoverflow.com/questions/16907825/how-to-implement-sublime-text-like-fuzzy-search
            var lookupObj = AutocompleteCellEditor.prototype.lookupObj;
            var lookupFCN = AutocompleteCellEditor.prototype.lookupFCN;
            //if (lookupObj)
            //    alert("AutocompleteCellEditor @@@@@@@@@=" + JSON.stringify(lookupObj.data));
            FL.common.loadGeneralBufferBegin(lookupObj);//necessary to pass lookupObj to mockjax
            FL.common.loadGeneralBufferNext(lookupFCN);//necessary to pass fCN to mockjax

            this.autocompleteUrl = options.column.get("autocompleteUrl");
            if (this.autocompleteUrl[this.autocompleteUrl.length] != '/') this.autocompleteUrl += '/';
            this.minTermLength = options.column.get("minTermLength");
            this.resultsFormatter = options.column.get("resultsFormatter");
            this.labelProperty = options.column.get("labelProperty");
            _.bindAll(this, 'render', 'getAutocompleteCustomers', 'saveOrCancel', 'postRender');
        },

        /**
         Renders an <input> element and then initializes an autocomplete widget off of it

         @chainable
         */
        render: function () {
            var thisView = this;
            this.$el.autocomplete({
                source: thisView.getAutocompleteCustomers,
                select: function (event, ui) {
                    if (!ui.item.value) {
                        return;
                    } else {
                        thisView.model.set(thisView.column.attributes.name, ui.item.label);
                    }
                    thisView.saveOrCancel(event);
                },
                close: function (event) {
                    thisView.saveOrCancel(event);
                }
            });
            return this;
        },
        getAutocompleteCustomers: function (request, response) {
            var thisView = this;
            var term = request.term;
            if (term.length < this.minTermLength) {
                response([]);
                return;
            }
            $.ajax({
                url: thisView.autocompleteUrl + term,
                contentType: 'application/json',
                type: 'GET',
                success: function (data) {
                    var results = [];
                    for (var i = 0; i < data.length; i++) {
                        if (typeof thisView.resultsFormatter == 'function')
                            results.push(thisView.resultsFormatter(data[i]));
                        else if (thisView.labelProperty) results.push({
                            label: data[i][thisView.labelProperty]
                        });
                        else results.push({
                                label: data[i]
                            });
                    }
                    results = _.compact(results);
                    if (results.length == 0) {
                        results.push({
                            label: "No results found",
                            value: ""
                        });
                    }
                    response(results);
                    return;
                },
                error: function (err) {
                    results.push({
                        label: "No results found",
                        value: ""
                    });
                    response(results);
                    return;
                }
            });
        },
        saveOrCancel: function (e) {
            var model = this.model;
            var column = this.column;

            var command = new Backgrid.Command(e);
            if (e.type == "autocompleteclose") {
                e.stopPropagation();
                model.trigger("backgrid:edited", model, column, command);
            }
        },
        postRender: function (model, column) {
            if (column == null || column.get("name") == this.column.get("name")) {
                // move the cursor to the end on firefox if text is right aligned
                if (this.$el.css("text-align") === "right") {
                    var val = this.$el.val();
                    this.$el.focus().val(null).val(val);
                } else this.$el.focus();
            }
            return this;
        }
    });
    var cellType = function (field, lookupObj) {//returns a set of objects that will complete the column definition for backgrid - used by FL.bg.colDef()
        // field - an object with all data dictionary properties of the current field
        //      uses field.typeUI, field.enumerable, field.specialTypeDef (only for typeUI="lookupbox")
        // lookupObj - an object with property data, (and methods) applicable to typeUI="lookupbox" - - if not lookupbox =>enumerable = null
        //
        // Possible typeUI:     “textbox”,”textUpperbox”,"numberbox","currencybox","integerbox","percentbox", "urlbox", ”areabox”, ”combobox”, ”checkbox”,
        //                      “phonebox”, “datetimebox”,"emailbox","lookupbox"
        // enumerable - an array with the dropdown field options applicable to typeUI="combobox" - if not combobox =>enumerable = null
        var typeUI = field.typeUI;
        var enumerable = field.enumerable;
        if (typeUI == "lookupbox") {
            //---> not necessary var fCN = field.specialTypeDef[0].fCN;
            //alert("cellType entry ***********************************  specialTypeDef=" + JSON.stringify(lookupObj.getColumn() + "\n lookupObj.defaultFCN=" + lookupObj.defaultFCN));
        }
        if (typeUI == "textbox")
            typeUI = "string";
        else if (typeUI == "datebox")
            typeUI = "datetimebox";
        var retObj = {cell: typeUI};
        // if( typeUI!="string" && typeUI!="integer" && typeUI!="number" && typeUI!="date" && typeUI!="uri"){
        if (typeUI != "string") {
            if (typeUI == "textUpperbox") {
                var formatterObj = {
                    fromRaw: function (rawValue) {
                        rawValue += ''; //to convert any value to string
                        return rawValue.toUpperCase();
                    }
                };
                retObj["cell"] = "string";
                retObj["formatter"] = formatterObj;
            } else if (typeUI == "numberbox") {//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
                var decimals = FL.common.appsettings.decimals;
                NumberCellEditor.prototype.decimals = decimals;
                var decimalFormatter = {
                    fromRaw: function (rawValue) {
                        var num = Number(rawValue);
                        // var numStr = accounting.formatMoney(num,"€",2,FL.common.appsettings.thousandsSeparator,FL.common.appsettings.radixpoint);
                        // return numStr;
                        return num.toFormattedString(decimals);
                    },
                    toRaw: function (formattedData) {
                        return FL.common.currencyToStringNumber(formattedData);
                    }
                };
                var numberCell = Backgrid.StringCell.extend({
                    className: "_fl_numeric-cell",
                    formatter: decimalFormatter,
                    editor: NumberCellEditor,
                });
                retObj["cell"] = numberCell;
            } else if (typeUI == "currencybox") {//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
                var decimals = FL.common.appsettings.decimals;
                var currency = FL.common.appsettings.currency;
                CurrencyCellEditor.prototype.decimals = decimals;
                CurrencyCellEditor.prototype.currency = currency;
                var currencyFormatter = {
                    fromRaw: function (rawValue) {
                        var num = Number(rawValue);
                        // var numStr = accounting.formatMoney(num,"€",2,FL.common.appsettings.thousandsSeparator,FL.common.appsettings.radixpoint);
                        // return numStr;
                        return currency + num.toFormattedString(decimals);
                    },
                    toRaw: function (formattedData) {
                        var z = FL.common.currencyToStringNumber(formattedData);
                        return FL.common.currencyToStringNumber(formattedData);
                    }
                };
                var currencyCell = Backgrid.StringCell.extend({
                    className: "_fl_numeric-cell",
                    formatter: currencyFormatter,
                    editor: CurrencyCellEditor,
                });
                retObj["cell"] = currencyCell;
            } else if (typeUI == "integerbox") {//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
                var integerFormatter = {
                    fromRaw: function (rawValue) {
                        var num = Number(rawValue);
                        // var numStr = accounting.formatMoney(num,"€",2,FL.common.appsettings.thousandsSeparator,FL.common.appsettings.radixpoint);
                        // return numStr;
                        return num.toFormattedString(0);
                    },
                    toRaw: function (formattedData) {
                        var z = FL.common.currencyToStringNumber(formattedData);
                        return FL.common.currencyToStringNumber(formattedData);
                    }
                };
                var integerCell = Backgrid.StringCell.extend({
                    className: "_fl_integer-cell",
                    formatter: integerFormatter,
                    editor: IntegerCellEditor,
                });
                retObj["cell"] = integerCell;
            } else if (typeUI == "percentbox") {//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
                var decimals = FL.common.appsettings.decimals;
                PercentCellEditor.prototype.decimals = decimals;
                // PercentCellEditor.prototype.currency = currency;
                var percentFormatter = {
                    fromRaw: function (rawValue) {
                        var num = Number(rawValue);
                        // var numStr = accounting.formatMoney(num,"€",2,FL.common.appsettings.thousandsSeparator,FL.common.appsettings.radixpoint);
                        // return numStr;
                        return num.toFormattedString(decimals) + "%";
                    },
                    toRaw: function (formattedData) {
                        var z = FL.common.currencyToStringNumber(formattedData);
                        return FL.common.currencyToStringNumber(formattedData);
                    }
                };
                var percentCell = Backgrid.StringCell.extend({
                    className: "_fl_percent-cell",
                    formatter: percentFormatter,
                    editor: PercentCellEditor,
                });
                retObj["cell"] = percentCell;
            } else if (typeUI == "urlbox") {//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
                retObj["cell"] = "uri";
            } else if (typeUI == "areabox") {//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
                retObj["cell"] = "text";
            } else if (typeUI == "combobox") {
                var enumArrOfArr = _.map(enumerable, function (element) {
                    return [element, element];
                });
                var comboCell = Backgrid.SelectCell.extend({
                    // It's possible to render an option group or use a
                    // function to provide option values too.
                    // optionValues: [["Male", "m"], ["Female", "f"]]
                    optionValues: enumArrOfArr
                });
                retObj["cell"] = comboCell;
            } else if (typeUI == "checkbox") {
                var checkboxFormatter = {
                    fromRaw: function (rawValue) {
                        if (FL.common.typeOf(rawValue) == "boolean") {///Only to prevent old logical values in the database
                            alert("FL.bg --->cellType for typeUI=checkbox ERROR old logical value in database -->press OK to correct");
                            rawValue = ( (rawValue) ? "TRUE" : "FALSE");
                        }
                        var bool = ( (rawValue.toUpperCase() == "TRUE") ? true : false );
                        return bool;
                        //return rawValue;
                    },
                    toRaw: function (formattedData) {
                        //var z = formattedData;
                        //return formattedData;
                        var boolStr = ( (formattedData) ? "TRUE" : "FALSE" );
                        return boolStr;
                    }
                };
                var BooleanCell = Backgrid.BooleanCell.extend({
                    formatter: checkboxFormatter,
                    editor: Backgrid.BooleanCellEditor.extend({
                        render: function () {
                            var model = this.model;
                            var columnName = this.column.get("name");
                            var val = this.formatter.fromRaw(model.get(columnName), model);
                            /*
                             * Toggle checked property since a click is what triggered enterEditMode
                             */
                            this.$el.prop("checked", !val);
                            var dataToModel = this.formatter.toRaw(!val);
                            //model.set(columnName, !val);
                            model.set(columnName, dataToModel);
                            return this;
                        }
                    })
                });
                retObj["cell"] = BooleanCell;
            } else if (typeUI == "phonebox") {
                var z = "JOJO";
                PhoneCellEditor.prototype.z = z;
                var phoneCell = Backgrid.Cell.extend({
                    //z:"JOJO",
                    initialize: function (options) {
                        // alert(this.options.z);
                        phoneCell.__super__.initialize.apply(this, arguments);
                        this.listenTo(this.model, "backgrid:editing", function (model, column, command) {
                            console.log("editing !!!!!!!!!!!!! ->" + JSON.stringify(model.toJSON()));
                        });
                        this.model.on('change', function () {
                            console.log("model change !!!!");
                        });
                        // this.listenTo(this.model, "backgrid:error", function(model,column,command){
                        // 	alert("error !!!!!!!!!!!!! ->");
                        // });
                    },
                    editor: PhoneCellEditor,
                    xrender: function () {
                        //this.$el.html(this.template(this.model.attributes));
                        console.log("render-->" + this.$el.val());
                        return this;
                    }
                });
                var formatterObj = _.extend({}, Backgrid.CellFormatter.prototype, {
                    fromRaw: function (rawValue) {
                        // if ( !validatePhone2(rawValue) )
                        // 	rawValue = "Invalid phone";
                        console.log("fromRaw------------------>" + rawValue);
                        return rawValue;
                    },
                    toRaw: function (formattedData) {
                        // if ( !FL.common.is_ValidDate(formattedData) )
                        // 	return undefined;
                        console.log("toRaw-->" + formattedData);
                        return formattedData; //+ "X";
                    }
                });
                retObj["cell"] = phoneCell;
                retObj["formatter"] = formatterObj;
            } else if (typeUI == "datetimebox") {
                var DateCell = Backgrid.Cell.extend({
                    initialize: function (options) {
                        DateCell.__super__.initialize.apply(this, arguments);
                        this.model.on('change', function (e) {
                            console.log(" datetime model change !!!! ----->" + JSON.stringify(this.model.toJSON()));
                        }, this);
                    },
                    editor: DateTimeCellEditor,
                });
                var formatterObj = _.extend({}, Backgrid.CellFormatter.prototype, {
                    fromRaw: function (rawValue) {
                        var initial = rawValue;
                        rawValue = FL.common.fromISODateToShortdateTime(rawValue, setDateformat().format);
                        if (!rawValue)
                            rawValue = "Invalid Datetime";
                        console.log("fromRaw  transformed:" + initial + " into -->" + rawValue);
                        return rawValue;
                    },
                    toRaw: function (formattedData) {
                        var initial = formattedData;
                        if (validateDatetime(formattedData)) {
                            formattedData = FL.common.toISODate(formattedData, setDateformat().format);
                        } else {
                            return "invalid datetime";
                        }
                        console.log("toRaw  transformed:" + initial + " into -->" + formattedData);
                        return formattedData; //+ "X";
                    }
                });
                retObj["cell"] = DateCell;
                retObj["formatter"] = formatterObj;
            } else if (typeUI == "emailbox") {
                var EmailCell = Backgrid.EmailCell.extend({
                    className: "email-cell",
                    render: function () {
                        this.$el.empty();
                        var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get("name")));
                        this.$el.append($("<a>", {
                            tabIndex: -1,
                            title: formattedValue
                        }).text(formattedValue));
                        this.delegateEvents();
                        return this;
                    }
                });
                var formatterObj = _.extend({}, Backgrid.CellFormatter.prototype, {
                    fromRaw: function (rawValue) {
                        if (!FL.common.validateEmail(rawValue))
                            rawValue = "Invalid email";
                        return rawValue;
                    },
                    toRaw: function (formattedData) {
                        if (!FL.common.validateEmail(formattedData))
                            return undefined;
                        return formattedData; //+ "X";
                    }
                });
                retObj["cell"] = EmailCell;
                retObj["formatter"] = formatterObj;
            } else if (typeUI == "lookupbox") {
                if (!lookupObj) {
                    alert("FL.bg.cellType ERROR missing parameter lookupObj in lookup case !");
                    return null;
                }
                AutocompleteCellEditor.prototype.lookupObj = lookupObj;
                if (!field.specialTypeDef) {
                    alert("FL.bg.cellType ERROR missing field.specialTypeDef in lookup case !");
                    return null;
                }
                AutocompleteCellEditor.prototype.lookupFCN = field.specialTypeDef[0].fCN;
                var formatterObj = _.extend({}, Backgrid.CellFormatter.prototype, {
                    fromRaw: function (rawValue) {
                        console.log("fromRaw------------------>" + rawValue);
                        return rawValue;
                    },
                    toRaw: function (formattedData) {
                        //alert("searchbox toRaw-->" + formattedData);
                        return formattedData + "_Out";
                    }
                });
                var autocompleteCell = Backgrid.StringCell.extend({
                    initialize: function (options) {
                        Backgrid.StringCell.prototype.initialize.apply(this, arguments);
                        this.listenTo(this.model, "backgrid:edit", function (model, column, cell, editor) {
                            if (column.get("name") == this.column.get("name")) {
                                editor.setAutocompleteOptions(this.autocompleteOptions);
                            }
                        });
                    },
                    className: "autocomplete-cell",
                    editor: AutocompleteCellEditor
                });
                //retObj["cell"] = Backgrid.Extension.AutocompleteCell;
                retObj["cell"] = autocompleteCell;
                // retObj["cell"] = lookupCell;// Backgrid.Extension.AutocompleteCell;
                retObj["autocompleteUrl"] = "/names";
                retObj["minTermLength"] = 1;
                retObj["labelProperty"] = "name";
                retObj["formatter"] = formatterObj;
            } else if (typeUI == "urllbox") {
                retObj["cell"] = "uri";
            } else {
                alert("FL.bg cellType error unknown typeUI !!!-->" + typeUI);
            }
        }
        return retObj;
    };
    return {
        dateFormat: "MDY",//possible values:"YMD","MDY","DMY"
        // colDef: function(name,label,nesting,width,type,enumerable) {
        colDef: function (gridDefinition, field, lookupObj) {
            //colDef will receive two type of data:
            //	 grid definition data - label, nestingArr, width
            //	 field dictionary data  - name, typeUI, enumerable,
            //   lookupObj - a table object (built with FL.API.openTable)
            //name - The key of the model attribute
            //label - The name to display in the header
            //nesting - default is [], -->one title above ["General"], -->2 titles above  ["General", "Detail"]
            //type ->"string","integer","number","date","uri","stringUpper","email","area","phone","datetime"
            // Old Examples
            //	   FL.bg.colDef("name","Name JO",["General JO"],"*","datetime"),
            //     FL.bg.colDef("pop","Population JO", ["Custom","numbers"],20,"integer"),
            //     FL.bg.colDef("percentage","% of World Population JO",["Custom", "numbers"],100,"number"),

            // var retObj = {name:name,label:label,nesting:nesting,width:width,resizeable:true,orderable:true};
            var retObj = {
                name: field.name,
                label: gridDefinition.label,
                nesting: gridDefinition.nesting,
                width: gridDefinition.width,
                resizeable: true,
                orderable: true
            };
            _.extend(retObj, cellType(field, lookupObj));//decimals are passed via public
            return retObj;
        },
        getGridDefaultLayout: function (eCN) {//returns an object {baseTable:eCN,format:[array of objects defining each column]} defining a grid Layout based on Dictionary
            // the array of objects returned in getGridDefaultLayout().format can be produced by a grid designer
            // returns an array of {fCN:fCN,label:label,width:"*",nestingArr:nestingArr,type:"field"} with as many elements as attributres in data dictionary
            //  where for column i:
            //    fCN - field compressed name to present in column i
            //    label - column title
            //    width - column width
            //ex : var gridLayout = FL.bg.getGridDefaultLayout(eCN);
            var layoutObj = null;
            var gridFormat = [];
            // var colDefinition = {fCN:null,label:null,width:"*",nestingArr:[]};
            var entityName = FL.dd.getEntityByCName(eCN);
            if (entityName) {
                var oEntity = FL.dd.getEntityBySingular(entityName);
                var arrOfAttributes = oEntity.attributes;
                var L2C = oEntity.L2C;
                _.each(arrOfAttributes, function (element, index) {
                    if (element.name != "id") {
                        var fCN = L2C[element.name];//element.name;
                        var label = element.label;
                        var nestingArr = [];
                        var colDefinition = {fCN: fCN, label: label, width: "*", nestingArr: nestingArr};
                        gridFormat.push(colDefinition);
                    }
                }, this);
                layoutObj = {"baseTable": eCN, "format": gridFormat};
            } else {
                alert("FL.bg.getGridDefaultDefinition Error: entity with compressed name='" + eCN + "' does not exist in local Dictionary.");
            }
            return layoutObj;
        },
        setupGridColumnsArr: function (oLayout, lookupObj) {//returns the columnArr to be used in utils.mountGridInCsvStore
            // ex: var columnsArr = FL.bg.setupGridColumnsArr(gridLayout);
            var columnsArr = [];
            FL.dd.displayEntities("FL.bg.setupGridColumnsArr");
            _.each(oLayout.format, function (element, index) {//each element of oLayout.format array is like {fCN:"50","1st Column",width:20,nestingArr:[]}
                console.log("setupGridColumnsArr -->prepares fCN=" + element.fCN, "grid");
                // var name = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN].name;
                // var typeUI = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN].typeUI;
                // var enumerable = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN].enumerable;
                // var ddFieldDefinition = {name:name,typeUI:typeUI,enumerable:enumerable};
                var gridDefinition = {label: element.label, nestingArr: element.nestingArr, width: element.width};
                //var arrElObj = FL.bg.colDef(name,element.label,element.nestingArr,element.width,typeUI,enumerable);
                var field = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN];
                if (field.typeUI == "lookupbox") {
                    //var fCN = field.specialTypeDef[0].fCN;
                    //alert("setupGridColumnsArr  ***********************************  specialTypeDef=" + JSON.stringify(lookupObj.getColumn() + "\n lookupObj.defaultFCN=" + lookupObj.defaultFCN));
                    if (!lookupObj)
                        field.typeUI = "textbox";//forces textbox if there is no table
                }
                var arrElObj = FL.bg.colDef(gridDefinition, field, lookupObj);
                arrElObj = _.omit(arrElObj, ["nesting", "orderable", "resizeable", "width"]);//temporary while these propoerties are inactive
                columnsArr.push(arrElObj);
            }, this);
            //inserts auxiliary columns upfront
            columnsArr.unshift({name: "", cell: "select-row", headerCell: "select-all"}, {
                editable: false,
                label: "#",
                name: "id",
                cell: Backgrid.IntegerCell.extend({orderSeparator: ''})
            });
            return columnsArr;//each element of columnsArr array is like {cell:"string",label:"a",name:"a"...eventually others}
        },
        setupGridColumnsArrNoDict: function (layoutFormatArr) {//returns the columnArr to be used in utils.mountGridInCsvStore
            //layoutFormatArr = [ {label:"title1,nestingArr:[],width:10,typeUI:"textbox",enumerable:null}, {label:"title2,nestingArr:[],width:30,typeUI:"textbox",enumeralble:null}  ]
            // ex: var columnsArr = FL.bg.setupGridColumnsArrNoDict(arrOfColumns);
            var columnsArr = [];
            _.each(layoutFormatArr, function (element, index) {//each element of oLayout.format array is like {fCN:"50","1st Column",width:20,nestingArr:[]}
                console.log("setupGridColumnsArrNoDict -->prepares column with title=" + element.label, "grid");
                // var name = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN].name;
                // var typeUI = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN].typeUI;
                // var enumerable = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN].enumerable;
                // var ddFieldDefinition = {name:name,typeUI:typeUI,enumerable:enumerable};
                var gridDefinition = {label: element.label, nestingArr: element.nestingArr, width: element.width};
                //var arrElObj = FL.bg.colDef(name,element.label,element.nestingArr,element.width,typeUI,enumerable);
                //var field = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN];
                var field = {typeUI: element.typeUI, enumerable: element.enumerable};
                var arrElObj = FL.bg.colDef(gridDefinition, field);
                arrElObj = _.omit(arrElObj, ["nesting", "orderable", "resizeable", "width"]);//temporary while these propoerties are inactive
                columnsArr.push(arrElObj);
            }, this);
            //inserts auxiliary columns upfront
            columnsArr.unshift({name: "", cell: "select-row", headerCell: "select-all"}, {
                editable: false,
                label: "#",
                name: "id",
                cell: Backgrid.IntegerCell.extend({orderSeparator: ''})
            });
            return columnsArr;//each element of columnsArr array is like {cell:"string",label:"a",name:"a"...eventually others}
        },
        testFunc: function (x) {
            return "FL.bg.test() -->" + x;
        }
    };
})();