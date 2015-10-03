# svg-mesh-3d

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A high-level module to convert a SVG `<path>` string into a 3D triangulated mesh. Best suited for silhouettes, like font icon SVGs.

The returned mesh is a 3D indexed ["simplicial complex"](https://www.npmjs.com/package/mesh-primitives#generic-mesh-modules) that can be used in ThreeJS, StackGL, etc. It follows the format:

```js
{
  positions: [ [x1, y1, z1], [x2, y2, z2], ... ],
  cells: [ [a, b, c], [d, e, f] ]
}
```

You can apply a `simplify` threshold and `randomization` factor to produce different aesthetic results during triangulation. Depending on these factors and the complexity of the mesh, the process might be quite slow (upwards of a few seconds).

## Install

```sh
npm install svg-mesh-3d --save
```

## Example

Here is an example using a simple path:

```js
var path = '...'
var svgMesh3d = require('svg-mesh-3d')

var mesh = svgMesh3d(path, {
  delaunay: false
})
```

## Usage

[![NPM](https://nodei.co/npm/svg-mesh-3d.png)](https://www.npmjs.com/package/svg-mesh-3d)

to come

## See Also

- [extract-svg-path](https://www.npmjs.com/package/extract-svg-path) - grab `<path>` data from SVG
- [load-svg](https://www.npmjs.com/package/load-svg) - load SVG in browser

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/svg-mesh-3d/blob/master/LICENSE.md) for details.
