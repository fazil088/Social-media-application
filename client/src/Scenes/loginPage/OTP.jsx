import React,{useState} from 'react';
import {
  TextField,
  Box,
  Button
} from '@mui/material';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ErrorMsg from '../../Components/ErrorMsg'

function OTP() {
  const [otp, setOtp] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const user = useSelector(state=>state.user)

  const handleSubmit = async ()=>{
    try{
      const response = await fetch(
        `http://localhost:3001/auth/verify-otp`,
        {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({otp: otp, email:user.email})
        }
      );

      const returnRespose = await response.json();
      if(response.ok){
        navigate('/')
      }else{
        const {msg} = returnRespose;
        setErrMsg(msg)
      }

    }catch(err){
      console.log(err.message)
      setErrMsg(err.message)
    }
  }
 
  return (
    <>
    {
      errMsg && <ErrorMsg message={errMsg} severity='error'/>
    }
      <Box
        width='100%' height='80vh'
        display='flex' justifyContent='center' 
        alignItems='center' flexDirection='column'
        gap='2rem'
      >
          <TextField
            label="Enter OTP"
            name='otp'
            onChange={(e)=>setOtp(e.target.value)}
            sx={{width:'350px'}}
          />
          <Button
            onClick={handleSubmit}
            type='submit'
            sx={{p:'0.5rem 2rem'}}
          >VERIFY</Button>
      </Box>
    </>
  )
}

export default OTP
