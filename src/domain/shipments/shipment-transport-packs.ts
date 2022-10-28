import { NodeWeight } from "./node-weight";
import { ShipmentNodeWeight } from "./shipment-node-weight";

export class ShipmentTransportPacks {
    readonly nodes: ShipmentNodeWeight[];

    constructor(nodes: ShipmentNodeWeight[]) {
        this.nodes = nodes;
    }
}