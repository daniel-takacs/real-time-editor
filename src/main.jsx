import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Define global MonacoEnvironment configuration
window.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    const version = "0.20.0"; // Specify your Monaco Editor version
    const baseUrl = `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${version}/min`;

    switch (label) {
      case 'json':
        return `${baseUrl}/vs/language/json/json.worker.js`;
      case 'css':
        return `${baseUrl}/vs/language/css/css.worker.js`;
      case 'html':
        return `${baseUrl}/vs/language/html/html.worker.js`;
      case 'typescript':
      case 'javascript':
        return `${baseUrl}/vs/language/typescript/ts.worker.js`;
      default:
        return `${baseUrl}/vs/editor/editor.worker.js`;
    }
  }
};
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
