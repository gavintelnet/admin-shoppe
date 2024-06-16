import { useContext, useEffect, useState } from "react"
import { ChatContext } from "../context/ChatContext"
import { getMessageUserChat } from "../api/utils/chat"


export const useFetchLatestMessage = (chat: any) => {
    const { newMessage, notifications } = useContext(ChatContext)
    const [latestMessage, setLatestMessage] = useState<any>(null)

    useEffect(() => {
        const getMessage = async () => {
            const response = await getMessageUserChat(chat?._id)

            if (response.status) {
                const lastMessage = response?.result[response?.result?.length - 1]

                setLatestMessage(lastMessage)
            }
        }
        getMessage()
    }, [newMessage, notifications, chat?._id])

    return { latestMessage }
}