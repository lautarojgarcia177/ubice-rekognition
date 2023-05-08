"use client";
import { Spinner } from "react-bootstrap";

export default function Loading() {
  return (
    <div className="d-flex flex-column align-items-center">
      <Spinner
        style={{ width: "80px", height: "80px" }}
        animation="border"
        role="status"
        className="mb-4"
      >
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
      <strong>Cargando...</strong>
    </div>
  );
}
