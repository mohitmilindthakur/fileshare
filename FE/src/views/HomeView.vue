<script setup>
import FilesList from '../components/FilesList.vue';
import AddFile from '../components/AddFile.vue';
import { ref, inject } from 'vue';
import { useUserStore } from '../stores/user';

const files = ref([]);
const isFilesLoading = ref(true);
const $api = inject('$api');
console.log($api);

$api.files.fetchFiles()
  .then(data => {
    files.value = data.data;
    isFilesLoading.value = false;
  })
  .catch(err => {
    console.log(err);
    isFilesLoading.value = false;
  })

const onUpload = data => {
  files.value.unshift(data);
}

const onDelete = index => {
  files.value.splice(index, 1);
}

const store = useUserStore();
</script>

<template>
  <div class="container">
  <div class="admin-toggle d-flex align-items-center mt-2">
    <input type="checkbox" id="toggle-admin" name="toggle-admin" class="form-input-check" v-model="store.isAdmin" @input="store.toggleIsAdmin">
    <label class="ml-2 mb-0" for="toggle-admin">Toggle Admin</label>
  </div>
  <AddFile @upload="onUpload" />
  <FilesList :files="files" @delete="onDelete" :isFilesLoading="isFilesLoading"/>
</div>
</template>
