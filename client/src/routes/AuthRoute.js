import Error401 from '../views/components/Error401';

export const AuthRoute = ({children, roles}) => {
    const hasToken = localStorage.getItem('token');
    const userRoles = JSON.parse(localStorage.getItem('u_roles'));
    const hasRoles = userRoles && roles.includes(userRoles[0].RoleName) ? true : false;
    if(hasToken && !hasRoles) {
        return <Error401/>
    }
    return children;
}