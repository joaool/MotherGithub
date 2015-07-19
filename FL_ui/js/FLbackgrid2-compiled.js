//jo.js to test widgets in backgrid
'use strict';

var FL = FL || {};

$.mockjax({
	url: '/names/*',
	type: 'GET',
	responseTime: 750,
	response: function response(body) {
		var searchTerm = body.url.split('/')[2];
		this.status = 200;
		this.responseText = JSON.stringify(_.filter([{
			name: 'Franz'
		}, {
			name: 'Theodore'
		}, {
			name: 'Matilda'
		}, {
			name: 'Roosevelt'
		}, {
			name: 'Ferdinand'
		}, {
			name: 'Dillon'
		}, {
			name: 'Sheila'
		}, {
			name: 'Francine'
		}], function (obj) {
			return obj.name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1;
		}));
	}
});
FL['bg'] = (function () {
	//name space FL.common
	validatePhone = function (phone) {
		// var re = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;//(123) 456-7890
		var re = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{3}(-|\s)\d{3}$/; //(123) 456-789-012
		return re.test(phone);
	};
	validatePhone2 = function validatePhone(phoneVal) {
		//https://saikiran78.wordpress.com/2011/04/20/phone-number-validation-using-jquery/
		var phoneRegExp = /^((\+)?[1-9]{1,2})?([-\s\.])?((\(\d{1,4}\))|\d{1,4})(([-\s\.])?[0-9]{1,12}){1,2}$/;
		//http://stackoverflow.com/questions/16385366/masking-input-with-optional-alphabet-prefix-to-a-phone-number-format
		var numbers = phoneVal.split('').length;
		if (10 <= numbers && numbers <= 20 && phoneRegExp.test(phoneVal)) {
			return true;
		}
		return false;
	};
	validateDatetime = function (datetime) {
		//ex "01/06/2015 12:00 am"
		var bRet = false;
		var date = datetime.substr(0, 10);
		if (FL.common.is_ValidDate(date)) {
			var space = datetime.substr(10, 1);
			if (space = ' ') {
				//a space is in position 10
				var timeAnd = datetime.substr(11); //ex "12:00 am"
				var time = datetime.substr(11, 5);
				var re = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/; //HH:MM
				if (re.test(time)) {
					//format correct for 12:00
					if (timeAnd.lenght == 5) {
						bRet = true; //the format is "01/06/2015 22:14"
					} else {
						space = timeAnd.substr(5, 1);
						if (space = ' ') {
							//a space is in position 5 of "12:00 am"
							var amPm = timeAnd.substr(6);
							var re = /^[APap][mM]$/; //am
							if (re.test(amPm)) {
								//format correct for am or pm
								bRet = true; //the format is "01/06/2015 22:14 am"
							}
						}
					}
				}
			}
		}
		return bRet;
	};
	var setDateformat = function setDateformat() {
		//possible values:"YMD","MDY","DMY"
		var oRet = { datetimepicker: 'yy/mm/dd', format: 'YMD' }; //default value
		if (FL.bg.dateFormat == 'MDY') oRet = { datetimepicker: 'mm/dd/yy', format: 'MDY' };else if (FL.bg.dateFormat == 'DMY') oRet = { datetimepicker: 'dd/mm/yy', format: 'DMY' };
		return oRet;
	};
	var NumberCellEditor = Backgrid.InputCellEditor.extend({
		initialize: function initialize(options) {
			Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
			var decimals = NumberCellEditor.prototype.decimals; //4;
			var decimalMask = '0000000000000000000'.substr(0, decimals);
			var mask = '#' + FL.common.appsettings.thousandsSeparator + '##0' + FL.common.appsettings.radixpoint + decimalMask; //ex."#.##0,00"
			var cellVal = $(this.el).val();
			$(this.el).focus(function () {
				var paddedValue = function paddedValue(cellValStr, decimals) {
					var xRet = cellValStr;
					var radixpoint = FL.common.appsettings.radixpoint;
					var decimalPos = cellValStr.indexOf(radixpoint);
					if (decimalPos >= 0) {
						var tail = FL.common.getTail(cellValStr);
						var intValueStr = cellValStr.substr(0, decimalPos);
						if (tail.length < decimals) {
							tail = tail.pad(decimals, '0', 1);
						};
						xRet = intValueStr + radixpoint + tail;
					}
					return xRet;
				};
				var cellVal = $(this).val();
				var paddedCell = paddedValue(cellVal, decimals);
				console.log('------------->on focus ==>' + $(this).val() + ' -->' + paddedCell);

				$(this).val(paddedCell);
				$(this).select();
			});
			var options = {
				reverse: true,
				maxlength: false,
				onKeyPress: function onKeyPress(val, event, currentField, options) {
					console.log('------------->An key was pressed!:', val, ' event: ', event, 'currentField: ', currentField, ' options: ', options);
					console.log('------------->current value=' + val);
				}
			};
			$(this.el).mask(mask, options); //https://github.com/igorescobar/jQuery-Mask-Plugin
		},
		render: function render(model) {
			var cellVal = this.model.get(this.column.get('name')); //extracts from model
			cellVal = this.formatter.fromRaw(cellVal); //converts to cell
			this.$el.val(cellVal);
			console.log('render number....<' + cellVal + '>-->' + JSON.stringify(this.model.toJSON()));
			this.delegateEvents();
			return this;
		}
	});
	var CurrencyCellEditor = Backgrid.InputCellEditor.extend({
		initialize: function initialize(options) {
			Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
			var decimals = CurrencyCellEditor.prototype.decimals;
			var currency = CurrencyCellEditor.prototype.currency;
			var thousandsSeparator = FL.common.appsettings.thousandsSeparator;
			if (thousandsSeparator == 'space') thousandsSeparator = ' ';
			var decimalMask = '0000000000000000000'.substr(0, decimals);
			var mask = '#' + thousandsSeparator + '##0' + FL.common.appsettings.radixpoint + decimalMask; //ex."#.##0,00"
			var cellVal = $(this.el).val();
			$(this.el).focus(function () {
				var paddedValue = function paddedValue(cellValStr, decimals) {
					var xRet = cellValStr;
					var radixpoint = FL.common.appsettings.radixpoint;
					var decimalPos = cellValStr.indexOf(radixpoint);
					if (decimalPos >= 0) {
						var tail = FL.common.getTail(cellValStr);
						var intValueStr = cellValStr.substr(0, decimalPos);
						if (tail.length < decimals) {
							tail = tail.pad(decimals, '0', 1);
						};
						xRet = intValueStr + radixpoint + tail;
					}
					return xRet;
				};
				var cellVal = $(this).val();
				var paddedCell = paddedValue(cellVal, decimals);
				console.log('------------->on focus ==>' + $(this).val() + ' -->' + paddedCell);

				$(this).val(paddedCell);
				$(this).select();
			});
			var options = {
				reverse: true,
				maxlength: false,
				onKeyPress: function onKeyPress(val, event, currentField, options) {
					console.log('------------->An key was pressed!:', val, ' event: ', event, 'currentField: ', currentField, ' options: ', options);
					console.log('------------->current value=' + val);
				}
			};
			$(this.el).mask(mask, options); //https://github.com/igorescobar/jQuery-Mask-Plugin
		},
		render: function render(model) {
			var cellVal = this.model.get(this.column.get('name')); //extracts from model
			cellVal = this.formatter.fromRaw(cellVal); //converts to cell
			this.$el.val(cellVal);
			console.log('render number....<' + cellVal + '>-->' + JSON.stringify(this.model.toJSON()));
			this.delegateEvents();
			return this;
		}
	});
	var IntegerCellEditor = Backgrid.InputCellEditor.extend({
		initialize: function initialize(options) {
			Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
			var mask = '#' + FL.common.appsettings.thousandsSeparator + '##0'; //ex."#.##0"
			var cellVal = $(this.el).val();
			$(this.el).focus(function () {
				$(this).select();
			});
			var options = {
				reverse: true,
				maxlength: false,
				onKeyPress: function onKeyPress(val, event, currentField, options) {
					console.log('------------->An key was pressed!:', val, ' event: ', event, 'currentField: ', currentField, ' options: ', options);
					console.log('------------->current value=' + val);
				}
			};
			$(this.el).mask(mask, options); //https://github.com/igorescobar/jQuery-Mask-Plugin
		},
		render: function render(model) {
			var cellVal = this.model.get(this.column.get('name')); //extracts from model
			cellVal = this.formatter.fromRaw(cellVal); //converts to cell
			this.$el.val(cellVal);
			console.log('render number....<' + cellVal + '>-->' + JSON.stringify(this.model.toJSON()));
			this.delegateEvents();
			return this;
		}
	});
	var PercentCellEditor = Backgrid.InputCellEditor.extend({
		initialize: function initialize(options) {
			Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
			var decimals = CurrencyCellEditor.prototype.decimals;
			// var currency = CurrencyCellEditor.prototype.currency;

			var decimalMask = '0000000000000000000'.substr(0, decimals);
			var mask = '#' + FL.common.appsettings.thousandsSeparator + '##0' + FL.common.appsettings.radixpoint + decimalMask; //ex."#.##0,00"
			var cellVal = $(this.el).val();
			$(this.el).focus(function () {
				var paddedValue = function paddedValue(cellValStr, decimals) {
					var xRet = cellValStr;
					var radixpoint = FL.common.appsettings.radixpoint;
					var decimalPos = cellValStr.indexOf(radixpoint);
					if (decimalPos >= 0) {
						var tail = FL.common.getTail(cellValStr);
						var intValueStr = cellValStr.substr(0, decimalPos);
						if (tail.length < decimals) {
							tail = tail.pad(decimals, '0', 1);
						};
						xRet = intValueStr + radixpoint + tail;
					}
					return xRet;
				};
				var cellVal = $(this).val();
				var paddedCell = paddedValue(cellVal, decimals);
				console.log('------------->on focus ==>' + $(this).val() + ' -->' + paddedCell);

				$(this).val(paddedCell);
				$(this).select();
			});
			var options = {
				reverse: true,
				maxlength: false,
				onKeyPress: function onKeyPress(val, event, currentField, options) {
					console.log('------------->An key was pressed!:', val, ' event: ', event, 'currentField: ', currentField, ' options: ', options);
					console.log('------------->current value=' + val);
				}
			};
			$(this.el).mask(mask, options); //https://github.com/igorescobar/jQuery-Mask-Plugin
		},
		render: function render(model) {
			var cellVal = this.model.get(this.column.get('name')); //extracts from model
			cellVal = this.formatter.fromRaw(cellVal); //converts to cell
			this.$el.val(cellVal);
			console.log('render number....<' + cellVal + '>-->' + JSON.stringify(this.model.toJSON()));
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
			'change': 'onDatePickerValueChange',
			'keydown': 'onKeydown'
		},
		onDatePickerValueChange: function onDatePickerValueChange(e) {
			var command = new Backgrid.Command(e);
			var changedVal = this.$el.val();
			console.log('onDatePickerValueChange CurrentCell with content: >' + changedVal + '<---' + JSON.stringify(this.model.toJSON()));
			var isoDate = this.formatter.toRaw(changedVal); //transform cell value to isoDate
			this.model.set(this.column.get('name'), isoDate); //places isodate into the model
			var val = this.formatter.fromRaw(changedVal);
			this.onKeydown(e);
		},
		onKeydown: function onKeydown(e) {
			console.log('onKeydown !!!!!!!!!!!!!!!!!');
			var command = new Backgrid.Command(e);
			if (command.passThru()) return true; // skip ahead to `change`
			if (command.cancel()) {
				//the user pressed ESC
				e.stopPropagation();
				console.log('CANCEL !!!');
			}
			if (command.save()) {
				//the user pressed enter
				e.preventDefault();
				e.stopPropagation();
				this.model.trigger('backgrid:edited', this.model, this.column, command);
				console.log('save !!!!!!!!!!!!!!!!!');
				$('#ui-datepicker-div').css('visibility', 'hidden'); //with enter the datepicker will disappear
				// alert(setDateformat().datetimepicker);//to test setDateformat()
			}
		},
		onCloseDatepicker: function onCloseDatepicker(e) {
			var command = new Backgrid.Command(e);
			this.model.trigger('backgrid:edited', this.model, this.column, command); //r4emove blue mark
			console.log('onCloseDatepicker !!!!!!!!!!!!!!!!!');
		},
		initialize: function initialize(options) {
			Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
			this.column = options.column;
			var input = this;
			var thisView = this;
			var z = $(this.el);
			_.bindAll(this, 'render');
			$('#ui-datepicker-div').css('visibility', 'visible'); //works with onKeydown() ENTER
			$(this.el).datetimepicker({
				timeFormat: 'hh:mm tt',
				dateFormat: setDateformat().datetimepicker, //"dd/mm/yy",
				controlType: 'select',
				oneLine: true,
				onClose: function onClose(dateText, inst) {
					//an event belonging to the widget
					var newValue = thisView.formatter.toRaw(dateText);
					console.log('close !!!->' + newValue + ' -->' + inst.id);
					thisView.render(thisView.model);
					thisView.onCloseDatepicker(inst);
				},
				onSelect: function onSelect(selectedDateTime) {
					console.log('select ->' + selectedDateTime);
				}
			});
		},
		render: function render(model) {
			var cellVal = this.model.get(this.column.get('name')); //extracts from model
			cellVal = this.formatter.fromRaw(cellVal); //converts to cell
			this.$el.val(cellVal);
			console.log('render....<' + cellVal + '>-->' + JSON.stringify(this.model.toJSON()));
			this.delegateEvents();
			return this;
		}
	});
	var PhoneCellEditor = Backgrid.InputCellEditor.extend({
		events: {
			'focus #customer_phone': 'entersCurrentCell',
			'focusout #customer_phone': 'updateCurrentCell'
		},
		entersCurrentCell: function entersCurrentCell(event) {
			console.log('enters CurrentCell  content: >' + this.$el.val() + '<--- row:' + JSON.stringify(this.model.toJSON()));
		},
		updateCurrentCell: function updateCurrentCell(event) {
			console.log('Update CurrentCell with content: >' + this.$el.val() + '<---' + JSON.stringify(this.model.toJSON()));
			var val = this.$el.val(); // $("#customer_phone").val();
			var newValue = this.formatter.toRaw(val);
			this.model.set(this.column.get('name'), newValue);
			console.log('After Update CurrentCell with content:' + JSON.stringify(this.model.toJSON()));
			if (_.isUndefined(newValue)) {
				this.model.trigger('backgrid:error', this.model, this.column, val);
			} else {
				this.model.trigger('backgrid:edited', this.model, this.column, new Backgrid.Command(event));
			}
		},
		initialize: function initialize() {
			Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
			this.$el.prop('id', 'customer_phone');
			this.$el.prop('value', '');
			this.$el.prop('size', '25');
			var maskList = $.masksSort($.masksLoad('phone-codes.json'), ['#'], /[0-9]|#/, 'mask');
			var maskOpts = {
				inputmask: {
					definitions: {
						'#': {
							validator: '[0-9]',
							cardinality: 1
						}
					},
					//clearIncomplete: true,
					showMaskOnHover: false,
					autoUnmask: false,
					oncomplete: function oncomplete() {
						// console.log('inputmask in complete');
						console.log('inputmask is complete ');
					}
				},
				match: /[0-9]/,
				replace: '#',
				list: maskList,
				listKey: 'mask',
				onMaskChange: function onMaskChange(maskObj, determined) {
					if (determined) {
						var hint = maskObj.name_en;
						if (maskObj.desc_en && maskObj.desc_en != '') {
							hint += ' (' + maskObj.desc_en + ')';
						}
						$('#descr').html(hint);
					} else {
						$('#descr').html('Mask of input');
					}
					var valWithMask = $('#customer_phone').val();
					console.log('--->' + valWithMask);
				}
			};
			this.$el.blur(function () {
				console.log('This input field has lost its focus.');
			});
			this.$el.inputmasks(maskOpts);
		}
	});
	var UrlCellEditor = Backgrid.CellEditor.extend({
		initialize: function initialize(options) {
			Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
			var cellVal = $(this.el).val();
			// $(this.el).focus(function() {
			// 		$(this).select();
			// });
			$(this.el).val('xxx');
		}
	});
	var cellType = function cellType(typeUI, enumerable, decimals, currency) {
		//type string is converted to "StringCell" and a corresponding class in the Backgrid package namespace
		// Possible types:"textbox","integer","number,"date","uri"
		//      “textbox”,”textUpperbox”,”areabox”,”combobox”,”checkbox”, “phonebox”, “datetimebox”, "urlbox"
		// area,check,stringUpper,email,datetime
		if (typeUI == 'textbox') typeUI = 'string';else if (typeUI == 'datebox') typeUI = 'datetimebox';
		var retObj = { cell: typeUI };
		// if( typeUI!="string" && typeUI!="integer" && typeUI!="number" && typeUI!="date" && typeUI!="uri"){
		if (typeUI != 'string') {
			if (typeUI == 'textUpperbox') {
				var formatterObj = {
					fromRaw: function fromRaw(rawValue) {
						rawValue += ''; //to convert any value to string
						return rawValue.toUpperCase();
					}
				};
				retObj['cell'] = 'string';
				retObj['formatter'] = formatterObj;
			} else if (typeUI == 'numberbox') {
				//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
				// var decimals =  4;
				// NumberCellEditor.prototype.decimals = decimals;
				NumberCellEditor.prototype.decimals = decimals;
				var decimalFormatter = {
					fromRaw: function fromRaw(rawValue) {
						var num = Number(rawValue);
						// var numStr = accounting.formatMoney(num,"€",2,FL.common.appsettings.thousandsSeparator,FL.common.appsettings.radixpoint);
						// return numStr;
						return num.toFormattedString(decimals);
					},
					toRaw: function toRaw(formattedData) {
						var z = FL.common.currencyToStringNumber(formattedData);
						return FL.common.currencyToStringNumber(formattedData);
					}
				};
				var numberCell = Backgrid.StringCell.extend({
					className: '_fl_numeric-cell',
					formatter: decimalFormatter,
					editor: NumberCellEditor
				});
				retObj['cell'] = numberCell;
			} else if (typeUI == 'currencybox') {
				//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
				// var decimals =  4;
				// NumberCellEditor.prototype.decimals = decimals;
				// var currency = "€";
				CurrencyCellEditor.prototype.decimals = decimals;
				CurrencyCellEditor.prototype.currency = currency;
				var currencyFormatter = {
					fromRaw: function fromRaw(rawValue) {
						var num = Number(rawValue);
						// var numStr = accounting.formatMoney(num,"€",2,FL.common.appsettings.thousandsSeparator,FL.common.appsettings.radixpoint);
						// return numStr;
						return currency + num.toFormattedString(decimals);
					},
					toRaw: function toRaw(formattedData) {
						var z = FL.common.currencyToStringNumber(formattedData);
						return FL.common.currencyToStringNumber(formattedData);
					}
				};
				var currencyCell = Backgrid.StringCell.extend({
					className: '_fl_numeric-cell',
					formatter: currencyFormatter,
					editor: CurrencyCellEditor
				});
				retObj['cell'] = currencyCell;
			} else if (typeUI == 'integerbox') {
				//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
				var integerFormatter = {
					fromRaw: function fromRaw(rawValue) {
						var num = Number(rawValue);
						// var numStr = accounting.formatMoney(num,"€",2,FL.common.appsettings.thousandsSeparator,FL.common.appsettings.radixpoint);
						// return numStr;
						return num.toFormattedString(0);
					},
					toRaw: function toRaw(formattedData) {
						var z = FL.common.currencyToStringNumber(formattedData);
						return FL.common.currencyToStringNumber(formattedData);
					}
				};
				var integerCell = Backgrid.StringCell.extend({
					className: '_fl_integer-cell',
					formatter: integerFormatter,
					editor: IntegerCellEditor
				});
				retObj['cell'] = integerCell;
			} else if (typeUI == 'percentbox') {
				//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
				// var decimals =  4;
				// NumberCellEditor.prototype.decimals = decimals;
				// var currency = "€";
				PercentCellEditor.prototype.decimals = decimals;
				// PercentCellEditor.prototype.currency = currency;
				var percentFormatter = {
					fromRaw: function fromRaw(rawValue) {
						var num = Number(rawValue);
						// var numStr = accounting.formatMoney(num,"€",2,FL.common.appsettings.thousandsSeparator,FL.common.appsettings.radixpoint);
						// return numStr;
						return num.toFormattedString(decimals) + '%';
					},
					toRaw: function toRaw(formattedData) {
						var z = FL.common.currencyToStringNumber(formattedData);
						return FL.common.currencyToStringNumber(formattedData);
					}
				};
				var percentCell = Backgrid.StringCell.extend({
					className: '_fl_percent-cell',
					formatter: percentFormatter,
					editor: PercentCellEditor
				});
				retObj['cell'] = percentCell;
			} else if (typeUI == 'urlbox') {
				//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
				retObj['cell'] = 'uri';
			} else if (typeUI == 'areabox') {
				//http://backbone-paginator.github.io/backbone.paginator/examples/js/extensions/text-cell/backgrid-text-cell.js
				retObj['cell'] = 'text';
			} else if (typeUI == 'combobox') {
				var enumArrOfArr = _.map(enumerable, function (element) {
					return [element, element];
				});
				var comboCell = Backgrid.SelectCell.extend({
					// It's possible to render an option group or use a
					// function to provide option values too.
					// optionValues: [["Male", "m"], ["Female", "f"]]
					optionValues: enumArrOfArr
				});
				retObj['cell'] = comboCell;
			} else if (typeUI == 'checkbox') {
				var BooleanCell = Backgrid.BooleanCell.extend({
					editor: Backgrid.BooleanCellEditor.extend({
						render: function render() {
							var model = this.model;
							var columnName = this.column.get('name');
							var val = this.formatter.fromRaw(model.get(columnName), model);
							/*
        * Toggle checked property since a click is what triggered enterEditMode
       */
							this.$el.prop('checked', !val);
							model.set(columnName, !val);
							return this;
						}
					})
				});
				retObj['cell'] = BooleanCell;
			} else if (typeUI == 'phonebox') {
				var z = 'JOJO';
				PhoneCellEditor.prototype.z = z;
				var phoneCell = Backgrid.Cell.extend({
					//z:"JOJO",
					initialize: function initialize(options) {
						// alert(this.options.z);
						phoneCell.__super__.initialize.apply(this, arguments);
						this.listenTo(this.model, 'backgrid:editing', function (model, column, command) {
							console.log('editing !!!!!!!!!!!!! ->' + JSON.stringify(model.toJSON()));
						});
						this.model.on('change', function () {
							console.log('model change !!!!');
						});
						// this.listenTo(this.model, "backgrid:error", function(model,column,command){
						// 	alert("error !!!!!!!!!!!!! ->");
						// });						
					},
					editor: PhoneCellEditor,
					xrender: function xrender() {
						//this.$el.html(this.template(this.model.attributes));
						console.log('render-->' + this.$el.val());
						return this;
					}
				});
				var formatterObj = _.extend({}, Backgrid.CellFormatter.prototype, {
					fromRaw: function fromRaw(rawValue) {
						// if ( !validatePhone2(rawValue) )
						// 	rawValue = "Invalid phone";
						console.log('fromRaw------------------>' + rawValue);
						return rawValue;
					},
					toRaw: function toRaw(formattedData) {
						// if ( !FL.common.is_ValidDate(formattedData) )
						// 	return undefined;
						console.log('toRaw-->' + formattedData);
						return formattedData; //+ "X";
					}
				});
				retObj['cell'] = phoneCell;
				retObj['formatter'] = formatterObj;
			} else if (typeUI == 'datetimebox') {
				var DateCell = Backgrid.Cell.extend({
					initialize: function initialize(options) {
						DateCell.__super__.initialize.apply(this, arguments);
						this.model.on('change', function (e) {
							console.log(' datetime model change !!!! ----->' + JSON.stringify(this.model.toJSON()));
						}, this);
					},
					editor: DateTimeCellEditor
				});
				var formatterObj = _.extend({}, Backgrid.CellFormatter.prototype, {
					fromRaw: function fromRaw(rawValue) {
						var initial = rawValue;
						rawValue = FL.common.fromISODateToShortdateTime(rawValue, setDateformat().format);
						if (!rawValue) rawValue = 'Invalid Datetime';
						console.log('fromRaw  transformed:' + initial + ' into -->' + rawValue);
						return rawValue;
					},
					toRaw: function toRaw(formattedData) {
						var initial = formattedData;
						if (validateDatetime(formattedData)) {
							formattedData = FL.common.toISODate(formattedData, setDateformat().format);
						} else {
							return 'invalid datetime';
						}
						console.log('toRaw  transformed:' + initial + ' into -->' + formattedData);
						return formattedData; //+ "X";
					}
				});
				retObj['cell'] = DateCell;
				retObj['formatter'] = formatterObj;
			} else if (typeUI == 'emailbox') {
				var EmailCell = Backgrid.EmailCell.extend({
					className: 'email-cell',
					render: function render() {
						this.$el.empty();
						var formattedValue = this.formatter.fromRaw(this.model.get(this.column.get('name')));
						this.$el.append($('<a>', {
							tabIndex: -1,
							title: formattedValue
						}).text(formattedValue));
						this.delegateEvents();
						return this;
					}
				});
				var formatterObj = _.extend({}, Backgrid.CellFormatter.prototype, {
					fromRaw: function fromRaw(rawValue) {
						if (!FL.common.validateEmail(rawValue)) rawValue = 'Invalid email';
						return rawValue;
					},
					toRaw: function toRaw(formattedData) {
						if (!FL.common.validateEmail(formattedData)) return undefined;
						return formattedData; //+ "X";
					}
				});
				retObj['cell'] = EmailCell;
				retObj['formatter'] = formatterObj;
			} else if (typeUI == 'xsearchbox') {
				var xSearchCell = Backgrid.Cell.extend({
					className: 'search-cell',
					initialize: function initialize(options) {
						xSearchCell.__super__.initialize.apply(this, arguments);
					},
					editor: xSearchCellEditor, //PhoneCellEditor,
					xrender: function xrender() {
						console.log('render-->' + this.$el.val());
						return this;
					}
				});
				var formatterObj = _.extend({}, Backgrid.CellFormatter.prototype, {
					fromRaw: function fromRaw(rawValue) {
						console.log('fromRaw------------------>' + rawValue);
						return rawValue;
					},
					toRaw: function toRaw(formattedData) {
						console.log('toRaw-->' + formattedData);
						return formattedData; //+ "X";
					}
				});
				retObj['cell'] = xSearchCell;
				retObj['formatter'] = formatterObj;
			} else if (typeUI == 'lookupbox') {
				// var lookupCell = Backgrid.Extension.AutocompleteCell.extend({
				// 	render: function(){
				// 		console.log("lookup render-->"+this.$el.val());
				// 		return this;
				// 	}	
				// )};	
				var formatterObj = _.extend({}, Backgrid.CellFormatter.prototype, {
					fromRaw: function fromRaw(rawValue) {
						console.log('fromRaw------------------>' + rawValue);
						return rawValue + '_In';
					},
					toRaw: function toRaw(formattedData) {
						alert('searchbox toRaw-->' + formattedData);
						return formattedData + '_Out';
					}
				});
				retObj['cell'] = Backgrid.Extension.AutocompleteCell;
				// retObj["cell"] = lookupCell;// Backgrid.Extension.AutocompleteCell;
				retObj['autocompleteUrl'] = '/names';
				retObj['minTermLength'] = 3;
				retObj['labelProperty'] = 'name';
				retObj['formatter'] = formatterObj;
			} else if (typeUI == 'urllbox') {
				retObj['cell'] = 'uri';
			} else {
				alert('FL.bg cellType error unknown typeUI !!!-->' + typeUI);
			}
		}
		return retObj;
	};
	return {
		dateFormat: 'MDY', //possible values:"YMD","MDY","DMY"
		// colDef: function(name,label,nesting,width,type,enumerable) {
		colDef: function colDef(gridDefinition, field) {
			//colDef will receive two type of data:
			//	 grid definition data - label, nestingArr, width
			//	 field dictionary data  - name, typeUI, enumerable, decimals
			//name - The key of the model attribute
			//label - The name to display in the header
			//nesting - default is [], -->one title above ["General"], -->2 titles above  ["General", "Detail"]
			//type ->"string","integer","number","date","uri","stringUpper","email","area","phone","datetime"
			// Old Examples
			//	   FL.bg.colDef("name","Name JO",["General JO"],"*","datetime"),
			//     FL.bg.colDef("pop","Population JO", ["Custom","numbers"],20,"integer"),
			//     FL.bg.colDef("percentage","% of World Population JO",["Custom", "numbers"],100,"number"),

			// var retObj = {name:name,label:label,nesting:nesting,width:width,resizeable:true,orderable:true};
			var retObj = { name: field.name, label: gridDefinition.label, nesting: gridDefinition.nesting, width: gridDefinition.width, resizeable: true, orderable: true };
			_.extend(retObj, cellType(field.typeUI, field.enumerable, FL.common.appsettings.decimals, FL.common.appsettings.currency));
			return retObj;
		},
		getGridDefaultLayout: function getGridDefaultLayout(eCN) {
			//returns an object {baseTable:eCN,format:[array of objects defining each column]}
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
					if (element.name != 'id') {
						var fCN = L2C[element.name]; //element.name;
						var label = element.label;
						var nestingArr = [];
						var colDefinition = { fCN: fCN, label: label, width: '*', nestingArr: nestingArr };
						gridFormat.push(colDefinition);
					}
				}, this);
				layoutObj = { 'baseTable': eCN, 'format': gridFormat };
			} else {
				alert('FL.bg.getGridDefaultDefinition Error: entity with compressed name=\'' + eCN + '\' does not exist in local Dictionary.');
			}
			return layoutObj;
		},
		XsetupGridColumnsArr: function XsetupGridColumnsArr(oLayout) {
			//returns the columnArr to be used in utils.mountGridInCsvStore
			// ex: var columnsArr = FL.bg.setupGridColumnsArr(gridLayout);
			FL.dd.init_t(); //to init the temporary subsystem
			var exitToPrepare = true;
			var tryFirstLookup = true;
			var thiz = this;
			console.log('setupGridColumnsArr ----------------------------------------------------------');
			_.each(oLayout.format, function (element) {
				//each element of oLayout.format array is like {fCN:"50","1st Column",width:20,nestingArr:[]}
				var field = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN];
				console.log('setupGridfieldumnsArr --> field name=' + field.name + ' typeUI=' + field.typeUI);
				if (true && field.typeUI == 'lookupbox' && tryFirstLookup) {
					exitToPrepare = false;
					tryFirstLookup = false;
					alert('lookup !!! ->' + JSON.stringify(field)); // + "\n gridDefinition ->" + JSON.stringify(gridDefinition));
					var eCN = '6A'; //field.specialTypeDef.eCN;
					alert('eCN=' + eCN);
					var openPromise = FL.API.openTable('6A');
					openPromise.done(function (dataArray) {
						FL.common.printToConsole('>>>>>setupGridColumnsArr openPromise SUCCESS <<<<< ', 'API');
						var columnsArr = thiz.prepareGridColumnsArr(oLayout, dataArray);
						return columnsArr;
					});
					openPromise.fail(function (err) {
						FL.common.printToConsole('>>>>>setupGridColumnsArr openTable FAILURE <<<<<' + err, 'API');def.reject(err);
					});
				}
			});
			if (exitToPrepare) {
				var columnsArr = this.prepareGridColumnsArr(oLayout);
				return columnsArr; //each element of columnsArr array is like {cell:"string",label:"a",name:"a"...eventually others}
			};
		},
		setupGridColumnsArr: function setupGridColumnsArr(oLayout, lookupData) {
			//returns the columnArr to be used in utils.mountGridInCsvStore
			// ex: var columnsArr = FL.bg.setupGridColumnsArr(gridLayout);
			var columnsArr = [];
			if (lookupData) {
				alert('prepareGridColumnsArr lookup !!! ->' + JSON.stringify(lookupData));
			}
			// FL.dd.init_t();//to init the temporary subsystem
			// var arrOfFieldsObj = FL.dd.t.entities[oLayout.baseTable].fieldsList();
			_.each(oLayout.format, function (element, index) {
				//each element of oLayout.format array is like {fCN:"50","1st Column",width:20,nestingArr:[]}
				console.log(element.fCN);
				// var name = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN].name;
				// var typeUI = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN].typeUI;
				// var enumerable = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN].enumerable;
				// var ddFieldDefinition = {name:name,typeUI:typeUI,enumerable:enumerable};
				var gridDefinition = { label: element.label, nestingArr: element.nestingArr, width: element.width };
				//var arrElObj = FL.bg.colDef(name,element.label,element.nestingArr,element.width,typeUI,enumerable);
				var field = FL.dd.t.entities[oLayout.baseTable].fields[element.fCN];
				// if(field.typeUI == "lookupbox") {
				// 	alert("lookup !!! ->" + JSON.stringify(field) + "\n gridDefinition ->" + JSON.stringify(gridDefinition));
				// 	//FL.API.openTable("6A")

				// }
				var arrElObj = FL.bg.colDef(gridDefinition, field);
				arrElObj = _.omit(arrElObj, ['nesting', 'orderable', 'resizeable', 'width']); //temporary while these propoerties are inactive
				columnsArr.push(arrElObj);
			}, this);
			//inserts auxiliary columns upfront
			columnsArr.unshift({ name: '', cell: 'select-row', headerCell: 'select-all' }, { editable: false, label: '#', name: 'id', cell: Backgrid.IntegerCell.extend({ orderSeparator: '' }) });
			return columnsArr; //each element of columnsArr array is like {cell:"string",label:"a",name:"a"...eventually others}
		},
		testFunc: function testFunc(x) {
			return 'FL.bg.test() -->' + x;
		}
	};
})();

//# sourceMappingURL=FLbackgrid2-compiled.js.map