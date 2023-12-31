import React, { useEffect } from 'react'
import {useSelector,useDispatch} from 'react-redux';
import WidgetWrapper from '../../Components/WidgetWrapper';
import { Box,Typography,useTheme } from '@mui/material';
import Friend from '../../Components/Friend';
import { setFriends } from '../../State';
import ChatList from '../../Components/ChatList';

function FriendList({userId,isChat}) {
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends) || [];
    const dispatch = useDispatch();
    const { palette } = useTheme();

    const getFriendList = async () => {
        const response = await fetch(
            `http://localhost:3001/user/${userId}/friends`,
            {
                method:'GET',
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        const data = await response.json();
        dispatch(setFriends({friends : data}))
    }

    useEffect(()=>{
        getFriendList();
    },[]) //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
        <Typography color={palette.neutral.dark} variant='h5' fontWeight='500' sx={{mb:"0.5rem"}} >
            {
                isChat ? "Chat List" : "Friend List"
            }
        </Typography>
        <Box
            display="flex" 
            flexDirection="column"
            gap="1rem"
        >
            {
                friends && (
                friends.map((friend,index) => (
                        <Friend
                        key={index}
                        friendId={friend._id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        subtitle={friend.occupation}
                        userPicturePath={friend.picturePath}
                        isChat={isChat}
                        /> 
                   
                ))
                )
            }
        </Box>
    </WidgetWrapper>
  )
}

export default FriendList;
