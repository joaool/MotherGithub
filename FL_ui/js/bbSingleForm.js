(function() { //App is a name space.

window.App = {
	Models: {},
	Collections: {},
	Views: {},
	Router: {}
};
App.Router = Backbone.Router.extend({
	routes: {
		'': 'index',
		'show/:id': 'show',
		'download/*random': 'download',
		'search/:query': 'search',
		'*other': 'default'
	},
	index: function(){
      $(document.body).append("Index route has been called..");
	},
	show: function(id){
		$(document.body).append("Show route has been called.. with id equals : " +  id);
	},
	download: function(random) {
		$(document.body).append("download route has been called.. with random equals : " + random);
	},
	search: function(query) {
		$(document.body).append("Search route has been called.. with query equals : " + query);
	},
	default: function(other) {
		$(document.body).append("This route is not hanled.. you tried to access: " + other);
	}
});
new App.Router();
Backbone.history.start();


window.template = function(id) {
	// htmlTemplateFunc = _.template( $('#' + id).html() );
	// return htmlTemplateFunc;
	fieldArr = [//fieldType:text,number,email,date
		{fieldId: "f1",fieldLabel: "Name",fieldType: "text",fieldValue: "<%= name %>"},
		{fieldId: "f2",fieldLabel: "Age",fieldType: "number",fieldValue: "<%= age %>"},
		{fieldId: "f3",fieldLabel: "Occupation",fieldType: "text",fieldValue: "<%= occupation %>"}
	];       
	var funcToReturn = utils.singleFormTemplate("Using singleFormTemplate","Clients",fieldArr);
	return funcToReturn;
};

var FLTemplate = function() {
	var funcToReturn = utils.singleFormTemplate("Using singleFormTemplate","Clients");
	return funcToReturn;
};

// Person Model
App.Models.Person = Backbone.Model.extend({
	defaults: {
		name: 'Guest User',
		age: 23,
		occupation: 'Worker'
	},
	//in older Backbone version method set invokes validate method automatically. But now the validation is disabled by default.
	//==>person.set('age', -25, {validate:true}); or person.set({name:"joao",age:-1},{validate:true})
	validate: function(attributes) {
		console.log("attributes-->"+attributes);
		if ( attributes.age < 0 ) {
			return 'Age must be positive.';
		}

		if ( !attributes.name ) {
			return 'Every person must have a name.';
		}
	},
	work: function() {
		return this.get('name') + ' is working.';
	}
});//App.Models.Person

// A List of People
App.Collections.People = Backbone.Collection.extend({
	model: App.Models.Person
});

// View for all people
App.Views.People = Backbone.View.extend({
	tagName: 'ul',

	initialize: function(){
		this.collection.on('add', this.addOne, this);  // listeners/anouncers for the collection on add..
	},
	// render: function() {
	// 	// alert("xxx");
	// 	var k=0;
	// 	this.collection.each(function(person) {
	// 		// console.log((k++)+"--->"+person);
	// 		var personView = new App.Views.Person({ model: person });
	// 		// console.log(personView.el);
	// 		// this.$el.append(personView.el); // adding all the person objects.
	// 		this.$el.append(personView.render().el); // calling render method manually..
	// 	}, this);

	// 	return this;// returning this for chaining..
	// }
	// refactored render method...
	render: function(){
		this.collection.each(this.addOne, this);
		return this;
	},

	// called from render method of collection view..
	addOne: function(person){
		var personView = new App.Views.Person({ model: person });
		this.$el.append(personView.render().el);
	}
});



// The View for a Person
App.Views.Person = Backbone.View.extend({
	// el: $("#content"),
	// tagName: 'li',

	// my_template: _.template("<strong><%= name %></strong> (<%= age %>) - <%= occupation %>"),//example of inline template
	// template: _.template( $('#personTemplate').html() ),
	template: template('personTemplate2'),//template is a function returning a template with the tagged attributes

	initialize: function(){
		this.model.on('change', this.render, this);
			// this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
		this.render();
	},
	events: {
		// 'click' : 'showAlert' //'click strong' : 'showAlert' woul recognize the click only in name because of <strong><%= name %></strong>
		'click .edit' : 'editPerson',
		'click .delete' : 'DestroyPerson'  /// 1. Binding a Destroy for the listing to click event on delete button..
	},
	showAlert: function(){
		// alert("You clicked -->"+JSON.stringify(this.model.toJSON()));
		alert("You clicked -->"+this.model.get("name"));
	},
	editPerson: function(){
		var newName = prompt("Please enter the new name", this.model.get('name'));
		if (!newName)return;  // don't do anything if cancel is pressed..
		this.model.set('name', newName);
	},
	DestroyPerson: function(){
		alert("XXX -->"+this.model.get("name"));
		this.model.destroy();  // 2. calling backbone js destroy function to destroy that model object
	},
	remove: function(){
		this.$el.remove();  // 4. Calling Jquery remove function to remove that HTML li tag element..
	},
	render: function() {
			// this.$el.html( this.my_template(this.model.toJSON()) );
		this.$el.html( this.template(this.model.toJSON()) );
		return this;// returning this for chaining..tp allow his.$el.append(personView.render().el); in PeopleView
	}
});


App.Views.AddPerson = Backbone.View.extend({
	el: '#addPerson',

	events: {
		'submit': 'submit' // binding submit click to submit function..
	},

	submit: function(e) {
		// alert("XXX SUBMIT -->");
		// alert("XXX SUBMIT -->"+this.model.get("name"));

		e.preventDefault();
		var newPersonName = $(e.currentTarget).find('input[type=text]').val();
		alert("XXX SUBMIT -->"+newPersonName);

		var person = new App.Models.Person({ name: newPersonName });// creating a new person object..
		this.collection.add(person);// adding this to current collection..


	}
});
var peopleCollection = new App.Collections.People([
	{
		name: 'Mohit Jain',
		age: 26
	},
	{
		name: 'Taroon Tyagi',
		age: 25,
		occupation: 'web designer'
	},
	{
		name: 'Rahul Narang',
		age: 26,
		occupation: 'Java Developer'
	}
]);


//------------------------------------------------------------------
// View for all people


var addPersonView = new App.Views.AddPerson({ collection: peopleCollection });
var peopleView = new App.Views.People({ collection: peopleCollection });
var person = new App.Models.Person({name:'joao oliveira',age:'58',occupation:'inventor'});
var personView = new App.Views.Person({model:person});


// var addCsvElementView = new App.Views.AddCsvElement({ collection: csvSetCollection });

// var csvSetView = new App.Views.CsvSet({ collection: csvSetCollection, templateId:"csvElementTemplate2" });
console.log("it will append peopleView.render().el to #personContent ");
	// $("#personContent").append(peopleView.render().el);   // adding people view in DOM.. Only for demo purpose...
// $("#personContent").append(personView.render().el);   // adding people view in DOM.. Only for demo purpose...
	// $("#csvcontent").append(csvSetView.render().el);   // adding people view in DOM.. Only for demo purpose...

})();