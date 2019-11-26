export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  STRIPE_KEY: "pk_test_KCrcdENJZiwIMdnnvNm9MceS00t2PjCLaK",
  s3: {
    REGION: "us-east-2",
    BUCKET: "drinktionary-app-api-dev-attachmentsbucket-s0xc3x1p13h2"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://ixmclt5131.execute-api.us-east-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_P68l87Pgw",
    APP_CLIENT_ID: "2h0elsk14bbn4k8a3vu2j293lr",
    IDENTITY_POOL_ID: "us-east-2:004087e2-d8e2-44c6-94ca-d6fa03897ed7"
  }
};
