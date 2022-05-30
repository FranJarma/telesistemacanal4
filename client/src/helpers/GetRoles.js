const GetRoles = () => {
    return JSON.parse(localStorage.getItem('u_roles'));
}
 
export default GetRoles;