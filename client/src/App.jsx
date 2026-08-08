import Header from "./features/header/header";
import HomePage from "./features/home-page/homePageMain";
import AuthMainPortal from "./features/auth/authPortal"
import { useState } from "react";
import { logout } from "./features/api/auth";

export default function App(){
    const [user,setUser] = useState(null)
    function handleLogout(){
        logout()
        setUser(null)
    }
    return(
        <>
        <Header/>
        {user ? <HomePage username={user} onLogout={handleLogout}/> : <AuthMainPortal onLoginSuccess={setUser}/>}
    </>
    );
}