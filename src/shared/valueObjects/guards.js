class Guards {
    static stringType(vo) {
        if(typeof vo.value  !== 'string') {
            throw new Error(`${vo.value} is not a string`);
        }
    }

    static validateEmail(vo){
        const emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        if(!new RegExp(emailRegex,'gi').test(vo.value)){
            throw new Error(`${vo.field}: The value ${vo.value} is not a valid email`);
        }
    }

    static validatePassword(vo){
        const passwordRegex = '^(?=.*[A-Z])(?=.*\\d).{8,}$'
        if(!new RegExp(passwordRegex,'gi').test(vo.value)){
            throw new Error(`${vo.value}: the password does not meet the conditions`);
        }
    }
}

module.exports = Guards;