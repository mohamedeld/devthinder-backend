const errorForDev = (error,response)=>{
    response.status(error.statusCode).json({
        status:error.status,
        message:error,
        stack : error.stack
    })
}
const errorForProd = (error,response)=>{
    response.status(error.statusCode).json({
        status:error.status,
        message:error.message,
    })
}
const globalError = (error,request,response,next)=>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    if(process.env.NODE_ENV === 'development'){
        errorForDev(error,response);
    }else{
        errorForProd(error,response)
    }
    
};

module.exports = globalError;