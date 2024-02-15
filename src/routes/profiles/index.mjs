import { Joi, celebrate } from "celebrate";
import { Router } from "express";

// mounted on /api/v1/profiles
const router = Router()

/**
 * Get own profile
 * @route {GET} /api/v1/profiles
 */
router.get('/',
    async (req, res, next) => {
    try {
        res.json({
            message: "Hello profiles!"
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Get profile by id
 * @route {GET} /api/v1/profiles/:id
 */
router.get('/:userId',
    celebrate({
        params: Joi.object({
            userId: Joi.string().uuid().required()
        })
    }),
    async (req, res, next) => {
        const { userId } = req.params;
        try {
            res.json({
                message: "Hello profile id: " + userId
            });
        } catch (error) {
            next(error);
        }
});

/**
 * Create a profile
 * @route {POST} /api/v1/profiles
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
            message: "Create profiles!"
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Update own profile 
 * @route {PUT} /api/v1/profiles
 */
router.put('/',
    async (req, res, next) => {
        try {
            res.json({
                message: "Update profile id: " + "own"
            });
        } catch (error) {
            next(error);
        }
});

export default router;