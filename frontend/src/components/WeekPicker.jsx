import { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomProvider, DatePicker, Button } from "rsuite";
import 'rsuite/dist/rsuite.min.css';
import '../styles/WeekPicker.css';
import frFR from 'rsuite/locales/fr_FR';
import { getISOWeek, startOfISOWeek, endOfISOWeek, format, subDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaCalendarCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const WeekPicker = ({ onChange }) => {
  const getCurrentWeek = () => {
    const currentDate = new Date();
    const weekNumber = getISOWeek(currentDate, { locale: fr });
    const dateFrom = startOfISOWeek(currentDate, { locale: fr });
    const dateTo = endOfISOWeek(currentDate, { locale: fr });
    return {
      date: currentDate,
      dateFrom,
      dateTo,
      weekNumber,
    };
  };

  const [objWeek, setObjWeek] = useState(getCurrentWeek());

  const handleWeekChange = (date) => {
    if (!date) {
      // Si la date est null (croix cliquée), revenir à la semaine actuelle
      const currentWeek = getCurrentWeek();
      setObjWeek(currentWeek);
      onChange(currentWeek); // Appel de la prop onChange pour notifier le parent
    } else {
      const weekNumber = getISOWeek(date, { locale: fr });
      const dateFrom = startOfISOWeek(date, { locale: fr });
      const dateTo = endOfISOWeek(date, { locale: fr });
      const newObjWeek = {
        date,
        dateFrom,
        dateTo,
        weekNumber,
      };
      setObjWeek(newObjWeek);
      onChange(newObjWeek); // Appel de la prop onChange
    }
  };

  const handlePrevWeek = () => {
    const prevDate = subDays(objWeek.date, 7);
    handleWeekChange(prevDate);
  };

  const handleNextWeek = () => {
    const nextDate = addDays(objWeek.date, 7);
    handleWeekChange(nextDate);
  };

  const formatDateFr = (date) => {
    if (!date) return '';
    return format(date, 'dd MMM yyyy', { locale: fr });
  };

  const renderValue = (date) => {
    const weekNumber = getISOWeek(date);
    const dateFrom = formatDateFr(startOfISOWeek(date));
    const dateTo = formatDateFr(endOfISOWeek(date));
    return `${dateFrom} - ${dateTo} | S${weekNumber}`;
  };

  return (
    <CustomProvider locale={frFR}>
      <div className="WeekPicker">
        <Button onClick={handlePrevWeek} color="green" appearance="ghost">
          <FaArrowLeft />
        </Button>
        <DatePicker
          style={{ width: '15%' }}
          appearance="subtle"
          caretAs={FaCalendarCheck}
          placeholder="Sélectionner une semaine"
          isoWeek
          showWeekNumbers
          value={objWeek.date}
          onChange={handleWeekChange}
          renderValue={renderValue}
          cleanable
        />
        <Button onClick={handleNextWeek} color="green" appearance="ghost">
          <FaArrowRight />
        </Button>
      </div>
    </CustomProvider>
  );
};

WeekPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default WeekPicker;
