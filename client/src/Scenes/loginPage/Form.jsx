import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import { setLogin } from "../../State";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FlexBetween from "../../Components/FlexBetween";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("first name required"),
  lastName: yup.string().required("last name required"),
  email: yup.string().email("Invalid email").required("email required"),
  password: yup.string().required("password required"),
  location: yup.string().required("location required"),
  occupation: yup.string().required("occupation required"),
  picture: yup.string().required("picture required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("email required"),
  password: yup.string().required("password required"),
});

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
};

function Form() {
  const [errorMsg, setErrorMsg] = useState("");
  const [formType, setFormType] = useState("login");
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobileScreen = useMediaQuery("(min-width:600px)");
  const isLogin = formType === "login";
  const isRegister = formType === "register";

  const register = async (values, onSubmitProps) => {
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
    onSubmitProps.resetForm();

    if (savedUser) {
      setFormType('login')
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
        }
      )
  
      const loggedUser = await loggedInResponse.json();
      
  
      if (loggedInResponse.ok) {
        dispatch(
          setLogin({
            user: loggedUser.user,
            token: loggedUser.token
          })
        );
        navigate("/")
        onSubmitProps.resetForm();
      }else{
        const {msg} = loggedUser;
        setErrorMsg(msg);
      }
      
    }catch (err){
      console.error("Error:",err.message)
      setErrorMsg(err.message)
    }
  }

  async function handleFormSubmit(values, onSubmitProps) {
    if (isLogin) await login(values, onSubmitProps)
    if(isRegister) await register(values,onSubmitProps)
  }

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
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
                  p="1rem"
                  
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
                        border={`1px dashed ${palette.primary.medium}`}
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
            {
              errorMsg && (
                <Box width='100%' sx={{gridColumn:'span 4'}}>
                  <Typography textAlign='center' color='red'>{errorMsg}</Typography>
                </Box>
                )
              }
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
