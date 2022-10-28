import { Db, MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Organization } from "../../../src/domain/organizations/organization";
import { MongoOrganizationRepository } from "../../../src/infrastructure/organizations/mongo-organization.repository";

describe("MongoOrganizationRepository", () => {
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
        const org = new Organization("ee136506-03e6-4e9e-92eb-c83004807ea1", "BOG");
        const orgRepo = new MongoOrganizationRepository(db);

        await orgRepo.create(org);

        const insertedOrg = await orgRepo.find(org.id);
        expect(insertedOrg?.code).toEqual(org.code);
        expect(insertedOrg?.id).toEqual(org.id);
    });

    test("Should return null if it doesn't find data",async () => {
        const orgRepo = new MongoOrganizationRepository(db);

        const find = await orgRepo.find("");
        expect(find).toBeNull();
    });
});