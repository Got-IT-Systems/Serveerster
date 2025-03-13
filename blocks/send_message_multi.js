module.exports = {
    name: "Send Message/Interaction (Multi)",

    aliases: [
        "interaction",
        "reply",
        "send",
        "message",
        "msg",
        "follow up",
        "follow-up",
        "defer",
        "defer-reply",
        "full-defer",
        "full-defer-reply",
        "edit",
        "edit-reply",
        "update",
        "update-reply",
        "delete",
        "delete-reply",
        "fetch-reply",
    ],

    description:
        "This State of the Art block allows you to either Reply to Interactions, send(/reply) messages to channels or follow-up messages to interactions.",

    category: "Message Stuff",

    inputs(data) {
        const type = data?.options?.type || "int_reply";
        let inputs = [
            {
                id: "content",
                name: "Text",
                description: "The text to reply.",
                types: ["text", "unspecified"],
            },
            {
                id: "embeds",
                name: "Embed",
                description: "The embeds to reply.",
                types: ["object", "unspecified"],
                multiInput: true,
            },
            {
                id: "components",
                name: "Component",
                description: "The components to reply.",
                types: ["object", "unspecified"],
                multiInput: true,
            },
            {
                id: "files",
                name: "Attachment",
                description: "The attachments to reply. Supports Image, file path and URL.",
                types: ["object", "text", "unspecified"],
                multiInput: true,
            },
        ];

        if (["msg_send"].includes(type)) {
            inputs.unshift({
                id: "channel",
                name: "Channel",
                description: "The channel to send the message.",
                types: ["object", "text", "unspecified"],
                required: true,
            });
            inputs.push({
                id: "poll",
                name: "Poll",
                description: "The poll to send with the message.",
                types: ["object", "unspecified"],
            });
        }

        if (type == "msg_delete") inputs = [];

        if (["msg_reply", "msg_edit", "msg_delete"].includes(type)) {
            inputs.unshift({
                id: "message",
                name: "Message",
                description: "The message to reply.",
                types: ["object", "unspecified"],
                required: true,
            });
        }

        if (["int_defer", "int_full-defer"].includes(type)) {
            inputs = [];
        }

        if (type == "int_delete-reply") {
            inputs = [];
        }

        if (["int_reply", "int_defer", "int_full-defer", "int_edit", "int_update", "int_followup", "int_delete-reply"].includes(type)) {
            inputs.unshift({
                id: "interaction",
                name: "Interaction",
                description: "The interaction to reply.",
                types: ["object", "unspecified"],
                required: true,
            });
            inputs.push({
                id: "ephemeral",
                name: "Private?",
                description: "Whether the reply should be ephemeral (private).",
                types: ["boolean", "unspecified"],
            });
        }

        if (type === "int_fetch-reply") {
            inputs = [];
            inputs.unshift({
                id: "interaction",
                name: "Interaction",
                description: "The interaction to reply.",
                types: ["object", "unspecified"],
                required: true,
            });
        }

        inputs.unshift({
            id: "action",
            name: "Action",
            description: "Executes this block.",
            types: ["action"],
        });

        return inputs;
    },

    options(data) {
        const type = data?.options?.type || "int_reply";
        let options = [
            {
                id: "type",
                name: "Type",
                description: "The type of the message.",
                type: "SELECT",
                options: [
                    {
                        type: "GROUP",
                        name: "Interactions",
                        options: [
                            { id: "int_reply", name: "Reply to Interaction", description: "Replies to the interaction." },
                            { id: "int_defer", name: "Defer Reply", description: "Defers the interaction." },
                            { id: "int_full-defer", name: "Full Defer", description: "Gets Rid of Reply Message entirely." },
                            { id: "int_edit", name: "Edit Reply", description: "Edits the interaction." },
                            { id: "int_update", name: "Update", description: "Updates the interaction." },
                            { id: "int_followup", name: "Follow-up", description: "Sends a follow-up message to the interaction." },
                            { id: "int_delete-reply", name: "Delete Reply", description: "Deletes the interaction." },
                            { id: "int_fetch-reply", name: "Fetch Reply", description: "Fetches the Reply Interaction." },
                        ],
                    },
                    {
                        type: "GROUP",
                        name: "Messages",
                        options: [
                            { id: "msg_send", name: "Send Message", description: "Sends a message to a channel." },
                            { id: "msg_reply", name: "Reply to Message", description: "Replies to a message." },
                            { id: "msg_edit", name: "Edit Message", description: "Edits a message." },
                            { id: "msg_delete", name: "Delete Message", description: "Deletes a message." },
                        ],
                    },
                ],
            },
        ];

        if (["int_reply", "int_defer", "int_full-defer", "int_edit", "int_update", "int_followup", "int_delete-reply"].includes(type)) {
            options.push({
                id: "ephemeral",
                name: "Private?",
                description: "Whether the reply should be ephemeral (private).",
                type: "CHECKBOX",
                defaultValue: true,
            });
        }

        if (["int_edit", "int_update", "msg_edit"].includes(type)) {
            options.push({
                id: "removecomponents",
                name: "Remove Components",
                description: "Removes all components from the message.",
                type: "CHECKBOX",
            });
        }

        if (["int_reply", "int_edit", "int_update", "int_followup", "msg_send", "msg_edit"].includes(type)) {
            options.push({
                id: "splittext",
                name: "Split Content (2000 Chars)",
                description: "If the content is more than 2000 characters, it will split the content into multiple messages.",
                type: "CHECKBOX",
            });
        }

        return options;
    },

    outputs(data) {
        const type = data?.options?.type || "int_reply";
        let outputs = [];

        if (["int_reply", "int_defer", "int_full-defer", "int_edit", "int_update", "int_followup", "int_delete-reply"].includes(type)) {
            outputs.push({
                id: "interaction",
                name: "Interaction",
                description: "The interaction replied.",
                types: ["object"],
            });
        }

        if (["int_fetch-reply"].includes(type)) {
            outputs.push(
                {
                    id: "interaction",
                    name: "Interaction",
                    description: "The interaction replied.",
                    types: ["object"],
                },
                {
                    id: "message",
                    name: "Message",
                    description: "The message replied.",
                    types: ["object"],
                }
            );
        }

        if (["msg_send", "msg_reply", "msg_edit"].includes(type)) {
            outputs.push({
                id: "message",
                name: "Message",
                description: "The message that was sent.",
                types: ["object", "list", "unspecified"],
            });
        }

        outputs.unshift({
            id: "action",
            name: "Action",
            description: "Executes the following blocks when this block finishes its task.",
            types: ["action"],
        });

        return outputs;
    },

    /* inputs: [
        {
            id: "action",
            name: "Action",
            description: "Acceptable Types: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "interaction",
            name: "Interaction",
            description:
                "Acceptable Types: Object, Unspecified\n\nDescription: The interaction to reply.",
            types: ["object", "unspecified"],
            required: true
        },
        {
            id: "ephemeral",
            name: "Private?",
            description:
                "Acceptable Types: Boolean, Unspecified\n\nDescription: Whether the reply should be ephemeral (private).",
            types: ["boolean", "unspecified"]
        },
        {
            id: "content",
            name: "Text",
            description: "Acceptable Types: Text, Unspecified\n\nDescription: The text to reply.",
            types: ["text", "unspecified"]
        },
        {
            id: "embeds",
            name: "Embed",
            description:
                "Acceptable Types: Object, Unspecified\n\nDescription: The embeds to reply.",
            types: ["object", "unspecified"],
            multiInput: true
        },
        {
            id: "components",
            name: "Component",
            description:
                "Acceptable Types: Object, Unspecified\n\nDescription: The components to reply.",
            types: ["object", "unspecified"],
            multiInput: true
        },
        {
            id: "files",
            name: "Attachment",
            description:
                "Acceptable Types: Object, Text, Unspecified\n\nDescription: The attachments to reply. Supports Image, file path and URL.",
            types: ["object", "text", "unspecified"],
            multiInput: true
        }
    ], */

    /* options: [
        {
            id: "follow_up",
            name: "Follow-up",
            description: "Sends a follow-up message to the interaction instead.",
            type: "CHECKBOX"
        }
    ], */

    /* outputs: [
        {
            id: "action",
            name: "Action",
            description:
                "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "message",
            name: "Message",
            description: "The message replied.",
            types: ["object"]
        }
    ], */

    async code(cache) {
        const { ActionRowBuilder, MessageFlags } = require("discord.js");
        const type = this.GetOptionValue("type", cache) || "int_reply";

        const typeFunctionList = {
            int_reply: "reply",
            int_defer: "deferReply",
            int_edit: "editReply",
            int_update: "update",
            int_followup: "followUp",
            "int_delete-reply": "deleteReply",
            "int_fetch-reply": "fetchReply",
            msg_send: "send",
            msg_reply: "reply",
            msg_edit: "edit",
            msg_delete: "delete",
        };

        const isInteraction = type.startsWith("int_");
        const isMessage = type.startsWith("msg_");

        function getComponents(components) {
            if (components?.length > 0) {
                let defaultRow;

                const res = components.reduce((arr, component) => {
                    // Action Row
                    if (component.data?.type === 1) {
                        if (defaultRow) {
                            arr.push(defaultRow);
                            defaultRow = undefined;
                        }
                        arr.push(component);
                    } else {
                        if (!defaultRow) {
                            defaultRow = new ActionRowBuilder();
                        }

                        if (defaultRow.components.length === 5) {
                            arr.push(defaultRow);
                            defaultRow = new ActionRowBuilder();
                        }

                        defaultRow.addComponents(component);
                    }
                    return arr;
                }, []);

                if (defaultRow) res.push(defaultRow);

                return res;
            } else {
                return undefined;
            }
        }

        async function handleInteraction(opts) {
            if (opts.interaction.deferred && !opts.update) return await opts.interaction.editReply(opts.options);
            if ((opts.interaction.replied || opts.followUp) && !opts.update) return await opts.interaction.followUp(opts.options);
            return await opts.interaction[typeFunctionList[type]](opts.options);
        }

        if (isInteraction) {
            const interaction = this.GetInputValue("interaction", cache);
            const ephemeral = this.GetOptionValue("ephemeral", cache) === true;
            let content = this.GetInputValue("content", cache);
            const removecomponents = this.GetOptionValue("removecomponents", cache);
            const embeds = this.GetInputValue("embeds", cache)?.filter((a) => a);
            const components = this.GetInputValue("components", cache)?.filter((a) => a);
            const files = this.GetInputValue("files", cache)?.filter((a) => a);

            const splittext = this.GetOptionValue("splittext", cache);

            if (splittext && content.length > 2000) {
                const splitContent = content.match(/[\s\S]{1,2000}/g);
                for (let i = 0; i < splitContent.length; i++) {
                    const options = {
                        content: splitContent[i],
                        embeds: embeds.length > 0 ? embeds : undefined,
                        components: removecomponents ? [] : getComponents(components),
                        files: files.length > 0 ? files : undefined,
                        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
                    };

                    try {
                        const returnvalue = await handleInteraction({interaction: interaction, options: options, followUp: (i >= 1)});
                        this.StoreOutputValue(returnvalue, "message", cache);
                    } catch (err) {
                        console.error(err);
                    }
                }
                this.RunNextBlock("action", cache);
            } else {
                const options = {
                    content: content,
                    embeds: embeds.length > 0 ? embeds : undefined,
                    components: removecomponents ? [] : getComponents(components),
                    files: files.length > 0 ? files : undefined,
                    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
                };

                handleInteraction({interaction: interaction, options: options, update: ["int_edit", "int_update"].includes(type)})
                    .then((message) => {
                        this.StoreOutputValue(message, "message", cache);
                        this.RunNextBlock("action", cache);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        } else if (isMessage) {
            if (type === "msg_send") {
                const channel = this.GetInputValue("channel", cache);
                const content = this.GetInputValue("content", cache);
                const embeds = this.GetInputValue("embeds", cache)?.filter((a) => a);
                const components = this.GetInputValue("components", cache)?.filter((a) => a);
                const files = this.GetInputValue("files", cache)?.filter((a) => a);
                const poll = this.GetInputValue("poll", cache);

                const splittext = this.GetOptionValue("splittext", cache);

                if (splittext && content.length > 2000) {
                    const splitContent = content.match(/[\s\S]{1,2000}/g);
                    for (let i = 0; i < splitContent.length; i++) {
                        const options = {
                            content: splitContent[i],
                            embeds: embeds.length > 0 ? embeds : undefined,
                            components: i === 0 ? getComponents(components) : [],
                            files: files.length > 0 ? files : undefined,
                            poll: poll,
                        };

                        try {
                            const returnvalue = await channel.send(options);
                            this.StoreOutputValue(returnvalue, "message", cache);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                    this.RunNextBlock("action", cache);
                    return;
                } else {
                    const options = {
                        content,
                        embeds: embeds.length > 0 ? embeds : undefined,
                        components: getComponents(components),
                        files: files.length > 0 ? files : undefined,
                        poll: poll,
                    };

                    try {
                        const returnvalue = await channel.send(options);
                        this.StoreOutputValue(returnvalue, "message", cache);
                    } catch (err) {
                        console.error(err);
                    }
                }
            } else if (type === "msg_reply") {
                const message = this.GetInputValue("message", cache);
                const content = this.GetInputValue("content", cache);
                const embeds = this.GetInputValue("embeds", cache).filter((a) => a);
                const components = this.GetInputValue("components", cache).filter((a) => a);
                const files = this.GetInputValue("files", cache).filter((a) => a);

                const options = {
                    content,
                    embeds: embeds.length > 0 ? embeds : undefined,
                    components: getComponents(components),
                    files: files.length > 0 ? files : undefined,
                };

                try {
                    const returnvalue = await message.reply(options);
                    this.StoreOutputValue(returnvalue, "message", cache);
                } catch (err) {
                    console.error(err);
                }
            } else if (type === "msg_edit") {
                const message = this.GetInputValue("message", cache);
                const content = this.GetInputValue("content", cache);
                const removecomponents = this.GetOptionValue("removecomponents", cache);
                const embeds = this.GetInputValue("embeds", cache).filter((a) => a);
                const components = this.GetInputValue("components", cache).filter((a) => a);
                const files = this.GetInputValue("files", cache).filter((a) => a);

                const options = {
                    content,
                    embeds: embeds.length > 0 ? embeds : undefined,
                    components: removecomponents ? [] : getComponents(components),
                    files: files.length > 0 ? files : undefined,
                };

                try {
                    const returnvalue = await message.edit(options);
                    this.StoreOutputValue(returnvalue, "message", cache);
                } catch (err) {
                    console.error(err);
                }
            } else if (type === "msg_delete") {
                const message = this.GetInputValue("message", cache);
                try {
                    await message.delete();
                } catch (err) {
                    console.error(err);
                }
            }
            this.RunNextBlock("action", cache);
        }
    },
};
