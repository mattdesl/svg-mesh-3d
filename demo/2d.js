/*
  An example rendering a triangulated mesh in Canvas2D.
  
  To test:
    npm install
    npm run 2d    
 */

var extractPath = require('extract-svg-path').parse
var loadSvg = require('load-svg')
var createMesh = require('../')
var drawTriangles = require('draw-triangles-2d')

var canvas = document.createElement('canvas')
var context = canvas.getContext('2d')

var size = 256
canvas.width = size
canvas.height = size

loadSvg('demo/svg/entypo-social/twitter.svg', function (err, svg) {
  if (err) throw err
  var svgPath = extractPath(svg)
  var mesh = createMesh(svgPath, {
    scale: 1,
    simplify: 0.01
  })
  render(mesh)
})

function render (mesh) {
  context.clearRect(0, 0, size, size)
  context.save()
  
  var scale = size / 2
  context.translate(size/2, size/2)
  context.scale(scale, -scale)
  context.beginPath()
  context.lineJoin = 'round'
  context.lineCap = 'round'
  context.lineWidth = 2 / scale
  drawTriangles(context, mesh.positions, mesh.cells)
  context.fillStyle = '#d86c15'
  context.strokeStyle = '#3b3b3b'
  context.fill()
  context.stroke()
  context.restore()
}

document.body.appendChild(canvas)