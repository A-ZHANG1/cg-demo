
<template>
  <div class="dashboard-editor-container">
    <el-row>
      <el-col :span="12">
        <el-card  class="box-card" style="width: 100%; height: 900px">
          <div slot="header" class="clearfix">
            <span>Layered Concept Graph</span>
          </div>
          <div>
            <ConceptGraph/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card  class="box-card" style="width: 100%; height: 900px">
          <div slot="header" class="clearfix">
            <span>Instance Graph Layering</span>
          </div>
          <div>
            <InstanceGraph/>
          </div>
        </el-card>
      </el-col>
    </el-row>

<!--    <el-row>-->
<!--      <el-col :span="24">-->
<!--        <el-card  class="box-card" style="width: 100%; height: 900px">-->
<!--          <div slot="header" class="clearfix">-->
<!--            <span>Instance Graph Layering</span>-->
<!--          </div>-->
<!--          <div>-->
<!--            <InterLayerLinkInstanceGraph/>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--    </el-row>-->

    <el-row>
      <el-col :span="24">
        <el-card  class="box-card" style="width: 100%; height: 900px">
          <div slot="header" class="clearfix">
            <span>Instance Graph Layering</span>
          </div>
          <div>
            <InterLayerLayoutDagre/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ConceptGraph from './components/ConceptGraph'
import InstanceGraph from './components/InstanceGraph'
import InterLayerLinkInstanceGraph from './components/InterLayerLinkInstanceGraph'
import InterLayerLayoutDagre from './components/InterLayerLayoutDagre'
export default {
  components: {ConceptGraph, InstanceGraph, InterLayerLinkInstanceGraph, InterLayerLayoutDagre}
}

</script>

<style scoped>


</style>

