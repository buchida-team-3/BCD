import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginSignup from './components/LoginSignup';
import ImagePage from './components/ImagePage';
import UploadPage from './components/UploadPage';
import UploadPage2 from './components/UploaePage2';
import Edit from './components/Edit';
import DemoBook from './components/DemoBook';
import LabelPage from './components/LabelPage';

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route path="/loginandsignup" element={<LoginSignup />} />

          <Route path="/imagepage" element={<ImagePage />} />

          <Route path="/uploadpage" element={<UploadPage />} />
          <Route path="/uploadpage2" element={<UploadPage2 />} />
    
          <Route path="/edit" element={<Edit />} />
          
          <Route path="/demo" element={<DemoBook />} />

          <Route path="/labelpage" element={<LabelPage />} />
        </Routes>
      </Router>
   
  );
}

export default App;
