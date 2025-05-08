import React from 'react';

export default function Footer({ links = [] }) {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-muted">
            © {new Date().getFullYear()} Plataforma de Cursos Online.
          </div>
          <div className="col-md-6">
            <ul className="list-inline mb-0 text-md-end">
              {links.map(({ label, href }) => (
                <li key={href} className="list-inline-item mx-2">
                  <a href={href} className="text-decoration-none text-muted">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
