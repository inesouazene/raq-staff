import { useState, useEffect } from "react";
import api from "../services/api";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import "../styles/Schedule.css"; // Importation du fichier de style

const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// Fonction pour obtenir les dates du lundi au dimanche pour une semaine donnée
const getWeekDates = (date) => {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 }); // Lundi de la semaine
  const end = endOfWeek(new Date(date), { weekStartsOn: 1 });     // Dimanche de la semaine

  // Formater les dates comme "Lun. 00 oct"
  return eachDayOfInterval({ start, end }).map(day => format(day, 'EEE dd MMM', { locale: fr }));
};

// Fonction pour formater la plage de dates au format "du 00/00/000 au 00/00/000"
const getWeekRange = (date) => {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 }); // Lundi de la semaine
  const end = endOfWeek(new Date(date), { weekStartsOn: 1 });     // Dimanche de la semaine

  const startFormatted = format(start, 'dd/MM/yyyy', { locale: fr }); // Ex: 22/11/2024
  const endFormatted = format(end, 'dd/MM/yyyy', { locale: fr });     // Ex: 28/11/2024

  return `du ${startFormatted} au ${endFormatted}`;
};

const formatEmployeeName = (fullName) => {
  const [firstName, lastName] = fullName.split(" ");
  if (lastName) {
    return `${firstName} ${lastName.charAt(0)}.`; // John D.
  }
  return firstName; // Si aucun nom de famille n'est fourni
};


const Schedule = () => {
  const [employees, setEmployees] = useState([]);
  const [weekDate, setWeekDate] = useState(new Date().toISOString().split('T')[0]); // Date de référence pour la semaine
  const [weekDates, setWeekDates] = useState(getWeekDates(weekDate)); // Dates du lundi au dimanche

  useEffect(() => {
    // Fonction pour charger les employés et leur planning pour la semaine en cours
    const fetchData = async () => {
      try {
        const employeesData = await api.getAllEmployees();
        setEmployees(employeesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchData();
  }, [weekDate]); // Recharger les données si la semaine change

  useEffect(() => {
    // Mettre à jour les dates de la semaine chaque fois que weekDate change
    setWeekDates(getWeekDates(weekDate));
  }, [weekDate]);

  // Gestion de la navigation entre les semaines (précédente et suivante)
  const previousWeek = () => {
    const newDate = new Date(weekDate);
    newDate.setDate(newDate.getDate() - 7); // Reculer de 7 jours
    setWeekDate(newDate.toISOString().split('T')[0]);
  };

  const nextWeek = () => {
    const newDate = new Date(weekDate);
    newDate.setDate(newDate.getDate() + 7); // Avancer de 7 jours
    setWeekDate(newDate.toISOString().split('T')[0]);
  };

  return (
    <div className="schedule-container">
      {/* Affichage de la plage de dates de la semaine */}
      <h2>Semaine {getWeekRange(weekDate)}</h2>

      <div className="week-navigation">
        <button onClick={previousWeek}>Semaine précédente</button>
        <button onClick={nextWeek}>Semaine suivante</button>
      </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th>Salariés</th>
            {/* Affichage des jours de la semaine avec la date correspondante */}
            {daysOfWeek.map((day, index) => (
              <th key={day}>
                 {weekDates[index]} {/* Date affichée sous le nom du jour */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{formatEmployeeName(employee.name)}</td>
              {daysOfWeek.map((day) => (
                <td key={day}>
                  {/* Récupérer et afficher les horaires ici */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
