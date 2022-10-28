import { Organization } from "../../../domain/organizations/organization";
import { OrganizationRepository } from "../../../domain/organizations/organization.repository";
import { UseCase } from "../../shared/use-case";

export class CreateOrganizationUseCase extends UseCase {
    constructor(private organizationRepository: OrganizationRepository) {
        super();
    }
    
    async execute(plainData: { id: string; code: string }): Promise<Organization> {
        return this.organizationRepository.create(new Organization(plainData.id, plainData.code));
    }
}