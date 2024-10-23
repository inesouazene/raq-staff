// Schedule.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
  parse,
  differenceInMinutes,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Box,
	Tooltip, IconButton
} from '@mui/material';
import WeekPicker from "./WeekPicker";
import "../styles/Schedule.css";
import "../styles/TasksStyles.css";
import { AddOutlined, FileDownloadOutlined, Delete } from "@mui/icons-material";
import CustomDrawer from "./CustomDrawer";



const getWeekDates = (date) => {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(date), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map(day => format(day, 'yyyy-MM-dd'));
};

const Schedule = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [weekDate, setWeekDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState(getWeekDates(weekDate));
	const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);


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

  useEffect(() => {
    const fetchTasksForWeek = async () => {
      try {
        const start = format(startOfWeek(weekDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const end = format(endOfWeek(weekDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const tasksData = await api.getTasksByWeek(start, end);

        setTasks(tasksData);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches", error);
      }
    };

    fetchTasksForWeek();
  }, [weekDate]);

  useEffect(() => {
    setWeekDates(getWeekDates(weekDate));
  }, [weekDate]);

  const handleWeekChange = (objWeek) => {
    setWeekDate(objWeek.date);
  };

  const formatEmployeeName = (fullName) => {
    const [firstName, lastName] = fullName.split(" ");
    if (lastName) {
      return `${firstName} ${lastName.charAt(0)}.`; // John D.
    }
    return firstName;
  };

  const getTasksForEmployeeAndDate = (employeeId, date) => {
    const tasksForDay = tasks
      .filter(task => {
        const taskDate = format(parseISO(task.date_tache), 'yyyy-MM-dd');
        return task.id_salarie === employeeId && taskDate === date;
      })
      .sort((a, b) => {
        return a.heure_debut.localeCompare(b.heure_debut); // Trie par heure de début
      });

    return tasksForDay;
  };

  const calculateTaskDuration = (heure_debut, heure_fin) => {
    const start = parse(heure_debut, 'HH:mm:ss', new Date());
    const end = parse(heure_fin, 'HH:mm:ss', new Date());
    const difference = differenceInMinutes(end, start); // Différence en minutes
    return difference / 60; // Convertir en heures
  };

  const calculateTotalHoursForWeek = (employeeId) => {
    let totalHours = 0;

    weekDates.forEach((date) => {
      const tasksForDay = getTasksForEmployeeAndDate(employeeId, date);
      tasksForDay.forEach((task) => {
        totalHours += calculateTaskDuration(task.heure_debut, task.heure_fin);
      });
    });
    return totalHours.toFixed(2);
  };

const openAddDrawer = () => setIsAddDrawerOpen(true);
const closeAddDrawer = () => setIsAddDrawerOpen(false);

  return (
    <div className="schedule-container">
			<Toolbar
				className="toolbar-schedule"
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					marginBottom: 1,
				}}
			>
				{/* Section gauche pour les boutons */}
				<Box sx={{ display: 'flex', gap: 1, width: '5%' }}>
					<Tooltip title='Créer une plage horaire' placement="top">
						<IconButton
							onClick={openAddDrawer}
							sx={{
								'&:hover': {
									backgroundColor: '#8BC34A',
								},
							}}
						>
							<AddOutlined />
						</IconButton>
					</Tooltip>

					<Tooltip title='Télécharger en PDF' placement="top">
						<IconButton
							sx={{
								'&:hover': {
									backgroundColor: '#FFC107',
								},
							}}
						>
							<FileDownloadOutlined />
						</IconButton>
					</Tooltip>
				</Box>

				{/* Section centrale pour le WeekPicker */}
				<Box sx={{ flexGrow: 1, display: 'initial', justifyContent: 'center' }}>
					<WeekPicker onChange={handleWeekChange} />
				</Box>

				{/* Section droite vide pour l'équilibre */}
				<Box sx={{ width: '5%' }} /> {/* Largeur équivalente à la section des boutons */}
			</Toolbar>

      {/* Utilisation de Material-UI Table */}
      <TableContainer component={Paper}>
        <Table aria-label="schedule table">
          <TableHead>
            <TableRow>
              <TableCell className="employee-header">Salariés</TableCell>
              {weekDates.map((date) => (
                <TableCell key={date} className="days">
                  {format(new Date(date), 'EEE dd MMM', { locale: fr })}
                </TableCell>
              ))}
              <TableCell className="total-header" sx={{ width: 'auto' }}>Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{formatEmployeeName(employee.name)}</TableCell>
                {weekDates.map((date) => {
                  const tasksForDay = getTasksForEmployeeAndDate(employee.id, date);

                  return (
                    <TableCell key={date}>
                      {tasksForDay.length > 0 ? (
                        tasksForDay.map((task) => {
                          const taskStyle = {
                            border: `3px dashed ${task.couleur}`,
                          };

                          return (
                            <div key={task.id} className="task" style={taskStyle} >

                              <span className="task-time">
                                {format(parse(task.heure_debut, 'HH:mm:ss', new Date()), 'HH:mm')} - {format(parse(task.heure_fin, 'HH:mm:ss', new Date()), 'HH:mm')}
                              </span><br />
                              <span className="task-title">{task.nom_type_tache}</span><br />
															<div className="delete-task">
															<IconButton
																aria-label="delete"
																size="small"
																sx={{
																	color: '#EF5350',
																	'&:hover': {
																		backgroundColor: '#FFEBEE',
																	},

																}}
															>
																<Delete fontSize="inherit" />
															</IconButton>
															</div>
                            </div>
                          );
                        })
                      ) : null}
                    </TableCell>
                  );
                })}
                <TableCell className="hoursPerWeek">{calculateTotalHoursForWeek(employee.id)} h</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
			<CustomDrawer
				isOpen={isAddDrawerOpen}
				onClose={closeAddDrawer}
				title="Ajouter une plage horaire"
			>
				{/* Le contenu du formulaire sera ajouté ici plus tard */}
				<p>Formulaire d&lsquo;ajout de plage horaire à venir</p>
			</CustomDrawer>
    </div>
  );
};

export default Schedule;
