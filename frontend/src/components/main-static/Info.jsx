import { Container, Row, Col } from "react-bootstrap";
import "./info.css";

export default function Info() {
  return (
    <Container className="px-5">
      <h3 className="what-is-this">What is this?</h3>  
      <Row className="justify-content-center gx-3">
        <Col className="col-center" xs={6}>
          <img
            src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUydzh0YTQ3dGs5bWtsamw1dmY2aXA2dWJwdGNncDg5Z3N5OWN1NGRlYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/oeTUSVYXQ5hbZOelTn/giphy.gif"
            alt="Description of the image"
            className="img-fluid"
          />
        </Col>
        <Col className="col-center" xs={6}>
          <img
            src="https://www.horrorgeeklife.com/wp-content/uploads/2017/02/Invincible-Image-Comics.jpg"
            alt="Description of the image"
            className="img-fluid"
          />
        </Col>
        <Col className="col-center" xs={12}>
          Welcome to Sean's web page where I rate movies, games, and songs that
          I have recently experienced! I will leave reviews about these
          experiences and then I will be able to create new ones, edit exisiting
          ones, display all of them and delete existing ones. This is an full
          stack application with React, Vite, Node.js, MongoDB, and Express.js!
        </Col>
      </Row>
    </Container>
  );
}
