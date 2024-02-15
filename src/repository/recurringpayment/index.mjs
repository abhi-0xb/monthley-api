import { uuidv7 } from 'uuidv7';
import { dbTransformer } from "../util.mjs";

function recurringPaymentsRepository (knex) {
    const dbTransformMap = {
        "id": "id",
        "created_at": "createdAt",
        "updated_at": "updatedAt",
        "currency": "currency",
        "amount": "amount",
        "title": "title",
        "description": "description",
        "frequency_expression": "frequency",
        "type": "typeId",
        "creator": "creatorId",
        "payer": "payerId",
        "payee": "payeeId",
        "non_user_payer": "nonUserPayerId",
        "non_user_payee": "nonUserPayeeId",
        "additional_charges": "additionalCharges",
    }

    const dbTransform = dbTransformer(dbTransformMap);
    return {
        getRecurringPaymentById: async function (id) {
            const dbResult = await knex('recurring_payments')
            .where({ id })
            .first();
            return dbTransform.parseDb(dbResult);
        },
        getRecurringPaymentsByUserId: async function (userId) {
            const dbResult = await knex('recurring_payments')
            .where({ creator: userId })
            .orderBy('created_at', 'desc');
            return dbResult.map(dbTransform.parseDb);
        },
        createRecurringPayment: async function (rp) {
            const dbO = dbTransform.mapToDb(rp);
            dbO.id = uuidv7();
            const dbResult = await knex('recurring_payments')
            .insert(dbO)
            .returning('id');
            return dbResult[0].id;
        },
        updateRecurringPaymentById: async function (id, rp) {
            const dbResult = await knex('recurring_payments')
            .update(dbTransform.mapToDb(rp))
            .where({ id })
            .returning('id');
            return dbResult[0].id;
        },
        deleteRecurringPaymentById: async function (id) {
            const dbResult = await knex('recurring_payments')
            .del()
            .where({ id })
            .returning('id');
            return dbResult[0].id;
        },
    }
}

export default recurringPaymentsRepository;
