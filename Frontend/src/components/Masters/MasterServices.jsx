import axios from "axios";
import { MASTER_API_MAP } from "./MasterDashboard/MasterEndPoints";

const BASE_URL = "http://localhost:1000";

const getConfig = (master) => {
  const config = MASTER_API_MAP[master];
  if (!config) {
    throw new Error(`API config missing for ${master}`);
  }
  return config;
};

export const createMaster = (master, payload) => {
  const { base, dataKey } = getConfig(master);

  return axios.post(`${BASE_URL}/${base}`, {
    [dataKey]: payload,
  });
};

export const updateMaster = (master, id, payload) => {
  const { base, dataKey } = getConfig(master);

  return axios.put(`${BASE_URL}/${base}/${id}`, {
    [dataKey]: payload,
  });
};

export const getMasterList = (master) => {
  const { base } = getConfig(master);

  return axios.get(`${BASE_URL}/${base}/get-all`);
};

export const getMasterById = (master, id) => {
  const { base } = getConfig(master);

  return axios.get(`${BASE_URL}/${base}/${id}`);
};
