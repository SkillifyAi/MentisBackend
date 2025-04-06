import express from 'express'

const router = express.Router()

import { handleLogin, handleSignUp, handleGoogleLogin, handleGetData, handleChangeRole, handleLogout} from '../controllers/users.js';
import { handleQuestion } from '../controllers/chatgpt.js';

import utils from '../controllers/utils.js';

const {authMiddleware, getPayload} = utils

router.post("/login", handleLogin)

router.post("/sign-up", handleSignUp)

router.post("/google-login", handleGoogleLogin)

router.get("/profile", authMiddleware, getPayload, handleGetData)

router.post("/change-role", authMiddleware, getPayload, handleChangeRole)

router.post("/question", authMiddleware, getPayload, handleQuestion)

router.post("/logout", handleLogout)

export default router