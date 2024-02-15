import { uuidv7 } from 'uuidv7';
import { dbTransformer } from "../util.mjs";

function nonUserRepository (knex) {

    const dbTransformMap = {
        "name": "name",
        "mobile": "mobile",
    }

    const dbTransform = dbTransformer(dbTransformMap);
    return {
        getNonUserById: async function (id) {
            const dbResult = await knex('non_users')
            .where({ id })
            .first();
            return dbTransform.parseDb(dbResult);
        },
        createNonUser: async function (nonUser) {
            const dbO = dbTransform.mapToDb(nonUser);
            dbO.id = uuidv7();
            const dbResult = await knex('non_users')
            .insert(dbO)
            .returning('id');
            return dbResult[0].id;
        },
        updateNonUserForId: async function (id, nonUser) {
            const dbResult = await knex('non_users')
            .where({ id })
            .update(dbTransform.mapToDb(nonUser))
            .returning('id');
            return dbResult[0].id;
        },
    }
}

export default nonUserRepository;
