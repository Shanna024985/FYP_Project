import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
type Props = {
  currentUrl: string;
};
const MessageButton = ({ currentUrl }: Props) => {
  const navigate = useNavigate();
  useEffect(()=>{
    fetch(currentUrl + "/message/count",{
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      }
    })
    .then((values)=>{
      return values.json()
    }).then((thingsToUse)=>{
      console.log(thingsToUse)
    })
  },[])
  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate("/messages")}
        className="flex items-center gap-1.5 rounded-full px-3"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Messages</span>
      </Button>
    </div>
  );
};

export default MessageButton;
