import swal from 'sweetalert2';

const Toast = (mensaje, categoria) => {
  return(
      swal.fire({
        toast: true,
        position: 'top-end',
        showCloseButton: true,
        closeButtonHtml: '&times',
        timer: 7000,
        icon: `${categoria}`,
        title: `<a style="font-family: Poppins">${mensaje}</a>`
      })
  )
}
export default Toast;