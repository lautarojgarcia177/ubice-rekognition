import Image from "next/image";
import Stack from "react-bootstrap/Stack";
import { Upload, Download } from "react-feather";
import Link from "next/link";

export default function SideBar() {
  return (
    <Stack gap={4}>
      <div className="d-flex justify-content-center">
        <Image
          style={{ marginBottom: "20%" }}
          src="/ubice-icon.png"
          width={128}
          height={128}
          alt="ubice logo"
        />
      </div>
      <Link
        href="/upload-pictures"
        className="ps-5 text-dark text-decoration-none fw-semibold"
      >
        <Upload /> &nbsp; &nbsp;Subir fotos
      </Link>
      <Link
        href="/download-pictures"
        className="ps-5 text-dark text-decoration-none fw-semibold"
      >
        <Download /> &nbsp; &nbsp;Descargar fotos
      </Link>
    </Stack>
  );
}
