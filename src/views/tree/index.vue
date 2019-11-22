<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-button @click="popPlot()">Viz</el-button>

    <el-row>
      <el-col :offset = "18" :span="6">
        <el-tree
          ref="tree2"
          :data="data2"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          default-expand-all
          show-checkbox
        />
      </el-col>
    </el-row>


    <!-- 特征选择 弹窗-->
    <el-dialog title="相关性分析结果" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item>
            <img class="pic-404__child mid" src="@/assets/scatter.png" alt="404">
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {

  data() {
    return {
      filterText: '',
      dialogFormVisible: false,
      data2: [{
        id: 1,
        label: 'Company 1',
        children: [{
          id: 4,
          label: 'Person 1-1',
          children: [{
            id: 9,
            label: 'Name 1-1-1'
          }, {
            id: 10,
            label: 'ID 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: 'Order 2',
        children: [{
          id: 5,
          label: 'Amount 2-1'
        }, {
          id: 6,
          label: 'Location 2-2'
        }]
      }, {
        id: 3,
        label: 'Product 3',
        children: [{
          id: 7,
          label: 'Quantity 3-1'
        }, {
          id: 8,
          label: 'UnitPrice 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    popPlot() {
      this.dialogFormVisible = true
    }
  }
}
</script>

