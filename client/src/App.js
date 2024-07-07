import { Routes ,Route} from 'react-router-dom';
import Home from './components/Home';
import EditorP from './components/EditorPage';
import { Toaster } from "react-hot-toast";
import './App.css';

function App() {
  return (
    <>
    <div>
      <Toaster position = 'top-center'></Toaster>
    </div>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/editor/:roomId" element = {<EditorP/>}/>
      </Routes>
    </>
  );
}

export default App;
