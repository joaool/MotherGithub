FormMakerModel =Backbone.Model.extend({
    
    loadEntities: function(callback){
        this.entitiesLoadedCallback = callback;
        this.connectToFLAPI(this.entitiesLoaded.bind(this));
    },

    connectToFLAPI: function(callback){
        var fl = new flMain();//only place where this must exist !!!!
		FL.fl = fl; //new flMain();
		fl.serverName(FL.common.getServerName());
		//---------------------load Default application
		loginObject = {email:"kartik@fl.com",password:"123"};
		var self = this;
        var loadDefaultAppPromise = FL.API.loadDefaultApp(loginObject)
        .then(function(menuData,homeHTML){
            FL.dd.init_t();
            callback();
            return;
        },function(err){alert("ERROR ->"+err.code+" - "+err.message);return;});
    },
    entitiesLoaded: function(){
        this.set("fields", FL.dd.t.entities[this.get("json").eCN].fields);
        this.entitiesLoadedCallback();
    }
    
})