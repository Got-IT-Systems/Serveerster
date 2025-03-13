module.exports = {
    name: "Merge Texts (Advanced)",

    description: "Merges multiple texts into a single text.",

    category: "Extras",

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
            "description": "Acceptable Types: Text, Undefined, Null, Object, Boolean, Date, Number, List, Unspecified\n\nDescription: The text to merge with the source text. Supports everything (converts to text automatically). (OPTIONAL)",
            "types": ["text", "undefined", "null", "object", "boolean", "date", "number", "list", "unspecified"],
            "multiInput": true
        }
    ],

    options: [
        {
            "id": "text",
            "name": "Source Text",
            "description": "Description: The source text to add the Text. Use the folowing codes to implement the Text: \"${text1}\", \"${text2}\", \"${text3}\".",
            "type": "TEXT"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "text",
            "name": "Text",
            "description": "Type: Text\n\nDescription: The text merged.",
            "types": ["text", "unspecified"]
        }
    ],

    code(cache) {
        const original = this.GetOptionValue("text", cache);
        const variables = this.GetInputValue("text", cache);

        const newText =
            original.replace(/\${text(\d+)}/g, function(match, number) {
                return String(variables[number - 1]);
            }).replace(/\\n/g, '\n') 

        this.StoreOutputValue(newText, "text", cache);
        this.RunNextBlock("action", cache);
    }
}