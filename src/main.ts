import http from "http";
import _ from "lodash";
import "v8-compile-cache";
import ENV from "./config/env";
import app from "./config/express";
import { getServerHostName } from "./config/helper";
import logger from "./config/logger";
import { database } from "./modules/knex";

export const server = http.createServer(app);

database
  .raw("select 1+1 as result")
  .then(() => console.log("connected"))
  .catch((err) => {
    console.log(err);
  });

/**
 * start server
 * */
server.listen(ENV.SERVER.PORT);
server.on("listening", onListening);
server.on("error", onError);

/* ============================================================================================================================ */
/**
 * functions
 * */

function onListening() {
  logger.info(`Server started on ${getServerHostName()}`);
}

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== "listen") throw error;
  const bind = _.isString(ENV.SERVER.PORT)
    ? `Pipe ${ENV.SERVER.PORT}`
    : `Port ${ENV.SERVER.PORT}`;

  /** handle specific listen errors with friendly messages */
  switch (error.code) {
    case "EACCES":
      throw new Error(`${bind} requires elevated privileges`);
    case "EADDRINUSE":
      throw new Error(`${bind} is already in use`);
    default:
      throw error;
  }
}
