export interface IBasePage {
  render: () => Promise<void>;
  cleanUp?: () => void;
}
