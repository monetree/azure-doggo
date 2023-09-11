import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface ModalDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function ModalDialog({ open, setOpen }: ModalDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  const redirectToAvatarX = () => {
    window.location.href = "https://demo.avatarx.live/";
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Select your avatar ..."}
        </DialogTitle>
        <DialogContent>
          <div className="avatars">
            <div className="avatar" onClick={redirectToAvatarX}>
              <img src="https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg" />
              <p className="text-center mt-3">
                <strong>English</strong>
              </p>
            </div>
            <div className="avatar" onClick={redirectToAvatarX}>
              <img src="https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg" />
              <p className="text-center mt-3">
                <strong>Hindi</strong>
              </p>
            </div>
            <div className="avatar" onClick={redirectToAvatarX}>
              <img
                src="https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg"
                className="img-active"
              />
              <p className="text-center mt-3">
                <strong>English Indian</strong>
              </p>
            </div>
            <div className="avatar" onClick={redirectToAvatarX}>
              <img src="https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg" />
              <p className="text-center mt-3">
                <strong>Arabic</strong>
              </p>
            </div>
            <div className="avatar" onClick={redirectToAvatarX}>
              <img src="https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg" />
              <p className="text-center mt-3">
                <strong>Indian Telugu</strong>
              </p>
            </div>
            <div className="avatar" onClick={redirectToAvatarX}>
              <img src="https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg" />
              <p className="text-center mt-3">
                <strong>English Philipines</strong>
              </p>
            </div>
            <div className="avatar" onClick={redirectToAvatarX}>
              <img src="https://demo.avatarx.live/static/media/avatar-2.912cab5d3e521f02fd53.jpg" />
              <p className="text-center mt-3">
                <strong>Spanish Colombia</strong>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
