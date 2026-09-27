export function notFound(req,res){res.status(404).json({message:'Resource not found'});}
export function errorHandler(err,req,res,next){ console.error(err); const status=err.name==='ValidationError'?400:err.code===11000?409:err.status||500; res.status(status).json({message:status===500?'Something went wrong on the server':err.message}); }
