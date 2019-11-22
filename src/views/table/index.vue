<!--<template>-->
<!--  <div class="app-container">-->
<!--    <el-table-->
<!--      v-loading="listLoading"-->
<!--      :data="list"-->
<!--      element-loading-text="Loading"-->
<!--      border-->
<!--      fit-->
<!--      highlight-current-row-->
<!--    >-->
<!--      <el-table-column align="center" label="ID" width="95">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.$index }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="Title">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.title }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="Author" width="110" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.author }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="Pageviews" width="110" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.pageviews }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column class-name="status-col" label="Status" width="110" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column align="center" prop="created_at" label="Display_time" width="200">-->
<!--        <template slot-scope="scope">-->
<!--          <i class="el-icon-time" />-->
<!--          <span>{{ scope.row.display_time }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { getList } from '@/api/table'-->

<!--export default {-->
<!--  filters: {-->
<!--    statusFilter(status) {-->
<!--      const statusMap = {-->
<!--        published: 'success',-->
<!--        draft: 'gray',-->
<!--        deleted: 'danger'-->
<!--      }-->
<!--      return statusMap[status]-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      list: null,-->
<!--      listLoading: true-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    this.fetchData()-->
<!--  },-->
<!--  methods: {-->
<!--    fetchData() {-->
<!--      this.listLoading = true-->
<!--      getList().then(response => {-->
<!--        this.list = response.data.items-->
<!--        this.listLoading = false-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<template>
  <div>
    <el-row>
      <el-col :span="18" />
      <el-col :span="10">
        <!--        <el-input v-model="companyName" placeholder="请输入公司名" />-->
      </el-col>
      <el-col :span="2">
        <el-input v-model="depth" placeholder="请输入查询深度(default: 2)" />
      </el-col>
      <el-col :span="2">
        <el-button plain @click="$getInfo">检视</el-button>
      </el-col>
    </el-row>

    <el-row>
      <div id="myChart" :style="{width: '100%', height: '700px'}" />
    </el-row>
    <el-row>
      <svg width="960" height="600" />
    </el-row>

  </div>
</template>

<script>
import echarts from 'echarts'
// import { mapState } from 'vuex'
import * as d3 from 'd3'
require('echarts/theme/macarons')

export default {
  data() {
    // console.log(this.$route.params)
    return {
      // companyName: this.$route.params.companyName,
      // id: this.$route.params.id,
      depth: 2,
      visible: false,
      computedWeight: 0,
      chart: null
    }
  },
  // computed: mapState({
  //   nodes: state => state.graphData.subGraphNodes,
  //   links: state => state.graphData.subGraphLinks,
  //   companyWeight: state => state.graphData.companyWeight
  // }),
  mounted() {
    this.initLayout()
  },
  methods: {
    $getInfo() {
      // this.initChart()
      this.initLayout()
    },
    initLayout() {
      var svg = d3.select('svg')
      var width = 960
      var height = 600

      // var color = d3.scaleOrdinal(d3.schemeCategory20)

      var nodes = d3.range(100).map(function() {
        var node = {}
        node.groupA = Math.floor(Math.random() * 5)
        node.groupB = Math.floor(Math.random() * 2)
        return node
      })

      var fociA = [{ x: 200, y: 250 }, { x: 350, y: 250 }, { x: 500, y: 250 }, { x: 650, y: 250 }, { x: 800, y: 250 }]
      var fociB = [{ x: 400, y: 100 }, { x: 600, y: 300 }]

      var simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(function(d) { return d.id }))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))

      var node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', 5)
        // .attr('fill', function(d) { return color(d.groupA) })
        .attr('fill', '#f9a11b')
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended))

      node.append('title')
        .text(function(d) { return d.id })

      simulation
        .nodes(nodes)
        .on('tick', ticked)

      var current = 'groupA'
      var buttons = svg.selectAll(null)
        .data(['groupA', 'groupB'])
        .enter()
        .append('g')
        .attr('transform', function(d, i) { return 'translate(' + (i * 120 + 50) + ',' + 50 + ')' })
        .on('click', function(d) {
          if (d !== current) {
            current = d
            simulation.alpha(0.228)
            simulation.restart()
          }
        })
        .style('cursor', 'pointer')

      buttons.append('rect')
        .attr('width', 100)
        .attr('height', 50)
        .attr('fill', 'lightgrey')

      buttons.append('text')
        .text(function(d) { return d })
        .attr('dy', 30)
        .attr('dx', 50)
        .style('text-anchor', 'middle')

      function ticked() {
        var k = this.alpha() * 0.3

        // nudge nodes to proper foci:
        if (current == 'groupA') {
          nodes.forEach(function(n, i) {
            n.y += (fociA[n.groupA].y - n.y) * k
            n.x += (fociA[n.groupA].x - n.x) * k
          })
        } else {
          nodes.forEach(function(n, i) {
            n.y += (fociB[n.groupB].y - n.y) * k
            n.x += (fociB[n.groupB].x - n.x) * k
          })
        }

        node
          .attr('cx', function(d) { return d.x })
          .attr('cy', function(d) { return d.y })
      }

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
    },
    initChart() {
      // const p = {}
      // p.id = this.id
      // p.depth = this.depth
      // this.$store.dispatch('GetSubGraphById', p).then(data => {
      // this.visible = true
      // console.log(this.nodes)
      // console.log(this.links)
      this.chart = echarts.init(document.getElementById('myChart'), 'macarons')
      this.chart.setOption({
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true,
              readOnly: true
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        animationDuration: 3000,
        animationEasingUpdate: 'quinticInOut',
        series: [{
          name: '关联企业',
          type: 'graph',
          layout: 'force',
          height: 700,
          force: {
            repulsion: 3000,
            edgeLength: 100
          },
          categories: [
            {
              name: '普通企业',
              itemStyle: {
                normal: {
                  color: '#1f2d3d'
                }
              }
            },
            {
              name: '核心企业',
              itemStyle: {
                normal: {
                  color: '#f9a11b'
                }
              }
            }
          ],
          // data: this.nodes,
          // links: this.links,
          data: [{ name: '克拉拉-乔布斯', value: 3 },
            { name: 'Clara-Jobs', value: 3 },
            { name: '劳伦-鲍威尔', value: 7 }
          ],
          links: [{ source: '克拉拉-乔布斯', target: '劳伦-鲍威尔' }],
          focusNodeAdjacency: true,
          roam: true,
          label: {
            normal: {
              show: true,
              position: 'top',
              textStyle: {
                fontSize: 16
              }
            }
          },
          lineStyle: {
            normal: {
              curveness: 0,
              type: 'solid'
            },
            formatter: '{b}'
          },
          edgeLabel: {
            normal: {
              show: false,
              textStyle: {
                fontSize: 10
              }
            },
            formatter: '{c}'
          }
        }]
      })
      // }).catch(error => {
      //   console.log(error)
      // })
    }
  }
}

</script>

