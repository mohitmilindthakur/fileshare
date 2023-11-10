import Swal from 'sweetalert2';

export const showErrorToast = title => {
    Swal.fire({
        title: title,
        position: 'top-right',
        toast: true,
        timer: 2000,
        showConfirmButton: false,
        background: "#b11109",
        color: '#fff'
    })
}


export const showSuccessToast = title => {
    Swal.fire({
        title: title,
        position: 'top-right',
        toast: true,
        timer: 2000,
        showConfirmButton: false,
        background: "#09b109",
        color: '#fff'
    })
}