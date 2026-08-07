import  { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  MessageSquareDot,
} from "lucide-react";
type Props = {
  currentUrl: string;
};
const MessageButton = ({ currentUrl }: Props) => {
  const navigate = useNavigate();
  let [count, setCount] = useState(0);
  useEffect(() => {
    fetch(currentUrl + "/message/count", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((values) => {
        return values.json();
      })
      .then((thingsToUse) => {
        console.log(thingsToUse);
        setCount(thingsToUse.unreadMessageCount);
      });
  }, []);
  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate("/messages")}
        className="flex items-center gap-1.5 rounded-full px-3"
      >
        {count > 0 ? (
          <MessageSquareDot className="h-4 w-4" />
        ) : (
          <MessageSquare className="h-4 w-4" />
        )}
        <span>Messages</span>
      </Button>
    </div>
  );
};

export default MessageButton;
