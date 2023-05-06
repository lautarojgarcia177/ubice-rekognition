import ActiveLink from "./ActiveLink";
import Image from "next/image";
import Stack from "react-bootstrap/Stack";
import { Upload, Download } from "react-feather";

export default function SideBar() {
  return (
    <Stack gap={4}>
      <div className="d-flex justify-content-center">
        <Image
          style={{marginBottom: "20%"}}
          src="/ubice-icon.png"
          width={128}
          height={128}
          alt="ubice logo"
        />
      </div>
      <ActiveLink
        href="/"
        activeClassName="active-link"
        className="ps-5 text-dark text-decoration-none fw-semibold"
      >
        <Upload /> &nbsp; &nbsp;Subir fotos
      </ActiveLink>
      <ActiveLink
        href="/download-pictures"
        activeClassName="active-link"
        className="ps-5 text-dark text-decoration-none fw-semibold"
      >
        <Download /> &nbsp; &nbsp;Descargar fotos
      </ActiveLink>
    </Stack>
  );
}
