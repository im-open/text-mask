import "../../common/domSetup.js";

import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import packageJson from "../package.json";

const { default: MaskedInput, conformToMask } = isVerify()
  ? require(`../${packageJson.main}`)
  : require("../src/reactTextMask.js");

const emailMask = isVerify()
  ? require("../../addons/dist/emailMask.js").default
  : require("../../addons/src/emailMask.js").default;

describe("MaskedInput", () => {
  it("does not throw when instantiated", () => {
    expect(() =>
      render(
        <MaskedInput
          mask={[
            "(",
            /\d/,
            /\d/,
            /\d/,
            ")",
            " ",
            /\d/,
            /\d/,
            /\d/,
            "-",
            /\d/,
            /\d/,
            /\d/,
            /\d/,
          ]}
          guide={true}
        />
      )
    ).not.to.throw();
  });
  it("renders a single input element", () => {
    const maskedInput = render(
      <MaskedInput
        mask={[
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        guide={true}
      />
    );
    expect(() => screen.getByRole("textbox")).not.to.throw();
  });
  it("renders correctly with an undefined value", () => {
    const maskedInput = render(
      <MaskedInput
        mask={[
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        guide={true}
      />
    );
    const renderedDOMComponent = screen.getByRole("textbox");
    expect(renderedDOMComponent.value).to.equal("");
  });
  it("renders correctly with an initial value", () => {
    const maskedInput = render(
      <MaskedInput
        value="123"
        mask={[
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        guide={true}
      />
    );
    const renderedDOMComponent = screen.getByRole("textbox");
    expect(renderedDOMComponent.value).to.equal("(123) ___-____");
  });
  it("renders mask instead of empty string when showMask is true", () => {
    const maskedInput = render(
      <MaskedInput
        showMask={true}
        mask={[
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        guide={true}
      />
    );
    const renderedDOMComponent = screen.getByRole("textbox");
    expect(renderedDOMComponent.value).to.equal("(___) ___-____");
  });
  it("does not render mask instead of empty string when showMask is false", () => {
    const maskedInput = render(
      <MaskedInput
        showMask={false}
        mask={[
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        guide={true}
      />
    );
    const renderedDOMComponent = screen.getByRole("textbox");
    expect(renderedDOMComponent.value).to.equal("");
  });

  // Testing the internals of the component like this is not ideal, and not supported by the testing-library.
  // it("calls createTextMaskInputElement with the correct config", () => {
  //   const mask = [
  //     "(",
  //     /\d/,
  //     /\d/,
  //     /\d/,
  //     ")",
  //     " ",
  //     /\d/,
  //     /\d/,
  //     /\d/,
  //     "-",
  //     /\d/,
  //     /\d/,
  //     /\d/,
  //     /\d/,
  //   ];
  //   const guide = true;
  //   const placeholderChar = "*";
  //   const keepCharPositions = true;
  //   const maskedInput = render(
  //     <MaskedInput
  //       mask={mask}
  //       guide={guide}
  //       placeholderChar={placeholderChar}
  //       keepCharPositions={keepCharPositions}
  //     />
  //   );
  //   const renderedDOMComponent = screen.getByRole("textbox");
  //   // stub the createTextMaskInputElement method
  //   maskedInput.createTextMaskInputElement = (config) => {
  //     expect(typeof config).to.equal("object");
  //     expect(config.inputElement).to.equal(renderedDOMComponent);
  //     expect(config.mask).to.equal(mask);
  //     expect(config.guide).to.equal(guide);
  //     expect(config.placeholderChar).to.equal(placeholderChar);
  //     expect(config.keepCharPositions).to.equal(keepCharPositions);
  //     return {
  //       update() {},
  //     };
  //   };
  //   console.log("Here's the maskedInput:");
  //   console.log(maskedInput);
  //   maskedInput.initTextMask();
  // });

  // Testing the internals of the component like this is not ideal, and not supported by the testing-library.
  // it("sets textMaskInputElement and calls textMaskInputElement.update with the correct value", () => {
  //   const maskedInput = render(
  //     <MaskedInput
  //       value="123"
  //       mask={[
  //         "(",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         ")",
  //         " ",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         "-",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //       ]}
  //     />
  //   );
  //   // stub the createTextMaskInputElement method
  //   maskedInput.createTextMaskInputElement = () => {
  //     return {
  //       update(value) {
  //         expect(value).to.equal("123");
  //       },
  //     };
  //   };
  //   maskedInput.initTextMask();
  //   expect(typeof maskedInput.textMaskInputElement).to.equal("object");
  // });

  // Testing the internals of the component like this is not ideal, and not supported by the testing-library.
  // it("initializes textMaskInputElement property", () => {
  //   const maskedInput = render(
  //     <MaskedInput
  //       mask={[
  //         "(",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         ")",
  //         " ",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         "-",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //       ]}
  //       guide={true}
  //     />
  //   );
  //   expect(typeof maskedInput.textMaskInputElement).to.equal("object");
  //   expect(typeof maskedInput.textMaskInputElement.state).to.equal("object");
  //   expect(
  //     typeof maskedInput.textMaskInputElement.state.previousConformedValue
  //   ).to.equal("string");
  //   expect(typeof maskedInput.textMaskInputElement.update).to.equal("function");
  // });

  it("does not render masked characters", () => {
    const maskedInput = render(
      <MaskedInput
        mask={[
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        guide={false}
      />
    );
    const renderedDOMComponent = screen.getByRole("textbox");
    expect(renderedDOMComponent.value).to.equal("");
  });

  it("does not allow masked characters", () => {
    const user = userEvent.setup();
    const maskedInput = render(
      <MaskedInput
        mask={[
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        guide={true}
      />
    );
    const renderedDOMComponent = screen.getByRole("textbox");
    expect(renderedDOMComponent.value).to.equal("");
    user.type(renderedDOMComponent, "abc");
    expect(renderedDOMComponent.value).to.equal("");
  });
  it("can be disabled by setting the mask to false", () => {
    const maskedInput = render(<MaskedInput value="123abc" mask={false} />);
    const renderedDOMComponent = screen.getByRole("textbox");
    expect(renderedDOMComponent.value).to.equal("123abc");
  });

  // Testing the internals of the component like this is not ideal, and not supported by the testing-library.
  // it("can call textMaskInputElement.update to update the inputElement.value", () => {
  //   const maskedInput = render(
  //     <MaskedInput
  //       mask={[
  //         "(",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         ")",
  //         " ",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         "-",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //       ]}
  //     />
  //   );
  //   const renderedDOMComponent = screen.getByRole("textbox");
  //   expect(renderedDOMComponent.value).to.equal("");
  //   renderedDOMComponent.value = "12345";
  //   maskedInput.textMaskInputElement.update();
  //   expect(renderedDOMComponent.value).to.equal("(123) 45_-____");
  // });

  // Testing the internals of the component like this is not ideal, and not supported by the testing-library.
  // it("can pass value to textMaskInputElement.update method", () => {
  //   const maskedInput = render(
  //     <MaskedInput
  //       value="123"
  //       mask={[
  //         "(",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         ")",
  //         " ",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         "-",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //       ]}
  //     />
  //   );
  //   const renderedDOMComponent = screen.getByRole("textbox");
  //   expect(renderedDOMComponent.value).to.equal("(123) ___-____");
  //   maskedInput.textMaskInputElement.update("1234");
  //   expect(renderedDOMComponent.value).to.equal("(123) 4__-____");
  // });

  // Testing the internals of the component like this is not ideal, and not supported by the testing-library.
  // it("can pass textMaskConfig to textMaskInputElement.update method", () => {
  //   const maskedInput = render(<MaskedInput value="123" mask={false} />);
  //   const renderedDOMComponent = screen.getByRole("textbox");
  //   expect(renderedDOMComponent.value).to.equal("123");
  //   maskedInput.textMaskInputElement.update("1234", {
  //     inputElement: renderedDOMComponent,
  //     mask: [
  //       "(",
  //       /[1-9]/,
  //       /\d/,
  //       /\d/,
  //       ")",
  //       " ",
  //       /\d/,
  //       /\d/,
  //       /\d/,
  //       "-",
  //       /\d/,
  //       /\d/,
  //       /\d/,
  //       /\d/,
  //     ],
  //   });
  //   expect(renderedDOMComponent.value).to.equal("(123) 4__-____");
  // });
  it("accepts function as mask property", () => {
    const maskedInput = render(
      <MaskedInput
        value="1234"
        mask={(value) => {
          expect(value).to.equal("1234");
          return [
            "(",
            /[1-9]/,
            /\d/,
            /\d/,
            ")",
            " ",
            /\d/,
            /\d/,
            /\d/,
            "-",
            /\d/,
            /\d/,
            /\d/,
            /\d/,
          ];
        }}
      />
    );
    const renderedDOMComponent = screen.getByRole("textbox");
    expect(renderedDOMComponent.value).to.equal("(123) 4__-____");
  });
  it("accepts object as mask property", () => {
    const maskedInput = render(<MaskedInput value="abc" mask={emailMask} />);
    const renderedDOMComponent = screen.getByRole("textbox");
    expect(renderedDOMComponent.value).to.equal("abc@ .");
  });
  it("accepts pipe function", () => {
    const maskedInput = render(
      <MaskedInput
        value="1234"
        mask={[
          "(",
          /[1-9]/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        pipe={(value) => {
          expect(value).to.equal("(123) 4__-____");
          return "abc";
        }}
      />
    );
    const renderedDOMComponent = screen.getByRole("textbox");
    expect(renderedDOMComponent.value).to.equal("abc");
  });
  it("calls textMaskInputElement.update and props.onChange when a change event is received", () => {
    const onChangeSpy = sinon.spy((event) => {
      expect(event.target.value).to.equal("123");
    });
    const maskedInput = render(
      <MaskedInput
        value="123"
        onChange={onChangeSpy}
        mask={[
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        guide={true}
      />
    );
    const renderedDOMComponent = screen.getByRole("textbox");
    fireEvent.change(renderedDOMComponent, {
      target: { value: "123" },
    });
    expect(onChangeSpy.callCount).to.equal(1);
  });
  it("calls props.onBlur when a change event is received", () => {
    const onBlurSpy = sinon.spy((event) => {
      expect(event.target.value).to.equal("(123) ___-____");
    });
    const maskedInput = render(
      <MaskedInput
        value="123"
        onBlur={onBlurSpy}
        mask={[
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        guide={true}
      />
    );
    const renderedDOMComponent = screen.getByRole("textbox");
    fireEvent.blur(renderedDOMComponent);
    expect(onBlurSpy.callCount).to.equal(1);
  });
  // it("calls textMaskInputElement.update when an input event is received when props.onChange is not set", () => {
  //   const maskedInput = render(
  //     <MaskedInput
  //       value="123"
  //       mask={[
  //         "(",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         ")",
  //         " ",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         "-",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //       ]}
  //       guide={true}
  //     />
  //   );
  //   const renderedDOMComponent = screen.getByRole("textbox");
  //   maskedInput.textMaskInputElement.update = sinon.spy(() => {});
  //   fireEvent.change(renderedDOMComponent, {
  //     target: { value: "456" },
  //   });
  //   expect(maskedInput.textMaskInputElement.update.callCount).to.equal(1);
  // });
  // it("calls textMaskInputElement.update via onChange method", () => {
  //   const maskedInput = render(
  //     <MaskedInput
  //       value="123"
  //       mask={[
  //         "(",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         ")",
  //         " ",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         "-",
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //         /\d/,
  //       ]}
  //       guide={true}
  //     />
  //   );
  //   maskedInput.textMaskInputElement.update = sinon.spy(() => {});
  //   maskedInput.onChange();
  //   expect(maskedInput.textMaskInputElement.update.callCount).to.equal(1);
  // });
  // test fix for issues #230, #483, #778 etc.
  it("works correct in stateful Component", async () => {
    class StatefulComponent extends React.Component {
      constructor(...args) {
        super(...args);
        this.state = { value: "1234" };
        this.onChange = this.onChange.bind(this);
      }
      onChange(e) {
        this.setState({ value: e.target.value });
      }
      render() {
        return (
          <MaskedInput
            onChange={this.onChange}
            title="masked-input"
            value={this.state.value}
            mask={[
              "(",
              /\d/,
              /\d/,
              /\d/,
              ")",
              " ",
              /\d/,
              /\d/,
              /\d/,
              "-",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
            ]}
            guide={false}
          />
        );
      }
    }
    render(<StatefulComponent />);
    const renderedDOMInput = screen.getByRole("textbox", {
      name: "masked-input",
    });
    // Initial value "1234" from StatefulComponent is masked correct
    expect(renderedDOMInput.value).to.equal("(123) 4");
    // Simulate deleting last char "4" from input
    await userEvent.type(renderedDOMInput, "[Backspace]");
    // Now we expect to see value "(123" instead of "(123) "
    expect(renderedDOMInput.value).to.equal("(123");
  });
});
// Test for issue #806
describe("MaskedInput as controlled component", () => {
  class StatefulComponent extends React.Component {
    constructor(...args) {
      super(...args);
      this.state = {
        value: "",
        mask: [
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ],
        guide: false,
        placeholderChar: "_",
        showMask: false,
        pipe: undefined,
      };
      this.onChange = this.onChange.bind(this);
      this.onMaskArray = this.onMaskArray.bind(this);
      this.onMaskFunction = this.onMaskFunction.bind(this);
      this.onGuideOn = this.onGuideOn.bind(this);
      this.onPlaceholderChar = this.onPlaceholderChar.bind(this);
      this.onShowMaskOn = this.onShowMaskOn.bind(this);
      this.onPipeOn = this.onPipeOn.bind(this);
      this.onPipeOff = this.onPipeOff.bind(this);
      this.onPipeAnother = this.onPipeAnother.bind(this);
    }
    onChange(e) {
      this.setState({ value: e.target.value });
    }
    onMaskArray() {
      this.setState({
        mask: [
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
        ],
      });
    }
    onMaskFunction() {
      this.setState({
        mask: () => [
          /\d/,
          /\d/,
          /\d/,
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ],
      });
    }
    onGuideOn() {
      this.setState({ guide: true });
    }
    onPlaceholderChar() {
      this.setState({ placeholderChar: "*" });
    }
    onShowMaskOn() {
      this.setState({
        guide: undefined,
        showMask: true,
      });
    }
    onPipeOn() {
      this.setState({
        pipe: (conformedValue) => ({
          value: `Tel. ${conformedValue}`,
          indexesOfPipedChars: [0, 1, 2, 3, 4],
        }),
      });
    }
    onPipeOff() {
      this.setState({
        pipe: undefined,
      });
    }
    onPipeAnother() {
      this.setState({
        pipe: (conformedValue) => ({
          value: `Tel: ${conformedValue}`,
          indexesOfPipedChars: [0, 1, 2, 3, 4],
        }),
      });
    }
    render() {
      return (
        <div>
          <input
            onChange={this.onChange}
            value={this.state.value}
            className={"user-input"}
            title={"user-input"}
          />
          <MaskedInput
            value={this.state.value}
            mask={this.state.mask}
            guide={this.state.guide}
            placeholderChar={this.state.placeholderChar}
            showMask={this.state.showMask}
            pipe={this.state.pipe}
            className={"masked-input"}
            title={"masked-input"}
          />
          <button className="mask-array-button" onClick={this.onMaskArray}>
            Change mask array
          </button>
          <button
            className="mask-function-button"
            onClick={this.onMaskFunction}
          >
            Change mask function
          </button>
          <button className="guide-on-button" onClick={this.onGuideOn}>
            Guide On
          </button>
          <button
            className="placeholderChar-button"
            onClick={this.onPlaceholderChar}
          >
            Change placeholderChar
          </button>
          <button className="showMask-on-button" onClick={this.onShowMaskOn}>
            ShowMask On
          </button>
          <button className="pipe-on-button" onClick={this.onPipeOn}>
            Pipe On
          </button>
          <button className="pipe-off-button" onClick={this.onPipeOff}>
            Pipe Off
          </button>
          <button className="pipe-another-button" onClick={this.onPipeAnother}>
            Pipe Another
          </button>
        </div>
      );
    }
  }
  it("works if value prop was changed", async () => {
    render(<StatefulComponent />);
    // Find inputs
    const renderedDOMUserInput = await screen.findByRole("textbox", {
      name: "user-input",
    });
    const renderedDOMMaskedInput = await screen.findByRole("textbox", {
      name: "masked-input",
    });
    // Check value changing
    await userEvent.type(renderedDOMUserInput, "123");
    await waitFor(() =>
      expect(renderedDOMMaskedInput.value).to.equal("(123) ")
    );
    await userEvent.clear(renderedDOMUserInput);
    await userEvent.type(renderedDOMUserInput, "12345678901234567890");
    await waitFor(() =>
      expect(renderedDOMMaskedInput.value).to.equal("(123) 456-7890")
    );
    await userEvent.clear(renderedDOMUserInput);
    await waitFor(() => expect(renderedDOMMaskedInput.value).to.equal(""));
  });
  it("works if showMask prop was changed", async () => {
    const statefulComponent = render(<StatefulComponent />);
    // Find inputs
    const renderedDOMMaskedInput = await screen.findByRole("textbox", {
      name: "masked-input",
    });
    // Find buttons
    const renderedDOMButtonShowMaskOn = await screen.findByRole("button", {
      name: "ShowMask On",
    });
    // Check showMask changing
    fireEvent.click(renderedDOMButtonShowMaskOn);
    expect(renderedDOMMaskedInput.value).to.equal("(___) ___-____");
  });
  it("works if guide prop was changed", async () => {
    const statefulComponent = render(<StatefulComponent />);
    // Find inputs
    const renderedDOMUserInput = await screen.findByRole("textbox", {
      name: "user-input",
    });
    const renderedDOMMaskedInput = await screen.findByRole("textbox", {
      name: "masked-input",
    });
    // Find buttons
    const renderedDOMButtonGuideOn = await screen.findByRole("button", {
      name: "Guide On",
    });

    // Check guide on changing
    fireEvent.change(renderedDOMUserInput, {
      target: { value: "(123) " },
    });
    expect(renderedDOMMaskedInput.value).to.equal("(123) ");
    fireEvent.click(renderedDOMButtonGuideOn);
    expect(renderedDOMMaskedInput.value).to.equal("(123) ___-____");
  });
  it("works if placeholderChar prop was changed", async () => {
    const statefulComponent = render(<StatefulComponent />);
    // Find inputs
    const renderedDOMUserInput = await screen.findByRole("textbox", {
      name: "user-input",
    });
    const renderedDOMMaskedInput = await screen.findByRole("textbox", {
      name: "masked-input",
    });
    // Find buttons
    const renderedDOMButtonGuideOn = await screen.findByRole("button", {
      name: "Guide On",
    });
    const renderedDOMButtonPlaceholderChar = await screen.findByRole("button", {
      name: "Change placeholderChar",
    });

    // Check placeholderChar changing
    fireEvent.click(renderedDOMButtonGuideOn);
    fireEvent.change(renderedDOMUserInput, {
      target: { value: "(123) ___-____" },
    });
    expect(renderedDOMMaskedInput.value).to.equal("(123) ___-____");
    fireEvent.click(renderedDOMButtonPlaceholderChar);
    expect(renderedDOMMaskedInput.value).to.equal("(123) ***-****");
  });
  it("works if mask as array prop was changed", async () => {
    const statefulComponent = render(<StatefulComponent />);
    // Find inputs
    const renderedDOMUserInput = await screen.findByRole("textbox", {
      name: "user-input",
    });
    const renderedDOMMaskedInput = await screen.findByRole("textbox", {
      name: "masked-input",
    });
    // Find buttons
    const renderedDOMButtonMaskArray = await screen.findByText(
      "Change mask array"
    );

    // Check mask as array changing
    fireEvent.change(renderedDOMUserInput, {
      target: { value: "(123) 456-7890" },
    });
    expect(renderedDOMMaskedInput.value).to.equal("(123) 456-7890");
    fireEvent.click(renderedDOMButtonMaskArray);
    expect(renderedDOMMaskedInput.value).to.equal("(123) 456-78-90");
  });
  it("works if mask as function prop was changed", async () => {
    const statefulComponent = render(<StatefulComponent />);
    // Find inputs
    const renderedDOMUserInput = await screen.findByRole("textbox", {
      name: "user-input",
    });
    const renderedDOMMaskedInput = await screen.findByRole("textbox", {
      name: "masked-input",
    });
    // Find buttons
    const renderedDOMButtonMaskFunction = await screen.findByText(
      "Change mask function"
    );

    // Check mask as function changing
    fireEvent.change(renderedDOMUserInput, {
      target: { value: "(123) 456-7890" },
    });
    expect(renderedDOMMaskedInput.value).to.equal("(123) 456-7890");
    fireEvent.click(renderedDOMButtonMaskFunction);
    expect(renderedDOMMaskedInput.value).to.equal("123 456-7890");
  });
  it("works if pipe prop was changed", async () => {
    const statefulComponent = render(<StatefulComponent />);
    // Find inputs
    const renderedDOMUserInput = await screen.findByRole("textbox", {
      name: "user-input",
    });
    const renderedDOMMaskedInput = await screen.findByRole("textbox", {
      name: "masked-input",
    });
    // Find buttons
    const renderedDOMButtonPipeOn = await screen.findByRole("button", {
      name: "Pipe On",
    });
    const renderedDOMButtonPipeOff = await screen.findByRole("button", {
      name: "Pipe Off",
    });
    const renderedDOMButtonPipeAnother = await screen.findByRole("button", {
      name: "Pipe Another",
    });

    // Check pipe changing
    // `pipe` undefined to function
    fireEvent.change(renderedDOMUserInput, {
      target: { value: "(123) 456-7890" },
    });
    expect(renderedDOMMaskedInput.value).to.equal("(123) 456-7890");
    fireEvent.click(renderedDOMButtonPipeOn);
    expect(renderedDOMMaskedInput.value).to.equal("Tel. (123) 456-7890");
    // `pipe` function to another function
    fireEvent.change(renderedDOMUserInput, {
      target: { value: "Tel. (123) 456-7890" },
    });
    fireEvent.click(renderedDOMButtonPipeAnother);
    expect(renderedDOMMaskedInput.value).to.equal("Tel: (123) 456-7890");
    // `pipe` function to undefined
    fireEvent.change(renderedDOMUserInput, {
      target: { value: "Tel: (123) 456-7890" },
    });
    fireEvent.click(renderedDOMButtonPipeOff);
    expect(renderedDOMMaskedInput.value).to.equal("(123) 456-7890");
  });
});

describe("conformToMask", () => {
  it("is a function", () => {
    expect(typeof conformToMask).to.equal("function");
  });
});
