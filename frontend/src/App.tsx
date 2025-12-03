import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MatierePage } from './pages/MatierePage';
import { SubjectPage } from './pages/SubjectPage';
import { ImageGalleryPage } from './pages/ImageGalleryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MatierePage />} />
        <Route path="/matiere/:matiere" element={<SubjectPage />} />
        <Route path="/matiere/:matiere/subject/:subject" element={<ImageGalleryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
