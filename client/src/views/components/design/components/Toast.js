import swal from 'sweetalert2';

const Toast = (mensaje, categoria) => {
  return(
      swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        icon: `${categoria}`,
        title: `<a style="font-family: Poppins">${mensaje}</a>`
      })
  )
}
export default Toast;