module.exports = {
    name: "Gemini AI Chat",

    description: "Use the Google Gemini AI API to ask questions and return useful answers in a Chat Version (Remembers last Messages)",

    category: "GeminiAI",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "text",
            "name": "Text",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The text to put in the message.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "image",
            "name": "Image",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The Image you want the AI to see. Supports URL and Path.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "instructions",
            "name": "System Instructions",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: Instruct what the model should act like (i.e. a persona, output format, style/tone, goals/rules, and additional context)",
            "types": ["text", "unspecified"]
        },
        {
            "id": "srv_usr_mem",
            "name": "Server/User/Member",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The Server/User/Member who owns the Chat...",
            "types": ["object", "unspecified"],
            "required": true
        }
    ],

    options: [
        {
            "id": "key",
            "name": "API Key",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The Cookie Secret of the Gemini AI. \nYou can find more Info on how to get the Cookie Secret at: \nhttps://aistudio.google.com/app/apikey",
            "type": "TEXT"
        },
        {
            "id": "instructions",
            "name": "System Instructions",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: Instruct what the model should act like (i.e. a persona, output format, style/tone, goals/rules, and additional context)",
            "type": "text",
            "defaultValue": "You must stay under 2000 Characters in the response, but can get near the 2000 characters if required! You are in a Discord Chat, replying to a Member and are able to use Discord Formatting to reply to messages!"
        },
        {
            "id": "text",
            "name": "Text",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The text to put in the message.",
            "type": "TEXT"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action (Complete)",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "response",
            "name": "Response (Complete)",
            "description": "Type: Object\n\nDescription: The message obtained.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "action_stream",
            "name": "Action (Stream)",
            "description": "Type: Action\n\nDescription: This Action will run every Time the AI sends a new part of the Message.",
            "types": ["action"]
        },
        {
            "id": "response_stream",
            "name": "Response (Stream)",
            "description": "Type: Object\n\nDescription: This Streams a part of the generated Text. You can use this to edit a existing Message with the AI.",
            "types": ["text", "unspecified"]
        }
    ],

    async code(cache, DBB) {
        try {
            const success = await DBB.Dependencies.PackageManager.requires({ name: "gemini-ai", version: "latest", dnr: true })
            if(!success) console.log("Failed to install dependencies! (Gemini AI Chat)")
        } catch (e) {
            console.log(e)
        }
        import("gemini-ai").then(async ({ default: Gemini }) => {
            const axios = require("axios");
            const key = this.GetOptionValue("key", cache);
            const text = this.GetInputValue("text", cache) ?? this.GetOptionValue("text", cache);
            const obj = this.GetInputValue("srv_usr_mem", cache);
            const instructions = this.GetInputValue("instructions", cache) ?? this.GetOptionValue("instructions", cache) ?? "You must stay under 2000 Characters in the response, but can get near the 2000 characters if required! You are in a Discord Chat, replying to a Member and are able to use Discord Formatting to reply to messages!";
            const image = this.GetInputValue("image", cache);

            let url = image;
            if (image && image.startsWith("http")) {
                const {data} = await axios.get(image, {
                    responseType: "arraybuffer"
                })
                if(data) url = data;
            }

            try {
                let gemini = new Gemini(key)
                if (!this.getDBB().Data.data.custom[obj.id]) {
                    let conv = gemini.createChat({systemInstruction: instructions})
                    let parts = "";
                    const response = await conv.ask([text, url ?? null], {
                        stream: (part) => {
                            parts += part;
                            this.StoreOutputValue(parts, "response_stream", cache);
                            this.RunNextBlock("action_stream", cache);
                        }
                    });
                    this.getDBB().Data.data.custom[obj.id] = JSON.stringify(conv.messages);
                    this.saveData()
                    this.StoreOutputValue(response, "response", cache);
                    this.RunNextBlock("action", cache);
                } else {
                    let chat = this.getDBB().Data.data.custom[obj.id];
                    let conv = gemini.createChat({messages: JSON.parse(chat), systemInstruction: instructions})
                    let parts = "";
                    const response = await conv.ask([text, url ?? null], {
                        stream: (part) => {
                            parts += part;
                            this.StoreOutputValue(parts, "response_stream", cache);
                            this.RunNextBlock("action_stream", cache);
                        }
                    });
                    this.getDBB().Data.data.custom[obj.id] = JSON.stringify(conv.messages);
                    this.saveData()
                    this.StoreOutputValue(response, "response", cache);
                    this.RunNextBlock("action", cache);
                }
            } catch (error) {
                console.error(error);
                this.StoreOutputValue("An Error Occured, please Verify your API Key! (Check Console for More Info)", "response", cache)
                this.RunNextBlock("action", cache)
            }
        })
        .catch((err) => {
            console.error(err)
            this.StoreOutputValue("Error Gemini AI Package is missing, you can install it by using `npm i gemini-ai` in a terminal in the Bot Folder. Sorry for this Workaround.", "response", cache)
            this.RunNextBlock("action", cache)
        });

    }
}