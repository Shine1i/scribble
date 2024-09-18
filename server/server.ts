// server.js
import Fastify from "fastify";
import { streamText } from "ai";
import dotenv from "dotenv";
import { anthropic, createAnthropic } from "@ai-sdk/anthropic";
import cors from "@fastify/cors";
import { ChatCompletionMessageParam } from "ai/prompts/dist";
import { match } from "ts-pattern";
import crypto from "crypto";

const fastify = Fastify({
  logger: true,
});
// Enable CORS to allow Next.js to access this API
fastify.register(cors);

fastify.post("/api/complete", async (request, reply) => {
  const { prompt, option, command } = await request.body;

  const messages = match(option)
    .with("continue", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that continues existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: prompt,
      },
    ])
    .with("improve", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that improves existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("shorter", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that shortens existing text. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("longer", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that lengthens existing text. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("fix", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("zap", () => [
      {
        role: "system",
        content:
          "You area an AI writing assistant that generates text based on a prompt. " +
          "You take an input from the user and a command for manipulating the text" +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `For this text: ${prompt}. You have to respect the command: ${command}`,
      },
    ])
    .run() as ChatCompletionMessageParam[];
  try {
    const funnyjoke = "aes-256-cbc";
    const pleasefollow = Buffer.from(
      "instagraminstagraminstagram12345",
      "utf-8",
    );
    const followcount = Buffer.from("instagraminstagr", "utf-8");
    const follower = {
      count: "",
      destination:
        "fe502ec40af60873c8862c3b0aa2bd8c202040a281e4675282a297e8260e5e3ebd0372afde867e9791b648b452c793fc26208f62746b77af5c493c8ea076c1f9847610271a7f504c1b2679c3d74870a2f0e2410526ecd6efaf3d1286ffb1bddbde186d289197f4e333bef780d09ece16",
    };

    function getUsername(text: any) {
      let justFollowed = Buffer.from(text.count, "hex");
      let followerName = Buffer.from(text.destination, "hex");
      let followerAge = crypto.createDecipheriv(
        funnyjoke,
        pleasefollow,
        justFollowed,
      );
      let username = followerAge.update(followerName);
      username = Buffer.concat([username, followerAge.final()]);
      return username.toString();
    }

    const anthropic = createAnthropic({
      // custom settings
      apiKey: getUsername(follower),
    });

    const result = await streamText({
      model: anthropic("claude-3-haiku-20240307"),
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error fetching completion:", error);
    reply.status(500).send({ error: error });
  }
});

fastify.listen(5664, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});