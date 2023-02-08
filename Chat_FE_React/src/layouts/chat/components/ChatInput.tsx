import { UilMessage, UilSmile } from "@iconscout/react-unicons";
import Picker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react/dist/types/exposedTypes";
import useClickOutSide from "hooks/useClickOutSide";
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  align-items: center;
  height: 70px;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(100%, -95%);
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        border-radius: 30px;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 25px;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }

  @media screen and (max-width: 767px) {
    margin-left: -17px;
    padding: 1rem;
    .button-container {
      visibility: hidden;
      pointer-events: none;
    }
  }
`;

export interface IChatInputProps {
  onSendMessage: (msg: string) => void;
}

export default function ChatInput({ onSendMessage }: IChatInputProps) {
  const [msg, setMsg] = useState("");
  const { show, setShow, nodeRef } = useClickOutSide("svg");

  const handleEmojiPickerhideShow = () => {
    setShow(!show);
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    let message = msg;
    message += emoji.emoji;
    setMsg(message);
  };

  const sendChat = (event: any) => {
    event.preventDefault();
    if (msg.length > 0) {
      onSendMessage(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji" ref={nodeRef}>
          <UilSmile onClick={handleEmojiPickerhideShow} />
          {show && (
            <span className="emoji-picker-react">
              <Picker onEmojiClick={handleEmojiClick} />
            </span>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <UilMessage height={40} size={20} width={50} />
        </button>
      </form>
    </Container>
  );
}
