import React, {useState} from 'react';
import WidgetWrapper from '../../Components/WidgetWrapper';
import UserImage from '../../Components/UserImage';
import FlexBetween from '../../Components/FlexBetween'

import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
} from '@mui/icons-material';
import { 
  Box,
  Typography,
  InputBase,
  IconButton,
  useMediaQuery,
  Divider,
  useTheme,
  Button
} from '@mui/material';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import {useDispatch,useSelector} from 'react-redux';
import { setPosts } from '../../State';


function MyPostWidget({picturePath}) {

  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const dispatch = useDispatch();
  const {palette} = useTheme();
  const {_id} = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");

  const handlePost = async () => {
    try{
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post );
      if(image){
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }

      const response = await fetch(
        `http://localhost:3001/posts/`,
        {
          method: 'POST',
          headers: { Authorization : `Bearer ${token}` },
          body: formData,
        }
      );
      const posts = await response.json();
      if(response.ok){
        dispatch(setPosts({ posts }));
        setImage(null);
        setPost("")
        toast.success("Posted successfully")
      }else{
        const {msg} = posts;
        toast(msg)
      }
    }catch(err){
      console.log(err.message)
      toast.error('Posting failed')
    }
  }

  return (
    <WidgetWrapper  marginTop={isNonMobileScreen ? undefined : '2rem'}>
        
        <FlexBetween gap='1rem'>
          <UserImage profilePicture={picturePath}/>
          <InputBase
            fullWidth
            placeholder="What's on your mind..."
            onChange={(e)=> setPost(e.target.value)}
            value={post}
           sx={{
            backgroundColor:palette.neutral.light,
            borderRadius:'2rem',
            p:"1rem 2rem"
           }}
          />
        </FlexBetween>
        { isImage && 
          <Box
            border={`1px solid ${medium}`}
            borderRadius='5px'
            mt='1rem'
            p='1rem'
          >
            <Dropzone
              acceptedFiles=".jpg, .jpeg, .png"
              multiple={false}
              onDrop={(acceptedFiles)=> {
                setImage(acceptedFiles[0])
              }}
            >
              {({getRootProps,getInputProps})=> (
                <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`1px dashed ${palette.neutral.light}`}
                  padding='0.5rem'
                  width={image ? '90%' : '100%'}
                  sx={{
                    "&:hover":{cursor:'pointer'}
                  }}
                >
                  <input {...getInputProps()}/>
                  {!image ? (
                    <p>Add image here...</p> 
                  ) : (
                    <FlexBetween>
                      <Typography >{image.name}</Typography>
                      <EditOutlined/>
                    </FlexBetween>
                  )
                  }
                </Box>
                {image && (
                  <IconButton
                    onClick={()=>setImage(null)}
                  >
                    <DeleteOutlined/>
                  </IconButton>
                )}
              </FlexBetween>
              )}
            </Dropzone>
          </Box>
        }

      <Divider sx={{margin:'1.5rem 0'}}/>

      <FlexBetween>
        <FlexBetween gap='0.25rem' onClick={()=>setIsImage(!isImage)}>
          <ImageOutlined sx={{color:mediumMain}}/>
          <Typography
            color={mediumMain}
            sx={{"&:hover":{cursor:'pointer',color:medium}}}
          >
            Select Image
          </Typography>
        </FlexBetween>
        {/* {
          isNonMobileScreen ? (
            <>
            <FlexBetween gap='0.25rem'>
              <GifBoxOutlined sx={{color:mediumMain}}/>
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap='0.25rem'>
              <AttachFileOutlined sx={{color:mediumMain}}/>
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap='0.25rem'>
              <MicOutlined sx={{color:mediumMain}}/>
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
            </>
          ) : (
            <FlexBetween gap='0.25rem'>
              <MoreHorizOutlined sx={{color:mediumMain}}/>
            </FlexBetween>
          )
        } */}

        <Button
          disabled={!post}
          onClick={()=>{
            handlePost();
            setIsImage(!isImage);
          }}
          sx={{
            p:'0.5rem 2rem',
            borderRadius:'3rem',
            backgroundColor:palette.primary.main,
            color:palette.primary.light,
            "&:hover":{
              backgroundColor:palette.primary.dark,
              cursor:'pointer'
            }
          }}
        >
          Post
        </Button>

      </FlexBetween>
    </WidgetWrapper>
  )
}

export default MyPostWidget
