const HttpResponses = require("./httpResponses/httpResponses")
const validateSchemas = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorFormated = error.details.map(( {message,path} )=> ({ message,field: path[0] }));
        return HttpResponses.validationsFail({ errors: errorFormated, res });
    }
    console.log("dasdasdasdasdas")
    next()
}

module.exports = validateSchemas;