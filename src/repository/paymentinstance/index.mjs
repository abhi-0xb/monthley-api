import { uuidv7 } from 'uuidv7';
import { dbTransformer } from "../util.mjs";

function paymentInstanceRepository (knex) {
    const dbTransformMap = {
        "currency": "currency",
        "amount": "amount",
        "title": "title",
        "description": "description",
        "type": "typeId",
        "due_date": "dueDate",
        "paid": "paid",
        "creator": "creatorId",
        "payer": "payerId",
        "payee": "payeeId",
        "non_user_payer": "nonUserPayerId",
        "non_user_payee": "nonUserPayeeId",
        "additional_charges": "additionalCharges",
    }

    const dbTransform = dbTransformer(dbTransformMap);
    return {
        getPaymentInstanceById: async function (id) {
            const dbResult = await knex('payment_instances')
            .where({ id })
            .first();
            return dbTransform.parseDb(dbResult);
        },
        getPaymentInstancesByUserId: async function (userId) {
            const dbResult = await knex('payment_instances')
            .where({ creator: userId })
            .orderBy('created_at', 'desc');
            return dbResult.map(dbTransform.parseDb);
        },
        createPaymentInstance: async function (pi) {
            const dbO = dbTransform.mapToDb(pi);
            dbO.id = uuidv7();
            const dbResult = await knex('payment_instances')
            .insert(dbO)
            .returning('id');
            return dbResult[0].id;
        },
        updatePaymentInstanceById: async function (id, pi) {
            const dbResult = await knex('payment_instances')
            .update(dbTransform.mapToDb(pi))
            .where({ id })
            .returning('id');
            return dbResult[0].id;
        },
        deletePaymentInstanceById: async function (id) {
            const dbResult = await knex('payment_instances')
            .del()
            .where({ id })
            .returning('id');
            return dbResult[0].id;
        },
    }
}

export default paymentInstanceRepository;
