import React from "react";
import { shallow } from "enzyme";
import Dodata from "./dodata";

describe("Dodata", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Dodata />);
    expect(wrapper).toMatchSnapshot();
  });
});
