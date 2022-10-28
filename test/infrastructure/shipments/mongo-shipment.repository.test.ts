import { Db, MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { NodeWeight } from "../../../src/domain/shipments/node-weight";
import { Shipment } from "../../../src/domain/shipments/shipment";
import { ShipmentNodeWeight } from "../../../src/domain/shipments/shipment-node-weight";
import { ShipmentTransportPacks } from "../../../src/domain/shipments/shipment-transport-packs";
import { MongoShipmentRepository } from "../../../src/infrastructure/shipments/mongo-shipment.repository";

describe("MongoShipmentRepository", () => {
    let mongoServer: MongoMemoryServer;
    let connection: MongoClient;
    let db: Db;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        connection = await MongoClient.connect(mongoServer.getUri());
        db = connection.db(mongoServer.instanceInfo!.dbName);
    });

    afterAll(async () => {
        await connection.close();
        await mongoServer.stop();
    });

    test("Should save and find", async () => {
        let nodes: ShipmentNodeWeight[] = [ new ShipmentNodeWeight(new NodeWeight(1500, "POUNDS")) ];
        const shipment = new Shipment("S0000515", [], new ShipmentTransportPacks(nodes));
        const shipmentRepository = new MongoShipmentRepository(db);

        await shipmentRepository.create(shipment);

        const insertedShipment = await shipmentRepository.find(shipment.referenceId);
        expect(insertedShipment?.referenceId).toEqual(shipment.referenceId);
        expect(insertedShipment?.organizations).toEqual(shipment.organizations);
    });

    test("Should save and find", async () => {
        const shipment = new Shipment("S0000515", [], new ShipmentTransportPacks([]));
        const shipmentRepository = new MongoShipmentRepository(db);

        await shipmentRepository.create(shipment);

        const insertedShipment = await shipmentRepository.find(shipment.referenceId);
        expect(insertedShipment?.referenceId).toEqual(shipment.referenceId);
        expect(insertedShipment?.organizations).toEqual(shipment.organizations);
    });

    test("Should return null if it doesn't find data", async () => {
        const orgRepo = new MongoShipmentRepository(db);

        const find = await orgRepo.find("");
        expect(find).toBeNull();
    });
});