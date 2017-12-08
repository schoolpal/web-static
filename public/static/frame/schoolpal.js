var componentHandler = {
  /**
   * Searches existing DOM for elements of our component type and upgrades them
   * if they have not already been upgraded.
   *
   * @param {string=} optJsClass the programatic name of the element class we
   * need to create a new instance of.
   * @param {string=} optCssClass the name of the CSS class elements of this
   * type will have.
   */
  upgradeDom: function(optJsClass, optCssClass) {},
  /**
   * Upgrades a specific element rather than all in the DOM.
   *
   * @param {!Element} element The element we wish to upgrade.
   * @param {string=} optJsClass Optional name of the class we want to upgrade
   * the element to.
   */
  upgradeElement: function(element, optJsClass) {},
  /**
   * Upgrades a specific list of elements rather than all in the DOM.
   *
   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
   * The elements we wish to upgrade.
   */
  upgradeElements: function(elements) {},
  /**
   * Upgrades all registered components found in the current DOM. This is
   * automatically called on window load.
   */
  upgradeAllRegistered: function() {},
  /**
   * Allows user to be alerted to any upgrades that are performed for a given
   * component type
   *
   * @param {string} jsClass The class name of the MDL component we wish
   * to hook into for any upgrades performed.
   * @param {function(!HTMLElement)} callback The function to call upon an
   * upgrade. This function should expect 1 parameter - the HTMLElement which
   * got upgraded.
   */
  registerUpgradedCallback: function(jsClass, callback) {},
  /**
   * Registers a class for future use and attempts to upgrade existing DOM.
   *
   * @param {componentHandler.ComponentConfigPublic} config the registration configuration
   */
  register: function(config) {},
  /**
   * Downgrade either a given node, an array of nodes, or a NodeList.
   *
   * @param {!Node|!Array<!Node>|!NodeList} nodes
   */
  downgradeElements: function(nodes) {}
};

componentHandler = (function() {
  "use strict";

  /** @type {!Array<componentHandler.ComponentConfig>} */
  var registeredComponents_ = [];

  /** @type {!Array<componentHandler.Component>} */
  var createdComponents_ = [];

  var componentConfigProperty_ = "mdlComponentConfigInternal_";

  /**
   * Searches registered components for a class we are interested in using.
   * Optionally replaces a match with passed object if specified.
   *
   * @param {string} name The name of a class we want to use.
   * @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
   * @return {!Object|boolean}
   * @private
   */
  function findRegisteredClass_(name, optReplace) {
    for (var i = 0; i < registeredComponents_.length; i++) {
      if (registeredComponents_[i].className === name) {
        if (typeof optReplace !== "undefined") {
          registeredComponents_[i] = optReplace;
        }
        return registeredComponents_[i];
      }
    }
    return false;
  }

  /**
   * Returns an array of the classNames of the upgraded classes on the element.
   *
   * @param {!Element} element The element to fetch data from.
   * @return {!Array<string>}
   * @private
   */
  function getUpgradedListOfElement_(element) {
    var dataUpgraded = element.getAttribute("data-upgraded");
    // Use `['']` as default value to conform the `,name,name...` style.
    return dataUpgraded === null ? [""] : dataUpgraded.split(",");
  }

  /**
   * Returns true if the given element has already been upgraded for the given
   * class.
   *
   * @param {!Element} element The element we want to check.
   * @param {string} jsClass The class to check for.
   * @returns {boolean}
   * @private
   */
  function isElementUpgraded_(element, jsClass) {
    var upgradedList = getUpgradedListOfElement_(element);
    return upgradedList.indexOf(jsClass) !== -1;
  }

  /**
   * Create an event object.
   *
   * @param {string} eventType The type name of the event.
   * @param {boolean} bubbles Whether the event should bubble up the DOM.
   * @param {boolean} cancelable Whether the event can be canceled.
   * @returns {!Event}
   */
  function createEvent_(eventType, bubbles, cancelable) {
    if ("CustomEvent" in window && typeof window.CustomEvent === "function") {
      return new CustomEvent(eventType, {
        bubbles: bubbles,
        cancelable: cancelable
      });
    } else {
      var ev = document.createEvent("Events");
      ev.initEvent(eventType, bubbles, cancelable);
      return ev;
    }
  }

  /**
   * Searches existing DOM for elements of our component type and upgrades them
   * if they have not already been upgraded.
   *
   * @param {string=} optJsClass the programatic name of the element class we
   * need to create a new instance of.
   * @param {string=} optCssClass the name of the CSS class elements of this
   * type will have.
   */
  function upgradeDomInternal(optJsClass, optCssClass) {
    if (
      typeof optJsClass === "undefined" &&
      typeof optCssClass === "undefined"
    ) {
      for (var i = 0; i < registeredComponents_.length; i++) {
        upgradeDomInternal(
          registeredComponents_[i].className,
          registeredComponents_[i].cssClass
        );
      }
    } else {
      var jsClass = /** @type {string} */ (optJsClass);
      if (typeof optCssClass === "undefined") {
        var registeredClass = findRegisteredClass_(jsClass);
        if (registeredClass) {
          optCssClass = registeredClass.cssClass;
        }
      }

      var elements = document.querySelectorAll("." + optCssClass);
      for (var n = 0; n < elements.length; n++) {
        upgradeElementInternal(elements[n], jsClass);
      }
    }
  }

  /**
   * Upgrades a specific element rather than all in the DOM.
   *
   * @param {!Element} element The element we wish to upgrade.
   * @param {string=} optJsClass Optional name of the class we want to upgrade
   * the element to.
   */
  function upgradeElementInternal(element, optJsClass) {
    // Verify argument type.
    if (!(typeof element === "object" && element instanceof Element)) {
      throw new Error("Invalid argument provided to upgrade MDL element.");
    }
    // Allow upgrade to be canceled by canceling emitted event.
    var upgradingEv = createEvent_("mdl-componentupgrading", true, true);
    element.dispatchEvent(upgradingEv);
    if (upgradingEv.defaultPrevented) {
      return;
    }

    var upgradedList = getUpgradedListOfElement_(element);
    var classesToUpgrade = [];
    // If jsClass is not provided scan the registered components to find the
    // ones matching the element's CSS classList.
    if (!optJsClass) {
      var classList = element.classList;
      registeredComponents_.forEach(function(component) {
        // Match CSS & Not to be upgraded & Not upgraded.
        if (
          classList.contains(component.cssClass) &&
          classesToUpgrade.indexOf(component) === -1 &&
          !isElementUpgraded_(element, component.className)
        ) {
          classesToUpgrade.push(component);
        }
      });
    } else if (!isElementUpgraded_(element, optJsClass)) {
      classesToUpgrade.push(findRegisteredClass_(optJsClass));
    }

    // Upgrade the element for each classes.
    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
      registeredClass = classesToUpgrade[i];
      if (registeredClass) {
        // Mark element as upgraded.
        upgradedList.push(registeredClass.className);
        element.setAttribute("data-upgraded", upgradedList.join(","));
        var instance = new registeredClass.classConstructor(element);
        instance[componentConfigProperty_] = registeredClass;
        createdComponents_.push(instance);
        // Call any callbacks the user has registered with this component type.
        for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
          registeredClass.callbacks[j](element);
        }

        if (registeredClass.widget) {
          // Assign per element instance for control over API
          element[registeredClass.className] = instance;
        }
      } else {
        throw new Error(
          "Unable to find a registered component for the given class."
        );
      }

      var upgradedEv = createEvent_("mdl-componentupgraded", true, false);
      element.dispatchEvent(upgradedEv);
    }
  }

  /**
   * Upgrades a specific list of elements rather than all in the DOM.
   *
   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
   * The elements we wish to upgrade.
   */
  function upgradeElementsInternal(elements) {
    if (!Array.isArray(elements)) {
      if (elements instanceof Element) {
        elements = [elements];
      } else {
        elements = Array.prototype.slice.call(elements);
      }
    }
    for (var i = 0, n = elements.length, element; i < n; i++) {
      element = elements[i];
      if (element instanceof HTMLElement) {
        upgradeElementInternal(element);
        if (element.children.length > 0) {
          upgradeElementsInternal(element.children);
        }
      }
    }
  }

  /**
   * Registers a class for future use and attempts to upgrade existing DOM.
   *
   * @param {componentHandler.ComponentConfigPublic} config
   */
  function registerInternal(config) {
    // In order to support both Closure-compiled and uncompiled code accessing
    // this method, we need to allow for both the dot and array syntax for
    // property access. You'll therefore see the `foo.bar || foo['bar']`
    // pattern repeated across this method.
    var widgetMissing =
      typeof config.widget === "undefined" &&
      typeof config["widget"] === "undefined";
    var widget = true;

    if (!widgetMissing) {
      widget = config.widget || config["widget"];
    }

    var newConfig = /** @type {componentHandler.ComponentConfig} */ ({
      classConstructor: config.constructor || config["constructor"],
      className: config.classAsString || config["classAsString"],
      cssClass: config.cssClass || config["cssClass"],
      widget: widget,
      callbacks: []
    });

    registeredComponents_.forEach(function(item) {
      if (item.cssClass === newConfig.cssClass) {
        throw new Error(
          "The provided cssClass has already been registered: " + item.cssClass
        );
      }
      if (item.className === newConfig.className) {
        throw new Error("The provided className has already been registered");
      }
    });

    if (config.constructor.prototype.hasOwnProperty(componentConfigProperty_)) {
      throw new Error(
        "MDL component classes must not have " +
          componentConfigProperty_ +
          " defined as a property."
      );
    }

    var found = findRegisteredClass_(config.classAsString, newConfig);

    if (!found) {
      registeredComponents_.push(newConfig);
    }
  }

  /**
   * Allows user to be alerted to any upgrades that are performed for a given
   * component type
   *
   * @param {string} jsClass The class name of the MDL component we wish
   * to hook into for any upgrades performed.
   * @param {function(!HTMLElement)} callback The function to call upon an
   * upgrade. This function should expect 1 parameter - the HTMLElement which
   * got upgraded.
   */
  function registerUpgradedCallbackInternal(jsClass, callback) {
    var regClass = findRegisteredClass_(jsClass);
    if (regClass) {
      regClass.callbacks.push(callback);
    }
  }

  /**
   * Upgrades all registered components found in the current DOM. This is
   * automatically called on window load.
   */
  function upgradeAllRegisteredInternal() {
    for (var n = 0; n < registeredComponents_.length; n++) {
      upgradeDomInternal(registeredComponents_[n].className);
    }
  }

  /**
   * Check the component for the downgrade method.
   * Execute if found.
   * Remove component from createdComponents list.
   *
   * @param {?componentHandler.Component} component
   */
  function deconstructComponentInternal(component) {
    if (component) {
      var componentIndex = createdComponents_.indexOf(component);
      createdComponents_.splice(componentIndex, 1);

      var upgrades = component.element_
        .getAttribute("data-upgraded")
        .split(",");
      var componentPlace = upgrades.indexOf(
        component[componentConfigProperty_].classAsString
      );
      upgrades.splice(componentPlace, 1);
      component.element_.setAttribute("data-upgraded", upgrades.join(","));

      var ev = createEvent_("mdl-componentdowngraded", true, false);
      component.element_.dispatchEvent(ev);
    }
  }

  /**
   * Downgrade either a given node, an array of nodes, or a NodeList.
   *
   * @param {!Node|!Array<!Node>|!NodeList} nodes
   */
  function downgradeNodesInternal(nodes) {
    /**
     * Auxiliary function to downgrade a single node.
     * @param  {!Node} node the node to be downgraded
     */
    var downgradeNode = function(node) {
      createdComponents_
        .filter(function(item) {
          return item.element_ === node;
        })
        .forEach(deconstructComponentInternal);
    };
    if (nodes instanceof Array || nodes instanceof NodeList) {
      for (var n = 0; n < nodes.length; n++) {
        downgradeNode(nodes[n]);
      }
    } else if (nodes instanceof Node) {
      downgradeNode(nodes);
    } else {
      throw new Error("Invalid argument provided to downgrade MDL nodes.");
    }
  }

  // Now return the functions that should be made public with their publicly
  // facing names...
  return {
    upgradeDom: upgradeDomInternal,
    upgradeElement: upgradeElementInternal,
    upgradeElements: upgradeElementsInternal,
    upgradeAllRegistered: upgradeAllRegisteredInternal,
    registerUpgradedCallback: registerUpgradedCallbackInternal,
    register: registerInternal,
    downgradeElements: downgradeNodesInternal
  };
})();

/**
 * Describes the type of a registered component type managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   constructor: Function,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: (string|boolean|undefined)
 * }}
 */
componentHandler.ComponentConfigPublic; // jshint ignore:line

/**
 * Describes the type of a registered component type managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   constructor: !Function,
 *   className: string,
 *   cssClass: string,
 *   widget: (string|boolean),
 *   callbacks: !Array<function(!HTMLElement)>
 * }}
 */
componentHandler.ComponentConfig; // jshint ignore:line

/**
 * Created component (i.e., upgraded element) type as managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   element_: !HTMLElement,
 *   className: string,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: string
 * }}
 */
componentHandler.Component; // jshint ignore:line

// Export all symbols, for the benefit of Closure compiler.
// No effect on uncompiled code.
componentHandler["upgradeDom"] = componentHandler.upgradeDom;
componentHandler["upgradeElement"] = componentHandler.upgradeElement;
componentHandler["upgradeElements"] = componentHandler.upgradeElements;
componentHandler["upgradeAllRegistered"] =
  componentHandler.upgradeAllRegistered;
componentHandler["registerUpgradedCallback"] =
  componentHandler.registerUpgradedCallback;
componentHandler["register"] = componentHandler.register;
componentHandler["downgradeElements"] = componentHandler.downgradeElements;
window.componentHandler = componentHandler;
window["componentHandler"] = componentHandler;

window.addEventListener("load", function() {
  "use strict";

  /**
   * Performs a "Cutting the mustard" test. If the browser supports the features
   * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
   * components requiring JavaScript.
   */
  if (
    "classList" in document.createElement("div") &&
    "querySelector" in document &&
    "addEventListener" in window &&
    Array.prototype.forEach
  ) {
    document.documentElement.classList.add("mdl-js");
    componentHandler.upgradeAllRegistered();
  } else {
    /**
     * Dummy function to avoid JS errors.
     */
    componentHandler.upgradeElement = function() {};
    /**
     * Dummy function to avoid JS errors.
     */
    componentHandler.register = function() {};
  }
});

(function() {
  "use strict";

  if (!Date.now) {
    /**
     * Date.now polyfill.
     * @return {number} the current Date
     */
    Date.now = function() {
      return new Date().getTime();
    };
    Date["now"] = Date.now;
  }

  var vendors = ["webkit", "moz"];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vp + "CancelAnimationFrame"] ||
      window[vp + "CancelRequestAnimationFrame"];
    window["requestAnimationFrame"] = window.requestAnimationFrame;
    window["cancelAnimationFrame"] = window.cancelAnimationFrame;
  }

  if (
    /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) ||
    !window.requestAnimationFrame ||
    !window.cancelAnimationFrame
  ) {
    var lastTime = 0;
    /**
     * requestAnimationFrame polyfill.
     * @param  {!Function} callback the callback function.
     */
    window.requestAnimationFrame = function(callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function() {
        callback((lastTime = nextTime));
      }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
    window["requestAnimationFrame"] = window.requestAnimationFrame;
    window["cancelAnimationFrame"] = window.cancelAnimationFrame;
  }
})();

(function() {
  "use strict";

  var Button = function Button(element) {
    this.element_ = element;
    this.init();
  };

  window["Button"] = Button;

  Button.prototype.CssClasses_ = {
    RIPPLE_EFFECT: "js-ripple-effect",
    RIPPLE_CONTAINER: "button__ripple-container",
    RIPPLE: "ripple"
  };

  Button.prototype.blurHandler_ = function(event) {
    if (event) {
      this.element_.blur();
    }
  };

  Button.prototype.disable = function() {
    this.element_.disabled = true;
  };

  Button.prototype["disable"] = Button.prototype.disable;

  Button.prototype.enable = function() {
    this.element_.disabled = false;
  };
  Button.prototype["enable"] = Button.prototype.enable;

  Button.prototype.init = function() {
    if (this.element_) {
      this.boundButtonBlurHandler = this.blurHandler_.bind(this);
      this.element_.addEventListener("mouseup", this.boundButtonBlurHandler);
      this.element_.addEventListener("mouseleave", this.boundButtonBlurHandler);
    }
  };

  componentHandler.register({
    constructor: Button,
    classAsString: "Button",
    cssClass: "js-button",
    widget: true
  });
})();

(function() {
  "use strict";

  var Checkbox = function Checkbox(element) {
    this.element_ = element;
    this.init();
  };
  window["Checkbox"] = Checkbox;

  Checkbox.prototype.Constant_ = {
    TINY_TIMEOUT: 0.001
  };

  Checkbox.prototype.CssClasses_ = {
    INPUT: "checkbox__input",
    BOX_OUTLINE: "checkbox__box-outline",
    TICK_OUTLINE: "checkbox__tick-outline",
    RIPPLE_EFFECT: "js-ripple-effect",
    RIPPLE_IGNORE_EVENTS: "js-ripple-effect--ignore-events",
    RIPPLE_CONTAINER: "checkbox__ripple-container",
    RIPPLE_CENTER: "ripple--center",
    RIPPLE: "ripple",
    IS_FOCUSED: "is-focused",
    IS_DISABLED: "is-disabled",
    IS_CHECKED: "is-checked",
    IS_UPGRADED: "is-upgraded"
  };

  Checkbox.prototype.onChange_ = function(event) {
    this.updateClasses_();
  };

  Checkbox.prototype.onFocus_ = function(event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  Checkbox.prototype.onBlur_ = function(event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  Checkbox.prototype.onMouseUp_ = function(event) {
    this.blur_();
  };

  Checkbox.prototype.updateClasses_ = function() {
    this.checkDisabled();
    this.checkToggleState();
  };

  Checkbox.prototype.blur_ = function() {
    window.setTimeout(
      function() {
        this.inputElement_.blur();
      }.bind(this),
      /** @type {number} */ (this.Constant_.TINY_TIMEOUT)
    );
  };

  Checkbox.prototype.checkToggleState = function() {
    if (this.inputElement_.checked) {
      this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
  };
  Checkbox.prototype["checkToggleState"] = Checkbox.prototype.checkToggleState;

  Checkbox.prototype.checkDisabled = function() {
    if (this.inputElement_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  Checkbox.prototype["checkDisabled"] = Checkbox.prototype.checkDisabled;

  Checkbox.prototype.disable = function() {
    this.inputElement_.disabled = true;
    this.updateClasses_();
  };
  Checkbox.prototype["disable"] = Checkbox.prototype.disable;

  Checkbox.prototype.enable = function() {
    this.inputElement_.disabled = false;
    this.updateClasses_();
  };
  Checkbox.prototype["enable"] = Checkbox.prototype.enable;

  Checkbox.prototype.check = function() {
    this.inputElement_.checked = true;
    this.updateClasses_();
  };
  Checkbox.prototype["check"] = Checkbox.prototype.check;

  Checkbox.prototype.uncheck = function() {
    this.inputElement_.checked = false;
    this.updateClasses_();
  };
  Checkbox.prototype["uncheck"] = Checkbox.prototype.uncheck;

  Checkbox.prototype.init = function() {
    if (this.element_) {
      this.inputElement_ = this.element_.querySelector(
        "." + this.CssClasses_.INPUT
      );

      var boxOutline = document.createElement("span");
      boxOutline.classList.add(this.CssClasses_.BOX_OUTLINE);

      var tickOutline = document.createElement("span");
      tickOutline.classList.add(this.CssClasses_.TICK_OUTLINE);

      boxOutline.appendChild(tickOutline);

      this.element_.appendChild(boxOutline);

      this.boundInputOnChange = this.onChange_.bind(this);
      this.boundInputOnFocus = this.onFocus_.bind(this);
      this.boundInputOnBlur = this.onBlur_.bind(this);
      this.boundElementMouseUp = this.onMouseUp_.bind(this);
      this.inputElement_.addEventListener("change", this.boundInputOnChange);
      this.inputElement_.addEventListener("focus", this.boundInputOnFocus);
      this.inputElement_.addEventListener("blur", this.boundInputOnBlur);
      //this.element_.addEventListener("mouseup", this.boundElementMouseUp);

      this.updateClasses_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  componentHandler.register({
    constructor: Checkbox,
    classAsString: "Checkbox",
    cssClass: "js-checkbox",
    widget: true
  });
})();

(function() {
  "use strict";

  var Collapse = function Collapse(element) {
    this.element_ = element;
    this.init();
  };

  window["Collapse"] = Collapse;

  Collapse.prototype.CssClasses_ = {
    JS_COLLAPSE: "js-collapse",
    ITEM: "list-item",
    IS_VISIBLE: "collapse--open"
  };

  Collapse.prototype.init = function() {
    if (this.element_) {
      this.outline_ = this.element_.parentNode;
      this.container_ = this.element_.nextElementSibling;
      this.element_.addEventListener("click", this.handleForClick_.bind(this));
    }
  };

  Collapse.prototype.handleForClick_ = function(evt) {
    this.toggle(evt);
  };

  Collapse.prototype.show = function(evt) {
    var collapses = document.getElementsByClassName(
      this.CssClasses_.JS_COLLAPSE
    );
    var items = this.container_.querySelectorAll("." + this.CssClasses_.ITEM);
    var count = items.length;
    var height = items[0].getBoundingClientRect().height * count;

    for (var i = 0; i < collapses.length; i++) {
      if (
        collapses[i]["Collapse"].element_ !== this.element_ &&
        collapses[i]["Collapse"].outline_.classList.contains(
          this.CssClasses_.IS_VISIBLE
        )
      ) {
        collapses[i]["Collapse"].hide();
      }
    }

    window.requestAnimationFrame(
      function() {
        this.container_.style.height = height + "px";
        this.outline_.classList.add(this.CssClasses_.IS_VISIBLE);
      }.bind(this)
    );
  };

  Collapse.prototype.hide = function(evt) {
    window.requestAnimationFrame(
      function() {
        this.container_.style.height = "0px";
        this.outline_.classList.remove(this.CssClasses_.IS_VISIBLE);
      }.bind(this)
    );
  };

  Collapse.prototype.toggle = function(evt) {
    if (this.outline_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
      this.hide();
    } else {
      this.show(evt);
    }
  };

  Collapse.prototype["toggle"] = Collapse.prototype.toggle;

  componentHandler.register({
    constructor: Collapse,
    classAsString: "Collapse",
    cssClass: "js-collapse",
    widget: true
  });
})();

(function() {
  "use strict";

  var DataTable = function DataTable(element) {
    this.element_ = element;
    this.init();
  };

  window["DataTable"] = DataTable;

  DataTable.prototype.CssClasses_ = {
    DATA_TABLE: "data-table",
    SELECTABLE: "data-table--selectable",
    SELECT_ELEMENT: "data-table__select",
    IS_SELECTED: "is-selected",
    IS_UPGRADED: "is-upgraded"
  };

  DataTable.prototype.selectRow_ = function(checkbox, row, opt_rows) {
    if (row) {
      return function() {
        if (checkbox.checked) {
          var otherRow = Array.prototype.filter.call(
            row.parentNode.children,
            child => {
              return (
                child !== row &&
                child.classList.contains(this.CssClasses_.IS_SELECTED)
              );
            }
          );

          if (otherRow.length) {
            var el = otherRow[0].querySelector("td").querySelector(".checkbox");

            el["Checkbox"].uncheck();
            otherRow[0].classList.remove(this.CssClasses_.IS_SELECTED);
          }

          row.classList.add(this.CssClasses_.IS_SELECTED);
        } else {
          row.classList.remove(this.CssClasses_.IS_SELECTED);
        }
      }.bind(this);
    }

    if (opt_rows) {
      return function() {
        var i;
        var el;
        if (checkbox.checked) {
          for (i = 0; i < opt_rows.length; i++) {
            el = opt_rows[i].querySelector("td").querySelector(".checkbox");
            el["Checkbox"].check();
            opt_rows[i].classList.add(this.CssClasses_.IS_SELECTED);
          }
        } else {
          for (i = 0; i < opt_rows.length; i++) {
            el = opt_rows[i].querySelector("td").querySelector(".checkbox");
            el["Checkbox"].uncheck();
            opt_rows[i].classList.remove(this.CssClasses_.IS_SELECTED);
          }
        }
      }.bind(this);
    }
  };

  DataTable.prototype.createCheckbox_ = function(row, opt_rows) {
    var label = document.createElement("label");
    var labelClasses = [
      "checkbox",
      "js-checkbox",
      this.CssClasses_.SELECT_ELEMENT
    ];
    label.className = labelClasses.join(" ");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox__input");

    if (row) {
      checkbox.checked = row.classList.contains(this.CssClasses_.IS_SELECTED);
      checkbox.addEventListener("change", this.selectRow_(checkbox, row));
    } else if (opt_rows) {
      checkbox.addEventListener(
        "change",
        this.selectRow_(checkbox, null, opt_rows)
      );
    }

    label.appendChild(checkbox);
    componentHandler.upgradeElement(label, "Checkbox");
    return label;
  };

  DataTable.prototype.init = function() {
    if (this.element_) {
      var firstHeader = this.element_.querySelector("th");
      var rows = Array.prototype.slice.call(
        this.element_.querySelectorAll("tbody tr")
      );

      if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
        var th = document.createElement("th");

        th.style.width = "66px";
        firstHeader.parentElement.insertBefore(th, firstHeader);

        for (var i = 0; i < rows.length; i++) {
          var firstCell = rows[i].querySelector("td");
          if (firstCell) {
            var td = document.createElement("td");
            if (rows[i].parentNode.nodeName.toUpperCase() === "TBODY") {
              var rowCheckbox = this.createCheckbox_(rows[i]);
              td.appendChild(rowCheckbox);
            }
            rows[i].insertBefore(td, firstCell);
          }
        }
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
      }
    }
  };

  componentHandler.register({
    constructor: DataTable,
    classAsString: "DataTable",
    cssClass: "js-data-table"
  });
})();

(function() {
  "use strict";

  var DatePicker = function DatePicker(element) {
    this.element_ = element;
    this.init();
  };
  window["DatePicker"] = DatePicker;

  DatePicker.prototype.Constant_ = {
    DAYS: ["日", "一", "二", "三", "四", "五", "六"],
    MONTHS: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    MIN_YEAR: 2000
  };

  DatePicker.prototype.CssClasses_ = {
    HEADER_CONTAINER: "date-picker__header",
    MONTH_CONTAINER: "date-picker__calendar--month",
    YEAR_CONTAINER: "date-picker__calendar--year",
    YEAR_ITEMS: "year-items",
    IS_SELECTED: "is-selected",
  };

  DatePicker.prototype.formatDate_ = function(date) {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  };

  DatePicker.prototype.getDate_ = function(date, type) {
    var d = new Date();

    if (date) {
      if (typeof date === "string") {
        return new Date(date);
      }

      if (type === "next") {
        return d.setDate(date.getDate() + 1);
      }

      if (type === "prev") {
        return d.setDate(date.getDate() - 1);
      }
    }

    return new Date();
  };

  DatePicker.prototype.getDaysHtml_ = function(date) {
    var total = this.getDaysCount_(date);
    var first = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    var last = new Date(date.getFullYear(), date.getMonth(), total).getDay();
    var maxRow =
      Math.ceil((total + first) / 7) < 6 ? 6 : Math.ceil((total + first) / 7);
    var html = [];

    html.push(
      `<div class="month-row">${date.getFullYear()}-${
        this.Constant_.MONTHS[date.getMonth()]
      }</div>`
    );
    html.push(`<div class="month-row">`);

    for (var i = 0; i < this.Constant_.DAYS.length; i++) {
      html.push(
        `<div class="month-col"><span>${this.Constant_.DAYS[i]}</span></div>`
      );
    }

    html.push(`</div>`);

    for (var i = 0; i < maxRow; i++) {
      html.push(`<div class="month-row">`);
      for (var j = i * 7 - first; j < i * 7 + 7 - first; j++) {
        if (!(j > total - 1)) {
          if (j < 0) {
            html.push(`<div class="month-col"></div>`);
          } else {
            var temp = new Date(date).setDate(j + 1);

            html.push(
              `<div class="month-col" date="${date.getFullYear()}-${
                this.Constant_.MONTHS[date.getMonth()]
              }-${j + 1}"><span class="${
                this.formatDate_(new Date(temp)).join("") ==
                this.formatDate_(this.curDate_).join("")
                  ? this.CssClasses_.IS_SELECTED
                  : ""
              }">${j + 1}</span></div>`
            );
          }
        } else {
          html.push(`<div class="month-col"></div>`);
        }
      }
      html.push(`</div>`);
    }

    return html.join("");
  };

  DatePicker.prototype.getDaysCount_ = function(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  DatePicker.prototype.render_ = function(date) {
    var prevDate = new Date(date).setMonth(date.getMonth() - 1);
    var nextDate = new Date(date).setMonth(date.getMonth() + 1);

    this.monthContainer.innerHTML = this.getDaysHtml_(date);
    this.prevBtn_.setAttribute(
      "prev",
      this.formatDate_(new Date(prevDate)).join("-")
    );
    this.nextBtn_.setAttribute(
      "next",
      this.formatDate_(new Date(nextDate)).join("-")
    );
  };

  DatePicker.prototype.renderHeader_ = function(date) {
    var yy = date.getFullYear();
    var mm = date.getMonth();
    var dd = date.getDate();
    var day = date.getDay();
    var html = `
      <div class="date-picker__header__text__secondary">${yy}</div>
      <div class="date-picker__header__text ${this.CssClasses_.IS_SELECTED}">
        <span>周${this.Constant_.DAYS[day]}，</span>
        <span>${this.Constant_.MONTHS[mm]}-${dd}</span>
      </div>
    `;

    this.element_.querySelector(
      "." + this.CssClasses_.HEADER_CONTAINER
    ).innerHTML = html;

    var showYearBtn = this.element_.querySelector(
      ".date-picker__header__text__secondary"
    );
    var showMonthBtn = this.element_.querySelector(
      ".date-picker__header__text"
    );

    showYearBtn.addEventListener("click", () => {
      if (!showYearBtn.classList.contains(this.CssClasses_.IS_SELECTED)) {
        showYearBtn.classList.add(this.CssClasses_.IS_SELECTED);
        showMonthBtn.classList.remove(this.CssClasses_.IS_SELECTED);

        this.yearContainer.parentElement.style.display = "";
        this.monthContainer.parentElement.style.display = "none";

        this.yearContainer.scrollTop =
          this.yearContainer.querySelector("." + this.CssClasses_.IS_SELECTED)
            .offsetTop - 88;
      }
    });

    showMonthBtn.addEventListener("click", () => {
      if (!showMonthBtn.classList.contains(this.CssClasses_.IS_SELECTED)) {
        showMonthBtn.classList.add(this.CssClasses_.IS_SELECTED);
        showYearBtn.classList.remove(this.CssClasses_.IS_SELECTED);

        this.monthContainer.parentElement.style.display = "";
        this.yearContainer.parentElement.style.display = "none";
      }
    });
  };

  DatePicker.prototype.renderYear_ = function(date) {
    var max = date.getFullYear() + 10;
    var html = [];

    for (var i = this.Constant_.MIN_YEAR; i < max; i++) {
      html.push(
        `<div class="year-items ${
          date.getFullYear() === i ? "is-selected" : ""
        }">${i}</div>`
      );
    }

    this.yearContainer.innerHTML = html.join("");
    var items = this.yearContainer.querySelectorAll(
      "." + this.CssClasses_.YEAR_ITEMS
    );

    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener("click", this.changeYear_.bind(this));
    }
  };

  DatePicker.prototype.changeYear_ = function(evt) {
    if (!evt.target.classList.contains(this.CssClasses_.IS_SELECTED)) {
      var temp = this.formatDate_(this.curDate_);

      evt.target.classList.add(this.CssClasses_.IS_SELECTED);
      Array.prototype.filter.call(evt.target.parentNode.children, child => {
        if (child !== evt.target) {
          return child.classList.remove(this.CssClasses_.IS_SELECTED);
        }
      });

      temp[0] = evt.target.textContent;
      this.curDate_ = this.getDate_(temp.join("-"));
      this.render_(this.curDate_);
      this.renderHeader_(this.curDate_);

      this.monthContainer.parentElement.style.display = "";
      this.yearContainer.parentElement.style.display = "none";
    }
  };

  DatePicker.prototype.changeDate_ = function(elem) {
    this.curDate_ = this.getDate_(elem.getAttribute("date"));
    this.render_(this.curDate_);
    this.renderHeader_(this.curDate_);
    this.renderYear_(this.curDate_);
  };

  DatePicker.prototype.dateForClick_ = function(evt) {
    var items = this.element_.querySelectorAll("[date]");

    for (var i = 0; i < items.length; i++) {
      var el = evt.target;

      while (el && el !== this.element_) {
        if (el === items[i]) {
          this.changeDate_(items[i]);
        }

        el = el.parentNode;
      }
    }
  };

  DatePicker.prototype.prevForClick_ = function(evt) {
    var elem = evt.target;

    if (evt.target.tagName === "I") {
      elem = evt.target.parentElement;
    }

    this.render_(new Date(elem.getAttribute("prev")));
  };

  DatePicker.prototype.nextForClick_ = function(evt) {
    var elem = evt.target;

    if (evt.target.tagName === "I") {
      elem = evt.target.parentElement;
    }

    this.render_(new Date(elem.getAttribute("next")));
  };

  DatePicker.prototype.setDate = function() {};
  DatePicker.prototype["setDate"] = DatePicker.prototype.setDate;

  DatePicker.prototype.getDate = function() {
    return this.formatDate_(this.curDate_).join("-");
  };
  DatePicker.prototype["getDate"] = DatePicker.prototype.getDate;

  DatePicker.prototype.init = function() {
    var forElId =
        this.element_.getAttribute("for") ||
        this.element_.getAttribute("data-for");
    var forEl = null;

    if (forElId) {
      forEl = document.getElementById(forElId);
      if (forEl) {
        this.forElement_ = forEl;
      }
    }

    this.header_ = this.element_.querySelector(
      this.CssClasses_.HEADER_CONTAINER
    );
    this.monthContainer = this.element_.querySelector(
      "." + this.CssClasses_.MONTH_CONTAINER
    );
    this.yearContainer = this.element_.querySelector(
      "." + this.CssClasses_.YEAR_CONTAINER
    );

    this.nextBtn_ = this.element_.querySelector("[next]");
    this.prevBtn_ = this.element_.querySelector("[prev]");

    this.today_ = this.getDate_();
    this.curDate_ = this.forElement_.querySelector("input").value
      ? this.getDate_(this.forElement_.querySelector("input").value)
      : this.today_;

    this.render_(this.curDate_);
    this.renderHeader_(this.curDate_);
    this.renderYear_(this.curDate_);

    this.element_.addEventListener("click", this.dateForClick_.bind(this));
    this.prevBtn_.addEventListener("click", this.prevForClick_.bind(this));
    this.nextBtn_.addEventListener("click", this.nextForClick_.bind(this));
  };

  componentHandler.register({
    constructor: DatePicker,
    classAsString: "DatePicker",
    cssClass: "js-date-picker",
    widget: true
  });
})();

(function() {
  "use strict";

  var Drawer = function Drawer(element) {
    this.element_ = element;
    this.init();
  };

  window["Drawer"] = Drawer;

  Drawer.prototype.CssClasses_ = {
    IS_VISIBLE: "drawer--open",
    IS_ANIMATING: "drawer--animating"
  };

  Drawer.prototype.init = function() {
    if (this.element_) {
      var forElId =
        this.element_.getAttribute("for") ||
        this.element_.getAttribute("data-for");
      var forEl = null;

      if (forElId) {
        forEl = document.getElementById(forElId);
        if (forEl) {
          this.forElement_ = forEl;
          forEl.addEventListener("click", this.handleForClick_.bind(this));
        }
      }
    }
  };

  Drawer.prototype.handleForClick_ = function(evt) {
    this.toggle(evt);
  };

  Drawer.prototype.removeAnimationEndListener_ = function(evt) {
    console.log('removeAnimationEndListener_')
    evt.target.parentNode.classList.remove(
      Drawer.prototype.CssClasses_.IS_ANIMATING
    );
  };

  Drawer.prototype.addAnimationEndListener_ = function() {
    this.element_.addEventListener(
      "transitionend",
      this.removeAnimationEndListener_
    );
    this.element_.addEventListener(
      "webkitTransitionEnd",
      this.removeAnimationEndListener_
    );
  };

  Drawer.prototype.show = function(evt) {
    if (this.element_) {
      window.requestAnimationFrame(
        function() {
          this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
          this.element_.classList.add(this.CssClasses_.IS_VISIBLE);
        }.bind(this)
      );

      this.addAnimationEndListener_();
    }
  };

  Drawer.prototype.hide = function(evt) {
    if (this.element_) {
      this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
      this.element_.classList.remove(this.CssClasses_.IS_VISIBLE);

      this.addAnimationEndListener_();
    }
  };

  Drawer.prototype.toggle = function(evt) {
    if (this.element_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
      this.hide();
    } else {
      this.show(evt);
    }
  };

  Drawer.prototype["toggle"] = Drawer.prototype.toggle;

  componentHandler.register({
    constructor: Drawer,
    classAsString: 'Drawer',
    cssClass: 'js-drawer',
    widget: true
  });
})();

(function() {
  "use strict";

  var Dialog = function Dialog(element) {
    this.element_ = element;
    this.isOpen_ = false;
    this.init();
  };

  window["Dialog"] = Dialog;

  Dialog.prototype.CssClasses_ = {
    IS_VISIBLE: "dialog--open",
    IS_ANIMATING: "dialog--animating",
    BACKDROP: "dialog__backdrop",
    ACCEPT_BTN: "dialog__footer__button--accept",
    CANCEL_BTN: "dialog__footer__button--cancel"
  };

  Dialog.prototype.init = function() {
    var forElId =
      this.element_.getAttribute("for") ||
      this.element_.getAttribute("data-for");
    var forEl = null;

    if (forElId) {
      forEl = document.getElementById(forElId);
      if (forEl) {
        this.forElement_ = forEl;
        forEl.addEventListener("click", this.handleForClick_.bind(this));
      }
    }

    this.acceptBtn = this.element_.querySelector(
      "." + this.CssClasses_.ACCEPT_BTN
    );
    this.cancelBtn = this.element_.querySelector(
      "." + this.CssClasses_.CANCEL_BTN
    );

    var backdrop = this.element_.querySelector("." + this.CssClasses_.BACKDROP);

    backdrop.addEventListener("click", this.handleForClick_.bind(this));
  };

  Dialog.prototype.handleForClick_ = function(evt) {
    if (this.element_ && this.forElement_) {
      if (this.isOpen_) {
        this.hide();
      } else {
        this.show(evt);
      }
    }
  };

  Dialog.prototype.removeAnimationEndListener_ = function(evt) {
    if (this.classList.contains(Dialog.prototype.CssClasses_.IS_ANIMATING)) {
      this.classList.remove(Dialog.prototype.CssClasses_.IS_ANIMATING);
    }
  };

  Dialog.prototype.addAnimationEndListener_ = function() {
    this.element_.addEventListener(
      "transitionend",
      this.removeAnimationEndListener_
    );
    this.element_.addEventListener(
      "webkitTransitionEnd",
      this.removeAnimationEndListener_
    );
  };

  Dialog.prototype.show = function(evt) {
    this.isOpen_ = true;

    window.requestAnimationFrame(
      function() {
        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
        this.element_.classList.add(this.CssClasses_.IS_VISIBLE);
      }.bind(this)
    );

    this.addAnimationEndListener_();
  };

  Dialog.prototype.hide = function(evt) {
    this.isOpen_ = false;

    window.requestAnimationFrame(
      function() {
        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
        this.element_.classList.remove(this.CssClasses_.IS_VISIBLE);
      }.bind(this)
    );

    this.addAnimationEndListener_();
  };

  componentHandler.register({
    constructor: Dialog,
    classAsString: "Dialog",
    cssClass: "js-dialog",
    widget: true
  });
})();

(function() {
  "use strict";

  var Groups = function Groups(element) {
    this.element_ = element;
    this.init();
  };

  window["Groups"] = Groups;

  Groups.prototype.CssClasses_ = {
    ITEM: "groups-item",
    ITEM_ARROW: "groups-arrow",
    ITEM_ARROW_UP: "groups--arrowup",

    IS_TABLE: "TABLE",
    IS_CHECKBOX: "checkbox",
    IS_SELECTED: "groups--selected",
    IS_VISIBLE: "groups--show"
  };

  Groups.prototype.init = function() {
    if (this.element_) {
      this.typo = this.element_.tagName;
      this.items = this.element_.querySelectorAll("." + this.CssClasses_.ITEM);
      this.boundItemClick_ = this.handleForClick_.bind(this);
      this.boundItemArrowClick_ = this.arrowForClick_.bind(this);

      for (var i = 0; i < this.items.length; i++) {
        var itemsArrow_ = this.items[i].querySelector(
          "." + this.CssClasses_.ITEM_ARROW
        );

        if (this.typo !== this.CssClasses_.IS_TABLE) {
          this.items[i].addEventListener("click", this.boundItemClick_);
        }

        if (itemsArrow_) {
          itemsArrow_.addEventListener("click", this.boundItemArrowClick_);
        }
      }
    }
  };

  Groups.prototype.handleForClick_ = function(evt) {
    // var isCheckbox = this.isCheckbox_(evt.target);

    // if (isCheckbox) {
    //   var checkboxs = this.element_.querySelectorAll(
    //     "." + this.CssClasses_.IS_CHECKBOX
    //   );

    //   if(checkboxs.length){
    //     for(var i =0; i<checkboxs.length; i++){
    //       if(checkboxs[i]["Checkbox"] !== this.getTargetCheckBox_(evt.target)){
    //         checkboxs[i]["Checkbox"].
    //       }
    //     }
    //   }
    // } else {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i] !== evt.target) {
          this.items[i].classList.remove(this.CssClasses_.IS_SELECTED);
        }
      }
    // }

    // if (isCheckbox) {
    //   console.log(this.getTargetCheckBox_(evt.target));
    // } else {
      evt.target.classList.add(this.CssClasses_.IS_SELECTED);
    // }
  };

  // Groups.prototype.isCheckbox_ = function(elem) {
  //   if (elem.tagName === "LI") {
  //     if (elem.querySelectorAll(".checkbox").length) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }

  //   if (elem.tagName === "INPUT" || elem.tagName === "SPAN") {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  // Groups.prototype.getTargetCheckBox_ = function(elem) {
  //   if (elem.tagName === "LI") {
  //     return elem.querySelector("." + this.CssClasses_.IS_CHECKBOX)["Checkbox"];
  //   } else {
  //     return elem.parentNode["Checkbox"];
  //   }
  // };

  Groups.prototype.arrowForClick_ = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var parentNode;

    if (this.typo === this.CssClasses_.IS_TABLE) {
      parentNode = evt.target.parentNode.parentNode.parentNode;
    } else {
      parentNode = evt.target.parentNode;
    }

    this.targetChildNode_ = this.getChildNode_(parentNode);

    if (parentNode.classList.contains(this.CssClasses_.ITEM_ARROW_UP)) {
      parentNode.classList.remove(this.CssClasses_.ITEM_ARROW_UP);
      this.hideChild_();
    } else {
      parentNode.classList.add(this.CssClasses_.ITEM_ARROW_UP);
      this.showChild_();
    }
  };

  Groups.prototype.hideChild_ = function() {
    Array.prototype.map.call(this.targetChildNode_.all, item => {
      return item.classList.remove(
        this.CssClasses_.IS_VISIBLE,
        this.CssClasses_.ITEM_ARROW_UP
      );
    });
  };

  Groups.prototype.showChild_ = function() {
    Array.prototype.map.call(this.targetChildNode_.children, item => {
      return item.classList.add(this.CssClasses_.IS_VISIBLE);
    });
  };

  Groups.prototype.getChildNode_ = function(target_) {
    var level = parseInt(target_.getAttribute("level"));
    var nextNode = this.getNextNode(target_);
    var all = [];
    var children = [];

    while (
      nextNode != null &&
      parseInt(nextNode.getAttribute("level")) !== level
    ) {
      all.push(nextNode);
      nextNode = this.getNextNode(nextNode);
    }

    children = Array.prototype.filter.call(all, function(item) {
      return parseInt(item.getAttribute("level")) === level + 1;
    });

    return { all, children };
  };

  Groups.prototype.getNextNode = function(node) {
    var next = node.nextElementSibling;

    if (next !== null && next.nodeType === 3) {
      return next.nextElementSibling;
    }
    return next;
  };

  componentHandler.register({
    constructor: Groups,
    classAsString: "Groups",
    cssClass: "js-groups",
    widget: true
  });
})();

(function() {
  "use strict";

  var Menu = function Menu(element) {
    this.element_ = element;
    this.init();
  };

  window["Menu"] = Menu;

  Menu.prototype.Constant_ = {
    TRANSITION_DURATION_SECONDS: 0.3,
    TRANSITION_DURATION_FRACTION: 0.8,
    CLOSE_TIMEOUT: 150
  };

  Menu.prototype.CssClasses_ = {
    CONTAINER: "menu__container",
    OUTLINE: "menu__outline",
    ITEM: "menu__item",
    ITEM_RIPPLE_CONTAINER: "menu__item-ripple-container",
    RIPPLE_EFFECT: "js-ripple-effect",
    RIPPLE_IGNORE_EVENTS: "js-ripple-effect--ignore-events",
    RIPPLE: "ripple",
    IS_UPGRADED: "is-upgraded",
    IS_VISIBLE: "is-visible",
    IS_ANIMATING: "is-animating",
    BOTTOM_LEFT: "menu--bottom-left",
    BOTTOM_RIGHT: "menu--bottom-right",
    TOP_LEFT: "menu--top-left",
    TOP_RIGHT: "menu--top-right",
    UNALIGNED: "menu--unaligned"
  };

  Menu.prototype.init = function() {
    if (this.element_) {
      var container = document.createElement("div");
      var outline = document.createElement("div");

      container.classList.add(this.CssClasses_.CONTAINER);
      this.element_.parentElement.insertBefore(container, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      container.appendChild(this.element_);
      this.container_ = container;

      outline.classList.add(this.CssClasses_.OUTLINE);
      this.outline_ = outline;
      container.insertBefore(outline, this.element_);

      var forElId =
        this.element_.getAttribute("for") ||
        this.element_.getAttribute("data-for");
      var forEl = null;

      if (forElId) {
        forEl = document.getElementById(forElId);
        if (forEl) {
          this.forElement_ = forEl;
          forEl.addEventListener("click", this.handleForClick_.bind(this));
        }
      }

      var items = this.element_.querySelectorAll("." + this.CssClasses_.ITEM);

      this.boundItemClick_ = this.handleItemClick_.bind(this);

      for (var i = 0; i < items.length; i++) {
        items[i].addEventListener("click", this.boundItemClick_);
        items[i].tabIndex = "-1";
      }

      if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
        this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);

        for (i = 0; i < items.length; i++) {
          var item = items[i];
          var rippleContainer = document.createElement("span");
          var ripple = document.createElement("span");

          rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);
          ripple.classList.add(this.CssClasses_.RIPPLE);
          rippleContainer.appendChild(ripple);
          item.appendChild(rippleContainer);
          item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
        }
      }

      if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
        this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
      }
      if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
        this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
      }
      if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
      }
      if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
      }
      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        this.outline_.classList.add(this.CssClasses_.UNALIGNED);
      }

      container.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  Menu.prototype.handleForClick_ = function(evt) {
    if (this.element_ && this.forElement_) {
      var rect = this.forElement_.getBoundingClientRect();
      var forRect = this.forElement_.parentElement.getBoundingClientRect();

      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
      } else if (
        this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)
      ) {
        this.container_.style.right = forRect.right - rect.right + "px";
        this.container_.style.top =
          this.forElement_.offsetTop + this.forElement_.offsetHeight + "px";
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        this.container_.style.left = this.forElement_.offsetLeft + "px";
        this.container_.style.bottom = forRect.bottom - rect.top + "px";
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        this.container_.style.right = forRect.right - rect.right + "px";
        this.container_.style.bottom = forRect.bottom - rect.top + "px";
      } else {
        this.container_.style.left = this.forElement_.offsetLeft + "px";
        this.container_.style.top =
          this.forElement_.offsetTop + this.forElement_.offsetHeight + "px";
      }
    }

    this.toggle(evt);
  };

  Menu.prototype.handleItemClick_ = function(evt) {
    this.closing_ = true;
    window.setTimeout(
      function(evt) {
        this.hide();
        this.closing_ = false;
      }.bind(this),
      this.Constant_.CLOSE_TIMEOUT
    );
  };

  Menu.prototype.applyClip_ = function(height, width) {
    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
      this.element_.style.clip = "";
    } else if (
      this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)
    ) {
      this.element_.style.clip =
        "rect(0 " + width + "px " + "0 " + width + "px)";
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
      this.element_.style.clip = "rect(" + height + "px 0 " + height + "px 0)";
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
      this.element_.style.clip =
        "rect(" +
        height +
        "px " +
        width +
        "px " +
        height +
        "px " +
        width +
        "px)";
    } else {
      this.element_.style.clip = "";
    }
  };

  Menu.prototype.removeAnimationEndListener_ = function(evt) {
    evt.target.classList.remove(Menu.prototype.CssClasses_.IS_ANIMATING);
  };

  Menu.prototype.addAnimationEndListener_ = function() {
    this.element_.addEventListener(
      "transitionend",
      this.removeAnimationEndListener_
    );
    this.element_.addEventListener(
      "webkitTransitionEnd",
      this.removeAnimationEndListener_
    );
  };

  Menu.prototype.show = function(evt) {
    if (this.element_ && this.container_ && this.outline_) {
      var height = this.element_.getBoundingClientRect().height;
      var width = this.element_.getBoundingClientRect().width;

      this.container_.style.width = width + "px";
      this.container_.style.height = height + "px";
      this.outline_.style.width = width + "px";
      this.outline_.style.height = height + "px";

      var transitionDuration =
        this.Constant_.TRANSITION_DURATION_SECONDS *
        this.Constant_.TRANSITION_DURATION_FRACTION;
      var items = this.element_.querySelectorAll("." + this.CssClasses_.ITEM);

      for (var i = 0; i < items.length; i++) {
        var itemDelay = null;

        if (
          this.element_.classList.contains(this.CssClasses_.TOP_LEFT) ||
          this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)
        ) {
          itemDelay =
            (height - items[i].offsetTop - items[i].offsetHeight) /
              height *
              transitionDuration +
            "s";
        } else {
          itemDelay = items[i].offsetTop / height * transitionDuration + "s";
        }

        items[i].style.transitionDelay = itemDelay;
      }

      this.applyClip_(height, width);

      window.requestAnimationFrame(
        function() {
          this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
          this.element_.style.clip =
            "rect(0 " + width + "px " + height + "px 0)";
          this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
        }.bind(this)
      );

      this.addAnimationEndListener_();

      var callback = function(e) {
        if (
          e !== evt &&
          !this.closing_ &&
          e.target.parentNode !== this.element_
        ) {
          document.removeEventListener("click", callback);
          this.hide();
        }
      }.bind(this);

      document.addEventListener("click", callback);
    }
  };

  Menu.prototype.hide = function(evt) {
    if (this.element_ && this.container_ && this.outline_) {
      var items = this.element_.querySelectorAll("." + this.CssClasses_.ITEM);

      for (var i = 0; i < items.length; i++) {
        items[i].style.removeProperty("transition-delay");
      }

      var rect = this.element_.getBoundingClientRect();
      var height = rect.height;
      var width = rect.width;

      this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
      this.applyClip_(height, width);
      this.container_.classList.remove(this.CssClasses_.IS_VISIBLE);
      this.addAnimationEndListener_();
    }
  };

  Menu.prototype.toggle = function(evt) {
    if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
      this.hide();
    } else {
      this.show(evt);
    }
  };

  Menu.prototype["toggle"] = Menu.prototype.toggle;
  
  componentHandler.register({
    constructor: Menu,
    classAsString: 'Menu',
    cssClass: 'js-menu',
    widget: true
  });
})();

(function() {
  "use strict";

  var Radio = function Radio(element) {
    this.element_ = element;
    this.init();
  };
  window["Radio"] = Radio;
  Radio.prototype.Constant_ = {
    TINY_TIMEOUT: 0.001
  };
  Radio.prototype.CssClasses_ = {
    IS_FOCUSED: "is-focused",
    IS_DISABLED: "is-disabled",
    IS_CHECKED: "is-checked",
    IS_UPGRADED: "is-upgraded",
    JS_RADIO: "js-radio",
    RADIO_BTN: "radio__button",
    RADIO_OUTER_CIRCLE: "radio__outer-circle",
    RADIO_INNER_CIRCLE: "radio__inner-circle",
    RIPPLE_EFFECT: "js-ripple-effect",
    RIPPLE_IGNORE_EVENTS: "js-ripple-effect--ignore-events",
    RIPPLE_CONTAINER: "radio__ripple-container",
    RIPPLE_CENTER: "ripple--center",
    RIPPLE: "ripple"
  };
  Radio.prototype.onChange_ = function(event) {
    var radios = document.getElementsByClassName(this.CssClasses_.JS_RADIO);

    for (var i = 0; i < radios.length; i++) {
      var button = radios[i].querySelector("." + this.CssClasses_.RADIO_BTN);

      if (
        button.getAttribute("name") === this.btnElement_.getAttribute("name")
      ) {
        if (typeof radios[i]["Radio"] !== "undefined") {
          radios[i]["Radio"].updateClasses_();
        }
      }
    }
  };
  Radio.prototype.onFocus_ = function(event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };
  Radio.prototype.onBlur_ = function(event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };
  Radio.prototype.onMouseup_ = function(event) {
    this.blur_();
  };
  Radio.prototype.updateClasses_ = function() {
    this.checkDisabled();
    this.checkToggleState();
  };
  Radio.prototype.blur_ = function() {
    window.setTimeout(
      function() {
        this.btnElement_.blur();
      }.bind(this),
      this.Constant_.TINY_TIMEOUT
    );
  };
  Radio.prototype.checkDisabled = function() {
    if (this.btnElement_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  Radio.prototype["checkDisabled"] = Radio.prototype.checkDisabled;

  Radio.prototype.checkToggleState = function() {
    if (this.btnElement_.checked) {
      this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
  };
  Radio.prototype["checkToggleState"] = Radio.prototype.checkToggleState;

  Radio.prototype.disable = function() {
    this.btnElement_.disabled = true;
    this.updateClasses_();
  };
  Radio.prototype["disable"] = Radio.prototype.disable;

  Radio.prototype.enable = function() {
    this.btnElement_.disabled = false;
    this.updateClasses_();
  };
  Radio.prototype["enable"] = Radio.prototype.enable;

  Radio.prototype.check = function() {
    this.btnElement_.checked = true;
    this.onChange_(null);
  };
  Radio.prototype["check"] = Radio.prototype.check;

  Radio.prototype.uncheck = function() {
    this.btnElement_.checked = false;
    this.onChange_(null);
  };
  Radio.prototype["uncheck"] = Radio.prototype.uncheck;

  Radio.prototype.init = function() {
    if (this.element_) {
      this.btnElement_ = this.element_.querySelector(
        "." + this.CssClasses_.RADIO_BTN
      );

      this.boundChangeHandler_ = this.onChange_.bind(this);
      this.boundFocusHandler_ = this.onChange_.bind(this);
      this.boundBlurHandler_ = this.onBlur_.bind(this);
      this.boundMouseUpHandler_ = this.onMouseup_.bind(this);

      var outerCircle = document.createElement("span");
      outerCircle.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);

      var innerCircle = document.createElement("span");
      innerCircle.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE);

      this.element_.appendChild(outerCircle);
      this.element_.appendChild(innerCircle);

      this.btnElement_.addEventListener("change", this.boundChangeHandler_);
      this.btnElement_.addEventListener("focus", this.boundFocusHandler_);
      this.btnElement_.addEventListener("blur", this.boundBlurHandler_);
      this.element_.addEventListener("mouseup", this.boundMouseUpHandler_);

      this.updateClasses_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  componentHandler.register({
    constructor: Radio,
    classAsString: "Radio",
    cssClass: "js-radio",
    widget: true
  });
})();

(function() {
  "use strict";

  var Textfield = function Textfield(element) {
    this.element_ = element;
    this.maxRows = this.Constant_.NO_MAX_ROWS;
    this.init();
  };

  window["Textfield"] = Textfield;

  Textfield.prototype.Constant_ = {
    NO_MAX_ROWS: -1,
    MAX_ROWS_ATTRIBUTE: "maxrows"
  };

  Textfield.prototype.CssClasses_ = {
    LABEL: "textfield__label",
    INPUT: "textfield__input",
    IS_DIRTY: "is-dirty",
    IS_FOCUSED: "is-focused",
    IS_DISABLED: "is-disabled",
    IS_INVALID: "is-invalid",
    IS_UPGRADED: "is-upgraded",
    HAS_PLACEHOLDER: "has-placeholder"
  };

  Textfield.prototype.onKeyDown_ = function(event) {
    var currentRowCount = event.target.value.split("\n").length;
    if (event.keyCode === 13) {
      if (currentRowCount >= this.maxRows) {
        event.preventDefault();
      }
    }
  };

  Textfield.prototype.onFocus_ = function(event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  Textfield.prototype.onBlur_ = function(event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  Textfield.prototype.onReset_ = function(event) {
    this.updateClasses_();
  };

  Textfield.prototype.updateClasses_ = function() {
    this.checkDisabled();
    this.checkValidity();
    this.checkDirty();
    this.checkFocus();
  };

  Textfield.prototype.checkDisabled = function() {
    if (this.input_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };

  Textfield.prototype["checkDisabled"] = Textfield.prototype.checkDisabled;

  Textfield.prototype.checkFocus = function() {
    if (Boolean(this.element_.querySelector(":focus"))) {
      this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    }
  };
  Textfield.prototype["checkFocus"] = Textfield.prototype.checkFocus;

  Textfield.prototype.checkValidity = function() {
    if (this.input_.validity) {
      if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
      } else {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
      }
    }
  };
  Textfield.prototype["checkValidity"] = Textfield.prototype.checkValidity;

  Textfield.prototype.checkDirty = function() {
    if (
      (this.input_.value && this.input_.value.length > 0) ||
      (this.input_.placeholder && this.input_.placeholder.trim() !== "")
    ) {
      this.element_.classList.add(this.CssClasses_.IS_DIRTY);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
    }
  };
  Textfield.prototype["checkDirty"] = Textfield.prototype.checkDirty;
  Textfield.prototype.disable = function() {
    this.input_.disabled = true;
    this.updateClasses_();
  };
  Textfield.prototype["disable"] = Textfield.prototype.disable;
  Textfield.prototype.enable = function() {
    this.input_.disabled = false;
    this.updateClasses_();
  };
  Textfield.prototype["enable"] = Textfield.prototype.enable;
  Textfield.prototype.change = function(value) {
    this.input_.value = value || "";
    this.updateClasses_();
  };
  Textfield.prototype["change"] = Textfield.prototype.change;

  Textfield.prototype.init = function() {
    if (this.element_) {
      this.label_ = this.element_.querySelector("." + this.CssClasses_.LABEL);
      this.input_ = this.element_.querySelector("." + this.CssClasses_.INPUT);

      if (this.input_) {
        if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
          this.maxRows = parseInt(
            this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE),
            10
          );
          if (isNaN(this.maxRows)) {
            this.maxRows = this.Constant_.NO_MAX_ROWS;
          }
        }

        if (this.input_.hasAttribute("placeholder")) {
          this.element_.classList.add(this.CssClasses_.HAS_PLACEHOLDER);
        }

        this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
        this.boundFocusHandler = this.onFocus_.bind(this);
        this.boundBlurHandler = this.onBlur_.bind(this);
        this.boundResetHandler = this.onReset_.bind(this);
        this.input_.addEventListener("input", this.boundUpdateClassesHandler);
        this.input_.addEventListener("focus", this.boundFocusHandler);
        this.input_.addEventListener("blur", this.boundBlurHandler);
        this.input_.addEventListener("reset", this.boundResetHandler);

        if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
          this.boundKeyDownHandler = this.onKeyDown_.bind(this);
          this.input_.addEventListener("keydown", this.boundKeyDownHandler);
        }
        var invalid = this.element_.classList.contains(
          this.CssClasses_.IS_INVALID
        );
        this.updateClasses_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
        if (invalid) {
          this.element_.classList.add(this.CssClasses_.IS_INVALID);
        }
        if (this.input_.hasAttribute("autofocus")) {
          this.element_.focus();
          this.checkFocus();
        }
      }
    }
  };

  componentHandler.register({
    constructor: Textfield,
    classAsString: "Textfield",
    cssClass: "js-textfield",
    widget: true
  });
})();

(function() {
  "use strict";

  var Switch = function Switch(element) {
    this.element_ = element;
    this.init();
  };
  window["Switch"] = Switch;

  Switch.prototype.Constant_ = {
    TINY_TIMEOUT: 0.001
  };

  Switch.prototype.CssClasses_ = {
    INPUT: "switch__input",
    TRACK: "switch__track",
    THUMB: "switch__thumb",
    FOCUS_HELPER: "switch__focus-helper",
    RIPPLE_EFFECT: "js-ripple-effect",
    RIPPLE_IGNORE_EVENTS: "js-ripple-effect--ignore-events",
    RIPPLE_CONTAINER: "switch__ripple-container",
    RIPPLE_CENTER: "ripple--center",
    RIPPLE: "ripple",
    IS_FOCUSED: "is-focused",
    IS_DISABLED: "is-disabled",
    IS_CHECKED: "is-checked"
  };

  Switch.prototype.onChange_ = function(event) {
    this.updateClasses_();
  };

  Switch.prototype.onFocus_ = function(event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  Switch.prototype.onBlur_ = function(event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  Switch.prototype.onMouseUp_ = function(event) {
    this.blur_();
  };

  Switch.prototype.updateClasses_ = function() {
    this.checkDisabled();
    this.checkToggleState();
  };

  Switch.prototype.blur_ = function() {
    window.setTimeout(
      function() {
        this.inputElement_.blur();
      }.bind(this),
      /** @type {number} */ (this.Constant_.TINY_TIMEOUT)
    );
  };

  Switch.prototype.checkDisabled = function() {
    if (this.inputElement_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  Switch.prototype["checkDisabled"] = Switch.prototype.checkDisabled;

  Switch.prototype.checkToggleState = function() {
    if (this.inputElement_.checked) {
      this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
  };
  Switch.prototype["checkToggleState"] = Switch.prototype.checkToggleState;

  Switch.prototype.disable = function() {
    this.inputElement_.disabled = true;
    this.updateClasses_();
  };
  Switch.prototype["disable"] = Switch.prototype.disable;

  Switch.prototype.enable = function() {
    this.inputElement_.disabled = false;
    this.updateClasses_();
  };
  Switch.prototype["enable"] = Switch.prototype.enable;

  Switch.prototype.on = function() {
    this.inputElement_.checked = true;
    this.updateClasses_();
  };
  Switch.prototype["on"] = Switch.prototype.on;

  Switch.prototype.off = function() {
    this.inputElement_.checked = false;
    this.updateClasses_();
  };
  Switch.prototype["off"] = Switch.prototype.off;

  Switch.prototype.init = function() {
    if (this.element_) {
      this.inputElement_ = this.element_.querySelector(
        "." + this.CssClasses_.INPUT
      );

      var track = document.createElement("div");
      track.classList.add(this.CssClasses_.TRACK);

      var thumb = document.createElement("div");
      thumb.classList.add(this.CssClasses_.THUMB);

      var focusHelper = document.createElement("span");
      focusHelper.classList.add(this.CssClasses_.FOCUS_HELPER);

      thumb.appendChild(focusHelper);

      this.element_.appendChild(track);
      this.element_.appendChild(thumb);

      this.boundMouseUpHandler = this.onMouseUp_.bind(this);
      this.boundChangeHandler = this.onChange_.bind(this);
      this.boundFocusHandler = this.onFocus_.bind(this);
      this.boundBlurHandler = this.onBlur_.bind(this);

      this.inputElement_.addEventListener("change", this.boundChangeHandler);
      this.inputElement_.addEventListener("focus", this.boundFocusHandler);
      this.inputElement_.addEventListener("blur", this.boundBlurHandler);
      this.element_.addEventListener("mouseup", this.boundMouseUpHandler);

      this.updateClasses_();
      this.element_.classList.add("is-upgraded");
    }
  };

  componentHandler.register({
    constructor: Switch,
    classAsString: "Switch",
    cssClass: "js-switch",
    widget: true
  });
})();
