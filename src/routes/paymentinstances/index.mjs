import { Joi, celebrate } from "celebrate";
import { Router } from "express";

// mounted on /api/v1/paymentinstances
const router = Router()

/**
 * Get paginated payment instances
 * @route {GET} /api/v1/paymentinstances
 */
router.get('/',
    async (req, res, next) => {
    try {
        res.json({
            message: "Hello paymentInstances!"
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get a payment instance by id
 * @route {GET} /api/v1/paymentinstances/:id
 */
router.get('/:instanceId',
    celebrate({
        params: Joi.object({
            instanceId: Joi.string().uuid().required()
        })
    }),
    async (req, res, next) => {
        const { instanceId } = req.params;
        try {
            res.json({
                message: "Hello paymentInstance id: " + instanceId
            });
        } catch (error) {
            next(error);
        }
});

/**
 * Create a new payment instance
 * @route {POST} /api/v1/paymentinstances
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
        res.json({
            message: "Create paymentInstances!"
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Update a payment instance by id
 * @route {PUT} /api/v1/paymentinstances/:id
 */
router.put('/:instanceId',
    celebrate({
        params: Joi.object({
            instanceId: Joi.string().uuid().required()
        })
    }),
    async (req, res, next) => {
        const { instanceId } = req.params;
        try {
            res.json({
                message: "Update paymentInstance id: " + instanceId
            });
        } catch (error) {
            next(error);
        }
});

/**
 * Delete a payment instance by id
 * @route {DELETE} /api/v1/paymentinstances/:id
 */
router.delete('/:instanceId',
    celebrate({
        params: Joi.object({
            instanceId: Joi.string().uuid().required()
        })
    }),
    async (req, res, next) => {
        const { instanceId } = req.params;
        try {
            res.json({
                message: "Delete paymentInstance id: " + instanceId
            });
        } catch (error) {
            next(error);
        }
});

export default router;