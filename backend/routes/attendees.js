const express = require('express')
const router = express.Router()
const attendeeController = require('../controllers/attendeeController')

router.get('/', attendeeController.getAllAttendees)
router.get('/:id', attendeeController.getAttendeeById)
router.post('/', attendeeController.createAttendee)
router.put('/:id', attendeeController.updateAttendee)
router.delete('/:id', attendeeController.deleteAttendee)

module.exports = router