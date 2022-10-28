import { MongoClient } from "mongodb";
import { CreateOrganizationUseCase } from "./application/organizations/create/create-organization.usecase";
import { FindOrganizationUseCase } from "./application/organizations/find/find-organization.usecase";
import { CreateShipmentUseCase } from "./application/shipments/create/create-shipment.usecase";
import { FindShipmentUseCase } from "./application/shipments/find/find-shipment.usecase";
import { OrganizationRepository } from "./domain/organizations/organization.repository";
import { ShipmentRepository } from "./domain/shipments/shipment.repository";
import { MongoOrganizationRepository } from "./infrastructure/organizations/mongo-organization.repository";
import { MongoShipmentRepository } from "./infrastructure/shipments/mongo-shipment.repository";
import OrganizationsRouter from "./presentation/routers/organization.router";
import ShipmentsRouter from "./presentation/routers/shipment.router";
import server from "./server";

(async () => {
    const client = new MongoClient("mongodb://mongoadmin:mongoadmin@localhost:27017/demo?authSource=admin");
    await client.connect();

    const organizationRepository: OrganizationRepository = new MongoOrganizationRepository(client.db());
    const organizationRouter = OrganizationsRouter(
        new FindOrganizationUseCase(organizationRepository),
        new CreateOrganizationUseCase(organizationRepository)
    );

    const shipmentRepository: ShipmentRepository = new MongoShipmentRepository(client.db());
    const shipmentRouter = ShipmentsRouter(
        new FindShipmentUseCase(shipmentRepository),
        new CreateShipmentUseCase(shipmentRepository)
    );

    server.use("/organization", organizationRouter);
    server.use("/shipment", shipmentRouter);
    server.listen(3000, () => console.log('Server running'));
})();