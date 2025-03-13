module.exports = {
    name: "Get Modal Field Value",

    description: "Gets the Argument by Name from a Modal by @XCraftTM",

    category: "Interaction Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Executes this block.",
            "types": ["action"]
        },
        {
            "id": "interaction",
            "name": "Interaction",
            "description": "The Interaction of the Modal Input Event",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "customid",
            "name": "CustomID",
            "description": "The CustomID of the Input Field you want to get the Arguments from!",
            "types": ["text", "unspecified"]
        }
    ],

    options: [
        {
            "id": "customid",
            "name": "CustomID",
            "description": "The CustomID of the Input Field you want to get the Arguments from!",
            "type": "TEXT"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "text",
            "name": "Text",
            "description": "The Property Value Obtained.",
            "types": ["unspecified"]
        }
    ],

    async code(cache) {
        const interaction = this.GetInputValue("interaction", cache);
        const fieldname = this.GetOptionValue("customid", cache) ? this.GetOptionValue("customid", cache) : this.GetInputValue("customid", cache);

        this.StoreOutputValue(await interaction.fields.getTextInputValue(fieldname), "value", cache);
        this.RunNextBlock("action", cache);
    }
}