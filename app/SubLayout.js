import TopBar from "@/components/TopBar";
import SideBar from "@/components/SideBar";
import { UserContext } from "@/contexts/UserContext";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer } from "react-toastify";

export default function SubLayout({ children, signOut, user }) {
  return (
    <UserContext.Provider value={user}>
      <Container fluid className="g-0">
        <Row className="g-0" style={{ height: "100vh" }}>
          <Col xs={2} style={{ backgroundColor: "white" }}>
            <SideBar />
          </Col>
          <Col>
            <TopBar signOut={signOut} />
            <main className="p-5">{children}</main>
          </Col>
        </Row>
      </Container>
      <ToastContainer
        position="bottom-center"
        autoClose={false}
        newestOnTop={false}
        rtl={false}
        theme="colored"
        draggable={false}
        closeOnClick={false}
        icon={false}
      />
    </UserContext.Provider>
  );
}
