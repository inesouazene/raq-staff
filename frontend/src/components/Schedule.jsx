import { useState, useEffect } from "react";
import api from "../services/api";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import "../styles/Schedule.css"; // Importation du fichier de style
import WeekPicker from "./WeekPicker";

const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// Fonction pour obtenir les dates du lundi au dimanche pour une semaine donnée
const getWeekDates = (date) => {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 }); // Lundi de la semaine
  const end = endOfWeek(new Date(date), { weekStartsOn: 1 });     // Dimanche de la semaine

  return eachDayOfInterval({ start, end }).map(day => format(day, 'EEE dd MMM', { locale: fr }));
};

const Schedule = () => {
  const [employees, setEmployees] = useState([]);
  const [weekDate, setWeekDate] = useState(new Date()); // On stocke la date dans un objet Date
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
  }, []);

  useEffect(() => {
    // Mettre à jour les dates de la semaine chaque fois que weekDate change
    setWeekDates(getWeekDates(weekDate));
  }, [weekDate]);

  // Fonction qui sera passée à WeekPicker pour mettre à jour la date sélectionnée
  const handleWeekChange = (objWeek) => {
    setWeekDate(objWeek.date); // On met à jour la date sélectionnée
  };

  const formatEmployeeName = (fullName) => {
    const [firstName, lastName] = fullName.split(" ");
    if (lastName) {
      return `${firstName} ${lastName.charAt(0)}.`; // John D.
    }
    return firstName; // Si aucun nom de famille n'est fourni
  };


  return (
    <div className="schedule-container">
      <h1>Planning</h1>

      {/* Intégration de WeekPicker avec gestion de la sélection de la semaine */}
      <WeekPicker onChange={handleWeekChange} />

      <table className="schedule-table">
        <thead>
          <tr>
            <th>Salariés</th>
            {daysOfWeek.map((day, index) => (
              <th key={day}>
                {weekDates[index]}
              </th>
            ))}
            <th>Total</th>
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
