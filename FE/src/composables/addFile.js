import { formatBytes } from '../utils';
import { uploadFile } from '../apis/files';
import { ref } from 'vue';

/** 
 * @param { Object } ref - vue ref for the input value
 * @param { Object } options - various properties and callbacks
 * @param { Number } options.MAX_FILE_SIZE - max file size for upload
 * @param { Function } options.onUploadSuccess - max file size for upload
 * @param { Function } options.onProgress - max file size for upload
*/
export default function (inputElRef, options = {}) {
    // DEFAULTS
    // default max file size 200MB
    !options.MAX_FILE_SIZE && (options.MAX_FILE_SIZE = Math.pow(10, 6) * 100);

    const progress = ref(0);
    const isUploading = ref(false);
    const isUploaded = ref(false);
    const file = ref({});
    const onProgress = e => {
        progress.value = (e.loaded / e.total) * 100;
        options.onProgress?.apply(e);
    };
    const addNewFile = (e) => {
        file.value = e.target.files[0];
        if (file.value.size > options.MAX_FILE_SIZE) {
            alert(`File size more than ${formatBytes(options.MAX_FILE_SIZE)}`);
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
                isUploading.value = false;
                isUploaded.value = true;
                progress.value = 100;
                inputElRef.value.value = null;
                options.onUploadSuccess?.(data)
            })
            .catch(err => {
                isUploading.value = false;
                isUploaded.value = false;
                progress.value = 0;
                inputElRef.value.value = null;
                console.log(err);
            })
    };
    return { isUploaded, isUploading, progress, file, addNewFile }
}