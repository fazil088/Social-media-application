import {PersonAddOutlined,PersonRemoveOutlined} from '@mui/icons-material';
import { Box,Typography,IconButton,useTheme } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import { setFriends } from '../State';

const Friend = ({ friendId, name, subtitle, userPicturePath, addFriend = true }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {_id} = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends)
    
    const {palette} = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const isFriend = friends.find((friend) => friend._id === friendId);

    const patchFriend = async () => {
        const response = await fetch(
            `https://social-media-application-backend.vercel.app/user/${_id}/${friendId}`,
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

    if(_id === friendId){
        addFriend = false;
    }

    return (
        <FlexBetween>
            <FlexBetween gap='1rem'>
                <UserImage image={userPicturePath} size='55px'/>
                <Box
                    onClick={()=>{
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
            { addFriend &&
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
