import React, { useState } from 'react';
import {
    Box,
    useMediaQuery
} from '@mui/material';
import {useSelector} from 'react-redux';
import Navbar from '../Navbar';
import ChatWidget from '../Widgets/ChatWidget';
import { useNavigate } from 'react-router-dom';
import FriendList from '../Widgets/FriendList';

function ChatPage() {
    const id = useSelector((state) => state.user._id);
    const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
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
