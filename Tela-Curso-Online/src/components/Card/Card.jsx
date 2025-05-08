import React from 'react';
import Button from '../Button/Button';

export default function Card({
  image,
  title,
  description,
  actionLabel = 'Saiba mais',
  onAction,
  className = '',
}) {
  return (
    <div className={`card ${className}`} style={{ width: '18rem' }}>
      {image && <img src={image} className="card-img-top" alt={title} />}
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        {onAction && <Button onClick={onAction}>{actionLabel}</Button>}
      </div>
    </div>
  );
}
