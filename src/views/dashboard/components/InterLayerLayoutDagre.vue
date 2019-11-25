<template>
  <div id="InterLayerLayoutDagre" :style="{width: '100%', height: '1000px'}" />
</template>

<script>
import * as THREE from 'three'
import dagreD3 from 'dagre-d3'
import * as dagre from 'dagre'

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

export default {
  name: 'InterLayerLayoutDagre',
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
    const container = document.getElementById('InterLayerLayoutDagre')

    this.scene = new THREE.Scene()

    let light = new THREE.AmbientLight(0xffffff, 0.5)
    light.position.set(0, 10, 0)
    this.scene.add(light)

    light = new THREE.DirectionalLight(0xffffff, 1) // intensity.default 1
    light.position.set(0, 100, 0)
    this.scene.add(light)

    // 分层概念关联相机
    this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 1000)
    this.camera.position.set(250, 40, 250)
    this.camera.lookAt(this.scene.position)

    const axesHelper = new THREE.AxesHelper(60)
    this.scene.add(axesHelper)

    // const companyPoz = this.addLayer('Company', nodesData.companies, linksData.companyLinks, -50)
    // const productPoz = this.addLayer('Product', nodesData.products, linksData.productLinks, 50)
    // console.log(companyPoz)
    // console.log(productPoz)
    const graph = this.addGraph()
    console.log(graph)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(this.renderer.domElement)

    this.animate()
  },
  methods: {
    addNode(className, x, y, z) {
      var geo, material, mesh
      if (className === 'Company') {
        geo = new THREE.SphereBufferGeometry(1, 32, 32)
        material = new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: 'true' })
        mesh = new THREE.Mesh(geo, material)
      } else if (className === 'Product') {
        const radiusTop = 2
        const radiusBottom = 2
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
      if (style === 'solid') {
        material = new THREE.LineBasicMaterial({ color: '#ff00ff', linewidth: 0.5, transparent: true })
      }
      // else if (style == 'dashed') { material = new THREE.LineDashedMaterial({color: color, linewidth: width, dashSize: 3, gapSize: 1, transparent: true, scale: 0.7}) }
      var line = new THREE.Line(geometry, material)
      // line.computeLineDistances()
      return line
    },
    addGraph() {
      var group = new THREE.Group()
      var g = new dagreD3.graphlib.Graph()
      g.setGraph({})
      g.setDefaultEdgeLabel(function() { return {} })

      const nodes = nodesData.companies.concat(nodesData.products)
      const links = linksData.companyLinks.concat(linksData.productLinks).concat(linksData.orders)

      for (const name in nodes) {
        g.setNode(name, { width: 2, height: 2 })
      }
      for (const link of links) {
        g.setEdge(link.source, link.target)
      }
      dagre.layout(g)

      for (let n = 0; n < g._nodeCount; n++) {
        if (n < nodesData.companies.length) {
          var nodeMesh = this.addNode('Company', g._nodes[n].x, -50, g._nodes[n].y)
        } else {
          nodeMesh = this.addNode('Product', g._nodes[n].x, 50, g._nodes[n].y)
        }
        group.add(nodeMesh)
      }

      // console.log(g)
      // console.log(group)

      /* dagre.layout g的属性
* console.log(g._edgeObjs)
* console.log(g._edgeLabels)
* console.log(g._edgeCount)
*/

      for (let l = 0; l < g._edgeCount; l++) {
        // console.log(g._edgeObjs[Object.keys(g._edgeObjs)[l]])
        // console.log(g._edgeObjs[Object.keys(g._edgeObjs)[l]].v)

        var sourceKey = g._edgeObjs[Object.keys(g._edgeObjs)[l]].v
        var targetKey = g._edgeObjs[Object.keys(g._edgeObjs)[l]].w
        var zPos
        if (sourceKey < nodesData.companies.length) { zPos = -50 } else { zPos = 50 }
        var lSource = new THREE.Vector3(g._nodes[sourceKey].x, zPos, g._nodes[sourceKey].y)
        if (targetKey < nodesData.companies.length) { zPos = -50 } else { zPos = 50 }

        var lTarget = new THREE.Vector3(g._nodes[targetKey].x, zPos, g._nodes[targetKey].y)
        var linkMesh = this.addLink(lSource, lTarget)
        group.add(linkMesh)
      }

      this.scene.add(group)
      return group
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

      this.renderer.render(this.scene, this.camera)
    // this.renderer.render(this.scene, this.camProduct)
    }
  }
}
</script>

<style scoped>

</style>
