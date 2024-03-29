const Color = require("./color");

class HighlightSyntax {
  constructor() {
    this.rules = [];
  }

  set(rule, color, options) {
    if (rule instanceof RegExp) this.rules.push({ rule, color, options });
  }

  light(code) {
    let highlighted = code;

    for (let i = 0, len = this.rules.length; i < len; i++) {
      const regex = this.rules[i].rule;
  
      highlighted = highlighted.replace(regex, (match) => {
        const color = this.rules[i]?.color;
        return `\x1b[m${this.rules[i]?.options?.start}${color}${match}\x1b[0m`;
      });
    }

    return highlighted;
  }


  /**
   * The "remove" function removes a rule from an array of rules if it matches a regular expression.
   * @param rule - The parameter "rule" is expected to be a regular expression object. If it is, then
   * the method removes that regular expression from the "rules" array property of the object. If
   * "rule" is not a regular expression, then nothing happens.
   */
  remove(rule) {
    if (rule instanceof RegExp) this.rules = this.rules.filter(item => item != rule);
  }
}

const highlightCLI = new HighlightSyntax();
let commonConfigurable = { start: Color.BRIGHT };

highlightCLI.set(/(@\w+)/, Color.FG_MAGENTA, commonConfigurable); // highlight instructions
highlightCLI.set(/(\$\w+)/g, Color.FG_RED, commonConfigurable); // highlight registers
highlightCLI.set(/([0-9a-fA-F]+x[0-9a-fA-F]+)/g, Color.FG_YELLOW, commonConfigurable); // highlight hex
highlightCLI.set(/[+-]?\d+(\.\d+)$/g, Color.FG_YELLOW, commonConfigurable); // highlight float
highlightCLI.set(/([+-]?\d+$)/g, Color.FG_YELLOW, commonConfigurable); // highlight int
highlightCLI.set(/(['"][^']*["'])/g, Color.FG_GREEN, commonConfigurable); // highlight string
highlightCLI.set(/(#[^]+)/g , Color.FG_GRAY, commonConfigurable); // highlight
highlightCLI.set(/(String|Bool|List|Int|Float)/g, Color.FG_BLUE, commonConfigurable); // highlight types

module.exports = highlightCLI;