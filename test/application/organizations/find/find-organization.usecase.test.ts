import { FindOrganizationUseCase } from "../../../../src/application/organizations/find/find-organization.usecase";
import { Organization } from "../../../../src/domain/organizations/organization";
import { OrganizationRepository } from "../../../../src/domain/organizations/organization.repository";

describe("Find Organization Use Case", () => {
    
    class MockOrganizationRepository implements OrganizationRepository {
        create(_organization: Organization): Promise<Organization> {
            throw new Error("Method not implemented.");
        }
        find(_id: string): Promise<Organization> {
            throw new Error("Method not implemented.");
        }
    }

    let mockOrganizationRepository: MockOrganizationRepository;
    const inputData = { id: "ee136506-03e6-4e9e-92eb-c83004807ea1", code: "BOG"};
    const expectedOrganization = new Organization(inputData.id, inputData.code);

    beforeEach(() => {
        jest.clearAllMocks();
        mockOrganizationRepository = new MockOrganizationRepository();
    });

    test("Should find and return data", async () => {
        jest.spyOn(mockOrganizationRepository, "find").mockImplementation(() => Promise.resolve(expectedOrganization));

        const saveOrgUseCase = new FindOrganizationUseCase(mockOrganizationRepository);
        const result = await saveOrgUseCase.execute(inputData.id);

        expect(result).toBe(expectedOrganization);
    });
});