import { InvalidArgumentException } from "../shared/exceptions/invalid-argument";

export class NodeWeight {
    readonly weight: number;
    readonly unit: string;

    constructor(weight: number, unit: string) {
        this.ensureIsValidWeight(weight);
        this.ensureIsValidUnit(unit);
        this.weight = weight;
        this.unit = unit;
    }

    private ensureIsValidWeight(weight: number) {
        if (isNaN(weight)) {
            throw new InvalidArgumentException(`The node weight <${weight}> is not valid`);
        }
    }

    private ensureIsValidUnit(unit: string) {
        let units = ["KILOGRAMS", "POUNDS", "OUNCES"];
        if (!units.includes(unit)) {
            throw new InvalidArgumentException(`The node unit <${unit}> is not valid`);
        }
    }
}