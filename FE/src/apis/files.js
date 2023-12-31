import { BASE_URL } from "./index"

export const fetchFiles = () => {
    let url = BASE_URL + '/files';
    return fetch(url)
        .then(res => res.json())
        .then(data => data)
}

export const uploadFileToS3 = (url, file, onProgress) => {
    // using XMLHttpRequest here as finding out file upload progress is not possible using fetch
    // we show the progress bar and update it whenever progress event gets called
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', onProgress);
        xhr.addEventListener('load', () => resolve(xhr.response));
        xhr.addEventListener('error', () => reject(new Error('File upload failed')));
        xhr.addEventListener('abort', () => reject(new Error('File upload aborted')));
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.setRequestHeader('Content-Disposition', `attachment;filename="${file.name}"`);
        xhr.send(file);
    });
}

export const fileInfoToServer = (body) => {
    let url = BASE_URL + '/files';
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
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

export const generatePutSignedUrl = (data) => {
    let url = BASE_URL + '/files/generate-put-signed-url'
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => data)
}

export const generateGetSignedUrl = (data) => {
    let url = BASE_URL + '/files/generate-get-signed-url'
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => data)
}