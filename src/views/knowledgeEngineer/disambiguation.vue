<template>
  <div>
    <el-row>
      <h1>消歧</h1>
      <nodeFloat width="960" height="600" style="border: 1px solid #ccc"/>
    </el-row>
  </div>

</template>

<script>
/*
* 同名不同义，实例对齐,通过属性进行冲突检测 - order
*/
import * as d3 from 'd3'

export default {
  name: 'Disambiguation',
  data() {
    return {
    }
  },
  mounted() {
    var dataset = [50, 43, 120, 87, 99, 167, 142]
    var width = 960	// SVG绘制区域的宽度
    var height = 600	// SVG绘制区域的高度

    var nodeFloat = d3.select('nodeFloat')			// 选择<body>
      .append('svg')			// 在<body>中添加<svg>
      .attr('width', width)	// 设定<svg>的宽度属性
      .attr('height', height)// 设定<svg>的高度属性
    // 外边框
    var padding = { top: 20, right: 20, bottom: 20, left: 20 }
    // 矩形所占的宽度（包括空白），单位为像素
    var rectStep = 35
    // 矩形所占的宽度（不包括空白），单位为像素
    var rectWidth = 30
    var rect = nodeFloat.selectAll('rect')
      .data(dataset)		// 绑定数据
      .enter()			// 获取enter部分
      .append('rect')	// 添加rect元素，使其与绑定数组的长度一致
      .attr('fill', 'steelblue')		// 设置颜色为steelblue
      .attr('x', function(d, i) {		// 设置矩形的x坐标
        return padding.left + i * rectStep
      })
      .attr('y', function(d) {		// 设置矩形的y坐标（y的计算不同于常规，浏览器是从上到下来增加y的值，所以是计算上面的部分）
        return height - padding.bottom - d
      })
      .attr('width', rectWidth)		// 设置矩形的宽度
      .attr('height', function(d) {	// 设置矩形的高度
        return d
      })

    var text = nodeFloat.selectAll('text')
      .data(dataset)			// 绑定数据
      .enter()				// 获取enter部分
      .append('text')			// 添加text元素，使其与绑定数组的长度一致
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .attr('x', function(d, i) {
        return padding.left + i * rectStep
      })
      .attr('y', function(d) {
        return height - padding.bottom - d
      })
      .attr('dx', rectWidth / 2)
      .attr('dy', '1em') /* 沿y轴偏移一个字体的距离*/
      .text(function(d) {
        return d
      })
  }
  //   var svg = d3.select('svg')
  //   var width = +svg.attr('width')
  //   var height = +svg.attr('height')
  //
  //   var color = ['#ffd034', '#f0f32f']
  //
  //   // var nodes = d3.range(5).map(function() {
  //   //   var node = {}
  //   //   node.groupA = Math.floor(Math.random() * 2)
  //   //   node.groupB = Math.floor(Math.random() * 1)
  //   //   return node
  //   // })
  //   var nodes = [
  //     { 'groupA': 0, 'groupB': 0, 'type': 'Company', 'name': '中建石化', 'loc': '青海西宁' },
  //     { 'groupA': 1, 'groupB': 0, 'type': 'Company', 'name': '中国建设石油化工', 'loc': '青海西宁' },
  //     { 'groupA': 1, 'groupB': 0 }
  //   ]
  //
  //   var fociA = [{ x: 200, y: 250 }, { x: 350, y: 250 }, { x: 500, y: 250 }, { x: 650, y: 250 }, { x: 800, y: 250 }]
  //   var fociB = [{ x: 400, y: 100 }, { x: 600, y: 300 }]
  //
  //   var simulation = d3.forceSimulation()
  //     .force('link', d3.forceLink().id(function(d) { return d.id }))
  //     .force('charge', d3.forceManyBody())
  //     .force('center', d3.forceCenter(width / 2, height / 2))
  //
  //   var node = svg.append('g')
  //     .attr('class', 'nodes')
  //     .selectAll('circle')
  //     .data(nodes)
  //     .enter().append('circle')
  //     .attr('r', 5)
  //     // .attr('fill', function(d) { return color(d.groupA) })
  //     .attr('fill', function(d) { return color[d.groupA] })
  //     .call(d3.drag()
  //       .on('start', dragstarted)
  //       .on('drag', dragged)
  //       .on('end', dragended))
  //
  //   node.append('title')
  //     .text(function(d) { return d.groupA })
  //
  //   simulation
  //     .nodes(nodes)
  //     .on('tick', ticked)
  //
  //   var current = 'groupA'
  //   var buttons = svg.selectAll(null)
  //     .data(['groupA', 'groupB'])
  //     .enter()
  //     .append('g')
  //     .attr('transform', function(d, i) { return 'translate(' + (i * 120 + 50) + ',' + 50 + ')' })
  //     .on('click', function(d) {
  //       if (d !== current) {
  //         current = d
  //         simulation.alpha(0.228)
  //         simulation.restart()
  //       }
  //     })
  //     .style('cursor', 'pointer')
  //
  //   buttons.append('rect')
  //     .attr('width', 100)
  //     .attr('height', 50)
  //     .attr('fill', 'lightgrey')
  //
  //   buttons.append('text')
  //     .text(function(d) { return d })
  //     .attr('dy', 30)
  //     .attr('dx', 50)
  //     .style('text-anchor', 'middle')
  //
  //   function ticked() {
  //     var k = this.alpha() * 0.3
  //
  //     // nudge nodes to proper foci:
  //     if (current === 'groupA') {
  //       nodes.forEach(function(n, i) {
  //         n.y += (fociA[n.groupA].y - n.y) * k
  //         n.x += (fociA[n.groupA].x - n.x) * k
  //       })
  //     } else {
  //       nodes.forEach(function(n, i) {
  //         n.y += (fociB[n.groupB].y - n.y) * k
  //         n.x += (fociB[n.groupB].x - n.x) * k
  //       })
  //     }
  //
  //     node
  //       .attr('cx', function(d) { return d.x })
  //       .attr('cy', function(d) { return d.y })
  //   }
  //
  //   function dragstarted(d) {
  //     if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  //     d.fx = d.x
  //     d.fy = d.y
  //   }
  //
  //   function dragged(d) {
  //     d.fx = d3.event.x
  //     d.fy = d3.event.y
  //   }
  //
  //   function dragended(d) {
  //     if (!d3.event.active) simulation.alphaTarget(0)
  //     d.fx = null
  //     d.fy = null
  //   }
  // }
}
</script>

<style scoped>
  .links line {
    stroke: #999;
    stroke-opacity: 0.6;
  }

  .nodes circle {
    stroke: #fff;
    stroke-width: 1.5px;
  }
</style>
