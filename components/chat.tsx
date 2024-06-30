"use client";

import { useEffect, useState } from "react";
import { iot, mqtt } from "aws-iot-device-sdk-v2";

function createConnection(endpoint: string, authorizer: string) {
  const client = new mqtt.MqttClient();
  const id = window.crypto.randomUUID();

  return client.new_connection(
    iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets()
      .with_clean_session(true)
      .with_client_id(`client_${id}`)
      .with_endpoint(endpoint)
      .with_custom_authorizer("", authorizer, "", "PLACEHOLDER_TOKEN")
      .build()
  );
}

export default function Chat({
  topic,
  endpoint,
  authorizer,
}: Readonly<{
  topic: string;
  endpoint: string;
  authorizer: string;
}>) {
  const [messages, setMessages] = useState<string[]>([]);
  const [connection, setConnection] =
    useState<mqtt.MqttClientConnection | null>(null);

  useEffect(() => {
    console.log("接続用インスタンスを作成", { topic, endpoint, authorizer });
    const _connection = createConnection(endpoint, authorizer);

    // 接続確立時の処理
    _connection.on("connect", async () => {
      try {
        await _connection.subscribe(topic, mqtt.QoS.AtLeastOnce);
        setConnection(_connection);
        console.log("接続完了", { topic });
      } catch (e) {}
    });

    // メッセージ受信時の処理
    _connection.on("message", (_fullTopic, payload) => {
      const message = new TextDecoder("utf8").decode(new Uint8Array(payload));
      setMessages((prev) => [...prev, message]);
    });

    // エラー時の処理
    _connection.on("error", console.error);

    // 接続開始
    _connection.connect();

    // コンポーネントがアンマウントされた際に接続を切断
    return () => {
      _connection.disconnect();
      setConnection(null);
      console.log("接続を切断", { topic });
    };
  }, [topic, endpoint, authorizer]);

  return (
    <div className="gap-4 w-96 flex p-4 border rounded-lg flex-col-reverse">
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();

          const input = (e.target as HTMLFormElement).message;

          connection!.publish(topic, input.value, mqtt.QoS.AtLeastOnce);
          input.value = "";
        }}
      >
        <input
          className="flex-grow text-sm p-2 rounded-lg border"
          required
          autoFocus
          type="text"
          name="message"
          placeholder={connection ? "なんでも話してね" : "接続中です"}
        />
        <button
          className="text-sm font-medium p-2 rounded-lg border"
          type="submit"
          disabled={connection === null}
        >
          送信
        </button>
      </form>
      {connection && messages.length > 0 && (
        <div className="pb-1 border-b">
          {messages.map((msg, i) => (
            <div key={i} className="leading-tight pb-2">
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
