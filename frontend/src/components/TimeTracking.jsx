import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Select, MenuItem, Box, IconButton, Tabs, Tab } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { format, endOfWeek, eachWeekOfInterval, startOfYear, endOfYear, getMonth } from "date-fns";
import { fr } from "date-fns/locale";
import api from "../services/api";
import '../styles/TimeTracking.css';

const getWeekRanges = (startDate, endDate, ascending = true) => {
  const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 }).map((weekStart) => ({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 }),
  }));
  return ascending ? weeks : weeks.reverse();
};

const calculateMonthlyData = (weeklyData) => {
  const monthlyData = {};

  weeklyData.forEach((week) => {
    const month = getMonth(new Date(week.weekStart)) + 1; // getMonth() is zero-based
    Object.entries(week).forEach(([employeeId, hours]) => {
      if (employeeId !== "week" && employeeId !== "weekStart") {
        monthlyData[month] = monthlyData[month] || {};
        monthlyData[month][employeeId] = (monthlyData[month][employeeId] || 0) + hours;
      }
    });
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month: month,
    ...data,
  }));
};

const TimeTracking = () => {
  const [employees, setEmployees] = useState([]);
  const [timeTrackingData, setTimeTrackingData] = useState([]);
  const [monthlyTrackingData, setMonthlyTrackingData] = useState([]);
  const [weekRanges, setWeekRanges] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [totals, setTotals] = useState({});
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await api.getAllEmployees();
        setEmployees(employeesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données des employés :", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const initializeWeekRanges = () => {
      const startDate = startOfYear(new Date(selectedYear, 0, 1));
      const endDate = endOfYear(new Date(selectedYear, 0, 1));
      setWeekRanges(getWeekRanges(startDate, endDate, ascendingOrder));
    };

    initializeWeekRanges();
  }, [selectedYear, ascendingOrder]);

  useEffect(() => {
    const fetchTimeTrackingData = async () => {
      try {
        let yearlyTotals = {};

        const data = await Promise.all(
          weekRanges.map(async ({ start, end }) => {
            const tasks = await api.getTasksByWeek(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
            const weeklyData = employees.reduce((acc, employee) => {
              const totalHours = tasks
                .filter((task) => task.id_salarie === employee.id)
                .reduce((sum, task) => {
                  const start = task.heure_debut;
                  const end = task.heure_fin;
                  const pause = task.pause || 0;
                  const duration = (new Date(`1970-01-01T${end}Z`) - new Date(`1970-01-01T${start}Z`)) / 3600000 - pause / 60;
                  return sum + Math.max(duration, 0);
                }, 0);

              const hours = parseFloat(totalHours.toFixed(2));
              yearlyTotals[employee.id] = (yearlyTotals[employee.id] || 0) + hours;
              return { ...acc, [employee.id]: hours };
            }, {});

            return { week: `${format(start, "dd MMM", { locale: fr })} - ${format(end, "dd MMM yyyy", { locale: fr })}`, weekStart: start, ...weeklyData };
          })
        );

        setTimeTrackingData(data);
        setTotals(yearlyTotals);
        setMonthlyTrackingData(calculateMonthlyData(data));
      } catch (error) {
        console.error("Erreur lors de la récupération des données de suivi :", error);
      }
    };

    if (employees.length && weekRanges.length) {
      fetchTimeTrackingData();
    }
  }, [employees, weekRanges]);

  const formatEmployeeName = (fullName) => {
    const [firstName, lastName] = fullName.split(" ");
    const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    return lastName ? `${formattedFirstName} ${lastName.charAt(0).toUpperCase()}.` : formattedFirstName;
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const toggleSortOrder = () => {
    setAscendingOrder((prev) => !prev);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div className="time-tracking-container">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box className="tabs">
          <Typography variant="h7" sx={{ fontStyle: 'italic', marginRight: 2, verticalAlign: 'middle' }}>Suivi par : </Typography>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Time Tracking Tabs">
            <Tab label="Semaine" />
            <Tab label="Mois" />
            <Tab label="Année" />
          </Tabs>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h8" sx={{ marginRight: 2 }}>Année</Typography>
          <Select size="small" value={selectedYear} onChange={handleYearChange} variant="outlined" sx={{ minWidth: 100, marginRight: 2 }}>
            {[...Array(2)].map((_, index) => {
              const year = new Date().getFullYear() - index;
              return <MenuItem key={year} value={year}>{year}</MenuItem>;
            })}
          </Select>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table
          stickyHeader
          aria-label="Suivi des heures"
          className={tabIndex === 2 ? "annual-table" : ""}
        >
          <TableHead sx={{ backgroundColor: "#e0e0e0", position: "sticky", top: 0, zIndex: 1 }}>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>
                {tabIndex === 0 ? "Semaine" : tabIndex === 1 ? "Mois" : "Employé"}
                {tabIndex !== 2 && (
                  <IconButton onClick={toggleSortOrder} size="small">
                    {ascendingOrder ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                  </IconButton>
                )}
              </TableCell>
              {tabIndex !== 2 && employees.map((employee) => (
                <TableCell key={employee.id} align="center">{formatEmployeeName(employee.name)}</TableCell>
              ))}
              {tabIndex === 2 && <TableCell align="center">Total Annuel (heures)</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {tabIndex === 0 && timeTrackingData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.week}</TableCell>
                {employees.map((employee) => (
                  <TableCell key={employee.id} align="center">
                    {row[employee.id] || "0.00"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {tabIndex === 1 && monthlyTrackingData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{`Mois ${row.month}`}</TableCell>
                {employees.map((employee) => (
                  <TableCell key={employee.id} align="center">
                    {row[employee.id]?.toFixed(2) || "0.00"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {tabIndex === 2 && employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{formatEmployeeName(employee.name)}</TableCell>
                <TableCell align="center">{totals[employee.id]?.toFixed(2) || "0.00"} h</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TimeTracking;
