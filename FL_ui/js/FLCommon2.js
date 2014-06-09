/**
* Common functions to all FL modules 
	http://naveensnayak.wordpress.com/2013/06/26/dynamically-loading-css-and-js-files-using-jquery/
	http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
*/
var FL = FL || {};
FL["topics"] = {};

jQuery.Topic = function( id ) {//https://gist.github.com/addyosmani/1321768 publisher/subscriber
	//publishing ex.	$.Topic( 'signInDone' ).publish( 'hello Sign In !!!' );
	//subscribe example:
	// $.Topic( 'signInDone' ).subscribe( fn1 );//where-> var fn1 = function(par1){alert("par1 says:"+par1);};
	// $.Topic( 'signInDone' ).subscribe( fn2 );//where-> var fn2 = function(par1){alert("par2 ---->says:"+par1);};
	var callbacks,
		topic = id && FL.topics[ id ];
	if ( !topic ) {
		callbacks = jQuery.Callbacks();
		topic = {
			publish: callbacks.fire,
			subscribe: callbacks.add,
			unsubscribe: callbacks.remove
		};
		if ( id ) {
			FL.topics[ id ] = topic;
		}
	}
	return topic;
};
// BootstrapDialog.alert("FrameLink"); //http://nakupanda.github.io/bootstrap3-dialog/
// BootstrapDialog.confirm("FrameLink menus ?"); //http://nakupanda.github.io/bootstrap3-dialog/
//  BootstrapDialog.confirm = function(message, callback,options) {//http://nakupanda.github.io/bootstrap3-dialog/
BootstrapDialog.confirm = function(message,callback,options) {//http://nakupanda.github.io/bootstrap3-dialog/
	new BootstrapDialog({
		//element = _.extend(element,updatedElement);//passed by reference
		title: _.extend({title:"CONFIRMATION"},options).title,
		message: message,
		// form: '<label>Email </label><input type="text" id="titleDrop"><br><label>User Name</label><input type="text" id="descriptionDrop">',//form,
		// type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
		type: _.extend({type:'type-primary' },options).type, //'type-primary', 'type-info' .'type-success','type-warning','type-danger' 
		draggable:true,
		data: {
			'callback': callback
		},
		buttons: [{
				label: _.extend({button1:"Cancel"},options).button1,
				action: function(dialog) {
					typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
					dialog.close();
				}
			}, {
				label:  _.extend({button2:"Ok"},options).button2,
				cssClass: _.extend({cssButton2:"btn-primary"},options).cssButton2,
				action: function(dialog) {
					typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
					dialog.close();
				}
			}
		]
	}).open();
};
FL["clone"] = function(obj) {//http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object/5344074#5344074
	var ss = JSON.stringify(obj);
	return JSON.parse(ss);
	// return JSON.parse(JSON.stringify(obj));
};
FL["domInject"] = function(id,htmlContent) {//clean and replace content by htmlContent
	var target="#" + id;
	var $id = $(target);
	$id.empty();//removes the child elements of the selected element(s).
	if(htmlContent)
		$id.append( $( htmlContent ) );//with $(htmlContent) we convert htmlStr to a JQuery object
};
FL["validateEmail"] = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};