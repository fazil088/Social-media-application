import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search,
  DarkMode,
  LightMode,
  Message,
  HomeOutlined,
  Help,
  Menu,
  Close
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout } from '../../State';
import { useNavigate } from 'react-router-dom';
import FlexBetween from '../../Components/FlexBetween';
import Friend from '../../Components/Friend';


function Navbar() {
  const [isMobileMenuToggled, setIsMobilMenuToggled] = useState(false);
  const [userName, setUserName] = useState('');
  const [searchedUser, setSearchedUser] = useState([]);
  const [errMsg, setErrMsg] = useState('')
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const nonMobileScreens = useMediaQuery("(min-width:950px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  // const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  

  useEffect(()=>{

    const searchUser = async  () => {
      try{
        const response = await fetch(
          `http://localhost:3001/user/${userName}/search`,
          {
            method: 'GET',
            headers:{
              Authorization : `Bearer ${token}`
            }
          }
        );
  
        const data = await response.json();
        if(response.ok){
          setSearchedUser(data);
        }else{
          setErrMsg(data.msg)
        }
        
      }catch(err){
        console.error(err.message)
      }
    }

    if(userName.length >= 1){
      searchUser();
    }else{
      setSearchedUser([]);
    }

  },[userName]) //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FlexBetween 
      padding="1rem 5%"  
      backgroundColor={alt} 
      width='100%' 
      height='80px' 
      position='fixed' 
      zIndex='999'
    >
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 1.5rem, 2.25rem)"
          color={theme.palette.primary.main}
          sx={{cursor:'default'}}
        >
         Connect
        </Typography>
        {
          nonMobileScreens && (
            <FlexBetween gap='0.5rem' flexDirection='column' position='relative'>
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="9px"
                padding="0.3rem 1.5rem" >
                <InputBase
                  sx={{width:'200px'}} 
                  placeholder='Search...' 
                  value={userName} 
                  onChange={(e)=>setUserName(e.target.value)} 
                />
                <Search/>
              </FlexBetween>

              {
                searchedUser.length === 0 && userName.length >= 1 && errMsg && 
                  <Box
                    position='absolute'
                    backgroundColor={neutralLight}
                    mt='3rem'
                    borderRadius='5px'
                  > 
                    <Typography p='0.5rem 5rem'>
                      No results found 
                    </Typography>
                  </Box>
                
              }
              
              {
              searchedUser.length > 0 && 
              <Box
                position='absolute'
                backgroundColor={neutralLight}
                mt='3.5rem'
                borderRadius='5px'
              >
               {
                searchedUser.map((user, index)=> (
                    <Box key={index} p='0.5rem 2rem 0.5rem 1rem' >
                      <Friend
                        friendId={user._id} 
                        name={`${user.firstName} ${user.lastName}`}
                        userPicturePath={user.picturePath}
                        addFriend={false}
                      />
                    </Box>
                ))
                }
              </Box>
              
              }
              
            </FlexBetween>
          )
        }
          
        
      </FlexBetween>
      {/* DESKTOP NAV */}
      {
        nonMobileScreens ? (
          <FlexBetween gap="2rem">
            <IconButton onClick={()=>{
              navigate('/')
            }
            }>
              <HomeOutlined sx={{fontSize:'25px'}} />
            </IconButton>
            <IconButton onClick={()=>dispatch(setMode())}>
              {
                theme.palette.mode === "dark" ? (
                  <DarkMode sx={{fontSize:"25px"}}/>
                ) : (
                  <LightMode sx={{fontSize:"25px",color:dark}}/>
                )
              }
            </IconButton>
            <IconButton
             onClick={()=>{
              navigate('/chat')
             }}
            >
              <Message sx={{ fontSize: "25px" }} />
            </IconButton>
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant='standard'>
              <Select
              defaultValue={fullName}
                sx={{
                  textAlign:'center',
                  backgroundColor: neutralLight,
                  width: "160px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem"
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor:neutralLight
                  }
                }}
                input={<InputBase/>} 
                >
                <MenuItem value={fullName} disabled>{fullName}</MenuItem>
                <MenuItem onClick={()=>dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton onClick={()=>setIsMobilMenuToggled(!isMobileMenuToggled)}>
            <Menu sx={{fontSize:"25px"}}/>
          </IconButton>
        )
      }
      {/* MOBILE NAV */}
      {
        !nonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}
            zIndex="10">
            
            {/* CLOSE ICON */}

            <FlexBetween p='1rem'>
              <Typography variant='h4' color={theme.palette.primary.main}>Connect</Typography>
              <IconButton
                onClick={() => setIsMobilMenuToggled(!isMobileMenuToggled) }>
                <Close/>
              </IconButton>
            </FlexBetween>
            {/* MENU ITEMS */}

            <FlexBetween gap='0.5rem' flexDirection='column' position='relative'>
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="9px"
                padding="0.1rem 1.5rem" >
                <InputBase
                  sx={{width:'200px'}} 
                  placeholder='Search...' 
                  value={userName} 
                  onChange={(e)=>setUserName(e.target.value)} />
                  <Search/>
              </FlexBetween>

              {
                searchedUser.length === 0 && userName.length >= 1 && errMsg && 
                  <Box
                    position='absolute'
                    backgroundColor={neutralLight}
                    mt='3rem'
                    borderRadius='5px'
                    zIndex='1'
                  > 
                    <Typography p='0.5rem 5rem'>
                      No results found 
                    </Typography>
                  </Box>
                
              }
              
              {
              searchedUser.length > 0 && 
              <Box
                position='absolute'
                backgroundColor={neutralLight}
                mt='3.5rem'
                borderRadius='5px'
                zIndex='1'
              >
               {
                searchedUser.map((user, index)=> (
                    <Box key={index} p='0.5rem 4rem 0.5rem 1rem' >
                      <Friend
                        friendId={user._id} 
                        name={`${user.firstName} ${user.lastName}`}
                        userPicturePath={user.picturePath}
                        addFriend={false}
                      />
                    </Box>
                ))
                }
              </Box>
              }
            </FlexBetween>
            <FlexBetween
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap="3rem"
              mt='1rem'
            >
              <IconButton 
                onClick={()=>{ navigate('/') }}
              >
                  <HomeOutlined sx={{fontSize:'25px'}} /> 
              </IconButton>
              <IconButton onClick={()=>dispatch(setMode())}>
              {
                theme.palette.mode === "dark" ? (
                  <DarkMode sx={{fontSize:"25px"}}/>
                ) : (
                  <LightMode sx={{fontSize:"25px",color:dark}}/>
                )
              }
            </IconButton>
            <IconButton
            onClick={()=>{
              navigate('/chat')
            }}
            >
              <Message sx={{ fontSize: "25px" }} />
            </IconButton>
            <Help sx={{ fontSize: "25px" }} />
            <MenuItem onClick={() => dispatch(setLogout())}
              sx={{
                fontSize: '16px',
                fontWeight:"bolder"
              }}>
              Log Out
            </MenuItem>
            </FlexBetween>
          </Box>
        )
      }
    </FlexBetween>
  )
}

export default Navbar
