import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import avatarApi from "../../../api/avatarAPI";
import userApi from "../../../api/userAPI";
import loader from "../../../assets/loader.gif";
import { useAuth } from "../../../context/AuthProvider";
import { UserInfo } from "../../../models";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100%;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      cursor: pointer;
      border-radius: 50%;
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const { userInfo, fetchDataUser } = useAuth();

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar");
    } else {
      const data: Partial<UserInfo> = {
        avatarUrl: avatars[selectedAvatar],
      };

      try {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        await userApi.updateAvatar(userInfo?._id, data);
        fetchDataUser();

        navigate("/chat");
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    async function fetchAvatar() {
      try {
        const promise = [];
        for (let i = 0; i < 4; i++) {
          promise.push(avatarApi.getImage(Math.round(Math.random() * 1000)));
        }

        const avatarImages: string[] = await Promise.all(promise).then(
          (response) =>
            response.map((item: any) => {
              const dataBase64 = Buffer.from(item.data).toString("base64");
              const imageBase64 = `data:image/svg+xml;base64,${dataBase64}`;
              return imageBase64;
            }),
        );

        setAvatars(avatarImages);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        console.log(error.message);
      }
    }

    fetchAvatar();
  }, []);

  const handleClickAvatar = (index: number) => {
    setSelectedAvatar(index);
  };

  return (
    <Container>
      {isLoading ? (
        <img src={loader} alt="loader" className="loader" />
      ) : (
        <>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index: number) => {
              return (
                <button
                  type="button"
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                  key={`${avatar}`}
                  onClick={() => handleClickAvatar(index)}
                >
                  <img src={avatar} alt="avatar" key={avatar} />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={setProfilePicture}
            className="submit-btn"
          >
            Set as Profile Picture
          </button>
        </>
      )}
    </Container>
  );
}
