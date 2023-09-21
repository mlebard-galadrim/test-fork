import axios from "axios";
import { get } from "./utils.service";

export const getPost = async (id) => {
  return await get(`/posts/${id}`);
};

// Need authentication for this service
export const getInvoices = async () => {
  return await get(`/invoices`);
};

export const getPostsCollection = async (authors = [], tags = [], page: number = 1, limit: number = 20) => {
  return await get(`/posts`, { page, limit, authors, tags });
};

export const getTags = async () => {
  return await get(`/tags`);
};

export const getPostIdByUrl = async (url: string) => {
  const res = await axios.get(url);
  return res.headers;
};
