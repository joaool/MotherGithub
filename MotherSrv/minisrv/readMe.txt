FrameLink

MiniSrv to get basic data

INSTALLATION

install node.js

in a command prompt:
  - go to the minisrv directory
  - copy the directory to a local directory
    (if you install the depencies, it will be too big for gitHub)

  // Install the dependant package by hand. Those package
  // will be installed for the all machine (ie you don't have
  // to reinstall them on each node.js package
  // AND it will not block git Hub, like I did...
  - run : npm -g install --msvs_version=2012 express
  - run : npm -g install --msvs_version=2012 monk
  - run : npm -g install --msvs_version=2012 mongodb

  - start run.cmd   // you have to set the NODE_PATH variable

in a browser :
  http://localhost:3000/entityGetAll ( => returns all entity)
  http://localhost:3000/entityGet/00 => returns all data from Master_00

You just have to do an ajax call to localhost:3000/entityGet/00 in order to get the data. Probably the data is coming as a string, and should be converted to a jSon

Nico
