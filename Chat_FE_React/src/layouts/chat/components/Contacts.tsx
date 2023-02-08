import { UilEdit, UilPower, UilSearch } from "@iconscout/react-unicons";
import chatApi from "api/chatAPI";
import useDebounce from "hooks/useDebounce";
import { Room, RoomAdd } from "models";
import { ReadMessageSocket } from "models/ChatSocket";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import Logo from "../../../assets/logo.svg";
import { useAuth } from "../../../context/AuthProvider";
import { useChat } from "../../../context/ChatProvider";
import ModalAddChat from "./ModalAddChat";

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 10% 6% 69% 15%;
  overflow: hidden;
  background-color: #080420;
  height: 100%;

  .btn__logout {
    position: absolute;
    padding: 4px;
    top: 5%;
    transform: translateY(-50%);
    left: 10px;
    background-color: #9a86f3;
    justify-content: center;
    align-items: center;
    width: 37px;
    height: 37px;
    border-radius: 10px;
    margin-left: auto;
    border: none;
    cursor: pointer;
    z-index: 1;
    display: none;
    cursor: pointer;
  }

  .header {
    padding: 0 10px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .brand {
      display: flex;
      align-items: center;
      gap: 6px;
      img {
        height: 2rem;
      }
      h3 {
        color: white;
        text-transform: uppercase;
      }
    }
    .menu {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      color: white;
      &__icon {
        cursor: pointer;
      }
    }
  }

  .search {
    padding: 0 10px;

    &__content {
      background-color: red;
      display: flex;
      align-items: stretch;
      gap: 4px;
      background-color: #31285e;
      height: 100%;
      border-radius: 25px;
      padding: 0 10px;

      &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__input,
      &__input::placeholder {
        flex: 1;
        outline: none;
        background-color: inherit;
        border: none;
        font-size: 14px;
        color: white;
        border-radius: inherit;
        padding: 6px 0;
      }
    }
  }

  .room-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: auto;
    gap: 8px;
    margin-top: 16px;
    padding-left: 10px;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #fff;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .room {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 98%;
      border-radius: 0.8rem;
      padding: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      align-items: center;
      transition: 0.5s ease-in-out;

      &__wrap {
        display: flex;
        align-items: center;
        gap: 1rem;
        .avatar {
          img {
            width: 3rem;
          }
        }
        .username {
          h2 {
            color: white;
          }
        }
      }

      .unread__count {
        background-color: red;
        line-height: 26px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        color: white;
        margin: 0;
        text-align: center;
      }
    }

    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        width: 3rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }

  // Mobile
  @media screen and (max-width: 767px) {
    .header {
      padding: 0;
      justify-content: center;
    }

    .btn__logout {
      display: flex;
    }
  }
`;

export default function Contacts() {
  const [show, setShow] = useState<boolean>(false);
  const { rooms, selectedRoom, setSelectedRoom, searchChat } = useChat();
  const { userInfo, logout } = useAuth();
  const { socket } = useChat();
  const [query, setQuery] = useState<string>("");
  const queryDebounce = useDebounce(query, 500);

  useEffect(() => {
    searchChat.room(queryDebounce);
  }, [queryDebounce]);

  const handleKeyDown = () => {
    console.log("aaa");
  };

  const handleAddChatSelf = async (data: RoomAdd) => {
    try {
      await chatApi.createRoom(data);

      toast.success("Add Chat Successful !");

      // add chat for update list memberUnadds
      socket.current.emit("list-member-unadd-send", data);

      // update list rooms
      socket.current.emit("list-room-send", data);
    } catch (error: any) {
      toast.success(error.message);
    }
  };

  const hanldeAddChatGroup = async (data: RoomAdd) => {
    try {
      await chatApi.createRoom(data);

      toast.success("Add Group Chat Successful !");
    } catch (error: any) {
      toast.success(error.message);
    }
  };

  const handleClickIconAdd = () => {
    setShow(true);
  };

  const handleChangeRoom = (room: Room) => {
    if (selectedRoom) {
      const readMessageOldRoom: ReadMessageSocket = {
        senderId: userInfo._id,
        roomId: selectedRoom?._id,
      };
      const readMessageNewRoom: ReadMessageSocket = {
        senderId: userInfo._id,
        roomId: room?._id,
      };

      // read message old room
      socket.current.emit("read-message-send", readMessageOldRoom);

      // read message new room
      socket.current.emit("read-message-send", readMessageNewRoom);
    }
    setTimeout(() => {
      if (typeof setSelectedRoom === "function") {
        setSelectedRoom(room);
      }
    }, 500);
  };

  return (
    <>
      <Container className="contact">
        <UilPower
          className="btn__logout"
          style={{
            backgroundColor: "#9a86f3",
            color: "#ebe7ff",
          }}
          size={25}
          onClick={() => {
            socket.current.emit("disconnect-user", userInfo._id);
            logout();
          }}
        />
        <div className="header">
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </div>
          <div className="menu">
            <UilEdit
              className="menu__icon"
              onClick={handleClickIconAdd}
              size={30}
            />
          </div>
        </div>
        <div className="search">
          <div className="search__content">
            <span className="search__content__icon">
              <UilSearch size="20" color="#fff" />
            </span>
            <input
              className="search__content__input"
              type="text"
              placeholder="Search on messenger"
              onChange={(e: any) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="room-container">
          {rooms?.map((room) => {
            return (
              <div
                role="button"
                tabIndex={0}
                key={room._id}
                className={`room ${
                  selectedRoom?._id === room._id ? "selected" : ""
                }`}
                onClick={() => handleChangeRoom(room)}
                onKeyDown={handleKeyDown}
              >
                <div className="room__wrap">
                  <div className="avatar">
                    <img src={room.avatarUrl} alt="avatar" />
                  </div>
                  <div className="username">
                    <h2>{room.name}</h2>
                  </div>
                </div>

                {selectedRoom?._id !== room._id && room.unreadCount > 0 && (
                  <p className="unread__count">{room.unreadCount}</p>
                )}
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <div className="avatar">
            <img src={userInfo.avatarUrl} alt="avatar" />
          </div>
          <div className="username">
            <h2>{userInfo.name}</h2>
          </div>
        </div>
      </Container>
      <ModalAddChat
        handleAddChatGroup={hanldeAddChatGroup}
        handleAddChatSelf={handleAddChatSelf}
        show={show}
        setShow={setShow}
      />
    </>
  );
}
