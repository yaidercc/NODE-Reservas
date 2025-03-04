const Responses = require("./responses");
const { HttpStatusCode } = require("axios");

class HttpResponses {
    static ok({message="Success", data,res}={}) {
        return res.status(HttpStatusCode.Ok).json({
            message,
            data
        })
    }
    static created({message= "Resource(s) created",data,res}= {}) {
        return res.status(HttpStatusCode.Created).json({
            message,
            data
        })
    }
    static badRequest({message= "Bad request", errors,res}= {}) {
        return res.status(HttpStatusCode.BadRequest).json({
            message,
            errors
        })
    }
    static notFound({message= "Not Found",res}= {}) {
        return res.status(HttpStatusCode.BadRequest).json({
            message
        })
    }
    static validationsFail({message = 'Validations fail', errors, res} = {}) {
        return res.status(HttpStatusCode.BadRequest).json({
            message,
            errors
        })
    }
    static internalServerError({message = 'Unexpected error occurred', errors, res} = {}) {
        return res.status(HttpStatusCode.InternalServerError).json({
            message,
            errors
        })
    }
}

module.exports = HttpResponses;