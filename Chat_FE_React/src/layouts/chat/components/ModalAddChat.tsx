import { UilAngleRightB, UilUsersAlt } from "@iconscout/react-unicons";
import { useAuth } from "context/AuthProvider";
import { useChat } from "context/ChatProvider";
import useDebounce from "hooks/useDebounce";
import { RoomAdd } from "models";
import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import Modal from "../../../components/Modal";
import SuggestItem from "./SuggestItem";

const ModalContent = styled.div`
  .content {
    &__input {
      width: 100%;
      padding: 8px;
      font-size: 16px;
      outline: none;
      border: none;
      outline: none;
      color: #fff;
      border-radius: 6px;
      background-color: transparent;
      margin-bottom: 12px;
    }

    &__input__search,
    &__input__search::placeholder {
      width: 100%;
      padding: 8px;
      font-size: 16px;
      outline: none;
      border: 1px solid #fff;
      color: #000;
      border-radius: 6px;
    }
  }

  .suggest {
    &__title {
      color: white;
      margin-left: 10px;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: auto;
      height: 282px;
      padding-right: 8px;
      &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
          background-color: #fff;
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
    }
  }

  .group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #333;
    padding: 0 8px;
    margin: 8px 0;
    margin-top: 15px;
    cursor: pointer;
    &__left {
      display: flex;
      align-items: center;
      gap: 6px;
      &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border: 1px solid #fff;
        border-radius: 50%;
      }
      p {
        font-size: 16px;
        color: white;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      border-radius: 1px solid #fff;
    }
  }
`;

export interface IModalAddChatProps {
  handleAddChatGroup: (dat: RoomAdd) => void;
  handleAddChatSelf: (data: RoomAdd) => void;
  show: boolean;
  setShow: any;
}

export default function ModalAddChat({
  handleAddChatGroup,
  handleAddChatSelf,
  show,
  setShow,
}: IModalAddChatProps) {
  const { userInfo } = useAuth();
  const [query, setQuery] = useState<string>("");
  const queryDebounce = useDebounce(query, 500);
  const [checkedCreateGroup, setCheckedCreateGroup] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const [memberIdchecked, setMemberIdchecked] = useState<string[]>([]);
  const haveGroupName = groupName.trim().length > 0;
  const { members, memberUnAdds, searchChat } = useChat();

  useEffect(() => {
    if (checkedCreateGroup) {
      searchChat.member(queryDebounce);
    } else {
      searchChat["member-unadd"](queryDebounce);
    }
  }, [queryDebounce, checkedCreateGroup, searchChat]);

  const handleClosePopup = () => {
    setShow(false);
    setCheckedCreateGroup(false);
  };

  const handleCancel = () => {
    if (checkedCreateGroup) {
      setCheckedCreateGroup(false);
      setQuery("");
    } else {
      setShow(false);
    }
  };

  const handleClickCreateGroup = () => {
    if (!checkedCreateGroup) {
      setCheckedCreateGroup(true);
      setQuery("");
    }
  };

  const handleClickCheckboxMemberGroup = async (memberId: string) => {
    const checked = !!memberIdchecked.find((item) => item === memberId);
    if (checked) {
      setMemberIdchecked((prevV) => prevV.filter((item) => item !== memberId));
    } else {
      const newMemberIdchecked = [...memberIdchecked, memberId];
      setMemberIdchecked(newMemberIdchecked);
    }
  };

  const onAddChatGroup = () => {
    const data: RoomAdd = {
      memberIds: [...memberIdchecked, userInfo._id],
      type: "GROUP",
      groupName,
    };

    handleAddChatGroup(data);
  };

  const onAddChatSelf = (memberId: string) => {
    const data: RoomAdd = {
      memberIds: [userInfo._id, memberId],
      type: "SELF",
    };

    handleAddChatSelf(data);
  };

  return (
    <Modal
      title={`New ${checkedCreateGroup ? "Group" : "Message"}`}
      visible={show}
      onClose={handleClosePopup}
      onAdd={onAddChatGroup}
      onCancel={handleCancel}
      disabledBtnAdd={memberIdchecked.length < 2 || !haveGroupName}
      hideBtnAdd={!checkedCreateGroup}
    >
      <ModalContent className="content">
        {checkedCreateGroup && (
          <input
            type="text"
            className="content__input"
            placeholder="Group name (required)"
            onChange={(event: any) => setGroupName(event.target.value)}
          />
        )}
        <input
          type="text"
          className="content__input__search"
          placeholder="Enter your name friend"
          onChange={(event: any) => setQuery(event.target.value)}
        />
        {!checkedCreateGroup && (
          <CSSTransition in={!checkedCreateGroup} timeout={250}>
            <div
              className="group"
              role="button"
              tabIndex={0}
              onClick={handleClickCreateGroup}
              onKeyDown={() => console.log("key down")}
            >
              <div className="group__left">
                <span className="group__left__icon">
                  <UilUsersAlt size={30} color="white" />
                </span>
                <p>Create a new group</p>
              </div>
              <div className="group__right">
                <UilAngleRightB color="white" />
              </div>
            </div>
          </CSSTransition>
        )}
        <h2 className="suggest__title">Suggested</h2>
        <div className="suggest__list">
          {checkedCreateGroup
            ? members.map((item) => (
                <SuggestItem
                  key={item._id}
                  name={item.name ?? ""}
                  image={item.avatarUrl ?? ""}
                  checkedCreateGroup={checkedCreateGroup}
                  memberIdchecked={memberIdchecked}
                  onClick={
                    checkedCreateGroup
                      ? handleClickCheckboxMemberGroup
                      : onAddChatSelf
                  }
                  memberId={item._id}
                />
              ))
            : memberUnAdds.map((item) => (
                <SuggestItem
                  key={item._id}
                  name={item.name ?? ""}
                  image={item.avatarUrl ?? ""}
                  checkedCreateGroup={checkedCreateGroup}
                  onClick={onAddChatSelf}
                  memberId={item._id}
                />
              ))}
        </div>
      </ModalContent>
    </Modal>
  );
}
