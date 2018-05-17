import Boom from 'boom'
import Glue from 'glue'
import fs from 'fs'

const manifestPath = process.argv[2];

const startServer = () => {
  fs.readFile(manifestPath, (err, configsData) => {
    if (err) return err;
    let configs = JSON.parse(configsData);
    Glue.compose(configs, (err, server) => {
      if (err) return Boom.badRequest(`Error when creating betcha server ${err}`);
      server.start((err) => {
        if (err) return Boom.badRequest(`Error when creating betcha server ${err}`);
        console.info(`Betcha© server is up and running on ${server.info.uri}`);
      });
    });
  });
}

startServer();
