import React from 'react';
import pizza from './images/pizza.jpg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate('/order');
  };

  return (
    <div>
      <h1>Welcome to Bloom Pizza</h1>
      <img src={pizza} alt="order-pizza" onClick={handleImageClick} style={{ cursor: 'pointer' }} />
    </div>
  );
}

export default Home;