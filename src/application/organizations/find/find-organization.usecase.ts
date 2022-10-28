import { Organization } from "../../../domain/organizations/organization";
import { OrganizationRepository } from "../../../domain/organizations/organization.repository";
import { Nullable } from "../../../domain/shared/types/nullable";
import { UseCase } from "../../shared/use-case";

export class FindOrganizationUseCase extends UseCase {

    constructor(private organizationRepository: OrganizationRepository) {
        super();
    }

    async execute(id: string): Promise<Nullable<Organization>> {
        const result = await this.organizationRepository.find(id);
        return result;
    }
}