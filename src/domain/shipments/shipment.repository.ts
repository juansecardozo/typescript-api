import { Nullable } from "../shared/types/nullable";
import { Shipment } from "./shipment";

export interface ShipmentRepository {
    create(shipment: Shipment): Promise<Shipment>;
    find(referenceId: string): Promise<Nullable<Shipment>>;
}