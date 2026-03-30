import express from 'express'
import errHandler from './middleware/error.middleware.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import  organizationRouter  from './routes/organization.route.js';
import workspaceRouter from './routes/workspace.route.js'
import authenticate from './middleware/auth.middleware.js';
import folderRouter  from './routes/folder.route.js';
import documentRouter  from './routes/document.route.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()

const allowedOrigins = ['http://localhost:5173']; 

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);  
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS not allowed for this origin'), false);
    }
    return callback(null, true);
  },
  credentials: true, // allow cookies / auth headers
}));
app.use(express.json())
app.use(cookieParser())



app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',authenticate,userRouter);
app.use('/api/v1/organizations',authenticate,organizationRouter);
app.use('/api/v1/workspaces',authenticate,workspaceRouter);
app.use('/api/v1/folders',authenticate,folderRouter);
app.use('/api/v1/documents',authenticate,documentRouter);
app.use(errHandler)

export default app;