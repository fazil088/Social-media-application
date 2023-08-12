import { Box } from "@mui/material";

const UserImage = ({profilePicture,size = "60px"}) =>{
    return(
        <Box width={size} height={size}>
            <img src={`http://localhost:3001/Profile-Pictures/${ profilePicture }`} alt="Profile"
            style={{objectFit:'cover',borderRadius:"50%"}} 
            width={size}
            height={size}/>
        </Box>
    )
}

export default UserImage;