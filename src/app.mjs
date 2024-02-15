import express from 'express';
import { expressjwt } from 'express-jwt';
import config from './config/index.mjs';
import knex from './db/knex.mjs';
import recurringpayments from './routes/recurringpayments/index.mjs'
import paymentinstances from './routes/paymentinstances/index.mjs'
import profiles from './routes/profiles/index.mjs'
import { isCelebrateError } from 'celebrate';

const app = express();

// knex loader
try {
    const dbResult = await knex.raw("SELECT version()");
    console.log("Knex up: ", dbResult.rows[0].version);
} catch (err) {
    console.log("ERR in Knex init: ", err.message);
    console.log(err)
    process.exit(1);
}

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Mounting health endpoint before jwt
app.get('/health', (req, res) => res.json({ ok: true }));

// Setup the jwt verification middleware
// Express-jwt recommends specifying these options for better security
app.use(expressjwt({
    secret: config.jwt.secret,
    audience: "https://monthley.in/api",
    issuer: "https://auth.monthley.in",
    algorithms: ["HS256"]
}));

// To only protect specific routes (for eg. path starting with /api ), use it like so: 
// app.use("/api", jwt({ secret: "shhhhhhared-secret", algorithms: ["HS256"] }));

// To protect all but exclude some path (for eg. /auth), use it like so:
// app.use(jwt({ secret: "shhhhhhared-secret", algorithms: ["HS256"],
// }).unless({ path: ["/auth"] }));

app.use((req, res, next) => {
    const userId = req.auth.sub;
    const phone = req.auth.phone;
    
    if (!userId || userId.trim().length !== 36) {
        return res.status(401).json({ error: 'Invalid user id' });
    }
    if (!phone || phone.trim().length === 0) {
        return res.status(401).json({ error: 'Invalid phone' });
    }
    req.auth.userId = req.auth.sub
    next();
});

// setup the routes
app.use('/api/v1/recurringpayments', recurringpayments);
app.use('/api/v1/paymentinstances', paymentinstances);
app.use('/api/v1/profiles', profiles);

// 404 and error handlers are supposed to be added last.

// setup 404 handler
// 404 handlers are not error handlers in express. so we need a separate handler for this.
// https://expressjs.com/en/starter/faq.html  see 404
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// error handlers - are identified by four arguments instead of three.
// https://zellwk.com/blog/express-errors/
// https://github.com/santiq/bulletproof-nodejs/blob/master/src/loaders/express.ts


// Then routes + db
// validation error message
// Then run
// Then check Pino
// Then http-errors
// Then decide: try/catch or throw & catch all

app.use((err, req, res, next) => {
    // Handle 401 thrown by express-jwt library
    if (err.name === 'UnauthorizedError') {
        console.log(err)
    return res
        // .status(err.status)
        .status(401)
        .send({ message: err.message });
    }
    return next(err);
});

// handle Celebrate/Joi validation errors. By default it sends html.
app.use((err, req, res, next) => {
    if (isCelebrateError(err)) {
        return res.status(400).json({error: err.message, data: err});
    }
    return next(err);
});

// final generic error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message })
});

export default app;