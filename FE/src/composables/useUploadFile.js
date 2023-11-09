import { formatBytes } from '../utils';
import { uploadFileToS3, generatePutSignedUrl, fileInfoToServer } from '../apis/files';
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
    !options.MAX_FILE_SIZE && (options.MAX_FILE_SIZE = Math.pow(10, 6) * 200);

    const progress = ref(0);
    const isUploading = ref(false);
    const isUploaded = ref(false);
    const file = ref({});
    const onProgress = e => {
        progress.value = (e.loaded / e.total) * 100;
        options.onProgress?.(e);
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
        let s3Key = `${Date.now()}-${file.value.name}`
        const data = await generatePutSignedUrl({
            key: s3Key,
            contentType: file.value.type,
            filename: file.value.name
        })
        let uploadUrl = data.data.url;
        return { uploadUrl, s3Key };
    }
    const resetFile = () => {
        isUploading.value = false;
        isUploaded.value = false;
        progress.value = 0;
        inputElRef.value.value = null;
    }
    const uploadFile = async (e) => {
        let isUploadedToS3 = false;
        let isDataAddedInDb = false;
        try {
            file.value = e.target.files[0];
            if (!validateFile(file)) {
                return;
            }
            let { uploadUrl, s3Key } = await getSignedUrl(file);
            progress.value = 0;
            isUploading.value = true;
            isUploaded.value = false;
            await uploadFileToS3(uploadUrl, file.value, onProgress);
            isUploadedToS3 = true;
            let response = await fileInfoToServer({
                s3Key: s3Key,
                size: file.value.size,
                name: file.value.name
            })
            isDataAddedInDb = true;
            isUploading.value = false;
            isUploaded.value = true;
            progress.value = 100;
            inputElRef.value.value = null;
            options.onUploadSuccess?.(response)
        } catch (error) {
            if (isUploadedToS3 && !isDataAddedInDb) {

            }
            resetFile()
            console.log(error);
        }
    };
    return { isUploaded, isUploading, progress, file, uploadFile }
}