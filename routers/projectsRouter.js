const router = require("express").Router()

const ProjectsDB = require("../data/helpers/projectModel.js")
const ActionsDB = require("../data/helpers/actionModel.js")

// get list of all projects
router.get("/", (req, res)=>{
  ProjectsDB.get()
    .then(projects => res.status(200).json(projects))
    .catch(err => res.status(500).json("An Error occurred when Fetching Projects List"))
})


// get a single project by id
router.get("/:id", validateID, (req, res)=>{
  ProjectsDB.get(req.projectID)
    .then(project => res.status(200).json(project))
    .catch(err => res.status(500).json(`An Error occurred when Fetching Project ID ${req.projectID}`))
})


// get list of actions for a project with given project ID
router.get("/:id/actions", validateID, (req, res)=>{
  ProjectsDB.getProjectActions(req.projectID)
    .then(actions => res.status(200).json(actions))
    .catch(err => res.status(500).json("An Error occurred when Fetching Actions List"))
})


// post new project. Requires "name" and "description"
router.post("/", validateProject, (req, res)=>{
  ProjectsDB.insert(req.body)
    .then(newProject => res.status(201).json(newProject))
    .catch(err => res.status(500).json("An Error occurred when attempting to Create New Project"))
})


// post new action for a specific project with the given Project ID. Requires "project_id", "description", and "notes"
router.post("/:id/actions", validateID, validateAction, (req, res)=>{
  const newAction = {...req.body, project_id: req.projectID}
  ActionsDB.insert(newAction)
    .then(newAction => res.status(201).json(newAction))
    .catch(err => res.status(500).json("An Error occurred when attempting to Create New Action"))
})


// put to update existing projects by ID. Requires project ID and data to update as parameters
router.put("/:id", validateID, validateProject, (req, res)=>{
  ProjectsDB.update(req.projectID, req.body)
    .then(updated => res.status(200).json(updated))
    .catch(err => res.status(404).json(`An Error occurred when attempting to Update Project ID ${req.projectID}`))
})


// delete project with given ID
router.delete("/:id", validateID, (req, res)=>{
  ProjectsDB.remove(req.projectID)
    .then(deleted => res.status(200).json(`Project ID ${req.projectID} has been Deleted`))
    .catch(err => res.status(404).json(`An Error occurred when attempting to Delete Project ID ${req.projectID}`))
})



//middleware

function validateID(req, res, next){
  const projectID = Number(req.params.id)

  ProjectsDB.get(projectID)
    .then(project => {
      if (!project) {
        res.status(400).json("No Project with given ID Exists")
      } else {
        req.projectID = projectID
        next()
      }
    })
}


function validateProject(req, res, next){
  if (Object.keys(req.body).length === 0) {
    res.status(400).json("No Project Data Provided")
  } else if (!req.body.name || !req.body.description) {
    res.status(400).json("Project Name and Description are REQUIRED!")
  } else {
    next()
  }
}


function validateAction(req, res, next){
  if (Object.keys(req.body).length === 0) {
    res.status(400).json("No Action Data Provided")
  } else if (!req.body.description || !req.body.notes) {
    res.status(400).json("Action Name and Notes are REQUIRED!")
  } else {
    next()
  }
}



module.exports = router