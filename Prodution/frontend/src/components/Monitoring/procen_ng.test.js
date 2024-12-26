import React from "react";
import { shallow } from "enzyme";
import Procen_ng from "./procen_ng";

describe("Procen_ng", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Procen_ng />);
    expect(wrapper).toMatchSnapshot();
  });
});
