import React,{useEffect, useState} from 'react';
import {Box, IconButton, useMediaQuery} from '@mui/material';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import UserWidget from '../Widgets/UserWidget';
import FriendList from '../Widgets/FriendList';
import MyPostWidget from '../Widgets/MyPostWidget';
import Navbar from '../Navbar';
import PostsWidget from '../Widgets/PostsWidget';
import { ArrowBackOutlined } from '@mui/icons-material';


function ProfilePage() {
  const [user, setUser] = useState(null)
  const {userId} = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");

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
        padding='2rem 4%'
        display={isNonMobileScreen ? "flex" : "block"}
        justifyContent='center'
        gap='2rem'
        pt='100px'
      >
        {
          isNonMobileScreen && 
          <Box flexBasis='2%'>
            <IconButton
            onClick={()=> window.history.back()}
            >
              <ArrowBackOutlined sx={{fontSize:'25px'}}/>
            </IconButton>
          </Box>
        }
        <Box flexBasis={isNonMobileScreen ? '27%' : undefined}
        sx={isNonMobileScreen &&{
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
          <UserWidget userId={userId} picturePath={user.picturePath} isProfile />
          <Box m='2rem 0'/>
          <FriendList userId={userId}/>
        </Box>
        
        <Box flexBasis={isNonMobileScreen ? '43%' : undefined} 
          mt={isNonMobileScreen ? undefined : '2rem'}
        >
          <Box 
            sx={isNonMobileScreen &&{
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
            <MyPostWidget picturePath={user.picturePath}/>
            <PostsWidget userId={userId} isProfile/>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfilePage;
