import { PlusCircle, Search, SmileIcon, SquarePen } from "lucide-react";
import React from "react";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { Bubble, BubbleContent } from "./components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "./components/ui/message";
type Props = {
  currentUrl: String;
};
const Messages = (props: Props) => {
  return (
    <div>
      <p className="text-2xl font-bold text-left">All messages</p>
      <hr className="mt-3" />
      <div className="flex mt-4">
        <div className="flex-2">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <p className="font-bold text-xl self-center">Messages</p>
              <div className="relative w-10 h-10">
                <p className="absolute inset-0 flex items-center self-center justify-center text-white font-semibold">
                  40
                </p>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  className="w-full h-full block"
                >
                  <circle cx="20" cy="20" r="20" fill="#F93868" />
                </svg>
              </div>
            </div>
            <SquarePen className="self-center" />
          </div>
          <div className="flex justify-between">
            <Input placeholder="Search" className="mt-2 w-4/5" />
            <Search className="self-center" />
          </div>
          <div className="overflow-y-scroll mt-4 h-[80vh] flex flex-col gap-3">
            <div className="flex gap-3 bg-blue-100 p-2">
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
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
            <div className="flex gap-3  p-2">
              <div className="flex">
                <Avatar className="size-15 self-center">
                  <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                  <AvatarFallback>Profile Picture</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col self-center">
                <p className="font-bold text-lg text-left">John William</p>
                <p className="text-left text-sm">
                  I am looking foward to working with you
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-3 ml-5  overflow-y-hidden">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <Avatar className="size-15 self-center">
                <AvatarImage src="../public/IMG_0230 copy.jpeg" />
                <AvatarFallback>Profile Picture</AvatarFallback>
              </Avatar>
              <p className="font-bold self-center text-lg">John William</p>
            </div>
            <Button className="bg-blue-500 self-center">View profile</Button>
          </div>
          <div className="bg-gray-200 mt-4 h-[82vh] flex flex-col justify-end gap-4">
            <div className="p-4 flex flex-col gap-5">
              {/* <p className="text-gray-500">
              All of your chat history will be shown here
            </p> */}
              <Message>
                <MessageAvatar>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </MessageAvatar>
                <MessageContent>
                  <Bubble variant={"muted"}>
                    <BubbleContent>How can I help you today?</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
              <Message align="end">
                <MessageAvatar>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </MessageAvatar>
                <MessageContent>
                  <Bubble>
                    <BubbleContent>How can I help you today?</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </div>
            <div className="flex mb-3 gap-3 p-2">
              <PlusCircle className="self-center" />
              <Input
                placeholder=""
                className="bg-white  border-black self-center"
              />
              <SmileIcon className="self-center" />
              <Button>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
