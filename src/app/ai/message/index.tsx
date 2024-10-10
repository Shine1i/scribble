import { BaseMessage, Message } from "../aiDashboard"
import { AgentMessage } from "./agent"
import { UserMessage } from "./user"


export const RenderMessage = ({message}: {message: Message}) => {
    return (
        <div>
            {message.role === "user" ? <UserMessage message={message} /> : <AgentMessage message={message} />}
        </div>
    )
}

export const RenderMessages = ({messages}: {messages: Message[]}) => {
    return (
        <div>
            {messages.map((message, index) => <RenderMessage key={index} message={message} />)}
        </div>
    )
}
