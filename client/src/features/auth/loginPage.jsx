import { loginUser } from "../api/authRequests/auth";
import { useState } from "react";
import { Info } from "lucide-react"

export default function LoginPage({onSwitchMode ,onLoginSuccess}){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState("")

    async function handleLogin() {
        if (username == "" || password == "") {return}
        let response;
        try {
            response = await loginUser(username,password)
        }
        catch(err){
            if (err instanceof TypeError){setError("»Server unreachable, try again later.")}
        }
        if (response.Status === "Valid credentials"){
            onLoginSuccess(response.username)
        }
        else{
            setError(response.Status);
        }
    }

    return (
    <div className="loginDataDiv">
        <h2 className='strKpngTrack'>What are you <span id='track'>working</span> on?</h2>
        <p className='wclmBack'>Welcome back!</p>
        <div className="loginForm">
            <div className="loginDiv">
                <label htmlFor="loginUsername" className='inputsLabels'>Username</label>
                <input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text" id="loginUsername" className='inputs'/>

                <label htmlFor="loginPassword" className='inputsLabels'>Password</label>
                <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" id="loginPassword" className='inputs'/>

               <button onClick={handleLogin} id="loginSubmitBtn">Log in</button>
               <button type="button" className="btn" onClick={onSwitchMode}>
                  Need an account? Register
                </button>
            </div>
       </div>
       <p id='handleDataDesc'>
        Both inputs are CASE SENSITIVE, double check if your username and password are correct. <br /> <br />
        Handled is open source! You can check it out here: <a href="https://github.com/Vicente-Bogado-Code/Handled."> Source code</a>.
       </p>
       <div className='errorDiv'>
         {error ? <p> 
          <Info size={16}/>{error}
         </p> : null}
       </div>
    </div>
    );
}