<template>
  <div>
    <div id="instanceContainer" :style="{width: '100%', height: '1000px'}" />
  </div>
</template>

<script>
import * as THREE from 'three'
import dagreD3 from 'dagre-d3'
import * as dagre from 'dagre'
import TWEEN from '@tweenjs/tween.js'

// kg data 自底向上
const nodesData = {
  companies: [{ name: '桂林' }, { name: '广州' }, { name: '厦门' }, { name: '杭州' }, { name: '上海' }, { name: '青岛' }, { name: '天津' }],
  products: [{ ID: '11' }, { ID: '12' }, { ID: '17' }],
  orders: [{ source: 0, target: 0 }, { source: 1, target: 0 }, { source: 2, target: 0 }, { source: 3, target: 0 }, { source: 4, target: 0 }, { source: 5, target: 0 }, { source: 6, target: 0 }]
}

const linksData = {
  companyLinks: [{ source: 0, target: 1 }, { source: 0, target: 2 },
    { source: 0, target: 3 }, { source: 1, target: 4 },
    { source: 1, target: 5 }, { source: 1, target: 6 }],
  productLinks: [{ source: 0, target: 1 }, { source: 1, target: 2 }],
  orders: [{ source: 0, target: 8 }, { source: 1, target: 8 }, { source: 2, target: 8 }, { source: 3, target: 8 }, { source: 4, target: 8 }, { source: 5, target: 8 }, { source: 6, target: 8 }]
}

const userOpts = {
  range: 800,
  duration: 1800,
  delay: 3000,
  easing: TWEEN.Easing.Quadratic.In
}

export default {
  name: 'InstanceGraph',
  data() {
    return {
      camera: '',
      scene: '',
      renderer: '',
      container: '',
      orbitControl: '',
      brickTexture: require('@/assets/brick_diffuse.jpg')
    }
  },
  mounted() {
    const container = document.getElementById('instanceContainer')

    this.scene = new THREE.Scene()

    let light = new THREE.AmbientLight(0xffffff, 0.5)
    light.position.set(0, 10, 0)
    this.scene.add(light)

    light = new THREE.DirectionalLight(0xffffff, 1) // intensity.default 1
    light.position.set(0, 100, 0)
    this.scene.add(light)

    // 分层概念关联相机
    const width = window.innerWidth
    const height = window.innerHeight
    const frustumSize = 200
    var aspect = width / height

    this.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 1000)

    // this.camera = new THREE.PerspectiveCamera(150, container.clientWidth / container.clientHeight, 1, 1000)
    this.camera.position.set(250, 40, 300)
    this.camera.lookAt(this.scene.position)

    const axesHelper = new THREE.AxesHelper(60)
    this.scene.add(axesHelper)

    const companyPoz = this.addLayer('Company', nodesData.companies, linksData.companyLinks, -50)
    const productPoz = this.addLayer('Product', nodesData.products, linksData.productLinks, 50)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(this.renderer.domElement)

    this.animate()
  },
  methods: {
    addNode(className, x, y, z) {
      var geo, material, mesh
      if (className === 'Company') {
        geo = new THREE.SphereBufferGeometry(5, 32, 32)
        material = new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: 'true' })
        mesh = new THREE.Mesh(geo, material)
      } else if (className === 'Product') {
        const radiusTop = 4
        const radiusBottom = 4
        const height = 5
        const radialSegments = 12
        geo = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments)
        material = new THREE.MeshStandardMaterial({ map: THREE.ImageUtils.loadTexture(this.brickTexture) })
        mesh = new THREE.Mesh(geo, material)
      }
      mesh.position.set(x, y, z)
      return mesh
    },
    addLink(start, end, style = 'solid') {
      var geometry = new THREE.Geometry()
      geometry.vertices.push(start)
      geometry.vertices.push(end)
      var material
      if (style === 'solid') { material = new THREE.LineBasicMaterial({ color: '#ff00ff', linewidth: 0.5, transparent: true }) }
      // else if (style == 'dashed') { material = new THREE.LineDashedMaterial({color: color, linewidth: width, dashSize: 3, gapSize: 1, transparent: true, scale: 0.7}) }
      var line = new THREE.Line(geometry, material)
      // line.computeLineDistances()
      return line
    },
    addLayer (className, schemaNodes, schemaLinks, zPos) {
      const group = new THREE.Group()
      const g = new dagreD3.graphlib.Graph()
      g.setGraph({})
      g.setDefaultEdgeLabel(function () { return {} })
      for (const name in schemaNodes) {
        g.setNode(name, { width: 2, height: 2 })
      }
      for (const link of schemaLinks) {
        g.setEdge(link.source, link.target)
      }
      dagre.layout(g)

      for (let n = 0; n < Object.keys(g._nodes).length; n++) {
        var nodeMesh = this.addNode(className, Math.random() * 10, 0, Math.random() * 15)
        group.add(nodeMesh)
      }

      console.log(g)
      // console.log(group)

      /* dagre.layout g的属性
* console.log(g._edgeObjs)
* console.log(g._edgeLabels)
* console.log(g._edgeCount)
*/

      const targetPozs = []

      group.children.forEach((child, idx) => {
        var target = {
          x: g._nodes[idx].x, //g._nodes obj key = group children idx
          y: zPos,
          z: g._nodes[idx].y
        }
        this.moveTo(child, target, userOpts)
        targetPozs.push(target)
      })
      this.scene.add(group)

      for (let l = 0; l < g._edgeCount; l++) {
        console.log(g._edgeObjs[Object.keys(g._edgeObjs)[l]])
        console.log(g._edgeObjs[Object.keys(g._edgeObjs)[l]].v)
        var sourceKey = g._edgeObjs[Object.keys(g._edgeObjs)[l]].v
        var targetKey = g._edgeObjs[Object.keys(g._edgeObjs)[l]].w
        var lSource = new THREE.Vector3(g._nodes[sourceKey].x, zPos, g._nodes[sourceKey].y)
        var lTarget = new THREE.Vector3(g._nodes[targetKey].x, zPos, g._nodes[targetKey].y)
        var linkMesh = this.addLink(lSource, lTarget)
        this.setInvisible(linkMesh)
        group.add(linkMesh)
        this.appear(linkMesh, userOpts)
      }

      return targetPozs
    },
    moveTo (obj, target, userOpts, complete) {
      var current = {
        x: obj.position.x,
        y: obj.position.y,
        z: obj.position.z
      }
      var update = function () {
        obj.position.set(current.x, current.y, current.z)
      }
      complete = complete || function () {}
      var tweens = new TWEEN.Tween(current)
        .to(target, userOpts.duration)
        .delay(userOpts.delay)
        .easing(userOpts.easing)
        // .repeat(Infinity)
        .onUpdate(update)
        .onComplete(complete)
        .start()
      // var tweenLine = new TWEEN.Tween()
    },
    lighten (obj, userOpts) {
      if (obj.material === undefined) return
      var current
      if (obj.material instanceof Array) {
        current = {opacity: obj.material[0].opacity}
        obj.material.forEach(mt => {
          mt.setValues({transparent: true})
        })
      } else {
        current = {opacity: obj.material.opacity}
        obj.material.setValues({transparent: true})
      }
      var update = function () {
        if (obj.material instanceof Array) {
          obj.material.forEach(mt => {
            mt.setValues(current)
          })
        } else { obj.material.setValues(current) }
      }
      var tweens = new TWEEN.Tween(current)
        .to({opacity: 1}, 200) // duration 200
        .delay(userOpts.delay + 2500)
        .easing(TWEEN.Easing.Quadratic.Out)
        // .repeat(Infinity)
        .onUpdate(update)
        .start()
    },
    appear (obj, userOpts) {
      if (obj.children.length > 0) {
        obj.children.forEach(child => {
          this.appear(child, userOpts)
        })
      }
      if (obj.material !== undefined) { this.lighten(obj, userOpts) }
    },
    setInvisible (obj, opacity = 0) {
      if (obj.children.length > 0) {
        obj.children.forEach(child => {
          this.setInvisible(child, opacity)
        })
      }
      if (obj.material !== undefined) {
        if (obj.material instanceof Array) {
          obj.material.forEach(mt => {
            mt.transparent = true
            mt.opacity = opacity
          })
        } else {
          obj.material.setValues({transparent: true, opacity: opacity})
        }
      }
    },
    animate() {
      // 立方体的旋转
      requestAnimationFrame(this.animate)
      // this.mesh.rotation.x += 0.01
      // this.mesh.rotation.y += 0.01

      /* 正在这边尝试做高亮，但是级联显示效果不支持 */
      // var raycaster = new THREE.Raycaster()
      // var hightLightMaterial = new THREE.MeshBasicMaterial({color: 'red'})
      // raycaster.setFromCamera(mouse, this.camera)
      // var instersects = raycaster.intersectObjects(this.objects, true)

      TWEEN.update()

      this.renderer.render(this.scene, this.camera)
      // this.renderer.render(this.scene, this.camProduct)
    }
  }
}
</script>

<style scoped>

</style>
