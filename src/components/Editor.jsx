import { useRef, useState, useEffect } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function Editor() {
    const editorRef = useRef(null);
    const [isLocalUpdate, setIsLocalUpdate] = useState(false); // Use state to track local updates

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

    return (
        <>
            {" "}
            <MonacoEditor
                height="80vh"
                theme="vs-dark"
                defaultLanguage="javascript"
                defaultValue="// some comment"
                onMount={handleEditorDidMount}
            />
        </>
    );
}

export default Editor;