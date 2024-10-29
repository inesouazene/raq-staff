// src/components/GeneratePDF.jsx

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, parse, startOfWeek, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";

const GeneratePDF = ({ employees, weekDates, weekDate, getTasksForEmployeeAndDate, calculateTotalHoursForWeek, formatEmployeeName, formatPause }) => {
	const generatePDF = () => {
	  const doc = new jsPDF('l', 'mm', 'a4');

	  // Obtenir le premier et le dernier jour de la semaine
	  const firstDayOfWeek = startOfWeek(weekDate, { weekStartsOn: 1 });
	  const lastDayOfWeek = endOfWeek(weekDate, { weekStartsOn: 1 });

	  // Définir le titre du document
	  const title = `Planning de la semaine du ${format(firstDayOfWeek, "dd MMM yyyy", { locale: fr })} au ${format(lastDayOfWeek, "dd MMM yyyy", { locale: fr })}`;
	  doc.setFontSize(12);
	  doc.text(title, 15, 15);

	  // Définir les en-têtes du tableau
	  const headers = ['Salariés', ...weekDates.map(date => format(new Date(date), "EEE dd MMM", { locale: fr })), 'Total'];

	  // Préparer les données du tableau
	  const data = employees.map(employee => {
		const row = [formatEmployeeName(employee.name)];
		weekDates.forEach(date => {
		  const tasksForDay = getTasksForEmployeeAndDate(employee.id, date);

		  // Calculer la hauteur totale nécessaire pour toutes les tâches de la journée
		  const cellContentHeight = tasksForDay.reduce((totalHeight, task) => {
			const taskText = `${format(parse(task.heure_debut, "HH:mm:ss", new Date()), "HH:mm")} - ${format(parse(task.heure_fin, "HH:mm:ss", new Date()), "HH:mm")}\n${task.nom_type_tache}${task.pause > 0 ? `\nPause: ${formatPause(task.pause)}` : ''}`;
			const lines = doc.splitTextToSize(taskText, 40);
			const textHeight = lines.length * 4; // Hauteur du texte pour cette tâche
			return totalHeight + textHeight + 6; // Ajouter l'espacement entre les tâches
		  }, 0);

		  // Enregistrer la hauteur calculée dans l'objet de cellule
		  row.push({ content: '', cellHeight: cellContentHeight });
		});
		row.push(`${calculateTotalHoursForWeek(employee.id)} h`);
		return row;
	  });

	  const convertColor = (color) => {
		if (color.startsWith('#')) {
		  return [
			parseInt(color.slice(1, 3), 16),
			parseInt(color.slice(3, 5), 16),
			parseInt(color.slice(5, 7), 16)
		  ];
		}
		return color;
	  };

	  // Générer le tableau PDF avec auto-ajustement de la hauteur des cellules
	  doc.autoTable({
		head: [headers],
		body: data,
		startY: 20,
		theme: 'grid',
		styles: {
		  fontSize: 8,
		  cellPadding: 2,
		},
		columnStyles: {
		  0: { halign: 'left', valign: 'middle', fontStyle: 'bold', cellWidth: 20 },
		  8: { halign: 'right', valign: 'middle', fontStyle: 'bold', cellWidth: 15} // Alignement à droite et en gras pour la colonne Total
		},
		headStyles: {
		  fillColor: [76, 148, 170],
		  textColor: [0, 0, 0],
		  fontStyle: 'bold',
		  halign: 'center',
		},
		// Configurer la hauteur de chaque cellule en fonction du contenu calculé
		didParseCell: (data) => {
		  if (data.section === 'body' && typeof data.cell.raw === 'object' && data.cell.raw.cellHeight) {
			data.cell.styles.minCellHeight = data.cell.raw.cellHeight;
		  }
		},
		didDrawCell: (data) => {
		  if (data.section === 'body' && data.column.index > 0 && data.column.index < weekDates.length + 1) {
			const employeeId = employees[data.row.index].id;
			const date = weekDates[data.column.index - 1];
			const tasksForDay = getTasksForEmployeeAndDate(employeeId, date);
			let yOffset = data.cell.y + 2;

			tasksForDay.forEach((task) => {
				console.log(`Task color: ${task.couleur}`);
				// Créer le texte complet pour chaque tâche
				const taskText = `${format(parse(task.heure_debut, "HH:mm:ss", new Date()), "HH:mm")} - ${format(parse(task.heure_fin, "HH:mm:ss", new Date()), "HH:mm")}\n${task.nom_type_tache}${task.pause > 0 ? `\nPause: ${formatPause(task.pause)}` : ''}`;
				const lines = doc.splitTextToSize(taskText, data.cell.width - 8);
				const textHeight = lines.length * 4;

				// Définir l'épaisseur de la bordure gauche
				const borderThickness = 2; // Vous pouvez ajuster cette valeur

				// Dessiner le fond blanc du rectangle
				doc.setFillColor(255, 255, 255);
				doc.rect(data.cell.x + 2, yOffset, data.cell.width - 4, textHeight + 1, 'F');

			  // Dessiner la bordure gauche colorée
			  doc.setDrawColor(...convertColor(task.couleur));
			  doc.setLineWidth(borderThickness);
			  doc.line(data.cell.x + 2, yOffset, data.cell.x + 2, yOffset + textHeight + 1);

			  // Réinitialiser l'épaisseur de ligne pour les autres bordures
			  doc.setLineWidth(0.1);

			  // Dessiner les autres bordures en noir
			  doc.setDrawColor(0, 0, 0);


			  // Ajouter le texte de la tâche
			  doc.setTextColor(0, 0, 0);
			  doc.text(lines, data.cell.x + 4, yOffset + 4);

			  // Ajuster l'offset vertical pour la prochaine tâche
			  yOffset += textHeight + 4;
			});
		  }
		}
	  });

	  // Sauvegarder le PDF
	  doc.save(`planning_semaine_${format(firstDayOfWeek, 'dd-MM-yyyy')}.pdf`);
	};

	return { generatePDF };
  };

  export default GeneratePDF;
