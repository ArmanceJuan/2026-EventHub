import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import helmet from "helmet";
import swaggerOptions from "../../docs/swagger.config";
import express from "express";

import { jsonApiResponseMiddleware } from "./middlewares/json-api-response.middleware";
import eventRoutes from "./routes/event.route";
import authRoutes from "./routes/auth.route";
import { errorHandlerMiddleware } from "./middlewares/error.middleware";
import { a2fRouter } from "./routes/a2f.routes";
import { analyticsRouter } from "./routes/analytics.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:8000"],
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  }),
);

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(jsonApiResponseMiddleware);

app.use("/api", authRoutes);
app.use("/api", eventRoutes);
app.use("/a2f", a2fRouter);
app.use("/api/analytics", analyticsRouter);
app.use(errorHandlerMiddleware);

export default app;
