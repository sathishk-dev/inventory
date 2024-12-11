import { Navigate } from 'react-router-dom';

export default function IsLoggedIn({children}) {
  
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isWebAuth = localStorage.getItem('webAuth') === 'true'
    
    if(isLoggedIn && isWebAuth){
        return <Navigate to={'/home'} replace />
    }

    return children
}
