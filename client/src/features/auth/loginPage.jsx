export default function LoginPage({onSwitchMode}){
    return (
    <div className="loginDataDiv">
        <h2 className='strKpngTrack'>Already <span id='track'>handling</span> it?</h2>
        <p className='wclmBack'>Welcome back!</p>
        <form className="loginForm">
            <div className="loginDiv">
                <label htmlFor="loginUsername" className='inputsLabels'>Username</label>
                <input type="text" id="loginUsername" className='inputs'/>

                <label htmlFor="loginPassword" className='inputsLabels'>Password</label>
                <input type="password" id="loginPassword" className='inputs'/>

               <button type="submit" id="loginSubmitBtn">Log in</button>
               <button type="button" className="btn" onClick={onSwitchMode}>
                  Need an account? Register
                </button>
            </div>
       </form>
       <p id='handleDataDesc'>
        No email required to log in — just your username and password.
        Handled doesn't track you, sell your data, or lock features behind
        a paywall. It's just a tool built to help you keep track of your own work.
       </p>
    </div>
    );
}