<template>
  <div class="edit-content">
    <div class="title">
      <input  placeholder="输入文章标题..." spellcheck="false" maxlength="80" v-model="form.title" v-if="!preview">
      <h1 v-else>{{ form.title }}</h1>

        <!-- <a-button type="primary" size="large" shape="round" v-if="form.content != '' && form.title != ''"  @click="preview = !preview">{{ preview ? '编辑' : '预览' }}</a-button> -->
      <div class="btn">
        <a-dropdown-button 
            @click="preview = !preview" 
            v-if="form.content != '' && form.title != ''"
            >
              {{ preview ? '编辑' : '预览' }}
            <template #icon>
              <icon-down />
            </template>
            <template #content>
              <a-doption @click="$router.push('/')">首页</a-doption>
              <a-doption @click="$router.back()">返回</a-doption>
            </template>
        </a-dropdown-button>
        <a-dropdown-button v-else 
            style="margin-left: auto;"
            @click="$router.push('/')" 
            >
              主页
            <template #icon>
              <icon-down />
            </template>
            <template #content>
              <a-doption @click="$router.back()">返回</a-doption>
            </template>
        </a-dropdown-button>
      </div>
    </div>
    
    <mavon-editor 
      v-model="form.content"
      :subfield="!preview"
      :editable="!preview"
      :toolbarsFlag="!preview"
      @imgAdd="imgAdd"
      ref="md"
      @save="save" />
  </div>

  <a-drawer 
    width="50vw"
    :visible="visible" 
    :placement="'right'" 
    @cancel="handleCancel"
    :footer="false"
    unmountOnClose>
    <template #title>
      {{  $route.name === 'editArt'? '修改文章' : '发表文章' }}
    </template>
    <div class="drawer">
      <a-form ref="formRef" :size="'large'" :model="form"  @submit-success="handleSubmitSuccess">
        <a-form-item field="category" label="类别" :rules="[{true:true,message:'至少选择一个'},{empty:false,message:'至少选择一个'},{required:true,message:'至少选择一个'}]">
          <a-select v-model="form.category" placeholder="选择类别" allow-clear @dropdown-reach-bottom="dropdownHandler" 
          >
            <a-option v-for="tag in category" :key="tag.name + '5'" :value="tag.id">{{ tag.tagName }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item 
          field="summary" 
          label="概要"
          :rules="[{required:true,message:'摘要不为空'},{minLength:1,message:'不小于1个字符'}]"
        >
        <a-textarea v-model="form.summary" placeholder="编辑摘要..." :max-length="255" allow-clear show-word-limit />
      </a-form-item>
      <a-form-item 
        field="tagIds" 
        label="标签" 
        :validate-trigger="['change','input', 'focus', 'blur']"
        :rules="[{true:true,message:'至少选择一个'},{empty:false,message:'至少选择一个'},{required:true,message:'至少选择一个'}]" 
      >
        <a-select
          @dropdown-reach-bottom="dropdownMultipleHandler"
          placeholder="请搜索添加标签" multiple  v-model="form.tagIds" :max-tag-count="5" allow-clear allow-search>
            <a-option v-for="tag in tags" :key="tag.name + '2'" :value="tag.id">{{ tag.tagName }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="封面" field="img" >
        <a-upload 
            show-preview-button
            :show-file-list="false"
            :custom-request="customRequest">
            <template #upload-button>
            <div
              style="
              background-color: var(--color-fill-2);
              color: var(--color-text-1);
              border: 1px dashed var(--color-fill-4);
              width: 220px;
              border-radius: 2;
              text-align: center;"
              v-if="imgUrl === ''"
            >
                <div>
                  <span style="color: #3370FF; line-height: 120px;">点击上传图片</span>
                </div>
            </div>
            <a-image
                v-else
                width="224"
                :src="setting.baseUrl + imgUrl"
              />
          </template>
        </a-upload>
        </a-form-item>
        <a-form-item label="游客可见">
          <a-select placeholder="选择" v-model="form.anonymous" :default-value="false">
            <a-option :value="true">是</a-option>
            <a-option :value="false">否</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否公开">
          <a-select placeholder="选择" v-model="form.common" :default-value="1">
            <a-option :value="1">是</a-option>
            <a-option :value="0">否</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" size="large" type="primary">{{ $route.name === 'editArt'? '修改' : '发表' }}</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { saveArticle, getArticleContent, updateArticle } from '@/api/article'
import { Message } from '@arco-design/web-vue';
import { getTagList, getCategory } from '@/api/tag';
import { upload } from '@/api/upload'
import setting from '@/config/setting';
import { useRoute, useRouter } from 'vue-router';
import { getUid } from '@/utils/auth'


const route = useRoute()
const router = useRouter()

// 富文本组件
const md = ref(null)

let visible = ref(false);
let form = ref({})
let tags = ref([])
let category = ref([])
let imgUrl = ref('');
let preview = ref(false)  // 预览模式

let tagParams = {
  pageNum: 1,
  pageSize: 10
}

let categoryParams = {
  pageNum: 1,
  pageSize: 10
}

let dropdownBottom = false;
let dropdownMultipleBottom = false;


onMounted(() => {
  // 修改文章
  if (route.name === 'editArt' && route.params.id.length == 19) {
    getArticleContent(route.params.id).then(res=>{
      console.log(getUid());
      if (res.data.authorId !== getUid()) {
        router.replace({name:'home'})
        return 
      }
      let data = res.data
      imgUrl.value = data.img
      form.value.articleId = data.id
      form.value.title = data.title
      form.value.category = data.categoryId
      form.value.summary = data.summary
      form.value.content = data.content.content
      form.value.anonymous = data.anonymous === 1 ? true : false
      form.value.common = data.common
      form.value.tagIds = res.data.tags.map(item=>{
        return item.id
      })
        // 获取所有标签
        getTagList(tagParams).then(res=> tags.value = res.data.records)
        // 获取显示在主页的标签，类别
        getCategory({sortField: 'sortNum',  ...categoryParams}).then(res => {
          category.value = res.data.records
        })
    }).catch(e=>router.replace({name:'home'}))

  } else if (route.name === 'editAdd') {
    // 获取所有标签
      getTagList(tagParams).then(res=> tags.value = res.data.records)
      // 获取显示在主页的标签，类别
      getCategory({sortField: 'sortNum',  ...categoryParams}).then(res => {
        category.value = res.data.records
        })
  } else {
    router.replace({name:'home'})
  }

})

function save() {
  visible.value = true
}

function handleCancel() {
  visible.value = false
}

function switchPreview() {
  preview.value = true
  resetParams()
}

function handleSubmitSuccess() {
  // 如果是更新
  if (route.name === 'editArt') {
    updateArticle(form.value).then(res=>{
        switchPreview()
        Message.success(res.msg)
        visible.value = false
      }).catch(e=>{})
  } else {
      saveArticle(form.value).then(res=>{
        switchPreview()
        Message.success(res.msg)
        visible.value = false
    }).catch(e=>{})
  }
  
}

function resetParams() {
  categoryParams = tagParams = {
    pageNum: 1,
    pageSize: 10
  }
  imgUrl.value = ''
  
  dropdownBottom = false;
  dropdownMultipleBottom = false;
}


function dropdownHandler() {
  if (!dropdownBottom) {
    categoryParams.pageNum += 1
    // 获取显示在主页的标签，类别
    getCategory({sortField: 'sortNum',  ...categoryParams}).then(res => {
      if (res.data.records.length !== 0) {
        category.value = category.value.concat(res.data.records)
      } else {
        dropdownBottom = true; // 到底
      }
    })
  }
}

function dropdownMultipleHandler() {
  if (!dropdownMultipleBottom) {
    tagParams.pageNum += 1
      // 获取所有标签
    getTagList(tagParams).then(res => {
      if (res.data.records.length !== 0) {
        tags.value = tags.value.concat(res.data.records)
      } else {
        dropdownMultipleBottom = true; // 到底
      }
    })
  }
}


function customRequest(option) {
    let { fileItem } = option
    let file = fileItem.file
    const typeList = ['image/png', 'image/jpeg','image/gif']
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!typeList.includes(file.type)) {
        Message.error('只可以上传图片');
        return 
    }
    if (!isLt2M) {
        Message.error('上传头像图片大小不能超过 5MB!');
        return 
    }
    let formData = new FormData()
    formData.append('file',file)
    upload(formData).then(res => {
      form.value.img = imgUrl.value = res.msg
    }).catch(r=>r)
}

// 富文本编辑器图片上传
function imgAdd(pos, file) {
    const typeList = ['image/png', 'image/jpeg','image/gif']
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!typeList.includes(file.type)) {
        Message.error('只可以上传图片');
        return 
    }
    if (!isLt2M) {
        Message.error('上传头像图片大小不能超过 5MB!');
        return 
    }
    let formData = new FormData()
    formData.append('file',file)
    upload(formData).then(res => {
      md.value.$img2Url(pos, setting.baseUrl + res.msg)
    }).catch(r=>r)
}


</script>

<style scoped>
.edit-content {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

.shadow {
  height: 100%;
}


.title {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
}

.title > input {
  margin: 0;
  padding: 0;
  width: 500px;
  font-size: 24px;
  font-weight: 500;
  color: #1d2129;
  border: none;
  outline: none;
}

.title > .btn {
  margin-left: auto;
}
.drawer {
  padding: 30px 0;
  padding-right: 60px;
}

.arco-upload-list-picture.custom-upload-avatar {
  width: 200px !important;
}

@media (max-width: 720px) {
  .title > input {
    width: 100% !important;
  }
}
</style>