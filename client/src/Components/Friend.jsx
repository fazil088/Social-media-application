import {ChatBubbleOutlineOutlined, PersonAddOutlined,PersonRemoveOutlined} from '@mui/icons-material';
import { Box,Typography,IconButton,useTheme } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import { setFriends } from '../State';

const Friend = ({ friendId, name, subtitle, userPicturePath,isChat=false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {_id} = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends) || [];
    
    const {palette} = useTheme(); 
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const isFriend = friends.find((friend) => friend._id === friendId);

    const patchFriend = async () => {
        const response = await fetch(
            `http://localhost:3001/user/${_id}/${friendId}`,
            {
                method:"PATCH",
                headers:{ Authorization: `Bearer ${token}`,
                "Content-Type":"application/json"
            }
            }
        );
        const data = await response.json();
        dispatch(setFriends({friends: data}));
    }

    return (
        <FlexBetween gap='2rem'>
            <FlexBetween gap='1rem'>
                <UserImage profilePicture={userPicturePath} size='55px'/>
                <Box
                    onClick={()=>{
                        isChat ? navigate(`/chat-window/${friendId}`) :
                        navigate(`/profile/${friendId}`)
                        navigate(0)
                    }}  
                >
                    <Typography 
                        color={main}
                        variant='h5'
                        sx={{
                            "&:hover":{
                                cursor:'pointer',
                                color:palette.primary.light
                            }
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography
                        color={medium}
                        fontSize='0.75rem'
                    >
                        {subtitle}
                    </Typography>
                </Box>
            </FlexBetween>
            {
            isChat ? 
            <IconButton>
                <ChatBubbleOutlineOutlined/>
            </IconButton> :
                _id !== friendId &&
                <IconButton
                onClick={patchFriend}
                sx={{backgroundColor:primaryLight,p:'0.5rem'}}
                >
                {
                isFriend ? (
                    <PersonRemoveOutlined sx={{color:primaryDark}}/>
                    ) : (
                    <PersonAddOutlined sx={{color:primaryDark}}/>
                    )
                }
                </IconButton> 
            }
        </FlexBetween>
    )
}

export default Friend;
