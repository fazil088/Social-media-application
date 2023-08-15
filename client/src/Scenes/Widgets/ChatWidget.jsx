import { Box, IconButton, InputBase, Typography, useMediaQuery, useTheme } from '@mui/material'
import { ArrowBackOutlined, SendOutlined } from '@mui/icons-material';
import React, { useState, useEffect } from 'react'
import WidgetWrapper from '../../Components/WidgetWrapper'
import Navbar from '../Navbar';
import FriendList from './FriendList';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FlexBetween from '../../Components/FlexBetween';
import UserImage from '../../Components/UserImage';

function ChatWidget() {
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)")
  const {palette} = useTheme();
  const id = useSelector((state) => state.user._id)
  const {userId} = useParams();
  const token = useSelector((state) => state.token)

  const getUser = async () => {
    const response = await fetch(
      `http://localhost:3001/user/${userId}`,
      {
        method: 'GET',
        headers:{ Authorization: `Bearer ${token}`}
      }
    );
    const data = await response.json();
    setUser(data);
  }

  useEffect(()=>{
    getUser();
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  if(!user) return null;

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
        <WidgetWrapper
          height={isNonMobileScreen ? '82vh' : '85vh'}
          flexBasis={isNonMobileScreen ? '50%' : undefined}
          display='flex'
          flexDirection='column'
        >
          {/* go back action in mobile screen */}
          <Box flexBasis='5%'>
            <IconButton
            onClick={()=>{
              window.history.back();
            }}
            >
              <ArrowBackOutlined sx={{fontSize:'25px'}}/>
            </IconButton>
          </Box>
          <Box
          flexBasis='90%'
          sx={{
          display:'flex',
          flexDirection:'column',
          overflowY:'scroll',
          overflowX:'hidden',
          width:'100%',
          height:'82vh',
          "::-webkit-scrollbar":{
            display:'none'
          }
          }}
          >
          <Box
          flexBasis='15%' 
          display='flex'
          alignItems='center'
          flexDirection='column'
          gap='0.5rem'
          >
            <UserImage profilePicture={user.picturePath}/>
            <Typography>
              {
                user.firstName + user.lastName
              }
            </Typography>
          </Box>

          {/* Messages shows */}

          <Box
          flexBasis='75%'
          >

          </Box>
          </Box>

          {/* Message text area */}

          <Box 
          flexBasis='5%'
          marginTop='1rem'
          >
            <FlexBetween gap='0.5rem'>
              <InputBase 
              fullWidth
              placeholder='Type message'
              sx={{
                backgroundColor:palette.neutral.light,
                borderRadius:'2rem',
                p:"0.8rem 2rem"
               }}
               onChange={(e)=>setText(e.target.value)}
              />
              {
                text && (
                  <IconButton>
                    <SendOutlined sx={{fontSize:'25px'}}/>
                  </IconButton>
                )
              }
            </FlexBetween>
          </Box>
        </WidgetWrapper>
      </Box>
    </Box>
  )
}

export default ChatWidget
