import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Checkbox,
  MenuItem,
  ListItemText,
  Autocomplete,
  Select,
  Box,
	FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format, addMinutes, setHours, setMinutes } from 'date-fns';
import api from '../services/api';

const AddTasksForm = ({ onSubmit, onClose }) => {
  const [date, setDate] = useState(new Date());
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [taskType, setTaskType] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [pause, setPause] = useState('');

  const generateTimeOptions = () => {
    const startTime = setHours(setMinutes(new Date(), 0), 0);
    const endTime = setHours(setMinutes(new Date(), 0), 23);
    const options = [];
    for (let time = startTime; time <= endTime; time = addMinutes(time, 30)) {
      options.push(format(time, 'HH:mm'));
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const pauseOptions = [
    { label: '20mn', value: 20 },
    { label: '30mn', value: 30 },
    { label: '45mn', value: 45 },
    { label: '1h', value: 60 },
    { label: '1h30', value: 90 },
    { label: '2h', value: 120 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const employeesData = await api.getAllEmployees();
      const taskTypesData = await api.getTaskTypes();
      setEmployees(employeesData);
      setTaskTypes(taskTypesData);
    };
    fetchData();
  }, []);

  const handleDateChange = (newDate) => setDate(newDate);
  const handleStartTimeChange = (event, newValue) => setHeureDebut(newValue);
  const handleEndTimeChange = (event, newValue) => setHeureFin(newValue);
  const handleTaskTypeChange = (event) => setTaskType(event.target.value);
  const handleEmployeesChange = (event) => setSelectedEmployees(event.target.value);
  const handlePauseChange = (event, newValue) => setPause(newValue);

  const handleSubmit = () => {
    const formData = {
      date_tache: format(date, 'yyyy-MM-dd'),
      heure_debut: heureDebut,
      heure_fin: heureFin,
      id_type_tache: taskType,
      id_salarie: selectedEmployees,
      pause: parsePause(pause),
    };
    onSubmit(formData);
    onClose();
  };

  const parsePause = (pauseLabel) => {
    const selectedOption = pauseOptions.find((option) => option.label === pauseLabel);
    if (selectedOption) return selectedOption.value;
    const customMinutes = parseInt(pauseLabel, 10);
    return !isNaN(customMinutes) ? customMinutes : 0;
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', gap: 2 }}>
      {/* Première colonne avec tous les champs sauf Pause */}
      <Box sx={{ flex: 1 }}>
        <DatePicker
          label="Date de la tâche"
          value={date}
          onChange={handleDateChange}
          required
          slots={{ textField: TextField }}
          slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
        />

        <Box sx={{ display: 'flex', gap: 2, marginTop: 1 }}>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              freeSolo
              options={timeOptions}
              value={heureDebut}
              onInputChange={handleStartTimeChange}
              onChange={handleStartTimeChange}
              renderInput={(params) => (
                <TextField {...params} label="Début" fullWidth required />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Autocomplete
              freeSolo
              options={timeOptions}
              value={heureFin}
              onInputChange={handleEndTimeChange}
              onChange={handleEndTimeChange}
              renderInput={(params) => (
                <TextField {...params} label="Fin" fullWidth required />
              )}
            />
          </FormControl>
        </Box>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Type de tâche</InputLabel>
          <Select
            label="Type de tâche"
            value={taskType}
            onChange={handleTaskTypeChange}
          >
            {taskTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
								{type.nom}
							{/* Pastille carrée colorée */}
							<Box
								component="span"
								sx={{
									width: 12,
									height: 12,
									backgroundColor: type.couleur,
									display: 'inline-block',
									marginLeft: 1,
									borderRadius: '8px', // Pour un effet légèrement arrondi
								}}
							/>
						</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Salariés</InputLabel>
          <Select
            label="Salariés"
            multiple
            value={selectedEmployees}
            onChange={handleEmployeesChange}
            renderValue={(selected) =>
              selected
                .map((id) => {
                  const employee = employees.find((emp) => emp.id === id);
                  return employee ? `${employee.name}` : id;
                })
                .join(', ')
            }
          >
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                <Checkbox checked={selectedEmployees.indexOf(employee.id) > -1} />
                <ListItemText primary={`${employee.name}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ marginTop: 2 }}
          disabled={!date || !heureDebut || !heureFin || !taskType || selectedEmployees.length === 0} // Désactiver le bouton si les champs requis sont vides
        >
          Ajouter
        </Button>
      </Box>

      {/* Deuxième colonne pour le champ Pause */}
      <Box sx={{ width: '30%' }}>
        <FormControl fullWidth margin="normal">
          <Autocomplete
            freeSolo
            options={pauseOptions.map(option => option.label)}
            value={pause}
            onInputChange={handlePauseChange}
            onChange={(event, newValue) => handlePauseChange(event, newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Pause" placeholder="Durée" fullWidth />
            )}
          />
					<FormHelperText id="component-helper-text" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>
          Optionnel
        	</FormHelperText>
        </FormControl>
      </Box>
    </Box>
  );
};

AddTasksForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddTasksForm;
