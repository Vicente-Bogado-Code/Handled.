# Handled

Handled is a full-stack project tracker built from scratch, React frontend, Flask backend, PostgreSQL database. Started as a way to manage and track ongoing personal projects and notes in one place.

At its core, Handled is a note-taking system built around a multi-window interface, allowing several notes to be open and worked on side by side. Each note uses a full rich text editor powered by TipTap, supporting proper formatting throughout. A key feature is a note-to-note connection system, a feature that links one note directly to another. This turns a flat collection of notes into structured connection trees, keeping related information organized and easy to navigate rather than scattered across separate documents. Other than that, a folder system organizes notes further as their number grows, plus "mark as favorite" to keep important notes.

Beyond note taking, Handled integrates with GitHub Apps to track commit and push history for connected repositories, authenticated through JWT-based GitHub App credentials. Projects can be set to public or private visibility, that allows you to share your project safely with people. The application includes a full authentication system, keeping every piece of data safe.

Handled started as a personal tool meant purely for learning and solving my personal problem, with no expectation of long-term hosting or maintenance. As development progressed, it grew into a more complete application than initially intended, at which point questions of database hosting and long term deployment stability appeared. Resolving those problems would have required much more time for a project whose purpose was personal rather than long-term operation. Since the core learning goals had already been met through the features already built, continuing to solve deployment problems for their own sake was not considered a worthwhile use of time, and development concluded at that point.

The code will still be uploaded on this repository.
