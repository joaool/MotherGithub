FrameLink v0.10


MiniSrv to get basic data

INSTALLATION

install node.js

in a command prompt:
  - go to the minisrv directory
  - copy the directory to a local directory
    (if you install the depencies, it will be too big for gitHub)

  // Install the dependant package by hand
  // DO NOT USE NPM INSTALL, it will fail with Visual studio...
  - run : npm install --msvs_version=2012 express
  - run : npm install --msvs_version=2012 monk
  - run : npm install --msvs_version=2012 mongodb

  - start : node app.js

in a browser :
  http://localhost:3000/entityGetAll ( => returns all entity)
  http://localhost:3000/entityGet/00 => returns all data from Master_00

You just have to do an ajax call to localhost:3000/entityGet/00 in order to get the data. Probably the data is coming as a string, and should be converted to a jSon

Nico
