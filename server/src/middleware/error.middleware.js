import { Prisma } from '../../generated/prisma/client.ts';

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || []; 

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002': 
                statusCode = 409;
                const target = err.meta?.driverAdapterError?.cause?.constraint?.fields[1]|| 'field';
                message = `The ${target} you provided is already in use.`;
                break;

            case 'P2003': 
                statusCode = 400;
                const fieldName = err.meta?.driverAdapterError?.cause?.constraint?.index?.split("_")[1]|| 'unkown relation'
                message = `Invalid reference: The ${fieldName} provided does not exist.`;
                break;

            case 'P2025': 
                statusCode = 404;
                message =`The requested ${err.meta?.modelName} does not exist` || "The requested record was not found.";
                break;

            default:
                message = `unkown Error: ${err.code}`;
        }
    }

    return res.status(statusCode).json({
        success: false,
        message,

        ...(errors.length > 0 && { errors }),
    });
};

export default errorHandler;