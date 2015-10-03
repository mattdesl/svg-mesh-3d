import THREE from 'three'
import createLoop from 'canvas-loop'
import loadSvg from 'load-svg'
import Tweenr from 'tweenr'
import { parse as getSvgPaths } from 'extract-svg-path'
import randomVec3 from 'gl-vec3/random'
import triangleCentroid from 'triangle-centroid'
import reindex from 'mesh-reindex'
import unindex from 'unindex-mesh'
import shuffle from 'array-shuffle'
import svgMesh3d from '../'

const createGeom = require('three-simplicial-complex')(THREE)
const fs = require('fs')

const tweenr = Tweenr({ defaultEase: 'expoInOut' })
const vertShader = fs.readFileSync(__dirname + '/vert.glsl', 'utf8')
const fragShader = fs.readFileSync(__dirname + '/frag.glsl', 'utf8')
const files = shuffle(fs.readdirSync(__dirname + '/svg/entypo-social')
  .filter(file => {
    return /\.svg$/.test(file)
  }))

document.querySelector('.count').innerText = files.length

const canvas = document.querySelector('canvas')
canvas.addEventListener('touchstart', (ev) => ev.preventDefault())
canvas.addEventListener('contextmenu', (ev) => ev.preventDefault())

const renderer = new THREE.WebGLRenderer({
  canvas: canvas, antialias: true, devicePixelRatio: window.devicePixelRatio
})
renderer.setClearColor(0x97c2c5, 1)

const target = new THREE.Vector3()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100)
camera.position.set(0, 0, 5)

let pointer = 0
createApp()
start3D()

function start3D (delay) {
  delay = delay || 0
  var file = files[pointer++ % files.length]
  
  loadSvg('demo/svg/entypo-social/' + file, (err, svg) => {
    if (err) throw err
    renderSVG(svg, delay)
  })
}

function renderSVG (svg, delay) {
  delay = delay || 0
  const svgPath = getSvgPaths(svg)
  let complex = svgMesh3d(svgPath, {
    simplify: 0.01,
    randomization: 100, 
    scale: 10
  })
  
  // split mesh into separate triangles
  complex = reindex(unindex(complex.positions, complex.cells))

  const attributes = getAnimationAttributes(complex.positions, complex.cells)
  const geometry = new createGeom(complex)
  const material = new THREE.ShaderMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    // wireframe: true,
    transparent: true,
    attributes: attributes,
    uniforms: {
      opacity: { type: 'f', value: 1 },
      scale: { type: 'f', value: 0 },
      animate: { type: 'f', value: 0 }
    }
  })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  const interval = 2 + delay
  
  // explode in
  tweenr.to(material.uniforms.animate, {
    value: 1, duration: 1.5, delay: delay,
  })
  tweenr.to(material.uniforms.scale, {
    value: 1, duration: 1, delay: delay
  })

  // explode out
  tweenr.to(material.uniforms.scale, {
    delay: interval, value: 0, duration: 0.75, ease: 'expoIn'
  })
  tweenr.to(material.uniforms.animate, {
    duration: 0.75, value: 0, delay: interval
  }).on('complete', () => {
    geometry.dispose()
    geometry.vertices.length = 0
    scene.remove(mesh)
    start3D()
  })
}

function getAnimationAttributes (positions, cells) {
  const directions = []
  const centroids = []
  for (let i=0; i<cells.length; i++) {
    const [ f0, f1, f2 ] = cells[i]
    const triangle = [ positions[f0], positions[f1], positions[f2] ]
    const center = triangleCentroid(triangle)
    const dir = new THREE.Vector3().fromArray(center)
    for (var j=0; j<3; j++) {
      
    }
    centroids.push(dir, dir, dir)
    
    const random = randomVec3([], Math.random())
    const anim = new THREE.Vector3().fromArray(random)
    directions.push(anim, anim, anim)
  }
  return {
    direction: { type: 'v3', value: directions },
    centroid: { type: 'v3', value: centroids }
  }
}

function createApp () {
  const app = createLoop(canvas, { scale: renderer.devicePixelRatio })
    .start()
    .on('tick', render)
    .on('resize', resize)

  function resize () {
    var [ width, height ] = app.shape
    camera.aspect = width / height
    renderer.setSize(width, height, false)
    camera.updateProjectionMatrix()
    render()
  }
  
  function render () {
    renderer.render(scene, camera)
  }
  
  resize()
}
