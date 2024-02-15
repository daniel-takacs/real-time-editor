import { useRef, useState, useEffect } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import io from "socket.io-client";
import "./Editor.css";
import VideoConference from "./VideoConference";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
const socket = io(backendUrl);

function Editor() {
  const navigate = useNavigate(); // For redirecting after login
  const editorRef = useRef(null);
  const [isLocalUpdate, setIsLocalUpdate] = useState(false); // Use state to track local updates
  const [theme, setTheme] = useState("vs-dark");

  useEffect(() => {
    const handleCodeUpdate = (newCode) => {
      if (editorRef.current && !isLocalUpdate) {
        const currentPosition = editorRef.current.getPosition();
        editorRef.current.setValue(newCode);
        editorRef.current.setPosition(currentPosition);
      }
    };

    // Listen for updates from the server
    socket.on("codeUpdate", handleCodeUpdate);

    return () => {
      socket.off("codeUpdate", handleCodeUpdate);
    };
  }, [isLocalUpdate]); // Depend on isLocalUpdate to ensure the latest state is used
  // Function to format the code using the editor instance
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.onDidChangeModelContent((event) => {
      if (!isLocalUpdate) {
        // Only emit if this is not a local update
        setIsLocalUpdate(true); // Prevent handling this change as a remote update
        const code = editor.getValue();
        socket.emit("codeChange", code);
        setTimeout(() => setIsLocalUpdate(false), 100); // Reset flag after a short delay
      }
    });
  }
  const formatCode = () => {
    // Implement the code formatting logic here
  };
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Assuming you store the token in localStorage
    // Redirect user to login page or any other page after logout
    navigate("/login");
  };
  return (
    <div className="container">
      <div className="header">
        <button className="editor-button" onClick={formatCode}>
          Format Code
        </button>
        <select
          className="editor-dropdown"
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="vs-dark">Dark</option>
          <option value="vs-light">Light</option>
        </select>
        <div className="logout">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="editor-container">
        <div className="monaco-container">
          <MonacoEditor
            height="80vh"
            width="100vh"
            theme={theme}
            defaultLanguage="javascript"
            defaultValue="// Write some code..."
            onMount={handleEditorDidMount}
          />
        </div>

        <VideoConference />
      </div>
    </div>
  );
}

export default Editor;
