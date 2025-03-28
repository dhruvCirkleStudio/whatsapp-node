import { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { Button, Modal, Box } from "@mui/material";

export default function AuthModel() {
  const { qrImg } = useSocket();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" size="medium">
        Add User
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          {qrImg && (
            <div className="mt-5 text-center flex flex-col items-center">
              <p>Scan the QR code to authenticate:</p>
              <img
                src={qrImg}
                alt="WhatsApp QR Code"
                style={{ width: "200px" }}
              />
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
}
