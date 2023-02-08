import { Navigate, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { useAuth } from "./context/AuthProvider";
import "./index.css";
import { Login, Register } from "./layouts/auth";
import ChatLayout from "./layouts/chat";
import SetAvatar from "./layouts/chat/components/SetAvatar";

const Container = styled.div`
  height: 100%;
`;

function App() {
  const { tokenAuthenticated } = useAuth();
  return (
    <Container>
      {!tokenAuthenticated ? (
        <Routes>
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/chat" element={<ChatLayout />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
          <Route path="*" element={<Navigate to="/chat" />} />
        </Routes>
      )}
      <ToastContainer
        position={toast.POSITION.TOP_RIGHT}
        autoClose={8000}
        draggable
        pauseOnHover
        style={{ fontSize: "14px" }}
        theme="dark"
      />
    </Container>
  );
}

export default App;
