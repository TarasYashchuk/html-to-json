/**
 * Recursively converts an HTML DOM node to a JSON object.
 *
 * @author Taras Yashchuk
 * @param {Node} node - The HTML DOM node to convert.
 * @returns {Object} - JSON representation of the node.
 *
 * @description
 * This function traverses an HTML DOM node and its children, recursively building
 * a JSON object that represents the structure of the node. Each node is represented
 * by its tag name, attributes, and children. Text nodes are stored separately with
 * their content.
 */
const htmlToJson = (node) => {
  if (!node) return {};

  const obj = {
    tagName: node.tagName ? node.tagName.toLowerCase() : null,
    attributes: {},
    children: [],
  };

  // Extract attributes and store them in the 'attributes' object
  if (node.attributes) {
    Array.from(node.attributes).forEach((attr) => {
      obj.attributes[attr.name] = attr.value;
    });
  }

  // Recursively process child nodes
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      obj.children.push(htmlToJson(child));
    } else if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()) {
      obj.children.push({
        type: "text",
        content: child.nodeValue,
      });
    }
  });

  return obj;
};

/**
 * Checks an HTML document for parsing errors.
 *
 * @param {Document} doc - The parsed HTML document.
 * @returns {boolean} - Returns true if parsing errors were detected, otherwise false.
 *
 * @description
 * This function checks for any parsing errors in an HTML document, such as those caused
 * by malformed HTML. If an error is detected, it alerts the user and returns true.
 */
const checkHtmlForErrors = (doc) => {
  if (doc.querySelector("parsererror")) {
    alert(
      "An error was detected in the HTML code. Please check the code and try again."
    );
    return true;
  }
  return false;
};

/**
 * Validates HTML string for unclosed tags.
 *
 * @param {string} html - The HTML string to validate.
 * @returns {boolean} - Returns true if unclosed tags are found, otherwise false.
 *
 * @description
 * This function uses regular expressions to identify all tags in the provided HTML string.
 * It then checks if the number of opening and closing tags matches, indicating the presence
 * of unclosed tags.
 */
const checkForUnclosedTags = (html) => {
  const tagRegex = /<\/?\w+[^>]*>/g;
  let match;
  const tags = [];
  const closingTags = [];

  // Extract all tags from the HTML string
  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[0];
    if (tag.startsWith("</")) {
      closingTags.push(tag);
    } else {
      tags.push(tag);
    }
  }

  return tags.length !== closingTags.length;
};

/**
 * Converts HTML input to a JSON representation.
 *
 * @description
 * This function is triggered when the user clicks the convert button. It retrieves the HTML
 * input from the textarea, checks for unclosed tags and parsing errors, and if valid,
 * converts the HTML to a JSON object. The resulting JSON is displayed in the specified output area.
 */
const convertToJSON = () => {
  const htmlString = document.getElementById("html").value.trim();
  if (!htmlString) {
    alert("Enter the HTML code.");
    return;
  }

  // Check for unclosed tags in the HTML input
  if (checkForUnclosedTags(htmlString)) {
    alert("The HTML contains unclosed tags. Check the code and try again.");
    return;
  }

  // Parse the HTML string to a Document object
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Check for parsing errors in the document
  if (checkHtmlForErrors(doc)) {
    return;
  }

  // Convert the HTML document to JSON and display the result
  const json = htmlToJson(doc.body);
  console.log("Generated JSON:", json);
  document.getElementById("json").textContent = JSON.stringify(json, null, 2);
};
