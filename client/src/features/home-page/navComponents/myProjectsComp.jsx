import { Plus, Search, User } from "lucide-react";
import ProjectCreationForm from "../projectCreationForm";
import ProjectCard from "../project_cards";

export default function MyProjects({
    isCreating,
    setIsCreating,

    projectName,
    setProjectName,
    description,
    setDescription,
    choiceRepo,
    setChoiceRepo,
    gh_repo,
    setGh_repo,
    advanceSettings,
    setAdvanceSettings,
    choiceMainNote,
    setChoiceMainNote,
    choiceREADMEnote,
    setChoiceREADMEnote,
    choiceCommitHistory,
    setChoiceCommitHistory,
    choicePublic,
    setChoicePublic,

    handleCreate,

    username,

    searchTerm,
    setSearchTerm,

    showActive,
    setShowActive,
    showDone,
    setShowDone,

    projectsFound,
    activeProjects,
    markedAsDone,

    handleStatus,
    handleProjectClick,
    handleChangeRepo,
    handleDeleteProject,
    handleChangeDesc,
    handleChangeName
}){
    return (
        <>
            <div className="projectCreation">
                {isCreating ? (
                    <ProjectCreationForm
                        setIsCreating={setIsCreating}
                        projectName={projectName}
                        setProjectName={setProjectName}
                        description={description}
                        setDescription={setDescription}
                        choiceRepo={choiceRepo}
                        setChoiceRepo={setChoiceRepo}
                        gh_repo={gh_repo}
                        setGh_repo={setGh_repo}
                        advanceSettings={advanceSettings}
                        setAdvanceSettings={setAdvanceSettings}
                        choiceMainNote={choiceMainNote}
                        setChoiceMainNote={setChoiceMainNote}
                        choiceREADMEnote={choiceREADMEnote}
                        setChoiceREADMEnote={setChoiceREADMEnote}
                        choiceCommitHistory={choiceCommitHistory}
                        setChoiceCommitHistory={setChoiceCommitHistory}
                        choicePublic={choicePublic}
                        setChoicePublic={setChoicePublic}
                        handleCreate={handleCreate}
                    />
                ) : (
                    <div className="userInfoOnHomePageDiv">
                        <div className="avatarNNameDiv">
                            <div className="avatarCircleOnHomePage">
                                <User size={40} />
                            </div>

                            <p className="usernamenHomePage">
                                {username}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="showMyActiveProjects">
                <div className="navProjectsDiv">

                    <button
                        className="startCreatingProjctBtn"
                        onClick={() => setIsCreating(true)}
                    >
                        New
                        <Plus size={16} />
                    </button>

                    <div className="searchInputDiv">
                        <Search className="searchIcon" size={16} />

                        <input
                            type="text"
                            className="searchProjectInput"
                            placeholder="Project name?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="showBtn">
                        <button
                            className={
                                showActive
                                    ? "filterByBtnActive"
                                    : "filterByBtn"
                            }
                            onClick={() => setShowActive(!showActive)}
                        >
                            Show active
                        </button>

                        <button
                            className={
                                showDone
                                    ? "filterByBtnActive"
                                    : "filterByBtn"
                            }
                            onClick={() => setShowDone(!showDone)}
                        >
                            Show done
                        </button>
                    </div>
                </div>

                <h2 className="sectionTitle">Projects</h2>

                {searchTerm !== "" && !projectsFound ? (
                    <h2 className="noProjectFoundLabel">
                        No projects found searching "{searchTerm}"
                    </h2>
                ) : null}

                <div className="projectsGrid">
                    {showActive &&
                        activeProjects.map((p) => (
                            <ProjectCard
                                key={p.project_id}
                                {...p}
                                id={p.project_id}
                                onClickHandle={handleStatus}
                                onClickProject={handleProjectClick}
                                changeRepo={handleChangeRepo}
                                deleteProject={handleDeleteProject}
                                changeProjectDesc={handleChangeDesc}
                                changeProjectName={handleChangeName}
                            />
                        ))}

                    {showDone &&
                        markedAsDone.map((p) => (
                            <ProjectCard
                                key={p.project_id}
                                {...p}
                                id={p.project_id}
                                onClickHandle={handleStatus}
                                onClickProject={handleProjectClick}
                                changeRepo={handleChangeRepo}
                                deleteProject={handleDeleteProject}
                                changeProjectDesc={handleChangeDesc}
                                changeProjectName={handleChangeName}
                            />
                        ))}
                </div>
            </div>
        </>
    );
};
