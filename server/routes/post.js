import express from 'express';
import { 
    getFeedPosts, 
    getUserPosts, 
    LikePosts, 
    CommentsPosts, 
    deletePost} from '../Controllers/post.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// READ
router.get('/', verifyToken, getFeedPosts );
router.get('/:userId/', verifyToken, getUserPosts);

// POST
router.patch('/:id/like',verifyToken, LikePosts);
router.patch('/:id/comments', verifyToken, CommentsPosts)

// DELETE
router.delete('/:id/delete', verifyToken, deletePost)

export default router;