import React,{useState} from 'react';
import {
  Box,
  TextField,
  Button,
  useMediaQuery,
  Typography,
  useTheme
 } from '@mui/material';
 import {toast} from 'react-toastify';
 import {setLogin} from '../../State'
 import {useNavigate} from 'react-router-dom';
 import {useDispatch} from 'react-redux'
 import FlexBetween from '../../Components/FlexBetween';

function RegisterForm() {
  const isMobileScreen = useMediaQuery("(min-width:600px)");

  const [isOTP, setIsOTP] = useState(false)
  const [formType, setFormType] = useState("login")
  const isLogin = formType === "login";
  const isRegister = formType === "register";

  const {palette} = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Input values
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [picture, setPicture] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleRegister =async () => {
    try{
      const formData = new FormData();
      formData.append("firstName",firstname)
      formData.append("lastName",lastname)
      formData.append("picture",picture)
      formData.append("picturePath",picture.name)
      formData.append("email",email)
      formData.append("password",password)
      formData.append("location",location)
      formData.append("occupation",occupation)

      const response = await fetch(
        `http://localhost:3001/auth/register`,
        {
          method: 'POST',
          body: formData
        }
      )
      const data = await response.json();
      if(response.ok){
        if(data){
          setIsOTP(true)
          setFormType("login")
        }
        setEmail('')
        setPassword('')
        toast.success('Registered successfully')
      }else{
        const {msg} = data;
        toast.error(msg)
      }
    }catch(err){
      console.log(err.message)
      toast.error("Registration Failed")
    }
  }

  const handleLogin = async () => {
    try{
      const response = await fetch(
        `http://localhost:3001/auth/login`,
        {
          method: 'POST',
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email,password,otp})
        }
      )
      const data = await response.json();
      if(response.ok){
        dispatch(
          setLogin({
            user:data.user,
            token: data.token
          })
        );
        setIsOTP(false)
        navigate('/')
        toast.success('Logged successfully')
      }else{
        const {msg} = data;
        toast.error(msg)
      }
    }catch(err){
      console.log(err.message)
      toast.error("Login Failed")
    }
  }
  return (
    <form>
      <Box
      display='grid'
      gap="30px"
      sx={{
        "& > div":{
          gridColumn:isMobileScreen ? undefined : "span 4"
        }
      }}
      > 
        {
          isRegister && (
            <>
              <TextField
              sx={{ gridColumn:'span 2' }}
              name='firstname'
              value={firstname}
              label='First Name'
              onChange={(e)=>{
                setFirstName(e.target.value)
              }}
              required="First Name is required"
              />
              <TextField
              sx={{ gridColumn:'span 2' }}
              name='lastName'
              value={lastname}
              label='Last Name'
              onChange={(e)=>{
                setLastName(e.target.value)
              }}
              required="Last Name is required"
              />
              <TextField
              sx={{ gridColumn:'span 4' }}
              name='location'
              value={location}
              label='Location'
              onChange={(e)=>{
                setLocation(e.target.value)
              }}
              required="Location is required"
              />
              <TextField
              sx={{ gridColumn:'span 4' }}
              name='occupation'
              value={occupation}
              label='Occupation'
              onChange={(e)=>{
                setOccupation(e.target.value)
              }}
              required="Occupation is required"
              />
              <Box
              sx={{ gridColumn:"span 4" }}
              > 
                <input type="file" placeholder='Profile Picture'
                  onChange={(e)=>{
                    setPicture(e.target.files[0])
                  }}
                  required
                />
              </Box>
            </>
          )
        }
        <TextField
        sx={{ gridColumn:'span 4' }}
        name='email'
        value={email}
        label='Email'
        onChange={(e)=>{
          setEmail(e.target.value)
        }}
        required="Email Name is required"
        />
        <TextField
        sx={{ gridColumn:'span 4' }}
        name='password'
        value={password}
        label='Password'
        type='password'
        onChange={(e)=>{
          setPassword(e.target.value)
        }}
        required="Password Name is required"
        />
        {
          isOTP && (
            <TextField
            sx={{ gridColumn:'span 4' }}
            name='otp'
            value={otp}
            label='Enter OTP'
            onChange={(e)=>{
              setOtp(e.target.value)
            }}
            required="OTP is required"
            />
          )
        }
        <FlexBetween
        gridColumn="span 4"
        >
          <Typography
            onClick={()=>{
              setFormType(isLogin ? "register" : "login")
            }}
            sx={{
              textDecoration:'underline',
              color:palette.primary.main,
              "&:hover":{
                cursor:'pointer'
              }
            }}
            
          >
            Already have an account ?
          </Typography>
          {
            isLogin ? (
              <Button onClick={handleLogin}>Login</Button>
            ) : (
              <Button onClick={handleRegister}>Register</Button>
            )
          }
        </FlexBetween>
      </Box>
    </form>
  )
}

export default RegisterForm
