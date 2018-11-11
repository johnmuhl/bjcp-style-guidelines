import Ajv from "ajv";
import guidelines from "./index.js";
import { readFileSync } from "fs";
import t from "tap";

const ajv = new Ajv();
const categorySchema = loadJSON("schema/category.json");
const styleSchema = loadJSON("schema/style.json");
const categoryValidator = ajv.compile(categorySchema);
const styleValidator = ajv.compile(styleSchema);

t.assert(Array.isArray(guidelines));

guidelines.forEach(cat => {
	let valid = categoryValidator(cat);
	if (!valid) console.error(cat, categoryValidator.errors);
	t.assert(valid);

	if (cat.styles) {
		cat.styles.forEach(style => {
			valid = styleValidator(style);
			if (!valid) console.error(style, styleValidator.errors);
			t.assert(valid);
		});
	}

	if (cat.subcategories) {
		cat.subcategories.forEach(sub => {
			valid = styleValidator(sub);
			if (!valid) console.error(sub, styleValidator.errors);
			t.assert(valid);

			if (sub.styles) {
				sub.styles.forEach(style => {
					valid = styleValidator(style);
					if (!valid) console.error(style, styleValidator.errors);
					t.assert(valid);
				});
			}
		});
	}
});

function loadJSON(path) {
	return JSON.parse(readFileSync(path, "utf-8"));
}
