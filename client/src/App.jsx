import Header from "./features/header/header";
import HomePage from "./features/home-page/homePageMain";
import AuthMainPortal from "./features/auth/authPortal"
import { useState } from "react";

export default function App(){
    const [user,setUser] = useState(null)
    return(
        <>
        <Header/>
        {user ? <HomePage/> : <AuthMainPortal onLoginSuccess={setUser}/>}
    </>
    );
}