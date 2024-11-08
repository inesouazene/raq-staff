import { useEffect, useState } from "react";
import { Link, Card, CardContent, Avatar, Typography, Box, Divider } from "@mui/material";
import Grid from '@mui/material/Grid2';
import api from '../services/api';
import '../themes/theme';

function Employees() {
  const [employees, setEmployees] = useState([]);


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await api.getAllEmployeesInfo();
        setEmployees(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des salariés", error);
      }
    };

    fetchEmployees();
  }, []);

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	}

	function allCaps(string) {
		return string.toUpperCase();
	}

	function stringAvatar(name) {
		return {
			children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
		};
	}

  return (
    <Grid container spacing={3} sx={{ padding: 2, display: "flex", justifyContent: "center", alignItems: "center", width: "100%", }}>
      {employees.map((employee) => (
        <Grid xs={8} sm={6} md={4} lg={3} key={employee.id}>
          <Card
            sx={{
              borderRadius: "20px",
              minWidth: 256,
              textAlign: "center",
              boxShadow: "0 2px 4px -2px rgba(0,0,0,0.24), 0 4px 24px -2px rgba(0, 0, 0, 0.2)",
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <CardContent>
              <Avatar
								{...stringAvatar(`${employee.prenom} ${employee.nom}`)}
                sx={{
                  width: 60,
                  height: 60,
                  margin: "auto",
									backgroundColor: 'secondary.main',
                }}
              />
              <Box
                component="h3"
                sx={{
                  fontSize: 20,
									fontFamily: 'QuickSand',
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  marginTop: 1,
                  marginBottom: 0,
                }}
              >
                {capitalizeFirstLetter(`${employee.prenom}`)} {allCaps(`${employee.nom}`)}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: '-5px', fontStyle:'italic' }}>
                  {employee.email}
                </Typography>
              </Box>
            </CardContent>
              <Divider variant="middle" sx={{ borderWidth: 1, borderRadius: 10 }} />
						<Box sx={{ display: 'flex', flexDirection: 'row' }}>
						<Box flex="auto" sx={{ padding: 2 }}>
							<Typography variant="body2" color="text.secondary" sx={{  }}>
								{employee.type_contrat}
							</Typography>
							</Box>
							<Divider orientation="vertical" variant="middle" flexItem sx={{ borderWidth: 1, borderRadius: 10 }} />
							<Box flex="auto" sx={{ width: 'auto', padding: 2 }}>
							<Link
								href={`/employees/${employee.id}`}
								color="secondary"
								underline="none"
								sx={{
									"&:hover": {
										textDecoration: 'none',
									}
								}}
							>
								<Typography variant="body2" color="secondary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
									Fiche
								</Typography>
							</Link>
							</Box>
							</Box>
            </Card>
						<Box>

						</Box>

        </Grid>
      ))}
    </Grid>
  );
}

export default Employees;
