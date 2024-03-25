// __tests__/LevitatingAstronaut-test.js
import React from "react";
import renderer from "react-test-renderer";
import LevitatingAstronaut from "../../component/LevitatingAstronaut"; // Assurez-vous de spécifier le bon chemin

describe("LevitatingAstronaut", () => {
  afterEach(() => {
    // Supprimez la snapshot précédente après chaque test
    renderer.act(() => {
      renderer.create(<LevitatingAstronaut />).toJSON();
    });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<LevitatingAstronaut />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Ajoutez d'autres tests spécifiques au comportement de l'animation si nécessaire
});
