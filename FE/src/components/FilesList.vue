<template>
    <section class="files-list-container" v-if="!isFilesLoading">
        <div class="table-wrapper">
            <table class="table table-hover files-table">
                <thead>
                    <tr>
                        <th width="60%">Title</th>
                        <th>Size</th>
                        <th>Upload Date</th>
                        <th></th>
                    </tr>

                </thead>
                <tbody>
                    <TransitionGroup name="list-animation">
                        <tr v-for="file, index in files" :key="file.id">
                            <td>{{ file.name }}</td>
                            <td>{{ formatBytes(file.size) }}</td>
                            <td>{{ formatDate(file.uploadDate) }}</td>
                            <td class="text-right">
                                <div class="buttons d-flex align-items-center justify-content-end">
                                    <button class="btn btn-primary btn-sm" @click="downloadFile(file)">Download</button>
                                    <button v-if="store.isAdmin" class="btn btn-danger btn-sm ml-2"
                                        @click="deleteFile(file, index)">Delete</button>
                                </div>
                            </td>
                        </tr>
                    </TransitionGroup>
                </tbody>
            </table>
            <Transition name="fade">
                <div class="empty-img-container mt-5" v-if="files.length === 0">
                    <h5>No Files Uploaded Yet</h5>
                    <img :src="EmptyTableImage" alt="" class="empty-img mt-2">
                </div>
            </Transition>
        </div>
    </section>
</template>
<script setup>
import { deleteFileById, generateGetSignedUrl } from '../apis/files';
import { defineEmits } from 'vue';
import EmptyTableImage from './../assets/empty.svg';
import { useUserStore } from './../stores/user'
import { formatDate, formatBytes } from '../utils';
import Swal from 'sweetalert2';
import { showSuccessToast, showErrorToast } from './../utils/swal';

defineProps({
    files: Array,
    isFilesLoading: Boolean
})
const emit = defineEmits(['delete']);
const store = useUserStore();

const deleteFile = async (file, index) => {
    try {
        let result = await Swal.fire({
            title: "Confirm Delete ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })
        if (result.isConfirmed) {
            let res = await deleteFileById(file.id);
            emit('delete', index);
            showSuccessToast(`${file.name} deleted successfully`)
        }
    } catch (err) {
        showErrorToast(err?.message || 'Error in deleting the file')
    }
}

const downloadFile = async (file) => {
    try {
        let response = await generateGetSignedUrl({ key: file.s3Key });
        let url = response.data.url;
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (err) {
        showErrorToast(err?.message || 'Error in downloading the file')
    }
}
</script>
<style lang="scss">
.files-list-container {
    background-color: white;
    box-shadow: 0 5px 5px 5px rgba(0,0,0,.05);
}
.table-wrapper {
    overflow-y: auto;
}

.files-table {
    margin: 0 auto;
    border-collapse: collapse;
    overflow: visible;

    td {
        vertical-align: middle;
    }

    thead th {
        position: sticky;
        top: 0;
        background-color: white;
        border-width: 1px;
    }
}

.empty-img-container {
    text-align: center;
}

.empty-img {
    width: 250px;
}
</style>