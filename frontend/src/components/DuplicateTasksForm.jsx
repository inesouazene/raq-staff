import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Box, Divider, Typography, TextField, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { ClearOutlined, ContentCopyRounded } from "@mui/icons-material";
import api from "../services/api";

const DuplicateTasksForm = ({ onClose, onDuplicate }) => {
  const [sourceWeek, setSourceWeek] = useState({ start: null, end: null });
  const [destinationWeeks, setDestinationWeeks] = useState([]);

  const handleWeekSelection = (date, setWeek) => {
    if (!date) return;
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    setWeek({ start, end });
  };

  const addDestinationWeek = (date) => {
    if (!date) return;
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    setDestinationWeeks((prevWeeks) => [...prevWeeks, { start, end }]);
  };

  const removeDestinationWeek = (index) => {
    setDestinationWeeks((prevWeeks) => prevWeeks.filter((_, i) => i !== index));
  };

  const handleDuplicate = async () => {
    if (!sourceWeek.start || destinationWeeks.length === 0) {
      alert("Veuillez sélectionner la semaine source et au moins une semaine de destination.");
      return;
    }
    try {
      const data = {
        sourceWeek: {
          start: format(sourceWeek.start, "yyyy-MM-dd"),
          end: format(sourceWeek.end, "yyyy-MM-dd"),
        },
        destinationWeeks: destinationWeeks.map(week => ({
          start: format(week.start, "yyyy-MM-dd"),
          end: format(week.end, "yyyy-MM-dd"),
        })),
      };

      console.log("Données envoyées pour duplication :", data);

      await api.duplicateTasks(data);
      alert("Les tâches ont été dupliquées avec succès !");
      onDuplicate();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la duplication des tâches :", error);
      alert("Erreur lors de la duplication des tâches.");
    }
  };

  return (
    <Box sx={{ padding: "20px", display: "flex", flexDirection: "column", gap: 2 }}>
      <Divider
        textAlign="left"
        sx={{ fontVariant: "small-caps", fontWeight: "bold", fontSize: 16, marginTop: 2 }}
      >
        Semaine source
      </Divider>

      <DatePicker
        label="Sélectionnez une date"
        onChange={(date) => handleWeekSelection(date, setSourceWeek)}
        textField={(params) => <TextField {...params} />}
        sx={{ width: '50%', alignSelf: 'center' }}
      />
      {sourceWeek.start && sourceWeek.end && (
        <Typography variant="body2" color="textSecondary">
          <b>Semaine source : </b>{format(sourceWeek.start, "dd MMM")} au {format(sourceWeek.end, "dd MMM yyyy")}
        </Typography>
      )}

      <Divider
        textAlign="left"
        sx={{ fontVariant: "small-caps", fontWeight: "bold", fontSize: 16, marginTop: 2 }}
      >
        Semaine(s) de destination
      </Divider>

      <DatePicker
        label="Sélectionnez une date"
        onChange={addDestinationWeek}
        textField={(params) => <TextField {...params} />}
        sx={{ width: '50%', alignSelf: 'center' }}
      />

      {destinationWeeks.length > 0 && (
        <Box sx={{ marginTop: 2 }}>
          {destinationWeeks.map((week, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                <b>Semaine {index + 1} : </b>
                {format(week.start, "dd")} au {format(week.end, "dd MMM yyyy")}
              </Typography>
              <IconButton
                color="error"
                onClick={() => removeDestinationWeek(index)}
              >
                <ClearOutlined />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Divider variant="middle" sx={{ marginTop: 3, fontWeight: 10, width: '75%', alignSelf: 'center' }} />

      <Button
        variant="contained"
        color="secondary"
        startIcon={<ContentCopyRounded />}
        onClick={handleDuplicate}
        fullWidth
        sx={{ marginTop: 2, width: '50%', fontWeight: 'bold', color: 'white', alignSelf: 'center' }}
      >
        Dupliquer
      </Button>
    </Box>
  );
};

DuplicateTasksForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
};

export default DuplicateTasksForm;
