const prod = {
  apiUrl: "https://goldbroker.com/api",
  baseUrl: "https://goldbroker.com",
  checkoutKey: "pk_81d704e9-4917-42e4-a19b-ab8084d8f5e5",
};

const dev = {
  apiUrl: "https://sandbox.goldbroker.com/api",
  baseUrl: "https://sandbox.goldbroker.com",
  checkoutKey: "pk_test_e8ed536c-b20e-4541-93a9-bcddd4777b88",
};

export const environment = __DEV__ ? dev : prod;
