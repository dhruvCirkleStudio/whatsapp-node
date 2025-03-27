import { createContext, useContext, useEffect, useRef, ReactNode, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  qrImg:string|null;
};

const SocketContext = createContext<SocketContextType>({ socket: null,qrImg:null });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [qrImg, setQrImg] = useState<string | null>(null);
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

    socketInstance.on('qrCode', (newQrCode) => {
      console.log('qrCode',newQrCode)
      setQrImg(newQrCode)
    })

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };

  },[]);
  
  return (
    <SocketContext.Provider value={{ socket,qrImg }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);