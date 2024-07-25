import { createContext, useEffect, useState } from "react";
import User from "@/models/User";
import useLocalStorage from "@/services/useLocalStorage";
import { useJwt } from "react-jwt";

interface UserContextType {
    user: string;
    setUser: (user: string) => void;
    isAuth: () => boolean;
    logout: () => void;
    getId: () => number;
    getUsername: () => string;
    getEmail: () => string;
    getRoleId: () => number;
    getRole: () => string;
    getToken: () => string;
    ifUserConnected: () => boolean;
    ifUserIsAdmin: () => boolean;
}

const UserContext = createContext<UserContextType |null>(null);

export default UserContext;

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useLocalStorage("user", "");
    const { decodedToken } = useJwt<User>(user);
    const { isExpired } = useJwt(user);

    const isAuth = () => {
        if (isExpired || user === "") {
            return false;
        }
        return true;
    }

    const logout = () => {
        setUser("");
    }

    const getId = () => {
        return decodedToken?.id!;
    }

    const getUsername = () => {
        return decodedToken?.username!;
    }

    const getEmail = () => {
        return decodedToken?.email!;
    }

    const getRoleId = () => {
        return decodedToken?.role_id!;
    }

    const getRole = () => {
        return decodedToken?.role_name!;
    }

    const getToken = () => {
        return user;
    }

    const ifUserConnected = () => {
        return isAuth();
    }

    const ifUserIsAdmin = () => {
        return isAuth() && getRoleId() === 1;
    }

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser,
            isAuth,
            logout,
            getId,
            getUsername,
            getEmail,
            getRoleId,
            getRole,
            getToken,
            ifUserConnected,
            ifUserIsAdmin,
        }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserProvider };