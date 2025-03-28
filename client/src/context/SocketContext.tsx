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

type SocketContextType = {
  socket: Socket | null;
  qrImg: string | null;
  data: {
    whatsappConnectionStatus: boolean | null;
    message: string | null;
  };
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  qrImg: null,
  data:{
    whatsappConnectionStatus:false,
    message:null
  }
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [qrImg, setQrImg] = useState<string | null>(null);
  const [data, setData] = useState({message:'',whatsappConnectionStatus:false});
  // let qrImg :string | null = null;

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");
    const socketInstance = socketRef.current;
    // console.log(socketInstance)

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

    socketInstance.on("whatsapp-connected", (msg) => {
      console.log("whatsapp-connected", msg);
      setData({
        ...data,
        whatsappConnectionStatus: true,
        message: msg,
      });
      toast("whatsapp connected!")
    });

    socketInstance.on("whatsapp-disconnected", (msg) => {
      console.log("whatsapp-disconnected", msg);
      setData({
        ...data,
        whatsappConnectionStatus: false,
        message: msg,
      });
      toast("whatsapp disconnected!")
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, qrImg, data }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
