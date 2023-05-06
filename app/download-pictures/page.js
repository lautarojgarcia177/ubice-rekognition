"use client";

import { useState } from "react";
import { Search } from "react-feather";
import { Row, Button, Container, Form, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function DownloadPictures() {
  const [searching, setSearching] = useState(false);
  const [id, setId] = useState("");
  const handleIdChange = (event) => {
    setId(event.target.value);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    const uploadPackageId = id;
    setId("");
    try {
      const response = await fetch("/download-pictures/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uploadPackageId }),
      });
      if (!response.ok) {
        throw new Error("An error occurred while downloading the zip file");
      } else {
        setSearching(false);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${id}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(
          "Se ha generado un comprimido con las fotos procesadas para descargar"
        );
      }
    } catch (error) {
      console.error("Error searching S3:", error);
      toast.error("Hubo un error " + error);
    }
  };
  const searchJSX = (
    <Container>
      <Form onSubmit={handleSearch}>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formPackageId">
              <Form.Label>Buscar por id del paquete de subida</Form.Label>
              <Form.Control
                value={id}
                onChange={handleIdChange}
                type="text"
                placeholder="Ingrese el id del paquete de subida"
                required
              />
            </Form.Group>
          </Col>
          <Col xs="3">
            <Button
              variant="secondary"
              type="submit"
              className="fw-semibold fs-3 ubice-btn-secondary"
              style={{ height: "70px" }}
              disabled={!id}
            >
              <Search style={{ height: "2rem", width: "2rem" }} />
              Buscar
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
  const searchingJSX = (
    <div className="d-flex flex-column align-items-center">
      <Spinner
        style={{ width: "80px", height: "80px" }}
        animation="border"
        role="status"
        className="mb-4"
      >
        <span className="visually-hidden">
          Buscando el paquete de subida...
        </span>
      </Spinner>
      <strong>Buscando el paquete de subida...</strong>
      <p>
        Recuerde que si usted acaba de subir el paquete, puede demorar unos
        minutos hasta estar disponible para descargar.
      </p>
    </div>
  );

  if (searching) {
    return searchingJSX;
  } else {
    return searchJSX;
  }
}
