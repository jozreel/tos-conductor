class AppError extends Error {
     private code: number;
    
    constructor(code=1000, errname="ApplicationError", ...params:any) {
       
        super(...params);
        this.name =  errname;
        this.code = code;
        this.message = `Error: ${this.code} A ${this.name} error occured: ${this.message}`
    }

}

class ApplicationError extends AppError{
    constructor(...params: any) {
        
        super(1000, 'RecoedNotFoundError', ...params);
      
    }
}

class FieldLengthError extends AppError{
    constructor(...params: any) {
        
        super(1001, 'FieldLengthError', ...params);
      
    }
}

class FieldValueError extends AppError{
    constructor(...params: any) {
        
        super(1002, 'FieldValueError', ...params);
      
    }
}

class DatabaseOperationError extends AppError{
    constructor(...params: any) {
        
        super(1003, 'DatabaseOperationError', ...params);
      
    }
}

class DatabaseConnectionError extends AppError{
    constructor(...params: any) {
        
        super(1004, 'DatabaseConnectionError', ...params);
      
    }
}

class DuplicateRecordError extends AppError{
    constructor(...params: any) {
        
        super(1005, 'DuplocateRecordError', ...params);
      
    }
}

class RecordNotFoundError extends AppError{
    constructor(...params: any) {
        
        super(1006, 'RecoedNotFoundError', ...params);
      
    }
}

class AccessDeniedError extends AppError{
    constructor(...params: any) {
        
        super(1007, 'AccessDeniedError', ...params);
      
    }
}

class TokenExpiredError extends AppError {
    constructor(...params: any) {
        super(1008, "TokenExpiredError", ...params);
    }
}




export {AppError,
    ApplicationError,
      FieldLengthError,
      FieldValueError, 
      DatabaseOperationError, 
      DatabaseConnectionError,
      DuplicateRecordError,
      RecordNotFoundError,
      AccessDeniedError,
      TokenExpiredError
    }