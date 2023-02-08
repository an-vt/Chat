import { UilAngleLeftB, UilPower } from "@iconscout/react-unicons";
import { useAuth } from "context/AuthProvider";
import { useChat } from "context/ChatProvider";
import styled from "styled-components";

const Header = styled.div`
  display: flex;
  align-items: center;

  .header__back__icon {
    margin-left: 10px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    display: none;
  }

  .header__wrap {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user__detail {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }

    .btn__logout {
      background-color: #9a86f3;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 45px;
      height: 45px;
      border-radius: 10px;
      margin-left: auto;
      border: none;
      cursor: pointer;
    }
  }

  @media screen and (max-width: 767px) {
    .header__back__icon {
      display: block;
      margin-left: 0;
    }

    .header__wrap {
      padding-left: 5px;
    }

    .header__wrap .btn__logout {
      display: none;
    }
  }
`;

export default function ChatHeader() {
  const { logout, userInfo } = useAuth();
  const { selectedRoom, setSelectedRoom, socket } = useChat();
  return (
    <Header>
      <button
        type="button"
        className="header__back__icon"
        onClick={() => setSelectedRoom(null)}
      >
        <UilAngleLeftB color="white" size={25} />
      </button>
      <div className="header__wrap">
        {selectedRoom && (
          <div className="user__detail">
            <div className="avatar">
              <img src={selectedRoom.avatarUrl} alt="avatar" />
            </div>
            <div className="username">
              <h3>{selectedRoom.name}</h3>
            </div>
          </div>
        )}
        <button
          type="button"
          className="btn__logout"
          onClick={() => {
            socket.current.emit("disconnect-user", userInfo._id);
            logout();
          }}
        >
          <UilPower
            style={{
              backgroundColor: "#9a86f3",
              color: "#ebe7ff",
            }}
            size={30}
          />
        </button>
      </div>
    </Header>
  );
}
