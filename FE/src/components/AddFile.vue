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
                    <label for="file-input" class="file-input-label btn btn-primary" :class="{ disabled: isUploading }">
                        <img :src="UploadIcon" />
                        Upload File
                    </label>
                    <div>Upto 200 mb</div>
                    <input :disabled="isUploading" ref="input" class="input-upload" id="file-input" type="file"
                        @input="uploadFile">
                </form>
            </div>
        </div>
    </section>
</template>
<script setup>
import { ref, defineEmits } from 'vue';
import UploadIcon from './../assets/upload.svg';
import useUploadFile from '../composables/useUploadFile.js';
import { showSuccessToast, showErrorToast } from './../utils/swal';

const emit = defineEmits(['upload']);
const input = ref(null);
const onUploadSuccess = data => {
    emit('upload', data.data);
    showSuccessToast(`${data.data.name} uploaded successfully`);
}
const onUploadError = err => {
    showErrorToast(err?.message || 'Error in uploading the file');
}

const { isUploading, progress, uploadFile } = useUploadFile(input, { onUploadSuccess, onUploadError });
</script>
<style scoped lang="scss">
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
    &.disabled {
        opacity: .5;
        cursor: not-allowed;
    }
}
</style>