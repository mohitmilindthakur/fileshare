<template>
    <section class="add-file pt-4">
        <div class="row mb-5 align-items-center">
            <div class="col-sm-8">
                <Transition name="fade" mode="out-in">
                    <div class="progress" v-if="isUploading">
                        <div class="progress-bar bg-success" role="progressbar" :style="{ width: progress + '%' }"
                            :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                    <!-- <div class="upload-message text-success" v-else-if="isUploaded">
                        <img :src="CheckCirclIcon" />
                        <strong>{{ file.name }}</strong> Uploaded
                    </div> -->
                </Transition>
            </div>
            <div class="col-sm-4 text-right">
                <form @submit.prevent>
                    <label for="file-input" class="file-input-label btn btn-primary">
                        <img :src="UploadIcon" />
                        Upload File
                    </label>
                    <div>Upto 200 mb</div>
                    <input ref="input" class="" id="file-input" type="file" @input="addNewFile">
                </form>
            </div>
        </div>
    </section>
</template>
<script setup>
import { uploadFile } from '../apis/files';
import UploadIcon from './../assets/upload.svg'
import CheckCirclIcon from './../assets/check-circle.svg'
import DownloadIcon from './../assets/download.svg'
import { ref } from 'vue';

const emit = defineEmits(['upload']);
const MAX_FILE_SIZE = Math.pow(10, 6) * 100; // 200 MB
const progress = ref(0);
const isUploading = ref(false);
const isUploaded = ref(false);
const file = ref({});
const input = ref(null);
const onProgress = e => {
    progress.value = (e.loaded / e.total) * 100;
};
const addNewFile = (e) => {
    file.value = e.target.files[0];
    if (file.value.size > MAX_FILE_SIZE) {
        alert('File size more than 200 MB');
        input.value.value = null;
        return;
    }
    progress.value = 0;
    isUploading.value = true;
    isUploaded.value = false;
    let formData = new FormData();
    formData.append("image", file.value);
    uploadFile(formData, onProgress)
        .then(data => {
            setTimeout(() => {
                isUploading.value = false;
                isUploaded.value = true;
                progress.value = 100;
                input.value.value = null;
                emit('upload', data.data);
            }, 500)
        })
        .catch(err => {
            isUploading.value = false;
            console.log(err)
        })
};
</script>
<style scoped>
.progress-bar {
    transition: width .5s ease-out;
}
.upload-message {
    display: flex;
    gap: 8px;
}

#file-input {
    opacity: 0;
    position: absolute;
    z-index: -99;
    height: 0;
    width: 0;
    overflow: hidden;
}
.file-input-label {

}
</style>