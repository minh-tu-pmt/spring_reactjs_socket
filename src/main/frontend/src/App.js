import './App.css';
import { Switch, Route, Link } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import Demobar from './components/DemoBar';
import * as variable from './variable';
import FormBuilder from './components/DemoBar/FormBuilder';
import CustomFormBuilder from './components/CustomForm';
function App() {
  return (
    <div className="App">
      {/* <FormBuilder/> */}
      <CustomFormBuilder>
        
      </CustomFormBuilder>
    </div>
  );
}

export default App;
