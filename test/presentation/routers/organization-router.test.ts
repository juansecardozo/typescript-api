import request from "supertest";
import { CreateOrganizationUseCase } from "../../../src/application/organizations/create/create-organization.usecase";
import { FindOrganizationUseCase } from "../../../src/application/organizations/find/find-organization.usecase";
import { Organization } from "../../../src/domain/organizations/organization";
import { OrganizationRepository } from "../../../src/domain/organizations/organization.repository";
import { InvalidArgumentException } from "../../../src/domain/shared/exceptions/invalid-argument";
import { Nullable } from "../../../src/domain/shared/types/nullable";
import OrganizationsRouter from "../../../src/presentation/routers/organization.router";
import server from "../../../src/server";

class MockOrgRepository implements OrganizationRepository {
    create(_organization: Organization): Promise<Organization> {
        throw new Error("Method not implemented.");
    }
    find(_id: string): Promise<Nullable<Organization>> {
        throw new Error("Method not implemented.");
    }
}

describe("Organization router", () => {
    let mockFindOrganizationUseCase: FindOrganizationUseCase;
    let mockCreateOrganizationUseCase: CreateOrganizationUseCase;
    const expectedData = { id: "ee136506-03e6-4e9e-92eb-c83004807ea1", code: "BOG"};
    const expectedOrg = new Organization(expectedData.id, expectedData.code);

    beforeAll(() => {
        mockFindOrganizationUseCase = new FindOrganizationUseCase(new MockOrgRepository);
        mockCreateOrganizationUseCase = new CreateOrganizationUseCase(new MockOrgRepository);
        server.use("/organization", OrganizationsRouter(mockFindOrganizationUseCase, mockCreateOrganizationUseCase));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /organization/:id", () => {
        
        test("Should return 200 with data", async () => {
        
            jest.spyOn(mockFindOrganizationUseCase, "execute").mockImplementation(() => Promise.resolve(expectedOrg));

            const response = await request(server).get(`/organization/${expectedData.id}`);

            expect(response.status).toBe(200);
            expect(mockFindOrganizationUseCase.execute).toBeCalledTimes(1);
            expect(response.body).toStrictEqual(expectedData);
        });

        test("Should return 404 when no data is present", async () => {

            jest.spyOn(mockFindOrganizationUseCase, "execute").mockImplementation(() => Promise.resolve(null));

            const response = await request(server).get(`/organization/${expectedData.id}`);

            expect(response.status).toBe(404);
            expect(response.body).toStrictEqual({});
        });

        test("Should return 500 on use case error", async () => {

            jest.spyOn(mockFindOrganizationUseCase, "execute").mockImplementation(() => Promise.reject(Error()));

            const response = await request(server).get(`/organization/${expectedData.id}`);

            expect(response.status).toBe(500);
            expect(response.body).toStrictEqual({ message: "Error fetching data" });
        });

    });

    describe("POST /organization", () => {
        
        test("Should return 200 with data", async () => {
        
            jest.spyOn(mockCreateOrganizationUseCase, "execute").mockImplementation(() => Promise.resolve(expectedOrg));

            const response = await request(server).post(`/organization`);

            expect(response.status).toBe(201);
            expect(mockCreateOrganizationUseCase.execute).toBeCalledTimes(1);
            expect(response.body).toStrictEqual(expectedData);
        });

        test("Should return 400 on validation error", async () => {

            jest.spyOn(mockCreateOrganizationUseCase, "execute").mockImplementation(() => Promise.reject(new InvalidArgumentException()));

            const response = await request(server).post(`/organization`);

            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual({ message: "" });
        });

        test("Should return 500 on use case error", async () => {

            jest.spyOn(mockCreateOrganizationUseCase, "execute").mockImplementation(() => Promise.reject(Error()));

            const response = await request(server).post(`/organization`);

            expect(response.status).toBe(500);
            expect(response.body).toStrictEqual({ message: "Error saving data" });
        });

    });
});