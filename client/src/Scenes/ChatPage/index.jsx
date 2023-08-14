import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Typography,
    useMediaQuery
} from '@mui/material';
import {
    ChatBubbleOutlineOutlined
} from '@mui/icons-material';
import FriendList from '../Widgets/FriendList';
import {useSelector} from 'react-redux';
import Navbar from '../Navbar';
import ChatWidget from '../Widgets/ChatWidget';
import { useNavigate } from 'react-router-dom';

function ChatPage() {
    const id = useSelector((state) => state.user._id);
    const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
    const isMobieScreen = useMediaQuery("(max-width:600px)")
    const navigate = useNavigate();
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
                {isNonMobileScreen && <Box flexBasis={isNonMobileScreen ? '50%' : undefined}>
                    <ChatWidget/>
                </Box>}
                <Box 
                flexBasis={isNonMobileScreen ? '30%' : undefined}
                sx={ isNonMobileScreen && {
                    overflowY:'scroll',
                    overflowX:'hidden',
                    display:'flex',
                    flexDirection:'column',
                    height:'82vh',
                    "::-webkit-scrollbar":{
                        display:'none'
                    }
                }}
                >
                    <FriendList userId={id} />
                </Box>
            </Box>
        </Box>
    )
}

export default ChatPage
