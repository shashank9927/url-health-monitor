// Handle all 404 error

exports.notFound = (req,res,next) => {
        res.status(404).json({
            success: false,
            message: `Route ${req.originalUrl} not found `
        });
};

//handle all other errors

exports.errorHandler = (err,req,res,next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Something went wrong'
    });
};