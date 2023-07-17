import React from 'react'
import { Box, useMediaQuery } from '@mui/material'
import Navbar from '../Navbar'
import { useSelector } from 'react-redux';
import UserWidget from '../Widgets/UserWidget';
import MyPostWidget from '../Widgets/MyPostWidget';
import PostsWidget from '../Widgets/PostsWidget';
import FriendList from '../Widgets/FriendList';

function HomePage() {
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const {_id, picturePath} = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width='100%'
        padding='2rem 4%'
        display={isNonMobileScreen ? "flex" : "block"}
        justifyContent='space-between'
        gap='0.5rem'
        pt='100px'
      >
        <Box flexBasis={isNonMobileScreen ? '26%' : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        
        <Box flexBasis={isNonMobileScreen ? '42%' : undefined} >
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
            <MyPostWidget picturePath={picturePath}/>
            <PostsWidget userId={_id} />
          </Box>
        </Box>

        { isNonMobileScreen && 
          <Box flexBasis='26%'
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
            <FriendList userId={_id}/>
          </Box>
        }
      </Box>
    </Box>
  )
}

export default HomePage
