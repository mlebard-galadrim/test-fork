import { get, postFormData } from "./utils.service";

// Need authentication

export const getInboxMessage = async () => {
  const res = await get(`/users/current/threads/inbox`);
  return res;
};

export const getSentMessage = async () => {
  const res = await get(`/users/current/threads/sent`);
  return res;
};

export const createMessage = async (data) => {
  const res = await postFormData(`/users/current/threads`, {
    data,
  });
  return res;
};

export const getThread = async (threadId) => {
  const res = await get(`/users/current/threads/${threadId}`);
  return res;
};

export const createThreadMesage = async (data, threadId) => {
  const res = await postFormData(`/users/current/threads/${threadId}/messages`, {
    data,
  });
  return res;
};

export const getCollectionMessage = async () => {
  const res = await get(`/messages`);
  return res;
};
