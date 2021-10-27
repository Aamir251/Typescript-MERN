import axios, { AxiosResponse } from "axios"
import { useContext, useEffect, useState } from "react"
import { UserInterface } from "../Interfaces/interfaces";
import { myContext } from "./Context"

export default function AdminPage() {
    const ctx = useContext(myContext);


    const [ data, setData] = useState<UserInterface[]>()
    useEffect(() => {
        axios.get("http://localhost:4000/getallusers", {
            withCredentials : true
        }).then((res : AxiosResponse) => {
            setData(res.data.filter((item : UserInterface ) => {
                return item.username !== ctx.username
            }))
        })
    }, [ctx])
    return (
        <div>
            
        </div>
    )
}
