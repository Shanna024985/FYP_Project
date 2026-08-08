import { Search, SquarePen, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { Bubble, BubbleContent } from "./components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "./components/ui/message";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./components/ui/context-menu";
type Props = {
  currentUrl: String;
};

type listOfMessages = {
  user_id: string;
  most_recent_message: string;
  profile_picture_file_name: string;
  time_sent: string;
  user_name: string;
  profile_picture_file_data: File;
};
type Message = {
  id: string;
  message: string;
  time_sent: string; // ISO 8601 timestamp

  sender_id: string;
  sender_user_name: string;
  sender_profile_picture_file_name: string;
  sender_profile_picture_file_url: string;

  receiver_id: string;
  receiver_user_name: string;
  receiver_profile_picture_file_name: string;
  receiver_profile_picture_file_url: string;
};
type messageJson = {
  message: string;
  sender_user_id: string;
  sender_user_name: string;
  sender_profile_picture_file_name: string;
  sender_profile_picture_file_url: string;
  receiver_user_id: string;
  receiver_user_name: string;
  receiver_profile_picture_file_name: string;
  receiver_profile_picture_file_url: string;
  time_sent: string;
  id: string;
};
const Messages = (props: Props) => {
  const socket = useRef<WebSocket | null>(null);
  let [listOfPeople, setListOfpeople] = useState<listOfMessages[]>();
  let [profileOfUserSelected, setProfileOfUserSelected] =
    useState<listOfMessages>();
  let [messagesJson, setMessagesJson] = useState<messageJson[]>();
  let [inputMessage, setInputMessage] = useState("");
  let messageDiv = useRef<HTMLDivElement>(null);
  let [classNameForButtons, setClassNameForButtons] = useState("");
  let [classNameForEditButton, setClassNameForEditButton] = useState("hidden");
  let inputRef = useRef<HTMLInputElement>(null);
  let [currentIdToEdit, setCurrentIdToEdit] = useState("");
  useEffect(() => {
    socket.current = new WebSocket(
      "wss://fyp-project-fkmo.onrender.com/?token=" +
        localStorage.getItem("token"),
    );
    socket.current.onopen = () => {
      console.log("Connected");
    };
    socket.current.onmessage = (event) => {
      console.log(event)
      fetch(props.currentUrl + "/message/" + event.data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((messagesJsonNew) => {
          setMessagesJson(messagesJsonNew);
          if (messagesJsonNew.length === 0) return;

          const latestMessage = messagesJsonNew[messagesJsonNew.length - 1];

          setListOfpeople((prevPeople) =>
            prevPeople?.map((person) =>
              person.user_id === latestMessage.sender_user_id
                ? {
                    ...person,
                    most_recent_message: latestMessage.message,
                  }
                : person,
            ),
          );
        });
    };
    fetch(props.currentUrl + "/message/list", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((value) => {
        return value.json();
      })
      .then((values) => {
        setProfileOfUserSelected(values[0]);
        setListOfpeople(values);

        fetch(props.currentUrl + "/message/" + values[0].user_id, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
          .then((value) => {
            return value.json();
          })
          .then((messagesJson) => {
            setMessagesJson(messagesJson);
            console.log(messagesJson);
          });
      });
  }, []);
  useEffect(() => {
    if (messageDiv.current) {
      messageDiv.current.scrollTop = messageDiv.current.scrollHeight;
    }
  }, [messagesJson]);
  return (
    <div>
      <p className="text-2xl font-bold text-left">All messages</p>
      <hr className="mt-3" />
      <div className="flex mt-4">
        <div className="flex-2">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <p className="font-bold text-xl self-center">Messages</p>
            </div>
            {/* <SquarePen className="self-center" /> */}
          </div>
          <div className="flex justify-between">
            <Input placeholder="Search" className="mt-2 w-9/10" />
            <Search className="self-center" />
          </div>
          <div className="overflow-y-scroll mt-4 h-[80vh] flex flex-col gap-3">
            {listOfPeople?.map((values, index) => {
              if (index == 0) {
                return (
                  <>
                    <div className="flex gap-3 bg-blue-100 dark:bg-[#172c67] p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="7"
                        height="fit"
                        viewBox="0 0 7 92"
                        fill="none"
                        className="self-center"
                      >
                        <line
                          x1="3.5"
                          y1="3.5"
                          x2="3.5"
                          y2="88.5"
                          stroke="#2A88E0"
                          stroke-width="7"
                          stroke-linecap="round"
                        />
                      </svg>
                      <div className="flex">
                        <Avatar className="size-15 self-center">
                          <AvatarImage
                            src={`data:image/jpeg;base64,${values.profile_picture_file_data}`}
                          />
                          <AvatarFallback>Profile Picture</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col self-center">
                        <p className="font-bold text-lg text-left">
                          {values.user_name}
                        </p>
                        <p className="text-left text-sm">
                          {values.most_recent_message}
                        </p>
                      </div>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="flex gap-3  p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="7"
                        height="fit"
                        viewBox="0 0 7 92"
                        fill="none"
                        className="self-center"
                      >
                        <line
                          x1="3.5"
                          y1="3.5"
                          x2="3.5"
                          y2="88.5"
                          stroke="#FFFFF"
                          stroke-width="7"
                          stroke-linecap="round"
                        />
                      </svg>
                      <div className="flex">
                        <Avatar className="size-15 self-center">
                          <AvatarImage
                            src={`data:image/jpeg;base64,${values.profile_picture_file_data}`}
                          />
                          <AvatarFallback>Profile Picture</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col self-center">
                        <p className="font-bold text-lg text-left">
                          {values.user_name}
                        </p>
                        <p className="text-left text-sm">
                          {values.most_recent_message}
                        </p>
                      </div>
                    </div>
                  </>
                );
              }
            })}
          </div>
        </div>
        <div className="flex-3 ml-5  overflow-y-hidden">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <Avatar className="size-15 self-center">
                <AvatarImage
                  src={`data:image/jpeg;base64,${profileOfUserSelected?.profile_picture_file_data}`}
                />
                <AvatarFallback>Profile Picture</AvatarFallback>
              </Avatar>
              <p className="font-bold self-center text-lg">
                {profileOfUserSelected?.user_name}
              </p>
            </div>
            {/* <Button className="bg-blue-500 self-center">View profile</Button> */}
          </div>
          <div className="bg-gray-200 dark:bg-[#4f4c4c] mt-4 h-[82vh] flex flex-col justify-end gap-4">
            <div
              className="p-4 flex flex-col gap-5 overflow-y-scroll"
              ref={messageDiv}
            >
              {/* <p className="text-gray-500">
                All of your chat history will be shown here
              </p> */}

              {messagesJson?.map((valueOfMessage) => {
                console.log(messagesJson);

                if (
                  valueOfMessage.sender_user_id ==
                  profileOfUserSelected?.user_id
                ) {
                  return (
                    <>
                      <Message>
                        <MessageAvatar>
                          <Avatar>
                            <AvatarImage
                              src={
                                valueOfMessage.sender_profile_picture_file_url
                              }
                              alt={
                                valueOfMessage.sender_profile_picture_file_name
                              }
                            />
                            <AvatarFallback>
                              {valueOfMessage.sender_user_name}
                            </AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                        <MessageContent>
                          <Bubble variant={"muted"}>
                            <BubbleContent>
                              {valueOfMessage.message}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </>
                  );
                } else if (
                  valueOfMessage.receiver_user_id ==
                  profileOfUserSelected?.user_id
                ) {
                  return (
                    <>
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <Message align="end">
                            <MessageAvatar>
                              <Avatar>
                                <AvatarImage
                                  src={
                                    valueOfMessage.sender_profile_picture_file_url
                                  }
                                  alt={
                                    valueOfMessage.sender_profile_picture_file_name
                                  }
                                />
                                <AvatarFallback>
                                  {" "}
                                  {valueOfMessage.sender_user_name}
                                </AvatarFallback>
                              </Avatar>
                            </MessageAvatar>
                            <MessageContent>
                              <Bubble>
                                <BubbleContent>
                                  {valueOfMessage.message}
                                </BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem
                            onClick={() => {
                              setInputMessage(valueOfMessage.message);
                              setClassNameForButtons("hidden");
                              setClassNameForEditButton("");
                              setCurrentIdToEdit(valueOfMessage.id);
                              inputRef.current?.focus();
                            }}
                          >
                            <SquarePen /> Edit
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              fetch(
                                props.currentUrl +
                                  "/message/" +
                                  valueOfMessage.id,
                                {
                                  method: "DELETE",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization:
                                      "Bearer " + localStorage.getItem("token"),
                                  },
                                },
                              )
                                .then((values) => {
                                  return values.json();
                                })
                                .then(() => {
                                  let newMessageJson = messagesJson.filter(
                                    (value) => value.id !== valueOfMessage.id,
                                  );
                                  setMessagesJson(newMessageJson);
                                });
                            }}
                          >
                            <Trash color="red" /> Delete
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    </>
                  );
                }
              })}
            </div>
            <div className="flex mb-3 gap-3 p-2">
              {/* <PlusCircle className="self-center" /> */}
              <Input
                placeholder=""
                className="bg-white  border-black self-center"
                id="thingsToMessage"
                onChange={(e) => {
                  setInputMessage(e.currentTarget.value);
                }}
                autoFocus
                value={inputMessage}
                ref={inputRef}
              />
              {/* <SmileIcon className="self-center" /> */}
              <Button
                className={classNameForButtons}
                onClick={() => {
                  let body = JSON.stringify({
                    receiverUserId: profileOfUserSelected?.user_id,
                    message: inputMessage,
                  });
                  fetch(props.currentUrl + "/message", {
                    method: "POST",
                    body: body,
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  })
                    .then((valuesReturned) => {
                      return valuesReturned.json();
                    })
                    .then((valuesToDeal) => {
                      let messageJsonReceived: Message =
                        valuesToDeal.messageJson;
                      let newMessageJsonToDeal: messageJson = {
                        message: messageJsonReceived.message,
                        time_sent: messageJsonReceived.time_sent,
                        sender_user_id: messageJsonReceived.sender_id,
                        sender_user_name: messageJsonReceived.sender_user_name,
                        sender_profile_picture_file_name:
                          messageJsonReceived.sender_profile_picture_file_name,
                        sender_profile_picture_file_url:
                          messageJsonReceived.sender_profile_picture_file_url,
                        receiver_user_id: messageJsonReceived.receiver_id,
                        receiver_user_name:
                          messageJsonReceived.receiver_user_name,
                        receiver_profile_picture_file_name:
                          messageJsonReceived.receiver_profile_picture_file_name,
                        receiver_profile_picture_file_url:
                          messageJsonReceived.receiver_profile_picture_file_url,
                        id: messageJsonReceived.id,
                      };
                      setMessagesJson([
                        ...(messagesJson ?? []),
                        newMessageJsonToDeal,
                      ]);
                      let newListOfPeople = listOfPeople?.map((values) => {
                        if (values.user_id == profileOfUserSelected?.user_id) {
                          return {
                            ...values,
                            most_recent_message: messageJsonReceived.message,
                          };
                        } else {
                          return values;
                        }
                      });
                      setListOfpeople(newListOfPeople);
                      setInputMessage("");
                    });
                }}
              >
                Send
              </Button>
              <Button
                className={classNameForEditButton}
                onClick={() => {
                  let body = JSON.stringify({
                    message: inputMessage,
                  });
                  fetch(props.currentUrl + "/message/" + currentIdToEdit, {
                    method: "PUT",
                    body: body,
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  })
                    .then((Value) => {
                      return Value.json();
                    })
                    .then(() => {
                      let newMessageJsonComplete = messagesJson?.map(
                        (values) => {
                          if (values.id == currentIdToEdit) {
                            return {
                              ...values,
                              message: inputMessage,
                            };
                          } else {
                            return values;
                          }
                        },
                      );
                      let newListOfPeople = listOfPeople?.map((values) => {
                        if (values.user_id == profileOfUserSelected?.user_id) {
                          return {
                            ...values,
                            most_recent_message: inputMessage,
                          };
                        } else {
                          return values;
                        }
                      });
                      setListOfpeople(newListOfPeople);
                      setMessagesJson(newMessageJsonComplete);
                      setInputMessage("");
                      setClassNameForEditButton("hidden");
                      setClassNameForButtons("");
                    });
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
