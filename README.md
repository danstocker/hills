Hills - Isometric game map editor
======================================================

*Demo app for candystore, shoeshine, bookworm, & milkman*

Hills is a very simple app for editing an isometric game map of 16x64 tiles, that demonstrates how to build a front end app with a stack of libraries made up of [candystore](https://github.com/danstocker/candystore), [shoeshine](https://github.com/danstocker/shoeshine), [bookworm](https://github.com/danstocker/bookworm), [milkman](https://github.com/danstocker/milkman), and their dependencies ([troop](https://github.com/danstocker/troop), [sntls](https://github.com/danstocker/sntls), [evan](https://github.com/danstocker/evan), and [flock](https://github.com/danstocker/flock)).

Usage
-----

1. First time you start the app, you get a blank map.
2. Select a pattern from the dropdown palette in the top left corner to make it active.
3. Click on a tile on the map to apply the active pattern.
4. Cmd (Ctrl) + click: twists the tile 90 degrees counter-clockwise.
5. Cmd (Ctrl) + Shift + click: twists the tile 90 degrees clockwise.
6. Alt + click: raises the tile's elevation (three different levels).
7. Alt + Shift + click: lowers the tile's elevation.
8. The URL is updated after each change to reflect the current state of the map, which will identify the map layout when saved / shared.

Credits
-------

Tile artwork by [www.kenney.nl](http://www.kenney.nl) under CC0 license.
