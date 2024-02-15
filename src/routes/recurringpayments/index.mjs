import { Joi, celebrate } from "celebrate";
import { Router } from "express";
import recurringPaymentsRepository from "../../repository/recurringpayment/index.mjs";
import knex from "../../db/knex.mjs";

// mounted on /api/v1/recurringpayments
const router = Router()
const rpRepo = recurringPaymentsRepository(knex);

/**
 * Get paginated recurring payments
 * @route {GET} /api/v1/recurringpayments
 */
router.get('/',
    async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const rps = await rpRepo.getRecurringPaymentsByUserId(userId);
        // TODO: Check for creator OR Check for payee & payer
        res.json(rps);
    } catch (error) {
        next(error);
    }
});

/**
 * Get a recurring payment by id
 * @route {GET} /api/v1/recurringpayments/:id
 */
router.get('/:rpId',
    celebrate({
        params: Joi.object({
            rpId: Joi.string().uuid().required()
        })
    }),
    async (req, res, next) => {
        const { rpId } = req.params;
        try {
            const rp = await rpRepo.getRecurringPaymentById(rpId);
            // TODO check for null, throw (or Send? ) http-error
            // TODO: Check for creator OR Check for payee & payer
            // Same check should go in GET all
            res.json(rp);
        } catch (error) {
            next(error);
        }
});

/**
 * Create a new recurring payment
 * @route {POST} /api/v1/recurringpayments
 */
router.post('/',
    celebrate({
        body: Joi.object({
            title: Joi.string().required(),
            description: Joi.string(),
            frequency: Joi.string().required(),
            amount: Joi.number().required(),
            typeId: Joi.string().uuid().required(),
        })
    }),
    async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const { title, description, frequency, amount, typeId } = req.body;
        const rpId = await rpRepo.createRecurringPayment({
            title,
            description,
            frequency,
            amount,
            currency: 'INR',
            typeId,
            creatorId: userId,
        });
        const rp = await rpRepo.getRecurringPaymentById(rpId);
        res.json(rp);
    } catch (error) {
        next(error);
    }
});

/**
 * Update a recurring payment by id
 * @route {PUT} /api/v1/recurringpayments/:id
 */
router.put('/:rpId',
    celebrate({
        params: Joi.object({
            rpId: Joi.string().uuid().required()
        })
    }),
    async (req, res, next) => {
        const { rpId } = req.params;
        try {
            res.json({
                message: "Update recurringPayment id: " + rpId
            });
        } catch (error) {
            next(error);
        }
});

/**
 * Delete a recurring payment by id
 * @route {DELETE} /api/v1/recurringpayments/:id
 */
router.delete('/:rpId',
    celebrate({
        params: Joi.object({
            rpId: Joi.string().uuid().required()
        })
    }),
    async (req, res, next) => {
        const { rpId } = req.params;
        try {
            res.json({
                message: "Delete recurringPayment id: " + rpId
            });
        } catch (error) {
            next(error);
        }
});

export default router;