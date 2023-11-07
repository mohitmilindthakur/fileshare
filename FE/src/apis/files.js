import { BASE_URL } from "./index"

export const fetchFiles = () => {
    let url = BASE_URL + '/files';
    return fetch(url)
        .then(res => res.json())
        .then(data => data)
}

export const uploadFile = (formData, onProgress) => {
    let url = BASE_URL + '/files'
    // return fetch(url, {
    //     method: 'POST',
    //     body: formData
    // })
    //     .then(response => response.json())
    //     .then(data => data)
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