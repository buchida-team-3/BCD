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

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/group/create" element={<CreateGroup />} />
          <Route path="/group/select" element={<SelectGroup />} /> */}
          <Route path="/group/album" element={<UploadAfter />} />
          <Route path="/group/album/upload" element={<UploadBefore />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
