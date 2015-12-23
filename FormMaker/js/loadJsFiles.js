define(function(){
	$("head").append('<script src="../FormMaker/js/LabelElement.js"></script>');
    $("head").append('<script src="../FormMaker/js/models/designer_model.js"></script>');
    $("head").append('<script src="../FormMaker/js/models/element_model.js"></script>');
    $("head").append('<script src="../FormMaker/js/models/entity_model.js"></script>');
    $("head").append('<script src="../FormMaker/js/models/form_maker_model.js"></script>');
    $("head").append('<script src="../FormMaker/js/collections/elements.js"></script>');
    $("head").append('<script src="../FormMaker/js/views/main_view.js"></script>');
    $("head").append('<script src="../FormMaker/js/views/element_holder.js"></script>');
    $("head").append('<script src="../FormMaker/js/views/property_panel.js"></script>');
    $("#templates").load("../FormMaker/Template.html");
});