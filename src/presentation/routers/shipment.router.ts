import express, { Request, Response } from "express";
import { CreateShipmentUseCase } from "../../application/shipments/create/create-shipment.usecase";
import { FindShipmentUseCase } from "../../application/shipments/find/find-shipment.usecase";
import { InvalidArgumentException } from "../../domain/shared/exceptions/invalid-argument";

export default function ShipmentsRouter(
    findShipmentUseCase: FindShipmentUseCase,
    createShipmentUseCase: CreateShipmentUseCase
) {
    const router = express.Router();

    router.get('/:id', async (req: Request, res: Response) => {
        try {
            const shipment = await findShipmentUseCase.execute(req.params.id);
            
            if (!shipment) {
                return res.status(404).send({});
            }
            
            res.send(shipment);
        } catch (err) {
            res.status(500).send({ message: "Error fetching data" })
        }
    });

    router.post('/', async (req: Request, res: Response) => {
        try {
            const organization = await createShipmentUseCase.execute(req.body);
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