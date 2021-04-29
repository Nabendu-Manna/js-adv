var cases = [
    {
        id: "-1",
        name: "SELECT",
        defaultEachLinePrefix: "",
        defaultEachLineSuffix: "",
        defaultWholeDocPrefix: "",
        defaultWholeDocSuffix: "",
        trimm: true,
        splitter: ","
    },
    {
        id: "ArrayToCsharpClassProperties",
        name: "Array To C# Class Properties",
        defaultEachLinePrefix: "\n\tpublic string ",
        defaultEachLineSuffix: " { get; set; } ",
        defaultWholeDocPrefix: "\npublic class ClassName\n{ ",
        defaultWholeDocSuffix: "\n} ",
        trimm: true,
        splitter: ","
    },
    {
        id: "ArrayToJSONProperties",
        name: "Array To JSON Properties",
        defaultEachLinePrefix: "obj.",
        defaultEachLineSuffix: ' = "Value";',
        defaultWholeDocPrefix: "var obj={",
        defaultWholeDocSuffix: "}",
        trimm: true,
        splitter: ","
    },
    {
        id: "ArrayToSetJqueryValue",
        name: "Array To Get Jquery Values, Set To Object",
        defaultEachLinePrefix: "obj.",
        defaultEachLineSuffix: '=$("#\\this").val();',
        defaultWholeDocPrefix: "var obj={};",
        defaultWholeDocSuffix: "\\n",
        trimm: true,
        splitter: ","
    },
    {
        id: "ArrayToCsharpSQLParam",
        name: "Array To C# SQL Parameter",
        defaultEachLinePrefix:
            'cmd.Parameters.Add(new SqlParameter()\n\t{\n\t\tParameterName = "@',
        defaultEachLineSuffix: '",\n\t\tValue = \\this\n\t});',
        defaultWholeDocPrefix: "",
        defaultWholeDocSuffix: "",
        trimm: true,
        splitter: ","
    },
    {
        id: "ArrayToCsharpSQLParam2",
        name: "Array To C# SQL Parameter AddWithValue",
        defaultEachLinePrefix: '\ncmd.Parameters.AddWithValue("@',
        defaultEachLineSuffix: '",obj.\\this.CheckIfDBNull());',
        defaultWholeDocPrefix: "",
        defaultWholeDocSuffix: "",
        trimm: true,
        splitter: ","
    },
    {
        id: "ArrayToCsharpReaderTObject",
        name: "Array To  Set C# Object From SQL Reader",
        defaultEachLinePrefix: "obj.",
        defaultEachLineSuffix: '=rdr["\\this"].ToString();',
        defaultWholeDocPrefix: "",
        defaultWholeDocSuffix: "",
        trimm: true,
        splitter: ","
    },
    {
        id: "ArrayToMSSQLSingleFieldInsertSQL",
        name: "Array To  sqlServer Single Column Insert SQL",
        defaultEachLinePrefix: 'INSERT INTO [Table]([ColumnName]) Values("',
        defaultEachLineSuffix: '");',
        defaultWholeDocPrefix: "",
        defaultWholeDocSuffix: "",
        trimm: true,
        splitter: ","
    }
];

const escapes = [
    {
        patterrn: "\\this",
        value: "\\this",
        description: "Each array value"
    },
    {
        patterrn: "\\nbsp",
        value: " ",
        description: "Non-breakable Space"
    },
    {
        patterrn: "\\n",
        value: "\n",
        description: "New Line[LF]"
    },
    {
        patterrn: "\\r",
        value: "\r",
        description: "New Line[CR]"
    },
    {
        patterrn: "\\r\\n",
        value: "\r\n",
        description: "New Line[CR LF]"
    },
    {
        patterrn: "\\t",
        value: "\t",
        description: "a Tab"
    },
    {
        patterrn: "\\b",
        value: "\b",
        description: "backspace"
    },
    {
        patterrn: "\\\\",
        value: "\\",
        description: "backslah"
    },
    {
        patterrn: "\\'",
        value: "'",
        description: "apostrophy"
    },
    {
        patterrn: '\\"',
        value: '"',
        description: "Double Quote"
    }
];

function escapeThis(str, esc, data) {
    esc.forEach(function (d) {
        if (d.patterrn === "\\this") {
            d.value = data;
        }
        var arr = [];
        arr = str.split(d.patterrn);
        str = arr.join(d.value);
    });
    return str;
}

function escapeAndRemoveThis(str, esc, data) {
    esc.forEach(function (d) {
        if (d.patterrn === "\\this") {
            d.value = data;
        }
        var arr = [];

        arr = str.split(d.patterrn);
        str = arr.join(data);
    });

    return str;
}

var app = Vue.createApp({
    data() {
        return {
            cases: cases,
            caseValue: '',
            currentCase: cases[0],
            outputString: '',
            inputString: '',
            calObj: null,
            remThese: '',
            ifRem: false,
        };
    },
    methods: {
        changeCase(event) {
            let v = this.currentCase;
            this.calObj = v;
        },

        generateString(event) {
            let value = this.calObj;

            var FromWhat = this.inputString;
            var ToThis = "";
            var remThese = this.remThese;


            if (value.trimm == true) {
                FromWhat = FromWhat.trim();
            }

            if (value.ifRem == true) {
                var FromWhat2 = "";
                var remArr = remThese.split(" ");

                FromWhat2 = escapeAndRemoveThis(FromWhat, escapes, "");
                remArr.forEach(function (d) {
                    var narr2 = FromWhat2.split(d);
                    FromWhat2 = narr2.join("");
                });
                FromWhat = FromWhat2.trim();
            }

            var TheArray = FromWhat.split(value.splitter);

            TheArray.forEach(function (d) {
                ToThis +=
                    "" +
                    escapeThis(value.defaultEachLinePrefix, escapes, d) +
                    d +
                    escapeThis(value.defaultEachLineSuffix, escapes, d) +
                    "";
            });
            ToThis =
                escapeThis(value.defaultWholeDocPrefix, escapes, "") +
                ToThis +
                escapeThis(value.defaultWholeDocSuffix, escapes, "");

            this.outputString = ToThis;
        },
    }
})