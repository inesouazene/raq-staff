// components/HomePage.js
import { useEffect, useState } from 'react';

function HomePage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        const response = await fetch("http://localhost:5001/");
        const data = await response.text();
        setMessage(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du message de bienvenue', error);
        setMessage('Erreur lors du chargement du message de bienvenue');
      }
    };

    fetchWelcomeMessage();
  }, []);

  return (
    <div>
      <h1>{message}</h1>

    </div>
  );
}

export default HomePage;
