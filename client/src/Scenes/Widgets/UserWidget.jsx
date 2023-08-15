import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
    CameraAltOutlined
} from '@mui/icons-material';
import { Box,Typography,useTheme,Divider, Button, IconButton } from '@mui/material';
import UserImage from '../../Components/UserImage';
import FlexBetween from '../../Components/FlexBetween';
import WidgetWrapper from '../../Components/WidgetWrapper';
import {useSelector,useDispatch} from 'react-redux';
import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { setProfileImage, setPost } from '../../State';
import { toast } from 'react-toastify';

const UserWidget = ({userId,picturePath,isProfile=false})=>{
    const [user, setUser] = useState(null);
    const [changeImg, setChangeImg] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state)=> state.token);
    const loggedUser = useSelector((state) => state.user._id)
    const {palette} = useTheme();
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    const getUser = async () => {
        const response = await fetch(
            `http://localhost:3001/user/${userId}`,
            {
                method:"GET",
                headers: {Authorization : `Bearer ${token}`}
            }
        );
        const data = await response.json();
        setUser(data);
    }

    const handleImageChange = async () => {
        try{
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("picture", changeImg);
            formData.append("picturePath", changeImg.name)

            const response = await fetch(
                `http://localhost:3001/user/profile_change`,
                {
                    method:"POST",
                    headers:{
                        Authorization: `Bearer ${token}`,
                    },
                    body:formData
                },
            );
            const responseData = await response.json();
            if(response.ok){
                const {msg} = responseData;
                toast.success(msg)
                const { user } = responseData;
                dispatch(setProfileImage({ picturePath: user.picturePath}));
                const { posts } = responseData;
                dispatch(setPost({post:posts}));
                navigate('/')
            }else{
                const {msg} = responseData;
                toast.error(msg);
            }
        }catch(err){
            console.log(err.message);
            toast.error(err.message);
        }
    }

    useEffect(()=>{
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if(!user){
        return null;
    }

    const {
        firstName,
        lastName,
        occupation,
        location,
        profileViews,
        impressions,
        friends
    } = user;

    return (
        <WidgetWrapper>
            {/* First Row */}
            <FlexBetween 
                gap="0.5rem"
                pb="1.1rem"
            >
                <FlexBetween gap='1rem'>
                    <Box position='relative' width='60px' height='60px'>
                        <UserImage profilePicture={picturePath}/>
                        {
                            userId === loggedUser && isProfile &&
                            <Box 
                            position='absolute'
                            width='25px'
                            height='25px'
                            bottom='-5px'
                            right='-8px'
                            overflow='hidden'
                            textAlign='center'
                            borderRadius='50%'
                            fontSize='0.9rem'
                        >
                            <input type="file" onChange={(e)=>setChangeImg(e.target.files[0])} 
                                style={{
                                    position:'absolute',
                                    transform: 'scale(2)',
                                    opacity:'0',
                                }}
                                
                            />
                            <IconButton 
                            sx={{
                                cursor:'pointer',
                                p:'0.1rem'
                            }} 
                            >
                                <CameraAltOutlined/>
                            </IconButton>
                        </Box>
                        }
                    </Box>
                    <Box>
                        <Typography
                            variant='h5'
                            fontWeight='500'
                            color={dark} 
                            onClick={() => navigate(`/profile/${userId}`)}
                            sx={{
                                "&:hover":{
                                    cursor:'pointer',
                                    color:palette.primary.light
                                }
                            }}
                        >
                            { firstName } { lastName }
                        </Typography>
                        <Typography color={medium}>{ friends.length } friends</Typography>
                    </Box>
                </FlexBetween>
                <ManageAccountsOutlined sx={{fontSize:'25px'}}/>
            </FlexBetween>
            {
                changeImg && (
                    <Button variant='outlined'
                        sx={{
                            width:'100%',
                            mb:'1rem'
                        }}
                        onClick={()=>{
                            setChangeImg(null)
                            handleImageChange()
                        }}
                    >update</Button>
                )
            }
            <Divider/>

            {/* SECOND ROW */}
                <Box p="1rem 0">
                    <Box display='flex' alignItems='center' gap='1rem' mb='0.5rem'>
                        <LocationOnOutlined sx={{color:main}} fontSize='large'/>
                        <Typography color={medium}>{location}</Typography>
                    </Box>
                    <Box display='flex' alignItems='center' gap='1rem' mb='0.5rem'>
                        <WorkOutlineOutlined sx={{color:main}} fontSize='large'/>
                        <Typography color={medium}>{occupation}</Typography>
                    </Box>
                </Box>
                <Divider/>

            {/* THIRD ROW */}
                <Box p="1rem 0" >
                    <FlexBetween mb='0.5rem'>
                        <Typography color={medium}>Who's viewed your profile</Typography>
                        <Typography color={medium} fontWeight='500'>{profileViews}</Typography>
                    </FlexBetween>
                    <FlexBetween>
                        <Typography color={medium}>Impressions of your post</Typography>
                        <Typography color={medium} fontWeight='500'>{impressions}</Typography>
                    </FlexBetween>
                </Box>
                <Divider/>

            {/* FOURTH ROW */}
                <Box p='1rem 0'>
                    <Typography fontSize='1rem' fontWeight='500' color={main} mb='0.5rem'>
                        Social Profile
                    </Typography>
                    <FlexBetween mb='0.5rem' gap='1rem'>
                        <FlexBetween gap='1rem'>
                            <img src="../assets/twittern.png" alt="twitter" width='30px' height='30px' />
                            <Box>
                                <Typography color={main} fontWeight='500'>
                                    Twittter
                                </Typography>
                                <Typography color={medium}>
                                    Social Network
                                </Typography>
                            </Box>
                        </FlexBetween>
                        <EditOutlined color={main}/>
                    </FlexBetween>
                    <FlexBetween gap='1rem'>
                        <FlexBetween gap='1rem'>
                            <img src="../assets/linkedin.png" alt="linkedin" width='30px' height='30px' />
                            <Box>
                                <Typography color={main} fontWeight='500'>
                                    Linkedin
                                </Typography>
                                <Typography color={medium}>
                                    Network Platform
                                </Typography>
                            </Box>
                        </FlexBetween>
                        <EditOutlined color={main}/>
                    </FlexBetween>
                </Box>
        </WidgetWrapper>
    )
}

export default UserWidget;