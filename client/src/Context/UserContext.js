import React, { createContext, useState } from 'react'


const initialState = {
    loginStatus: false
}

export const UserContext = createContext(
    initialState
)

export const UserProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userObject, setUserObject] = useState('');
    

    return (<UserContext.Provider value={{
        isAuthenticated, 
        setIsAuthenticated,
        userObject,
        setUserObject
        }}>
        {children}
    </UserContext.Provider>)
}