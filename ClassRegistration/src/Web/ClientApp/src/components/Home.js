import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CurrentUserInfoClient } from '../web-api-client.ts';
import '../scss/style.scss';
//import '../components/admin/department/grid-overview.css';
import '../../node_modules/@syncfusion/ej2/bootstrap5.css';

const Home = () => {  
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

  async function getCurrentUserInfo() {
    const currentUserInfoClient = new CurrentUserInfoClient();
    let currentUser = await currentUserInfoClient.getUserInfo();
    setCurrentUserInfo(currentUser);
  }

  useEffect(() => {    
    getCurrentUserInfo();   
  }, [])

  function NavigateByRole() {
    console.log(currentUserInfo);
    if (currentUserInfo) {
      if (currentUserInfo.roles[0] === 'Administrator') {
        return (
          <Navigate to="/admin-index" replace={true} />
        )
      }
      else {
        return (
          <Navigate to="/student-index" replace={true} />
        )
      }
    }   
  }

  return (
    <NavigateByRole />
  )
}

export default Home;