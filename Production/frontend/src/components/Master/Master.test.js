import React from "react";
import { shallow } from "enzyme";
import Master from "./Master";

describe("Master", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Master />);
    expect(wrapper).toMatchSnapshot();
  });
});
