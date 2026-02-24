import { useState } from "react";
import Login from "./Login";

function App(){
    const [user, setUser] = useState(null);

    if (user) {
        //logged in view
        return <div>Login Successful</div>
    }
    return <Login onLoginSuccess={(data) => setUser(data.user || true)} />;
}

export default App;