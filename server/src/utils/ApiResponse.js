class ApiResponse{
    constructor(statusCode,message,data){
        this.success = statusCode >=200 && statusCode <300
        this.message = message;
        this.statusCode = statusCode;
        this.data = data === undefined ? null : data
    }
}

export default ApiResponse