import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import Card from "./components/Card/Card";
import Input from "./components/Input/Input";
import Modal from "./components/Modal/Modal";
import Footer from "./components/Footer/Footer";
import Button from "./components/Button/Button";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formValue, setFormValue] = useState("");

  const menuItems = [
    { label: "Home", to: "/" },
    { label: "Cursos", to: "/cursos" },
    { label: "Contato", to: "/contato" },
  ];

  const footerLinks = [
    { label: "Termos", href: "#" },
    { label: "Privacidade", href: "#" },
    { label: "Ajuda", href: "#" },
  ];

  return (
    <>
      <Menu items={menuItems} brand="Cursos Online" />

      <div className="container my-5">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="mb-4">Bem-vindo à Plataforma</h1>
                <Button onClick={() => setModalOpen(true)}>
                  Abrir Modal
                </Button>
              </>
            }
          />

          <Route
            path="/cursos"
            element={
              <div className="row">
                {[1, 2, 3].map((i) => (
                  <div className="col-md-4 mb-4" key={i}>
                    <Card
                      title={`Curso ${i}`}
                      description="Descrição resumida do curso."
                      image="https://via.placeholder.com/300x200"
                      onAction={() =>
                        alert(`Saiba mais sobre o Curso ${i}`)
                      }
                    />
                  </div>
                ))}
              </div>
            }
          />

          <Route
            path="/contato"
            element={
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Enviado: ${formValue}`);
                }}
              >
                <h2 className="mb-3">Fale conosco</h2>
                <Input
                  label="Seu e-mail"
                  id="email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  error={formValue && !formValue.includes("@") ? "Inválido" : ""}
                />
                <Button type="submit" disabled={!formValue.includes("@")}>
                  Enviar
                </Button>
              </form>
            }
          />
        </Routes>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Título do Modal"
        footer={
          <>
            <Button variant="outline-primary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                alert("Ação confirmada");
                setModalOpen(false);
              }}
            >
              Confirmar
            </Button>
          </>
        }
      >
        <p>Esse é o modal.</p>
        <Input
          label="Digite algo"
          id="example"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
      </Modal>

      <Footer links={footerLinks} />
    </>
  );
}
