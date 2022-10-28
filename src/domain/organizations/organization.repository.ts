import { Nullable } from "../shared/types/nullable";
import { Organization } from "./organization";

export interface OrganizationRepository {
    create(organization: Organization): Promise<Organization>;
    find(id: string): Promise<Nullable<Organization>>;
}