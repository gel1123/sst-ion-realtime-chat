/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-ion-realtime-chat",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // AWS IoTを用いたリアルタイム通信用のリソースを作成
    const realtime = new sst.aws.Realtime("ChatRealtime", {
      // どのトピックに誰がアクセスできるかの制御を行うLambda関数を指定
      authorizer: "authorizer.handler",
    });
    // Next.jsを作成
    new sst.aws.Nextjs("ChatWeb", {
      // 下記でリンクすることで、指定されたリソースを操作する権限等を与える
      link: [realtime],
    });
  },
});
