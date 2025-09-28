import { NextRouter } from "next/router";

export const refreshToken = async (router: NextRouter) => {
  try {
    const response = await fetch("http://localhost:8000/refresh-token", {
      method: "POST", // refresh token is usually POST
      credentials: "include",
    });
    if (!response.ok) {
      router.push("/");
    }
    const data = response.json();
    return data;
  } catch (err) {
    console.log(err);
    router.push("/");
  }
};

export const refreshTokenSSR = async (cookies: string) => {
  try {
    const response = await fetch("http://localhost:8000/refresh-token", {
      method: "POST", // refresh token is usually POST
      headers: {
        Cookie: cookies,
      },
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
