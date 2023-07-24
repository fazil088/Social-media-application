import User from "../models/User.js";
import Post from "../models/Post.js";


// READ
export const getUser = async (req, res) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(err){
        res.status(404).json({msg:err.message});
    }
}

export const getUserFriends = async (req, res) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(200).json(formattedFriends);
    }catch(err){
        res.status(404).json({msg:err.message});
    }
}

export const searchUser = async (req, res) =>{
    try{
        const { userName } = req.params;

        const users = await User.find({
            $or: [
                {firstName: {$regex: `^${userName}`, $options:'i'}},
                {lastName: {$regex:`^${userName}`,$options:'i'}}
            ]
        })

        if(users.length === 0) {
            res.status(404).json({msg:"No user found"})
        }else{
            res.status(200).json(users)
        }
    }catch(err){
        res.status(404).json({msg:"No user found"})
    }
}
// UPDATE

export const addRemoveFriend = async (req, res) => {
    try{
        const { id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();
        
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        )

        res.status(200).json(formattedFriends);
            
    } catch(err){
        res.status(404).json({msg:err.message});
    }
}

export const changeProfile = async (req, res) => {
    try{
        const { userId, picturePath } = req.body;

        const user = await User.findById(userId);

        if(!user) return res.status(404).json({msg:'User not found'});

        user.picturePath = picturePath;

        await user.save();

        const posts = await Post.find({userId:userId});

        for(const post of posts){
            post.userPicturePath = picturePath;
            await post.save();
        }
        
        res.status(201).json({ user, posts, msg:'Successfully updated' });
    }catch(err){
        res.status(409).json({msg:'Failed to change'})
    }
}