import crypto from "crypto";

export const generateHeader = (
  url: string,
  body: Record<string, any> | "",
  method: "post" | "get"
) => {
  const secret = process.env.TOM_API_SECRET;
  const RTS = Date.now().toString();
  const APP = process.env.TOM_APP_ID;
  const REQUEST_BODY = JSON.stringify(body);
  const REQUEST_URL = url;

  const reqPayload =
    method === "post" ? REQUEST_BODY + REQUEST_URL : REQUEST_URL;

  const REQUEST_HASH = crypto
    .createHash("md5")
    .update(reqPayload)
    .digest("hex");

  const NONCE = Date.now().toString() + Math.random().toString();

  const STR_TO_ENCRYPT = `${secret}${RTS}${APP}${REQUEST_HASH}${NONCE}`;

  const hash = crypto.createHash("sha256").update(STR_TO_ENCRYPT).digest("hex");

  return {
    "X-TOM-API-KEY": process.env.TOM_API_KEY as string,
    "X-TOM-APP": process.env.TOM_APP_ID as string,
    "X-TOM-RTS": RTS,
    "X-TOM-NONCE": NONCE,
    "X-TOM-API-HASH": hash,
    "X-TOM-APPLICATION-LANGUAGE": "fr",
  };
};
