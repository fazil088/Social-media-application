import React from 'react';
import {
    Box,
    IconButton,
    useMediaQuery
} from '@mui/material';
import {useSelector} from 'react-redux';
import Navbar from '../Navbar';
import FriendList from '../Widgets/FriendList';
import { ArrowBackOutlined } from '@mui/icons-material';

function ChatPage() {
    const id = useSelector((state) => state.user._id);
    const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
    return (
        <Box>
            <Navbar/>
            <Box
            width='100%'
            justifyContent='center'
            display={isNonMobileScreen ? 'flex' : 'block'}
            p="2rem 4%"
            gap='2rem'
            pt='100px'
            >  
                {
                    isNonMobileScreen &&
                    <Box flexBasis='2%'>
                        <IconButton
                        onClick={()=>window.history.back()}
                        >
                            <ArrowBackOutlined sx={{fontSize:'25px'}}/>
                        </IconButton>
                    </Box>
                }
                <Box 
                flexBasis={isNonMobileScreen ? '30%' : undefined}
                >
                        <FriendList userId={id} isChat={true}/>
                </Box>
            </Box>
        </Box>
    )
}

export default ChatPage
