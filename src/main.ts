import { App } from './app';

(async () => {
  const app = await App.create({});
  app.start();
})();
