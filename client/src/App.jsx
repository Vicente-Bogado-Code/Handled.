import Header from "./features/header/header";
import HomePage from "./features/home-page/homePageMain";
import AuthMainPortal from "./features/auth/authPortal";
import CurrentProjectComp from "./features/onProject/onProject";
import { useEffect, useState } from "react";
import { logout } from "./features/api/authRequests/auth";
import { getMyData } from "./features/api/getDataRequests/getWhoAmI";
import { getRepositories } from "./features/api/third-party-APIs/github_api";


export default function App(){
    async function askForRepos() {
        const params = new URLSearchParams(window.location.search)
        if (params.get("github-status") === "connected"){
            const r = await getRepositories()
            console.log(r)
            window.history.replaceState({},"",window.location.pathname);
        }
    }
    useEffect(() => {
        askForRepos()
    }, [])
    const [user,setUser] = useState(null)
    const [currentId, setCurrentId] = useState("")
    useEffect(() => {
    async function getCookie() {
        const r = await getMyData()
        if (r.Status === "Data retrieved"){
            setUser(r.Me.username)
            setCurrentId(r.Me.current_project_id)
        }
    }
    getCookie();

    }, [])
    function handleLogout(){
        logout()
        setUser(null)
    }
    return(
        <>
        <Header/>
        {user ? (currentId ? <CurrentProjectComp project_id={currentId} handleGoBack={setCurrentId}/> : <HomePage username={user} setUsername={setUser} onLogout={handleLogout} handleProjectClick={setCurrentId}/>)
        : <AuthMainPortal onLoginSuccess={setUser}/>}
    </>
    );
}