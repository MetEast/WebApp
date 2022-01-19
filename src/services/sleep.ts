export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

declare global {
  interface Window {
    ethereum: any;
  }
}