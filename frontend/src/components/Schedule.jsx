import { useState, useEffect } from "react";
import api from "../services/api";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, parse, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import "../styles/Schedule.css";
import "../styles/TasksStyles.css"
import WeekPicker from "./WeekPicker";

// Fonction pour obtenir les dates du lundi au dimanche pour une semaine donnée
const getWeekDates = (date) => {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(date), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map(day => format(day, 'yyyy-MM-dd')); // Format YYYY-MM-DD
};

const Schedule = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [weekDate, setWeekDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState(getWeekDates(weekDate));

  // Chargement des employés
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await api.getAllEmployees();
        setEmployees(employeesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données des employés", error);
      }
    };
    fetchData();
  }, []);

  // Récupérer les tâches pour la semaine sélectionnée
	useEffect(() => {
		const fetchTasksForWeek = async () => {
			try {
				const start = format(startOfWeek(weekDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
				const end = format(endOfWeek(weekDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
				const tasksData = await api.getTasksByWeek(start, end);

				console.log("Taches récupérées:", tasksData);
				setTasks(tasksData);
			} catch (error) {
				console.error("Erreur lors de la récupération des tâches", error);
			}
		};

		fetchTasksForWeek();
	}, [weekDate]);


  // Mettre à jour les dates de la semaine chaque fois que weekDate change
  useEffect(() => {
    setWeekDates(getWeekDates(weekDate));
  }, [weekDate]);

  // Fonction passée à WeekPicker pour mettre à jour la date sélectionnée
  const handleWeekChange = (objWeek) => {
    setWeekDate(objWeek.date);
  };

  // Fonction de formatage du nom du salarié
  const formatEmployeeName = (fullName) => {
    const [firstName, lastName] = fullName.split(" ");
    if (lastName) {
      return `${firstName} ${lastName.charAt(0)}.`; // John D.
    }
    return firstName; // Si aucun nom de famille n'est fourni
  };

  // Fonction pour trouver et trier toutes les tâches correspondant à un salarié et une date donnée
  const getTasksForEmployeeAndDate = (employeeId, date) => {
    const tasksForDay = tasks
      .filter(task => {
        const taskDate = format(parseISO(task.date_tache), 'yyyy-MM-dd');
        return task.id_salarie === employeeId && taskDate === date;
      })
      .sort((a, b) => {
        // Compare les heures de début pour trier les tâches
        return a.heure_debut.localeCompare(b.heure_debut); // Trie par heure de début
      });

    return tasksForDay; // Renvoie les tâches triées par heure
  };

	// Fonction pour calculer la durée en heures d'une tâche
	const calculateTaskDuration = (heure_debut, heure_fin) => {
  const start = parse(heure_debut, 'HH:mm:ss', new Date());
  const end = parse(heure_fin, 'HH:mm:ss', new Date());
  const difference = differenceInMinutes(end, start); // Différence en minutes
  return difference / 60; // Convertir en heures
	};

	// Fonction pour calculer les heures totales d'un salarié sur une semaine
	const calculateTotalHoursForWeek = (employeeId) => {
  let totalHours = 0;

  // Parcourir chaque jour de la semaine et calculer les heures
  weekDates.forEach((date) => {
    const tasksForDay = getTasksForEmployeeAndDate(employeeId, date);

    // Additionner la durée de chaque tâche
    tasksForDay.forEach((task) => {
      totalHours += calculateTaskDuration(task.heure_debut, task.heure_fin);
    });
  });
  return totalHours.toFixed(2); // Retourner le total avec deux décimales
	};

  return (
    <div className="schedule-container">
      <h1>Planning</h1>

      {/* Intégration de WeekPicker */}
      <WeekPicker onChange={handleWeekChange} />

      <table className="schedule-table">
        <thead>
          <tr>
            <th className="employee-header">Salariés</th>
              {weekDates.map((date) => (
                <th key={date}>
                  {format(new Date(date), 'EEE dd MMM', { locale: fr })} {/* 'EEE' affiche le nom abrégé du jour */}
                </th>
            ))}
            <th className="total-header">Total</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="employee-name">{formatEmployeeName(employee.name)}</td>
              {weekDates.map((date) => {
                const tasksForDay = getTasksForEmployeeAndDate(employee.id, date);

                return (
                  <td key={date}>
                    {tasksForDay.length > 0 ? (
                      tasksForDay.map((task) => {
												console.log(task);

												// Style dynamique basé sur la couleur de la tâche
												const taskStyle = {
													border: `3px dashed ${task.couleur}`,
												};

												return (
													<div key={task.id} className="task" style={taskStyle}>
														<span className="task-time">
															{format(parse(task.heure_debut, 'HH:mm:ss', new Date()), 'HH:mm')} - {format(parse(task.heure_fin, 'HH:mm:ss', new Date()), 'HH:mm')}
														</span><br />
														<span className="task-title">{task.nom_type_tache}</span>
													</div>
												);
											})
                    ) : null}   {/* Si aucune tâche, la cellule est vide */}
                  </td>
                );
              })}
              <td className="total-hours">
								{calculateTotalHoursForWeek(employee.id)} heures
							</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Schedule;
