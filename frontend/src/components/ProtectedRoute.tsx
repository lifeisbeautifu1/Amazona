import { useAppContext } from '../context';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const {
    state: { userInfo },
  } = useAppContext();
  return <>{userInfo ? children : <Navigate to="/signin" />}</>;
};

export default ProtectedRoute;
