import createError from "./createError";

export const validateRegisterData = (
  username: string,
  email: string,
  password: string,
  password2: string
) => {
  // Check data accuracy
  if (!username || !email || !password || !password2) {
    return createError("Please fill in all information.", 400);
  }

  //check is email
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailReg.test(email)) {
    return createError("Invalid email format.", 400);
  }

  //check password more than 6
  if (password.length < 6) {
    return createError("Password must be at least 6 characters long.", 400);
  }

  //check confirm password
  if (password !== password2) {
    return createError("Confirm passwords do not match.", 400);
  }
};
