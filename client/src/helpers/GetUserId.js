const GetUserId = () => {
    return ( JSON.parse(localStorage.getItem('u_info'))[0].UserId);
}
 
export default GetUserId;