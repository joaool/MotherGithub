/*! FLMenu - v1.0.0 - 2014-05-14
Dependencies: JQuery, Underscore.js
	//  PATERN http://stackoverflow.com/questions/1841916/how-to-avoid-global-variables-in-javascript
	// (function() {
	//	Your code here
	//	Expose to global
	//	window['varName'] = varName;
	// })();
* Copyright (c) 2014 FrameLink Co. - JO */
var FL = FL || {};
// var FLMenu = function(oMenu, initialMenu ) {
// FL["menu"] = function(oMenu, initialMenu ) {
FL["menu"] = function(menuSettings) {
	console.log("1 - %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%>I am FLMenu !!!! ");//+oMenu.menu[0].title);
	menuSettings = _.extend( {jsonMenu:null,initialMenu:null,editable:false},menuSettings);
	if(!menuSettings.jsonMenu) {
		alert("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%FL.menu Error:settings has no jsonMenu !");
	}
	if(menuSettings.jsonMenu){
		if (typeof(Storage) != "undefined") {//browser supports storage
			var lastMenu = localStorage.getItem("storedMenu");// Retrieve
			// alert("localWebMenuMemory="+lastMenu+"<");
			if(!lastMenu){// nothing was saved before
				// alert("nothing was saved before. We will save:"+JSON.stringify(oMenu));
				// localStorage.setItem("localWebMenuMemory", JSON.stringify(oMenu));
				console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%>save locally storedMenu !!!! ");//+oMenu.menu[0].title);
				localStorage.storedMenu = JSON.stringify(menuSettings.jsonMenu);
			}else{//something was saved before
				console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%>recover local storedMenu !!!! ");//+oMenu.menu[0].title);
				menuSettings.jsonMenu = JSON.parse(lastMenu);
			}
		}else{
			BootstrapDialog.alert('No menu persistence because your browser does not support Web Storage...');
		}
	}else{
		alert("FL.menu Error menuSettings.jsonMenu is null !!!");
	}
	var oMenu = FL.clone(menuSettings.jsonMenu);
	
	//--------------------------------- all code passes here !!! ---------------------------
	alert("FL.menu()  -> Entrance door with:\n"+JSON.stringify(menuSettings.jsonMenu));
	//---------------------------------------------------------------------------------------

	Object.size = function(obj) {//var size = Object.size(myArray); The safe way to get the length of an associative array http://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};
	// CHAINING WITH UNDERSCORE http://stackoverflow.com/questions/3945673/underscore-js-how-to-chain-custom-functions
	var menuEach = function (menuArray,action,initialOrder){//initialOrder is optional. If missing we assume =0
		//all action methods will receive (element,order,top ) where element is the current menuArray[i], order is the current order and top is true only for tier one menu options. action should ALWAYS RETURN element
		//Example: menuEach(oMenu.menu,add_Id_Top);//any call to menuEach returns the next available idOrder
		var idOrder = initialOrder, top = false;
		if(!idOrder) idOrder = 0;
		if( idOrder === 0){
			top = true;
		}
		for(var i=0;i<menuArray.length;i++){
			//menuArray[i] = action(menuArray[i]);
			menuArray[i] = action.call(null,menuArray[i],idOrder,top);
			idOrder++;
			if( menuArray[i]["menu"] ) {
				idOrder = menuEach(menuArray[i]["menu"],action,idOrder,top);
			}
		}
		return idOrder;//return lastOrder+1
	};
	// menuEach(oMenu.menu,add_Id_Top);//any call to menuEach returns the next available idOrder

	var addStarToTitle = function(element) {//second pareamenter not used
		element.title+="***";
		return element;
	};
	var add_Id_Top = function(element,order,top) {
		element["id"]=order;
		// var topLevelLength = oMenu.menu.length;
		var topLevelLength = menuSettings.jsonMenu.menu.length;
		element["top"]=top;
		// if( top ) element.title = "[" + element.title + "]" ;//EXAMPLE
		return element;
	};
	var menuFindById = function(menuArray,id) {//ret element (null if no find)->ex:alert( "title="+menuFindById(oMenu.menu,14).title);
		var retElement = null;
		var order = menuEach(menuArray,function(element,order) {
			if(	id == order) {
				retElement = element;
			}
			return element;
		});
		return retElement;
	};
	var appendLastTop = function(menuArray,title) {//inserts a Top menu position in last position with title=title
		var lastTopPosition = menuArray.length - 1;
		var idOfNewLastTopPosition = menuEach(menuArray,add_Id_Top);//any call to menuEach returns the next available idOrder
		menuArray.push({ "title":title,"uri":"#", id: idOfNewLastTopPosition,top:true});
		return idOfNewLastTopPosition;
	};
	var appendLastTopOnDOM = function(menuArray) {
		var lastTopPosition = menuEach(menuArray,add_Id_Top)-1;//any call to menuEach returns the next available idOrder
		var menuItem = menuFindById(menuArray,lastTopPosition);
		var htmlStr = "<li><a id="+ menuItem.id +" href=" + menuItem.uri + ">" + menuItem.title + "</a></li>";
		var $menu = $("#begin_menu");
		$menu.append( $( htmlStr) );//with $(htmlStr) we convert htmlStr to a JQuery object
	};
	var is_menuHide = true;//this variable will control if menu is hidding or not 
	var menuRefresh = function(menuArray){//sets dom with menuArray definition
		var $menu = $("#begin_menu");
		$menu.empty();//removes the child elements of the selected element(s).
		var oMenuHTML = null;
		for (var i=0;i<menuArray.length;i++){//scans top menus
			oMenuHTML = menuHTML( menuArray[i] );//{order:order,html:htmlStr}; scans nested menus in current top menu
			$menu.append( $( oMenuHTML.html) );//with $(htmlStr) we convert htmlStr to a JQuery object
		}
		$menu.smartmenus('refresh');//necessary to show submenus if dom is changed
		var $mainMenu = $("#begin_menu");
		var k=0;
		$mainMenu.mousedown(function(event) {//exists only to set is:menu = false on right mouse (if editable)!!!!
			switch (event.which) {
				case 1://Left Mouse button pressed
					break;
				case 2://Middle Mouse button pressed
					break;
				case 3://Right Mouse button pressed
					is_menuHide = true;
					if(menuSettings.editable)
						is_menuHide = false;
					break;
				default:
					console.log('You have a strange Mouse!');
			}
		});
		$mainMenu.bind('beforehide.smapi', function(e, item) {//Fired by smartmenus right before a sub menu is hidden.
			console.log("hide" + k);//OK
			return is_menuHide;//submenu will not be hidden if is_menuHide=false
		});
	};
	var getMenuTag = function(path){ // return the content after the last "/" disregarding a terminal "/"
		var menuTag = path.substring(path.lastIndexOf("/"));
		var pos = null;
		if(menuTag=="/"){//if path is "/" terminated. - menutag 
			var pathWithoutLast = path.substring(0,path.length-1);//removes last "/"
			pos=pathWithoutLast.lastIndexOf("/");
			menuTag = pathWithoutLast.substring(pos+1);
		}else{
			pos=path.lastIndexOf("/");
			menuTag = path.substring(pos+1);
		}
		return menuTag;
	};
	// alert ('getMenuTag("http://www.microsoft.com/bazaruco.abc") = '+getMenuTag("http://www.microsoft.com/bazaruco.abc"));
	// alert ('getMenuTag("_home/") = '+getMenuTag("_home/"));
	var loadInternalPage = function(menuName) {//load html block and places it in id="_placeHolder"
		var $placeHolder = $("#_placeHolder");
		if (!$placeHolder.length ) {
			alert("FrameLink Menus Error. Undefined _placeHolder in DOM");
		}else{//"#_placeHolder" exists in DOM
			$.get(menuName+".html") //exists
				.done(function() { 
					$placeHolder.empty();//removes the child elements in placeHolder.
					$("#_placeHolder").load(menuName+".html");
			}).fail(function() { 
				alert("Error in FL.menu loadInternalPage - This menu option points to an internal page "+menuName+".html that does not exist!!!");
			});
			// $placeHolder.empty();//removes the child elements in placeHolder.
			// $("#_placeHolder").load(menuName+".html");
		}
	};
	var dispatchHref = function(href) { //for "./mission.html" returns "mission.html" - for "./mission.html/" returns "mission.html"
		var menuTag = getMenuTag(href);
		// alert("href="+href+" ---------> menuTag="+menuTag);
		if(menuTag.substr(0,1) == "_"){ //ex:"http://www.microsoft.com" or "./mission.html"
			// alert("Special menu command ->"+menuTag);
			loadInternalPage(menuTag);
		}else{
			// alert("Normal dispatch to internal and external url for "+menuTag);
			console.log("------------------------------------>Is going to leave to  ->"+href);
			localStorage.storedMenu = JSON.stringify(menuSettings.jsonMenu);//stores before leaving
			// alert("SAI com:"+JSON.stringify(oMenu) );
			location.href = href;
			// alert("Chegou aqui 150 !!!");
		}
	};
	var refHandler = function(event) {
		console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%> refHandler called with "+event.target.nodeName);
		if(event.target.nodeName === 'A') {
			var href = event.target.href;
			// change the URL
			// location.href = href;
			dispatchHref(href);
			event.preventDefault();
		}
	};
	// if(menuSettings.jsonMenu){
		console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%>add event refHandler");
		$( "#begin_menu" ).on( "click", refHandler);//a click will call refHandler
	// }
	var menuHTML = function(menuItem){//returns HTML string for bootstrap menu 
		var htmlStr = "<li><a id="+ menuItem.id +" href=" + menuItem.uri + ">" + menuItem.title + "</a></li>";
		// var htmlStr = "<li><a id="+ menuItem.id +" href=" + menuItem.uri + " onClick='alert(beforeLink())'>" + menuItem.title + "</a></li>";
		if(menuItem.menu){
			htmlStr =  "<li><a id="+ menuItem.id +" href=" + menuItem.uri + ">" + menuItem.title + "</a>";
			// htmlStr =  "<li><a id="+ menuItem.id +" href=" + menuItem.uri + " onClick='alert(beforeLink())'>" + menuItem.title + "</a>";
			htmlStr +=    "<ul class='dropdown-menu'>";
			var subMenuItem = menuItem.menu;
			for (var i=0;i<subMenuItem.length;i++){
				oMenuHTML = menuHTML( subMenuItem[i] );//returns {order:order,html:htmlStr};
				htmlStr += oMenuHTML.html;
			}
			htmlStr +=    "</ul>";
			htmlStr += "</li>";
		}
		return {order:0,html:htmlStr};
	};

	var updateMenuItemById = function(menuArray,updatedElement,id){//finds id and replace menuItem by updatedElement
		//updateMenuItemById(menuArray,{title:"abc",uri:"http://microsoft.com"},14)
		var order = menuEach(menuArray,function(element,order) {
			if( id == order) {
				element = _.extend(element,updatedElement);//passed by reference
			}
			return element;
		});
		return true;
	};
	// menuEach(oMenu.menu,add_Id_Top);//any call to menuEach returns the next available idOrder
	// updateMenuItemById(oMenu.menu,{"title" : "Patolinas","uri":"#69"},15);
	// oEl = menuFindById(oMenu.menu,15);
	// alert( "title="+oEl.title+" uri="+oEl.uri+" id="+oEl.id+" top="+oEl.top);
	var getParentIdOfId = function(menuArray,id) {//returns Id of the parent menuitem containing a given Id.If id is toplevel return -1
		id =parseInt(id);
		var retId = -1;
		var isFoundElement=!(_.isUndefined(_.findWhere( menuArray,{id:id} )));//at top level ->true if found false if not found
		console.log("isFoundElement="+isFoundElement);
		if(!isFoundElement) {
			menuEach(menuArray,function(element,order,top){//menuEach passes (element,order,top )
				if(element.menu) {//goes up
					// console.log("getParentIdOfId -->"+element.title+" order="+element.id+" top="+element.top+" retId="+retId);
					if(element.id == id) {//the id belongs to a menuItem with a menu
						//
					}else{
						isFoundElement=!( _.isUndefined( _.findWhere( element.menu,{id:id} ) ) );//at submenu level 
						if(isFoundElement)
							retId = element.id;
					}
				}
				return element;
			});
		}
		return retId;
	};
	// menuEach(oMenu.menu,addStarToTitle);//any call to menuEach returns the next available idOrder
	// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%>I am FLMenu !!!! menuEach(oMenu.menu,add_Id_Top)");//+oMenu.menu[0].title);
	// alert( "title="+menuFindById(oMenu.menu,14).title);
	// _.each(_.range(21),function(z){
	//	var z = 6;
	//	var x = getParentIdOfId(oMenu.menu,z);
	//	alert("Parent of "+ z + " is="+x);
	// });
	// if(menuSettings.jsonMenu) {
		console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%>add_Id_Top and menuRefresh(menuSettings.jsonMenu.menu)");//+oMenu.menu[0].title);
		// menuEach(oMenu.menu,add_Id_Top);//any call to menuEach returns the next available idOrder
		// menuRefresh(oMenu.menu);
		menuEach(menuSettings.jsonMenu.menu,add_Id_Top);//any call to menuEach returns the next available idOrder
		menuRefresh(menuSettings.jsonMenu.menu);
	// }
	// if(menuSettings.initialMenu){ //settings has initialMenu
	// }
	// if(initialMenu){ //FLMenu has a second parameter
	//	loadInternalPage(initialMenu);
	// }
	if(menuSettings.initialMenu){ //FLMenu has a second parameter
		console.log("Inside FLMenu with initial ="+menuSettings.initialMenu);
		loadInternalPage(menuSettings.initialMenu);
	}
	// var getNextTopId =  menuEach(oMenu.menu,add_Id_Top);//any call to menuEach returns the next available idOrder
	// alert("getNextTopId="+getNextTopId);
	var z=32;
	(function($, window){ //IIFE (Immediately Invoked Function Expression) 
		setupContextMenu = function(jsonMenu,e){//changes DOM template according with e.target
			var menuText = "Rename " + $(e.target).text();// + " menu";//default is menu
			var menuTag = $(e.target).get(0).tagName;//A for normal menus <a>menu</a> and IMG for brand
			var menuId = $(e.target).attr("id");//get id of current line
			var $contextMenu = $("#contextMenu");
			$contextMenu.empty();//removes the child elements of the selected element(s).
			if(menuTag == "IMG"){//the brand was clicked
				$contextMenu.append("<li><a tabindex='-1' href='#'>Update Logo</a></li>");
				$contextMenu.append("<li class='divider'></li>");
				$contextMenu.append("<li><a tabindex='-1' href='#'>Cancel</a></li>");
			}else if(menuTag == "A") {// a menu item was clicked
				var menuItem = menuFindById(menuSettings.jsonMenu.menu,menuId);
				var topMenu = menuItem.top;
				$contextMenu.append("<li><a tabindex='-1' href='#'>" + menuText + "</a></li>");
				if( topMenu ){
					$contextMenu.append("<li><a tabindex='-1' href='#'>Add submenu</a></li>");
					$contextMenu.append("<li><a tabindex='-1' href='#'>Remove menu</a></li>");
				}else{
					$contextMenu.append("<li><a tabindex='-1' href='#'>Add submenu before</a></li>");
					$contextMenu.append("<li><a tabindex='-1' href='#'>Add submenu after</a></li>");
					if(!menuItem.menu) {//no submenu
						$contextMenu.append("<li><a tabindex='-1' href='#'>Create inside submenu</a></li>");
						$contextMenu.append("<li><a tabindex='-1' href='#'>Remove this menu item</a></li>");
					}else{//has submenu
						$contextMenu.append("<li><a tabindex='-1' href='#'>Remove inside submenus</a></li>");
					}
				}
				$contextMenu.append("<li class='divider'></li>");
				$contextMenu.append("<li><a tabindex='-1' href='#'>Cancel</a></li>");
			}else if(menuTag == "DIV") {// the menubar was clicked
				$contextMenu.append("<li><a tabindex='-1' href='#'>Add top menu</a></li>");
				$contextMenu.append("<li class='divider'></li>");
				$contextMenu.append("<li><a tabindex='-1' href='#'>Cancel</a></li>");
			}
			return menuTag;
		};
		var kk=0;
		$.fn.contextMenu = function(settings) {//jQuery.fn is just an alias for jQuery.prototype  
			var k=0;
			// return this.each(function(menuSettings) { //to iterate over all matched elements
			return this.each(function() { //to iterate over all matched elements
				// Open context menu
				// alert("contextMenu plugin k="+(k++)+" menuSettings.jsonMenu.menu[0].title="+menuSettings.jsonMenu.menu[0].title);
				console.log((kk++)+" - ######################################################### =>"+menuSettings.jsonMenu.menu[0].title);

				var menuTag = null;
				if(menuSettings.editable){	
					$(this).on("contextmenu", function (e) {
						// alert("==== context menu was called for "+ settings.menuSelector +"--->" + $(e.target).html());
						console.log("==== context menu was called for "+ settings.menuSelector +"--->" + $(e.target).text());
						// e.stopPropagation();
						// e.cancelBubble = true;
						menuTag = setupContextMenu(menuSettings.jsonMenu,e);
						$(settings.menuSelector)
							.data("invokedOn", $(e.target)) //attach data to settings.menuSelector, under the name "invokeOn" 
							.show() //The matched elements will be revealed immediately, with no animation
							.css({
								position: "absolute",
								left: getLeftLocation(e),
								top: getTopLocation(e)
							});
						return false;
					});
				}else{
					$(this).off("contextmenu");
					console.log("==== context menu was disabled");
				}
				// click handler for context menu
				$(settings.menuSelector).click(function (e) {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~> menuSelector was triggered by click !!!");

					$(this).hide();
					var $invokedOn = $(this).data("invokedOn");
					var $selectedMenu = $(e.target);
					var invoke = $invokedOn.text();
					var selMenu = $selectedMenu.text();
					// alert("==== selected Menu = "+ selMenu);
					e.stopPropagation();//necessary for x-editable .editable('show)
					settings.menuSelected.call($(this), $invokedOn, $selectedMenu, menuTag, menuSettings);//both parameters are JQuery objects
				});

				//make sure menu closes on any click
				$(document).click(function () {
					$(settings.menuSelector).hide();
				});
				return $(this);
			});
			function getLeftLocation(e) {
				var mouseWidth = e.pageX;
				var pageWidth = $(window).width();
				var menuWidth = $(settings.menuSelector).width();
				// opening menu would pass the side of the page
				if (mouseWidth + menuWidth > pageWidth &&
					menuWidth < mouseWidth) {
					return mouseWidth - menuWidth;
				}
				return mouseWidth;
			}
			function getTopLocation(e) {
				var mouseHeight = e.pageY;
				var pageHeight = $(window).height();
				var menuHeight = $(settings.menuSelector).height();
				// opening menu would pass the bottom of the page
				if (mouseHeight + menuHeight > pageHeight &&
					menuHeight < mouseHeight) {
					return mouseHeight - menuHeight;
				}
				return mouseHeight;
			}
		};
	})(jQuery, window);
	var findOrderOfIdInSubmenu = function(submenu,id){
		var index= -1;
		_.each(submenu, function(element, idx) {
			if(element.id == id) {
				index = idx;
				return;
			}
		});
		return index;
	};
	var removeSubmenu = function(submenu,index,parentMenuItem) {
		if (index > -1) {
			if(parentMenuItem.menu.length==1){//it is the last submenu we should clear the menu key on parent...
				// alert("remove key menu from "+parentMenuItem.id+" title="+parentMenuItem.title)
				delete parentMenuItem.menu;
			}else{
				submenu.splice(index, 1);
			}
		}
	};
	var addSubmenu = function(submenu,index) { //only for top menus. Append a submenu to second level menus
		// alert(submenu[index].title + "/" + submenu[index].id);
		if(submenu[index].menu){
			submenu[index].menu.push({title:"New",uri:"#"});
		}else{
			submenu[index]["menu"] = [{title:"New",uri:"#"}];
		}
	};
	var addSubmenuBefore = function(submenu,index) { //2nd level+ only. Insert a menu before
		// alert(submenu[index].title + "/" + submenu[index].id);
		if (index > -1) {
			submenu.splice(index, 0,{title:"New",uri:"#"});
		}
	};
	var addSubmenuAfter = function(submenu,index) { //2nd level+ only. Insert a menu after
		// alert(submenu[index].title + "/" + submenu[index].id);
		if (index > -1) {
			submenu.splice(index+1, 0,{title:"New",uri:"#"});
		}
	};
	var changeToSubmenuInside = function(submenu,index) { //2nd level+ only.Insert a menu after
		// alert(submenu[index].title + "/" + submenu[index].id);
		if(submenu[index].menu) {
			//submenu[index].menu.push({title:"New",uri:"#"});
			console.log("Nothing to do ...this menu is already a gate to other submenus");
		}else{
			submenu[index]["menu"] = [{title:"New",uri:"#"}];
		}
	};
	var onId = function(id,action) { //gets submenu containing id and does an action (removeSubmenu,addSubmenu...etc)
		// var parentId = getParentIdOfId(oMenu.menu,id);
		var parentId = getParentIdOfId(menuSettings.jsonMenu.menu,id);
		var parentMenuItem = menuFindById(menuSettings.jsonMenu.menu,parentId);
		var index = null;
		if (parentId == -1){//top level
			index = findOrderOfIdInSubmenu(menuSettings.jsonMenu.menu,id);
			action(menuSettings.jsonMenu.menu,index,parentMenuItem);
		}else{
			index = findOrderOfIdInSubmenu(parentMenuItem.menu,id);
			action(parentMenuItem.menu,index,parentMenuItem);
		}
	};
	var removeTopMenu = function(topmenu,id) {
		var index = findOrderOfIdInSubmenu(menuSettings.jsonMenu.menu,id);
		if (index > -1) {
			topmenu.splice(index, 1);
		}
	};
	var menuItemClicked = function(invokedOn, selectedMenu,menuSettings) {
		// alert("MenuItem clicked with menu="+selectedMenu.text().trim());
		console.log("***************************************************** =>"+menuSettings.jsonMenu.menu[0].title);
		var contextSelection = selectedMenu.text().trim();
		if( contextSelection.substring(0,6) == "Rename" ){
			// alert("rename !!!");
			var editId="#"+invokedOn.attr("id");//get attribute id from Jquery object
			$(editId).editable({
				type: 'text',
				title: 'Enter new menu title:',
				placement: 'bottom',
				validate: function(value) {
					updateMenuItemById(menuSettings.jsonMenu.menu,{title:value},invokedOn.attr("id"));
					if($.trim(value) === '') {
						return 'The menu title is required';
					}
					is_menuHide = true;
					menuRefresh(menuSettings.jsonMenu.menu);
				}
			});
			$(editId).editable('show');
		}else if(contextSelection == "Cancel") {//2nd level+ only. Append a submenu to second level menus
			menuEach(menuSettings.jsonMenu.menu,add_Id_Top);
			menuRefresh(menuSettings.jsonMenu.menu);
			is_menuHide = true;
			// alert("end of cancel");
		}else if(contextSelection == "Add submenu") {//2nd level+ only. Append a submenu to second level menus
			onId(invokedOn.attr("id"),addSubmenu);
			menuEach(menuSettings.jsonMenu.menu,add_Id_Top);
			menuRefresh(menuSettings.jsonMenu.menu);
			is_menuHide = true;
		}else if(contextSelection == "Add submenu before") {//2nd level+ only. Insert a menu before
			onId(invokedOn.attr("id"),addSubmenuBefore);
			menuEach(menuSettings.jsonMenu.menu,add_Id_Top);
			menuRefresh(menuSettings.jsonMenu.menu);
			is_menuHide = true;
		}else if(contextSelection == "Add submenu after") {//2nd level+ only. Insert a menu after
			onId(invokedOn.attr("id"),addSubmenuAfter);
			menuEach(menuSettings.jsonMenu.menu,add_Id_Top);
			menuRefresh(menuSettings.jsonMenu.menu);
			is_menuHide = true;
		}else if(contextSelection == "Create inside submenu") {//2nd level+ only. Makes an inside gate to a menu
			// alert("Add inside submenu TBD");
			onId(invokedOn.attr("id"),changeToSubmenuInside);
			menuEach(menuSettings.jsonMenu.menu,add_Id_Top);
			menuRefresh(menuSettings.jsonMenu.menu);
			is_menuHide = true;
		}else if(contextSelection == "Remove menu") {//remove at top level only
			var menuItem = menuFindById(menuSettings.jsonMenu.menu,invokedOn.attr("id"));
			if(menuItem.menu){//menu has subitems - requires confirmation to delete
				BootstrapDialog.confirm("All sub menus of " + menuItem.title + " will be lost. Do you want to delete them anyway ?", function(result) {
					console.log("Confirm result: "+result);
					if(result){
						removeTopMenu(menuSettings.jsonMenu.menu,invokedOn.attr("id"));
						menuEach(menuSettings.jsonMenu.menu,add_Id_Top);
					}
					menuRefresh(menuSettings.jsonMenu.menu);
					is_menuHide = true;
				},{title:"TOP MENU DELETE OPERATION !",button1:"Do not delete",button2:"OK to delete",type:'type-danger',cssButton2:"btn-danger"});
			}else{
				removeTopMenu(menuSettings.jsonMenu.menu,invokedOn.attr("id"));
				menuEach(menuSettings.jsonMenu.menu,add_Id_Top);
				menuRefresh(menuSettings.jsonMenu.menu);
				is_menuHide = true;
			}
		}else if(contextSelection == "Remove inside submenus") {//2nd level+ only
			var menuItem = menuFindById(menuSettings.jsonMenu.menu,invokedOn.attr("id"));
			if(menuItem.menu){//menu has subitems
				BootstrapDialog.confirm("All sub menus of " + menuItem.title + " will be lost. Do you want to delete them anyway ?", function(result) {
					console.log("Confirm result: "+result);
					if(result){
						delete menuItem.menu;
						menuEach(menuSettings.jsonMenu.menu,add_Id_Top);
					} 
					menuRefresh(menuSettings.jsonMenu.menu);
					is_menuHide = true;
				},{title:"DELETE OPERATION",button1:"Do not delete",button2:"OK to delete",type:'type-danger',cssButton2:"btn-danger"});
			}
		}else if(contextSelection == "Remove this menu item") {//2nd level+ only
			onId(invokedOn.attr("id"),removeSubmenu);
			menuEach(menuSettings.jsonMenu.menu,add_Id_Top);
			menuRefresh(menuSettings.jsonMenu.menu);
			is_menuHide = true;
		}
		// --- THIS CANNOT BE PLACED HERE BECAUSE WOULD NOT WORK (menus would be cleared and redone...)
		// menuEach(settings.jsonMenu.menu,add_Id_Top);//any call to menuEach returns the next available idOrder
		// menuRefresh(oMenu.menu);
		// is_menuHide = true;
		// alert("JOJO");
	};
	var toolbarClicked = function(invokedOn, selectedMenu){
		// alert("Toolbar clicked with menu="+selectedMenu.text());
		if( selectedMenu.text() == "Add top menu" ){
			var newId = appendLastTop(menuSettings.jsonMenu.menu,"New");
			appendLastTopOnDOM(menuSettings.jsonMenu.menu);
		}
	};
	// var menuSelector = "#contextMenu";
	$.fn.editable.defaults.mode = 'popup';
	// $(".container").contextMenu({

	if(menuSettings.editable) {
		// Time = 1
		console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Time = 1 AAA TRUE> editable=true  called $('#menuContainer').contextMenu()");
		$("#menuContainer").contextMenu({
			menuSelector: "#contextMenu",
			// menuSelector: menuSelector,
			menuSelected: function (invokedOn, selectedMenu, menuTag, menuSettings) {
				console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> time 2500 >>>>> "+menuSettings.jsonMenu.menu[0].title);
				//time= 2500
				//menu tag --> IMG=>the brand was clicked, DIV=>the menubar was clicked, A=>a menu was clicked 
				//invokeOn - has JQuery object with item clicked
				// alert(selectedMenu.text());
				// var msg = "You selected the menu item [" + selectedMenu.text() +
				//	"] on the value [" + invokedOn.text() + "] with Tag="+menuTag;
				// alert("editable="+ menuSettings.editable + " menuTag="+ menuTag + " selectedMenu.text()="+ selectedMenu.text());
				if(menuTag == "A") {
					menuItemClicked(invokedOn, selectedMenu,menuSettings);//shadowing the closure!
				}else if (menuTag == "DIV"){//the menubar was clicked
					toolbarClicked(invokedOn, selectedMenu,menuSettings);
				}else if (menuTag == "IMG"){
					alert("Logo uploading not yet available...");
				}
			}
		});
		// })(menuSettings);
	}else{
		console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Time=1 AAA FALSO> editable=false "+menuSettings.jsonMenu.menu[0].title);
		$("#menuContainer").contextMenu({
			menuSelector: "#___",
			menuSelected: null
		});	
		// })(menuSettings);	
	}
	console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  BBBB >exiting FL.menu()");
	return {
		// refresh: function() {
		// 	// menuSettings.jsonMenu = oMenu;
		// 	alert("FL.menu().refresh()"+menuSettings.jsonMenu.menu[0].title);
		// 	menuEach(menuSettings.jsonMenu.menu,add_Id_Top);
		// 	menuRefresh(menuSettings.jsonMenu.menu);
		// },
		// gime=1
		test: "abc"
	};
	// var menuView = new MenuView({model:Menu});
};