export const formatDate = date => {
    return new Date(date).toLocaleDateString();
}

export const formatBytes = bytes => {
    if (!bytes) {
        return '0 Bytes';
    }
    if (typeof bytes !== Number) {
        bytes = Number(bytes);
        if (Number.isNaN(bytes)) {
            return '0 Bytes';
        }
    }
    const kb = 1000;
    const mb = kb * kb;
    const gb = mb * kb;
    if (bytes < kb) {
        return `${bytes} Bytes`
    }
    else if (bytes < mb) {
        return `${(bytes / kb).toFixed(2)} KB`
    }
    else if (bytes < gb) {
        return `${(bytes / mb).toFixed(2)} MB`
    }
    return `${(bytes / gb).toFixed(2)} GB`
}