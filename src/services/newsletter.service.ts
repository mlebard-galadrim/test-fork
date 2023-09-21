import { post } from "./utils.service";

export const createSubscription = async (email) => {
  const res = await post(`/newsletter-subscriptions`, { email });
  return res;
};
