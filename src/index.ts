// Bayshore - a Wangan Midnight Maximum Tune 6 private server.
// Made with love by Luna, and part of Project Asakura.

import express, { Router } from 'express';
import {PrismaClient} from '@prisma/client';
import https, {globalAgent} from 'https';
import http from 'http';
import fs from 'fs';
import bodyParser from 'body-parser';
import AllnetModule from './allnet';
import MuchaModule from './mucha';
globalAgent.options.keepAlive = true;

// @ts-ignore
require('http').globalAgent.options.keepAlive = true;

const appRouter = Router();

const PORT_ALLNET = 80;
const PORT_MUCHA = 10082;
const PORT_BNGI = 5555;

const app = express();
app.use(bodyParser.raw({
    type: '*/*'
}));

const muchaApp = express();
const allnetApp = express();

app.use((req, res, next) => {
    console.log(`[  MAIN] ${req.method} ${req.url}`);
    next()
});

muchaApp.use((req, res, next) => {
    console.log(`[ MUCHA] ${req.method} ${req.url}`);
    next()
});

allnetApp.use((req, res, next) => {
    console.log(`[ALLNET] ${req.method} ${req.url}`);
    next()
});

let dirs = fs.readdirSync('dist/modules');
for (let i of dirs) {
    if (i.endsWith('.js')) {
        let mod = require(`./modules/${i.substring(0, i.length - 3)}`); // .js extension
        let inst = new mod.default();
        inst.register(appRouter);
    }
}

app.use('/', appRouter);
app.use('/wmmt6/', appRouter);

app.all('*', (req, res) => {
    res.status(200).end();
})

new AllnetModule().register(allnetApp);
new MuchaModule().register(muchaApp);

let key = fs.readFileSync('./server_wangan.key');
let cert = fs.readFileSync('./server_wangan.crt');
let secureProtocol= 'TLSv1_method'
let ciphers = 'ALL'

http.createServer(allnetApp).listen(PORT_ALLNET, '0.0.0.0', 511, () => {
    console.log(`ALL.net server listening on port ${PORT_ALLNET}!`);
})

https.createServer({key, cert}, muchaApp).listen(PORT_MUCHA, '0.0.0.0', 511, () => {
    console.log(`Mucha server listening on port ${PORT_MUCHA}!`);
})

require("tls").DEFAULT_CIPHERS = "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:aNULL:eNULL:EXPORT:DES:RC4:MD5:PSK:SRP:CAMELLIA";

const tlsOptions = {
    cert: cert,
    key: key,
    secureProtocol: "TLS_method",
    ciphers: "DEFAULT:@SECLEVEL=0",
}

https.createServer(tlsOptions, app).listen(PORT_BNGI, '0.0.0.0', 511, () => {
    console.log(`Game server listening on port ${PORT_BNGI}!`);
})
