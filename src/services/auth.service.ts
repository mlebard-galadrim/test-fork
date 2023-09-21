import { patchPublic, postPublic } from "./publicUtils.service";

export const signin = async (user: { email: string; password: string }) => {
  const res = await postPublic(`/login_check`, user);
  return res;
};

export const forgottenPassword = async (email: string) => {
  const res = await patchPublic(`/users/reset`, { email: email });

  if (res.code === 400) {
    return res.errors.children.email.errors[0];
  } else {
    return { success: true };
  }
};
