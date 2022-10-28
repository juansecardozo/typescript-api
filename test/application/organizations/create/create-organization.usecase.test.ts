import { CreateOrganizationUseCase } from "../../../../src/application/organizations/create/create-organization.usecase";
import { Organization } from "../../../../src/domain/organizations/organization";
import { OrganizationRepository } from "../../../../src/domain/organizations/organization.repository";

describe("Create Organization Use Case", () => {
    
    class MockOrganizationRepository implements OrganizationRepository {
        create(_organization: Organization): Promise<Organization> {
            throw new Error("Method not implemented.");
        }
        find(_id: string): Promise<Organization> {
            throw new Error("Method not implemented.");
        }
    }

    let mockOrganizationRepository: MockOrganizationRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        mockOrganizationRepository = new MockOrganizationRepository();
    });

    test("Should create and return data", async () => {
        const inputData = { id: "ee136506-03e6-4e9e-92eb-c83004807ea1", code: "BOG"};
        const expectedOrganization = new Organization(inputData.id, inputData.code);
        
        jest.spyOn(mockOrganizationRepository, "create").mockImplementation(() => Promise.resolve(expectedOrganization));

        const createOrganizationUseCase = new CreateOrganizationUseCase(mockOrganizationRepository);
        const result = await createOrganizationUseCase.execute(inputData);

        expect(result).toBe(expectedOrganization);
    });

    test("Should get error when wrong id", () => {
        const inputData = { id: "dedewf", code: "BOG"};

        const createOrganizationUseCase = new CreateOrganizationUseCase(mockOrganizationRepository);

        expect(createOrganizationUseCase.execute(inputData)).rejects.toThrow("The organization id <dedewf> is not valid");
    });

    test("Should get error when wrong code", () => {
        const inputData = { id: "ee136506-03e6-4e9e-92eb-c83004807ea1", code: "verve"};

        const createOrganizationUseCase = new CreateOrganizationUseCase(mockOrganizationRepository);

        expect(createOrganizationUseCase.execute(inputData)).rejects.toThrow("The organization code <verve> is not valid");
    });
});