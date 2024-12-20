import { getCookie } from "cookies-next";
import { Person } from "reduxt/features/auth/models/auth-models";

interface UserProps {
  name: string;
  email: string;
  avatar: string;
  thumb: string;
  role: string;
}

export default function useUser() {
  //const session ={user: {email: "", image: "", name: "Gürkan"},provider:"",image: ""}
  const cookieValue = getCookie("person");
  if (cookieValue) {
    var session = JSON.parse(cookieValue) as Person;

    const newUser: UserProps = {
      name: session.full_name,
      email: session.email,
      avatar: '/assets/images/users/avatar-1.png',
      thumb : '/assets/images/users/avatar-thumb-1.png',
      role: 'Doktor'
    };

    return newUser;
  }
  return false;
}
