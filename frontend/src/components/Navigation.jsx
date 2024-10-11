// Navigation.jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="app-navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/employees">Employees</Link>
        </li>
        <li>
          <Link to="/schedules">Schedules</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
