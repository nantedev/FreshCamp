import React from 'react';
import { Container, Button, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Ce fichier sera créé plus tard

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <h1 className="display-4 fw-bold">Bienvenue sur FreshCamp</h1>
              <p className="lead">
                Découvrez et partagez les meilleurs spots de camping à travers le monde.
              </p>
              <Link to="/campgrounds">
                <Button variant="success" size="lg" className="mt-3">
                  Explorer les campements
                </Button>
              </Link>
            </Col>
            <Col md={6} className="d-none d-md-block">
              <Image 
                src="/images/camping-hero.jpg" 
                alt="Tente de camping près d'un lac" 
                fluid
                rounded 
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="my-5">
        <h2 className="text-center mb-4">Pourquoi choisir FreshCamp?</h2>
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <div className="feature-card">
              <i className="bi bi-search fs-1"></i>
              <h3>Découvrir</h3>
              <p>Trouvez les meilleurs spots de camping sélectionnés par notre communauté.</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="feature-card">
              <i className="bi bi-share fs-1"></i>
              <h3>Partager</h3>
              <p>Partagez vos propres découvertes avec les autres campeurs.</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="feature-card">
              <i className="bi bi-star fs-1"></i>
              <h3>Évaluer</h3>
              <p>Donnez votre avis sur les campements que vous avez visités.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
