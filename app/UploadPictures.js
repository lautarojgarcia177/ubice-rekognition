"use client";

import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/contexts/UserContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { Col, Container, Row } from "react-bootstrap";
import { Upload, Copy } from "react-feather";
import { toast } from "react-toastify";

function SuccessNotification({ uploadPackageId, closeToast, toastProps }) {
  const [isIdCopiedToClipboard, setIsIdCopiedToClipboard] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(uploadPackageId)
      .then(() => {
        setIsIdCopiedToClipboard(true);
        setTimeout(() => setIsIdCopiedToClipboard(false), 3000);
      })
      .catch((error) => {
        console.error("Failed to copy upload package id:", error);
      });
  };

  return (
    <div>
      <p>
        Las fotos fueron subidas con éxito. El id para descargar el paquete es:
      </p>
      <div className="d-flex justify-content-start align-items-start">
        <p className="fs-4 fw-medium mb-0">{uploadPackageId}</p>
        <button className="icon-button" onClick={handleCopyClick}>
          <Copy />
        </button>
      </div>
    </div>
  );
}

const UploadPictures = () => {
  const [eventNumber, setEventNumber] = useState("");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    const isValid = eventNumber !== "" && files.length > 0;
    setFormValid(isValid);
  }, [eventNumber, files]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("eventNumber", eventNumber);
    formData.append("photographerName", user.attributes.email.split("@")[0]);
    files.forEach((file) => formData.append("images", file));

    // Reset the form
    setFiles([]);
    setEventNumber("");

    setSending(true);
    const response = await fetch("/api", {
      method: "POST",
      body: formData,
    });
    setSending(false);
    if (response.ok) {
      const { uploadPackageId } = await response.json();
      console.log(uploadPackageId);
      toast.success(<SuccessNotification uploadPackageId={uploadPackageId} />);
    } else {
      console.error("Upload failed:", response.statusText);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleEventNumberChange = (e) => {
    setEventNumber(e.target.value);
  };

  const sendingJSX = (
    <div className="d-flex flex-column align-items-center">
      <Spinner
        style={{ width: "80px", height: "80px" }}
        animation="border"
        role="status"
        className="mb-4"
      >
        <span className="visually-hidden">Subiendo las fotos...</span>
      </Spinner>
      <strong>Subiendo las fotos...</strong>
    </div>
  );

  const uploadJSX = (
    <>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formEventNumber">
                <Form.Label>Número del evento</Form.Label>
                <Form.Control
                  value={eventNumber}
                  onChange={handleEventNumberChange}
                  type="number"
                  placeholder="Ingrese el número del evento"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formFiles">
                <Form.Label>Seleccionar las fotos</Form.Label>
                <Form.Control
                  onChange={handleFileChange}
                  type="file"
                  multiple
                  accept=".jpg"
                  placeholder="Ingrese el número del evento"
                  required
                />
                <small>El número máximo de fotos por tanda es de 1000</small>
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Button
                style={{ height: "100%", width: "100%" }}
                disabled={!formValid}
                variant="primary"
                type="submit"
                className="fw-semibold fs-3"
              >
                <Upload style={{ height: "2rem", width: "2rem" }} />
                <p>ENVIAR</p>
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );

  if (sending) {
    return sendingJSX;
  } else {
    return uploadJSX;
  }
};

export default UploadPictures;
