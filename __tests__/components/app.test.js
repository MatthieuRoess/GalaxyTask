// __tests__/App-test.js
import React from "react";
import renderer from "react-test-renderer";
import App from "../../App"; // Assurez-vous de spécifier le bon chemin vers votre composant

describe("App", () => {
  afterEach(() => {
    // Supprimez la snapshot précédente après chaque test
    renderer.act(() => {
      renderer.create(<App />).toJSON();
    });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Ajoutez d'autres tests spécifiques au comportement de votre application si nécessaire
});
