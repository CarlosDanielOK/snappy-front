"use client";

import { UserContext } from "@/context/UserContext";
import { timeAgo } from "@/helpers/timeAgo";
import { snappUsers } from "@/helpers/users";
import { useSocket } from "@/helpers/useSocket";
import { Chats, IMessage } from "@/interfaces/types";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

interface IUserAPIResponse {
  username: string;
  id: string;
  user_type?: string;
  fullname?: string;
  chats?: Chats[];
  profile_image: string;
  following?: { id: string; username: string; profile_image: string }[];
  followers?: { id: string; username: string; profile_image: string }[];
}

const ChatView = () => {
  const [distance, setDistance] = useState<string>("");
  const [userList, setUserList] = useState<IUserAPIResponse[]>([]);
  const [randomUser, setRandomUser] = useState<IUserAPIResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRequestSent, setIsRequestSent] = useState<boolean>(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(
    new Set<string>()
  );
  const [chat, setChat] = useState<Chats | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { userId, userData } = useContext(UserContext);
  const { sendMessage } = useSocket(null, chat, setMessages, undefined);

  useEffect(() => {
    const savedRequests = localStorage.getItem("sentRequests");
    if (savedRequests) {
      setSentRequests(new Set(JSON.parse(savedRequests)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sentRequests", JSON.stringify([...sentRequests]));
  }, [sentRequests]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    (async () => {
      try {
        const users: IUserAPIResponse[] = await snappUsers(userId);

        setUserList(users);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleSendMessage = async (receiverId: string) => {
    if (!message.trim() || !userData) {
      return;
    }

    let chatId = chat?.id;

    const users = [receiverId, userId];
    const createChatResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chats`,
      {
        method: "POST",
        body: JSON.stringify({ userIds: users }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (createChatResponse.ok) {
      const newChat = await createChatResponse.json();
      setChat(newChat);
      chatId = newChat.id;
    } else {
      console.error("Error creating chat");
      return;
    }

    const newMessage = {
      content: message,
      chatId: chatId,
      sender_id: userData.id,
      type: "text",
      is_anonymous: false,
      messageReceivers: receiverId ? [receiverId] : [],
    };

    try {
      const sendDate = new Date();

      const messagesData = {
        username: userData.username,
        sender_id: userData.id,
        user_type: userData.user_type,
        profile_image: userData.profile_image,
        content: message,
        send_date: sendDate,
        type: "text",
        is_anonymous: false,
        chat_id: chatId,
      };
      setMessages((prevMessages) => [...prevMessages, messagesData]);

      sendMessage(newMessage);

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSnappear = async () => {
    if (userList.length > 0) {
      const newRandomUser =
        userList[Math.floor(Math.random() * userList.length)];
      setRandomUser(newRandomUser);
      setMessages([]);

      const getDistance = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userData?.id}/distance/${newRandomUser.id}`
      );
      const distanceData = await getDistance.text();
      if (distanceData.includes("Not Found")) {
        setDistance("Sin ubicación");
      } else {
        setDistance(distanceData);
      }

      if (sentRequests.has(newRandomUser.id)) {
        setIsRequestSent(true);
        console.log(isRequestSent);
      } else {
        setIsRequestSent(false);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mt-5 mb-5">
        <div className="bg-white rounded-lg shadow-md w-full max-w-lg relative p-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center">
              <div className="relative w-12 h-12">
                <Image
                  src={randomUser?.profile_image || "/agregarfoto.png"}
                  alt="Foto de perfil"
                  layout="fill"
                  className="rounded-full object-cover"
                />
              </div>
              <div className="">
                {loading ? (
                  <p className="text-gray-500">Cargando usuario...</p>
                ) : randomUser ? (
                  <>
                    <h1 className="text-lg font-semibold flex items-center pl-2">
                      <Link
                        href={`/perfil/${randomUser.username}`}
                        className="text-black hover:underline"
                      >
                        @{randomUser.username}
                      </Link>
                    </h1>

                    <p className="text-sm text-gray-500 pl-2">
                      {randomUser.fullname} - {distance}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500"> Te esperan nuevos usuarios !</p>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <button
                onClick={handleSnappear}
                className="relative h-10 w-10 cursor-pointer "
                aria-label="Buscar nuevo usuario"
                title="Snappear"
              >
                <Image
                  src="/snappear.png"
                  alt="Snappear"
                  layout="fill"
                  className="object-contain"
                />
              </button>
            </div>
          </div>
          <div className="flex-1 px-4 py-6 overflow-y-auto min-h-[60vh]">
            {randomUser ? (
              <>
                {chat ? (
                  messages.length > 0 ? (
                    messages.map((uniqueMsg, index) => {
                      const isSender = uniqueMsg.sender_id === userData?.id;

                      const divContainer = isSender ? (
                        <div
                          className="flex mb-4 justify-end"
                          key={`${uniqueMsg.sender_id}-${index}`}
                        >
                          <div className="max-w-xs p-3 rounded-lg shadow-md bg-blue-100 text-right">
                            <p className="text-sm font-bold mb-1">
                              {isSender
                                ? "Tú"
                                : uniqueMsg.username || "Desconocido"}
                            </p>
                            <p className="text-base mb-1">
                              {uniqueMsg.content}
                            </p>
                            <p className="text-xs text-gray-500">
                              {timeAgo(
                                new Date(uniqueMsg.send_date).toISOString()
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex mb-4 justify-start"
                          key={`${uniqueMsg.sender_id}-${index}`}
                        >
                          <div className="max-w-xs p-3 rounded-lg shadow-md bg-gray-200 text-left">
                            <p className="text-sm font-bold mb-1">
                              {uniqueMsg.username || "Desconocido"}
                            </p>
                            <p className="text-base mb-1">
                              {uniqueMsg.content}
                            </p>
                            <p className="text-xs text-gray-500">
                              {timeAgo(
                                new Date(uniqueMsg.send_date).toISOString()
                              )}
                            </p>
                          </div>
                        </div>
                      );

                      return divContainer;
                    })
                  ) : (
                    <p className="text-center text-gray-400">
                      Inicia tu conversación con @{randomUser.username}
                    </p>
                  )
                ) : (
                  <p className="text-center text-gray-400">
                    Inicia tu conversación con @{randomUser.username}
                  </p>
                )}
              </>
            ) : (
              <p className="text-center text-gray-400">Comienza a Snappear !</p>
            )}
          </div>

          <div className="px-4 py-3 border-t flex items-center">
            <input
              value={message}
              type="text"
              placeholder="Escribe un mensaje..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if(e.key === "Enter") {
                  e.preventDefault();
                  if (randomUser?.id) {
                    handleSendMessage(randomUser.id)
                  } else {
                    console.error("Random user ID is not available")
                  }
                }
              }}
            />
            <div className="flex items-center ml-3 space-x-3">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
                onClick={() => {
                  if (randomUser?.id) {
                    handleSendMessage(randomUser.id);
                  } else {
                    console.error("Random user ID is not available");
                  }
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex justify-center w-full">
        
      </div> */}
    </div>
  );
};

export default ChatView;
