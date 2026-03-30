import fgaClient from '../config/openfga.js'
import ApiError from '../utils/ApiError.js'
const checkPermission = (relation, objectType, paramName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const objectId = req.params[paramName];
      const { allowed } = await fgaClient.check({
        user: `user:${userId}`,
        relation: relation,
        object: `${objectType}:${objectId}`,
      });
      

      if (!allowed) {
        throw new ApiError('Unauthorized access',403);
      }

      next();
    } catch (error) {
      next(error)
    }
  };
};

export  { checkPermission };