import { dbTransformer } from "../util.mjs";

function profileRepository (knex) {
    const dbTransformMap = {
        "user_id": "userId",
        "name": "name",
        "profile_pic": "profilePic",
    }

    const dbTransform = dbTransformer(dbTransformMap);
    return {
        getProfileByUserId: async function (userId) {
            const dbResult = await knex('profiles')
            .where({ user_id: userId })
            .first();
            return dbTransform.parseDb(dbResult);
        },
        createProfileForUserId: async function (userId, profile) {
            const dbO = dbTransform.mapToDb(profile);
            dbO["user_id"] = userId;
            const dbResult = await knex('profiles')
            .insert(dbO)
            .returning('id');
            return dbResult[0].id;
        },
        updateProfileForUserId: async function (userId, profile) {
            const dbResult = await knex('profiles')
            .where({ user_id: userId })
            .update(dbTransform.mapToDb(profile))
            .returning('id');
            return dbResult[0].id;
        },
    }
}

export default profileRepository;
