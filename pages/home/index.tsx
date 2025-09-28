import ContactsGrid from "@/src/components/home";
import { refreshTokenSSR } from "@/src/service/token";
import { GetServerSideProps } from "next";

export interface HomeProps {
  users: User[];
}

export default function Home({ users }:HomeProps) {
  return <ContactsGrid users={users} />;
}
export interface User {
  user_id: number;       // from your data it's a string
  user_name: string;
  email: string;
  is_active: boolean;
}
export const getServerSideProps: GetServerSideProps<{ users: User[], error: string | null }> = async (context) => {
   const cookies = context.req.headers.cookie || "";

  try {
     const res = await fetch("http://localhost:8000/users", {
         headers: {
        "Cookie": cookies, // <-- pass cookies manually
      },
    });

    if (!res.ok) {
      if(res.status === 401){
    await refreshTokenSSR(cookies)
      }
      return {
        props: {
          users: [],
          error: `Failed to fetch users: ${res.status} ${res.statusText}`,
        },
      };
    }

    const data = await res.json();

    return {
      props: { users: data?.data || [], error: null },
    };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return {
      props: {
        users: [],
        error: "Server error while fetching users",
      },
    };
  }
};

