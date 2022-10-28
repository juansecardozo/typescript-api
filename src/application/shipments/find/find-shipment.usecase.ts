import { Nullable } from "../../../domain/shared/types/nullable";
import { Shipment } from "../../../domain/shipments/shipment";
import { ShipmentRepository } from "../../../domain/shipments/shipment.repository";
import { UseCase } from "../../shared/use-case";

export class FindShipmentUseCase extends UseCase {

    constructor(private shipmentRepository: ShipmentRepository) {
        super();
    }

    async execute(id: string): Promise<Nullable<Shipment>> {
        const result = await this.shipmentRepository.find(id);
        return result;
    }
}