import "reflect-metadata";
import * as express from "express";
import './database/connect';
import * as cors from "cors";
import routes from "./routes";

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3333);
