import { XCircle } from "lucide-react";
import RepositoryAsOption from "./repositoryOption";

//Shared CSS
export default function ListAllowedRepositories({allowedRepositories,isConnecting, setIsConnecting, setHasRepoLinked, setLrName, setLrFullName,setDefaultBranch, setRepositoriesFound, projectId}){
     return(
        <div className={isConnecting ? "chooseRepositoryMainDiv" : hide}>
            <div className="chooseRepositoryDiv">
                <div className='chooseRepositoryHeader'>
                    <div className="otherThingyDiv">
                        <XCircle onClick={() => setIsConnecting(false)}/>
                        <h2 className="onHeaderTitle">Connect a repository</h2>
                        <p></p>
                    </div>
                    <label className="onHeaderLbl">The repository you're searching for isn't here? Manage connected repositories on settings in the <span className="toAccent">homepage</span></label>
                </div>
                <div className='chooseRepositoryContent'>
                    {allowedRepositories.map(r => <RepositoryAsOption
                    key={r.id}
                    name={r.name}
                    fullName={r.full_name}
                    httpLink={r.html_url}
                    thisRepoId={r.id}
                    setRepositoriesFound={setRepositoriesFound}
                    setHasRepoLinked={setHasRepoLinked}
                    setLrName={setLrName}
                    setFullLrName={setLrFullName}
                    setDefaultBranch={setDefaultBranch}
                    projectId={projectId}
                    />)}
                
            
                </div>
            </div>
        </div>
        );
}