// src/components/Schedule.jsx

import { useState, useEffect, useCallback } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, parse, differenceInMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Box, Tooltip, IconButton, Snackbar, Alert, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText, Button } from "@mui/material";
import { AddOutlined, FileDownloadOutlined, DeleteForever, PauseCircleOutlined, ContentCopyRounded } from "@mui/icons-material";
import api from "../services/api";
import WeekPicker from "./WeekPicker";
import AddTasksForm from "./AddTasksForm";
import UpdateTasksForm from "./UpdateTasksForm";
import CustomDrawer from "./CustomDrawer";
import DuplicateTasksForm from "./DuplicateTasksForm";
import GeneratePDF from "./GeneratePDF";
import "../styles/Schedule.css";
import "../styles/TasksStyles.css";


const getWeekDates = (date) => {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(date), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map((day) => format(day, "yyyy-MM-dd"));
};

const Schedule = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [weekDate, setWeekDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState(getWeekDates(weekDate));
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
	const [duplicateAlertOpen, setDuplicateAlertOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
	const [isDuplicateDrawerOpen, setIsDuplicateDrawerOpen] = useState(false);


  // Fonction pour charger les tâches de la semaine
  const fetchTasksForWeek = useCallback(async () => {
    try {
      const start = format(startOfWeek(weekDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const end = format(endOfWeek(weekDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const tasksData = await api.getTasksByWeek(start, end);
      setTasks(tasksData);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches", error);
    }
  }, [weekDate]);

  // Soumission du formulaire d'ajout de tâche
  const handleTaskSubmit = async (formData) => {
    try {
      await api.addTask(formData);
      await fetchTasksForWeek(); // Rafraîchit les tâches après ajout
      setAlertOpen(true); // Affiche l'alerte
    } catch (error) {
      console.error("Erreur lors de l'ajout de la plage horaire", error);
    }
  };

  // Formulaire de mise à jour de tâche
  const handleUpdateTaskSubmit = async (formData) => {
    try {
      await api.updateTask(selectedTaskId, formData);  // Update task by ID
      await fetchTasksForWeek();
      setIsUpdateDrawerOpen(false); // Close drawer after update
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche", error);
    }
  };

  // Ouverture et fermeture du drawer d'ajout
  const openAddDrawer = () => setIsAddDrawerOpen(true);
  const closeAddDrawer = () => setIsAddDrawerOpen(false);

  // Fonction pour fermer l'alerte d'ajout automatiquement
  const handleAlertClose = () => setAlertOpen(false);

  // Fonction pour fermer l'alerte de suppression automatiquement
  const handleDeleteAlertClose = () => setDeleteAlertOpen(false);

	// Fonction pour fermer l'alerte de duplication automatiquement
	const handleDuplicateAlertClose = () => setDuplicateAlertOpen(false);

  // Ouverture et fermeture du drawer de mise à jour
  const openUpdateDrawer = (taskId) => {
    setSelectedTaskId(taskId);
    setIsUpdateDrawerOpen(true);
  };
  const closeUpdateDrawer = () => {
    setIsUpdateDrawerOpen(false);
    setSelectedTaskId(null);
  }

	// Fonction pour ouvrir/fermer le drawer de duplication
	const openDuplicateDrawer = () => setIsDuplicateDrawerOpen(true);
	const closeDuplicateDrawer = () => setIsDuplicateDrawerOpen(false);

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

  // Chargement des tâches de la semaine lors du changement de semaine
  useEffect(() => {
    fetchTasksForWeek();
  }, [fetchTasksForWeek]);

  // Mise à jour des dates de la semaine
  useEffect(() => {
    setWeekDates(getWeekDates(weekDate));
  }, [weekDate]);

  const handleWeekChange = (objWeek) => {
    setWeekDate(objWeek.date);
  };

	const formatEmployeeName = (fullName) => {
		const [firstName, lastName] = fullName.split(" ");
		const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
		return lastName ? `${formattedFirstName} ${lastName.charAt(0).toUpperCase()}.` : formattedFirstName;
	};

  const getTasksForEmployeeAndDate = (employeeId, date) => {
    return tasks
      .filter((task) => task.id_salarie === employeeId && format(parseISO(task.date_tache), "yyyy-MM-dd") === date)
      .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));
  };

  const calculateTaskDuration = (heure_debut, heure_fin, pause = 0) => {
    const start = parse(heure_debut, "HH:mm:ss", new Date());
    const end = parse(heure_fin, "HH:mm:ss", new Date());
    const difference = differenceInMinutes(end, start) - pause; // Soustraction de la pause
    return Math.max(difference / 60, 0); // Convertir en heures et s'assurer que le résultat est non négatif
  };

  const calculateTotalHoursForWeek = (employeeId) => {
    let totalHours = 0;
    weekDates.forEach((date) => {
      const tasksForDay = getTasksForEmployeeAndDate(employeeId, date);
      tasksForDay.forEach((task) => {
        totalHours += calculateTaskDuration(task.heure_debut, task.heure_fin, task.pause || 0);
      });
    });
    return totalHours.toFixed(2);
  };

  // Fonction pour formater la durée de la pause en heures et minutes
  const formatPause = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h${remainingMinutes}mn`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${remainingMinutes}mn`;
    }
  };

  // Fonction pour demander la confirmation de suppression
  const handleDeleteTaskClick = (taskId) => {
    setSelectedTaskId(taskId); // Enregistre l'ID de la tâche sélectionnée
    setOpenDeleteDialog(true); // Ouvre le dialog
  };

  // Fonction pour confirmer et supprimer la tâche
  const confirmDeleteTask = async () => {
    try {
      await api.deleteTask(selectedTaskId); // Supprime la tâche avec l'ID sélectionné
      await fetchTasksForWeek(); // Rafraîchit la liste des tâches
      setOpenDeleteDialog(false); // Ferme le dialog
      setDeleteAlertOpen(true); // Affiche l'alerte
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche", error);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Ferme le dialog sans supprimer
    setSelectedTaskId(null); // Réinitialise l'ID de la tâche
  };

	const { generatePDF } = GeneratePDF({
		employees,
		weekDates,
		weekDate,
		getTasksForEmployeeAndDate,
		calculateTotalHoursForWeek,
		formatEmployeeName,
		formatPause
	});

  return (
    <div className="schedule-container">
      <Toolbar
        className="toolbar-schedule"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, width: "5%" }}>
          <Tooltip title="Créer une plage horaire" placement="top">
            <IconButton
              onClick={openAddDrawer}
              sx={{
                "&:hover": {
                  backgroundColor: "#8BC34A",
                },
              }}
            >
              <AddOutlined />
            </IconButton>
          </Tooltip>

          <Tooltip title="Télécharger en PDF" placement="top">
						<IconButton
							onClick={generatePDF}
							sx={{
								"&:hover": {
									backgroundColor: "#FFC107",
								},
							}}
						>
							<FileDownloadOutlined />
						</IconButton>
					</Tooltip>

          <Tooltip title="Dupliquer le planning" placement="top">
						<IconButton
							onClick={openDuplicateDrawer}
							sx={{
								"&:hover": {
									backgroundColor: "#007acc",
								},
							}}
						>
							<ContentCopyRounded />
						</IconButton>
					</Tooltip>
        </Box>

        <Box sx={{ flexGrow: 1, display: "initial", justifyContent: "center" }}>
          <WeekPicker onChange={handleWeekChange} />
        </Box>

        <Box sx={{ width: "5%" }} />
      </Toolbar>

      <TableContainer component={Paper} id="schedule-table">
        <Table aria-label="schedule table">
          <TableHead>
            <TableRow>
              <TableCell className="employee-header">Salariés</TableCell>
              {weekDates.map((date) => (
                <TableCell key={date} className="days">
                  {format(new Date(date), "EEE dd MMM", { locale: fr })}
                </TableCell>
              ))}
              <TableCell className="total-header" sx={{ width: "auto" }}>Total</TableCell>
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
                      {tasksForDay.map((task) => (
                        <div key={task.id} className="task" onClick={() => openUpdateDrawer(task.id)} style={{ borderLeft: `5px solid ${task.couleur}` }}>
                          <span className="task-time">
                            {format(parse(task.heure_debut, "HH:mm:ss", new Date()), "HH:mm")} - {format(parse(task.heure_fin, "HH:mm:ss", new Date()), "HH:mm")}
                          </span>
                          <br />
                          <span className="task-title">{task.nom_type_tache}</span><br />
                          {task.pause > 0 && (
                            <span className="task-pause"><PauseCircleOutlined sx={{ width: '30%' }}/> {formatPause(task.pause)}</span>
                          )}
                          <div className="delete-task">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              sx={{ color: "#E53935", "&:hover": { backgroundColor: "#FFEBEE" } }}
                              onClick={(event) => {
                                event.stopPropagation(); // Empêche l'ouverture du Drawer
                                handleDeleteTaskClick(task.id); // Exécute uniquement la suppression
                              }}
                            >
                              <DeleteForever fontSize="inherit" />
                            </IconButton>

                          </div>
                        </div>
                      ))}

                    </TableCell>
                  );
                })}
                <TableCell className="hoursPerWeek">{calculateTotalHoursForWeek(employee.id)} h</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomDrawer isOpen={isAddDrawerOpen} onClose={closeAddDrawer} title="Créer une plage horaire">
        <AddTasksForm onSubmit={handleTaskSubmit} onClose={closeAddDrawer} />
      </CustomDrawer>

      {isUpdateDrawerOpen && selectedTaskId && (
        <CustomDrawer isOpen={isUpdateDrawerOpen} onClose={closeUpdateDrawer} title="Détails de la plage horaire">
          <UpdateTasksForm taskId={selectedTaskId} onUpdate={handleUpdateTaskSubmit} onClose={closeUpdateDrawer} />
        </CustomDrawer>
      )}

			{/* Drawer de duplication */}
      <CustomDrawer isOpen={isDuplicateDrawerOpen} onClose={closeDuplicateDrawer} title="Dupliquer un planning">
        <DuplicateTasksForm
					onClose={closeDuplicateDrawer}
					onDuplicate={() => {
						fetchTasksForWeek();
						setDuplicateAlertOpen(true);
					}}
				/>
      </CustomDrawer>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cette plage horaire ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary" sx={{ fontWeight: 'bold' }}>
            Annuler
          </Button>
          <Button onClick={confirmDeleteTask} color="error" autoFocus sx={{ fontWeight: 'bold' }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerte avec Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={5000} // Durée de 5 secondes
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position de l'alerte
      >
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          Plage horaire ajoutée avec succès !
        </Alert>
      </Snackbar>

			<Snackbar
        open={deleteAlertOpen}
        autoHideDuration={5000}
        onClose={handleDeleteAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleDeleteAlertClose} severity="success" sx={{ width: '100%' }}>
          Plage horaire supprimée avec succès !
        </Alert>
      </Snackbar>

			<Snackbar
        open={duplicateAlertOpen}
        autoHideDuration={5000} // Durée de 5 secondes
        onClose={handleDuplicateAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position de l'alerte
      >
        <Alert onClose={handleDuplicateAlertClose} severity="success" sx={{ width: '100%' }}>
          Le planning a été dupliqué avec succès !
        </Alert>
      </Snackbar>

    </div>
  );
};

export default Schedule;
