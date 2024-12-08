import { Navigate } from 'react-router-dom';

export default function IsLoggedIn({children}) {
  
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if(isLoggedIn){
        return <Navigate to={'/home'} replace />
    }

    return children
}
