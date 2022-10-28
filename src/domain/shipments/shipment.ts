import { ShipmentTransportPacks } from "./shipment-transport-packs";

export class Shipment {
    readonly referenceId: string;
    readonly estimatedTimeArrival?: Date;
    readonly organizations: string[];
    readonly transportPacks?: ShipmentTransportPacks;

    constructor(
        referenceId: string,
        organizations: string[],
        transportPacks?: ShipmentTransportPacks,
        estimatedTimeArrival?: Date
    ) {
        this.referenceId = referenceId;
        this.estimatedTimeArrival = estimatedTimeArrival;
        this.organizations = organizations;
        this.transportPacks = transportPacks;
    }

    toJson(): any {
        return {
            referenceId: this.referenceId,
            estimatedTimeArrival: this.estimatedTimeArrival,
            organizations: this.organizations,
            transportPacks: this.transportPacks
        }
    }
}