jQuery(document).ready(function($){
	/**
	* function to load a given css file 
		http://naveensnayak.wordpress.com/2013/06/26/dynamically-loading-css-and-js-files-using-jquery/
		http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
	*/ 
	loadCSS = function(href) {
		// var cssLink = $("<link rel='stylesheet' type='text/css' href='FL_ui/js/"+href+"'>");
		//Example	<script src="FL_ui/js/main.js"></script>
		var cssLink = $("<link rel='stylesheet' type='text/css' href='../bootstrap/css/"+href+"'>");
		//    <link href="../bootstrap/css/cerulean.css" rel="stylesheet">
		$("head").append(cssLink); 
	};
	console.log("JO this is inside main.js");
	var optionsForSelect =[
		{value: 0, text: 'cerulean'},
		{value: 1, text: 'cosmos'},
		{value: 2, text: 'readable'},
		{value: 3, text: 'spacelab'},
		{value: 4, text: 'redish'},
		{value: 5, text: 'red'}
	];
	$('#_css').editable({
        type: 'select',
        title: 'Select Style:',
        placement: 'right',
        value: 4,
        source:optionsForSelect,
		validate: function(value) {
			var fileCss = optionsForSelect[value].text + ".css";
			loadCSS(fileCss);
			alert("FileCss="+fileCss);
        }
    });
	/**
	 * function to load a given js file 
	 */ 
	loadJS = function(src) {
		var jsLink = $("<script type='text/javascript' src='FL_ui/js/"+src+"'>");
		$("head").append(jsLink); 
	}; 
	// BootstrapDialog.alert("FrameLink"); //http://nakupanda.github.io/bootstrap3-dialog/
	changeCSS = function(){
		BootstrapDialog.confirm('Do you want to test Dynamic CSS - red?', function(result){
			if(result) {
				alert('Yup.');
				loadCSS("red.css");
				// load the js file 
				loadJS("one.js");
			}else {
				alert('Nope. Ok I assume cosmos for CSS !');
				loadCSS("cosmos.css");
			}
		},{title:"WARNING",button1:"No, I gave up...",button2:"please please I want !",type:"type-success",cssButton2:"btn-success"});
	};
	// load the css file 
});