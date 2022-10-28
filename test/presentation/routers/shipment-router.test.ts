import request from "supertest";
import { CreateShipmentUseCase } from "../../../src/application/shipments/create/create-shipment.usecase";
import { FindShipmentUseCase } from "../../../src/application/shipments/find/find-shipment.usecase";
import { InvalidArgumentException } from "../../../src/domain/shared/exceptions/invalid-argument";
import { Nullable } from "../../../src/domain/shared/types/nullable";
import { Shipment } from "../../../src/domain/shipments/shipment";
import { ShipmentRepository } from "../../../src/domain/shipments/shipment.repository";
import ShipmentsRouter from "../../../src/presentation/routers/shipment.router";
import server from "../../../src/server";

class MockShipmentRepository implements ShipmentRepository {
    create(_shipment: Shipment): Promise<Shipment> {
        throw new Error("Method not implemented.");
    }
    find(_referenceId: string): Promise<Nullable<Shipment>> {
        throw new Error("Method not implemented.");
    }
}

describe("Shipment router", () => {
    let mockFindShipmentUseCase: FindShipmentUseCase;
    let mockCreateShipmentUseCase: CreateShipmentUseCase;
    const inputData = { referenceId: "S00000125", organizations: []};
    const expectedShipment = new Shipment(inputData.referenceId, inputData.organizations);

    beforeAll(() => {
        mockFindShipmentUseCase = new FindShipmentUseCase(new MockShipmentRepository);
        mockCreateShipmentUseCase = new CreateShipmentUseCase(new MockShipmentRepository);
        server.use("/shipment", ShipmentsRouter(mockFindShipmentUseCase, mockCreateShipmentUseCase));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /shipment/:id", () => {
        
        test("Should return 200 with data", async () => {
        
            jest.spyOn(mockFindShipmentUseCase, "execute").mockImplementation(() => Promise.resolve(expectedShipment));

            const response = await request(server).get(`/shipment/${inputData.referenceId}`);

            expect(response.status).toBe(200);
            expect(mockFindShipmentUseCase.execute).toBeCalledTimes(1);
            expect(response.body).toStrictEqual(inputData);
        });

        test("Should return 404 when no data is present", async () => {

            jest.spyOn(mockFindShipmentUseCase, "execute").mockImplementation(() => Promise.resolve(null));

            const response = await request(server).get(`/shipment/${inputData.referenceId}`);

            expect(response.status).toBe(404);
            expect(response.body).toStrictEqual({});
        });

        test("Should return 500 on use case error", async () => {

            jest.spyOn(mockFindShipmentUseCase, "execute").mockImplementation(() => Promise.reject(Error()));

            const response = await request(server).get(`/shipment/${inputData.referenceId}`);

            expect(response.status).toBe(500);
            expect(response.body).toStrictEqual({ message: "Error fetching data" });
        });

    });

    describe("POST /shipment", () => {
        
        test("Should return 200 with data", async () => {
        
            jest.spyOn(mockCreateShipmentUseCase, "execute").mockImplementation(() => Promise.resolve(expectedShipment));

            const response = await request(server).post(`/shipment`);

            expect(response.status).toBe(201);
            expect(mockCreateShipmentUseCase.execute).toBeCalledTimes(1);
            expect(response.body).toStrictEqual(inputData);
        });

        test("Should return 400 on validation error", async () => {

            jest.spyOn(mockCreateShipmentUseCase, "execute").mockImplementation(() => Promise.reject(new InvalidArgumentException()));

            const response = await request(server).post(`/shipment`);

            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual({ message: "" });
        });

        test("Should return 500 on use case error", async () => {

            jest.spyOn(mockCreateShipmentUseCase, "execute").mockImplementation(() => Promise.reject(Error()));

            const response = await request(server).post(`/shipment`);

            expect(response.status).toBe(500);
            expect(response.body).toStrictEqual({ message: "Error saving data" });
        });

    });
});