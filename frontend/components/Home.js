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
      <h1>Welcome to Pizza Order</h1>
      <img src="./images/pizza.jpg" alt="order-pizza" onClick={handleImageClick} style={{ cursor: 'pointer' }} />
    </div>
  );
}

export default Home;