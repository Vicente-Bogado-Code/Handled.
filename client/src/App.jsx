import Header from "./features/header/header";
import HomePage from "./features/home-page/homePageMain";
import AuthMainPortal from "./features/auth/authPortal";
import CurrentProjectComp from "./features/onProject/onProject";
import { useState } from "react";
import { logout } from "./features/api/auth";

export default function App(){
    const [user,setUser] = useState(null)
    const [currentId, setCurrentId] = useState("")
    function handleLogout(){
        logout()
        setUser(null)
    }
    return(
        <>
        <Header/>
        {user ? (currentId ? <CurrentProjectComp project_id={currentId} handleGoBack={setCurrentId}/> : <HomePage username={user} onLogout={handleLogout} handleProjectClick={setCurrentId}/>)
        : <AuthMainPortal onLoginSuccess={setUser}/>}
    </>
    );
}