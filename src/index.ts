import "reflect-metadata";
import * as express from "express";
import './database/connect';
import * as cors from "cors";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3333);
