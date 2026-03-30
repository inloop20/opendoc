import  ApiError  from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'

const authenticate = (req,res,next)=>{
   const authHeader = req.cookies?.refreshToken;
   if(!authHeader){
    throw new ApiError('refresh token missing', 401);
   }
   const token = authHeader;
   if(!token) throw new ApiError("invalid token missing", 401);

   try {
    const user = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
    if (!user) throw new ApiError("invalid refresh token", 401);
    req.user = user;
    next();
   } catch (error) {
    throw new ApiError(`something went wrong with auth token`);
   }
}



export default authenticate