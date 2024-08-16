import { Navigate } from 'react-router-dom';
import useLocalStorage from './useLocalStorage';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    
    const [user, setUser] = useLocalStorage("user", "");

    if(user){
        return <>{children}</>
    } else {
        return <Navigate to="/login" />
    }
}

export { AuthGuard };