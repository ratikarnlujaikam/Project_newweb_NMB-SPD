import React from "react";
import { shallow } from "enzyme";
import LARInspection from "./LARInspection";

describe("LARInspection", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<LARInspection />);
    expect(wrapper).toMatchSnapshot();
  });
});
