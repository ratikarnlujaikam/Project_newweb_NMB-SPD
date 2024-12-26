import React from "react";
import { shallow } from "enzyme";
import Report1 from "./Report1";

describe("Report1", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Report1 />);
    expect(wrapper).toMatchSnapshot();
  });
});
