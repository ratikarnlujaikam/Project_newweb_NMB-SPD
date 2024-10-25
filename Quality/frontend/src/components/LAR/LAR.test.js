import React from "react";
import { shallow } from "enzyme";
import LAR from "./LAR";

describe("LAR", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<LAR />);
    expect(wrapper).toMatchSnapshot();
  });
});
