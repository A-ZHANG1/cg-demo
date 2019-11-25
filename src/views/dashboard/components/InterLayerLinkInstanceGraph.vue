<template>
  <div id="InterLayerLinkInstanceContainer" :style="{width: '100%', height: '1000px'}" />
</template>

<script>
import * as d3 from 'd3'
import * as THREE from 'three'
import { setSpriteCanvasContent } from '@/utils/helpers'
import DragControls from 'drag-controls'
DragControls.install({THREE: THREE})
const OrbitControls = require('three-orbit-controls')(THREE)

// kg data 自底向上
const nodesData = {
  companies: [{ name: '桂林' }, { name: '广州' }, { name: '厦门' }, { name: '杭州' }, { name: '上海' }, { name: '青岛' }, { name: '天津' }],
  products: [{ ID: '11' }, { ID: '12' }, { ID: '17' }]
}

const linksData = {
  companyLinks: [{ source: 0, target: 1 }, { source: 0, target: 2 },
    { source: 0, target: 3 }, { source: 1, target: 4 },
    { source: 1, target: 5 }, { source: 1, target: 6 }],
  productLinks: [{ source: 7, target: 8 }, { source: 8, target: 9 }],
  orders: [{ source: 0, target: 8 }, { source: 1, target: 8 }, { source: 2, target: 8 }, { source: 3, target: 9 }, { source: 4, target: 9 }, { source: 5, target: 7 }, { source: 6, target: 7 }]
}

const width = window.innerWidth
const height = window.innerHeight
export default {
  name: 'InterLayerLinkInstanceGraph',
  data() {
    return {
      camera: '',
      scene: '',
      renderer: '',
      container: '',
      // mesh:''
      brickTexture: require('@/assets/brick_diffuse.jpg'),
      orbitControl: '',
      dragControl: '',
      objects: ''
    }
  },
  mounted() {
    this.container = document.getElementById('InterLayerLinkInstanceContainer')
    this.init()
    this.initControls()

    this.animate()
  },
  methods: {
    init() {
      this.initScene()
      this.initLight()
      this.initCamera()

      this.scene.add(this.createSpriteForLayer('Company', 0, 0, 0))
      this.scene.add(this.createSpriteForLayer('Order', 0, 20, 0))
      this.scene.add(this.createSpriteForLayer('Product', 0, 50, 0))
      const instanceGraphGroup = this.createInstanceGraph()
      this.scene.add(instanceGraphGroup)

      console.log(instanceGraphGroup)

      // console.log(instanceGraphGroup.children[0])

      this.initRenderer()

      this.initControls(this.createInstanceGraph())
    },
    initScene() {
      this.scene = new THREE.Scene()

      // let axesHelper = new THREE.AxesHelper(50)
      // this.scene.add(axesHelper)
    },
    initCamera() {
      // this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000)
      const frustumSize = 200
      var aspect = width / height

      this.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 1000)

      this.camera.position.set(40, 40, 50)
      this.camera.lookAt(0, 25, 0)
    },
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(width, height)
      // this.renderer.setClearColor( 0x000000, 1 );
      this.container.appendChild(this.renderer.domElement)
    },
    initLight() {
      let light = new THREE.AmbientLight(0xffffff, 0.5)
      light.position.set(0, 10, 0)
      this.scene.add(light)

      light = new THREE.DirectionalLight(0xffffff, 0.5)
      light.position.set(0, 1000, 0)
      this.scene.add(light)
    },
    initControls () {
      this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement)
      this.orbitControl.autoRotate = true
      this.orbitControl.update()
      // this.orbitControl.addEventListener('change', this.render)

    },
    createSpriteForLayer(className, x, y, z) {
      var spirteCanvas = setSpriteCanvasContent(className)
      var spirteTexture = new THREE.CanvasTexture(spirteCanvas)

      var spriteMaterial = new THREE.SpriteMaterial({ map: spirteTexture })
      var spriteObj = new THREE.Sprite(spriteMaterial)
      spriteObj.scale.set(10, 8, 1)
      spriteObj.position.set(x, y, z)
      return spriteObj
    },
    createInstanceGraph() {
      const simulation = d3.forceSimulation()

      simulation
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(0, 0))
        .force('link', d3.forceLink())

      const nodes = []
      Object.values(nodesData).forEach(el => el.forEach(n => nodes.push(n)))
      const links = []
      Object.values(linksData).forEach(el => el.forEach(n => links.push(n)))

      simulation.nodes(nodes)
        .on('tick', this.tickAction)
        .force('link')
        .links(links)

      const group = new THREE.Group()

      nodes.forEach((node, idx) => {
        if (idx < nodesData.companies.length) {
          // 布局企业节点
          node.geometry = new THREE.SphereBufferGeometry(2, 32, 32)
          // node.geometry = new THREE.CircleBufferGeometry(5, 32)
          node.material = new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: 'true' })
          node.circle = new THREE.Mesh(node.geometry, node.material)
          node.circle.position.set(node.x, 0, node.y)
          // node.circle.position.set(Math.random() * 10, 0, Math.random() * 15)
        } else {
          // node.geometry = new THREE.SphereBufferGeometry(1, 32, 8)

          // 布局产品节点
          const radiusTop = 2
          const radiusBottom = 2
          const height = 5
          const radialSegments = 12
          node.geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments)
          node.material = new THREE.MeshStandardMaterial({ map: THREE.ImageUtils.loadTexture(this.brickTexture) })
          node.circle = new THREE.Mesh(node.geometry, node.material)

          node.x = node.x - 25
          node.y = node.y - 25
          node.circle.position.set(node.x, 50, node.y)
        }
        group.add(node.circle)
      })

      links.forEach((link, idx) => {
        // console.log(link)
        link.geometry = new THREE.Geometry()
        if (idx < linksData.companyLinks.length) {
          link.geometry.vertices.push(new THREE.Vector3(link.source.x, 0, link.source.y))
          link.geometry.vertices.push(new THREE.Vector3(link.target.x, 0, link.target.y))
          link.material = new THREE.LineBasicMaterial({ color: '#000000', linewidth: 0.5})
        } else if (idx < linksData.companyLinks.length + linksData.productLinks.length) {
          link.geometry.vertices.push(new THREE.Vector3(link.source.x, 50, link.source.y))
          link.geometry.vertices.push(new THREE.Vector3(link.target.x, 50, link.target.y))
          link.material = new THREE.LineBasicMaterial({ color: '#ff0000', linewidth: 1, linecap: 'butt' })
        } else {
          link.geometry.vertices.push(new THREE.Vector3(link.source.x, 0, link.source.y))
          link.geometry.vertices.push(new THREE.Vector3(link.target.x, 50, link.target.y))
          link.material = new THREE.LineDashedMaterial({ color: '#ff88d6', linewidth: 1, dashsize: 3, gapsize: 1 })
        }
        link.line = new THREE.Line(link.geometry, link.material)
        group.add(link.line)
      })
      console.log(group)

      return group
    },
    addLink(start, end, style = 'solid') {
      var geometry = new THREE.Geometry()
      geometry.vertices.push(start)
      geometry.vertices.push(end)
      var material
      if (style === 'solid') { material = new THREE.LineBasicMaterial({ color: '#ff00ff', linewidth: 0.5, transparent: true }) }
      else if (style === 'dashed') { material = new THREE.LineDashedMaterial({color: '#ff00ff', linewidth: width, dashSize: 3, gapSize: 1, transparent: true, scale: 0.7}) }
      var line = new THREE.Line(geometry, material)
      line.computeLineDistances()
      return line
    },
    tickAction() {
      nodesData.companies.forEach(node => {
        const { x, y, circle } = node
        circle.position.set(x, 0, y)
      })
      nodesData.products.forEach(node => {
        const { x, y, circle } = node
        circle.position.set(x, 50, y)
      })
      linksData.productLinks.forEach((link) => {
        const { source, target, line } = link
        line.geometry.verticesNeedUpdate = true
        line.geometry.vertices[0] = new THREE.Vector3(source.x, 50, source.y)
        line.geometry.vertices[1] = new THREE.Vector3(target.x, 50, target.y)
      })
      linksData.orders.forEach(o => {
        const { source, target, line } = o
        line.geometry.verticesNeedUpdate = true
        line.geometry.vertices[0] = new THREE.Vector3(source.x, 0, source.y)
        line.geometry.vertices[1] = new THREE.Vector3(target.x, 50, target.y)
      })
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.orbitControl.update()
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>

<style scoped>

</style>
