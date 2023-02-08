import { UilPlusCircle } from "@iconscout/react-unicons";
import styled from "styled-components";

export interface ISuggestItemProps {
  name: string;
  image: string;
  memberId: string;
  checkedCreateGroup: boolean;
  onClick: (memberId: string) => void;
  memberIdchecked?: string[];
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #333;
  padding: 0 8px;
  cursor: pointer;
  div {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 50px;
    img {
      width: 40px;
    }
    p {
      font-size: 16px;
      color: white;
    }
  }

  input[type="checkbox"] {
    position: relative;
    border: 2px solid #000;
    border-radius: 50%;
    background: none;
    cursor: pointer;
    line-height: 0;
    margin: 0 0.6em 0 0;
    outline: 0;
    padding: 0 !important;
    vertical-align: text-top;
    height: 20px;
    width: 20px;
    -webkit-appearance: none;
    opacity: 0.5;
  }

  input[type="checkbox"]:hover {
    opacity: 1;
  }

  input[type="checkbox"]:checked {
    background-color: #000;
    opacity: 1;
  }

  input[type="checkbox"]:before {
    content: "";
    position: absolute;
    right: 50%;
    top: 50%;
    width: 4px;
    height: 10px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    margin: -1px -1px 0 -1px;
    transform: rotate(45deg) translate(-50%, -50%);
    z-index: 2;
  }
`;

export default function SuggestItem({
  name,
  image,
  checkedCreateGroup,
  memberId,
  onClick,
  memberIdchecked = [],
}: ISuggestItemProps) {
  return (
    <Container>
      <div>
        <img src={image} alt="avatar" />
        <p>{name}</p>
      </div>
      {checkedCreateGroup ? (
        <input
          type="checkbox"
          checked={memberIdchecked.includes(memberId)}
          onClick={() => onClick(memberId)}
        />
      ) : (
        <UilPlusCircle
          color="#fff"
          size={30}
          onClick={() => onClick(memberId)}
        />
      )}
    </Container>
  );
}
