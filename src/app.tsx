import { Node, registerConnector } from "components/Node";
import { Scene } from "components/Scene";

const TestNode = () => {
  registerConnector({ type: 'in' });
  registerConnector({ type: 'out' });
  registerConnector({ type: 'out' });
  registerConnector({ type: 'out' });
  registerConnector({ type: 'out' });

  return (
    <>
      <h1>Hi asdasd asd </h1>
      <h1>Hi asdasd asd </h1>
      <h1>Hi asdasd asd </h1>
      <h1>Hi asdasd asd </h1>
      <h1>Hi asdasd asd </h1>
    </>
  );
};

export const App = () => {
  return (
    <Scene>
      <Node title="Какая-то нода 1">
        <TestNode />
      </Node>
    </Scene>
  );
};