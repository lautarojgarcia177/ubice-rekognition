import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import Button from 'react-bootstrap/Button';

export default function TopBar({ signOut }) {
  const user = useContext(UserContext);
  let emailPrefix;
  if (user && user.attributes && user.attributes.email) {
    emailPrefix = user.attributes.email.split("@")[0];
  }
  return (
    <header style={{ backgroundColor: "#071743", height: "128px" }} className="d-flex justify-content-between align-items-center fontColorWhite">
      <h1 className="ms-5 text-light">REKOGNITION</h1>
      <div className="d-flex align-items-baseline me-5">
        <span className="pe-3 text-light">
          {emailPrefix && <p level={4}>Bienvenido/a, {emailPrefix}</p>}
        </span>
        <Button variant="primary" onClick={signOut}>Cerrar sesión</Button>
      </div>
    </header>
  );
}
