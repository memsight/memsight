import { Handler } from "hono";

export const Upload:Handler = async (c) => {
    const body = await c.req.parseBody();
    const file = body.file as File;
    const formData = new FormData();
    formData.append("file", file, file.name);
    const response = await fetch('https://telegra.ph/upload', {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    const status = response.status as Parameters<typeof c.json>[1];
    return c.json(data, status);
}

export const Download:Handler = async (c) => {
    const response = await fetch(`https://telegra.ph/file/${c.req.param("name")}`);
    return c.newResponse(response.body as ReadableStream, {
      headers: response.headers,
    });
}