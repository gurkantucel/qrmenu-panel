import { getCookie } from "cookies-next";

interface UserProps {
  name:string
}

export default function useUser() {
  //const session ={user: {email: "", image: "", name: "Gürkan"},provider:"",image: ""}
  const cookieValue = getCookie("displayName");
  if (cookieValue) {
    const newUser: UserProps = {
      name: cookieValue
    };

    return newUser;
  }
  return false;
}
