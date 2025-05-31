// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col } from 'react-bootstrap';
import {
  FaTicketAlt,     // Vender Ingresso
  FaCalendarCheck, // Gerenciar Sessões
  FaPhotoVideo,    // Gerenciar Filmes
  FaTv             // Gerenciar Salas
} from 'react-icons/fa';

function HomePage() {
  const quickAccessItems = [
    {
      to: "/vender-ingresso",
      icon: FaTicketAlt,
      iconColor: "text-success",
      title: "Vender Ingresso",
      text: "Acesse o formulário para registrar novas vendas de ingressos.",
      buttonVariant: "success",
      buttonText: "Vender Agora"
    },
    {
      to: "/gerenciar-sessoes", // Link para a página de gerenciamento de sessões
      icon: FaCalendarCheck,
      iconColor: "text-primary",
      title: "Gerenciar Sessões",
      text: "Visualize, adicione, edite ou delete as sessões de exibição.",
      buttonVariant: "primary",
      buttonText: "Gerenciar Sessões"
    },
    {
      to: "/filmes", // Link para a página de gerenciamento de filmes
      icon: FaPhotoVideo,
      iconColor: "text-info",
      title: "Gerenciar Filmes",
      text: "Visualize, adicione (via modal), edite ou delete os filmes.",
      buttonVariant: "info",
      buttonText: "Gerenciar Filmes"
    },
    {
      to: "/salas", // Link para a página de gerenciamento de salas
      icon: FaTv,
      iconColor: "text-warning",
      title: "Gerenciar Salas",
      text: "Gerencie as salas de exibição, suas capacidades e tipos.",
      buttonVariant: "warning",
      buttonText: "Gerenciar Salas"
    }
  ];

  return (
    <div className="mt-3">
      <Card className="text-center shadow-sm mb-4">
        <Card.Header as="h1">Bem-vindo ao CinemaApp! 🎬</Card.Header>
        <Card.Body>
          <Card.Text>
            Gerencie seu cinema de forma fácil e rápida! Explore as funcionalidades usando os atalhos ou o menu de navegação.
          </Card.Text>
        </Card.Body>
      </Card>

      <h2 className="mb-3">Acesso Rápido:</h2>
      <Row xs={1} md={2} lg={4} className="g-4">
        {quickAccessItems.map((item, index) => (
          <Col key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column align-items-center text-center">
                <item.icon size={40} className={`mb-3 ${item.iconColor}`} />
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.text}</Card.Text>
                <Button as={Link} to={item.to} variant={item.buttonVariant} className="mt-auto">
                  {item.buttonText}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HomePage;