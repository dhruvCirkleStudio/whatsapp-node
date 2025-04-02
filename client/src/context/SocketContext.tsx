import {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "../utils/ToastNotification";

type Users = {
  sessionId: String;
};

type SocketContextType = {
  socket: Socket | null;
  qrImg: string | undefined;
  users: Users[];
  setUsers:any;
  currentUser: any;
  setCurrentUser: any;
  modalState:Boolean;
  setModalState:any;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  qrImg: undefined,
  users: [],
  setUsers:()=>{},
  currentUser: [],
  setCurrentUser: () => {},
  modalState:false,
  setModalState:()=>{},
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [qrImg, setQrImg] = useState<string | undefined>();
  const [modalState, setModalState] = useState<Boolean>(false);
  const [users, setUsers] = useState<Users[]>([]);
  const [currentUser, setCurrentUser] = useState<String>()

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");
    const socketInstance = socketRef.current;

    socketInstance.on("connect", () => {
      console.log("Connected:", socketInstance.id);
      setSocket(socketInstance);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected");
      setSocket(null);
    });

    socketInstance.on("qrCode", (newQrCode) => {
      console.log("qrCode", newQrCode);
      setQrImg(newQrCode);
    });

    socketInstance.on("authenticated", (sessionId) => {
      console.log("whatsapp-authenticated", sessionId);
      setModalState(false);
      setUsers((prev) => [...prev, sessionId]);
      setCurrentUser(sessionId);
      setQrImg(undefined);
      toast("whatsapp connected!");
      console.log(users);
    });

    socketInstance.on("disconnected", (sessionId) => {
      console.log("whatsapp-disconnected", sessionId);
      toast("whatsapp disconnected!");
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        qrImg,
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        modalState,
        setModalState,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
