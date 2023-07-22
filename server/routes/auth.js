import express from 'express'
import {login, verifyOTP} from '../Controllers/auth.js';

const router = express.Router();

router.post("/login", login);
router.post('/verify-otp',verifyOTP)

export default router
