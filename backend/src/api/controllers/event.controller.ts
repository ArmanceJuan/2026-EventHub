import type { NextFunction, Request, Response } from "express";

import { CreateEventUseCase } from "../../application/usecases/create-event.usecase";
import { GetAllEventsUseCase } from "../../application/usecases/get-all-events.usecase";
import { GetEventByIdUseCase } from "../../application/usecases/get-event-by-id.usecase";
import { UpdateEventUseCase } from "../../application/usecases/update-event.usecase";
import { DeleteEventUseCase } from "../../application/usecases/delete-event.usecase";

import { CreateEventDTO } from "../dto";
import { UpdateEventDTO } from "../dto";

export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly getAllEventsUseCase: GetAllEventsUseCase,
    private readonly getEventByIdUseCase: GetEventByIdUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        return res.jsonError("Unauthorized", 403);
      }
      const dto = req.body as CreateEventDTO;

      const created = await this.createEventUseCase.execute({
        ...dto,
        organizerId: user.id,
        startDate: new Date(dto.startDate),
      });

      return res.jsonSuccess(created, 201);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await this.getAllEventsUseCase.execute();

      return res.jsonSuccess(events, 200);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        return res.jsonError("Invalid event id", 400);
      }

      const event = await this.getEventByIdUseCase.execute(idParam);

      if (!event) {
        return res.jsonError("Event not found", 404);
      }

      return res.jsonSuccess(event, 200);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        return res.jsonError("Invalid event id", 400);
      }

      const dto = req.body as UpdateEventDTO;

      const requesterId = req.user?.id;
      if (!requesterId) return res.jsonError("Unauthorized", 401);

      const updated = await this.updateEventUseCase.execute(
        idParam,
        { ...dto, startDate: new Date(dto.startDate) },
        requesterId
      );

      return res.jsonSuccess(updated, 200);
    } catch (err: any) {
      if (err?.message === "Event not found") {
        return res.jsonError("Event not found", 404);
      }
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        return res.jsonError("Invalid event id", 400);
      }

      const requesterId = req.user?.id;
      if (!requesterId) return res.jsonError("Unauthorized", 401);

      await this.deleteEventUseCase.execute(idParam, requesterId);
      return res.status(204).send();

      return res.status(204).send();
    } catch (err: any) {
      if (err?.message === "Event not found") {
        return res.jsonError("Event not found", 404);
      }
      next(err);
    }
  }
}
