import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined
} from '@mui/icons-material';
import { Box,Typography,useTheme,Divider } from '@mui/material';
import UserImage from '../../Components/UserImage';
import FlexBetween from '../../Components/FlexBetween';
import WidgetWrapper from '../../Components/WidgetWrapper';
import {useSelector} from 'react-redux';
import { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const UserWidget = ({userId,picturePath})=>{
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const token = useSelector((state)=> state.token);
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
                onClick={() => navigate(`/profile/${userId}`)}
            >
                <FlexBetween gap='1rem'>
                    <Box>
                        <UserImage image={picturePath}/>
                    </Box>
                    <Box>
                        <Typography
                            variant='h5'
                            fontWeight='500'
                            color={dark} 
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