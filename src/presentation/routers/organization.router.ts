import express, { Request, Response } from "express";
import { CreateOrganizationUseCase } from "../../application/organizations/create/create-organization.usecase";
import { FindOrganizationUseCase } from "../../application/organizations/find/find-organization.usecase";
import { InvalidArgumentException } from "../../domain/shared/exceptions/invalid-argument";

export default function OrganizationsRouter(
    findOrganizationUseCase: FindOrganizationUseCase,
    createOrganizationUseCase: CreateOrganizationUseCase
) {
    const router = express.Router();

    router.get('/:id', async (req: Request, res: Response) => {
        try {
            const organization = await findOrganizationUseCase.execute(req.params.id);
            
            if (!organization) {
                return res.status(404).send({});
            }
            
            res.send(organization);
        } catch (err) {
            res.status(500).send({ message: "Error fetching data" })
        }
    });

    router.post('/', async (req: Request, res: Response) => {
        try {
            const organization = await createOrganizationUseCase.execute(req.body);
            res.statusCode = 201;
            res.json(organization);
        } catch (error) {
            if (error instanceof InvalidArgumentException) {
                return res.status(400).send({ message: error.message });
            }
            res.status(500).send({ message: "Error saving data" });
        }
    });

    return router;
}