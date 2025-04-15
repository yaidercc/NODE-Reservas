const Responses = require("./Responses");
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
    static badRequest({message= "Bad request", errors,res,data}= {}) {
        return res.status(HttpStatusCode.BadRequest).json({
            message,
            errors,
            data
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

    static unauthorized({message = 'Unauthorized', errors, res} = {}) {
        return res.status(HttpStatusCode.Unauthorized).json({
            message,
            errors
        })
    }
    static forbidden({message = 'Forbidden', errors, res} = {}) {
        return res.status(HttpStatusCode.Forbidden).json({
            message,
            errors
        })
    }
}

module.exports = HttpResponses;