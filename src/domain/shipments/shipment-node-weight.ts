import { NodeWeight } from "./node-weight";

export class ShipmentNodeWeight {
    readonly totalWeight: NodeWeight;

    constructor(totalWeight: NodeWeight) {
        this.totalWeight = totalWeight;
    }
}