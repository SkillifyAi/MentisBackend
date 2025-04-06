import express from 'express'
const router = express.Router();

import users from './users.js'
import booking from './bookingRoutes.js'
import therapist from './therapist.js'

router.use(express.json())
router.use('/users', users);
router.use("/booking", booking)
router.use("/therapist", therapist)

export default router;