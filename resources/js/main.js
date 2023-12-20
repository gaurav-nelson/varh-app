function setTray() {
  if (NL_MODE != "window") {
    console.log("INFO: Tray menu is only available in the window mode.");
    return;
  }
  let tray = {
    icon: "/resources/icons/trayIcon.png",
    menuItems: [
      { id: "SYNC", text: "Sync Vale rules" },
      { id: "SEP", text: "-" },
      { id: "QUIT", text: "Quit" },
    ],
  };
  Neutralino.os.setTray(tray);
}

async function onTrayMenuItemClicked(event) {
  switch (event.detail.id) {
    case "VERSION":
      Neutralino.os.showMessageBox(
        "Version information",
        `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`
      );
      break;
    case "QUIT":
      Neutralino.app.exit();
      break;
    case "SYNC":
      try {
        const docsDir = await Neutralino.storage.getData("docsDir");
        if (docsDir) {
          document.getElementById("loadingScreen").classList.remove("invisible");
          try {
            await Neutralino.os.execCommand(`cd ${docsDir} && vale sync`);
            document.getElementById("loadingScreen").classList.add("invisible");
            Neutralino.os.showMessageBox(
              "Sync Vale rules",
              `Vale rules synced successfully!`
            );
          } catch (error) {
            Neutralino.os.showMessageBox(
              "Error",
              `Failed to sync Vale rules: ${error.message}`
            );
          }
        }
      } catch (error) {
        if (
          error.code !== "NE_ST_NOSTKEX" ||
          error.message !== "Unable to find storage key: docsDir"
        ) {
          console.error("Error reading stored directory:", error);
          Neutralino.os.showMessageBox(
            "Sync Vale rules",
            `Error syncing Vale rules: ${error}`
          );
        }
      }
      break;
  }
}

function onWindowClose() {
  Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

setTray();

async function getVersion() {
  let valeVersion = await Neutralino.os.execCommand("vale --version");
  return valeVersion.stdOut;
}

async function getAsciiDoctorVersion() {
  let asciidoctorVersion = await Neutralino.os.execCommand("asciidoctor --version");
  return asciidoctorVersion.stdOut;
}

Neutralino.events.on("ready", async () => {
  try {
    let version = await getVersion();
    console.log(version);
    if (!version.includes("vale version")) {
      sendAlertMsg(
        "Cannot find Vale! You must install Vale and add it to your path.",
        "X",
        "error"
      );
    }
    let asciidoctorVersion = await getAsciiDoctorVersion();
    console.log(asciidoctorVersion);
    if (!asciidoctorVersion.includes("[https://asciidoctor.org]")) {
      sendAlertMsg(
        "Cannot find Asciidoctor! You must install Asciidoctor and add it to your path.",
        "X",
        "error"
      );
    }
  } catch (error) {
    console.log("An error occurred: " + error);
  }
});

function sendAlertMsg(alertMsg, btnText, alertType) {
  // Get elements
  let alertContainer = document.getElementById('alert-container');
  let alertElement = document.getElementById('alert');
  let alertBtn = document.getElementById('alert-btn');
  let alertMsgElement = document.getElementById('alert-msg');
  let alertSvg = document.getElementById('alert-svg');

  // Update text
  alertMsgElement.textContent = alertMsg;
  alertBtn.textContent = btnText;

  // Update classes
  ['border-success', 'border-warning', 'border-info', 'border-error'].forEach(cls => {
      alertElement.classList.remove(cls);
      alertBtn.classList.remove(cls.replace('border', 'btn'));
      alertSvg.classList.remove(cls.replace('border', 'stroke'));
  });

  alertElement.classList.add(`border-${alertType}`);
  alertBtn.classList.add(`btn-${alertType}`);
  alertSvg.classList.add(`stroke-${alertType}`);

  // Toggle visibility
  alertContainer.classList.toggle("invisible");
}

function hideAlertMsg() {
  const alertContainer = document.getElementById("alert-container");
  alertContainer.classList.toggle("invisible");
}

document.getElementById("alert-btn").addEventListener("click", function () {
  const btnText = this.textContent;
  hideAlertMsg();
  switch (btnText) {
    case "X":
      window.open("https://vale.sh/docs/vale-cli/installation/");
      break;
    default:
      console.log("Not implemented: ", btnText);
      break;
  }
});

//Codemirror editor
var editor = CodeMirror(document.querySelector("#editor"), {
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 2,
  placeholder: "Paste or drop your Asciidoc content here ...",
  mode: "asciidoc",
  autofocus: true,
});

document.getElementById("clear-btn").addEventListener("click", async () => {
  editor.setValue("");
  if (
    !document.getElementById("alert-container").classList.contains("invisible")
  ) {
    hideAlertMsg();
  }
  clearCountsMarksWidgets();
});

document
  .getElementById("theme-change-btn")
  .addEventListener("change", async () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    var newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  });

async function setTheme(themeValue) {
  editor.setOption("theme", themeValue === "light" ? "default" : "material");
  await Neutralino.storage.setData("theme", themeValue);
  if (themeValue === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

async function applyStoredThemeandConfig() {
  try {
    const storedThemeData = await Neutralino.storage.getData("theme");
    if (storedThemeData) {
      console.log("storedThemeData: ", storedThemeData);
      if (storedThemeData === "dark") {
        setTheme(storedThemeData);
      }
    }
  } catch (error) {
    if (
      error.code !== "NE_ST_NOSTKEX" ||
      error.message !== "Unable to find storage key: theme"
    ) {
      console.error("Error reading stored theme:", error);
    }
  }
  try {
    const docsDir = await Neutralino.storage.getData("docsDir");
    if (docsDir) {
      setConfigPath(docsDir);
    }
  } catch (error) {
    if (
      error.code !== "NE_ST_NOSTKEX" ||
      error.message !== "Unable to find storage key: docsDir"
    ) {
      console.error("Error reading stored directory:", error);
    }
  }
}

// Call the function when your app initializes
applyStoredThemeandConfig();

document.addEventListener("keydown", function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "c") {
    copyText();
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "v") {
    pasteText();
  }
});

async function pasteText() {
  let clipboardText = await Neutralino.clipboard.readText();
  editor.replaceSelection(clipboardText);
}

async function copyText() {
  var selectedText = editor.getSelection();
  await Neutralino.clipboard.writeText(selectedText);
}

function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  ev.target.classList.remove("dragging");

  for (const file of ev.dataTransfer.files) {
    var reader = new FileReader();
    reader.onload = function (event) {
      editor.setValue(event.target.result);
      editor.focus();
    };
    reader.readAsText(file);
  }
}

function dragOverHandler(ev) {
  //console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

const dropElement = document.getElementById("editor");

dropElement.addEventListener("dragenter", function (e) {
  e.preventDefault();
  e.target.classList.add("dragging");
});

dropElement.addEventListener("dragleave", function (e) {
  e.preventDefault();
  e.target.classList.remove("dragging");
});

async function uploadValeIni() {
  console.log("Uploadini");
}

async function openFolderDialog() {
  let entry = await Neutralino.os.showFolderDialog(
    "Select your openshift-docs directory"
  );
  setConfigPath(entry);
}

document
  .getElementById("configFileBtn")
  .addEventListener("click", openFolderDialog);
document
  .getElementById("configFileTextBox")
  .addEventListener("click", openFolderDialog);

async function setConfigPath(selectedPath) {
  console.log("Using: ", `${selectedPath}/.vale.ini`);
  await Neutralino.storage.setData("docsDir", selectedPath);
  if (await valeIniExists(`${selectedPath}/.vale.ini`)) {
    document.getElementById(
      "configFileTextBox"
    ).value = `Using ${selectedPath.slice(-15)}/.vale.ini`;
    document
      .getElementById("configFileTooltip")
      .setAttribute("data-tip", `Using ${selectedPath}.vale.ini`);
    editor.focus();
    document.getElementById("configFileBtn").innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="fill-current w-6 h-6"
        viewBox="0 0 24 24"
        class="w-4 h-4 stroke-current"
      >
        <path
          d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
        />
      </svg>
      `;
    document.getElementById("configFileBtn").classList.remove("btn-error");
    document
      .getElementById("configFileTextBox")
      .classList.remove("input-bordered", "input-error", "text-error");
    document.getElementById("configFileTextBox").classList.add("borderdefault");
    document.getElementById("lint-btn").classList.remove("btn-disabled");
  } else {
    document.getElementById(
      "configFileTextBox"
    ).value = `Cannot find .vale.ini at ${selectedPath}`;
    document
      .getElementById("configFileTooltip")
      .setAttribute(
        "data-tip",
        `Make sure that .vale.ini file exist in the selected dir`
      );
    document.getElementById("lint-btn").classList.add("btn-disabled");
    document.getElementById("configFileBtn").innerHTML = `
      <svg
                xmlns="http://www.w3.org/2000/svg"
                class="fill-current w-6 h-6"
                viewBox="0 0 24 24"
                class="w-4 h-4 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.094l-4.157-4.104 4.1-4.141-1.849-1.849-4.105 4.159-4.156-4.102-1.833 1.834 4.161 4.12-4.104 4.157 1.834 1.832 4.118-4.159 4.143 4.102 1.848-1.849z"
                />
              </svg>
      `;
    document.getElementById("configFileBtn").classList.add("btn-error");
    document
      .getElementById("configFileTextBox")
      .classList.add("input-bordered", "input-error", "text-error");
    document
      .getElementById("configFileTextBox")
      .classList.remove("borderdefault");
  }
}

async function valeIniExists(filePath) {
  //console.log(filePath);
  try {
    let stats = await Neutralino.filesystem.getStats(filePath);
    return true;
  } catch (error) {
    console.error("Cannot find .vale.ini", error);
    return false;
  }
}

var markers = [];
var widgetsError = [];
var widgetsWarning = [];
var widgetsSuggestion = [];

async function lintAdoc(req,configPath) {
  if (req.textarea == "" || req.textarea == null) {
    console.log("Textarea is empty");
    sendAlertMsg(
      "Enter some text or drop a file to start linting.",
      "X",
      "info"
    );
  } else {
    var valeLint = "";
    try {
      //remove invisible class from the element loadingScreen
      document.getElementById("loadingScreen").classList.remove("invisible");
      // remove all ' from req.textarea
      req.textarea = req.textarea.replace(/'/g, "");
      valeLint = await Neutralino.os.execCommand(
        `vale --config=${configPath} --output=JSON --ext='.adoc' '${req.textarea}'`
      );
      //Neutralino.debug.log("Vale lint: ", JSON.parse(valeLint.stdOut));
      //Neutralino.debug.log("Vale lint: ", valeLint);
      if (valeLint.stdErr) {
        console.error("Vale lint error: ", valeLint.stdErr);
        //showDialog("Error:", valeLint.stdErr);
      }
      //add invisible class from the element loadingScreen
      document.getElementById("loadingScreen").classList.add("invisible");
      return JSON.parse(valeLint.stdOut);
    } catch (error) {
      console.error(error);
      //showDialog("Error:", error);
      return "ERROR: " + error;
    }
  }
}

document.getElementById("lint-btn").addEventListener("click", async () => {
  clearWidgetsMarkers(clearCountsMarksWidgets);
  const docsDir = await Neutralino.storage.getData("docsDir");
  const valeLint = await lintAdoc(
    { textarea: editor.getValue() },
    `${docsDir}/.vale.ini`
  );
  //console.log("Vale lint: ", JSON.stringify(valeLint));
  if (valeLint){
    if (!Object.keys(valeLint).length) {
      //console.log("Response data: ", data);
      console.log("Hooray, no errors!");
      sendAlertMsg(
        "Hooray, no errors!",
        "X",
        "success"
      );
    } else {
      highlightResults(valeLint["stdin.adoc"]);
      updateCounts();
    }
  }
});

function highlightResults(data) {
  for (i = 0; i < data.length; i++) {
    if (data[i].Severity === "error") {
      var lineNumber = data[i].Line - 1;
      var startChar = data[i].Span[0] - 1;
      var endChar = data[i].Span[1];
      markers.push(
        editor.getDoc().markText(
          {
            line: lineNumber,
            ch: startChar,
          },
          {
            line: lineNumber,
            ch: endChar,
          },
          {
            className: "valeError",
          }
        )
      );
      var msg = document.createElement("div");
      var msgText =
        "❌ " +
        data[i].Check +
        " " +
        data[i].Line +
        "(" +
        startChar +
        "-" +
        endChar +
        ") " +
        data[i].Message;
      msg.appendChild(document.createTextNode(msgText));
      msg.className = "valeErrorMessage";
      widgetsError.push(editor.getDoc().addLineWidget(lineNumber, msg));
    }
    if (data[i].Severity === "warning") {
      var lineNumber = data[i].Line - 1;
      var startChar = data[i].Span[0] - 1;
      var endChar = data[i].Span[1];
      markers.push(
        editor.getDoc().markText(
          {
            line: lineNumber,
            ch: startChar,
          },
          {
            line: lineNumber,
            ch: endChar,
          },
          {
            className: "valeWarning",
          },
          {
            clearOnEnter: true,
          }
        )
      );
      var msg = document.createElement("div");
      var msgText =
        "❗ " +
        data[i].Check +
        " " +
        data[i].Line +
        "(" +
        startChar +
        "-" +
        endChar +
        ") " +
        data[i].Message;
      msg.appendChild(document.createTextNode(msgText));
      msg.className = "valeWarningMessage";
      widgetsWarning.push(editor.getDoc().addLineWidget(lineNumber, msg));
    }
    if (data[i].Severity === "suggestion") {
      var lineNumber = data[i].Line - 1;
      var startChar = data[i].Span[0] - 1;
      var endChar = data[i].Span[1];
      markers.push(
        editor.getDoc().markText(
          {
            line: lineNumber,
            ch: startChar,
          },
          {
            line: lineNumber,
            ch: endChar,
          },
          {
            className: "valeSuggestion",
          }
        )
      );
      var msg = document.createElement("div");
      var msgText =
        "💡 " +
        data[i].Check +
        " " +
        data[i].Line +
        "(" +
        startChar +
        "-" +
        endChar +
        ") " +
        data[i].Message;
      msg.appendChild(document.createTextNode(msgText));
      msg.className = "valeSuggestionMessage";
      widgetsSuggestion.push(editor.getDoc().addLineWidget(lineNumber, msg));
    }
  }
}

function updateCounts() {
  const errorCount = widgetsError.length;
  const errorText = errorCount === 1 ? "Error" : "Errors";

  const warningCount = widgetsWarning.length;
  const warningText = warningCount === 1 ? "Warning" : "Warnings";

  const suggestionCount = widgetsSuggestion.length;
  const suggestionText = suggestionCount === 1 ? "Suggestion" : "Suggestions";

  document.getElementById("errorCount").textContent = `${errorCount} ${errorText}`;
  document.getElementById("warningCount").textContent = `${warningCount} ${warningText}`;
  document.getElementById("suggestionCount").textContent = `${suggestionCount} ${suggestionText}`;
  document.getElementById("output").classList.remove("invisible");
}


function clearCountsMarksWidgets() {
  markers = [];
  widgetsError = [];
  widgetsWarning = [];
  widgetsSuggestion = [];
  document.getElementById("errorCount").textContent = "0 Errors";
  document.getElementById("warningCount").textContent = "0 Warnings";
  document.getElementById("suggestionCount").textContent = "0 Suggestions";
  document.getElementById("output").classList.add("invisible");
}

function clearWidgetsMarkers(callback) {
  const clearWidgets = (widgetArray) => {
    widgetArray.forEach((widget) => {
      widget.clear();
      editor.getDoc().removeLineWidget(widget);
    });
  };

  const clearMarkers = (markerArray) => {
    markerArray.forEach((marker) => marker.clear());
  };

  const currentText = editor.getValue();

  if (widgetsError.length !== 0 || widgetsWarning.length !== 0 || widgetsSuggestion.length !== 0) {
    clearWidgets(widgetsError);
    clearWidgets(widgetsWarning);
    clearWidgets(widgetsSuggestion);
  }

  if (markers.length !== 0) {
    clearMarkers(markers);
  }

  editor.setValue(currentText);

  callback();
}
