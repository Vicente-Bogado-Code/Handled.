import { setCurrentProject } from "../api/setCurrentProject";
import { useState, useEffect } from 'react';

export default function CurrentProjectComp({ project_id }) {
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    setCurrentProject(project_id).then(response => {
      if (response.Status === "Current project set") {
        setProjectName(response.projectName);
      }
    });
  }, [project_id]);

  return (
    <h1>{projectName}</h1>
  );
}