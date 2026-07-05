import NavBar from "../components/navbar/NavBar";

export default function BasePage({ children }) {
  return (
    <>
      <NavBar />

      {children}

      <footer className="mt-5">
        <hr />
        <p className="text-center">Rate-ify. All Rights Reserved</p>
      </footer>
    </>
  );
}
