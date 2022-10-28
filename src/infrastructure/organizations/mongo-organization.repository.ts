import { Db } from "mongodb";
import { Organization } from "../../domain/organizations/organization";
import { OrganizationRepository } from "../../domain/organizations/organization.repository";
import { Nullable } from "../../domain/shared/types/nullable";
import { MongoRepository } from "../shared/mongo-repository";

interface OrganizationDocument {
    id: string,
    code: string
}

export class MongoOrganizationRepository extends MongoRepository implements OrganizationRepository {
    constructor(db: Db) {
        super(db, "organizations");
    }

    async create(organization: Organization): Promise<Organization> {
        await this._collection.insertOne(organization.toJson());
        return organization;
    }

    async find(id: string): Promise<Nullable<Organization>> {
        const document = await this._collection.findOne<OrganizationDocument>({id: id});
        return document ? new Organization(document.id, document.code) : null;
    }
}