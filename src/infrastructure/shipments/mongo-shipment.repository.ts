import { Db } from "mongodb";
import { Nullable } from "../../domain/shared/types/nullable";
import { NodeWeight } from "../../domain/shipments/node-weight";
import { Shipment } from "../../domain/shipments/shipment";
import { ShipmentNodeWeight } from "../../domain/shipments/shipment-node-weight";
import { ShipmentTransportPacks } from "../../domain/shipments/shipment-transport-packs";
import { ShipmentRepository } from "../../domain/shipments/shipment.repository";
import { MongoRepository } from "../shared/mongo-repository";

interface ShipmentDocument {
    referenceId: string,
    estimatedTimeArrival?: Date,
    organizations: string[],
    transportPacks?: TransportPacks,
}

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

export class MongoShipmentRepository extends MongoRepository implements ShipmentRepository {
    constructor(db: Db) {
        super(db, "shipments");
    }

    async create(shipment: Shipment): Promise<Shipment> {
        await this._collection.insertOne(shipment.toJson());
        return shipment;
    }

    async find(referenceId: string): Promise<Nullable<Shipment>> {
        const document = await this._collection.findOne<ShipmentDocument>({referenceId: referenceId});
        
        if(document) {
            let nodes: ShipmentNodeWeight[] = [];
            
            document.transportPacks?.nodes.forEach((item) => {
                let nodeWeight = new NodeWeight(item.totalWeight.weight, item.totalWeight.unit);
                nodes.push(new ShipmentNodeWeight(nodeWeight));
            });

            return new Shipment(
                document.referenceId,
                document.organizations,
                new ShipmentTransportPacks(nodes),
                document.estimatedTimeArrival
            );
        }

        return null;
    }
}