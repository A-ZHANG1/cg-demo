<template>
  <div class="app-container">
    <el-form>
      <el-form-item><div style="font-size:26px;color:gray;">学生信息上传</div></el-form-item>
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
        <a href="http://localhost:8080/api/studentList.xlsx">单击获取学生信息模板</a>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-button type="primary" size="mini" @click="dispatchToStudentDeviceList()">确认</el-button>-->
      <!--</el-form-item>-->
    </el-form>
    <!-- Admin can see this -->
    <!-- <el-tag v-permission="['admin']">admin</el-tag> -->
    <!-- Editor can see this -->
    <!-- <el-tag v-permission="['editor']">editor</el-tag> -->
    <!--  <el-tab-pane v-if="checkPermission(['admin'])" >Admin can see this</el-tab-pane>
  <el-tab-pane v-if="checkPermission(['editor'])" >editor can see this</el-tab-pane> -->
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/student.vue'
import { mapState } from 'vuex'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  computed: mapState({
    courseId: state => {
      return state.app.courseId
    }
  }),
  methods: {
    checkPermission,
    // dispatchToStudentDeviceList(courseId) {
    //   this.$router.push({
    //     name: 'studentDeviceList'
    //   })
    //   this.$store.dispatch('SetCourseId', courseId)
    // },
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
