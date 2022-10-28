import { NodeWeight } from "../../../domain/shipments/node-weight";
import { Shipment } from "../../../domain/shipments/shipment";
import { ShipmentNodeWeight } from "../../../domain/shipments/shipment-node-weight";
import { ShipmentTransportPacks } from "../../../domain/shipments/shipment-transport-packs";
import { ShipmentRepository } from "../../../domain/shipments/shipment.repository";
import { UseCase } from "../../shared/use-case";

interface TransportPacks {
    nodes: Node[]
}

interface Node {
    totalWeight: Weight
}

interface Weight {
    weight: number,
    unit: string
}

export class CreateShipmentUseCase extends UseCase {
    constructor(private shipmentRepository: ShipmentRepository) {
        super();
    }

    execute(plainData: {
        referenceId: string,
        organizations: string[],
        estimatedTimeArrival?: string,
        transportPacks?: TransportPacks
    }): Promise<Shipment> {
        let nodes: ShipmentNodeWeight[] = [];
        plainData.transportPacks?.nodes.forEach((item) => {
            let nodeWeight = new NodeWeight(item.totalWeight.weight, item.totalWeight.unit);
            nodes.push(new ShipmentNodeWeight(nodeWeight));
        });
        const shipment = new Shipment(
            plainData.referenceId,
            plainData.organizations,
            new ShipmentTransportPacks(nodes),
            plainData.estimatedTimeArrival ? new Date(plainData.estimatedTimeArrival) : undefined
        );
        
        return this.shipmentRepository.create(shipment);
    }
}