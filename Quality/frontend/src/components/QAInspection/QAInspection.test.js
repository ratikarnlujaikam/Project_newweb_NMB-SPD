import React from "react";
import { shallow } from "enzyme";
import QAInspection from "./QAInspection";

describe("QAInspection", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<QAInspection />);
    expect(wrapper).toMatchSnapshot();
  });
});
