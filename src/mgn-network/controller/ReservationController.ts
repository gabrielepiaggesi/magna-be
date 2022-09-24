import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { ReservationApi } from "../integration/ReservationApi";
import { ReservationService } from "../service/ReservationService";

// services
const reservationService = new ReservationService();
const LOG = new Logger("ReservationController.class");

export class ReservationController implements ReservationApi {

    @Get()
    @Path("/getReservation/:reservationId")
    public async getReservation(res: Response, req) {
        try {
            const response = await reservationService.getReservation(parseInt(req.params.reservationId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Reservation.getReservation.Error'});
        }
    }

    @Get()
    @Path("/getUserReservations")
    public async getUserReservations(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await reservationService.getUserReservations(loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Reservation.getUserReservations.Error'});
        }
    }

    @Get()
    @Path("/getBusinessReservations/:businessId")
    public async getBusinessReservations(res: Response, req) {
        try {
            const response = await reservationService.getBusinessReservations(parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Reservation.getBusinessReservations.Error'});
        }
    }

    @Post()
    @Path("/addReservation/:businessId")
    public async addReservation(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await reservationService.addReservation(req.body, parseInt(req.params.businessId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Reservation.addReservation.Error'});
        }
    }
    
    @Post()
    @Path("/updateBusinessReservation/:reservationId")
    public async updateBusinessReservation(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await reservationService.updateBusinessReservation(req.body, parseInt(req.params.reservationId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Reservation.updateBusinessReservation.Error'});
        }
    }

}