import React from "react";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";

type propForSuccessful = {
  successMessage: string;
  linkForRedirect: string;
  successTitle: string;
  buttonMessage: string;
};
const SuccessfulJobScreen = (props: propForSuccessful) => {
  let navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-5xl">✅</p>
      <h1 className="text-5xl !text-black">{props.successTitle}</h1>
      <p className="text-lg mt-2">{props.successMessage}</p>
      <Button
        className="mt-4"
        onClick={(e) => {
          e.preventDefault();
          navigate(props.linkForRedirect);
        }}
      >
        {props.buttonMessage}
      </Button>
    </div>
  );
};

export default SuccessfulJobScreen;
