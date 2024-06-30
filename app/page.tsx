import Chat from "@/components/chat";
import { Resource } from "sst";

const topic = "sst-chat";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen p-4">
      <Chat
          endpoint={Resource.ChatRealtime.endpoint}
          authorizer={Resource.ChatRealtime.authorizer}
          topic={`${Resource.App.name}/${Resource.App.stage}/${topic}`}
        />
    </div>
  );
}
