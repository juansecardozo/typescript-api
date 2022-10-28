import { FindShipmentUseCase } from "../../../../src/application/shipments/find/find-shipment.usecase";
import { Nullable } from "../../../../src/domain/shared/types/nullable";
import { Shipment } from "../../../../src/domain/shipments/shipment";
import { ShipmentRepository } from "../../../../src/domain/shipments/shipment.repository";

describe("Find Shipment Use Case", () => {
    
    class MockShipmentRepository implements ShipmentRepository {
        create(_shipment: Shipment): Promise<Shipment> {
            throw new Error("Method not implemented.");
        }
        find(_referenceId: string): Promise<Nullable<Shipment>> {
            throw new Error("Method not implemented.");
        }
    }

    let mockShipmentRepository: MockShipmentRepository;
    const inputData = { referenceId: "S00000125", organizations: []};
    const expectedShipment = new Shipment(inputData.referenceId, inputData.organizations);

    beforeEach(() => {
        jest.clearAllMocks();
        mockShipmentRepository = new MockShipmentRepository();
    });

    test("Should find and return data", async () => {
        jest.spyOn(mockShipmentRepository, "find").mockImplementation(() => Promise.resolve(expectedShipment));

        const saveOrgUseCase = new FindShipmentUseCase(mockShipmentRepository);
        const result = await saveOrgUseCase.execute(inputData.referenceId);

        expect(result).toBe(expectedShipment);
    });
});