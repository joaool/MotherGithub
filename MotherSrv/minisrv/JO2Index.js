var server = require("./JO2Server");
var router = require("./JO2Router");
var requestHandlers = require("./JO2RequestHandlers");
var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/dir"] = requestHandlers.dir;
handle["/upload"] = requestHandlers.upload;
handle["/grid"] = requestHandlers.grid;
handle["/dtTable"] = requestHandlers.dtTable;
handle["/dtTableCRUD"] = requestHandlers.dtTableCRUD;
handle["/dtGrid"] = requestHandlers.dtGrid;


handle["/entityAdd"] = requestHandlers.entityAdd;
handle["/entityGet"] = requestHandlers.entityGet;
handle["/entityGetAll"] = requestHandlers.entityGetAll;

handle["/fieldGet"] = requestHandlers.fieldGet;
handle["/fieldAdd"] = requestHandlers.fieldAdd;
handle["/fieldGetAll"] = requestHandlers.fieldGetAll;
handle["/fieldGetByName"] = requestHandlers.fieldGetByName;
handle["/fieldGetAllByName"] = requestHandlers.fieldGetAllByName;

handle["/nameGet"] = requestHandlers.nameGet;
handle["/CNGet"] = requestHandlers.CNGet;

handle["/dataGet"] = requestHandlers.dataGet;
handle["/dataGetAll"] = requestHandlers.dataGetAll;
handle["/dataInsert"] = requestHandlers.dataInsert;
handle["/dataUpdate"] = requestHandlers.dataUpdate;

handle["/tableEntityGet"] = requestHandlers.tableEntityGet;
handle["/tableEntityGetAll"] = requestHandlers.tableEntityGetAll;
handle["/tableDataGet"] = requestHandlers.tableDataGet;
handle["/tableDataGetAll"] = requestHandlers.tableDataGetAll;
server.start(router.route,handle);