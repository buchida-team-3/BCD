import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateGroup from './components/CreateGroup';
import SelectGroup from './components/SelectGroup';
import UploadAfter from './components/UploadAfter';
import UploadBefore from './components/UploadBefore';
import Gallery from './components/Gallery';
import Photo from './components/Photo';

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/group/create" element={<CreateGroup />} />
          <Route path="/group/select" element={<SelectGroup />} /> */}
          <Route path="/group/album" element={<UploadAfter />} />
          <Route path="/group/album/upload" element={<UploadBefore />} />
          <Route path="/gallery" element={<Gallery images={Photo}/>} />
        </Routes>
      </Router>
   
  );
}

export default App;
