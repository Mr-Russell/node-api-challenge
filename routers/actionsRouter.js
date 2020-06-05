const router = require("express").Router()

const ActionsDB = require("../data/helpers/actionModel.js")

// get list of all actions
router.get("/", (req, res)=>{
  ActionsDB.get()
    .then(actions => res.status(200).json(actions))
    .catch(err => res.status(500).json("An Error occurred when Fetching Actions List"))
})


// get one specific action with given ID
router.get("/:id", validateID, (req, res)=>{
  ActionsDB.get(req.actionID)
    .then(action => res.status(200).json(action))
    .catch(err => res.status(500).json(`An Error occurred when Fetching Action ID ${req.actionID}`))
})


// put to update specific action with given ID
router.put("/:id", validateID, validateAction, (req, res)=>{
  ActionsDB.update(req.actionID, req.body)
    .then(updated => res.status(200).json(updated))
    .catch(err => res.status(404).json(`An Error occurred when attempting to Update Action ID ${req.actionID}`))
})


// delete specific action with given ID
router.delete("/:id", validateID, (req, res)=>{
  ActionsDB.remove(req.actionID)
    .then(deleted => res.status(200).json(`Action ID ${req.actionID} has been Deleted`))
    .catch(err => res.status(404).json(`An Error occurred when attempting to Delete Action ID ${req.actionID}`))
})




// Middleware

function validateID(req, res, next){
  const actionID = Number(req.params.id)

  ActionsDB.get(actionID)
    .then(action => {
      if (!action) {
        res.status(400).json("No Action with given ID Exists")
      } else {
        req.actionID = actionID
        next()
      }
    })
}


function validateAction(req, res, next){
  if (Object.keys(req.body).length === 0) {
    res.status(400).json("No Action Data Provided")
  } else if (!req.body.description || !req.body.notes) {
    res.status(400).json("Action Description and Notes are REQUIRED!")
  } else {
    next()
  }
}



module.exports = router