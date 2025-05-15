<template>
  <div>
    <h2>促銷管理</h2>
    <el-button type="primary"  @click="showAddDialog = true">新增促銷</el-button>
    <el-button type="info"    @click="showBatchDialog = true">批量新增促銷</el-button>
    <el-button type="primary" @click="showImportDialog = true">透過檔案新增</el-button>
    <el-button type="success" @click="activeTab = 'active';   fetchPromotions()">顯示當前促銷</el-button>
    <el-button type="warning" @click="activeTab = 'upcoming'; fetchUpcomingPromotions()">顯示尚未開始促銷</el-button>
    <el-button type="danger" :disabled="!multipleSelection.length" @click="confirmBatchDelete">批次刪除</el-button>

    <div style="margin: 20px 0; text-align: left;">
      <el-input
        v-model="searchKeyword"
        placeholder="搜尋促銷遊戲名稱"
        clearable
        style="
          width: 300px;
          border: 2px solid #00a9ff;
          border-radius: 6px;
          background-color: #1a1a2a;
          color: #fff;
        "
      />
    </div>

    <el-dialog v-model="showAddDialog" title="新增促銷" width="500px">
      <el-form :model="form">
        <el-form-item label="選擇遊戲">
          <el-select v-model="form.gameId" placeholder="請選擇遊戲" filterable>
            <el-option v-for="g in gameOptions" :key="g.id" :label="g.name" :value="g.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣 (%)"><el-input v-model.number="form.discountRate" type="number" /></el-form-item>
        <el-form-item label="開始時間"><el-date-picker v-model="form.startTime" type="datetime" /></el-form-item>
        <el-form-item label="結束時間"><el-date-picker v-model="form.endTime" type="datetime" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitPromotion">確認</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showBatchDialog" title="批量新增促銷" width="500px">
      <el-form :model="batchForm">
        <el-form-item label="選擇遊戲（可多選）">
          <el-select v-model="batchForm.gameIds" multiple placeholder="請選擇遊戲" filterable>
            <el-option v-for="g in batchGameOptions" :key="g.id" :label="g.name" :value="g.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣 (%)"><el-input v-model.number="batchForm.discountRate" type="number" /></el-form-item>
        <el-form-item label="開始時間"><el-date-picker v-model="batchForm.startTime" type="datetime" /></el-form-item>
        <el-form-item label="結束時間"><el-date-picker v-model="batchForm.endTime" type="datetime" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBatchDialog = false">取消</el-button>
        <el-button type="primary" @click="submitBatchPromotion">確認批量新增</el-button>
      </template>
    </el-dialog>

        <el-dialog v-model="showImportDialog" title="透過檔案匯入促銷" width="400px">
      <el-upload
        class="upload-demo"
        drag
        action=""
        :http-request="uploadCsv"
        :show-file-list="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">將檔案拖到此處，或 <em>點擊上傳</em></div>
        <div class="el-upload__tip" slot="tip">只能上傳 .csv 檔案</div>
      </el-upload>
      <template #footer>
        <el-button @click="showImportDialog = false">關閉</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showEditDialog" title="編輯促銷" width="500px">
      <el-form :model="editForm">
        <el-form-item label="折扣 (%)"><el-input v-model.number="editForm.discountRate" type="number" /></el-form-item>
        <el-form-item label="開始時間"><el-date-picker v-model="editForm.startTime" type="datetime" /></el-form-item>
        <el-form-item label="結束時間"><el-date-picker v-model="editForm.endTime" type="datetime" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="success" @click="submitEdit">儲存變更</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="confirmDeleteDialog" title="確認刪除" width="400px">
      <span>確定要刪除 <strong>{{ editForm.gameName }}</strong> 的促銷活動嗎？</span>
      <template #footer>
        <el-button @click="confirmDeleteDialog = false">取消</el-button>
        <el-button type="danger" @click="deletePromotion">確認刪除</el-button>
      </template>
    </el-dialog>

    <el-table
      :data="pagedPromotions"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      ref="tableRef"
      style="width:100%;margin-top:20px">

      <el-table-column type="selection" width="55" />

      <el-table-column prop="gameId" label="遊戲ID" width="100" sortable="custom"
                      :formatter="r => r.promotionGame?.map(p => p.game.id).join(', ') || '-'"/>

      <el-table-column label="遊戲圖片" width="120">
        <template #default="{ row }">
          <img v-if="row.promotionGame?.length"
              :src="row.promotionGame[0].game.coverImageUrl"
              style="width:100px;border-radius:4px" alt="封面"/>
        </template>
      </el-table-column>

      <el-table-column prop="gameName" label="促銷遊戲" width="250" sortable="custom"
                      :formatter="r => r.promotionGame?.map(p => p.game.name).join(', ') || '-'"/>

      <el-table-column prop="price" label="原價" width="100" sortable="custom"
                      :formatter="r => r.promotionGame?.map(p => p.game.price).join(', ') || '-'"/>

      <el-table-column prop="discountRate" label="折扣" width="100" sortable="custom"
                      :formatter="r => r.promotionGame?.map(p => p.discountRate + '%' ).join(', ') || '-'"/>

      <el-table-column prop="finalPrice" label="特價" width="100" sortable="custom"
                      :formatter="r => r.promotionGame?.map(p => (p.game.price * (1 - p.discountRate / 100)).toFixed(0)).join(', ') || '-'"/>
                      <el-table-column prop="startTime" label="開始時間" width="200" sortable="custom">
      <template #default="{ row }">
        {{ formatDate(row.startTime) }}
      </template>
    </el-table-column>

    <el-table-column prop="endTime" label="結束時間" width="200" sortable="custom">
      <template #default="{ row }">
        {{ formatDate(row.endTime) }}
      </template>
    </el-table-column>

    <el-table-column prop="createdAt" label="折扣建立時間" width="200" sortable="custom">
      <template #default="{ row }">
        {{ formatDate(row.createdAt) }}
      </template>
    </el-table-column>

      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="openEditDialog(row)">編輯</el-button>
          <el-button type="danger" size="small" @click="openConfirmDelete(row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination layout="prev, pager, next"
                   :total="filteredPromotions.length"
                   :page-size="pageSize"
                   :current-page.sync="currentPage"
                   @current-change="handlePageChange"
                   style="margin-top:20px;text-align:right"/>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PromotionView',
  data () {
    return {
      showAddDialog:false, showBatchDialog:false, showEditDialog:false, confirmDeleteDialog:false,showImportDialog: false,
      form:{gameId:null, discountRate:null, startTime:'', endTime:''},
      batchForm:{gameIds:[], discountRate:null, startTime:'', endTime:''},
      editForm:{gameId:null, gameName:'', discountRate:null, startTime:'', endTime:''},
      gameOptions:[], batchGameOptions:[],
      fullPromotionList:[], currentPage:1, pageSize:20, activeTab:'active',
      searchKeyword:'', multipleSelection: [],
      sortProp: '', sortOrder: '',
    }
  },
  computed: {
    filteredPromotions() {
      if (!this.searchKeyword.trim()) return this.fullPromotionList
      const keyword = this.searchKeyword.toLowerCase()
      return this.fullPromotionList.filter(p =>
        (p.promotionGame ?? []).some(g =>
          g.game.name.toLowerCase().includes(keyword)
        )
      )
    },
    pagedPromotions() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredPromotions.slice(start, start + this.pageSize)
    }
  },
  mounted () {
    this.fetchPromotions()
    this.fetchGames()
    this.fetchBatchGames()
  },
  methods: {
    toLocalISOString(dt){
      if(!dt) return null
      const d=new Date(dt)
      return new Date(d.getTime() - d.getTimezoneOffset()*60000)
             .toISOString().slice(0,19)
    },
    normalize(item){
      return { ...item,
        promotionGame: item.promotionGame ?? item.promotionsGames ?? []
      }
    },
    normalizeList(list){ return list.map(this.normalize) },
    async fetchPromotions(){
      const {data}=await axios.get('/api/promotions/active')
      this.activeTab='active'
      this.fullPromotionList=this.normalizeList(data).sort((a,b)=>new Date(a.endTime)-new Date(b.endTime))
    },
    async fetchUpcomingPromotions(){
      const {data}=await axios.get('/api/promotions/upcoming')
      this.activeTab='upcoming'
      this.fullPromotionList=this.normalizeList(data).sort((a,b)=>new Date(a.endTime)-new Date(b.endTime))
    },
    handlePageChange(p){ this.currentPage=p },
    async fetchGames(){
      const [gamesRes, activeRes, upRes]=await Promise.all([
        axios.get('/api/games/game'),
        axios.get('/api/promotions/active'),
        axios.get('/api/promotions/upcoming')
      ])
      const collect = list => (list ?? []).flatMap(p =>
        (p.promotionGame ?? p.promotionsGames ?? []).map(pg => pg.game.id)
      )
      const promotedIds=new Set([
        ...collect(activeRes.data),
        ...collect(upRes.data)
      ])
      const sortByName = (a,b) => a.name.localeCompare(b.name,'zh-Hant',{sensitivity:'base'})
      this.gameOptions = gamesRes.data.filter(g => !promotedIds.has(g.id)).sort(sortByName)
    },
    async fetchBatchGames(){
      await this.fetchGames()
      this.batchGameOptions=this.gameOptions
    },
    async submitPromotion(){
      try{
        await axios.post('/api/promotions/add',{
          gameId:this.form.gameId,
          discountRate:this.form.discountRate,
          startTime:this.toLocalISOString(this.form.startTime),
          endTime:this.toLocalISOString(this.form.endTime)
        })
        this.showAddDialog=false
        this.currentPage=1
        await this.fetchPromotions()
        this.$message.success('促銷新增成功')
      }catch{ this.$message.error('新增失敗') }
    },
    async submitBatchPromotion(){
      try{
        await axios.post('/api/promotions/batch-add',{
          gameIds:this.batchForm.gameIds,
          discountRate:this.batchForm.discountRate,
          startTime:this.toLocalISOString(this.batchForm.startTime),
          endTime:this.toLocalISOString(this.batchForm.endTime)
        })
        this.showBatchDialog=false
        await this.fetchPromotions()
        this.$message.success('批量新增成功')
      }catch{ this.$message.error('新增失敗') }
    },
    openEditDialog(row){
      const promo=row.promotionGame?.[0]
      if(!promo) return
      this.editForm={
        gameId:promo.game.id,
        gameName:promo.game.name,
        discountRate:promo.discountRate,
        startTime:row.startTime,
        endTime:row.endTime
      }
      this.showEditDialog=true
    },
    async submitEdit(){
      try{
        await axios.put(`/api/promotions/update/${this.editForm.gameId}`,{
          discountRate:this.editForm.discountRate,
          startTime:this.toLocalISOString(this.editForm.startTime),
          endTime:this.toLocalISOString(this.editForm.endTime)
        })
        this.showEditDialog=false
        await this.fetchPromotions()
        this.$message.success('修改成功')
      }catch{ this.$message.error('修改失敗') }
    },
    openConfirmDelete(row){
      const promo=row.promotionGame?.[0]
      if(!promo||!promo.game){
        this.$message.error('找不到遊戲資訊，無法刪除')
        return
      }
      this.editForm.gameId=promo.game.id
      this.editForm.gameName=promo.game.name
      this.confirmDeleteDialog=true
    },
    async deletePromotion(){
      try{
        await axios.delete(`/api/promotions/${this.editForm.gameId}`)
        this.confirmDeleteDialog=false
        this.showEditDialog=false
        this.activeTab==='active'?await this.fetchPromotions():await this.fetchUpcomingPromotions()
        this.$message.success('刪除成功')
      }catch{ this.$message.error('刪除失敗') }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async confirmBatchDelete() {
      const gameIds = this.multipleSelection
        .map(row => row.promotionGame?.[0]?.game?.id)
        .filter(id => !!id)
      if (!gameIds.length) {
        this.$message.warning('請先選取要刪除的促銷資料')
        return
      }
      try {
        await this.$confirm(`確定要刪除 ${gameIds.length} 筆促銷資料？`, '警告', { type: 'warning' })
        await axios.delete('/api/promotions/batch-delete', { data: gameIds })
        this.$message.success(`已成功刪除 ${gameIds.length} 筆促銷`)
        this.multipleSelection = []
        this.activeTab === 'active' ? await this.fetchPromotions() : await this.fetchUpcomingPromotions()
      } catch (err) {
        this.$message.info('已取消批次刪除')
      }
    },
        async uploadCsv(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      try {
        await axios.post('/api/promotions/import-csv', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.showImportDialog = false
        this.currentPage = 1       // 匯入成功後回到第一頁
        await this.fetchPromotions() // 重新拉取最新促銷列表
        this.$message.success('匯入成功！')
      } catch (error) {
        this.$message.error('匯入失敗')
      }
    },
    handleSortChange({ prop, order }) {
  if (!prop || !order) return

  if (this.sortProp === prop) {
    this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending'
  } else {
    this.sortProp = prop
    this.sortOrder = 'ascending'
  }

  const compare = (a, b) => {
    const valA = this.extractSortValue(a, prop)
    const valB = this.extractSortValue(b, prop)

    if (valA == null) return 1
    if (valB == null) return -1

    if (this.sortOrder === 'ascending') {
      return valA > valB ? 1 : -1
    } else {
      return valA < valB ? 1 : -1
    }
  }
  this.fullPromotionList.sort(compare)
},

extractSortValue(row, prop) {
  if (!prop) return null

  if (prop === 'startTime' || prop === 'endTime'  || prop === 'createdAt') {
    return new Date(row[prop])
  }
  if (prop === 'gameId') {
    return row.promotionGame?.[0]?.game?.id ?? null
  }
  if (prop === 'gameName') {
    return row.promotionGame?.[0]?.game?.name ?? ''
  }
  if (prop === 'price') {
    return row.promotionGame?.[0]?.game?.price ?? null
  }
  if (prop === 'discountRate') {
    return row.promotionGame?.[0]?.discountRate ?? null
  }
  if (prop === 'finalPrice') {
    const pg = row.promotionGame?.[0]
    if (!pg) return null
    return Math.floor(pg.game.price * (1 - pg.discountRate / 100))
  }
  
  return null
},
  formatDate(isoString) {
    if (!isoString) return '-'
    const d = new Date(isoString)
    const pad = n => n.toString().padStart(2, '0')
    return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }
    
  }
}
</script>


<style scoped>
/* Vue 3 深層覆寫，確保撞不到其他頁 */
::v-deep(.el-checkbox__inner) {
  width:18px;height:18px;           /* 放大一點 */
  border:2px solid #8a8a8a;         /* 深灰邊框 */
  border-radius:4px;                /* 方中帶圓 */
}

/* 勾選狀態 */
::v-deep(.el-checkbox.is-checked .el-checkbox__inner){
  background:#00a9ff;
  border-color:#00a9ff;
}

/* 勾勾本身改白，對比更強 */
::v-deep(.el-checkbox.is-checked .el-checkbox__inner::after){
  border-color:#fff;
}

/* 想再醒目？整個核取框一起放大 */
::v-deep(.el-checkbox){
  transform:scale(1.15);
  margin-right:2px;
}
</style>
