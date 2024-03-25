// __tests__/Fusee-test.js
import React from "react";
import renderer from "react-test-renderer";
import Fusee from "../../component/Fusee"; // Assurez-vous de spécifier le bon chemin

describe("Fusee", () => {
  afterEach(() => {
    // Supprimez la snapshot précédente après chaque test
    renderer.act(() => {
      renderer.create(<Fusee />).toJSON();
    });
  });

  it("renders correctly", () => {
    const tree = renderer.create(<Fusee />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("starts the animation", () => {
    const instance = renderer.create(<Fusee />).getInstance();
    const startAnimationSpy = jest.spyOn(instance, "startAnimation");

    // Simulez componentDidMount
    instance.componentDidMount();

    // Vérifiez si startAnimation a été appelé
    expect(startAnimationSpy).toHaveBeenCalled();
  });

  // Ajoutez d'autres tests spécifiques au comportement de l'animation si nécessaire
});
