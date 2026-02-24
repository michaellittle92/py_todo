import { useState } from "react";
import { API_BASE_URL } from "./config";

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!username || !password){
            alert("Please enter username and password");
            return;
        }

        // remove this
        console.log("username: ", username)
        console.log("password: ", password)

        //login api call
        try {
            const response = await fetch(`${API_BASE_URL}/auth/token`, {
                method: "POST",
                body: new URLSearchParams({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            console.log("Server response: ", data);
        } catch (error) {
            console.error("Request failed: ", error)
        }
        
    }

    return(
        <div>
            <h3>LOGIN</h3>
            <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <input 
            type="password" 
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={handleLogin}>Login</button>
            <button type="button">Register</button>
        </div>
        
    )
}

export default Login;