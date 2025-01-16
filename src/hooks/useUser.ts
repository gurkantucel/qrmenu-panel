import { getCookie } from "cookies-next";
import { Membership, Person } from "reduxt/features/auth/models/auth-models";

interface UserProps {
  name: string;
  email: string;
  avatar: string;
  thumb: string;
  role: string;
  membership: Membership
}

export default function useUser() {
  //const session ={user: {email: "", image: "", name: "Gürkan"},provider:"",image: ""}
  const cookieValue = getCookie("person");
  const membershipCookieValue = getCookie("membership");
  if (cookieValue && membershipCookieValue) {
    var session = JSON.parse(cookieValue) as Person;
    var membership = JSON.parse(membershipCookieValue) as Membership;
    const newUser: UserProps = {
      name: session.full_name,
      email: session.email,
      avatar: '/assets/images/users/avatar-1.png',
      thumb : '/assets/images/users/avatar-thumb-1.png',
      role: session.person_type_name,
      membership: membership
    };

    return newUser;
  }
  return false;
}
