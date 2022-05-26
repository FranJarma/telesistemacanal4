const GetFullName = () => {
    return ( JSON.parse(localStorage.getItem('u_info'))[0].Apellido + ", " + JSON.parse(localStorage.getItem('u_info'))[0].Nombre );
}
 
export default GetFullName;