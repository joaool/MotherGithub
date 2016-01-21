// Create singleton column collection
var columnCol;

function getColumnCollection() {
    if (columnCol) {
        return columnCol;
    }
    var extraSettings = {
        "select-column": {
            nesting: [],
            width: "*",
            resizeAble: false,
            orderable: false
        },
        "id": {
            width: "*",
            nesting: [],
            resizeable: false,
            orderable: true
        },
        "name": {
            width: "*",
            nesting: [],
            resizeable: true,
            orderable: true
        },
        "pop": {
            width: "*",
            nesting: [],
            resizeable: true,
            orderable: true
        },
        "percentage": {
            width: "*",
            nesting: [],
            resizeable: true,
            orderable: true
        },
        "date": {
            width: "*",
            nesting: [],
            resizeable: true,
            orderable: true
        },
        "url": {
            width: "*",
            nesting: [],
            resizeable: true,
            orderable: true
        }
    };
    var columnDefinition = [{
        name: "select-column",
        cell: "select-row",
        headerCell: "select-all"
    }, {
        name: "id", // The key of the model attribute
        label: "ID", // The name to display in the header
        editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
        cell: Backgrid.IntegerCell.extend({
            orderSeparator: ""
        })
    }, {
        name: "name",
        label: "Name",
        cell: "string", // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
        filterType: "string"
    }, {
        name: "pop",
        label: "Population",
        cell: "integer", // An integer cell is a number cell that displays humanized integers
        filterType: "integer"
    }, {
        name: "percentage",
        label: "% of World Population",
        cell: "number", // A cell type for floating point value, defaults to have a precision 2 decimal numbers
        filterType: "number"
    }, {
        name: "date",
        label: "Date",
        cell: "date"
    }, {
        name: "url",
        label: "URL",
        cell: "uri" // Renders the value in an HTML anchor element
    }];
    for (var j = 0; j < columnDefinition.length; j++) {
        var column = columnDefinition[j];
        if (_.has(extraSettings, column.name)) {
            column.nesting = extraSettings[column.name].nesting;
            column.resizeable = extraSettings[column.name].resizeable;
            column.width = extraSettings[column.name].width;
        }
    }
    for (var j = 0; j < columnDefinition.length; j++) {
        var columno = columnDefinition[j];
        if (_.has(extraSettings, columno.name)) {
            columno.orderable = extraSettings[columno.name].orderable;
        }
    }
    var columns = new Backgrid.Extension.OrderableColumns.orderableColumnCollection(columnDefinition);
    columns.setPositions().sort();
    columnCol = columns;
    return columns;
}
var Territory = Backbone.Model.extend({});
// Create singleton data collection
var dataCol;

function getDataCollection() {
    if (dataCol) {
        return dataCol;
    }
    var PageableTerritories = Backbone.PageableCollection.extend({
        model: Territory,
        url: window.gridBaseUrl + "/territories.json",
        state: {
            pageSize: 15
        },
        mode: "client" // page entirely on the client side
    });
    var dataCollection = new PageableTerritories();
    return dataCollection;
}
// Render the grid
function renderGrid(gridContainerId) {
    var gridObjects = {
        elId: gridContainerId
    };
    // Empty DOM
    $(gridContainerId).empty();
    // Get column collection
    var columnCollection = getColumnCollection();
    // Get data collection
    var dataCollection = getDataCollection();
    // Fetch some data
    dataCollection.fetch({
        reset: true
    });
    // backgrid-columnmanager enabled?
    var colManager;
    var Header = Backgrid.Header;
    // Initialize a new Grid instance
    var grid = gridObjects.grid = new Backgrid.Grid({
        header: Header,
        columns: columnCollection,
        collection: dataCollection
    });
    // Render the grid
    var $grid = $("<div></div>").appendTo(gridContainerId).append(grid.render().el);
    // Initialize the paginator
    var paginator = new Backgrid.Extension.Paginator({
        collection: dataCollection
    });
    // Render the paginator
    $grid.after(paginator.render().el);
    // Add sizeable columns
    var sizeAbleCol = new Backgrid.Extension.SizeAbleColumns({
        collection: dataCollection,
        columns: columnCollection,
        grid: grid
    });
    $grid.find('thead').before(sizeAbleCol.render().el);
    // Add resize handlers
    var sizeHandler = new Backgrid.Extension.SizeAbleColumnsHandlers({
        sizeAbleColumns: sizeAbleCol,
        saveColumnWidth: true
    });
    $grid.find('thead').before(sizeHandler.render().el);
    // Make columns reorderable
    var orderHandler = new Backgrid.Extension.OrderableColumns({
        grid: grid,
        sizeAbleColumns: sizeAbleCol
    });
    $grid.find('thead').before(orderHandler.render().el);
    return gridObjects;
}
var gridObjects2 = renderGrid("#grid-container2");
var indx = 1;
$("#btnAddColumn").click(function() {
    var columns = getColumnCollection();
    columns.add({
        name: "rndm" + indx,
        label: "Rndm #" + indx++,
        cell: "string",
        resizeable: true,
        orderable: true,
        nesting: ["random"],
        width: 120,
        displayOrder: 8 + indx
    });
});
$("#btnRemoveColumn").click(function() {
    var columns = getColumnCollection();
    var rndmColumn = columns.find(function(column) {
        return column.get("name").search("rndm") > -1;
    });
    if (rndmColumn) {
        columns.remove(rndmColumn);
    } else {
        console.warn("No random column available for removal");
    }
});