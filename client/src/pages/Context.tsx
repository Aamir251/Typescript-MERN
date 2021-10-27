import axios from "axios";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { UserInterface } from "../Interfaces/interfaces";

// Partial is used to initialize it with an initial default value
export const myContext = React.createContext<Partial<UserInterface>>({})

export const  Context = (props : PropsWithChildren<any>) => {

    const [user, setUser ] = useState<UserInterface>()

    useEffect(() => {

        const getUser = async () => {
            
            try {
                const response = await axios.get("http://localhost:4000/user", { withCredentials : true})
                setUser(response?.data)
                
            } catch (error:any) {
                throw new Error(error)
            }
        }


        getUser()
        

    },[])
    return (
        //  ! tells that we are sure that this value will always exist
        <myContext.Provider value={user!}>
            {props.children}
        </myContext.Provider>
    )
}