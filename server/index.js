import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet, {crossOriginResourcePolicy} from 'helmet';
import multer from 'multer';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import verifyToken from './middleware/auth.js';
import {register} from './Controllers/auth.js';
import {createPost} from './Controllers/post.js';
import {changeProfile} from './Controllers/user.js';


// MIDDILEWARE CONFIGURATIONS

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use("/Profile-Pictures", express.static(path.join(__dirname, "public/Profile-Pictures")));
app.use("/Post-Pictures", express.static(path.join(__dirname, "public/Post-Pictures")));
app.use(cors());

// FILE STORAGE
const postPictures = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/Post-Pictures")
    },
    filename: function (req, file, cb) {
        const postName = new Date().getTime() + file.originalname;
        req.postName = postName;
        cb(null, postName)
    }
})

const profilePictures = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/Profile-Pictures")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const postPicturesUpload = multer({storage:postPictures});
const profilePicturesUpload = multer({storage:profilePictures});


// ROUTES WITH FILES
app.post("/auth/register", profilePicturesUpload.single("picture"), register);
app.post("/posts", postPicturesUpload.single("picture"), verifyToken, createPost);
app.post("/user/profile_change", profilePicturesUpload.single("picture"), verifyToken, changeProfile)
  
// ROUTES
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server connected to ${PORT}`)
    });
}).catch((error) => {
    console.log(` ERROR IS :${error}`)
})


export default app;