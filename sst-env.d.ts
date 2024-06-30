/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    ChatRealtime: {
      authorizer: string
      endpoint: string
      type: "sst.aws.Realtime"
    }
    ChatWeb: {
      type: "sst.aws.Nextjs"
      url: string
    }
  }
}
export {}