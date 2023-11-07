import { BASE_URL } from "./index"

export const fetchFiles = () => {
    let url = BASE_URL + '/files';
    return fetch(url)
        .then(res => res.json())
        .then(data => data)
}

export const uploadFile = (formData, onProgress) => {

    // using XMLHttpRequest here as finding out file upload progress is not possible using fetch
    // we show the progress bar and update it whenever progress event gets called
    let url = BASE_URL + '/files'
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', onProgress);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => resolve(xhr.response));
        xhr.addEventListener('error', () => reject(new Error('File upload failed')));
        xhr.addEventListener('abort', () => reject(new Error('File upload aborted')));
        xhr.open('POST', url, true);
        xhr.send(formData);
    });
}

export const downloadFileById = (id) => {
    let url = BASE_URL + '/files/' + id;
    return fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => data)
}

export const deleteFileById = (id) => {
    let url = BASE_URL + '/files/' + id;
    return fetch(url, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => data)
}