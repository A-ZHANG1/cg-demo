<template>
  <div class="app-container">
    <el-form>
      <el-form-item><div style="font-size:26px;color:gray;">实体数据上传</div></el-form-item>
      <el-form-item>
        <div style="margin:0px 0px 20px 0px;padding:0;width:100%;height:1px;background-color:lightGrey;overflow:hidden;"/>
      </el-form-item>
      <el-form-item>
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
      </el-form-item>
      <el-form-item>
        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
          <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
        </el-table>
      </el-form-item>
      <el-form-item>
        <a href="http://localhost:8080/api/courseList.xlsx">单击获取信息模板</a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/course.vue'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>
