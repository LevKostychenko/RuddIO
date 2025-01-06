import axios, { CreateAxiosDefaults } from "axios";

export const makeService = (config?: CreateAxiosDefaults) =>
  axios.create({
    ...config,
    validateStatus: config?.validateStatus ?? ((status) => status < 400),
  });
