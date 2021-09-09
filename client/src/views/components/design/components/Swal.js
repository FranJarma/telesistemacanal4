import swal from 'sweetalert2';
const Swal = (titulo, mensaje) => {
    return ( 
        swal.fire({
            title: `<a style="font-family: Poppins">${titulo}</a>`,
            icon: 'success',
            html: `<p style="font-family: Poppins">${mensaje}</p>`
        })
     );
}
export default Swal;