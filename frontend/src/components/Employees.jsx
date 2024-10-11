// components/Employees.js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5001/employees");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des employés', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <h2>Liste des Employés</h2>
      {employees.length > 0 ? (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              <Link to={`/employees/${employee.id}`}>{employee.nom} {employee.prenom}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Chargement des employés...</p>
      )}
    </div>
  );
}

export default Employees;
