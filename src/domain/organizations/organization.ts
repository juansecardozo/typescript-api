import { validate } from 'uuid';
import { InvalidArgumentException } from '../shared/exceptions/invalid-argument';

export class Organization {
    readonly id: string;
    readonly code: string;

    constructor(id: string, code: string) {
        this.ensureIsValidId(id);
        this.ensureIsValidCode(code);
        this.id = id;
        this.code = code;
    }

    private ensureIsValidId(id: string) {
        if (!validate(id)) {
            throw new InvalidArgumentException(`The organization id <${id}> is not valid`);
        }
    }

    private ensureIsValidCode(code: string) {
        let regex = new RegExp("^[A-Z]{3}$");
        if (!regex.test(code)) {
            throw new InvalidArgumentException(`The organization code <${code}> is not valid`);
        }
    }

    toJson(): any {
        return {
            id: this.id,
            code: this.code,
        }
    }
}