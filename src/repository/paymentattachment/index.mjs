import { uuidv7 } from 'uuidv7';
import { dbTransformer } from "../util.mjs";

function paymentAttachmentRepository (knex) {
    const dbTransformMap = {
        "url": "url",
        "media_type": "mediaType",
        "uploader": "uploaderId",
        "payment_instance": "paymentInstanceId",
    }

    const dbTransform = dbTransformer(dbTransformMap);
    return {
        getPaymentAttachmentById: async function (userId) {
            const dbResult = await knex('payment_attachments')
            .where({id: userId})
            .first();
            return dbTransform.parseDb(dbResult);
        },
        getPaymentAttachmentByPaymentId: async function (paymentId) {
            const dbResult = await knex('payment_attachments')
            .where({ "payment_instance": paymentId })
            .orderBy('created_at', 'desc');
            return dbResult.map(dbTransform.parseDb);
        },
        createPaymentAttachment: async function (pa) {
            const dbO = dbTransform.mapToDb(pa);
            dbO.id = uuidv7();
            const dbResult = await knex('payment_attachments')
            .insert(dbO)
            .returning('id');
            return dbResult[0].id;
        },
        updatePaymentAttachmentForId: async function (id, pa) {
            const dbResult = await knex('payment_attachments')
            .where({ id })
            .update(dbTransform.mapToDb(pa))
            .returning('id');
            return dbResult[0].id;
        },
    }
}

export default paymentAttachmentRepository;
