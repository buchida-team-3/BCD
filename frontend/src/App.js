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
import AlbumListPage from './components/AlbumListPage';

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
          
          {/* 앨범페이지(데모) */}
          <Route path="/book" element={<DemoBook />} />

          {/* 필터링 페이지 */}
          <Route path="/labelpage" element={<LabelPage />} />

          {/* 앨범목록 페이지 */}
          <Route path="/albumlist" element={<AlbumListPage />} />
        </Routes>
      </Router>
   
  );
}

export default App;
