import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// NOTE: We intentionally render WITHOUT <React.StrictMode>. StrictMode double-mounts
// in development, which would spin up (and immediately dispose) a second WebGL context
// for react-globe.gl and can trigger "too many active WebGL contexts" warnings.
createRoot(document.getElementById('root')).render(<App />);
