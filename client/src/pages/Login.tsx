import axios from 'axios'
import React, { useState } from 'react'

export default function Login() {
    const [username, setUsername ] = useState<string>("")
    const [password, setPassword ] = useState<string>("")


    const getCredentials = () => {
        axios.get("http://localhost:4000/user", {
            withCredentials : true
        }).then(res => {
            console.log(res.data);
            
        })
    }
    const login = (e:any) => {
        e.preventDefault()
        axios.post("http://localhost:4000/login", {
            username,
            password
        }, {
            withCredentials : true
        }).then(res => {
            console.log(res.data);
            window.location.href = "/"
        })
    }
    return (
        <section>
            <h2>Login</h2>
            <form onSubmit={login}>
                <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value) } />
                <input type="text" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                </form>
            <button onClick={getCredentials}>Get Credentials</button>
        </section>
    )
}
