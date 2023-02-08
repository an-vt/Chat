import styled from "styled-components";
import { useChat } from "../../context/ChatProvider";
import ChatContainer from "./components/ChatContainer";
import ChatHeader from "./components/ChatHeader";
import Contacts from "./components/Contacts";
import Welcome from "./components/Welcome";

interface ContainerProps {
  selectedRoom: boolean;
}

const Container = styled.div<ContainerProps>`
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }

  .chat__content {
    display: grid;
    grid-template-rows: 10% 90%;
    overflow: hidden;
  }

  // Mobile
  @media screen and (max-width: 767px) {
    .container {
      width: 100%;
      height: 100%;
      display: block;
      overflow: hidden;
    }

    .welcome {
      display: none;
    }

    .contact {
      display: ${(p: ContainerProps) => {
        return `${p.selectedRoom ? "none" : "grid"}`;
      }};
    }

    .chat__content {
      display: ${(p: ContainerProps) => {
        return `${p.selectedRoom ? "grid" : "none"}`;
      }};
      height: ${(p: ContainerProps) => {
        return `${p.selectedRoom && "100%"}`;
      }};
    }
  }
`;

export default function ChatLayout() {
  const { selectedRoom } = useChat();
  return (
    <Container selectedRoom={!!selectedRoom}>
      <div className="container">
        <Contacts />
        <div className="chat__content">
          <ChatHeader />
          {selectedRoom ? <ChatContainer /> : <Welcome />}
        </div>
      </div>
    </Container>
  );
}
