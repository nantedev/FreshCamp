import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container className="text-center">
        <p className="mb-0">© {new Date().getFullYear()} FreshCamp - Tous droits réservés</p>
        <small>Migré vers React avec ❤️</small>
      </Container>
    </footer>
  );
};

export default Footer;
