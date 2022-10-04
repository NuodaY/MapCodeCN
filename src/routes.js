import { Navigate, useRoutes } from 'react-router-dom';
import Map from "./pages/Map";
export default function Router() {
    return useRoutes([
      { path: '/', element: <Map />}
    ]);
  }