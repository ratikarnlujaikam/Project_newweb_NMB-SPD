import React from "react";
import { shallow } from "enzyme";
import MouthlyQA from "./monthlyQA";

describe("MouthlyQA", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<MouthlyQA />);
    expect(wrapper).toMatchSnapshot();
  });
});
