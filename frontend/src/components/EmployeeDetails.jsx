// components/EmployeeDetails.js
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function EmployeeDetails() {
  const [employee, setEmployee] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/employees/${id}`);
        if (!response.ok) {
          throw new Error('Employé non trouvé');
        }
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'employé', error);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  if (!employee) {
    return <div>Chargement...</div>;
  }

	  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div>
      <h2>Infos du salarié</h2>
      <p>Nom : {employee.nom}</p>
      <p>Prénom : {employee.prenom}</p>
			<p>Date de naissance : {formatDate(employee.date_naissance)}</p>
      <p>Email : {employee.email}</p>
      <p>Téléphone : {employee.telephone}</p>
			<p>Type de contrat : {employee.type_contrat}</p>
			<p>Temps de travail : {employee.heures_contrat} heures/semaine</p>
      {/* Ajoutez d'autres détails selon votre modèle de données */}
      <Link to="/employees">Retour à la liste</Link>
    </div>
  );
}

export default EmployeeDetails;
