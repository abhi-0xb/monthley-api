

export function dbTransformer (dbTransformMap) {

    const dbMap = Object.assign({}, dbTransformMap);
    const inverseMap = {};
    for (const key of Object.keys(dbMap)) {
        inverseMap[dbMap[key]] = key;
    }

    // NOTE: This is possible because all functions in JS are closuers and closures in JS keep their lexical scope.
    // "A closure is the combination of a function and the lexical environment within which that function was declared.
    // This environment consists of any local variables that were in-scope at the time the closure was created. "
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

    // So here, the instance of fns mapToDb and parseDb will keep a reference of its lexical environment. And the lexical
    // environment contains the references to the above objects. 

    // And that is why these objects will exist and the below functions run as expected even though the parent function
    // 'dbTransformer' has run and exited.


    // TODO: Handle keys not found in the input map. Leads to results like:
    /*  Here created_at was not defined
        {
            undefined: 2024-02-02T13:43:09.658Z,
            currency: 'INR',
            amount: '20000.00',
            title: 'Rent',
        }
    */

    return {
        mapToDb: function (appObj) {
            const dbObj = {};
            if (!appObj) return undefined;
            for (const key of Object.keys(appObj)) {
                dbObj[inverseMap[key]] = appObj[key];
            }
            console.log(dbObj)
            console.log("\n\n")
            return dbObj;
        },
        parseDb: function (dbObj) {
            const appObj = {};
            if (!dbObj) return undefined;
            for (const key of Object.keys(dbObj)) {
                appObj[dbMap[key]] = dbObj[key];
            }
            console.log(appObj)
            console.log("\n\n")
            return appObj;
        }
    }
}
