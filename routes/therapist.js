import express from 'express'
import { handleRegister, handlePlan, getTherapists } from '../controllers/therapistController.js'

import utils from '../controllers/utils.js'

const {authMiddleware, getPayload} = utils

const router = express.Router()


router.post("/register", handleRegister)

router.post("/plan", authMiddleware, getPayload, handlePlan)

router.post("/", getTherapists)

export default router