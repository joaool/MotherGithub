FrameLink

MiniSrv to get basic data

INSTALLATION

install node.js

in a command prompt:
  - go to the minisrv directory
  - start : node app.js

in a browser :
  http://localhost:3000/entityGetAll ( => returns all entity)
  http://localhost:3000/entityGet/00 => returns all data from Master_00

You just have to do an ajax call to localhost:3000/entityGet/00 in order to get the data. Probably the data is coming as a string, and should be converted to a jSon

Nico
