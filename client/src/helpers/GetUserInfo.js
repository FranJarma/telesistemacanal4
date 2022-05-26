const GetUserInfo = () => {
    return ( JSON.parse(localStorage.getItem('u_info'))[0]);
}
 
export default GetUserInfo;