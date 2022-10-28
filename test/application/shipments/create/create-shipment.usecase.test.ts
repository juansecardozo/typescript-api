import { CreateShipmentUseCase } from "../../../../src/application/shipments/create/create-shipment.usecase";
import { InvalidArgumentException } from "../../../../src/domain/shared/exceptions/invalid-argument";
import { Nullable } from "../../../../src/domain/shared/types/nullable";
import { NodeWeight } from "../../../../src/domain/shipments/node-weight";
import { Shipment } from "../../../../src/domain/shipments/shipment";
import { ShipmentNodeWeight } from "../../../../src/domain/shipments/shipment-node-weight";
import { ShipmentTransportPacks } from "../../../../src/domain/shipments/shipment-transport-packs";
import { ShipmentRepository } from "../../../../src/domain/shipments/shipment.repository";

describe("Create Shipment Use Case", () => {
    
    class MockShipmentRepository implements ShipmentRepository {
        create(_shipment: Shipment): Promise<Shipment> {
            throw new Error("Method not implemented.");
        }
        find(_referenceId: string): Promise<Nullable<Shipment>> {
            throw new Error("Method not implemented.");
        }
    }

    let mockShipmentRepository: MockShipmentRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        mockShipmentRepository = new MockShipmentRepository();
    });

    test("Should create and return data", async () => {
        const inputData = {
            referenceId: "S00000125",
            organizations: [],
            estimatedTimeArrival: "2020-11-21T00:00:00",
            transportPacks: {
                nodes: [
                    {
                        totalWeight: {
                            weight: 20000,
                            unit: "KILOGRAMS"
                        }
                    }
                ]
            }
        };
        let nodes: ShipmentNodeWeight[] = [];
        inputData.transportPacks.nodes.forEach((item) => {
            let nodeWeight = new NodeWeight(item.totalWeight.weight, item.totalWeight.unit);
            nodes.push(new ShipmentNodeWeight(nodeWeight));
        });
        const expectedShipment = new Shipment(
            inputData.referenceId,
            inputData.organizations,
            new ShipmentTransportPacks(nodes),
            new Date(inputData.estimatedTimeArrival)
        );
        
        jest.spyOn(mockShipmentRepository, "create").mockImplementation(() => Promise.resolve(expectedShipment));

        const createShipmentUseCase = new CreateShipmentUseCase(mockShipmentRepository);
        const result = await createShipmentUseCase.execute(inputData);

        expect(result).toBe(expectedShipment);
    });

    test("Should create and return data", async () => {
        const inputData = { referenceId: "S00000125", organizations: [] };
        const expectedShipment = new Shipment(inputData.referenceId, inputData.organizations);
        
        jest.spyOn(mockShipmentRepository, "create").mockImplementation(() => Promise.resolve(expectedShipment));

        const createShipmentUseCase = new CreateShipmentUseCase(mockShipmentRepository);
        const result = await createShipmentUseCase.execute(inputData);

        expect(result).toBe(expectedShipment);
    });

    test("Should get error when wrong node unit", () => {
        const inputData = {
            referenceId: "S00000125",
            organizations: [],
            transportPacks: {
                nodes: [
                    {
                        totalWeight: {
                            weight: 1,
                            unit: "GRAMS"
                        }
                    }
                ]
            }
        };

        const createShipmentUseCase = new CreateShipmentUseCase(mockShipmentRepository);
        try {
            createShipmentUseCase.execute(inputData);
        } catch (error) {
            expect(error).toEqual(new InvalidArgumentException("The node unit <GRAMS> is not valid"));
        }
    });
});