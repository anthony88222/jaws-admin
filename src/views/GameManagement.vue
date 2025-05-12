<template>
  <div class="main-content">
    <h2>遊戲管理</h2>
    <div class="toolbar">
      <el-button type="primary" @click="openAddDialog">新增遊戲</el-button>
      <el-button type="danger" @click="handleBatchDelete" :disabled="!multipleSelection.length">批次刪除</el-button>
      <el-input v-model="search" placeholder="搜尋遊戲名稱" style="width: 300px; margin-left: 20px" />
    </div>

    <el-table
      :data="filteredGames"
      border
      stripe
      style="width: 100%; margin-top: 20px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="遊戲ID" width="80" sortable />
      <el-table-column label="遊戲圖片" width="120">
        <template #default="scope">
          <img :src="scope.row.coverImageUrl" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="遊戲名稱" sortable />
      <el-table-column prop="price" label="價格" width="100" sortable />
      <el-table-column label="分類">
        <template #default="scope">
          <span v-if="scope.row.categories && scope.row.categories.length > 0">
            {{ scope.row.categories.map(c => c.name).join(', ') }}
          </span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column label="評論">
        <template #default="scope">
          <el-button type="info" size="small" @click="openReviewDialog(scope.row)">查看評論</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">編輯</el-button>
          <el-button size="small" type="danger" @click="deleteGame(scope.row.id)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增 / 編輯遊戲對話框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '編輯遊戲' : '新增遊戲'">
      <el-form :model="form">
        <el-form-item label="遊戲名稱">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description" />
        </el-form-item>
        <el-form-item label="價格">
          <el-input type="number" v-model="form.price" />
        </el-form-item>
        <el-form-item label="發行日期">
          <el-date-picker v-model="form.releaseDate" type="datetime" />
        </el-form-item>
        <el-form-item label="圖片 URL">
          <el-input v-model="form.coverImageUrl" />
        </el-form-item>
        <el-form-item label="分類">
          <el-select v-model="form.categoryIds" multiple filterable placeholder="選擇分類">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitGame">{{ isEdit ? '更新' : '送出' }}</el-button>
      </template>
    </el-dialog>

    <!-- 評論對話框 -->
    <el-dialog v-model="reviewDialogVisible" title="玩家評論">
      <div v-if="currentReviews.length > 0">
        <div v-for="review in currentReviews" :key="review.id" style="margin-bottom: 10px">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span><strong>玩家{{ review.userId }}:</strong> {{ review.comment }}</span>
            <el-button type="danger" size="small" plain @click="deleteReview(review.id)">刪除</el-button>
          </div>
        </div>
      </div>
      <div v-else>尚無評論</div>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">關閉</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const search = ref('')
const multipleSelection = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(null)
const currentReviews = ref([])
const reviewDialogVisible = ref(false)

const defaultForm = () => ({
  name: '',
  description: '',
  price: 0,
  releaseDate: '',
  coverImageUrl: '',
  status: 0,
  createdBy: 'admin',
  updatedBy: 'admin',
  categoryIds: []
})

const form = ref(defaultForm())
const categories = ref([])
const games = ref([])

const fetchGames = async () => {
  const res = await axios.get('http://localhost:8080/api/games/game')
  games.value = Array.isArray(res.data) ? res.data : [] // 確保是陣列
}
const fetchCategories = async () => {
  const res = await axios.get('http://localhost:8080/api/games/categories')
  categories.value = res.data
}

onMounted(() => {
  fetchGames()
  fetchCategories()
})

const filteredGames = computed(() => {
  return games.value.filter(g => g.name.toLowerCase().includes(search.value.toLowerCase()))
})

const handleSelectionChange = val => {
  multipleSelection.value = val
}

const handleBatchDelete = async () => {
  for (const game of multipleSelection.value) {
    await axios.delete(`http://localhost:8080/api/games/admin/games/${game.id}`)
  }
  fetchGames()
}

const deleteGame = async (id) => {
  await axios.delete(`http://localhost:8080/api/games/admin/games/${id}`)
  fetchGames()
}

const deleteReview = async (reviewId) => {
  try {
    await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`)
    fetchGames()
  } catch (error) {
    console.error('刪除評論失敗', error)
  }
}

const openAddDialog = () => {
  form.value = defaultForm()
  dialogVisible.value = true
  isEdit.value = false
  editingId.value = null
}

const openEditDialog = game => {
  form.value = {
    name: game.name,
    description: game.description,
    price: game.price,
    releaseDate: game.releaseDate,
    coverImageUrl: game.coverImageUrl,
    status: game.status || 0,
    createdBy: 'admin',
    updatedBy: 'admin',
    categoryIds: game.categories?.map(c => c.id) || []
  }
  dialogVisible.value = true
  isEdit.value = true
  editingId.value = game.id
}

const submitGame = async () => {
  if (isEdit.value) {
    await axios.patch(`http://localhost:8080/api/games/${editingId.value}`, form.value)
  } else {
    await axios.post('http://localhost:8080/api/games/admin/games', form.value)
  }
  dialogVisible.value = false
  fetchGames()
}

const openReviewDialog = async (game) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/reviews/game/${game.id}`)
    currentReviews.value = res.data
    reviewDialogVisible.value = true
  } catch (error) {
    console.error('無法取得評論', error)
  }
}

</script>

<style scoped>
.main-content {
  padding: 20px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
