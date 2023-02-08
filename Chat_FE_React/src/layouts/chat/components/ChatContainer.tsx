import chatApi from "api/chatAPI";
import { formatYYYYMMSlash } from "common/constants";
import { useAuth } from "context/AuthProvider";
import { useChat } from "context/ChatProvider";
import { Message } from "models";
import moment from "moment";
import { useEffect } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import DateSend from "./DateSend";

const Container = styled.div`
  gap: 0.1rem;
  overflow: hidden;
  height: 100%;
  .chat-messages {
    height: 100%;
    max-height: calc(100% - 70px);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #fff;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message__container {
      display: flex;
      .message {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;

        &__content {
          /* max-width: 40%; */
          overflow-wrap: break-word;
          padding: 10px;
          font-size: 1.1rem;
          border-radius: 10px;
          margin: 0;
          color: #d1d1d1;
          @media screen and (min-width: 720px) and (max-width: 1080px) {
            max-width: 70%;
          }
        }

        &__avatar {
          width: 20px;
          margin-top: auto;
          visibility: hidden;
          &--show {
            visibility: visible;
          }
        }

        &__first {
          margin-top: 0;
        }
      }
    }
  }
  .sended {
    justify-content: flex-end;
    .message__content {
      background-color: #4f04ff21;
    }
  }
  .recieved {
    justify-content: flex-start;

    .message {
      flex-direction: row-reverse;
    }

    .message__content {
      background-color: #9900ff20;
    }
  }

  @media screen and (max-width: 767px) {
    .message__container {
      gap: 0.5rem;
    }
  }
`;

export default function ChatContainer() {
  const { selectedRoom, messages, socket, scrollRef } = useChat();
  const { userInfo } = useAuth();

  const handleSendMsg = async (msg: string) => {
    if (selectedRoom) {
      const data: Message = {
        content: msg.trim(),
        receivers: selectedRoom.members.map((member) => member.userId),
        roomId: selectedRoom._id,
        senderName: userInfo.name,
        senderUId: userInfo._id,
        senderAvatarUrl: userInfo.avatarUrl,
        type: "TEXT",
        sendingTimestamp: new Date().toISOString(),
      };

      try {
        await chatApi.sendMessage(data);

        // send to socket
        socket.current.emit("msg-send", data);

        // update unread count
        socket.current.emit("update-unread-send", data);
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    if (selectedRoom?._id) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView();
      }, 500);
    }
  }, [selectedRoom?._id]);

  const checkDifferentDateMessage = (
    datePrev: string,
    dateCurrent: string,
  ): boolean => {
    return moment(datePrev, formatYYYYMMSlash).isSame(
      moment(dateCurrent, formatYYYYMMSlash),
    );
  };

  return (
    <Container>
      <div className="chat-messages">
        {messages.map((message, index) => {
          return (
            <>
              {index === 0 ? (
                <DateSend
                  date={moment(message.sendingTimestamp).format(
                    formatYYYYMMSlash,
                  )}
                />
              ) : (
                message.sendingTimestamp &&
                messages[index + 1]?.sendingTimestamp &&
                !checkDifferentDateMessage(
                  moment(message.sendingTimestamp).format(formatYYYYMMSlash),
                  moment(messages[index + 1]?.sendingTimestamp).format(
                    formatYYYYMMSlash,
                  ),
                ) && (
                  <DateSend
                    date={moment(message.sendingTimestamp).format(
                      formatYYYYMMSlash,
                    )}
                  />
                )
              )}
              <div
                className={`message__container ${
                  message.senderUId === userInfo._id ? "sended" : "recieved"
                }`}
              >
                <div className={`message ${index === 0 && "message__first"}`}>
                  <p className="message__content">{message.content}</p>
                  <img
                    className={`message__avatar ${
                      message.senderUId !== messages[index + 1]?.senderUId &&
                      "message__avatar--show"
                    }`}
                    alt="avatar"
                    src={message.senderAvatarUrl}
                  />
                </div>
              </div>
              {index + 1 === messages?.length && (
                // eslint-disable-next-line react/self-closing-comp
                <div
                  style={{ color: "#fff" }}
                  ref={scrollRef}
                  key={message._id}
                ></div>
              )}
            </>
          );
        })}
      </div>
      <ChatInput onSendMessage={handleSendMsg} />
    </Container>
  );
}
