class CustomError extends Error{
    constructor(statusCode, message)
    {
          console.log(statusCode, message)  
          super();  
          this.statusCode = statusCode;  
          this.message = message;
    }
}

module.exports = CustomError