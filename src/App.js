import { BrowserRouter } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
import Routes from './routes';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

function App() {
  return (
    <BrowserRouter basename="">
      <Routes />
    </BrowserRouter>
  );
}

export default App;
