import React from "react";
import { shallow } from "enzyme";
import Trace_Dynamic_Parallelism from "./trace_Dynamic_Parallelism";

describe("Trace_Dynamic_Parallelism", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Trace_Dynamic_Parallelism />);
    expect(wrapper).toMatchSnapshot();
  });
});
