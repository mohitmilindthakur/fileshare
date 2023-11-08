import { formatBytes } from '../utils';
import { uploadFileToS3, generatePutSignedUrl } from '../apis/files';
import { ref } from 'vue';

/** 
 * @param { Object } inputElRef - vue ref for the input value
 * @param { Object } options - various properties and callbacks
 * @param { Number } options.MAX_FILE_SIZE - max file size for upload
 * @param { Function } options.onUploadSuccess - callback function on upload success
 * @param { Function } options.onProgress - callback function whenever progress event gets called
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
    const validateFile = file => {
        if (file.value.size > options.MAX_FILE_SIZE) {
            alert(`File size more than ${formatBytes(options.MAX_FILE_SIZE)}`);
            inputElRef.value.value = null;
            return false;
        }
        return true;
    }
    const getSignedUrl = async (file) => {
        const data = await generatePutSignedUrl({
            key: `${Date.now()}-${file.value.name}`,
            contentType: file.value.type
        })
        let url = data.data.url;
        return url;
    }
    const uploadFile = async (e) => {
        try {
            file.value = e.target.files[0];
            if (!validateFile(file)) {
                return;
            }
            let uploadUrl = await getSignedUrl(file);
            progress.value = 0;
            isUploading.value = true;
            isUploaded.value = false;
            let formData = new FormData();
            formData.append("image", file.value);
            let uploadRes = await uploadFileToS3(uploadUrl, formData, onProgress);
            isUploading.value = false;
            isUploaded.value = true;
            progress.value = 100;
            inputElRef.value.value = null;
            options.onUploadSuccess?.(uploadRes)
        } catch (error) {
            isUploading.value = false;
            isUploaded.value = false;
            progress.value = 0;
            inputElRef.value.value = null;
            console.log(error);
        }
    };
    return { isUploaded, isUploading, progress, file, uploadFile }
}