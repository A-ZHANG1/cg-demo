<template>
  <div>

    <el-row>
      <el-col :span="24">
        <ViewMerging :nodes="nodesVM" :links="linksVM" :node-categories="nodeCategoriesVM"/>
      </el-col>
    </el-row>

    <!--    <el-row>-->
    <!--      <el-button @click="dialogVisible = true">New Knowledge</el-button>-->
    <!--      <el-button @click="dialogVisible = true">Append Knowledge</el-button>-->
    <!--    </el-row>-->

    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="New Knowledge" name="1">
        <el-form :model="entity" label-width="100px">
          <el-form-item label="EntityName">
            <el-input v-model="entity.name" />
          </el-form-item>
          <el-form-item label="Type">
            <el-radio-group v-model="entity.type">
              <el-radio label="SupplyChain" />
              <el-radio label="Company" />
              <el-radio label="Order" />
              <el-radio label="Product" />
            </el-radio-group>        </el-form-item>
          <el-form-item label="Source">
            <el-input v-model="entity.source" />
          </el-form-item>
          <el-form-item label="Properties">
            <el-input v-model="entity.properties" />
          </el-form-item>
          <el-form-item>
            <el-button>Create</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <el-collapse-item title="Edit Knowledge" name="2" />
    </el-collapse>

    <!--    <el-dialog-->
    <!--      title="New Knowledge"-->
    <!--      :visible.sync="dialogVisible"-->
    <!--      width="30%"-->
    <!--    >-->
    <!--      <el-form :model="entity" label-width="100px">-->
    <!--        <el-form-item label="EntityName">-->
    <!--          <el-input v-model="entity.name" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Type">-->
    <!--          <el-radio-group v-model="entity.type">-->
    <!--            <el-radio label="SupplyChain" />-->
    <!--            <el-radio label="Company" />-->
    <!--            <el-radio label="Order" />-->
    <!--            <el-radio label="Product" />-->
    <!--          </el-radio-group>        </el-form-item>-->
    <!--        <el-form-item label="Source">-->
    <!--          <el-input v-model="entity.source" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Properties">-->
    <!--          <el-input v-model="entity.properties" />-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->

    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->

  </div>
</template>

<script>
/*
* 同义不同名，实例对齐 - 企业实体，根据所在供应链子图和企业属性
*/
import ViewMerging from './components/ViewMerging'
import SingleViewLeft from './components/SingleViewLeft'
import SingleViewRight from './components/SingleViewRight'
// import SameAsDetailTable from './components/SameAsDetailTable'
import { ViewPoint1, SubgraphMergingData} from '@/assets/kg.js'
export default {
  name: 'AlignmentBySubgraph',
  components: {
    SingleViewLeft,
    SingleViewRight,
    ViewMerging
    // SameAsDetailTable
  },
  data() {
    return {
      dialogVisible: false,
      activeNames: ['1'],
      entity: {
        name: '',
        type: '',
        source: '',
        properties: ''
      },
      nodes: ViewPoint1.company.concat(ViewPoint1.contract),
      links: ViewPoint1.capitalFlowLink,
      nodeCategories: ViewPoint1.nodeCategories,

      nodesVM: SubgraphMergingData.company.concat(SubgraphMergingData.sameAsRel),
      linksVM: SubgraphMergingData.capitalFlowLink.concat(SubgraphMergingData.sameAsLink),
      nodeCategoriesVM: SubgraphMergingData.nodeCategories
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    }
  }
}
</script>

<style scoped>

</style>
