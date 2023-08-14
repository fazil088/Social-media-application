import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { toast } from 'react-toastify';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as Yup from 'yup';
import Dropzone from "react-dropzone";
import { setLogin } from "../../State";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FlexBetween from "../../Components/FlexBetween";

const registerSchema = Yup.object().shape({
  firstName: Yup.string().min(3,"It's too short").max(15,"It's too long").required("first name required"),
  lastName: Yup.string().min(3,"It's too short").max(15,"It's too long").required("last name required"),
  email: Yup.string().email("Invalid email").required("email required"),
  password: Yup.string().min(8,"Must be an 8 characters").required("password required"),
  location: Yup.string().required("location required"),
  occupation: Yup.string().required("occupation required"),
  picture: Yup.string().required("picture required"),
});

const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(8,"Must be an 8 characters").required("Password is required"),
})

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
  otp: ""
};

function Form() {
  const [isOTP, setOTP] = useState(false);
  const [formType, setFormType] = useState("login");
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobileScreen = useMediaQuery("(min-width:600px)");

  const isLogin = formType === "login";
  const isRegister = formType === "register";

  const register = async (values, onSubmitProps) => {
   try{
     // this allow us to send form info with image
     const formData = new FormData();
     for (let value in values) {
       formData.append(value, values[value]);
     }
     formData.append("picture", values.picture.name);
 
     const savedUserResponse = await fetch(
       "http://localhost:3001/auth/register",
       {
         method: 'POST',
         body: formData
       }
     );
     
     const savedUser = await savedUserResponse.json();
     if(savedUserResponse.ok){
       if (savedUser) {
         setFormType('login')
         setOTP(true)
       }
       toast.success("Registered successfully")
       onSubmitProps.resetForm();
     }else{
      const {msg} = savedUser;
      toast.error(msg)
     }
   }catch(err){
    toast.error(err.message)
   }
  }

  const login = async (values, onSubmitProps) => {
    try{
      const loggedInResponse = await fetch(
        "http://localhost:3001/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body:JSON.stringify(values)
        },
      );
  
      const loggedUser = await loggedInResponse.json();
  
      if (loggedInResponse.ok) {
        dispatch(
          setLogin({
            user: loggedUser.user,
            token: loggedUser.token
          })
        );
        setOTP(false)
        navigate('/')
        toast.success("Logged successfully")
        onSubmitProps.resetForm();
      }else{
        const {msg} = loggedUser;
        toast.error(msg)
      }
      
    }catch (err){
      console.error("Error:",err.message)
      toast.error(err.message)
    }
  }

  async function handleFormSubmit(values, onSubmitProps) {
    if(isLogin){
        await login(values, onSubmitProps)
    }   
    if(isRegister){
        await register(values,onSubmitProps)
    }
  }

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={ 
        isOTP ? Yup.object().shape({
          otp: Yup.string().required("OTP is required")
        }) : isLogin ? loginSchema : registerSchema
      }
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleSubmit,
        handleChange,
        setFieldValue,
        resetForm,
      }) => (
          
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateAreas="repeat(4,minmax(0,1fr))"
            sx={{
              "& > div": {
                gridColumn: isMobileScreen ? undefined : "span 4",
              },
            }}
            >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  value={values.occupation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) => {
                      setFieldValue("picture", acceptedFiles[0]);
                    }}
                    >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        p="0.5rem"
                        width='100%'
                        sx={{
                          cursor: "pointer",
                        }}
                        >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add picture here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}
            <TextField
              label="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              type="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            {
              isOTP && (
              <TextField
              label="Enter OTP"
              value={values.otp}
              onChange={handleChange}
              onBlur={handleBlur}
              name="otp"
              error={Boolean(touched.otp) && Boolean(errors.otp)}
              helperText={touched.otp && errors.otp}
              sx={{ gridColumn: "span 4" }}
            />
            )
            }
          </Box>
          {/* Buttons */}
          <FlexBetween>
            <Typography
              onClick={() => {
                setFormType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  color: palette.primary.light,
                  cursor :'pointer'
                },
              }} 
              >
              {isLogin ?
                "Don't have an account ?" :
                "Already hava an account ?"}
            </Typography>
              <Button
                type="submit"
                sx={{
                  color:palette.primary.dark,
                  backgroundColor:palette.primary.light,
                  width:"200px",
                  m: " 2rem 0",
                  p: "1rem",
                  "&:hover": {
                    color:palette.primary.main
                  },
                }}
              >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
          </FlexBetween>
        </form>
      )}
    </Formik>
  );
}

export default Form;
