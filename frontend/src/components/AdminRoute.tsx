import { useAppContext } from '../context';
import { Navigate } from 'react-router-dom';

type AdminRouteProps = {
  children: React.ReactNode;
};

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const {
    state: { userInfo },
  } = useAppContext();
  return (
    <>{userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />}</>
  );
};

export default AdminRoute;
