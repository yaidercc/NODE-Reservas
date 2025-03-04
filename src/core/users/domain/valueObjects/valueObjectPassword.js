import {Guards} from "./guards";
import {valueObjectString} from "../../../../shared/valueObjects/valueObjectString";

export class valueObjectPassword extends valueObjectString {
    constructor(field, value, nullable = false) {
        super(field, value);

        if(nullable) return;

        Guards.validateEmail(this);
    }
}