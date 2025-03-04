class Responses{
    #message;
    #statusCode;
    #data;
    #errors;

    constructor({message = "Success", statusCode= 200, data ={}, errors= null}) {
        this.#message = message;
        this.#statusCode = statusCode;
        this.#data = data;
        this.#errors = errors;
    }

    get statusCode(){
        return this.#statusCode;
    }

    get data(){
        return this.#data;
    }

    get errors(){
        return this.#errors;
    }

    set statusCode(statusCode){
        this.#statusCode = statusCode;
    }

    set data(data){
        this.#data = data;
    }

    set errors(errors){
        this.#errors = errors;
    }
}

module.exports = Responses;