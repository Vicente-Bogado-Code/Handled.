import { FaGithub } from "react-icons/fa";
import "./chooseRepo.css"
import RepositoryAsOption from './repositoryOption';
export default function ChooseRepository({repositoriesFound, setRepositoriesFound, setHasRepoLinked, setLrName,setFullLrName, setDefaultBranch}){
    return(
    <div className="chooseRepositoryMainDiv">
        <div className="chooseRepositoryDiv">
            <div className='chooseRepositoryHeader'>
                <h2 className="onHeaderTitle">More than one repository found!</h2>
                <label className="onHeaderLbl">Specify which one would you like to connect to this handled project</label>
            </div>
            <div className='chooseRepositoryContent'>
                {repositoriesFound.map(obj => <RepositoryAsOption
                key={obj.id}
                name={obj.name}
                fullName={obj.full_name}
                httpLink={obj.html_url}
                thisRepoId={obj.id}
                setRepositoriesFound={setRepositoriesFound}
                setLrName={setLrName}
                setHasRepoLinked={setHasRepoLinked}
                setFullLrName={setFullLrName}
                setDefaultBranch={setDefaultBranch}
                />)}
            </div>
        </div>
    </div>
    );
}