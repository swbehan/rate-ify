import NavBar from "../components/navbar/NavBar";
import { useState, useEffect} from "react";
import { UserContext } from "../context/UserContext.jsx";

export default function BasePage({ children }) {
  const [user, setUser] = useState(null);

  //effects are things that you want the component to do once it finishes loading
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavBar />

      {children}

      <footer className="mt-5">
        <hr />
        <p className="text-center">Rate-ify. All Rights Reserved</p>
      </footer>
    </UserContext.Provider>
  );
}
