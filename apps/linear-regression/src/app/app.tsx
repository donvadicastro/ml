import BuildModel from '../pages/build-model';
import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <div>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-build-model">Linear regression</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-build-model">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-build-model"
          element={<BuildModel />}
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
