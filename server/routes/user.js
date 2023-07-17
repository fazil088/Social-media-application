import express from 'express';
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    searchUser
} from '../Controllers/user.js';
import verifyToken  from '../middleware/auth.js';

const router = express.Router();

// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:userName/search", verifyToken, searchUser )

// UPDATE
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);



export default router;