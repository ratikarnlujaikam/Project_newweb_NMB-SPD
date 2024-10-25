import React from "react";
import { shallow } from "enzyme";
import Rejection from "./Rejection";

describe("Rejection", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Rejection />);
    expect(wrapper).toMatchSnapshot();
  });
});
