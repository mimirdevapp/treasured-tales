import he from "he";

const decode = (value?: string) => {
  if (!value) return "";
  return he.decode(value);
};

export default decode;
