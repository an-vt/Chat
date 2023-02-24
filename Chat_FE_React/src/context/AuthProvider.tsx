import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import userApi from "../api/userAPI";
import { StorageKeys } from "../common/constants";
import { AuthToken, UserInfo } from "../models";
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from "../utils/storage";

interface AuthContextType {
  userInfo: UserInfo;
  tokenAuthenticated: boolean;
  saveToken: (userToken: AuthToken) => void;
  saveUserInfo: (userInfo: UserInfo) => void;
  fetchDataUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [tokenAuthenticated, setTokenAuthenticated] = useState<boolean>(
    !!getFromStorage(StorageKeys.ACCESS_TOKEN),
  );
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  const saveToken = useCallback((userToken: AuthToken) => {
    saveToStorage(StorageKeys.ACCESS_TOKEN, JSON.stringify(userToken));
    setTokenAuthenticated(true);
  }, []);

  const saveUserInfo = useCallback((user: UserInfo) => {
    setUserInfo(user);
  }, []);

  const logout = useCallback(() => {
    setTokenAuthenticated(false);
    removeFromStorage(StorageKeys.ACCESS_TOKEN);
    removeFromStorage(StorageKeys.REMEMBER_ME);
    window.location.href = "/login";
  }, []);

  const fetchDataUser = useCallback(() => {
    userApi
      .getMe()
      .then((response) => {
        setUserInfo(response as UserInfo);
      })
      .catch(() => {
        setUserInfo({} as UserInfo);
        setTokenAuthenticated(false);
        removeFromStorage(StorageKeys.ACCESS_TOKEN);
        removeFromStorage(StorageKeys.REMEMBER_ME);
        // window.location.href = "/login";
      });
  }, []);

  const { isLoading: isLoadingTutorials, refetch: getAllTutorials } = useQuery(
    "query-tutorials",
    async () => await userApi.getMe(),
    {
      enabled: false,
      onSuccess: (res) => {
        console.log("🚀 ~ file: AuthProvider.tsx:81 ~ res:", res);
      },
      onError: (err) => {
        console.log("🚀 ~ file: AuthProvider.tsx:84 ~ err:", err);
      },
    },
  );
  console.log(isLoadingTutorials);

  useEffect(() => {
    if (tokenAuthenticated) {
      fetchDataUser();
      getAllTutorials();
    }
  }, [tokenAuthenticated, fetchDataUser]);

  const memoedValue = useMemo(
    () => ({
      userInfo,
      tokenAuthenticated,
      saveToken,
      saveUserInfo,
      fetchDataUser,
      logout,
    }),
    [
      tokenAuthenticated,
      userInfo,
      saveUserInfo,
      saveToken,
      fetchDataUser,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (typeof context === "undefined")
    throw new Error("useAuth must be used within AuthProvider");
  return context;
}
