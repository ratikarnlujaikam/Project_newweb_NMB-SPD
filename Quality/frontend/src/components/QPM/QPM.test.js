import React from "react";
import { shallow } from "enzyme";
import QPM from "./QPM";

describe("QPM", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<QPM />);
    expect(wrapper).toMatchSnapshot();
  });
});
