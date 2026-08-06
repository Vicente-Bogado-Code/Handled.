import '/src/features/home-page/css/homePageMain.css'

export default function HomePage() {
    return (
        <div className="homePageWrapper">
            <aside className="sidebar">
                <div className="profileSection">
                    <div className="avatarCircle">T</div>
                    <p className="username">Test Profile</p>
                </div>
                <nav className="sidebarNav">
                    <a href="#">Projects</a>
                    <a href="#">Settings</a>
                    <a href="#">Logout</a>
                </nav>
            </aside>

            <main className='homePageMainDiv'>
                <div className='projectCreation'>
                    <div className='createNewProjects'>
                        <h2 className="sectionTitle">New project</h2>
                        <div className="newProjectForm">
                            <input type="text" placeholder="Project name? (max 30 characters)" className="inputsOnHome" maxLength={30} />
                            <input type="text" placeholder="What will your project do? (Max 50 characters)" className="inputsOnHome" maxLength={50} />
                            <button type="submit" id="createProjectBtn">Create</button>
                        </div>
                    </div>
                    <div className='optionalInputDiv'>
                        <h2 className="sectionTitle">You can also add:</h2>
                        <div className="newProjectForm">
                            <input type="text" placeholder="Link of GitHub repository?" className="inputsOnHome"/>
                            <input type="text" placeholder="Technologies?" className="inputsOnHome" maxLength={50} />
                        </div>
                    </div>
                </div>
                <div className='showMyProjects'>
                    <h2 className="sectionTitle">Your projects</h2>
                    <div className="projectsGrid">
                        
                    </div>
                </div>
            </main>
        </div>
    );
}