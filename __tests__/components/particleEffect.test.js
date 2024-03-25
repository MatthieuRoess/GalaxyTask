// __tests__/ParticleEffect-test.js
import React from "react";
import renderer from "react-test-renderer";
import ParticleEffect from "../../component/ParticleEffect"; // Make sure to specify the correct path

describe("ParticleEffect", () => {
  afterEach(() => {
    // Remove the previous snapshot after each test
    renderer.act(() => {
      renderer.create(<ParticleEffect />).toJSON();
    });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<ParticleEffect />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Add more specific tests for animation behavior if needed
});
