import React, { useState } from 'react';
import { 
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  SendOutlined,
  MoreVertOutlined,
  DeleteOutlined
} from '@mui/icons-material';
import { Box,Divider,Typography,IconButton,useTheme, InputBase, Popover } from '@mui/material';
import FlexBetween from '../../Components/FlexBetween';
import Friend from '../../Components/Friend';
import WidgetWrapper from '../../Components/WidgetWrapper';
import { useDispatch,useSelector } from 'react-redux';
import { setPost } from '../../State';
import { useNavigate } from 'react-router-dom';
import { pink } from '@mui/material/colors';


function PostWidget({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments }) {

    const [isComments, setIsComments] = useState(false);
    const [comment , setComment] = useState("");
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const {palette} = useTheme();
    const main = palette.neutral.main;


    const patchLike = async () => {
      const response = await fetch(
        `https://social-media-application-backend.vercel.app/posts/${postId}/like`,
        {
          method:"PATCH",
          headers:{ Authorization: `Bearer ${token}`,
          "Content-Type":"application/json",
          },
          body:JSON.stringify({userId: loggedInUserId})
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({ post : updatedPost }))
    }

    const patchComment = async () => {
      const response = await fetch(
        `https://social-media-application-backend.vercel.app/posts/${postId}/comments`,
        {
          method:'PATCH',
          headers:{ Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          },
          body:JSON.stringify({userId: loggedInUserId, comment: comment})
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({post:updatedPost}))
      setComment("")
    }

    const deletePost = async () => {
      const response = await fetch(
        `https://social-media-application-backend.vercel.app/posts/${postId}/delete`,
        {
          method:'DELETE',
          headers: { Authorization: `Bearer ${token}`},
          "Content-Type": "application/json"
        }
      );
      if(response.ok){
        const {msg} = await response.json();
        console.log(msg)
        window.location.reload();
      }else{
        const {msg} = await response.json();
        alert(msg)
      }
    }
  
  return (
    <WidgetWrapper m='1rem 0'>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography marginTop='1rem' color={main} >
        {description}
      </Typography>
      {
        picturePath && (
          <img 
            src={`https://social-media-application-backend.vercel.app/assets/${picturePath}`} 
            alt="post" 
            width='100%'
            height='auto'
            style={{borderRadius:'0.1rem', marginTop:'0.75rem'}}
            />
        )
      }

      <Divider sx={{m:'1rem 0'}}/>

      <FlexBetween mt='0.25rem'>
        <FlexBetween gap='0.5rem'>
          <FlexBetween gap='0.1rem'>
            <IconButton onClick={patchLike}>
              {
                isLiked ? (
                  <FavoriteOutlined sx={{color:pink[500]}}/>
                ) : (
                  <FavoriteBorderOutlined/>
                )
              }
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          <FlexBetween gap='0.1rem'>
            <IconButton onClick={()=>setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined/>
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
          <Box>
            <IconButton 
              onClick={(e)=>{setAnchorEl(e.currentTarget)}}
            >
              <MoreVertOutlined/>
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              onClose={()=>{setAnchorEl(null)}}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box>
                {/*  */}
                {
                  postUserId === loggedInUserId && (
                  <FlexBetween gap='0.5rem' p='0.5rem 1.5rem'
                    onClick={()=>{
                      deletePost();
                      setAnchorEl(null);
                    }}
                    sx={{
                      "&:hover":{
                        cursor:'pointer',
                        backgroundColor:palette.neutral.light,
                        color:palette.neutral.dark
                      }
                    }}
                  >
                    <DeleteOutlined/>
                    <Typography> Delete </Typography>
                  </FlexBetween>
                )
                } 
                {/*  */}
                <FlexBetween  gap='0.5rem' p='0.5rem 1.5rem'
                  sx={{"&:hover":{
                    cursor:'pointer',
                    backgroundColor:palette.neutral.light,
                    color:palette.neutral.dark
                  }
                  }}
                >
                  <ShareOutlined/>
                  <Typography>Share</Typography>
                </FlexBetween>
              </Box>
            </Popover>
          </Box>
      </FlexBetween>
      {
        isComments && (
          <Box mt='0.5rem'>
            <FlexBetween gap='1rem' alignItems='center'>
              <InputBase
                fullWidth
                placeholder='Comment...'
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                sx={{
                  padding:'0.5rem 5%',
                  backgroundColor:palette.neutral.light,
                  borderRadius:'2rem',
                  mb:'0.5rem'
                }}
              />
                {
                  comment && (
                    <IconButton 
                      onClick={patchComment}
                      sx={{marginBottom:'0.5rem'}}
                    >
                      <SendOutlined/>
                    </IconButton>
                  )
                }
            </FlexBetween>
            {
              comments.length === 0 ? (
                <Typography textAlign='center' color={palette.neutral.medium} marginTop='0.5rem' >No comments</Typography>
              ) : (
              comments.map((comment, index) => (
                <Box key={`${name}-${index}`}>
                  <Divider/>
                    {
                        <FlexBetween p='0.5rem 0'>
                          <Typography color={palette.neutral.dark}>{comment.comment}</Typography>
                          <Typography onClick={()=>{
                            navigate(`/profile/${comment.userId}`)
                          }}
                            color={palette.neutral.medium} 
                            fontSize='0.6rem' 
                            sx={{
                              cursor:'pointer',
                            }}
                          > @{comment.userName} </Typography>
                        </FlexBetween>
                    }
                </Box>
              ))
              )
            }
            <Divider/>
          </Box>
        ) 
      }
    </WidgetWrapper>
  )
}

export default PostWidget
